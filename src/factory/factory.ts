import {randomUUID} from 'crypto';
import {
  FactoryModel,
  FactoryBuildOptions,
  FactoryModelOverride,
  FactoryReturnType,
  ModelsMap,
} from './factory.types';
import {connectionFactoryWorker, organizationFactoryWorker, userFactoryWorker} from './workers';

const modelsMap: ModelsMap = {
  connection: connectionFactoryWorker,
  organization: organizationFactoryWorker,
  user: userFactoryWorker,
};

export const factory = {
  /**
   * Build an object according to a defined model
   */
  build: function <T extends FactoryModel>(
    name: T,
    attributes: FactoryModelOverride<T> = {},
    buildOptions: FactoryBuildOptions<T> = {},
  ): FactoryReturnType<T> {
    if (!Object.keys(modelsMap).includes(name)) throw new Error(`Factory: unknown model "${name}"`);
    const worker = modelsMap[name];
    const instance = worker(buildOptions);
    return {
      id: randomUUID(),
      ...instance,
      ...attributes,
    };
  },

  /**
   * Build multiple objects according to a defined model
   */
  buildMany: function <T extends FactoryModel>(
    name: T,
    count: number,
    attributes: FactoryModelOverride<T> = {},
    buildOptions: FactoryBuildOptions<T> = {},
  ): Array<FactoryReturnType<T>> {
    const instances: Array<FactoryReturnType<T>> = [];
    for (let i = 0; i < count; i++) {
      instances.push(this.build(name, attributes, buildOptions));
    }
    return instances;
  },
};
