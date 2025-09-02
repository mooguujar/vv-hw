<script setup lang='ts'>
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'

interface Props {
  result: string[]
}

defineOptions({ name: 'AppFiveDResult' })
const props = defineProps<Props>()

const { $$t } = useLocale()

const letters = ['A', 'B', 'C', 'D', 'E']

const total = computed(() => props.result.reduce((pre, cur) => {
  return pre + Number(cur)
}, 0))
</script>

<template>
  <div class="wrap">
    <div class="flex flex-col text-[13rem] font-[500] leading-[18rem] mr-[19.6rem] ">
      <span class="mb-[4rem]">{{ $$t('开奖') }}</span>
      <span>{{ $$t('结果') }}</span>
    </div>

    <div class="flex">
      <div class="flex">
        <div v-for="item, i in result" :key="i" class="flex flex-col items-center mr-[8rem] last-of-type:mr-0">
          <div class="ball">
            {{ item }}
          </div>
          <span class="mt-[1rem] leading-[20rem] text-[#6D7693] text-[14rem]">{{ letters[i] }}</span>
        </div>
      </div>
      <div class="h-[35rem] flex items-center text-[#000] ml-[5rem] mr-[4.64rem] text-[13rem]">
        =
      </div>
      <div class="ball total">
        {{ total }}
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.wrap {
  border-radius: 10rem;
  background: #fff;
  box-shadow: 0 0 10rem 0 rgba(0, 0, 0, 0.15);
  display: flex;
  color: #6d7693;
  padding: 10rem 13rem 7rem;
}
.ball {
  width: 35rem;
  height: 35rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1rem solid #000;
  background: #f4f4f4;
  font-size: 13rem;
  color: #000;
  &.total {
    color: #fff;
    background-color: #f23038;
    border-color: #f23038;
  }
}
</style>
