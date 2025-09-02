import { toTimezone } from '/@/utils/dateUtil';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { currentyOptions } from '/@/views/common/commonSetting';
import { h } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';

const { t } = useI18n();
export const dataColumns: any = [
  {
    title: t('table.discountActivity.discountActivity_order'),
    dataIndex: 'order_id',
    width: 220,
    customRender: ({ record }) => {
      return record.order_id;
    },
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    width: 130,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.report.report_deposit_charge_money'), // 充值金额
    dataIndex: 'deposit_amount',
    minWidth: 130,
    customRender: ({ record }) => {
      return record.deposit_amount;
    },
  },
  {
    title: t('table.discountActivity.discountActivity_converted_recharge_amount'),
    width: 220,
    dataIndex: 'recharge_amount',
  },
  {
    title: t('business.common_member_date'),
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];
