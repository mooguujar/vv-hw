<script lang="ts" setup>
  import { computed, reactive, ref, watch, defineEmits, withDefaults, defineProps } from 'vue';
  import { Table, Select, InputNumber } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  interface Props {
    modelValue: DataItem[];
    conditionTime: number[];
    currencyId: String; // 当前币种
    getDeatilId: String;
  }
  const props = withDefaults(defineProps<Props>(), {});
  interface DataItem {
    d: string;
    b: string;
  }

  const emit = defineEmits(['update:modelValue', 'update:conditionTime']);

  const redBagRainRef = ref(null);
  const columns = computed(() => [
    {
      title: t('table.system.system_index_table'),
      dataIndex: 'index',
      width: '10%',
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
  const dataSource = computed(() => props.modelValue);

  const onDelete = (key: string, index: number) => {
    dataSource.value.splice(index, 1);
  };
  const handleAdd = (data) => {
    if (props.getDeatilId) return false;
    const newData: DataItem = {
      d: '',
      b: '',
    };
    dataSource.value.push(newData);
  };
  function reset(data) {
    if (props.getDeatilId) return false;
    data.d = null;
    data.b = null;
  }
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
      <template #minDoor>
        <span
          >{{ $t('table.report.report_deposit_charge_money') }} ≥
          <cdIconCurrency :id="currencyId" class="w-5 mb-1"
        /></span>
      </template>
      <template #reward>
        <span
          >{{ $t('v.discount.activity.award') }} <cdIconCurrency :id="currencyId" class="w-5 mb-1"
        /></span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'miniDeposit'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              :disabled="!!getDeatilId"
              v-model:value="record.d"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'everyReward'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :stringMode="true"
              :controls="false"
              :disabled="!!getDeatilId"
              v-model:value="record.b"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div v-if="index > 0" class="flex justify-center">
            <a @click="handleAdd(record)" class="mr-4"
              ><img
                :src="RECT_ADD"
                :class="{ 'disabled-link': !!getDeatilId }"
                :style="{
                  'pointer-events': !!getDeatilId ? 'none' : 'auto',
                  opacity: !!getDeatilId ? 0.5 : 1,
                }"
            /></a>
            <a
              @click="onDelete(record, index)"
              :class="{ 'disabled-link': !!getDeatilId }"
              :style="{
                'pointer-events': !!getDeatilId ? 'none' : 'auto',
                opacity: !!getDeatilId ? 0.5 : 1,
              }"
              ><img :src="RECT_DELETE"
            /></a>
          </div>

          <div v-else class="flex justify-center">
            <a
              @click="handleAdd"
              class="mr-4"
              :class="{ 'disabled-link': !!getDeatilId }"
              :style="{
                'pointer-events': !!getDeatilId ? 'none' : 'auto',
                opacity: !!getDeatilId ? 0.5 : 1,
              }"
              ><img :src="RECT_ADD"
            /></a>
            <a
              @click="reset(record)"
              :class="{ 'disabled-link': !!getDeatilId }"
              :style="{
                'pointer-events': !!getDeatilId ? 'none' : 'auto',
                opacity: !!getDeatilId ? 0.5 : 1,
              }"
              ><img :src="RECT_DELETE"
            /></a>
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

  .disabled-link {
    cursor: not-allowed;
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
