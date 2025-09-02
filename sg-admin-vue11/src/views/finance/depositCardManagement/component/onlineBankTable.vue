<template>
  <div>
    <BasicTable v-if="show" @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          <MenuOutlined />
        </template>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: `${
                record.state == 2 ? $t('business.common_on') : $t('business.common_deactivate')
              }`,
              color: record.state == 2 ? 'success' : 'error',
              onClick: showConfirm.bind(
                null,
                record,
                'state',
                apiMap.modalType
                  ? `${$t('common.system_to_deactivate_tip')}${
                      record.state == 2
                        ? $t('business.common_on').toLowerCase()
                        : $t('business.common_deactivate').toLowerCase()
                    } ${$t('common.collection_address')}`
                  : `${$t('common.system_to_deactivate_tip')}${
                      record.state == 2
                        ? $t('business.common_on').toLowerCase()
                        : $t('business.common_deactivate').toLowerCase()
                    } ${$t('common.collection_address')}`,
              ),
              ifShow: isHasAuth('21006'),
            },
            {
              label: `${$t('business.common_edit')}`,
              onClick: handleEdit.bind(null, record),
              ifShow: isHasAuth('21005'),
            },
            {
              label: `${$t('business.common_delete')}`,
              color: 'error',
              ifShow: isHasAuth('21007'),
              onClick: deleteConfirm.bind(
                null,
                record,
                apiMap.modalType
                  ? $t('modalForm.finance.finance_comfirm_to_remove_recive_addr')
                  : $t('modalForm.finance.finance_comfirm_to_remove_recive_account'),
              ),
            },
          ]"
        />
      </template>
      <template #customTableHeader>
        <slot></slot>
      </template>
    </BasicTable>
    <ActivateCardModal @register="registerActivateModal" @reload="reload" />
    <addDepositCardForm @register="registerCardForm" @diamondsuccess="diamondsuccess" />
  </div>
</template>

<script lang="ts">
  import { isHasAuth, auths } from '@/utils/authFunction';
  import { defineComponent, watch, ref, nextTick, onBeforeMount, onMounted, reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import ActivateCardModal from './ActiveCardModal.vue';
  import addDepositCardForm from './addDepositCardForm.vue';
  import { MenuOutlined } from '@ant-design/icons-vue';
  import { openConfirm } from '/@/utils/confirm';
  import { searchFormSchema } from './onlineBankTable.data';
  import { sortBankcardList, stateBankcardList } from '/@/api/finance';
  import { useI18n } from '/@/hooks/web/useI18n';
  import eventBus from '/@/utils/eventBus';
  import { ADDraggableRow } from '/@/utils';

  const { t } = useI18n();

  export default defineComponent({
    name: 'OnlineBankTable',
    components: {
      BasicTable,
      TableAction,
      ActivateCardModal,
      addDepositCardForm,
      MenuOutlined,
    },
    props: {
      apiMap: {
        type: Object,
        default: () => {},
      },
    },
    setup(props) {
      const [registerActivateModal, { openModal: openActivateModal }] = useModal();

      const [registerCardForm, { openModal: CardForm }] = useModal();
      let tableSearchParam = ref<any>({});

      let dataSource = ref<any>([]);
      const show = ref(true);
      const registerTable = ref();
      const reload = ref();

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
        };
        try {
          const { status, data } = await sortBankcardList(param);
          reload.value();
          if (status) {
            message.success(data);
          } else {
            message.error(data);
          }
        } catch (e) {
          console.error(e);
        }
      }

      function cook() {
        const [registerTable1, { reload: reload1, setTableData }] = useTable({
          // title: props.apiMap.pageName,
          api: getDepositCardList,
          columns: props.apiMap.columns,
          customRow: isHasAuth('21008')
            ? (record, index) => ADDraggableRow(dataSource.value, index, setTableData, sortTable)
            : undefined,
          useSearchForm: false,
          bordered: true,
          showIndexColumn: false,
          actionColumn: {
            // width: 200,
            title: t('business.common_operate'), //操作
            dataIndex: 'action',
            fixed: false,
            ifShow: auths(['21006', '21005', '21007']),
            slots: { customRender: 'action' },
          },
          beforeFetch: (tableParams: Recordable) => {
            return Object.assign(tableParams, tableSearchParam.value);
          },
          formConfig: {
            labelWidth: 120,
            schemas: searchFormSchema,
            showAdvancedButton: false,
            actionColOptions: {
              class: 't-form-col t-form-label-com',
              xxl: 12,
              xl: 12,
              lg: 12,
            },
            submitButtonOptions: {
              text: t('common.queryText'), //查询
            },
            resetButtonOptions: {
              text: t('common.export'), //导出
            },
          },
        });
        registerTable.value = registerTable1;
        reload.value = reload1;
      }

      watch(
        () => props.apiMap,
        () => {
          cook();
          show.value = false;
          nextTick(() => {
            show.value = true;
          });
        },
        { deep: true },
      );
      cook();

      async function getDepositCardList(tableParams): Promise<void> {
        try {
          const response = await getDepositCard(tableParams);
          // 為了取得原始資料做的middle ware
          dataSource.value = response.d;
          return response;
        } catch (e) {
          console.error(e);
        }
      }

      function getDepositCard(tableParams: { rows: number; page: number }): Promise<any> {
        return props.apiMap.list({ ...tableParams, currency_id: props.apiMap.PAGE_TYPE });
      }

      function handleChangeactivate(record: any, activate: boolean): void {
        let currencyId = props.apiMap.PAGE_TYPE;
        let modalType = props.apiMap.modalType;
        openActivateModal(true, { record, activate, modalType, currencyId, reload: reload.value });
      }

      function handleEdit(record: any): void {
        CardForm(true, record);
      }

      async function handleDelete(record: any): Promise<void> {
        try {
          const { status, data } = await props.apiMap.delListItem({
            id: record.id,
            currency_id: props.apiMap.PAGE_TYPE,
          });
          if (status) await reload.value();
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
        openConfirm(t('table.member.member_oprate_tip'), msg, async () => {
          if (type === 'state') {
            const { data, status } = await stateBankcardList({
              id: record.id,
              state: record.state === 1 ? 2 : 1,
              currency_id: props.apiMap.PAGE_TYPE,
            });
            if (status) {
              message.success(data);
              await reload.value();
            } else {
              message.error(data);
              await reload.value();
            }
          }
        });
      }

      function diamondsuccess() {
        reload.value();
      }
      onBeforeMount(() => {
        eventBus.off('searchSubmit');
      });

      onMounted(() => {
        eventBus.on('searchSubmit', (value) => {
          tableSearchParam.value = value;
          diamondsuccess();
        });
      });
      return {
        isHasAuth,
        registerActivateModal,
        registerTable,
        handleChangeactivate,
        handleEdit,
        handleDelete,
        reload,
        showConfirm,
        registerCardForm,
        diamondsuccess,
        show,
        deleteConfirm,
      };
    },
  });
</script>
<style scoped>
  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }
</style>
<style scoped lang="scss">
  ::v-deep(.columnSelectBar) {
    cursor: pointer;

    td:first-child {
      cursor: pointer;
    }
  }
</style>
<style>
  .ant-modal-confirm-content {
    line-height: 1.5 !important;
  }
</style>
