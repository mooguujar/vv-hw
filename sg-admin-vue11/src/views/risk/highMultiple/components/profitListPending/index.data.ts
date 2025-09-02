import { FormSchema, BasicColumn } from '/@/components/Table';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { isHasAuth } from '/@/utils/authFunction';
import { isControlValueSet } from '/@/utils/domUtils';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();

//佣金审核汇总查询条件
export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'profitListMonitor',
    colProps: { style: { marginRight: '10px' } },
    ifShow: isControlValueSet() ? false : isHasAuth('60508'),
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
    title: t('table.risk.risk_risk_type'), //风控类型
    dataIndex: 'risk_type',
    customRender: ({ record }) => {
      if (record.risk_type == 1) return t('table.risk.report_big_bonus'); //大额中奖
      else if (record.risk_type == 2) return t('table.risk.report_hight_multip'); //高倍爆奖
      else return '-';
    },
  },
  {
    title: t('table.report.report_bill_no'), //注单编号
    dataIndex: 'order_no',
    minWidth: 240,
    customRender: ({ record }) => {
      return record.order_no;
    },
  },
  {
    title: t('table.report.report_game_code'), //游戏局号
    dataIndex: 'game_no',
    customRender: ({ record }) => {
      return record.game_no;
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'), //有效投注
    dataIndex: 'valid_bet_amount',
    customRender: ({ record }) => {
      if (record?.valid_bet_amount?.length > 8) {
        return record?.valid_bet_amount;
      } else {
        return record?.valid_bet_amount;
      }
    },
  },
  {
    title: t('table.risk.report_bonus_multip'), //爆奖倍数
    dataIndex: 'prize_multiplier',
    customCell: () => ({
      style: 'color:#E91134',
    }),
    customRender: ({ record }) => {
      if (record.risk_type == 1) return '-';
      else if (record.risk_type == 2) return record.prize_multiplier;
      else return '-';
    },
  },
  {
    title: t('table.risk.report_bonus_amount'), //爆奖金额
    dataIndex: 'prize_amount',
    customCell: () => ({
      style: 'color:#E91134',
    }),
    customRender: ({ record }) => {
      if (record.risk_type == 1) return record.prize_amount;
      else if (record.risk_type == 2) return '-';
      else return '-';
    },
  },
  {
    title: t('table.risk.report_trigger_time'), //触发时间
    dataIndex: 'created_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];

useAutoTableLabelWidth(columns);
