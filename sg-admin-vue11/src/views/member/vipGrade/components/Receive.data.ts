import { BasicColumn, FormSchema } from '/@/components/Table';
import { getkeyValues } from '/@/utils/common';
import {
  currentyOptions,
  useCashTypeOptions,
  useReciveRecordsOptions,
} from '/@/views/common/commonSetting';
import { useCurrencyStore } from '/@/store/modules/currency';
import { formatDate } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import { useMemberStore } from '/@/store/modules/member';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

const { reciveRecordsOptions } = useReciveRecordsOptions();

const { cashTypeOptions } = useCashTypeOptions();
const memberStore = useMemberStore();
// 获取层级下拉
memberStore.getLevelList();

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    width: 140,
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    width: 140,
  },
  {
    title: t('table.report.report_member_level'),
    dataIndex: 'level_id',
    width: 140,
    customRender: ({ record }) => {
      return getkeyValues(record.level_id);
    },
  },
  {
    title: t('table.system.system_vip_level'),
    dataIndex: 'vip',
    width: 140,
    customRender: ({ record }: any) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.member.member_recive_type'),
    dataIndex: 'cash_type',
    width: 160,
    customRender: ({ record }) => {
      // const options = changeOption(reciveRecordsOptions);
      return cashTypeOptions[record.cash_type];
    },
  },
  {
    title: t('table.member.member_recive_coin'),
    dataIndex: 'receive_currency_id',
    width: 140,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.receive_currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.receive_currency_id] }),
  },
  {
    title: t('table.member.member_recive_money'),
    dataIndex: 'receive_amount',
    minWidth: 140,
    customRender: ({ record }) => {
      return parseFloat(record.receive_amount).toFixed(2);
    },
  },
  {
    title: t('table.member.member_recive_time'),
    dataIndex: 'updated_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return formatDate(record.updated_at);
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'cash_type',
    component: 'Select',
    labelPrefix: t('sys.errorLog.tableColumnType'),
    // labelPrefixWidth: 45,
    colProps: { xxl: 7, xl: 7, lg: 7, md: 7, sm: 7 },
    componentProps: {
      placeholder: t('business.common_all'),
      options: reciveRecordsOptions.filter((p) => p.value !== '814'),
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'currency_id',
    component: 'IconSelect',
    // labelPrefixWidth: 45,
    labelPrefix: t('business.common_currency'), //币种
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 5 },
    componentProps: () => {
      const list = [{ label: t('business.common_all'), value: '' }, ...getCurrencyList]; //全部
      return {
        placeholder: t('business.common_all'), //全部
        options: list,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    labelPrefix: '',
    labelBorder: false,
    component: 'InputGroup',
    slot: 'custom',
    // colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
  },
];

export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('table.member.member_week'), value: 'week' },
  { label: t('table.member.member_month'), value: 'month' },
];

export function changeOption(options) {
  const convertedOptions = options.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});
  return convertedOptions;
}
