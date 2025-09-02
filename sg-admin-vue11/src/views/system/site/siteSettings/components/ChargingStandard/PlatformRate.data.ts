import { BasicColumn } from '@/components/Table';
import { h } from 'vue';
import { useI18n } from '@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { currentyOptions } from '/@/settings/commonSetting';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('table.promotion.promotion_currency'),
    dataIndex: 'currency_name',
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
    align: 'center',
  },
  {
    title: t('common.Rate'),
    dataIndex: 'fee',
    align: 'center',
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    minWidth: 160,
    customRender: ({ record }) => {
      const stringDate = dayjs(record.start_time).format('YYYY-MM-DD HH:mm:ss');
      return stringDate;
    },
    align: 'center',
  },
];
