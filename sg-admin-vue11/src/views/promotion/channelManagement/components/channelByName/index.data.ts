import { BasicColumn, FormSchema } from '@/components/Table';
import dayjs from 'dayjs';
import { toTimezone } from '@/utils/dateUtil';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
import { useTreeListStore } from '/@/store/modules/treeList';
import { deviceMap } from '/@/views/common/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { currentyOptions } from '/@/settings/commonSetting';
const { currencyTreeList } = useTreeListStore();
const currencyMap = {};
currencyTreeList.forEach((el) => {
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

export const columns: BasicColumn[] = [
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
  },
  {
    title: t('table.promotion.promotion_static_date'),
    dataIndex: 'time',
    minWidth: 120,
    customRender: ({ record }) => {
      return toTimezone(record.time, 'YYYY-MM-DD');
    },
  },
  {
    title: t('table.promotion.promotion_tunnel_ID'),
    dataIndex: 'channel_id',
    minWidth: 80,
  },
  {
    title: t('table.promotion.promotion_tunnel_name'),
    dataIndex: 'channel_name',
    minWidth: 100,
  },
  {
    title: t('table.promotion.promotion_agency_account'),
    dataIndex: 'username',
    minWidth: 100,
  },
  // {
  //   title: '新增会员',
  //   dataIndex: 'reg_count',
  //   width: 100,
  //   slots: { customRender: 'reg_count', style: { textAlign: 'center' } },
  // },
  // {
  //   title: '首存会员',
  //   dataIndex: 'first_deposit_count',
  //   width: 100,
  //   slots: { customRender: 'first_deposit_count', style: { textAlign: 'center' } },
  // },
  // {
  //   title: '当日注册且首存',
  //   dataIndex: 'first_deposit_count_by_reg',
  //   width: 100,
  // },
  // {
  //   title: '存款金额',
  //   dataIndex: 'deposit_amount',
  //   width: 100,
  // },
  // {
  //   title: '提款金额',
  //   dataIndex: 'withdraw_amount',
  //   width: 100,
  // },
  {
    title: t('table.promotion.promotion_new_member'),
    dataIndex: 'reg_count',
    minWidth: 100,
    slots: { customRender: 'reg_count', style: { textAlign: 'center' } },
  },
  {
    title: t('table.promotion.promotion_fist_deposition_member'),
    dataIndex: 'first_deposit_count',
    minWidth: 140,
    slots: { customRender: 'first_deposit_count', style: { textAlign: 'center' } },
  },
  {
    title: t('table.promotion.promotion_onDate_first_deposition'),
    dataIndex: 'first_deposit_count_by_reg',
    minWidth: 160,
    slots: { customRender: 'first_deposit_count_by_reg', style: { textAlign: 'center' } },
  },
  {
    title: t('table.promotion.promotion_deposition_amount'),
    dataIndex: 'deposit_amount',
    minWidth: 140,
    customRender: ({ record }) => {
      return `${record.deposit_amount}/${record.deposit_count}${t('component.unit.people')}`;
    },
  },
  {
    title: t('table.promotion.promotion_take_amount'),
    dataIndex: 'withdraw_amount',
    minWidth: 140,
    customRender: ({ record }) => {
      return `${record.withdraw_amount}/${record.withdraw_count}${t('component.unit.people')}`;
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 100,
  },
  {
    title: t('table.promotion.promotion_register_equipment'),
    dataIndex: 'reg_device',
    minWidth: 120,
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
    minWidth: 100,
  },
  {
    title: t('table.promotion.reg_deposit_rate'),
    dataIndex: 'reg_deposit_rate',
    minWidth: 120,
    customRender: ({ record }) => {
      return h('span', { style: { color: '#E91134' } }, `${record.reg_deposit_rate}%`);
    },
  },
  {
    title: t('table.promotion.withdraw_rate'), //渠道访问量
    dataIndex: 'withdraw_rate',
    minWidth: 100,
    customRender: ({ record }) => {
      return h('span', { style: { color: '#E91134' } }, `${record.withdraw_rate}%`);
    },
  },
  {
    title: t('table.report.report_retain_data'), //操作
    dataIndex: 'actionnew',
    minWidth: 120,
    slots: { customRender: 'actionnew', style: { textAlign: 'center' } },
  },
  // {
  //   title: '下载量',
  //   dataIndex: 'download_count',
  //   width: 120,
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

export const schemas: FormSchema[] = [
  {
    field: 'created',
    label: '',
    component: 'Input',
    slot: 'created',
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];
