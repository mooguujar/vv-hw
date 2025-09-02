<template>
  <BasicTable @register="registerTable" class="commisionSum">
    <template #form-commissionSummary>
      <DateButtonGroup
        :isSelect="isSelect"
        :dateGroupButtonList="dateGroupButtonList"
        @change-button-day="changeButtonDay"
        isEndToday
      />
    </template>
    <template #form-usernameSlot>
      <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
        <Select style="width: 50%" v-model:value="currentType">
          <!--代理账号-->
          <SelectOption :value="1"> {{ $t('table.member.member_agent_account') }} </SelectOption>
          <!--上级代理-->
          <SelectOption :value="2"> {{ $t('business.common_super_agent') }} </SelectOption>
        </Select>
        <Input
          style="width: 50%; margin-right: 10px"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>
    <template #system_time="{ record }"
      >{{ toTimezone(record.start_time, 'YYYY-MM-DD') }} ~
      {{ toTimezone(record.end_time, 'YYYY-MM-DD') }}</template
    >
    <template #tableTitle v-if="dataCurrency.length > 1">
      <cdButtonCurrency
        v-if="getResult"
        :btn-list="currentList"
        :showwhitebg="false"
        @change-button-currency="changeClick"
        v-model="currency_id"
        class="cdButtonCurrency"
        :inner-class="''"
      />
    </template>
    <template #currency_id="{ record }">
      <cdIconCurrency :icon="currentyOptions[record.currency_id]" class="w-20px mr-5px" /><span>{{
        currentyOptions[record.currency_id]
      }}</span>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import { nextTick, ref, PropType } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { Select, SelectOption, Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getTotalReviewList } from '/@/api/commission/index';
  import {
    toTimezone,
    setDateParmas,
    setEndformatDate,
    setStartformatDate,
  } from '/@/utils/dateUtil';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';

  const { t } = useI18n();
  const props = defineProps({
    name: {
      type: String as PropType<string>,
      default: '',
    },
  });
  const { currencyTreeList } = useTreeListStore();
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  dateGroupButtonList[0].label = t('business.common_month'); //本月
  dateGroupButtonList[1].label = t('business.common_week'); //本周
  const currency_id = ref('' as string);
  const isSelect = ref('month' as any);
  const currentType = ref(1 as number);
  const fromSearch = ref('' as string);
  const dataCurrency = ref([] as any);
  const getResult = ref([] as any);
  const { exportFile } = useExportFile();
  const [registerTable, { reload, getForm, getColumns, getRawDataSource }] = useTable({
    api: getTotalReviewList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      resetButtonOptions: {
        text: t('business.common_export'), //导出
      },
      resetFunc: handleExportTableList,
    },
    afterFetch: async (val) => {
      getResult.value = val;
      const data = await getRawDataSource();
      dataCurrency.value = data.n || [];
      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
      ].concat(currencyTreeList.filter((item) => dataCurrency.value.includes(item.id)));
    },
    beforeFetch: async (param) => {
      param['currency_id'] = currency_id.value;
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      return param;
    },
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      setDateParmas(param);
      param['is_export'] = 1;

      await exportFile(
        getTotalReviewList,
        param,
        t('table.system.system_commission_review_summary'),
      );
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }

  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
</script>
<style lan="less" scoped>
  ::v-deep(.ant-table-container) {
    margin-top: 0 !important;
  }

  ::v-deep(.ant-table-wrapper .ant-table-title) {
    padding: 0 !important;
    background-color: #fff;
  }

  ::v-deep(.ant-table) {
    border: 1px solid #e1e1e1 !important;

    .cdButtonCurrency {
      margin: 0 !important;
    }
  }

  ::v-deep(.commisionSum .vben-basic-table .ant-table-wrapper .ant-table-title) {
    height: auto !important;
  }
</style>
