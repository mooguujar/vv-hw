<template>
  <div>
    <BasicTable @register="registerPayment" :scroll="{ y: scrollHeight }">
      <template #form-created>
        <div class="button-box">
          <Button class="!mr-2" type="primary" v-if="isHasAuth('20703')" @click="addPlateForm">
            {{ t('modalForm.finance.finance_add_payplatform') }}
          </Button>
        </div>
      </template>
      <template #customTableHeader>
        <slot></slot>
      </template>
      <template #action="{ column, record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
    <ApiPlateFormModal :apiMap="apiFormMap" @success="success" @register="register" />
    <ApiPlateFormModal :apiMap="apiPayFormMap" @success="success" @register="registerPayForm" />
    <DiscountConfigModal @register="registerDiscountConfig" />
  </div>
</template>

<script setup lang="ts">
  import { auths, isHasAuth } from '@/utils/authFunction';
  import { onMounted, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { Button } from '/@/components/Button';
  import ApiPlateFormModal from './ApiPlateFormModal.vue';
  import DiscountConfigModal from './DiscountConfigModal.vue';
  import { openConfirm } from '/@/utils/confirm';
  import { getPlateForm, getPayPlateForm } from '../paymentPlatform.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getAllCurrencyList, getCompanyCurrencyList } from '/@/api/finance';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight540 } from '/@/views/common/component';

  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
    activeKey: {
      type: String,
      default: '',
    },
    achieveList: {
      type: Array,
      default: () => [],
    },
  });
  const apiFormMap = {
    schemas: getPlateForm,
  };
  const createActions = (record) => {
    const actions: ActionItem[] = [
      {
        label: `${
          record.state === 1 ? t('business.common_deactivate') : t('business.common_on_activate')
        }`,
        color: `${record.state === 2 ? 'success' : 'error'}`,
        onClick: showConfirm.bind(
          null,
          record,
          'state',
          `${t('table.report.report_prompt', {
            len:
              record.state === 1
                ? t('business.common_deactivate').toLowerCase()
                : t('business.common_on_activate').toLowerCase(),
          })}`,
        ),
        ifShow: isHasAuth('20705'),
      },
      {
        label: `${t('business.common_edit')}`,
        onClick: editFun.bind(null, record),
        ifShow: isHasAuth('20704'),
      },
      {
        label: `${t('business.common_delete')}`,
        color: 'error',
        onClick: showConfirm.bind(null, record, 'del', t('table.report.report_del')),
        disabled: record?.state == 1,
        ifShow: isHasAuth('20706'),
      },
      {
        label: `${t('business.common_pay_edit')}`,
        onClick: handlePayUpdate.bind(null, record),
        ifShow: isHasAuth('20721'),
      },
    ];
    return actions;
  };
  const apiPayFormMap = {
    schemasParmas: {
      isShow: false,
    },
    schemas: getPayPlateForm,
  };

  const { t } = useI18n();

  const scrollHeight = Number(useScrollerHeight(tabHeight540).value);

  const emits = defineEmits(['successactiveKey']);

  const [register, { openModal: openAdd }] = useModal();
  const [registerPayForm, { openModal: openPayForm }] = useModal();

  const [registerDiscountConfig, { openModal: openDiscountConfig }] = useModal();

  const [registerPayment, { reload, getColumns, setColumns, getForm }] = useTable({
    api: outpayList,
    columns: props.apiMap.columns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      schemas: props.apiMap.schemas,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
    },
    actionColumn: {
      minWidth: 80,
      title: t('business.common_operate'), //操作
      slots: { customRender: 'action' },
      ifShow: auths(['20705', '20704', '20706', '20721']),
    },
  });

  function addPlateForm() {
    openAdd(true, {});
  }

  function handleDiscountConfig() {
    openDiscountConfig(true, {});
  }

  function showConfirm(record, type, msg) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      msg,
      async () => {
        if (type === 'state') {
          const { data, status } = await props.apiMap.updateState({
            id: record.id,
            state: record.state === 1 ? 2 : 1,
          });
          if (status) {
            message.success(data);
            reload();
          } else {
            message.error(data);
            reload();
          }
        } else if (type === 'del') {
          const { data, status } = await props.apiMap.delListItem({ id: record.id });
          if (status) {
            message.success(data);
            reload();
          } else {
            message.error(data);
            reload();
          }
        }
      },
      '',
    );
  }

  async function outpayList(tableParams: { rows: number; page: number }) {
    if (props.achieveList.length == 0) return false;
    return props.apiMap.list({ ...tableParams, ...props.apiMap.listParams });
  }

  function success(data) {
    emits('successactiveKey', data);
  }

  defineExpose({ reload });

  function editFun(record) {
    openAdd(true, { data: record });
  }

  function handlePayUpdate(record) {
    record.type_pay = 'pay_edit';
    openPayForm(true, {
      data: record,
      title: `${t('business.common_pay_edit')}`,
    }); //支付修改
  }

  onMounted(() => {
    processCompanyCurrency(props.apiMap.PAGE_ID);
  });

  watch(
    () => props.activeKey,
    (newValue) => {
      processCompanyCurrency(newValue);
    },
  );

  async function processCompanyCurrency(value) {
    const { updateSchema, setFieldsValue } = getForm();

    const companyList = await getCompanyCurrencyList({
      withdraw: 1,
      currency_id: value,
    });

    const mappedList =
      companyList?.map((el) => ({
        value: el.id,
        label: el.name,
      })) || [];

    const list = [...[{ label: t('business.common_all'), value: '' }], ...mappedList]; //全部

    const response = await getAllCurrencyList({
      withdraw: 1,
      currency_id: value,
      company: 1,
    });

    const mappedList2 =
      response?.[value]?.map((el) => ({
        value: el.id,
        label: el.name,
      })) || [];
    const list2 = [...[{ label: t('business.common_all'), value: '' }], ...mappedList2]; //全部

    setFieldsValue({ company_id: '', method_id: '' });

    updateSchema({
      field: 'company_id',
      componentProps: {
        dropdownMatchSelectWidth: false,
        options: list,
        getPopupContainer: () => document.body,
      },
    });

    updateSchema({
      field: 'method_id',
      componentProps: {
        options: list2,
        getPopupContainer: () => document.body,
      },
    });
  }
</script>

<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 4px 0;
  }

  .vben-basic-table-form-container {
    padding: 0;
  }

  .button-box {
    display: flex;
    width: 100%;
  }
</style>
