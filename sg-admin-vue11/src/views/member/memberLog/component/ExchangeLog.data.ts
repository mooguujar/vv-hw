import { BasicColumn, FormSchema } from '/@/components/Table';
import eventBus from '/@/utils/eventBus';
import { useI18n } from '/@/hooks/web/useI18n';
import { useCurrencyStore } from '/@/store/modules/currency';
import { toTimezone } from '/@/utils/dateUtil';
import dayjs from 'dayjs';

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();

export const schemas: FormSchema[] = [
  {
    field: 'typeid',
    component: 'Input',
    slot: 'typeid',
  },
  {
    field: 'currency_id',
    labelPrefix: t('table.member.member_exchange_currency'), //货币
    component: 'IconSelect',
    defaultValue: '',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    componentProps: () => {
      const list = [{ label: t('business.common_all'), value: '' }, ...getCurrencyList];
      return {
        placeholder: t('business.common_all'),
        options: list,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: ({ formActionType, formModel }) => {
      return {
        allowClear: false,
        format: 'YYYY-MM-DD',
        getPopupContainer: () => document.body,
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        onChange: async (e) => {
          eventBus.emit('mittChange', [formModel.time[0], formModel.time[1]]);
        },
      };
    },
  },
  {
    field: 'username',
    labelPrefix: t('table.system.system_member_account'), //会员账号
    labelPrefixWidth: 75,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    component: 'Input',
  },
];
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('table.finance.finance_Change_type'), //变更类型
    dataIndex: 'address',
    width: '20%',
    minWidth: 200,
    customRender: () => {
      return t('common.CurrencyExchange');
    },
  },
  {
    title: t('table.finance.finance_Change_currency'), //变更币种
    dataIndex: '',
    slots: { customRender: 'currency' },
    minWidth: 160,
  },
  {
    title: t('table.member.member_rate_vip'), //汇率
    dataIndex: 'rate',
    minWidth: 110,
    width: '20%',
    customRender: ({ record }) => {
      return '1:' + record.rate;
    },
  },
  {
    title: t('table.member.member_change_before'), //变更前金额
    dataIndex: '',
    slots: { customRender: 'changeBeforeAmount' },
    width: '20%',
    minWidth: 200,
  },
  {
    title: t('table.finance.finance_Change_amount'), //变更金额
    dataIndex: '',
    slots: { customRender: 'changeAmount' },
    width: '20%',
    minWidth: 200,
  },
  {
    title: t('table.member.member_change_after'), //变更后金额
    dataIndex: '',
    slots: { customRender: 'changeAfterAmount' },
    width: '20%',
    minWidth: 200,
  },
  {
    title: t('table.member.member_change_time'), //变更时间
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
    width: '20%',
    minWidth: 200,
  },
];
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
