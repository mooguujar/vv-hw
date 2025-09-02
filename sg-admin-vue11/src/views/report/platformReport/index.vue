<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-grupList>
        <DateButtonGroup
          :isSelect="isSelect"
          :dateGroupButtonList="dateGroupButtonList"
          @change-button-day="changeButtonDay"
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
      <template #action="{ record }">
        <span class="primary-color cursor" @click="gameInfoFun(record)"
          >{{ record.platform_name }}
        </span>
      </template>
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
            class="pay-input w-20 mr-2.5"
            allowClear
            :placeholder="$t('business.common_search_tip')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #summary>
        <TableSummary v-if="totalPlatformReport.member_count">
          <TableSummaryRow>
            <TableSummaryCell class="text-center" :index="0">{{
              $t('business.common_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="1">{{
              totalPlatformReport.member_count ? totalPlatformReport.member_count : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="2">{{
              totalPlatformReport.bet_count ? totalPlatformReport.bet_count : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="3">
              {{
                totalPlatformReport.bet_count_proportion
                  ? `${mul(totalPlatformReport.bet_count_proportion, 100)}%`
                  : '-'
              }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="4">{{
              totalPlatformReport.bet_amount ? totalPlatformReport.bet_amount : '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="5">{{
              totalPlatformReport.valid_bet_amount ? totalPlatformReport.valid_bet_amount : '-'
            }}</TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :index="6"
              :style="{
                color: totalPlatformReport.profit_rate > 0 ? '#E91134' : '#1CD91C',
              }"
              >{{
                totalPlatformReport.net_amount ? totalPlatformReport.net_amount : '-'
              }}</TableSummaryCell
            >
            <TableSummaryCell
              class="text-center"
              :index="7"
              :style="{
                color: totalPlatformReport.profit_rate > 0 ? '#E91134' : '#1CD91C',
              }"
              >{{ totalPlatformReport.profit_rate ? `${totalPlatformReport.profit_rate}%` : '-' }}
            </TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="PlatformReportNocash">
  import { ref, onMounted, nextTick } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { PageWrapper } from '/@/components/Page';
  import { TableSummary, TableSummaryRow, TableSummaryCell, Select } from 'ant-design-vue';
  import { exportReportGame, getPlatformGameList } from '/@/api/report/index';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { add, mul } from '/@/utils/number';
  import dayjs from 'dayjs';
  import { useGameSortStore } from '/@/store/modules/gameSort';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { isHasAuth } from '@/utils/authFunction';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const route = useRoute();
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(360).value);
  const { exportFile } = useExportFile();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const totalPlatformReport = ref({} as any);
  const currency_id = ref('' as any);
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const isSelect = ref('days' as any);

  const model = ref<FormModel>({
    start_time: dayjs().subtract(2, 'day').startOf('day'),
    end_time: dayjs().endOf('day'),
  });

  //定义当前选中的框
  const currentType = ref('username' as any);
  //输入当前的值
  const fromSearch = ref('' as any);

  const $router = useRouter();
  const gameSortStore = useGameSortStore();
  gameSortStore.setgame_typeList(); //调用游戏类型接口
  const { currencyTreeList } = useTreeListStore();
  const [registerTable, { reload, getForm }] = useTable({
    api: async (data) => {
      try {
        totalPlatformReport.value = {};
        const { d, n } = await getPlatformGameList(data);
        const platformReportList = d.filter((item) => {
          if (item.platform_id == 0) {
            totalPlatformReport.value = item;
          } else {
            return true;
          }
        });
        if (n && !currency_id.value) {
          currentList.value = [
            { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
          ].concat(currencyTreeList.filter((item) => n.includes(item.id)));
        }
        return platformReportList;
      } catch (error) {
        return [];
      }
    },
    columns,
    bordered: true,
    // ellipsis: false,
    showIndexColumn: false,
    pagination: false,
    immediate: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema(),
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
      showResetButton: isControlValueSet() ? false : isHasAuth('50303'), //导出按钮隐藏
      resetFunc: handleExportTableList,
    },
    useSearchForm: true,
    beforeFetch: (params) => {
      processingParams(params);
    },
    sortFn: (sortInfo) => {
      //升序和降序
      const { field, order } = sortInfo;
      sortKey.value = field;
      sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : '';
    },
  });

  function processingParams(params) {
    setDateParmaTime(params);
    setDateParmas(params);
    params[currentType.value] = fromSearch.value;
    params['game_class'] = params.game_class == 'all' ? '' : params.game_class;
    params['sort_key'] = sortKey.value ? sortKey.value : 'valid_bet_amount';
    params['sort_type'] = sortType.value ? sortType.value : 'desc';
    params['currency_id'] = currency_id.value;
    return params;
  }

  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
  // 详情跳转
  async function gameInfoFun(record) {
    const { validate } = getForm();
    const values = await validate();
    setDateParmaTime(values);
    setDateParmas(values);
    const data = {
      platform_name: record.platform_name,
      start_time: values.start_time,
      end_time: values.end_time,
      currency_id: currency_id.value,
      platform_id: record.platform_id,
    };
    data[currentType.value] = fromSearch.value;
    $router.push({
      name: 'GameReport',
      state: { ...data, type: currentType.value, values: fromSearch.value },
    });
  }
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
      //await getForm().setFieldsValue({ end_time: value[1] });
    });
  }

  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const params = await validate();
      processingParams(params);
      await exportFile(exportReportGame, params, t('routes.report.gameReport'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }
  const searchTypeOptions = [
    { label: t('business.common_member_account'), value: 'username' },
    { label: t('table.system.superior_agent'), value: 'parent_name' },
  ];
  onMounted(async () => {
    if (route.query.start) {
      getForm().setFieldsValue({
        time: [
          dayjs(dayjs.unix(route.query.start).format('YYYY-MM-DD HH:mm:ss')),
          dayjs(dayjs.unix(route.query.end).format('YYYY-MM-DD HH:mm:ss')),
        ],
      });
    }
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .red {
    color: #e91134;
  }

  .green {
    color: #1cd91c;
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
