<script lang="ts" setup>
import { ApiMemberAgencyMyPromotion } from '@tg/apis'
import { IconUniDoc } from '@tg/icons'
import { useBrowserLocation, useClipboard } from '@vueuse/core'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppApplicationSharing from './AppApplicationSharing.vue'
import AppLoading from './AppLoading.vue'
import AppTooltip from './AppTooltip.vue'

const { copy } = useClipboard()
const { t } = useI18n()
const location = useBrowserLocation()
const { data: proData, runAsync, loading } = useRequest(ApiMemberAgencyMyPromotion)

const qrUrl = computed(() => `${location.value.origin}${proData.value?.link_url ?? ''}`)

onMounted(() => {
  runAsync()
})
</script>

<template>
  <AppLoading v-if="loading" :height="250" :full-screen="false" />
  <div v-else class="p-[16rem]">
    <div class="mb-[4rem] font-[600]">
      {{ t('通过社交媒体分享') }}
    </div>
    <AppApplicationSharing show-name :share-text="qrUrl" width="40rem" round />
    <div class="mb-[2rem] font-[600] mt-[8rem]">
      {{ t('推广链接') }}
    </div>
    <AppTooltip
      :text="t('已成功复制')" icon-name="copy" :triggers="['click']"
      @click="copy(qrUrl)"
    >
      <template #content>
        <div class="bg-[#dadada] flex-1 flex items-center justify-between px-[10rem] h-[30rem] rounded-[4rem]">
          <span>{{ qrUrl }} </span>
          <IconUniDoc class="text-[#6D7693] w-[14rem] h-[14rem]" />
        </div>
      </template>
    </AppTooltip>
  </div>
</template>

<style lang="scss" scoped>

</style>
