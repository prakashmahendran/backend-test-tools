import { Request, Response, NextFunction } from 'express';
import sinon, { SinonStub } from 'sinon';

/** A mock Express response: every method is a sinon stub, and what the handler sent is recorded */
export interface MockResponse extends Response {
  /** Last body passed to json() or send() */
  body?: unknown;
  /** Headers set with setHeader() or set() */
  headers?: Record<string, string>;
  status: Response['status'] & SinonStub;
  json: Response['json'] & SinonStub;
  send: Response['send'] & SinonStub;
  sendStatus: Response['sendStatus'] & SinonStub;
  setHeader: Response['setHeader'] & SinonStub;
  set: Response['set'] & SinonStub;
  end: Response['end'] & SinonStub;
}

/**
 * Creates a mock Express Request object for testing
 */
export function createMockRequest(overrides: Partial<Request> = {}): Request {
  const req: Partial<Request> = {
    body: {},
    query: {},
    params: {},
    headers: {},
    method: 'GET',
    url: '/',
    path: '/',
    get: ((name: string) => {
      const header = (req.headers as Record<string, string | string[]>)?.[name.toLowerCase()];
      return header;
    }) as Request['get'],
    ...overrides
  };

  return req as Request;
}

/**
 * Creates a mock Express Response object for testing.
 * Each method is a sinon stub (`expect(res.status).to.have.been.calledWith(404)`) that also records what was
 * sent: `res.statusCode` (200 until status() or sendStatus() is called), `res.body`, `res.headers`.
 */
export function createMockResponse(): MockResponse {
  const res = { statusCode: 200, headersSent: false } as MockResponse;
  const chain = <A extends Array<never>>(record: (...args: A) => void): SinonStub =>
    sinon.stub().callsFake((...args: A) => {
      record(...args);
      return res;
    });
  const setHeader = (name: string, value: string): void => {
    res.headers = { ...res.headers, [name]: value };
  };
  res.status = chain((code: number) => {
    res.statusCode = code;
  }) as MockResponse['status'];
  res.sendStatus = chain((code: number) => {
    res.statusCode = code;
    res.headersSent = true;
  }) as MockResponse['sendStatus'];
  res.json = chain((data: unknown) => {
    res.body = data;
    res.headersSent = true;
  }) as MockResponse['json'];
  res.send = chain((data: unknown) => {
    res.body = data;
    res.headersSent = true;
  }) as MockResponse['send'];
  res.setHeader = chain(setHeader) as MockResponse['setHeader'];
  res.set = chain((field: string | Record<string, string>, value?: string) => {
    if (typeof field === 'string') setHeader(field, value as string);
    else Object.entries(field).forEach(([k, v]) => setHeader(k, v));
  }) as MockResponse['set'];
  res.end = chain(() => {
    res.headersSent = true;
  }) as MockResponse['end'];
  return res;
}

/**
 * Creates a mock Express NextFunction for testing
 */
export function createMockNext(): NextFunction & { called: boolean; error?: unknown } {
  const next = function (error?: unknown) {
    next.called = true;
    next.error = error;
  } as NextFunction & { called: boolean; error?: unknown };
  next.called = false;
  return next;
}
