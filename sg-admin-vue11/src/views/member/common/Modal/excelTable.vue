<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('common.ImportMember')"
    width="1200px"
    @register="registerModal"
    @ok="okFun"
    :showOkBtn="false"
    :showCancelBtn="false"
    class="!z-100"
  >
    <BasicTable
      v-for="(table, index) in tableListRef"
      :key="index"
      :title="table.title"
      :columns="columns"
      :dataSource="table.dataSource"
      :showIndexColumn="false"
      :labelWidth="100"
      bordered
    />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, BasicColumn } from '/@/components/Table';
  import { columns, transformData, parseCommissionString } from './ImportMembers.data.ts';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'ExcelTable',
    components: { BasicModal, BasicTable },
    setup() {
      const tableListRef = ref<
        {
          title: string;
          columns?: any[];
          dataSource?: any[];
        }[]
      >([]);

      const [registerModal, { setModalProps, closeModal }] = useModalInner(
        async (excelDataList) => {
          tableListRef.value = [];
          for (const excelData of excelDataList) {
            const {
              header,
              results,
              meta: { sheetName },
            } = excelData;
            const columns: BasicColumn[] = [];

            for (const title of header) {
              columns.push({ title, dataIndex: title });
            }
            const outputData = transformData(results).filter((item) => {
              return item?.username?.trim() !== '';
            });
            tableListRef.value.push({ title: sheetName, dataSource: outputData, columns });
          }
        },
      );

      function okFun() {
        closeModal();
      }

      return {
        registerModal,
        tableListRef,
        okFun,
        columns,
        parseCommissionString,
        t,
      };
    },
  });
</script>

<style lang="less" scoped>
  ::v-deep(.excleData .ant-modal) {
    z-index: 10000;
  }
</style>
