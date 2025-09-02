<template>
  <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable">
    <DateButtonGroup
      class="absolute h-0"
      :isSelect="'days'"
      @change-button-day="changeButtonDay"
      :dateGroupButtonList="[]"
    />
    <BasicTable
      @register="registerTable"
      @columns-change="handleColumnChange"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #username="{ record }">
        <span
          v-if="
            (apiMap.title == $t('table.report.report_currency_withdraw_list') &&
              isHasAuth('20508')) ||
            (apiMap.title == $t('table.report.report_online_withdrawal_list') && isHasAuth('20408'))
          "
          class="cursor-pointer text-blue"
          @click="openDamaDetailModal(true, { uid: record.uid, username: record.username })"
        >
          {{ record.username }}
        </span>
        <span v-else>
          {{ record.username }}
        </span>
      </template>
      <template #form-reloadTime>
        <a-select
          v-model:value="reloadTime"
          :options="RELOAD_TIME_OPTIONS"
          @change="handleReloadTimeChange"
        />
      </template>
      <template #form-startDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <a-date-picker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #action="{ record }">
        <div>
          <div>
            <Space
              v-if="
                apiMap.AUDIT_TYPE == 2 &&
                (record.state == 1 || record.state == 2 || record.state == 6)
              "
            >
              <span
                v-if="
                  (apiMap.title == $t('table.report.report_company_deposit_list') &&
                    isHasAuth('20204')) ||
                  (apiMap.title == $t('table.report.report_currency_deposit_list') &&
                    isHasAuth('20304')) ||
                  (apiMap.title == $t('table.report.report_currency_withdraw_list') &&
                    isHasAuth('20508')) ||
                  (apiMap.title == $t('table.report.report_online_withdrawal_list') &&
                    isHasAuth('20408'))
                "
                class="primary-color cursor"
                @click="handleDetail(record, 'detail')"
                >{{ $t('business.common_detail') }}</span
              >
              <Space v-else> - </Space>
            </Space>
            <Space v-else-if="apiMap.AUDIT_TYPE == 1 && record.state == 5">
              <!-- {{ apiMap.title  + isHasAuth('20503') }} -->
              <Button
                type="primary"
                v-if="
                  (apiMap.title == $t('table.report.report_company_deposit_list') &&
                    isHasAuth('20203')) ||
                  (apiMap.title == $t('table.report.report_currency_deposit_list') &&
                    isHasAuth('20303')) ||
                  (apiMap.title == $t('table.report.report_currency_withdraw_list') &&
                    isHasAuth('20504')) ||
                  (apiMap.title == $t('table.report.report_online_withdrawal_list') &&
                    isHasAuth('20404'))
                "
                :disabled="
                  (apiMap.title == $t('table.report.report_company_deposit_list') &&
                    !isHasAuth('20204')) ||
                  (apiMap.title == $t('table.report.report_currency_deposit_list') &&
                    !isHasAuth('20304')) ||
                  (apiMap.title == $t('table.report.report_currency_withdraw_list') &&
                    !isHasAuth('20504')) ||
                  (apiMap.title == $t('table.report.report_online_withdrawal_list') &&
                    !isHasAuth('20404'))
                "
                @click="handleAuditRecharge(record)"
                >{{ auditData[apiMap.AUDIT_TYPE] }}</Button
              >
              <Space v-else> - </Space>
            </Space>
            <Space v-else-if="apiMap.AUDIT_TYPE == 2 && record.state == 5">
              <span v-if="apiMap.FINANCE_TYPE == 'online_withdrawal'">
                <Button
                  type="primary"
                  v-if="isHasAuth('20409')"
                  @click="
                    showConfirm(
                      record,
                      1,
                      $t('modalForm.finance.finance_comfirm_to_success_three_party'),
                    )
                  "
                  >{{ $t('modalForm.finance.common_income.auditors_ok') }}</Button
                >
                <span v-else class="primary-color cursor" @click="handleDetail(record, 'detail')">{{
                  $t('business.common_detail')
                }}</span>
              </span>
              <span v-if="apiMap.FINANCE_TYPE == 'currency_withdrawal'">
                <Button
                  type="primary"
                  v-if="isHasAuth('20509')"
                  @click="
                    showConfirm(
                      record,
                      1,
                      $t('modalForm.finance.finance_comfirm_to_success_three_party'),
                    )
                  "
                  >{{ $t('modalForm.finance.common_income.auditors_ok') }}</Button
                >
                <span v-else class="primary-color cursor" @click="handleDetail(record, 'detail')">{{
                  $t('business.common_detail')
                }}</span>
              </span>
            </Space>

            <Space v-else-if="apiMap.AUDIT_TYPE == 2 && record.state == 3">
              <Button
                type="primary"
                @click="handleDetail(record, 'review')"
                v-if="
                  (apiMap.title == $t('table.report.report_company_deposit_list') &&
                    isHasAuth('20203')) ||
                  (apiMap.title == $t('table.report.report_currency_deposit_list') &&
                    isHasAuth('20303')) ||
                  (apiMap.title == $t('table.report.report_currency_withdraw_list') &&
                    isHasAuth('20504')) ||
                  (apiMap.title == $t('table.report.report_online_withdrawal_list') &&
                    isHasAuth('20404'))
                "
                >{{ auditData[apiMap.AUDIT_TYPE] }}</Button
              >
              <Space v-else> - </Space>
            </Space>
            <Space v-else> - </Space>
          </div>
        </div>
        <!--原来的 code end-->
      </template>
    </BasicTable>
    <!--审核-->
    <RechargeAuditModal :apiMap="modalApiMap" @register="registerAuditModal" @reload="reload" />
    <WithdrawalsAuditModal
      :title="apiMap.modelTitle"
      :apiMap="modalApiMap"
      @register="registerWithdrawalAuditModal"
      @reload="reload"
    />
    <WithdrawalDetailsModal
      @register="registerWithdrawalDetailsModal"
      :apiMap="modalApiMap"
      @reload="reload"
    />
    <DamaDialog @register="registerDamaDetailModal" :titleicon="'history'" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onActivated, onDeactivated, onMounted, nextTick } from 'vue';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { isHasAuth } from '@/utils/authFunction';
  import { Button } from '/@/components/Button';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import { Space, DatePicker, Select, Divider, message } from 'ant-design-vue';
  import { BasicPopover } from '/@/components/Popover';
  import {
    columns,
    getSearchFormSchema,
    processBankcardList,
    processwalletdescList,
  } from './apiAuditTable.data';
  import RechargeAuditModal from '../modal/RechargeAuditModal.vue';
  import WithdrawalsAuditModal from '../modal/WithdrawalsAuditModal.vue';
  import WithdrawalDetailsModal from '../modal/WithdrawalDetailsModal.vue';
  import DamaDialog from '/@/components/DamaDialog/index.vue';
  import { RELOAD_TIME_OPTIONS, auditData } from '../../../common/const';
  import { useInterval, useExportFile } from '/@/utils/helper/paramsHelper';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useMemberStore } from '/@/store/modules/member';
  import dayjs from 'dayjs';
  import {
    getDepositBonusList,
    setFinanceCoinFailed,
    setFinanceCoinSuccess,
    setFinanceWithdrawFailed,
    setFinanceWithdrawSuccess,
  } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRoute } from 'vue-router';
  import { openConfirm } from '/@/utils/confirm';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  type Recordable<T = any> = Record<string, T>;

  export default defineComponent({
    name: 'ApiAuditTable',
    components: {
      DateButtonGroup,
      Space,
      Button,
      BasicPopover,
      BasicTable,
      PageWrapper,
      RechargeAuditModal,
      WithdrawalsAuditModal,
      WithdrawalDetailsModal,
      DamaDialog,
      [DatePicker.name]: DatePicker,
      [Select.name]: Select,
      [Divider.name]: Divider,
    },
    props: {
      apiMap: {
        type: Object,
        default: () => {},
      },
    },
    setup(props) {
      let height = 390;
      if (props.apiMap.FINANCE_TYPE == 'currency_withdrawal') height = 340;
      const scrollHeight = Number(useScrollerHeight(height).value);
      const route = useRoute();
      const { t } = useI18n();
      const reloadTime = ref<number>(RELOAD_TIME_OPTIONS[2].value);
      const { exportFile } = useExportFile();
      const [registerAuditModal, { openModal: openAuditModal }] = useModal();
      const [registerWithdrawalAuditModal, { openModal: openWithdrawalAuditModal }] = useModal();
      const [registerDamaDetailModal, { openModal: openDamaDetailModal }] = useModal();

      const [registerWithdrawalDetailsModal, { openModal: openWithdrawalDetailsModal }] =
        useModal();
      const memberStore = useMemberStore();
      // 获取VIP等级下拉
      memberStore.getVipLevelList();
      memberStore.getLevelList();

      // const { FinanceRates, FinancegetCurrency, getCurrencyMap, currencyId } = getRate();

      const modalApiMap = {
        PAGE_TYPE: props.apiMap.PAGE_TYPE,
        AUDIT_TYPE: props.apiMap.AUDIT_TYPE,
        title: props.apiMap.modelTitle,
        reviewApi: props.apiMap.reviewApi,
      };
      const [registerTable, { reload, getForm, getColumns, setColumns }] = useTable({
        api: (tableParams) => props.apiMap.list({ ...tableParams, ...props.apiMap.tableParams }),
        columns: props.apiMap.columns || columns,
        dataSource: [{ id: 1, state: 0 }],
        formConfig: {
          schemas:
            props.apiMap.formSchema ||
            getSearchFormSchema(props.apiMap.AUDIT_TYPE, props.apiMap.FINANCE_TYPE, route),
          actionColOptions: {
            class: 'inquireButtonBox t-form-col t-form-label-com',
          },
          submitButtonOptions: {
            text: t('common.queryText'), //查询
          },
          resetButtonOptions: {
            text: t('common.export'), //导出
          },
          showResetButton:
            (props.apiMap.title == t('table.report.report_company_deposit_list') &&
              isHasAuth('20206')) ||
            (props.apiMap.title == t('table.report.report_online_withdrawal_list') &&
              isHasAuth('20407')) ||
            (props.apiMap.title == t('table.report.report_currency_withdraw_list') &&
              isHasAuth('20507')) ||
            (props.apiMap.title == t('table.report.report_currency_deposit_list') &&
              isHasAuth('20305')),
          resetFunc: handleExportTableList,
        },
        afterFetch: async (response) => {
          return response;
        },
        beforeFetch: (param) => {
          if (param.currency_id == 'all') param.currency_id = '';
          if (param.contract_id == '0') param.contract_id = '';
          setDateParmaTime(param);
          // setDateParmas(param);
          return param;
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        showTableSetting: false,
      });
      const customSelectColums = ref<any[]>([]);
      onMounted(() => {
        customSelectColums.value = getColumns().map((item) => item.dataIndex);
        const { updateSchema, setFieldsValue, getFieldsValue } = getForm();
        if (props.apiMap.FINANCE_TYPE == 'company_deposit')
          processBankcardList('all', updateSchema, setFieldsValue);
        if (props.apiMap.FINANCE_TYPE == 'currency_deposit')
          processwalletdescList('all', updateSchema, setFieldsValue);

        // updateCurrencyList('', updateSchema, setFieldsValue, getFieldsValue);
      });
      async function changeButtonDay(value) {
        setTimeout(async () => {
          await getForm().setFieldsValue({
            time: [
              dayjs(value[0]).subtract(2, 'day').startOf('day').toDate(),
              dayjs(value[0]).endOf('day').toDate(),
            ],
          });
          reload();
        }, 11);
      }

      const { startInterval, stopInterval } = useInterval(reload);

      async function handleAuditRecharge(record: Recordable): Promise<void> {
        const response = await props.apiMap.listById({ id: record.id });
        const bonus = await getDepositBonusList({
          id: record.id,
          currency_id: record.currency_id,
          type: props.apiMap.FINANCE_TYPE == 'currency_deposit' ? 3 : 2,
        });
        switch (props.apiMap.AUDIT_TYPE) {
          case 1:
            openAuditModal(true, { record: response, bonus });
            break;
          case 2:
            openWithdrawalAuditModal(true, { record: response, bonus });
            break;
          default:
            break;
        }
      }

      async function handleDetail(record: Recordable, status): Promise<void> {
        const response = await props.apiMap.listById({ id: record.id });
        openWithdrawalDetailsModal(true, {
          record: response,
          type: props.apiMap.FINANCE_TYPE,
          status: status,
        });
      }

      function handleReloadTimeChange(time: number): void {
        if (time !== -1) {
          startInterval(time);
        } else {
          stopInterval();
        }
      }

      async function handleExportTableList(): Promise<void> {
        try {
          const { validate } = getForm();
          const param = await validate();
          setDateParmaTime(param);
          setDateParmas(param);
          await exportFile(props.apiMap.exportApi, param, props.apiMap.exportName);
        } catch (e) {
          console.error(e);
        }
        // 避免汇出后自动查询
        return Promise.reject();
      }

      const model = ref<FormModel>({
        start_time: dayjs().subtract(2, 'day').startOf('day').toDate(),
        end_time: dayjs().endOf('day').toDate(),
      });

      const disabledStartDate = (date) => {
        if (model.value.end_time) {
          return date.valueOf() > model.value.end_time.valueOf();
        } else {
          return date.valueOf() > dayjs().endOf('day');
        }
      };

      const disabledEndDate = (date) => {
        if (model.value.start_time) {
          return (
            date.valueOf() < model.value.start_time.valueOf() ||
            date.valueOf() > dayjs().endOf('day')
          );
        } else {
          return date.valueOf() > dayjs().endOf('day');
        }
      };

      const onStartDateChange = (value) => {
        model.value.start_time = value;
      };

      const onEndDateChange = (value) => {
        model.value.end_time = value;
      };

      const handleColumnChange = (valArray) => {
        nextTick(() => {
          if (valArray && valArray.length) {
            valArray = valArray.map((item) => {
              if (item.visible) {
                return item.dataIndex;
              }
            });
            customSelectColums.value = valArray;
          }
        });
      };

      function showConfirm(record, type, msg) {
        openConfirm(t('modalForm.finance.finance_operation_confirmation'), msg, async () => {
          const api =
            props.apiMap.FINANCE_TYPE == 'online_withdrawal'
              ? type == 1
                ? setFinanceWithdrawSuccess
                : setFinanceWithdrawFailed
              : type == 1
              ? setFinanceCoinSuccess
              : setFinanceCoinFailed;
          const { status, data } = await api({ id: record.id });
          if (status) {
            message.success(data);
            reload();
          } else {
            message.error(data);
          }
        });
      }
      onActivated(() => startInterval(reloadTime.value));
      onDeactivated(() => stopInterval());

      return {
        changeButtonDay,
        dayjs,
        auditData,
        isHasAuth,
        handleColumnChange,
        reload,
        reloadTime,
        modalApiMap,
        RELOAD_TIME_OPTIONS,
        registerTable,
        registerAuditModal,
        registerWithdrawalAuditModal,
        handleAuditRecharge,
        handleReloadTimeChange,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        registerWithdrawalDetailsModal,
        handleDetail,
        showConfirm,
        registerDamaDetailModal,
        openDamaDetailModal,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  :deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .resize-item-box {
    display: inline-block;
    position: relative;
    width: auto;
  }

  .resize-item {
    display: flex;
  }

  :deep(.multiole_select_m) {
    width: 300px;
    max-width: 300px;

    .ant-select-selector {
      top: -3px;
      overflow: hidden;

      .ant-select-selection-overflow {
        flex-wrap: nowrap;
        height: 44px;
        overflow: hidden;

        .ant-select-selection-overflow-item {
          .ant-select-selection-item {
            height: 22px !important;
            padding-right: 0 !important;
            line-height: 22px !important;
          }
        }
      }
    }

    .ant-select-selection-placeholder {
      top: 23px;
    }

    .ant-select-clear {
      top: 14px;
    }
  }
</style>
