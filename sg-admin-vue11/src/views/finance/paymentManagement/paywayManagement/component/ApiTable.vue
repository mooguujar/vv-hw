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
        <TableAction
          :actions="[
            {
              label: t('business.common_label_edit'),
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <PaywayModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { MenuOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import PaywayModal from './PaywayModal.vue';
  import { sortmethodList } from '/@/api/finance';
  import { ADDraggableRow } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight540 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight540).value);
  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
  });
  let dataSource = ref<any>([]);

  async function sortTable(targetWork, tempSource) {
    if (!targetWork && !tempSource) {
      return;
    }
    const param = {
      id: tempSource.id,
      index_id: targetWork.id,
      sort_before: tempSource.seq,
      sort_after: targetWork.seq,
      currency_id: props.apiMap.PAGE_ID,
    };
    try {
      const { status, data } = await sortmethodList(param);
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

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload, setTableData, getColumns, setColumns }] = useTable({
    api: outpayList,
    columns: props.apiMap.columns,
    customRow: isHasAuth('20716')
      ? (record, index) => ADDraggableRow(dataSource.value, index, setTableData, sortTable)
      : undefined,
    bordered: true,
    showIndexColumn: false,
    // actionColumn: {
    //   minWidth: 100,
    //   title: t('business.common_operate'), //操作
    //   dataIndex: 'action',
    //   fixed: false,
    //   slots: { customRender: 'action' },
    // },
    formConfig: {
      schemas: props.apiMap.schemas,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
      showAdvancedButton: false,
    },
    useSearchForm: true,
    beforeFetch: (params) => {
      return { ...params };
    },
    afterFetch: (data) => {
      dataSource.value = data;
    },
  });

  async function outpayList(tableParams: { rows: number; page: number }) {
    try {
      const response = await props.apiMap.list({
        ...tableParams,
        currency_id: String(props.apiMap.PAGE_ID),
      });
      // 為了取得原始資料做的middle ware
      dataSource.value = response.d;
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  function handleSuccess() {
    reload();
  }
  defineExpose({ reload });
  function handleEdit(record: Recordable): void {
    openModal(true, { record, isEdit: true });
  }
</script>
<style scoped lang="scss">
  ::v-deep(.columnSelectBar) {
    cursor: pointer;

    td:first-child {
      cursor: pointer;
    }
  }

  .vben-basic-table-form-container {
    padding: 0;
  }
</style>
