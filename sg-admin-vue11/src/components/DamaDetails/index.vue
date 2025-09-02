<template>
  <div>
    <div class="w-full dama-detail">
      <cdButtonCurrency
        :btn-list="currentList"
        @change-button-currency="changeClick"
        v-model="activeKey"
      />
    </div>
    <BasicTable
      @register="registerTable"
      class="dama-table"
      :scroll="{
        x: 'max-content',
        y: 500,
      }"
      bordered
    >
      <template #action="{ record, index }">
        <span
          @click="checkViews(record)"
          class="color-blue-500 cursor-pointer"
          v-if="index === 0"
          >{{ $t('business.common_edit') }}</span
        >
        <span v-else>-</span>
      </template>
    </BasicTable>
    <Dialog @register="registerModal" @success="reload()" />
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, h } from 'vue';

  import { useTable, BasicTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { getBetDetail } from '/@/api/member/index';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import Dialog from './dialog.vue';
  import { useModal } from '/@/components/Modal';
  import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
  import { isControlValueSet } from '/@/utils/domUtils';

  const props = defineProps<{
    uid: any;
  }>();

  const { getCurrencyList } = useCurrencyStore();
  const { currencyTreeList } = useTreeListStore();
  const activeKey = ref('');
  const { t } = useI18n();
  const currentList = ref([...currencyTreeList] as any);
  const columns = [
    {
      title: t('business.common_currency'),
      dataIndex: 'currency_name',
      align: 'center',
      customRender: ({ record }) => h(cdBlockCurrency, { currencyName: record.currency_name }),
    },
    {
      title: t('business.common_type'),
      dataIndex: 'cash_type_name',
      align: 'center',
      customRender: ({ record }) => {
        return record.business_type === 863 || record.business_type == 837
          ? h('div', { style: 'margin-top: -8px; margin-bottom: -8px' }, [
              h(
                'div',
                { class: 'text-ellipsis overflow-hidden whitespace-nowrap' },
                `${record.cash_type_name} ${record.trans_rate != 0 ? `${record.trans_rate}%` : ''}`,
              ),
              record.remark
                ? h(
                    'div',
                    {
                      class: 'text-ellipsis overflow-hidden whitespace-nowrap flex justify-center',
                    },
                    [
                      h('div', null, [
                        h(
                          cdIconCurrency,
                          { icon: record.remark.split(/\s*>\s*/)[0], class: 'w-20px m-x-5px' },
                          record.remark.split(/\s*>\s*/)[0],
                        ),

                        h('span', { class: 'm-r-5px' }, record.remark.split(/\s*>\s*/)[0]),
                      ]),
                      h('span', null, '>'),
                      h('div', null, [
                        h(
                          cdIconCurrency,
                          { icon: record.remark.split(/\s*>\s*/)[1], class: 'w-20px m-x-5px' },
                          record.remark.split(/\s*>\s*/)[1],
                        ),
                        h('span', {}, record.remark.split(/\s*>\s*/)[1]),
                      ]),
                    ],
                  )
                : '',
            ])
          : record.cash_type_name;
      },
    },
    {
      title: t('table.finance.finance_Change_amount'),
      dataIndex: 'amount',
      align: 'center',
    },
    {
      title: t('table.report.report_bet_multiplier'),
      dataIndex: 'multiple',
      align: 'center',
    },
    {
      title: t('business.common_already_coded'),
      dataIndex: 'total_bet_amount',
      align: 'center',
    },
    {
      title: t('business.common_required_coding'),
      dataIndex: 'need_bet_amount',
      align: 'center',
    },
    {
      title: t('sys.errorLog.tableColumnDate'),
      dataIndex: 'time',
      align: 'center',
    },
    {
      title: t('business.common_operate'),
      dataIndex: '',
      slots: { customRender: 'action' },
      minWidth: 120,
      ifShow: !isControlValueSet(),
    },
  ];
  useAutoTableLabelWidth(columns);
  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    api: getBetDetail,
    showIndexColumn: false,
    immediate: false,
    beforeFetch: (params) => {
      return { uid: props.uid, currency_id: activeKey.value, ...params };
    },
    columns: columns,
  });

  function checkViews(record) {
    openModal(true, { data: { ...record, uid: props.uid } });
  }

  function changeClick(v: any) {
    activeKey.value = v;
    reload();
  }

  onMounted(() => {
    if (activeKey.value) {
      reload();
    }
  });

  // 监听 getCurrencyList
  watch(
    () => getCurrencyList,
    () => {
      activeKey.value = getCurrencyList[0].id;
    },
    { immediate: true },
  );

  function customRender(opt: {
    /* __placeholder__ */
    value: any;
    /* __placeholder__ */
    text: any;
    /* __placeholder__ */
    record: Recordable<any>;
    /* __placeholder__ */
    index: number;
    /* __placeholder__ */
    renderIndex: number;
    /* __placeholder__ */
    column: ColumnType<Recordable<any>>;
  }) {
    throw new Error('Function not implemented.');
  }
</script>
<style lang="less" scoped>
  .dama-detail {
    margin-top: -18px;
    margin-bottom: 13px;
    border-bottom: 1px solid #dce3f1 !important;
  }

  .dama-table {
    ::v-deep(.ant-table-container table > thead > tr > th) {
      height: 57px !important;
      background-color: #f6f7fb !important;

      span {
        font-size: 16px !important;
        font-weight: 500 !important;
      }
    }

    ::v-deep(
        .ant-table-container > .ant-table-body > table > tbody > tr:not(.ant-table-measure-row)
      ) {
      height: 57px !important;

      span {
        font-size: 14px !important;
        font-weight: 500 !important;
      }
    }

    ::v-deep(
        .ant-table-container
          > .ant-table-body
          > table
          > tbody
          > tr:nth-child(2n -1):not(.ant-table-measure-row)
      ) {
      height: 57px !important;
      background-color: #f6f7fb !important;
    }

    ::v-deep(.ant-table-thead > tr > th::before) {
      display: none;
    }
  }
</style>
