import formatNumber, { IConfig } from './format-number';

const defaultConfig: IConfig = { decimals: 0 };

/**
 * Applies a currency format with thousands and decimal separators.
 *
 * @param digits - the number to format, it can be a number or a string
 * @param [config=defaultConfig] - the configuration object
 */
export default function formatCurrency(
  digits: number | string,
  config: IConfig = defaultConfig
): string {
  return `Q ${formatNumber(digits, config)}`;
}
