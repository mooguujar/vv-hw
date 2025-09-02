<template>
  <div>
    <Table
      bordered
      :data-source="dataSource"
      :columns="columns"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
    >
      <template #deposit>
        <span
          >{{ $t('table.report.report_deposit_charge_money') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #amount1>
        <span
          >{{ $t('table.report.report_deposit_charge_money') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <!-- <template #award>
        <span>{{ $t('table.report.award') }} </span>
        <cdIconCurrency :icon="currencyName" class="w-5 ml-5px mb-1" />
      </template> -->
      <template #amount>
        <span
          >{{ $t('table.report.Effective_coding') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #award>
        <span
          >{{
            rewardMethodsSelected == 2 ? $t('common.active_text131') : $t('common.active_text13')
          }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1" />
        </span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <template v-else-if="column.dataIndex === 'deposit'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              :disabled="!!getDeatilId"
              v-model:value="record.deposit"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'award'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              :stringMode="true"
              :disabled="!!getDeatilId"
              v-model:value="record.award"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'amount'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              :disabled="!!getDeatilId"
              v-model:value="record.amount"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'award'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              :stringMode="true"
              :disabled="!!getDeatilId"
              v-model:value="record.award"
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
              <!-- <a
                @click="reset(record)"
                :class="{ 'disabled-link': !!getDeatilId }"
                :style="{
                  'pointer-events': !!getDeatilId ? 'none' : 'auto',
                  opacity: !!getDeatilId ? 0.5 : 1,
                }"
                ><img :src="RECT_DELETE"
              /></a> -->
            </div>
          </div>
          <div v-else class="text-center">-</div>
        </template>
      </template>
    </Table>
  </div>
</template>
<script lang="ts" setup>
  import {
    computed,
    reactive,
    ref,
    watch,
    defineEmits,
    withDefaults,
    defineProps,
    onUnmounted,
  } from 'vue';
  import { Table, Select, InputNumber } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import eventBus from '/@/utils/eventBus';

  const { t } = useI18n();

  interface Props {
    modelValue: any[];
    platform_range: number;
    current_platform_ids: Array<any>;
    plateOptions: Array<any>;
    conditionData2: object;
    conditionType: ConditionType;
    conditionTime: number[];
    firstCurrencyId: String; // 首币种
    currencyId: String; // 当前币种
    firstConditionData: String[];
    deleteKey: Number | String;
    currencyName: string;
    type: number;
    getDeatilId: String | boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [
      {
        key: '1',
        index: '1',
        type: '1',
        conditionType: '1',
        deposit: '',
        award: '',
        amount: '',
        award: '',
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
    'update:conditionData2',
  ]);

  type ConditionType = '1' | '2' | '3' | '4' | '5' | '6';

  const count = ref(1);
  const redBagRainRef = ref(null);
  const currencyName = computed(() => props.currencyName);
  const columns = computed(() => {
    let arr4 = [
      {
        slots: { title: 'deposit' },
        dataIndex: 'deposit',
        align: 'center',
      },
      {
        slots: { title: 'award' },
        dataIndex: 'award',
        align: 'center',
      },
    ];
    let arr5 = [
      {
        slots: { title: 'amount' },
        dataIndex: 'amount',
        align: 'center',
      },
      {
        slots: { title: 'award' },
        dataIndex: 'award',
        align: 'center',
      },
    ];
    let arr8 = [
      {
        slots: { title: 'amount1' },
        dataIndex: 'amount',
        align: 'center',
      },
      {
        slots: { title: 'award' },
        dataIndex: 'award',
        align: 'center',
      },
    ];
    let currentarr = props.type == 4 ? [...arr4] : props.type == 8 ? [...arr8] : [...arr5];
    let arr = [
      {
        title: t('table.system.system_index_table'),
        dataIndex: 'index',
        width: '10%',
        align: 'center',
      },
      ...currentarr,
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'operation',
        align: 'center',
      },
    ];
    return arr;
  });
  const dataSource = ref(props.modelValue.map((item, idx) => ({ ...item })));
  const isDisabled = computed(() => true);
  const configuration = ref(1);

  eventBus.on('change_configuration', (value1: any) => {
    configuration.value = value1;
  });
  const onDelete = (key: string, arr2, key2, index) => {
    if (arr2 && arr2[key2].length) {
      arr2[key2] = arr2[key2].filter((item) => item.key !== key);
      emit('update:conditionData2', arr2);
    } else {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
      emit('update:deleteKey', key);
    }
  };
  const handleAdd = (conditionData2_key, index) => {
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
    if (conditionData2_key.length) {
      conditionData2_key.push(newData);
    } else {
      dataSource.value.push(newData);
    }
  };

  function reset(data) {
    if (props.getDeatilId) return false;
    data.conditionType = null;
    data.miniDeposit = null;
    data.chipsMultiple = null;
    data.everyReward = null;
    // data.dollarPercent = null;
  }

  const rewardMethodsSelected = ref(1);
  eventBus.on('onRewardMethodsChange', (data: any) => {
    rewardMethodsSelected.value = data;
  });
  onUnmounted(() => {
    eventBus.off('change_configuration');
    eventBus.off('onRewardMethodsChange');
  });
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
        dataSource.value = newValue;
        count.value = newValue.length > 0 ? newValue.length : 1;
        // ?.map((item, idx) => ({
        //   ...item,
        // }));
      }
    },
    { deep: true, immediate: true },
  );
</script>

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

  :deep(.rounded-xs) {
    border-radius: 3px !important;
  }

  :deep(.ant-table-thead > tr > th) {
    border-bottom: none;
    background-color: #fff !important;
  }

  :deep(.ant-table-row:nth-of-type(odd)) {
    background-color: #fff !important;
  }

  :deep(.ant-table-tbody > tr > td) {
    border: none !important;
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

  :deep(
      .ant-table.ant-table-bordered
        > .ant-table-container
        > .ant-table-content
        > table
        > thead
        > tr
        > th
    ) {
    border: none !important;
  }

  :deep(.ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table) {
    border: none !important;
  }

  :deep(.ant-table.ant-table-bordered > .ant-table-container) {
    border: none !important;
  }
</style>
