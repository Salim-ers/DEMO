import type { VoiceLine } from "./schemas.js";
import { msToSrtTime, msToVttTime } from "./utils.js";

/** Split a caption line into <=2 readable rows (max ~42 chars each). */
function wrap(text: string, max = 42): string {
  const words = text.split(/\s+/);
  const rows: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      rows.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) rows.push(cur.trim());
  return rows.slice(0, 2).join("\n");
}

export function buildSRT(lines: VoiceLine[]): string {
  return lines
    .map((l, i) => {
      const idx = i + 1;
      const time = `${msToSrtTime(l.startMs)} --> ${msToSrtTime(l.endMs)}`;
      return `${idx}\n${time}\n${wrap(l.text)}\n`;
    })
    .join("\n");
}

export function buildVTT(lines: VoiceLine[]): string {
  const body = lines
    .map((l) => {
      const time = `${msToVttTime(l.startMs)} --> ${msToVttTime(l.endMs)}`;
      return `${time}\n${wrap(l.text)}\n`;
    })
    .join("\n");
  return `WEBVTT\n\n${body}`;
}
