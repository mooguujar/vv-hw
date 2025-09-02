import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const setTooltip = (text, color = '') => {
  return h(() =>
    h(
      'div',
      {
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        },
        class: color,
      },
      text,
    ),
  );
};
const { t } = useI18n();

// 表格内容
const firstDepositColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'), //对打站点
    dataIndex: 'username',
  },
  {
    title: t('business.common_super_agent'), //对打站点
    dataIndex: 'parent_name',
  },
  {
    title: t('table.report.report_member_level'), //对打会员
    dataIndex: 'level_name',
  },
  {
    title: t('table.system.system_vip_level'), //游戏类型
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      if (record.vip) return `VIP${record.vip}`;
    },
  },

  {
    title: t('table.report.report_first_deposit_amount'), //游戏平台
    dataIndex: 'first_day_deposit',
    sorter: true,
  },
  {
    title: t('table.promotion.promotion_take_amount'), //游戏平台
    dataIndex: 'withdraw_amount',
    sorter: true,
  },
  {
    title: t('business.common_member_cash_profit'), //游戏平台
    dataIndex: 'cash_profit',
    sorter: true,
  },
  {
    title: t('table.report.report_reg_time'), //期数/局号
    dataIndex: 'reg_time',
    customRender: ({ record }) => {
      return toTimezone(record.reg_time);
    },
  },
];
useAutoTableLabelWidth(firstDepositColumns);
const depositColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    // customRender: ({ record }) => {
    //   return setTooltip(record.username);
    // },
  },
  {
    title: t('business.common_super_agent'), //对打站点
    dataIndex: 'parent_name',
  },
  {
    title: t('table.report.report_member_level'),
    dataIndex: 'level_name',
  },
  {
    title: t('table.system.system_vip_level'),
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      if (record.vip) return `VIP${record.vip}`;
    },
  },

  {
    title: t('table.report.report_online_pay'),
    dataIndex: 'online_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_wallet_pay'),
    dataIndex: 'wallet_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_virtual_pay'),
    dataIndex: 'virtual_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_company_deposit'),
    dataIndex: 'offline_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('table.report.report_currency_deposit'),
    dataIndex: 'coin_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.manual_deposit'),
    dataIndex: 'admin_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.deposit_order_lost'),
    dataIndex: 'lost_deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('table.finance.finance_total_deposit'),
    dataIndex: 'deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
];
useAutoTableLabelWidth(depositColumns);
const withdrawColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    customRender: ({ record }) => {
      return setTooltip(record.username);
    },
  },
  {
    title: t('business.common_super_agent'), //对打站点
    dataIndex: 'parent_name',
  },
  {
    title: t('table.report.report_member_level'),
    dataIndex: 'level_name',
  },
  {
    title: t('table.system.system_vip_level'),
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      if (record.vip) return `VIP${record.vip}`;
    },
  },

  {
    title: t('table.report.report_online_withdraw'),
    dataIndex: 'online_withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_currency_withdraw'),
    dataIndex: 'coin_withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('table.report.automatic_withdrawal'),
    dataIndex: 'auto_withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.manual_withdrawal'),
    dataIndex: 'admin_withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.wrong_deposits_and_withdrawals'),
    dataIndex: 'error_withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.member.member_withdraw_money'),
    dataIndex: 'withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
  },
];
useAutoTableLabelWidth(withdrawColumns);
const cashProfitColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    customRender: ({ record }) => {
      return setTooltip(record.username);
    },
  },
  {
    title: t('business.common_super_agent'), //对打站点
    dataIndex: 'parent_name',
  },
  {
    title: t('table.report.report_member_level'),
    dataIndex: 'level_name',
  },
  {
    title: t('table.system.system_vip_level'),
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      if (record.vip) return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.finance.finance_total_deposit'),
    dataIndex: 'deposit_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.member.member_withdraw_money'),
    dataIndex: 'withdraw_amount',
    sorter: true,
    showSorterTooltip: false,
  },

  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'cash_profit',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_bet_multiplier'),
    dataIndex: 'bet_multiplier',
    sorter: true,
    showSorterTooltip: false,
  },
];
useAutoTableLabelWidth(cashProfitColumns);
const commissionColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 75,
    customRender: ({ record }) => {
      return setTooltip(record.username);
    },
  },
  {
    title: t('table.report.report_member_level'),
    dataIndex: 'level_name',
    minWidth: 75,
  },
  {
    title: t('table.system.system_vip_level'),
    dataIndex: 'vip',
    minWidth: 70,
    customRender: ({ record }: any) => {
      if (record.vip) return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.system.system_total_performance'),
    dataIndex: 'valid_bet_amount_total',
    minWidth: 70,
  },
  {
    title: t('table.system.system_direct_performance'),
    dataIndex: 'valid_bet_amount_direct',
    minWidth: 70,
  },

  {
    title: t('table.system.system_other_commission'),
    dataIndex: 'commission_amount_other',
    minWidth: 70,
  },
  {
    title: t('table.report.commission_amount_total'),
    dataIndex: 'commission_amount_total',
    minWidth: 70,
  },
];
useAutoTableLabelWidth(commissionColumns);
export const getColumnsFun = (type): any => {
  switch (type) {
    case 'first_deposit':
      return firstDepositColumns;
    case 'deposit':
      return depositColumns;
    case 'withdraw':
      return withdrawColumns;
    case 'cash_profit':
      return cashProfitColumns;
    case 'commission':
      return commissionColumns;
  }
};
