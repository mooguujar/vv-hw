<script lang="ts" setup>
import type { IBreadCrumbItem } from '@tg/types'
import { IconLotBack } from '@tg/icons'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { ref, watch } from 'vue'

interface Props {
  breadcrumb: Array<IBreadCrumbItem>
  back?: boolean
}
defineOptions({
  name: 'AppNavBreadCrumb',
})
const props = withDefaults(defineProps<Props>(), {
  back: false,
})

const _data = ref([...props.breadcrumb])

function goPath(
  { d, disabled }: { d?: IBreadCrumbItem, disabled?: boolean } = {},
) {
  if (disabled)
    return
  const p = _data.value[_data.value.length - 1]
  const _d = d ?? p
  if (_d && _d.path) {
    appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, _d.data)
  }
}

function goBack() {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.SPORTS_HOME })
}

watch(() => props.breadcrumb, (val) => {
  _data.value = val
})
</script>

<template>
  <div class="app-nav-bread-crumb">
    <div class="overflow-x-auto hide-scroll-bar breadcrumb-wrapper remove-end-border">
      <div class="h-full flex items-center px-[10rem] " @click="goBack">
        <IconLotBack class="text-[18rem] text-[#0D2245]" />
      </div>
      <template v-for="d, idx in _data" :key="d.path">
        <div
          class="link" :class="{
            disabled: idx === _data.length - 1,
            active: idx === _data.length - 1,
          }" @click="goPath({ d, disabled: idx === _data.length - 1 })"
        >
          <span>{{ d.title }}</span>
          <div class="slash" />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-nav-bread-crumb {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  height: 100%;

  .breadcrumb-wrapper {
    display: flex;
    align-items: center;
    height: 38rem;
    background: #fff;
    border-radius: 4rem;

    .link {
      height: 100%;
      position: relative;
      display: inline-flex;
      touch-action: manipulation;
      padding: 0;
      font-size: 14rem;
      justify-content: flex-start;
      outline: none;
      box-shadow: none;
      color: #0d2245;
      background: 0;
      padding: 0 14rem;
      font-weight: 500;
      border: none;
      align-items: center;
      -webkit-tap-highlight-color: transparent;
      transition:
        background-color 0.2s,
        color 0.2s;
      flex-shrink: 0;

      &.active {
        color: #0d2245;
        background: 0;
      }

      &.disabled {
        cursor: not-allowed;
        color: #6d7693;
      }

      &:active {
        transform: scale(0.96);
      }
    }

    .slash {
      display: flex;
      width: 1rem;
      height: 3.2em;
      background: #f6f7f8;
      transform: skew(-20deg);
      position: absolute;
      left: 0;
    }
  }
}
</style>
