import { ref, onBeforeUnmount } from 'vue';
import { baseURL } from '/@/settings/siteSetting';
import { useUserStore } from '/@/store/modules/user';
import { useMessage } from '/@/hooks/web/useMessage';
import { REQUEST_TOKEN_KEY } from '/@/utils/http/axios/requestKey';
import dayjs from 'dayjs';
import { useLocale } from '/@/locales/useLocale';
import { getEnv } from '/@/utils/env';
import { isObject } from '../is';
import { useI18n } from '/@/hooks/web/useI18n';

const { VITE_CASINO_IMG_CLOUD_URL } = getEnv();
const lang = useLocale().getLocale.value;
const { t } = useI18n();

export function filterEmptyParams<T>(params: T): T {
  // 過濾 field 開頭為 _ 以及 value 是 '' || undefined 的欄位
  return Object.fromEntries(
    Object.entries(params as Object).filter(([k, v]) => {
      return !k.startsWith('_') && v !== '' && v != undefined && v != null;
    }),
  ) as T;
}

export function prehandleSearchByParams<T>(params: T): T {
  if (Object.hasOwn(params as Object, 'searchBy')) {
    params[params['searchBy']] = params['searchVal'];
    params['searchBy'] = '';
    params['searchVal'] = '';
  }
  return filterEmptyParams(params);
}

export function getImageTypePreviewUrl(previewUrl: string): string {
  if (!previewUrl) return '';
  const userStore = useUserStore();
  const token = userStore.getToken;
  return `${baseURL}base/preview/photo?file=${previewUrl}&token=${token}`;
}

export function getDataTypePreviewUrl(previewUrl: string): string {
  if (!previewUrl) return '';
  const userStore = useUserStore();
  const url = previewUrl.substring(0, 1) === '/' ? previewUrl : '/' + previewUrl;
  const token = userStore.getToken;
  return `${VITE_CASINO_IMG_CLOUD_URL}${url.replace(
    '%lang%',
    lang,
  )}?${REQUEST_TOKEN_KEY}=${token}&l=${Date.now()}`;
}
export function getDataTypePreviewUrlSiteCode(previewUrl: string): string {
  if (!previewUrl) return '';
  const userStore = useUserStore();
  const url = previewUrl.substring(0, 1) === '/' ? previewUrl : '/' + previewUrl;
  const token = userStore.getToken;
  const segments = url.split('/');
  const fileName = segments[segments.length - 1];
  const info = userStore.getUserInfo;
  segments.push(info['prefix'] + '_' + fileName); // 替换文件名
  segments.splice(4, 1);
  const newPath = segments.join('/');
  return `${VITE_CASINO_IMG_CLOUD_URL}${newPath.replace(
    '%lang%',
    lang,
  )}?${REQUEST_TOKEN_KEY}=${token}&l=${Date.now()}`;
}

// 定時器 hook
export function useInterval(callback: () => void) {
  const timerId = ref<number | undefined>(undefined);

  // deplay 小於或等於 0 暫停
  function startInterval(delay: number): void {
    if (!(delay > 0)) return;
    timerId.value && stopInterval();
    timerId.value = window.setInterval(callback, delay);
  }

  function stopInterval(): void {
    window.clearInterval(timerId.value);
    timerId.value = undefined;
  }

  onBeforeUnmount(() => {
    stopInterval();
  });

  return { startInterval, stopInterval };
}

export async function donwloadFile(api, payload, cusFileName = 'file') {
  try {
    const response = await api(payload);
    if (isObject(response)) {
      const { createMessage } = useMessage();
      createMessage.error(response.data);
      return Promise.reject();
    } else {
      const newBlob = new Blob([response], { type: 'text/csv' });
      const filename = cusFileName + dayjs().format('YYYY-MM-DD HH:mm:ss');
      const url = window.URL.createObjectURL(newBlob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      return Promise.resolve();
    }
  } catch (e) {
    return Promise.reject(e);
  }
}

// 導出檔案 hook
export function useExportFile() {
  const { t } = useI18n();
  const { createMessage } = useMessage();
  async function exportFile(api, params, cusFileName: string): Promise<void> {
    try {
      await donwloadFile(api, params, cusFileName);
      createMessage.success(t('sys.api.export_success'));
      return Promise.resolve();
    } catch (e) {
      createMessage.error(t('common.import_err15'));
      console.error(e);
      return Promise.reject();
    }
  }

  return { exportFile };
}

function downloadCSV(content, filename = '导出.csv') {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCsvFromResponse(response) {
  if (response?.d?.length) {
    const csvContent = '\uFEFF' + response.d.join('\n'); // 加 BOM 解决乱码
    downloadCSV(csvContent, `${useI18n().t('routes.member.memberList')}.csv`);
  }
}
