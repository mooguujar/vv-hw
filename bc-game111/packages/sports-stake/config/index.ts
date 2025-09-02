// packages/core/config.ts
import type { InjectionKey } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { inject } from 'vue'

export interface ConfigProviderContext {
  route: RouteLocationNormalizedLoadedGeneric
  [key: string]: any
}

export const configSymbol: InjectionKey<ConfigProviderContext> = Symbol('StakeSportsConfigProvider')

export function useSportsConfig(): ConfigProviderContext {
  return inject(configSymbol, {})
}
