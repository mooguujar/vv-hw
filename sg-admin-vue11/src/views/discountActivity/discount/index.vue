<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable">
      <template #form-currentType>
        <FormItemRest>
          <InputGroup class="!flex" compact>
            <Select style="width: 38%" v-model:value="currentType" class="br-none">
              <SelectOption :value="'username'">{{
                $t('business.common_member_account')
              }}</SelectOption>
              <SelectOption :value="'bill_no'">
                {{ $t('table.discountActivity.discount_order') }}
              </SelectOption>
              <SelectOption :value="'review_name'">
                {{ $t('table.risk.report_operate_people') }}
              </SelectOption>
            </Select>
            <Input
              style="width: 59%"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </FormItemRest>
      </template>
      <template #form-grupButton>
        <DateButtonGroup
          :isSelect="isSelect"
          isEndToday
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
        />
      </template>
      <template #tableTitle>
        <div class="w-full">
          <cdButtonCurrency
            :btn-list="currentList"
            :showwhitebg="true"
            @change-button-currency="changeClick"
            v-model="currency_id"
          />
        </div>
      </template>
      <template #action="{ record, model, field }">
        <span
          :class="[record.is_self != 1 && record.user_type !== 0 ? 'primary-color cursor' : '']"
          @click="searchParentNameFun(record)"
          >{{ record.username }}
        </span>
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          :allow-clear="false"
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          :allow-clear="false"
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #summary>
        <TableSummary v-if="totalLists && initShow" fixed>
          <TableSummaryRow>
            <TableSummaryCell class="text-center" :index="0">{{
              $t('business.common_sub_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="1"
              >{{ (totalList && totalList.user_type) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="2"
              >{{ (totalList && totalList.reg_user_count) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="3">
              <cdBlockCurrency :currencyName="currentyOptions[currency_id] || FinancegetCurrency" />
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="4"
              >{{ (totalList && totalList.valid_bet_amount) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :index="5"
              :class="[totalList && totalList.net_amount > 0 ? 'text-red' : 'text-green']"
              >{{ (totalList && totalList && totalList && totalList.net_amount) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="7">{{ subCountTotal }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="6">{{
              (totalList && totalList.report_commission_amount) || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="8"
              >{{ (totalList && totalList.report_team_profit) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="5"
              >{{ (totalList && totalList.deposit_amount) || '-' }}
            </TableSummaryCell>
          </TableSummaryRow>
          <TableSummaryRow>
            <TableSummaryCell class="text-center" :index="0">{{
              $t('business.common_total')
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="1"
              >{{ (totalList && totalList.user_type) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="2"
              >{{ (totalList && totalList.reg_user_count) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="3">
              <cdBlockCurrency :currencyName="currentyOptions[currency_id] || FinancegetCurrency" />
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="4"
              >{{ (totalList && totalList.valid_bet_amount) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell
              class="text-center"
              :index="5"
              :class="[totalList && totalList.net_amount > 0 ? 'text-red' : 'text-green']"
              >{{ (totalList && totalList.net_amount) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="7">{{ countTotal }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="6">{{
              (totalList && totalList.report_commission_amount) || '-'
            }}</TableSummaryCell>
            <TableSummaryCell class="text-center" :index="8"
              >{{ (totalList && totalList.report_team_profit) || '-' }}
            </TableSummaryCell>
            <TableSummaryCell class="text-center" :index="5"
              >{{ (totalList && totalList.deposit_amount) || '-' }}
            </TableSummaryCell>
          </TableSummaryRow>
        </TableSummary>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, computed, nextTick, onMounted, onBeforeMount } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import {
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
    DatePicker,
    FormItemRest,
    Select,
    SelectOption,
    Input,
    InputGroup,
  } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { setDateParmas, setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { getbonusList } from '/@/api/activity';
  import { getRate } from '../../common/common';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
  const { t } = useI18n();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const parentNameList = ref(['首页代理'] as any);

  /** 货币符号及ID */
  const { FinancegetCurrency, currencyId } = getRate();

  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const fromSearch = ref('' as string);
  const currentType = ref('username' as string);
  const subCountTotal = ref('' as string);
  const countTotal = ref('' as string);
  const totalList = ref([] as any);
  const totalLists = ref([] as any);
  const isSelect = ref('days' as string);
  const currency_id = ref('' as any);
  const { currencyTreeList } = useTreeListStore();
  const getRowCurrentList = ref([] as any);
  const initShow = ref(false);
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
    ...currencyTreeList,
  ] as any);
  const [registerTable, { reload, getForm, getColumns, getRawDataSource }] = useTable({
    api: async (data) => {
      try {
        const response = await getbonusList(data);
        data = response;
        getRowCurrentList.value = data.n;
        if (data.n && !currency_id.value) {
          currentList.value = [
            { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
          ].concat(currencyTreeList.filter((item) => data.n.includes(item.id)));
        }
        totalLists.value = response.d;
        subCountTotal.value = response.sub_total_amount;
        countTotal.value = response.total_amount;
        return response.d;
      } catch (error) {
        return [];
      }
    },
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
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
    resizeHeightOffset: 40,
    beforeFetch: (params) => {
      params['currency_id'] = currency_id.value;
      params[currentType.value] = fromSearch.value;
      params['to_cur'] = !currency_id.value ? currencyId : currency_id.value;
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;

      setDateParmas(params);

      return params;
    },
    afterFetch: (response) => {
      const actingList = response.filter((item) => {
        if (item.user_type == 0) {
          totalList.value = item;
        } else {
          return true;
        }
      });
      initShow.value = true;
      return actingList;
    },
  });
  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
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
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
      //await getForm().setFieldsValue({ end_time: value[1] });
    });
  }
  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
  async function searchParentNameFun(record) {
    if (record.is_self != 1 && record.user_type !== 0) {
      parentNameList.value.push(record.username);
      await getForm().setFieldsValue({ username: '' });
      reload();
    }
  }
  onMounted(async () => {
    nextTick(async () => {
      //await getForm().setFieldsValue({start_time: history.state['0'], end_time: history.state['1']  })
    });
  });
  onMounted(async () => {
    if (route.query.start) {
      setTimeout(() => {
        getForm().setFieldsValue({
          start_time: dayjs(dayjs.unix(route.query.start).format('YYYY-MM-DD HH:mm:ss')),
          end_time: dayjs(dayjs.unix(route.query.end).format('YYYY-MM-DD HH:mm:ss')),
        });
      }, 0);

      reload();
    }
    // await getForm().setFieldsValue({time: [history.state['0'], history.state['1']]  })
  });
  onBeforeMount(() => {
    initShow.value = false;
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
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
</style>
