import {SinonStub} from 'sinon';

/** Stubbed properties of the Pubsub entity */
export interface PubSubStub {
  /** Stub of the init method */
  init: SinonStub;
  /** Stub of the shutdown method */
  shutdown: SinonStub;
  /** Stub of the addPublisher method */
  addPublisher: SinonStub;
  /** Stub of the addSubscriber method */
  addSubscriber: SinonStub;
  /** Stub of the publish method */
  publish: SinonStub;
}
