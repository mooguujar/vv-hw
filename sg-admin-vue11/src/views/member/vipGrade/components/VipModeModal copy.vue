<template>
  <BasicModal
    :title="$t('modalForm.member.member_vip_model')"
    :okText="$t('table.system.system_conform_save')"
    @ok="handleSubmit"
    :width="600"
    :minHeight="100"
    @register="RegisterMadel"
    :showCancelBtn="false"
  >
    <Form :layout="'horizontal'">
      <FormItem
        class="scope_config_modal"
        :labelCol="{ span: vipMode === '1' ? 6 : undefined, style: { width: labelWidth + 'px' } }"
        labelAlign="right"
        :label="$t('modalForm.member.member_vip_model')"
      >
        <Space direction="vertical">
          <RadioGroup v-model:value="vipMode">
            <Radio value="1">{{ $t('common.integration_mode') }}</Radio>
            <Radio value="2">{{ $t('common.currency_mode') }}</Radio>
          </RadioGroup>
        </Space>
      </FormItem>
    </Form>
    <Form v-if="vipMode === '1'">
      <FormItem
        class="scope_config_modal"
        v-for="(item, index) in getListCurrency"
        :labelCol="{ span: 6 }"
        :key="index"
        :rules="{ required: true }"
      >
        <Row>
          <Col :span="6">
            <div class="p-t-2 text-right">
              <span style="color: #f00">* </span>
              <cdIconCurrency class="!w-5" :icon="currentyOptions[item.name]" />
              <span class="!m-l-1">{{ currentyOptions[item.name] }}：</span>
            </div>
          </Col>
          <Col :span="8">
            <InputNumber
              :placeholder="$t('common.inputText')"
              v-model:value="item.value[0]"
              min="1"
              :stringMode="true"
              :disabled="isControlValueSet()"
              :addon-after="t('modalForm.member.member_coding')"
              :size="FORM_SIZE"
            />
          </Col>
          <div class="w-8 !text-center flex justify-center items-center">=</div>
          <Col :span="8">
            <InputNumber
              :placeholder="$t('modalForm.member.member_set_integral')"
              v-model:value="item.value[1]"
              :disabled="isControlValueSet()"
              :stringMode="true"
              :addon-after="t('modalForm.member.member_integral')"
              min="0"
              :size="FORM_SIZE"
            />
          </Col>
        </Row>
      </FormItem>
    </Form>
    <BasicForm
      v-else
      @register="registerbasicSettings"
      :disabled="isControlValueSet()"
      @submit="handleSubmit"
    />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, inject, computed, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import {
    FormItem,
    Form,
    RadioGroup,
    Space,
    Radio,
    message,
    Row,
    Col,
    InputNumber,
  } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateScoreConfig, getConfigMemberVip } from '@/api/member/index';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import { useCurrencyStore } from '/@/store/modules/currency';

  const vipMode = ref('1');
  const getData = inject<Function>('getData');
  const setData = inject<Function>('setData');
  const initData = computed(() => getData());
  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const getListCurrency = ref([] as any);
  const schemas = ref([
    {
      field: 'coin_deposit_currency',
      component: 'ApiSelect',
      label: t('table.system.coin_deposit_currency') + ':',
      // labelWidth: locale === 'zh_CN' ? '120px' : '120px',
      colProps: { span: 24 },
      defaultValue: '701',
      require: true,
      componentProps: {
        api: async () => {
          const { getCurrencyList } = useCurrencyStore();
          const list = getCurrencyList.filter((el) =>
            getListCurrency.value.some((p) => p.name == el.id),
          );
          return list;
        },
        labelField: 'label',
        valueField: 'value',
        showIcon: true,
        getPopupContainer: () => document.body,
        // style: { width: locale === 'zh_CN' ? '120px' : '120px' },
      },
    },
  ] as any);
  const labelWidth = useAutoLabelWidth(schemas.value);
  const [
    registerbasicSettings,
    {
      validate: validate,
      setFieldsValue: setFieldsValue,
      // getFieldsValue: getFieldsValue,
    },
  ] = useForm({
    schemas: schemas.value,
    size: FORM_SIZE as any,
    // labelWidth: '260px',
    labelAlign: 'right',
    showResetButton: false,
    showSubmitButton: false,
    showActionButtonGroup: false,
  });
  const [RegisterMadel, { closeModal }] = useModalInner(async () => {
    let getDatas = await getConfigMemberVip({ flag: 2 });
    vipMode.value = initData.value.filter((p) => p.ty === 10 && p.key === 'mode')[0].value;

    getListCurrency.value = getDatas.map((item) => {
      return {
        name: String(item.key),
        value: item.value.split(','),
      };
    });
    let valueDef = '';
    let data = initData.value.filter((p) => p.ty === 10 && p.key === 'currency');
    if (data?.length) {
      valueDef = data[0].value;
    } else {
      valueDef = getListCurrency.value[0].value;
    }
    nextTick(() => {
      setFieldsValue({
        coin_deposit_currency: valueDef,
      });
    });
  });

  async function handleSubmit() {
    let params = [
      {
        ...initData.value.filter((p) => p.ty === 10 && p.key === 'mode')[0],
        value: vipMode.value,
      },
    ];
    if (vipMode.value === '1') {
      let data = getListCurrency.value.map((item: any) => {
        return {
          key: item.name,
          value: item.value.toString(),
          ty: 2,
        };
      });
      params = params.concat(data);
    } else {
      const values = await validate();
      let data = [
        {
          ...initData.value.filter((p) => p.ty === 10 && p.key === 'currency')[0],
          value: values.coin_deposit_currency,
        },
      ];
      params = params.concat(data);
    }
    setData(params);
    closeModal();
  }
</script>
<style scoped lang="less">
  .ant-form-item-label > label,
  .text-horizon-center {
    height: 40px;
    line-height: 40px;
  }
</style>
