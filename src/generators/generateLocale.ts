export const TEST_LOCALES = [
  'ar',
  'en-US',
  'es-ES',
  'fr-FR',
  'id-ID',
  'it-IT',
  'ja-JP',
  'km-KH',
  'ko-KR',
  'ms-MY',
  'my-MM',
  'nl-NL',
  'pt-PT',
  'ry-RU',
  'th-TH',
  'uk-UA',
  'vi-VN',
  'zh-CN',
  'zh-TW',
];

/**
 * Pick up a random locale from the list of testable ones
 */
export function generateLocale(): string {
  return TEST_LOCALES[Math.floor(Math.random() * TEST_LOCALES.length)];
}
