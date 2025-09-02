export function countDecimalPlaces(str) {
  // 使用正则表达式匹配小数点后的数字
  const regex = /\.(\d+)/;
  const match = str.match(regex);

  if (match) {
    // 计算匹配结果的长度
    return match[1].length;
  }

  return 0;
}
