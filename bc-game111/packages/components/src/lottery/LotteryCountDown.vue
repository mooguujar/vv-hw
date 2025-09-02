<script setup lang="ts" name="LotteryCountDown">
import { useCountDown } from '@tg/hooks'
import { computed, watch } from 'vue'

interface Props {
  time: number
}
const props = defineProps<Props>()
const emits = defineEmits(['onTime'])

const { start, reset, current } = useCountDown({ time: props.time * 1000, onFinish: () => {
  reset()
  start()
} })
start()

const minuteTens = computed(() => Math.floor(current.value.minutes / 60 / 10))
const minuteOnes = computed(() => current.value.minutes % 10)
const secondTens = computed(() => Math.floor((current.value.seconds % 60) / 10))
const secondOnes = computed(() => (current.value.seconds % 10))

watch(() => current.value.seconds, (n) => {
  if (current.value.minutes === 0) {
    if (n < 6) {
      emits('onTime', secondOnes.value)
    }
  }
})
</script>

<template>
  <div class="timer">
    <div class="digit-box">
      {{ minuteTens }}
    </div>
    <div class="digit-box">
      {{ minuteOnes }}
    </div>
    <div class="digit-box">
      :
    </div>
    <div class="digit-box">
      {{ secondTens }}
    </div>
    <div class="digit-box">
      <div style="transform: rotate(180deg);">
        {{ secondOnes }}
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --lot-timer-box-bg: white;
  --lot-timer-box-text-color: #f23038;
  --lot-timer-box-radius: 2rem;
  --lot-timer-box-first-clip: polygon(0px 20%, 40% 0px, 100% 0, 100% 100%, 0% 100%);
  --lot-timer-box-last-clip: polygon(0px 20%, 40% 0px, 100% 0, 100% 100%, 0% 100%);
  --lot-time-box-margin: 0 2rem;
  --lot-time-box-width: 18rem;
  --lot-time-box-border: none;
}
</style>

<style scoped lang="scss">
.timer {
  display: flex;
  align-items: center;
  font-size: 18rem;
  font-weight: 700;
}

.digit-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lot-timer-box-bg);
  color: var(--lot-timer-box-text-color);
  margin: var(--lot-time-box-margin);
  border-radius: var(--lot-timer-box-radius);
  border: var(--lot-time-box-border);
  width: var(--lot-time-box-width);
  height: 30rem;
}

.digit-box:first-child {
  clip-path: var(--lot-timer-box-first-clip);
}
.digit-box:last-child {
  transform: rotate(180deg);
  clip-path: var(--lot-timer-box-last-clip);
}
</style>
