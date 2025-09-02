<script setup lang="ts">
import type { EnumLanguageKey } from '@tg/types'
import {
  enUS,
  hiIN,
  koKR,
  LotteryConfigProvider,
  ptBR,
  tlPH,
  viVN,
  zhCN,
} from '@tg/lottery-h5/core'
import { AppSportsFloatingBetSlip, AppSportsFloatingBetSlipCh, SportsConfigProvider } from '@tg/sports-stake/core'
import { useBrandStore } from '@tg/stores'
import { getLang } from '@tg/vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppConnectRefresh from './components/AppConnectRefresh.vue'
import AppGlobalDialog from './components/AppGlobalDialog.vue'
import AppGlobalEventBus from './components/AppGlobalEventBus.vue'
import AppGlobalOnMounted from './components/AppGlobalOnMounted.vue'
import AppGlobalWatch from './components/AppGlobalWatch.vue'
import AppGlobalWatchVisible from './components/AppGlobalWatchVisible.vue'

const brandStore = useBrandStore()
const route = useRoute()

const showSportsFloatingBetSlip = computed(() => {
  return route.path?.toString().includes('/sports')
})

const keepAliveList = [
  'KeepAliveCasinoHome',
  'KeepAliveCasinoGame',
  'KeepAliveAppWallet',
  'KeepAliveCasinoGroupCategory',
  'KeepAliveCasinoGroupProvider',
  'KeepAliveAppPromotionWarp',
  'KeepAliveLotteryWinGo',
  'KeepAliveLottery5D',
  'KeepAliveLotteryRacing',
  'KeepAliveLotteryK3',
  'KeepAliveLotteryTrxWinGo',
]

brandStore.runAsyncBrandBaseDetail()
const isHome = computed(() => route.name === 'Home' || route.path === '/')

function getProviderLang(lang: EnumLanguageKey) {
  const langMap: Partial<Record<EnumLanguageKey, any>> = {
    'en-US': enUS,
    'hi-IN': hiIN,
    'ko-KR': koKR,
    'pt-BR': ptBR,
    'tl-PH': tlPH,
    'vi-VN': viVN,
    'zh-CN': zhCN,
  }

  return langMap[lang]
}
</script>

<template>
  <LotteryConfigProvider :locale="getProviderLang(getLang())">
    <SportsConfigProvider :route="route">
      <div class="w-[var(--pc-max-width)] min-h-[100dvh] m-auto relative overflow-x-hidden hide-scroll-bar">
        <RouterView v-slot="{ Component, route }">
          <transition :name="($route.meta.transitionName as string)">
            <keep-alive :include="keepAliveList" :max="50">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </RouterView>
        <Teleport to="body">
          <!-- 体育悬浮球投注单 -->
          <AppSportsFloatingBetSlip v-if="showSportsFloatingBetSlip && getLang() !== 'zh-CN'" />
          <AppSportsFloatingBetSlipCh v-else-if="showSportsFloatingBetSlip" />
        <!-- <AppCookie /> -->
        </Teleport>

        <AppGlobalWatch />
        <AppGlobalWatchVisible />
        <AppGlobalEventBus />
        <AppGlobalDialog />
        <AppConnectRefresh />
        <AppGlobalOnMounted />
      </div>
    </SportsConfigProvider>
  </LotteryConfigProvider>
</template>

<style lang="scss">
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.slide-up-enter-active,
.slide-up-enter-active {
  transition: transform 0.3s ease;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-enter-to {
  transform: translateX(0%);
}
.slide-left-leave-from {
  transform: translateX(0%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-enter-to {
  transform: translateX(0%);
}
.slide-right-leave-from {
  transform: translateX(0%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
