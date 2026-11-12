/**
 * Retry an assertion until it passes or the time is up, for state a service settles in the background
 * (queues, workers, caches). Returns what the check returns; rethrows its last error on timeout.
 *   const day = await eventually(async () => { const r = await api('GET', '/today'); expect(r.body.total).to.equal(600); return r; });
 */
export async function eventually<T>(check: () => Promise<T>, timeoutMs = 10_000, intervalMs = 250): Promise<T> {
  const end = Date.now() + timeoutMs;
  let last: unknown;
  for (;;) {
    try {
      return await check();
    } catch (error) {
      last = error;
      if (Date.now() >= end) throw last;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }
}
