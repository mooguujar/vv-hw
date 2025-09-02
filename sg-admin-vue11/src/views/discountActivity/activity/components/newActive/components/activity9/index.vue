<script lang="ts" setup name="DollarWaves">
  import { computed, nextTick, ref, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, isEqual } from 'lodash-es';
  import { isStrictNumber, isNotNumber } from '/@/utils/number';

  interface Props {
    modelValue: String;
    form_data: object;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);
  const dollarConditionRef = ref();
  const { t } = useI18n();

  const extra_conf = {
    period_1: {
      //连续签到奖励 如果没有配置传 [] 空的数组
      serial: [{ day: undefined, deposit: '', bet: '', bonus: '' }],
      //累计签到奖励 如果没有配置传 [] 空的数组
      jackpot: [{ day: undefined, deposit: '', bet: '', bonus: '' }],
    },
    period_2: {
      //连续签到奖励 如果没有配置传 [] 空的数组
      serial: [{ day: undefined, deposit: '', bet: '', bonus: '' }],
      //累计签到奖励 如果没有配置传 [] 空的数组
      jackpot: [{ day: undefined, deposit: '', bet: '', bonus: '' }],
    },
  };
  const conditionData = ref({});
  const currencyId: any = computed(() => props.modelValue);
  const tableData: any = computed(() => {
    const period = props.form_data.period == 1 ? 'period_1' : 'period_2';
    return conditionData.value[currencyId.value][period];
  });

  watch(
    () => currencyId.value,
    (n) => {
      if (!conditionData.value?.hasOwnProperty(n)) {
        conditionData.value[n] = cloneDeep(extra_conf);
      }
    },
    { immediate: true, deep: true },
  );

  async function valide() {
    const vRules1 = tableData.value['serial'].some(
      (p, index) => index != 0 && isStrictNumber(p.bonus) && isNotNumber(p.day),
    );
    const vRules2 = tableData.value['jackpot'].some(
      (p, index) => index != 0 && isStrictNumber(p.bonus) && isNotNumber(p.day),
    );
    dollarConditionRef.value.vRules1 = vRules1;
    dollarConditionRef.value.vRules2 = vRules2;
    return vRules1 || vRules2;
  }

  function getData() {
    let data = cloneDeep(conditionData.value);
    // Object.values(data).forEach((item) => {
    //   if (item.extra == 0) {
    //     item.period_1.serial = [];
    //     item.period_1.jackpot = [];
    //     item.period_2.serial = [];
    //     item.period_2.jackpot = [];
    //   } else {
    //     item.period_1.serial = item.period_1.serial; //.filter((p) => !isEqual(p));
    //     item.period_1.jackpot = item.period_1.jackpot; //.filter((p) => !isEqual(p));
    //     item.period_2.serial = item.period_2.serial; //.filter((p) => !isEqual(p));
    //     item.period_2.jackpot = item.period_2.jackpot; //.filter((p) => !isEqual(p));
    //   }
    // });
    return data;
  }
  defineExpose({
    valide, //条件类型
    conditionData, //表格数据
    getData,
  });
</script>

<template>
  <PageWrapper :contentStyle="{ marginLeft: '-25px' }">
    <dollar-condition
      ref="dollarConditionRef"
      v-model="tableData"
      :form_data="form_data"
      v-model:currencyId="currencyId"
    />
  </PageWrapper>
</template>
<style scoped>
  :deep(.ant-form-item-control-input-content) {
    .doorsillSelect {
      width: 150px;
    }

    .doorsillInput {
      width: 350px !important;
    }
  }

  p {
    margin-bottom: 0;
  }
</style>
