<template>
  <BasicTable @register="registerTable" class="summy">
    <template #form-commissionSummary>
      <DateButtonGroup
        :isSelect="isSelect"
        isEndToday
        :dateGroupButtonList="dateGroupButtonList"
        @change-button-day="changeButtonDay"
      />
    </template>
    <template #tableTitle v-if="dataCurrency.length > 1">
      <cdButtonCurrency
        :btn-list="currentList"
        :showwhitebg="false"
        @change-button-currency="changeClick"
        v-model="currency_id"
        class="cdButtonCurrency"
        inner-class="float-left"
      />
    </template>
    <template #currency_id="{ record }">
      <div>
        <cdIconCurrency :icon="currentyOptions[record.currency_id]" class="w-20px mr-5px" />{{
          currentyOptions[record.currency_id]
        }}
      </div>
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getTotleRecordList } from '/@/api/commission/index';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useTreeListStore } from '@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';

  const { t } = useI18n();
  dateGroupButtonList[0].label = t('table.member.member_week'); //本周
  dateGroupButtonList[1].label = t('table.member.member_month'); //本月
  const currency_id = ref('' as string);
  const isSelect = ref('month' as string);
  const dataCurrency = ref([] as any);
  const { currencyTreeList } = useTreeListStore();
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  const [registerTable, { reload, getForm, getRawDataSource }] = useTable({
    api: getTotleRecordList,
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
        class: 't-form-col t-form-label-com action-btn-box',
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
    },

    beforeFetch: (param) => {
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      param['currency_id'] = currency_id.value ? currency_id.value : '';
      return param;
    },
    afterFetch: async () => {
      const data = await getRawDataSource();
      dataCurrency.value = data.n || [];
      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
      ].concat(currencyTreeList.filter((item) => dataCurrency.value.includes(item.id)));
    },
  });
  function changeClick(v) {
    reload();
    currency_id.value = v;
  }
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-col) {
    &.action-btn-box > div {
      position: relative;
      width: auto !important;
      float: left;

      div {
        position: relative;
        float: left;

        button {
          position: relative;
          float: left;
        }
      }
    }
  }
</style>
