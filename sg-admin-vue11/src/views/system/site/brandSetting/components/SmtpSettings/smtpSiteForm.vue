<template>
  <div class="smtpSiteFormBox">
    <BasicForm
      @register="registerRegister"
      :disabled="isControlValueSet()"
      @submit="handleSubmit"
    />
    <div class="submit-btn text-center">
      <a-button
        type="primary"
        size="large"
        :disabled="isControlValueSet()"
        @click="handleSubmit"
        class="t-form-label-com mt-30px"
      >
        {{ $t('common.saveText') }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { BasicForm, useForm } from '/@/components/Form';
  import { onMounted } from 'vue';
  import { registerSchema } from './base.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { getSiteBrandDetail, updateSiteBrand } from '/@/api/sys';
  import { message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const props = defineProps({
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: '1',
    },
  });

  const emit = defineEmits(['update:ok']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const userStore = useUserStore();

  const [registerRegister, { validate, setFieldsValue }] = useForm({
    schemas: registerSchema(),
    actionColOptions: { span: 14 },
    size: FORM_SIZE,
    showResetButton: false,
    showActionButtonGroup: false,
    // submitButtonOptions: {
    //   text: t('common.saveText'),
    //   size: FORM_SIZE,
    //   style: {
    //     width: '240px',
    //     float: 'right',
    //     marginLeft: '40px',
    //     marginTop: '30px',
    //   },
    // },
  });

  const setFormList = async (baseInfo) => {
    if (!baseInfo) return;
    await setFieldsValue({ ...baseInfo });
  };

  const handleSubmit = async () => {
    const value = await validate();
    //const { send_name, server, protocol, port, mail, pwd } = value;
    // const params = {
    //   id: props.id,
    //   tab: 'smtp',
    //   smtp_send_name: send_name, //发件人名称
    //   smtp_server: server, //服务器
    //   smtp_protocol: protocol, //协议
    //   smtp_port: Number(port), //端口
    //   smtp_mail: mail, //邮箱账号
    //   smtp_pwd: pwd, //邮箱密码
    // };
    const params = {
      name: 'smtp',
      content: JSON.stringify(value),
    };
    // const params = {
    //   name: 'smtp',
    //   content: JSON.stringify({
    //     name: 'Meibo<no-reply@mail.a23681.com>',
    //     host: 'us-east-1',
    //     protocol: 'POP/SMTP',
    //     port: 587,
    //     account: 'AKIA4PTRIG4ERO3GX7ZB',
    //     password1: '111md5qdd2ToUJWZGces / xdFJfKRgtm4UgXDNyfJsZ/',
    //   }),
    // };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  };

  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    setFormList(data);
  };

  onMounted(() => {
    GetSiteBrandDetail({ tag: 'smtp' });
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }
  .smtpSiteFormBox {
    border: 1px solid #e1e1e1 !important;
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    form {
      width: 50%;
    }
    h1 {
      font-size: 18px !important;
      line-height: 18px !important;
      font-weight: 600;
      margin: 0 !important;
    }
    ::v-deep(.ant-row) {
      .ant-row {
        margin-bottom: 0 !important;
      }
      .ant-form-item {
        .ant-form-item-label {
          margin-bottom: 20px;
        }
      }
    }
    .title-block {
      width: 6px !important;
      height: 15px !important;
      width: 6px;
      margin-top: 2px;
      background-color: #1475e1 !important;
    }
    .submit-btn {
      width: 100%;
      margin: auto;
      float: left;
      button {
        min-width: 240px;
      }
    }
  }
</style>
