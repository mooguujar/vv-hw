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
    <template #betContent="{ column, record }">
      <div v-if="record.detail.length == 0"> - </div>
      <div v-else-if="record.detail.length == 1">
        <!-- <Tooltip>
          <template #title>
            <span> {{ record.detail[0].element || '-' }}</span>
          </template>
          <div> {{ record.detail[0].element || '-' }}</div>
        </Tooltip> -->
        <span>{{ record.detail[0].element || '-' }}</span>
        <div class="text-red"> @{{ record.detail[0].odds }} </div>
      </div>
      <div v-else-if="record.detail.length >= 2">
        <a @click="lowMultipleInfoFun(record)">{{ $t('table.report.report_duplex_bet') }}</a>
      </div>
    </template>
    <!-- <template #form-startDate="{ model, field }">
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
    </template> -->
    <template #form-custom>
      <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
        <Select
          v-model:value="currentType"
          :options="searchTypeOptions"
          class="pay-select"
          style="width: 50%"
        />
        <a-input
          style="width: 50%"
          class="w-20 pay-input"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>

    <template #summary>
      <TableSummary v-if="getList">
        <TableSummaryRow>
          <TableSummaryCell class="text-center">{{
            $t('table.report.report_note')
          }}</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">
            <Tooltip placement="top" v-if="note.bet.length > 10">
              <template #title>
                <div>
                  {{ note.bet }}
                </div>
              </template>
              <div>{{ note.bet || '-' }}</div>
            </Tooltip>
            <div v-else>{{ note.bet || '-' }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center">
            <Tooltip placement="top" v-if="note.valid_bet.length > 10">
              <template #title>
                <div>
                  {{ note.valid_bet }}
                </div>
              </template>
              <div>{{ note.valid_bet || '-' }}</div>
            </Tooltip>
            <div v-else>{{ note.valid_bet || '-' }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center">
            <Tooltip placement="top" v-if="note.net.length > 10">
              <template #title>
                <div>
                  {{ note.net }}
                </div>
              </template>
              <div :class="[note.net > 0 ? 'text-red' : 'text-green']">{{ note.net || '-' }}</div>
            </Tooltip>
            <div v-else :class="[note.net > 0 ? 'text-red' : 'text-green']">{{
              note.net || '-'
            }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
        </TableSummaryRow>
      </TableSummary>
      <TableSummary v-if="getList">
        <TableSummaryRow>
          <TableSummaryCell class="text-center">{{ t('business.common_total') }}</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">
            <Tooltip placement="top" v-if="total.bet.length > 10">
              <template #title>
                <div>
                  {{ total.bet }}
                </div>
              </template>
              <div>{{ total.bet || '-' }}</div>
            </Tooltip>
            <div v-else>{{ total.bet || '-' }}</div>
          </TableSummaryCell>

          <TableSummaryCell class="text-center">
            <Tooltip placement="top" v-if="total.valid_bet.length > 10">
              <template #title>
                <div>
                  {{ total.valid_bet }}
                </div>
              </template>
              <div>{{ total.valid_bet || '-' }}</div>
            </Tooltip>
            <div v-else>{{ total.valid_bet }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center">
            <Tooltip placement="top" v-if="total.net.length > 10">
              <template #title>
                <div>
                  {{ total.net }}
                </div>
              </template>
              <div :class="[total.net > 0 ? 'text-red' : 'text-green']">{{ total.net || '-' }}</div>
            </Tooltip>
            <div v-else :class="[total.net > 0 ? 'text-red' : 'text-green']">{{
              total.net || '-'
            }}</div>
          </TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
        </TableSummaryRow>
      </TableSummary>
    </template>
    <template #currency="record">
      <cdIconCurrency :icon="setCurrencyName(record.value)" class="w-20px mr-3px" /><span>{{
        setCurrencyName(record.value)
      }}</span>
    </template>
  </BasicTable>
  <ShowInfo @register="registerInfor" />
  <MultipleBettingModal @register="registerMultipleBettingModal" />
</template>
<script lang="ts" setup>
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchSchema } from './index.data';
  import { useModal } from '/@/components/Modal';
  import { ShowInfo } from '/@/components/ShowInfo/index';
  import { nextTick, onActivated, onMounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import {
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
    DatePicker,
    Tooltip,
    Select,
  } from 'ant-design-vue';
  import { getBetRecordList } from '/@/api/report/index';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFinanceStore } from '/@/store/modules/finance';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import MultipleBettingModal from './components/multipleBettingModal.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useRoute } from 'vue-router';
  import eventBus from '/@/utils/eventBus';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  //定义当前选中的框
  const currentType = ref('username' as any);
  //输入当前的值
  const fromSearch = ref('' as any);

  const { getCurrency, getAllCurrencyList, getCurrencyObj } = useCurrencyStore(); //获取当前币种
  const financeStore = useFinanceStore();
  const rateObject: any = financeStore.getRateObject;
  const currencyName = ref('' as string);

  const currency = getAllCurrencyList.find((item) => {
    return item.name == getCurrency;
  }); //参考币种
  let currencyId = '';
  let rates: any = null;
  if (currency) {
    rates = rateObject.rates[currency?.id];
  }
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const model = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });
  const note = ref<any>({});
  const length = ref<Number>(0);
  const getList = ref(null as any);
  const total = ref<any>({ bet: 0, valid_bet: 0, net: 0 } as any);
  const { currencyAllTreeList } = useTreeListStore();
  const currentList = ref([...currencyAllTreeList] as any);

  const [registerMultipleBettingModal, { openModal }] = useModal();
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
    actionColumn: {
      title: t('business.common_operate'),
      dataIndex: 'action',
      fixed: 'right',
      slots: { customRender: 'action' },
    },
    beforeFetch: (param) => {
      // setDateParmas(param);
      // param['main_cur'] = getCurrencyObj.id
      // return param;
      processingParams(param);
    },
    afterFetch: (data) => {
      note.value = {
        bet: 0,
        valid_bet: 0,
        net: 0,
      };
      getList.value = data;
      note.value = getRawDataSource().subtotal;

      if (getRawDataSource().total.bet) {
        total.value = getRawDataSource().total;
      } else {
        length.value = 0;
      }
      data = data.map((item) => {
        if (item.detail) item.detail = JSON.parse(item.detail);
        return item;
      });
      return data;
    },
  });
  const route = useRoute();
  onMounted(() => {
    if (route.query.start) {
      getForm().setFieldsValue({
        time: [
          dayjs(dayjs.unix(route.query.start).format('YYYY-MM-DD HH:mm:ss')),
          dayjs(dayjs.unix(route.query.end).format('YYYY-MM-DD HH:mm:ss')),
        ],
      });
    }
    eventBus.on('mittChangeTime', (rangTime: any) => {
      getForm().setFieldsValue({
        time: rangTime,
      });
    });
    reload();
  });
  async function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: value });
      reload();
    });
  }
  function processingParams(params) {
    setDateParmaTime(params);
    setDateParmas(params);
    params[currentType.value] = fromSearch.value;
    params['main_cur'] = getCurrencyObj.id;
    params.game_type = Number(params['game_type']);
    return params;
  }
  const [registerInfor, { openModal: Infor }] = useModal();
  function informationOpen(record: Recordable): void {
    if (record?.detail.length >= 2) {
      return lowMultipleInfoFun(record);
    }
    Infor(true, record);
  }
  function lowMultipleInfoFun(record) {
    openModal(true, record);
  }
  function setCurrencyName(id) {
    let name = currentList.value.filter((c) => c.id === id)[0].name;
    return name;
  }
  const searchTypeOptions = [
    { label: t('business.common_member_account'), value: 'username' },
    { label: t('table.report.report_bill_no'), value: 'bill_no' },
    { label: t('table.report.platform_bill_no_num'), value: 'platform_bill_no' },
    { label: t('table.report.report_player_name'), value: 'player_name' },
    { label: t('business.common_super_agent'), value: 'parent_name' },
  ];
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

  :deep(.ant-col.ant-col-1.t-form-col.t-form-label-com) {
    display: block;
    // width: 80px;
    flex: 1 1 0%;
    max-width: 85px;
  }
</style>
