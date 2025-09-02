<template>
  <div class="FundingLog">
    <Title :name="$t('table.member.member_fund_log')" />
    <BasicTable
      @register="registerTable"
      class="!p-0"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-grupList>
        <DateButtonGroup
          :isSelect="isSelect"
          :compareRangeTime="unixRang"
          :dateGroupButtonList="dateGroupButtonList"
          isEndToday
          @change-button-day="changeButtonDay"
        />
      </template>
      <template #form-business_type="{ model, field }">
        <Select
          allowClear
          v-model:value="model[field]"
          default-value=""
          :options="getGamesListBusiness"
          :placeholder="$t('common.chooseText')"
          @change="handleChange"
        />
      </template>
      <template #form-change_type="{ model, field }">
        <Select
          v-model:value="model[field]"
          allowClear
          default-value=""
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
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref, onMounted, computed } from 'vue';
  import { Title } from '../../compnents/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { fundingColumns, schemasFunding, dateGroupButtonList } from '../../details.data';
  import { getFundsListLog } from '/@/api/member/index';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import { setDateParmas, setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { Select } from 'ant-design-vue';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocale } from '/@/locales/useLocale';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(415).value);
  const { businessTypeTreeListAll } = useTreeListStore();
  const unixRang = ref<Array<number>>([]);
  const isSelect = ref('days' as any);
  const changetypeOptions = ref([] as any);
  const getCurrencyList = ref([{ label: t('business.common_all'), value: '' }] as any);
  const getGamesListBusiness = ref([
    { label: t('business.common_all'), value: '' },
    { label: t('table.report.report_deposit'), value: '801' },
    { label: t('search.finance.finance_withdraw'), value: '808' },
  ]);

  const [registerTable, { getForm, getRawDataSource, reload }] = useTable({
    api: getFundsListLog,
    columns: fundingColumns,
    useSearchForm: true,
    bordered: true,
    formConfig: {
      schemas: schemasFunding,
      showResetButton: false,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        xxl: 4,
        xl: 5,
        lg: 5,
      },
    },
    showIndexColumn: false,
    beforeFetch: (param) => {
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      setDateParmas(param);
      // param['wallet_type'] = 1;
      param['username'] = history.state.username;
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
  });
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });
  async function handleChange(e) {
    const { getLocale } = useLocale();
    const selectLang = getLocale.value || 'zh_CN';
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
    const newTypeArray = typeArray.map((item: any) => {
      if (typeof item.name === 'string') {
        item.name = JSON.parse(item.name); // 解析字符串
      }
      return { label: item.name[selectLang], value: item.id };
    });
    newTypeArray.unshift({ label: t('business.common_all'), value: '' });
    await getForm().setFieldsValue({ cash_type: '' });
    changetypeOptions.value = newTypeArray;
  }
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
      // await getForm().setFieldsValue({ start_time: value[0] });
      // await getForm().setFieldsValue({ end_time: value[1] });
    });
  }
  function removeSearchBtnRight() {
    for (var i = 0; i < document.getElementsByClassName('ant-btn').length; i++) {
      var isSearchBtn = document
        .getElementsByClassName('ant-btn')
        [i].parentNode.classList.contains('ant-form-item-control-input-content');
      if (isSearchBtn) {
        document.getElementsByClassName('ant-btn')[i].parentNode.style.textAlign = 'left';
      }
    }
  }
  onMounted(() => {
    //调整搜寻按钮前面因为text-align:right产生的空位
    removeSearchBtnRight();
  });
</script>
