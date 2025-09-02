<template>
  <BasicModal
    v-bind="$attrs"
    :width="800"
    :minHeight="150"
    @register="registerModal"
    :title="title"
    @ok="closeModal"
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div>
      <BasicTable @register="registerTable">
        <template #currency="record">
          <cdIconCurrency :icon="record.value" class="w-20px mr-3px" /><span>{{
            record.value
          }}</span>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable } from '/@/components/Table';
  import { mul } from '/@/utils/number';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();

  export default defineComponent({
    name: 'CurrencyModal',
    components: { BasicModal, BasicTable, cdIconCurrency },
    emits: ['success', 'register'],

    setup(_, { emit }) {
      const title = ref('' as string);
      let tableData: any = ref([]);
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        tableData.value = data.configs;
        title.value = data.title;
      });

      const [registerTable, { reload }] = useTable({
        dataSource: tableData,
        pagination: false,
        columns: [
          {
            title: t('business.common_currency'),
            dataIndex: 'currency_name',
            minWidth: 60,
            slots: { customRender: 'currency' },
          },
          {
            title: t('table.discountActivity.discount_minimum_deposit'), //最低存入金额
            dataIndex: 'min_deposit',
            minWidth: 160,
          },
          {
            title: t('table.discountActivity.discount_year_rate'), //年利率(%)
            dataIndex: 'interest_rate',
            minWidth: 80,
            customRender: ({ record }) => {
              return mul(record.interest_rate, 100) + '%';
            },
          },
        ],
        showIndexColumn: false,
        bordered: true,
        useSearchForm: false,
        // showTableSetting: true,
      });

      return { registerModal, registerTable, closeModal, title, cdIconCurrency };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-radio-button-wrapper) {
    margin-bottom: 10px;
  }
</style>
