<template>
  <div class="registerSiteFormBox">
    <BasicForm @register="registerRegister" :disabled="isControlValueSet()" @submit="handleSubmit">
      <template #basicInfo>
        <div class="display-flex mb-15px">
          <div class="mr-2 title-block"></div>
          <h1>{{ $t('modalForm.system.system_register_settings') }}</h1>
        </div>
      </template>
      <template #regWeb="{ model, field }">
        <FormItem>
          <CheckboxGroup
            :disabled="isControlValueSet()"
            v-model:value="model[field]"
            @change="regWebCheckboxGroupChangeFun"
          >
            <Checkbox
              :value="item.value"
              v-for="item in registerListOptionsRef"
              :key="item.value"
              >{{ item.label }}</Checkbox
            >
          </CheckboxGroup>
        </FormItem>
      </template>

      <template #regApp="{ model, field }">
        <FormItem>
          <CheckboxGroup
            :disabled="isControlValueSet()"
            v-model:value="model[field]"
            @change="regAppCheckboxGroupChangeFun"
          >
            <Checkbox
              :value="item.value"
              v-for="item in registerAppListOptionsRef"
              :key="item.value"
              >{{ item.label }}</Checkbox
            >
          </CheckboxGroup>
        </FormItem>
      </template>
      <template #vertificationTitle>
        <div class="display-flex mb-15px">
          <div class="mr-2 title-block"></div>
          <h1>{{ t('table.system.system_login_reg_verification_conf') }}</h1>
        </div>
      </template>
    </BasicForm>
    <div class="text-center submit-btn">
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
  import { onMounted, reactive, ref } from 'vue';

  import { registerSchema } from './base.data';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { getSiteBrandDetail, updateSiteBrand } from '/@/api/sys';
  import { message, FormItem, CheckboxGroup, Checkbox } from 'ant-design-vue';
  import { useRegisterListOptions } from '/@/views/common/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const { registerListOptions } = useRegisterListOptions();
  const emit = defineEmits(['update:ok']);
  const registerListOptionsRef = ref(registerListOptions as any);
  const registerAppListOptionsRef = ref(registerListOptions as any);
  const verificationObj = reactive({
    web: '',
    app: '',
  });
  const ipLimitData = ref('');

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
  const FORM_SIZE = useFormSetting().getFormSize;

  const [registerRegister, { validate, setFieldsValue }] = useForm({
    schemas: registerSchema(),
    actionColOptions: { span: 14 },
    size: FORM_SIZE as any,
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
    // 就很奇葩，这三个不能合并到一起去set,会导致websetting失效
    setFieldsValue({
      webSetting: verificationObj.web,
      appSetting: verificationObj.app,
    });
    setFieldsValue({ ipLimit: ipLimitData.value });
    if (!baseInfo) return;
    const { app, web } = baseInfo;
    // if (!app.username) app.username = true;
    // if (!web.username) web.username = true;
    let value = {
      reg_web: extractTruthyKeys(web),
      reg_app: extractTruthyKeys(app),
    };
    if (value && value.reg_web) {
      if (!value.reg_web.includes('phone')) {
        value.reg_web = value.reg_web.filter((i) => i !== 'phone_validation');
      }
    }
    if (value && value.reg_app) {
      if (!value.reg_app.includes('phone')) {
        value.reg_app = value.reg_app.filter((i) => i !== 'phone_validation');
      }
    }
    await setFieldsValue({ ...value });
    registerListOptionsRef.value = web.email
      ? registerListOptions
      : registerListOptions.filter((item) => item.value != 'email_validation');
    registerListOptionsRef.value = registerListOptionsRef.value.filter((item) =>
      item.value === 'phone_validation'
        ? value && value.reg_web && value.reg_web.includes('phone')
        : true,
    );
    registerAppListOptionsRef.value = app.email
      ? registerListOptions
      : registerListOptions.filter((item) => item.value != 'email_validation');
    registerAppListOptionsRef.value = registerAppListOptionsRef.value.filter((item) =>
      item.value === 'phone_validation'
        ? value && value.reg_app && value.reg_app.includes('phone')
        : true,
    );
  };

  function extractTruthyKeys(obj) {
    return Object.entries(obj)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);
  }

  function generateResultObject(type) {
    return registerListOptions.reduce((acc, option) => {
      acc[option.value] = type.includes(option.value);
      return acc;
    }, {});
  }

  const handleSubmit = async () => {
    const value = await validate();
    const { reg_app, reg_web } = value;

    const requiredFields = ['username', 'email', 'phone'];
    const hasRequiredFieldWeb = reg_web.some((field) => requiredFields.includes(field));
    const hasRequiredFieldApp = reg_app.some((field) => requiredFields.includes(field));

    if (!hasRequiredFieldWeb) {
      message.error(`Web${t('table.system.system_verify')}`);
      return false;
    }

    if (!hasRequiredFieldApp) {
      message.error(`APP${t('table.system.system_verify')}`);
      return false;
    }
    const params = {
      name: 'reg',
      content: JSON.stringify({
        web: {
          username: reg_web.includes('username') ? true : false,
          birthday: reg_web.includes('birthday') ? true : false,
          mail: {
            mail: reg_web.includes('email') ? true : false,
            verify:
              reg_web.includes('email_validation') && reg_web.includes('email') ? true : false,
          },
          smart_verification: {
            type: String(value.webSetting),
          },
          //verify: reg_web.includes('email_validation') && reg_web.includes('email') ? true : false,
          phone: {
            phone: reg_web.includes('phone') ? true : false,
            verify: reg_web.includes('phone_validation') ? true : false,
          },
          timeoutExit: value.timeoutExit,
          timeoutSet: value.timeoutSet,
          oldAccountLogin: value.oldAccountLogin,
          noLoginDays: value.noLoginDays,
          verification: value.verification,
        },
        app: {
          username: reg_app.includes('username') ? true : false,
          birthday: reg_app.includes('birthday') ? true : false,
          mail: {
            mail: reg_app.includes('email') ? true : false,
            verify: reg_app.includes('email_validation') ? true : false,
          },
          phone: {
            phone: reg_app.includes('phone') ? true : false,
            verify: reg_app.includes('phone_validation') ? true : false,
          },
          smart_verification: {
            type: String(value.appSetting),
          },
          timeoutExit: value.timeoutExit,
          timeoutSet: value.timeoutSet,
          oldAccountLogin: value.oldAccountLogin,
          noLoginDays: value.noLoginDays,
          verification: value.verification,
        },
        same_ip_reg_limit: value.ipLimit,
      }),
    };
    const { status, data } = await updateSiteBrand(params);
    if (status) {
      message.success(data);
    } else {
      message.error(data);
    }
  };

  function regWebCheckboxGroupChangeFun(regWebArray) {
    if (regWebArray.length && regWebArray.includes('email')) {
      registerListOptionsRef.value = registerListOptions;
    } else {
      registerListOptionsRef.value = registerListOptions.filter(
        (item) => item.value != 'email_validation',
      );
    }
    if (regWebArray && regWebArray.length) {
      if (!regWebArray.includes('phone')) {
        setFieldsValue({ reg_web: regWebArray.filter((i) => i !== 'phone_validation') });
      }
    }
    registerListOptionsRef.value = registerListOptionsRef.value.filter((item) =>
      item.value === 'phone_validation' ? regWebArray && regWebArray.includes('phone') : true,
    );
  }

  function regAppCheckboxGroupChangeFun(regWebArray) {
    if (regWebArray.length && regWebArray.includes('email')) {
      registerAppListOptionsRef.value = registerListOptions;
    } else {
      registerAppListOptionsRef.value = registerListOptions.filter(
        (item) => item.value != 'email_validation',
      );
    }
    if (regWebArray && regWebArray.length) {
      if (!regWebArray.includes('phone')) {
        setFieldsValue({ reg_app: regWebArray.filter((i) => i !== 'phone_validation') });
      }
    }
    registerAppListOptionsRef.value = registerAppListOptionsRef.value.filter((item) =>
      item.value === 'phone_validation' ? regWebArray && regWebArray.includes('phone') : true,
    );
  }

  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    verificationObj.web = data?.web.smart_verification.type;
    verificationObj.app = data?.app.smart_verification.type;
    ipLimitData.value = data?.same_ip_reg_limit;

    setFieldsValue({
      timeoutExit: data?.web?.timeoutExit ?? true,
      timeoutSet: data?.web?.timeoutSet || 30,
      oldAccountLogin: data?.web?.oldAccountLogin ?? true,
      noLoginDays: data?.web?.noLoginDays || 90,
      verification: data?.web?.verification || 1,
    });

    var result = {
      app: {
        phone: data.app.phone.phone,
        username: data.app.username,
        birthday: data.app.birthday,
        email_validation: data.app.mail.verify,
        phone_validation: data.app.phone.verify,
        email: data.app.mail.mail,
      },
      web: {
        email: data.web.mail.mail,
        phone: data.web.phone.phone,
        username: data.web.username,
        birthday: data.web.birthday,
        email_validation: data.web.mail.verify,
        phone_validation: data.web.phone.verify,
      },
    };
    setFormList(result);
  };

  onMounted(() => {
    GetSiteBrandDetail({ tag: 'reg' });
  });
</script>
<style lang="less" scoped>
  .high-form {
    padding-bottom: 48px;
  }

  ::v-deep(.ant-checkbox-wrapper-checked) {
    color: #0960bd;
  }

  ::v-deep(.ant-checkbox-wrapper-disabled .ant-checkbox-inner) {
    background-color: rgb(0 0 0 / 25%);
  }

  .registerSiteFormBox {
    padding: 20px;
    padding-bottom: 0;
    border: 1px solid #e1e1e1 !important;
    background-color: #fff;

    h1 {
      margin: 0 !important;
      font-size: 18px !important;
      font-weight: 600;
      line-height: 18px !important;
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
