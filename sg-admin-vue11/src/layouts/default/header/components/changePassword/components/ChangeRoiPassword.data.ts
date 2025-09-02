import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
import { FormSchema } from '/@/components/Form/index';
import { roiPwdVerify } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';

const currentLanguage = useLocaleStoreWithOut();
const labelWidth = computed(() => {
  enum labelWidthEnum {
    en_US = 140,
    vi_VN = 140,
  }
  // return currentLanguage.getLocale == 'en_US' ? 140 : 100;
  return labelWidthEnum[currentLanguage.getLocale] ?? 100;
});
const { t } = useI18n();
const newPw = ref('');
const oldPw = ref('');
/** 定义ROI密码 */
export const schemasRoiPassword: FormSchema[] = [
  {
    field: 'pwd_old',
    component: 'InputPassword',
    label: t('business.password_1') + ':',
    defaultValue: '',
    labelWidth: labelWidth.value,
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
          const regex = /^[a-zA-Z0-9]\w{5,19}$/;
          if (value.length < 6 || value.length > 20 || !regex.test(value)) {
            return Promise.reject(t('common.system_roi_login_tips'));
          }
          if (value.length >= 6 && value.length <= 20) {
            const { data } = await roiPwdVerify({
              pwd: value,
            });
            if (!data) {
              message.destroy();
              return Promise.reject(t('business.password_3'));
            }
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'pwd_new',
    component: 'InputPassword',
    label: t('table.member.member_new_password') + ':',
    defaultValue: '',
    labelWidth: labelWidth.value,
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
    labelWidth: labelWidth.value,
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
          const regex = /^[a-zA-Z0-9]\w{5,19}$/;
          if (value.length < 6 || value.length > 20 || !regex.test(value)) {
            return Promise.reject(t('common.system_roi_login_tips'));
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
