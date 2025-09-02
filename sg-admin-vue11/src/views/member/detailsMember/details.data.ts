import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone, timestampToTimezone } from '/@/utils/dateUtil';
import { deviceMap, linkedAccountOptions } from '../common/const';
import { useCurrencyStore } from '/@/store/modules/currency';
import { Tooltip } from 'ant-design-vue';
import { SetTooltip } from '/@/views/common/component';
import { h, unref } from 'vue';
import { useLocale } from '@/locales/useLocale';
import { mul } from '/@/utils/number';
import { useI18n } from '/@/hooks/web/useI18n';
import { getkeyValues } from '/@/utils/common';
import {
  currentyOptions,
  optionSetting,
  optionsConfim,
  optionsTransfer,
  commomVenueList,
  optionsGamesList,
} from '/@/settings/commonSetting';
import dayjs from 'dayjs';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { getTreeList } from '/@/api/member';
import { useUserStore } from '/@/store/modules/user';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { getLocale } = useLocale();
const userStore = useUserStore();
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
  },
  {
    title: t('table.member.member_change_before'),
    dataIndex: 'before_amount',
  },
  {
    title: t('table.member.member_change_after'),
    dataIndex: 'after_amount',
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
useAutoTableLabelWidth(accountColumns);
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
    // labelPrefixWidth: 55,
    labelPrefix: t('table.member.member_money_'),
    //slot: 'currency',
    defaultValue: '',
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
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
    // labelPrefixWidth: 75,
    component: 'Select',
    colProps: { xxl: 6, xl: 6, lg: 6 },
    slot: 'business_type',
    componentProps: () => {
      return {
        dropdownMatchSelectWidth: false,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'cash_type',
    component: 'Select',
    labelPrefix: t('table.finance.finance_Change_type'),
    labelPrefixWidth: 75,
    slot: 'change_type',
    ifShow: ({ values }) => {
      return !!values.business_type;
    },
    componentProps: () => {
      return {
        getPopupContainer: () => document.body,
      };
    },
    colProps: { xxl: 4, xl: 5, lg: 6 },
  },
];
useAutoTableLabelWidth(accountSchemas);
//资金日志
export const fundingColumns: BasicColumn[] = [
  {
    title: t('table.member.member_money_'),
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
  },
  {
    title: t('table.finance.finance_business_type'),
    dataIndex: 'business_type_name',
  },
  {
    title: t('table.finance.finance_Change_type'),
    dataIndex: 'cash_type_name',
  },
  {
    title: t('table.finance.finance_Change_amount'),
    dataIndex: 'amount',
  },
  {
    title: t('table.member.member_change_before'),
    dataIndex: 'before_amount',
    // customRender: ({ record }) => {
    //   return setTooltip(record.before_amount);
    // },
  },
  {
    title: t('table.member.member_change_after'),
    dataIndex: 'after_amount',
    // customRender: ({ record }) => {
    //   return setTooltip(record.after_amount);
    // },
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
    customRender: ({ record }) => {
      return record.operator_name ? record.operator_name : '-';
    },
  },
  {
    title: t('business.common_remark'),
    dataIndex: 'remark',
    minWidth: 200,
  },
];
useAutoTableLabelWidth(fundingColumns);
//资金日志Form
export const schemasFunding: FormSchema[] = [
  {
    field: '',
    label: '',
    component: 'Input',
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
    // colProps: { xxl: 8, xl: 8, lg: 8, md: 7, sm: 8 },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'currency_id',
    labelPrefix: t('table.member.member_money_'),
    labelPrefixWidth: 45,
    component: 'IconSelect',
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    defaultValue: '',
    //slot: 'currency',
    componentProps: () => {
      const list = [{ label: t('business.common_all'), value: '' }, ...getCurrencyList];
      return {
        placeholder: t('business.common_all'),
        options: list,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'business_type',
    labelPrefix: t('table.finance.finance_business_type'),
    // labelPrefixWidth: '75',
    component: 'Select',
    colProps: { xxl: 6, xl: 6, lg: 6 },
    slot: 'business_type',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'cash_type',
    component: 'Select',
    labelPrefix: t('table.finance.finance_Change_type'),
    // labelPrefixWidth: 300,
    slot: 'change_type',
    ifShow: ({ values }) => {
      return !!values.business_type;
    },
    colProps: ['zh_CN'].includes(unref(getLocale))
      ? { xxl: 5, xl: 5, lg: 5 }
      : { xxl: 9, xl: 9, lg: 9 },
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
];
//登录日志Form
export const schemasLoginForm: FormSchema[] = [
  {
    field: '',
    label: '',
    component: 'Input',
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
    field: 'Loginip',
    label: '',
    component: 'Input',
    slot: 'Loginip',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 7, sm: 7 },
  },
];
//操作日志
export const OperaColumns: BasicColumn[] = [
  {
    title: t('table.member.member_login_demond'),
    dataIndex: 'domain',
    minWidth: 100,
  },
  {
    title: t('table.risk.report_login_ip'),
    dataIndex: 'login_ip',
  },
  {
    title: t('table.member.member_oprate_event'),
    dataIndex: 'operation_event',
  },
  {
    title: t('table.member.member_action'),
    dataIndex: 'operation_action',
    customRender: ({ record }) => {
      return record.operation_action === 'Update'
        ? t('modalForm.member.member_authorized_update')
        : t('business.add_new');
    },
  },
  {
    title: t('table.member.member_before'),
    dataIndex: 'operation_before',
    minWidth: 100,
  },
  {
    title: t('table.member.member_after'),
    dataIndex: 'operation_after',
    minWidth: 100,
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'created_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];
useAutoTableLabelWidth(OperaColumns);
//登录日志
export const logColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('business.common_super_agent'),
    minWidth: 100,
    dataIndex: 'parent_name',
  },
  {
    title: t('table.member.member_login_device'),
    dataIndex: 'logindevice',
    minWidth: 100,
    customRender: ({ record }) => {
      return deviceMap[record.logindevice];
    },
  },
  {
    title: t('table.member.member_device_no'),
    minWidth: 100,
    dataIndex: 'deviceno',
  },
  {
    title: t('table.member.member_login_demond'),
    minWidth: 100,
    dataIndex: 'logindomain',
  },
  {
    title: t('table.risk.report_login_ip'),
    minWidth: 100,
    dataIndex: 'loginip',
  },
  {
    title: t('table.risk.report_ip_location'),
    minWidth: 100,
    dataIndex: 'ipaddress',
  },
  {
    title: t('table.member.member_login_time'),
    dataIndex: 'created_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return timestampToTimezone(record.created_at as number);
    },
  },
];
useAutoTableLabelWidth(logColumns);
//关联账号
export const linkColumns: BasicColumn[] = [
  {
    title: t('table.member.member_registe_time'),
    dataIndex: 'created_at',
    minWidth: 200,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },

    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return record.username ? record.username : '-';
    },
  },
  {
    title: t('business.common_realiy_name'),
    dataIndex: 'real_name',
    width: 150,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    slots: { customRender: 'memberRealname' },
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return record.parent_name ? record.parent_name : '-';
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 160,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === '2';
      let color = 'green';
      const selectOptions = {
        bonus_state: record.bonus_state,
        rebate_state: record.rebate_state,
        commission_state: record.commission_state,
      };
      const slectText = {
        bonus_state: t('table.member.member_limit_discount'),
        rebate_state: t('table.member.member_limit_rabate'),
        commission_state: t('table.member.member_limit_commision'),
      };
      const getArr: any = [];
      let text = t('business.common_on_activate');
      if (enable) {
        text = t('business.common_deactivate');
        color = 'red';
      } else {
        for (const stateKey in selectOptions) {
          const stateValue = selectOptions[stateKey];
          if (stateValue === 2) {
            getArr.push(stateKey);
          }
        }
        if (getArr.length > 0) {
          text = t('table.member.member_limit_discount');
          color = '#f59c2d';
        }
      }
      const newArr: any = [];
      getArr.forEach((item) => {
        newArr.push(slectText[item]);
      });
      if (getArr.length > 0) {
        return h(Tooltip, { title: newArr.length && newArr?.join(',') }, () =>
          h(
            'div',
            {
              style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                color: '#f59c2d',
              },
            },
            text,
          ),
        );
      } else {
        return h('div', { style: { color: color } }, text);
      }
    },
  },
  {
    title: t('table.member.member_balance_name'),
    dataIndex: 'balance_amount',
    minWidth: ['zh_CN'].includes(unref(getLocale)) ? 100 : 150,
    sorter: true,
    showSorterTooltip: false,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    slots: { customRender: 'balance' },
  },
  {
    title: t('table.member.member_commission_state'),
    dataIndex: 'balance_agency_amount',
    sorter: true,
    minWidth: ['zh_CN'].includes(unref(getLocale)) ? 100 : 180,
    showSorterTooltip: false,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },

    slots: { customRender: 'MemberCommissionData' },
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level',
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return getkeyValues(record.level);
    },
  },
  {
    title: t('table.system.system_vip_level'),
    dataIndex: 'vip_level',
    width: 80,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }: any) => {
      return `VIP${record.vip_level}`;
    },
  },
  {
    title: t('table.finance.finance_total_deposit'),
    dataIndex: 'total_deposit',
    minWidth: 160,
    sorter: true,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return record.total_deposit.length > 10 ? record.total_deposit : record.total_deposit;
    },
  },
  {
    title: t('table.member.member_withdraw_money'),
    dataIndex: 'total_withdraw',
    minWidth: ['zh_CN'].includes(unref(getLocale)) ? 100 : 160,
    sorter: true,
    showSorterTooltip: false,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return record.total_withdraw.length > 10 ? record.total_withdraw : record.total_withdraw;
    },
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'cash_profit',
    minWidth: ['zh_CN'].includes(unref(getLocale)) ? 100 : 180,
    sorter: true,
    showSorterTooltip: false,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return record.cash_profit.length > 10 ? record.cash_profit : record.cash_profit;
    },
  },
  {
    title: t('table.finance.finance_Discounted_price'),
    dataIndex: 'discount_amount',
    minWidth: ['zh_CN'].includes(unref(getLocale)) ? 100 : 180,
    sorter: true,
    showSorterTooltip: false,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return record.discount_amount.length > 10 ? record.discount_amount : record.discount_amount;
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet',
    minWidth: ['zh_CN'].includes(unref(getLocale)) ? 100 : 180,
    sorter: true,

    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return record.valid_bet.length > 10 ? setTooltip(record.valid_bet) : record.valid_bet;
    },
  },
  {
    title: t('table.risk.report_link_time'),
    dataIndex: 'linked_time',
    minWidth: 200,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return toTimezone(record.linked_time, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.risk.report_link_type'),
    dataIndex: 'linked_type',
    minWidth: 120,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return linkedAccountOptions[record.linked_type];
    },
  },
  {
    title: t('table.risk.report_link_info'),
    dataIndex: 'linked_content',
    width: 150,
    customHeaderCell: () => {
      return {
        style: {
          whiteSpace: 'nowrap',
        },
      };
    },
    customRender: ({ record }) => {
      return record.linked_content.length > 20
        ? setTooltip(record.linked_content)
        : record.linked_content;
    },
  },
];
useAutoTableLabelWidth(linkColumns);
export const formlink: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    slot: 'searchForm',
    colProps: { xxl: 5, xl: 5, lg: 6, md: 7, sm: 7 },
  },
];

export const dateGroupButtonList = [
  { label: t('table.member.member_today'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];
//操作日志Form
export const schemasOperateForm: FormSchema[] = [
  {
    field: '',
    label: '',
    component: 'Input',
    slot: 'grupList',
    colProps: { style: { marginRight: '10px' } },
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
    field: 'operation_event_id',
    labelPrefix: t('table.member.member_oprate_event'),
    labelPrefixWidth: 75,
    component: 'ApiSelect',
    defaultValue: null,
    colProps: { xxl: 6, xl: 6, lg: 6 },
    componentProps: () => {
      return {
        placeholder: t('business.common_all'),
        api: async () => {
          const all = { name: t('business.common_all'), id: null };
          const data = await getTreeList({ level: '020' });
          return [all, ...data];
        },
        labelField: 'name',
        valueField: 'id',
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'Loginip',
    label: '',
    component: 'Input',
    slot: 'Loginip',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 7, sm: 7 },
  },
];

export const schemasBetForm: FormSchema[] = [
  {
    field: 'currency_id',
    component: 'IconSelect',
    labelPrefixWidth: 45,
    labelPrefix: t('table.member.member_money_'),
    defaultValue: '',
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    componentProps: () => {
      const list = [{ label: t('table.member.member_money_all'), value: '' }, ...getCurrencyList];
      return {
        getPopupContainer: () => document.body,
        placeholder: t('table.member.member_choice_money'),
        options: list,
        allowClear: false,
      };
    },
  },
  {
    field: 'gropList',
    component: 'Input',
    label: '',
    slot: 'grupList',
    colProps: { class: 'alldateComponents' },
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
];

//总投注
export const columnsTotal: BasicColumn[] = [
  {
    title: t('table.report.report_platform_name'),
    dataIndex: 'platform_name',
    minWidth: 150,
    maxWidth: 150,
  },
  {
    title: t('table.report.report_bet_count'),
    dataIndex: 'bet_count',
    minWidth: 150,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    minWidth: 150,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 150,
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    sorter: true,
    showSorterTooltip: false,
  },
  {
    title: t('table.report.report_bet_count_proportion'),
    dataIndex: 'bet_count_proportion',
    sorter: true,
    showSorterTooltip: false,
    customRender: ({ record }) => {
      return mul(Number(record.bet_count_proportion), 100) + '%';
    },
  },
  {
    title: t('table.report.report_profit_rate'),
    dataIndex: 'profit_rate',
    sorter: true,
    showSorterTooltip: false,

    customRender: ({ record }) => {
      return record.profit_rate + '%';
    },
  },
];
useAutoTableLabelWidth(columnsTotal);

//IM体育
export const columnsIm: BasicColumn[] = [
  {
    title: t('table.report.report_game_name'),
    dataIndex: 'game_name',
    minWidth: 150,
    maxWidth: 150,
  },
  {
    title: t('table.report.report_bet_count'),
    dataIndex: 'bet_count',
    minWidth: 150,
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    minWidth: 150,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 150,
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    minWidth: 100,
  },
  {
    title: t('table.report.report_bet_count_proportion'),
    dataIndex: 'bet_count_proportion',
    customRender: ({ record }) => {
      return mul(Number(record.bet_count_proportion), 100) + '%';
    },
  },
  {
    title: t('table.report.report_profit_rate'),
    dataIndex: 'profit_rate',
    minWidth: 100,
    customRender: ({ record }) => {
      //const profit_rate = record.profit_rate * 100;
      return record.profit_rate + '%';
    },
  },
];
useAutoTableLabelWidth(columnsIm);
//场馆查询
export const schemasVenue: FormSchema[] = [
  {
    field: '',
    label: '',
    component: 'Input',
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
      allowClear: false,
    },
  },
  {
    field: 'platform_id',
    labelPrefix: t('table.system.system_game_sort'),
    component: 'Select',
    labelPrefixWidth: 80,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    componentProps: () => {
      return {
        options: Object.keys(optionSetting).map((key) => {
          return { label: optionSetting[key], value: key };
        }),
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'state',
    labelPrefix: t('table.system.Transfer_status'),
    component: 'Select',
    labelPrefixWidth: 75,
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    componentProps: () => {
      return {
        options: [
          {
            label: t('common.TransferSuccessful'),
            value: '2',
          },
          {
            label: t('common.TransferFail'),
            value: '1',
          },
          {
            label: t('common.TransferinProgress'),
            value: '3',
          },
        ],
        getPopupContainer: () => document.body,
      };
    },
  },
];
//场馆列表
export const columnVenue: BasicColumn[] = [
  {
    title: t('business.common_order_number'),
    dataIndex: 'bill_no',
    width: 150,
    customRender: ({ record }) => {
      return SetTooltip(record.bill_no, 15);
    },
  },
  {
    title: t('common.VenueMember'),
    dataIndex: 'player_name',
    minWidth: 100,
  },
  {
    title: t('common.TransferType'),
    dataIndex: 'transfer_type',
    minWidth: 120,
    customRender: ({ record }) => {
      return record.transfer_type === '1'
        ? t('common.TransferinVenue')
        : t('common.TransferoutVenue');
    },
  },
  // {
  //   title: '场馆',
  //   dataIndex: 'platform_id',
  // 	minWidth: 80,
  // 	customRender:({record})=> {
  // 		return record.platform_id?optionSetting[record.platform_id]:'-'
  // 	}
  // },
  {
    title: t('table.system.system_game_sort'),
    dataIndex: 'platform_name',
    minWidth: 100,
  },

  {
    title: t('common.TransferCurrency'),
    dataIndex: 'g_currency_id',
    minWidth: 120,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.g_currency_id] }),
  },
  {
    title: t('common.TransferAmount'),
    dataIndex: 'g_amount',
    minWidth: 120,
  },
  {
    title: t('common.conversionRate'),
    dataIndex: 'rate',
    minWidth: 100,
  },
  {
    title: t('business.qb_bz'),
    dataIndex: 'currency_id',
    minWidth: 100,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('common.WalletAmount'),
    dataIndex: 'amount',
    minWidth: 120,
  },
  {
    title: t('table.system.Transfer_status'),
    dataIndex: 'state',
    minWidth: 120,
    customRender: ({ record }) => {
      return optionsTransfer[record.state];
    },
  },
  {
    title: t('common.ConfirmationType'),
    dataIndex: 'automatic',
    minWidth: 100,
    customRender: ({ record }) => {
      return optionsConfim[record.automatic];
    },
  },
  {
    title: t('table.member.member_creat_time'),
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at / 1000);
    },
  },
  {
    title: t('common.ConfirmationTime'),
    dataIndex: 'confirm_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.confirm_at / 1000);
    },
  },
  {
    title: t('common.Confirmor'),
    dataIndex: 'confirm_name',
    minWidth: 100,
  },
];
useAutoTableLabelWidth(columnVenue);
export const schemasRebate: FormSchema[] = [
  {
    field: 'currency_id',
    labelPrefix: t('table.member.member_money_'),
    labelPrefixWidth: 45,
    component: 'IconSelect',
    defaultValue: '',
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
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
      allowClear: false,
    },
  },
  {
    field: 'game_type',
    labelPrefix: t('business.common_game_type'),
    component: 'Select',
    // labelPrefixWidth: 80,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    componentProps: ({ formModel }) => {
      return {
        options: Object.keys(commomVenueList).map((key) => {
          return { label: commomVenueList[key], value: key };
        }),
        onChange: () => {
          formModel.platform_id = null;
        },
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'platform_id',
    labelPrefix: t('common.system_game_sort'),
    component: 'Select',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    labelPrefixWidth: 80,
    componentProps: ({ formModel }) => {
      const filterOptions = optionsGamesList.filter(
        (item) => item.type == Number(formModel.game_type),
      );
      return {
        options: filterOptions,
        getPopupContainer: () => document.body,
      };
    },
  },
];

/*场馆返水*/
export const columnRebate: BasicColumn[] = [
  {
    title: t('table.system.system_username'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_game_type'),
    dataIndex: 'game_type',
    width: 100,
    customRender: ({ record }) => {
      return commomVenueList[record.game_type];
    },
  },
  {
    title: t('business.common_game_name'),
    dataIndex: 'platform_name',
    minWidth: 120,
  },
  {
    minWidth: 120,
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('business.common_bet_mount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 140,
  },
  {
    title: t('business.common_recy_rate') + '%',
    dataIndex: 'rate',
    minWidth: 120,
  },
  {
    title: t('business.common_recy_mount'),
    dataIndex: 'rebate_amount',
    minWidth: 140,
  },
  {
    title: t('table.system.system_collection_status'),
    dataIndex: 'state',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.state === 1
        ? t('modalForm.discountActivity.getGift')
        : t('modalForm.discountActivity.unGetGift');
    },
  },
  {
    title: t('table.system.recy_date'),
    dataIndex: 'date',
  },
  {
    title: t('table.member.member_creat_time'),
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at / 1000);
    },
  },
];
useAutoTableLabelWidth(columnRebate);
export const dataDeposit = [
  {
    currency_id: '701',
    currency_name: 'CNY',
    amount: '200.00',
  },
];

//js将dataDeposit换算为 { 'CNY': '200.00',  }
