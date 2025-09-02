import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { commissionWithdrawalOrder } from '/@/api/model/financeModel';
import {
  getWithdrawTimesData,
  stateRenderWithdrawalData,
  stateGameRecordWithdrawalColor,
} from '../common/const';

import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
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
    slots: { customRender: 'username' },
  },
  {
    title: t('business.common_actual_name'),
    dataIndex: 'realname',
  },
  {
    title: t('table.finance.finance_Withdrawal_status'),
    dataIndex: 'withdraw_count',
    customRender: ({ record }) => {
      const withdraw_count = (record as commissionWithdrawalOrder).withdraw_count || 0;
      const text = getWithdrawTimesData(withdraw_count);
      return h('span', { style: { color: '#E91134' } }, text);
    },
  },
  {
    title: t('table.finance.finance_Withdrawal_currency'),
    dataIndex: 'currency_name',
    customRender: ({ record }) => {
      return h(cdBlockCurrency, { currencyName: record.currency_name });
    },
  },
  {
    title: t('modalForm.finance.finance_help_payplatform'),
    dataIndex: 'withdraw_merchant',
    customRender: ({ record }) => {
      return record.withdraw_merchant ? record.withdraw_merchant : '-';
    },
  },
  {
    title: t('table.finance.finance_Withdrawal_amount'),
    dataIndex: 'amount',
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
          record.amount,
        ),
      );
    },
  },
  {
    title: t('table.finance.finance_handling_fee'),
    dataIndex: 'fee',
  },
  {
    title: t('table.finance.finance_actual_withdrawal'),
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
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 160,
    customRender: ({ record }) => {
      const state = (record as commissionWithdrawalOrder).state;
      return h(
        'div',
        { style: { color: stateGameRecordWithdrawalColor[state] } },
        stateRenderWithdrawalData[state],
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: '',
    slots: { customRender: 'action' },
    ifShow: auths(['20404', '20405']),
  },
  {
    title: `${t('business.common_submission_time')} / ${t('business.common_auditors_time')}`,
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: toTimezone(record.created_at),
        line2: toTimezone(record.review_at),
      });
    },
  },
  {
    title: t('business.common_auditors'),
    dataIndex: 'review_name',
    customRender: ({ record }) => {
      const review_name = record.review_name;
      return h('span', null, review_name ? review_name : '-');
    },
  },
];
useAutoTableLabelWidth(columns);
