<script lang="ts" setup>
  import { computed, ref, watch, withDefaults, defineProps } from 'vue';
  import { Table, Input, Tooltip, InputNumber } from 'ant-design-vue';
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
        lucky_bet_prize_config: [
          {
            index: '1',
            type: '1',
            conditionType: '1',
            miniDeposit: '',
            incentiveConfig: 1,
            chipsMultiple: '',
          },
        ],
        lucky_number_config: [
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
    lucky_bet_prize_config: [
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
    lucky_number_config: [
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
  const validTimeList = ref([]);
  const currencyName = computed(() => props.currencyName);

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

  const columns = computed(() => {
    let arr = [
      {
        title: t('v.discount.activity.award'),
        dataIndex: 'index',
        width: '8%',
        align: 'center',
        ifShow: props.incentiveConfig == 2 ? true : false,
      },
      {
        title: t('v.discount.activity.class'),
        dataIndex: 'index',
        width: '8%',
        align: 'center',
        ifShow: props.incentiveConfig == 1 ? true : false,
      },
      // {
      //   title: '时间',
      //   dataIndex: 'time',
      //   width: '20%',
      //   align: 'center',
      // },
      // {
      //   title: t('v.discount.activity.condition'),
      //   dataIndex: 'type',
      //   align: 'center',
      // },
      {
        slots: { title: 'minDoor' },
        dataIndex: 'm',
        align: 'center',
        ifShow: props.incentiveConfig == 1 ? true : false,
      },
      {
        title: t('v.discount.activity.Number_laims'),
        dataIndex: 'n',
        align: 'center',
        ifShow: props.incentiveConfig == 1 ? true : false,
      },

      {
        title: t('v.discount.activity.Note_number'),
        dataIndex: 'c',
        align: 'center',
        ifShow: props.incentiveConfig == 2 ? true : false,
      },
      {
        slots: { title: t('v.discount.activity.Reward_multiple') }, //奖励倍数
        // title: '奖励倍数',
        dataIndex: 't',
        align: 'center',
        ifShow: props.incentiveConfig == 2 ? true : false,
      },
      {
        slots: { title: 'getLimitMax' }, //奖励上限
        dataIndex: 'l',
        align: 'center',
        ifShow: props.incentiveConfig == 2 ? true : false,
      },

      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'operation',
        align: 'center',
      },
    ];
    arr = arr.filter((e) => e.ifShow == undefined || e.ifShow == true);
    return arr;
  });
  const modelValueRef = computed(() => props.modelValue?.lucky_bet_prize_config);

  const dataSource = ref(props.modelValue.lucky_bet_prize_config);

  const firstConditionData = computed(() => props.firstConditionData);

  const onDelete = (index: string) => {
    dataSource.value[
      props.incentiveConfig == 1 ? 'lucky_bet_prize_config' : 'lucky_number_config'
    ] = dataSource.value[
      props.incentiveConfig == 1 ? 'lucky_bet_prize_config' : 'lucky_number_config'
    ].filter((item, index_) => item.index != index);
    emit('update:deleteKey', index);
  };
  const handleAdd = (i) => {
    count.value++;
    const newData: DataItem = {
      index: `${count.value}`,
      m: '',
      n: '',
      c: '',
      t: '',
      l: '',
    };
    dataSource.value[
      props.incentiveConfig == 1 ? 'lucky_bet_prize_config' : 'lucky_number_config'
    ].push(newData);
  };

  // function conditionTypeChange(v) {
  //   dataSource.value[0].type = v;
  //   emit('update:conditionType', v);
  // }

  // async function changeConditionTime(val) {
  //   modelValueRef.value.forEach((item) => {
  //     if (item.conditionTime) {
  //       item.conditionTime = item.conditionTime.toSorted((a, b) => {
  //         return Number(a.split(':')[0]) - Number(b.split(':')[0]);
  //       });
  //     }
  //   });
  //   emit('update:conditionTime', val);
  // }
  // function reset(data) {
  //   data.conditionTime = [];
  //   data.conditionType = null;
  //   data.miniDeposit = null;
  //   data.chipsMultiple = null;
  //   // data.dollarPercent = null;
  // }

  function calcValidTimeList() {
    const mergedConditionTime = modelValueRef.value?.map((item) => item?.conditionTime).flat();
    validTimeList.value = timeList.filter((item) => !mergedConditionTime?.includes(item.label));
  }

  watch(
    dataSource,
    async (val) => {
      if (val) {
        eventBus.emit('formChange_m', val);
        // await emit('update:modelValue', val);
        calcValidTimeList();
      }
    },

    { deep: true, immediate: true },
  );
  watch(
    () => props.modelValue,
    (newValue, old) => {
      // if (JSON.stringify(newValue) !== JSON.stringify(old)) {
      if (newValue?.lucky_bet_prize_config) {
        dataSource.value = newValue;
      }
      // }
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <div>
    <Table
      v-if="incentiveConfig == 1"
      :data-source="dataSource.lucky_bet_prize_config"
      :columns="columns"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
    >
      <template #minDoor>
        <span
          >{{ $t('v.discount.activity.Effective_coding') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #getLimitMax>
        <span
          >{{ $t('v.discount.activity.awardUp') }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <!-- <template v-if="column.dataIndex === 'time'">
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
        </template> -->
        <!-- <template v-else-if="column.dataIndex === 'type'">
          <Select
            v-model:value="record.conditionType"
            :options="conditionOptions"
            size="large"
            :placeholder="t('common.chooseText')"
            @change="conditionTypeChange"
            :disabled="!isDisabled"
          />
        </template> -->

        <template v-else-if="column.dataIndex === 'm'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :disabled="!!getDeatilId"
              :min="0"
              v-model:value="record.m"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'n'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :disabled="!!getDeatilId"
              :controls="false"
              v-model:value="record.n"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="['c'].includes(column.dataIndex)">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :min="0"
              :disabled="!!getDeatilId"
              :stringMode="true"
              v-model:value="record.c"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="['t'].includes(column.dataIndex)">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :min="0"
              :disabled="!!getDeatilId"
              :stringMode="true"
              v-model:value="record.t"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="['l'].includes(column.dataIndex)">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :min="0"
              :disabled="!!getDeatilId"
              :stringMode="true"
              v-model:value="record.l"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div v-if="!getDeatilId">
            <div v-if="index == 0" class="flex justify-center">
              <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
              <!-- <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a> -->
            </div>
            <div v-else class="flex justify-center">
              <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a>
            </div>

            <!-- <div v-else class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="reset(record)"><img :src="RECT_DELETE" /></a>
            </div> -->
          </div>
          <div v-else class="text-center">-</div>
        </template>
      </template>
    </Table>
    <Table
      v-else
      :data-source="dataSource.lucky_number_config"
      :columns="columns"
      size="small"
      :pagination="false"
      ref="redBagRainRef"
    >
      <template #minDoor>
        <span
          >{{ $t('v.discount.activity.Effective_coding') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #getLimitMax>
        <Tooltip>
          <template #title>
            <span class="text-#e5bf81">{{ $t('v.discount.activity.awardUp') }}：</span>
            {{ t('common.only_max_reward') }}</template
          >
          <span class="mx-1 vben-basic-help"
            ><span class="app-iconify anticon" style="display: inline-flex; font-size: 16px"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                class="iconify iconify--tabler"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3m.7 1h4.6"
                /></svg></span
          ></span>
        </Tooltip>

        <span
          >{{ $t('v.discount.activity.awardUp') }}
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1"
        /></span>
      </template>
      <template #奖励倍数>
        <Tooltip>
          <template #title>
            <span class="text-#e5bf81">{{ $t('v.discount.activity.awardB') }}：</span>
            {{ t('common.translate.word50') }}。</template
          >
          <span class="mx-1 vben-basic-help"
            ><span class="app-iconify anticon" style="display: inline-flex; font-size: 16px"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                class="iconify iconify--tabler"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3m.7 1h4.6"
                /></svg></span
          ></span>
        </Tooltip>

        <span>{{ $t('v.discount.activity.awardB') }} </span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'index'">
          <div>{{ index + 1 }}</div>
        </template>
        <!-- <template v-if="column.dataIndex === 'time'">
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
        </template> -->
        <!-- <template v-else-if="column.dataIndex === 'type'">
          <Select
            v-model:value="record.conditionType"
            :options="conditionOptions"
            size="large"
            :placeholder="t('common.chooseText')"
            @change="conditionTypeChange"
            :disabled="!isDisabled"
          />
        </template> -->

        <template v-else-if="column.dataIndex === 'm'">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :disabled="!!getDeatilId"
              :min="0"
              v-model:value="record.m"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'n'">
          <div>
            <InputNumber
              :min="0"
              size="large"
              :disabled="!!getDeatilId"
              :controls="false"
              v-model:value="record.n"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="['c'].includes(column.dataIndex)">
          <div>
            <Input
              :controls="false"
              size="large"
              :min="0"
              :disabled="!!getDeatilId"
              :stringMode="true"
              v-model:value="record.c"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="['t'].includes(column.dataIndex)">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :min="0"
              :disabled="!!getDeatilId"
              :stringMode="true"
              v-model:value="record.t"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="['l'].includes(column.dataIndex)">
          <div>
            <InputNumber
              :controls="false"
              size="large"
              :min="0"
              :disabled="!!getDeatilId"
              :stringMode="true"
              v-model:value="record.l"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div v-if="!getDeatilId">
            <div v-if="index == 0" class="flex justify-center">
              <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
              <!-- <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a> -->
            </div>
            <div v-else class="flex justify-center">
              <a @click="handleAdd(index)" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="onDelete(record.index)"><img :src="RECT_DELETE" /></a>
            </div>

            <!-- <div v-else class="flex justify-center">
              <a @click="handleAdd" class="mr-4"><img :src="RECT_ADD" /></a>
              <a @click="reset(record)"><img :src="RECT_DELETE" /></a>
            </div> -->
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
