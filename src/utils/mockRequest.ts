import { Request, Response, NextFunction } from 'express';

interface MockResponse extends Response {
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Creates a mock Express Request object for testing
 */
export function createMockRequest(overrides: Partial<Request> = {}): Request {
  const req: any = {
    body: {},
    query: {},
    params: {},
    headers: {},
    method: 'GET',
    url: '/',
    path: '/',
    get: function (name: string) {
      return req.headers[name.toLowerCase()];
    },
    ...overrides
  };

  return req as Request;
}

/**
 * Creates a mock Express Response object for testing
 */
export function createMockResponse(): MockResponse {
  const res: any = {};
  res.status = function (code: number) {
    res.statusCode = code;
    return res;
  };
  res.json = function (data: unknown) {
    res.body = data;
    return res;
  };
  res.send = function (data: unknown) {
    res.body = data;
    return res;
  };
  res.setHeader = function (name: string, value: string) {
    if (!res.headers) res.headers = {};
    res.headers[name] = value;
    return res;
  };
  res.end = function () {
    return res;
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
