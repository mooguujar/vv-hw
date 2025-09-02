import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';

// 基础配置
export function useFormSchema() {
  const { t } = useI18n();
  const baseSchema: FormSchema[] = [
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
      field: 'id',
      component: 'Input',
      label: t('modalForm.system.third_partite_id') + ':',
      colProps: { span: 22 },
      componentProps: {
        placeholder: t('modalForm.system.system_number_tip'),
      },
      required: true,
    },
    {
      field: 'secret',
      component: 'Input',
      label: t('modalForm.system.third_partite_secret') + ':',
      colProps: { span: 22 },
      componentProps: {
        placeholder: t('modalForm.system.system_key_tip'),
      },
      required: true,
    },
    {
      field: 'state',
      component: 'RadioGroup',
      label: t('modalForm.system.status') + ':',
      defaultValue: 1,
      colProps: { span: 22 },
      componentProps: {
        options: [
          { label: t('common.On'), value: 1 },
          { label: t('common.Off'), value: 2 },
        ],
      },
    },
  ];
  return { baseSchema };
}

export const threeschema: FormSchema[] = [
  {
    field: 'title',
    label: '',
    component: 'Input',
    slot: 'site-form',
    colProps: {
      span: 24,
    },
  },
];
