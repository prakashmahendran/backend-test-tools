import { Application } from 'express';
import sinon from 'sinon';

/** What useTestServer needs from a node-server-engine Server */
export interface TestableServer {
  init(): Promise<void>;
  shutdown(): Promise<void>;
  getApp(): Application;
}

/** Options of useTestServer */
export interface TestServerOptions<S extends TestableServer> {
  /** Runs once after server.init(), before the first test (e.g. add models, run migrations, sync tables) */
  afterInit?: (server: S) => Promise<void> | void;
  /** Runs once before server.shutdown(), after the last test */
  beforeShutdown?: (server: S) => Promise<void> | void;
  /** Restore process.env before each test to what it was when useTestServer was called (default: true) */
  restoreEnv?: boolean;
  /** Call sinon.restore() after each test (default: true) */
  restoreSinon?: boolean;
}

/** The server under test, available once the `before` hook ran */
export interface TestServer<S extends TestableServer> {
  readonly server: S;
  readonly app: Application;
}

/**
 * Register the usual mocha hooks of a node-server-engine service test suite: create and init the server before
 * the tests, restore process.env before each test, undo sinon stubs after each test, shut the server down after
 * the tests. Call it in a root hook file (test/hooks.ts) for the whole run, or inside a describe() for one suite.
 *
 * ```ts
 * export const testServer = useTestServer(createServer, { afterInit: () => sequelize.sync() });
 * // in a test: request(testServer.app).get('/users')
 * ```
 */
export function useTestServer<S extends TestableServer>(
  createServer: () => S,
  options: TestServerOptions<S> = {}
): TestServer<S> {
  const savedEnv = { ...process.env };
  let server: S | undefined;
  let app: Application | undefined;

  before(async () => {
    server = createServer();
    app = server.getApp();
    await server.init();
    await options.afterInit?.(server);
  });

  beforeEach(() => {
    if (options.restoreEnv !== false) process.env = { ...savedEnv };
  });

  afterEach(() => {
    if (options.restoreSinon !== false) sinon.restore();
  });

  after(async () => {
    if (!server) return;
    await options.beforeShutdown?.(server);
    await server.shutdown();
  });

  const started = <T>(value: T | undefined): T => {
    if (value === undefined) throw new Error('The test server is not started yet (use it inside a test or hook)');
    return value;
  };
  return {
    get server() {
      return started(server);
    },
    get app() {
      return started(app);
    }
  };
}
