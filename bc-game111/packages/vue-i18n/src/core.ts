import type { EnumLanguageKey } from '@tg/types'
import type { App } from 'vue'
import type { Locale } from 'vue-i18n'
import { getParamsQuery } from '@tg/utils'
import { createI18n } from 'vue-i18n'
import { ALL_LANGUAGES } from '../utils/config'
import {
  getLangFromBrowser,
  getLangFromStorage,
  LANGUAGE_BACKEND_MAP,
  LANGUAGE_MAP,
  setLangToLocalStorage,
} from '../utils/language-manager'
// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//
// Don't need this? Try vitesse-lite: https://github.com/antfu/vitesse-lite
export const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
})

const loadedLanguages: string[] = []

type LocalesMap = Record<string, () => Promise<{
  default: Record<string, string>
}>>

let localesMap: LocalesMap = {}

export function setLocalesMessages(locales: LocalesMap) {
  localesMap = locales
}

export function getLocaleLangList() {
  return Object.keys(localesMap)
}

/**
 * 获取当前用什么语言
 *
 * URL -> 本地 -> 系统(优先英语，其次中文)
 *
 * @return {EnumLanguageKey}
 */
export function getLang(): EnumLanguageKey {
  const urlLang = getParamsQuery<string | null>('lang')
  if (urlLang) {
    return LANGUAGE_MAP[urlLang]
  }

  const localLang = getLangFromStorage()
  if (localLang) {
    return LANGUAGE_MAP[localLang]
  }

  const browserLang = getLangFromBrowser()
  if (localesMap[LANGUAGE_MAP[browserLang]]) {
    return LANGUAGE_MAP[browserLang]
  }

  if (localesMap[LANGUAGE_MAP['en-US']]) {
    return LANGUAGE_MAP['en-US']
  }

  if (localesMap[LANGUAGE_MAP['zh-CN']]) {
    return LANGUAGE_MAP['zh-CN']
  }

  return LANGUAGE_MAP['zh-CN']
}

/**
 * 获取当前的后端语言
 */
export function getLangForBackend() {
  return LANGUAGE_BACKEND_MAP[getLang()] ?? ''
}

export function isZhcn() {
  return getLang() === 'zh-CN'
}

export function isPtbr() {
  return getLang() === 'pt-BR'
}

function setI18nLanguage(lang: Locale) {
  i18n.global.locale.value = lang
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang: EnumLanguageKey): Promise<Locale> {
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

/**
 * 切换语言
 * @param lang {EnumLanguageKey}
 */
export async function changeLanguage(lang: EnumLanguageKey) {
  await loadLanguageAsync(lang)
  setLangToLocalStorage(lang)
}

/**
 * 获取语言的本地配置
 * @param lang
 */
export function getLangConfig(lang = getLang()) {
  return ALL_LANGUAGES.find(item => item.value === lang)
}

export {
  Locale,
}

export function install(app: App<Element>) {
  app.use(i18n)
}
