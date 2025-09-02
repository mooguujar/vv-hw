<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    autoComplete="off"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        name="username"
        v-model:value="formData.account"
        autocomplete="username"
        :placeholder="t('sys.login.accountPlaceholder')"
        class="fix-auto-fill"
      >
        <template #suffix>
          <img :src="people" :size="24" />
        </template>
      </Input>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        autocomplete="current-password"
        :placeholder="t('common.password_placeholder')"
      />
    </FormItem>
    <FormItem name="seamo" class="enter-x">
      <Input
        :controls="false"
        size="large"
        v-model:value="formData.seamo"
        :placeholder="t('sys.login.verification_code')"
        :maxlength="6"
        class="fix-auto-fill"
      >
        <template #suffix>
          <img :src="lock" :size="24" />
        </template>
      </Input>
    </FormItem>
    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
    <FormItem class="enter-x-last">
      <AppLocalePicker
        :reload="true"
        class="text-white enter-x"
        :show-text="true"
        v-if="!sessionTimeout && showLocale"
      />
    </FormItem>
  </Form>
  <AppAddCurrencyModal @register="registerRateModal" :boo="boo" />
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';
  import { AppLocalePicker } from '/@/components/Application';
  import { Form, Input, Button } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useLocaleStore } from '/@/store/modules/locale';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import people from '/@/assets/icons/LoginPeople:svg.svg';
  import lock from '/@/assets/icons/LoginLock:svg.svg';
  import AppAddCurrencyModal from '@/components/Application/src/AppAddCurrencyModal.vue';
  import { useModal } from '@/components/Modal';
  import { getfinanceBalance } from '@/api/finance';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const { t } = useI18n();
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();
  const localeStore = useLocaleStore();
  const showLocale = localeStore.getShowPicker;
  const { getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const boo = ref(false);
  const [registerRateModal, { openModal: openBalanceModal }] = useModal();
  const formData = reactive({
    account: '',
    password: '',
    seamo: '',
    ip: '',
    device_no: '',
    // code: '',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: data.password,
        username: data.account,
        seamo: data.seamo,
        device_no: '78954',
        // ip: '',
        // code: data.code,
        // mode: 'none', //不要默认的错误提示
      });
      const info = userStore.getUserInfo;
      if (userInfo['overdraft_state'] === '3') {
        const res = await getfinanceBalance({ site_code: info['prefix'] || 'dev' });
        let obj = {
          site_id: res.site_id,
          currency_id: res.currency_id,
        };
        await openBalanceModal(true, obj);
        boo.value = true;
        setTimeout(() => {
          // userStore.setToken('');
        }, 1000);
        return;
      }
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${info.name}`,
          duration: 3,
        });
      }
    } catch (error) {
      let errMessage = (error as unknown as Error).message;
      if (errMessage.includes('Cannot')) errMessage = '';
      createErrorModal({
        title: t('sys.api.loginErrorTip'),
        content: errMessage || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
<style lang="less">
  .vben-login .vben-login-form input {
    min-width: 340px !important;
  }

  .enter-x {
    & button {
      height: 56px;
      border: 0;
      border-radius: 4px;
      background: #00e701;
      font-size: 20px;

      &.ant-btn-primary {
        color: #071824;
      }
    }

    &.ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused {
      border: 0;
    }
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: #b1bad3;
    transition: background-color 5000s ease-in-out 0s;
  }

  .enter-x-last {
    width: 136px;
    color: #fff;
    font-size: 18px;
  }
</style>
