import type { Page } from "playwright";
import { pino } from "pino";

const log = pino({ name: "capture:login" });

export interface LoginCredentials {
  loginUrl?: string;
  email?: string;
  password?: string;
}

export interface LoginResult {
  status: "logged_in" | "manual_step_required" | "no_credentials" | "failed";
  reason?: string;
}

/**
 * Classic email/password login. We deliberately DO NOT solve CAPTCHA, bypass
 * anti-bot defenses, or complete 2FA. If any of those are detected, we stop and
 * return `manual_step_required` so a human can complete the step in headed mode.
 */
export async function loginWithCredentials(page: Page, creds: LoginCredentials): Promise<LoginResult> {
  if (!creds.email || !creds.password) {
    return { status: "no_credentials" };
  }

  try {
    if (creds.loginUrl) {
      await page.goto(creds.loginUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
    }
    await page.waitForTimeout(1_200); // let an SPA login form mount

    // Best-effort field discovery across common login form shapes.
    const emailField = page
      .locator('input[type="email"], input[name="email"], input[autocomplete="username"], input[name="username"]')
      .first();
    const passwordField = page
      .locator('input[type="password"], input[name="password"], input[autocomplete="current-password"]')
      .first();

    if ((await emailField.count()) === 0 || (await passwordField.count()) === 0) {
      return { status: "manual_step_required", reason: "Login form not found automatically" };
    }

    await emailField.fill(creds.email, { timeout: 10_000 });
    await passwordField.fill(creds.password, { timeout: 10_000 });

    const submit = page
      .locator('button[type="submit"], input[type="submit"], button:has-text("Se connecter"), button:has-text("Connexion"), button:has-text("Sign in"), button:has-text("Log in")')
      .first();
    if ((await submit.count()) > 0) await submit.click({ timeout: 10_000 });
    else await passwordField.press("Enter");

    // Success signal: the app leaves the login screen (URL changes off /login,
    // or the password field disappears). Wait for that rather than guessing.
    await page
      .waitForFunction(
        () => !/\/(login|signin|sign-in|connexion)\b/i.test(location.pathname) ||
          document.querySelectorAll('input[type="password"]').length === 0,
        { timeout: 18_000 },
      )
      .catch(() => {});
    await page.waitForLoadState("networkidle", { timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(800);

    // Only stop for a VISIBLE 2FA/CAPTCHA challenge — not background scripts that
    // merely reference cloudflare/recaptcha (those produce false "blocked" results).
    if (await detectProtection(page)) {
      return { status: "manual_step_required", reason: "2FA / CAPTCHA / bot-check detected" };
    }

    const onLogin = /\/(login|signin|sign-in|connexion)\b/i.test(new URL(page.url()).pathname);
    const hasPassword = (await passwordField.count()) > 0;
    if (!onLogin || !hasPassword) {
      return { status: "logged_in" };
    }
    return { status: "manual_step_required", reason: "Still on a login-like page" };
  } catch (err) {
    log.warn({ err: String(err) }, "login attempt errored");
    return { status: "failed", reason: String(err) };
  }
}

async function detectProtection(page: Page): Promise<boolean> {
  // Visible challenge text only (reading body innerText, not raw HTML/scripts).
  const text = (await page.locator("body").innerText().catch(() => "")).toLowerCase();
  const markers = [
    "verification code", "code de vérification", "two-factor", "two factor", "2fa",
    "one-time code", "are you a robot", "i'm not a robot", "vérifier que vous êtes humain",
    "enter the code we sent",
  ];
  if (markers.some((m) => text.includes(m))) return true;
  // A visible captcha widget/iframe.
  const captcha = await page
    .locator('iframe[src*="recaptcha"], iframe[src*="hcaptcha"], iframe[title*="captcha" i], .g-recaptcha, .h-captcha')
    .count()
    .catch(() => 0);
  return captcha > 0;
}
