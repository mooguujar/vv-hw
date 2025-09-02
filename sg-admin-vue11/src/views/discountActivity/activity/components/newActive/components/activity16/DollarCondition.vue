<script lang="ts" setup>
  import { computed, reactive, ref, watch, defineEmits, withDefaults, defineProps } from 'vue';
  import { Table, Select, InputNumber } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';

  const { t } = useI18n();

  interface Props {
    modelValue: [];
    currencyId: String; // 当前币种
    form_data: object;
    templateData: object;
  }
  const props = withDefaults(defineProps<Props>(), {});

  const emit = defineEmits(['update:modelValue']);
  const currencyId = computed(() => props.currencyId);
  const templateData = computed(() => props.templateData);
  const column = {
    // 固定金额
    fixed: [
      {
        align: 'center',
        slots: { title: 'minCondition' },
        width: '50%',
        dataIndex: 'min_value_fixed',
      },
      {
        title: t('common.active_text13'),
        align: 'center',
        width: '50%',
        slot: 'reward',
        dataIndex: 'fixed',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        width: '10%',
        align: 'center',
      },
    ],
    // 随机金额
    random: [
      {
        align: 'center',
        slots: { title: 'minCondition' },
        dataIndex: 'min_value_random',
      },
      {
        title: t('common.active_text13'),
        align: 'center',
        slot: 'reward',
        dataIndex: 'random',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        align: 'center',
      },
    ],
    // 固定比例
    percentage: [
      {
        align: 'center',
        slots: { title: 'minCondition' },
        width: '50%',
        dataIndex: 'min_value_percentage',
      },
      {
        title: t('common.active_text13'),
        align: 'center',
        width: '50%',
        slot: 'reward',
        dataIndex: 'percentage',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        width: '10%',
        align: 'center',
      },
    ],
    // 随机比例
    random_percentage: [
      {
        align: 'center',
        slots: { title: 'minCondition' },
        dataIndex: 'min_value_random_percentage',
      },
      {
        title: t('common.active_text13'),
        align: 'center',
        slot: 'reward',
        dataIndex: 'random_percentage',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        align: 'center',
      },
    ],
  };
  const tableColumn = computed(() => column[props.form_data?.amount_type] || []);
  const modelValueRef = computed(() => props.modelValue);
  const minimumThreshold = computed(() =>
    props.form_data?.reward_type === 'recharge'
      ? t('common.active_text21')
      : props.form_data?.reward_type === 'loss'
      ? t('common.active_text23')
      : t('common.active_text24'),
  );
  const redBagRainRef = ref(null);
  const key = ref(0);
  const onDeleteDeposit = (data, index) => {
    modelValueRef.value.splice(index, 1);
  };

  const handleAddDeposit = (data) => {
    const row = cloneDeep(
      templateData.value[props.form_data?.reward_type][props.form_data?.amount_type],
    );
    modelValueRef.value.push(row[0]);
  };

  watch(
    () => props.form_data?.amount_type,
    (newValue, old) => {
      // redBagRainRef.value.
      key.value += 1;
    },
    { deep: true, immediate: true },
  );
  watch(
    () => props.form_data?.reward_type,
    (newValue, old) => {
      // redBagRainRef.value.
      key.value += 1;
    },
    { deep: true, immediate: true },
  );
</script>

<template>
  <div>
    <Table
      :data-source="modelValueRef"
      :columns="tableColumn"
      size="small"
      ref="redBagRainRef"
      :pagination="false"
      :style="{ width: 'auto', overflow: 'auto' }"
      :key="key"
    >
      <template #minCondition>
        {{ minimumThreshold }}≥
        <cdIconCurrency :id="currencyId" class="w-5 ml-1" />
      </template>
      <template #bodyCell="{ column, record, index }">
        <!-- 操作 -->
        <template v-if="column?.dataIndex === 'oper'">
          <div class="flex justify-center" :class="{ 'mt-10px': index > 0 }">
            <div class="ml-2">
              <div class="flex justify-center">
                <a @click="handleAddDeposit(record)" class="mr-2"><img :src="RECT_ADD" /></a>
                <a @click="onDeleteDeposit(record, index)" v-if="index > 0"
                  ><img :src="RECT_DELETE"
                /></a>
                <div v-else class="w-52px h-38px"></div>
              </div>
            </div>
          </div>
        </template>
        <!-- 固定金额 -->
        <template v-if="form_data?.amount_type === 'fixed'">
          <div v-if="column?.dataIndex === 'min_value_fixed'">
            <InputNumber
              v-model:value="record.min_value"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_tip')"
              :min="0"
            />
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'fixed'">
            <InputNumber
              v-model:value="record.fixed"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_tip')"
              :min="0"
            />
          </div>
        </template>
        <!-- 固定比例 -->
        <template v-if="form_data?.amount_type === 'percentage'">
          <div v-if="column?.dataIndex === 'min_value_percentage'">
            <InputNumber
              v-model:value="record.min_value"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_tip')"
              :min="0"
            />
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'percentage'">
            <InputNumber
              v-model:value="record.fixed"
              :controls="false"
              size="large"
              :stringMode="true"
              :addonAfter="'%'"
              :placeholder="$t('v.discount.activity.please_tip')"
              :min="0"
            />
          </div>
        </template>
        <!-- 随机金额 -->
        <template v-if="form_data?.amount_type === 'random'">
          <div v-if="column?.dataIndex === 'min_value_random'">
            <InputNumber
              v-model:value="record.min_value"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_tip')"
              :min="0"
            />
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'random'">
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              :stringMode="true"
              v-model:value="record.range_min"
              :placeholder="$t('v.discount.activity.please_enter')"
            />

            <span>~</span>
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              :stringMode="true"
              v-model:value="record.range_max"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
          </div>
        </template>
        <!-- 随机比例 -->
        <template v-if="form_data?.amount_type === 'random_percentage'">
          <div v-if="column?.dataIndex === 'min_value_random_percentage'">
            <InputNumber
              v-model:value="record.min_value"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_tip')"
              :min="0"
            />
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'random_percentage'">
            <InputNumber
              :min="0"
              size="large"
              :controls="false"
              :addonAfter="'%'"
              :stringMode="true"
              v-model:value="record.range_min"
              :placeholder="$t('v.discount.activity.please_enter')"
            />
            <span>~</span>
            <InputNumber
              :min="0"
              size="large"
              :addonAfter="'%'"
              :stringMode="true"
              :controls="false"
              v-model:value="record.range_max"
              :placeholder="$t('v.discount.activity.please_enter')"
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

  .zyjuz_m {
    display: flex;
    align-items: center;

    span {
      // line-height: 38px;
      margin: 0 4px;
    }

    .ant-input-number {
      flex-grow: 1;
      height: 38px;
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
