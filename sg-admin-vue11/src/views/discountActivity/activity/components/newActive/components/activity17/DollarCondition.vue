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
    bonusType: string;
    timedIdisable: string;
    form_data: object;
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
        conPartType: '2',
        miniPartDeposit: '',
        form_data: {},
        intervalDeposit: [],
        wax: [],
        coded: [],
        chipsMultiples: [{ chipsMultiple: '' }],
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
    conPartType: string;
    miniPartDeposit: string;
    wax: any;
    intervalDeposit: any;
    coded: any;
  }

  const emit = defineEmits([
    'update:modelValue',
    'update:conditionType',
    'update:conditionTime',
    'update:deleteKey',
  ]);

  type ConditionType = '1' | '2' | '3' | '4' | '5' | '6';

  const redBagRainRef = ref(null);
  // const validTimeList = ref([]);
  const currencyName = computed(() => props.currencyName);
  const bonusType = computed(() => props.bonusType || '2');

  const conditionOptions = reactive<{ label: string; value: ConditionType; disabled: boolean }[]>([
    {
      label: t('v.discount.activity.red_lop_1'),
      value: '1',
      disabled: false,
    },
    {
      label: t('v.discount.activity.red_lop_2'),
      value: '2',
      disabled: false,
    },
    {
      label: t('v.discount.activity.red_lop_3'),
      value: '3',
      disabled: false,
    },
    {
      label: t('v.discount.activity.red_lop_4'),
      value: '4',
      disabled: false,
    },
    {
      label: t('v.discount.activity.red_lop_5'),
      value: '5',
      disabled: false,
    },
    {
      label: t('v.discount.activity.red_lop_6'),
      value: '6',
      disabled: false,
    },
  ]);
  const timeList = [
    { label: '00:00', value: '0:00', index: 0, disabled: false },
    { label: '1:00', value: '0:59', index: 1, disabled: false },
    { label: '2:00', value: '1:59', index: 2, disabled: false },
    { label: '3:00', value: '2:59', index: 3, disabled: false },
    { label: '4:00', value: '3:59', index: 4, disabled: false },
    { label: '5:00', value: '4:59', index: 5, disabled: false },
    { label: '6:00', value: '5:59', index: 6, disabled: false },
    { label: '7:00', value: '6:59', index: 7, disabled: false },
    { label: '8:00', value: '7:59', index: 8, disabled: false },
    { label: '9:00', value: '8:59', index: 9, disabled: false },
    { label: '10:00', value: '9:59', index: 10, disabled: false },
    { label: '11:00', value: '10:59', index: 11, disabled: false },
    { label: '12:00', value: '11:59', index: 12, disabled: false },
    { label: '13:00', value: '12:59', index: 13, disabled: false },
    { label: '14:00', value: '13:59', index: 14, disabled: false },
    { label: '15:00', value: '14:59', index: 15, disabled: false },
    { label: '16:00', value: '15:59', index: 16, disabled: false },
    { label: '17:00', value: '16:59', index: 17, disabled: false },
    { label: '18:00', value: '17:59', index: 18, disabled: false },
    { label: '19:00', value: '18:59', index: 19, disabled: false },
    { label: '20:00', value: '19:59', index: 20, disabled: false },
    { label: '21:00', value: '20:59', index: 21, disabled: false },
    { label: '22:00', value: '21:59', index: 22, disabled: false },
    { label: '23:00', value: '22:59', index: 23, disabled: false },
    { label: '00:00', value: '23:59', index: 24, disabled: false },
  ];
  /** 活动提交结束 */
  function addMinute(timeStr) {
    if (timeStr == '0:00') return timeStr;
    // 验证输入格式
    if (!/^\d{1,2}:\d{2}$/.test(timeStr)) {
      throw new Error('时间格式应为"h:mm"或"hh:mm"');
    }

    const [h, m] = timeStr.split(':').map(Number);

    // 验证小时和分钟范围
    if (h < 0 || h >= 24 || m < 0 || m >= 60) {
      throw new Error('无效的时间值');
    }

    const date = new Date();
    date.setHours(h, m + 1, 0, 0);

    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
  const validTimeList = ref(timeList);

  const columns = computed(() => {
    let arr = [
      {
        title: t('v.discount.activity.s_e_time'),
        dataIndex: 'time',
        width: '20%',
        align: 'center',
      },
      // {
      //   slots: { title: 'coded' },
      //   dataIndex: 'coded',
      //   align: 'center',
      // },
      // {
      //   slots: { title: 'wax' },
      //   dataIndex: 'wax',
      //   align: 'center',
      // },
      // {
      //   slots: { title: 'minCondition' },
      //   dataIndex: 'miniConditionDeposit',
      //   align: 'center',
      // },
      // {
      //   title: t('common.active_text13'),
      //   dataIndex: 'chipsMultiple',
      //   align: 'center',
      // },
    ];
    if (props.form_data.fulfil_cond == 2) {
      arr.push(
        {
          slots: { title: 'minCondition' },
          dataIndex: 'miniConditionDeposit',
          align: 'center',
        },
        {
          slots: { title: 'coded' },
          dataIndex: 'coded',
          align: 'center',
        },
        {
          slots: { title: 'wax' },
          dataIndex: 'wax',
          align: 'center',
        },
      );
    } else if (props.form_data.reward_type == 2) {
      arr.push({
        slots: { title: 'wax' },
        dataIndex: 'wax',
        align: 'center',
      });
    } else if (props.form_data.reward_type == 3) {
      arr.push({
        slots: { title: 'coded' },
        dataIndex: 'coded',
        align: 'center',
      });
    } else {
      arr.push({
        slots: { title: 'minCondition' },
        dataIndex: 'miniConditionDeposit',
        align: 'center',
      });
    }
    arr.push({
      title: t('common.active_text13'),
      dataIndex: 'chipsMultiple',
      align: 'center',
    } as any);
    return arr;
  });
  const modelValueRef = computed(() => props.modelValue);
  const dataSource = ref(props.modelValue.map((item, idx) => ({ ...item })));

  const isDisabled = computed(() => {
    return true;
  });

  const onDelete = (data, index) => {
    data.conditionTime.splice(index, 1);
  };

  const handleAdd = (data) => {
    data.conditionTime.push({ str: undefined, end: undefined });
  };

  const onDeleteDeposit = (data, index) => {
    data.intervalDeposit.splice(index, 1);
    data.coded.splice(index, 1);
    data.wax.splice(index, 1);
    data.chipsMultiples.splice(index, 1);
  };

  const handleAddDeposit = (data) => {
    // data.intervalDeposit.push({ min: '', max: '' });
    data.intervalDeposit.push({ min: '' });
    data.wax.push({ min: '' });
    data.coded.push({ min: '' });
    data.chipsMultiples.push({ chipsMultiple: '' });
  };

  function conditionTypeChange(v, type) {
    if (type == 1) dataSource.value[0].conditionType = v;
    else dataSource.value[0].conPartType = v;
    // emit('update:conditionType', v);
  }

  async function changeConditionTime(val) {
    // modelValueRef.value.forEach((item) => {
    //   if (item.conditionTime) {
    //     item.conditionTime = item.conditionTime.toSorted((a, b) => {
    //       return Number(a.split(':')[0]) - Number(b.split(':')[0]);
    //     });
    //   }
    // });
    // emit('update:conditionTime', val);
  }
  async function changeConditionTime1(val, index) {
    modelValueRef.value.forEach((item) => {
      if (item.conditionTime) {
        // item.conditionTime = item.conditionTime.toSorted((a, b) => {
        //   return Number(a.split(':')[0]) - Number(b.split(':')[0]);
        // });
        item.conditionTime[index].str = addMinute(val);
      }
    });
    // emit('update:conditionTime', val);
  }

  // function reset(data) {
  //   data.conditionTime = [];
  //   data.conditionType = null;
  //   data.miniDeposit = null;
  //   data.chipsMultiple = null;
  //   // data.dollarPercent = null;
  // }

  function calcValidTimeList() {
    const conditionTime = modelValueRef.value[0].conditionTime;

    const selectedTimes = conditionTime.map((item) => [item.str, item.end]).flat();

    const selectedEndTimes = conditionTime.map((item) => [item.end]).flat();

    const selectedStrTimes = conditionTime.map((item) => [item.str]).flat();

    validTimeList.value.forEach((time) => {
      time.disabled = false;
    });

    const toMinutes = (time) => {
      if (!time) return false;
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const maxTimeString = selectedStrTimes.reduce((max, current) => {
      return toMinutes(current) > toMinutes(max) ? current : max; // 直接比较字符串
    });
    if (maxTimeString) {
      validTimeList.value.forEach((t) => {
        const [tHour, tMinute] = t.value.split(':').map(Number);
        const [maxHour, maxMinute] = maxTimeString.split(':').map(Number);

        // 转换为分钟进行比较
        const tInMinutes = tHour * 60 + tMinute;
        const maxInMinutes = maxHour * 60 + maxMinute;
        if (tInMinutes <= maxInMinutes) {
          t.disabled = true;
        }
      });
    }

    const maxTimeEndString = selectedEndTimes.reduce((max, current) => {
      return toMinutes(current) > toMinutes(max) ? current : max; // 直接比较字符串
    });
    if (maxTimeEndString) {
      validTimeList.value.forEach((t) => {
        const [tHour, tMinute] = t.value.split(':').map(Number);
        const [maxHour, maxMinute] = maxTimeEndString.split(':').map(Number);

        // 转换为分钟进行比较
        const tInMinutes = tHour * 60 + tMinute;
        const maxInMinutes = maxHour * 60 + maxMinute;
        if (tInMinutes < maxInMinutes) {
          t.disabled = true;
        }
        if (maxTimeEndString == '24:00' && t.value == '24:00') {
          t.disabled = true;
        }
      });
    }

    // const selectTimes = selectedEndTimes.filter((item) => !selectedStrTimes.includes(item));

    // validTimeList.value.forEach((t) => {
    //   selectTimes.forEach((selectedTime) => {
    //     if (t.value === selectedTime) {
    //       t.disabled = false; // 确保结束时间可选
    //     }
    //   });
    // });

    conditionOptions.forEach((option) => {
      option.disabled = false;
    });

    conditionOptions.forEach((option) => {
      option.disabled =
        option.value == modelValueRef.value[0].conPartType ||
        option.value == modelValueRef.value[0].conditionType;
    });
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
  watch(
    () => props.form_data,
    (e, o) => {
      if (e.change) {
        setTimeout(() => {
          dataSource.value = [
            {
              key: '1',
              index: '1',
              type: '2',
              miniDeposit: '',
              chipsMultiple: '',
              conditionType: '1',
              conPartType: '2',
              miniPartDeposit: '',
              conditionTime: dataSource.value[0].conditionTime,
              intervalDeposit: [
                {
                  amount: '', //存款金额
                  fixed: '',
                  min: '',
                  max: '',
                },
              ],
              wax: [
                {
                  amount: '', //存款金额
                  fixed: '',
                  min: '',
                  max: '',
                },
              ],
              coded: [
                {
                  amount: '', //存款金额
                  fixed: '',
                  min: '',
                  max: '',
                },
              ],
              chipsMultiples: [{ chipsMultiple: '', chipsMultiple2: '' }],
            },
          ];
        }, 333);
      }
    },
    {
      deep: true,
    },
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
      :scroll="{ x: 'max-content' }"
      :style="{ width: '1200px', overflow: 'auto' }"
    >
      <template #minCondition>
        {{ t('common.active_text21')
        }}<span
          >({{ t('v.discount.activity.condition_3') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1" />)</span
        >
      </template>
      <template #wax>
        {{ t('common.active_text23')
        }}<span
          >({{ t('v.discount.activity.condition_3') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1" />)</span
        >
      </template>
      <template #coded>
        {{ t('common.active_text24')
        }}<span
          >({{ t('v.discount.activity.condition_3') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1" />)</span
        >
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
          <div
            class="flex items-center justify-center"
            :class="{ 'mt-10px': index > 0 }"
            v-for="(time, index) in record.conditionTime"
            :key="index"
          >
            <Select
              v-model:value="record.conditionTime[index].str"
              :options="validTimeList.slice(0, 24)"
              allowClear
              size="large"
              class="select__fontBig__class"
              style="width: 100px"
              :placeholder="t('common.chooseText')"
              @change="changeConditionTime1(record.conditionTime[index].str, index)"
              :disabled="!!timedIdisable"
            />
            <div class="divider"></div>
            <Select
              v-model:value="record.conditionTime[index].end"
              :options="validTimeList.slice(1, 25)"
              allowClear
              size="large"
              style="width: 100px"
              class="select__fontBig__class"
              :placeholder="t('common.chooseText')"
              @change="changeConditionTime"
              :disabled="!!!record.conditionTime[index].str"
            />
            <div class="ml-2">
              <div class="flex justify-center">
                <a
                  @click="handleAdd(record)"
                  class="mr-2"
                  :class="{ 'disabled-link': !!timedIdisable }"
                  :style="{
                    'pointer-events': !!timedIdisable ? 'none' : 'auto',
                    opacity: !!timedIdisable ? 0.5 : 1,
                  }"
                  ><img :src="RECT_ADD"
                /></a>
                <a
                  @click="onDelete(record, index)"
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
            </div>
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'wax'">
          <div class="flex items-center justify-center">
            <div>
              <div
                class="flex items-center justify-center"
                :class="{ 'mt-10px': index > 0 }"
                v-for="(time, index) in record.wax"
                :key="index"
              >
                <InputNumber
                  v-model:value="record.wax[index].min"
                  :controls="false"
                  size="large"
                  class="!max-w-110px"
                  :stringMode="true"
                  :placeholder="t('common.chooseText_min')"
                  :min="0"
                  :disabled="!!timedIdisable"
                />
                <div class="ml-2">
                  <div class="flex justify-center">
                    <a
                      @click="handleAddDeposit(record)"
                      class="mr-2"
                      :class="{ 'disabled-link': !!timedIdisable }"
                      :style="{
                        'pointer-events': !!timedIdisable ? 'none' : 'auto',
                        opacity: !!timedIdisable ? 0.5 : 1,
                      }"
                      ><img :src="RECT_ADD"
                    /></a>
                    <a
                      @click="onDeleteDeposit(record, index)"
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
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'coded'">
          <div class="flex items-center justify-center">
            <div>
              <div
                class="flex items-center justify-center"
                :class="{ 'mt-10px': index > 0 }"
                v-for="(time, index) in record.coded"
                :key="index"
              >
                <InputNumber
                  v-model:value="record.coded[index].min"
                  :controls="false"
                  class="!max-w-110px"
                  size="large"
                  :stringMode="true"
                  :placeholder="t('common.chooseText_min')"
                  :min="0"
                  :disabled="!!timedIdisable"
                />
                <div class="ml-2">
                  <div class="flex justify-center">
                    <a
                      @click="handleAddDeposit(record)"
                      class="mr-2"
                      :class="{ 'disabled-link': !!timedIdisable }"
                      :style="{
                        'pointer-events': !!timedIdisable ? 'none' : 'auto',
                        opacity: !!timedIdisable ? 0.5 : 1,
                      }"
                      ><img :src="RECT_ADD"
                    /></a>
                    <a
                      @click="onDeleteDeposit(record, index)"
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
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'miniConditionDeposit'">
          <div class="flex items-center justify-center">
            <!-- <Select
              v-model:value="record.conditionType"
              :options="conditionOptions"
              size="large"
              allowClear
              style="width: 100px"
              :placeholder="t('common.chooseText')"
              @change="(value) => conditionTypeChange(value, 1)"
              :disabled="!!timedIdisable"
            /> -->
            <!-- <div class="w-20px"></div> -->
            <!-- {{ bonusType }} -->
            <!-- <InputNumber
              v-if="bonusType == '1'"
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.miniDeposit"
              :placeholder="$t('v.discount.activity.please_tip')"
              :disabled="!!timedIdisable"
            /> -->
            <div>
              <div
                class="flex items-center justify-center"
                :class="{ 'mt-10px': index > 0 }"
                v-for="(time, index) in record.intervalDeposit"
                :key="index"
              >
                <InputNumber
                  v-model:value="record.intervalDeposit[index].min"
                  :controls="false"
                  class="!max-w-110px"
                  size="large"
                  :stringMode="true"
                  :placeholder="t('common.chooseText_min')"
                  :min="0"
                  :disabled="!!timedIdisable"
                />
                <!-- <div class="divider"></div>
                <InputNumber
                  v-model:value="record.intervalDeposit[index].max"
                  :controls="false"
                  size="large"
                  :stringMode="true"
                  :placeholder="t('common.chooseText_max')"
                  :min="0"
                  :disabled="!!timedIdisable"
                /> -->
                <div class="ml-2">
                  <div class="flex justify-center">
                    <a
                      @click="handleAddDeposit(record)"
                      class="mr-2"
                      :class="{ 'disabled-link': !!timedIdisable }"
                      :style="{
                        'pointer-events': !!timedIdisable ? 'none' : 'auto',
                        opacity: !!timedIdisable ? 0.5 : 1,
                      }"
                      ><img :src="RECT_ADD"
                    /></a>
                    <a
                      @click="onDeleteDeposit(record, index)"
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
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'chipsMultiple'">
          <!-- <div v-if="bonusType == '1'">
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              v-model:value="record.chipsMultiple"
              :placeholder="$t('v.discount.activity.please_enter')"
              :disabled="!!timedIdisable"
            />
          </div> -->
          <div
            v-for="(time, index) in record.chipsMultiples"
            :key="index"
            class="zyjuz_m"
            :class="{ 'mt-10px': index > 0 }"
          >
            <div class="w-49% left">
              <InputNumber
                :min="0"
                size="large"
                :controls="false"
                :addonAfter="form_data.way == 3 || form_data.way == 4 ? '%' : ''"
                v-model:value="time.chipsMultiple"
                :placeholder="$t('v.discount.activity.please_enter')"
                :disabled="!!timedIdisable"
              />
            </div>
            <div class="w-51% left" v-if="form_data.way == 2 || form_data.way == 4">
              <span class="w-10% left leading-37px">~</span>
              <div class="w-90% left">
                <InputNumber
                  :min="0"
                  size="large"
                  :addonAfter="form_data.way == 3 || form_data.way == 4 ? '%' : ''"
                  :controls="false"
                  v-model:value="time.chipsMultiple2"
                  :placeholder="$t('v.discount.activity.please_enter')"
                  :disabled="!!timedIdisable"
                />
              </div>
            </div>
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

  .divider {
    width: 20px;
    height: 2px;
    margin: 0 2px;
    background-color: #e1e1e1;
  }

  .disabled-link {
    cursor: not-allowed;
  }
</style>
