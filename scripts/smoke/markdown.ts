import { hasMarkup, parseLines, parseSpans } from '@/lib/rich';
import { check, done, section } from './harness';

const SAMPLE =
  '**Everything runs on your own hardware.** The Kapoors\u2019s OKF sits on a local server.\n\n' +
  '**Who can see what:**\n' +
  '\u2022 **Rohan Kapoor** \u2014 family, keeps biometrics private\n' +
  '\u2022 **Nana** \u2014 extended\n\n' +
  'A cloud model could be used, but only with consent.';

section('block parsing');
const paragraphs = parseLines(SAMPLE);
check('blank lines split paragraphs', paragraphs.length === 3, paragraphs.length);

const lines = paragraphs.flat();
const bullets = lines.filter((l) => l.bullet);
check('bullet lines are flagged', bullets.length === 2, bullets.map((b) => b.text));
check('bullet glyph is stripped', bullets.every((b) => !/[\u2022\u00B7]/.test(b.text)), bullets.map((b) => b.text));
check('blank lines are dropped', lines.every((l) => l.text.trim().length > 0));

section('inline parsing');
const spans = lines.flatMap((l) => parseSpans(l.text));
const rendered = spans.map((s) => s.text).join('');
check('no ** reaches the screen', !rendered.includes('**'), rendered);
check('no bullet glyph reaches the screen', !rendered.includes('\u2022'), rendered);

const strong = spans.filter((s) => s.strong).map((s) => s.text);
check('every bold run is found', strong.length === 4, strong);
check('markers are removed from bold runs', strong.every((s) => !s.includes('**')), strong);
check('bold text is preserved', strong[0] === 'Everything runs on your own hardware.' && strong[1] === 'Who can see what:', strong);
check('surrounding prose is preserved', rendered.startsWith('Everything runs on your own hardware. The Kapoors'), rendered.slice(0, 50));

section('span edge cases');
const edges: [string, string[]][] = [
  ['a **b** c', ['a ', 'b', ' c']],
  ['**lead** rest', ['lead', ' rest']],
  ['no bold', ['no bold']],
  ['x **y** z **w**', ['x ', 'y', ' z ', 'w']],
  ['a ** b', ['a ** b']],
  ['**', ['**']],
  ['', []],
];
for (const [input, want] of edges) {
  const got = parseSpans(input).map((s) => s.text);
  check(`spans(${JSON.stringify(input)})`, JSON.stringify(got) === JSON.stringify(want), got);
}

section('statelessness');
const first = parseSpans('**a** then **b**').map((s) => s.text);
const second = parseSpans('**a** then **b**').map((s) => s.text);
check('repeated calls agree', JSON.stringify(first) === JSON.stringify(second), second);
check('a global regex does not leak lastIndex', JSON.stringify(second) === JSON.stringify(['a', ' then ', 'b']), second);

section('markup detection');
check('detects assistant markup', hasMarkup(SAMPLE));
check('plain prose is not markup', !hasMarkup('Just a normal sentence.'));

done('markdown');
