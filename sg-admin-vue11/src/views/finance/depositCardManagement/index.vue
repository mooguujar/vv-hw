<template>
  <div>
    <PageWrapper :content-style="{ margin: '0px', paddingLeft: '10px', paddingRight: '10px' }">
      <div class="t-form-label-com m-2.5 ml-2.5">
        <BasicForm @register="registerForm" @submit="handleSubmit">
          <template #beforeSlots>
            <Button type="primary" v-if="isHasAuth('21004')" @click="toAddDepositCardPage">
              {{ $t('modalForm.finance.finance_add_bank') }}
            </Button>
          </template>
        </BasicForm>
      </div>
      <div class="mx-3 mt-12px mb-12px">
        <a-button
          v-show="isFiat"
          :type="currencyType == 'Fiat' ? 'primary' : ''"
          :size="'large'"
          class="mr-2.5"
          @click="handCurrency('Fiat')"
          >{{ $t('business.Fiat_currency') }}</a-button
        >
        <a-button
          v-show="isEncryption"
          :size="'large'"
          :type="currencyType === 'encryption' ? 'primary' : ''"
          @click="handCurrency('encryption')"
          >{{ $t('business.cryptocurrency_currency') }}</a-button
        >
      </div>
      <div class="ml-2.5" v-if="achieveList.length > 0">
        <div class="pay-bottom">
          <onlineBankTable :apiMap="currentTableConfig.apiMap" ref="componentRef">
            <cdButtonCurrency
              :btn-list="currencyList?.map((item) => ({ name: item.name, value: item.id }))"
              v-model="activeKey"
            />
          </onlineBankTable>
        </div>
      </div>
      <addDepositCardForm @register="registerCardForm" @diamondsuccess="diamondsuccess" />
      <DepositeConfigModal @register="registerDiscountConfig" />
    </PageWrapper>
  </div>
</template>

<script lang="ts">
  import { isHasAuth } from '@/utils/authFunction';
  import { computed, defineComponent, ref, watch } from 'vue';
  import { Button } from '/@/components/Button';
  import { PageWrapper } from '/@/components/Page';
  import { BrlpixColumns, pixColumns } from './pixTable.data';
  import { usdtColumns } from './usdtTable.data';
  import onlineBankTable from './component/onlineBankTable.vue';
  import addDepositCardForm from './component/addDepositCardForm.vue';
  import { useMemberStore } from '/@/store/modules/member';
  import { delBankcardList, getBankcardList } from '/@/api/finance';
  import { useModal } from '/@/components/Modal';
  import { isVirtualCurrency } from '/@/utils/common';
  import DepositeConfigModal from './component/DepositeConfigModal.vue';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import eventBus from '/@/utils/eventBus';
  import { getTreeList } from '/@/api/member';
  import { currentProtocolNameMap } from '/@/settings/currencySetting';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { storeToRefs } from 'pinia';

  export default defineComponent({
    name: 'DepositCardManagement',
    components: {
      Button,
      PageWrapper,
      onlineBankTable,
      addDepositCardForm,
      DepositeConfigModal,
      cdButtonCurrency,
      BasicForm,
    },
    setup() {
      const { t } = useI18n();
      let currencyType = ref('Fiat');
      let tableParams = ref<any>({});

      const isFiat = ref<any>(false);
      const isEncryption = ref<any>(false);
      const { depositCurrencyList } = storeToRefs(useTreeListStore());
      const treeListStore = useTreeListStore();

      const achieveList = ref<any>([]);
      const show = ref(true);
      const currencyList = ref<any>([]);
      let componentRef = ref(null as any);
      let activeKey = ref();
      const [registerDiscountConfig, { openModal: openDiscountConfig }] = useModal();

      function createAchieveListItem(item: any, columns: any, type: any) {
        return {
          key: item.id,
          name: item.name,
          apiMap: {
            PAGE_TYPE: item.id,
            pageName: item.name,
            columns: columns,
            modalType: type,
            list: getBankcardList,
            delListItem: delBankcardList,
          },
        };
      }

      function creaDepositeCurrency(type?: any) {
        if (depositCurrencyList.value.length == 0) {
          return;
        }
        isFiat.value = depositCurrencyList.value.some((item) => item.attr === '1');
        isEncryption.value = depositCurrencyList.value.some((item) => item.attr === '2');

        if (type) {
          if (isFiat.value) {
            handCurrency('Fiat');
          } else if (isEncryption.value) {
            handCurrency('encryption');
            udatesearchFormSchema();
          } else {
            handCurrency('Fiat');
          }
        }
        depositCurrencyList.value.forEach((item: any) => {
          const columns = isVirtualCurrency(item.id)
            ? usdtColumns
            : item.id == 702
            ? BrlpixColumns
            : pixColumns;
          const type = isVirtualCurrency(item.id) ? 1 : 0;
          achieveList.value.push(createAchieveListItem(item, columns, type));
        });
      }

      creaDepositeCurrency('first');

      if (achieveList.value.length > 0) activeKey.value = achieveList.value[0].key ?? '';

      const memberStore = useMemberStore();
      // 获取层级下拉
      memberStore.getLevelList();

      const [registerCardForm, { openModal: CardForm }] = useModal();

      function getsearchFormSchema() {
        return [
          {
            field: 'cestate',
            component: 'Input',
            slot: 'beforeSlots',
            ifShow: isHasAuth('21004'),
            colProps: {
              style: {
                'margin-right': '10px',
              },
            },
          },
          {
            field: 'isShow',
            component: 'Input',
            defaultValue: 1,
            show: false,
          },
          {
            field: 'state',
            labelPrefix: t('business.common_status'),
            labelPrefixWidth: 45,
            component: 'Select',
            colProps: { xxl: 5, xl: 5, lg: 4, md: 5, sm: 6 },
            defaultValue: 0,
            componentProps: {
              dropdownMatchSelectWidth: false,
              placeholder: t('business.common_all'), //全部
              options: [
                { label: t('business.common_all'), value: 0 },
                { label: t('business.common_normal'), value: 1 },
                { label: t('business.common_deactivate'), value: 2 },
              ],
              getPopupContainer: () => document.body,
            },
          },
          {
            field: 'contract_id',
            component: 'Select',
            labelPrefix: t('business.common_protocol'),
            colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
            defaultValue: '0',
            componentProps: {
              dropdownMatchSelectWidth: false,
              placeholder: t('business.common_all'), //全部
              options: [],
              getPopupContainer: () => document.body,
            },
            ifShow: ({ values }) => {
              return currencyType.value == 'encryption' && values.isShow == 1; //默认类型
            },
          },
        ];
      }

      const [registerForm, { getFieldsValue, updateSchema, setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: getsearchFormSchema(),
        showAdvancedButton: false,
        actionColOptions: {
          class: 't-form-col t-form-label-com',
          span: 1,
        },
        submitButtonOptions: {
          text: t('business.common_inquire'), //查询
        },
        showResetButton: false,
      });

      async function handleSubmit() {
        const search = await getFieldsValue();
        tableParams.value = {};
        tableParams.value['state'] = search.state;
        tableParams.value['contract_id'] = search.contract_id;
        eventBus.emit('searchSubmit', tableParams.value);
      }

      let activeTable = ref<string>('onlineBankTable');

      function toAddDepositCardPage(): void {
        CardForm(true, { currencyType: currencyType.value, activeKey: activeKey.value });
      }

      function handCurrency(type) {
        currencyType.value = type;
        if (type == 'Fiat') filterCurrency(1);
        else filterCurrency(2);
      }

      function filterCurrency(type) {
        currencyList.value = depositCurrencyList.value.filter((el) => el.attr == type);
        if (currencyList.value.length > 0) activeKey.value = currencyList.value[0].id ?? '';
      }

      function diamondsuccess(id: string) {
        treeListStore.initDepositCurrency().then((res) => {
          creaDepositeCurrency();
          if (isVirtualCurrency(id)) handCurrency('encryption');
          else handCurrency('Fiat');
          setTimeout(() => {
            activeKey.value = id;
            componentRef.value.diamondsuccess();
          }, 300);
        });
      }

      const currentTableConfig = computed(() => {
        const foundItem = achieveList.value.find((item) => item.key == activeKey.value);
        return foundItem;
      });

      watch(currentTableConfig, () => {
        if (currencyType.value == 'encryption') {
          udatesearchFormSchema();
        }
      });

      async function udatesearchFormSchema() {
        const all = { label: t('business.common_all'), value: '0' };
        const id = activeKey.value;
        const level = currentProtocolNameMap[id];
        const response = await getTreeList({ level });

        if (response.length > 1) setFieldsValue({ isShow: 1 });
        else setFieldsValue({ isShow: 0 });

        setFieldsValue({ contract_id: '0' });

        const list = response.map((item: any) => {
          return {
            label: item?.name,
            value: item?.id,
          };
        });

        updateSchema({
          field: 'contract_id',
          componentProps: {
            options: [all, ...list],
          },
        });
      }

      return {
        activeTable,
        toAddDepositCardPage,
        achieveList,
        registerCardForm,
        componentRef,
        diamondsuccess,
        activeKey,
        registerDiscountConfig,
        currentTableConfig,
        registerForm,
        handleSubmit,
        currencyType,
        currencyList,
        handCurrency,
        isHasAuth,
        show,
        isFiat,
        isEncryption,
      };
    },
  });
</script>
