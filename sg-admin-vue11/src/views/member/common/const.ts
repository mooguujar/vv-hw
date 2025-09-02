import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
//会员日志-登录日志
export const deviceMap = {
  '24': 'PC',
  '25': 'H5',
  '26': 'Android',
  '27': 'IOS',
  '28': 'PWA',
};
export const stateOptions = [
  { label: t('business.common_all'), value: '' },
  { label: t('business.common_normal'), value: '1' },
  { label: t('business.common_deactivate'), value: '2' },
  { label: t('business.common_active'), value: '3' },
  { label: t('business.common_offline'), value: '4' },
];
export const stateListOptions = [
  { label: t('business.common_all'), value: 0 },
  { label: t('business.common_normal'), value: 1 },
  { label: t('business.common_deactivate'), value: 2 },
];
export const stateTypeOptions = [
  {
    label: t('table.member.member_account_state'),
    value: 'state',
  },
  {
    label: t('table.member.member_discount_status'),
    value: 'bonus_state',
  },
  {
    label: t('table.member.member_rebate_state'),
    value: 'commission_state',
  },
  {
    label: t('table.member.member_rabate_walter'),
    value: 'rebate_state',
  },
];
export const Client = {
  24: 'PC',
  25: 'H5',
  26: 'Android',
  27: 'IOS',
};

//无限极会员类型getSiteType
export const noMemberTypeList = [
  { value: 2, label: t('table.member.member_proxy'), type: 'proxy' },
  { value: 3, label: t('table.member.member_partner'), type: 'partner' },
];

//会员列表-会员详情-操作日志-操作事件
export const operationEventOptions = [
  { label: t('business.common_all'), value: '' },
  { label: t('table.member.member_update_member'), value: '3219' },
  { label: t('common.update_login_password'), value: '3220' },
  { label: t('table.member.membe_update_pay'), value: '3221' },
  { label: t('common.set_self_exclusion'), value: '3250' },
  { label: t('common.delete_account'), value: '3251' },
];
export const addContentOptions = [
  { label: t('table.member.member_wallet'), value: 1 },
  { label: t('table.member.member_commision'), value: 2 },
];
// export const ButtonList = [
//   { value: t('modalForm.member.member_add_reduce'), type: 'addMoney' },
//   { value: '批量加款减款', type: 'moreMoney' },
// ];

//会员详情-关联账号 linked_type  1 登录IP，2 注册IP，3 登录设备号，4 注册设备号 统一成这样
export const linkedAccountOptions = {
  1: t('table.system.system_login_ip'),
  3: t('table.system.system_registered_ip'),
  2: t('table.member.member_device_tip2'), //登录
  4: t('table.member.member_device_tip1'), //注册
  5: t('table.system.system_member_account'), //会员账号
  6: t('table.system.system_username'), //姓名
};
export const linkOptions = [
  {
    label: t('table.system.system_member_account'), //会员账号
    value: 5,
  },
  {
    label: t('table.member.member_user_name'), //姓名
    value: 6,
  },
  {
    label: t('table.system.system_login_ip'), //登录IP
    value: 1,
  },
  {
    label: t('table.system.system_registered_ip'), //注册IP
    value: 3,
  },
  {
    label: t('table.member.member_device_tip2'), //登录设备号
    value: 2,
  },
  {
    label: t('table.member.member_device_tip1'),
    value: 4,
  },
];

//把这个对象转换为 [{label:'西瓜', value:1}, {label:'相关', value:2},{label:'平道', value:3},{label:'上线', value:4}]

export const typeShowOptions = {
  1: t('table.member.member_deactivate_account'),
  2: t('table.member.member_deactivate_discount'),
  3: t('table.member.member_deactivate_rabate'),
  4: t('table.member.member_deactivate_walter'),
  5: t('table.member.member_remark_'),
};

//会员管理-VIP等级-返水配置
export const gameDictionary1 = {
  1: t('table.member.member_live'),
  2: t('table.member.member_fish'),
  3: t('table.member.member_electic_'),
  4: t('table.system.system_physical_education'),
  5: t('table.member.member_chess'),
  6: t('table.member.member_egame'),
};
