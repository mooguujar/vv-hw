import type { App } from 'vue';
import type { I18n, I18nOptions } from 'vue-i18n';
import { ref } from 'vue';
import { createI18n } from 'vue-i18n';
import { setHtmlPageLang, setLoadLocalePool } from './helper';
import { localeSetting } from '/@/settings/localeSetting';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
import { langLoader } from './langLoader';

const { fallback, availableLocales } = localeSetting;

async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithOut();
  const locale = localeStore.getLocale;
  const defaultLocal = await langLoader(locale);

  const en_US = await langLoader('en_US');
  const pt_BR = await langLoader('pt_BR');
  const th_TH = await langLoader('th_TH');
  const vi_VN = await langLoader('vi_VN');
  const zh_CN = await langLoader('zh_CN');
  const hi_IN = await langLoader('hi_IN');
  // const ko_KR = await langLoader('ko_KR');
  // const in_ID = await langLoader('in_ID');
  // const ja_JP = await langLoader('ja_JP');

  const message = defaultLocal?.message ?? {};

  setHtmlPageLang(locale);
  setLoadLocalePool((loadLocalePool) => {
    loadLocalePool.push(locale);
  });

  return {
    legacy: false,
    locale,
    fallbackLocale: fallback,
    messages: {
      en_US: en_US.message,
      pt_BR: pt_BR.message,
      th_TH: th_TH.message,
      vi_VN: vi_VN.message,
      zh_CN: zh_CN.message,
      hi_IN: hi_IN.message,
      // ko_KR: ko_KR.message,
      // in_ID: in_ID.message,
      // ja_JP: ja_JP.message,
      [locale]: message,
    },
    globalInjection: true,
    availableLocales: availableLocales,
    sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true,
  };
}
export const i18n = ref();
// setup i18n instance with glob
export async function setupI18n(app: App) {
  const options = await createI18nOptions();
  i18n.value = createI18n(options) as I18n;
  app.use(i18n.value);
}
