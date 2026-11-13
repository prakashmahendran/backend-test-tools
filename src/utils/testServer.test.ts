import assert from 'assert/strict';
import express, { Application } from 'express';
import sinon from 'sinon';
import { TestableServer, useTestServer } from './testServer';

class FakeServer implements TestableServer {
  static instances: Array<FakeServer> = [];
  readonly app: Application = express();
  calls: Array<string> = [];
  constructor() {
    FakeServer.instances.push(this);
  }
  getApp(): Application {
    return this.app;
  }
  async init(): Promise<void> {
    this.calls.push('init');
  }
  async shutdown(): Promise<void> {
    this.calls.push('shutdown');
  }
}

const target = { value: () => 'real' };

describe('useTestServer', () => {
  const order: Array<string> = [];

  describe('before its hooks ran', () => {
    const testServer = useTestServer(() => new FakeServer());
    const readEarly = (read: () => unknown): string => {
      try {
        read();
        return 'no error';
      } catch (e) {
        return (e as Error).message;
      }
    };
    const early = [readEarly(() => testServer.server), readEarly(() => testServer.app)];

    it('throws when the server is read before the before hook ran', () => {
      assert.match(early[0], /not started yet/);
      assert.match(early[1], /not started yet/);
    });
  });

  describe('in a suite', () => {
    const testServer = useTestServer(() => new FakeServer(), {
      afterInit: (server) => {
        order.push(`afterInit:${server.calls.join(',')}`);
      },
      beforeShutdown: (server) => {
        order.push(`beforeShutdown:${server.calls.join(',')}`);
      }
    });

    it('creates and inits the server, then runs afterInit', () => {
      assert.ok(testServer.server instanceof FakeServer);
      assert.equal(testServer.app, testServer.server.app);
      assert.deepEqual(order, ['afterInit:init']);
    });

    it('lets a test change process.env and stub with sinon', () => {
      process.env.USE_TEST_SERVER_PROBE = 'changed';
      sinon.stub(target, 'value').returns('stubbed');
      assert.equal(target.value(), 'stubbed');
    });

    it('restored process.env and the sinon stubs after the previous test', () => {
      assert.equal(process.env.USE_TEST_SERVER_PROBE, undefined);
      assert.equal(target.value(), 'real');
    });
  });

  describe('after the suite', () => {
    it('ran beforeShutdown, then shut the server down', () => {
      const server = FakeServer.instances.at(-1) as FakeServer;
      assert.deepEqual(order, ['afterInit:init', 'beforeShutdown:init']);
      assert.deepEqual(server.calls, ['init', 'shutdown']);
    });
  });

  describe('with restoreEnv and restoreSinon off', () => {
    useTestServer(() => new FakeServer(), { restoreEnv: false, restoreSinon: false });

    it('sets an env var and a stub', () => {
      process.env.USE_TEST_SERVER_KEEP = 'kept';
      sinon.stub(target, 'value').returns('kept');
    });

    it('keeps them', () => {
      assert.equal(process.env.USE_TEST_SERVER_KEEP, 'kept');
      assert.equal(target.value(), 'kept');
      sinon.restore();
      delete process.env.USE_TEST_SERVER_KEEP;
    });
  });
});
