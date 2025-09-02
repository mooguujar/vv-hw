import { FormSchema } from '/@/components/Table';
import { commaSeparatedString } from '/@/utils/regexp';

import { joinObjectTypeOptions } from '../../const';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();
//包含IP V6和V4
export const accountFormSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    show: false,
  },
  {
    field: 'join_object_type',
    label: t('modalForm.discountActivity.participant') + ':', //限制类型
    component: 'RadioGroup',
    colProps: {
      span: 24,
      style: {
        marginLeft: '10px',
      },
    },
    // rules: [{ required: true, message: 'BRL最低存入金额' }],
    helpMessage: '-',
    helpComponentProps: {
      text: `
			<div><span style='color:#FACD91;'>${t('modalForm.discountActivity.membership_level')}：</span>${t(
        'modalForm.discountActivity.membership_level_descript',
      )}</div>
			<div><span style='color:#FACD91;'>${t('modalForm.discountActivity.appointed_agent')}：</span>${t(
        'modalForm.discountActivity.appointed_agent_descript',
      )}</div>
			<div><span style='color:#FACD91;'>${t('modalForm.discountActivity.full_agency')}：</span>${t(
        'modalForm.discountActivity.full_agency_descript',
      )}</div>
      <div><span style='color:#FACD91;'>${t('modalForm.discountActivity.vip_level')} ：</span>${t(
        'modalForm.discountActivity.vip_level_descript',
      )} </div>
                `,
      placement: 'right',
      isBefore: true,
    },
    defaultValue: 3,
    componentProps: {
      options: joinObjectTypeOptions,
    },
  },
  {
    field: 'join_object_value2',
    component: 'Input',
    label: t('modalForm.discountActivity.designated_member') + ':', //指定会员
    required: true,
    colProps: { span: 24 },
    componentProps: {
      placeholder: t('table.system.separate_member'),
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(`t('modalForm.discountActivity.member_tip1')`); //请输入指定会员
          }
          if (!commaSeparatedString.test(value)) {
            return Promise.reject(t('table.system.separated_member_error'));
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => values.join_object_type === 2,
  },
  {
    field: 'join_object_value3',
    component: 'ApiSelect',
    label: t('business.common_member_level') + ':', //会员层级
    required: true,
    slot: 'selectMember',
    colProps: { span: 24 },
    ifShow: ({ values }) => values.join_object_type === 3,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'join_object_value4',
    label: t('business.commin_vip_level') + ':', //VIP等级
    component: 'ApiSelect',
    required: true,
    slot: 'selectVIP',
    colProps: { span: 24 },
    ifShow: ({ values }) => values.join_object_type === 4,
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'join_object_value5',
    component: 'Input',
    label: t('table.system.system_designated_agent') + ':', //指定代理
    required: true,
    colProps: { span: 24 },
    componentProps: {
      placeholder: t('table.system.separated_agents'),
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('modalForm.discountActivity.agency_tip0')); //请输入指定代理
          }
          if (!commaSeparatedString.test(value)) {
            return Promise.reject(t('table.system.separated_member_error'));
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => values.join_object_type === 5,
  },
  {
    field: 'DepositCurrency',
    label: t('table.discountActivity.discount_save_currency') + ':', //存入币种
    component: 'CheckboxGroup',
    required: true,
    slot: 'reloadTime2',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'category',
    component: 'Input',
    colSlot: 'colSlot_field5',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'bet_multiples',
    component: 'Input',
    required: true,
    label: t('table.discountActivity.interest_audit_multiple') + ':', //利息稽核倍数
    colProps: {
      span: 24,
    },
  },

  {
    field: 'bill_time',
    label: t('table.discountActivity.discount_settlement_cycle') + ':', //结算周期
    required: true,
    component: 'RadioGroup',
    colProps: {
      span: 18,
    },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('modalForm.discountActivity.one_hour'), value: 1 }, //1小时
        { label: t('modalForm.discountActivity.twelve_hour'), value: 2 }, //12小时
        { label: t('modalForm.discountActivity.twenty_four_hour'), value: 3 }, //24小时
        { label: t('modalForm.discountActivity.other'), value: 4 }, //其他
      ],
    },
  },
  {
    field: 'bill_time_day',
    component: 'InputNumber',
    label: '', //限制类型
    colProps: {
      span: 7,
    },
    defaultValue: 2,
    ifShow: ({ values }) => values.bill_time === 4,
    componentProps: {
      controls: false,
      min: 0,
      precision: 0,
    },
    rules: [
      {
        required: true,
        trigger: 'change',
        validator: (rule, value) => {
          if (value < 2) {
            return Promise.reject(t('table.discountActivity.discount_enter_days1'));
          }
          return Promise.resolve();
        },
      },
    ],
    renderComponentContent: () => {
      return {
        addonAfter: () => t('component.time.days'),
      };
    },
  },

  {
    field: 'give_time',
    label: t('table.system.system_delivery_time') + ':', //发放时间
    required: true,
    component: 'RadioGroup',
    colProps: {
      span: 24,
    },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('modalForm.discountActivity.next_day_release'), value: 1 }, //次日发放
        { label: t('modalForm.discountActivity.real_time_release'), value: 2 }, //实时发放(影响留存)
      ],
    },
  },

  {
    field: 'interest_limit',
    required: true,
    label: t('table.discountActivity.interest_cap') + ':', //利息封顶
    component: 'InputNumber',
    slot: 'InterestLimit',
    helpMessage: '-',
    helpComponentProps: {
      text: `<div><span style='color:#FACD91;'>${t(
        'table.discountActivity.interest_cap',
      )}：</span>${t('table.discountActivity.discount_bxk_enter_err')}</div>`,
      placement: 'right',
      isBefore: true,
    },
    componentProps: {
      placeholder: t('modalForm.discountActivity.wo_limit_zero'), //请输入，0不限制
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rule_type',
    label: t('modalForm.discountActivity.interest_treasure_rule') + ':', //限制类型
    required: true,
    component: 'RadioGroup',
    colProps: {
      span: 24,
    },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('modalForm.discountActivity.systematic_modal'), value: 1 }, //系统模版
        // { label: t('modalForm.discountActivity.custom_edit'), value: 2 }, //自定义编辑
      ],
    },
  },
  {
    field: 'content',
    component: 'Input',
    // label: t('table.discountActivity.discount_rule_sepification'),
    label: ' ',
    colProps: {
      span: 24,
    },
    slot: 'uploadText',
    ifShow: ({ values }) => {
      return values.rule_type == 1;
    },
  },
  {
    field: 'content',
    component: 'Input',
    // label: t('table.discountActivity.discount_rule_sepification'),
    label: ' ',
    colProps: {
      span: 24,
    },
    slot: 'uploadTextRule',
    ifShow: ({ values }) => {
      return values.rule_type == 2;
    },
  },
  {
    field: 'content',
    component: 'Input',
    colProps: {
      span: 24,
    },
    label: t('table.discountActivity.discount_rule_sepification_content') + ':',
    slot: 'previewText',
    ifShow: ({ values }) => {
      return values.rule_type == 2;
    },
  },
];
useAutoLabelWidth(accountFormSchema);
