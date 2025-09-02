<template>
  <div>
    <BasicModal
      :okText="t('common.confirmSave')"
      :title="title"
      @register="registerModel"
      :minHeight="100"
      @ok="okFun"
      cancelText=""
    >
      <BasicForm @register="regiserForm">
        <template #profitListMonitor>
          <div class="currenty-box">
            <div class="currenty-title"
              >{{ t('common.system_commission_config_limit') }}
              <cdIconCurrency :icon="currentyOptions[currentyOptionsId]" class="w-20px" />
            </div>
            <Input
              size="large"
              allowClear
              @blur="filterNegative"
              :placeholder="t('table.member.member_tip_placeholder')"
              v-model:value="bonus_limit"
            />
          </div>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateCommissionConfigV1 } from '/@/api/commission/index.ts';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useCurrencyStore } from '@/store/modules/currency';
  import { currentyOptions } from '@/settings/commonSetting';
  import { Input } from 'ant-design-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();
  const basicData = ref([] as any);
  const id = ref('' as string);
  const ty = ref('' as string);
  const currentyOptionsId = ref('' as string);
  const title = ref('' as string);
  const FORM_SIZE = useFormSetting().getFormSize;

  interface Options {
    label?: string;
    value?: number | string;
    levels?: [];
    id?: string;
    closable?: boolean;
  }

  const props = defineProps({
    gamesData: {
      type: Object,
      default: () => {},
    },
  });
  const emit = defineEmits(['closeLoad', 'register']);
  const selectOptions = ref<Options[]>([
    {
      label: t('common.mode1'),
      value: 1,
    },
    {
      label: t('common.mode2'),
      value: 2,
    },
    {
      label: t('common.mode3'),
      value: 3,
    },
  ]);
  // 1:真人 2:捕鱼 3:老虎机 4:体育 5:棋牌 8:小游戏
  const platformOptions = ref<Options[]>([
    {
      label: t('table.system.system_real_person'),
      value: 1,
    },
    {
      label: t('table.system.system_fish_get'),
      value: 2,
    },
    {
      label: t('table.system.system_electronic'),
      value: 3,
    },
    {
      label: t('table.system.system_physical_education'),
      value: 4,
    },
    {
      label: t('table.member.member_chess'),
      value: 5,
    },
    {
      label: t('table.system.system_original_game'),
      value: 8,
    },
  ]);
  const seletDataOptions = ref<Options[]>([
    {
      label: t('common.daily_settlement'),
      value: 1,
    },
    {
      label: t('common.weekly_settlement'),
      value: 2,
    },
    {
      label: t('common.monthly_settlement'),
      value: 3,
    },
  ]);
  const bonus_limit = ref('' as string);
  const newOptionsList = computed(() => {
    const newList = platformOptions.value.filter((option) => {
      return !basicData.value.some((item) => item.split(',').includes(String(option.value)));
    });
    const options = newList.map((item: any) => {
      return {
        label: item.label,
        value: item.value,
      };
    });
    setFieldsValue({ platform: [] });
    return options;
  });
  const schemas: FormSchema[] = [
    {
      field: 'front_entrance',
      component: 'RadioGroup',
      label: t('table.discountActivity.activiy_status') + ':',
      defaultValue: 1,
      ifShow: ({ values }) => ty.value === 'front_entrance',
      componentProps: ({ formActionType }) => {
        return {
          options: [
            { label: t('table.system.open'), value: 1 },
            { label: t('table.system.close'), value: 0 },
          ],
        };
      },
    },
    {
      field: 'mode',
      component: 'Select',
      label: t('table.system.system_table_header_agent_model') + ':',
      labelWidth: 160,
      helpMessage: '-',
      helpComponentProps: {
        text: `<div>
                  <span style='color:#FFCB00;'>
                      ${t('common.mode1')}：
                  </span>${t('common.mode1_info')}<br/>
                  <span style='color:#FFCB00;'>
                      ${t('common.mode2')}：
                  </span>${t('common.mode2_info')}<br/>
                  <span style='color:#FFCB00;'>
                      ${t('common.mode3')}：
                  </span>${t('common.mode3_info')}
                </div>
                `,
        placement: 'top',
        isBefore: true,
      },
      ifShow: ({ values }) => ty.value === 'mode',
      componentProps: () => {
        return {
          options: selectOptions,
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'type',
      component: 'RadioGroup',
      label: t('modalForm.member.member_config') + ':',
      defaultValue: 1,
      helpMessage: '-',
      helpComponentProps: {
        text: `<div>
                  <span style='color:#FFCB00;'>
                      ${t('modalForm.member.member_unified_conf')}：
                  </span>${t('common.member_unified_conf1')}<br/>
                  <span style='color:#FFCB00;'>
                      ${t('common.separate_configuration')}：
                  </span>${t('common.member_unified_conf2')}
                </div>
                `,
        placement: 'top',
        isBefore: true,
      },
      ifShow: ({ values }) => ty.value === 'mode' && values.mode !== 1,
      componentProps: ({ formActionType }) => {
        return {
          options: [
            { label: t('modalForm.member.member_unified_conf'), value: 1 },
            { label: t('common.separate_configuration'), value: 2 },
          ],
        };
      },
    },
    {
      field: 'platform',
      component: 'Select',
      label: t('table.system.system_model_type') + ':',
      ifShow: ({ values }) => ty.value === 'platform',
      required: true,
      componentProps: () => {
        return {
          options: newOptionsList,
          mode: 'multiple',
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'bonus_type',
      component: 'RadioGroup',
      label: t('table.system.system_issue_way') + ':',
      defaultValue: 0,
      ifShow: ({ values }) => ty.value === 'bonus_type',
      componentProps: ({ formActionType }) => {
        return {
          options: [
            { label: t('table.system.close'), value: 0 },
            { label: t('table.system.system_auto_send'), value: 1 },
            { label: t('table.system.system_people_review'), value: 2 },
          ],
        };
      },
    },
    {
      field: 'bonus_currency',
      component: 'ApiSelect',
      label: t('modalForm.discountActivity.sendCurency') + ':',
      helpMessage: '-',
      helpComponentProps: {
        text: `<div>
                  <span style='color:#FFCB00;'>
                      ${t('modalForm.discountActivity.sendCurency')}：
                  </span>${t('common.sendCurencyPlacement')}
                </div>
                `,
        placement: 'top',
        isBefore: true,
      },
      ifShow: ({ values }) => ty.value === 'bonus_currency',
      componentProps: () => {
        return {
          api: async () => {
            const { getCurrencyList } = useCurrencyStore();
            return getCurrencyList;
          },
          labelField: 'label',
          valueField: 'value',
          showIcon: true,
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'bonus_limit',
      component: 'Input',
      slot: 'profitListMonitor',
      label: ' ',
      ifShow: ({ values }) => ty.value === 'bonus_limit',
      componentProps: {
        placeholder: t('table.member.member_tip_placeholder'),
      },
    },
    {
      field: 'bonus_period',
      component: 'Select',
      label: t('table.discountActivity.discount_settlement_cycle') + ':',
      ifShow: ({ values }) => ty.value === 'bonus_period',
      componentProps: () => {
        return {
          options: seletDataOptions,
          getPopupContainer: () => document.body,
        };
      },
    },
  ];
  const [registerModel, { closeModal }] = useModalInner((data) => {
    setFieldsValue({ [data.ty]: data[data.ty] });
    basicData.value = JSON.parse(data.platform);
    id.value = data.id;
    ty.value = data.ty;
    bonus_limit.value = data.bonus_limit;
    currentyOptionsId.value = data.bonus_currency;
    const { getCurrencyList } = useCurrencyStore();
    let ifCurrency = getCurrencyList.filter((item) => item.id === data.bonus_currency);
    if (!ifCurrency?.length) {
      setFieldsValue({ bonus_currency: getCurrencyList[0]['id'] });
    }
    if (data.mode !== 1) {
      setFieldsValue({ type: data['type'] });
    }
    switch (data.ty) {
      case 'front_entrance':
        title.value = t('table.discountActivity.activiy_status');
        break;
      case 'bonus_limit':
        title.value = t('common.system_commission_config_limit');
        break;
      case 'mode':
        title.value = t('table.system.system_table_header_agent_model');
        break;
      case 'bonus_period':
        title.value = t('table.discountActivity.discount_settlement_cycle');
        break;
      case 'platform':
        title.value = t('common.mode_configuration');
        break;
      case 'rules':
        title.value = t('common.activity_rules');
        break;
      case 'bonus_type':
        title.value = t('table.system.system_issue_way');
        break;
      case 'bonus_currency':
        title.value = t('modalForm.discountActivity.sendCurency');
        break;
    }
  });
  const [regiserForm, { getFieldsValue, setFieldsValue, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: {
      span: 20,
    },
    size: FORM_SIZE,
  });

  function filterNegative() {
    if (bonus_limit.value <= 0) {
      bonus_limit.value = 0;
    } else {
      bonus_limit.value = bonus_limit.value.replace(/[^0-9.]/g, '');
      if (bonus_limit.value.split('.').length > 2) {
        bonus_limit.value = bonus_limit.value.split('.')[0];
      }
    }
  }

  async function okFun() {
    const values = await getFieldsValue();
    let obj = {
      id: id.value,
    };
    obj[ty.value] = values[ty.value];
    if (ty.value === 'mode' && values[ty.value] !== 1) {
      obj['type'] = values['type'];
    } else {
      delete obj.type;
    }
    if (ty.value === 'bonus_limit') {
      obj['bonus_limit'] = bonus_limit.value || '0';
    }
    if (ty.value === 'platform') {
      obj['platform'] = values['platform'].join(',');
    }
    await updateCommissionConfigV1(obj);
    emit('closeLoad', ['mode', 'platform'].includes(ty.value));
    await resetFields();
    await closeModal();
    bonus_limit.value = '';
  }
</script>
<style lang="scss" scoped>
  :deep(.ant-form-item) {
    .ant-form-item-label {
      width: auto !important;
    }
  }

  .currenty-box {
    position: relative;
    height: 40px;

    .currenty-title {
      position: absolute;
      top: 0;
      left: -168px;
      width: 160px;
      height: 40px;
      line-height: 40px;
      text-align: right;
    }

    .ant-input-affix-wrapper {
      height: 40px;
    }
  }

  ::v-deep(.ant-form-item-label) {
    min-width: 120px !important;
  }
</style>
