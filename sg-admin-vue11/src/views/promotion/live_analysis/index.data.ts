import { BasicColumn, FormSchema } from '@/components/Table';
import { h, ref } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { currentyOptions } from '/@/settings/commonSetting';

const { t } = useI18n();
// 添加dau_type的响应式引用
const currentDauType = ref('1');
const currentRetentionType = ref('1');
const boo = currentDauType.value === '1' || currentRetentionType.value === '2';
// 动态控制列显示的函数
const getColumnIfShow = (type: string) => {
  return () => currentDauType.value === type;
};

export { currentDauType, currentRetentionType, getColumnIfShow };

export const schemas: FormSchema[] = [
  {
    field: 'dau_type',
    labelPrefix: t('common.days_lives_type'),
    component: 'Select',
    // slot: 'dauType',
    colProps: { xxl: 4, xl: 3, lg: 3, md: 3, sm: 4 },
    defaultValue: '1',
    componentProps: {
      options: [
        { label: t('table.report.report_first_deposit'), value: '1' },
        { label: t('modalForm.risk.risk_register'), value: '2' },
      ],
      getPopupContainer: () => document.body,
      onChange: (value: string) => {
        currentDauType.value = value;
      },
    },
  },
  {
    field: 'retention_type',
    labelPrefix: t('common.retention_type'),
    component: 'Select',
    colProps: { xxl: 4, xl: 3, lg: 3, md: 3, sm: 4 },
    defaultValue: '1',
    componentProps: {
      options: [
        { label: t('table.report.report_bet'), value: '1' },
        { label: t('common.active_text32'), value: '2' },
      ],
      getPopupContainer: () => document.body,
      onChange: (value: string) => {
        currentRetentionType.value = value;
      },
    },
    ifShow: getColumnIfShow('2'),
  },
  {
    field: 'group_id',
    labelPrefix: t('common.promoter'),
    component: 'Select',
    defaultValue: [],
    slot: 'group_id',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 5 },
  },
  {
    field: 'channel_id',
    labelPrefix: t('table.race_price.form_channel_name'),
    component: 'Select',
    defaultValue: [],
    slot: 'channel_id',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 5 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.promotion.promotion_currency'), //币种
    dataIndex: 'currency_id',
    width: '140px',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },

  {
    title: t('business.common_count_date'), //日期
    dataIndex: 'date',
  },
  {
    title: t('table.race_price.table_first_deposit_person'), //提款金额 日活类型-首存显示
    dataIndex: 'first_deposit_num_total',
    width: '140px',
    ifShow: getColumnIfShow('1'),
  },
  {
    title: t('common.first_count'), //提款金额 日活类型-首存显示
    dataIndex: 'initial_deposit_amount',
    width: '140px',
    ifShow: getColumnIfShow('1'),
  },
  {
    title: t('table.race_price.table_register_person'), //注册人数:日活类型-注册显示
    dataIndex: 'register_num_total',
    width: '140px',
    ifShow: getColumnIfShow('2'),
  },
  {
    title: t('table.promotion.promotion_number_of_people_recharging'), //充值人数：日活类型-注册显示
    dataIndex: 'deposit_num_total',
    width: '140px',
    ifShow: getColumnIfShow('2'),
  },
  {
    title: t('common.active_text52'), //充值金额
    dataIndex: 'first_deposit_amount_total',
    width: '140px',
    helpMessage: `<p><span style='color:#FFCB00;'>${t('common.active_text52')}：</span>${t(
      'common.first_deposit_info',
    )}</p>`,
    ifShow: getColumnIfShow('1'),
  },
  {
    title: t('common.active_text52'), //充值金额
    dataIndex: 'deposit_amount_total',
    width: '140px',
    helpMessage: `<p><span style='color:#FFCB00;'>${t('common.active_text52')}：</span>${t(
      'common.first_deposit_info',
    )}</p>`,
    ifShow: getColumnIfShow('2'),
  },
  {
    title: t('common.withdraw_num_total'), //提款人数
    dataIndex: 'withdraw_num_total',
    width: '140px',
  },
  {
    title: t('table.promotion.promotion_take_amount'), //提款金额
    dataIndex: 'withdraw_amount_total',
    width: '140px',
    helpMessage: `<p><span style='color:#FFCB00;'>${t(
      'table.promotion.promotion_take_amount',
    )}：</span>${t('common.withdrawals_info')}</p>`,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_member_count'), //投注人数:日活类型-注册显示
    dataIndex: 'bet_num_total',
    width: '140px',
    ifShow: getColumnIfShow('2'),
  },
  {
    title: t('common.redeposit_num_total'), //当日复充 日活类型-首存显示
    dataIndex: 'redeposit_num_total',
    width: '140px',
    ifShow: getColumnIfShow('1'),
  },
  {
    title: t('table.report.report_day2_retain'), //2日留存
    dataIndex: 'th2_deposit_num',
    width: '140px',
    customRender: ({ record }) => {
      const color =
        Number(record.th2_deposit_rate) > 0 || Number(record.th2_bet_rate) > 0 ? '#E91134' : '';
      return h('div', { class: 'flex justify-center items-center' }, [
        h(
          'div',
          { class: '' }, // 添加样式和 key
          boo ? `${record.th2_deposit_num}` : `${record.th2_bet_num}`,
        ),
        h(
          'div',
          { style: { color: color }, class: 'ml-4px' }, // 添加样式和 key
          boo
            ? `(${Number(record.th2_deposit_rate).toFixed(2)}%)`
            : `(${Number(record.th2_bet_rate).toFixed(2)}%)`,
        ),
      ]);
    },
  },
  {
    title: t('table.report.report_day3_retain'), //3日留存
    dataIndex: 'th3_deposit_num',
    width: '140px',
    customRender: ({ record }) => {
      const color =
        Number(record.th3_deposit_rate) > 0 || Number(record.th3_bet_rate) > 0 ? '#E91134' : '';
      return h('div', { class: 'flex justify-center items-center' }, [
        h(
          'div',
          { class: '' }, // 添加样式和 key
          boo ? `${record.th3_deposit_num}` : `${record.th3_bet_num}`,
        ),
        h(
          'div',
          { style: { color: color }, class: 'ml-4px' }, // 添加样式和 key
          boo
            ? `(${Number(record.th3_deposit_rate).toFixed(2)}%)`
            : `(${Number(record.th3_bet_rate).toFixed(2)}%)`,
        ),
      ]);
    },
  },
  {
    title: t('table.report.report_day5_retain'), //5日留存
    dataIndex: 'th5_deposit_num',
    width: '140px',
    customRender: ({ record }) => {
      const color =
        Number(record.th5_deposit_rate) > 0 || Number(record.th5_bet_rate) > 0 ? '#E91134' : '';
      return h('div', { class: 'flex justify-center items-center' }, [
        h(
          'div',
          { class: '' }, // 添加样式和 key
          boo ? `${record.th5_deposit_num}` : `${record.th5_bet_num}`,
        ),
        h(
          'div',
          { style: { color: color }, class: 'ml-4px' }, // 添加样式和 key
          boo
            ? `(${Number(record.th5_deposit_rate).toFixed(2)}%)`
            : `(${Number(record.th5_bet_rate).toFixed(2)}%)`,
        ),
      ]);
    },
  },
  {
    title: t('table.report.report_day7_retain'), //7日留存
    dataIndex: 'th7_deposit_num',
    width: '140px',
    customRender: ({ record }) => {
      const color =
        Number(record.th7_deposit_rate) > 0 || Number(record.th7_bet_rate) > 0 ? '#E91134' : '';
      return h('div', { class: 'flex justify-center items-center' }, [
        h(
          'div',
          { class: '' }, // 添加样式和 key
          boo ? `${record.th7_deposit_num}` : `${record.th7_bet_num}`,
        ),
        h(
          'div',
          { style: { color: color }, class: 'ml-4px' }, // 添加样式和 key
          boo
            ? `(${Number(record.th7_deposit_rate).toFixed(2)}%)`
            : `(${Number(record.th7_bet_rate).toFixed(2)}%)`,
        ),
      ]);
    },
  },
  {
    title: t('table.report.report_day15_retain'), //15日留存
    dataIndex: 'th15_deposit_num',
    width: '140px',
    customRender: ({ record }) => {
      const color =
        Number(record.th15_deposit_rate) > 0 || Number(record.th15_bet_rate) > 0 ? '#E91134' : '';
      return h('div', { class: 'flex justify-center items-center' }, [
        h(
          'div',
          { class: '' }, // 添加样式和 key
          boo ? `${record.th15_deposit_num}` : `${record.th15_bet_num}`,
        ),
        h(
          'div',
          { style: { color: color }, class: 'ml-4px' }, // 添加样式和 key
          boo
            ? `(${Number(record.th15_deposit_rate).toFixed(2)}%)`
            : `(${Number(record.th15_bet_rate).toFixed(2)}%)`,
        ),
      ]);
    },
  },
  {
    title: t('table.report.report_day30_retain'), //30日留存
    dataIndex: 'th30_deposit_num',
    width: '140px',
    customRender: ({ record }) => {
      const color =
        Number(record.th30_deposit_rate) > 0 || Number(record.th30_bet_rate) > 0 ? '#E91134' : '';
      return h('div', { class: 'flex justify-center items-center' }, [
        h(
          'div',
          { class: '' }, // 添加样式和 key
          boo ? `${record.th30_deposit_num}` : `${record.th30_bet_num}`,
        ),
        h(
          'div',
          { style: { color: color }, class: 'ml-4px' }, // 添加样式和 key
          boo
            ? `(${Number(record.th30_deposit_rate).toFixed(2)}%)`
            : `(${Number(record.th30_bet_rate).toFixed(2)}%)`,
        ),
      ]);
    },
  },
];
