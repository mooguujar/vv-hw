import Big from 'big.js';

export function valueNumToStr(value) {
  return value ? value.toString() : '';
}

export function valueStrToNum(value) {
  return value ? Number(value) : 0;
}

/**
 * @file number.ts
 * @description: 科学技术法转换为数字字符串
 * @example (scientificToString(1.2345e+20)) // 123450000000000000000
 * @example (scientificToString('3e-8')) // 0.00000003
 * @return {string} 转换后的数字字符串
 */
function scientificToString(inputNumber: number | string): string {
  if (Number.isNaN(inputNumber)) return '0';

  inputNumber = `${inputNumber}`;
  inputNumber = Number.parseFloat(inputNumber);
  const format = inputNumber.toExponential(); // 转换为标准的科学计数法形式（字符串）
  const tmpArray: any = format.match(/\d(?:\.(\d*))?e([+-]\d+)/); // 分离出小数值和指数值
  const val = inputNumber.toFixed(Math.max(0, (tmpArray![1] || '').length - tmpArray[2]));
  return val;
}

/**
 * @description: 加法函数，用来得到精确的加法结果
 * @param {number} arg1
 * @param {number} arg2
 * @example (add(0.1, 0.2)) // 0.3
 * @example (add(0.00000001, 0.00000002)) // 0.00000003
 * @return {string} arg1加上arg2的精确结果
 */
export function add(arg1: number, arg2: number): string {
  return scientificToString(Big(arg1).plus(Big(arg2)).toPrecision());
}

/**
 * @description: 减法函数，用来得到精确的减法结果
 * @param {number} arg1
 * @param {number} arg2
 * @example (sub(0.3, 0.1)) // 0.2
 * @example (sub(0.00000003, 0.00000002)) // 0.00000001
 * @return {string} arg1减去arg2的精确结果
 */
export function sub(arg1: number, arg2: number): string {
  return scientificToString(Big(arg1).minus(Big(arg2)).toPrecision());
}

/**
 * @description: 乘法函数，用来得到精确的乘法结果
 * @param {number} arg1
 * @param {number} arg2
 * @example (mul(0.3, 0.1)) // 0.03
 * @example (mul(0.00000003, 0.00000002)) // 0.0000000000000006
 * @return {string} arg1乘以arg2的精确结果
 */
export function mul(arg1: number, arg2: number): string {
  return scientificToString(Big(arg1).times(Big(arg2)).toPrecision());
}

/**
 * @description: 除法函数，用来得到精确的除法结果
 * @param {number} arg1
 * @param {number} arg2
 * @example (div(0.3, 0.1)) // 3
 * @example (div(0.00000003, 0.00000002)) // 1.5
 * @return {string} arg1除以arg2的精确结果
 */
export function div(arg1: number, arg2: number): string {
  return scientificToString(Big(arg1).div(Big(arg2)).toPrecision());
}

export function mulrate(arg1: number, arg2: number, label: string): string {
  const currencylist = ['CNY', 'BRL', 'INR', 'VND', 'THB'];
  const number = currencylist.includes(label) ? 2 : 8;
  const result = Big(arg1).times(arg2);
  return result.toFixed(number);
}

export function isStrictNumber(value) {
  if (value === '' || value === null || value === undefined) return false;
  return !isNaN(Number(value)) && !Array.isArray(value);
}

export function isNotNumber(value) {
  return value === null || value === undefined || value === '';
}
