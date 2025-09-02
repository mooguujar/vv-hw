/**
 * Multi-language related operations
 */
import type { LocaleType } from '/#/config';
import dayjs from 'dayjs';
import { i18n } from './setupI18n';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
import { unref, computed } from 'vue';
import { loadLocalePool, setHtmlPageLang } from './helper';
import { langLoader } from './langLoader';

interface LangModule {
  message: Recordable;
  dateLocale: Recordable;
  dateLocaleName: string;
}

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut();
  const _i18n = unref(i18n);
  dayjs.locale(locale);
  // if (_i18n.mode === 'legacy') {
  _i18n.global.locale = locale;
  // } else {
  // (_i18n.global.locale as any).value = locale;
  // }
  localeStore.setLocaleInfo({ locale });
  setHtmlPageLang(locale);
}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut();
  const getLocale = computed(() => localeStore.getLocale);
  const getShowLocalePicker = computed(() => localeStore.getShowPicker);
  const getAntdLocale = computed((): any => {
    const _i18n = unref(i18n);
    return _i18n.global.getLocaleMessage(unref(getLocale))?.antdLocale ?? {};
  });

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale: LocaleType) {
    const _i18n = unref(i18n);
    const globalI18n = _i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    if (loadLocalePool.includes(locale)) {
      setI18nLanguage(locale);
      return locale;
    }
    const langModule = await langLoader(locale);
    if (!langModule) return;

    const { message } = langModule;

    globalI18n.setLocaleMessage(locale, message);
    loadLocalePool.push(locale);
    setI18nLanguage(locale);
    return locale;
  }

  // 获取匹配后台语言字段
  function getLanguageField(field: string) {
    const [pre] = getLocale.value.split('_');
    return `${pre}_${field}`;
  }

  // 获取匹配后台语言字段
  function getLanguageObject(field: string, d: object) {
    const obj = {};
    for (const i in d) {
      if (i.indexOf(field) !== -1) {
        obj[i] = d[i];
      }
    }
    return obj;
  }

  return {
    getLocale,
    getShowLocalePicker,
    changeLocale,
    getLanguageField,
    getLanguageObject,
    getAntdLocale,
  };
}
