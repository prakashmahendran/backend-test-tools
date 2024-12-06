import {LocalizatorLocalizationDataElement} from 'node-server-engine';
import {SinonStub} from 'sinon';

/** Stubbing options for the Localizator */
export interface LocalizatorStubOptions {
  /** Forces the return value of the isValidLocale functions  */
  isValid?: boolean;
  /** Forces the return value of the getLocaleData functions  */
  localeData?: LocalizatorLocalizationDataElement;
}

/** Stubbed properties of the Localizator entity */
export interface LocalizatorStub {
  /** Stub of the synchronize method */
  synchronize: SinonStub;
  /** Stub of the init method */
  init: SinonStub;
  /** Stub of the shutdown method */
  shutdown: SinonStub;
  /** Stub of the getLocaleData method */
  getLocaleData: SinonStub;
  /** Stub of the isValidLocale method */
  isValidLocale: SinonStub;
}
