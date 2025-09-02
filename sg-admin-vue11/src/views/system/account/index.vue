<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">{{
          $t('modalForm.system.system_add_username')
        }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: $t('common.editorText'), //编辑
                icon: 'clarity:note-edit-line',
                tooltip: $t('common.editorText_1'),
                onClick: handleEdit.bind(null, record),
              },
              {
                label: $t('common.delText'), //删除
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: $t('common.editorText_2'),
                onClick: showConfirm.bind(
                  null,
                  record,
                  $t('table.system.system_option_delete_tip'),
                ), //是否进行删除操作？删除后无法恢复
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleModalSuccess" />
    <QrcodeModal @register="registerQrModal" @success="handleSuccess" />
  </div>
</template>
<script setup lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getUserListByPage } from '/@/api/sys/index';
  import { useModal } from '/@/components/Modal';
  import AccountModal from './AccountModal.vue';
  import QrcodeModal from './QrcodeModal.vue';
  import { columns, searchFormSchema } from './account.data';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { openConfirm } from '/@/utils/confirm';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const userStore = useUserStoreWithOut();
  const [registerModal, { openModal }] = useModal();
  const [registerQrModal, { openModal: openModal4 }] = useModal();

  const [registerTable, { reload }] = useTable({
    title: t('table.system.system_account_list'), //账号列表
    api: getUserListByPage,
    //rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      actionColOptions: {
        class: 't-form-col',
        xxl: 12,
        xl: 12,
        lg: 12,
      },
    },
    beforeFetch: (param) => {
      param.state = 1;
      param.gid = 0;
      param.name = '';
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 160,
      title: t('business.common_operate'), //操作
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openModal(true, {
      record,
      isUpdate: true,
    });
  }
  const { createMessage } = useMessage();

  async function handleDelete(record: Recordable) {
    reload();
    createMessage.error();
  }

  function handleModalSuccess() {
    reload();
    userStore.afterLoginAction();
  }

  function handleSuccess() {
    reload();
  }

  function showConfirm(record, msg) {
    //操作确认
    openConfirm(t('table.member.member_oprate_tip'), msg, () => {
      handleDelete(record);
    });
  }
</script>
