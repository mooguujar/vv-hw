<template>
  <div class="charge__detail__modal" ref="main">
    <BasicModal
      @register="registerUpdateModal"
      :title="t('business.common_detail')"
      v-bind="$attrs"
      :width="1000"
      cancelText=""
      :destroyOnClose="true"
      :okButtonProps="{ style: { display: 'none' } }"
      :getContainer="() => $refs.main"
      :footer="null"
    >
      <div class="flex justify-center items-center">
        <BasicTable
          @register="registerDetailTable"
          :scroll="{ x: true, y: 300 }"
          class="!p-0 with-more-input"
        />
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { dataColumns } from './index.data';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getPromoDepositOrderList } from '/@/api/activity';
  import { ref } from 'vue';

  const recordId = ref<any[]>([]);
  const { t } = useI18n();
  const [registerUpdateModal, { closeModal }] = useModalInner(async (data) => {
    recordId.value = data;
    reload();
  });

  const [registerDetailTable, { reload }] = useTable({
    api: getPromoDepositOrderList,
    columns: dataColumns,
    bordered: true,
    useSearchForm: false,
    showIndexColumn: false,
    immediate: false,
    formConfig: {
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showActionButtonGroup: false,
    },
    beforeFetch: (params) => {
      setDateParmaTime(params);
      setDateParmas(params);
      params.record_id = recordId.value.id;
      params.currency_id = recordId.value.currency_id;
      return params;
    },
  });
  // async function okSubmit() {
  //   closeModal();
  // }
</script>
<style scoped lang="less">
  .charge__detail__modal {
    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding: 20px;
      padding-left: 10px;
    }
  }
</style>
