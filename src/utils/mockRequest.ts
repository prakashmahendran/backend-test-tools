import { Request, Response, NextFunction } from 'express';

interface MockResponse extends Response {
  body?: unknown;
  headers?: Record<string, string>;
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
 * Creates a mock Express Response object for testing
 */
export function createMockResponse(): MockResponse {
  const res: Partial<MockResponse> = {};
  res.status = function (code: number) {
    (res as MockResponse).statusCode = code;
    return res as MockResponse;
  };
  res.json = function (data: unknown) {
    (res as MockResponse).body = data;
    return res as MockResponse;
  };
  res.send = function (data: unknown) {
    (res as MockResponse).body = data;
    return res as MockResponse;
  };
  res.setHeader = function (name: string, value: string) {
    if (!(res as MockResponse).headers) (res as MockResponse).headers = {};
    (res as MockResponse).headers![name] = value;
    return res as MockResponse;
  };
  res.end = function () {
    return res as MockResponse;
  };
  return res as MockResponse;
}

/**
 * Creates a mock Express NextFunction for testing
 */
export function createMockNext(): NextFunction {
  const next = function (error?: unknown) {
    next.called = true;
    next.error = error;
  } as NextFunction & { called?: boolean; error?: unknown };
  next.called = false;
  return next;
}
