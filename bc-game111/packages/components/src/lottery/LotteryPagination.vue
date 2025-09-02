<script setup lang="ts" name="LotteryPagination">
import { IconLotBack } from '@tg/icons'
import { computed } from 'vue'

interface Props {
  total: number
  curPage: number
}
const props = defineProps<Props>()
const emits = defineEmits(['last', 'next'])
const totalPage = computed(() => Math.ceil(props.total / 10))
</script>

<template>
  <div class="w-full center text-black text-[12rem] h-[70rem] bg-white">
    <div
      class="size-[36rem] text-[26rem] center rounded-[5rem] cursor-pointer"
      :class="[curPage === 1 ? 'pointer-events-none bg-[#EBEBEB] text-[#9DABC9]' : 'bg-[#F23038] text-[#fff]']"
      @click="emits('last')"
    >
      <IconLotBack />
    </div>
    <div class="min-w-[80rem] text-center font-[500]">
      {{ `${curPage}/${totalPage}` }}
    </div>
    <div
      class="size-[36rem] center rounded-[5rem] text-[26rem] cursor-pointer"
      :class="[curPage === totalPage ? 'pointer-events-none bg-[#EBEBEB] text-[#9DABC9]' : 'bg-[#F23038] text-[#fff]']"
      @click="emits('next')"
    >
      <IconLotBack class="rotate-180" />
    </div>
  </div>
</template>
