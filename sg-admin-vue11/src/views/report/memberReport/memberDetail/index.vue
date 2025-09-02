<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable">
      <template #form-dataSlot>
        <div class="flex">
          <!-- <Button type="primary" @click="backLastPage" class="mr-2">{{ t('common.back') }}</Button> -->
          <BasicButton
            type="primary"
            :iconSize="20"
            @click="backLastPage"
            class="mr-2"
            preIcon="RectBack:svg"
          >
            {{ t('common.back') }}
          </BasicButton>
          <DateButtonGroup
            :isSelect="isSelect"
            :dateGroupButtonList="dateGroupButtonList"
            @change-button-day="changeButtonDay"
          />
        </div>
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
      <template #validBet="{ record }">
        <ReloadTooltip
          :record="record"
          :currency_id="currency_id"
          :timeRange="{ end_time: model.end_time, start_time: model.start_time }"
          :type="'valid_bet_amount'"
        />
      </template>
      <template #realValidBet="{ record }">
        <ReloadTooltip
          :record="record"
          :currency_id="currency_id"
          :timeRange="{ end_time: model.end_time, start_time: model.start_time }"
          :type="'real_valid_bet_amount'"
        />
      </template>
      <template #netAmount="{ record }">
        <ReloadTooltip
          :record="record"
          :currency_id="currency_id"
          :timeRange="{ end_time: model.end_time, start_time: model.start_time }"
          :type="'net_amount'"
        />
      </template>
      <template #depositAmount="{ record }">
        <Tooltip
          v-if="record.tip.deposit_count !== 0"
          placement="rightTop"
          overlayClassName="ad-tooltip"
        >
          <template #title>
            <div class="flex flex-col">
              <div class="flex flex-row">
                <div class="py-2 pl-5 whitespace-nowrap"> {{ t('table.report.save_days') }}： </div>
                <div class="py-2 pr-5 whitespace-nowrap"> {{ record.tip.deposit_days }} </div>
              </div>
              <div class="flex flex-row">
                <div class="py-2 pl-5 whitespace-nowrap"> {{ t('table.report.save_time') }}： </div>
                <div class="py-2 pr-5 whitespace-nowrap"> {{ record.tip.deposit_count }} </div>
              </div>
            </div>
          </template>
          <div>{{ record.deposit_amount }}</div>
        </Tooltip>
        <div v-else>{{ record.deposit_amount }}</div>
      </template>

      <template #giftAmount="{ record }">
        <Tooltip placement="rightTop" overlayClassName="ad-tooltip">
          <div>{{ record.gift_amount }}</div>
        </Tooltip>
      </template>

      <template #withdrawAmount="{ record }">
        <Tooltip
          v-if="record.tip.withdraw_count !== 0"
          placement="rightTop"
          overlayClassName="ad-tooltip"
        >
          <template #title>
            <div class="flex flex-col">
              <div class="flex flex-row">
                <div class="py-2 pl-5 whitespace-nowrap">
                  {{ $t('table.member.member_withdraw_count') }}：
                </div>
                <div class="py-2 pr-5 whitespace-nowrap"> {{ record.tip.withdraw_count }} </div>
              </div>
            </div>
          </template>
          <div>{{ record.withdraw_amount }}</div>
        </Tooltip>
        <div v-else>{{ record.withdraw_amount }}</div>
      </template>
      <template #summary>
        <TableSummary v-if="summaryList">
          <TableSummaryRow>
            <TableSummaryCell class="text-center !text-sm" :index="0">{{
              $t('business.common_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="1">-</TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="2">
              <EllipisisTooltip
                :title="summaryList?.bet_amount"
                :content="summaryList?.bet_amount"
                :maxLength="16"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="3">
              <EllipisisTooltip
                :title="summaryList?.valid_bet_amount"
                :content="summaryList?.valid_bet_amount"
                :maxLength="16"
                :style="[
                  summaryList.valid_bet_amount > 0 ? { color: 'red' } : { color: '#1cd91c' },
                ]"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="4">
              <EllipisisTooltip
                :title="summaryList?.real_valid_bet_amount"
                :content="summaryList?.real_valid_bet_amount"
                :maxLength="16"
                :style="[
                  summaryList.real_valid_bet_amount > 0 ? { color: 'red' } : { color: '#1cd91c' },
                ]"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="5">
              <EllipisisTooltip
                :title="summaryList?.net_amount"
                :content="summaryList?.net_amount"
                :maxLength="16"
                :style="[summaryList.net_amount > 0 ? { color: 'red' } : { color: '#1cd91c' }]"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="6">
              <EllipisisTooltip
                :title="summaryList?.gift_amount"
                :content="summaryList?.gift_amount"
                :maxLength="16"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="7">
              <EllipisisTooltip
                :title="summaryList?.commission_amount"
                :content="summaryList?.commission_amount"
                :maxLength="16"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="8">
              <EllipisisTooltip
                :title="summaryList?.deposit_amount"
                :content="summaryList?.deposit_amount"
                :maxLength="16"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="9">
              <EllipisisTooltip
                :title="summaryList?.withdraw_amount"
                :content="summaryList?.withdraw_amount"
                :maxLength="16"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="10">
              <EllipisisTooltip
                :title="summaryList?.cash_profit"
                :content="summaryList?.cash_profit"
                :maxLength="16"
                :style="[summaryList.cash_profit > 0 ? { color: 'red' } : { color: '#1cd91c' }]"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="11">
              <EllipisisTooltip
                :title="summaryList?.cash_profit_rate + '%'"
                :content="summaryList?.cash_profit_rate + '%'"
                :maxLength="16"
                :style="[
                  summaryList.cash_profit_rate > 0 ? { color: 'red' } : { color: '#1cd91c' },
                ]"
              />
            </TableSummaryCell>
            <TableSummaryCell class="text-center !text-sm" :index="12">
              <EllipisisTooltip
                :title="summaryList?.bet_multiplier"
                :content="summaryList?.bet_multiplier"
                :maxLength="16"
              />
            </TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { Tooltip, Button, TableSummary, TableSummaryRow, TableSummaryCell } from 'ant-design-vue';
  import { postReportMemberSingle } from '/@/api/report/index';
  import { useRouter } from 'vue-router';
  import ReloadTooltip from '../components/ReloadTooltip.vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { PageWrapper } from '/@/components/Page';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { cloneDeep } from 'lodash-es';
  import EllipisisTooltip from '/@/components-cd/tooltip/EllipisisTooltip.vue';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';

  const { t } = useI18n();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const $router = useRouter();
  const currency_id = ref('' as string);
  const isSelect = ref('' as string);
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  const sortKey = ref('' as any);
  const sortType = ref('' as any);
  const usernameID = ref('');
  const isLock = ref(false);
  const summaryList = ref();
  const { currencyTreeList } = useTreeListStore();
  const [registerTable, { reload, getForm, getRawDataSource }] = useTable({
    api: async (data) => {
      const res = await postReportMemberSingle(data);
      if (res.c) {
        summaryList.value = res.c[0];
      }
      const list = cloneDeep(res);
      delete list.n;
      delete list.c;
      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
      ].concat(currencyTreeList.filter((item) => res.n.includes(item.id)));
      return list;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    immediate: false,
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
      showResetButton: false, //导出按钮隐藏
    },
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
    params['currency_id'] = currency_id.value;
    params['sort_key'] = sortKey.value ? sortKey.value : 'valid_bet_amount';
    params['sort_type'] = sortType.value ? sortType.value : 'desc';
    params['uid'] = usernameID.value;
    return params;
  }

  let { uid, currencyId, isSelect_, start_time, end_time } = history.state;

  function changeButtonDay(value) {
    nextTick(async () => {
      model.value.start_time = value[0];
      model.value.end_time = value[1];

      // await getForm().setFieldsValue({ start_time: value[0] });
      // await getForm().setFieldsValue({ end_time: value[1] });

      if (isLock.value) await getForm().setFieldsValue({ time: [value[0], value[1]] });
      isLock.value = true;
      reload();
    });
  }
  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
  function backLastPage() {
    $router.back();
  }
  model.value.start_time = start_time;
  model.value.end_time = end_time;
  if (currencyId) {
    currency_id.value = currencyId;
  }
  if (isSelect_) {
    isSelect.value = isSelect_;
  }
  onMounted(async () => {
    // setTimeout(async () => {
    const { setFieldsValue, getFieldsValue } = getForm();
    if (uid) {
      usernameID.value = uid;
      await setFieldsValue({ time: [start_time, end_time] });
      nextTick(() => {
        reload();
      });
    }
    // }, 500);
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
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
      width: 88px;
      border-left-width: 1px solid #d9d9d9;
      border-left-width: 1px;
      text-align: center;
    }
  }
</style>
