<script setup lang="ts">
import { SSAppLoading } from '@tg/bccomponents'
import { useSportsStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, Session, STORAGE_SPORTS_LIVE_NAV } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, unref } from 'vue'
import AppSportsHomeMarketTypeTabs from './components/AppSportsHomeMarketTypeTabs.vue'
import AppSportsLobby from './components/AppSportsLobby.vue'

defineOptions({ name: 'StakeSportsHome' })

const sportsStore = useSportsStore()
const { marketType, isLobbyLoadFirst } = storeToRefs(sportsStore)

function setLobby() {
  marketType.value = 'all'
}

onMounted(() => {
  appEventBus.on(EventBusNames.SPORTS_LOBBY_RESET, setLobby)
  Session.set(STORAGE_SPORTS_LIVE_NAV, unref(marketType))
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.SPORTS_LOBBY_RESET, setLobby)
  Session.remove(STORAGE_SPORTS_LIVE_NAV)
})
</script>

<template>
  <div>
    <AppSportsHomeMarketTypeTabs />
    <slot name="banner" />
    <AppSportsLobby v-if="isLobbyLoadFirst" :market-type="marketType" />
    <template v-else>
      <Suspense timeout="0">
        <AppSportsLobby :key="marketType" :market-type="marketType" />
        <template #fallback>
          <SSAppLoading full-screen />
        </template>
      </Suspense>
    </template>
  </div>
</template>

<style scoped lang="scss">

</style>
