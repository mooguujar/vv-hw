<script setup lang="ts">
  import ChargeDetail from './components/ChargeDetail.vue';
  // import ArbitraryMoney from './components/ArbitraryMoney.vue';
  // import RateMoney from './components/rateMoney.vue';
  import { computed, ref, watch } from 'vue';
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

  const props = defineProps<Props>();
  const chargeRef = ref<ChargeElement | null>(null);
  const arbitraryRef = ref<ArbitraryElement | null>(null);
  const rateRef = ref<RateElement | null>(null);
  const selectValue = computed(() => props.selectValue);
  const deatilId = computed(() => props.getDeatilId);

  const conditions = ref<any>({
    constants: {},
    arbitrary: {},
    rateMoney: {},
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
        // eslint-disable-next-line no-prototype-builtins
        if (!conditions.value.constants?.hasOwnProperty(n)) {
          conditions.value.constants[n] = [{ id: Date.now(), commission: '', min: '' }];
        }
      }
    },
    { deep: true, immediate: true },
  );
  watch(
    () => conditions.value,
    () => {
      const data = conditions.value.constants[props.current];
      const dList = data.map((r) => {
        const reward = Number(r.commission);
        return isNaN(reward) ? 0 : reward;
      });
      const maxD = Math.max(...dList);
      const maxB = data.find((p) => p.commission == maxD)?.min;
      eventBus.emit('onAgentMonthsDynamicText', {
        value: { commissionMin: maxD, rewardMax: maxB },
        type: 'list',
      });
    },
    { deep: true, immediate: true },
  );

  defineExpose({ overallVerification, conditions });
</script>
<template>
  <div class="w-70vw">
    <ChargeDetail
      v-if="selectValue == 1"
      :currency="current"
      :constants="conditions.constants?.[current]"
      :getDeatilId="deatilId"
      ref="chargeRef"
    />
  </div>
</template>
