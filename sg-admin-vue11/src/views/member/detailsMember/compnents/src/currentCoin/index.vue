<template>
  <div class="PixCoin">
    <BasicTable @register="registerTable">
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: `${
                record.state === 1
                  ? $t('business.common_deactivate')
                  : $t('business.common_on_activate')
              }`,
              color: `${record.state === 2 ? 'success' : 'error'}`,
              onClick: showConfirm.bind(
                null,
                record,
                'use',
                `${$t('table.member.member_are_you')} ${(record.state === 1
                  ? $t('business.common_deactivate')
                  : $t('business.common_on_activate')
                ).toLowerCase()} ${
                  apiMap.attr === '2'
                    ? $t('table.member.member_account_adress')
                    : $t('table.member.member_this_account')
                }`,
              ),
            },
            {
              label: $t('business.common_edit'),
              onClick: handleEdit.bind(null, record),
              ifShow: apiMap.attr == 1,
            },
            {
              label: $t('business.common_delete'),
              color: 'error',
              onClick: showConfirm.bind(
                null,
                record,
                'del',
                apiMap.attr === '2'
                  ? $t('table.member.member_delete_adress')
                  : $t('table.member.member_delete_account'),
              ),
            },
          ]"
        />
      </template>
    </BasicTable>
    <editCardForm
      @register="registerCardForm"
      :currency_id="apiMap"
      @diamondsuccess="diamondsuccess"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import editCardForm from '../../../../debitCard/component/bankCard/components/editCardForm.vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { openConfirm } from '/@/utils/confirm';
  import { useRoute } from 'vue-router';
  import { message } from 'ant-design-vue';
  import { bankcard_delete, updateBankState, updateWalletState } from '/@/api/member/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
  });

  const [registerTable, { reload }] = useTable({
    api: getColumnList,
    columns: props.apiMap.columns,
    showIndexColumn: false,
    minHeight: 150,
    canResize: false,
    bordered: true,
    actionColumn: {
      minWidth: 150,
      title: t('business.common_operate'),
      dataIndex: 'action',
      ifShow: !isControlValueSet(),
      slots: { customRender: 'action' },
      // fixed: 'right',
    },
    beforeFetch: (param) => {
      param['uid'] = history.state.id;
    },
  });
  function showConfirm(record, type, msg) {
    openConfirm(t('table.member.member_oprate_tip'), msg, async () => {
      //数字货币;
      if (props.apiMap.attr === '2') {
        if (type === 'use') {
          const state = record.state === 2 ? 1 : 2;
          const { data, status } = await updateWalletState({ id: record.id, state: state });
          if (status) {
            message.success(data);
            await reload();
          } else {
            message.error(data);
          }
          return;
        } else if (type === 'del') {
          const state = 3;
          const { data, status } = await updateWalletState({ id: record.id, state: state });
          if (status) {
            message.success(data);
            await reload();
          } else {
            message.error(data);
          }
          return;
        }
      } else {
        if (type === 'use') {
          const state = record.state === 2 ? 1 : 2;
          const { data, status } = await updateBankState({ id: record.id, state: state });
          if (status) {
            message.success(data);
            await reload();
          } else {
            message.error(data);
          }
          return;
        } else if (type === 'del') {
          const state = 3;
          const { data, status } = await bankcard_delete({ id: record.id, state: state });
          if (status) {
            message.success(data);
            await reload();
          } else {
            message.error(data);
          }
          return;
        }
      }
    });
  }

  const [registerCardForm, { openModal: CardForm }] = useModal();

  function handleEdit(record: any): void {
    CardForm(true, record);
  }

  function diamondsuccess() {
    reload();
  }

  async function getColumnList(tableParams: { rows: number; page: number }) {
    return props.apiMap.list({ ...tableParams, currency_id: props.apiMap.modalType });
  }
</script>
<style>
  .ant-modal-confirm-content {
    line-height: 1.5 !important;
  }
</style>
