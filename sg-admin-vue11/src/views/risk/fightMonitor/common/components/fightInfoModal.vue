<template>
  <main>
    <BasicModal
      :maxHeight="550"
      :width="1000"
      :title="title"
      :showOkBtn="false"
      :showCancelBtn="false"
      @register="registerModal"
      :destroyOnClose="true"
    >
      <BasicTable @register="registerTable">
        <template #betContent="{ column, record }">
          <div v-if="record.detail_a.length == 0"> - </div>
          <div v-else-if="record.detail_a.length == 1">
            <Tooltip>
              <template #title>
                <span> {{ record.detail_a[0].element || '-' }}</span>
              </template>
              <div> {{ record.detail_a[0].element || '-' }}</div>
            </Tooltip>
            <div class="text-red"> @{{ record.detail_a[0].odds }} </div>
          </div>
          <Divider />
          <div v-if="record.detail_b.length == 0"> - </div>
          <div v-else-if="record.detail_b.length == 1">
            <Tooltip>
              <template #title>
                <span> {{ record.detail_b[0].element || '-' }}</span>
              </template>
              <div> {{ record.detail_b[0].element || '-' }}</div>
            </Tooltip>
            <div class="text-red"> @{{ record.detail_b[0].odds }} </div>
          </div>
        </template>
      </BasicTable>
    </BasicModal>
  </main>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from './fightInfoModal.data.ts';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFightDetailList } from '/@/api/risk';
  import { Tag, Tooltip, Divider } from 'ant-design-vue';
  import { useTreeListStore } from '/@/store/modules/treeList';

  const { currencyTreeList } = useTreeListStore();
  const { t } = useI18n();
  const title = ref('' as string);
  let pid;
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    let currency = currencyTreeList.find((item) => item.id == data.currency_id);
    // 对打详情 ｜ 币种总览
    title.value = `${t('table.risk.report_fight_info')}  ｜    ${
      currency ? currency.label : t('business.common_currency_all')
    }`;
    pid = data.id;
  });
  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: getFightDetailList,
    columns,
    showIndexColumn: false,
    bordered: true,
    maxHeight: 450,
    pagination: true,
    beforeFetch: async (params) => {
      params['pid'] = pid;
      return params;
    },
    afterFetch: (data) => {
      data = data.map((item) => {
        if (item.detail_a) item.detail_a = JSON.parse(item.detail_a);
        if (item.detail_b) item.detail_b = JSON.parse(item.detail_b);
        return item;
      });
      return data;
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-table-wrapper .ant-table-title) {
    min-height: 0 !important;
  }
  ::v-deep(.ant-divider-horizontal) {
    margin: 10px 0;
  }
</style>
