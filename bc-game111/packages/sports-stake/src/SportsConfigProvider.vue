<script setup lang="ts">
import { provide, reactive } from 'vue'
import { type ConfigProviderContext, configSymbol } from '../config'

const props = defineProps<ConfigProviderContext>()
const reactiveProps = reactive(props)

provide(configSymbol, reactiveProps)
</script>

<template>
  <slot />
</template>

<style lang="scss">
.stake-sports-page-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25rem;

  .left {
    display: flex;
    align-items: center;
    font-size: 18rem;
    color: #0d2245;
    font-weight: 600;
    gap: 8rem;
    line-height: 1.5;
  }

  .right {
    display: flex;
    align-items: center;
  }
}
</style>
