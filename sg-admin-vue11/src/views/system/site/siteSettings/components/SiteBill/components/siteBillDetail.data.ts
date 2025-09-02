import { FormSchema } from '@/components/Form';
import { useI18n } from '@/hooks/web/useI18n';
import { h } from 'vue';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { currentyOptions } from '/@/settings/commonSetting';

const { t } = useI18n();
export const editData: FormSchema[] = [
  {
    field: 'maintain_start_time',
    component: 'DatePicker',
    required: true,
    label: t('business.common_period_start'),
    slot: 'startTime',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'maintain_end_time',
    component: 'DatePicker',
    required: true,
    label: t('business.common_period_end'),
    slot: 'endTime',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'notice',
    component: 'Input',
    label: t('table.system.system_matain_info'),
    required: true,
    colProps: {
      span: 20,
    },
    slot: 'notice',
    ifShow: (record) => (String(record.values.maintain) === '2' ? true : false),
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('business.common_game_type'), //游戏类型
    dataIndex: 'game_class_name',
    width: 80,
    customRender: ({ record }) => {
      return record.game_class_name;
    },
  },
  {
    title: t('table.report.report_platform_name'), //游戏平台
    dataIndex: 'platform_name',
    width: 80,
    customRender: ({ record }) => {
      return record.platform_name;
    },
  },
  {
    title: t('table.report.report_bet_currency_id'), //投注币种
    dataIndex: 'name',
    width: 100,
    customRender: ({ record }) => {
      return currentyOptions[record.currency_id];
    },
  },
  {
    title: t('table.report.report_bet_currency_id'), //有效投注
    dataIndex: 'valid_bet_amount',
    width: 100,
    customRender: ({ record }) => {
      return record.valid_bet_amount;
    },
  },
  {
    title: t('common.winningorLosing'), //游戏输赢
    dataIndex: 'net_amount',
    width: 100,
    customRender: ({ record }) => {
      let styleColor = '#333333';
      if (record.net_amount > 0) {
        styleColor = '#D9001B';
      }
      if (record.net_amount < 0) {
        styleColor = '#63A103';
      }
      return h('span', { style: { color: styleColor } }, record.net_amount);
    },
  },
  {
    title: t('common.chargeRate'), //收取费率
    dataIndex: 'fee_rate',
    width: 100,
    customRender: ({ record }) => {
      return h('span', { style: {} }, record.fee_rate + '%');
    },
  },
  {
    title: t('common.Fee'), //盈率
    dataIndex: 'games_fee',
    width: 100,
    customRender: ({ record }) => {
      return h('span', { style: {} }, record.games_fee);
    },
  },
  {
    title: t('common.exchangeRate'), //平台费用(U)
    dataIndex: 'exchange_rate',
    width: 100,
    customRender: ({ record }) => {
      return record.exchange_rate;
    },
  },
  {
    title: t('table.system.system_table_header_settlement_cost'), //交收费用(U)
    dataIndex: 'settlement_fee',
    width: 140,
    customRender: ({ record }) => {
      const styleColor = '#D9001B';
      return h('span', { style: { color: styleColor } }, record.settlement_fee);
    },
  },
  {
    title: t('business.common_remark'), //折扣费用(U)
    dataIndex: 'remark',
    width: 100,
    slots: { customRender: 'remarkDiv', style: { textAlign: 'center' } },
    customRender: ({ record }) => {
      return record.remark;
    },
  },
];
