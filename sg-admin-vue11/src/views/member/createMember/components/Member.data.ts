import { FormSchema } from '/@/components/Form/index';
import { existsMember } from '/@/api/member/index';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const memberSchemas: FormSchema[] = [
  {
    field: 'parent_name',
    component: 'Input',
    label: t('business.common_super_agent') + ':',
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject(t('table.member.member_verify_1'));
          }
          const pattern = /^[a-zA-Z0-9]{3,14}$/;
          const { data, status } = await existsMember({ agent_username: value });
          if (!status) {
            return Promise.reject(data);
          }
          if (!pattern.test(value)) {
            return Promise.reject(t('table.member.member_verify_2'));
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    componentProps: {
      placeholder: t('table.member.member_verify_3'),
    },
  },
  {
    field: 'username',
    component: 'Input',
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          const pattern = /^[a-zA-Z0-9]{3,14}$/;
          if (!value) {
            return Promise.reject(t('table.member.member_username_tip2'));
          }
          const { data, status } = await existsMember({ username: value });
          if (!status) {
            return Promise.reject(data);
          }
          if (!pattern.test(value)) {
            return Promise.reject(t('table.member.member_verify_2'));
          }
          return Promise.resolve();
        },
      },
    ],
    label: t('business.common_member_account') + ':',
    componentProps: {
      placeholder: t('table.member.member_username_tip2'),
    },
  },
  {
    field: 'realname',
    component: 'Input',
    label: t('business.common_realiy_name') + ':',
    componentProps: {
      placeholder: t('table.member.member_name_tip'),
    },
  },
  {
    field: 'password',
    component: 'Input',
    label: t('business.common_password'),
    dynamicDisabled: true,
    slot: 'password',
  },
];
