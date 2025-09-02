import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { limitTypeOptionsFilter, limit_discount_type } from '../../../common/const.ts';
import { mul } from '/@/utils/number';
import { useI18n } from '/@/hooks/web/useI18n';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import { isHasAuth } from '/@/utils/authFunction.js';
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
    ifShow: isControlValueSet() ? false : isHasAuth('60501'),
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
    defaultValue: 2,
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
  },
  {
    title: t('business.common_super_agent'), //上级代理
    dataIndex: 'parent_name',
  },

  {
    title: t('table.risk.report_today_deposit'), //当日存款
    dataIndex: 'deposit_amount',
    customRender: ({ record }) => {
      return record.deposit_amount;
    },
  },
  {
    title: t('table.risk.report_today_withdrawal'), //当日取款
    dataIndex: 'withdraw_amount',
    customRender: ({ record }) => {
      return record.withdraw_amount;
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
      style: 'color:#E91134',
    }),
    customRender: ({ record }) => {
      return record.valid_bet_amount;
    },
  },
  {
    title: t('table.report.report_net_amount'), //会员输赢
    dataIndex: 'net_amount',
    customRender: ({ record }) => {
      return record.net_amount;
    },
  },

  {
    title: t('modalForm.risk.risk_profit_percent'), //获利占比
    dataIndex: 'bet_profit_rate',
    customRender: ({ record }) => {
      const fontColor = record.bet_profit_rate >= 0 ? '#E91134' : '#1CD91C';
      return h(
        'span',
        { style: `color:${fontColor}` },
        `${mul(Number(record.bet_profit_rate), 100)}%`,
      );
    },
  },
  {
    title: t('modalForm.member.member_multiple'), //打码倍数
    dataIndex: 'bet_multiplier',
    customRender: ({ record }) => {
      return record.bet_multiplier;
    },
  },
  {
    title: t('table.report.report_gift_amount'), //优惠金额
    dataIndex: 'gift_amount',
    customRender: ({ record }) => {
      return record.gift_amount;
    },
  },
  {
    title: t('table.risk.report_process_result'), //处理结果
    dataIndex: 'limit_type',
    customRender: ({ record }) => {
      const limit_type = limitTypeOptionsFilter.find((item) => {
        return item.value == record.limit_type;
      });
      if (limit_type?.value == 2) {
        let limit_string = '';
        if (record.discount_state && record.discount_state.length) {
          record.discount_state.map((currentValue, index, arr) => {
            if (currentValue) limit_string += limit_discount_type[index].label + ',';
          });
          limit_string = limit_string.slice(0, limit_string.length - 1);
        }
      }
      return h(
        'span',
        { style: limit_type?.value == 1 ? 'color:#E91134' : 'color:#F59A23' },
        limit_type?.label || '-',
      );
    },
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'operator_name',
  },

  {
    title: t('table.risk.report_trigger_time') + '/' + t('table.risk.report_process_time'), //触发时间/处理时间
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.time ? toTimezone(record.time) : '-',
        line2: record.process_time ? toTimezone(record.process_time) : '-',
      });
    },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'remarks',
    minWidth: 160,
    customRender: ({ record }) => {
      return record.remarks ? record.remarks : '-';
    },
  },
];
useAutoTableLabelWidth(columns);
