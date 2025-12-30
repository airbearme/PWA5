export function log(event: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ts: new Date().toISOString(), ...event }));
}
