<template>
  <PageWrapper :contentStyle="{ margin: '10px', marginTop: 0 }">
    <div class="lottery-number">
      <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
        <template #form-reloadTime>
          <Select
            v-model:value="reloadTime"
            :options="RELOAD_OPTIONS"
            @change="handleReloadTimeChange"
            :dropdownMatchSelectWidth="false"
          />
        </template>
        <template #form-typeid>
          <DateButtonGroup
            :compareRangeTime="unixRang"
            :dateGroupButtonList="dateGroupButtonList"
            @change-button-day="changeButtonDay"
            isSelect="days"
            style="margin-right: 8px"
            isEndToday
          />
        </template>
        <template #valid_bet_amount="{ column, record }">
          <div class="flex justify-center align-center">
            {{ t('table.race_price.table_valid_bet') }}
            <cdBlockCurrency :id="currencyObj" class="ml-5px" />
          </div>
        </template>
        <template #net_amount="{ column, record }">
          <div class="flex justify-center align-center">
            {{ t('table.report.report_platform_amount') }}
            <cdBlockCurrency :id="currencyObj" class="ml-5px" />
          </div>
        </template>
        <template #action="{ record }">
          <TableAction
            class="!justify-center"
            :actions="[
              {
                label: t('common.cp18'),
                onClick: openDetailModal.bind(null, record),
                // ifShow: isHasAuth('50143'),
              },
              {
                label: t('common.cp19'),
                onClick: openDetailModal.bind(null, record),
                // ifShow: isHasAuth('50143'),
              },
              {
                label: t('common.cp20'),
                onClick: openDetailModal.bind(null, record),
                // ifShow: isHasAuth('50143'),
              },
              {
                label: t('common.cp21'),
                color: 'error',
                onClick: handlesModal.bind(null, record),
                // ifShow: isHasAuth('50144'),
              },
            ]"
          />
        </template>
        <template #summary>
          <TableSummary v-if="sum">
            <TableSummaryRow>
              <template v-for="(item, index) in columns">
                <TableSummaryCell
                  :key="index"
                  v-if="item.dataIndex === 'issue_id'"
                  align="center"
                  :index="index"
                  >{{ t('business.common_total') }}
                </TableSummaryCell>
                <TableSummaryCell
                  v-else-if="item.dataIndex === 'valid_bet_amount'"
                  align="center"
                  :index="index"
                  >{{ smallSum.valid_bet_amount }}
                </TableSummaryCell>
                <TableSummaryCell
                  v-else-if="item.dataIndex === 'net_amount'"
                  align="center"
                  :class="smallSum.net_amount > 0 ? 'text-#D9001B' : 'text-#63A103'"
                  :index="index"
                  >{{ smallSum.net_amount }}
                </TableSummaryCell>
                <TableSummaryCell v-else align="center" :index="index">-</TableSummaryCell>
              </template>
            </TableSummaryRow>
          </TableSummary>
        </template>
        <template #customTableHeader>
          <div>
            <RadioGroup
              button-style="solid"
              v-model:value="ty"
              :size="FORM_SIZE"
              @change="changeButtonCp('ty')"
              style="margin-bottom: 10px"
            >
              <RadioButton
                v-for="(item, index) in cpGroupButtonList.ty"
                :value="item.ty"
                :key="index"
              >
                {{ item.name }}
              </RadioButton>
            </RadioGroup>
          </div>
          <div>
            <RadioGroup
              button-style="solid"
              v-model:value="lottery_id"
              :size="FORM_SIZE"
              @change="changeButtonCp()"
              style="margin-bottom: 10px"
            >
              <RadioButton
                v-for="(item, index) in cpGroupButtonList.lotteries[ty]"
                :value="item.lottery_id"
                :key="index"
              >
                {{ item.name }}
              </RadioButton>
            </RadioGroup>
          </div>
        </template>
      </BasicTable>
      <prizeDraw @register="registerOperateEvent" />
      <BettingDetails @register="registerBettingDetails" />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, nextTick, onMounted, onDeactivated, onActivated } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { columns, searchForm } from './index.data';
  import { useTable, BasicTable, TableAction } from '/@/components/Table';
  import { getLotteryReportIssue } from '@/api/sys';
  import { setDateParmas } from '/@/utils/dateUtil';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import {
    RadioButton,
    RadioGroup,
    Select,
    TableSummary,
    TableSummaryCell,
    TableSummaryRow,
  } from 'ant-design-vue';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useRouter } from 'vue-router';
  import { useLocale } from '@/locales/useLocale';
  import { DateButtonGroup } from '@/components/DateButtonGroup';
  import { useInterval } from '@/utils/helper/paramsHelper';
  import { useModal } from '@/components/Modal';
  import prizeDraw from './component/prizeDraw.vue';
  import BettingDetails from './component/BettingDetails.vue';
  import { useScrollerHeight } from '@/hooks/web/useScrollHeight';
  import { useSystemStore } from '/@/store/modules/system';
  import dayjs from 'dayjs';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

  const { getCurrencyObj } = useCurrencyStore();
  const currencyObj = getCurrencyObj?.id;
  const { t } = useI18n();
  const systemStore = useSystemStore();
  const scrollHeight = Number(useScrollerHeight(450).value);
  const lang = useLocale().getLocale.value;
  const unixRang = ref<Array<number>>([]);
  const RELOAD_OPTIONS = [
    { label: t('business.common_pause'), value: -1 },
    {
      label:
        lang === 'zh_CN'
          ? '15' + t('business.common_second')
          : '15' + ' ' + t('business.common_second'),
      value: 15000,
    },
    {
      label:
        lang === 'zh_CN'
          ? '30' + t('business.common_second')
          : '30' + ' ' + t('business.common_second'),
      value: 30000,
    },
    {
      label:
        lang === 'zh_CN'
          ? '60' + t('business.common_second')
          : '60' + ' ' + t('business.common_second'),
      value: 60000,
    },
  ];
  const ty = ref();
  const lottery_id = ref();
  const FORM_SIZE = useFormSetting().getFormSize;
  const reloadTime = ref<number>(RELOAD_OPTIONS[0].value);
  const sum = ref(false);
  const smallSum = ref({});
  const dateGroupButtonList = [
    { label: t('table.member.member_today'), value: 'days' },
    { label: t('modalForm.common.yesterday'), value: 'yesterday' },
    { label: t('business.common_week'), value: 'week' },
    { label: t('business.common_month'), value: 'month' },
  ];
  const cpGroupButtonList = ref({
    ty: [],
    lotteries: [],
  });
  const [registerTable, { getForm, getRawDataSource, reload }] = useTable({
    api: getLotteryReportIssue,
    useSearchForm: true,
    columns: columns,
    bordered: true,
    immediate: false,
    showIndexColumn: false,
    beforeFetch: async (params) => {
      if (!cpGroupButtonList.value.ty?.length) {
        await systemStore.getLotteryTyList().then(async (res) => {
          cpGroupButtonList.value = res;
          ty.value = cpGroupButtonList.value.ty[0].ty;
          lottery_id.value = cpGroupButtonList.value.lotteries[ty.value][0].lottery_id;
        });
      }
      params.lottery_id = lottery_id.value;
      params.start_time = dayjs(params.time[0]).format('YYYY-MM-DD');
      params.end_time = dayjs(params.time[1]).format('YYYY-MM-DD');
      params[params.search_type] = params.search_value;
      delete params.search_type;
      delete params.search_value;
      delete params.time;
    },
    afterFetch: async (data) => {
      const res = getRawDataSource();
      if (res?.c?.length) {
        smallSum.value = res.c[0];
        sum.value = true;
      } else {
        sum.value = false;
        smallSum.value = {};
      }
    },
    formConfig: {
      schemas: searchForm,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-col ml-10px',
        span: 18,
        style: 'flex:none;width:auto',
      },
    },
  });

  const router = useRouter();

  function handlesModal(record) {}

  const { startInterval, stopInterval } = useInterval(reload);

  function handleReloadTimeChange(time: number): void {
    if (time !== -1) {
      startInterval(time);
    } else {
      stopInterval();
    }
  }

  onDeactivated(() => stopInterval());

  onActivated(() => {
    startInterval(reloadTime.value);
  });

  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }

  function changeButtonCp(type?) {
    if (type) {
      lottery_id.value = cpGroupButtonList.value.lotteries[ty.value][0].lottery_id;
    }
    reload();
  }

  const [registerOperateEvent, { openModal }] = useModal();
  const [registerBettingDetails, { openModal: openBettingDetails }] = useModal();

  function openDetailsBetting(data) {
    openBettingDetails(true, data);
  }

  function openDetailModal(data) {
    openModal(true, data);
  }

  onMounted(async () => {
    // openDetailsBetting({ id: 111 });
    nextTick(async () => {
      await getForm().setFieldsValue({ module: null });
    });
  });
</script>
<style lang="less" scoped>
  ::v-deep(.select-value-input),
  ::v-deep(.ant-btn) {
    height: 40px !important;
  }

  .lottery-number-btns {
    position: absolute;
    top: 60px;
    left: 20px;
  }

  ::v-deep(.ant-form),
  ::v-deep(.ant-table-wrapper) {
    padding: 0;
  }

  ::v-deep(.ant-col) {
    &.action-btn-box > div {
      position: relative;
      width: auto !important;
      float: left;
      left: 10px !important;

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
