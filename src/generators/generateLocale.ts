/**
 * List of supported locales for testing purposes.
 * Includes major languages and regional variants.
 */
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
] as const;

/**
 * Generates a random locale from the list of supported test locales.
 * 
 * Useful for testing internationalization (i18n) features and ensuring
 * your application handles different locales correctly.
 * 
 * @returns A randomly selected locale code (e.g., 'en-US', 'fr-FR')
 * 
 * @example
 * ```typescript
 * const locale = generateLocale();
 * console.log(locale); // e.g., 'ja-JP'
 * ```
 */
export function generateLocale(): string {
  return TEST_LOCALES[Math.floor(Math.random() * TEST_LOCALES.length)];
}
