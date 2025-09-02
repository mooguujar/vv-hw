<script lang="ts" setup name="DollarWaves">
  import { PageWrapper } from '/@/components/Page';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Row, Col, message, TimePicker, Table, InputNumber } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';

  import { computed, nextTick, ref, watch, defineEmits, defineProps, toRaw, onMounted } from 'vue';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import { useTreeListStore } from '/@/store/modules/treeList';

  interface Props {
    type: number;
    modelValue: String;
    firstCurrencyId: String;
    getDeatilId: String;
    form_data: any;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);
  const { currencyTreeList } = useTreeListStore();

  const currencyNameList = currencyTreeList.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

  const currencyCodeList = {
    zh_CN: '701',
    pt_BR: '702',
    vi_VN: '704',
    th_TH: '705',
    hi_IN: '703',
    en_US: '706',
  };

  const { t } = useI18n();

  const dailyCollectionLimit = ref({
    zh_CN: '',
    pt_BR: '',
    vi_VN: '',
    th_TH: '',
    hi_IN: '',
    en_US: '',
  });
  const redBagCountDown = ref({
    zh_CN: '',
    pt_BR: '',
    vi_VN: '',
    th_TH: '',
    hi_IN: '',
    en_US: '',
  });

  const FORM_SIZE = useFormSetting().getFormSize;

  const conditionData = ref(
    currencyTreeList.reduce((acc, item) => {
      acc[item.id] = [
        {
          period: [[null, null]],
          cond: [
            {
              value: '',
              amount: ['', ''],
            },
          ],
          config: {
            drop: 1,
            countdown: 0,
            single_match_limit: '',
            single_match_limit_display: '',
            claim_Limit: '',
            claim_Limit_display: '',
          },
          bonus: {
            ty: 1,
            method: 1,
          },
        },
      ];
      return acc;
    }, {}),
  );

  const conditionType = ref('1');
  const activeConfig = ref(0 as any);
  const selectedWeek = ref([]);
  const startDate = ref();
  const endDate = ref();
  const dayTimeTagSelected = ref();
  const otherTimeTagSelected = ref();
  const basicConfigDom = ref();
  const basicConValidate = ref(true);
  const basicIndex = ref(0);

  const bonusType = ref('1');
  const currencyId: any = computed(() => props.modelValue);
  const currencyName = computed(() => currencyNameList[currencyId.value]);
  const currentConditionData: any = computed(() => currencyId.value);

  const timedIdisable = computed(() => props.getDeatilId);

  function changeHandle(v) {
    activeConfig.value = v;
    basicIndex.value = v;
  }

  defineExpose({
    // redUpperLimit, //前台红包上限
    selectedWeek, //每周
    startDate, //每周开始时间
    endDate, //结束时间
    dayTimeTagSelected, // 每日时间筛选
    otherTimeTagSelected, //每周时间晒讯
    conditionType,
    valide, //条件类型
    basicConValidate,
    // 这个新模版，有用的就下面三个，其他不动了，以免出现问题
    dailyCollectionLimit, //每日领取上限
    redBagCountDown,
    conditionData, //表格数据
    bonusType,
  });

  async function valide(langList, type = true) {
    let r = { dailyState: true, reaBagState: true };
    if (type) {
      for (let i = 0; i < langList.length; i++) {
        const lang = langList[i];
        if (!dailyCollectionLimit.value[lang]) {
          changeHandle(0);
          emits('update:modelValue', currencyCodeList[lang]);
          nextTick(async () => {
            r.dailyState = await basicConfigDom.value.validationFunc(type);
          });
          return false;
        }
        if (!redBagCountDown.value[lang]) {
          changeHandle(0);
          emits('update:modelValue', currencyCodeList[lang]);
          nextTick(async () => {
            r.reaBagState = await basicConfigDom.value.validationFunc(type);
          });
          return false;
        }
      }
    } else {
      nextTick(() => {
        basicConfigDom.value && basicConfigDom.value.clearValidateInfo();
      });
    }
    if (r.dailyState && r.reaBagState) {
      return true;
    } else {
      return false;
    }
  }

  const data = computed(() => {
    return conditionData.value[currentConditionData.value][0]?.period;
  });
  // 构建为用于表格的数据结构
  // const data_cond = ref(conditionData.value[currentConditionData.value][0]?.cond);
  const tableData = ref(
    data.value.map((item, index) => ({
      key: index,
      // hour: dayjs(item[0], 'HH:mm'),
      // end: dayjs(item[1], 'HH:mm'),
    })),
  );
  // 定义列
  const columns1 = [
    {
      title: t('common.active_text40'),
      dataIndex: 'hour',
      align: 'center',
    },
    {
      title: t('common.active_text41'),
      dataIndex: 'end',
      align: 'center',
    },
    {
      title: t('common.action'),
      dataIndex: 'action',
      align: 'center',
    },
  ];

  watch(
    () => conditionData.value[currentConditionData.value][0].period,
    (newVal) => {
      const currentRaw = JSON.stringify(
        toRaw(tableData.value.map((item) => [item.hour, item.end])),
      );
      const newRaw = JSON.stringify(newVal);
      if (currentRaw !== newRaw) {
        tableData.value = newVal.map((item, idx) => ({
          key: idx,
          // hour: null,
          // end: null,
          hour: item[0] == null || item[0] == '' ? '' : dayjs(item[0], 'HH:mm'),
          end: item[1] == null || item[1] == '' ? '' : dayjs(item[1], 'HH:mm'),
        }));
        // availableTimeOptions(0);
      }
    },
    { deep: true },
  );
  onMounted(() => {
    eventBus.emit('formChange_m', 1);
  });

  const tableKey = ref(Date.now());
  let disNetx = false;
  // 更新原始 data 的方法
  const updateOriginalData = (index, key, cond?) => {
    setTimeout(() => {
      if (!cond) {
        if (key == 'end') {
          if (disNetx && currentRow1) {
            nextTick(() => {
              setTimeout(() => {
                if (undisTimeOptions.value.length) {
                  data.value[index + 1][0] = null;
                  data.value[index + 1][1] = tableData.value[index + 1].end;
                }
              }, 111);
            });
            disNetx = false;
            message.error(t('common.text55'));
          }
        }
        tableData.value[index].hour &&
          (data.value[index][0] = dayjs(tableData.value[index].hour).format('HH:mm'));
        tableData.value[index].end &&
          (data.value[index][1] = dayjs(tableData.value[index].end).format('HH:mm'));
      }
    }, 111);
  };
  // 时间范围 00:00 - 23:00（整点）
  const hours = Array.from({ length: 23 }, (_, i) => i);
  const timeOptions = hours.map((h) => ({
    label: `${(h + 1).toString().padStart(2, '0')}:00`,
    value: h + 1,
  }));
  // const calculateEndTime = (start, end) => {
  //   return Math.min(start + end, 24);
  // };
  const calculateEndTime = (start, end) => {
    return Math.min(start * 60 + end, 1440);
  };
  const undisTimeOptions = ref([]);
  const timesList = ref<any[]>([]);
  let currentRow1: any = 0;
  // 根据行动态获取可选时间（只禁用已被其他行占用的时间段）

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return null;
    const [hour, minute] = timeStr.split(':').map(Number);

    return hour * 60 + minute;
  };
  const currentHour = ref(0);
  const availableTimeOptionslist = ref([]);
  const disabledMinutesList = ref([]);

  const availableTimeOptions = (index, HOrM?, end?) => {
    HOrM = HOrM || 'H';
    const currentRow = tableData.value[index];
    if (!currentRow) return;

    // 找前一个有 end 时间的项
    let prevEnd = 0;
    let sIndev = index;
    if (end == 'end') {
      sIndev = index;
    } else {
      sIndev = index - 1;
    }
    for (let i = sIndev; i >= 0; i--) {
      const item = tableData.value[i];
      if (end == 'end') {
        if (item && item.hour) {
          prevEnd = parseTimeToMinutes(dayjs(item.hour).format('HH:mm'));
          break;
        }
      } else {
        if (item && item.end) {
          prevEnd = parseTimeToMinutes(dayjs(item.end).format('HH:mm'));
          break;
        }
      }
    }
    let s1Indev = index;
    if (end == 'end') {
      s1Indev = index + 1;
    } else {
      s1Indev = index;
    }
    // 找后一个有 start 时间的项
    let nextStart = 1440;
    for (let i = s1Indev; i < tableData.value.length; i++) {
      const item = tableData.value[i];
      if (end == 'end') {
        if (item && item.hour) {
          nextStart = parseTimeToMinutes(dayjs(item.hour).format('HH:mm'));
          break;
        }
      } else {
        if (item && item.end) {
          nextStart = parseTimeToMinutes(dayjs(item.end).format('HH:mm'));
          break;
        }
      }
    }

    // 构造时间项（小时或分钟）
    let options;
    if (HOrM === 'H') {
      options = Array.from({ length: 24 }, (_, i) => i);
    } else if (HOrM === 'M') {
      options = Array.from({ length: 60 }, (_, i) => i);
    } else {
      // throw new Error("HOrM 参数必须是 'H' 或 'M'");
    }

    // 遍历选项，判断是否禁用
    let result = options.map((value) => {
      let testMinutes;
      if (HOrM === 'H') {
        testMinutes = value * 60 + 59;
      } else {
        // const currentHour =
        //   current && current.hour
        //     ? parseTimeToMinutes(dayjs(current.hour).format('HH:mm'))
        //     : prevEnd;
        // const hour = Math.floor(currentHour_ / 60);
        testMinutes = currentHour.value * 60 + value;
      }
      const disabled = testMinutes <= prevEnd || testMinutes >= nextStart;

      return {
        label: String(value).padStart(2, '0'),
        value,
        disabled,
      };
    });
    if (HOrM === 'H') {
      availableTimeOptionslist.value = result;
    } else {
      result = result.filter((item) => item.disabled).map((item) => item && item.value);
      if (JSON.stringify(disabledMinutesList.value) === JSON.stringify(result)) {
        return;
      } else {
        disabledMinutesList.value = result;
      }
    }
  };
  // availableTimeOptions(0);
  // 防止时间冲突
  const conflictTimes = ref(new Set());
  const currentRow = ref(0);
  const currentend = ref(0);
  const updateConflictTimes = (index, end) => {
    currentRow.value = index;
    currentend.value = end;
    // data.value[index][0] = null;
    availableTimeOptions(index, 'H', end);

    // setTimeout(() => {
    //   availableTimeOptions(currentRow.value, 'M', currentend.value);
    // }, 111);

    // conflictTimes.value = new Set();
    // tableData.value.forEach((item) => {
    //   const start = item.time;
    //   const end = Math.ceil(calculateEndTime(item.time, item.end) / 60);
    //   for (let t = start; t < end; t++) {
    //     conflictTimes.value.add(t);
    //   }
    // });
    // emit(
    //   'update:data',
    //   tableData.value.map(({ id, ...d }) => d),
    // );
  };
  // 添加新行
  const addRow = (cond?) => {
    availableTimeOptions(tableData.value.length - 1);

    if (cond) {
      conditionData.value[currentConditionData.value][0]?.cond.push({
        value: '',
        amount: ['', ''],
      });
    }
    data.value.push([null, null]);

    nextTick(() => {
      // updateConflictTimes(tableData.value.length - 1);
    });
  };

  // 删除行
  const removeRow = (index, cond?) => {
    tableData.value.splice(index, 1);
    data.value.splice(index, 1);
    nextTick(() => {
      availableTimeOptions(0);
    });
    if (cond) {
      conditionData.value[currentConditionData.value][0]?.cond.splice(index, 1);
    }
  };

  const columns = computed(() => {
    let arr: any = [
      {
        slots: { title: 'value' },
        dataIndex: 'value',
        align: 'center',
      },
      {
        title: t('common.active_text13'),
        dataIndex: 'amount',
        align: 'center',
      },
      {
        title: t('common.action'),
        dataIndex: 'action',
        align: 'center',
      },
    ];
    return arr;
  });

  watch(
    () => props.form_data,
    (newV) => {
      const {
        drop,
        countdown,
        single_match_limit,
        single_match_limit_display,
        claim_Limit,
        claim_Limit_display,
        bonus,
        bonusmethod,
        bonusty,
      } = newV;

      if (single_match_limit) {
        conditionData.value[currentConditionData.value][0].config = {
          drop,
          countdown,
          single_match_limit,
          single_match_limit_display,
          claim_Limit,
          claim_Limit_display,
        };
      }
      if (bonusty) {
        conditionData.value[currentConditionData.value][0].bonus.ty = bonusty;
        conditionData.value[currentConditionData.value][0].bonus.method = bonusmethod;
      }
      // if (bonusty) {
      // }
    },
    {
      deep: true,
    },
  );
  const disabledHours = (e) => {
    return availableTimeOptionslist.value.filter((item) => item.disabled).map((item) => item.value);
  };
  const disabledMinutes = (hour) => {
    if (hour == null || hour == undefined || hour < 0) {
      return [];
    }
    currentHour.value = hour;
    setTimeout(() => {
      availableTimeOptions(currentRow.value, 'M', currentend.value);
    }, 111);
    return disabledMinutesList.value;
  };
  const clickTime = (e) => {};
</script>

<template>
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <div>
      <!-- 派奖时间 -->
      <Row class="mt-20px" v-if="type == 1" :key="tableKey">
        <div style="flex: 1">
          <Col :span="24">
            <Table
              :columns="columns1"
              :data-source="tableData"
              size="small"
              :pagination="false"
              ref="redBagRainRef"
              :scroll="{ x: 'max-content' }"
              :style="{ width: 'aotu', overflow: 'auto' }"
              rowKey="key"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'hour'">
                  <div class="flex justify-center">
                    <TimePicker
                      class="w-90%"
                      v-model:value="record.hour"
                      @change="updateOriginalData(index, 1)"
                      :size="FORM_SIZE"
                      format="HH:mm"
                      :disabledHours="disabledHours"
                      :disabledMinutes="(e) => disabledMinutes(e)"
                      @open-change="updateConflictTimes(index)"
                      @click="clickTime"
                    />
                  </div>
                  <!--  :disabled="index != tableData.length - 1" -->
                </template>
                <template v-else-if="column.dataIndex === 'end'">
                  <TimePicker
                    class="w-90%"
                    v-model:value="record.end"
                    :size="FORM_SIZE"
                    @change="updateOriginalData(index)"
                    format="HH:mm"
                    :disabledHours="disabledHours"
                    :disabledMinutes="(e) => disabledMinutes(e)"
                    @open-change="updateConflictTimes(index, 'end')"
                  />
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <div class="flex justify-center">
                    <!-- v-if="undisTimeOptions.length" -->
                    <a
                      v-if="index < 23"
                      @click="addRow()"
                      class="mr-2"
                      :class="{ 'disabled-link': !!timedIdisable }"
                      :style="{
                        'pointer-events': !!timedIdisable ? 'none' : 'auto',
                        opacity: !!timedIdisable ? 0.5 : 1,
                      }"
                      ><img :src="RECT_ADD"
                    /></a>
                    <a
                      @click="removeRow(index)"
                      v-if="index > 0"
                      :class="{ 'disabled-link': !!timedIdisable }"
                      :style="{
                        'pointer-events': !!timedIdisable ? 'none' : 'auto',
                        opacity: !!timedIdisable ? 0.5 : 1,
                      }"
                      ><img :src="RECT_DELETE"
                    /></a>
                    <div v-else class="w-52px h-38px"></div>
                  </div>
                </template>
              </template>
            </Table>
          </Col>
        </div>
      </Row>
      <!-- 奖金方式 -->
      <Row class="mt-20px" v-else>
        <div style="flex: 1">
          <Col :span="24">
            <Table
              :columns="(columns as any)"
              :data-source="conditionData[currentConditionData][0].cond"
              size="small"
              :pagination="false"
              ref="redBagRainRef"
              :scroll="{ x: 'max-content' }"
              :style="{ width: 'auto', overflow: 'auto' }"
              rowKey="key"
            >
              <template #value>
                {{
                  form_data.bonusty == 3
                    ? t('common.active_text12')
                    : form_data.bonusty == 2
                    ? t('common.active_text53')
                    : t('common.active_text52')
                }}
                <span> <cdIconCurrency :icon="currencyName" class="w-5 mb-1" /></span>
              </template>
              <template #bodyCell="{ column, record, index }">
                <!-- 充值金额 -->
                <template v-if="column.dataIndex === 'value'">
                  <InputNumber
                    v-model:value="record.value"
                    size="large"
                    :stringMode="true"
                    :min="0"
                    :placeholder="t('v.discount.activity.please_enter')"
                    @change="updateOriginalData(index, 'value', 1)"
                  />
                </template>
                <!-- 奖励金额 -->
                <template v-else-if="column.dataIndex === 'amount'">
                  <div
                    :key="index"
                    class="flex flex-row justify-between"
                    :class="{ '  mt-10px': index > 0 }"
                  >
                    <div class="w-[100%]">
                      <InputNumber
                        :min="0"
                        :stringMode="true"
                        class="w-100% rounded-xs"
                        size="large"
                        :controls="false"
                        :addonAfter="
                          form_data.bonusmethod == 3 || form_data.bonusmethod == 4 ? '%' : ''
                        "
                        v-model:value="record.amount[0]"
                        :placeholder="t('v.discount.activity.please_enter')"
                        @change="updateOriginalData(index, 'amount', 1)"
                        :disabled="!!timedIdisable"
                      />
                    </div>
                    <span
                      v-if="form_data.bonusmethod == 2 || form_data.bonusmethod == 4"
                      class="mx-10px line-height-37px"
                      >~</span
                    >
                    <div
                      class="w-[100%]"
                      v-if="form_data.bonusmethod == 2 || form_data.bonusmethod == 4"
                    >
                      <InputNumber
                        :min="0"
                        size="large"
                        :stringMode="true"
                        :addonAfter="
                          form_data.bonusmethod == 3 || form_data.bonusmethod == 4 ? '%' : ''
                        "
                        :controls="false"
                        @change="updateOriginalData(index, 'amount', 1)"
                        v-model:value="record.amount[1]"
                        :placeholder="t('v.discount.activity.please_enter')"
                        :disabled="!!timedIdisable"
                      />
                    </div>
                  </div>
                </template>
                <!-- 操作 -->
                <template v-else-if="column.dataIndex === 'action'">
                  <div class="flex justify-center">
                    <a
                      @click="addRow(1)"
                      class="mr-2"
                      :class="{ 'disabled-link': !!timedIdisable }"
                      :style="{
                        'pointer-events': !!timedIdisable ? 'none' : 'auto',
                        opacity: !!timedIdisable ? 0.5 : 1,
                      }"
                      ><img :src="RECT_ADD"
                    /></a>
                    <a
                      @click="removeRow(index, 1)"
                      v-if="index > 0"
                      :class="{ 'disabled-link': !!timedIdisable }"
                      :style="{
                        'pointer-events': !!timedIdisable ? 'none' : 'auto',
                        opacity: !!timedIdisable ? 0.5 : 1,
                      }"
                      ><img :src="RECT_DELETE"
                    /></a>
                    <div v-else class="w-52px h-38px"></div>
                  </div>
                </template>
              </template>
            </Table>
          </Col>
        </div>
      </Row>
    </div>
  </PageWrapper>
</template>
<style>
  .ant-picker-ranges .ant-picker-now {
    display: none;
  }
</style>
<style lang="less" scoped>
  :deep(.maxw-130px) {
    max-width: 130px;
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
