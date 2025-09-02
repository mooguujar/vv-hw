import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
// import { Parser } from 'json2csv';

export function filterEmptyParams<T>(params: T): T {
  // 過濾 field 開頭為 _ 以及 value 是 '' || undefined 的欄位
  return Object.fromEntries(
    Object.entries(params as Object).filter(
      ([k, v]) => !k.startsWith('_') && v !== '' && v != undefined,
    ),
  ) as T;
}

export function prehandleSearchByParams<T>(params: T): T {
  if (Object.hasOwn(params as Object, 'searchBy')) {
    params[params['searchBy']] = params['searchVal'];
    params['searchBy'] = '';
    params['searchVal'] = '';
  }
  return params;
}

export async function donwloadFile(api, payload) {
  try {
    const response = await api(payload);
    const newBlob = new Blob([response.data], { type: response.headers['content-type'] });
    const filename = response.headers['content-disposition'].split('filename=')[1];
    const url = window.URL.createObjectURL(newBlob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
}

export function useExportFile() {
  const { t } = useI18n();
  const { createMessage } = useMessage();
  async function exportFile(api, params): Promise<void> {
    try {
      const payload = filterEmptyParams(filterEmptyParams(prehandleSearchByParams(params)));
      await donwloadFile(api, payload);
      createMessage.success(t('sys.api.export_success'));
      return Promise.resolve();
    } catch (e) {
      // createMessage.error('导出失败');
      console.error(e);
      return Promise.reject();
    }
  }

  return { exportFile };
}

export const export_csvfn = (exportData: any) => {
  // const json2csvParser = new Parser({ fields: exportData.fields });
  // if (!exportData.data || (Array.isArray(exportData.data) && exportData.data?.length === 0)) {
  //   return;
  // }
  // if (!exportData.filename) {
  //   exportData.filename = `${exportData.filename}.csv`;
  // }
  // const aLink = document.createElement('a');
  // aLink.download = exportData.filename;
  // aLink.href = exports(json2csvParser.parse(exportData.data));
  // aLink.click();
};
