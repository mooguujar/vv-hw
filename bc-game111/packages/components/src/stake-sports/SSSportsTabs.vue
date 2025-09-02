<script setup lang='ts'>
import { isZhcn } from '@tg/vue-i18n'
import { computed, nextTick, ref } from 'vue'
import SSAppImage from './SSAppImage.vue'

interface ITabItem {
  si: number
  sn: string
  count: number
  icon: string
  useCloudImg?: boolean
}
interface Props {
  modelValue: number
  list: ITabItem[]
}

defineOptions({ name: 'SSSportsTabs' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])

const curTabRef = ref<Array<Element | null>>([])
const lastIndex = ref(props.list.findIndex(a => a.si === props.modelValue))
const maxIndex = ref(props.list.length - 1)

const _list = computed(() => props.list.map((a) => {
  const arr = a.icon.split('.')

  return {
    ...a,
    active: a.si === props.modelValue,
    activeIcon: `${arr[0]}_active` + `.${arr[1]}`,
    sn: isZhcn() && a.sn.length > 4 ? `${a.sn.slice(0, 4)}...` : a.sn,
  }
}))

function onClickHandler(item: ITabItem, i: number) {
  emit('update:modelValue', item.si)
  emit('change', item)

  nextTick(() => {
    // 点击之后第二个元素要进入视口
    let nextOneIndex = i
    // 右边
    if (i > lastIndex.value) {
      if (i === maxIndex.value)
        nextOneIndex = i
      else
        nextOneIndex = i + 1
    }
    // 左边
    else {
      if (i === 0)
        nextOneIndex = i
      else
        nextOneIndex = i - 1
    }
    curTabRef.value[nextOneIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
    // 记录下标
    lastIndex.value = i
  })
}
</script>

<template>
  <div class="base-tab">
    <div class="scroll-x base-tab-wrap">
      <div class="flex">
        <div
          v-for="item, i in _list" :key="item.si" :ref="el => curTabRef[i] = (el as Element)" class="tab"
          :class="{ active: item.active, isZhcn: isZhcn() }" @click="onClickHandler(item, i)"
        >
          <div class="w-[28rem] relative h-[28rem] mb-[8rem]">
            <SSAppImage v-show="!item.active" :url="item.icon" style="--ss-sport-image-error-icon-size:26rem;" />
            <SSAppImage v-show="item.active" :url="item.activeIcon" style="--ss-sport-image-error-icon-size:26rem;" />
            <span class="count">{{ item.count }}</span>
          </div>
          <span class="name">{{ item.sn }}</span>
          <span class="dot" :class="{ active: item.active }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.base-tab {
  width: 100%;
  max-width: 100%;

  .base-tab-wrap {
    background-color: #fff;
    border-radius: 8rem;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.tab {
  flex-shrink: 0;
  width: 58rem;
  max-width: 58rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rem 0;
  position: relative;

  .name {
    font-size: 12rem;
    color: #0d2245;
    line-height: 12rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 6ch;
  }
  .count {
    font-size: 12rem;
    font-weight: 600;
    color: #fff;
    line-height: 14rem;
    padding: 0 5rem;
    display: inline-block;
    position: absolute;
    background-color: #6d7693;
    border-radius: 50rem;
    top: -6rem;
    right: 0;
    transform: translateX(66%);
  }

  &.active {
    .name {
      color: #f23038;
    }
    .count {
      background-color: #f88d22;
    }
  }

  .dot {
    display: none;
    position: absolute;
    top: 0;

    &.active {
      display: block;
      width: 12rem;
      height: 6rem;
      border-radius: 0 0 4rem 4rem;
      background-color: #f23038;
    }
  }

  &.isZhcn {
    width: 62rem;
    max-width: 68rem;
    .name {
      max-width: 9ch;
    }
  }
}
</style>
