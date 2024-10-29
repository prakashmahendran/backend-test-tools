/**
 * Generates a regID like BBM Spark would
 */
export function generateRegId(): string {
  const length = 18;
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}
