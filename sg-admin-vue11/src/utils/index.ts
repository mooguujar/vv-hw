import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Component } from 'vue';

import { intersectionWith, isEqual, mergeWith, unionWith, cloneDeep } from 'lodash-es';
import { unref } from 'vue';
import { isArray, isObject } from '/@/utils/is';
import { getHtmlPageLang } from '/@/locales/helper';
import moment from 'moment';

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace',
): T & U {
  if (!target) {
    return source as T & U;
  }
  if (!source) {
    return target as T & U;
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual);
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual);
        case 'concat':
          return sourceValue.concat(targetValue);
        case 'replace':
          return targetValue;
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`);
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays);
    }
    return undefined;
  });
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T extends Record<string, unknown>, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

// https://github.com/vant-ui/vant/issues/8302
type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
};

export type WithInstall<T> = T & {
  install(app: App): void;
} & EventShim;

export type CustomComponent = Component & { displayName?: string };

export const withInstall = <T extends CustomComponent>(component: T, alias?: string) => {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as WithInstall<T>;
};

// 移除空字符串，null, undefined
export function clearEmptyParam(config) {
  ['data', 'params'].forEach((item) => {
    if (config[item]) {
      const keys = Object.keys(config[item]);
      if (keys.length) {
        keys.forEach((key) => {
          const rawType = toRawType(config[item][key]);
          if (
            ['', undefined, null].includes(config[item][key]) &&
            ['Object', 'String', 'Object', 'Null', 'Boolean', 'Number', 'Array'].includes(rawType)
          ) {
            // 移除属性之前，进行深拷贝断开引用，避免影响页面
            config[item] = cloneDeep(config[item]);
            delete config[item][key];
          }
          if (config[item][key] === 'sg.ipx.tw.6666') config[item][key] = '';
        });
      }
    }
  });
}

/**
 * @description 获取原始类型
 * @param {*} value
 * @returns {String} 类型字符串，如'String', 'Object', 'Null', 'Boolean', 'Number', 'Array'
 */
export function toRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

let source = 0;

let target = 0;
// 专题列表Table拖拽 功能
export function topicDraggableRow(dataSource, index, setTableData, callback, colName) {
  return {
    props: {
      // draggable: 'true'
    },
    class: {
      columnSelectBar: true,
    },
    style: {},
    //鼠标按下
    onmousedown: (event) => {
      // 兼容IE
      const ev = event || window.event;

      ev.target.draggable =
        dataSource[index][colName].substr(0, 7) === ev.target.innerText.substr(0, 7);
    },
    // 鼠标移入
    onMouseenter: (event) => {
      // 兼容IE
      // let ev = event || window.event;
      // ev.target.draggable = true; // 让你要拖动的行可以拖动，默认不可以
    },
    // 开始拖拽
    onDragstart: (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒
      ev.stopPropagation();
      // 得到源目标数据序号
      source = index;
    },
    // 拖动元素经过的元素
    onDragover: (event) => {
      // 兼容 IE
      const ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
    },
    // 鼠标松开
    onDrop: async (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到目标数据序号
      target = index;
      const temp = dataSource[source];
      // 这里就是让数据位置互换，让视图更新 你们可以看record，index的输出，看是什么
      dataSource.splice(source, 1);
      dataSource.splice(target, 0, temp);

      // [dataSource[source], dataSource[target]] = [dataSource[target], dataSource[source]];

      setTableData(dataSource);

      if (target === source) return;

      callback(dataSource, target);
    },
  };
}

//广告列表table拖拽功能
export function ADDraggableRow(dataSource, index, setTableData, callback) {
  return {
    props: {
      // draggable: 'true'
    },
    class: {
      columnSelectBar: true,
    },
    style: {},
    // 鼠标移入
    onMouseenter: (event) => {
      // 兼容IE
      const ev = event || window.event;
      ev.target.draggable = true;
      // ev.target.draggable = ev.target.children[0].children[0].innerText === dataSource[index].id; // 让你要拖动的行可以拖动，默认不可以
    },
    // 开始拖拽
    onDragstart: (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒
      ev.stopPropagation();
      // 得到源目标数据序号
      source = index;
    },
    // 拖动元素经过的元素
    onDragover: (event) => {
      // 兼容 IE
      const ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
    },
    // 鼠标松开
    onDrop: async (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到目标数据序号
      target = index;
      //移动的作品
      const tempSource = dataSource[source];
      //目标作品
      const targetWork = dataSource[target];
      if (target === source) {
        callback(null, null);
        return;
      }

      // dataSource.splice(source, 1);

      // dataSource.splice(target, 0, tempSource);

      // setTableData(dataSource);

      callback(targetWork, tempSource, source, target);
    },
  };
}

//精选列表table拖拽功能
export function featuredDraggableRow(
  dataSource,
  index,
  isVideoTable,
  setTableData,
  callback,
  colName,
) {
  return {
    props: {
      // draggable: 'true'
    },
    class: {
      columnSelectBar: true,
    },
    style: {},
    onmousedown: (event) => {
      // 兼容IE
      const ev = event || window.event;

      ev.target.draggable =
        dataSource[index][colName].trim().substr(0, 7) === ev.target.innerText.substr(0, 7);
    },
    // 鼠标移入
    onMouseenter: (event) => {
      // 兼容IE
      // let ev = event || window.event;
      // ev.target.draggable = mouseColValue === dataSource[index].title; // 让你要拖动的行可以拖动，默认不可以
    },
    // 开始拖拽
    onDragstart: (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒
      ev.stopPropagation();
      // 得到源目标数据序号
      source = index;
    },
    // 拖动元素经过的元素
    onDragover: (event) => {
      // 兼容 IE
      const ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
    },
    // 鼠标松开
    onDrop: async (event) => {
      // 兼容IE
      const ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到目标数据序号
      target = index;
      //移动的作品
      const tempSource = dataSource[source];
      //目标作品
      const targetWork = dataSource[target];

      if (isVideoTable) {
        if ((tempSource.isTop && !targetWork.isTop) || (!tempSource.isTop && targetWork.isTop)) {
          target = source;
        }
      }

      if (target === source) {
        callback(null, null);
        return;
      }

      dataSource.splice(source, 1);

      dataSource.splice(target, 0, tempSource);

      setTableData(dataSource);

      callback(targetWork, tempSource);
    },
  };
}

/**
 * 将秒转换为时分秒
 * @param seconds
 * @returns
 */
export function momentToSeconds(seconds: number) {
  const time = moment.duration(seconds, 'seconds');

  const hours = time.hours();
  const minutes = time.minutes();
  const second = time.seconds();
  return moment({ h: hours, m: minutes, s: second }).format('HH:mm:ss');
}

/**
 * 将逗号强制转换为半角逗号
 * @param params
 * @returns
 */
export function replaceComma(params) {
  if (params === '') return params;

  const temp = params.split(',\n').join(',');

  const temp3 = temp.split('，').join(',');

  const temp4 = temp3.split(',').reduce((result, current) => {
    if (current) result.push(current.trim());
    return result;
  }, []);

  return `${temp4.join(',\n')},\n`;
}

export function parseURLParams(url) {
  const params = {};
  const queryString = url.split('?')[1]; // 根据问号拆分 URL，获取查询字符串部分

  if (queryString) {
    const paramPairs = queryString.split('&'); // 根据 & 符号拆分参数对

    paramPairs.forEach((pair) => {
      const [key, value] = pair.split('='); // 根据等号拆分键值对
      params[key] = decodeURIComponent(value); // 存储参数键值对到 params 对象中
    });
  }

  return params;
}

const currentLangMinWidth = (currentLang) => {
  switch (currentLang) {
    case 'zh_CN':
      return 'auto';
    case 'en_US':
      return '164px';
    case 'vi_VN':
      return '186px';
    case 'pt_BR':
      return '254px';
    default:
      return 'auto';
  }
};
// 提供一个函数，用于计算当前内容的长度来动态设置 width ; 根据多语言的不同，计算宽度
export function calculateWidth(content: string) {
  const currentLang = getHtmlPageLang() ?? 'zh_CN';
  const minWidth = currentLangMinWidth(currentLang);
  const maxWidth = '100%';
  const contentLength = content.length;
  // 根据内容长度计算宽度 px
  const width = `${Math.min(Math.max(contentLength, 10), 100) * 10}px`;
  return { minWidth, maxWidth, width };
}
