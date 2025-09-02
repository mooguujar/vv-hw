<script lang="ts" setup name="DollarWaves">
  import { computed, watch, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DollarCondition from './DollarCondition.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Row, Col, RadioGroup, Radio } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { getData } from '/@/views/member/vipGrade/components/VipDetails.data';

  interface Props {
    modelValue: String;
    firstCurrencyId: String;
    getDeatilId: String;
    form_data: object;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);

  const { t } = useI18n();
  const initData = ref({});

  const templateData = ref({
    recharge: {
      fixed: [
        {
          min_value: undefined,
          fixed: undefined,
        },
      ],
      random: [
        {
          min_value: undefined,
          range_min: undefined,
          range_max: undefined,
        },
      ],
      percentage: [
        {
          min_value: undefined,
          fixed: undefined,
        },
      ],
      random_percentage: [
        {
          min_value: undefined,
          range_min: undefined,
          range_max: undefined,
        },
      ],
    },
    loss: {
      fixed: [
        {
          min_value: undefined,
          fixed: undefined,
        },
      ],
      random: [
        {
          min_value: undefined,
          range_min: undefined,
          range_max: undefined,
        },
      ],
      percentage: [
        {
          min_value: undefined,
          fixed: undefined,
        },
      ],
      random_percentage: [
        {
          min_value: undefined,
          range_min: undefined,
          range_max: undefined,
        },
      ],
    },
    valid_bet: {
      fixed: [
        {
          min_value: undefined,
          fixed: undefined,
        },
      ],
      random: [
        {
          min_value: undefined,
          range_min: undefined,
          range_max: undefined,
        },
      ],
      percentage: [
        {
          min_value: undefined,
          fixed: undefined,
        },
      ],
      random_percentage: [
        {
          min_value: undefined,
          range_min: undefined,
          range_max: undefined,
        },
      ],
    },
  });
  const currencyId = computed(() => props.modelValue);
  const data = computed(() => {
    if (props.form_data?.reward_type && props.form_data?.amount_type) {
      return initData.value[currencyId.value][props.form_data?.reward_type][
        props.form_data?.amount_type
      ];
    } else {
      return [];
    }
  });
  const getData = function () {
    let data = cloneDeep(initData.value);
    for (const key in data) {
      data[key] = data[key][props.form_data?.reward_type][props.form_data?.amount_type];
    }
    return data;
  };
  watch(
    () => currencyId,
    (n) => {
      if (n) {
        // eslint-disable-next-line no-prototype-builtins
        if (!initData.value?.hasOwnProperty(n.value)) {
          initData.value[n.value] = cloneDeep(templateData.value);
        }
      }
    },
    { deep: true, immediate: true },
  );
  defineExpose({
    conditionData: data.value,
    initData,
    getData,
    templateData,
  });
</script>

<template>
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <div>
      <div class="flex-col">
        <div style="flex: 1">
          <Col :span="24">
            <dollar-condition
              ref="dollarConditionRef"
              v-model="data"
              v-model:currencyId="currencyId"
              :form_data="form_data"
              :templateData="templateData"
            />
          </Col>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
