<template>
  <Form :model="inviteFriendsBonusTypeInfo" :ref="formref" :rules="rules">
    <span class="container" v-if="inviteFriendsBonusTypeSelected?.length">
      <div>{{ t('table.system.system_issue_way') }}</div>
      <div>{{ t('v.discount.activity.condition_1') }}</div>
      <div class="symbol">{{ t('v.discount.activity.symbol') }}</div>
      <div
        >{{ t('v.discount.activity.condition_2') }}
        <cdIconCurrency :icon="currencyLabel" class="w-20px h-20px ml-5px"
      /></div>
      <div
        >{{ t('v.discount.activity.amount_bonus') }}
        <cdIconCurrency :icon="currencyLabel" class="w-20px h-20px ml-5px"
      /></div>
    </span>
    <span
      class="container mb-10px"
      v-if="inviteFriendsBonusTypeSelected?.length && inviteFriendsBonusTypeSelected.includes(1)"
    >
      <div>{{ t('modalForm.finance.finance_fix_amount') }}</div>
      <div>{{ t('v.discount.activity.by_accumulated_deposit') }}</div>
      <div class="symbol">=</div>
      <Form.Item name="accumulatedDepositCondition"
        ><InputNumber
          v-model:value="inviteFriendsBonusTypeInfo.accumulatedDepositCondition"
          :placeholder="t('v.discount.activity.please_tip')"
          :min="1"
          :size="'large'"
          :precision="0"
          class="amount-percent"
      /></Form.Item>
      <Form.Item name="accumulatedDepositBonus">
        <InputNumber
          v-model:value="inviteFriendsBonusTypeInfo.accumulatedDepositBonus"
          :placeholder="t('v.discount.activity.amount_bonus')"
          :min="1"
          :size="'large'"
          :precision="0"
          class="amount-percent"
        />
      </Form.Item>
    </span>
    <span
      class="container mb-10px"
      v-if="inviteFriendsBonusTypeSelected?.length && inviteFriendsBonusTypeSelected.includes(2)"
    >
      <div>{{ t('modalForm.finance.finance_fix_amount') }}</div>
      <div>{{ t('v.discount.activity.by_valid_bet') }}</div>
      <div class="symbol">=</div>
      <Form.Item name="validBetCondition"
        ><InputNumber
          v-model:value="inviteFriendsBonusTypeInfo.validBetCondition"
          :placeholder="t('v.discount.activity.please_tip')"
          :min="1"
          :size="'large'"
          :precision="0"
          class="amount-percent"
      /></Form.Item>
      <Form.Item name="validBetBonus">
        <InputNumber
          v-model:value="inviteFriendsBonusTypeInfo.validBetBonus"
          :placeholder="t('v.discount.activity.amount_bonus')"
          :min="1"
          :size="'large'"
          :precision="0"
          class="amount-percent"
        />
      </Form.Item>
    </span>
    <span
      class="container"
      v-if="inviteFriendsBonusTypeSelected?.length && inviteFriendsBonusTypeSelected.includes(3)"
    >
      <div>
        <Select
          v-model:value="inviteFriendsBonusTypeInfo.singleDepositType"
          :options="rewardTypeOptions"
          :size="'large'"
          @change="handleSingleDepositTypeChange"
          class="amount-percent"
          :dropdownMatchSelectWidth="false"
        />
      </div>
      <div>{{ t('v.discount.activity.by_single_deposit') }}</div>
      <div class="symbol">≥</div>
      <Form.Item name="singleDepositCondition"
        ><InputNumber
          v-model:value="inviteFriendsBonusTypeInfo.singleDepositCondition"
          :placeholder="t('v.discount.activity.please_tip')"
          :min="1"
          :size="'large'"
          :precision="0"
          class="amount-percent"
      /></Form.Item>
      <Form.Item name="singleDepositBonus"
        ><InputNumber
          v-model:value="inviteFriendsBonusTypeInfo.singleDepositBonus"
          :placeholder="t('v.discount.activity.amount_bonus')"
          :min="inviteFriendsBonusTypeInfo.singleDepositType === 'percentage' ? 0.1 : 1"
          :step="inviteFriendsBonusTypeInfo.singleDepositType === 'percentage' ? 0.1 : 1"
          :precision="inviteFriendsBonusTypeInfo.singleDepositType === 'percentage' ? 1 : 0"
          :addonAfter="inviteFriendsBonusTypeInfo.singleDepositType === 'percentage' ? '%' : ''"
          class="amount-percent"
          :size="'large'"
      /></Form.Item>
    </span>
  </Form>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Form, InputNumber, Select } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = defineProps(['selectType', 'current', 'tableInfo']);
  const emit = defineEmits(['update:selectType', 'update:tableInfo']);

  const { t } = useI18n();

  const formref = ref();

  const currencyNameList = {
    '701': 'CNY',
    '702': 'BRL',
    '704': 'KVND',
    '705': 'THB',
    '703': 'INR',
    '706': 'USDT',
  };

  const rewardTypeOptions = [
    { value: 'fixed', label: t('modalForm.finance.finance_fix_amount') },
    { value: 'percentage', label: t('common.bonus_type2') },
  ];

  const rule = [
    { required: true, message: t('modalForm.warning.required'), trigger: ['change', 'blur'] },
  ];

  const rules = {
    accumulatedDepositCondition: rule,
    accumulatedDepositBonus: rule,
    validBetCondition: rule,
    validBetBonus: rule,
    singleDepositCondition: rule,
    singleDepositBonus: rule,
  };

  const currencyLabel = computed(() => currencyNameList[props.current]);

  const inviteFriendsBonusTypeSelected = computed({
    get() {
      return props.selectType;
    },
    set(value) {
      emit('update:selectType', value);
    },
  });
  const inviteFriendsBonusTypeInfo = computed({
    get() {
      return props.tableInfo;
    },
    set(value) {
      emit('update:tableInfo', value);
    },
  });

  const handleSingleDepositTypeChange = () => {
    inviteFriendsBonusTypeInfo.value.singleDepositBonus = undefined;
    inviteFriendsBonusTypeInfo.value.singleDepositCondition = undefined;
  };

  const validate = () => {
    return formref.value?.validate();
  };

  defineExpose({
    validate,
  });
</script>

<style scoped lang="less">
  .container {
    display: flex;
    width: 1000px;

    .symbol {
      justify-content: center;
    }

    .amount-percent {
      padding: 0;
    }

    :deep(.ant-form-item-explain-error) {
      text-align: left;
    }

    div,
    :deep(.ant-form-item) {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;
      padding: 8px 12px;

      // 可选：添加一些视觉样式
      text-align: center;

      // 宽度比例 2:2:1:4:4
      &:nth-child(1) {
        flex: 2;
      }

      &:nth-child(2) {
        flex: 2;
      }

      &:nth-child(3) {
        flex: 1;
      }

      &:nth-child(4) {
        flex: 2;
      }

      &:nth-child(5) {
        flex: 2;
      }
    }

    :deep(.ant-form-item-has-error) {
      .ant-input-number,
      .ant-input-number-affix-wrapper {
        border-color: #ff4d4f; /* 保持错误状态红色边框 */
      }

      /* 确保错误提示不影响布局 */
      .ant-form-item-explain {
        position: absolute;
        bottom: -22px;
        left: 0;
        white-space: nowrap;
      }
    }
  }
</style>
