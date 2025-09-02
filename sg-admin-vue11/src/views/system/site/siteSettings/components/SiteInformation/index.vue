<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }">
      <template #currency="{ record }">
        <template v-if="currencyAllTreeList.length === record.currency_ids.length"
          >{{ t('business.common_all') }}
        </template>
        <template v-else>
          <CurrencyDisplay
            :currency_names="currencyIsAll(record.currency_ids)"
            :currencyTreeList="currencyAllTreeList"
          />
        </template>
      </template>
      <template #maintain="{ record }">
        <div
          :class="
            String(record.maintain) === '1'
              ? 'text-green'
              : String(record.maintain) === '2'
              ? '#f59a23'
              : 'text-red'
          "
        >
          {{ maintainText(record.maintain) }}
        </div>
      </template>
      <template #backup_domain="{ record }">
        <div class="flex justify-center">
          <span class="whitespace-nowrap">{{ t('table.system.main') }}：</span>
          <Tooltip :title="record?.domain">
            <span class="truncate max-w-[160px]">{{ record.domain }}</span>
          </Tooltip>
          <Button type="link" size="small" @click="handleCopy(record.domain)"
            >{{ t('common.copy') }}
          </Button>
        </div>
        <div class="flex justify-center">
          <span class="whitespace-nowrap">{{ t('table.system.prepare') }}：</span>
          <Tooltip :title="record?.backup_domain">
            <span class="truncate max-w-[160px]">{{ record.backup_domain }}</span>
          </Tooltip>
          <Button type="link" size="small" @click="handleCopy(record.backup_domain)"
            >{{ t('common.copy') }}
          </Button>
        </div>
      </template>
      <template #siteFee>
        <DetailReloadTooltip
          class="detailTooltip"
          :totalAmount="balanceInfor?.['USDT']"
          :list="changeList(balanceInfor)"
          @reload="reloadSucess"
        />
      </template>
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: t('common.maintenance'),
              onClick: safeguard.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <CurrencyUsedModal @register="registerCurrencyUsedModal" />
    <SafeGuardModal @register="registerSafeGuardModal" @success="success" />
    <AppAddCurrencyModal @register="registerRateModal" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, unref } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { Button, Tooltip, message } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import { useI18n } from '@/hooks/web/useI18n';
  import { columns } from './index.data';
  import { configList, detailMaintain } from '@/api/sys';
  import { useCurrencyStore } from '@/store/modules/currency';
  import CurrencyUsedModal from './components/CurrencyUsedModal.vue';
  import SafeGuardModal from './components/SafeGuardModal.vue';
  import AppAddCurrencyModal from '@/components/Application/src/AppAddCurrencyModal.vue';
  import { useModal } from '@/components/Modal';
  import { getFirstProperty } from '@/utils/common';
  import { useUserStore } from '@/store/modules/user';
  import { getfinanceBalance } from '@/api/finance';
  import { useMaintainStatus } from '@/views/system/common/const';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { DetailReloadTooltip } from '/@/components/DetailReloadTooltip/index';
  import CurrencyDisplay from '/@/components-cd/Icon/CurrencyDisplay.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { maintainStatus } = useMaintainStatus();
  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const { getCurrencyList } = useCurrencyStore();
  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const { currencyAllTreeList } = useTreeListStore();
  const [registerCurrencyUsedModal, { openModal: WithdrawalMethod }] = useModal();
  const [registerSafeGuardModal, { openModal: openSafeGuardModal }] = useModal();
  const [registerRateModal, { openModal: openBalanceModal }] = useModal();

  export default defineComponent({
    name: 'SiteConfiguration',
    components: {
      Button,
      Tooltip,
      BasicTable,
      PageWrapper,
      TableAction,
      CurrencyUsedModal,
      SafeGuardModal,
      AppAddCurrencyModal,
      DetailReloadTooltip,
      CurrencyDisplay,
    },
    setup() {
      const { t } = useI18n();
      const [registerTable, { reload }] = useTable({
        api: async () => {
          const res = await configList();
          return [res];
        },
        columns,
        formConfig: {
          labelWidth: 120,
          // schemas,
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
      });

      async function safeguard(record: Recordable): void {
        try {
          const res = await detailMaintain();
          if (!res) return;

          const { maintain, maintain_start_time, maintain_end_time, maintain_content } =
            res.maintain;

          let data = {
            maintain,
            maintain_start_time,
            maintain_end_time,
            maintain_content,
          };

          openSafeGuardModal(true, { data, reloadData: reload });
        } catch (e) {
          console.error(e);
        }
      }

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

      async function getBalance() {
        const res = await getfinanceBalance({ site_code: info['prefix'] || 'dev' });
        balanceInfor.value = res;
        updateBalance(res);
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

      function recharge() {
        openBalanceModal(true, balanceInfor.value);
      }

      function currencyIsAll(json_string) {
        const currencyData = JSON.parse(json_string);
        const currency = getCurrencyList;
        var currencyArray = [];
        var currencyDataKeys = [];
        for (var i = 0; i < currency.length; i++) {
          currency[i].inUsed = true;
          if (currencyData[currency[i].id] === 2) {
            currency[i].inUsed = false;
          }
          if (currencyData[currency[i].id] === 1) {
            currencyArray.push(JSON.parse(JSON.stringify(currency[i])));
          }
        }
        for (let key in currencyData) {
          currencyDataKeys.push(key);
        }
        return currencyArray.map((item: any) => {
          return item?.name;
        });
      }

      function currencyModal(record: { currency_ids: number[] }): void {
        const data = currencyIsAll(record.currency_ids) || [];
        WithdrawalMethod(true, data);
      }

      function maintainText(status) {
        return maintainStatus[status];
      }

      function reloadSucess() {
        getBalance();
      }

      function handleCopy(value) {
        if (!value) {
          message.warning(t('business.common_copy_tip'));
          return;
        }
        clearClipboard();
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          message.success(t('business.common_copy_suceess'));
        }
      }

      function success() {
        reload();
      }

      function changeList(val) {
        const result = Object.keys(val).map(function (key) {
          return {
            label: key,
            value: val[key],
          };
        });
        const filterCurrency = ['USDT', 'BTC', 'ETH'];
        const res = result.filter((item) => {
          return filterCurrency.includes(item.label);
        });
        return res;
      }

      onMounted(() => {
        getBalance();
      });
      return {
        registerTable,
        t,
        safeguard,
        recharge,
        currencyIsAll,
        currencyModal,
        registerCurrencyUsedModal,
        handleCopy,
        WithdrawalMethod,
        openSafeGuardModal,
        openBalanceModal,
        registerSafeGuardModal,
        registerRateModal,
        getBalance,
        maintainText,
        success,
        balanceBoolean,
        getCurrencyList,
        balanceInfor,
        changeList,
        reloadSucess,
        currencyAllTreeList,
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

  ::v-deep(.detailTooltip) {
    color: red;
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
