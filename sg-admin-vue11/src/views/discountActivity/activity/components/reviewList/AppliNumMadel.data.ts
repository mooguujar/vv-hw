import { BasicColumn } from '/@/components/Table';
import { currentyOptions } from '/@/views/common/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('v.discount.activity.class'),
    dataIndex: 'lvl',
    minWidth: 60,
  },
  {
    title: t('common.translate.word51'),
    minWidth: 80,
    customRender: ({ record }) => {
      return currentyOptions[record.bonus_currency_id];
    },
  },
  {
    title: t('common.translate.word52'),
    dataIndex: 'from_bonus_amount',
    minWidth: 100,
  },
  {
    title: t('table.discountActivity.discountActivity_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.member.member_recive_money'),
    dataIndex: 'bonus_amount',
    minWidth: 100,
  },
];

export const agentappliColumns: BasicColumn[] = [
  {
    title: t('v.discount.activity.class'),
    dataIndex: 'lvl',
    minWidth: 60,
  },
  {
    title: t('table.discountActivity.discountActivity_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.member.member_recive_money'),
    dataIndex: 'bonus_amount',
    minWidth: 100,
  },
];
