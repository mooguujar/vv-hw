// 由6-20位数字、英文或者下划线组成
export const passwordReg = '/^[a-zA-Z0-9]w{5,19}$/';
// 验证字符串以逗号分隔
export const commaSeparatedString = /^[a-zA-Z0-9_]+(,[a-zA-Z0-9_]+)*$/;
// 验证英文数字以逗号分隔
export const commaSeparatedString2 = /([a-zA-Z0-9]+)(?:,|$)*/;
// 验证字符串中多个数字（包含小数）以逗号分隔，最多9组
export const commaSeparatedNumber = /^[0-9.]+(,[0-9.]+){0,8}$/;
// 验证字符串中多个数字（包含小数）以逗号分隔
export const commaSeparatedNumberNoLimit = /^[0-9.]+(,[0-9.]+)*$/;
// 域名正则表达式
// export const domainRegex =
//   /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})$/;
export const domainRegex = /^(http:\/\/|https:\/\/)/;
