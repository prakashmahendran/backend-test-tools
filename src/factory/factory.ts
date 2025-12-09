import { randomUUID } from 'crypto';
import {
  FactoryModel,
  FactoryBuildOptions,
  FactoryModelOverride,
  FactoryReturnType,
  ModelsMap
} from './factory.types';
import { userFactoryWorker } from './workers';

/**
 * Registry of available factory models and their worker functions.
 * Add new models here to extend factory capabilities.
 */
const modelsMap: ModelsMap = {
  user: userFactoryWorker
};

/**
 * Factory for generating test data objects.
 * 
 * Provides a consistent interface for creating mock entities in tests.
 * Inspired by factory-girl pattern for predictable test data generation.
 * 
 * @example
 * ```typescript
 * // Generate a single user
 * const user = factory.build('user');
 * 
 * // Generate with custom attributes
 * const admin = factory.build('user', { role: 'admin' });
 * 
 * // Generate multiple users
 * const users = factory.buildMany('user', 5);
 * ```
 */
export const factory = {
  /**
   * Build a single object according to a defined model.
   * 
   * @template T - The model type to build
   * @param name - The name of the model to build (e.g., 'user')
   * @param attributes - Override specific attributes of the generated object
   * @param buildOptions - Options passed to the worker function for customization
   * 
   * @returns A new instance of the specified model with a generated UUID
   * 
   * @throws {Error} If the specified model name is not registered
   * 
   * @example
   * ```typescript
   * const user = factory.build('user', { email: 'test@example.com' });
   * ```
   */
  build: function <T extends FactoryModel>(
    name: T,
    attributes: FactoryModelOverride<T> = {},
    buildOptions: FactoryBuildOptions<T> = {}
  ): FactoryReturnType<T> {
    if (!Object.keys(modelsMap).includes(name)) throw new Error(`Factory: unknown model "${name}"`);
    const worker = modelsMap[name];
    const instance = worker(buildOptions);
    return {
      id: randomUUID(),
      ...instance,
      ...attributes
    };
  },

  /**
   * Build multiple objects according to a defined model.
   * 
   * @template T - The model type to build
   * @param name - The name of the model to build (e.g., 'user')
   * @param count - The number of instances to generate
   * @param attributes - Override specific attributes for all generated objects
   * @param buildOptions - Options passed to the worker function for customization
   * 
   * @returns An array of new instances of the specified model
   * 
   * @throws {Error} If the specified model name is not registered
   * 
   * @example
   * ```typescript
   * const users = factory.buildMany('user', 10);
   * const admins = factory.buildMany('user', 3, { role: 'admin' });
   * ```
   */
  buildMany: function <T extends FactoryModel>(
    name: T,
    count: number,
    attributes: FactoryModelOverride<T> = {},
    buildOptions: FactoryBuildOptions<T> = {}
  ): Array<FactoryReturnType<T>> {
    const instances: Array<FactoryReturnType<T>> = [];
    for (let i = 0; i < count; i++) {
      instances.push(this.build(name, attributes, buildOptions));
    }
    return instances;
  }
};
