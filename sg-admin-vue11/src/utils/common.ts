import { Client } from '../settings/commonSetting';
import { useCurrencyStore } from '../store/modules/currency';
import { useMemberStore } from '../store/modules/member';
import { useTreeListStore } from '../store/modules/treeList';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
// 设备转化为数组
export function getClientValues(clientArray) {
  const resultArray = [];
  for (let i = 0; i < clientArray.length; i++) {
    const id = clientArray[i].id;
    const value = Client[id];
    if (value) {
      resultArray.push(value);
    }
  }
  return resultArray;
}

// 过滤会员层级
export function filterArrayByObject(arr, obj) {
  for (let i = 0; i < arr.length; i++) {
    const key = arr[i];
    if (!(key in obj)) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
}

// 是不是虚列币
export function isVirtualCurrency(id) {
  if (!id) return false;
  const { getAllCurrencyList } = useCurrencyStore();
  const itemFind = getAllCurrencyList?.find((item) => {
    return item.id == id;
  });
  return itemFind.attr == 2;
}

// 获取第一个币种
export function getFirstProperty() {
  const { getCurrencyList } = useCurrencyStore();
  const keys = Object.keys(getCurrencyList);
  if (keys.length > 0) {
    const firstKey = keys[0];
    const firstValue = getCurrencyList[firstKey];
    return firstValue;
  } else {
    return null; // 对象为空时返回 null 或其他适当的值
  }
}

// 会员层级(多个key 转value)
export function getLevelValues(level, type) {
  const levelobg = useMemberStore().levelSelect;
  const idArray = type ? level : level.split(',');
  // 创建一个用于存储结果的数组
  const resultArray = [];
  // 遍历id数组，并获取对应的obg值
  for (let i = 0; i < idArray.length; i++) {
    const key = parseInt(idArray[i]);
    const value = levelobg[key];
    if (value) {
      resultArray.push(value);
    }
  }
  return resultArray.join(',');
}

// 会员层级 (key 转 value )
export function getkeyValues(id) {
  const levelobg = useMemberStore().levelSelect;
  const key = parseInt(id);
  return levelobg[key] ? levelobg[key] : '-';
}

//- 小写数字转换成大写, 只处理到[0 ~ 99]
export function numberConvertToUppercase(num: any) {
  num = Number(num);
  const upperCaseNumber = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '百',
    '千',
    '万',
    '亿',
  ];
  const length = String(num).length;
  if (length == 1) {
    return upperCaseNumber[num];
  } else if (length == 2) {
    if (num == 10) {
      return upperCaseNumber[num];
    } else if (num > 10 && num < 20) {
      return '十' + upperCaseNumber[String(num).charAt(1)];
    } else {
      return (
        upperCaseNumber[String(num).charAt(0)] +
        '十' +
        upperCaseNumber[String(num).charAt(1)].replace('零', '')
      );
    }
  }
}
export const Clone_mu: any = function (obj) {
  let isArray_ = Array.isArray[obj] ? true : false;
  if (isArray_) {
    return CopyArray(obj);
  } else {
    return CopyObject(obj);
  }
};

function CopyArray(arr) {
  return [
    ...arr.map((item) => {
      if (Array.isArray(item)) {
        return CopyArray(item);
      } else if (typeof item === 'object' && item !== null) {
        return CopyObject(item);
      } else {
        return item;
      }
    }),
  ];
}

function CopyObject(obj) {
  let copy = Object.create(Object.getPrototypeOf(obj));
  Object.getOwnPropertyNames(obj).forEach(function (key) {
    let value = obj[key];
    if (Array.isArray(value)) {
      copy[key] = CopyArray(value);
    } else if (typeof value === 'object' && value !== null) {
      copy[key] = CopyObject(value);
    } else {
      copy[key] = value;
    }
  });
  return copy;
}

export const debounce = (fn: Function, delay = 200) => {
  let timer: any;
  // 闭包
  return (...args: any[]) => {
    // 如果不是剪头函数可以使用arguments获取参数，这样就不用写形参了考虑形参个数了
    // let args = arguments;
    // 判断还在定时，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      return fn(...args);
    }, delay);
  };
};

export function createCurrencyMap(id) {
  const { currencyTreeList } = useTreeListStore();
  const currencyMap = {};
  currencyTreeList.forEach((el) => {
    currencyMap[el.id] = el.name;
  });
  return currencyMap[id] || '-';
}

export const convertStateDataToList = (data) => {
  const dataList = Object.entries(data).map(([value, label]) => ({
    label,
    value: parseInt(value, 10),
  }));

  dataList.unshift({ label: t('business.common_all'), value: 0 });

  return dataList;
};

//排序函数
export const sortList = (list) => {
  const { currencyTreeList } = useTreeListStore();
  let arr: any = [];
  currencyTreeList.forEach((item) => {
    return arr.push(item.label as never);
  });
  const currencyIndexMap: any = {};
  arr.forEach((currency: any, index: any) => {
    currencyIndexMap[currency] = index;
  });
  const sortedCurrencyValues = list.slice().sort((a, b) => {
    return currencyIndexMap[a.label] - currencyIndexMap[b.label];
  });
  return sortedCurrencyValues;
};
