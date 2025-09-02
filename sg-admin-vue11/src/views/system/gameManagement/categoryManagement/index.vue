<template>
  <div class="mx-3 my-3">
    <div class="mb-2">
      <a-button type="primary" @click="handleCreate">{{ t('common.AddCategory') }}</a-button>
    </div>
    <div class="bg-white">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: t('common.MutiLangConfig'),
                  icon: 'clarity:note-edit-line',
                  onClick: handleEditLang.bind(null, record),
                },
                {
                  label: t('business.common_edit'),
                  icon: 'clarity:note-edit-line',
                  onClick: handleEdit.bind(null, record),
                },
                {
                  label: t('common.delText'),
                  icon: 'ant-design:delete-outlined',
                  color: 'error',
                  onClick: showConfirm.bind(
                    null,
                    record,
                    t('table.system.system_option_delete_tip'),
                  ),
                  disabled: record.id === '1',
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
    </div>
    <CategoryModal @register="registerModal" @success="handleSuccess" />
    <LangConfigModal @register="registerLangConfigModal" @success="handleSuccess" />
  </div>
</template>

<script setup lang="ts">
  // import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // import { getUserListByPage } from '/@/api/sys/index';
  import { useModal } from '/@/components/Modal';
  import { columns } from './categoryManagement.data';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { openConfirm } from '/@/utils/confirm';
  import { getGameCategoryList, delGameCategory } from '/@/api/sys/index';

  import CategoryModal from './CategoryModal.vue';
  import LangConfigModal from './LangConfigModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerModal, { openModal }] = useModal();
  const [registerLangConfigModal, { openModal: openLangConfigModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    api: getGameCategoryList,
    //rowKey: 'id',
    columns,
    bordered: true,
    showIndexColumn: false,
    actionColumn: {
      width: 260,
      title: t('business.common_operate'),
      dataIndex: 'action',
    },
  });

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEditLang(record) {
    openLangConfigModal(true, {
      record,
      isUpdate: true,
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
    const { data, status } = await delGameCategory({ id: record.id });
    if (status) {
      createMessage.success(data);
      reload();
    } else {
      createMessage.error(data);
    }
  }

  function handleSuccess() {
    reload();
  }

  function showConfirm(record, msg) {
    openConfirm(t('modalForm.finance.finance_operation_confirmation'), msg, () => {
      handleDelete(record);
    });
  }
</script>
