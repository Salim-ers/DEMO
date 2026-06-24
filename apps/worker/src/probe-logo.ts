import { writeFileSync } from "node:fs";
import { createBrowserSession, screenshotLogo, extractThemeColor } from "@studio-one/capture";
const s = await createBrowserSession({ viewport: "desktop", headless: true });
try {
  await s.page.goto("https://www.horse-ledger.com/", { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await s.page.waitForTimeout(3500); // let splash/header settle
  const color = await extractThemeColor(s.page);
  const buf = await screenshotLogo(s.page);
  console.log("COLOR:", color, "| logo bytes:", buf?.byteLength ?? "none");
  if (buf) writeFileSync("C:/Users/Salim/Desktop/studio-one/scripts/probe-logo.png", buf);
} finally { await s.close().catch(() => {}); }
