import { Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { useLocale } from '/@/locales/useLocale';

export const SetTooltip = (text, length?) => {
  // 检查文本长度是否超过最大长度
  if (length && text.length > length) {
    return h(
      Tooltip,
      {
        title: text,
      },
      () =>
        h(
          'div',
          {
            style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
          },
          text,
        ),
    );
  } else {
    // 如果文本长度未超过最大长度,直接返回文本
    return h(
      'div',
      {
        style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
      },
      text,
    );
  }
};

export const width120 = 120;

export const width160px = '160px';

export const width180px = '180px';

export const tabHeight395 = 395;

export const tabHeight340 = 340;

export const tabHeight510 = 510;

export const tabHeight410 = 410;

export const tabHeight540 = 540;

export const tabHeight460 = 460;

export const tabHeight300 = 300;

export const tabHeight430 = 430;

export const tabHeight480 = 480;

export const tabHeight400 = 400;

export const tabHeight570 = 570;

export const tabHeight350 = 350;

export function setClounmsWidth(zhWidth, otherWidth) {
  const lang = useLocale().getLocale.value;
  if (lang == 'zh_CN') return zhWidth;
  else return otherWidth;
}

export function setClassWidth(width: { [key: string]: string; default: string }) {
  // 获取当前语言
  const lang = useLocale().getLocale.value;

  // 根据语言返回相应的类
  const selectedWidth = width[lang] || width.default;

  return { [selectedWidth]: true };
}

export function setClassWidthNew(width: { [key: string]: any; default: any }) {
  // 获取当前语言
  const lang = useLocale().getLocale.value;

  // 根据语言返回相应的类
  const selectedWidth = width[lang] || width.default;

  return selectedWidth;
}
