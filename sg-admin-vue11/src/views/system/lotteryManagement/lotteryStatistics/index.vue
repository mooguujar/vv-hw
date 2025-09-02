<template>
  <div>
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
              {{ t('table.promotion.promotion_affect_bet') }}
              <cdBlockCurrency :id="currency_id" label="ALL" class="ml-5px" />
            </div>
          </template>
          <template #net_amount="{ column, record }">
            <div class="flex justify-center align-center">
              {{ t('table.report.report_platform_amount') }}
              <cdBlockCurrency :id="currency_id" label="ALL" class="ml-5px" />
            </div>
          </template>
          <template #fee="{ column, record }">
            <div class="flex justify-center align-center">
              {{ t('common.extract_amount') }}
              <cdBlockCurrency :id="currency_id" label="ALL" class="ml-5px" />
            </div>
          </template>
          <template #summary>
            <TableSummary v-if="sum">
              <TableSummaryRow>
                <TableSummaryCell align="center" :index="0"
                  >{{ t('business.common_total') }}
                </TableSummaryCell>
                <TableSummaryCell align="center" :index="1"
                  >{{ smallSum.bet_num }}
                </TableSummaryCell>
                <TableSummaryCell align="center" :index="2"
                  >{{
                    smallSum.valid_bet_cnt
                      ? +smallSum.valid_bet_cnt + t('component.unit.people')
                      : '-'
                  }}
                </TableSummaryCell>
                <TableSummaryCell align="center" :index="3"
                  >{{ smallSum.valid_bet_amount }}
                </TableSummaryCell>
                <TableSummaryCell
                  align="center"
                  :index="4"
                  :class="smallSum.net_amount > 0 ? 'text-#D9001B' : 'text-#63A103'"
                  >{{ smallSum.net_amount }}
                </TableSummaryCell>
                <TableSummaryCell
                  align="center"
                  :index="5"
                  :class="smallSum.profit_rate > 0 ? 'text-#D9001B' : 'text-#63A103'"
                  >{{ smallSum.profit_rate }}
                </TableSummaryCell>
                <TableSummaryCell align="center" :index="6">{{ smallSum.fee }} </TableSummaryCell>
              </TableSummaryRow>
            </TableSummary>
          </template>
          <template #customTableHeader>
            <RadioGroup
              button-style="solid"
              v-model:value="ty"
              :size="FORM_SIZE"
              style="margin-bottom: 10px"
              @change="reload"
            >
              <RadioButton v-for="(item, index) in cpGroupButtonList" :value="item.ty" :key="index">
                {{ item.name }}
              </RadioButton>
            </RadioGroup>
          </template>
          <template #tableTitle>
            <cdButtonCurrency
              :btn-list="cpGroupButtonListCurrency"
              @change-button-currency="reload"
              v-model="currency_id"
              class="!mb--5px"
            />
          </template>
        </BasicTable>
      </div>
    </PageWrapper>
  </div>
</template>
<script lang="ts" setup>
  import { ref, nextTick, onMounted, onDeactivated, onActivated } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { columns, schemasForm } from './index.data';
  import { useTable, BasicTable, TableAction } from '/@/components/Table';
  import { getLotteryReportList } from '@/api/sys';
  import { setDateParmas, setStartformatDate, setEndformatDate } from '/@/utils/dateUtil';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import {
    Button,
    RadioButton,
    RadioGroup,
    Select,
    TableSummary,
    TableSummaryCell,
    TableSummaryRow,
  } from 'ant-design-vue';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { useRouter } from 'vue-router';
  import { useLocale } from '@/locales/useLocale';
  import { DateButtonGroup } from '@/components/DateButtonGroup';
  import { useScrollerHeight } from '@/hooks/web/useScrollHeight';
  import { tabHeight410 } from '@/views/common/component';
  import { useSystemStore } from '/@/store/modules/system';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import dayjs from 'dayjs';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

  const { t } = useI18n();
  const systemStore = useSystemStore();
  const scrollHeight = Number(useScrollerHeight(tabHeight410).value);
  const lang = useLocale().getLocale.value;
  const unixRang = ref<Array<number>>([]);
  const sum = ref();
  const smallSum = ref();
  const ty = ref('');
  const currency_id = ref('');
  const initLoadSearch = ref(true);
  const FORM_SIZE = useFormSetting().getFormSize;
  const { currencyTreeList } = useTreeListStore();
  const dateGroupButtonList = [
    { label: t('table.member.member_today'), value: 'days' },
    { label: t('modalForm.common.yesterday'), value: 'yesterday' },
    { label: t('business.common_week'), value: 'week' },
    { label: t('business.common_month'), value: 'month' },
  ];
  const cpGroupButtonListCurrency = ref([]);
  const cpGroupButtonList = ref([{ name: t('common.All_class'), ty: '' }]);

  systemStore.getLotteryTyList().then((res) => {
    cpGroupButtonList.value = cpGroupButtonList.value.concat(res.ty);
  });
  const [registerTable, { getForm, getRawDataSource, reload }] = useTable({
    api: getLotteryReportList,
    useSearchForm: true,
    columns: columns,
    bordered: true,
    immediate: false,
    showIndexColumn: false,
    beforeFetch: (params) => {
      if (params?.time?.length > 0) {
        params.start_time = dayjs(params.time[0]).format('YYYY-MM-DD');
        params.end_time = dayjs(params.time[1]).format('YYYY-MM-DD');
      }

      params.sort_key = params.field;
      params.sort_type = params.order ? params.order.replace('end', '') : '';
      params = {
        ...params,
        ty: ty.value,
        currency_id: currency_id.value,
      };
      delete params.time;
      delete params.field;
      delete params.order;
      return params;
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
      //
      if (initLoadSearch.value) {
        const validCurrencyList = currencyTreeList.filter((item) => res.n.includes(item.id));
        cpGroupButtonListCurrency.value = [
          { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
          ...validCurrencyList,
        ];
        initLoadSearch.value = false;
      }
    },
    formConfig: {
      schemas: schemasForm,
      showAdvancedButton: false,
      showSubmitButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-col ml-10px',
        span: 18,
        style: 'flex:none;width:auto',
      },
    },
  });

  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }

  onMounted(async () => {
    nextTick(async () => {
      await getForm().setFieldsValue({ module: null });
    });
  });
</script>
<style lang="less" scoped>
  ::v-deep(.select-value-input) {
    position: absolute;
    height: 40px !important;
    margin-right: 10px;
    border-left: none !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;

    span {
      border-left: none !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
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
</style>
