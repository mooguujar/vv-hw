import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
// 表格内容
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('table.finance.finance_total_deposit'),
    dataIndex: 'deposit_amount',
    minWidth: 160,
    align: 'center',
  },

  {
    title: t('table.member.member_withdraw_money'),
    dataIndex: 'withdraw_amount',
    minWidth: 100,
    align: 'center',
  },

  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'cash_profit',
    minWidth: 100,
    align: 'center',
  },

  {
    title: t('table.report.report_gift_amount'),
    dataIndex: 'gift_amount',
    minWidth: 100,
    align: 'center',
  },

  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 100,
    align: 'center',
    customCell: () => ({
      class: 'text-red',
    }),
  },
  {
    title: t('business.common_member_platform_iswin'),
    dataIndex: 'net_amount',
    minWidth: 100,
  },
  {
    title: t('business.common_member_Coding_multiple'),
    dataIndex: 'bet_multiplier',
    minWidth: 100,
    customCell: () => ({
      class: 'text-red',
    }),
  },
];
