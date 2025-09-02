import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 入款
export const detailsList = [
  { label: t('business.common_all'), value: '' }, //全部
  { label: t('table.discountActivity.insurance_stock_entry'), value: '838' }, //保险库存入
  { label: t('table.discountActivity.vault_extraction'), value: '839' }, //保险库取出
  { label: t('table.discountActivity.vault_interest'), value: '8370' }, //保险库利息
];

export const state = [
  { label: t('table.common.normal'), value: 1 },
  { label: t('table.common.deactivate'), value: 2 },
  { label: t('table.common.delete'), value: 3 },
];

export const giveTime = [
  { label: t('table.discountActivity.next_day_release'), value: 1 },
  { label: t('table.discountActivity.real_time_release'), value: 2 },
];

export const automaticList = [
  { label: t('business.common_all'), value: 0 },
  { label: t('table.discountActivity.automaticList_1'), value: 1 },
  { label: t('table.discountActivity.automaticList_2'), value: 2 },
];

export const joinObjectTypeOptions = [
  { label: t('modalForm.discountActivity.membership_level'), value: 3 }, //会员层级
  { label: t('modalForm.discountActivity.appointed_agent'), value: 5 }, //指定代理
  { label: t('modalForm.discountActivity.full_agency'), value: 6 }, //全部代理
  // { label: '全部会员', value: 1 },
  // { label: '指定会员', value: 2 },
  { label: t('modalForm.discountActivity.vip_level'), value: 4 }, //VIP等级
];

export const joinObjectTypeOptionsFilter = [
  { label: t('table.system.system_all_members'), value: 1 },
  { label: t('table.system.system_designated_member'), value: 2 },
  { label: t('modalForm.discountActivity.membership_level'), value: 3 }, //会员层级
  { label: t('table.discountActivity.appoint_vip'), value: 4 },
  { label: t('modalForm.discountActivity.appointed_agent'), value: 5 },
  { label: t('modalForm.discountActivity.full_agency'), value: 6 },
];

export function convertSecondsToTimeFormat(seconds: number): string {
  const oneHourInSeconds = 3600;
  const oneDayInSeconds = 86400;

  if (seconds > oneDayInSeconds) {
    // 转换成天数，并保留两位小数
    return t('common.some_day', seconds / oneDayInSeconds);
  } else {
    // 转换成小时数，并保留两位小数
    return t('common.some_hour', seconds / oneHourInSeconds);
  }
}
