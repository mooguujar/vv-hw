<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="site-config">
    <Card :title="t('common.BasicCharges')" style="width: 100%">
      <BasicForm @register="schemasForm">
        <template #overdraftView1="{ model, file }">
          <InputNumber
            :stringMode="true"
            :controls="false"
            v-model:value="cdn_fee"
            :disabled="true"
            :size="'large'"
          >
            <template #addonAfter>
              <span>
                <cdIconCurrency icon="USDT" style="width: 20px; margin-right: 5px" />
                <span>{{ cdn_fee_toggle == '1' ? 'USDT/1GB' : 'USDT/' + t('common.month') }}</span>
              </span>
            </template>
          </InputNumber>
        </template>
        <template #overdraftView2="{ model, file }">
          <InputNumber
            :stringMode="true"
            :controls="false"
            v-model:value="domain_fee"
            :disabled="true"
            :size="'large'"
          >
            <template #addonAfter>
              <span>
                <cdIconCurrency icon="USDT" style="width: 20px; margin-right: 5px" />
                <span>{{
                  domain_fee_toggle == '1'
                    ? 'USDT/' + t('table.member.member_ge')
                    : 'USDT/' + t('common.month')
                }}</span>
              </span>
            </template>
          </InputNumber>
        </template>
      </BasicForm>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, ref, h } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Card, InputNumber } from 'ant-design-vue';
  import { configList } from '@/api/sys';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setClounmsWidth } from '/@/views/common/component';

  const { t } = useI18n();
  const cdn_fee = ref('');
  const domain_fee = ref('');
  const cdn_fee_toggle = ref(1 as any);
  const domain_fee_toggle = ref(1 as any);

  onMounted(() => {
    GetCostDetail();
  });

  const schemas = [
    {
      field: 'bond',
      component: 'InputNumber',
      label: t('common.SiteDeposit') + ':',
      defaultValue: '0.00',
      componentProps: {
        addonAfter: h('span', {}, [
          h(cdIconCurrency, { icon: 'USDT', style: 'width:20px;margin-right:5px' }, ''),
          h('span', {}, 'USDT'),
        ]),
        min: 0,
        stringMode: true,
        step: '0.00',
      },
      dynamicDisabled: true,
    },
    {
      field: 'site_fee',
      component: 'InputNumber',
      label: t('common.WebsiteCosts') + ':',
      defaultValue: '0.00',
      componentProps: {
        addonAfter: h('span', {}, [
          h(cdIconCurrency, { icon: 'USDT', style: 'width:20px;margin-right:5px' }, ''),
          h('span', {}, 'USDT'),
        ]),
        min: 0,
        stringMode: true,
        step: '0.00',
      },
      dynamicDisabled: true,
    },
    {
      field: 'guaranteed_fee',
      component: 'InputNumber',
      label: t('common.commen_guaranteed_fee') + ':',
      defaultValue: '0.00',
      componentProps: {
        addonAfter: h('span', {}, [
          h(cdIconCurrency, { icon: 'USDT', style: 'width:20px;margin-right:5px' }, ''),
          h('span', {}, 'USDT'),
        ]),
        min: 0,
        stringMode: true,
        step: '0.00',
      },
      dynamicDisabled: true,
    },
    {
      field: 'overdraft',
      component: 'InputNumber',
      label: t('common.MaximumOverdraft') + ':',
      defaultValue: '0.00',
      componentProps: {
        addonAfter: h('span', {}, [
          h(cdIconCurrency, { icon: 'USDT', style: 'width:20px;margin-right:5px' }, ''),
          h('span', {}, 'USDT'),
        ]),
        min: 0,
        stringMode: true,
        step: '0.00',
      },
      dynamicDisabled: true,
    },
    {
      field: 'cdn_fee',
      component: 'InputNumber',
      label: t('common.CDNMaintenanFee') + ':',
      defaultValue: '0.00',
      slot: 'overdraftView1',
      componentProps: {
        addonAfter: h('span', {}, [
          h(cdIconCurrency, { icon: 'USDT', style: 'width:20px;margin-right:5px' }, ''),
          h('span', {}, 'USDT'),
        ]),
        min: 0,
        stringMode: true,
        step: '0.00',
      },
      dynamicDisabled: true,
    },
    {
      field: 'domain_fee',
      component: 'InputNumber',
      label: t('common.DomainExtraCharge') + ':',
      defaultValue: '0.00',
      slot: 'overdraftView2',
      componentProps: {
        addonAfter: h('span', {}, [
          h(cdIconCurrency, { icon: 'USDT', style: 'width:20px;margin-right:5px' }, ''),
          h('span', {}, 'USDT'),
        ]),
        min: 0,
        stringMode: true,
        step: '0.00',
      },
      dynamicDisabled: true,
    },
  ];

  const FORM_SIZE = useFormSetting().getFormSize;

  const [schemasForm, { setFieldsValue, validate }] = useForm({
    schemas: schemas,
    showActionButtonGroup: false,
    baseColProps: { style: 'width:calc( 100% * 1/3 );padding-right:40px' },
    labelWidth: setClounmsWidth(100, 200),
    size: FORM_SIZE,
  });

  const GetCostDetail = async () => {
    const data = await configList();
    cdn_fee.value = data.cdn_fee;
    domain_fee.value = data.domain_fee;
    cdn_fee_toggle.value = data.cdn_fee_toggle == 0 ? 1 : 2;
    domain_fee_toggle.value = data.domain_fee_toggle == 0 ? 1 : 2;
    setFieldsValue(data);
  };
</script>
<style scoped>
  ::v-deep(.ant-input-disabled) {
    border-color: #dce3f1;
    background-color: #f6f7fb !important;
  }

  ::v-deep(.ant-input-group-addon-disabled) {
    border-color: #dce3f1;
    background-color: #dce3f1 !important;
  }

  ::v-deep(.ant-radio-group) {
    display: flex;
    align-items: center;
  }
</style>
