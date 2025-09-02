<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable
      v-show="!showOneHourInfoDetial"
      @register="registerTable"
      :scroll="{ y: scrollHeight }"
    >
      <template #form-grupButton>
        <DateButtonGroup
          :isSelect="isSelect"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
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
      </template>
      <template #currency="{ record }">
        <div v-if="record.currency_id">
          <cdIconCurrency :icon="currencyName(record.currency_id)" class="w-20px mr-3px" />
          <span>{{ currencyName(record.currency_id) }}</span>
        </div>
        <div v-else>-</div>
      </template>
      <template #time="{ record }">
        <span class="primary-color cursor" @click="gameInfoFun(record)">
          <!-- {{ dayjs(record.count_time * 1000).format('HH:ss') }} -->
          {{ toTimezone(record.count_time, 'HH:ss ') }}
        </span>
      </template>
    </BasicTable>
    <oneHourInfo
      v-if="showOneHourInfoDetial"
      :currency_id="oneHourInfoDetial.currency_id"
      :count_time="oneHourInfoDetial.count_time"
      @back="showOneHourInfoDetial = false"
    />
  </PageWrapper>
</template>

<script lang="ts" setup name="OneHourReportNocash">
  import { ref, nextTick } from 'vue';
  import { exportReportHour, getHourReportList } from '/@/api/report/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { toTimezone, setDateParmas, setDateParmaTime } from '/@/utils/dateUtil';
  import oneHourInfo from '/@/views/report/oneHourReport/oneHourInfo/index.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { isHasAuth } from '@/utils/authFunction';
  import { cloneDeep } from 'lodash-es';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const scrollHeight = Number(useScrollerHeight(460).value);
  const { currencyTreeList, currencyAllTreeList } = useTreeListStore();
  const oneHourInfoDetial = ref({ currency_id: '', count_time: '' });
  const showOneHourInfoDetial = ref(false);
  const currency_id = ref('' as any);
  const isSelect = ref('days' as string);
  const { t } = useI18n();

  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
    ...currencyTreeList,
  ] as any);
  const { exportFile } = useExportFile();

  const [registerTable, { reload, getForm }] = useTable({
    api: async (params) => {
      try {
        const response = await getHourReportList(params);
        const res = cloneDeep(response);
        delete res.n;
        return res;
      } catch (error) {
        return [];
      }
    },
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    immediate: false,

    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
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
      showAdvancedButton: false, //是否收起
      showResetButton: isHasAuth('50901'), //导出按钮隐藏
      resetFunc: handleExportTableList,
    },
    beforeFetch: (params) => {
      setDateParmaTime(params);
      setDateParmas(params);
      params['currency_id'] = currency_id.value;
      return params;
    },
  });

  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
      // if (isFirstLoaded.value) reload();
      // else {
      //   isFirstLoaded.value = !isFirstLoaded.value;
      // }
    });
  }

  function changeClick(v) {
    currency_id.value = v;
    reload();
  }

  async function gameInfoFun(record) {
    const { validate } = getForm();
    const values = await validate();
    setDateParmaTime(values);
    setDateParmas(values);
    showOneHourInfoDetial.value = true;
    oneHourInfoDetial.value = {
      currency_id: record.currency_id,
      count_time: record.count_time,
    };
    if (!currency_id.value) {
      oneHourInfoDetial.value = {
        currency_id: '',
        count_time: record.count_time,
      };
      return;
    } else {
      oneHourInfoDetial.value = {
        currency_id: record.currency_id,
        count_time: record.count_time,
      };
    }
    // $router.push({
    //   name: 'OneHourInfo',
    //   state: {
    //     currency_id: record.currency_id,
    //     count_time: record.count_time,
    //   },
    // });
  }
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      setDateParmaTime(param);
      setDateParmas(param);
      param['currency_id'] = currency_id.value;
      await exportFile(exportReportHour, param, t('routes.report.oneHourReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }

  function currencyName(id) {
    let currencyName = currencyAllTreeList.filter((c) => c.id === id)[0].name;
    return currencyName;
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
  }
</style>
