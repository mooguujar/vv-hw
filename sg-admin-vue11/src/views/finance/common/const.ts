import { COLORS } from '../../common/const';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export enum FINANCE_TYPE {
  CURRENCY_DEPOSIT = 'currency_deposit',
  COMPANY_DEPOSIT = 'company_deposit',
  ONLINE_WITHDRAWAL = 'online_withdrawal',
  CURRENCY_WITHDRAWAL = 'currency_withdrawal',
}

export enum RECHARGE_TYPE {
  ONLINE = 1,
  COMPANY = 2,
  CURRENCY = 3,
}

export enum WITHDRAWAL_TYPE {
  ONLINE = 1,
  CURRENCY = 2,
}

export enum AUDIT_TYPE {
  DEPOSIT = 1,
  WITHDRAWAL = 2,
}

export enum UPDATE_METHOD_MODE {
  NORMAL = 'normal',
  MODAL = 'modal',
  NONE = 'none',
  ADD = 'add',
}

export const RELOAD_TIME_OPTIONS = [
  { label: t('business.common_pause'), value: -1 }, //暂停
  { label: '15 ' + t('business.common_second'), value: 15000 },
  { label: '30 ' + t('business.common_second'), value: 30000 },
  { label: '60 ' + t('business.common_second'), value: 60000 },
];

export const amountType = {
  1: t('modalForm.finance.finance_fix_amount'), //固定金额
  2: t('modalForm.finance.finance_any_amount'), //任意金额
};

export const auditData = {
  1: t('business.common_income_approval'), //入款审核
  2: t('business.common_disbursement_approval'), //出款审核
};

export const auditRenderData = {
  0: '待审核',
  1: '成功',
  2: '拒绝',
  3: '出款中',
};

export const stateOnlineRenderData = {
  1: t('business.common_success'), //成功
  2: t('business.common_fail'), //失败
  3: t('business.common_exchanging'), //交易中
};

export const stateGameRecordData = {
  0: t('table.report.report_Settl'),
  1: t('table.report.report_Settled'),
  2: t('table.report.report_'),
  3: t('common.translate.word55'),
};

export const stateGameRecordColor = {
  0: COLORS.ERROR,
  1: COLORS.SUCCESS,
  2: COLORS.ERROR,
  3: COLORS.ERROR,
};

export const stateRenderData = {
  1: t('business.common_success'),
  2: t('business.common_reject'),
  3: t('business.common_pending_approval'),
};
// 公司入款
export const stateRenderCompanyData = {
  1: t('business.common_success'), //成功
  2: t('business.common_reject'), //拒绝
  // 3: t('business.common_on_paying'), //支付中
  5: t('business.common_pending_approval'), //待审核
  // 6: t('business.common_cancel'), //取消
};
// 公司入款
export const stateGameRecordCompanyColor = {
  0: COLORS.ERROR,
  1: COLORS.SUCCESS,
  2: COLORS.ERROR,
  3: COLORS.INFO,
  4: COLORS.ERROR,
  5: COLORS.INFO,
  6: COLORS.INFO,
};
// 线上取款
export const stateRenderWithdrawalData = {
  1: t('business.common_success'), //成功
  2: t('business.common_reject'), //拒绝
  3: t('business.common_pending_approval'), //审核中
  5: t('business.common_three_way_err'), //三方异常
  6: t('business.common_disbursement_in_progress'), //出款中
};

// 线上取款
export const stateGameRecordWithdrawalColor = {
  0: COLORS.ERROR,
  1: COLORS.SUCCESS,
  2: COLORS.ERROR,
  3: COLORS.INFO,
  4: COLORS.ERROR,
  5: COLORS.ERROR,
  6: COLORS.INFO,
};

// 货币入款
export const stateRenderCurrencyDepositData = {
  1: t('business.common_success'), //成功
  2: t('business.common_reject'), //拒绝
  // 3: t('business.common_on_paying'), //支付中
  5: t('business.common_pending_approval'), //待审核
  // 6: t('business.common_cancel'), //取消
};
// 货币入款
export const stateCurrencyDepositColor = {
  0: COLORS.ERROR,
  1: COLORS.SUCCESS,
  2: COLORS.ERROR,
  3: COLORS.INFO,
  4: COLORS.ERROR,
  5: COLORS.INFO,
  6: COLORS.INFO,
};

// 货币取款
export const stateCurrencyDepositData = {
  1: t('business.common_success'), //成功
  2: t('business.common_reject'), //拒绝
  3: t('business.common_pending_approval'), //审核中
  5: t('business.common_three_way_err'), //三方异常
  6: t('business.common_disbursement_in_progress'), //出款中
};
// 货币取款
export const stateDepositColor = {
  0: COLORS.ERROR,
  1: COLORS.SUCCESS,
  2: COLORS.ERROR,
  3: COLORS.INFO,
  5: COLORS.ERROR,
  6: COLORS.INFO,
};

export const stateList: any = [
  { label: t('business.common_all'), value: 0 },
  { label: stateRenderData[1], value: 1 },
  { label: stateRenderData[2], value: 2 },
  { label: stateRenderData[3], value: 3 },
];

export const stateRenderColor = {
  1: COLORS.SUCCESS,
  2: COLORS.ERROR,
  3: COLORS.INFO,
};

// 入款
export const searchTypeDepositList = [
  { label: t('business.common_member_account'), value: 1 }, //会员账号
  { label: t('business.common_super_agent'), value: 2 }, //上级代理
  { label: t('business.common_order_number'), value: 3 }, //订单号
  { label: t('business.common_auditors'), value: 4 }, //审核人员
];

// 取款
export const searchTypeWithdrawalList = [
  { label: t('business.common_member_account'), value: 1 }, //会员账号
  { label: t('business.common_order_number'), value: 2 }, //订单号
  { label: t('business.common_actual_name'), value: 3 }, //真实姓名
  { label: t('business.common_auditors'), value: 4 }, //审核人员
];

// 货币取款
export const searchCurrencyWithdrawalList = [
  { label: t('business.common_member_account'), value: 1 }, //会员账号
  { label: t('business.common_order_number'), value: 2 }, //订单号
  { label: t('business.common_auditors'), value: 3 }, //审核人员
];
// 充值订单 //状态：1：成功，2：失败，3，支付中，4：删除，5:待审核 6：取消
export const rechargeOrderStatus = {
  1: '成功',
  2: '失败',
  3: '支付中',
  4: '删除',
  5: '待审核',
  6: '取消',
};

export const rechargeOrderColor = {
  1: COLORS.SUCCESS,
  2: COLORS.ERROR,
  3: COLORS.INFO,
  4: COLORS.ERROR,
  5: COLORS.INFO,
  6: COLORS.ERROR,
};

export const getWithdrawTimesData = (withdrawTimes) => {
  let text = '';
  switch (withdrawTimes) {
    case 0:
      text = t('business.common_frequency_error'); //次数错误
      break;
    case 1:
      text = t('business.common_first_time'); //首次
      break;
    case 2:
      text = t('business.common_second_time'); //二次
      break;
    case 3:
      text = t('business.common_third_time'); //三次
      break;
    default:
      text = '-';
  }

  return text;
};

export const paymentType = [
  { label: 'USDT', value: 'USDT' },
  { label: 'CNY', value: 'CNY' },
  { label: 'PIX', value: 'PIX' },
];

export const pixTYpe = [
  { label: 'CPF', value: 'CPF' },
  { label: 'CNPJ', value: 'CNPJ' },
  { label: 'Phone', value: 'Phone' },
  { label: 'Email', value: 'Email' },
  { label: 'Evp', value: 'Evp' },
];

// 代付平台 TODO: 接接口
export const prePaymentPlatform = [
  { label: 'AA', value: 'AA' },
  { label: 'BB', value: 'BB' },
];
