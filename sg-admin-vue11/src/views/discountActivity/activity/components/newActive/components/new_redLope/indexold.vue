<script lang="ts" setup name="DollarWaves">
  import { PageWrapper } from '/@/components/Page';
  // import BasicConfig from './BasicConfig.vue';
  // import DollarCondition from './DollarCondition.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import LangRadioGroup from '../../LangRadioGroup.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, size } from 'lodash-es';
  import {
    Row,
    Col,
    RadioGroup,
    Radio,
    message,
    TimePicker,
    Table,
    Select,
    InputNumber,
  } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';

  import {
    computed,
    reactive,
    nextTick,
    ref,
    watch,
    defineEmits,
    withDefaults,
    defineProps,
    toRaw,
    onMounted,
  } from 'vue';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import moment from 'moment';
  import { set } from 'nprogress';

  interface Props {
    type: number;
    modelValue: String;
    firstCurrencyId: String;
    getDeatilId: String;
    form_data: any;
  }
  const props = defineProps<Props>();
  const emits = defineEmits(['update:modelValue']);
  const currencyList: any = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
  };
  const currencyCodeList = {
    zh_CN: '701',
    pt_BR: '702',
    vi_VN: '704',
    th_TH: '705',
    hi_IN: '703',
    en_US: '706',
  };
  const currencyNameList = {
    '701': 'CNY',
    '702': 'BRL',
    '704': 'KVND',
    '705': 'THB',
    '703': 'INR',
    '706': 'USDT',
  };

  const { t } = useI18n();
  // const redUpperLimit = ref('' as String);
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

  const conditionData = ref({
    zh_CN: [
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
    ],
    pt_BR: [
      {
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
        period: [[null, null]],
        cond: [
          {
            value: '',
            amount: ['', ''],
          },
        ],
      },
    ],
    vi_VN: [
      {
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
        period: [[null, null]],
        cond: [
          {
            value: '',
            amount: ['', ''],
          },
        ],
      },
    ],
    th_TH: [
      {
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
        period: [[null, null]],
        cond: [
          {
            value: '',
            amount: ['', ''],
          },
        ],
      },
    ],
    hi_IN: [
      {
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
        period: [[null, null]],
        cond: [
          {
            value: '',
            amount: ['', ''],
          },
        ],
      },
    ],
    en_US: [
      {
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
        period: [[null, null]],
        cond: [
          {
            value: '',
            amount: ['', ''],
          },
        ],
      },
    ],
  });

  const conditionType = ref('1');
  const activeConfig = ref(0 as any);
  const selectedWeek = ref([]);
  const startDate = ref();
  const endDate = ref();
  const dayTimeTagSelected = ref();
  const otherTimeTagSelected = ref();
  const timeConfigDom = ref();
  const basicConfigDom = ref();
  const basicConValidate = ref(true);
  const conditionTime = ref([]);
  const basicIndex = ref(0);
  const deleteKey = ref(0);

  const bonusType = ref('1');
  const currencyId = computed(() => props.modelValue);
  const currencyName = computed(() => currencyNameList[currencyId.value]);
  const firstCurrencyId = computed(() => props.firstCurrencyId);
  const currentConditionData = computed(() => currencyList[currencyId.value]);
  const firstCurrencyName = computed(() => currencyList[firstCurrencyId.value]);
  const firstConditionData = computed(() => conditionData.value[firstCurrencyName.value]);

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
  let showTable = ref(true);
  // 更新原始 data 的方法
  const updateOriginalData = (index, key, cond?) => {
    setTimeout(() => {
      // availableTimeOptions(index);
      // data.value.push([undisTimeOptions.value[0]?.value, 1]);
      if (cond) {
        // conditionData.value[currentConditionData.value][0]?.cond[index][key]= ({
        //   value: '',
        //   amount: ['', ''],
        // });
      } else {
        if (key == 'end') {
          if (disNetx && currentRow1) {
            // tableData.value.splice(index + 1);
            // data.value.splice(index + 1);
            nextTick(() => {
              // updateConflictTimes(0);
              setTimeout(() => {
                // if (undisTimeOptions.value.length) addRow();
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
  const availableTimeOptions1 = (index) => {
    const currentRow = tableData.value[index];
    if (!currentRow) return;
    currentRow1 = tableData.value[index + 1];

    const end = currentRow.end || 0;
    const currentEnd = calculateEndTime(currentRow.hour || 0, end);

    let startNetx1; //
    if (currentRow1 && currentRow1.hour) {
      startNetx1 = calculateEndTime(currentRow1.hour, 0); //
      disNetx = startNetx1 < currentEnd;
    }

    // 找到上一个不为 null 的 hour
    let prevEnd = 0;
    for (let i = index - 1; i >= 0; i--) {
      const row = tableData.value[i];
      if (row && row.hour != null) {
        const d = row.end || 1;
        prevEnd = calculateEndTime(row.hour, d);
        break;
      }
    }

    // 找到下一个不为 null 的 hour
    let nextStart = 1440;
    for (let i = index + 1; i < tableData.value.length; i++) {
      const row = tableData.value[i];
      if (row && row.hour != null) {
        nextStart = row.hour * 60; // 下一个 row 的开始时间
        break;
      }
    }

    timesList.value = timeOptions.map((opt) => {
      const start = opt.value * 60;

      // 禁用规则：只允许选择在 [prevEnd, nextStart) 范围内的开始时间
      const disabled = start < prevEnd || start >= nextStart;

      return {
        ...opt,
        disabled,
      };
    });

    undisTimeOptions.value = timesList.value.filter((item) => !item.disabled);
    return timesList.value;
  };
  const minutesToTimeParts = (minutes) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return { hour, minute };
  };

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
    // if (undisTimeOptions.value.length == 0) return;
    // const newItem = {
    //   key: Date.now(),
    //   hour: null,
    //   // hour: undisTimeOptions.value[0]?.value,
    //   end: null,
    // };
    // tableData.value.push(newItem);
    // data.value.push([undisTimeOptions.value[0]?.value, 1]);

    data.value.push([null, null]);
    // data.value.push([dayjs(1).format('HH:mm'), dayjs(1).format('HH:mm')]);

    // data.value.push([0, 1]);
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
      if (single_match_limit)
        conditionData.value[currentConditionData.value][0].config = {
          drop,
          countdown,
          single_match_limit,
          single_match_limit_display,
          claim_Limit,
          claim_Limit_display,
        };
      if (bonusty) {
        conditionData.value[currentConditionData.value][0].bonus.ty = bonusty;
        conditionData.value[currentConditionData.value][0].bonus.method = bonusmethod;
      }
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
    // availableTimeOptions(currentRow.value, 'M', currentend.value);
    return disabledMinutesList.value;
  };
  const clickTime = (e) => {
    if (e && e.length > 0) {
      const [start, end] = e;
      if (start && end) {
        // const startTime = dayjs(start).format('HH:mm');
        // const endTime = dayjs(end).format('HH:mm');
        // tableData.value[currentRow.value].hour = startTime;
        // tableData.value[currentRow.value].end = endTime;
        // data.value[currentRow.value][0] = startTime;
        // data.value[currentRow.value][1] = endTime;
      }
    }
  };
  const getPopupContainer = (triggerNode) => {
    return triggerNode.parentNode;
  };
</script>

<template>
  <PageWrapper :contentStyle="{ margin: '0px' }">
    <div>
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
                    <!-- <Select
                      v-model:value="record.hour"
                      style="width: 100px"
                      :options="timesList"
                      :size="FORM_SIZE"
                      :ref="'timeConfigDom' + index"
                      @dropdownVisibleChange="updateConflictTimes(index)"
                      :allowClear="true"
                      @change="updateOriginalData(index, 'end')"
                    /> -->
                    <!-- @change="updateConflictTimes(index)" -->
                    <!-- {{ record.hour }} -->
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
                  <!-- <InputNumber
                    :size="FORM_SIZE"
                    v-model:value="record.end"
                    :min="1"
                    @change="updateOriginalData(index, 'end')"
                  /> -->
                  <!-- :disabled="index != tableData.length - 1" -->
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
              :style="{ width: 'aotu', overflow: 'auto' }"
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
                <template v-else-if="column.dataIndex === 'amount'">
                  <!-- <InputNumber 
                    v-model:value="record.amount"
                    :min="0"
                    @change="updateOriginalData(index, 'amount')"
                  /> -->

                  <div :key="index" class="zyjuz_m" :class="{ '  mt-10px': index > 0 }">
                    <div class="w-49% left maxw-130px">
                      <InputNumber
                        :min="0"
                        :stringMode="true"
                        class="w-100% !min-w-100% rounded-xs"
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
                    <div
                      class="w-51% left"
                      v-if="form_data.bonusmethod == 2 || form_data.bonusmethod == 4"
                    >
                      <span class="w-10% left leading-37px">~</span>
                      <div class="w-90% left maxw-130px">
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
                  </div>
                </template>
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
