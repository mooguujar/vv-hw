<template>
  <div class="flex relative balance-box">
    <div class="flex justify-center items-center t-form-label h-8">
      <Dropdown
        @click="siteRouter"
        placement="bottomLeft"
        :overlayClassName="`${prefixCls}-dropdown-overlay`"
      >
        <div class="text-slate-700 mr-1 ml-2 cursor-pointer"
          >{{ selectValues['label']
          }}<img class="money-icon ml-2 mr-2" src="../../../assets/images/dollor.webp"
        /></div>
        <template #overlay> </template>
      </Dropdown>
      <div
        class="text-slate-700 mx-1 cursor border-1 border-black-300 rounded-full h-6 w-6 flex items-center justify-center wallet"
        @click="handleChange"
        v-if="balanceBoolean"
        ><img src="../../../assets/images/wallet.webp"
      /></div>
    </div>
    <AppAddCurrencyModal @register="registerRateModal" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, onBeforeMount, defineAsyncComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import { Dropdown, Menu } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import AppAddCurrencyModal from './AppAddCurrencyModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getfinanceBalance } from '/@/api/finance';
  import { useUserStore } from '/@/store/modules/user';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const MenuItem = defineAsyncComponent(
    () => import('@/layouts/default/header/components/user-dropdown/DropMenuItem.vue'),
  );
  // import MenuItem from '@/layouts/default/header/components/user-dropdown/DropMenuItem.vue';

  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const selectValues = ref('BTC');
  const balanceBoolean = ref(true);
  const balanceInfor = ref({});

  const router = useRouter();

  const { prefixCls } = useDesign('header-user-dropdown');
  let activeMenuItem = ref('');
  // USDT：₮、BTC：₿、ETH：Ξ
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

  const [registerRateModal, { openModal: openBalanceModal }] = useModal();

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
    selectValues.value = balanceList.value.find((element) => element.value === res.currency_name);
  }
  const handleChange = async () => {
    if (isControlValueSet()) return;
    openBalanceModal(true, balanceInfor.value);
  };
  const siteRouter = async () => {
    router.push({ name: 'SiteSettings', query: { tabValue: 1 } });
  };

  onMounted(() => {
    getBalance();
    eventBus.on('RefreshBalance', (res: any) => {
      updateBalance(res);
    });
  });

  onBeforeMount(() => {
    eventBus.off('RefreshBalance');
  });
</script>
<style lang="less" scoped>
  .t-form-label {
    padding-left: 0.2em !important;
    transition: all 0.3s;
    border: 1px solid #d9d9d9;
    border-radius: 6px;

    &__title {
    }

    &:hover,
    &:focus {
      border-color: @primary-color;
      box-shadow: 0 0 0 2px rgb(9 96 189 / 20%);
    }

    .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
      height: 30px !important;
    }

    .ant-select-clear,
    .ant-select-arrow {
      right: 5px;
    }

    .ant-select-selector,
    .ant-picker,
    .ant-input-affix-wrapper {
      width: 100% !important;
      padding-right: 0 !important;
      padding-left: 4px !important;
    }

    .ant-picker {
      padding-right: 6px !important;
    }

    .ant-input-affix-wrapper {
      padding-top: 4px !important;
      padding-bottom: 4px !important;
    }

    .ant-picker-input > input:focus,
    .ant-picker-input > input-focused,
    .ant-picker,
    .ant-input,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused,
    .ant-input-affix-wrapper:hover {
      border: 0 !important;
      background-color: transparent !important;
      box-shadow: none !important;
    }
  }
  @header-prefix-cls: ~'@{namespace}-layout-header';
  // 有分Light 与 Dark
  .@{header-prefix-cls} {
    &--light {
      .text-slate-700 {
        color: @text-color-base;
      }
    }

    &--dark {
      .text-slate-700 {
        color: @white;
      }
    }
  }

  .balance-box {
    height: 44px;
    padding: 0;
    border: none;
    background-color: #0f212e;
    line-height: 44px;

    .t-form-label {
      height: 44px;
      border: none;
      line-height: 44px;
    }

    .money-icon {
      width: 18px;
      height: 18px;
      margin-bottom: 3px;
    }

    /deep/.t-form-label:hover {
      border: none !important;
      box-shadow: none !important;
    }
  }

  .wallet {
    width: 48px;
    height: 44px;
    margin: 0;
    border: none;
    border-radius: 0;
    background-color: #1475e1;

    img {
      width: 18.39px;
      height: 18px;
      margin: auto;
    }
  }
</style>
