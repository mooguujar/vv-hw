import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const formSchema: FormSchema[] = [
  {
    field: 'password',
    label: t('common.CurrentPassword'),
    component: 'InputPassword',
    required: true,
  },
  {
    field: 'newPassword',
    label: t('table.member.member_new_password'),
    component: 'StrengthMeter',
    componentProps: {
      placeholder: t('table.member.member_new_password'),
    },
    rules: [
      {
        required: true,
        message: t('business.password_4'),
      },
    ],
  },
  {
    field: 'confirmPassword',
    label: t('sys.login.confirmPassword'),
    component: 'InputPassword',
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('common.PasswordEmpty'));
            }
            if (value !== values.newPassword) {
              return Promise.reject(t('common.pswNotSame'));
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
