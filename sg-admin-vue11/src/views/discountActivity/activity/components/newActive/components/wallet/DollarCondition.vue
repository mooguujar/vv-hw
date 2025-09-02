<script lang="ts" setup>
  import { computed, ref, watch, withDefaults, defineProps } from 'vue';
  import { Table, InputNumber } from 'ant-design-vue';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();
  interface Props {
    modelValue: DataItem;
    conditionType: ConditionType;
    conditionTime: number[];
    getDeatilId: boolean; // 编辑模式
    firstCurrencyId: String; // 首币种
    currencyId: String; // 当前币种
    firstConditionData: String[];
    deleteKey: Number | String;
    currencyName: string;
    incentiveConfig: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => {
      return [
        {
          index: '1',
          d: '1', //存款
          c: '1', //奖金
        },
      ];
    },
    // [
    //   {
    //     index: '1',
    //     type: '1',
    //     conditionType: '1',
    //     miniDeposit: '',
    //     chipsMultiple: '',
    //     incentiveConfig: 1,
    //     // dollarPercent: '',
    //   },
    // ],
    incentiveConfig: 1,
    conditionType: '1',
  });

  interface DataItem {}

  const emit = defineEmits([
    'update:modelValue',
    'update:conditionType',
    'update:conditionTime',
    'update:deleteKey',
  ]);

  type ConditionType = '1' | '2' | '3' | '4' | '5' | '6';

  const count = ref(1);
  const redBagRainRef = ref(null);
  const validTimeList = ref([]);
  const currencyName = computed(() => props.currencyName);

  const timeList: any = ref([]);

  const columns = computed(() => {
    let arr: any = [];
    let arr1 = [
      {
        title: t('v.discount.activity.IDX'),
        dataIndex: 'index',
        width: '8%',
        align: 'center',
      },
      {
        slots: { title: 'd' },
        // title: t('v.discount.activity.recharge_amount'),
        dataIndex: 'd',
        // width: '20%',
        align: 'center',
      },
      {
        slots: { title: 'c' },
        dataIndex: 'c',
        align: 'center',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'operation',
        align: 'center',
      },
    ];
    arr = arr1;
    arr = arr.filter((e) => e.ifShow == undefined || e.ifShow == true);
    return arr;
  });
  const modelValueRef = computed(() => props.modelValue);

  const dataSource = ref(props.modelValue);

  const firstConditionData = computed(() => props.firstConditionData);

  const onDelete = (index: string) => {
    dataSource.value = dataSource.value.filter((item, index_) => item.index != index);
    emit('update:deleteKey', index);
  };
  const handleAdd = (i) => {
    count.value++;
    const newData: DataItem = {
      index: `${count.value}`,
      d: '', //存款
      c: '', //奖金
    };
    dataSource.value.push(newData);
  };

  function reset(data) {
    data.conditionTime = [];
    data.conditionType = null;
    data.miniDeposit = null;
    data.chipsMultiple = null;
    // data.dollarPercent = null;
  }

  function calcValidTimeList() {
    const mergedConditionTime = modelValueRef.value?.map((item) => item?.conditionTime).flat();
    validTimeList.value = timeList.value.filter(
      (item) => !mergedConditionTime?.includes(item.label),
    );
  }

  watch(
    dataSource,
    async (val) => {
      if (val) {
        eventBus.emit('formChange_m', 1);
        await emit('update:modelValue', val);
        calcValidTimeList();
      }
    },

    { deep: true, immediate: true },
  );

  // watch(
  //   () => props.incentiveConfig,
  //   async (val) => {
  //     if (val) {
  //       dataSource.value = props.modelValue;
  //     }
  //   },
  // );

  watch(
    () => props.modelValue,
    (newValue, old) => {
      // if (JSON.stringify(newValue) !== JSON.stringify(old)) {
      if (newValue) {
        dataSource.value = newValue;
      }
      // }
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <div class="flex">
    <div class="left flex-1">
      <Table
        v-show="false"
        bordered
        :data-source="dataSource"
        :columns="columns"
        size="small"
        :pagination="false"
        ref="redBagRainRef"
      >
        <template #d>
          <span
            >{{ $t('v.discount.activity.recharge_amount') }} ≥
            <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
          /></span>
        </template>
        <template #c>
          <span
            >{{ $t('v.discount.activity.award') }}
            <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
          /></span>
        </template>
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'index'">
            <div>{{ index + 1 }}</div>
          </template>
          <template v-else-if="column.dataIndex === 'd'">
            <div>
              <InputNumber
                :disabled="!!getDeatilId"
                :controls="false"
                size="large"
                :stringMode="true"
                :min="0"
                v-model:value="record.d"
                :placeholder="$t('v.discount.activity.please_enter')"
              />
            </div>
          </template>

          <template v-else-if="column.dataIndex === 'c'">
            <div>
              <InputNumber
                :disabled="!!getDeatilId"
                :controls="false"
                size="large"
                :stringMode="true"
                :min="0"
                v-model:value="record.c"
                :placeholder="$t('v.discount.activity.please_enter')"
              />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <!-- <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a> -->s
            <div v-if="!getDeatilId">
              <!-- <div v-if="index == 0" class="flex justify-center">
                <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
              </div> -->
              <!-- v-if="index <= 13 && index == dataSource.length - 1" -->
              <div class="flex justify-center">
                <!-- v-if="index < 13 && index == dataSource.length - 1" -->
                <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
                <!-- v-if="index == dataSource.length - 1 && index != 0" -->
                <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a>
              </div>
              <!-- <div v-else class="flex justify-center">
                <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
                <a @click="reset(record)"><img :src="RECT_DELETE" /></a>
              </div> -->
              <!-- <div v-else class="text-center">-</div> -->
            </div>
            <div v-else class="text-center">-</div>
          </template>
        </template>
      </Table>
    </div>
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
