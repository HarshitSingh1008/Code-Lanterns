/** Shared assertion helpers for the headless smoke checks. */
let failures = 0;
let checks = 0;

export function check(name: string, ok: boolean, detail?: unknown) {
  checks += 1;
  if (ok) {
    console.log(`  ok    ${name}`);
    return;
  }
  failures += 1;
  console.log(`  FAIL  ${name}`);
  if (detail !== undefined) console.log(`        got ${JSON.stringify(detail)}`);
}

export function section(name: string) {
  console.log(`\n${name}`);
}

export function done(label: string) {
  if (failures > 0) {
    console.log(`\n${label} FAILED: ${failures} of ${checks} checks`);
    process.exit(1);
  }
  console.log(`\n${label} OK: ${checks} checks`);
}
