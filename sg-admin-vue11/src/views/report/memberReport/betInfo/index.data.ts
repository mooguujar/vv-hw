import { BasicColumn } from '/@/components/Table';
import { mul } from '/@/utils/number';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
export function getBetInfoColumns(type): BasicColumn[] {
  const columns = [
    {
      title: type == 'total' ? t('table.report.report_platform_name') : type,
      dataIndex: type == 'total' ? 'platform_name' : 'game_name',
      minWidth: 220,
    },
    {
      title: t('table.report.report_bet_count'),
      dataIndex: 'bet_count',
      minWidth: 220,
    },
    {
      title: t('table.report.report_bet_amount'),
      dataIndex: 'bet_amount',
      minWidth: 220,
    },
    {
      title: t('table.report.report_valid_bet_amount'),
      dataIndex: 'valid_bet_amount',
      minWidth: 220,
    },
    {
      title: t('table.report.real_valid_bet_amount'),
      dataIndex: 'real_valid_bet_amount',
      helpMessage: `<p><span style="color:#f59a23">${t('business.current_5_1')}</span>${t(
        'table.report.real_valid_bet_amount_p',
      )}</p>`,
      customRender: ({ record }) => {
        const net_amount = record.real_valid_bet_amount;
        return h(
          'span',
          { style: { color: net_amount <= 0 ? '#1cd91c ' : '#e91134' } },
          net_amount,
        );
      },
    },
    {
      title: t('table.report.report_platform_amount'),
      dataIndex: 'net_amount',
      minWidth: 220,
      customRender: ({ record }) => {
        const net_amount = Number(record.net_amount) ? Number(record.net_amount) : '-';
        // return profit_rate;
        return h(
          'span',
          { style: { color: net_amount === '-' ? '#1cd91c ' : '#e91134' } },
          net_amount,
        );
      },
    },
    {
      title: t('table.report.report_bet_count_proportion'),
      dataIndex: 'bet_count_proportion',
      customRender: ({ record }) => {
        const bet_count_proportion = record.bet_count_proportion
          ? `${mul(Number(record.bet_count_proportion), 100)}%`
          : '-';
        return bet_count_proportion;
      },
    },
    {
      title: t('table.report.report_profit_rate'),
      dataIndex: 'profit_rate',
      minWidth: 100,
      customRender: ({ record }) => {
        const profit_rate = record.profit_rate ? `${record.profit_rate}%` : '-';
        // return profit_rate;
        return h(
          'span',
          { style: { color: Number(record.profit_rate) > 0 ? '#e91134' : '#1cd91c ' } },
          profit_rate,
        );
      },
    },
  ];
  useAutoTableLabelWidth(columns);
  return columns;
}
