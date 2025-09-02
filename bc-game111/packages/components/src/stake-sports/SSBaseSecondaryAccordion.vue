<script lang="ts" setup>
import type { Component } from 'vue'
import { useBoolean } from '@tg/hooks'
import { IconSptSoccer, IconUniArrowDown1 } from '@tg/icons'
import { ref } from 'vue'
import SSAppImage from './SSAppImage.vue'
import SSBaseButton from './SSBaseButton.vue'

interface Props {
  title?: string
  icon?: Component | string
  showMore?: boolean
  loading?: boolean
  level?: string | number
  init?: boolean
  disabled?: boolean
  isCloudIcon?: boolean
}
defineOptions({
  name: 'SSBaseSecondaryAccordion',
})
const props = withDefaults(defineProps<Props>(), {
  init: true,
})

const emit = defineEmits(['more', 'open', 'close'])

const { bool: isOpen, setBool } = useBoolean(props.init)

const openCount = ref(0)

function loadMore() {
  emit('more')
}

function toggle() {
  setBool(!isOpen.value)
  if (isOpen.value) {
    openCount.value += 1
    emit('open', openCount.value)
  }
  else {
    emit('close')
  }
}
</script>

<template>
  <div
    class="base-secondary-accordion"
    :class="[isOpen ? 'is-open' : '', `level-${level}`]"
  >
    <div class="header no-active-scale" :class="{ disabled }" @click="toggle">
      <slot name="header">
        <div class="wrap">
          <div
            class="wrap"
            :style="{
              '--ss-sport-image-error-icon-size': '16rem',
            }"
          >
            <template v-if="icon">
              <SSAppImage
                v-if="isCloudIcon" width="16rem" height="16rem" is-cloud :url="icon as string"
                style="border-radius: 50%;overflow: hidden;flex-shrink: 0;"
              />
              <component :is="icon" v-else />
            </template>

            <div class="wrap">
              <div class="center">
                <span>{{ title }}</span>
              </div>
              <slot name="sideThird" :is-open="isOpen" />
            </div>
            <slot name="sideSecond" :is-open="isOpen" />
          </div>
          <slot name="side" :is-open="isOpen" />
        </div>
      </slot>
      <div v-show="!disabled" class="arrow" :class="{ down: !isOpen }">
        <IconUniArrowDown1 class="text-[#9DABC9]" />
      </div>
    </div>
    <div v-if="isOpen" class="content" :class="{ 'is-open': isOpen }">
      <slot :is-open="isOpen" />
      <div v-if="showMore" class="show-more">
        <hr>
        <div class="load-more-box">
          <SSBaseButton type="text" @click="loadMore">
            <span v-if="!loading">{{ $t('load_more') }}</span>
            <span v-else class="ani-scale">
              <IconSptSoccer />
            </span>
          </SSBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --ss-secondaryAccordion-header-background: #fff;
  --ss-secondaryAccordion-header-title-color: #0d2245;
  --ss-secondaryAccordion-content-background: #fff;
  --ss-secondaryAccordion-content-border-color: #ebebeb;
  --ss-secondaryAccordion-header-padding-x: 16rem;
  --ss-secondaryAccordion-header-padding-y: 12rem;
  --title-span-color: inherit;
  --ss-secondaryAccordion-header-common-title-color: #0d2245;
  --ss-secondaryAccordion-header-level1-title-color: #fff;
}
</style>

<style lang="scss" scoped>
.load-more-box {
  padding-left: 16rem;
  padding-top: 12rem;
  padding-bottom: 12rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
@keyframes aniScale {
  0% {
    transform: scale(0.85);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0.85);
  }
}
.ani-scale {
  animation: 800ms linear 0ms infinite normal both running aniScale;
}
.level-1 {
  --ss-secondaryAccordion-header-background: #fff;
  --ss-secondaryAccordion-header-title-color: #0d2245;
  --ss-secondaryAccordion-content-background: #fff;
  --ss-secondaryAccordion-content-border-color: #ebebeb;
}
.level-2 {
  --ss-secondaryAccordion-header-background: #fff;
  --ss-secondaryAccordion-header-title-color: #0d2245;
  --ss-secondaryAccordion-content-background: #fff;
  --ss-secondaryAccordion-content-border-color: #ebebeb;
}
.level-3 {
  --ss-secondaryAccordion-header-background: #fff;
  --ss-secondaryAccordion-header-title-color: #0d2245;
  --ss-secondaryAccordion-content-background: #fff;
  --ss-secondaryAccordion-content-border-color: #ebebeb;
}
.base-secondary-accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 0;
  border-radius: 4rem;
  background: var(--header-background);
  --header-background: var(--ss-secondaryAccordion-header-background);
  --title-color: var(--ss-secondaryAccordion-header-common-title-color);
  --content-background: var(--ss-secondaryAccordion-content-background);
  --content-border: var(--ss-secondaryAccordion-content-border-color);
  &.is-open {
    .header {
      border-radius: 4rem 4rem 0 0;
    }
  }
  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14rem;
    width: 18rem;
    height: 18rem;
    transition: all ease 0.25s;
    color: #9dabc8;
    &.down {
      transform: rotate(90deg);
    }
  }
  .header {
    width: 100%;
    z-index: 4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: 0 0;
    padding: var(--ss-secondaryAccordion-header-padding-y) var(--ss-secondaryAccordion-header-padding-x);
    color: var(--title-color);
    cursor: pointer;
    border-radius: 4rem;
    font-size: 14rem;
    font-weight: 600;
    line-height: 1.5;
    .wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      > *:not(:first-child) {
        margin-left: 8rem;
      }
    }
    .center {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      color: var(--title-color);
      > *:not(:first-child) {
        margin-top: 8rem;
      }
      > span {
        display: inline-flex;
        align-items: center;
        text-align: left;
        justify-content: flex-start;
        color: var(--title-span-color);
      }
    }
    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
  .content {
    background: var(--content-background);
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0 0 4rem 4rem;
    &.is-open {
      border-top: 1rem solid var(--content-border);
    }
  }
  .show-more {
    --ss-spacing-button-padding-vertical-xs: 0;
    --ss-spacing-button-padding-horizontal-xs: 0;
    hr {
      background: #2f4553;
      height: 2rem;
      width: 100%;
      margin-top: 8rem;
    }
  }
}
</style>
