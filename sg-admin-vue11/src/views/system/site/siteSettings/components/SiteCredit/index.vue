<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }">
      <template #state="{ record }">
        <div :style="{ color: siteStyle[record.state] }">{{ maintainText(record.state) }}</div>
      </template>
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: t('common.deposit_coins'),
              onClick: recharge.bind(null, record),
              ifShow: (_action) => {
                return balanceBoolean;
              },
            },
            {
              label: t('common.balanceChange'),
              onClick: safeguard.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <AppAddCurrencyModal @register="registerRateModal" />
    <SiteCreditNotice />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { PageWrapper } from '@/components/Page';
  import { setDateParmas } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks/web/useI18n';
  import { columns } from './index.data';
  import { configList } from '@/api/sys';
  import { useModal } from '@/components/Modal';
  import AppAddCurrencyModal from '@/components/Application/src/AppAddCurrencyModal.vue';
  import SiteCreditNotice from './components/SiteCreditNotice.vue';
  import { getfinanceBalance } from '@/api/finance';
  import { useUserStore } from '@/store/modules/user';
  import { useSitesStatus, siteStyle } from '@/views/system/common/const';
  import { isControlValueSet } from '/@/utils/domUtils';

  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const { sitesStatus } = useSitesStatus();
  export default defineComponent({
    name: 'SiteCredit',
    components: {
      BasicTable,
      PageWrapper,
      TableAction,
      AppAddCurrencyModal,
      SiteCreditNotice,
    },
    emits: ['on-click'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const balanceInfor = ref({});
      const balanceBoolean = ref(false);
      const balanceList = ref<any>([
        {
          value: 'BTC',
          label: '',
          symbol: '₿',
          disabled: true,
        },
        {
          value: 'ETH',
          label: '',
          symbol: 'Ξ',
          disabled: true,
        },
        {
          value: 'USDT',
          label: '',
          symbol: '₮',
          disabled: true,
        },
      ]);
      const selectValues = ref('BTC');
      const [registerRateModal, { openModal: openBalanceModal }] = useModal();
      const [registerTable, { getForm, getColumns, setColumns }] = useTable({
        api: async () => {
          const res = await configList();
          return [res];
        },
        columns,
        formConfig: {
          labelWidth: 120,
          actionColOptions: {
            class: 't-form-col',
            xxl: 12,
            xl: 12,
            lg: 12,
          },
        },
        actionColumn: {
          title: t('business.common_operate'),
          dataIndex: 'action',
          slots: { customRender: 'action' },
          ifShow: !isControlValueSet(),
        },
        bordered: true,
        showIndexColumn: false,
        showTableSetting: false,
        beforeFetch: (params) => {
          setDateParmas(params);
          return params;
        },
      });

      function safeguard(record) {
        emit('on-click', record);
      }
      function updateBalance(res) {
        balanceBoolean.value = res['display_site_merchant'];
        balanceList.value.forEach((el) => {
          if (res.hasOwnProperty(el.value)) {
            el.label = res[el.value];
          }
        });
        selectValues.value = balanceList.value.find(
          (element) => element.value === res.currency_name,
        );
      }
      function maintainText(status) {
        return sitesStatus[status];
      }
      async function getBalance() {
        const res = await getfinanceBalance({ site_code: info['prefix'] || 'dev' });
        balanceInfor.value = res;
        updateBalance(res);
      }
      function recharge() {
        openBalanceModal(true, balanceInfor.value);
      }
      onMounted(() => {
        getBalance();
      });
      return {
        registerTable,
        registerRateModal,
        t,
        safeguard,
        recharge,
        getBalance,
        maintainText,
        siteStyle,
        balanceBoolean,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-picker) {
    width: 100%;
  }

  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .resize-item-box {
    display: inline-block;
    position: relative;
    width: auto;
  }

  .resize-item {
    display: flex;
  }
</style>
