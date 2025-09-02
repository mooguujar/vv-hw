<script lang="ts" setup>
  import {
    computed,
    reactive,
    ref,
    watch,
    defineEmits,
    withDefaults,
    defineProps,
    nextTick,
  } from 'vue';
  import type { Ref, UnwrapRef } from 'vue';
  import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
  import { Table, Input, Select, InputNumber } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
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
    conditionTime: string[];
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
  const timeSelected = ref([]);
  const validTimeList = ref([]);
  const currencyName = computed(() => props.currencyName);

  const conditionOptions = reactive<{ label: string; value: ConditionType }[]>([
    {
      label: '按打码',
      value: '1',
    },
    {
      label: '按存款',
      value: '2',
    },
    {
      label: '按亏损',
      value: '3',
    },
    {
      label: '按赢利',
      value: '4',
    },
    {
      label: '按现金输',
      value: '5',
    },
    {
      label: '按现金赢',
      value: '6',
    },
  ]);
  const timeList = [
    // { label: '0:00~0:59', value: '0:00~0:59', index: 0 },
    { label: '1:00', value: '1:00', index: 1 },
    { label: '2:00', value: '2:00', index: 2 },
    { label: '3:00', value: '3:00', index: 3 },
    { label: '4:00', value: '4:00', index: 4 },
    { label: '5:00', value: '5:00', index: 5 },
    { label: '6:00', value: '6:00', index: 6 },
    { label: '7:00', value: '7:00', index: 7 },
    { label: '8:00', value: '8:00', index: 8 },
    { label: '9:00', value: '9:00', index: 9 },
    { label: '10:00', value: '10:00', index: 10 },
    { label: '11:00', value: '11:00', index: 11 },
    { label: '12:00', value: '12:00', index: 12 },
    { label: '13:00', value: '13:00', index: 13 },
    { label: '14:00', value: '14:00', index: 14 },
    { label: '15:00', value: '15:00', index: 15 },
    { label: '16:00', value: '16:00', index: 16 },
    { label: '17:00', value: '17:00', index: 17 },
    { label: '18:00', value: '18:00', index: 18 },
    { label: '19:00', value: '19:00', index: 19 },
    { label: '20:00', value: '20:00', index: 20 },
    { label: '21:00', value: '21:00', index: 21 },
    { label: '22:00', value: '22:00', index: 22 },
    { label: '23:00', value: '23:00', index: 23 },
  ];
  const curConditionOption = computed(
    () => conditionOptions.filter((c) => c.value === props.conditionType)[0],
  );
  const columns = computed(() => [
    {
      title: '红包',
      dataIndex: 'index',
      width: '8%',
      align: 'center',
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: '20%',
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
      title: '红包比例(%)',
      dataIndex: 'chipsMultiple',
      align: 'center',
    },
    // {
    //   slots: { title: 'getLimitMax' },
    //   dataIndex: 'dollarPercent',
    //   align: 'center',
    // },
    {
      title: t('v.discount.activity.operation'),
      dataIndex: 'operation',
      align: 'center',
    },
  ]);
  const modelValueRef = computed(() => props.modelValue);

  const dataSource = ref(props.modelValue.map((item, idx) => ({ ...item })));
  const firstConditionData = computed(() => props.firstConditionData);
  const isDisabled = computed(() => props.firstCurrencyId == props.currencyId);

  const onDelete = (key: string) => {
    dataSource.value = dataSource.value.filter((item) => item.key !== key);
    emit('update:deleteKey', key);
  };
  const handleAdd = () => {
    count.value++;
    const newData: DataItem = {
      key: `${count.value}`,
      index: `${count.value}`,
      type: props.conditionType,
      conditionType: '1',
      miniDeposit: '',
      chipsMultiple: '',
      // dollarPercent: '',
    };
    dataSource.value.push(newData);
  };

  function conditionTypeChange(v) {
    dataSource.value[0].type = v;
    emit('update:conditionType', v);
  }

  async function changeConditionTime(val) {
    modelValueRef.value.forEach((item) => {
      if (item.conditionTime) {
        item.conditionTime = item.conditionTime.toSorted((a, b) => {
          return Number(a.split(':')[0]) - Number(b.split(':')[0]);
        });
      }
    });
    emit('update:conditionTime', val);
  }
  function reset(data) {
    data.conditionTime = [];
    data.conditionType = null;
    data.miniDeposit = null;
    data.chipsMultiple = null;
    // data.dollarPercent = null;
  }

  function calcValidTimeList() {
    const mergedConditionTime = modelValueRef.value.map((item) => item?.conditionTime).flat();
    validTimeList.value = timeList.filter((item) => !mergedConditionTime.includes(item.label));
  }

  watch(
    dataSource,
    async (val) => {
      await emit('update:modelValue', val);
      calcValidTimeList();
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
      bordered
      :data-source="dataSource"
      :columns="columns"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
    >
      <template #minDoor>
        <span>最低门槛 ≥ <cdIconCurrency :icon="currencyName" class="w-5 mb-1" /></span>
      </template>
      <template #getLimitMax>
        <span
          >{{ $t('v.discount.activity.Maximum_entitlement') }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <template v-if="column.dataIndex === 'time'">
          <Select
            v-model:value="record.conditionTime"
            :options="validTimeList"
            mode="multiple"
            size="large"
            class="select__fontBig__class"
            :placeholder="t('common.chooseText')"
            @change="changeConditionTime"
            :disabled="!isDisabled"
          />
        </template>
        <template v-else-if="column.dataIndex === 'type'">
          <Select
            v-model:value="record.conditionType"
            :options="conditionOptions"
            size="large"
            :placeholder="t('common.chooseText')"
            @change="conditionTypeChange"
            :disabled="!isDisabled"
          />
        </template>

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
        <template v-else-if="column.dataIndex === 'chipsMultiple'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              v-model:value="record.chipsMultiple"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <!-- <template v-else-if="column.dataIndex === 'dollarPercent'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :min="0"
              :stringMode="true"
              v-model:value="record.dollarPercent"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template> -->
        <template v-else-if="column.dataIndex === 'operation'">
          <div v-if="isDisabled">
            <div v-if="index > 0" class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="onDelete(record.key)"><img :src="RECT_DELETE" /></a>
            </div>

            <div v-else class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="reset(record)"><img :src="RECT_DELETE" /></a>
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
</style>
