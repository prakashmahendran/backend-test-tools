import assert from 'assert/strict';
import sinon from 'sinon';
import { createMockModelInstance, stubModelMethods } from './mockModel';

describe('createMockModelInstance', () => {
  it('holds the data and returns it from toJSON() and get()', () => {
    const user = createMockModelInstance({ id: 1, name: 'Ann' });
    assert.equal(user.name, 'Ann');
    assert.deepEqual(user.toJSON(), { id: 1, name: 'Ann' });
    assert.deepEqual(user.get({ plain: true }), { id: 1, name: 'Ann' });
    assert.equal(user.get('id'), 1);
  });

  it('set() and update() change the data; save, update and reload resolve to the instance', async () => {
    const user = createMockModelInstance({ id: 1, name: 'Ann', role: 'user' });
    user.set('name', 'Bea');
    user.set({ role: 'admin' });
    assert.deepEqual(user.toJSON(), { id: 1, name: 'Bea', role: 'admin' });
    assert.equal(await user.update({ name: 'Cid' }), user);
    assert.equal(user.name, 'Cid');
    assert.equal(await user.save(), user);
    assert.equal(await user.reload(), user);
    await user.destroy();
    assert.ok(user.destroy.calledOnce);
    assert.ok(user.update.calledOnceWithExactly({ name: 'Cid' }));
  });
});

describe('stubModelMethods', () => {
  class Model {
    static async findAll(): Promise<Array<unknown>> {
      return ['real'];
    }
    static async findOne(): Promise<unknown> {
      return 'real';
    }
    static async count(): Promise<number> {
      return -1;
    }
  }

  afterEach(() => sinon.restore());

  it('stubs only the methods given, with the given results', async () => {
    const stubs = stubModelMethods(Model, { findAll: [{ id: 1 }], findOne: null });
    assert.deepEqual(await Model.findAll(), [{ id: 1 }]);
    assert.equal(await Model.findOne(), null);
    assert.equal(await Model.count(), -1);
    assert.ok(stubs.findAll?.calledOnce);
    assert.equal(stubs.count, undefined);
  });

  it('is undone by sinon.restore()', async () => {
    stubModelMethods(Model, { count: 5 });
    assert.equal(await Model.count(), 5);
    sinon.restore();
    assert.equal(await Model.count(), -1);
  });
});
