<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  import { cloneDeep } from 'lodash-es';
  import eventBus from '/@/utils/eventBus';
  import { isStrictNumber } from '/@/utils/number';

  interface Props {
    modelValue: String;
    getDeatilId: String;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);
  const conditionData = ref({});
  const basicConValidate = ref(true);
  const conditionTime = ref([]);
  const currencyId = computed(() => props.modelValue);
  const deatilId = computed(() => props.getDeatilId);

  watch(
    () => currencyId.value,
    (n) => {
      if (n) {
        // eslint-disable-next-line no-prototype-builtins
        if (!conditionData.value?.hasOwnProperty(n)) {
          conditionData.value[n] = [{ d: '', b: '' }];
        }
      }
    },
    { deep: true, immediate: true },
  );
  watch(
    () => conditionData.value,
    () => {
      const current = conditionData.value[currencyId.value];

      const dList = current.map((r) => {
        const reward = Number(r.d);
        return isNaN(reward) ? 0 : reward;
      });
      const maxD = Math.max(...dList);
      const maxB = current.find((p) => p.d == maxD)?.b;
      eventBus.emit('onEvertMemberTextChange', { value: maxD, type: 'rechargeMoney13' });
      eventBus.emit('onEvertMemberTextChange', { value: maxB, type: 'rechargeBet13' });
    },
    { deep: true },
  );
  defineExpose({
    valide, //条件类型
    basicConValidate,
    conditionData, //表格数据
    getData,
  });

  async function valide() {
    const current = conditionData.value[currencyId.value];
    return current.some((p) => !isStrictNumber(p.d || p.b));
  }

  function getData() {
    const data = cloneDeep(conditionData.value);
    for (const key in data) {
      let rowData = data[key];
      if (rowData?.length === 1 && !rowData[0].d && !rowData[0].b) {
        delete data[key];
      }
    }
    return data;
  }
</script>

<template>
  <div>
    <dollar-condition
      ref="dollarConditionRef"
      v-model="conditionData[currencyId as keyof typeof conditionData]"
      v-model:conditionTime="conditionTime"
      v-model:currencyId="currencyId"
      v-model:getDeatilId="deatilId"
    />
  </div>
</template>
