<template>
  <PageWrapper :contentStyle="{ margin: 0 }" contentBackground>
    <div class="ant-modal-confirm-title">
      <a class="addmoneyText">{{ t('common.SetAdvertisingpassword') }} </a>
    </div>
    <div class="step-form">
      <Alert
        :message="t('common.SetAdvertisingpasswordFirst')"
        type="info"
        show-icon
        :style="{ width: '100%', margin: 'auto', marginBottom: '20px' }"
      />
      <BasicForm @register="registerPassword" />
      <div class="step-buton">
        <Button type="primary" :loading="loading" @click="createClick" :size="FORM_SIZE">{{
          t('component.modal.okText')
        }}</Button>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Button, Alert } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { FormSchema } from '/@/components/Form/index';
  // import { schemasPassword } from './setRoiPwd.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { roiPwdSet } from '/@/api/sys/user';
  import eventBus from '/@/utils/eventBus';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { getFormSize } = useFormSetting();
  const FORM_SIZE = getFormSize as any;
  const loading = ref(false);
  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const newPw = ref('');
  const schemasPassword: FormSchema[] = [
    {
      field: 'pwd_new',
      component: 'InputPassword',
      label: t('common.password') + ':',
      defaultValue: '',
      componentProps: {
        size: 'large',
        rows: 6,
        placeholder: t('common.password_placeholder'),
        maxLength: 20,
        allowClear: false,
      },
      rules: [
        {
          required: true,
          validator: (rule, value) => {
            if (value) {
              newPw.value = value;
            }
            if (!value) {
              return Promise.reject(t('common.password_placeholder'));
            }
            const regex = /^[a-zA-Z0-9]\w{5,19}$/;
            if (value.length < 6 || value.length > 20 || !regex.test(value)) {
              return Promise.reject(t('common.system_roi_login_tips'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'pwd_confirm',
      component: 'InputPassword',
      label: t('sys.login.confirmPassword') + ':',
      defaultValue: '',
      componentProps: {
        size: 'large',
        rows: 6,
        placeholder: t('common.enterAgainPsw'),
        maxLength: 20,
        allowClear: false,
      },
      rules: [
        {
          required: true,
          validator: (rule, value) => {
            if (!value) {
              return Promise.reject(t('common.enterAgainPsw'));
            }
            const regex = /^[a-zA-Z0-9]\w{5,19}$/;
            if (value.length < 6 || value.length > 20 || !regex.test(value)) {
              return Promise.reject(t('common.system_roi_login_tips'));
            }
            if (value) {
              const newPwList = newPw.value.split('');
              const valueList = value.split('');
              for (let i = 0; i < newPwList.length; i++) {
                if (newPwList[i] !== valueList[i]) {
                  return Promise.reject(t('common.pswNotSameConfirm'));
                }
              }
              if (newPwList.length != valueList.length)
                return Promise.reject(t('common.pswNotSameConfirm'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
    },
  ];
  useAutoLabelWidth(schemasPassword);
  /** 登陆密码：表单验证 */
  const [registerPassword, { validate: validatePassword }] = useForm({
    schemas: schemasPassword,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  async function createClick() {
    const values = await validatePassword();
    try {
      const { status, data } = await roiPwdSet(values);
      if (status) {
        sessionStorage.setItem('logRoiPwd', 'true');
        eventBus.emit('closeModal');
      } else {
        createMessage.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  onMounted(() => {});
</script>

<style lang="less">
  .addCreat .ant-modal-confirm-title {
    margin-bottom: 30px;
    padding: 17.5px 17.5px 17.5px 20px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 4px 4px 0 0;
    background-color: #1475e1 !important;
    color: rgb(0 0 0 / 85%);
    font-size: 18px;
    line-height: 24px;

    .addmoneyText {
      height: 25px !important;
      padding-right: 16px;
      color: #fff !important;
      font-weight: 600 !important;
      line-height: 25px !important;
    }
  }
</style>
<style lang="less" scoped>
  .step-form {
    width: 440px;
    margin: auto;
  }

  .step-buton {
    width: 440px;
    margin-top: 6px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
  }
</style>
