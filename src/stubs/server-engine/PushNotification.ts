import {PushNotification} from 'node-server-engine';
import {stub} from 'sinon';
import {PushNotificationStub} from './PushNotification.types';

/** Stub the PushNotification service */
export function stubPushNotification(): PushNotificationStub {
  const init = stub(PushNotification, 'init').resolves();
  const sendPush = stub(PushNotification, 'sendPush').resolves();

  return {init, sendPush};
}
