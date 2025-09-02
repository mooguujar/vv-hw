<template>
  <BasicTable
    @register="registerTable"
    @fetch-success="changeSuccess"
    :scroll="{ x: 'max-content' }"
  >
    <!--一键发放-->
    <template #form-commissionSummary>
      <div class="flex justify-center">
        <Button
          type="primary"
          @click="schemaClick('issueAll', null)"
          v-if="commissionState === 1 && isHasAuth('70319')"
          class="mr-10px"
          >{{ $t('table.system.system_click_delivery') }}</Button
        >
        <DateButtonGroup
          :isSelect="isSelect"
          isEndToday
          :dateGroupButtonList="dateGroupButtonList"
          @change-button-day="changeButtonDay"
        />
      </div>
    </template>
    <!--代理账号-->
    <template #form-usernameSlot>
      <a-input-group compact style="display: flex; width: 320px" class="t-form-label-com">
        <Select style="width: 50%" v-model:value="currentType">
          <!--代理账号-->
          <SelectOption value="username">
            {{ $t('table.member.member_agent_account') }}
          </SelectOption>
          <!--上级代理-->
          <SelectOption value="parent_name">
            {{ $t('business.common_super_agent') }}
          </SelectOption>
          <SelectOption value="agency"> {{ t('business.current_8') }} </SelectOption>
        </Select>
        <Input
          style="width: 50%; margin-right: 10px"
          allowClear
          :placeholder="$t('common.inputText')"
          v-model:value="fromSearch"
        />
      </a-input-group>
    </template>
    <!--币种-->
    <template #headerTop v-if="dataCurrency.length > 1">
      <cdButtonCurrency
        :btn-list="currentList"
        :showwhitebg="false"
        @change-button-currency="changeClick"
        v-model="currency_id"
        class="cdButtonCurrency"
        :innerClass="'t-form-label-com'"
      />
    </template>
    <!--状态-->
    <template #tableTitle>
      <RadioGroup
        class="t-form-label-com"
        v-model:value="commissionState"
        button-style="solid"
        @change="handleState"
      >
        <RadioButton :value="1">{{ t('table.system.system_commission_open') }}</RadioButton>
        <RadioButton :value="2">{{ t('table.system.system_commission_close') }}</RadioButton>
      </RadioGroup>
    </template>
    <!--操作-->
    <template #action="{ record }">
      <TableAction
        :actions="[
          {
            label: $t('table.system.system_delivery'), //发放，开启
            onClick: handleIssueOne.bind(
              null,
              'issueOne',
              record,
              t('common.commission_issue_one_confirm'),
            ),
            ifShow: isHasAuth('70319'),
          },
          {
            label:
              record.state == 1
                ? $t('table.member.member_locked_')
                : t('table.member.member_open_locked'), //锁定，停用
            color: record.state == '1' ? 'error' : '',
            ifShow: isHasAuth('70320'),
            onClick: showConfirm.bind(
              null,
              record,
              'del',
              record.state == 1
                ? t('table.member.member_locked_') + $t('table.system.system_after_locked_agent') //锁定后一键发放将会跳过该代理，您确定要锁定该代理吗？,
                : $t('table.system.system_unlocked'), // 您确定要解锁该代理吗？
            ),
          },
        ]"
      />
    </template>
    <!--时间-->
    <template #system_time="{ record }">
      {{ toTimezone(record.start_time, 'YYYY-MM-DD') }} ~
      {{ toTimezone(record.end_time, 'YYYY-MM-DD') }}
    </template>
    <!-- 汇总 -->
    <template #summary>
      <TableSummary>
        <TableSummaryRow v-if="subList && subList?.length">
          <TableSummaryCell class="text-center" :index="0">{{
            $t('business.common_total')
          }}</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
          <TableSummaryCell class="text-center">{{
            currentyOptions[subList[0].currency_id]
          }}</TableSummaryCell>
          <TableSummaryCell class="text-center" style="color: #f59b28">
            <cdIconCurrency :icon="currentyOptions[subList[0].currency_id]" class="w-20px mr-5px" />
            {{ subList[0].commission_amount_total }}
          </TableSummaryCell>
          <TableSummaryCell class="text-center">-</TableSummaryCell>
        </TableSummaryRow>
      </TableSummary>
    </template>
    <!--币种-->
    <template #currency_id="{ record }">
      <div v-if="record.currency_id">{{ currentyOptions[record.currency_id] }}</div>
      <div v-if="!record.currency_id"> - </div>
    </template>
    <!-- 结算佣金 -->
    <template #commissionSlots="{ record }">
      <cdIconCurrency :icon="currentyOptions[record.currency_id]" class="w-20px mr-5px" />
      <span style="color: #f59b28" class="cursor-pointer" @click="handleSendModal(record)">
        {{ record.commission_amount_total }}</span
      >
    </template>
  </BasicTable>
  <!-- 一键发放弹窗 -->
  <CommissionIssueAlert
    ref="childComponent"
    @register="registerInfor"
    @diamondsuccess="diamondsuccess"
    :typeid="typeid"
    @reload-page="reload"
  />
  <SendCommissionModal @register="registerSend" />
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchForm, dateGroupButtonList } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import SendCommissionModal from '../../common/components/SendCommissionModal.vue';
  import {
    Select,
    SelectOption,
    Input,
    message,
    RadioGroup,
    RadioButton,
    TableSummary,
    TableSummaryRow,
    TableSummaryCell,
  } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import { useModal } from '/@/components/Modal';
  import { openConfirm } from '/@/utils/confirm';
  import CommissionIssueAlert from '../../common/components/CommissionIssueAlert.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getReviewList,
    updateLockreview,
    updateSendSingleReview,
    exportCommissionReview,
  } from '/@/api/commission/index';
  import {
    toTimezone,
    setDateParmas,
    setEndformatDate,
    setStartformatDate,
  } from '/@/utils/dateUtil';
  import { useTreeListStore } from '@/store/modules/treeList';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { useExportFile } from '/@/utils/helper/paramsHelper';

  const { exportFile } = useExportFile();
  const { t } = useI18n();
  const [registerSend, { openModal: openSendModal }] = useModal();
  // 一键发放弹窗ID
  const typeid = ref('oneKeyIssue' as string);
  // 一键发放弹窗Ref
  const childComponent = ref();
  // 选择的币种
  const currency_id = ref('');
  // 列表
  const subList = ref([] as any);
  // 是否选择
  const isSelect = ref('month' as string);
  // 币种列表
  const dataCurrency = ref([] as any);
  // 当前类型
  const currentType = ref('username' as string);
  // 搜索
  const fromSearch = ref('' as string);
  // 状态
  const commissionState = ref(1 as any);
  // 结果
  const getResult = ref([] as any);
  dateGroupButtonList[0].label = t('table.member.member_today'); //今日
  dateGroupButtonList[1].label = t('table.member.member_week'); //本周
  dateGroupButtonList[2].label = t('table.member.member_month'); //本月

  const { currencyTreeList } = useTreeListStore();
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);

  const [registerTable, { reload, getForm, getRawDataSource, getPaginationRef }] = useTable({
    api: getReviewList,
    columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    beforeFetch: (params) => {
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      params['commission_state'] = commissionState.value;
      params['currency_id'] = currency_id.value;
      if (fromSearch.value) {
        params[currentType.value] = fromSearch.value;
      }
      return params;
    },
    afterFetch: async (val) => {
      getResult.value = val;
      const data = await getRawDataSource();
      dataCurrency.value = data.n || [];
      subList.value = data.c;
      currentList.value = [
        { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
      ].concat(currencyTreeList.filter((item) => dataCurrency.value.includes(item.id)));
    },
    formConfig: {
      labelWidth: 120,
      schemas: searchForm,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com action-btn-box',
      },
      showResetButton: isHasAuth('70316') ? true : false,
      submitButtonOptions: {
        text: t('common.queryText'), //查询
      },
      resetButtonOptions: {
        text: t('common.export'), //导出
      },
      resetFunc: handleExportTableList,
    },
    actionColumn: {
      title: t('business.common_operate'), //操作
      dataIndex: 'action',
      slots: { customRender: 'action' },
      ifShow: () => (commissionState.value === 2 ? false : true && auths(['70320', '70319'])),
    },
  });
  // 一键发放弹窗
  const [registerInfor, { openModal, closeModal }] = useModal();
  // 一键发放成功回调
  function diamondsuccess() {
    reload();
  }
  // 接口成功
  function changeSuccess() {
    closeModal();
    childComponent.value.changeOkLoading(false);
  }
  // 一键发放按钮事件
  async function schemaClick(issueType, records) {
    const values = await getForm().validate();
    if (fromSearch.value) {
      values[currentType.value] = fromSearch.value;
    }
    setDateParmas(values);
    //如果有币种传入币种
    openModal(true, {
      issueType,
      times: values,
      records: records,
      currency: currency_id.value,
    });
  }
  // 导出事件
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      const data = await getPaginationRef();
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      setDateParmas(param);
      param['is_export'] = 1;
      param['page'] = data?.current || 1;
      param['page_size'] = data?.pageSize || 10;
      param['currency_id'] = currency_id.value;
      param['commission_state'] = commissionState.value;
      if (fromSearch.value) {
        param[currentType.value] = fromSearch.value;
      }
      setDateParmas(param);
      await exportFile(
        exportCommissionReview,
        param,
        t('table.system.system_commission_review_details'),
      );
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
  }
  function handleState() {
    reload();
  }
  // 结算佣金弹窗事件
  function handleSendModal(record) {
    openSendModal(true, {
      data: record,
    });
  }
  // 切换时间
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  function changeClick(v) {
    reload();
    currency_id.value = v;
  }
  // 单条记录锁定确认操作
  function showConfirm(record, type, msg) {
    //警告提示
    openConfirm(
      t('common.warning'),
      msg,
      async () => {
        if (type === 'del') {
          const state = record.state === 1 ? 3 : 1;
          const { data, status } = await updateLockreview({ id: record.id, state: state });
          if (status) {
            message.success(data);
            reload();
          } else {
            message.error(data);
          }
        }
      },
      '',
    );
  }
  // 单条记录发放确认操作
  function handleIssueOne(issueType, records, msg) {
    openConfirm(
      t('common.warning'),
      msg,
      async () => {
        const { data, status } = await updateSendSingleReview({ id: records.id });
        if (status) {
          message.success(data);
          reload();
        } else {
          message.error(data);
        }
      },
      '',
    );
  }
</script>
<style lang="less" scoped>
  .tool-tip {
    span {
      color: #f59a23;
    }
  }

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

  ::v-deep(.ant-table-wrapper .ant-table-title) {
    padding: 0 !important;
  }

  ::v-deep(.ant-table-wrapper .ant-table-title > div > div) {
    margin: 0 !important;
  }

  ::v-deep(.ant-table) {
    .cdButtonCurrency {
      margin: 0 !important;
      margin-bottom: 12px !important;
      border: 1px solid #e1e1e1 !important;
      background-color: #fff;
    }
  }

  ::v-deep(.ant-table-container) {
    margin-top: 0 !important;
  }

  ::v-deep(.ant-radio-group) {
    margin-bottom: 12px;
  }
</style>
