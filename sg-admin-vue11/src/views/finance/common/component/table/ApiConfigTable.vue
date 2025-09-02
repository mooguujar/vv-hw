<template>
  <PageWrapper :contentStyle="{ margin: '10px', marginLeft: '20px' }">
    <div class="pb-3 mb-3 t-form-label-com" v-if="auths(['20804', '20810'])">
      <Space :size="10">
        <Button type="primary" v-if="isHasAuth('20804')" @click="handleAddConfig">{{
          t('table.finance.finance_add_payment_configuration')
        }}</Button>
        <Button type="primary" v-if="isHasAuth('20810')" @click="handleConfigDetail"
          >{{ t('table.finance.finance_add_payment_detail') }}
        </Button>
      </Space>
    </div>

    <BasicTable @register="registerTable">
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: t('common.editorText'),
              onClick: editConfig.bind(null, record),
              ifShow: isHasAuth('20805'),
            },
            {
              label: t('table.finance.finance_copy_configuration'),
              onClick: copyConfig.bind(null, record),
              ifShow: isHasAuth('20809'),
            },
            {
              label: t('common.delText'),
              color: 'error',
              onClick: delConfig.bind(null, record),
              ifShow: isHasAuth('20807'),
            },
          ]"
        />
      </template>
    </BasicTable>
    <apiPaymentDetails @register="registerDetails" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Space, Button, message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { openConfirm } from '/@/utils/confirm';
  import apiPaymentDetails from '../modal/ApiPaymentDetails.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auths, isHasAuth } from '@/utils/authFunction';

  const { t } = useI18n();
  const router = useRouter();
  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
  });

  const [registerTable, { reload, getColumns, setColumns }] = useTable({
    api: props.apiMap.list,
    columns: props.apiMap.columns,
    showIndexColumn: false,
    bordered: true,
    actionColumn: {
      // width: 150,
      title: t('business.common_operate'), //操作
      slots: { customRender: 'action' },
      ifShow: auths(['20805', '20809', '20807']),
      // fixed: 'right',
    },
  });
  const [registerDetails, { openModal }] = useModal();
  // 添加代付配置
  function handleAddConfig() {
    router.push({ name: props.apiMap.addName, params: { id: 0, modalType: 'add' } });
  }
  // 代付配置详情
  function handleConfigDetail() {
    openModal(true, {});
  }
  // 编辑
  function editConfig(record) {
    router.push({ name: 'AddWithdrawalConfig', params: { id: record.id, modalType: 'editor' } });
  }
  // 复制配置
  function copyConfig(record) {
    router.push({ name: 'AddWithdrawalConfig', params: { id: record.id, modalType: 'copy' } });
  }

  // 删除
  async function handleDelete(record: any): Promise<void> {
    try {
      const { status, data } = await props.apiMap.delListItem({
        id: record.id,
      });
      if (status) reload();
      else message.error(data);
    } catch (e) {
      console.error(e);
    }
  }
  function delConfig(record) {
    openConfirm(
      t('modalForm.finance.finance_operation_confirmation'),
      t('modalForm.finance.finance_delete_payment_tip'),
      () => {
        handleDelete(record);
      },
    );
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-table-cell) {
    p {
      margin-bottom: 0;
    }
  }
</style>
