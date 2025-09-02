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
  import { Table, Input, Select, Tooltip, InputNumber } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
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
      return {
        bonus_serial: [
          {
            index: '1',
            type: '1',
            conditionType: '1',
            miniDeposit: '',
            incentiveConfig: 1,
            chipsMultiple: '',
          },
        ],
        bonus_base: [
          {
            index: '1',
            type: '1',
            conditionType: '1',
            miniDeposit: '',
            chipsMultiple: '',
            incentiveConfig: 1,
          },
        ],
      };
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

  interface DataItem {
    bonus_serial: [
      {
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
      },
    ];
    bonus_base: [
      {
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
      },
    ];
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
  const currencyTime: any = ref([]);
  const currencyIndex: any = ref(0);
  const currencyName = computed(() => props.currencyName);

  // const timeList = computed(() => {
  //   return [
  //     { label: '第一天', value: '1', index: 1 },
  //     { label: '第二天', value: '2', index: 2 },
  //     { label: '第三天', value: '3', index: 3 },
  //     { label: '第四天', value: '4', index: 4 },
  //     { label: '第五天', value: '5', index: 5 },
  //     { label: '第六天', value: '6', index: 6 },
  //     { label: '第七天', value: '7', index: 7 },
  //     { label: '第八天', value: '8', index: 8 },
  //     { label: '第九天', value: '9', index: 9 },
  //     { label: '第十天', value: '10', index: 10 },
  //   ];
  // });
  const timeList: any = ref([]);
  const setTileList = () => {
    let isindex = currencyIndex.value !== 0;
    let selectList =
      dataSource.value.bonus_base?.reduce((acc, current) => acc.concat(current.day), []) || [];

    if (dataSource.value.bonus_base) dataSource.value.bonus_base.selectList = selectList;
    let list = [
      {
        label: '第一天',
        value: '1',
        index: 1,
        disabled: selectList.includes('2') || isindex,
      },
      {
        label: '第二天',
        value: '2',
        index: 2,
        disabled:
          !selectList.includes('1') ||
          (isindex && !currencyTime.value.includes('2') && selectList.includes('2')) ||
          selectList.includes('3'),
      },
      {
        label: '第三天',
        value: '3',
        index: 3,
        disabled:
          !selectList.includes('2') ||
          (isindex && !currencyTime.value.includes('3') && selectList.includes('3')) ||
          selectList.includes('4'),
      },
      {
        label: '第四天',
        value: '4',
        index: 4,
        disabled:
          !selectList.includes('3') ||
          (isindex && !currencyTime.value.includes('4') && selectList.includes('4')) ||
          selectList.includes('5'),
      },
      {
        label: '第五天',
        value: '5',
        index: 5,
        disabled:
          selectList.includes('6') ||
          (isindex && !currencyTime.value.includes('5') && selectList.includes('5')) ||
          !selectList.includes('4'),
      },
      {
        label: '第六天',
        value: '6',
        index: 6,
        disabled:
          selectList.includes('7') ||
          (isindex && !currencyTime.value.includes('6') && selectList.includes('6')) ||
          !selectList.includes('5'),
      },
      {
        label: '第七天',
        value: '7',
        index: 7,
        disabled:
          selectList.includes('8') ||
          (isindex && !currencyTime.value.includes('7') && selectList.includes('7')) ||
          !selectList.includes('6'),
      },
      {
        label: '第八天',
        value: '8',
        index: 8,
        disabled:
          selectList.includes('9') ||
          (isindex && !currencyTime.value.includes('8') && selectList.includes('8')) ||
          !selectList.includes('7'),
      },
      {
        label: '第九天',
        value: '9',
        index: 9,
        disabled:
          selectList.includes('10') ||
          (isindex && !currencyTime.value.includes('9') && selectList.includes('9')) ||
          !selectList.includes('8'),
      },
      {
        label: '第十天',
        value: '10',
        index: 10,
        disabled:
          selectList.includes('11') ||
          (isindex && !currencyTime.value.includes('10') && selectList.includes('10')) ||
          !selectList.includes('9'),
      },
      {
        label: '第十一天',
        value: '11',
        index: 11,
        disabled:
          selectList.includes('12') ||
          (isindex && !currencyTime.value.includes('11') && selectList.includes('11')) ||
          !selectList.includes('10'),
      },
      {
        label: '第十二天',
        value: '12',
        index: 12,
        disabled:
          selectList.includes('13') ||
          (isindex && !currencyTime.value.includes('12') && selectList.includes('12')) ||
          !selectList.includes('11'),
      },
      {
        label: '第十三天',
        value: '13',
        index: 13,
        disabled:
          selectList.includes('14') ||
          (isindex && !currencyTime.value.includes('13') && selectList.includes('13')) ||
          !selectList.includes('12'),
      },
      {
        label: '第十四天',
        value: '14',
        index: 14,
        disabled:
          selectList.includes('15') ||
          (isindex && !currencyTime.value.includes('14') && selectList.includes('14')) ||
          !selectList.includes('13'),
      },
      {
        label: '第十五天',
        value: '15',
        index: 15,
        disabled:
          (isindex && !currencyTime.value.includes('15') && selectList.includes('15')) ||
          !selectList.includes('14'),
      },
    ];
    // let list = validTimeList.value.filter((o) => !selectList.includes(o.value));
    timeList.value = list;
  };

  const timeList_bonus_serial = computed(() => {
    let selectList = dataSource.value?.bonus_serial.map((item) => item.day);
    let list = [
      // { label: '第一天', value: '1', index: 1, disabled: selectList.includes('1') },
      {
        label: '两天',
        value: '2',
        index: 2,
        // disabled: selectList.includes('2') || !selectList.includes('1'),
        disabled: selectList.includes('2'),
      },
      {
        label: '三天',
        value: '3',
        index: 3,
        disabled: selectList.includes('3'),
      },
      {
        label: '四天',
        value: '4',
        index: 4,
        disabled: selectList.includes('4'),
      },
      {
        label: '五天',
        value: '5',
        index: 5,
        disabled: selectList.includes('5'),
      },
      {
        label: '六天',
        value: '6',
        index: 6,
        disabled: selectList.includes('6'),
      },
      {
        label: '七天',
        value: '7',
        index: 7,
        disabled: selectList.includes('7'),
      },
      {
        label: '八天',
        value: '8',
        index: 8,
        disabled: selectList.includes('8'),
      },
      {
        label: '九天',
        value: '9',
        index: 9,
        disabled: selectList.includes('9'),
      },
      {
        label: '十天',
        value: '10',
        index: 10,
        disabled: selectList.includes('10'),
      },
      {
        label: '十一天',
        value: '11',
        index: 11,
        disabled: selectList.includes('11'),
      },
      {
        label: '十二天',
        value: '12',
        index: 12,
        disabled: selectList.includes('12'),
      },
      {
        label: '十三天',
        value: '13',
        index: 13,
        disabled: selectList.includes('13'),
      },
      {
        label: '十四天',
        value: '14',
        index: 14,
        disabled: selectList.includes('14'),
      },
      {
        label: '十五天',
        value: '15',
        index: 15,
        disabled: selectList.includes('15'),
      },
    ];
    // let list = validTimeList.value.filter((o) => !selectList.includes(o.value));
    return list;
  });

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
        title: t('v.discount.activity.time'),
        dataIndex: 'day',
        width: '20%',
        align: 'center',
      },
      {
        slots: { title: 'amount' },
        dataIndex: 'amt',
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
  const columns2 = computed(() => {
    let arr: any = [];
    let arr2 = [
      {
        title: t('v.discount.activity.IDX'),
        dataIndex: 'index',
        width: '8%',
        align: 'center',
      },
      {
        title: t('v.discount.activity.time'),
        dataIndex: 'day',
        width: '20%',
        align: 'center',
      },
      {
        slots: { title: 'deposit' },
        dataIndex: 'deposit',
        align: 'center',
      },
      {
        slots: { title: 'bet' },
        dataIndex: 'bet',
        align: 'center',
      },
      {
        slots: { title: 'amount' },
        dataIndex: 'amt',
        align: 'center',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'operation',
        align: 'center',
      },
    ];
    arr = arr2;
    arr = arr.filter((e) => e.ifShow == undefined || e.ifShow == true);
    return arr;
  });
  const modelValueRef = computed(() => props.modelValue);

  const dataSource = ref(props.modelValue);

  const firstConditionData = computed(() => props.firstConditionData);

  const onDelete = (index: string, incentiveConfig) => {
    dataSource.value[incentiveConfig == 1 ? 'bonus_serial' : 'bonus_base'] = dataSource.value[
      incentiveConfig == 1 ? 'bonus_serial' : 'bonus_base'
    ].filter((item, index_) => item.index != index);
    emit('update:deleteKey', index);
  };
  const handleAdd = (i, incentiveConfig) => {
    count.value++;
    const newData: DataItem = {
      index: `${count.value}`,
      amt: '',
      day: incentiveConfig == 1 ? '' : [],
    };
    dataSource.value[incentiveConfig == 1 ? 'bonus_serial' : 'bonus_base'].push(newData);
  };

  function conditionTypeChange0(currencyIndex_) {
    currencyTime.value = dataSource.value.bonus_base[currencyIndex_].day;
    currencyIndex.value = currencyIndex_;
    setTileList();
  }
  function conditionTypeChange(v, currencyIndex_) {
    currencyTime.value = v;
    currencyIndex.value = currencyIndex_;
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
    // const mergedConditionTime = modelValueRef.value?.map((item) => item?.conditionTime).flat();
    // validTimeList.value = timeList.value.filter(
    //   (item) => !mergedConditionTime?.includes(item.label),
    // );
  }

  watch(
    dataSource,
    async (val) => {
      if (val) {
        setTileList();
        eventBus.emit('formChange_m', 1);
        await emit('update:modelValue', val);
        // calcValidTimeList();
      }
    },

    { deep: true, immediate: true },
  );

  watch(
    () => props.modelValue,
    (newValue, old) => {
      // if (JSON.stringify(newValue) !== JSON.stringify(old)) {
      if (newValue?.bonus_serial) {
        dataSource.value = newValue;
      }
      // }
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <div class="flex mb-30px">
    <div class="left w-100px h-40px text-right leading-40px"
      ><span class="text-red">*</span> 奖金配置：</div
    >
    <div class="left flex-1">
      <Table
        bordered
        :data-source="dataSource.bonus_base"
        :columns="columns2"
        size="small"
        :pagination="false"
        ref="redBagRainRef"
      >
        <template #amount>
          <span
            >{{ $t('v.discount.activity.amount_bonus1') }}
            <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
          /></span>
        </template>
        <template #bet>
          <span
            >{{ $t('v.discount.activity.Effective_coding') }}
            <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
          /></span>
        </template>
        <template #deposit>
          <span
            >{{ $t('v.discount.activity.deposit') }}
            <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
          /></span>
        </template>
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'index'">
            <div>{{ index + 1 }}</div>
          </template>

          <template v-else-if="column.dataIndex === 'day'">
            <!-- {{ index + 1 + '-' + record.index + '-' + (dataSource.bonus_base.length - 1) }} -->
            <Select
              v-model:value="record.day"
              :options="timeList"
              :disabled="index != dataSource.bonus_base.length - 1 || !!getDeatilId"
              mode="multiple"
              size="large"
              :placeholder="t('common.chooseText')"
              @focus="conditionTypeChange0(index)"
              @change="conditionTypeChange($event, index)"
            />
          </template>

          <template v-else-if="column.dataIndex === 'amt'">
            <div>
              <InputNumber
                :disabled="!!getDeatilId"
                :controls="false"
                size="large"
                :stringMode="true"
                :min="0"
                v-model:value="record.amt"
                :placeholder="$t('v.discount.activity.please_enter')"
              />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'bet'">
            <div>
              <InputNumber
                :disabled="!!getDeatilId"
                :controls="false"
                size="large"
                :stringMode="true"
                :min="0"
                v-model:value="record.bet"
                :placeholder="$t('v.discount.activity.please_enter')"
              />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'deposit'">
            <div>
              <InputNumber
                :disabled="!!getDeatilId"
                :controls="false"
                size="large"
                :stringMode="true"
                :min="0"
                v-model:value="record.deposit"
                :placeholder="$t('v.discount.activity.please_enter')"
              />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <!-- <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a> -->
            <div v-if="!getDeatilId">
              <!-- <div v-if="index == 0" class="flex justify-center">
                <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
              </div> -->
              <div
                v-if="index <= 14 && index == dataSource.bonus_base.length - 1"
                class="flex justify-center"
              >
                <a
                  v-if="
                    index < 14 && record.day.length && index == dataSource.bonus_base.length - 1
                  "
                  @click="handleAdd(index, 2)"
                  class="mr-4"
                  ><img :src="RECT_ADD"
                /></a>
                <a
                  v-if="index == dataSource.bonus_base.length - 1 && index != 0"
                  @click="onDelete(record.index, 2)"
                  ><img :src="RECT_DELETE"
                /></a>
              </div>
              <!-- <div v-else class="flex justify-center">
                <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
                <a @click="reset(record)"><img :src="RECT_DELETE" /></a>
              </div> -->
              <div v-else class="text-center">-</div>
            </div>
            <div v-else class="text-center">-</div>
          </template>
        </template>
      </Table>
    </div>
  </div>
  <div class="flex">
    <div class="left w-100px text-right h-40px leading-40px">连续签到奖励：</div>
    <div class="left flex-1">
      <Table
        bordered
        :data-source="dataSource?.bonus_serial"
        :columns="columns"
        size="small"
        :pagination="false"
        ref="redBagRainRef"
      >
        <template #amount>
          <span
            >{{ $t('v.discount.activity.amount_bonus1') }}
            <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
          /></span>
        </template>
        <template #bodyCell="{ column, record, index, text }">
          <template v-if="column.dataIndex === 'index'">
            <div>{{ index + 1 }}</div>
          </template>
          <template v-else-if="column.dataIndex === 'day'">
            <Select
              v-model:value="record.day"
              :allowClear="true"
              :options="timeList_bonus_serial"
              :disabled="!!getDeatilId"
              size="large"
              :placeholder="t('common.chooseText')"
            />
          </template>

          <template v-else-if="column.dataIndex === 'amt'">
            <div>
              <InputNumber
                :disabled="!!getDeatilId"
                :controls="false"
                size="large"
                :stringMode="true"
                :min="0"
                v-model:value="record.amt"
                :placeholder="$t('v.discount.activity.please_enter')"
              />
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <!-- <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a> -->
            <div v-if="!getDeatilId">
              <!-- <div v-if="index == 0" class="flex justify-center">
                <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
              </div> -->
              <div class="flex justify-center">
                <a @click="handleAdd(index, 1)" class="mr-4"><img :src="RECT_ADD" /></a>
                <a @click="onDelete(record.index, 1)" v-if="index != 0"
                  ><img :src="RECT_DELETE"
                /></a>
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
