// 计算文本宽度的函数
export function getTextWidth(text: string, font = '14px -apple-system') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context!.font = font;
  const metrics = context!.measureText(text);
  return metrics.width;
}

// 获取列的最小宽度
export function getColumnWidth(title: string, dataIndex?: string, data?: any[], hasSorter = false) {
  // 计算表头宽度
  const titleWidth = getTextWidth(title);

  // 计算内容最大宽度
  const contentWidth =
    (data &&
      dataIndex &&
      Math.max(
        ...data.map((item) => {
          const text = item[dataIndex]?.toString() || '';
          return getTextWidth(text);
        }),
        0, // 确保空数组时返回0
      )) ||
    0;

  // 基础padding
  const padding = 0;
  // 排序图标占用的空间
  const sorterWidth = hasSorter ? 24 : 0;

  return Math.ceil(Math.max(titleWidth, contentWidth) + padding + sorterWidth);
}
