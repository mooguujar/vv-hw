import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { RechargeOrderItem } from '/@/api/model/financeModel';
import { stateRenderCompanyData, stateGameRecordCompanyColor } from '../common/const';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { Client } from '/@/views/common/commonSetting';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { SetTooltip } from '/@/views/common/component';
import { auths } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('business.common_order_number'),
    dataIndex: 'order_number',
    customRender: ({ record }) => {
      return SetTooltip(record.order_number, 15);
    },
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level_name',
  },
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    customRender: ({ record }) => {
      return SetTooltip(record.username, 12);
    },
  },
  {
    title: t('business.common_actual_name'),
    dataIndex: 'realname',
    customRender: ({ record }) => {
      return SetTooltip(record.realname, 12);
    },
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    customRender: ({ record }) => {
      return record.parent_name ? record.parent_name : '-';
    },
  },
  {
    title: t('table.finance.finance_Deposit_currency'),
    dataIndex: 'currency_name',
    customRender: ({ record }) => {
      return h(cdBlockCurrency, { currencyName: record.currency_name });
    },
  },
  {
    title: t('table.finance.finance_Deposit_method'),
    dataIndex: 'pay_method_name',
  },
  {
    title: t('table.finance.finance_Deposit_amount'),
    dataIndex: 'pay_amount',
    customRender: ({ record }) => {
      return h(() =>
        h(
          'div',
          {
            style: {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            },
          },
          record.pay_amount,
        ),
      );
    },
  },
  {
    title: t('table.finance.finance_Discounted_price'),
    dataIndex: 'discount_amount',
  },
  {
    title: t('table.finance.finance_total_points'),
    dataIndex: 'finally_amount',
    customRender: ({ record }) => {
      return h(() =>
        h(
          'div',
          {
            style: {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              color: '#E91134',
            },
          },
          record.finally_amount,
        ),
      );
    },
  },
  {
    title: t('table.finance.finance_Deposit_account'),
    dataIndex: 'bank_name',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.bank_name,
        line2: record.currency_name == 'BRL' ? record.deposit_bank_account : record.bank_card_name,
      });
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 160,
    customRender: ({ record }) => {
      const state = (record as RechargeOrderItem).state;
      return h(
        'div',
        { style: { color: stateGameRecordCompanyColor[state] } },
        stateRenderCompanyData[state],
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    minWidth: 100,
    slots: { customRender: 'action' },
    ifShow: auths(['20203']),
  },
  {
    title: `${t('business.common_submission_time')} / ${t('business.common_auditors_time')}`,
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.created_at ? toTimezone(record.created_at) : '-',
        line2: record.review_at ? toTimezone(record.review_at) : '-',
      });
    },
  },
  {
    title: t('business.common_auditors'),
    dataIndex: 'review_name',
    minWidth: 100,
  },
  {
    title: t('business.common_client'),
    dataIndex: 'device',
    minWidth: 100,
    customRender: ({ record }) => {
      return Client[record.device];
    },
  },
];
useAutoTableLabelWidth(columns);
