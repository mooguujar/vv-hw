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
        intervalDeposit: [],
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
    intervalDeposit: any;
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
  const bonusType = computed(() => props.bonusType);

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
    { label: '1:00', value: '1:00', index: 1, disabled: false },
    { label: '2:00', value: '2:00', index: 2, disabled: false },
    { label: '3:00', value: '3:00', index: 3, disabled: false },
    { label: '4:00', value: '4:00', index: 4, disabled: false },
    { label: '5:00', value: '5:00', index: 5, disabled: false },
    { label: '6:00', value: '6:00', index: 6, disabled: false },
    { label: '7:00', value: '7:00', index: 7, disabled: false },
    { label: '8:00', value: '8:00', index: 8, disabled: false },
    { label: '9:00', value: '9:00', index: 9, disabled: false },
    { label: '10:00', value: '10:00', index: 10, disabled: false },
    { label: '11:00', value: '11:00', index: 11, disabled: false },
    { label: '12:00', value: '12:00', index: 12, disabled: false },
    { label: '13:00', value: '13:00', index: 13, disabled: false },
    { label: '14:00', value: '14:00', index: 14, disabled: false },
    { label: '15:00', value: '15:00', index: 15, disabled: false },
    { label: '16:00', value: '16:00', index: 16, disabled: false },
    { label: '17:00', value: '17:00', index: 17, disabled: false },
    { label: '18:00', value: '18:00', index: 18, disabled: false },
    { label: '19:00', value: '19:00', index: 19, disabled: false },
    { label: '20:00', value: '20:00', index: 20, disabled: false },
    { label: '21:00', value: '21:00', index: 21, disabled: false },
    { label: '22:00', value: '22:00', index: 22, disabled: false },
    { label: '23:00', value: '23:00', index: 23, disabled: false },
    { label: '00:00', value: '24:00', index: 24, disabled: false },
  ];

  const validTimeList = ref(timeList);

  const columns = computed(() => [
    {
      title: t('v.discount.activity.s_e_time'),
      dataIndex: 'time',
      width: '20%',
      align: 'center',
    },
    {
      slots: { title: 'minPart' },
      dataIndex: 'miniPartDeposit',
      align: 'center',
    },
    {
      slots: { title: 'minCondition' },
      dataIndex: 'miniConditionDeposit',
      align: 'center',
    },
    {
      title: t('v.discount.activity.red_rate') + '(%)',
      dataIndex: 'chipsMultiple',
      align: 'center',
    },
  ]);
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
    data.chipsMultiples.splice(index, 1);
  };

  const handleAddDeposit = (data) => {
    data.intervalDeposit.push({ min: '', max: '' });
    data.chipsMultiples.push({ chipsMultiple: '' });
  };

  function conditionTypeChange(v, type) {
    if (type == 1) dataSource.value[0].conditionType = v;
    else dataSource.value[0].conPartType = v;
  }

  async function changeConditionTime(val) {}

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
      <template #minPart>
        {{ t('v.discount.activity.condition_1')
        }}<span
          >({{ t('v.discount.activity.condition_3') }} ≥
          <cdIconCurrency :icon="currencyName" class="w-5 mb-1" />)</span
        >
      </template>
      <template #minCondition>
        {{ t('v.discount.activity.condition_2')
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
              @change="changeConditionTime"
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
              :disabled="!!timedIdisable"
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

        <template v-else-if="column.dataIndex === 'miniPartDeposit'">
          <div class="flex items-center justify-center">
            <Select
              v-model:value="record.conPartType"
              :options="conditionOptions"
              size="large"
              allowClear
              style="width: 100px"
              :placeholder="t('common.chooseText')"
              @change="(value) => conditionTypeChange(value, 2)"
              :disabled="!!timedIdisable"
            />
            <div class="w-20px"></div>
            <InputNumber
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.miniPartDeposit"
              :placeholder="$t('v.discount.activity.please_tip')"
              :disabled="!!timedIdisable"
            />
          </div>
        </template>

        <template v-else-if="column.dataIndex === 'miniConditionDeposit'">
          <div class="flex items-center justify-center">
            <Select
              v-model:value="record.conditionType"
              :options="conditionOptions"
              size="large"
              allowClear
              style="width: 100px"
              :placeholder="t('common.chooseText')"
              @change="(value) => conditionTypeChange(value, 1)"
              :disabled="!!timedIdisable"
            />
            <div class="w-20px"></div>
            <InputNumber
              v-if="bonusType == '1'"
              :controls="false"
              size="large"
              :stringMode="true"
              :min="0"
              v-model:value="record.miniDeposit"
              :placeholder="$t('v.discount.activity.please_tip')"
              :disabled="!!timedIdisable"
            />
            <div v-else>
              <div
                class="flex items-center justify-center"
                :class="{ 'mt-10px': index > 0 }"
                v-for="(time, index) in record.intervalDeposit"
                :key="index"
              >
                <InputNumber
                  v-model:value="record.intervalDeposit[index].min"
                  :controls="false"
                  size="large"
                  :stringMode="true"
                  :placeholder="t('common.chooseText_min')"
                  :min="0"
                  :disabled="!!timedIdisable"
                />
                <div class="divider"></div>
                <InputNumber
                  v-model:value="record.intervalDeposit[index].max"
                  :controls="false"
                  size="large"
                  :stringMode="true"
                  :placeholder="t('common.chooseText_max')"
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
        <template v-else-if="column.dataIndex === 'chipsMultiple'">
          <div v-if="bonusType == '1'">
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              v-model:value="record.chipsMultiple"
              :placeholder="$t('v.discount.activity.please_enter')"
              :disabled="!!timedIdisable"
            />
          </div>
          <div
            v-else
            v-for="(time, index) in record.chipsMultiples"
            :key="index"
            :class="{ 'mt-10px': index > 0 }"
          >
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              v-model:value="time.chipsMultiple"
              :placeholder="$t('v.discount.activity.please_enter')"
              :disabled="!!timedIdisable"
            />
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
