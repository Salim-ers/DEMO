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
      .locator('button[type="submit"], input[type="submit"], button:has-text("Sign in"), button:has-text("Log in")')
      .first();
    if ((await submit.count()) > 0) await submit.click({ timeout: 10_000 });
    else await passwordField.press("Enter");

    await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});

    // Detect protections we must not bypass.
    if (await detectProtection(page)) {
      return { status: "manual_step_required", reason: "2FA / CAPTCHA / bot-check detected" };
    }

    // Heuristic success: the password field is gone.
    if ((await passwordField.count()) === 0) {
      return { status: "logged_in" };
    }
    return { status: "manual_step_required", reason: "Still on a login-like page" };
  } catch (err) {
    log.warn({ err: String(err) }, "login attempt errored");
    return { status: "failed", reason: String(err) };
  }
}

async function detectProtection(page: Page): Promise<boolean> {
  const text = (await page.content()).toLowerCase();
  const markers = [
    "captcha", "recaptcha", "hcaptcha", "two-factor", "2fa", "verification code",
    "one-time code", "are you a robot", "cloudflare", "challenge-platform",
  ];
  return markers.some((m) => text.includes(m));
}
