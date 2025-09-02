<template>
  <BasicModal
    :width="500"
    @register="registerUpdatePassword"
    :title="$t('table.system.system_root_editPassword')"
    :cancelText="$t('common.cancelText')"
    :okText="$t('table.system.system_qd_save')"
    @ok="submitOk"
  >
    <BasicForm :size="FORM_SIZE" @register="registerFormModal" /> </BasicModal
></template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateAdminPassword } from '/@/api/sys/index';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const emit = defineEmits(['emitList', 'register', 'successEmit']);
  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      field: 'username',
      component: 'Input',
      label: t('table.system.system_root_user') + ':', //登录账号
      componentProps: {
        placeholder: t('table.system.system_root_newTip1'),
      },
      dynamicDisabled: true,
    },
    {
      field: 'password',
      component: 'Input',
      label: t('table.risk.report_login_password') + ':', //登录密码
      componentProps: {
        placeholder: t('table.system.system_root_newTip2'),
      },
      rules: [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('table.system.system_p_enter_login_pas'));
            }

            const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');

            if (reg.test(value)) {
              return Promise.reject(t('table.system.system_including_cn'));
            }

            const reg2 = new RegExp('^[a-zA-Z0-9]{6,20}$', 'g');

            if (!reg2.test(value)) {
              return Promise.reject(t('table.system.system_login_tips'));
            }

            return Promise.resolve();
          },
        },
      ],
    },
  ];
  useAutoLabelWidth(schemas);
  const [registerFormModal, { setFieldsValue, validate, clearValidate }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: {
      span: 20,
    },
  });

  const [registerUpdatePassword, { closeModal }] = useModalInner((data) => {
    setFieldsValue({ username: data.username, id: data.id, password: '' });
    clearValidate();
  });
  async function submitOk() {
    const values = await validate();
    const { status, data } = await updateAdminPassword({
      id: values.id,
      password: values.password,
    });
    if (status) {
      message.success(data);
      closeModal();
      emit('successEmit');
    } else {
      message.error(data);
    }
  }
</script>
