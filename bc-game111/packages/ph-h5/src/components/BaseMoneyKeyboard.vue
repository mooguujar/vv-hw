<script setup lang='ts'>
import type { CurrencyCode, ISelectOption } from '@tg/types'
import { IconCheck2 } from '@tg/icons'
import { getCurrencyConfig, isVirtualCurrency } from '@tg/utils'
import { ref, watch } from 'vue'

interface Props {
  options?: ISelectOption[]
  modelValue?: string
  isBorder?: boolean
  discountInfo?: any
  currency: CurrencyCode
}
defineOptions({
  name: 'BaseMoneyKeyboard',
})
const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { label: '100', value: '100' },
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '5000', value: '5000' },
    { label: '10000', value: '10000' },
    { label: '50000', value: '50000' },
    { label: '100000', value: '100000' },
    { label: '200000', value: '200000' },
  ],
  isBorder: true,
})

const emit = defineEmits(['update:modelValue'])

const modelValue = ref('')

function handleKey(item: ISelectOption) {
  const val = item.value.toString()
  modelValue.value = val
  emit('update:modelValue', val)
}
watch(() => props.modelValue, (newValue) => {
  if (newValue !== modelValue.value)
    modelValue.value = ''
})
</script>

<template>
  <div class="base-money-keyboard">
    <div
      v-for="item of options"
      :key="item.label"
      class="item-key center"
      :class="{ active: item.value === modelValue }"
      @click="handleKey(item)"
    >
      <span v-if="!isVirtualCurrency(getCurrencyConfig(currency).name)" class="mr-4 text-[18rem] font-[700]">{{ getCurrencyConfig(currency).prefix
      }}</span>

      <span class="label">{{ item.label }}</span>
      <div class="item-svg center absolute bottom-0 right-0 h-[14rem] w-[24rem] shrink-0">
        <IconCheck2 class="text-white" />
      </div>
      <!-- 右上角：优惠信息 -->
      <!-- <div v-if="curDiscountInfo.pname" class="absolute right-0 top-0 h-3.5 inline-flex items-center justify-end gap-2.5 rounded-bl rounded-tr-[2px] px-2" :style="{ backgroundColor: tipLableColor(curDiscountInfo.ptype) }">
        <div class="text-right text-xs font-semibold text-tg-text-white">
          {{ curDiscountInfo.pname }}{{ curDiscountInfo.ptype === 1002 ? `${parseFloat(curDiscountInfo.promo)}%` : '' }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<style>
:root {
  --base-money-keyboard-border: #ebebeb;
  --base-money-keyboard-active-border: #f23038;
  --base-money-keyboard-bg: none;
  --base-money-keyboard-active-bg: linear-gradient(180deg, #fff3f4 0%, #ffe9ea 69.23%, #ffd9db 100%);
  --base-money-keyboard-active-svg-bg: #f23038;
}
</style>

<style lang='scss' scoped>
.base-money-keyboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16rem;
  .item-key {
    position: relative;
    width: 100%;
    height: 40rem;
    border-radius: 6rem;
    border: 1px solid var(--base-money-keyboard-border);
    background: var(--base-money-keyboard-bg);
    color: #0d2245;
    font-size: 14rem;
    font-weight: 600;
    .item-svg {
      display: none;
      border-radius: 6rem 0px 4rem 0px;
      background: var(--base-money-keyboard-active-svg-bg);
      font-size: 10rem;
      --tg-base-icon-color: white;
    }
    &.active {
      border-color: var(--base-money-keyboard-active-border);
      background: var(--base-money-keyboard-active-bg);
      color: #f23038;
      .item-svg {
        display: flex;
      }
    }
  }
}
</style>
