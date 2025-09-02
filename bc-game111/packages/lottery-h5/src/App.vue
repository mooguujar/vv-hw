<script setup lang="ts">
import type { EnumLanguageKey } from '@tg/types'
import { ApiMemberLogin } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { application, getParamsQuery, Local, setToken, STORAGE_LOGIN_MQTT_ID, STORAGE_PROMO_AD_POP_LOGIN } from '@tg/utils'
import { changeLanguage, getLang } from '@tg/vue-i18n'
import { nextTick } from 'vue'
import { useRequest } from 'vue-request'
import { enUS, hiIN, koKR, ptBR, tlPH, viVN, zhCN } from '../core'
import AppGlobalMqtt from './components/AppGlobalMqtt.vue'
import AppGlobalWatchVisible from './components/AppGlobalWatchVisible.vue'
import { LotteryConfigProvider } from './components/LotteryConfigProvider'
import { message } from './utils/message'

declare global {
  interface Window {
    isFrameLottery?: boolean
  }
}

const curEnv = process.env.NODE_ENV
window.isFrameLottery = true

if (curEnv !== 'development') {
  const token: string = getParamsQuery('t')
  const lang: EnumLanguageKey = getParamsQuery('lang')
  setToken(token)
  changeLanguage(lang)
}
const appStore = useAppStore()

const { run: runMemberLogin } = useRequest(
  async data =>
    ApiMemberLogin({
      ...data,
      device_number: await application.getDeviceNumber(),
    }),
  {
    manual: true,
    onSuccess: async (res: string) => {
      console.log('res', res)
      Local.set(STORAGE_LOGIN_MQTT_ID, Math.floor(Math.random() * 100))
      Local.remove(STORAGE_PROMO_AD_POP_LOGIN)

      await nextTick()
      appStore.setToken(res)

      message.info('登录成功')
    },
  },
)

function getProviderLang(lang: EnumLanguageKey) {
  const langMap = {
    'en-US': enUS,
    'hi-IN': hiIN,
    'ho-KR': koKR,
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
    <div class="w-[var(--pc-max-width)] min-h-[100dvh] m-auto relative overflow-x-hidden hide-scroll-bar">
      <RouterView v-slot="{ Component, route }">
        <transition :name="($route.meta.transitionName as string)">
          <component :is="Component" />
        </transition>
      </RouterView>
      <AppGlobalMqtt />
      <div v-if="curEnv === 'development'" class="fixed right-0 bottom-1/2">
        <div class="size-[40rem] text-[12rem] mb-[6rem] bg-white center" @click="runMemberLogin({ username: 'jose', password: 'Jose12345' })">
          登录jose
        </div>
        <div class="size-[40rem] text-[12rem] mb-[6rem] bg-white center" @click="runMemberLogin({ username: 'roger01', password: 'Abc123123' })">
          登录Roger
        </div>
        <div class="size-[40rem] text-[12rem] mb-[6rem] bg-white center" @click="runMemberLogin({ username: 'uuuuuu72', password: 'Aa123456' })">
          登录peter
        </div>
      </div>
      <AppGlobalWatchVisible />
    </div>
  </LotteryConfigProvider>
</template>

<style lang="scss">
.app-home-loading {
  height: calc(100vh - 50rem);
}
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
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
