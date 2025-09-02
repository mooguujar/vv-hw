import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { useCurrencyStore } from '/@/store/modules/currency';
import { h, ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { currentyOptions, commomVenueList, optionsGamesList } from '/@/settings/commonSetting';
import dayjs from 'dayjs';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();
//帐变记录
export const accountColumns: BasicColumn[] = [
  {
    title: t('business.common_order_number'),
    dataIndex: 'bill_no',
    minWidth: 100,
    maxWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.changguan'),
    dataIndex: 'platform_id',
    minWidth: 100,
    customRender: ({ record }) =>
      optionsGamesList.filter((item) => item.value == record.platform_id)[0]?.label || '-',
  },
  {
    title: t('table.finance.finance_business_type'),
    dataIndex: 'business_type_name',
    minWidth: 100,
    customRender: ({ record }) => {
      const businessTypeName = record.business_type_name;
      return h('div', null, businessTypeName ? businessTypeName : '-');
    },
  },
  {
    title: t('table.finance.finance_Change_type'),
    dataIndex: 'cash_type_name',
    minWidth: 110,
    customRender: ({ record }) => {
      const styleName = record.cash_type_name;
      return h('div', null, styleName ? styleName : '-');
    },
  },
  {
    title: t('table.finance.finance_Change_amount'),
    dataIndex: 'amount',
    minWidth: 100,
  },
  {
    title: t('table.member.member_change_before'),
    dataIndex: 'before_amount',
    minWidth: 100,
  },
  {
    title: t('table.member.member_change_after'),
    dataIndex: 'after_amount',
    minWidth: 100,
  },
  {
    title: t('business.common_change_time'),
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'operator_name',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.operator_name ? record.operator_name : '-';
    },
  },
  {
    title: t('business.common_remark'),
    dataIndex: 'remark',
    minWidth: 160,
    slots: { customRender: 'remark' },
    customRender: ({ record }) => {
      h('div');
    },
  },
];
const platform_list = {
  '0': [
    {
      value: '0',
      label: t('business.common_all'),
    },
  ],
  '1': [
    {
      value: '101',
      label: t('common.evoRealPerson'),
    },
    {
      value: '102',
      label: t('common.ppRealPerson'),
    },
    {
      value: '103',
      label: t('common.dbRealPerson'),
    },
    {
      value: '104',
      label: t('common.agRealPerson'),
    },
    {
      value: '105',
      label: t('common.BGRealPerson'),
    },
    {
      value: '106',
      label: t('common.DGRealPerson'),
    },
    {
      value: '107',
      label: t('common.BBIN'),
    },
    {
      value: '108',
      label: t('common.SEXYBCRT'),
    },
    {
      value: '109',
      label: t('common.perfectVideo'),
    },
  ],
  '2': [
    {
      value: '201',
      label: t('common.JDBFishing'),
    },
    {
      value: '203',
      label: t('common.BGFishing'),
    },
    {
      value: '202',
      label: t('common.FGFishing'),
    },
    {
      value: '204',
      label: t('common.MTFishing'),
    },
    {
      value: '206',
      label: t('common.CQ9Fishing'),
    },
    {
      value: '205',
      label: t('common.DBFishing'),
    },
    {
      value: '207',
      label: t('common.KYFishing'),
    },
    {
      value: '208',
      label: t('common.AGFishing'),
    },
    {
      value: '209',
      label: t('common.LEGFishing'),
    },
    {
      value: '210',
      label: t('common.TYFishing'),
    },
    {
      value: '211',
      label: t('common.TaDaFishing'),
    },
    {
      value: '212',
      label: t('common.JILIFishing'),
    },
    {
      value: '213',
      label: t('common.FCFishing'),
    },
  ],
  '3': [
    {
      value: '309',
      label: t('common.SPRIBE'),
    },
    {
      value: '316',
      label: t('common.AGMachine'),
    },
    {
      value: '317',
      label: t('common.BBINMachine'),
    },
    {
      value: '318',
      label: t('common.MTMachine'),
    },
    {
      value: '319',
      label: t('common.LEGMachine'),
    },
    {
      value: '320',
      label: t('common.TYMachine'),
    },
    {
      value: '308',
      label: t('common.JDBMachine'),
    },
    {
      value: '310',
      label: t('common.MGMachine'),
    },
    {
      value: '311',
      label: t('common.HacksawMachine'),
    },
    {
      value: '312',
      label: t('common.XINMachine'),
    },
    {
      value: '313',
      label: t('common.FGMachine'),
    },
    {
      value: '315',
      label: t('common.CQ9Machine'),
    },
    {
      value: '314',
      label: t('common.DBMachine'),
    },
    {
      value: '301',
      label: t('common.PGMachine'),
    },
    {
      value: '304',
      label: t('common.BTGMachine'),
    },
    {
      value: '305',
      label: t('common.NetEntMachine'),
    },
    {
      value: '306',
      label: t('common.NLCMachine'),
    },
    {
      value: '307',
      label: t('common.RedTigerMachine'),
    },
    {
      value: '303',
      label: t('common.PPMachine'),
    },
    {
      value: '302',
      label: t('common.TaDaMachine'),
    },
    {
      value: '321',
      label: t('common.JILIMachine'),
    },
    {
      value: '322',
      label: t('common.FCMachine'),
    },
  ],
  '4': [
    {
      value: '401',
      label: t('common.IMSports'),
    },
  ],
  '5': [
    {
      value: '502',
      label: t('common.MTCards'),
    },
    {
      value: '505',
      label: t('common.LEGCards'),
    },
    {
      value: '506',
      label: t('common.TYCards'),
    },
    {
      value: '501',
      label: t('common.KYCards'),
    },
    {
      value: '504',
      label: t('common.FGCards'),
    },
    {
      value: '503',
      label: t('common.DBCards'),
    },
    {
      value: '507',
      label: t('common.TaDaCards'),
    },
    {
      value: '508',
      label: t('common.JILICards'),
    },
  ],
  '8': [
    {
      value: '801',
      label: t('common.Casino'),
    },
  ],
  '9': [
    {
      value: '701',
      label: t('common.TaDaLot'),
    },
  ],
};
export const platform_all = Object.values(platform_list).flat();
//     //体育 4
//     helper.IM:           im,     //IM体育 401
//     //棋牌 5
//     helper.KYPoker: ky,      //开元棋牌 501
//     helper.FGPoker: fg,      //FG棋牌 504
//     helper.DBPoker: dbPoker, //DB棋牌 503
// // 赌场游戏 8
//     helperOriginal: origin, //赌场游戏 801
let current_platform = platform_list['0'];
//帐变记录Form
export const accountSchemas: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'grupList',
    colProps: { style: { marginRight: '10px' } },
    // colProps: { style: { width: '200px' } },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    //colProps: { xxl: 8, xl: 8, lg: 8, md: 7, sm: 8 },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'currency_id',
    component: 'IconSelect',
    labelPrefixWidth: 45,
    labelPrefix: t('table.member.member_money_'),
    //slot: 'currency',
    defaultValue: '',
    colProps: { xxl: 4, xl: 4, lg: 4, class: 'w-150px' },
    componentProps: () => {
      const list = [{ label: t('business.common_all'), value: '' }, ...getCurrencyList];
      return {
        placeholder: t('table.member.member_choice_money'),
        options: list,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'business_type',
    labelPrefix: t('table.finance.finance_business_type'),
    labelPrefixWidth: 75,
    component: 'Select',
    colProps: { xxl: 4, xl: 5, lg: 6 },
    slot: 'business_type',
    defaultValue: '',
    componentProps: {
      getPopupContainer: () => document.body,
    },
    ifShow: false,
  },
  {
    field: 'cash_type',
    component: 'Select',
    labelPrefix: t('table.finance.finance_Change_type'),
    // labelPrefixWidth: 75,
    slot: 'change_type',
    ifShow: ({ values }) => {
      return true;
    },
    componentProps: {
      dropdownMatchSelectWidth: false,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
  },
  {
    field: 'game_type',
    component: 'Select',
    labelPrefix: t('business.common_game_type'),
    ifShow: ({ values }) => {
      return true;
    },
    defaultValue: '0',
    componentProps: ({ formModel }) => {
      return {
        dropdownMatchSelectWidth: false,
        getPopupContainer: () => document.body,
        placeholder: t('table.member.member_choice_money'),
        options: [
          { label: t('business.common_all'), value: '0' },
          ...Object.keys(commomVenueList).map((key) => {
            return { label: commomVenueList[key], value: key };
          }),
        ],
        allowClear: false,
        onChange: async (e) => {
          formModel.platform_id = null;
        },
      };
    },
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'platform_id',
    component: 'Select',
    labelPrefix: t('table.finance.platform_id'),
    defaultValue: '0',
    // labelPrefixWidth: 45,
    componentProps: ({ formModel }) => {
      const filterOptions = [
        { label: t('business.common_all'), value: '0' },
        ...optionsGamesList.filter((item) => item.type == Number(formModel.game_type)),
      ];
      return {
        dropdownMatchSelectWidth: false,
        getPopupContainer: () => document.body,
        placeholder: t('table.member.member_choice_money1'),
        options: filterOptions,
        allowClear: true,
      };
    },
    ifShow: ({ values }) => {
      return true;
    },
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'username',
    labelPrefix: t('table.system.system_member_account'),
    // labelPrefixWidth: 75,
    component: 'Input',
    // colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    componentProps: {
      placeholder: t('common.inputText'), //请输入
    },
  },
];

export const dateGroupButtonList = [
  { label: t('table.member.member_today'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];

export const dataDeposit = [
  {
    currency_id: '701',
    currency_name: 'CNY',
    amount: '200.00',
  },
];
