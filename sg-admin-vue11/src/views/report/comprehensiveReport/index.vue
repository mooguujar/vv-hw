<template>
  <PageWrapper :contentStyle="{ margin: 0, padding: '0 10px 10px 10px' }">
    <div>
      <Card
        v-if="auths(['50101', '50103'])"
        :title="t('table.report.report_data_all')"
        bordered
        v-bind="$attrs"
        :bodyStyle="{ padding: '20px' }"
        class="report_data_all_box"
        :class="[isHasAuth('50101') ? '' : 'report_data_all_box_role']"
      >
        <template #extra>
          <div class="flex justify-end items-center">
            <div class="flex mr-2">
              <div class="currency-box">
                <cdButtonCurrency
                  :btn-list="currentList"
                  :showwhitebg="false"
                  @change-button-currency="changeButtonDayEChartsOverView"
                  v-model="currency_id"
                />
              </div>
            </div>

            <div class="mt-2.5 flex justify-between items-center t-form-label-com">
              <div class="flex whitespace-nowrap">
                <DateButtonGroup
                  :isSelect="isSelect"
                  @change-button-day="changeButtonDay"
                  :dateGroupButtonList="dateGroupButtonListAll"
                  ref="dateButtonGroup"
                />
              </div>
              <BasicForm
                class="w-345px t-form-label-com"
                @register="register"
                @submit="handleSubmit"
              />
            </div>
          </div>
        </template>

        <div v-if="isHasAuth('50101')" class="w-full flex flex-wrap">
          <CardGrid
            v-for="(value, index) in overviewListRef"
            :key="index"
            class="cardGrade"
            :hoverable="false"
            style="color: #fff"
          >
            <div class="flex justify-between">
              <div class="w-full">
                <div class="flex card_title">
                  <span class="text-16px"
                    >{{ value.name }}
                    <Icon
                      v-if="value.type != 'gift' && value.type != 'bet_net' && value.type != 'bet'"
                      class="cursor"
                      :size="20"
                      icon="tabler:bulb"
                      @click="handleIcon(value)"
                    />
                    <Icon
                      v-else-if="
                        (value.type == 'gift' && isHasAuth('51000')) ||
                        (value.type === 'bet_net' && isHasAuth('50300')) ||
                        (value.type === 'bet' && isHasAuth('50200'))
                      "
                      class="cursor"
                      :size="20"
                      icon="tabler:bulb"
                      @click="handleIcon(value)"
                    />
                  </span>
                </div>
                <div
                  class="text-28px font-extrabold"
                  :class="{
                    numEllipsis: isEllipsis,
                    numAmountEllipsis: value.amount.length > 12 && !isEllipsis,
                  }"
                >
                  <Tooltip v-if="value.amount.length > 12">
                    <template #title> {{ value.amount }} </template>
                    <CountTo
                      :startVal="0"
                      :decimals="2"
                      :endVal="Number(value.amount)"
                      :amountNum="value.amount"
                      class="text-32px"
                    />
                  </Tooltip>
                  <CountTo
                    v-else
                    :startVal="0"
                    :decimals="2"
                    :endVal="Number(value.amount)"
                    :amountNum="value.amount"
                    class="text-32px"
                  />
                </div>
                <div class="flex justify-between numbers">
                  <div class="flex justify-center items-center">
                    <span class="cicle"></span>
                    <span class="flex tail-report-data">
                      <span class="mr-2"
                        >{{ value.report_num }}:
                        <CountTo :startVal="0" :endVal="value.user_count" />{{ value.some_people }}
                      </span>
                      <span :class="['flex items-center']">
                        <i
                          :class="[
                            'i-fon-sty',
                            ['zh_CN'].includes(unref(getLocale)) ? '' : 'extra-long-style',
                          ]"
                          >{{ value.report_per_capita }}:</i
                        >
                        <Tooltip
                          v-if="value.average_per.length > 12"
                          placement="top"
                          class="mx-1"
                          :title="Number(value.average_per)"
                        >
                          <CountTo
                            :startVal="0"
                            :endVal="Number(value.average_per)"
                            :amountNum="value.average_per"
                            :more="true"
                            :limitLength="12"
                            :class="{ everyoneEllipsis: value.average_per.length > 12 }"
                            :suffix="'...'"
                          />
                        </Tooltip>
                        <CountTo
                          v-else
                          :startVal="0"
                          class="mx-1"
                          :endVal="Number(value.average_per)"
                          :amountNum="value.average_per"
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-right pt-24px h-55px pr-10px absolute top-13px right-10px">
                <cdReportDataList :icon="value.type" class="w-55px" />
              </div>
            </div>
          </CardGrid>
        </div>
      </Card>

      <Card
        v-if="isHasAuth('50103')"
        :title="t('v.report.comprehensiveReport.category_overview')"
        v-bind="$attrs"
        class="kinds-summery-box"
      >
        <template #extra>
          <div class="!flex">
            <div class="tab-btn-box">
              <Button
                size="large"
                @click="tabsChangeFun2('deposit')"
                :type="kindsSummeryType('deposit')"
                :disabled="processState"
                >{{ $t('v.report.comprehensiveReport.deposit_classification') }}</Button
              >
              <Button
                size="large"
                @click="tabsChangeFun2('withdraw')"
                :type="kindsSummeryType('withdraw')"
                :disabled="processState"
                >{{ $t('v.report.comprehensiveReport.withdrawal_classification') }}</Button
              >
              <Button
                size="large"
                @click="tabsChangeFun2('commission')"
                :disabled="processState"
                :type="kindsSummeryType('commission')"
                >{{ $t('v.report.comprehensiveReport.commission_issuance') }}</Button
              >
            </div>
            <div></div>
          </div>
        </template>
        <BasicTable @register="registerTable" :scroll="{ x: 1300, y: 330 }" />
      </Card>

      <div>
        <div class="w-100%" v-if="auths(['50107', '50106'])">
          <Card v-bind="$attrs" class="graph-box">
            <template #title>
              <div>
                <Tabs
                  class="tabs"
                  :destroyInactiveTabPane="true"
                  v-model:activeKey="tabPeople"
                  @change="tabPeopleFun"
                >
                  <TabPane v-if="isHasAuth('50106')" key="online_detail">
                    <template #tab>
                      <div>
                        {{ t('v.report.comprehensiveReport.online_user_count') }}
                        <span class="green-ball rounded-full inline-block"></span>
                        {{ onlineDetail }}
                      </div>
                    </template>
                  </TabPane>
                  <TabPane v-if="isHasAuth('50107')" key="reg_detail">
                    <template #tab>
                      <div>
                        <span>{{ t('table.report.report_reg_user_count') }}</span>
                        <LineChartOutlined
                          :style="{ color: '#E91134', fontSize: '17px' }"
                          class="ml-2"
                        />
                        <span class="ml--1">{{ regDetail }}</span>
                      </div>
                    </template>
                  </TabPane>
                </Tabs>
              </div>
            </template>
            <div>
              <div ref="onlineCompared" class="h-400px"> </div>
            </div>
          </Card>
        </div>
        <div class="w-100%" v-if="isHasAuth('50105')">
          <Card
            v-bind="$attrs"
            :title="t('v.report.comprehensiveReport.operations_overview')"
            class="operation-summery-box"
          >
            <template #extra>
              <div class="flex items-center" style="align-items: center">
                <DateButtonGroup
                  :isSelect="isSelectECharts"
                  @change-button-day="changeButtonDayEChartsOperationsOverview"
                  :dateGroupButtonList="dateGroupButtonListOperations"
                  class="period-select"
                />
                <div class="ml-2 calendar-range">
                  <BasicForm
                    @register="registerOperationsForm"
                    @submit="handleOperationsOverviewSubmit"
                  />
                </div>
                <RadioGroup
                  v-model:value="selectValue"
                  button-style="solid"
                  @change="getDataOperationsOverviewListFun"
                  :class="['type-select', !['zh_CN'].includes(unref(getLocale)) && 'scroll-select']"
                >
                  <RadioButton
                    :value="item.value"
                    v-for="item in operationsList"
                    :key="item.label"
                    class="radio-button"
                    >{{ item.label }}
                  </RadioButton>
                </RadioGroup>
              </div>
            </template>
            <div>
              <div
                class="mt-3"
                v-if="
                  selectValue === 'bet_amount' ||
                  selectValue === 'bet_count' ||
                  selectValue === 'net_amount'
                "
              >
                <RadioGroup
                  v-model:value="subItemValue"
                  button-style="solid"
                  @change="getDataOperationsOverviewListFun"
                >
                  <RadioButton
                    :value="item.value"
                    v-for="item in subItemList"
                    :key="item.label"
                    class="radio-button"
                  >
                    {{ item.label }}</RadioButton
                  >
                </RadioGroup>
              </div>
              <div ref="operationsECharts" class="h-400px z-0">
                <div> </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    <NoData class="mt-10" v-if="!auths(['50101', '50103', '50107', '50106', '50105'])" />
    <CurrencyModal @register="currencyModal" @success="handleModalSuccess" />
    <DetailModal @register="detailModal" />
  </PageWrapper>
</template>
<script lang="ts" setup name="ComprehensiveReportNocash">
  import { ref, nextTick, Ref, onMounted, reactive, h, computed, unref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { toTimezone, setDateParmas } from '/@/utils/dateUtil';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { CountTo } from '@/components/CountTo';
  import {
    Tooltip,
    Card,
    CardGrid,
    Button,
    RadioGroup,
    RadioButton,
    Tabs,
    TabPane,
  } from 'ant-design-vue';

  import TableTooltip from '@/views/report/comprehensiveReport/components/tableTooltip/TableTooltip.vue';
  import {
    searchSchema,
    dateGroupButtonListAll,
    getcolumns,
    series,
    OperationsOverviewSearchSchema,
    dateGroupButtonListOperations,
    OptionsProperty,
    options,
  } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import CurrencyModal from './components/currencyModal/index.vue';
  import DetailModal from './components/detailModal/index.vue';
  import { LineChartOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { useModal } from '/@/components/Modal';
  import { useRouter } from 'vue-router';
  import Icon from '@/components/Icon/Icon.vue';
  import { cloneDeep } from 'lodash-es';
  import {
    getDataOverviewList,
    getDataCategoryOverviewList,
    getDataOperationsOverviewList,
    getDataPeopleOverviewList,
    reportGeneralDataOverviewCur,
  } from '/@/api/report';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdReportDataList from '/@/components-cd/Icon/reportDataList/cd-report-data-list.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import dayjs from 'dayjs';
  import NoData from '/@/views/sys/noData/index.vue';
  import { useLocale } from '@/locales/useLocale';

  const dateButtonGroup: any = ref(null);
  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const $router = useRouter();
  const tabValue = ref('deposit');

  const columns = ref(getcolumns(tabValue.value));
  const overviewListRef = ref([] as any);
  const isSelect = ref('days' as string);
  const tabPeople = ref('online_detail' as string);
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  let onlineOptions = cloneDeep(options);
  let regOptions = cloneDeep(options);

  const { getLocale } = useLocale();
  const isSelectECharts = ref('week' as string);
  const onlineDetail = ref(0 as any);
  const regDetail = ref(0 as any);
  const currency_id = ref('' as string);
  const setDateDay = ref([] as any);
  const setMoneyType = ref('deposit');
  const overviewListName = [
    {
      label: t('table.report.report_first_deposit_amount'),
      color: '#40577a',
      type: 'first_deposit',
    },
    { label: t('table.report.report_deposit_amount_total'), color: '#008367', type: 'deposit' },
    {
      label: t('table.report.report_withdrawal_amount_total'),
      color: ' #ff9671',
      type: 'withdraw',
    },
    { label: t('table.report.report_cash_profit'), color: '#845ec2', type: 'cash_profit' },
    { label: t('table.report.report_agent_amount'), color: '#00c9a7', type: 'commission' },
    { label: t('table.report.report_gift_amount'), color: '#e07250', type: 'gift' },
    { label: t('table.report.report_bet_amount'), color: '#b39cd0', type: 'bet' },
    { label: t('table.report.report_platform_amount'), color: '#2c73d2', type: 'bet_net' },
  ];
  const operationsList = [
    { label: t('table.report.report_add_member'), value: 'register' },
    { label: t('table.report.report_first_deposit_amount'), value: 'first_deposit' },
    { label: t('table.report.report_deposit_amount_total'), value: 'deposit' },
    { label: t('table.report.report_withdrawal_amount_total'), value: 'withdraw' },
    { label: t('table.report.report_cash_profit'), value: 'cash_profit' },
    { label: t('table.report.report_agent_amount'), value: 'commission' },
    { label: t('table.report.report_gift_amount'), value: 'gift' },
    { label: t('table.report.report_bet_amount'), value: 'bet_amount' },
    { label: t('table.report.report_member_count'), value: 'bet_count' },
    { label: t('table.report.report_platform_amount'), value: 'net_amount' },
  ];
  const subItemList = [
    { label: t('table.risk.report_game_type'), value: 'game_class' },
    { label: t('table.report.report_platform_name'), value: 'game_platform' },
  ];
  const selectValue = ref('register' as any);
  const subItemValue = ref('game_class' as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const windowWidth = ref(1680);
  const processState = ref(false);

  const onlineCompared = ref<HTMLDivElement | null>(null);
  const { setOptions: onlineSetOptions } = useECharts(onlineCompared as Ref<HTMLDivElement>);

  const operationsECharts = ref<HTMLDivElement | null>(null);
  const { setOptions: setOptionsProperty } = useECharts(operationsECharts as Ref<HTMLDivElement>);
  setOptionsProperty(OptionsProperty);
  const { currencyTreeList } = useTreeListStore();

  const [currencyModal] = useModal();
  const [detailModal, { openModal: opendetailModal }] = useModal();
  const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({
    schemas: searchSchema,
    showResetButton: false,
    showSubmitButton: false,
    showAdvancedButton: false,
    size: FORM_SIZE as any,
    actionColOptions: {
      class: 't-form-col',
      xxl: 0,
      xl: 0,
      lg: 0,
    },
  });

  const [
    registerOperationsForm,
    { setFieldsValue: setOperationsFieldsValue, validate: operationsValidate },
  ] = useForm({
    schemas: OperationsOverviewSearchSchema,
    showResetButton: false,
    showSubmitButton: false,
    showAdvancedButton: false,
    size: FORM_SIZE as any,
    actionColOptions: {
      class: 't-form-col',
      xxl: 0,
      xl: 0,
      lg: 0,
    },
  });
  const [registerTable, { reload, setColumns, setTableData }] = useTable({
    api: async (data) => {
      if (tabValue.value === 'gift') {
        const res = await getDataCategoryOverviewList(data);
        if (res && res.list) {
          const IndexList = Object.keys(res.title);
          const titleList = Object.values(res.title);
          const content = IndexList.map((item, index) => {
            return {
              title: titleList[index],
              dataIndex: item,
              sorter: index == 0 ? false : true,
              showSorterTooltip: false,
              customCell: (record) => {
                if (record?.[item]?.['amount'] > 0)
                  return {
                    class: 'text-red',
                  };
              },
              customRender: ({ record, column }) => {
                if (index == 0) {
                  return toTimezone(record[item]?.time, 'YYYY-MM-DD');
                } else {
                  return renderTableTooltip(column, record, 3, '', 'amount', 'count', item);
                }
              },
            };
          });

          setColumns(content as any);
          return res.list || [];
        } else {
          return [];
        }
      } else {
        const res = await getDataCategoryOverviewList(data);
        return res;
      }
    },
    columns: columns,
    pagination: false,
    useSearchForm: false,
    immediate: false,
    bordered: true,
    showIndexColumn: false,
    beforeFetch: async (params) => {
      const data = await validate();
      params.start_time = data.startDateEndDate[0];
      params.end_time = data.startDateEndDate[1];
      params.currency_id = currency_id.value;
      params['sort_key'] = sortKey.value;
      params['sort_type'] = sortType.value;
      params.item = tabValue.value;
      setDateParmas(params);
      return params;
    },
    afterFetch: () => {
      processState.value = false;
    },

    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
  });

  async function getDataOverviewListFun() {
    try {
      const data = await validate();
      let startDateEndDate = {
        start_time: data.startDateEndDate[0] || dayjs().endOf('day').valueOf(),
        end_time: data.startDateEndDate[1] || dayjs().endOf('day').valueOf(),
      };

      setDateParmas(startDateEndDate);
      if (isHasAuth('50101')) {
        let { d = {}, n = [] } = await getDataOverviewList({
          ...startDateEndDate,
          currency_id: currency_id.value,
        });
        overviewListRef.value = [];
        overviewListName.map((item) => {
          return overviewListRef.value.push({
            ...d[item.type],
            name: item.label,
            type: item.type,
            color: item.color,
            report_num: t('table.report.report_num'),
            report_per_capita: t('table.report.report_per_capita'),
            some_people: t('v.report.comprehensiveReport.some_people'),
          });
        });
        currentList.value = [
          { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
        ].concat(currencyTreeList.filter((item) => n?.includes(item.id)));
      } else {
        const data = await reportGeneralDataOverviewCur(startDateEndDate);
        currentList.value = [
          { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
        ].concat(currencyTreeList.filter((item) => data.includes(item.id)));
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function changeButtonDayEChartsOverView(v) {
    currency_id.value = v;
    await validate();
    getDataOverviewListFun();
    reload();
  }
  async function changeButtonDay(value) {
    setDateDay.value = value;

    await setFieldsValue({ startDateEndDate: value });
    await getDataOverviewListFun();
    reload();
  }

  function handleSubmit() {
    getDataOverviewListFun();
    reload();
  }
  const timer = reactive({
    start_time: 0,
    end_time: 0,
  });
  const getDataOperationsOverviewListFun = async () => {
    const time = await operationsValidate();
    let params: any = {
      start_time: time.startDateEndDate[0],
      end_time: time.startDateEndDate[1],
      item: selectValue.value,
    };

    try {
      if (
        selectValue.value === 'bet_amount' ||
        selectValue.value === 'bet_count' ||
        selectValue.value === 'net_amount'
      ) {
        params.sub_item = subItemValue.value;
      }
      setDateParmas(params);

      const { datasets, labels } = await getDataOperationsOverviewList(params);
      let optionsClone = cloneDeep(OptionsProperty);
      optionsClone.xAxis[0].data = labels;

      if (datasets.length > 1) {
        optionsClone.series.splice(0, 1);
        datasets.map((item) => {
          optionsClone.legend.data.push(item.label);
          let seriesClone = cloneDeep(series);
          seriesClone.data = item.data;
          seriesClone.name = item.label;
          optionsClone.series.push(seriesClone);
        });
      } else {
        const ative: any = operationsList.find((item) => item.value == selectValue.value);
        optionsClone.series[0].data = datasets[0].data;
        optionsClone.series[0].name = ative.label;
        optionsClone.legend.data.push(ative.label);
      }

      setOptionsProperty(optionsClone);
    } catch (error) {
      console.error(error);
    }
  };
  function handleOperationsOverviewSubmit() {
    getDataOperationsOverviewListFun();
  }
  async function handleModalSuccess(value) {
    currency_id.value = value;
    await validate();
    getDataOverviewListFun();
    reload();
  }

  const tabPeopleFun = () => {
    switch (tabPeople.value) {
      case 'online_detail':
        onlineSetOptions(onlineOptions);
        break;
      case 'reg_detail':
        onlineSetOptions(regOptions);
        break;
    }
  };
  const renderTableTooltip = (
    column,
    record,
    tableType,
    colType,
    moneyNum,
    peopleNum = '',
    item?,
  ) => {
    return h(TableTooltip, {
      record,
      column,
      tableType,
      colType: colType,
      moneyNum: moneyNum,
      peopleNum,
      titleItem: item,
    });
  };
  function tabsChangeFun2(_tabName) {
    setTableData([]);
    if (_tabName === 'deposit' || _tabName === 'withdraw') setMoneyType.value = _tabName;
    tabValue.value = _tabName;
    setColumns(getcolumns(tabValue.value));
    reload();
  }

  function kindsSummeryType(_tabName) {
    return tabValue.value == _tabName ? 'primary' : 'default';
  }

  async function handleIcon(vlaue) {
    const time = getFieldsValue();
    timer.start_time = dayjs(time.startDateEndDate[0]).unix();
    timer.end_time = dayjs(time.startDateEndDate[1]).unix();
    if (vlaue.type == 'bet')
      $router.push({
        name: 'BettingReport',
        state: setDateDay.value,
        query: { start: timer.start_time, end: timer.end_time },
      });
    else if (vlaue.type == 'bet_net')
      $router.push({
        name: 'PlatformReport',
        state: setDateDay.value,
        query: { start: timer.start_time, end: timer.end_time },
      });
    else if (vlaue.type == 'gift')
      $router.push({
        name: 'ActivityReport',
        state: setDateDay.value,
        query: { start: timer.start_time, end: timer.end_time },
      });
    else {
      const data = await validate();
      opendetailModal(true, {
        ...vlaue,
        start_time: data.startDateEndDate[0],
        end_time: data.startDateEndDate[1],
        currency_id: currency_id.value,
      });
    }
  }

  function changeButtonDayEChartsOperationsOverview(value) {
    nextTick(async () => {
      setOperationsFieldsValue({ startDateEndDate: value });
      getDataOperationsOverviewListFun();
    });
  }

  async function getPeopleData() {
    try {
      const { online_count, online_detail, reg_count, reg_detail } =
        await getDataPeopleOverviewList();
      onlineDetail.value = online_count;
      regDetail.value = reg_count;
      onlineOptions.xAxis[0].data = online_detail.labels;
      regOptions.xAxis[0].data = reg_detail.labels;
      online_detail.datasets.map((item) => {
        onlineOptions.legend.data.push(item.label);
        let seriesClone = cloneDeep(series);
        seriesClone.data = item.data;
        seriesClone.name = item.label;
        onlineOptions.series.push(seriesClone);
      });

      reg_detail.datasets.map((item) => {
        regOptions.legend.data.push(item.label);
        let seriesClone = cloneDeep(series);
        seriesClone.data = item.data;
        seriesClone.name = item.label;
        regOptions.series.push(seriesClone);
      });
    } catch (error) {
      console.error(error);
    }
  }
  window.addEventListener('resize', function () {
    const screenWidth = window.innerWidth;
    windowWidth.value = screenWidth;
  });
  const isEllipsis = computed(() => (windowWidth.value > 1340 ? false : true));

  onMounted(async () => {
    if (isHasAuth('50106') && !isHasAuth('50107')) {
      tabPeople.value = 'online_detail';
      await getPeopleData();
      tabPeopleFun();
    } else if (isHasAuth('50107') && !isHasAuth('50106')) {
      tabPeople.value = 'reg_detail';
      await getPeopleData();
      tabPeopleFun();
    } else if (isHasAuth('50107') && isHasAuth('50106')) {
      await getPeopleData();
      tabPeopleFun();
    }
  });
</script>

<style lang="less" scoped>
  .numEllipsis {
    width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .numAmountEllipsis {
    width: 195px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .everyoneEllipsis {
    display: block;
    max-width: 80px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep(.vben-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin-bottom: 0;
  }

  ::v-deep(.ant-card .ant-card-head) {
    background: rgb(249 249 249 / 100%) !important;
  }

  // ::v-deep(.ant-table-thead > tr > th) {
  //   background-color: white !important;
  //   text-align: center;
  // }

  ::v-deep(.ant-table-body .ant-table-cell div) {
    width: 100% !important;
    min-width: 100% !important;
  }

  ::v-deep(.ant-card) {
    margin-top: 10px;
    margin-left: 10px;
    border-radius: 10px;
    box-shadow: 0 0 5px rgb(0 0 0 / 5%);
  }

  ::v-deep(.ant-card-head) {
    display: flex;
  }

  ::v-deep(.ant-card-grid:first-child) {
    border-top-left-radius: 20px;
  }

  ::v-deep(.ant-card-grid:nth-child(4)) {
    border-top-right-radius: 20px;
  }

  ::v-deep(.ant-card-grid:last-child) {
    border-bottom-right-radius: 20px;
  }

  ::v-deep(.ant-card-grid:nth-child(5)) {
    border-bottom-left-radius: 20px;
  }

  ::v-deep(.ant-card-grid) {
    padding: 25px 10px;
    border-right: 1px solid #fff;
    border-bottom: 1px solid #fff;
    box-shadow: none;
  }

  ::v-deep(.ant-progress-inner) {
    border-radius: 0;
  }

  ::v-deep(.CurrencyButtonGroup .ant-radio-group) {
    display: flex;

    .ant-radio-button-wrapper:nth-of-type(1) {
      min-width: 90px;
    }
  }

  .CurrencyButtonGroup {
    overflow: hidden;
  }

  .infoLine {
    position: relative;
    margin-top: 10px;

    span {
      position: absolute;
      top: 1px;
      left: 83px;
      color: white;
    }

    .strang {
      position: absolute;
      top: -1px;
      left: -11px;
      color: rgb(0 0 0 / 60%);
      font-weight: 900;
    }
  }

  .isShow {
    .flex-grow {
      width: 140px;
      padding-left: 22px;
    }

    span {
      position: absolute;
      top: 1px;
      left: 113px;
      color: white;
    }
  }

  .rotate90 {
    transform: rotate(90deg);
  }

  .pointer {
    cursor: pointer;
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

  .cardGrade {
    width: calc((100% - 36px) / 4);
    height: 164px;
    margin-right: 12px;
    border-radius: 8px !important;
    background: linear-gradient(170.74deg, #2f4553 5.61%, #263d4b 96.19%) !important;
    position: relative;

    ::v-deep(.app-iconify) {
      svg {
        display: none;
      }
    }

    ::v-deep(.app-iconify::after) {
      content: '';
      width: 14px;
      height: 14px;
      background-image: url('/@/assets/images/find-data.webp');
      background-size: 100%;
    }

    .card_title {
      span:nth-child(1) {
        border-bottom: 1px solid #b1bad3 !important;

        span {
          border-bottom: none !important;
        }
      }
    }

    .numbers {
      div {
        padding: 2px 15px;
        border-radius: 20px;
        background: #1a2c38;

        span:nth-child(1),
        span {
          border-bottom: none !important;
          color: #b1bad3;
          font-size: 14px !important;
          font-weight: 600;
        }
      }
    }
  }

  .cardGrade:nth-child(5),
  .cardGrade:nth-child(6),
  .cardGrade:nth-child(7),
  .cardGrade:nth-child(8) {
    margin-top: 12px;
  }

  .cardGrade:nth-child(4),
  .cardGrade:nth-child(8) {
    margin-right: 0;
  }

  .cicle {
    display: block;
    width: 6px;
    height: 6px;
    margin-right: 3px;
    border-radius: 6px;
    background: #1cd91c;
  }

  ::v-deep(.ant-card-head-title) {
    // width: 130px !important;
    flex: 0 0 auto;
    padding-right: 8px;
  }
  //数据总览
  .report_data_all_box {
    ::v-deep(.ant-card-head) {
      border: 1px solid #e1e1e1;
      background-color: #f6f7fb !important;
    }

    ::v-deep(.ant-card-body) {
      border: 1px solid #e1e1e1;
      border-top: none;
    }

    ::v-deep(.ant-card-extra) {
      // width: calc(100vw - 380px);
      padding: 0 !important;
      flex-grow: 1;
    }

    ::v-deep(.ant-card-head-wrapper) {
      width: 100% !important;
    }

    ::v-deep(.ant-radio-group) {
      margin-right: 23px;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      //width: 60px !important;
      overflow: hidden;
      border-radius: 4px !important;
      box-shadow: none !important;
    }

    ::v-deep(.ant-radio-button-wrapper::before) {
      display: none !important;
    }

    ::v-deep(.ant-radio-button-wrapper:not(:last-child)) {
      margin-right: 4px;
    }

    ::v-deep(.ant-form-item-control-input-content > div > div) {
      margin-right: 0 !important;
    }

    ::v-deep(.ant-card-head-title) {
      color: #444 !important;
      font-size: 18px !important;
      font-weight: 600 !important;
    }
  }

  .report_data_all_box_role {
    ::v-deep(.ant-card-extra) {
      width: calc(100vw);
      padding: 0 !important;
    }

    ::v-deep(.ant-card-head) {
      padding-left: 5px;
    }
  }

  //分类总览
  .kinds-summery-box {
    ::v-deep(.ant-card-head) {
      border: 1px solid #e1e1e1;
      background-color: #f6f7fb !important;
    }

    ::v-deep(.ant-card-body) {
      //border: 1px solid #E1E1E1;
      //border-top: none;
      border: none !important;
    }

    ::v-deep(.ant-card-head-title) {
      color: #444 !important;
      font-size: 18px !important;
      font-weight: 600 !important;
    }

    ::v-deep(.ant-card-head-wrapper) {
      width: 100% !important;
    }

    ::v-deep(.ant-card-extra) {
      padding: 0 !important;
    }

    .tab-btn-box {
      ::v-deep(.ant-btn:not(:last-child)) {
        margin-right: 10px;
      }
    }

    ::v-deep(.ant-table-container),
    ::v-deep(.ant-table-header) {
      border: none !important;
    }

    ::v-deep(.ant-card-body) {
      padding: 0 !important;

      thead > tr > th {
        background-color: #fff !important;
      }

      tbody > tr:nth-child(2n-1) > td {
        background-color: #fff !important;
      }

      tbody > tr:nth-child(2n) > td {
        background-color: #f6f7fb !important;
      }

      ::v-deep(.ant-table.ant-table-bordered > .ant-table-container > .ant-table-header > table) {
        border-top: none !important;
      }
    }
  }

  .graph-box {
    ::v-deep(.ant-card-head) {
      border: 1px solid #e1e1e1;
      background-color: #f6f7fb !important;
    }

    ::v-deep(.ant-card-body) {
      border: 1px solid #e1e1e1;
      border-top: none;
    }

    ::v-deep(.ant-tabs-tab) {
      height: 42px !important;
      padding: 11px 20px;
      border: 1px solid #e1e1e1 !important;
      border-radius: 4px !important;
    }

    ::v-deep(.ant-tabs-tab > div > div) {
      display: flex;
      align-items: center;
    }

    ::v-deep(.ant-tabs-tab:not(:last-child)) {
      margin-right: 10px !important;
      margin-left: 0 !important;
    }

    ::v-deep(.ant-tabs-tab-active) {
      background-color: #1475e1;
    }

    ::v-deep(.ant-tabs-tab-btn) {
      .green-ball {
        width: 8px;
        height: 8px;
        margin-right: 6px;
        margin-left: 10px;
        background-color: #51d250;
      }
    }

    ::v-deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
      color: #fff !important;
      text-shadow: none !important;
    }

    ::v-deep(.anticon-line-chart) {
      width: 12.7px !important;
      height: 8px !important;

      //background-color: red;
      svg {
        display: none;
      }
    }

    ::v-deep(.anticon-line-chart::before) {
      content: '';
      display: inline-block;
      width: 12.7px !important;
      height: 8px !important;
      background-image: url('/@/assets/images/regist-icon.webp');
      background-repeat: no-repeat;
      background-size: 100%;
    }

    ::v-deep(.ant-tabs-tab .ant-tabs-tab-btn) {
      font-size: 14px !important;
      font-weight: 500 !important;
    }

    ::v-deep(.ant-card-head-title) {
      padding-top: 9px !important;
      padding-bottom: 9px !important;
    }

    ::v-deep(.ant-tabs-top > .ant-tabs-nav::before) {
      border: none !important;
    }

    ::v-deep(.ant-tabs-ink-bar) {
      display: none !important;
    }
  }

  // 运营总览
  .operation-summery-box {
    ::v-deep(.ant-card-head) {
      border: 1px solid #e1e1e1;
      background-color: #f6f7fb !important;
    }

    ::v-deep(.ant-card-body) {
      border: 1px solid #e1e1e1;
      border-top: none;
    }

    ::v-deep(.ant-card-head-title) {
      color: #444 !important;
      font-size: 18px !important;
      font-weight: 600 !important;
    }

    ::v-deep(.ant-card-head-wrapper) {
      width: 100% !important;
    }

    ::v-deep(.ant-card-extra) {
      padding: 0 !important;

      .calendar-range {
        display: flex !important;
        align-items: center !important;
        width: 500px;
        .t-form-label-com {
          margin-top: 12px;
        }
      }

      .period-select {
        margin-top: 2px;
        white-space: nowrap;

        label {
          min-width: 34px !important;
          padding: 0 10px !important;
          border: 1px solid #e1e1e1;
          border-radius: 4px !important;
        }

        label > span:nth-child(2) {
          display: inline-block;
          //position: absolute;
          height: 37px !important;
          line-height: 37px !important;
          //margin-top: -12px;
          //margin-left: -2px;
        }

        label::before {
          display: none !important;
        }

        label:not(:last-child) {
          margin-right: 4px;
        }
      }

      .type-select {
        margin-top: 2px;

        &.scroll-select {
          width: 1000px !important;
          overflow-x: auto !important;
          white-space: nowrap;

          &::-webkit-scrollbar {
            display: none;
          }
        }

        label {
          //max-width: 100px !important;
          padding: 0 10px !important;
          border: 1px solid #e1e1e1;
          border-radius: 4px !important;
        }

        label > span:nth-child(2) {
          display: inline-block;
          //position: absolute;
          height: 37px !important;
          line-height: 37px !important;
          //margin-top: -12px;
          //margin-left: -2px;
        }

        label::before {
          display: none !important;
        }

        label:not(:last-child) {
          margin-right: 4px;
        }
      }
    }

    ::v-deep(.ant-radio-button-wrapper) {
      height: 38px !important;
      box-shadow: none !important;
      line-height: 38px !important;
    }
  }

  .i-fon-sty {
    font-style: normal;
  }

  .extra-long-style {
    display: inline-block;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
