<script lang="ts" setup>
  import { computed, ref, watch, withDefaults, defineProps } from 'vue';
  import { Table, Select, InputNumber } from 'ant-design-vue';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';

  const currentLanguage = useLocaleStoreWithOut();
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
  const timeList: any = ref([]);
  const currentLocale = computed(() => currentLanguage.getLocale as string);
  function generateDaysList(
    isindex: boolean,
    selectList: string[],
    currencyTime: string[],
    locale = currentLocale.value,
  ) {
    const days = 15;

    // 中文数字映射
    const chineseNumbers = [
      '一',
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二',
      '十三',
      '十四',
      '十五',
    ];

    const list = Array.from({ length: days }, (_, i) => {
      const day = i + 1;
      const value = day.toString();
      // 根据语言生成标签
      const label = locale === 'zh_CN' ? `第${chineseNumbers[i]}天` : `Day ${day}`;

      // 计算禁用状态
      let disabled = false;

      if (day === 1) {
        // 第一天的规则
        disabled = selectList.includes('2') || isindex;
      } else if (day === days) {
        // 最后一天的规则
        disabled =
          (isindex && !currencyTime.includes(value) && selectList.includes(value)) ||
          !selectList.includes((day - 1).toString());
      } else {
        // 中间天数的规则
        disabled =
          selectList.includes((day + 1).toString()) ||
          (isindex && !currencyTime.includes(value) && selectList.includes(value)) ||
          !selectList.includes((day - 1).toString());
      }

      return {
        label,
        value,
        index: day,
        disabled,
      };
    });

    return list;
  }
  const setTileList = () => {
    let isindex = currencyIndex.value !== 0;
    let selectList =
      dataSource.value.bonus_base?.reduce((acc, current) => acc.concat(current.day), []) || [];
    if (dataSource.value.bonus_base) dataSource.value.bonus_base.selectList = selectList;
    let list = generateDaysList(isindex, selectList, currencyTime.value);
    timeList.value = list;
  };

  const generateDayOptions = (selectList: string[], locale = currentLocale.value) => {
    const days = 15;
    // 中文数字映射
    const chineseNumbers = [
      '两',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      '十一',
      '十二',
      '十三',
      '十四',
      '十五',
    ];

    return Array.from({ length: days - 1 }, (_, i) => {
      const day = i + 2; // 从2开始
      const value = day.toString();

      // 根据语言生成标签
      const label = locale === 'zh_CN' ? `${chineseNumbers[i]}天` : `Days ${day}`;

      return {
        label,
        value,
        index: day,
        disabled: selectList.includes(value),
      };
    });
  };

  const timeList_bonus_serial = computed(() => {
    let selectList = dataSource.value?.bonus_serial.map((item) => item.day) || [];
    return generateDayOptions(selectList);
  });

  const columns = computed(() => {
    let arr: any = [];
    let arr1 = [
      {
        title: t('v.discount.activity.IDX'),
        dataIndex: 'index',
        width: '10%',
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
        width: '10%',
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
  <div class="flex flex-col mb-20px">
    <div class="w-full text-left h-40px w-130px leading-40px">
      <span
        class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
      >
        2
      </span>
      <span class="text-red ml-25px">*</span>
      {{ t('modalForm.member.member_bonus_allocation') }}：</div
    >
    <div class="flex w-full">
      <Table
        :data-source="dataSource.bonus_base"
        :columns="columns2"
        size="small"
        :pagination="false"
        ref="redBagRainRef"
        class="flex-1"
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
        <template #bodyCell="{ column, record, index }">
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
                :placeholder="t('v.discount.activity.please_enter')"
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
                    index < 14 && record.day?.length && index == dataSource.bonus_base?.length - 1
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
                <span v-else>-</span>
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
  <div class="flex flex-col">
    <div class="relative text-left w-130px h-40px leading-40px">
      <span
        class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left-0px"
      >
        3
      </span>
      <span class="ml-30px">{{ t('common.continue_signin_rewards') }}</span></div
    >
    <div class="flex-1">
      <Table
        :data-source="dataSource?.bonus_serial"
        :columns="columns"
        size="small"
        :pagination="false"
        ref="redBagRainRef"
        class="flex-1"
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
