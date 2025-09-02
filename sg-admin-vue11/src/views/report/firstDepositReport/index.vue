<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content', y: scrollHeight }">
      <template #form-grupList
        ><DateButtonGroup
          :isSelect="isSelect"
          :dateGroupButtonList="dateGroupButtonList"
          @change-button-day="changeButtonDay"
      /></template>
      <template #tableTitle>
        <!-- <CurrencyButtonGroup
          @change-button-currency="changeClick"
          :allTitle="$t('table.member.member_currency')"
        /> -->
        <div class="w-full">
          <cdButtonCurrency
            :btn-list="currentList"
            @change-button-currency="changeClick"
            v-model="currency_id"
          />
        </div>
      </template>
      <template #form-usernameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption :value="'username'">
              {{ t('business.common_member_account') }}
            </SelectOption>
            <SelectOption :value="'parent_name'">
              {{ t('business.common_super_agent') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="t('business.banner_tip')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup name="FirstDepositReportNocash">
  import { computed, ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { searchForm, columns, dateGroupButtonList } from './index.data';
  import {
    InputGroup,
    Select,
    Input,
    SelectOption,
    DatePicker,
    FormItemRest,
  } from 'ant-design-vue';
  import { exportReportFirstdeposit, getreportDepositList } from '/@/api/report';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { createCurrencyData } from '../../common/common';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { isHasAuth } from '@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  const currentType = ref('username');
  const currency_id = ref('' as any);
  //输入当前的值
  const fromSearch = ref('' as any);
  const { currencyTreeList } = useTreeListStore();
  const achieveList = ref<any>([]);
  const dataCurrency = ref([] as any);
  achieveList.value = createCurrencyData();
  const isSelect = ref('days' as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);

  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });

  const { exportFile } = useExportFile();

  const [registerTable, { reload, getForm, getColumns, getRawDataSource }] = useTable({
    api: getreportDepositList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
        // xxl: 12,
        // xl: 12,
        // lg: 12,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      //showAdvancedButton: false, //是否收起
      showResetButton: isHasAuth('50701'), //导出按钮隐藏
      resetFunc: handleExportTableList,
    },
    beforeFetch: (params) => {
      if (sortKey.value) params['sort_key'] = sortKey.value;
      if (sortType.value) params['sort_type'] = sortType.value;
      processingParams(params);
    },
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
    afterFetch: (response) => {
      //totleAmount.value = response;
      const data = getRawDataSource();
      dataCurrency.value = data.n;
      //if (data.n && !currency_id.value) {
      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
      ].concat(currencyTreeList.filter((item) => data?.n?.includes(item.id)));
      //}

      //totleAmount.value = data?.c[0];
    },
    immediate: false,
  });

  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
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

  function changeClick(v) {
    currency_id.value = v;
    reload();
  }

  function processingParams(params) {
    params['currency_id'] = currency_id.value;
    setDateParmaTime(params);
    setDateParmas(params);
    if (fromSearch.value) params[currentType.value] = fromSearch.value;
    return params;
  }

  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      processingParams(param);
      await exportFile(exportReportFirstdeposit, param, t('routes.report.firstDepositReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
      //await getForm().setFieldsValue({ end_time: value[1] });
    });
  }
</script>
<style lang="less" scoped>
  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
  }
</style>
