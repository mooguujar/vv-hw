import imagesMap from '/@/assets/images/images';
import { useI18n } from '@/hooks/web/useI18n';

interface TabItem {
  label: string;
  value: number | string;
  list: Array<string>;
  identifier: string;
}

export interface LangItem {
  label: string; // 多语言描述
  value: string | number; // 多语言key
  transitionValue: string; // 多语言文本
  transitionValueBtn: string; // 按钮文字
  btnShow: boolean; //显示按钮文字
  image_url: string; // 多语言图片地址
  language: string; // 多语言类型
  file?: FileReader; // file文件
  fileList?: any; // 图片列表
  jumpData?: any; // 跳转数据
  btnJumpData?: any; // 按钮跳转数据
  transitionValueTitle?: string; // 标题
  transitionValueSuperscript?: string; // 副标题
}

export const popColorTabs = ['linear-gradient(-59deg, #213743 0%, #213743 100%)'];

export function getPopIconTabs() {
  // 弹窗图标
  const { t } = useI18n();
  const popIconTabs: TabItem[] = [
    {
      label: t('table.system.system_ico1'),
      value: '1',
      list: Array.from({ length: 28 }, (_, i) => imagesMap[`bulletin-1_${i + 1}`]),
      identifier: 'bulletin-1_',
    },
  ];
  return popIconTabs;
}

// export function getPopIconTabs(length = 16, state = 0): TabItem[] {
//   // 弹窗图标
//   const popIconTabs: TabItem[] = [
//     {
//       label: '分组1',
//       value: '1',
//       list: Array.from({ length }, (_, i) => imagesMap[`bulletin-1_${i + state + 1}`]),
//       identifier: 'bulletin-1_',
//     },
//   ];
//   return popIconTabs;
// }

function extractContent(url) {
  const lastSlashIndex = url.lastIndexOf('-');
  const lastQuestionMarkIndex = url.lastIndexOf('_');

  if (
    lastSlashIndex === -1 ||
    lastQuestionMarkIndex === -1 ||
    lastQuestionMarkIndex < lastSlashIndex
  ) {
    return '';
  }
  const content = url.substring(lastSlashIndex + 1, lastQuestionMarkIndex);
  return content;
}
