import {PubSub} from '@gwcdata/node-server-engine';
import {stub} from 'sinon';
import {PubSubStub} from './PubSub.types';

/** Stub the PubSub service */
export function stubPubSub(): PubSubStub {
  const init = stub(PubSub, 'init').resolves();
  const shutdown = stub(PubSub, 'shutdown').resolves();
  const addPublisher = stub(PubSub, 'addPublisher').returns();
  const addSubscriber = stub(PubSub, 'addSubscriber').returns();
  const publish = stub(PubSub, 'publish').resolves();
  return {init, shutdown, addPublisher, addSubscriber, publish};
}
