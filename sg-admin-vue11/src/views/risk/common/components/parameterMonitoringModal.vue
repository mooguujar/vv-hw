<template>
  <main>
    <BasicModal
      :maxHeight="560"
      :width="width"
      @register="registerModal"
      :showCancelBtn="tabValue == 'risk'"
      :showOkBtn="tabValue == 'risk'"
      @ok="handleSubmit"
      wrapClassName="modal-radio-capsule"
      :okText="$t('common.okText')"
      :cancelText="$t('common.cancelText')"
    >
      <template #title>
        <RadioGroup v-model:value="tabValue" class="radio-capsule">
          <RadioButton value="monitor"> {{ $t('table.risk.report_monitor_data') }} </RadioButton>
          <RadioButton value="risk"> {{ tabTitle }} </RadioButton>
        </RadioGroup>
      </template>

      <BasicForm @register="monitorRegisterForm" v-show="tabValue == 'monitor'">
        <template #validBet="{ model, field }">
          <Input :value="filterNumber(model[field])" :controls="false" disabled>
            <template
              #addonAfter
              v-if="
                risk_code == 'low_multiple_bet' ||
                risk_code == 'high_multiple_prizes' ||
                risk_code == 'mutual_bet' ||
                risk_code == 'win_top'
              "
            >
              <cdIconCurrency :icon="'USDT'" class="w-20px mr-3px currency-icon" /><span>USDT</span>
            </template>
          </Input>
        </template>
      </BasicForm>
      <BasicForm @register="riskRegisterForm" v-show="tabValue == 'risk'" />
    </BasicModal>
  </main>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { message, Input, RadioGroup, RadioButton } from 'ant-design-vue';
  import { getschemasMonitorFun, schemasRisk } from './parameterMonitoringModal.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import {
    updateRiskConfig,
    getRiskWinConfig,
    getRiskLowConfig,
    getRiskHighConfig,
    getRiskMutualConfig,
    getRiskLinkedConfig,
  } from '/@/api/risk';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useNoticeStore } from '/@/store/modules/notice';

  const { t } = useI18n();
  const noticeStore = useNoticeStore();
  const schemas = ref<any>([]);
  const risk_code = ref<string>('');
  const FORM_SIZE = useFormSetting().getFormSize;
  const tabValue = ref('monitor' as string);
  const tabTitle = ref(t('modalForm.risk.risk_system_site_configuration') as string);
  const width = ref(750 as number);
  const [monitorRegisterForm, { resetSchema, setFieldsValue }] = useForm({
    showActionButtonGroup: false,
    size: FORM_SIZE,
    schemas: schemas.value,
  });
  const [riskRegisterForm, { validate, setFieldsValue: setFieldsValue2 }] = useForm({
    showActionButtonGroup: false,
    size: FORM_SIZE,
    schemas: schemasRisk,
  });
  const _data = ref(null as any);
  const riskRequestObj = {
    win_top: getRiskWinConfig,
    low_multiple_bet: getRiskLowConfig,
    high_multiple_prizes: getRiskHighConfig,
    mutual_bet: getRiskMutualConfig,
    linked_records: getRiskLinkedConfig,
  };
  const [registerModal, { setModalProps, closeModal }] = useModalInner(
    async (data: { risk_code: string }) => {
      risk_code.value = data.risk_code;
      schemas.value = getschemasMonitorFun(data.risk_code);
      _data.value = data;
      if (
        data.risk_code == 'low_multiple_bet' ||
        data.risk_code == 'high_multiple_prizes' ||
        data.risk_code == 'win_top' ||
        data.risk_code == 'mutual_bet' ||
        data.risk_code == 'linked_records'
      ) {
        tabTitle.value = t('modalForm.risk.risk_warn'); //风控提醒
        width.value = 560;
      }

      const { config, remind, interval } = await riskRequestObj[data.risk_code]();
      resetSchema(schemas.value);
      useAutoLabelWidth(schemas.value);
      const configObj = JSON.parse(config);
      if (data.risk_code == 'win_top') configObj.profit_rate = `${configObj.profit_rate}%`;
      else if (data.risk_code == 'low_multiple_bet')
        configObj.bet_multiple = `${configObj.bet_multiple} ${t('modalForm.risk.risk_times')}`; //倍
      else if (data.risk_code == 'high_multiple_prizes')
        configObj.multiple = `${configObj.multiple} ${t('modalForm.risk.risk_times')}`; //倍
      else if (data.risk_code == 'mutual_bet')
        configObj.bet_count = `${configObj.bet_count} ${t('component.unit.sum')}`; //笔
      setFieldsValue(configObj);
      await setFieldsValue2({
        remind,
        interval,
      });
    },
  );

  async function handleSubmit() {
    try {
      const values = await validate();
      values['risk_code'] = risk_code.value;
      setModalProps({ confirmLoading: true });
      const { status, data } = await updateRiskConfig(values);
      if (status) {
        message.success(data);
        await noticeStore.getNotice();
        closeModal();
      } else {
        message.error(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  function filterNumber(num) {
    if (num) {
      var result = num.toString().indexOf('.');
      if (result != -1) {
        return num;
      } else {
        return `${num}.00`;
      }
    }
    return 0;
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-input-number-input) {
    padding: 19px 10px;
  }

  ::v-deep(.ant-input-group .ant-input) {
    padding: 8px 10px;
  }

  .currency-icon {
    margin-top: -3px;
  }
</style>
