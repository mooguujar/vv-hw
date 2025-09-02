import { FormSchema, BasicColumn } from '/@/components/Table';
import { getkeyValues } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import { useLinkRecordTypeList, limitTypeOptionsFilter } from '../../../../common/const';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { isControlValueSet } from '/@/utils/domUtils';

const { linkRecordTypeList } = useLinkRecordTypeList();

const { t } = useI18n();

export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'profitListMonitor',
    // colProps: { style: { width: '100px' } },
    colProps: { style: { marginRight: '20px' } },
  },
  {
    field: 'start_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_start'),
    labelPrefixWidth: '70',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    slot: 'startDate',
  },
  {
    field: 'end_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_end'),
    labelPrefixWidth: '70',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    slot: 'endDate',
  },
  {
    field: 'status',
    component: 'Select',
    labelPrefix: t('table.risk.report_link_type'),
    labelPrefixWidth: '70',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    componentProps: {
      options: [],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    component: 'Input',
    slot: 'usernameSlot',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.report.report_reg_time'), //注册时间
    dataIndex: 'reg_time',
    minWidth: 190,
    customRender: ({ record }) => {
      return toTimezone(record.reg_time);
    },
  },
  {
    title: t('business.common_member_account'), //会员账号
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_realiy_name'), //会员姓名
    dataIndex: 'realname',
    minWidth: 120,
    customRender: ({ record }: any) => {
      return record.realname['first'] ? record.realname[record.realname['first']] : '-';
    },
  },
  {
    title: t('business.common_super_agent'), //上级代理
    dataIndex: 'parent_name',
    minWidth: 120,
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'limit_type',
    minWidth: 120,
    customRender: ({ record }) => {
      const limit_type = limitTypeOptionsFilter.find((item) => {
        return item.value == record.limit_type;
      });
      let style = '';
      if (limit_type?.value == 0) style = 'color:#0960bd';
      else if (limit_type?.value == 1) style = 'color:#d44';
      else if (limit_type?.value == 2) style = 'color:#f59a23';
      else if (limit_type?.value == 3) style = 'color:gray';
      return h('div', { style }, limit_type?.label || '-');
    },
  },
  {
    title: t('modalForm.finance.common_income.balance'), //账户余额
    dataIndex: 'balance_amount',
    minWidth: 120,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return record.balance_amount ? record.balance_amount : '-';
    },
  },
  {
    title: t('table.member.member_commission_state'), //佣金余额
    dataIndex: 'commission_amount',
    minWidth: 120,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return record.commission_amount ? record.commission_amount : '-';
    },
  },
  {
    title: t('business.common_member_level'), //会员层级
    dataIndex: 'level_id',
    minWidth: 120,
    customRender: ({ record }) => {
      return getkeyValues(record.level_id);
    },
  },
  {
    title: t('business.commin_vip_level'), //VIP等级
    dataIndex: 'vip',
    minWidth: 120,
    customRender: ({ record }: any) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.finance.finance_total_deposit'), //存款总额
    dataIndex: 'total_deposit',
    minWidth: 160,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }: any) => {
      return record.deposit_amount ? record.deposit_amount : '-';
    },
  },
  {
    title: t('table.member.member_withdraw_money'), //取款总额
    dataIndex: 'total_withdraw',
    minWidth: 120,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }: any) => {
      return record.withdraw_amount ? record.withdraw_amount : '-';
    },
  },
  {
    title: t('table.report.report_cash_profit'), //现金利润
    dataIndex: 'cash_profit',
    minWidth: 120,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }: any) => {
      return record.cash_profit ? record.cash_profit : '-';
    },
  },
  {
    title: t('table.report.report_gift_amount'), //优惠金额
    dataIndex: 'discount_amount',
    minWidth: 120,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }: any) => {
      return record.gift_amount ? record.gift_amount : '-';
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'), //有效投注
    dataIndex: 'valid_bet',
    minWidth: 120,
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }: any) => {
      return record.valid_bet_amount ? record.valid_bet_amount : '-';
    },
  },
  {
    title: t('table.risk.report_link_time'), //关联时间
    dataIndex: 'created_at',
    minWidth: 225,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.risk.report_link_type'), //关联类型
    dataIndex: 'category',
    minWidth: 145,
    customRender: ({ record }: any) => {
      if (!record.category) return '-';
      return linkRecordTypeList.find((item) => item.value == record.category)?.label || '-';
    },
  },

  {
    title: t('table.risk.report_link_info'), //关联信息
    dataIndex: 'content',
    minWidth: 180,
    customRender: ({ record }: any) => {
      return record.content ? record.content : '-';
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    slots: { customRender: 'action' },
    minWidth: 130,
    ifShow: !isControlValueSet(),
  },
];
