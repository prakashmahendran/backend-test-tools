/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ConnectionModel,
  ConnectionBuildOptions,
  OrganizationModel,
  UserModel,
  UserBuildOptions,
} from './workers';

type FactoryTyping = {
  /** Mapping for the connection model */
  connection: {
    /** Options for the connection model */
    options: ConnectionBuildOptions;
    /** Return type for the connection model */
    return: ConnectionModel;
  };
  /** Mapping for the organization model */
  organization: {
    /** Options for the organization model */
    options: any;
    /** Return type for the organization model */
    return: OrganizationModel;
  };
  /** Mapping for the user model */
  user: {
    /** Options for the user model */
    options: UserBuildOptions;
    /** Return type for the user model */
    return: UserModel;
  };
};

export type FactoryModel = keyof FactoryTyping;

export type FactoryModelOverride<T extends FactoryModel> = Partial<FactoryTyping[T]['return']> & {
  /** Id of the model */
  id?: string;
};

export type FactoryBuildOptions<T extends FactoryModel> = FactoryTyping[T]['options'];

export type FactoryReturnType<T extends FactoryModel> = FactoryTyping[T]['return'] & {
  /** Id of the model */
  id: string;
};

export type ModelsMap = {
  [T in FactoryModel]: (buildOptions: FactoryTyping[T]['options']) => FactoryTyping[T]['return'];
};
