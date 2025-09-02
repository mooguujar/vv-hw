import type { EnumLanguageKey, Language } from '@tg/types'
import { getBrandInfo } from '@tg/utils'
import { ALL_LANGUAGES, changeLanguage } from '@tg/vue-i18n'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

function toLangMap() {
  return new Map(ALL_LANGUAGES.map(l => [l.value, l]))
}

function pickSystemLanguage(candidates: EnumLanguageKey[]): EnumLanguageKey | null {
  const sys = (navigator.languages?.[0] || navigator.language || '').trim()
  if (!sys)
    return null
  const lower = sys.toLowerCase()

  const exact = candidates.find(v => v.toLowerCase() === lower)
  if (exact)
    return exact as EnumLanguageKey

  const primary = lower.split('-')[0]
  const primaryHit
    = candidates.find(v => v.toLowerCase() === primary)
      || candidates.find(v => v.toLowerCase().startsWith(`${primary}-`))
  return (primaryHit as EnumLanguageKey) || null
}

export function usePreferredLanguage() {
  const { locale } = useI18n()
  const langMap = toLangMap()

  const rawList = ref<EnumLanguageKey[]>([])
  const defaultLang = ref<EnumLanguageKey | undefined>()

  const validLangList = computed(() =>
    rawList.value.filter(v => langMap.has(v)).map(v => langMap.get(v)!),
  )

  const selectedLang = computed(() => {
    const current = langMap.get(locale.value as EnumLanguageKey)
    return current || (validLangList.value.length ? validLangList.value[0] : undefined)
  })

  // 从后台读取语言配置
  const fetcher = async () => {
    const serverLangs = (getBrandInfo('base.lang.d') as Language[]) ?? []
    const list = serverLangs.map(item => item.replace('_', '-')) as EnumLanguageKey[]
    const defaultLang = (getBrandInfo('base.default.lang')?.replace('_', '-') ?? null) as EnumLanguageKey | null
    return { list, defaultLang }
  }

  async function initLanguage(): Promise<EnumLanguageKey | null> {
    const { list, defaultLang: def } = await fetcher()
    rawList.value = Array.from(new Set(list)) as EnumLanguageKey[]
    defaultLang.value = (def ?? undefined) as EnumLanguageKey | undefined

    // 0) localStorage 保存的用户语言
    const localLang = JSON.parse(localStorage.getItem('current_language') ?? '{"value": "" }').value as EnumLanguageKey
    const localHit
      = localLang && rawList.value.includes(localLang) && langMap.has(localLang)
        ? localLang
        : null

    // 1) 系统语言
    const sysHit = pickSystemLanguage(rawList.value)

    // 2) 默认语言（需在列表中）
    const defHit
      = defaultLang.value && rawList.value.includes(defaultLang.value)
        ? (defaultLang.value as EnumLanguageKey)
        : null

    // 3) 列表第一项
    const first = rawList.value[0] ?? null

    const candidate = localHit || sysHit || defHit || first
    if (!candidate || !langMap.has(candidate))
      return null

    await changeLanguage(candidate)
    return candidate
  }

  async function setLanguage(lang: EnumLanguageKey) {
    if (!langMap.has(lang))
      return
    await changeLanguage(lang)
    // 保存用户选择
    localStorage.setItem('current_language', JSON.stringify({ value: lang }))
  }

  return {
    validLangList,
    selectedLang,
    initLanguage,
    setLanguage,
  }
}
