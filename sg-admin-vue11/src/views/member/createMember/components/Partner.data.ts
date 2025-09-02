import { FormSchema } from '/@/components/Form/index';
import { generateCustomPassword } from '/@/utils/auth/index';
import { existsMember } from '/@/api/member/index';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const partnerSchemas: FormSchema[] = [
  {
    field: 'username',
    component: 'Input',
    label: t('table.member.member_partner_username') + ':',
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          const pattern = /^[a-zA-Z0-9]{3,14}$/;
          if (!value) {
            return Promise.reject(t('table.member.member_parter_tip1'));
          }
          const { status, data } = await existsMember({ username: value });
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
    componentProps: {
      placeholder: t('table.member.member_parter_tip2'),
    },
  },
  {
    field: 'realname',
    component: 'Input',
    label: t('business.common_actual_name') + ':',
    componentProps: {
      placeholder: t('table.member.member_name_tip3'),
      maxlength: 20,
    },
    // rules: [
    //   {
    //     required: true,
    //     validator: async (rule, value) => {
    //       const values = /^[a-zA-Z\u4e00-\u9fa5]{1,20}$/;
    //       if (value) {
    //         if (!values.test(value)) {
    //           return Promise.reject('只能中文或字母且不能超过20个字符');
    //         }
    //       }
    //       return Promise.resolve();
    //     },
    //     trigger: 'change',
    //   },
    // ],
  },
  {
    field: 'source',
    component: 'Input',
    label: t('table.member.member_promotion') + ':',
    componentProps: {
      placeholder: t('table.member.member_promotion_tip'),
      maxlength: 100,
    },
  },
  {
    field: 'password',
    component: 'Input',
    label: t('business.common_password') + ':',
    defaultValue: generateCustomPassword(),
    slot: 'password',
  },
  // {
  //   field: 'agency_rebate_state',
  //   component: 'Select',
  //   label: '返佣状态:',
  //   defaultValue: 2,
  //   componentProps: {
  //     options: [
  //       { value: 1, label: '开启' },
  //       { value: 2, label: '关闭' },
  //     ],
  //     getPopupContainer: () => document.body,
  //   },
  // },
  // {
  //   field: 'case',
  //   component: 'Select',
  //   label: '佣金方案',
  //   defaultValue: 0,
  //   componentProps: {
  //     options: [
  //       { label: '方案一', value: 0 },
  //       { label: '50%', value: 1 },
  //       { label: '60%', value: 2 },
  //     ],
  //   },
  //   ifShow: ({ values }) => {
  //     return values.agency_rebate_state === 0;
  //   },
  // },
  // {
  //   field: 'details',
  //   component: 'Input',
  //   label: '佣金详情',
  //   slot: 'details',
  //   colProps: { class: 'details' },
  //   ifShow: ({ values }) => {
  //     return values.agency_rebate_state === 0;
  //   },
  // },
];

export const testTable1 = [
  {
    index: t('modalForm.member.member_step'),
    value: t('business.common_member_valid_outlay') + '($)',
    rate: t('modalForm.system.system_receive_rate'),
  },
  { index: '1', value: '100.00', rate: '1%' },
  { index: '2', value: '200.00', rate: '2%' },
  { index: '3', value: '300.00', rate: '3%' },
];
export const testTable2 = [
  {
    index: t('modalForm.member.member_step'),
    value: t('business.common_member_valid_outlay') + '($)',
    rate: t('modalForm.system.system_receive_rate'),
  },
  { index: '1', value: '100.00', rate: '5%' },
];
export const testTable3 = [
  {
    index: t('modalForm.member.member_step'),
    value: t('business.common_member_valid_outlay') + '($)',
    rate: t('modalForm.system.system_receive_rate'),
  },
  { index: '1', value: '100.00', rate: '6%' },
];
