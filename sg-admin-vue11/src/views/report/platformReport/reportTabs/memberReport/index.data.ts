import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { mul } from '/@/utils/number';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: '',
    labelPrefix: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'custom',
    colProps: { xxl: 5, xl: 5, lg: 6, md: 6, sm: 8 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    slots: { customRender: 'currency' },
  },
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    minWidth: 100,
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level_name',
    minWidth: 100,
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    minWidth: 100,
    customRender: ({ record }: any) => {
      return record.vip ? `VIP${record.vip}` : '-';
    },
  },
  {
    title: t('table.report.report_bet_count'),
    dataIndex: 'bet_count',
    minWidth: 100,
    sorter: true,
    showSorterTooltip: false,
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
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    minWidth: 100,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 100,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    minWidth: 100,
    customRender: ({ record }) => {
      const net_amount = record.net_amount;
      const color = Number(net_amount) > 0 ? '#E91134' : '#1CD91C';
      return h('span', { style: { color } }, record.net_amount);
    },
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_profit_rate'),
    dataIndex: 'profit_rate',
    width: 100,
    customRender: ({ record }) => {
      const profit_rate = record.profit_rate ? `${record.profit_rate}%` : '-';
      return h(
        'span',
        {
          style: { color: Number(record.profit_rate) > 0 ? '#E91134' : '#1CD91C' },
        },
        profit_rate,
      );
    },
    sorter: true,
    showSorterTooltip: false,
  },
];
useAutoTableLabelWidth(columns);
