import { BasicColumn, FormSchema } from '@/components/Table';
import { toTimezone } from '@/utils/dateUtil';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
import { useTreeListStore } from '/@/store/modules/treeList';
import { deviceMap } from '/@/views/common/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { currentyOptions } from '/@/settings/commonSetting';
const { getAllCurrencyTreeList } = useTreeListStore();
const currencyMap = {};

getAllCurrencyTreeList.forEach((el) => {
  currencyMap[el.id] = el.name;
});

const { t } = useI18n();
const setTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
        },
        text,
      ),
  );
};
export const schemas: FormSchema[] = [
  {
    field: 'dateGroup',
    label: '',
    component: 'Input',
    slot: 'dateGroup',
  },
  {
    field: 'start_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_start'), //开始时间
    labelPrefixWidth: 75,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    slot: 'startDate',
    componentProps: {
      placeholder: t('business.common_start_time'),
      // getPopupContainer: () => document.body,
    },
  },
  {
    field: 'end_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_end'), //结束时间
    labelPrefixWidth: 75,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    slot: 'endDate',
    componentProps: {
      placeholder: t('business.common_end_time'),
      // getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.promotion.promotion_currency'), //币种
    dataIndex: 'currency_id',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
  },

  {
    title: t('table.promotion.promotion_static_date'), //统计日期
    dataIndex: 'time',
    minWidth: 120,
    customRender: ({ record }) => {
      return toTimezone(record.time, 'YYYY-MM-DD');
    },
  },
  {
    title: t('table.promotion.promotion_tunnel_name'), //渠道名称
    dataIndex: 'channel_name',
    minWidth: 120,
    slots: { customRender: 'action_name', style: { textAlign: 'center' } },
  },
  {
    title: t('table.promotion.promotion_new_member'), //新增会员
    dataIndex: 'reg_count',
    minWidth: 120,
    slots: { customRender: 'reg_count', style: { textAlign: 'center' } },
  },
  {
    title: t('table.promotion.promotion_fist_deposition_member'), //首存会员
    dataIndex: 'first_deposit_count',
    minWidth: 180,
    slots: { customRender: 'first_deposit_count', style: { textAlign: 'center' } },
  },
  {
    title: t('table.promotion.promotion_onDate_first_deposition'), //当日注册且首存
    dataIndex: 'first_deposit_count_by_reg',
    minWidth: 178,
    slots: { customRender: 'first_deposit_count_by_reg', style: { textAlign: 'center' } },
  },
  {
    title: t('table.promotion.promotion_deposition_amount'), //存款金额
    dataIndex: 'deposit_amount',
    minWidth: 135,
    customRender: ({ record }) => {
      return `${record.deposit_amount}/${record.deposit_count}${t('component.unit.people')}`;
    },
  },
  {
    title: t('table.promotion.promotion_take_amount'), //提款金额
    dataIndex: 'withdraw_amount',
    minWidth: 160,
    customRender: ({ record }) => {
      return `${record.withdraw_amount}/${record.withdraw_count}${t('component.unit.people')}`;
    },
  },
  {
    title: t('table.promotion.promotion_affect_bet'), //有效投注
    dataIndex: 'valid_bet_amount',
    minWidth: 100,
    // customRender: ({ record }) => {
    //   return setTooltip(record.valid_bet_amount);
    // },
  },
  {
    title: t('table.promotion.promotion_register_equipment'), //注册设备
    dataIndex: 'reg_device',
    minWidth: 160,
    customRender: ({ record }) => {
      const data = Object.entries(JSON.parse(record.reg_device))
        .map(([platformId, count]) => `${deviceMap[platformId]}: ${count}`)
        .join('\n');
      return h(
        'div',
        {
          style: { 'white-space': 'pre-line', overflow: 'hidden' },
        },
        data || '--',
      );
    },
  },
  {
    title: t('table.promotion.promotion_tunnel_visitor_amount'), //渠道访问量
    dataIndex: 'uv',
    minWidth: 130,
  },
  {
    title: t('table.promotion.reg_deposit_rate'), //渠道访问量
    dataIndex: 'reg_deposit_rate',
    minWidth: 160,
    customRender: ({ record }) => {
      return h('span', { style: { color: '#E91134' } }, `${record.reg_deposit_rate}%`);
    },
  },
  {
    title: t('table.promotion.withdraw_rate'), //渠道访问量
    dataIndex: 'withdraw_rate',
    minWidth: 140,
    customRender: ({ record }) => {
      return h('span', { style: { color: '#E91134' } }, `${record.withdraw_rate}%`);
    },
  },
  {
    title: t('table.report.report_retain_data'), //操作
    dataIndex: 'action',
    minWidth: 120,
    slots: { customRender: 'action', style: { textAlign: 'center' } },
  },
  // {
  //   title: '下载量',
  //   dataIndex: 'download_count',
  //   width: 100,
  //   customRender: ({ record }) => {
  //     const data = Object.entries(JSON.parse(record.download_count))
  //       .map(([platformId, count]) => `${deviceMap[platformId]}: ${count}`)
  //       .join(', ');
  //     return data;
  //   },
  // },
  // {
  //   title: '启动量',
  //   dataIndex: 'start_count',
  //   width: 100,
  // },
  // {
  //   title: '下载率',
  //   dataIndex: 'remark',
  //   width: 100,
  //   customRender: ({ record }) => {
  //     return record.remark ? record.remark : '-';
  //   },
  // },
];
export const dateGroupButtonList = [
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
