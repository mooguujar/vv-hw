<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-grupButton>
        <DateButtonGroup
          :isSelect="isSelect"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
        />
      </template>
      <template #tableTitle>
        <!-- <CurrencyButton
          :list="dataCurrency"
          class="!mb-1"
          :allTitle="$t('table.member.member_money_all')"
          @change-button-currency="changeClick"
        /> -->
        <div class="w-full">
          <cdButtonCurrency
            v-if="totleAmountList"
            :firstList="[{ name: t('table.member.member_money_all'), value: '', lable: 'ALL' }]"
            :btn-list="currentList"
            @change-button-currency="changeClick"
            v-model="currency_id"
          />
        </div>
        <div class="w-100% pl-4 pb-1 parentNameGroup" v-if="parentNameList.length > 1">
          <a v-for="(itme, index) in parentNameList" :key="index" @click="clickParentNameFun(index)"
            >{{ itme }}<span> > </span></a
          >
        </div>
      </template>
      <template #action="{ record }">
        <span
          :class="[record.is_self == 2 ? 'primary-color cursor' : '']"
          @click="searchParentNameFun(record)"
          >{{ record.username }}
        </span>
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
      <template #summary>
        <TableSummary v-if="totleAmountList && disShowTotal">
          <TableSummaryRow>
            <TableSummaryCell class="text-center !text-sm" :index="0">{{
              $t('business.common_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="1">{{
              (totleAmount && totleAmount?.user_type) || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="2">{{
              (totleAmount && totleAmount?.reg_user_count) || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="3">
              <!-- <Tooltip
                :title="
                  (totleAmount &&
                    totleAmount?.first_deposit_amount +
                      '/' +
                      totleAmount?.first_deposit_user_count +
                      ' '+t('component.unit.people')) ||
                  '-'
                "
              /> -->
              {{
                (totleAmount &&
                  totleAmount?.first_deposit_amount +
                    '/' +
                    totleAmount?.first_deposit_user_count +
                    ' ' +
                    t('component.unit.people')) ||
                '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="4">
              <!-- <Tooltip
                :title="
                  (totleAmount &&
                    totleAmount?.valid_bet_amount + '/' + totleAmount?.bet_user_count + ' '+t('component.unit.people')) ||
                  '-'
                "
              /> -->
              {{
                (totleAmount &&
                  totleAmount?.valid_bet_amount +
                    '/' +
                    totleAmount?.bet_user_count +
                    ' ' +
                    t('component.unit.people')) ||
                '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell
              class="text-center !text-sm"
              :index="5"
              :class="[totleAmount.net_amount > 0 ? 'text-red' : 'text-green']"
            >
              <!-- <Tooltip :title="(totleAmount && totleAmount.net_amount) || '-'">{{
                (totleAmount && totleAmount?.net_amount) || '-'
              }}</Tooltip> -->
              {{ totleAmount && totleAmount?.net_amount }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="6">
              <!-- <Tooltip :title="(totleAmount && totleAmount.commission_amount) || '-'">
                {{ (totleAmount && totleAmount?.commission_amount) || '-' }}
              </Tooltip> -->
              {{ totleAmount && totleAmount?.commission_amount }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="7">
              <!-- <Tooltip
                :title="
                  (totleAmount &&
                    totleAmount.gift_amount + '/' + totleAmount.gift_user_count + ' '+t('component.unit.people')) ||
                  '-'
                "
              >
                {{
                  (totleAmount &&
                    totleAmount?.gift_amount + '/' + totleAmount?.gift_user_count + ' '+t('component.unit.people')) ||
                  '-'
                }}
              </Tooltip> -->
              {{
                (totleAmount &&
                  totleAmount?.gift_amount +
                    '/' +
                    totleAmount?.gift_user_count +
                    ' ' +
                    t('component.unit.people')) ||
                '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell
              class="text-center !text-sm"
              :index="8"
              :class="[totleAmount.net_amount > 0 ? 'text-red' : 'text-green']"
            >
              <!-- <Tooltip :title="(totleAmount && totleAmount.team_profit) || '-'">
                {{ (totleAmount && totleAmount?.team_profit) || '-' }}
              </Tooltip> -->
              {{ (totleAmount && totleAmount?.team_profit) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="5">
              <!-- <Tooltip :title="(totleAmount && totleAmount.deposit_amount + ' '+t('component.unit.people')) || '-'">
                {{
                  (totleAmount &&
                    totleAmount?.deposit_amount + '/' + totleAmount?.deposit_user_count + ' '+t('component.unit.people')) ||
                  '-'
                }}
              </Tooltip> -->
              {{
                (totleAmount &&
                  totleAmount?.deposit_amount +
                    '/' +
                    totleAmount?.deposit_user_count +
                    ' ' +
                    t('component.unit.people')) ||
                '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="6">
              <!-- <Tooltip
                :title="
                  (totleAmount &&
                    totleAmoun?.withdraw_amount + '/' + totleAmount?.withdraw_user_count + ' '+t('component.unit.people')) ||
                  '-'
                "
              >
                {{
                  (totleAmount &&
                    totleAmount?.withdraw_amount + '/' + totleAmount?.withdraw_user_count + ' '+t('component.unit.people')) ||
                  '-'
                }}
              </Tooltip> -->
              {{
                (totleAmount &&
                  totleAmount?.withdraw_amount +
                    '/' +
                    totleAmount?.withdraw_user_count +
                    ' ' +
                    t('component.unit.people')) ||
                '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell
              class="text-center !text-sm"
              :index="7"
              :class="[totleAmount.cash_profit > 0 ? 'text-red' : 'text-green']"
              >{{ (totleAmount && totleAmount?.cash_profit) || '-' }}</TableSummaryCell
            >
            <TableSummaryCell class="text-center !text-sm" :index="8">
              <!-- <Tooltip :title="(totleAmount && totleAmount.team_balance) || '-'">
                {{ (totleAmount && totleAmount?.team_balance) || '-' }}
              </Tooltip> -->
              {{ (totleAmount && totleAmount?.team_balance) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="8">
              <!-- <Tooltip :title="(totleAmount && totleAmount.team_user_count) || '-'">
                {{ '-' }}
              </Tooltip> -->
              {{ '-' }}
            </TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="AgentReportNocasH">
  import { ref, nextTick, onMounted, onBeforeMount } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { TableSummary, TableSummaryRow, TableSummaryCell, DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';

  import { exportReportAgent, getActingList } from '/@/api/report/index';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { PageWrapper } from '/@/components/Page';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { isHasAuth } from '@/utils/authFunction';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const parentNameList = ref([t('table.report.report_front_proxy')] as any);
  const { currencyTreeList } = useTreeListStore();

  const { exportFile } = useExportFile();

  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const dataCurrency = ref([] as any);
  const isSelect = ref('days' as string);
  const currency_id = ref('' as any);
  const currentList = ref([] as any);
  const totleAmountList = ref([] as any);
  const totleAmount = ref({} as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const disShowTotal = ref(false);
  const [registerTable, { reload, getForm, getRawDataSource, setPagination }] = useTable({
    api: getActingList,
    // api: async (params) => {
    //   let response = await getActingList(params);
    //   return response.d[0];
    // },
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
      },
      customClassForm: true,
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      showAdvancedButton: false, //是否收起
      resetFunc: handleExportTableList,
      showResetButton: isHasAuth('50501'), //导出按钮隐藏
    },
    resizeHeightOffset: 40,
    beforeFetch: (params) => {
      processingParams(params);
      //下面这个等于{}会导致总计为undefined，先注释了
      // totleAmount.value = {};
      //currentList.value = [];
    },
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
    afterFetch: (response) => {
      totleAmountList.value = response;
      const data = getRawDataSource();
      dataCurrency.value = data.n;
      if (data.n && !currency_id.value) {
        currentList.value = [].concat(currencyTreeList.filter((item) => data.n.includes(item.id)));
      }

      totleAmount.value = totleAmountList.value ? data?.c[0] : [];
      if (!disShowTotal.value) {
        disShowTotal.value = true;
      }
    },
    immediate: false,
  });
  function processingParams(params) {
    params['currency_id'] = currency_id.value;
    params['sort_key'] = sortKey.value ? sortKey.value : 'reg_user_count';
    params['sort_type'] = sortType.value ? sortType.value : 'desc';

    setDateParmaTime(params);
    setDateParmas(params);
    if (params['username']) parentNameList.value = [t('table.report.report_front_proxy')];
    if (parentNameList.value.length > 1)
      params['parent_name'] = parentNameList.value[parentNameList.value.length - 1];
    return params;
  }
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
      model.value.start_time = value[0];
      model.value.end_time = value[1];
      // await getForm().setFieldsValue({ start_time: value[0] });
      // await getForm().setFieldsValue({ end_time: value[1] });
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
  async function searchParentNameFun(record) {
    if (record.is_self == 2) {
      parentNameList.value.push(record.username);
      await getForm().setFieldsValue({ username: '' });
      setPagination({ current: 1 });
      reload();
    }
  }
  function clickParentNameFun(record) {
    parentNameList.value.splice(record + 1, parentNameList.value.length - record + 1);
    setPagination({ current: 1 });
    reload();
  }

  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      processingParams(param);
      await exportFile(exportReportAgent, param, t('routes.report.agentReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }

  onBeforeMount(() => (disShowTotal.value = false));
  onMounted(async () => {
    nextTick(async () => {
      if (history.state.length > 0) {
        setTimeout(async () => {
          await getForm().setFieldsValue({ time: [history.state['0'], history.state['1']] });
        }, 500);
      }
    });
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .parentNameGroup > a:nth-last-of-type(1) {
    span {
      display: none;
    }
  }

  .text-center {
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
  }

  ::v-deep(.vben-basic-table-header__tableTitle) {
    min-width: 100%;
    margin-top: 2px;
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
