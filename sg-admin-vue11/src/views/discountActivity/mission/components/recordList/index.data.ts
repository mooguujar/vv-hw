import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { currentyOptions } from '/@/views/common/commonSetting';
import { getkeyValues } from '/@/utils/common';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

const { t } = useI18n();
function formatTwoDecimal(num) {
  return Math.floor(num * 100) / 100; // 保留两位小数，不四舍五入
}

function formatWithTwoDecimals(num) {
  const truncated = num; // formatTwoDecimal(num); // 截断小数部分
  return truncated.toFixed(2); // 始终保留两位小数格式
}

export const columns: BasicColumn[] = [
  {
    title: t('table.discountActivity.discountActivity_member'),
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    minWidth: 100,
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level_id',
    minWidth: 100,
    customRender: ({ record }) => {
      return getkeyValues(record.level_id);
    },
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    minWidth: 80,
    customRender: ({ record }) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.discountActivity.discountActivity_currency'),
    dataIndex: 'currency_id',
    minWidth: 120,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.member.member_recive_money'),
    minWidth: 100,
    dataIndex: 'apply_amount',
    customRender: ({ record }) => {
      const num = parseFloat(record.apply_amount);
      return formatWithTwoDecimals(num);
    },
  },
  {
    title: t('table.member.member_recive_time'),
    dataIndex: 'receive_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.receive_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },

  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];
