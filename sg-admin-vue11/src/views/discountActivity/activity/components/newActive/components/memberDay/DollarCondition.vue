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
    conditionType: ConditionType;
    conditionTime: number[];
    firstCurrencyId: String; // 首币种
    currencyId: String; // 当前币种
    firstConditionData: String[];
    deleteKey: Number | String;
    currencyName: string;
    type: String;
    getDeatilId: String;
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
        // dollarPercent: '',
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
    /** 红包占比 */
    // dollarPercent: string;
    conditionType: string;
    // conditionTime: string[];
    everyReward: string;
    // everyReward: string;
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
  const dataSource = ref(props.modelValue.map((item, idx) => ({ ...item })));
  const isDisabled = computed(() =>
    props.type == 'rechargeDay' || props.type == 'memberDay'
      ? true
      : props.firstCurrencyId == props.currencyId,
  );

  const onDelete = (key: string) => {
    dataSource.value = dataSource.value.filter((item) => item.key !== key);
    emit('update:deleteKey', key);
  };
  const handleAdd = () => {
    if (props.getDeatilId) return false;
    count.value++;
    const newData: DataItem = {
      key: `${count.value}`,
      index: `${count.value}`,
      type: props.conditionType,
      conditionType: '1',
      miniDeposit: '',
      chipsMultiple: '',
      everyReward: '',
      // dollarPercent: '',
    };
    dataSource.value.push(newData);
  };
  function reset(data) {
    if (props.getDeatilId) return false;
    data.conditionType = null;
    data.miniDeposit = null;
    data.chipsMultiple = null;
    data.everyReward = null;
    // data.dollarPercent = null;
  }

  watch(
    dataSource,
    async (val) => {
      await emit('update:modelValue', val);
      // calcValidTimeList();
    },

    { deep: true, immediate: true },
  );
  watch(
    () => props.modelValue,
    (newValue, old) => {
      if (JSON.stringify(newValue) !== JSON.stringify(old)) {
        dataSource.value = newValue.map((item, idx) => ({
          ...item,
        }));
      }
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
      <template #minDoor>
        <span
          >{{ $t('table.report.report_deposit_charge_money') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #reward>
        <span
          >{{ $t('v.discount.activity.award') }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
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
              v-model:value="record.miniDeposit"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'everyReward'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              :disabled="!!getDeatilId"
              v-model:value="record.everyReward"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div v-if="isDisabled">
            <div v-if="index > 0" class="flex justify-center">
              <a @click="handleAdd" class="mr-4"
                ><img
                  :src="RECT_ADD"
                  :class="{ 'disabled-link': !!getDeatilId }"
                  :style="{
                    'pointer-events': !!getDeatilId ? 'none' : 'auto',
                    opacity: !!getDeatilId ? 0.5 : 1,
                  }"
              /></a>
              <a
                @click="onDelete(record.key)"
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
          </div>
          <div v-else class="text-center">-</div>
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
