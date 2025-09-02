<script setup lang="ts">
  import ChargeDetail from './components/ChargeDetail.vue';
  import ArbitraryMoney from './components/ArbitraryMoney.vue';
  import RateMoney from './components/rateMoney.vue';
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import eventBus from '/@/utils/eventBus';
  import { currentyOptions } from '/@/views/common/commonSetting';

  interface Props {
    current: number | string;
    selectValue: number;
    getDeatilId: String;
  }
  interface ChargeElement extends HTMLElement {
    chargeFormRefVal: () => void;
  }
  interface ArbitraryElement extends HTMLElement {
    arbFormRefVal: () => void;
  }
  interface RateElement extends HTMLElement {
    rateFormRefVal: () => void;
  }

  const props = defineProps<Props>();
  const chargeRef = ref<ChargeElement | null>(null);
  const arbitraryRef = ref<ArbitraryElement | null>(null);
  const rateRef = ref<RateElement | null>(null);
  const currentValue = computed(() => currentyOptions[props.current]);
  const selectValue = computed(() => props.selectValue);
  const deatilId = computed(() => props.getDeatilId);

  const conditions = ref<any>({
    constants: {},
    arbitrary: {},
    rateMoney: {},
  });
  Object.keys(currentyOptions).forEach((key) => {
    conditions.value.constants[key] = [{ id: 0, charge: '', reward: '' }];
    conditions.value.arbitrary[key] = [{ id: 0, charge: '', reward: ['', ''] }];
    conditions.value.rateMoney[key] = [{ id: 0, charge: '', rewardRate: '', rewardLimit: '' }];
  });
  async function overallVerification() {
    try {
      if (selectValue.value == 1 && chargeRef.value) {
        await chargeRef.value.chargeFormRefVal();
      }
      if (selectValue.value == 2 && arbitraryRef.value) {
        await arbitraryRef.value.arbFormRefVal();
      }
      if (selectValue.value == 3 && rateRef.value) {
        await rateRef.value.rateFormRefVal();
      }

      return true;
    } catch (error) {
      console.error('校验失败：', error);
      return false;
    }
  }
  watch(
    () => props.current,
    (n) => {
      if (n) {
        nextTick(() => {
          overallVerification();
        });
      }
    },
  );
  watch(
    () => conditions.value,
    () => {
      const moneyObj = { 1: {}, 2: {}, 3: {} };
      const keys = Object.keys(currentyOptions);

      moneyObj[1] = keys.reduce((pre, item) => {
        const current = conditions.value.constants[item];
        const rewardList = current.map((r) => {
          const reward = Number(r.reward);
          return isNaN(reward) ? 0 : reward;
        });
        pre[item] = Math.max(...rewardList);
        return pre;
      }, {});
      moneyObj[2] = keys.reduce((pre, item) => {
        const current = conditions.value.arbitrary[item];
        const rewardList = current.map((r) => {
          const reward = Number(r.reward[1]);
          return isNaN(reward) ? 0 : reward;
        });
        pre[item] = Math.max(...rewardList);
        return pre;
      }, {});
      moneyObj[3] = keys.reduce((pre, item) => {
        const current = conditions.value.rateMoney[item];
        const rateList = current.map((r) => {
          const rate = Number(r.rewardRate);
          return isNaN(rate) ? 0 : rate;
        });
        pre[item] = `${Math.max(...rateList)}%`;
        return pre;
      }, {});

      eventBus.emit('onChargeDynamicText', { value: moneyObj, type: 'tableData' });
    },
    { deep: true, immediate: true },
  );

  onMounted(() => {
    eventBus.emit('formChange_m', 1);
  });

  defineExpose({ overallVerification, conditions });
</script>
<template>
  <div class="w-80vw" @click="() => {}">
    <!-- 固定金额 -->
    <ChargeDetail
      v-if="selectValue == 1"
      :currency="currentValue"
      :constants="conditions.constants?.[current]"
      :getDeatilId="deatilId"
      ref="chargeRef"
    />
    <!-- 随机金额 -->
    <ArbitraryMoney
      v-if="selectValue == 2"
      :currency="currentValue"
      :arbitrary="conditions.arbitrary?.[current]"
      :getDeatilId="deatilId"
      ref="arbitraryRef"
    />
    <!-- 比例金额 -->
    <RateMoney
      v-if="selectValue == 3"
      :currency="currentValue"
      :rate-money="conditions.rateMoney?.[current]"
      :getDeatilId="deatilId"
      ref="rateRef"
    />
  </div>
</template>
