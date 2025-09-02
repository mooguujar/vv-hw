import { FormSchema } from '/@/components/Table';
import { limitTypeOptions, ignoreDayOptions, limit_discount_type } from '../const';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
limitTypeOptions[0].label = t('business.common_deactivate'); //停用
limitTypeOptions[1].label = t('table.member.member_limit_discount'); //限制优惠
limitTypeOptions[2].label = t('business.comon_ignore'); //忽略
export const accountFormSchema: FormSchema[] = [
  {
    field: 'username',
    component: 'Input',
    label: t('business.common_member_account') + ':', //会员账号
    show: true,
  },
  {
    field: 'id',
    component: 'Input',
    label: 'id:',
    show: false,
  },
  {
    field: 'ids',
    component: 'Input',
    label: 'ids',
    show: false,
  },
  {
    field: 'usernames',
    component: 'CheckboxGroup',
    rules: [{ required: true, message: t('business.common_member_account_p') }],
    label: t('business.common_member_account') + ':',
    componentProps: {
      disabled: true,
    },
    show: false,
  },
  {
    field: 'limit_type',
    component: 'RadioGroup',
    label: t('modalForm.risk.risk_limit_type') + ':', //限制类型
    required: true,
    defaultValue: 1,
    componentProps: {
      options: limitTypeOptions,
    },
  },
  {
    field: 'discount_state',
    component: 'CheckboxGroup',
    label: t('table.member.member_limit_state') + '：',
    rules: [{ required: true, message: t('table.member.member_limit_state_tip') }],
    componentProps: {
      options: limit_discount_type,
    },
    ifShow: ({ values }) => values.limit_type == 2,
  },
  {
    field: 'ignore_day',
    component: 'Select',
    label: t('table.risk.report_ignored_day') + ':',
    defaultValue: 7,
    required: true,
    ifShow: ({ values }) => values.limit_type == 3,
    componentProps: {
      options: ignoreDayOptions,
      allowClear: false,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'remarks',
    component: 'InputTextArea',
    label: t('business.common_remarks_infor') + ':', //备注信息
    required: true,
    componentProps: {
      placeholder: t('modalForm.member.member_remark_tip1'), //请输入备注信息
      rows: 3,
    },
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject(t('modalForm.member.member_remark_tip1'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
];
