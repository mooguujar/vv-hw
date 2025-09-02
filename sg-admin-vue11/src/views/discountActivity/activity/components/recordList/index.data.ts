import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { currentyOptions } from '/@/views/common/commonSetting';
import { getkeyValues } from '/@/utils/common';
import { useI18n } from '/@/hooks/web/useI18n';
import { h } from 'vue';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('table.discountActivity.discountActivity_member'),
    dataIndex: 'username',
    minWidth: 77,
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    minWidth: 100,
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level',
    minWidth: 100,
    customRender: ({ record }) => {
      return getkeyValues(record.level);
    },
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    minWidth: 100,
    customRender: ({ record }) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.discountActivity.discountActivity_currency'),
    dataIndex: 'currency_id',
    minWidth: 100,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.member.member_recive_money'),
    minWidth: 66,
    dataIndex: 'bonus',
  },
  {
    title: t('table.member.member_recive_time'),
    dataIndex: 'apply_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.apply_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];

export const schemas: FormSchema[] = [
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },

  {
    field: 'type',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];
