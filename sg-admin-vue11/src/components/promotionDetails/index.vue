<template>
  <div>
    <div class="w-full dama-detail">
      <!-- <cdButtonCurrency
        :btn-list="currentList"
        @change-button-currency="changeClick"
        v-model="activeKey"
      /> -->
    </div>
    <BasicTable
      @register="registerTable"
      class="dama-table"
      :scroll="{
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
  import { GetBetDetailchannel } from '/@/api/member/index';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import Dialog from './dialog.vue';
  import { useModal } from '/@/components/Modal';
  import { getColumnWidth } from '/@/utils/helper/tableHelper';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { currentyOptions, deviceMap } from '/@/settings/commonSetting';

  const props = defineProps<{
    uid: any;
  }>();

  const { getCurrencyList } = useCurrencyStore();
  const { currencyTreeList } = useTreeListStore();
  const activeKey = ref('');
  const { t } = useI18n();
  const currentList = ref([...currencyTreeList] as any);

  const [registerModal, { openModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    api: GetBetDetailchannel,
    showIndexColumn: false,
    immediate: false,
    beforeFetch: (params) => {
      return { uid: props.uid, page: 1, page_size: 10, ...params };
    },
    columns: [
      {
        title: t('business.common_currency'),
        dataIndex: 'currency_name',
        align: 'center',
        customRender: ({ record }) =>
          h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
        minWidth: 80,
      },
      {
        title: t('table.promotion.promotion_tunnel_ID'),
        dataIndex: 'channel_id',
        align: 'center',
        width: getColumnWidth(t('table.finance.finance_Change_amount'), 'channel_id', []),
        customRender: ({ record }) => {
          return record.channel_id === 0 ? '-' : record.channel_id;
        },
      },
      {
        title: t('table.promotion.promotion_domain'), // 推广链接
        dataIndex: 'link_url',
        align: 'center',
        // width: getColumnWidth(t('table.promotion.promotion_domain'), 'link_url', []),
      },
      {
        title: t('table.report.report_add_member'),
        dataIndex: 'reg_count',
        align: 'center',
        width: getColumnWidth(t('table.report.report_add_member'), 'reg_count', []),
      },
      {
        title: t('table.promotion.promotion_fist_deposition_member'),
        dataIndex: 'first_deposit_count',
        align: 'center',
        width: getColumnWidth(
          t('table.promotion.promotion_fist_deposition_member'),
          'first_deposit_count',
          [],
        ),
      },
      {
        title: t('table.promotion.promotion_onDate_first_deposition'),
        dataIndex: 'first_deposit_count_by_reg',
        align: 'center',
        width: getColumnWidth(
          t('table.promotion.promotion_onDate_first_deposition'),
          'first_deposit_count_by_reg',
          [],
        ),
      },
      {
        title: t('table.report.report_deposit_amount_total'), // 存款金额
        dataIndex: 'first_deposit_amount',
        align: 'center',
        width: getColumnWidth(
          t('table.report.report_deposit_amount_total'),
          'first_deposit_amount',
          [],
        ),
        customRender: ({ record }) => {
          return !record.first_deposit_amount ? '0' : record.first_deposit_amount;
        },
      },
      {
        title: t('table.promotion.promotion_take_amount'),
        dataIndex: 'withdraw_amount',
        align: 'center',
        width: getColumnWidth(t('table.promotion.promotion_take_amount'), 'withdraw_amount', []),
        customRender: ({ record }) => {
          return !record.withdraw_amount ? '0' : record.withdraw_amount;
        },
      },
      {
        title: t('table.race_price.table_valid_bet'),
        dataIndex: 'valid_bet_amount',
        align: 'center',
        width: getColumnWidth(t('table.race_price.table_valid_bet'), 'valid_bet_amount', []),
        customRender: ({ record }) => {
          return !record.valid_bet_amount ? '0' : record.valid_bet_amount;
        },
      },
      {
        title: t('table.risk.report_register_deviceno'),
        dataIndex: 'reg_device',
        align: 'center',
        customRender: ({ record }) => {
          if (!record.reg_device) {
            return '0';
          }
          const data = Object.entries(JSON.parse(record.reg_device))
            .map(([platformId, count]) => `${deviceMap[platformId]}: ${count}`)
            .join('\n');
          return h(
            'div',
            {
              style: { 'white-space': 'pre-line', overflow: 'hidden' },
            },
            data || '-',
          );
        },
        width: getColumnWidth(t('table.risk.report_register_deviceno'), 'reg_device', []),
      },
      {
        title: t('table.promotion.promotion_tunnel_visitor_amount'),
        dataIndex: 'uv',
        align: 'center',
        width: getColumnWidth(t('table.promotion.promotion_tunnel_visitor_amount'), 'uv', []),
      },
      // {
      //   title: t('business.common_operate'),
      //   dataIndex: '',
      //   slots: { customRender: 'action' },
      //   minWidth: 100,
      //   ifShow: !isControlValueSet(),
      // },
    ],
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
