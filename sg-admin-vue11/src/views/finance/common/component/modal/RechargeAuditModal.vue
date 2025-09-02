<template>
  <main>
    <BasicModal
      v-bind="$attrs"
      :centered="true"
      :title="apiMap.title"
      :canFullscreen="false"
      :minHeight="1"
      :cancelText="$t('common.cancelText')"
      :okText="$t('modalForm.finance.common_income.submit')"
      width="700px"
      @register="registerModal"
      @ok="handleSubmit"
    >
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.order_id') }}:</span
        >
        <span> {{ infoData['order_number'] }}</span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.menber_id') }}:</span
        >
        <span> {{ infoData['username'] }} </span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.currency') }}:</span
        >
        <cdBlockCurrency :label="infoData?.currency_name" />
        <span class="red"> {{ infoData['currency_name'] }} </span>
      </div>
      <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.CURRENCY">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.finance_contract_type') }}:</span
        >
        <span> {{ infoData['contract_type_name'] + '/' + infoData['wallet_desc'] }} </span>
      </div>
      <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.COMPANY">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.realname') }}:</span
        >
        <span> {{ infoData['realname'] }} </span>
      </div>
      <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.COMPANY">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.account') }}:</span
        >
        <span> {{ infoData['bank_name'] }} </span>
      </div>
      <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.COMPANY">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.saveaccount') }}:</span
        >
        <span> {{ infoData['deposit_bank_account'] }} </span>
      </div>
      <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.CURRENCY">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.income_notice') }}:</span
        >
        <span> {{ `${infoData['wallet_address']}` }} </span>
      </div>
      <div
        class="info-content"
        v-if="apiMap.PAGE_TYPE == RECHARGE.CURRENCY && infoData.currency_name === 'XRP'"
      >
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('business.common_Label') }}:</span
        >
        <span> {{ infoData['memo'] ? infoData['memo'] : '-' }} </span>
      </div>
      <div
        class="info-content"
        v-if="apiMap.PAGE_TYPE == RECHARGE.CURRENCY && infoData.currency_name === 'EOS'"
      >
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('business.common_memorandum') }}:</span
        >
        <span> {{ infoData['memo'] ? infoData['memo'] : '-' }} </span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.income_amount') }}:</span
        >
        <span class="red"> {{ infoData['pay_amount'] }} </span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.income_offer') }}:</span
        >
        <Select
          ref="select"
          style="width: 250px"
          v-model:value="submitInfor.vipName"
          @change="changVipname"
          v-if="bonusOptions.length > 1"
        >
          <SelectOption :value="item.value" v-for="(item, index) in bonusOptions" :key="index">{{
            item.label
          }}</SelectOption>
        </Select>
        <span v-else>{{ $t('modalForm.finance.bonusOptions.tip') }}</span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('table.finance.finance_Discounted_price') }}:</span
        >
        <span>{{ submitInfor.vipName === '0_0' ? '0.00' : moneyRate }}</span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.into_amount') }}:</span
        >
        <span> {{ moneyStr }} </span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.notice') }}:</span
        >
        <span> {{ infoData['user_note'] ? infoData['user_note'] : '-' }} </span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.submit_date') }}:</span
        >
        <span> {{ infoData['created_at'] }} </span>
      </div>
      <div class="info-content">
        <span class="info-title" :style="{ width: labelWidth + 'px' }"
          >{{ $t('modalForm.finance.common_income.auditors') }}:</span
        >
        <RadioGroup v-model:value="submitInfor.state">
          <Radio value="1">{{ $t('modalForm.finance.common_income.auditors_ok') }}</Radio>
          <Radio value="2">{{ $t('modalForm.finance.common_income.auditors_reject') }}</Radio>
        </RadioGroup>
      </div>
      <div class="info-content" v-if="submitInfor.state == 2">
        <Form
          ref="formRef"
          autocomplete="off"
          :model="submitInfor"
          :label-col="{ style: { width: labelWidth + 'px' } }"
        >
          <FormItem
            :label="$t('modalForm.finance.common_income.reject_reason')"
            name="remark"
            :labelCol="{ style: 'width: ' + labelWidth + 'px;margin-left:7px' }"
          >
            <Textarea v-model:value="submitInfor.remark" :allowClear="true" style="width: 250px" />
          </FormItem>
        </Form>
      </div>
      <Loading :loading="loading" :absolute="false" />
    </BasicModal>
  </main>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import Loading from '/@/components/Loading/src/Loading.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { setClassWidthNew } from '/@/components/Form/src/hooks/useForm.js';
  import { AuditRechargeParams } from '/@/api/model/financeModel';
  import { RECHARGE_TYPE } from '../../../common/const';

  import {
    RadioGroup,
    Radio,
    Textarea,
    Select,
    SelectOption,
    FormItem,
    Form,
    Input,
  } from 'ant-design-vue';
  import { toTimezone } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatNumberFixed } from '/@/views/common/common';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

  export default defineComponent({
    name: 'RechargeAuditModal',
    components: {
      BasicModal,
      Loading,
      RadioGroup,
      Radio,
      Textarea,
      Select,
      SelectOption,
      FormItem,
      Form,
      cdBlockCurrency,
    },
    props: {
      apiMap: {
        type: Object,
        default: () => {},
      },
    },
    emits: ['reload', 'register'],
    setup(props, context) {
      const { t } = useI18n();
      const rechargeOrderData = ref({});
      const loading = ref<boolean>(false);
      const infoData = ref({});
      let bonusOptions = ref<{ label: string; value: string }[]>([]);
      const formRef = ref();
      const RECHARGE = RECHARGE_TYPE;
      const moneyStr = ref();
      const moneyRate = ref('0.00');
      const softwareReview0 = setClassWidthNew({ zh_CN: 80, default: 150 });
      const softwareRevie1 = setClassWidthNew({ zh_CN: 140, default: 200 });
      const labelWidth: number =
        props.apiMap.PAGE_TYPE == RECHARGE.CURRENCY ? softwareRevie1 : softwareReview0;
      const submitInfor = ref({
        state: '1',
        remark: '',
        vipName: '0_0',
      });

      const { createMessage } = useMessage();

      const changVipname = (data) => {
        if (data == '0_0')
          moneyStr.value = formatNumberFixed(
            infoData.value['pay_amount'],
            infoData.value['currency_name'],
          );
        else {
          const [percentage, payAmount] = data.split('_').map(Number);
          if (!isNaN(percentage) && !isNaN(infoData.value['pay_amount'])) {
            const totalAmount =
              Number(infoData.value['pay_amount']) +
              infoData.value['pay_amount'] * (percentage / 100);

            const totalAmountRate = infoData.value['pay_amount'] * (percentage / 100);
            moneyStr.value = formatNumberFixed(totalAmount, infoData.value['currency_name']);
            moneyRate.value = formatNumberFixed(totalAmountRate, infoData.value['currency_name']);
            if (Number(payAmount) != 0 && Number(moneyRate.value) > Number(payAmount)) {
              moneyRate.value = payAmount;
              moneyStr.value = formatNumberFixed(
                Number(infoData.value['pay_amount']) + Number(payAmount),
                infoData.value['currency_name'],
              );
            }
          }
        }
      };
      const [registerModal, { setModalProps, closeModal }] = useModalInner(
        async (data: { record: any; response: any }) => {
          setModalProps({ confirmLoading: false });
          const { record, bonus } = data;
          rechargeOrderData.value = record;
          submitInfor.value['remark'] = '';
          submitInfor.value['state'] = '1';
          submitInfor.value['vipName'] = '0_0';
          const created_at = toTimezone(record.created_at);
          const extend = {
            created_at,
          };
          switch (props.apiMap.PAGE_TYPE) {
            case RECHARGE_TYPE.COMPANY:
              const bank_name = `${record.bank_name}/${record.bank_card_name}`;
              extend['bank_name'] = bank_name;
              break;
            case RECHARGE_TYPE.CURRENCY:
              const wallet_address = `${record.wallet_address}`;
              extend['wallet_address'] = wallet_address;
              break;
            default:
              break;
          }
          infoData.value = { ...record, ...extend };
          moneyStr.value = formatNumberFixed(
            infoData.value['pay_amount'],
            infoData.value['currency_name'],
          );
          bonusOptions.value = [];
          if (bonus && bonus.length > 0) {
            bonusOptions.value = bonus.map(({ max, rate, state }) => ({
              max,
              rate,
              state,
              label: `${rate}%`,
              value: `${rate}_${max}`,
            }));
          }
          bonusOptions.value.push({ label: t('modalForm.finance.bonusOptions.tip'), value: '0_0' });
          if (bonusOptions.value.length > 1) {
            let res = bonusOptions.value[0];
            submitInfor.value['vipName'] = res['value'];
            changVipname(res['value']);
          }
        },
      );

      async function handleSubmit(): Promise<void> {
        try {
          setModalProps({ confirmLoading: true });
          if (Number(submitInfor.value.state) === 2) {
            formRef.value
              .validate()
              .then(() => {
                handleReview();
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            handleReview();
          }
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      async function handleReview() {
        const { state, remark, vipName } = submitInfor.value;
        const payload: AuditRechargeParams = {
          id: rechargeOrderData.value.id,
          state: Number(state),
          remark: remark,
        };
        if (vipName == '0_0') {
          payload.rate = '';
          payload.max = '';
        } else {
          let arr = vipName.split('_');
          payload.rate = arr[0];
          payload.max = arr[1];
        }
        const { status, data } = await props.apiMap.reviewApi(payload);
        if (status) {
          createMessage.success(data);
          context.emit('reload');
          setModalProps({ confirmLoading: false });
          closeModal();
        } else {
          context.emit('reload');
          createMessage.error(data);
        }
      }
      onMounted(() => {});

      return {
        loading,
        registerModal,
        handleSubmit,
        infoData,
        bonusOptions,
        submitInfor,
        RECHARGE,
        formRef,
        moneyStr,
        changVipname,
        moneyRate,
        labelWidth,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .disabled {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    background-color: #f5f5f5;
    color: rgb(255 0 0 / 80%);
  }

  .info-content {
    display: flex;
    margin-bottom: 20px;
  }

  .info-title {
    margin-right: 15px;
    text-align: right;
    word-break: keep-all;
  }

  .red {
    color: #e91134;
  }

  .gree {
    color: #1cd91c;
  }
</style>
