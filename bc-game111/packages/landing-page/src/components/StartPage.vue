<script setup>
import { BaseImage } from '@tg/bccomponents'
import { i18n } from '@tg/vue-i18n'
import { isDev, useLineData } from '../hooks'

const { t } = i18n.global
const { mainDomain, domains } = useLineData()

const siteName = window.site || ''
const isMobile = window.innerWidth <= 768
const device = isMobile ? 'h5' : 'pc'
const imgDomain = isDev() ? '/landing-page' : t('域名')

function startGame() {
  const mainDomainList = isDev() ? [''] : mainDomain.value.split(',')
  const url = mainDomainList[Math.floor(Math.random() * mainDomainList.length)]
  const urlParams = new URLSearchParams(window.location.search)
  const c = urlParams.get('c')?.replace(/\//g, '')
  const newUrl = c ? `${url}/${siteName}/?c=${c}` : `${url}/${siteName}`
  location.href = newUrl
}
</script>

<template>
  <div class="w-full flex items-center justify-center h-[100vh]" style="background-color: rgb(237, 237, 239);">
    <div class="w-full py-[40rem] flex items-center justify-center">
      <div>
        <BaseImage class="w-[312rem] md:w-[410rem] mb-[16rem]" :url="`${imgDomain}/png/${siteName}_${device}.png`" alt="" />
        <div class="text-center text-[32rem] text-[#5b3503] " @click="startGame">
          <span class="cursor-pointer">{{ t('点击进入') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
