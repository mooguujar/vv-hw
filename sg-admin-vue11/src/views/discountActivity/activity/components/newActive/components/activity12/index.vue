<script lang="ts" setup name="DollarWaves">
  import { computed, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  import { isNotNumber } from '/@/utils/number';

  interface Props {
    modelValue: String;
    firstCurrencyId: String;
    getDeatilId: String;
    form_data: object;
    initData: object;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);
  const dollarConditionRef12 = ref('dollarConditionRef12');
  function getData() {
    return props.initData['staticType' + props.form_data?.staticType][
      'adwardType' + props.form_data?.adwardType
    ];
  }

  function validate12() {
    const rule = setValidate12();
    dollarConditionRef12.value.vRules = rule;
    return rule;
  }
  function setValidate12() {
    return data.value.some((p) => {
      if (p.hasOwnProperty('d') && isNotNumber(p.d)) {
        return true;
      }
      if (p.hasOwnProperty('b') && isNotNumber(p.b)) {
        return true;
      }
      if (p.hasOwnProperty('e') && isNotNumber(p.e)) {
        return true;
      }
      return false;
    });
  }
  const currencyId = computed(() => props.modelValue);
  const data = computed(() => {
    if (
      !isNaN(props.form_data?.staticType) &&
      !isNaN(props.form_data?.adwardType) &&
      Object.keys(props.initData).length
    ) {
      return props.initData['staticType' + props.form_data?.staticType][
        'adwardType' + props.form_data?.adwardType
      ];
    } else {
      return [];
    }
  });

  defineExpose({
    conditionData: data.value,
    getData,
    validate12,
  });
</script>

<template>
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <dollar-condition
      ref="dollarConditionRef12"
      v-model="data"
      v-model:currencyId="currencyId"
      :form_data="form_data"
    />
    <!-- </div> -->
  </PageWrapper>
</template>
