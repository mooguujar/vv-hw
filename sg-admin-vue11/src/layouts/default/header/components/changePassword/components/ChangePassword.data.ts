import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { FormSchema } from '/@/components/Form/index';
import { modifyPassword } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';

const currentLanguage = useLocaleStoreWithOut();
const labelWidth = computed(() => {
  enum labelWidthEnum {
    en_US = 140,
    vi_VN = 140,
  }
  return labelWidthEnum[currentLanguage.getLocale] ?? 100;
});
const { t } = useI18n();
const newPw = ref('');
const oldPw = ref('');
/** 定义登陆密码 */
export const schemasPassword: FormSchema[] = [
  {
    field: 'originPw',
    component: 'InputPassword',
    label: t('business.password_1') + ':',
    labelWidth: labelWidth.value,
    defaultValue: '',
    componentProps: () => {
      return {
        size: 'large',
        rows: 6,
        placeholder: t('business.password_2'),
        maxLength: 20,
        allowClear: false,
      };
    },
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (value) {
            oldPw.value = value;
          }
          if (!value) {
            return Promise.reject(t('business.password_2'));
          }
          const regex = /^[a-zA-Z0-9]+$/;
          if (!regex.test(value)) {
            return Promise.reject(t('table.system.system_login_tips'));
          }
          if (value.length < 6) {
            return Promise.reject(t('table.system.system_login_tips'));
          }
          if (value.length >= 6) {
            const { data, status } = await modifyPassword({
              password: value,
              verification: true,
              new_password: '',
              uid: '',
              domain: '',
            });
            if (!status) {
              if (data == '密码错误') {
                message.destroy();
                return Promise.reject(t('business.password_3'));
              } else {
                message.error(data);
                return Promise.reject(data);
              }
            }
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'newPw',
    component: 'InputPassword',
    label: t('table.member.member_new_password') + ':',
    labelWidth: labelWidth.value,
    defaultValue: '',
    componentProps: {
      size: 'large',
      rows: 6,
      placeholder: t('business.password_4'),
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
            return Promise.reject(t('business.password_4'));
          }
          const regex = /^[a-zA-Z0-9]+$/;
          if (!regex.test(value)) {
            return Promise.reject(t('table.system.system_login_tips'));
          }
          if (value.length < 6) {
            return Promise.reject(t('table.system.system_login_tips'));
          }
          if (value) {
            const oldPwList = oldPw.value.split('');
            const valueList = value.split('');
            if (oldPwList.length == valueList.length) {
              let pwState = true;
              for (let i = 0; i < oldPwList.length; i++) {
                if (oldPwList[i] == valueList[i]) {
                  pwState = false;
                } else {
                  pwState = true;
                }
              }
              if (pwState) {
                return Promise.resolve();
              } else {
                return Promise.reject(t('business.password_5'));
              }
            }
          }

          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'conNewPw',
    component: 'InputPassword',
    label: t('sys.login.confirmPassword') + ':',
    labelWidth: labelWidth.value,
    defaultValue: '',
    componentProps: {
      size: 'large',
      rows: 6,
      placeholder: t('business.password_6'),
      maxLength: 20,
      allowClear: false,
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('business.password_6'));
          }
          const regex = /^[a-zA-Z0-9]+$/;
          if (!regex.test(value)) {
            return Promise.reject(t('table.system.system_login_tips'));
          }
          if (value.length < 6) {
            return Promise.reject(t('table.system.system_login_tips'));
          }
          if (value) {
            const newPwList = newPw.value.split('');
            const valueList = value.split('');
            for (let i = 0; i < newPwList.length; i++) {
              if (newPwList[i] !== valueList[i]) {
                return Promise.reject(t('business.password_7'));
              }
            }
            if (newPwList.length != valueList.length)
              return Promise.reject(t('business.password_7'));
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
];
