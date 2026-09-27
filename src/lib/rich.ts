export type Line = { bullet: boolean; text: string };
export type Span = { text: string; strong: boolean };

const BOLD = /\*\*[^*]+\*\*/g;
const BULLET = /^\s*[•·]\s+/;

/**
 * The assistant writes a tiny Markdown subset: `**bold**` inline, `•` bullet
 * lines, and blank-line paragraph breaks. These turn that into plain data so
 * the UI never has to guess at the markup.
 */

/** Splits assistant text into paragraphs, then lines, flagging bullet lines. */
export function parseLines(text: string): Line[][] {
  return text
    .split(/\n{2,}/)
    .map((para) =>
      para
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => {
          const bullet = BULLET.test(line);
          return { bullet, text: bullet ? line.replace(BULLET, '') : line };
        })
    )
    .filter((lines) => lines.length > 0);
}

/**
 * Splits one line into spans. `**bold**` becomes a strong span with the markers
 * removed; anything unmatched is preserved verbatim so no text is ever lost.
 */
export function parseSpans(text: string): Span[] {
  const out: Span[] = [];
  const re = new RegExp(BOLD.source, 'g');
  let last = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), strong: false });
    out.push({ text: m[0].slice(2, -2), strong: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), strong: false });
  return out;
}

/** True when the text still carries markup the UI would have to strip. */
export function hasMarkup(text: string) {
  return /\*\*[^*]+\*\*|^[ \t]*[•·][ \t]/m.test(text);
}
