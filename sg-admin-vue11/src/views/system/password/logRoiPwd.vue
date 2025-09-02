<template>
  <PageWrapper :contentStyle="{ margin: 0 }" contentBackground>
    <div class="modal-confirm-title">
      <div class="addmoneyText">{{ t('common.AdvertisingReportPassword') }}</div>
      <div class="step-form">
        <BasicForm @register="registerPassword" />
        <div class="step-buton">
          <Button type="primary" @click="createClick" :size="FORM_SIZE">{{
            t('component.modal.okText')
          }}</Button>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { FormSchema } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form';
  // import { schemasPassword } from './logRoiPwd.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { roiPwdVerify } from '/@/api/sys/user';
  import eventBus from '/@/utils/eventBus';
  import { ref } from 'vue';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { getFormSize } = useFormSetting();
  const FORM_SIZE = getFormSize as any;
  const newPw = ref('');
  /** 设置ROI密码 */
  const schemasPassword: FormSchema[] = [
    {
      field: 'pwd',
      component: 'InputPassword',
      label: t('common.password') + ':',
      labelWidth: 'auto',
      defaultValue: '',
      componentProps: () => {
        return {
          size: 'large',
          rows: 6,
          placeholder: t('common.password_placeholder'),
          maxLength: 20,
          allowClear: false,
        };
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
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
  ];
  /** 验证ROI登陆密码 */
  const [registerPassword, { validate }] = useForm({
    schemas: schemasPassword,
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: { span: 24 },
  });

  async function createClick() {
    const values = await validate();
    if (!values) return;
    try {
      const { data } = await roiPwdVerify(values);
      if (data) {
        sessionStorage.setItem('logRoiPwd', 'true');
        eventBus.emit('closeModal');
      } else {
        createMessage.error(t('common.password_error_reenter'));
      }
    } catch (error) {
      console.error(t('common.psd_validate_err'));
    }
  }
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
  .addmoneyText {
    margin-bottom: 30px;
    padding: 17.5px 17.5px 17.5px 20px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 4px 4px 0 0;
    background-color: #1475e1 !important;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    line-height: 24px;
  }

  .step-form {
    width: 400px;
    margin: auto;
  }

  .step-buton {
    width: 400px;
    margin-top: 6px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
  }
</style>
