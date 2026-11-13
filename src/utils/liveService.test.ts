import assert from 'assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createApiClient } from './apiClient';
import { eventually } from './eventually';
import { startLiveService } from './liveService';

const fixture = path.resolve(__dirname, '../../test/fixtures/service.js');
const start = (mode: string, port: number, extra: Record<string, unknown> = {}) =>
  startLiveService({
    cwd: os.tmpdir(),
    port,
    args: [fixture],
    timeoutMs: 10_000,
    env: { FIXTURE_MODE: mode, FIXTURE_MARK: path.join(os.tmpdir(), `btt-mark-${port}`) },
    ...extra
  });

describe('startLiveService', function () {
  this.timeout(20_000);

  it('resolves once the health path answers, and stop() waits for a graceful exit', async () => {
    const mark = path.join(os.tmpdir(), 'btt-mark-18761');
    fs.rmSync(mark, { force: true });
    const service = await start('graceful', 18761);
    assert.equal(service.url, 'http://127.0.0.1:18761');
    assert.match(service.logs(), /listening/);
    await service.stop();
    // The service's own shutdown ran to the end (it was not killed after 500 ms)
    assert.equal(fs.readFileSync(mark, 'utf8'), 'shut down');
    await service.stop(); // already stopped: no-op
    fs.rmSync(mark, { force: true });
  });

  it('kills a service that does not exit within stopTimeoutMs', async () => {
    const service = await start('stubborn', 18762, { stopTimeoutMs: 300 });
    const t0 = Date.now();
    await service.stop();
    assert.ok(Date.now() - t0 < 5000);
    await assert.rejects(fetch(service.url + '/heartbeat'));
  });

  it('rejects with the output when the service exits during start-up', async () => {
    await assert.rejects(start('crash', 18763), /exited with code 3[\s\S]*missing setting/);
  });

  it('rejects when the process cannot be started', async () => {
    await assert.rejects(start('graceful', 18766, { cwd: path.join(os.tmpdir(), 'btt-no-such-dir') }), /could not be started/);
  });

  it('rejects (and stops the service) when it does not become healthy in time', async () => {
    await assert.rejects(start('unhealthy', 18764, { timeoutMs: 1500 }), /did not become healthy[\s\S]*listening/);
    await assert.rejects(fetch('http://127.0.0.1:18764/heartbeat'));
  });
});

describe('createApiClient', function () {
  this.timeout(20_000);

  it('sends JSON with the bearer token and parses the response', async () => {
    const service = await start('graceful', 18765);
    try {
      const api = createApiClient(service.url);
      const res = await api('POST', '/things?x=1', { token: 'abc', body: { a: 1 }, headers: { 'x-extra': '1' } });
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { method: 'POST', url: '/things?x=1', auth: 'Bearer abc' });
      assert.equal(res.headers.get('content-type'), 'application/json');
      const text = await api('GET', '/heartbeat');
      assert.equal(text.body, 'ok');
      assert.equal(text.text, 'ok');
    } finally {
      await service.stop();
    }
  });
});

describe('eventually', () => {
  it('retries until the check passes and returns its result', async () => {
    let n = 0;
    const result = await eventually(
      async () => {
        n += 1;
        if (n < 3) throw new Error('not yet');
        return n;
      },
      1000,
      10
    );
    assert.equal(result, 3);
  });

  it('rethrows the last error when the time is up', async () => {
    await assert.rejects(
      eventually(
        async () => {
          throw new Error('never');
        },
        50,
        10
      ),
      /never/
    );
  });
});
