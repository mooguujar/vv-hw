import { useI18n } from '/@/hooks/web/useI18n';
import { ref } from 'vue';

const limitInput = ref(false);
function deleteRepeat(data: String) {
  const dataList = data.split('\n');
  if (dataList.length < 2) return data;
  const dataFinally = [...new Set(dataList.filter((item) => item))];
  return dataFinally.join('\n');
}

export function registerSchema() {
  const { t } = useI18n();
  return [
    {
      field: 'apiLineTitle',
      component: 'Input',
      label: '',
      colProps: {
        span: 24,
      },
      slot: 'apiLineTitle',
    },

    {
      field: 'apiLine',
      component: 'Select',
      label: t('table.system.system_apiline'),
      colProps: {
        span: 8,
      },
      defaultValue: 1,
      componentProps: () => {
        return {
          options: [
            { label: t('table.member.member_defalut'), value: 1 },
            { label: t('table.system.system_game_shield'), value: 2 },
            { label: 'Github', value: 3 },
            { label: t('table.system.system_spare'), value: 4 },
          ],
          getPopupContainer: () => document.body,
          allowClear: false,
          onChange: (v) => {
            if (v != 1) {
              limitInput.value = true;
            } else {
              limitInput.value = false;
            }
          },
        };
      },
    },
    {
      field: 'apiDomain',
      component: 'InputTextArea',
      label: `${t('table.system.system_api_domain_name')}：`,
      colProps: {
        span: 8,
      },
      rules: [
        {
          required: true,
          validator: (rule, value) => {
            if (!value) {
              return Promise.reject(t('table.system.system_api_domain_name'));
            }
            const regex = /^[^\s]+(\n[^\s]+)*$/;
            if (!regex.test(value.split('\n'))) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: ({ formActionType }) => {
        return {
          autoSize: { minRows: 4, maxRows: 5 },
          maxLength: 200,
          allowClear: false,
          placeholder: t('table.system.system_api_domain_name'),
          disabled: limitInput.value,
          onBlur: (v) => {
            const value = v.target.value;
            deleteRepeat(value);
            formActionType.setFieldsValue({ apiDomain: deleteRepeat(value) });
          },
        };
      },
    },
    {
      field: 'h5Domain',
      component: 'Input',
      label: t('table.system.system_h5_domain_name'),
      colProps: {
        span: 8,
        offset: 8, // 换行
        pull: 8,
      },
      rules: [
        {
          validator: (rule, value) => {
            const regex = /^\S*$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
        },
      ],

      componentProps: () => {
        return {
          allowClear: false,
        };
      },
    },

    {
      field: 'VGinstallTitle',
      component: 'Input',
      label: '',
      colProps: {
        span: 24,
      },
      slot: 'VGinstallTitle',
    },
    {
      field: 'vgDomain',
      component: 'Input',
      label: t('table.system.system_VGInstall'),
      colProps: {
        span: 8,
      },
      rules: [
        {
          validator: (rule, value) => {
            const regex = /^\S*$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: {
        allowClear: false,
      },
    },
    {
      field: 'vgKey',
      component: 'Input',
      label: 'VGInstall Key：',
      colProps: {
        span: 8,
      },
      rules: [
        {
          validator: (rule, value) => {
            const regex = /^\S*$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: {
        allowClear: false,
      },
    },
    {
      field: 'pwaBackDomainTitle',
      component: 'Input',
      label: '',
      colProps: {
        span: 24,
      },
      slot: 'pwaBackDomainTitle',
    },
    {
      field: 'pwaBackDomain',
      component: 'InputTextArea',
      label: t('common.pwa_back_Domain') + '：',
      colProps: {
        span: 8,
      },
      rules: [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('common.pwa_back_Domain'));
            }
            const regex = /^[^\s]+(\n[^\s]+)*$/;
            if (!regex.test(value.split('\n'))) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: ({ formActionType }) => {
        return {
          autoSize: { minRows: 4, maxRows: 5 },
          maxLength: 200,
          allowClear: false,
          placeholder: t('common.pwa_back_Domain'),
          disabled: limitInput.value,
          onBlur: (v) => {
            const value = v.target.value;
            deleteRepeat(value);
            formActionType.setFieldsValue({ pwaBackDomain: deleteRepeat(value) });
          },
        };
      },
    },
  ];
}
