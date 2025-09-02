<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable">
      <template #form-add>
        <Button
          class="mr-2"
          type="primary"
          @click="addCommissionPlan"
          preIcon="ant-design:plus-outlined"
        >
          {{ $t('modalForm.system.system_add_received') }}
        </Button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label:
                record.state == 1 ? $t('business.common_deactivate') : $t('business.common_on'),
              icon: 'ant-design:stop-outlined',
              color: record.state == 0 ? 'success' : 'error',
              onClick: showConfirm.bind(
                null,
                record,
                'use',
                record.state === 1
                  ? `${$t('modalForm.system.system_to_deactivate_tip')}${record.name}${$t(
                      'modalForm.system.system_qus_tip',
                    )}?` //您确定要停用${record.name}吗?
                  : `${$t('modalForm.system.system_to_on_tip')}${record.name}${$t(
                      'modalForm.system.system_qus_tip',
                    )}?`, //您确定要开启${record.name}吗?
              ),
            },
            {
              label: $t('common.editorText'), //编辑
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: $t('common.delText'), //删除
              icon: 'ant-design:delete-outlined',
              color: 'error',
              onClick: showConfirm.bind(
                null,
                record,
                'del',
                $t('modalForm.system.system_remove_received_tip') + '？',
              ), //您确定删除该佣金方案吗
            },
            {
              label: $t('modalForm.member.member_config'), //佣金配置
              icon: 'ant-design:delete-outlined',
              onClick: handleCommissionConfig.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <AddCommissionPlanModal @register="registerModal" />
    <CommissionConfigModal @register="registerCommissionConfigModal" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, ComponentPublicInstance } from 'vue';

  import { Button } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction, FetchParams } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import { columns, searchFormSchema } from './commissionPlan.data';
  // import { filterEmptyParams } from '/@/utils/helper/paramsHelper';
  import { openConfirm } from '/@/utils/confirm';
  import AddCommissionPlanModal from './component/AddCommissionPlanModal.vue';
  import CommissionConfigModal from './component/CommissionConfigModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  // 定义组件类型
  type ComponentType = ComponentPublicInstance<{
    reload: (opt?: FetchParams | undefined) => Promise<void>;
  }>;

  export default defineComponent({
    name: 'CommissionPlan',
    components: {
      BasicTable,
      Button,
      //   BasicForm,
      TableAction,
      PageWrapper,
      AddCommissionPlanModal,
      CommissionConfigModal,
    },
    setup() {
      const displayChange = ref(true);
      const activeTableKey = ref<number>(0);
      const activeTable = ref('PrePaymentActivateTable');
      const componentRef = ref<ComponentType | null>(null);

      const [registerModal, { openModal }] = useModal();
      const [registerCommissionConfigModal, { openModal: openCommissionConfigModal }] = useModal();

      const [registerTable, { reload }] = useTable({
        // api: getPaymentPlatformList,
        dataSource: [{ id: 1 }],
        columns,
        bordered: true,
        showIndexColumn: false,
        showTableSetting: true,
        actionColumn: {
          width: 300,
          title: t('business.common_operate'), //操作
          dataIndex: 'action',
          fixed: false,
          slots: { customRender: 'action' },
        },
        formConfig: {
          schemas: searchFormSchema,
          actionColOptions: {
            class: 't-form-col',
            xxl: 10,
            xl: 10,
            lg: 10,
          },
          showResetButton: false,
          showAdvancedButton: false,
        },
        useSearchForm: true,
        beforeFetch: (params) => {
          return { ...params, state: 1 };
        },
      });

      function showConfirm(record, type, msg) {
        //操作确认
        openConfirm(t('table.member.member_oprate_tip'), msg, () => {
          if (type === 'use') {
            // handleDeactivate(record);
          } else if (type === 'del') {
            // handleDelete(record);
          }
        });
      }

      function chanceActiveTable(name): void {
        activeTable.value = name;
      }

      function addCommissionPlan(): void {
        openModal(true);
      }

      function handleEdit(record: Recordable): void {
        openModal(true, { record, isEdit: true });
      }

      function handleCommissionConfig(record: Recordable): void {
        openCommissionConfigModal(true, { record });
      }

      async function submitFunc(): Promise<void> {
        try {
          const values = await validate();
          //   componentRef.value &&
          //     componentRef.value[activeTableKey.value].reload({
          //       searchInfo: filterEmptyParams(values),
          //     });
        } catch (e) {
          console.error(e);
        }
      }

      return {
        displayChange,
        openCommissionConfigModal,
        registerCommissionConfigModal,
        addCommissionPlan,
        handleEdit,
        handleCommissionConfig,
        registerModal,
        registerTable,
        showConfirm,
      };
    },
  });
</script>
