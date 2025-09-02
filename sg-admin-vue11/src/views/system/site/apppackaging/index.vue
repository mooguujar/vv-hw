<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate">
          {{ $t('modalForm.system.system_start_build_environment') }}
        </a-button>
      </template>
    </BasicTable>
    <AppModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './apppacking.data';
  import { getBuildAppPkglist } from '/@/api/site';
  import AppModal from './appModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  export default defineComponent({
    name: 'Apppackaging',
    components: { BasicTable, AppModal },
    setup() {
      const [registerModal, { openModal }] = useModal();

      const [registerTable, { reload }] = useTable({
        title: t('table.system.system_app_list'), //app列表
        api: getBuildAppPkglist,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          actionColOptions: {
            class: 't-form-col t-form-label-com',
            xxl: 12,
            xl: 12,
            lg: 12,
          },
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
      });

      function handleCreate() {
        openModal(true);
      }
      function handleSuccess() {
        reload();
      }
      return {
        registerTable,
        registerModal,
        handleCreate,
        handleSuccess,
      };
    },
  });
</script>
