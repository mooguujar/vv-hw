<template>
  <main>
    <BasicModal
      :width="971"
      :title="title"
      :showOkBtn="false"
      :showCancelBtn="false"
      @register="registerModal"
      :destroyOnClose="true"
      wrapClassName="lowMultipleinfoModal"
    >
      <BasicTable @register="registerTable">
        <template #tableTitle>
          <template v-if="currentList.length > 1">
            <div class="w-full">
              <cdButtonCurrency
                :btn-list="currentList"
                @change-button-currency="changeClick"
                v-model="currency_id"
              />
            </div>
          </template>
        </template>
      </BasicTable>
    </BasicModal>
  </main>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { columns } from './lowMultipleInfoModal.data';
  import { BasicTable, useTable } from '/@/components/Table';
  import { detailLowList } from '/@/api/risk';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const title = ref('' as string);
  const { t } = useI18n();
  const currentList = ref([
    { name: t('table.member.member_money_all'), value: '', lable: 'ALL' },
  ] as any);
  const record = ref({} as any);
  const currency_id = ref('' as any);
  const { currencyTreeList } = useTreeListStore();
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    title.value = `${t('business.common_detail')}   「 ${data.username} 」`;
    record.value = JSON.parse(JSON.stringify(data));
    currency_id.value = '';
  });
  const [registerTable, { reload, getForm, getRawDataSource }] = useTable({
    api: detailLowList,
    columns,
    showIndexColumn: false,
    bordered: true,
    maxHeight: 450,
    pagination: false,
    beforeFetch: async (params) => {
      params['uid'] = record.value.uid;
      params['currency_id'] = currency_id.value;
      return params;
    },
    afterFetch: () => {
      currentList.value = [{ name: t('table.member.member_money_all'), value: '', lable: 'ALL' }];
      let rawDataSource = getRawDataSource();
      if (rawDataSource.n) {
        rawDataSource.n.map((item) => {
          currencyTreeList.map((crrrencyItem) => {
            if (crrrencyItem.id == item.currency_id) currentList.value.push(crrrencyItem);
          });
        });
      }
    },
  });
  function changeClick(v) {
    currency_id.value = v;
    reload();
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-table-wrapper .ant-table-title) {
    min-height: 0 !important;
  }
</style>
