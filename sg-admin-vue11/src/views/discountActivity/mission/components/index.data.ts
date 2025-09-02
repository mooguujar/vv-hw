import { getMissionCategoryNameList } from '/@/api/mission';

export const getMissionCategoryNameListAction = async () => {
  const params = {
    page: '1',
    page_size: '25',
  }; // Define params here
  const { data } = await getMissionCategoryNameList(params);
  // 转换为数组
  const dataArray = Object.entries(data).map(([key, value]) => {
    return { label: value, value: key };
  });
  return dataArray;
};
