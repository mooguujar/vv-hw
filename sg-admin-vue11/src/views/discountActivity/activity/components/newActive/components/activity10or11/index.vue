<script setup lang="ts">
  import ChargeDetail from './components/ChargeDetail.vue';
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

  const conditions = ref<any>({});
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
        if (!conditions.value?.hasOwnProperty(n)) {
          conditions.value[n] = [{ id: Date.now(), commission: '', min: '' }];
        }
      }
    },
    { deep: true, immediate: true },
  );
  watch(
    () => conditions.value,
    () => {
      const minAndMax = { commissionMin: {}, rewardMax: {} };
      const tableData = conditions.value;
      const keys = Object.keys(tableData);
      minAndMax['commissionMin'] = keys.reduce((pre, item) => {
        const current = tableData[item];
        const commissionList = current.map((c) => {
          const commissionNum = Number(c.commission);
          return isNaN(commissionNum) ? 0 : commissionNum;
        });
        pre[item] = Math.min(...commissionList);
        return pre;
      }, {});

      minAndMax['rewardMax'] = keys.reduce((pre, item) => {
        const current = tableData[item];
        const rewardList = current.map((r) => {
          const rewardNum = Number(r.min);
          return isNaN(rewardNum) ? 0 : rewardNum;
        });
        pre[item] = Math.max(...rewardList);
        return pre;
      }, {});
      eventBus.emit('onAgentDaysDynamicText', { value: minAndMax, type: 'list' });
    },
    { deep: true, immediate: true },
  );

  defineExpose({ overallVerification, conditions });
</script>
<template>
  <div class="w-70vw">
    <ChargeDetail
      :currency="current"
      :constants="conditions?.[current]"
      :getDeatilId="deatilId"
      ref="chargeRef"
    />
  </div>
</template>
