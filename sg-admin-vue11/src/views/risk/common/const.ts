import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

// 限制类型
export const limitTypeOptions = [
  {
    label: t('modalForm.risk.risk_deactivate'),
    value: 1,
  },
  {
    label: t('table.member.member_limit_discount'),
    value: 2,
  },
  {
    label: t('business.comon_ignore'),
    value: 3,
  },
];

export const linkedRecordsLimitTypeOptions = [
  {
    label: t('modalForm.risk.risk_deactivate'),
    value: 1,
  },
  {
    label: t('table.member.member_limit_discount'),
    value: 2,
  },
];

// 限制类型
export const linkRecordLimitTypeOptions = [
  {
    label: '-',
    value: 0,
  },
  ...limitTypeOptions,
];

export const limitTypeOptionsFilter = [
  {
    label: t('table.risk.report_pending'),
    value: 0,
  },
  {
    label: t('modalForm.risk.risk_deactivate'),
    value: 1,
  },
  {
    label: t('table.member.member_limit_discount'),
    value: 2,
  },
  {
    label: t('business.comon_ignore'),
    value: 3,
  },
  {
    label: t('business.common_delete_b'),
    value: 4,
  },
];

// 忽略天数
export const ignoreDayOptions = [
  {
    label: `3 ${t('component.time.days')}`,
    value: 3,
    key: '1',
  },
  {
    label: `7 ${t('component.time.days')}`,
    value: 7,
    key: '2',
  },
  {
    label: `30 ${t('component.time.days')}`,
    value: 30,
    key: '3',
  },
];

// 限制优惠状态
export const limit_discount_type = [
  { label: t('search.finance.finance_discount'), value: 0 },
  { label: t('table.member.member_rebate_walter'), value: 1 },
  { label: t('table.member.member_commision'), value: 2 },
];
//关联类型
export function useLinkRecordTypeList() {
  const { t } = useI18n();
  const linkRecordTypeList = [
    {
      label: t('business.common_all'),
      value: '',
    },
    {
      label: t('table.risk.report_login_ip'),
      value: 1,
    },
    {
      label: t('table.risk.report_register_ip'),
      value: 2,
    },
    {
      label: t('table.risk.report_login_deviceno'),
      value: 3,
    },
    {
      label: t('table.member.member_device_tip1'),
      value: 4,
    },
  ];
  return { linkRecordTypeList };
}

//处罚记录关联类型
export const penaltyRecordTypeList = [
  { label: t('business.common_all'), value: '' },
  { label: t('table.risk.report_login_ip'), value: 1 },
  { label: t('table.risk.report_register_ip'), value: 2 },
  { label: t('table.risk.report_login_deviceno'), value: 3 },
  { label: t('table.member.member_device_tip1'), value: 4 },
  { label: t('table.risk.report_login_password'), value: 5 },
  { label: t('table.risk.report_withdrawal_password'), value: 6 },
];
