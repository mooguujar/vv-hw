import { getTreeList } from '/@/api/member';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const getSchema = () => {
  const formSchema: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: t('modalForm.finance.finance_pay_way'), //支付方式
      colProps: { span: 22 },
      componentProps: {
        autoComplete: 'off',
        disabled: true,
      },
    },
    {
      field: 'tag_id',
      label: t('table.finance.finance_Payment_tag'), //支付标签
      component: 'ApiSelect',
      componentProps: () => {
        return {
          api: async () => {
            const response = await getTreeList({ level: '010' });
            return [...[{ name: t('table.system.system_null'), id: '0' }, ...response]];
          },
          labelField: 'name',
          valueField: 'id',
          getPopupContainer: () => document.body,
        };
      },
      required: true,
    },
    {
      field: 'tag_value',
      component: 'InputNumber',
      label: t('modalForm.finance.finance_angular_value'), //角标数值
      colProps: { span: 22 },
      componentProps: {
        stringMode: true,
        addonAfter: '%',
        max: 100,
        min: 0,
        step: 1,
        precision: 2,
      },
      required: true,
      ifShow: ({ values }) => values.tag_id == '1002',
    },
  ];
  return formSchema;
};
