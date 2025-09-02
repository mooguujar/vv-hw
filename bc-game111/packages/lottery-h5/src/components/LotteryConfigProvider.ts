import type { PropType } from 'vue-demi'
import { defineComponent, inject, provide, reactive } from 'vue'
import { type ConfigProviderContext, configSymbol, LotteryLocaleSymbol } from '../config'

export function useLocale() {
  const local = inject<any>(LotteryLocaleSymbol)
  const $$t = (key: string, params?: Record<string, unknown>) => {
    const msg = local[key]
    if (!msg)
      return key

    return msg.replace(/\{(\w+)\}/g, (_: string, k: string) => {
      return params?.[k] != null ? String(params[k]) : `{${k}}`
    })
  }

  return {
    $$t,
  }
}

export const LotteryConfigProvider = defineComponent({
  name: 'LotteryConfigProvider',
  props: {
    route: {
      type: Object as PropType<ConfigProviderContext['route']>,
      required: false,
    },
    locale: {
      type: Object as PropType<ConfigProviderContext['locale']>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const reactiveProps = reactive(props)

    provide(LotteryLocaleSymbol, props.locale)
    provide(configSymbol, reactiveProps)

    return () => slots.default?.()
  },
})
