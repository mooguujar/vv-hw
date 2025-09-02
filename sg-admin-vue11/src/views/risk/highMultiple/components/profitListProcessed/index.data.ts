import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { limitTypeOptionsFilter, limit_discount_type } from '../../../common/const.ts';
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
      return record.valid_bet_amount;
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
    title: t('table.risk.report_process_result'), //处理结果  //frenk说只用解析1和2两种状态
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
    title: t('business.common_operate'), //操作
    dataIndex: '',
    ifShow: !isControlValueSet(),
    slots: { customRender: 'commission' },
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'updated_name',
  },
  {
    title: t('table.risk.report_trigger_time') + '/' + t('table.risk.report_process_time'), //触发时间/处理时间
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.created_at ? toTimezone(record.created_at) : '-',
        line2: record.updated_at ? toTimezone(record.updated_at) : '-',
      });
    },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'remarks',
    minWidth: 160,
    customRender: ({ record }) => {
      return record.remarks || '-';
    },
  },
];
useAutoTableLabelWidth(columns);
