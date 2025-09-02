import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const editData: FormSchema[] = [
  {
    field: 'level',
    component: 'InputNumber',
    label: t('table.member.member_current_level'),
    colProps: {
      span: 24,
    },
    //labelWidth: '150px',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'alias',
    component: 'Input',
    required: true,
    label: t('table.member.member_grade_name'),
    //labelWidth: '150px',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: t('table.member.member_input_level'),
    },
  },
  {
    field: 'score',
    component: 'InputNumber',
    required: true,
    label: t('table.member.member_updata_'),
    //labelWidth: '150px',
    colProps: {
      span: 24,
    },
    componentProps: {
      stringMode: true,
      addonAfter: t('modalForm.member.member_integral'),
    },
  },
  {
    field: 'retain_score',
    component: 'InputNumber',
    required: true,
    label: t('table.member.member_relegation'),
    //labelWidth: '150px',
    colProps: {
      span: 24,
    },
    componentProps: {
      stringMode: true,
      addonAfter: t('modalForm.member.member_integral'),
    },
  },
  {
    field: 'up_gift',
    required: true,
    component: 'InputNumber',
    slot: 'upGift',
    label: t('table.member.member_promotion_gift'),
    //labelWidth: '150px',
    colProps: {
      span: 24,
    },
    componentProps: {
      stringMode: true,
      placeholder: t('table.member.member_gift_money'),
      addonAfter: 'USDT',
      min: 0,
    },
  },
  {
    field: 'daily_gift',
    component: 'InputNumber',
    slot: 'dailyGift',
    label: t('table.member.member_every_day'),
    //labelWidth: '150px',
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      stringMode: true,
      placeholder: t('table.member.member_day_input'),
      addonAfter: 'USDT',
      min: 0,
    },
  },
  {
    field: 'weekly_gift',
    component: 'InputNumber',
    slot: 'weeklyGift',
    label: t('table.member.member_every_week'),
    //labelWidth: '150px',
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      stringMode: true,
      placeholder: t('table.member.member_week_input'),
      addonAfter: 'USDT',
      min: 0,
    },
  },
  {
    field: 'monthly_gift',
    component: 'InputNumber',
    slot: 'monthlyGift',
    label: t('table.member.member_every_month'),
    //labelWidth: '150px',
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      stringMode: true,
      placeholder: t('table.member.member_month_input'),
      addonAfter: 'USDT',
      min: 0,
    },
  },
  {
    field: 'birthday_gift',
    slot: 'birthdayGift',
    component: 'InputNumber',
    //labelWidth: '150px',
    label: t('table.member.member_birthday_price'),
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      stringMode: true,
      addonAfter: 'USDT',
    },
  },
  {
    field: 'multiple',
    component: 'InputNumber',
    label: t('table.member.member_multiple'),
    //labelWidth: '150px',
    required: true,
    colProps: {
      span: 24,
    },
  },
  {
    field: 'is_default',
    component: 'Input',
    label: t('table.member.member_default_set'),
    //labelWidth: 100,
    defaultValue: false,
    colProps: {
      span: 18,
    },
    slot: 'idDefault',
    show: ({ values }) => {
      return values.is_default !== '1';
    },
  },
  {
    field: 'rebate_config',
    component: 'Input',
    label: '',
    ifShow: false,
  },
];
