<script lang="ts" setup>
import { BaseImage } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniVector } from '@tg/icons'

interface Props {
  url: string
  errIcon?: string
  withTheme?: boolean
}
defineOptions({
  name: 'AppImage',
})
const props = withDefaults(defineProps<Props>(), {
  errIcon: 'uni-vector',
  withTheme: false,
})
defineEmits(['loadImg'])

const { bool: showError, setTrue: setTrueShowError } = useBoolean(false)
</script>

<template>
  <BaseImage
    v-if="!showError"
    :url="props.url" v-bind="$attrs" :with-theme="withTheme" @error-img="setTrueShowError"
    @load-img="$emit('loadImg')"
  />
  <slot v-else>
    <IconUniVector :data-title="JSON.stringify($attrs)" class="err-icon" />
  </slot>
</template>

<style>
:root {
  --app-sport-image-error-icon-size: 10px;
}
</style>

<style lang="scss" scoped>
.err-icon {
  font-size: var(--app-sport-image-error-icon-size);
}
</style>
