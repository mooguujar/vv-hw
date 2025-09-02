import { FormSchema, BasicColumn } from '/@/components/Table';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { isHasAuth } from '/@/utils/authFunction';
import { isControlValueSet } from '/@/utils/domUtils';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
const { t } = useI18n();
export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'profitListMonitor',
    colProps: { style: { marginRight: '10px' } },
    ifShow: isControlValueSet() ? false : isHasAuth('60507'),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    component: 'Input',
    slot: 'usernameSlot',
  },
  {
    field: 'category',
    component: 'InputNumber',
    defaultValue: 1,
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('business.common_currency'), //币种
    dataIndex: 'currency_id',
    slots: { customRender: 'currency' },
  },
  {
    title: t('business.common_member_account'), //会员账号
    dataIndex: 'username',
    slots: { customRender: 'username', style: { textAlign: 'center' } },
  },
  {
    title: t('business.common_super_agent'), //上级代理
    dataIndex: 'parent_name',
  },
  {
    title: t('table.risk.report_today_deposit'), //当日存款
    dataIndex: 'day_deposit_amount',
    customRender: ({ record }) => {
      return record.day_deposit_amount;
    },
  },
  {
    title: t('table.risk.report_today_withdrawal'), //当日取款
    dataIndex: 'day_withdraw_amount',
    customRender: ({ record }) => {
      return record.day_withdraw_amount;
    },
  },
  {
    title: t('table.report.report_cash_profit'), //现金利润
    dataIndex: 'cash_profit',
    customRender: ({ record }) => {
      return record.cash_profit;
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'), //有效投注
    dataIndex: 'valid_bet_amount',
    customCell: () => ({
      class: 'text-red',
    }),
    customRender: ({ record }) => {
      return record.valid_bet_amount;
    },
  },
  {
    title: t('table.report.report_platform_amount'), //会员输赢
    dataIndex: 'win_lose_amount',
    customRender: ({ record }) => {
      return record.win_lose_amount;
    },
  },
  {
    title: t('modalForm.member.member_multiple'), //打码倍数
    dataIndex: 'bet_multiple',
    customCell: () => ({
      class: 'text-red',
    }),
  },
  {
    title: t('table.risk.report_history_all'), //历史汇总
    dataIndex: '',
    slots: { customRender: 'history', style: { textAlign: 'center' } },
  },

  {
    title: t('table.risk.report_trigger_time'), //触发时间
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];
useAutoTableLabelWidth(columns);
