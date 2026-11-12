/** Response of an API call in a live test */
export interface ApiResponse {
  status: number;
  /** Parsed JSON body, or the raw text when it is not JSON */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  text: string;
  headers: Headers;
}

/** Options of one API call */
export interface ApiCallOptions {
  /** Bearer token sent in the Authorization header */
  token?: string;
  /** JSON body */
  body?: unknown;
  headers?: Record<string, string>;
}

export type ApiClient = (method: string, path: string, options?: ApiCallOptions) => Promise<ApiResponse>;

/**
 * A small HTTP client for live tests against a running service (fetch based, no app instance needed).
 *   const api = createApiClient(service.url);
 *   const res = await api('POST', '/auth/login', { body: { email } });
 */
export function createApiClient(baseUrl: string): ApiClient {
  return async (method, path, { token, body, headers = {} } = {}) => {
    const res = await fetch(baseUrl + path, {
      method,
      headers: {
        'content-type': 'application/json',
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...headers
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const text = await res.text();
    let parsed: unknown = text;
    try {
      parsed = JSON.parse(text);
    } catch {
      /* not JSON */
    }
    return { status: res.status, body: parsed, text, headers: res.headers };
  };
}
