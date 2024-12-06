import * as sendPush from 'node-server-engine/dist/utils/sendPush/sendPush';
import {SinonStub, stub} from 'sinon';

/** Stub the sendPush function */
export function stubSendPush(): SinonStub {
  return stub(sendPush, 'sendPush').resolves();
}
