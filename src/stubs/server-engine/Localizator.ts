import {Localizator} from 'node-server-engine/dist/entities/Localizator/Localizator';
import {stub} from 'sinon';
import {LocalizatorStub, LocalizatorStubOptions} from './Localizator.types';

const DEFAULT_LOCALE_DATA = {
  enabled: true,
  display: 'English',
  names: {
    firstNameFirst: true,
    spacing: true,
  },
  cloudTranslationKey: 'en',
};

/** Stub the Localizator service */
export function stubLocalizator(overrides: LocalizatorStubOptions): LocalizatorStub {
  const synchronize = stub(Localizator, 'synchronize').resolves();
  const init = stub(Localizator, 'init').resolves();
  const shutdown = stub(Localizator, 'shutdown').resolves();
  const getLocaleData = stub(Localizator, 'getLocaleData').returns(
    overrides?.localeData ?? DEFAULT_LOCALE_DATA,
  );
  const isValidLocale = stub(Localizator, 'isValidLocale').returns(overrides?.isValid ?? true);
  return {synchronize, init, shutdown, getLocaleData, isValidLocale};
}
