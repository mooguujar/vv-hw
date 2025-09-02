import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
export const accountFormSchema: any = (currency_id) => {
  const schema = [
    {
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      field: 'username',
      component: 'Input',

      label: t('modalForm.member.member_account'), //会员账号
      componentProps: {
        disabled: true,
        placeholder: t('modalForm.member.member_p_enter_username'), //请输入会员账号
      },
    },
    {
      field: 'open_name',
      component: 'Input',

      label: t('modalForm.member.member_username'), //会员姓名
      componentProps: {
        disabled: true,
        placeholder: t('common.pleaseEnterN'), //请输入
      },
    },
    {
      field: 'type_name',
      component: 'Input',

      label: t('modalForm.member.member_withdrawal_method'), //
      componentProps: {
        disabled: true,
        placeholder: t('common.pleaseEnterN'), //
      },
    },
    {
      field: 'bank_name',
      component: 'Input',

      label: t('modalForm.member.member_withdrawal_type'), //
      componentProps: {
        disabled: true,
        placeholder: t('common.pleaseEnterN'), //
      },
    },
    {
      field: 'address',
      component: 'Input',

      label: t('modalForm.member.member_account_opening_outlets'), //
      componentProps: {
        placeholder: t('common.pleaseEnterN'), //
      },
      rules: [
        {
          required: true,
          validator: (rule, value) => {
            if (value && value.length > 100) {
              return Promise.reject(t('common.translate.word82'));
            }
            if (!!!value) {
              return Promise.reject(t('modalForm.finance.finance_opening_outlets_tip'));
            }
            return Promise.resolve();
          },
        },
      ],
      ifShow: currency_id == '701',
    },
    {
      field: 'bank_account',
      component: 'Input',

      label: t('modalForm.member.member_payment_account_number'), //
      componentProps: {
        placeholder: t('common.pleaseEnterN'), //
      },
      rules: [
        {
          required: true,
          validator: (rule, value) => {
            if (value && value.length > 100) {
              return Promise.reject(t('common.translate.word82'));
            }
            if (!!!value) {
              return Promise.reject(t('modalForm.finance.finance_bank_account_tip'));
            }
            return Promise.resolve();
          },
        },
      ],
    },
  ];
  useAutoLabelWidth(schema);
  return schema;
};
