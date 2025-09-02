import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 充值订单 //状态：1：成功，2：失败，3，支付中，4：删除，5:待审核 6：取消
export const rechargeOrderStatus = {
  1: t('business.common_success'),
  2: t('business.common_fail'),
  3: t('business.common_exchanging'),
  4: t('common.delText'),
  5: t('business.common_pending_approval'),
  6: t('common.cancelText'),
};

export const rechargeOrderColor = {
  1: 'green',
  2: 'red',
  3: 'blue',
  4: 'red',
  5: 'blue',
  6: 'red',
};

export const virtualCurrency = [
  { value: '706', label: 'USDT' },
  { value: '707', label: 'BTC' },
  { value: '708', label: 'ETH' },
];

export const ipSettingList = [
  {
    label: t('table.system.system_management_background'), //管理后台
    value: '1',
  },
  // {
  //   label: t('table.report.report_client'), //客户端
  //   value: '2',
  // },
  // {
  //   label: t('table.system.system_guidance_site'), //导航站
  //   value: '3',
  // },
];

export const ipSettingMap = {
  '1': t('table.system.system_management_background'),
  '2': t('table.report.report_client'),
  '3': t('table.system.system_guidance_site'),
};

// 站点维护状态
export function useMaintainStatus() {
  const { t } = useI18n();
  const maintainStatus = {
    1: t('table.common.normal'),
    2: t('table.common.in_maintenance'),
    3: t('common.freezing'),
  };
  return { maintainStatus };
}

// 站点状态
export function useSitesStatus() {
  const { t } = useI18n();
  const sitesStatus = {
    1: t('table.system.site_normal'),
    2: t('table.system.site_backend_restrictions'),
    3: t('common.siteBatchDetail_2'),
  };
  return { sitesStatus };
}

export const siteStyle = {
  1: '#6ba622',
  2: '#f6af5b',
  3: '#ec808d',
  4: '#e35666#',
  5: '#e14d5d',
};

// 站点模版
export function useTemplateStatus() {
  const { t } = useI18n();
  const templateStatus = {
    1: 'stake-' + t('table.system.black_color_1'),
    2: 'stake-' + t('table.system.black_color_2'),
    3: 'bc.game',
    4: t('common.con17'),
    5: t('common.con18'),
    6: 'stake-' + t('table.system.black_color_1') + 2,
    7: '菲PHP女皇',
  };
  return { templateStatus };
}

//代理模式
export function useAgencyModeStatus() {
  const { t } = useI18n();
  const agencyModeStatus = {
    1: t('table.system.agency_mode_no_limit'),
    2: t('v.sytem.site.firstAgent'),
  };
  return { agencyModeStatus };
}

//站点账单状态 1=待核对(财务) 2=待核对(总财务) 3=待支付 4=完成
export function useSiteBillStatus() {
  const { t } = useI18n();
  const siteBillStatus = {
    1: t('table.system.verified_finance'),
    2: t('table.system.verified_general_finance'),
    3: t('table.system.site_bill_to_be_paid'),
    4: t('table.system.completed'),
  };
  return { siteBillStatus };
}
