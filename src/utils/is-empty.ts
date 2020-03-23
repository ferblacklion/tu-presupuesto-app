/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Determines if the provided value is null, undefined, or an empty string/array.
 *
 * @param value - the value to check
 * @returns {boolean} `true` if the value is empty
 */
export default function isEmpty(value: any): boolean {
  if (value == null || value === '') return true;
  if (typeof value === 'function') return true;
  const hasLength = 'length' in Object(value);
  return hasLength && value.length === 0;
}

export function areEmpty(...args: any[]): boolean {
  return args.every(isEmpty);
}

export function someEmpty(...args: any[]): boolean {
  if (args.length === 0) return true;
  return args.some(isEmpty);
}
