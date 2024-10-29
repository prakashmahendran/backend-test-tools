import {SinonStub} from 'sinon';

/** Stubbed properties of the PushNotification entity */
export interface PushNotificationStub {
  /** Stub of the init method */
  init: SinonStub;
  /** Stub of the sendPush method */
  sendPush: SinonStub;
}
