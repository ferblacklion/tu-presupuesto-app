import isEmpty from './is-empty';

const ZERO = /^0+|\s+/g;
const FORMAT = /\B(?=(\d{3})+(?!\d))/g;
/**
 * Sets global options to configure the formatter.
 *
 * @param config - the configuration object
 */
export function setup(config: IConfig): void {
  if (!config) return;
  Object.assign(defaults, validateConfig(config));
}

export interface IConfig {
  decimalMark?: string;
  thousandsMark?: string;
  decimals?: number;
  culture?: string;
}

const defaults: IConfig = {
  culture: 'en',
  decimalMark: '.',
  thousandsMark: ',',
  decimals: 2
};

// -------------------------------

function validateConfig(config: IConfig): IConfig {
  if (isEmpty(config.decimalMark)) {
    throw Error("decimalMark can't be empty");
  }
  if (isEmpty(config.thousandsMark)) {
    throw Error("thousandsMark can't be empty");
  }
  if (config.decimalMark === config.thousandsMark) {
    throw Error("decimalMark can't be the same as thousandsMark");
  }
  if (isEmpty(config.decimals)) {
    throw Error("decimals can't be empty");
  }

  return config;
}

/**
 * Applies a format with thousands and decimal separators.
 *
 * @param digits - the number to format, it can be a number or a string
 * @param [config] - the configuration object
 */
export default function formatNumber(
  digits: number | string,
  config?: IConfig
): string {
  if (digits == null) return '0';
  digits =
    typeof digits === 'string' ? digits.replace(ZERO, '') : digits.toString();
  if (digits === '' || digits === '0') return '0';
  const cfg = config ? validateConfig({ ...defaults, ...config }) : defaults;
  // splits by the native decimal separator for numbers
  let [intNumber, decNumber] = digits.split('.');
  const hasDecimals = decNumber && cfg.decimals;
  if (!hasDecimals && (!intNumber || intNumber === '-')) return '0';
  decNumber = hasDecimals
    ? cfg.decimalMark + decNumber.substr(0, cfg.decimals)
    : '';

  if (intNumber && intNumber !== '-') {
    intNumber = intNumber.replace(FORMAT, cfg.thousandsMark || ',');
  }
  if (intNumber === '-') intNumber = '-0';
  if (!intNumber) intNumber = '0';
  return intNumber + decNumber;
}
