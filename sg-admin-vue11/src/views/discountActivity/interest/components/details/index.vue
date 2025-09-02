<template>
  <BasicTable @register="registerTable" class="with-more-input" :scroll="{ y: scrollHeight }">
    <template #form-grupButton>
      <DateButtonGroup
        :isSelect="isSelect"
        @change-button-day="changeButtonDay"
        :dateGroupButtonList="dateGroupButtonList"
        isEndToday
      />
    </template>

    <template #tableTitle>
      <div class="w-full">
        <cdButtonCurrency
          :btn-list="currentList"
          @change-button-currency="changeClick"
          v-model="currency_id"
        />
      </div>
      <!-- <CurrencyButton :list="dataCurrency" class="ml-1 !mb-1 t-form-label-com"
        :allTitle="$t('table.member.member_money_all')" @change-button-currency="changeClick" /> -->
    </template>
    <template #form-startDate="{ model, field }">
      <DatePicker
        :allowClear="false"
        v-model:value="model[field]"
        :disabledDate="disabledStartDate"
        @change="onStartDateChange"
      />
    </template>
    <template #form-endDate="{ model, field }">
      <DatePicker
        :allowClear="false"
        v-model:value="model[field]"
        :disabledDate="disabledEndDate"
        @change="onEndDateChange"
      />
    </template>
  </BasicTable>
</template>

<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { DatePicker, RadioButton, RadioGroup } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getTransactionList } from '/@/api/finance/index';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { setStartformatDate, setEndformatDate } from '/@/utils/dateUtil';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(470).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const isSelect = ref('days' as string);
  const currency_id = ref('' as any);
  const dataCurrency = ref([] as any);
  const getCurrentList = ref([{ label: '汇总', value: '' }] as any);
  const currentList = ref([
    { name: t('table.member.member_all_'), value: '', lable: 'ALL' },
  ] as any);
  const { currencyTreeList } = useTreeListStore();
  const [registerTable, { reload, getForm, getRawDataSource }] = useTable({
    api: getTransactionList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    immediate: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      showAdvancedButton: false, //是否收起
      //resetFunc: handleExportTableList,
      showResetButton: false, //导出按钮隐藏
    },
    beforeFetch: (params) => {
      params['currency_id'] = currency_id.value;
      params['wallet_type'] = 3;
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      return params;
    },
    afterFetch: (response) => {
      const data = getRawDataSource();
      dataCurrency.value = data.n;
      if (data.n && !currency_id.value) {
        currentList.value = [
          { name: t('table.member.member_all_'), value: '', lable: 'ALL' },
        ].concat(currencyTreeList.filter((item) => data.n.includes(item.id)));
      }
    },
  });
  const disabledStartDate = (date) => {
    return date.valueOf() > dayjs(model.value.end_time);
  };

  const disabledEndDate = (date) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
</script>
<style lang="less" scoped>
  .vben-basic-table-form-container {
    padding: 0 !important;
  }

  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .text-center {
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    margin-bottom: 0;
  }

  .currentListGroup {
    ::v-deep(.ant-radio-button-wrapper:first-child) {
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper:last-child) {
      border-left-width: 1px;
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      border-left-width: 1px;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      width: 88px;
      border-left-width: 1px solid #d9d9d9;
      text-align: center;
    }
  }
</style>
