<template>
  <div>
    <BasicModal
      :title="$t('business.common_deal_with')"
      @register="registerDeal"
      @ok="handleSubmit"
      :okText="$t('modalForm.finance.common_income.submit')"
      cancelText=""
    >
      <BasicForm @register="registerForm"
    /></BasicModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { updatestateMember } from '/@/api/member/index.ts';
  import { message } from 'ant-design-vue';

  const emit = defineEmits(['sucessReload', 'register']);
  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const schemas: FormSchema[] = [
    {
      field: 'username',
      component: 'Input',
      label: t('table.system.system_member_account') + '：',
      dynamicDisabled: true,
    },
    {
      field: 'state',
      component: 'RadioGroup',
      label: t('modalForm.risk.risk_limit_type') + '：',
      defaultValue: 2,
      required: true,
      componentProps: ({ formModel }) => {
        return {
          options: [
            {
              label: t('business.common_deactivate'),
              value: 2,
            },
            {
              label: t('table.member.member_limit_discount'),
              value: 3,
            },
          ],
          onChange: () => {
            formModel.note = '';
          },
        };
      },
      colProps: {
        class: 'state-sty',
      },
    },
    {
      field: 'limitState',
      component: 'CheckboxGroup',
      label: t('table.member.member_limit_state') + '：',
      required: true,
      colProps: {
        class: 'limit-state-field',
      },
      componentProps: {
        options: [
          { label: t('table.member.member_discount_state'), value: 1 },
          { label: t('table.member.member_rebate_walter'), value: 2 },
          { label: t('table.member.member_commiss'), value: 3 },
        ],
      },
      rules: [
        {
          required: true,
          message: t('table.member.member_limit_state_tip'),
        },
      ],
      ifShow: ({ values }) => values.state === 3,
    },
    {
      field: 'note',
      component: 'InputTextArea',
      label: t('business.common_remarks_infor') + '：',
      //required: true,
      componentProps: {
        placeholder: t('modalForm.member.member_remark_tip1'),
        rows: 3,
      },
      rules: [
        {
          required: true,
          message: t('modalForm.member.member_remark_tip1'),
        },
      ],
    },
  ];
  const recordData = ref(null as any);
  const [registerDeal, { closeModal }] = useModalInner((data) => {
    recordData.value = data;
    setFieldsValue({ username: data.username });
  });
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    showActionButtonGroup: false,
    schemas,
    labelWidth: 150,
    size: FORM_SIZE,
    baseColProps: {
      span: 20,
    },
  });
  async function handleSubmit() {
    const values = await validate();
    delete values['username'];
    values['uid'] = recordData.value.uid;
    const stateMapping = {
      1: 'bonus_state',
      2: 'rebate_state',
      3: 'commission_state',
    };
    if (values.limitState?.length) {
      values.limitState.forEach((item) => {
        const stateKey = stateMapping[item];
        if (stateKey) {
          values[stateKey] = 2;
        }
      });
      delete values['limitState'];
      delete values['state'];
    }
    const { status, data } = await updatestateMember(values);
    if (status) {
      message.success(data);
      emit('sucessReload');
      resetFields();
      closeModal();
    } else {
      message.error(data);
    }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.state-sty) {
    .ant-radio-group {
      white-space: nowrap !important;
    }
  }

  ::v-deep(.limit-state-field) {
    .ant-form-item {
      .ant-form-item-label {
        min-width: 150px !important;
        width: 150px !important;
      }
    }
    .ant-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
</style>
