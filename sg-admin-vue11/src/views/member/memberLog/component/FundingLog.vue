<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerWal" :scroll="{ x: 'max-content', y: scrollHeight }">
      <template #form-typeid>
        <DateButtonGroup
          :isSelect="'days'"
          :compareRangeTime="unixRang"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
          style="margin-right: 10px"
        />
      </template>
      <template #form-business_type="{ model, field }">
        <Select
          allowClear
          v-model:value="model[field]"
          :dropdownMatchSelectWidth="false"
          :options="getGamesListBusiness"
          :placeholder="$t('business.common_all')"
          @change="handleChange"
        />
      </template>
      <template #form-change_type="{ model, field }">
        <Select
          v-model:value="model[field]"
          allowClear
          :dropdownMatchSelectWidth="false"
          :options="changetypeOptions"
          :placeholder="$t('common.chooseText')"
        />
      </template>
      <template #form-currency="{ model, field }">
        <Select
          v-model:value="model[field]"
          :options="getCurrencyList"
          :placeholder="$t('common.chooseText')"
        />
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue';
  import { Select } from 'ant-design-vue';
  import { columns, searchFormSchema, dateGroupButtonList } from './FundingLog.data';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getFundsListLog } from '/@/api/member/index';
  import { PageWrapper } from '/@/components/Page';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { useLocale } from '/@/locales/useLocale';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight430 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight430).value);
  const { initBusinessType, businessTypeTreeList, businessTypeTreeListAll } = useTreeListStore();
  const unixRang = ref<Array<number>>([]);
  const { exportFile } = useExportFile();
  // 业务类型查询
  const bussesType = ref(null as any);
  const styleType = ref(null as any);
  const changetypeOptions = ref([] as any);
  const getGamesListBusiness = ref([
    { label: t('business.common_all'), value: '' },
    { label: t('table.report.report_deposit'), value: '801' },
    { label: t('search.finance.finance_withdraw'), value: '808' },
  ]);
  const getCurrencyList = ref([] as any);
  const [registerWal, { getForm, getRawDataSource, reload }] = useTable({
    columns,
    api: getFundsListLog,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      schemas: searchFormSchema,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 'button-box t-form-label-com',
      },
      submitButtonOptions: {
        text: t('common.queryText'),
      },
      resetButtonOptions: {
        text: t('business.common_export'),
      },
      resetFunc: handleExportTableList,
    },
    afterFetch: () => {
      const getCurrency = getRawDataSource();
      const list = getCurrency.n.map((item) => {
        return {
          label: currentyOptions[item],
          value: item,
        };
      });
      getCurrencyList.value = [{ label: t('business.common_all'), value: '' }, ...list];
    },
    beforeFetch: (params) => {
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      params['wallet_type'] = 1;
      return;
    },
  });

  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });

  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const values = await validate();
      values.businessType = bussesType.value;
      values.style = styleType.value;
      if (values?.time?.length > 0) {
        values.start_time = values.time[0] ? setStartformatDate(values.time[0]) : null;
        values.end_time = values.time[1] ? setEndformatDate(values.time[1]) : null;
      }
      delete values.time;
    } catch (e) {
      console.error(e);
    }
    // 避免匯出後自動查詢
    return Promise.reject();
  }

  async function handleChange(e) {
    const typeArray = businessTypeTreeListAll.filter((item) => {
      return (
        item.pid === e &&
        item.attr != '2' &&
        item.attr != '4' &&
        item.id != '807' &&
        item.id != '825' &&
        item.id != '843' &&
        item.id != '812'
      );
    });
    const { getLocale } = useLocale();
    const selectLang = getLocale.value || 'zh_CN';
    const newTypeArray = typeArray.map((item: any) => {
      if (typeof item.name === 'string') {
        item.name = JSON.parse(item.name); // 解析字符串
      }
      return { label: item.name[selectLang], value: item.id };
    });
    await getForm().setFieldsValue({ cash_type: null });
    changetypeOptions.value = newTypeArray;
  }

  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }

  function reSetButtonBox() {
    if (document.getElementsByClassName('button-box').length > 0) {
      for (var i = 0; i < document.getElementsByClassName('button-box').length; i++) {
        document.getElementsByClassName('button-box').item(i).classList.remove('ant-col-4');
      }
    }
  }

  onMounted(() => {
    reSetButtonBox();
  });
</script>
