import { CURRENCY_UNIT, CURRENCY_UNIT_ID } from '/@/settings/currencySetting';
import { useCurrencyStore } from '/@/store/modules/currency';
import { useFinanceStore } from '/@/store/modules/finance';
import { useTreeListStore } from '/@/store/modules/treeList';
import { div } from '/@/utils/number';
import { countDecimalPlaces } from '/@/utils/string';
import Big from 'big.js';
import { useI18n } from '/@/hooks/web/useI18n';
import blackIcon1 from '/@/assets/images/site/blackIcon1.png';
import green from '@/assets/images/site/green.png';
import white from '@/assets/images/site/white.png';
import blackIcon2 from '/@/assets/images/site/blackIcon2.png';
import loadingBg from '@/assets/images/site/loadingBg.webp';

import blueIcon from '@/assets/images/site/blueIcon.png';
import greenIcon from '@/assets/images/site/greenIcon.png';
import whiteIcon from '@/assets/images/site/whiteIcon.png';
import person from '@/assets/images/site/person.png';
import vector from '@/assets/images/site/vector.png';
import curry from '@/assets/images/site/curry.png';
import down from '@/assets/images/site/down.png';
import add from '@/assets/images/site/add.png';
import person1 from '@/assets/images/site/person1.png';
import vector1 from '@/assets/images/site/vector1.png';

Big.NE = -13;
export function getRate() {
  const { getCurrency, getCurrencyMap, getAllCurrencyList } = useCurrencyStore();
  const { getRateObject } = useFinanceStore();
  const currency = getAllCurrencyList.find((item) => item.name === getCurrency);
  const FinanceRates = { ...getRateObject.rates[currency.id], [currency.id]: 1 };
  const FinancegetCurrency = getCurrency;
  return { FinanceRates, FinancegetCurrency, getCurrencyMap, currencyId: currency.id };
}

/**
 *
 * @param number string | number 金额
 * @param currency string 币种名称
 * @returns string 小数位精度 min: 2; max: 配置精度;
 */
export function formatNumberFixed(number, currency) {
  const num = new Big(number);
  const fixed = countDecimalPlaces(CURRENCY_UNIT[currency]);
  const r = num.round(fixed);
  // 按精度舍入后的小数部分

  const decimal = r.toString().match(/\.[0-9]*/);
  return !decimal || (decimal?.length && decimal[0].length < 3)
    ? r.toFixed(2).toString()
    : r.toString();
}

export function createCurrencyData(data?) {
  const { currencyTreeList } = useTreeListStore();
  if (data) {
    return [data, ...currencyTreeList];
  }
  return currencyTreeList;
}

export function calculationAmount(amount: any, currencyId: any) {
  const { FinanceRates } = getRate();
  const fiexed = countDecimalPlaces(CURRENCY_UNIT_ID[currencyId]);
  const total = Number(div(Number(amount), Number(FinanceRates[currencyId]))).toFixed(fiexed);

  return total;
}

export function getAttrValues(list) {
  const { t } = useI18n();
  const attrSet = new Set();

  // Iterate through the list to add attr values to the set
  list.forEach((item) => {
    if (item.attr == 1 || item.attr == 2) {
      attrSet.add(item.attr);
    }
  });
  const result: any = [];

  // Construct the result array based on the presence of attr values
  if (attrSet.has('1')) {
    result.push({ label: t('business.Fiat_currency'), value: 1 });
  }
  if (attrSet.has('2')) {
    result.push({ label: t('business.cryptocurrency_currency'), value: 2 });
  }

  return result;
}

// stake-黑色 stake-绿色  bc.game 白色  青黑
// 黑色 綠色   333x192
// 白色  351x183
// 青黑 351x120
// bc.game 355x152

export function getBannerWidth(tpl: number, type: 'w' | 'h' | 'w*h'): number | string {
  const dimensions: { [key: number]: { w: number; h: number } } = {
    1: { w: 1332, h: 640 },
    2: { w: 1332, h: 640 },
    3: { w: 1420, h: 640 },
    4: { w: 1404, h: 640 },
    5: { w: 1404, h: 640 },
    6: { w: 1404, h: 640 },
    7: { w: 1420, h: 440 },
  };

  const dimension = dimensions[tpl] || dimensions[1]; // 默认使用 tpl 1 的尺寸

  switch (type) {
    case 'w':
      return dimension.w;
    case 'h':
      return dimension.h;
    case 'w*h':
      return `${dimension.w}*${dimension.h}`;
    default:
      return dimension.w; // 默认返回宽度
  }
}

export function getActiveWidth(tpl: number, type: 'w' | 'h' | 'w*h'): number | string {
  const dimensions: { [key: number]: { w: number; h: number } } = {
    1: { w: 1300, h: 480 },
    2: { w: 1300, h: 480 },
    3: { w: 1300, h: 592 },
    4: { w: 1300, h: 480 },
    5: { w: 1300, h: 480 }, // 假设 tpl 为 5
    6: { w: 1300, h: 480 }, // 假设 tpl 为 5
    7: { w: 1420, h: 440 },
  };

  const dimension = dimensions[tpl] || dimensions[1]; // 默认使用 tpl 1 的尺寸

  switch (type) {
    case 'w':
      return dimension.w;
    case 'h':
      return dimension.h;
    case 'w*h':
      return `${dimension.w}*${dimension.h}`;
    default:
      return dimension.w; // 默认返回宽度
  }
}

type StyleProperties = {
  backgroundColor?: string;
  color?: string;
  btnBgColor?: string;
  color1?: string;
  icon?: string;
  bgImg?: string;
  iconImg?: string;
  person?: string;
  vector?: string;
  curry?: string;
  down?: string;
  add?: string;
  border: string;
  borderBg: string;
  previewClss: string;
};

type Dimensions = {
  [key: number]: {
    [key: string]: {
      styles: StyleProperties;
    };
  };
};

// 基础样式
const commonStyles: StyleProperties = {
  backgroundColor: '#1a2c38',
  color: '#fff',
  btnBgColor: '#1475e1',
  color1: '#fff',
  icon: blackIcon1,
  bgImg: loadingBg,
  iconImg: blueIcon,
  person: person,
  vector: vector,
  curry: curry,
  down: down,
  add: add,
  border: '1px solid #1A2C38',
  borderBg: '#0F212E',
  previewClss: 'previewPicModal',
};

// 定义样式
export function getSettingStyle(
  templateId: number,
  styleType: string,
  styleClass: keyof StyleProperties,
): string | undefined {
  const dimensions: Dimensions = {
    1: {
      pc_logo_white: {
        styles: { ...commonStyles },
      },
    },
    2: {
      pc_logo_white: {
        styles: {
          backgroundColor: '#02432d',
          color: '#fff',
          btnBgColor: '#f6d14a',
          color1: '#02432d',
          icon: blackIcon1,
          bgImg: green,
          iconImg: greenIcon,
          person: person,
          vector: vector,
          curry: curry,
          down: down,
          add: add,
          border: '1px solid #197b59',
          borderBg: '#02432d',
          previewClss: 'previewPicModalGreen',
        },
      },
    },
    3: {
      pc_logo_white: {
        styles: { ...commonStyles },
      },
    },
    4: {
      pc_logo_white: {
        styles: {
          backgroundColor: '#fff',
          color: '#111111',
          btnBgColor: '#F2CA5C',
          color1: '#111111',
          icon: blackIcon2,
          bgImg: white,
          iconImg: whiteIcon,
          person: person1,
          vector: vector1,
          curry: curry,
          down: down,
          add: add,
          border: '1px solid #F2CA5C',
          borderBg: '#fff',
          previewClss: 'previewPicModalWite',
        },
      },
    },
    5: {
      pc_logo_white: {
        styles: { ...commonStyles },
      },
    },
    6: {
      pc_logo_white: {
        styles: { ...commonStyles },
      },
    },
  };

  // 获取指定模板的样式，默认使用模板 1
  const selectedTemplate = dimensions[templateId] || dimensions[1];

  // 获取指定类型的样式，默认使用 'pc_logo_white'
  const selectedStyle = selectedTemplate[styleType] || selectedTemplate['pc_logo_white'];

  // 返回指定样式类的值
  return selectedStyle.styles[styleClass];
}
