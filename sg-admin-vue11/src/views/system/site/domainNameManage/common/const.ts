import { useI18n } from '/@/hooks/web/useI18n';
import { Options } from '/@/types/index';
/*域名管理*/
const { t } = useI18n();
export const domainReloadOptions = [
  { label: t('business.common_pause'), value: -1 }, //暂停
  { label: '5 ' + t('table.member.member_minute'), value: 300000 },
  { label: '10 ' + t('table.member.member_minute'), value: 6000000 },
];

//域名管理-主域名管理
export const masterDemainState = [
  {
    label: t('business.common_all'),
    value: 0,
  },
  {
    label: t('table.system.system_wait_verify'),
    value: 2,
  },
  {
    label: t('business.common_normal'),
    value: 1,
  },
  {
    label: t('table.system.system_expired'),
    value: 3,
  },
];

export const optionsStates = [
  {
    label: t('business.common_all'),
    value: 0,
  },
  {
    label: t('table.system.system_started_ed'),
    value: 4,
  },
  {
    label: t('table.system.system_start_'),
    value: 1,
  },
  {
    label: t('table.system.system_susess_start'),
    value: 2,
  },
  {
    label: t('table.system.system_deact_ing'),
    value: 3,
  },
];
//域名管理定义弹框类型
export const demondName = {
  1: t('common.WEBLobbyDomain'),
  2: t('common.apiLine'),
  3: t('common.ossAccelerate'),
  4: t('table.system.system_router'),
  5: t('modalForm.finance.finance_domain_name'),
};
//自定义解析类型
export const customizeOptions = [
  {
    label: 'A',
    value: 'A',
  },
  {
    label: 'CNAME',
    value: 'CNAME',
  },
  {
    label: 'TXT',
    value: 'TXT',
  },
  {
    label: 'AAAA',
    value: 'AAAA',
  },
];

export const ttlOptions = [
  {
    label: t('common.nMinutes', [1]),
    value: 60,
  },
  {
    label: t('common.nMinutes', [2]),
    value: 120,
  },
  {
    label: t('common.nMinutes', [5]),
    value: 300,
  },
  {
    labe: t('common.nMinutes', [10]),
    value: 600,
  },
  {
    label: t('common.nMinutes', [15]),
    value: 900,
  },
  {
    label: t('common.nMinutes', [30]),
    value: 1800,
  },
  {
    labe: t('common.nHours', [1]),
    value: 3600,
  },
  {
    label: t('common.nHours', [2]),
    value: 7200,
  },
  {
    label: t('common.nHours', [5]),
    value: 18000,
  },
  {
    label: t('common.nHours', [12]),
    value: 43200,
  },
  {
    label: t('common.nHours', [20]),
    value: 86400,
  },
];
/*域名管理*/

// 域名 - 节点
export const domainode: Options = [
  {
    label: 'Cloudflare',
    value: 'cloudflare',
  },
  {
    label: 'Gcore',
    value: 'gcore',
  },
  {
    label: t('table.discountActivity.discount_custom'),
    value: 'custom',
  },
];

//侧边栏域名
export const domainodeSide: Options = [
	{
    label: t('table.discountActivity.discount_custom'),
    value: 'custom',
  },
  {
    label: 'Cloudflare',
    value: 'cloudflare',
  },
  {
    label: 'Gcore',
    value: 'gcore',
  },
];
