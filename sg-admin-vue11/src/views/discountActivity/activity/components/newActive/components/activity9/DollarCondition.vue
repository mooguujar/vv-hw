<script lang="ts" setup>
  import { computed, ref, watch, withDefaults, defineProps } from 'vue';
  import { Table, Select, InputNumber } from 'ant-design-vue';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { isNotNumber, isStrictNumber } from '/@/utils/number';

  const { t } = useI18n();
  interface Props {
    modelValue: DataItem;
    currencyId: String; // 当前币种
  }
  const props = withDefaults(defineProps<Props>(), {});
  const modelValueRef = computed(() => props.modelValue);
  const emit = defineEmits(['update:modelValue']);
  const vRules1 = ref(false);
  const vRules2 = ref(false);
  interface DataItem {
    serial: [
      {
        day: number | undefined;
        deposit: string;
        bet: string;
        bonus: string;
      },
    ];
    jackpot: [
      {
        day: string | undefined;
        deposit: string;
        bet: string;
        bonus: string;
      },
    ];
  }
  const columns = [
    {
      slots: { title: 'fiedT' },
      dataIndex: 'day',
      minWidth: '20%',
      align: 'center',
    },
    {
      align: 'center',
      slots: { title: 'fiedD' },
      minWidth: '20%',
      dataIndex: 'deposit',
    },
    {
      align: 'center',
      slots: { title: 'fiedB' },
      minWidth: '20%',
      slot: 'reward',
      dataIndex: 'bet',
    },
    {
      align: 'center',
      slots: { title: 'fiedE' },
      minWidth: '20%',
      slot: 'reward',
      dataIndex: 'bonus',
    },
    {
      title: t('v.discount.activity.operation'),
      dataIndex: 'operation',
      width: 120,
      align: 'center',
    },
  ];
  const columns2 = [
    {
      slots: { title: 'fiedT' },
      dataIndex: 'day',
      minWidth: '20%',
      align: 'center',
    },
    {
      align: 'center',
      slots: { title: 'fiedD' },
      minWidth: '20%',
      dataIndex: 'deposit',
    },
    {
      align: 'center',
      slots: { title: 'fiedB' },
      minWidth: '20%',
      slot: 'reward',
      dataIndex: 'bet',
    },
    {
      align: 'center',
      slots: { title: 'fiedE' },
      minWidth: '20%',
      slot: 'reward',
      dataIndex: 'bonus',
    },
    {
      title: t('v.discount.activity.operation'),
      dataIndex: 'operation',
      width: 120,
      align: 'center',
    },
  ];

  const onDelete = (index: number, type: string) => {
    if (type === 'serial') {
      if (index === 0 && modelValueRef.value['serial'].length === 1) {
        modelValueRef.value['serial'].splice(index, 1, {
          day: undefined,
          deposit: '',
          bet: '',
          bonus: '',
        });
      } else {
        modelValueRef.value['serial'].splice(index, 1);
      }
    } else {
      if (index === 0 && modelValueRef.value['jackpot'].length === 1) {
        modelValueRef.value['jackpot'].splice(index, 1, {
          day: undefined,
          deposit: '',
          bet: '',
          bonus: '',
        });
      } else {
        modelValueRef.value['jackpot'].splice(index, 1);
      }
    }
  };
  const handleAdd = (index: number, type: string) => {
    if (type === 'serial') {
      modelValueRef.value['serial'].push({
        day: undefined,
        deposit: '',
        bet: '',
        bonus: '',
      });
    } else {
      modelValueRef.value['jackpot'].push({
        day: undefined,
        deposit: '',
        bet: '',
        bonus: '',
      });
    }
  };
  watch(
    modelValueRef,
    async (val) => {
      if (val) {
        const accumulated = modelValueRef.value.jackpot
          .map((p) => p.day)
          .filter((p) => isStrictNumber(p));
        const continuous = modelValueRef.value.serial
          .map((p) => p.day)
          .filter((p) => isStrictNumber(p));
        eventBus.emit('onmultipleText9', {
          value: accumulated.length ? accumulated : [],
          type: 'accumulated',
        });
        eventBus.emit('onmultipleText9', {
          value: continuous.length ? continuous : [],
          type: 'continuous',
        });
      }
    },

    { deep: true, immediate: true },
  );

  defineExpose({
    vRules1,
    vRules2,
  });
</script>

<template>
  <div class="flex w-full">
    <Table
      :data-source="modelValueRef.serial"
      :columns="columns"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
      class="flex-1"
      :class="{ 'verification-rules': vRules1 }"
    >
      <template #fiedT>
        <span class="header-th">
          {{ t('common.continuous_check') }}
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
          {{ t('v.discount.activity.amount_bonus') }}
          <cdIconCurrency :id="currencyId" class="w-5 mb-1" />
        </span>
      </template>
      <template #bodyCell="{ column, record, index }">
        <div v-if="column?.dataIndex === 'day'">
          <InputNumber
            v-model:value="record.day"
            :controls="false"
            size="large"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
            :class="{ 'ant-form-item-has-error': index !== 0 && isNotNumber(record.day) }"
          />
          <div v-if="isNotNumber(record.day)" class="ant-form-item-explain-error">
            {{ t('v.discount.activity.please_enter') }}
          </div>
        </div>
        <div v-else-if="column?.dataIndex === 'deposit'">
          <InputNumber
            v-model:value="record.deposit"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
          />
        </div>
        <div class="zyjuz_m" v-if="column?.dataIndex === 'bet'">
          <InputNumber
            v-model:value="record.bet"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
          />
        </div>
        <div v-if="column?.dataIndex === 'bonus'">
          <InputNumber
            v-model:value="record.bonus"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
          />
        </div>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="flex justify-center">
            <a @click="handleAdd(index, 'serial')" class="mr-4"><img :src="RECT_ADD" /></a>
            <a @click="onDelete(index, 'serial')"><img :src="RECT_DELETE" /></a>
          </div>
        </template>
      </template>
    </Table>
  </div>
  <div class="flex-1 mt-20px">
    <Table
      :data-source="modelValueRef?.jackpot"
      :columns="columns2"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
      class="flex-1"
      :class="{ 'verification-rules': vRules2 }"
    >
      <template #fiedT>
        <span class="header-th">
          {{ t('common.accumulated_check') }}
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
          {{ t('v.discount.activity.amount_bonus') }}
          <cdIconCurrency :id="currencyId" class="w-5 mb-1" />
        </span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <div v-if="column?.dataIndex === 'day'">
          <InputNumber
            v-model:value="record.day"
            :controls="false"
            size="large"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
            :class="{ 'ant-form-item-has-error': index !== 0 && isNotNumber(record.day) }"
          />
          <div v-if="isNotNumber(record.day)" class="ant-form-item-explain-error">
            {{ t('v.discount.activity.please_enter') }}
          </div>
        </div>
        <div v-else-if="column?.dataIndex === 'deposit'">
          <InputNumber
            v-model:value="record.deposit"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
          />
        </div>
        <div class="zyjuz_m" v-if="column?.dataIndex === 'bet'">
          <InputNumber
            v-model:value="record.bet"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
          />
        </div>
        <div v-if="column?.dataIndex === 'bonus'">
          <InputNumber
            v-model:value="record.bonus"
            :controls="false"
            size="large"
            :stringMode="true"
            :placeholder="$t('v.discount.activity.please_enter')"
            :min="0"
          />
        </div>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="flex justify-center">
            <a @click="handleAdd(index, 'jackpot')" class="mr-4"><img :src="RECT_ADD" /></a>
            <a @click="onDelete(index, 'jackpot')"><img :src="RECT_DELETE" /></a>
          </div>
        </template>
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
  .ant-form-item-explain-error {
    display: none;
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
          margin-top: 3px;
          bottom: -4px;
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
  .header-th {
    white-space: nowrap;
  }
</style>
