<template>
  <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable">
    <BasicTable
      @register="registerTable"
      @columns-change="handleColumnChange"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-reloadTime>
        <a-select
          v-model:value="reloadTime"
          :options="RELOAD_TIME_OPTIONS"
          @change="handleReloadTimeChange"
        />
      </template>

      <template #form-custom>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select
            v-model:value="currentType"
            :options="searchTypeOptions"
            class="pay-select"
            style="width: 46%"
          />
          <a-input
            style="width: 54%"
            class="pay-input w-20 mr-2.5"
            allowClear
            :placeholder="t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #action="{ record }">
        <div>
          <div>
            <Button
              v-if="record.state === 3 && isHasAuth('20102')"
              type="primary"
              @click="handleForceDeposit(record)"
              >{{ t('table.finance.finance_forced_deposit') }}</Button
            >
            <div v-else-if="record.review_name && isHasAuth('20102')" class="text-red">{{
              t('table.finance.finance_forced_deposit')
            }}</div>
            <div v-else>-</div>
          </div>
        </div>
      </template>
    </BasicTable>
    <DateButtonGroup
      class="absolute h-0"
      :isSelect="'days'"
      @change-button-day="changeButtonDay"
      :dateGroupButtonList="[]"
    />
  </PageWrapper>
</template>

<script lang="ts">
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { defineComponent, ref, onDeactivated, onActivated, onMounted, nextTick } from 'vue';
  import { DatePicker, Select, message, Button, Input } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';
  import {
    columns,
    processFinanceMethodList,
    processwalletdescList,
    searchFormSchema,
  } from './onlinePayment.data';
  import { RELOAD_TIME_OPTIONS } from '../common/const';
  import { useInterval, useExportFile } from '/@/utils/helper/paramsHelper';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import {
    exportOnlineList,
    getAllCurrencyList,
    getFinanceOnlineList,
    updateFinanceOnline,
  } from '/@/api/finance';
  import { openConfirm } from '/@/utils/confirm';
  import dayjs from 'dayjs';
  import { getFinancePlatformList } from '/@/api/select';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight400 } from '../../common/component';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  export default defineComponent({
    name: 'OnlinePaymentNocash',
    components: {
      DateButtonGroup,
      BasicTable,
      Button,
      PageWrapper,
      [DatePicker.name]: DatePicker,
      Select,
      [Select.name]: Select,
      [Input.name]: Input,
      [Input.Group.name]: Input.Group,
    },
    setup() {
      const scrollHeight = Number(useScrollerHeight(tabHeight400).value);
      //定义当前选中的框
      const currentType = ref(1 as any);
      //输入当前的值
      const fromSearch = ref('' as any);

      const reloadTime = ref<number>(RELOAD_TIME_OPTIONS[2].value);
      const { t } = useI18n();
      const { exportFile } = useExportFile();
      const [registerModal, { openModal }] = useModal();

      const [registerTable, { reload, getForm, getColumns, setColumns }] = useTable({
        api: getFinanceOnlineList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          actionColOptions: {
            class: 'inquireButtonBox t-form-label-com',
          },
          customClassForm: true,
          submitButtonOptions: {
            text: t('common.queryText'), //查询
          },
          resetButtonOptions: {
            text: t('common.export'), //导出
          },
          resetFunc: handleExportTableList,
          showResetButton: isHasAuth('20104'),
        },
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        showTableSetting: false,
        afterFetch: async (response) => {
          return response;
        },
        beforeFetch: (param) => {
          if (param.currency_id == 'all') param.currency_id = '';
          processingParams(param);
        },
      });

      function processingParams(param) {
        if (fromSearch.value) {
          param['search_type'] = currentType.value;
          param['search_value'] = fromSearch.value;
        }
        setDateParmaTime(param);
        // setDateParmas(param);
        return param;
      }

      const searchTypeOptions = [
        { label: t('business.common_member_account'), value: 1 },
        { label: t('business.common_super_agent'), value: 4 },
        { label: t('business.common_order_number'), value: 2 },
        { label: t('business.common_auditors'), value: 3 },
      ];

      const customSelectColums = ref<any[]>([]);

      onMounted(() => {
        customSelectColums.value = getColumns().map((item) => item.dataIndex);
        const { updateSchema } = getForm();
        processwalletdescList('all', updateSchema);
        processFinanceMethodList('all', updateSchema);
      });

      async function changeButtonDay(value) {
        setTimeout(async () => {
          await getForm().setFieldsValue({ time: value });
          reload();
        }, 11);
      }

      const { startInterval, stopInterval } = useInterval(reload);

      function handleForceDeposit(record: Recordable) {
        openConfirm(
          t('modalForm.finance.finance_operation_confirmation'),
          t('table.finance.finance_operation_confirmation_text'),
          async () => {
            const { data, status } = await updateFinanceOnline({
              id: record.id,
              state: 1,
              remark: t('table.finance.finance_forced_deposit'),
            });
            if (status) {
              message.success(data);
              reload();
            } else {
              message.error(data);
            }
          },
        );
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
          processingParams(param);
          await exportFile(exportOnlineList, param, t('table.report.report_online_pay'));
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
      const onEndDateChange = (value) => {
        model.value.end_time = value;
      };

      const fetchPlatformList = async () => {
        const { updateSchema } = getForm();

        const company_response = await getFinancePlatformList({ state: 0 });
        const method_response = await getAllCurrencyList({
          withdraw: 1,
          state: 0,
        });

        const processOptions = (list) => [
          { label: t('business.common_all'), value: '' },
          ...list.map((el) => ({ label: el.name, value: el.id })),
        ];

        const companyList = (company_response.d || []).map((el) => ({
          ...el,
          label: el.name,
          value: el.id,
        }));
        const mergedArray = []
          .concat(...Object.values(method_response))
          .map((el) => ({ ...el, label: el.name, value: el.id }));

        updateSchema({
          field: 'pay_company_id',
          componentProps: {
            allowClear: true,
            showSearch: true,
            labelField: 'label',
            optionFilterProp: 'label',
            valueField: 'value',
            options: processOptions(companyList),
          },
        });

        updateSchema({
          field: 'pay_method_id',
          componentProps: {
            allowClear: true,
            showSearch: true,
            labelField: 'label',
            optionFilterProp: 'label',
            valueField: 'value',
            options: processOptions(mergedArray),
          },
        });
      };
      onDeactivated(() => stopInterval());

      onActivated(() => {
        startInterval(reloadTime.value);
      });

      return {
        handleColumnChange,
        isHasAuth,
        reload,
        reloadTime,
        RELOAD_TIME_OPTIONS,
        registerTable,
        registerModal,
        handleForceDeposit,
        handleReloadTimeChange,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        t,
        changeButtonDay,
        currentType,
        fromSearch,
        searchTypeOptions,
        scrollHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-picker) {
    width: 100%;
  }

  ::v-deep(.ant-divider-horizontal) {
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
</style>
