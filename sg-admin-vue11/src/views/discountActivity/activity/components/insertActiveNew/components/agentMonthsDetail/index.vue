<script setup lang="ts">
  import ChargeDetail from './components/ChargeDetail.vue';
  // import ArbitraryMoney from './components/ArbitraryMoney.vue';
  // import RateMoney from './components/rateMoney.vue';
  import { computed, nextTick, ref, watch } from 'vue';
  import eventBus from '/@/utils/eventBus';

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

  const currencyNameList = {
    '701': 'CNY',
    '702': 'BRL',
    '704': 'KVND',
    '705': 'THB',
    '703': 'INR',
    '706': 'USDT',
  };

  const props = defineProps<Props>();
  const chargeRef = ref<ChargeElement | null>(null);
  const arbitraryRef = ref<ArbitraryElement | null>(null);
  const rateRef = ref<RateElement | null>(null);
  const currentValue = computed(() => currencyNameList[props.current]);
  const selectValue = computed(() => props.selectValue);
  const deatilId = computed(() => props.getDeatilId);

  const conditions = ref<any>({
    constants: {},
    arbitrary: {},
    rateMoney: {},
  });
  Object.keys(currencyNameList).forEach((key) => {
    conditions.value.constants[key] = [{ id: 0, charge: '', reward: '' }];
    conditions.value.arbitrary[key] = [{ id: 0, charge: '', reward: ['', ''] }];
    conditions.value.rateMoney[key] = [{ id: 0, charge: '', rewardRate: '', rewardLimit: '' }];
  });
  async function overallVerification() {
    try {
      if (selectValue.value === 1 && chargeRef.value) {
        await chargeRef.value.chargeFormRefVal();
      }
      if (selectValue.value === 2 && arbitraryRef.value) {
        await arbitraryRef.value.arbFormRefVal();
      }
      if (selectValue.value === 3 && rateRef.value) {
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
      const minAndMax = { commissionMin: {}, rewardMax: {} };
      const tableData = conditions.value['constants'];
      const keys = Object.keys(currencyNameList);

      minAndMax['commissionMin'] = keys.reduce((pre, item) => {
        const current = tableData[item];
        const commissionList = current.map((c) => {
          const commissionNum = Number(c.charge);
          return isNaN(commissionNum) ? 0 : commissionNum;
        });
        pre[item] = Math.min(...commissionList);
        return pre;
      }, {});

      minAndMax['rewardMax'] = keys.reduce((pre, item) => {
        const current = tableData[item];
        const rewardList = current.map((r) => {
          const rewardNum = Number(r.reward);
          return isNaN(rewardNum) ? 0 : rewardNum;
        });
        pre[item] = Math.max(...rewardList);
        return pre;
      }, {});
      eventBus.emit('onAgentMonthsDynamicText', { value: minAndMax, type: 'list' });
    },
    { deep: true, immediate: true },
  );

  defineExpose({ overallVerification, conditions });
</script>
<template>
  <div class="ml-11.5 w-80vw" @click="() => {}">
    <ChargeDetail
      v-if="selectValue == 1"
      :currency="currentValue"
      :constants="conditions.constants?.[current]"
      :getDeatilId="deatilId"
      ref="chargeRef"
    />
    <!-- <ArbitraryMoney
      v-if="selectValue == 2"
      :currency="currentValue"
      :arbitrary="conditions.arbitrary?.[current]"
      ref="arbitraryRef"
    />
    <RateMoney
      v-if="selectValue == 3"
      :currency="currentValue"
      :rate-money="conditions.rateMoney?.[current]"
      ref="rateRef"
    /> -->
  </div>
</template>
