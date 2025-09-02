<script lang="ts" setup>
  import { computed, ref, watch, defineEmits, withDefaults, defineProps } from 'vue';
  import { Table, InputNumber } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  interface Props {
    modelValue: DataItem[];
    conditionType: ConditionType;
    conditionTime: number[];
    firstCurrencyId: String; // 首币种
    currencyId: String; // 当前币种
    firstConditionData: String[];
    deleteKey: Number | String;
    currencyName: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [
      {
        key: '1',
        index: '1',
        type: '1',
        conditionType: '1',
        miniDeposit: '',
        chipsMultiple: '',
        everyReward: '',
      },
    ],
    conditionType: '1',
  });

  interface DataItem {
    key: string;
    index: string;
    /** 条件类型 */
    type: ConditionType;
    /** 最低存款 */
    miniDeposit: string;
    /** 打码倍数 */
    chipsMultiple: string;
    conditionType: string;
    everyReward: string;
  }

  const emit = defineEmits([
    'update:modelValue',
    'update:conditionType',
    'update:conditionTime',
    'update:deleteKey',
  ]);

  type ConditionType = '1' | '2' | '3' | '4' | '5' | '6';

  const count = ref(1);
  const redBagRainRef = ref(null);
  const currencyName = computed(() => props.currencyName);
  // 领取条件表格列配置
  const columns: any = computed(() => [
    {
      title: t('v.discount.activity.class'),
      dataIndex: 'index',
      width: '8%',
      align: 'center',
    },
    {
      title: t('v.discount.activity.condition'),
      dataIndex: 'type',
      align: 'center',
    },
    {
      slots: { title: 'minDoor' },
      dataIndex: 'miniDeposit',
      align: 'center',
    },
    {
      slots: { title: 'reward' },
      dataIndex: 'everyReward',
      align: 'center',
    },
    {
      title: t('v.discount.activity.operation'),
      dataIndex: 'operation',
      align: 'center',
    },
  ]);
  // 领取条件表格数据
  const dataSource = computed(() => props.modelValue);
  // 是否禁用
  const isDisabled = computed(() => props.firstCurrencyId == props.currencyId);
  // 删除领取条件
  const onDelete = (index: number) => {
    dataSource.value.splice(index, 1);
    emit('update:deleteKey', index);
  };
  // 添加领取条件
  const handleAdd = () => {
    count.value++;
    const newData: DataItem = {
      key: `${count.value}`,
      index: `${count.value}`,
      type: props.conditionType,
      conditionType: '1',
      miniDeposit: '', // 最低打码量
      chipsMultiple: '', // 打码倍数
      everyReward: '', // 每日奖励
    };
    dataSource.value.push(newData);
  };

  // 重置领取条件
  function reset(data) {
    data.conditionType = null;
    data.miniDeposit = null;
    data.chipsMultiple = null;
    data.everyReward = null;
  }

  // 监听领取条件数据变化
  watch(
    dataSource,
    async (newValue) => {
      await emit('update:modelValue', newValue);
    },

    { deep: true, immediate: true },
  );
</script>

<template>
  <div>
    <Table
      :data-source="dataSource"
      :columns="columns"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
    >
      <!-- 最低打码量 -->
      <template #minDoor>
        <span
          >{{ $t('v.discount.activity.Effective_coding') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <!-- 每日奖励 -->
      <template #reward>
        <span
          >{{ $t('v.discount.activity.award') }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <!-- 每日奖励 -->
      <template #getLimitMax>
        <span
          >{{ $t('v.discount.activity.Maximum_entitlement') }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <!-- 条件类型 -->
        <template v-else-if="column.dataIndex === 'type'">
          <div>{{ $t('v.discount.activity.Punch_code') }}</div>
        </template>
        <!-- 最低打码量 -->
        <template v-else-if="column.dataIndex === 'miniDeposit'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.miniDeposit"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <!-- 每日奖励 -->
        <template v-else-if="column.dataIndex === 'everyReward'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              v-model:value="record.everyReward"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <!-- 操作 -->
        <template v-else-if="column.dataIndex === 'operation'">
          <div>
            <!-- 删除领取条件 -->
            <div v-if="index > 0" class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="onDelete(index)"><img :src="RECT_DELETE" /></a>
            </div>
            <!-- 添加领取条件 -->
            <div v-else class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="reset(record)"><img :src="RECT_DELETE" /></a>
            </div>
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
