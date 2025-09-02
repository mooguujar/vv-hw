<template>
  <div>
    <PageWrapper :content-style="{ margin: '10px', marginLeft: '20px' }">
      <div class="t-form-label-com mb-3" v-if="auths(['20602', '20615'])">
        <Button
          type="primary"
          class="mb-3 mt-1"
          v-if="isHasAuth('20602')"
          @click="toAddDepositCardPage"
        >
          {{ $t('modalForm.finance.finance_help_platform') }}
        </Button>
        <Button
          type="primary"
          v-if="isHasAuth('20615')"
          class="mb-3 mt-1 ml-2"
          @click="toWithdrawalMethod"
        >
          {{ $t('modalForm.finance.finance_withdrawal_method') }}
        </Button>
        <!-- <Button type="primary" class="mb-3 mt-1 ml-2" @click="toHandlingFeeModal">
          {{ $t('modalForm.finance.finance_fee_configuration') }}
        </Button> -->
      </div>
      <div class="mt-3px mb-8px">
        <a-button
          :type="currencyType == 'Fiat' ? 'primary' : ''"
          :size="'large'"
          class="mr-2.5"
          @click="handCurrency('Fiat')"
          >{{ $t('business.Fiat_currency') }}</a-button
        >
        <a-button
          :size="'large'"
          :type="currencyType === 'encryption' ? 'primary' : ''"
          @click="handCurrency('encryption')"
          >{{ $t('business.cryptocurrency_currency') }}</a-button
        >
      </div>
      <div>
        <div class="pay-bottom">
          <cdButtonCurrency
            :btn-list="achieveList?.map((item) => ({ name: item.name, value: item.key }))"
            v-model="activeKey"
          />
          <div class="mt-12px mb--13px" v-show="method_list.length > 1">
            <a-button
              v-for="item in method_list"
              :type="type_id == item.value ? 'primary' : ''"
              :size="'large'"
              class="mr-10px mb-10px"
              @click="type_id = item.value"
              >{{ item.label }}</a-button
            >
          </div>
          <receiveBankTable
            :apiMap="currentCurrency?.apiMap"
            :activeKey="activeKey"
            :type_id="type_id"
            ref="componentRef"
          />
        </div>
      </div>
      <addReceiveCardForm
        @register="registerCardForm"
        @diamondsuccess="diamondsuccess"
        :activeKey="activeKey"
        :isToAddDepositCardPage="isToAddDepositCardPage"
      />
      <addWithdrawalMethod @register="registerWithdrawalMethod" @diamondsuccess="diamondsuccess" />
      <HandlingFeeModal_m @register="registerHandlingFeeModal" />
    </PageWrapper>
  </div>
</template>

<script lang="ts" setup>
  // import { Tabs, RadioGroup, RadioButton } from 'ant-design-vue';
  import { computed, defineComponent, ref, watch } from 'vue';
  import { auths, isHasAuth } from '@/utils/authFunction';
  import { Button } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';
  import { pixColumns } from './pixTable.data';
  import receiveBankTable from './component/receiveBankTable.vue';
  import addReceiveCardForm from './component/addReceiveCardForm.vue';
  import { useMemberStore } from '/@/store/modules/member';
  import { getWithdrawFee, getwithdrawList, getwithdrawTypeCurrency } from '/@/api/finance';
  import { useModal } from '/@/components/Modal';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { getFirstProperty, isVirtualCurrency } from '/@/utils/common';
  import addWithdrawalMethod from './component/addWithdrawalMethod.vue';
  import HandlingFeeModal_m from './component/HandlingFeeModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import eventBus from '/@/utils/eventBus';

  const { t } = useI18n();
  const { getCurrencyList } = useCurrencyStore();
  const achieveList = ref<any[]>([]);
  let componentRef = ref();
  let activeKey = ref(getFirstProperty()?.id || '701');
  let currencyType = ref('Fiat');
  let method_list = ref<any>([]);
  let type_id = ref<any>('');
  let isToAddDepositCardPage = ref(false);

  eventBus.on('setMethod_list', (data: any) => {
    method_list.value = data.filter((item) => item.state == 1);
    type_id.value = method_list.value[0]?.value || '';
  });

  function handCurrency(type) {
    currencyType.value = type;
    if (type == 'Fiat') filterCurrency(1);
    else filterCurrency(2);
  }

  function createAchieveListItem(item: any, columns: any, type: any) {
    return {
      ...item,
      key: item.id,
      name: item.name,
      component: 'receiveBankTable',
      apiMap: {
        PAGE_TYPE: item.id,
        pageName: item.name,
        columns: columns,
        modalType: type,
        list: getwithdrawList,
      },
    };
  }
  let allCurrencyList = <any>[];
  getCurrencyList.forEach((item) => {
    const columns = pixColumns;
    const type = isVirtualCurrency(item.id) ? 1 : 0;
    // achieveList.value.push(createAchieveListItem(item, columns, type));
    allCurrencyList.push(createAchieveListItem(item, columns, type));
  });
  const currentCurrency = computed(() =>
    achieveList.value.find((item) => item.key === activeKey.value),
  );

  watch(currentCurrency, () => {
    componentRef.value?.reload();
  });

  function filterCurrency(type) {
    achieveList.value = allCurrencyList.filter((el) => el.attr == type);
    if (achieveList.value.length > 0) activeKey.value = achieveList?.value[0]?.id ?? '';
  }
  filterCurrency(1);
  const memberStore = useMemberStore();
  // 获取层级下拉
  memberStore.getLevelList();

  const [registerCardForm, { openModal: CardForm }] = useModal();

  const [registerWithdrawalMethod, { openModal: WithdrawalMethod }] = useModal();

  const [registerHandlingFeeModal, { openModal: HandlingFeeModal }] = useModal();

  function toAddDepositCardPage(): void {
    isToAddDepositCardPage.value = true;
    eventBus.emit('isToAddDepositCardPage', true);
    CardForm(true, {});
  }

  // async function toHandlingFeeModal() {
  //   const res = await getWithdrawFee();
  //   HandlingFeeModal(true, res);
  // }

  async function toWithdrawalMethod() {
    const res = await getwithdrawTypeCurrency({ state: 1 });

    // const resnew = Object.keys(res).reduce((acc, key) => {
    //   if (res[key].length > 1) {
    //     acc[key] = res[key];
    //   }
    //   return acc;
    // }, {});

    WithdrawalMethod(true, res);
  }

  function diamondsuccess(id, type?) {
    let close_ = true;
    if (typeof id === 'object') {
      close_ = false;
      type = id.methodsOptions;
      id = id.currency_id_;
    } else {
      CardForm(false, {});
    }
    activeKey.value = id;
    if (!!!achieveList.value.find((item) => item.key === id)) {
      if (currencyType.value == 'Fiat') {
        currencyType.value = 'encryption';
        filterCurrency(2);
      } else {
        currencyType.value = 'Fiat';
        filterCurrency(1);
      }
    }
    if (!!type) {
      if (Array.isArray(type)) {
        let arr: any = [];
        type.forEach((element) => {
          if (element.state == 1) {
            const { name, state, id } = element;
            arr.push({
              label: name,
              state,
              value: id,
            });
          }
        });
        method_list.value = arr;
        type_id.value = method_list.value[0]?.value || '';
      } else {
        setTimeout(() => {
          type_id.value = type;
        }, 1555);
      }
    }
    // let len = componentRef.value?.length||0;
    const firstPropertyId = getFirstProperty()?.id;
    if (!firstPropertyId) return;
    if (firstPropertyId == id) {
      componentRef.value && componentRef.value.diamondsuccess();
    } else {
      if (componentRef.value) {
        componentRef.value?.diamondsuccess();
      }
    }
  }
  eventBus.on('diamondsuccess', diamondsuccess);
</script>

<style lang="less" scoped>
  .pay-bottom {
    border-radius: 3px;
    //background-color: @component-background;
  }

  :deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 0 20px !important;
  }

  :deep(.ant-radio-button-wrapper:first-child) {
    border-radius: 0;
  }

  :deep(.ant-radio-button-wrapper:last-child) {
    border-left-width: 1px;
    border-radius: 0;
  }

  :deep(.ant-radio-button-wrapper) {
    width: 88px;
    border-left-width: 1px;
    border-left-width: 1px solid #d9d9d9;
    text-align: center;
  }

  :deep(.vben-basic-table-form-container),
  :deep(.vben-basic-form) {
    padding-right: 0 !important;
    padding-left: 0 !important;
    padding-bottom: 0;
    padding-top: 0px;
  }
  :deep(.vben-basic-form) {
    padding-top: 10px;
  }
</style>
