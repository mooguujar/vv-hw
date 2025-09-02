<template>
  <div>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: t('business.common_delete'),
                icon: 'ant-design:delete-outlined',
                color: 'error',
                popConfirm: {
                  title: t('common.confirmDel'),
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';

  import { columns, searchFormSchema } from './syslog.data';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  export default defineComponent({
    name: 'SystemSyslog',
    components: { BasicTable, TableAction },
    setup() {
      const [registerTable, { reload }] = useTable({
        title: t('common.LogList'),
        //api: getSyslogList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          actionColOptions: {
            class: 't-form-col',
            xxl: 11,
            xl: 11,
            lg: 11,
          },
          showResetButton: false,
        },
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        // actionColumn: {
        //   width: 80,
        //   title: '操作',
        //   dataIndex: 'action',
        //   // slots: { customRender: 'action' },
        //   fixed: undefined,
        // },
      });

      function handleDelete(record: Recordable) {}

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        handleDelete,
        handleSuccess,
        t,
      };
    },
  });
</script>
