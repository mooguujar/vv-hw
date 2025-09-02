// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosInstance, AxiosResponse } from 'axios';
import { clone } from 'lodash-es';
import type { RequestOptions, Result } from '/#/axios';
import CBOR from 'cbor-js';

import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { RequestEnum, ResultEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { useLocale } from '/@/locales/useLocale';
import { useCurrencyStore } from '/@/store/modules/currency';
import { isString, isUnDef, isNull, isEmpty } from '/@/utils/is';
import { getToken, getCurrentSite } from '/@/utils/auth';
import { setObjToUrlParams, deepMerge, clearEmptyParam } from '/@/utils';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useI18n } from '/@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { AxiosRetry } from '/@/utils/http/axios/axiosRetry';
import { REQUEST_TOKEN_KEY, REQUEST_LANG_KEY, REQUEST_CURRENCY_KEY } from './requestKey';
import axios from 'axios';
import { IS_ENCRYPT, IS_SIGN } from '/@/settings/siteSetting';
import { arrayBufferToBase64, cborencode, murmurhash3_32_gc } from '../../murmurhash3';
import * as fzstd from 'fzstd';
import { useTimezoneStore } from '/@/store/modules/timezone';
import { timezoneList } from '/@/settings/localeSetting';
import ZstdCodec from 'zstd-codec';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal, createSuccessModal } = useMessage();
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const {
      isAllResponse,
      isTransformResponse,
      isReturnNativeResponse,
      isExport,
      isMessageModal,
      isZstd,
      errorMessageMode,
      noMessageMode,
    } = options;
    if (isZstd) {
      const compressed = new Uint8Array(res.data);
      const decompressed = fzstd.decompress(compressed);
      const result = new TextDecoder().decode(decompressed);
      res.data = JSON.parse(result);
    }

    const { status, data } = res.data;
    if (IS_ENCRYPT) {
      if (status) {
      } else {
      }
    }
    const { url } = res.config;
    // 数据拦截
    if (!isExport) {
      if (!status) {
        const userStore = useUserStoreWithOut(); // 移到外部，避免重复调用

        switch (data) {
          case 'token':
            userStore.setToken(undefined);
            userStore.logout(true);
            break;

          case 'ip':
            createMessage.error(t('sys.api.errMsgIp'));
            userStore.setToken(undefined);
            userStore.logout(true);
            break;

          default:
            if (url && !url.includes('admin/login')) {
              if (isMessageModal) {
                const errorMessage =
                  data && typeof data === 'string' && data.trim() !== ''
                    ? data
                    : t('sys.api.errMsg506'); // 默认错误信息

                if (errorMessageMode !== 'none') {
                  createMessage.error(errorMessage);
                }

                if (!isTransformResponse) {
                  return res.data;
                }
              }
            }
            throw new Error(data); // 抛出错误
        }
      }
    }
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    if (isAllResponse) {
      return { ...res.data, d: res.data.data || {} };
    }

    if (status) {
      if (isString(data) && !noMessageMode) {
        let successMsg = data;
        if (isNull(successMsg) || isUnDef(successMsg) || isEmpty(successMsg)) {
          successMsg = t(`sys.api.operationSuccess`);
        }

        if (options.successMessageMode === 'modal') {
          createSuccessModal({ title: t('sys.api.successTip'), content: successMsg });
        } else if (options.successMessageMode === 'message') {
          createMessage.success(successMsg);
        } else {
          createMessage.success(successMsg);
        }
      }

      return data;
    }
  },
  // 请求之前处理config
  beforeRequestHook: (config: any, options) => {
    const { t } = useI18n();
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
      isZstdCodec,
    } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    // 参数情况加密
    if (IS_ENCRYPT) {
      config.responseType = 'arraybuffer';
    }

    if (isZstdCodec) {
      function encodeSearchParams(obj) {
        const params = [];

        Object.keys(obj).forEach((key) => {
          let value = obj[key];
          // 如果值为undefined我们将其置空
          if (typeof value === 'undefined') {
            value = '';
          }
          // 对于需要编码的文本（比如说中文）我们要进行编码
          params.push([key, encodeURIComponent(value)].join('='));
        });

        return params.join('&');
      }

      const _content = encodeSearchParams(config.data);

      ZstdCodec.ZstdCodec.run((__zstd) => {
        const simple = new __zstd.Simple();
        const _data = new TextEncoder().encode(_content);
        const level = 5;
        let compressed = simple.compress(_data, level);

        console.error('原数据', _content);
        console.error('compressed', compressed);
        config.data = compressed;
      });
      config.responseType = 'application/octet-stream';
    }

    clearEmptyParam(config);

    function containsSingleQuote(value: any): boolean {
      // 如果是字符串，检查是否包含单引号
      if (typeof value === 'string') {
        return value.includes("'");
      }
      // 如果是数组，递归检查每个元素
      if (Array.isArray(value)) {
        return value.some(containsSingleQuote);
      }
      // 如果是对象，递归检查每个属性
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(containsSingleQuote);
      }
      // 对于其他类型，返回 false
      return false;
    }

    const hasSingleQuote = containsSingleQuote(config.data);
    // if (hasSingleQuote) {
    //   createMessage.error(t('sys.api.tserrorTip'));
    //   return false;
    // }

    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers[REQUEST_TOKEN_KEY] = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }

    const site = getCurrentSite();

    if (site) {
      (config as Recordable).headers['X-Spring-Site'] = site;
    }

    const { getTimezone } = useTimezoneStore();
    const match = timezoneList.find((option) => option.value == getTimezone);
    const time_zone = match ? match.time_zone : '';
    if (time_zone) {
      (config as Recordable).headers['time-zone'] = time_zone;
    }
    // 动态配置国际化
    const lang = useLocale().getLocale.value;
    // 配置全局货币类型
    const currency = useCurrencyStore().currencyObj.id;
    config.headers[REQUEST_LANG_KEY] = lang;
    config.headers[REQUEST_CURRENCY_KEY] = currency;
    //console.warn('change currency',config.headers[REQUEST_CURRENCY_KEY] );

    if (IS_SIGN) {
      const device = 24;
      const cborStr = cborencode(config.data);
      const cborBase64 = arrayBufferToBase64(cborStr);
      if (config.method === 'GET') {
        try {
          const params = config.params;
          let _urlParams: any = '';
          if (params)
            _urlParams = `${config.url}?${Object.keys(params)
              .map((key) => `${key}=${params[key]}`)
              .join('&')}`;
          else _urlParams = config.url;

          const str = `${device}${new Date().toDateString()}${_urlParams}`;
          const sign = murmurhash3_32_gc(str, device);
          // if (IS_SIGN) {
          //   console.error('GET加密字符串', str, sign);
          // }
          config.headers['X-Ca-Timestamp'] = new Date().toDateString();
          config.headers['X-Ca-Nonce'] = sign;
        } catch (error) {
          throw new Error(`GET加密失败${JSON.stringify(error)}`);
        }
      } else {
        try {
          const str = `${cborBase64}${device}${new Date().toDateString()}${config.url}`;
          const sign = murmurhash3_32_gc(str, device);
          config.headers['X-Ca-Timestamp'] = new Date().toDateString();
          config.headers['X-Ca-Nonce'] = sign;
        } catch (error) {
          throw new Error(`POST加密失败${JSON.stringify(error)}`);
        }
      }
    }

    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.data?.error?.message ?? '';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        } else if (errorMessageMode === '') {
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    checkStatus(error?.response?.status, msg, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 20 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // 需要对返回all数据
          isAllResponse: false,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          retryRequest: {
            isOpenRetry: true,
            count: 5,
            waitTime: 100,
          },
          isMessageModal: true,
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios();
