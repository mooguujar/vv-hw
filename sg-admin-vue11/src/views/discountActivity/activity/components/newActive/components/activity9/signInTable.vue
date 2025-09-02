<script lang="ts" setup>
  import { computed, ref, watch, defineEmits, withDefaults, defineProps } from 'vue';
  import { Table, InputNumber } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isNotNumber } from '/@/utils/number';
  import { mweekly, monthly } from '/@/views/discountActivity/activity/common/setting.ts';

  const { t } = useI18n();
  const vRules = ref(false);
  interface Props {
    modelValue: [];
    currencyId: String; // 当前币种
    form_data: object;
  }
  const props = withDefaults(defineProps<Props>(), {});

  const emit = defineEmits(['update:modelValue']);
  const currencyId = computed(() => props.currencyId);
  const column = [
    {
      align: 'center',
      width: '25%',
      slots: { title: 'fiedT' },
      dataIndex: 'day',
    },
    {
      align: 'center',
      slots: { title: 'fiedD' },
      width: '25%',
      dataIndex: 'deposit',
    },
    {
      align: 'center',
      slots: { title: 'fiedB' },
      width: '25%',
      slot: 'reward',
      dataIndex: 'bet',
    },
    {
      align: 'center',
      slots: { title: 'fiedE' },
      width: '25%',
      slot: 'reward',
      dataIndex: 'bonus',
    },
  ];
  const modelValueRef = computed(() => props.modelValue);
  const minimumThreshold = computed(() =>
    props.form_data?.type === 1
      ? t('v.discount.activity.amount_bonus')
      : props.form_data?.type === 2
      ? t('common.recharge_ratio')
      : t('common.code_ratio'),
  );
  const redBagRainRef = ref(null);
  const key = ref(0);

  watch(
    () => props.form_data?.type,
    (newValue, old) => {
      key.value += 1;
      vRules.value = false;
    },
    { deep: true, immediate: true },
  );
  // watch(
  //   () => props.form_data?.adwardType,
  //   (newValue, old) => {
  //     key.value += 1;
  //     vRules.value = false;
  //   },
  //   { deep: true, immediate: true },
  // );

  function tiutleaaa(day) {
    return props.form_data.period == 1 ? mweekly[day - 1].label : monthly[day - 1].label;
  }
  defineExpose({
    vRules,
  });
</script>

<template>
  <div>
    <Table
      :data-source="modelValueRef"
      :columns="column"
      size="small"
      ref="redBagRainRef"
      :pagination="false"
      :style="{ width: '100%', overflow: 'auto' }"
      :key="key"
      :scroll="{ y: 390 }"
      :class="{ 'verification-rules': vRules }"
    >
      <template #fiedT>
        <span class="header-th">
          {{ t('common.sign_in') }}
        </span>
      </template>
      <template #fiedD>
        <span class="header-th">
          {{ t('v.discount.activity.recharge_amount') }}
          <cdIconCurrency :id="currencyId" class="w-5 mb-1" />
        </span>
      </template>
      <template #fiedB>
        <span class="header-th">
          {{ t('v.discount.activity.Effective_coding') }}
          <cdIconCurrency :id="currencyId" class="w-5 mb-1" />
        </span>
      </template>
      <template #fiedE>
        <span class="header-th">
          {{ minimumThreshold }}
          <cdIconCurrency :id="currencyId" class="w-5 mb-1" v-if="form_data?.type == 1" />
          <span v-else>(%)</span>
        </span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <div v-if="column?.dataIndex === 'day'">
          {{ tiutleaaa(record.day) }}
        </div>
        <div v-if="column?.dataIndex === 'deposit'">
          <InputNumber
            v-model:value="record.deposit"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
            :class="{ 'ant-form-item-has-error': isNotNumber(record.d) }"
          />
          <!-- <div v-if="isNotNumber(record.d)" class="ant-form-item-explain-error">
            {{ t('v.discount.activity.please_enter') + minimumThreshold }}
          </div> -->
        </div>
        <div v-if="column?.dataIndex === 'bet'">
          <InputNumber
            v-model:value="record.bet"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
            :class="{ 'ant-form-item-has-error': isNotNumber(record.b) }"
          />
          <!-- <div v-if="isNotNumber(record.b)" class="ant-form-item-explain-error">
            {{ t('common.translate.word52_r') }}
          </div> -->
        </div>
        <div v-if="column?.dataIndex === 'bonus'">
          <InputNumber
            v-model:value="record.bonus"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
            :class="{ 'ant-form-item-has-error': isNotNumber(record.e) }"
          />
          <!-- <div v-if="isNotNumber(record.d)" class="ant-form-item-explain-error">
            {{ t('v.discount.activity.please_enter') + minimumThreshold }}
          </div> -->
        </div>
      </template>
    </Table>
  </div>
</template>

<style lang="less" scoped>
  .chips-range {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 7px;
  }

  .select__fontBig__class {
    ::v-deep(.ant-select-selection-placeholder) {
      font-size: 16px !important;
      text-align: left !important;
    }
  }

  .divider {
    width: 20px;
    height: 2px;
    margin: 0 2px;
    background-color: #e1e1e1;
  }

  .disabled-link {
    cursor: not-allowed;
  }

  .zyjuz_m {
    display: flex;
    flex-direction: column;
    align-items: center;

    > div:first-child {
      display: flex;
      align-items: center;
    }

    span {
      // line-height: 38px;
      margin: 0 4px;
    }

    .ant-input-number {
      flex-grow: 1;
      height: 38px;
    }
  }

  .ant-form-item-explain-error {
    display: none;
  }

  // .header-th::before {
  //   content: '*';
  //   display: inline-block;
  //   margin-right: 4px;
  //   color: #ff4d4f;
  //   font-family: SimSun, sans-serif;
  //   font-size: 14px;
  //   line-height: 1;
  // }
  .header-th {
    white-space: nowrap;
  }
  .verification-rules {
    .ant-form-item-explain-error {
      width: 100%;
      color: #e91134;
      text-align: left;
    }

    :deep(.ant-input-number-input-wrap) {
      width: 100%;
    }

    .ant-form-item-has-error.ant-input-number {
      border-color: #f53851;
      box-shadow: 0 0 0 2px rgb(233 17 52 / 20%) !important;
    }

    .ant-form-item-explain-error {
      display: block;
    }

    :deep(.ant-table-tbody) {
      .ant-table-cell {
        position: relative;
        padding: 20px 10px;
        overflow: hidden;

        .ant-form-item-explain-error {
          position: absolute;
          bottom: 0;
          left: 10px;
        }
      }
    }
  }

  :deep(.ant-table-thead > tr > th) {
    border-bottom: none;
    background-color: #fff !important;
  }

  :deep(.ant-table-row:nth-of-type(odd)) {
    background-color: #fff !important;
  }

  :deep(.ant-table-tbody > tr > td) {
    border-bottom: none;
  }

  :deep(
      .ant-table-thead
        > tr
        > th:not(:last-child):not(.ant-table-selection-column):not(
          .ant-table-row-expand-icon-cell
        ):not([colspan])::before
    ) {
    width: 0;
  }
</style>
