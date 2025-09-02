<template>
  <BasicModal
    v-bind="$attrs"
    :title="$t('common.deposit_coins')"
    width="700px"
    :minHeight="500"
    :showOkBtn="false"
    :showCancelBtn="false"
    :closeFunc="handleCloseFunc"
    @register="registerBalance"
  >
    <div v-if="usdtShow">
      <div class="addCurrencyBox">
        <div class="addCurrencyLeft">
          <img :src="CurrencyConfiguration[selectCurrencyId]?.name" />
          <span>{{ CurrencyConfiguration[selectCurrencyId]?.label }}</span>
        </div>
        <div>
          <Select
            v-model:value="selectCurrencyTypeValues"
            @change="handleCurrencyTypeChange"
            :options="currencyOptiones"
          />
        </div>
      </div>
      <div class="ubox">
        <div class="ubox-div" v-for="item in usdtList" :key="item.value">
          <div
            class="ubox-item"
            @click="handelUbox(item.value)"
            :class="item.active ? 'ubox-item-active' : ''"
          >
            <span>{{ item.label }}</span>

            <cdIconCurrency
              :icon="CurrencyConfiguration[selectCurrencyId]?.label"
              class="w-14px mb-1 mx-2px"
            />
            <span>{{ CurrencyConfiguration[selectCurrencyId]?.label }}</span>
          </div>
          <div class="ubox-item-label" v-if="item.discounts != 0"
            >{{ $t('common.deposit_send') }} {{ item.discounts }}%</div
          >
        </div>
      </div>
      <InputNumber
        v-if="amountType === 1"
        v-model:value="amount"
        :placeholder="placeholder"
        :size="'large'"
        @change="handalAmountInout"
      >
        <template #addonAfter>
          <span>
            <cdIconCurrency
              :icon="CurrencyConfiguration[selectCurrencyId]?.label"
              class="w-18px mb-1 mx-2px"
            />
            <span>{{ CurrencyConfiguration[selectCurrencyId]?.label }}</span>
          </span>
        </template>
      </InputNumber>

      <div v-if="amountType === 2">
        <Select
          class="inline-block"
          v-model:value="amount"
          :size="'large'"
          :placeholder="$t('common.deposit_send_p')"
          :options="amountFixed"
          style="width: calc(100% - 48px)"
          @change="handalAmountInout"
        />
        <span class="amount-border inline-block flex justify-center items-center w-12">{{
          CurrencyConfiguration[selectCurrencyId]?.label
        }}</span>
      </div>
      <div class="amount"
        >{{ $t('common.deposit_send_p_1') }}
        <span class="amount-cost">{{ amountCost }}</span>
        <cdIconCurrency
          :icon="CurrencyConfiguration[selectCurrencyId]?.label"
          class="w-14px mb-1 mx-2px"
        />
        <span>{{ CurrencyConfiguration[selectCurrencyId]?.label }}</span></div
      >
      <Button :size="'large'" block type="primary" @click="topUp">{{
        $t('common.deposit_send_p_2')
      }}</Button>
      <div class="explain">
        <div class="explain-title">
          <span>{{ $t('common.friendly_reminder') }}：</span>
        </div>
        <div class="explain-content">
          <span class="E91134">{{ $t('common.friendly_p_1') }}</span>
        </div>
        <div class="explain-title">
          <span>{{ $t('common.deposit_send_p_3') }}：</span>
        </div>
        <div class="explain-content" style="display: flex">
          <div>{{ $t('common.deposit_send_p_4') }}：</div>
          <div>
            <div v-for="(el, index) in freeRange" :key="index">
              <span>{{ el['scope'][0] }}</span>

              <cdIconCurrency
                :icon="CurrencyConfiguration[selectCurrencyId]?.label"
                class="w-14px mb-1 mx-2px"
              />
              <span>{{ CurrencyConfiguration[selectCurrencyId]?.label }}</span>
              &lt;
              <span>{{ el['scope'][1] }}</span>

              <cdIconCurrency
                :icon="CurrencyConfiguration[selectCurrencyId]?.label"
                class="w-14px mb-1 mx-2px"
              />
              <span>{{ CurrencyConfiguration[selectCurrencyId]?.label }}</span>
              {{ $t('common.deposit_send') }}{{ el['scale'] }}%</div
            >
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-center h-8">
        <cdIconCurrency
          :icon="CurrencyConfiguration[selectCurrencyId]?.label"
          class="w-14px mb-2.5 mx-2px"
        />
        {{ CurrencyConfiguration[selectCurrencyId]?.label }} {{ selectCurrencyLabel }}
      </div>
      <div class="flex justify-center">
        <div class="border border-gray-300">
          <QrCode
            :value="formState.address"
            :width="210"
            class="enter-x flex justify-center xl:justify-start"
          />
        </div>
      </div>
      <Form :layout="'Vertical'" :model="formState" v-bind="formItemLayout" labelAlign="left">
        <FormItem
          :label="`${CurrencyConfiguration[selectCurrencyId]?.label} ${$t(
            'modalForm.finance.common_income.income_notice',
          )}：`"
        >
          <InputGroup>
            <Input v-model:value="formState.address" style="width: calc(100%)">
              <template #suffix>
                <img :src="copy" alt="" @click="handleCopy(formState.address)" class="cursor" />
              </template>
            </Input>
          </InputGroup>
        </FormItem>
        <FormItem :label="$t('common.deposit_money')">
          <InputGroup>
            <Input v-model:value="formState.amount" style="width: calc(100%)">
              <template #suffix>
                <img :src="copy" alt="" @click="handleCopy(formState.amount)" class="cursor" />
              </template>
            </Input>
          </InputGroup>
        </FormItem>
      </Form>
      <div class="flex justify-center">
        {{ $t('common.deposit_money_1') }}{{ CurrencyConfiguration[selectCurrencyId]?.label
        }}{{ $t('common.deposit_money_2') }}
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, UnwrapRef, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    Select,
    InputGroup,
    Input,
    Button,
    message,
    Form,
    FormItem,
    InputNumber,
  } from 'ant-design-vue';
  import { getPromoList, getSiteDeposit, topSiteDeposit } from '/@/api/finance';
  import { useUserStore } from '/@/store/modules/user';
  import { QrCode } from '/@/components/Qrcode/index';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { mul } from '/@/utils/number';
  import USDT from '/@/assets/images/USDT.webp';
  import BTC from '/@/assets/images/BTC.webp';
  import ETC from '/@/assets/images/ETC.webp';
  import { USER_INFO_KEY } from '/@/enums/cacheEnum';
  import { getAuthCache } from '/@/utils/auth';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import copy from '/@/assets/svg/copy.svg';

  interface FormState {
    layout: 'horizontal' | 'vertical' | 'inline';
    address: string;
    amount: string;
  }

  const { t } = useI18n();
  const amount = ref<string | undefined>(undefined);
  const amountCost = ref(0);
  const discounts = ref('');
  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const usdtList = ref([]);
  const freeRange = ref([]);
  const merchantid = ref();
  const selectCurrencyId = ref('706');
  const usdtShow = ref(true);
  const selectCurrencyTypeValues = ref('1802');
  const selectCurrencyLabel = ref('TRC20');
  const currencyOptiones = ref<any>([]);
  const placeholder = ref(t('common.deposit_m_1'));
  const amountType = ref(1);
  const amountFixed = ref([]);
  const amountMax = ref([]);
  const balanceInfor = ref({});
  const methodId = ref('');

  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const props = defineProps({
    boo: {
      type: Boolean,
      default: false,
    },
  });
  const formState: UnwrapRef<FormState> = reactive({
    layout: 'horizontal',
    address: '',
    amount: '',
  });

  const CurrencyConfiguration = {
    '706': {
      unit: 'U',
      label: 'USDT',
      name: USDT,
      img: '/@/assets/images/USDT.webp',
      defaultContract: '1802',
    },
    '707': {
      unit: '₿',
      label: 'BTC',
      name: BTC,
      img: '/@/assets/images/BTC.webp',
      defaultContract: '1805',
    },
    '708': {
      unit: 'Ξ',
      label: 'ETH',
      name: ETC,
      img: '/@/assets/images/ETC.webp',
      defaultContract: '1807',
    },
  };

  const formItemLayout = computed(() => {
    const { layout } = formState;
    return layout === 'horizontal'
      ? {
          labelCol: { span: 8 },
          wrapperCol: { span: 24 },
        }
      : {};
  });

  async function getSiteDepositlist() {
    amount.value = undefined;
    const { prefix } = getAuthCache(USER_INFO_KEY);
    amountCost.value = 0;
    const res = await getSiteDeposit({
      currency_id: balanceInfor.value['currency_id'], //货币 id
      site_id: userStore.getCurrentSite['id'], //站点 id, 先写死带入1
      site_code: prefix, //商户登录返回的 prefix, ex: dev
      contract_id: selectCurrencyTypeValues.value, //合约 id
    });
    const {
      often_amount,
      promotion,
      id,
      amount_min,
      amount_max,
      amount_type,
      amount_fixed,
      contract_ids,
      method_id,
    } = res;
    methodId.value = method_id;
    merchantid.value = id;
    amountType.value = amount_type;
    if (amountType.value == 1) {
      placeholder.value = `${amount_min}-${amount_max}`;
      amountMax.value = [amount_max, amount_min];
    }
    if (amountType.value == 2) {
      amountFixed.value = amount_fixed
        ? amount_fixed.split(',').map((el) => ({
            label: el,
            value: el,
          }))
        : [];
    }
    usdtList.value = often_amount
      ? often_amount.split(',').map((el) => ({
          label: el,
          discounts: promotion && promotion[el] ? promotion[el] : 0,
          value: el,
        }))
      : [];
    currencyOptiones.value = [];
    currencyOptiones.value = CurrencyTypeOptions.filter((option) =>
      contract_ids.includes(option.value),
    );
    setTimeout(() => {
      redoModalHeight();
    }, 100);
  }

  async function getPromo() {
    const res = await getPromoList();
    const promo = res.find((el) => el.currency_id == selectCurrencyId.value);
    if (promo) {
      freeRange.value = promo['content'];
    }
  }

  async function topUp() {
    if (amountType.value === 1) {
      if (!amount.value) {
        message.error(t('common.deposit_m_1'));
        return false;
      }
    }
    if (amountType.value === 2) {
      if (amount.value == undefined) {
        message.error(t('common.deposit_m_2'));
        return false;
      }
    }

    if (amountType.value === 1) {
      if (Number(amount.value) > Number(amountMax.value[0])) {
        message.error(`${t('common.deposit_m_3')}${amountMax.value[0]}`);
        return false;
      }
      if (Number(amount.value) < Number(amountMax.value[1])) {
        message.error(`${t('common.deposit_m_4')}${amountMax.value[1]}`);
        return false;
      }
    }
    const { status, data } = await topSiteDeposit({
      id: merchantid.value, //site merchant id
      site_id: userStore.getCurrentSite['id'], //站点 id, 先写死带入1
      currency_id: balanceInfor.value['currency_id'], //货币 id
      contract_id: selectCurrencyTypeValues.value, //合约 id
      amount: amount.value.toString(), //充值金额
      method_id: methodId.value,
    });
    if (status) {
      formState.address = data.address;
      formState.amount = data.amount;
      usdtShow.value = false;
    } else {
      message.error(data);
    }
  }

  function handelUbox(value) {
    usdtList.value.forEach((item) => {
      if (item.value == value) {
        item.active = true;
        amount.value = item.value;
        discounts.value = item.discounts;
        amountCost.value = mul(item.value, discounts.value / 100);
      } else {
        if (item.active) {
          delete item.active;
        }
      }
    });
  }

  function handalAmountInout() {
    amountCost.value = mul(amount.value, discounts.value / 100);
    handelUbox(amount.value);
  }

  function handleCurrencyTypeChange(value) {
    selectCurrencyTypeValues.value = value;
    fitlterTypeChange(value);
    getSiteDepositlist();
  }

  function fitlterTypeChange(value) {
    const selectedOption = CurrencyTypeOptions.find((el) => el.value == value);
    if (selectedOption) {
      selectCurrencyLabel.value = selectedOption.label;
    }
  }

  const CurrencyTypeOptions: any[] = [
    { label: 'TRC20', value: '1802' },
    { label: 'ERC20', value: '1801' },
    { label: 'Omni', value: '1805' },
    { label: 'ERC20', value: '1807' },
  ];

  const [registerBalance, { redoModalHeight }] = useModalInner(async (data) => {
    balanceInfor.value = data;
    selectCurrencyId.value = data['currency_id'];
    usdtShow.value = true;
    //先默认写死
    selectCurrencyTypeValues.value = CurrencyConfiguration[selectCurrencyId.value]?.defaultContract;
    fitlterTypeChange(selectCurrencyTypeValues.value);
    getSiteDepositlist();
    getPromo();
  });

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

  function handleCloseFunc() {
    if (!props.boo) {
      return true;
    }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-modal-footer) {
    border: 0;
    background-color: white;
  }

  .addCurrencyBox {
    display: flex;
    justify-content: space-between;

    .addCurrencyLeft {
      img {
        width: 50px;
        height: 50px;
        margin-right: 12px;
      }

      span {
        font-family: sans-serif;
        font-size: 16px;
        font-weight: 700;
      }
    }
  }

  .ubox {
    justify-content: space-between;
    width: 100%;
    height: auto;
    margin-top: 15px;

    .ubox-div {
      position: relative;
      width: calc(100% / 3);
      height: 50px;
      margin-bottom: 8px;
      float: left;
    }

    .ubox-item {
      width: 120px;
      height: 40px;
      float: left;
      border: 1px solid rgb(64 158 255 / 100%);
      border-radius: 3px;
      color: rgb(64 158 255 / 100%);
      font-style: normal;
      font-weight: 400;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
    }

    .ubox-item-label {
      position: absolute;
      top: -10px;
      left: 100px;
      padding: 3px 10px;
      border-radius: 20px;
      background-color: #e91134;
      color: #fff;
      font-size: 12px;
    }

    .ubox-item-active {
      background: linear-gradient(90deg, rgb(27 194 216 / 100%) 0%, rgb(64 158 255 / 100%) 100%);
      color: #fff;
    }
  }

  .amount {
    margin-top: 10px;
    margin-bottom: 20px;
    color: #333;
    font-size: 12px;
    letter-spacing: normal;
  }

  .amount-cost {
    color: #f59a23;
  }

  .explain {
    margin-top: 15px;
  }

  .explain-title {
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 650 !important;
  }

  .explain-content {
    margin-bottom: 10px;
    font-size: 12px;
  }
  .amount-border {
    height: 40px;
    float: right;
    border-top: 1px solid #d9d9d9;
    border-right: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    border-radius: 4px;
  }
</style>
