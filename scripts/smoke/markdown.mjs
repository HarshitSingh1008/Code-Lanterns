// src/lib/rich.ts
var BOLD = /\*\*[^*]+\*\*/g;
var BULLET = /^\s*[•·]\s+/;
function parseLines(text) {
  return text.split(/\n{2,}/).map(
    (para) => para.split("\n").filter((line) => line.trim().length > 0).map((line) => {
      const bullet = BULLET.test(line);
      return { bullet, text: bullet ? line.replace(BULLET, "") : line };
    })
  ).filter((lines2) => lines2.length > 0);
}
function parseSpans(text) {
  const out = [];
  const re = new RegExp(BOLD.source, "g");
  let last = 0;
  for (let m = re.exec(text); m !== null; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), strong: false });
    out.push({ text: m[0].slice(2, -2), strong: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), strong: false });
  return out;
}
function hasMarkup(text) {
  return /\*\*[^*]+\*\*|^[ \t]*[•·][ \t]/m.test(text);
}

// scripts/smoke/harness.ts
var failures = 0;
var checks = 0;
function check(name, ok, detail) {
  checks += 1;
  if (ok) {
    console.log(`  ok    ${name}`);
    return;
  }
  failures += 1;
  console.log(`  FAIL  ${name}`);
  if (detail !== void 0) console.log(`        got ${JSON.stringify(detail)}`);
}
function section(name) {
  console.log(`
${name}`);
}
function done(label) {
  if (failures > 0) {
    console.log(`
${label} FAILED: ${failures} of ${checks} checks`);
    process.exit(1);
  }
  console.log(`
${label} OK: ${checks} checks`);
}

// scripts/smoke/markdown.ts
var SAMPLE = "**Everything runs on your own hardware.** The Kapoors\u2019s OKF sits on a local server.\n\n**Who can see what:**\n\u2022 **Rohan Kapoor** \u2014 family, keeps biometrics private\n\u2022 **Nana** \u2014 extended\n\nA cloud model could be used, but only with consent.";
section("block parsing");
var paragraphs = parseLines(SAMPLE);
check("blank lines split paragraphs", paragraphs.length === 3, paragraphs.length);
var lines = paragraphs.flat();
var bullets = lines.filter((l) => l.bullet);
check("bullet lines are flagged", bullets.length === 2, bullets.map((b) => b.text));
check("bullet glyph is stripped", bullets.every((b) => !/[\u2022\u00B7]/.test(b.text)), bullets.map((b) => b.text));
check("blank lines are dropped", lines.every((l) => l.text.trim().length > 0));
section("inline parsing");
var spans = lines.flatMap((l) => parseSpans(l.text));
var rendered = spans.map((s) => s.text).join("");
check("no ** reaches the screen", !rendered.includes("**"), rendered);
check("no bullet glyph reaches the screen", !rendered.includes("\u2022"), rendered);
var strong = spans.filter((s) => s.strong).map((s) => s.text);
check("every bold run is found", strong.length === 4, strong);
check("markers are removed from bold runs", strong.every((s) => !s.includes("**")), strong);
check("bold text is preserved", strong[0] === "Everything runs on your own hardware." && strong[1] === "Who can see what:", strong);
check("surrounding prose is preserved", rendered.startsWith("Everything runs on your own hardware. The Kapoors"), rendered.slice(0, 50));
section("span edge cases");
var edges = [
  ["a **b** c", ["a ", "b", " c"]],
  ["**lead** rest", ["lead", " rest"]],
  ["no bold", ["no bold"]],
  ["x **y** z **w**", ["x ", "y", " z ", "w"]],
  ["a ** b", ["a ** b"]],
  ["**", ["**"]],
  ["", []]
];
for (const [input, want] of edges) {
  const got = parseSpans(input).map((s) => s.text);
  check(`spans(${JSON.stringify(input)})`, JSON.stringify(got) === JSON.stringify(want), got);
}
section("statelessness");
var first = parseSpans("**a** then **b**").map((s) => s.text);
var second = parseSpans("**a** then **b**").map((s) => s.text);
check("repeated calls agree", JSON.stringify(first) === JSON.stringify(second), second);
check("a global regex does not leak lastIndex", JSON.stringify(second) === JSON.stringify(["a", " then ", "b"]), second);
section("markup detection");
check("detects assistant markup", hasMarkup(SAMPLE));
check("plain prose is not markup", !hasMarkup("Just a normal sentence."));
done("markdown");
