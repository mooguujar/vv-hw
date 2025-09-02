<template>
  <div>
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          <MenuOutlined />
        </template>
      </template>
      <template #customTableHeader>
        <slot></slot>
      </template>
      <template #action="{ record }">
        <TableAction :actions="createActions(record)" />
      </template>
    </BasicTable>
    <addReceiveCardForm @register="registerCardForm" @diamondsuccess="diamondsuccess" />
    <QuotaModal @register="registerQuotaModal" @diamondsuccess="diamondsuccess" />
    <ActivateCardModal @register="registerActivateModal" @reload="reload" />
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    reactive,
    onMounted,
    defineExpose,
    watch,
    ref,
    onBeforeMount,
  } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import { MenuOutlined } from '@ant-design/icons-vue';
  import { openConfirm } from '/@/utils/confirm';
  import addReceiveCardForm from './addReceiveCardForm.vue';
  import QuotaModal from './QuotaModal.vue';
  import ActivateCardModal from './ActiveCardModal.vue';
  import {
    getwithdrawTypeCurrency,
    getCompanyCurrencyList,
    updateState,
    withdraw_merchant_sort,
    deleteState,
  } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import eventBus from '/@/utils/eventBus';
  import { ADDraggableRow } from '/@/utils';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight570 } from '/@/views/common/component';

  const { t } = useI18n();
  export default defineComponent({
    name: 'ReceiveBankTable',
    components: {
      BasicTable,
      TableAction,
      addReceiveCardForm,
      QuotaModal,
      MenuOutlined,
      ActivateCardModal,
    },
    props: {
      apiMap: {
        type: Object,
        default: () => {},
      },
      activeKey: {
        type: String,
        default: '',
      },
      type_id: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const scrollHeight = Number(useScrollerHeight(tabHeight570).value);
      let company_list = reactive<any>([]);
      let Currency_list = reactive<any>([]);
      const [registerActivateModal, { openModal: openActivateModal }] = useModal();

      const [registerCardForm, { openModal: CardForm }] = useModal();

      const [registerQuotaModal, { openModal: openQuotaModal }] = useModal();

      const columns = useAutoTableLabelWidth(props.apiMap.columns);
      let dataSource = ref<any>([]);
      const [registerTable, { reload, getColumns, setColumns, getForm, setTableData }] = useTable({
        customRow: (record, index) =>
          ADDraggableRow(dataSource.value, index, setTableData, sortTable),
        api: getDepositCard,
        columns: columns,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          // width: 280,
          title: t('business.common_operate'), //操作
          dataIndex: 'action',
          fixed: false,
          slots: { customRender: 'action' },
          ifShow: auths(['20604', '20603', '20613', '20614']),
        },
        formConfig: {
          labelWidth: 120,
          schemas: paymentForm(props.apiMap.PAGE_TYPE),
          showAdvancedButton: false,
          actionColOptions: {
            class: 't-form-col t-form-label-com recive-bank-table-box',
          },
          submitButtonOptions: {
            text: t('common.queryText'), //查询
          },
          resetButtonOptions: {
            text: t('common.export'), //导出
          },
          showResetButton: false,
        },
        beforeFetch: (params) => {
          params['type_id'] = props.type_id || '';
          return params;
        },
        afterFetch: (data) => {
          // clearSelectedRowKeys();
          dataSource.value = data;
        },
      });

      async function sortTable(targetWork, tempSource) {
        if (!targetWork && !tempSource) {
          return;
        }
        const param = {
          id: tempSource.id,
          index_id: targetWork.id,
          sort_before: tempSource.seq,
          sort_after: targetWork.seq,

          currency_id: props.apiMap.PAGE_TYPE,
          type_id: props.type_id,
        };

        try {
          const { status, data } = await withdraw_merchant_sort(param);
          reload();
          if (status) {
            message.success(data);
          } else {
            message.error(data);
          }
        } catch (e) {
          console.error(e);
        }
      }
      function createActions(record) {
        const actions: ActionItem[] = [
          {
            label: `${
              record.state == 2 ? t('business.common_on') : t('business.common_deactivate')
            }`,
            ifShow: isHasAuth('20604'),
            color: record.state == 2 ? 'success' : 'error',
            onClick: showConfirm.bind(
              null,
              record,
              'state',
              record.state == 2
                ? `${t('modalForm.member.member_turn_on_tip')}${t(
                    'modalForm.member.member_pay_plant1',
                  )}?`
                : `${t('modalForm.member.member_prohibit_tip')}${t(
                    'modalForm.member.member_pay_plant1',
                  )}?`,
            ),
          },
          {
            label: `${t('business.common_edit')}`,
            onClick: handleEdit.bind(null, record),
            ifShow: isHasAuth('20603'),
          },
          {
            label: `${t('modalForm.finance.finance_help_amount')}`,
            onClick: handleQuota.bind(null, record),
            ifShow: isHasAuth('20613'),
          },
          {
            label: `${t('business.common_delete')}`,
            color: 'error',
            onClick: deleteConfirm.bind(null, record, `${t('table.report.report_is_del')}`),
            ifShow: isHasAuth('20614'),
            disabled: record?.state === 1,
          },
        ];
        return actions;
      }
      defineExpose({ reload });

      function paymentForm(currencyId) {
        return [
          {
            field: 'state',
            labelPrefix: t('business.common_status'), //状态
            component: 'Select',
            defaultValue: 0,
            colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
            componentProps: {
              placeholder: t('business.common_all'), //全部
              options: [
                { label: t('business.common_all'), value: 0 }, //全部
                { label: t('business.common_normal'), value: 1 }, //正常
                { label: t('business.common_deactivate'), value: 2 }, //停用
              ],
              getPopupContainer: () => document.body,
            },
          },
          {
            field: 'company_id',
            component: 'Select',
            labelPrefix: t('modalForm.finance.finance_help_payplatform'), //代付平台
            defaultValue: '',
            componentProps: {
              dropdownMatchSelectWidth: false,
              getPopupContainer: () => document.body,
            },
            colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
          },
        ];
      }

      async function getDepositCard(tableParams: { rows: number; page: number }): Promise<any> {
        if (!props.type_id) return;
        const response = await props.apiMap.list({
          ...tableParams,
          currency_id: props.apiMap.PAGE_TYPE,
        });

        return response;
      }

      function handleChangeactivate(
        record: Recordable,
        activate: boolean,
        modalType = props.apiMap.modalType,
      ): void {
        let currencyId = props.apiMap.PAGE_TYPE;
        openActivateModal(true, { record, activate, modalType, currencyId, reload });
      }

      function handleEdit(record: Recordable): void {
        eventBus.emit('isToAddDepositCardPage', false);
        CardForm(true, record);
      }

      function handleQuota(record: Recordable): void {
        openQuotaModal(true, record);
      }

      async function handleDelete(record: Recordable): Promise<void> {
        try {
          const { status, data } = await deleteState({
            id: record.id,
            state: 3,
          });
          if (status) reload();
          else message.error(data);
        } catch (e) {
          console.error(e);
        }
      }

      function deleteConfirm(record, msg) {
        openConfirm(t('table.member.member_oprate_tip'), msg, () => {
          handleDelete(record);
        });
      }

      function showConfirm(record, type, msg) {
        openConfirm(
          t('table.member.member_oprate_tip'),
          msg,
          async () => {
            if (type === 'state') {
              const { data, status } = await updateState({
                id: record.id,
                state: record.state === 1 ? 2 : 1,
                currency_id: props.apiMap.PAGE_TYPE,
              });
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

      function diamondsuccess() {
        reload();
      }

      onMounted(() => {
        processCompanyCurrency(props.apiMap.PAGE_TYPE);
        eventBus.on('freshBalance', (res: any) => {
          reload();
        });
      });

      onBeforeMount(() => {
        eventBus.off('freshBalance');
      });

      watch(
        () => props.activeKey,
        (newValue) => {
          processCompanyCurrency(newValue);
        },
      );
      watch(
        () => props.type_id,
        (newValue) => {
          const { setFieldsValue } = getForm();
          setFieldsValue({ type_id: newValue });
          updateCurrencyList();
          reload();
        },
      );

      const updateCurrencyList = async () => {
        const { updateSchema, setFieldsValue } = getForm();

        const companyList = await getCompanyCurrencyList({
          withdraw: 2,
          currency_id: props.activeKey,
          type_id: props.type_id,
        });

        company_list = companyList;

        const mappedList =
          companyList?.map((el) => ({
            value: el.id,
            label: el.name,
          })) || [];

        const list = [...[{ label: t('business.common_all'), value: '' }], ...mappedList]; //全部
        updateSchema({
          field: 'company_id',
          componentProps: {
            options: list,
            getPopupContainer: () => document.body,
          },
        });
      };

      async function processCompanyCurrency(value) {
        const { updateSchema, setFieldsValue } = getForm();
        // 出款平台
        updateCurrencyList();
        //出框方式
        const response = await getwithdrawTypeCurrency({
          state: 1,
        });

        Currency_list = response;

        const mappedList2 =
          response?.[value]?.map((el) => ({
            value: el.id,
            label: el.name,
            state: el.state,
          })) || [];

        const list2 = [...mappedList2]; //全部

        eventBus.emit('setMethod_list', list2);

        setFieldsValue({ company_id: '', type_id: '' });
      }

      return {
        registerActivateModal,
        registerTable,
        handleChangeactivate,
        handleEdit,
        handleDelete,
        reload,
        showConfirm,
        registerCardForm,
        diamondsuccess,
        registerQuotaModal,
        deleteConfirm,
        createActions,
        scrollHeight,
      };
    },
  });
</script>
<style scoped>
  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }
</style>
<style lang="less" scoped>
  ::v-deep(.t-form-label-com) {
    &.recive-bank-table-box > div {
      text-align: left !important;
    }
  }

  ::v-deep(.columnSelectBar) {
    cursor: pointer;

    td:first-child {
      cursor: pointer;
    }
  }

  :deep(.color_1394ec) {
    color: #1394ec;
  }

  :deep(.table_svg) {
    display: inline-block;
    position: relative;
    top: 2px;
  }

  .ant-select-dropdown {
    width: 200px !important;
  }
</style>
