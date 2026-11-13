import sinon, { SinonStub } from 'sinon';

/** A mock Sequelize model instance: the data plus stubbed instance methods */
export type MockModelInstance<T extends object> = T & {
  set: SinonStub;
  get: SinonStub;
  save: SinonStub;
  update: SinonStub;
  destroy: SinonStub;
  reload: SinonStub;
  toJSON: SinonStub;
};

/**
 * Create a mock Sequelize model instance holding `data`.
 * save/update/destroy/reload resolve (save and update resolve to the instance), get() and toJSON() return the
 * data, set() and update() change it.
 */
export function createMockModelInstance<T extends object>(data: T): MockModelInstance<T> {
  const instance = { ...data } as MockModelInstance<T>;
  const values = (): T => {
    const out = { ...instance } as Record<string, unknown>;
    for (const k of ['set', 'get', 'save', 'update', 'destroy', 'reload', 'toJSON']) delete out[k];
    return out as T;
  };
  const assign = (key: string | Partial<T>, value?: unknown): void => {
    if (typeof key === 'string') (instance as Record<string, unknown>)[key] = value;
    else Object.assign(instance, key);
  };
  instance.set = sinon.stub().callsFake(assign);
  instance.get = sinon
    .stub()
    .callsFake((key?: string | { plain?: boolean }) =>
      typeof key === 'string' ? (instance as Record<string, unknown>)[key] : values()
    );
  instance.save = sinon.stub().callsFake(async () => instance);
  instance.update = sinon.stub().callsFake(async (changes: Partial<T>) => {
    assign(changes);
    return instance;
  });
  instance.destroy = sinon.stub().resolves();
  instance.reload = sinon.stub().callsFake(async () => instance);
  instance.toJSON = sinon.stub().callsFake(values);
  return instance;
}

/** Results to resolve from the stubbed static methods of a model */
export interface ModelMethodResults<T> {
  findAll?: Array<T>;
  findOne?: T | null;
  findByPk?: T | null;
  findAndCountAll?: { rows: Array<T>; count: number };
  create?: T;
  bulkCreate?: Array<T>;
  update?: [number, Array<T>?];
  destroy?: number;
  count?: number;
}

/**
 * Stub static methods of a Sequelize model to resolve the given results. Only the methods listed are stubbed;
 * the stubs are returned (e.g. to check the query) and undone by sinon.restore().
 */
export function stubModelMethods<T>(
  Model: object,
  results: ModelMethodResults<T>
): Partial<Record<keyof ModelMethodResults<T>, SinonStub>> {
  const stubs: Partial<Record<keyof ModelMethodResults<T>, SinonStub>> = {};
  for (const [method, result] of Object.entries(results) as Array<[keyof ModelMethodResults<T>, unknown]>) {
    if (result === undefined) continue;
    stubs[method] = sinon.stub(Model as Record<string, () => unknown>, method).resolves(result);
  }
  return stubs;
}
