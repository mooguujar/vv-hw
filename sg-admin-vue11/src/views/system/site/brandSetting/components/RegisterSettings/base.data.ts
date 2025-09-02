import { useRegisterListOptions } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { useLocaleStoreWithOut } from '@/store/modules/locale';
import { useUserStore } from '/@/store/modules/user';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const userStore = useUserStore();

const { registerListOptions } = useRegisterListOptions();
const { t } = useI18n();
const currentLanguage = useLocaleStoreWithOut();
const locale = currentLanguage.getLocale;
const labelWidth = (() => {
  switch (locale) {
    case 'zh_CN':
      return '100px';
    case 'en_US':
      return '160px'; // 修改为返回 'auto' 而不是 120
    case 'vi_VN':
      return '200px'; // 修改为返回 'auto' 而不是 120
    case 'pt_BR':
      return '220px'; // 修改为返回 'auto' 而不是 120
    default:
      return '100px';
  }
})();

// 注册配置表单
export function useBaseOptionList() {
  const { t } = useI18n();
  const baseOptionList = [
    { label: t('table.system.system_set1'), value: '1' },
    { label: t('table.system.system_set2'), value: '2' },
    { label: t('table.system.system_set3'), value: '3' },
    { label: t('table.system.system_set4'), value: '4' },
    { label: t('table.system.system_set5'), value: '5' },
    // { label: '短信上行验证', value: '6' },
    { label: t('table.system.system_set7'), value: '7' },
    { label: t('table.system.system_set8'), value: '8' },
    { label: t('table.system.system_set9'), value: '9' },
  ];
  return { baseOptionList };
}

export function registerSchema() {
  const { baseOptionList } = useBaseOptionList();
  const schema = [
    {
      field: 'basic-setting',
      component: 'Input',
      label: '',
      colProps: {
        span: 24,
      },
      slot: 'basicInfo',
    },
    {
      field: 'reg_web',
      component: 'CheckboxGroup',
      label: t('modalForm.system.system_registration_configuration') + '：',
      required: true,
      labelWidth: 'auto',
      colProps: { span: 24 },
      slot: 'regWeb',
    },
    {
      field: 'reg_app',
      component: 'CheckboxGroup',
      label: t('modalForm.system.system_app_configuration') + '：',
      required: true,
      labelWidth: 'auto',
      colProps: { span: 24 },
      componentProps: {
        options: registerListOptions,
      },
      slot: 'regApp',
    },
    {
      field: 'ipLimit',
      component: 'Input',
      label: t('table.system.system_ip_limit'),
      colProps: {
        span: 8,
      },
      componentProps: () => {
        return {
          allowClear: false,
          maxLength: 2,
          placeholder: t('table.system.system_ip_limit_tips'),
          onChange: (e) => {
            // 禁止输入空格
            let val = e?.target?.value ?? null;
            // 替换输入值，只保留数字0
            if (val) {
              val = val.replace(/[^\d]/g, '');

              e.target.value = val;
            }
          },
        };
      },
    },
    {
      field: 'vertification-setting',
      component: 'Input',
      label: '',
      colProps: {
        span: 24,
      },
      slot: 'vertificationTitle',
    },
    {
      field: 'webSetting',
      component: 'RadioGroup',
      label: `${t('table.promotion.promotion_step5_GTM_title_web')}:`,
      defaultValue: 1,
      colProps: {
        span: 24,
      },
      componentProps: {
        options: baseOptionList,
      },
    },
    {
      field: 'appSetting',
      component: 'RadioGroup',
      label: `${t('table.promotion.promotion_step5_GTM_title_APP')}:`,
      defaultValue: 1,
      colProps: {
        span: 24,
      },
      componentProps: {
        options: baseOptionList,
      },
    },
    {
      field: 'timeoutExit',
      component: 'RadioGroup',
      label: t('common.timeout_exit'),
      defaultValue: true,
      helpMessage: '-',
      helpComponentProps: {
        text: `<div>${t('common.timeout_exit_info')}</div>`,
        placement: 'topLeft',
        isBefore: true,
      },
      colProps: {
        span: 6,
      },
      componentProps: {
        options: [
          { label: t('business.common_on'), value: true }, //开启
          { label: t('business.common_off'), value: false }, //关闭
        ],
      },
    },
    {
      field: 'timeoutSet',
      component: 'Input',
      label: t('common.timeout_set'),
      labelWidth,
      defaultValue: '30',
      colProps: {
        span: 18,
      },
      rules: [
        {
          required: true,
          message: t('common.timeout_set_required'),
        },
        {
          pattern: /^\d+$/,
          message: t('common.timeout_set_integer_error'),
        },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = parseInt(value);
            if (isNaN(num) || num < 1) {
              return Promise.reject(t('common.timeout_set_range_error'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: {
        allowClear: false,
        addonAfter: t('component.time.minutes'),
        style: {
          width: '150px',
        },
        class: 'full-width-error',
      },
      ifShow: ({ values }) => {
        return values.timeoutExit;
      },
    },
    {
      field: 'timeoutPlaceholder',
      component: 'Input',
      colProps: {
        span: 18,
      },
      componentProps: {
        style: {
          visibility: 'hidden',
          height: '32px',
        },
      },
      ifShow: ({ values }) => {
        return !values.timeoutExit;
      },
    },
    {
      field: 'oldAccountLogin',
      component: 'RadioGroup',
      label: t('common.old_account_login'),
      defaultValue: true,
      helpMessage: '-',
      helpComponentProps: {
        text: `<div>${t('common.old_account_login_info')}</div>`,
        placement: 'topLeft',
        isBefore: true,
      },
      colProps: {
        span: 6,
      },
      componentProps: {
        options: [
          { label: t('business.common_on'), value: true }, //开启
          { label: t('business.common_off'), value: false }, //关闭
        ],
      },
    },
    {
      field: 'noLoginDays',
      component: 'Input',
      labelWidth,
      label: t('common.no_login_days'),
      defaultValue: '90',
      colProps: {
        span: 4,
      },
      rules: [
        {
          required: true,
          message: t('common.no_login_days_required'),
        },
        {
          pattern: /^\d+$/,
          message: t('common.no_login_days_integer_error'),
        },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = parseInt(value);
            if (isNaN(num) || num < 1) {
              return Promise.reject(t('common.no_login_days_range_error'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: {
        class: 'full-width-error',
        allowClear: false,
        addonAfter: h('span', { style: 'padding: 0 7px' }, t('component.time.days')),
        style: {
          width: '150px',
        },
      },
      ifShow: ({ values }) => {
        return values.oldAccountLogin;
      },
    },
    {
      field: 'verification',
      component: 'Select',
      label: t('table.system.system_verify_way') + ':',
      defaultValue: 1,
      colProps: {
        span: 7,
      },
      required: true,
      componentProps: {
        options: [
          { label: t('common.email_or_phone_verification'), value: 1 },
          { label: t('common.face_recognition'), value: 2 },
        ],
        getPopupContainer: () => document.body,
      },
      ifShow: ({ values }) => {
        return values.oldAccountLogin;
      },
    },
  ];
  useAutoLabelWidth(schema);
  return schema;
}
