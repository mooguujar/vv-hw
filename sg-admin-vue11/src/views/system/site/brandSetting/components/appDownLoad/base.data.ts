import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

export function registerSchema() {
  const { t } = useI18n();
  const Schema = [
    {
      field: 'android-title',
      component: 'Input',
      label: '',
      colProps: {
        span: 12,
        style: { paddingLeft: '44px' },
      },
      slot: 'androidSetting',
    },
    {
      field: 'ios-title',
      component: 'Input',
      label: '',
      colProps: {
        span: 12,
        style: { paddingLeft: '78px' },
      },
      slot: 'iosSetting',
    },

    {
      field: 'androidMainVer',
      component: 'Input',
      label: t('table.system.system_major_v_num') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        allowClear: false,
        disabled: true,
      },
    },

    {
      field: 'iosMainVer',
      component: 'Input',
      label: t('table.system.system_major_v_num') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        allowClear: false,
        disabled: true,
      },
    },
    {
      field: 'androidApkUrl',
      component: 'Input',
      label: t('table.system.system_apk_download_address') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        allowClear: false,
        disabled: true,
      },
    },
    {
      field: 'iosApkUrl',
      component: 'Input',
      label: t('table.system.system_ipa_download_address') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        allowClear: false,
        disabled: true,
      },
    },
    {
      field: 'spare_androidApkUrl',
      component: 'Input',
      label: t('table.system.system_apk_spare') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        allowClear: false,
        disabled: true,
      },
    },
    {
      field: 'spare_iosApkUrl',
      component: 'Input',
      label: t('table.system.system_ipa_spare') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        allowClear: false,
        disabled: true,
      },
    },

    {
      field: 'apkUpdateType',
      component: 'Input',
      label: t('table.system.system_apk_update_type') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        disabled: true,
      },
    },

    {
      field: 'ipaUpdateType',
      component: 'Input',
      label: t('table.system.system_ipa_update_type') + '：',
      colProps: {
        span: 12,
      },
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'languageButton',
      component: 'Input',
      label: '',
      colProps: {
        span: 24,
        style: { marginBottom: '20px', paddingLeft: '66px' },
      },
      slot: 'language-slot',
    },
    {
      field: 'apkDescribe',
      component: 'InputTextArea',
      label: `${t('table.system.system_apk_update_instructions')}` + '：',
      colProps: {
        span: 12,
      },
      componentProps: () => {
        return {
          autoSize: { minRows: 6, maxRows: 10 },
          maxLength: 400,
          allowClear: false,
          placeholder: t('table.system.system_apk_update_instructions'),
          class: 'app__special__background',
          disabled: true,
        };
      },
    },

    {
      field: 'ipaDescribe',
      component: 'InputTextArea',
      label: `${t('table.system.system_ipa_update_instructions')}` + '：',
      colProps: {
        span: 12,
      },
      componentProps: () => {
        return {
          autoSize: { minRows: 6, maxRows: 10 },
          maxLength: 400,
          allowClear: false,
          placeholder: t('table.system.system_ipa_update_instructions'),
          class: 'app__special__background',
          disabled: true,
        };
      },
    },
  ];
  useAutoLabelWidth(Schema);
  return Schema;
}
