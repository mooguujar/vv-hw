<template>
  <div></div>
  <BasicTable @register="registerTable">
    <!-- 表单时间 -->
    <template #form-commissionSummary>
      <DateButtonGroup
        :isSelect="isSelect"
        isEndToday
        @change-button-day="changeButtonDay"
        :dateGroupButtonList="dateGroupButtonList"
      />
    </template>
    <!-- 表单代理账号 -->
    <template #form-usernameSlot>
      <a-input-group style="display: flex; width: 350px" class="t-form-label-com">
        <Select :dropdownMatchSelectWidth="false" v-model:value="userType">
          <!--代理账号-->
          <SelectOption value="username">
            {{ $t('table.member.member_agent_account') }}
          </SelectOption>
          <!--操作人员-->
          <SelectOption value="operator_name">
            {{ $t('table.risk.report_operate_people') }}
          </SelectOption>
        </Select>
        <Input
          class="mr-5"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>
    <!-- 列表代理账号 -->
    <template #usernameSlot="{ record }">
      <Button @click="linkDetails(record)" type="link">
        {{ record.username }}
      </Button>
    </template>
    <!-- 表单币种 -->
    <template #tableTitle v-if="dataCurrency.length > 1">
      <cdButtonCurrency
        :btn-list="currentList"
        :showwhitebg="false"
        @change-button-currency="changeClick"
        v-model="currency_id"
        class="cdButtonCurrency"
        innerClass="mr-10px"
      />
    </template>
    <!-- 汇总 -->
    <template #summary>
      <TableSummary>
        <TableSummaryRow v-if="subList && subList?.length">
          <TableSummaryCell class="text-center" :index="0">
            {{ $t('business.common_total') }}
          </TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">
            <cdIconCurrency :icon="currentyOptions[subList[0].currency_id]" class="w-20px" />
            {{ currentyOptions[subList[0].currency_id] }}
          </TableSummaryCell>
          <TableSummaryCell style="color: #f59b28" class="text-center"
            >{{ subList[0].commission_amount_total }}
          </TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
        </TableSummaryRow>
      </TableSummary>
    </template>
    <!-- 发放佣金 -->
    <template #commissionSlots="{ record }">
      <span style="color: #f59b28" class="cursor-pointer" @click="detailHandle(record)">{{
        record.commission_amount_total
      }}</span>
    </template>
    <!-- 列表币种 -->
    <template #currency_id="{ record }">
      <div v-if="record.currency_id">
        <cdIconCurrency :icon="currentyOptions[record.currency_id]" class="w-20px" />
        {{ currentyOptions[record.currency_id] }}
      </div>
    </template>
  </BasicTable>
  <SendCommissionModal @register="registerSend" />
</template>
<script lang="ts" setup name="CommissionRecord">
  import { ref, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchForm, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import SendCommissionModal from '../../common/components/SendCommissionModal.vue';
  import { useRouter } from 'vue-router';
  import {
    Select,
    Input,
    SelectOption,
    Button,
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getRecordList, exportCommissionRecords } from '/@/api/commission/index';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useTreeListStore } from '@/store/modules/treeList';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { useModal } from '/@/components/Modal';
  import { isHasAuth } from '/@/utils/authFunction';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();
  dateGroupButtonList[0].label = t('table.member.member_today'); //今日
  dateGroupButtonList[1].label = t('table.member.member_week'); //本周
  dateGroupButtonList[2].label = t('table.member.member_month'); //本月
  const userType = ref('username' as string);
  const isSelect = ref('month' as string);
  const currency_id = ref('' as string);
  const fromSearch = ref('' as any);
  const subList = ref([] as any);
  const { exportFile } = useExportFile();
  // 币种列表
  const dataCurrency = ref([] as any);
  const router = useRouter();
  const { currencyTreeList } = useTreeListStore();
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  const [registerTable, { reload, getForm, getRawDataSource, getPaginationRef }] = useTable({
    api: getRecordList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com action-btn-box',
      },
      submitButtonOptions: {
        text: t('business.common_inquire'), //查询
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      showResetButton: isHasAuth('70323'),
      resetFunc: handleExportTableList,
    },
    afterFetch: async (response) => {
      const data = await getRawDataSource();
      dataCurrency.value = data.n || [];
      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
      ].concat(currencyTreeList.filter((item) => dataCurrency.value.includes(item.id)));
      subList.value = data.c;
      response = response.sort(function (a, b) {
        if (b.send_time && a.send_time) {
          return Number(new Date(b.send_time)) - Number(new Date(a.send_time as number));
        } else {
          return 0;
        }
      });
      return response;
    },
    beforeFetch: (param) => {
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      param['currency_id'] = currency_id.value;
      if (fromSearch.value) {
        param[userType.value] = fromSearch.value;
      }
      return param;
    },
  });
  // 发放佣金弹窗
  const [registerSend, { openModal }] = useModal();

  // 币种切换
  function changeClick(v) {
    reload();
    currency_id.value = v;
  }

  // 发放佣金弹窗事件
  function detailHandle(v) {
    openModal(true, { data: v });
  }

  // 列表代理账号
  function linkDetails(record) {
    router.push({ name: 'RecordDetails', state: { username: record.username } });
  }

  // 时间切换
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }

  // 导出
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const data = await getPaginationRef();
      const param = await validate();
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      if (fromSearch.value) {
        param[userType.value] = fromSearch.value;
      }
      param['is_export'] = 1;
      param['page'] = data?.current;
      param['page_size'] = data?.pageSize;
      param['currency_id'] = currency_id.value;
      await exportFile(
        exportCommissionRecords,
        param,
        t('table.system.system_export_commission_details'),
      );
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-col) {
    &.action-btn-box > div {
      position: relative;
      width: auto !important;
      float: left;

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

  ::v-deep(.time-type-sty) {
    .ant-select-selector {
      display: inline-block;
      width: 120px;
      height: 40px;
      line-height: 40px;
    }

    .ant-picker-input > input:focus,
    .ant-picker-input > input-focused,
    .ant-picker,
    .ant-input,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused,
    .ant-input-affix-wrapper:hover {
      border: 0 !important;
      box-shadow: none !important;
    }
  }
</style>
