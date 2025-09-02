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
    <BasicForm
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
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { getConfigMemberVip } from '@/api/member/index';

  const vipMode = ref('1');
  const getData = inject<Function>('getData');
  const setData = inject<Function>('setData');
  const initData = computed(() => getData());
  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const currencyList = ref([] as any);
  const schemas = ref([
    {
      field: 'coin_deposit_currency',
      component: 'ApiSelect',
      label: t('common.specify_currency') + ':',
      colProps: { span: 24 },
      defaultValue: '',
      require: true,
      componentProps: {
        api: async () => {
          const { getCurrencyList } = useCurrencyStore();
          let getDatas = await getConfigMemberVip({ flag: 2 });

          const getListCurrency = getDatas.map((item) => {
            return {
              name: String(item.key),
              value: item.value.split(','),
            };
          });
          currencyList.value = getCurrencyList.filter((el) =>
            getListCurrency.some((p) => p.name == el.id),
          );
          let valueDef = '';
          let data = initData.value.filter((p) => p.ty === 10 && p.key === 'currency');
          if (data?.length) {
            valueDef = data[0].value;
            let defaultValueDef = currencyList.value.find((p) => p.value == valueDef);
            if (!defaultValueDef) {
              valueDef = currencyList.value[0]?.value;
            }
          } else {
            valueDef = currencyList.value[0]?.value;
          }
          nextTick(() => {
            setFieldsValue({
              coin_deposit_currency: valueDef,
            });
          });
          return currencyList.value;
        },
        labelField: 'label',
        valueField: 'value',
        showIcon: true,
        getPopupContainer: () => document.body,
      },
    },
  ] as any);
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
  const [RegisterMadel, { closeModal }] = useModalInner(async () => {});

  async function handleSubmit() {
    let params = [
      {
        ...initData.value.filter((p) => p.ty === 10 && p.key === 'mode')[0],
        value: '2',
      },
    ];
    const values = await validate();
    let data = [
      {
        ...initData.value.filter((p) => p.ty === 10 && p.key === 'currency')[0],
        value: values.coin_deposit_currency,
      },
    ];
    params = params.concat(data);
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
