<template>
  <DateButtonGroup
    class="absolute h-0"
    :isSelect="'days'"
    @change-button-day="changeButtonDay"
    :dateGroupButtonList="[]"
  />
  <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            label: t('business.common_detail'),
            onClick: informationOpen.bind(null, record),
          },
        ]"
      />
    </template>
    <template #form-custom>
      <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
        <Select
          v-model:value="currentType"
          :options="searchTypeOptions"
          class="pay-select"
          :dropdownMatchSelectWidth="false"
        />
        <a-input
          class="pay-input w-10 mr-2.5"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>

    <template #summary>
      <TableSummary v-if="getList">
        <TableSummaryRow>
          <TableSummaryCell class="text-center" :index="0">{{
            $t('table.report.report_note')
          }}</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="3">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="4">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="5">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="6">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="7">
            <cdBlockCurrency :currencyName="selectedCurrencyName" />
          </TableSummaryCell>
          <TableSummaryCell class="text-center" :index="8">
            <!-- <Tooltip placement="top">
              <template #title>
                <div>
                  {{ note.bet }}
                </div>
              </template>
              <div>{{ note.bet || '-' }}</div>
            </Tooltip> -->
            <div>{{ note.bet || '-' }}</div>
          </TableSummaryCell>

          <TableSummaryCell class="text-center" :index="9">
            <div>{{ note.valid_bet || '-' }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center" :index="10">
            <div :class="[note.net > 0 ? 'text-red' : 'text-green']">{{ note.net || '-' }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center" :index="11">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="12">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="13">-</TableSummaryCell>
        </TableSummaryRow>
      </TableSummary>
      <TableSummary v-if="getList">
        <TableSummaryRow>
          <TableSummaryCell class="text-center" :index="0">{{
            t('business.common_total')
          }}</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="3">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="4">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="5">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="6">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="7">
            <cdBlockCurrency :currencyName="selectedCurrencyName" />
          </TableSummaryCell>
          <TableSummaryCell class="text-center" :index="8">
            <div>{{ total.bet || '-' }}</div>
          </TableSummaryCell>

          <TableSummaryCell class="text-center" :index="9">
            <div>{{ total.valid_bet || '-' }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center" :index="10">
            <div :class="[total.net > 0 ? 'text-red' : 'text-green']">{{ total.net || '-' }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center" :index="11">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="12">-</TableSummaryCell>
          <TableSummaryCell class="text-center" :index="13">-</TableSummaryCell>
        </TableSummaryRow>
      </TableSummary>
    </template>
    <template #currency="record">
      <span v-if="record.record.g_currency_id === record.record.currency_id">
        <cdIconCurrency
          :icon="setCurrencyName(record.record.g_currency_id)"
          class="w-20px mr-3px"
        /><span>{{ setCurrencyName(record.record.g_currency_id) }}</span>
      </span>
      <span v-else>
        <cdIconCurrency
          :icon="setCurrencyName(record.record.g_currency_id)"
          class="w-20px mr-3px"
        /><span>{{ setCurrencyName(record.record.g_currency_id) }}</span>
        /
        <cdIconCurrency
          :icon="setCurrencyName(record.record.currency_id)"
          class="w-20px mr-3px"
        /><span>{{ setCurrencyName(record.record.currency_id) }}</span>
      </span>
    </template>
  </BasicTable>
  <ShowInfo ref="gameDetail" :hasgameDetail="true" @register="registerInfor" />
</template>
<script lang="ts" setup>
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { TableSummary, TableSummaryRow, TableSummaryCell, Select } from 'ant-design-vue';
  import { computed, ref, onMounted, onActivated } from 'vue';
  import { columns, searchSchema } from './index.data';
  import { ShowInfo } from '/@/components/ShowInfo/index';
  import { useModal } from '/@/components/Modal';
  import { getBetRecordList } from '/@/api/report/index';
  import dayjs from 'dayjs';
  import { setDateParmaTime } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFinanceStore } from '/@/store/modules/finance';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  import { useRoute } from 'vue-router';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const route = useRoute();
  const scrollHeight = Number(useScrollerHeight(410).value);

  //定义当前选中的框
  const currentType = ref('username' as any);
  //输入当前的值
  const fromSearch = ref('' as any);

  const { getCurrency, getCurrencyObj, getAllCurrencyList } = useCurrencyStore(); //获取当前币种
  const financeStore = useFinanceStore();
  const rateObject: any = financeStore.getRateObject;
  const getList = ref(null as any);
  const currency = getAllCurrencyList?.find((item) => {
    return item?.name == getCurrency;
  }); //参考币种
  const { currencyAllTreeList } = useTreeListStore();
  const currentList = ref([...currencyAllTreeList] as any);

  // const { currencyTreeList } = useTreeListStore();
  // const currentList = ref([...currencyTreeList] as any);
  const gameDetail = ref(null);
  let currencyId = '';
  let rates: any = null;
  if (currency) {
    rates = rateObject?.rates[currency?.id];
  }

  const { t } = useI18n();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });

  const note = ref<any>({
    bet: 0,
    valid_bet: 0,
    net: 0,
  });

  const total = ref<any>({ bet: 0, valid_bet: 0, net: 0 } as any);
  const selectedCurrency = ref();

  const selectedCurrencyName = computed(() => {
    if (selectedCurrency.value && getAllCurrencyList) {
      return getAllCurrencyList?.find((item) => item.value === selectedCurrency.value)?.name;
    }
    return 'CNY';
  });

  const [registerTable, { reload, getForm, getColumns, getRawDataSource }] = useTable({
    immediate: false,
    api: getBetRecordList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    striped: true,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema(),
      actionColOptions: {
        class: 't-form-label-com',
        span: 1,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      // showAdvancedButton: false, //是否收起
      //resetFunc: handleExportTableList,
      showResetButton: false, //导出按钮隐藏
    },
    // actionColumn: {
    //   // width: 100,
    //   title: t('business.common_operate'),
    //   dataIndex: 'action',
    //   slots: { customRender: 'action' },
    // },
    beforeFetch: (params) => {
      selectedCurrency.value = getCurrencyObj.id;
      processingParams(params);
    },
    afterFetch: async (data) => {
      note.value = {
        bet: 0,
        valid_bet: 0,
        net: 0,
      };
      getList.value = data;
      if (getRawDataSource().total.bet) {
        total.value = getRawDataSource().total;
      }
      note.value = getRawDataSource().subtotal;
    },
  });

  function processingParams(params) {
    setDateParmaTime(params);
    // setDateParmas(params);
    params[currentType.value] = fromSearch.value;
    params['game_type'] = params.game_type == 'all' ? '' : params.game_type;
    params['game_type'] = Number(params.game_type) || '';
    params['main_cur'] = getCurrencyObj.id;
    return params;
  }

  function getCurrentID(record) {}

  const searchTypeOptions = [
    { label: t('business.common_member_account'), value: 'username' },
    { label: t('table.report.report_bill_no'), value: 'bill_no' },
    { label: t('table.report.platform_bill_no_num'), value: 'platform_bill_no' },
    { label: t('table.report.report_game_code'), value: 'api_bill_no' },
    { label: t('table.report.report_player_name'), value: 'player_name' },
    { label: t('business.common_super_agent'), value: 'parent_name' },
  ];

  const [registerInfor, { openModal: Infor }] = useModal();

  function informationOpen(record: Recordable): void {
    Infor(true, record);
  }
  onActivated(() => {
    if (route.query.start) {
      getForm().setFieldsValue({
        time: [
          dayjs(dayjs.unix(route.query.start).format('YYYY-MM-DD HH:mm:ss')),
          dayjs(dayjs.unix(route.query.end).format('YYYY-MM-DD HH:mm:ss')),
        ],
      });
      reload();
    }
    // await getForm().setFieldsValue({time: [history.state['0'], history.state['1']]  })
  });

  async function changeButtonDay(value) {
    await getForm().setFieldsValue({ time: value });
    reload();
  }

  onMounted(async () => {
    if (route.query.start) {
      getForm().setFieldsValue({
        time: [
          dayjs(dayjs.unix(route.query.start).format('YYYY-MM-DD HH:mm:ss')),
          dayjs(dayjs.unix(route.query.end).format('YYYY-MM-DD HH:mm:ss')),
        ],
      });
      reload();
    }
    if (gameDetail.value && gameDetail.value.gameDetailOpen) {
      gameDetail.value.gameDetailOpen(2); // 调用子组件的方法并传递参数
    }
  });
  function setCurrencyName(id) {
    let name = currentList.value.filter((c) => c.id === id)[0]?.name || '';
    return name;
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  ::v-deep(.ant-table-cell > div) {
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
</style>
