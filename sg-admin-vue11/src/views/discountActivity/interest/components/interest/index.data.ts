import { BasicColumn } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import { Tooltip, Tag } from 'ant-design-vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import { useI18n } from '/@/hooks/web/useI18n';
import { convertSecondsToTimeFormat, state, giveTime } from '../../../common/const';
import { auths } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el) => {
  currencyMap[el.id] = el.name;
});
//判断是否是2位小数
function hasTwoDecimals(num) {
  const str = num.toString().replace(/^0+/, '');
  return /^\d+\.\d{2}$/.test(str);
}

// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('table.discountActivity.discount_save_currency'), //存入币种
    dataIndex: 'currency_names',
    minWidth: 150,
    slots: { customRender: 'currency' },
  },
  {
    title: t('table.discountActivity.discount_save_participant'), //参与对象
    dataIndex: 'join_object_type',
    minWidth: 80,
    slots: { customRender: 'joinObjectType', style: { textAlign: 'center' } },
  },
  {
    title: t('table.discountActivity.discount_settlement_cycle'), //结算周期
    dataIndex: 'bill_time',
    minWidth: 160,
    customRender: ({ record }) => {
      return convertSecondsToTimeFormat(record.bill_time);
    },
  },
  {
    title: t('table.discountActivity.discount_minimum_deposit'), //最低存入金额
    dataIndex: 'min_deposit',
    minWidth: 120,
    slots: { customRender: 'minDeposit', style: { textAlign: 'center' } },
  },
  {
    title: t('table.discountActivity.discount_year_rate') + '(%)', //年利率(%)
    dataIndex: 'interest_rate',
    minWidth: 100,
    slots: { customRender: 'interestRate', style: { textAlign: 'center' } },
  },
  {
    title: t('table.discountActivity.interest_audit_multiple'), //利息稽核倍数
    minWidth: 120,
    dataIndex: 'bet_multiples',
    customRender: ({ record }) => {
      if (hasTwoDecimals(record.bet_multiples)) {
        return Number(record.bet_multiples).toFixed(1);
      }
      return record.bet_multiples;
    },
  },
  {
    title: t('table.system.system_delivery_time'), //发放时间
    dataIndex: 'give_time',
    minWidth: 180,
    customRender: ({ record }) => {
      const giveTimeFindItem = giveTime.find((item) => item.value == record.give_time);
      return giveTimeFindItem ? giveTimeFindItem?.label : '';
    },
  },
  {
    title: t('table.discountActivity.interest_cap'), //利息封顶
    minWidth: 80,
    dataIndex: 'interest_limit',
    customRender: ({ record }) => {
      if (record.interest_limit) {
        return t('table.discountActivity.number_of_cycles', [record.interest_limit]);
      } else {
        return t('table.discountActivity.discount_no_limit');
      }
    },
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'state',
    customRender: ({ record }) => {
      const color = record.state == 1 ? '#1CD91C' : '#E91134';
      const stateFindItem = state.find((item) => item.value == record.state);
      return h(Tag, { color }, () => (stateFindItem ? stateFindItem?.label : ''));
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'third_deposit_time',
    slots: { customRender: 'action', style: { textAlign: 'center' } },
    ifShow: auths(['40303', '40302', '40307']),
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'operate_name',
    minWidth: 80,
  },
  {
    title: t('table.risk.report_operating_time'), //操作时间
    dataIndex: 'operate_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.operate_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
useAutoTableLabelWidth(columns);
