import assert from 'assert/strict';
import { createMockNext, createMockRequest, createMockResponse } from './mockRequest';

describe('createMockRequest', () => {
  it('has empty body, query, params and headers by default', () => {
    const req = createMockRequest();
    assert.deepEqual([req.body, req.query, req.params, req.headers], [{}, {}, {}, {}]);
    assert.equal(req.method, 'GET');
    assert.equal(req.path, '/');
  });

  it('takes overrides and reads headers case-insensitively with get()', () => {
    const req = createMockRequest({ method: 'POST', headers: { 'x-request-id': 'r1' }, body: { a: 1 } });
    assert.equal(req.method, 'POST');
    assert.deepEqual(req.body, { a: 1 });
    assert.equal(req.get('X-Request-Id'), 'r1');
    assert.equal(req.get('missing'), undefined);
  });
});

describe('createMockResponse', () => {
  it('starts as 200 with nothing sent', () => {
    const res = createMockResponse();
    assert.equal(res.statusCode, 200);
    assert.equal(res.headersSent, false);
    assert.equal(res.body, undefined);
  });

  it('records status and json body, chains, and the methods are sinon stubs', () => {
    const res = createMockResponse();
    const out = res.status(404).json({ error: 'nope' });
    assert.equal(out, res);
    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, { error: 'nope' });
    assert.equal(res.headersSent, true);
    assert.ok(res.status.calledOnceWithExactly(404));
    assert.ok(res.json.calledOnce);
  });

  it('records send(), sendStatus() and end()', () => {
    const res = createMockResponse();
    res.send('text');
    assert.equal(res.body, 'text');
    const res2 = createMockResponse();
    res2.sendStatus(204);
    assert.equal(res2.statusCode, 204);
    assert.equal(res2.headersSent, true);
    const res3 = createMockResponse();
    res3.end();
    assert.equal(res3.headersSent, true);
    assert.ok(res3.end.calledOnce);
  });

  it('records headers from setHeader() and set()', () => {
    const res = createMockResponse();
    res.setHeader('ETag', '"1"');
    res.set('Cache-Control', 'no-store');
    res.set({ 'X-A': 'a', 'X-B': 'b' });
    assert.deepEqual(res.headers, { ETag: '"1"', 'Cache-Control': 'no-store', 'X-A': 'a', 'X-B': 'b' });
  });
});

describe('createMockNext', () => {
  it('records that it was called and with which error', () => {
    const next = createMockNext();
    assert.equal(next.called, false);
    next();
    assert.equal(next.called, true);
    assert.equal(next.error, undefined);
    const err = new Error('x');
    next(err);
    assert.equal(next.error, err);
  });
});
