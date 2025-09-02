import { FormSchema, BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import dayjs from 'dayjs';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
const { t } = useI18n();
export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'createIp',
  },
  {
    field: 'summary',
    component: 'Input',
    label: '',
    slot: 'commissionSummary',
    colProps: { style: { marginRight: '10px' } },
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'), //状态
    labelPrefixWidth: 45,
    component: 'Select',
    defaultValue: '',
    componentProps: ({ values }) => {
      return {
        dropdownMatchSelectWidth: false,
        options: [
          {
            key: t('table.member.member_money_all1'),
            value: '',
            label: t('table.member.member_money_all1'),
          },
          {
            label: t('common.code_not_used'),
            value: '1',
            key: t('common.code_not_used'),
          },
          {
            label: t('common.code_used'),
            value: '2',
            key: t('common.code_used'),
          },
        ],
        getPopupContainer: () => document.body,
        onChange: () => {},
      };
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('month').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => values.state !== '1',
  },
  {
    field: 'username',
    component: 'Input',
    label: '',
    slot: 'usernameSlot',
  },
  {
    field: 'state',
    component: 'Input',
    label: '',
    show: false,
    // defaultValue: '1',
  },
];
useAutoLabelWidth(searchForm);
//佣金审核汇总列表
export const columns: BasicColumn[] = [
  {
    title: t('common.redeemCode'), //兑换码
    dataIndex: 'code',
    minWidth: 150,
  },
  {
    title: t('business.common_currency'), //币种
    dataIndex: 'currency_id',
    minWidth: 120,
    slots: { customRender: 'currency_id' },
  },
  {
    title: t('table.report.report_amount'), //金额
    dataIndex: 'amount',
    minWidth: 150,
  },
  {
    title: t('common.get_membership'), //领取会员
    dataIndex: 'username',
    minWidth: 150,
  },
  {
    title: t('business.common_super_agent'), //上级代理
    dataIndex: 'parent_name',
    minWidth: 150,
  },
  {
    title: t('modalForm.discountActivity.membership_level'), //会员层级
    dataIndex: 'level_id',
    minWidth: 150,
  },
  {
    title: t('modalForm.discountActivity.vip_level'), //VIP等级
    dataIndex: 'vip',
    minWidth: 150,
  },
  {
    title: t('table.report.report_deposit_amount'), //总存款
    dataIndex: 'deposit_amount',
    minWidth: 150,
    slots: { customRender: 'deposit_amount' },
  },
  {
    title: t('table.report.report_withdraw_amount'), //总取款
    dataIndex: 'withdraw_amount',
    minWidth: 150,
    slots: { customRender: 'withdraw_amount' },
  },
  {
    title: t('table.report.Effective_coding'), //有效打码
    dataIndex: 'bet',
    minWidth: 150,
    slots: { customRender: 'bet' },
  },
  {
    title: t('table.member.member_recive_time'), //领取时间
    dataIndex: 'draw_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.draw_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.system.system_table_header_status'), //状态
    dataIndex: 'uid',
    minWidth: 150,
    customRender: ({ record }) => {
      let styleColor = '#333333';
      if (record.uid && record.uid !== '0') {
        styleColor = '#333333';
      } else {
        styleColor = '#D9001B';
      }
      if (record.uid && record.uid !== '0') {
        return h('span', { style: { color: styleColor } }, t('common.code_used'));
      } else {
        return h('span', { style: { color: styleColor } }, t('common.code_not_used'));
      }
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('modalForm.common.yesterday'), value: 'yesterday' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
