<template>
  <div class="base-site-form">
    <BasicForm
      @register="registerbasicSettings"
      :disabled="isControlValueSet()"
      @submit="handleSubmit"
      @field-value-change="fieldChang"
    >
      <template #mini>
        <a-button
          type="link"
          :disabled="isControlValueSet()"
          @click="handleAccessMoneySettingModal('min_access')"
        >
          {{ $t('table.system.system_install') }}
        </a-button>
      </template>
      <template #base-three>
        <a-button
          type="link"
          :disabled="isControlValueSet()"
          @click="handleAccessMoney('bet_limit')"
        >
          {{ $t('common.view') }}
        </a-button>
      </template>
      <template #withdraw-times>
        <a-button type="link" :disabled="isControlValueSet()" @click="handleWithdraw()">
          {{ t('table.system.system_install') }}
        </a-button>
      </template>
      <template #PreferentialConfiguration>
        <a-button type="link" :disabled="isControlValueSet()" @click="handleDiscountConfig()">
          {{ t('table.system.system_install') }}
        </a-button>
      </template>
      <template #pwaSettingSlot>
        <a-button type="link" :disabled="isControlValueSet()" @click="handlePwaSetting()">
          {{ t('table.system.system_install') }}
        </a-button>
      </template>
      <template #commissionAmount="{ model, field }">
        <Input
          v-model:value="model[field]"
          size="large"
          :disabled="isControlValueSet()"
          :placeholder="$t('table.system.system_Please_enter_the_minimum_commission_to_receive')"
        >
          <template #addonAfter>
            <cdIconCurrency :icon="'USDT'" class="w-20px" />
          </template>
        </Input>
      </template>
      <template #currency-slot>
        <div class="flex flex-wrap">
          <div
            v-for="(item, index) in currencyTreeList"
            :key="index"
            class="flex m-y-1 w-75px justify-items-center"
          >
            <cdIconCurrency class="w-15px m-r-2" :icon="currentyOptions[item.id]" />
            <span>{{ currentyOptions[item.id] }}</span>
          </div>
        </div>
      </template>
    </BasicForm>

    <div class="text-center submit-btn">
      <a-button
        type="primary"
        size="large"
        @click="handleSubmit"
        :loading="btnLoading"
        :disabled="isControlValueSet()"
        class="mt-60px t-form-label-com"
        >{{ $t('common.saveText') }}</a-button
      >
    </div>

    <depositSettingModal @register="registerAccessMoneySettingModal" @send-params="sendParamsFun" />
    <AccessMoneySettingModalbet
      @register="registerAccessMoneySettingModalBet"
      @send-params="sendParamsFun"
      @reload-update="reloadUpdateFun"
    />
    <HandlingFeeModal @register="resgiterWithdraw" />
    <DiscountConfigModal @register="registerDiscountConfig" />
    <PwaSettingModal @register="registerPwaSetting" @setting-success="updatePwaSetting" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';
  import { message, Input } from 'ant-design-vue';
  import { ref, onMounted } from 'vue';
  import { schemas, langs } from './base.data';
  import depositSettingModal from './modal/depositSettingModal.vue';
  import AccessMoneySettingModalbet from './modal/depositSettingModalBet.vue';
  import { useModal } from '/@/components/Modal';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { getSiteBrandDetail, updateSiteBrand } from '/@/api/sys';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import HandlingFeeModal from './modal/HandlingFeeModal.vue';
  import { getWithdrawFee } from '/@/api/finance';
  import DiscountConfigModal from './modal/DiscountConfigModal.vue';
  import PwaSettingModal from './modal/pwaSetting.vue';
  import { useFinanceStore } from '/@/store/modules/finance';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { currentyOptions } from '/@/settings/commonSetting';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useUserStore } from '/@/store/modules/user';
  import { useTimezoneStore } from '/@/store/modules/timezone';
  import { useCurrencyStore } from '/@/store/modules/currency';

  const { currencyTreeList } = useTreeListStore();
  const { t } = useI18n();
  const emit = defineEmits(['update:ok']);
  const brandDetail = ref({} as any);
  const btnLoading = ref(false as any);
  const pwaSetting = ref({} as any);
  const financeStore = useFinanceStore();
  const userStore = useUserStore();
  const timezoneStore = useTimezoneStore();
  const currencyStore = useCurrencyStore();
  const [registerDiscountConfig, { openModal: openDiscountConfig }] = useModal();
  const [registerPwaSetting, { openModal: openPwaSetting }] = useModal();
  async function handleDiscountConfig() {
    await financeStore.InitpaymentMethods();
    await openDiscountConfig(true, {});
  }
  async function handlePwaSetting() {
    await openPwaSetting(true, brandDetail.value.pwaSetting);
  }

  const FORM_SIZE = useFormSetting().getFormSize;
  const [registerAccessMoneySettingModal] = useModal();

  const [registerAccessMoneySettingModalBet, { openModal: openAccessMoneySettingModalBet }] =
    useModal();
  const [resgiterWithdraw, { openModal: openWithdraw }] = useModal();
  function handleAccessMoneySettingModal(type): void {
    openAccessMoneySettingModalBet(true, {
      type,
    });
  }
  async function handleAccessMoney(type) {
    openAccessMoneySettingModalBet(true, { type: type });
  }

  const [registerbasicSettings, { setFieldsValue: setFieldsValueBasicSettings, validate }] =
    useForm({
      schemas: schemas,
      size: FORM_SIZE as any,
      labelWidth: '260px',
      labelAlign: 'right',
      showResetButton: false,
      showSubmitButton: false,
      showActionButtonGroup: false,
    });
  function getValue(verify) {
    if (verify.all) {
      return 3;
    } else if (verify.otp) {
      return 1;
    } else if (verify.password) {
      return 2;
    } else {
      return null; // 可以根据需要返回其他值或执行其他操作
    }
  }
  const setFormList = async (baseInfo) => {
    if (!baseInfo) return;
    await setFieldsValueBasicSettings({ ...baseInfo, verify: getValue(baseInfo.verify) });
  };
  const langList = langs.map((item) => item.value);
  const handleSubmit = async () => {
    const values = await validate();
    if (pwaSetting.value) {
      values.pwaSetting = pwaSetting.value;
    } else {
      values.pwaSetting = {
        pwaEnabled: false,
      };
      // message.error(t('common.pwa_setting_error'));
      // return;
    }
    values.default = {
      lang: values.lang,
      timezone: values.timezone,
      currency: currencyStore.getCurrencyObj.id,
    };
    values.lang = {
      f: values.chooseLanguage,
      d: values.chooseLanguage == 2 ? langList : values.lang,
    };
    values.interest = 1; // win6保险库使用
    delete values.chooseLanguage;
    btnLoading.value = true;
    let verify = {};
    if (values.verify === 1) {
      verify = {
        all: false,
        otp: true,
        password: false,
      };
    } else if (values.verify === 2) {
      verify = {
        all: false,
        otp: false,
        password: true,
      };
    } else {
      verify = {
        all: true,
        otp: false,
        password: false,
      };
    }
    const params = {
      name: 'base',
      content: JSON.stringify({ ...values, verify: verify }),
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
      btnLoading.value = false;
      userStore.setSingleLanguage(values?.lang?.f === 1 ? true : false);
      userStore.setDefaultLanguage(values?.default?.lang);
      userStore.setDefaultTimezone(values?.default?.timezone);
      userStore.setEnabledKYC(values?.kyc === 1 ? true : false);
      GetSiteBrandDetail({ tag: 'base' });
      // emit('update:ok');
    } else {
      message.error(data);
    }
  };
  // 更新PWA设置
  function updatePwaSetting(data) {
    console.log('更新PWA设置:', data);
    // brandDetail.value.pwaSetting = data;
    pwaSetting.value = data;
  }
  async function handleWithdraw() {
    const res = await getWithdrawFee();
    openWithdraw(true, res);
  }

  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    brandDetail.value = data;
    await setFieldsValueBasicSettings({
      chooseLanguage: data?.lang?.f,
      timezone: data?.default?.timezone,
    });
    if (data?.lang?.f == 1) {
      //单一语言
      setFieldsValueBasicSettings({
        lang: data?.lang?.d,
      });
    }
    if (data?.lang?.f == 2) {
      //多语言
      setFieldsValueBasicSettings({
        lang: data.default.lang,
      });
    }
    delete data.default;
    delete data.lang;
    setFormList(data);
  };

  function sendParamsFun(params, type) {
    if (type == 'bet_limit') brandDetail.value['bet_limit'] = params;
    else brandDetail.value['min_access'] = params;
    handleSubmit();
  }
  function reloadUpdateFun() {
    GetSiteBrandDetail({ tag: 'base' });
  }

  onMounted(() => {
    financeStore.InitpaymentMethods();
    GetSiteBrandDetail({ tag: 'base' });
  });
  async function fieldChang(field, value) {
    if (field == 'kyc') {
      if (value == 0) {
        //单一语言
        await setFieldsValueBasicSettings({
          verification: 1,
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }

  .base-site-form {
    padding: 30px 20px;
    border: 1px solid #e1e1e1;
    background-color: #fff;
  }

  ::v-deep(.ant-form-item-label > label),
  ::v-deep(.ant-btn-link) {
    font-weight: 500 !important;
  }

  ::v-deep(.ant-form-item-required) {
    .vben-basic-help {
      margin: 0 !important;
    }

    .app-iconify {
      svg {
        display: none;
      }
    }

    .app-iconify::after {
      content: ' ';
      display: inline-block;
      position: absolute;
      left: -15px;
      width: 10px;
      height: 10px;
      margin-top: -12px;
      background-image: url('/@/assets/images/help.form.title.tooltip.webp');
      background-size: 100%;
    }

    ::v-deep(.ant-tooltip) {
      border: 1px solid red !important;
    }
  }

  .submit-btn {
    width: 100%;
    margin: auto;
    float: left;

    button {
      min-width: 240px;
    }
  }

  :deep(.ant-btn) {
    padding: 4px 0;
  }

  :deep(.ant-form-item-control) {
    padding-left: 5px;
  }

  ::v-deep(.fast-sty) {
    .ant-radio-group {
      white-space: nowrap !important;
    }
  }
</style>
