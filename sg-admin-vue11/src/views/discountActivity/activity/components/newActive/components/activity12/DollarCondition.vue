<script lang="ts" setup>
  import { computed, ref, watch, defineEmits, withDefaults, defineProps } from 'vue';
  import { Table, InputNumber } from 'ant-design-vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isNotNumber } from '/@/utils/number';

  const { t } = useI18n();
  const vRules = ref(false);
  interface Props {
    modelValue: [];
    currencyId: String; // 当前币种
    form_data: object;
  }
  const props = withDefaults(defineProps<Props>(), {
    modelValue: () => [
      {
        d: undefined,
        b: undefined,
        e: undefined,
      },
    ],
  });

  const emit = defineEmits(['update:modelValue']);
  const currencyId = computed(() => props.currencyId);
  const column = {
    staticType0: [
      {
        align: 'center',
        slots: { title: 'minD' },
        width: '50%',
        dataIndex: 'd',
      },
      {
        align: 'center',
        slots: { title: 'fiedD' },
        width: '50%',
        slot: 'reward',
        dataIndex: 'b',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        width: '10%',
        align: 'center',
      },
    ],
    staticType1: [
      {
        align: 'center',
        slots: { title: 'minD' },
        width: '50%',
        dataIndex: 'd',
      },
      {
        align: 'center',
        slots: { title: 'fiedD' },
        width: '50%',
        slot: 'reward',
        dataIndex: 'b',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        width: '10%',
        align: 'center',
      },
    ],
    staticType2: [
      {
        align: 'center',
        slots: { title: 'minD' },
        width: '50%',
        dataIndex: 'd',
      },
      {
        align: 'center',
        slots: { title: 'fiedD' },
        width: '50%',
        slot: 'reward',
        dataIndex: 'b',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        width: '10%',
        align: 'center',
      },
    ],
    staticType3: [
      {
        align: 'center',
        slots: { title: 'minD' },
        width: '50%',
        dataIndex: 'd',
      },
      {
        slots: { title: 'fiedD' },
        align: 'center',
        width: '50%',
        slot: 'reward',
        dataIndex: 'b',
      },
      {
        title: t('v.discount.activity.operation'),
        dataIndex: 'oper',
        width: '10%',
        align: 'center',
      },
    ],
  };
  const tableColumn = computed(() => column['staticType' + props.form_data?.staticType] || []);
  const modelValueRef = computed(() => props.modelValue);
  const minimumThreshold = computed(() =>
    props.form_data?.staticType === 0
      ? t('modalForm.finance.common_income.income_amount')
      : props.form_data?.staticType === 3
      ? t('table.report.report_negative_profit_amount')
      : props.form_data?.staticType === 1
      ? t('common.platform_loss_amount')
      : t('common.bet_amount'),
  );
  const redBagRainRef = ref(null);
  const key = ref(0);
  const onDeleteDeposit = (data, index) => {
    modelValueRef.value.splice(index, 1);
  };

  const handleAddDeposit = (data) => {
    if ([0, 2].includes(props.form_data?.adwardType)) {
      modelValueRef.value.push({
        d: undefined,
        b: undefined,
      });
    } else {
      modelValueRef.value.push({
        d: undefined,
        b: undefined,
        e: undefined,
      });
    }
  };

  watch(
    () => props.form_data?.staticType,
    (newValue, old) => {
      key.value += 1;
      vRules.value = false;
    },
    { deep: true, immediate: true },
  );
  watch(
    () => props.form_data?.adwardType,
    (newValue, old) => {
      key.value += 1;
      vRules.value = false;
    },
    { deep: true, immediate: true },
  );
  defineExpose({
    vRules,
  });
</script>

<template>
  <div>
    <Table
      :data-source="modelValueRef"
      :columns="tableColumn"
      size="small"
      ref="redBagRainRef"
      :pagination="false"
      :style="{ width: '100%', overflow: 'auto' }"
      :key="key"
      :class="{ 'verification-rules': vRules }"
    >
      <template #minD>
        <span class="header-th"> {{ minimumThreshold }} </span>
        <span class="whitespace-nowrap"
          >≥ <cdIconCurrency :id="currencyId" class="w-5 mb-1" />
        </span>
      </template>
      <template #fiedD>
        <span class="header-th"> {{ t('common.translate.word52') }} </span>
        <span class="whitespace-nowrap pl-[5px]">
          <cdIconCurrency :id="currencyId" class="w-5 mb-1" />
        </span>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column?.dataIndex === 'oper'">
          <div class="flex items-center justify-center" :class="{ 'mt-10px': index > 0 }">
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

        <template v-if="form_data?.adwardType == 0">
          <div v-if="column?.dataIndex === 'd'">
            <InputNumber
              v-model:value="record.d"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_enter')"
              :min="0"
              :class="{ 'ant-form-item-has-error': isNotNumber(record.d) }"
            />
            <div v-if="isNotNumber(record.d)" class="ant-form-item-explain-error">
              {{ t('v.discount.activity.please_enter') + minimumThreshold }}
            </div>
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'b'">
            <InputNumber
              v-model:value="record.b"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_enter')"
              :min="0"
              :class="{ 'ant-form-item-has-error': isNotNumber(record.b) }"
            />
            <div v-if="isNotNumber(record.b)" class="ant-form-item-explain-error">
              {{ t('common.translate.word52_r') }}
            </div>
          </div>
        </template>
        <template v-if="form_data?.adwardType === 2">
          <div v-if="column?.dataIndex === 'd'">
            <InputNumber
              v-model:value="record.d"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_enter')"
              :min="0"
              :class="{ 'ant-form-item-has-error': isNotNumber(record.d) }"
            />
            <div v-if="isNotNumber(record.d)" class="ant-form-item-explain-error">
              {{ t('v.discount.activity.please_enter') + minimumThreshold }}
            </div>
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'b'">
            <InputNumber
              v-model:value="record.b"
              :controls="false"
              size="large"
              :stringMode="true"
              :addonAfter="'%'"
              :placeholder="$t('v.discount.activity.please_enter')"
              :min="0"
              :class="{ 'ant-form-item-has-error': isNotNumber(record.b) }"
            />
            <div v-if="isNotNumber(record.b)" class="ant-form-item-explain-error">
              {{ t('common.translate.word52_r') }}
            </div>
          </div>
        </template>
        <template v-if="form_data?.adwardType === 1">
          <div v-if="column?.dataIndex === 'd'">
            <InputNumber
              v-model:value="record.d"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_enter')"
              :min="0"
              :class="{ 'ant-form-item-has-error': isNotNumber(record.d) }"
            />
            <div v-if="isNotNumber(record.d)" class="ant-form-item-explain-error">
              {{ t('v.discount.activity.please_enter') + minimumThreshold }}
            </div>
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'b'">
            <div>
              <InputNumber
                :min="0"
                size="large"
                :controls="false"
                :stringMode="true"
                v-model:value="record.b"
                :placeholder="$t('v.discount.activity.please_enter')"
                :class="{ 'ant-form-item-has-error': isNotNumber(record.b) }"
              />
              <span>~</span>
              <InputNumber
                :min="0"
                size="large"
                :controls="false"
                :stringMode="true"
                v-model:value="record.e"
                :placeholder="$t('v.discount.activity.please_enter')"
                :class="{ 'ant-form-item-has-error': isNotNumber(record.e) }"
              />
            </div>
            <div
              v-if="isNotNumber(record.b) || isNotNumber(record.e)"
              class="ant-form-item-explain-error"
            >
              {{ t('common.translate.word52_r') }}
            </div>
          </div>
        </template>
        <template v-if="form_data?.adwardType === 3">
          <div v-if="column?.dataIndex === 'd'">
            <InputNumber
              v-model:value="record.d"
              :controls="false"
              size="large"
              :stringMode="true"
              :placeholder="$t('v.discount.activity.please_enter')"
              :min="0"
              :class="{ 'ant-form-item-has-error': isNotNumber(record.d) }"
            />
            <div v-if="isNotNumber(record.d)" class="ant-form-item-explain-error">
              {{ t('v.discount.activity.please_enter') + minimumThreshold }}
            </div>
          </div>
          <div class="zyjuz_m" v-if="column?.dataIndex === 'b'">
            <div>
              <InputNumber
                :min="0"
                size="large"
                :controls="false"
                :addonAfter="'%'"
                :stringMode="true"
                v-model:value="record.b"
                :placeholder="$t('v.discount.activity.please_enter')"
                :class="{ 'ant-form-item-has-error': isNotNumber(record.b) }"
              />
              <span>~</span>
              <InputNumber
                :min="0"
                size="large"
                :addonAfter="'%'"
                :stringMode="true"
                :controls="false"
                v-model:value="record.e"
                :placeholder="$t('v.discount.activity.please_enter')"
                :class="{ 'ant-form-item-has-error': isNotNumber(record.e) }"
              />
            </div>
            <div
              v-if="isNotNumber(record.b) || isNotNumber(record.e)"
              class="ant-form-item-explain-error"
            >
              {{ t('common.translate.word52_r') }}
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

  .zyjuz_m {
    display: flex;
    flex-direction: column;
    align-items: center;

    > div:first-child {
      display: flex;
      align-items: center;
    }

    span {
      // line-height: 38px;
      margin: 0 4px;
    }

    .ant-input-number {
      flex-grow: 1;
      height: 38px;
    }
  }

  .ant-form-item-explain-error {
    display: none;
  }

  .header-th::before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    color: #ff4d4f;
    font-family: SimSun, sans-serif;
    font-size: 14px;
    line-height: 1;
  }

  .verification-rules {
    .ant-form-item-explain-error {
      width: 100%;
      color: #e91134;
      text-align: left;
    }

    :deep(.ant-input-number-input-wrap) {
      width: 100%;
    }

    .ant-form-item-has-error.ant-input-number {
      border-color: #f53851;
      box-shadow: 0 0 0 2px rgb(233 17 52 / 20%) !important;
    }

    .ant-form-item-explain-error {
      display: block;
    }

    :deep(.ant-table-tbody) {
      .ant-table-cell {
        position: relative;
        padding: 20px 10px;
        overflow: hidden;

        .ant-form-item-explain-error {
          position: absolute;
          bottom: 0;
          left: 10px;
        }
      }
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
