import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import {
  reviewState,
  colorMap,
  rprofitState,
  rprofitcolorMap,
  agentcolorMap,
  agentreviewState,
  useReviewState,
} from '../../common/setting';

const { reviewStateMap } = useReviewState();
import { clientList, currentyOptions } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';
// import MoneyTip from './moneyTip.vue';
import { MultClumnsPopover } from '/@/components/Popover';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { isControlValueSet } from '/@/utils/domUtils';
import { Tooltip } from 'ant-design-vue';
import { isEmpty } from '/@/utils/is';
const { t } = useI18n();

/** 货币转换的tip */
const setTooltip = (record, keyIndex, labelBefore, labelAfter) => {
  return h(MultClumnsPopover, { record, keyIndex, labelBefore, labelAfter });
};

/** 顶部tip */
const topTooltip = (text, color = 'black') => {
  return h(
    // Tooltip,
    // {
    //   title: text,
    // },
    () =>
      h(
        'div',
        {
          style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', color },
        },
        text,
      ),
  );
};

/** 推广活动 */
export const agentColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.report.report_promotion_number'),
    dataIndex: '',
    width: 80,
    customRender: ({ record }) => {
      return topTooltip(record.valid_member + '/' + record.total_member);
    },
  },
  {
    title: t('table.report.report_firstdepositors_number'),
    dataIndex: '',
    minWidth: 110,
    // slots: { customRender: 'exchangeRate' },
    customRender: ({ record }) => {
      return topTooltip(
        record.first_deposit_amount + '/' + record.first_deposit_count + t('component.unit.people'),
      );
    },
  },
  {
    title: t('table.report.report_deposit_amount'),
    dataIndex: 'deposit_amount',
    minWidth: 110,
    customRender: ({ record }) => {
      return topTooltip(
        record.deposit_amount + '/' + record.deposit_count + t('component.unit.people'),
      );
    },
  },
  {
    title: t('table.report.report_withdraw_amount'),
    dataIndex: 'withdraw_amount',
    width: 110,
    customRender: ({ record }) => {
      return topTooltip(
        record.withdraw_amount + '/' + record.withdraw_count + t('component.unit.people'),
      );
    },
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'net_amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return h(
        // Tooltip,
        // {
        //   title: record.net_amount,
        // },
        () =>
          h(
            'div',
            {
              style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                color: record.net_amount > 0 ? '#E91134' : '#1CD91C',
              },
            },
            record.net_amount,
          ),
      );
    },
  },
  {
    title: t('table.promotion.promotion_affect_bet'),
    dataIndex: 'valid_bet_amount',
    minWidth: 80,
    customRender: ({ record }) => {
      return topTooltip(record.valid_bet_amount);
    },
  },
  {
    title: t('table.risk.report_register_deviceno'),
    dataIndex: 'valid_member',
    minWidth: 80,
    customRender: ({ record }) => {
      let regDeviceList;
      if (record.detail !== undefined) {
        regDeviceList = JSON.parse(record.detail).lower_stats.reg_devices;
      }
      return h('div', null, [
        regDeviceList
          ? clientList.slice(0, 2).map((item) => {
              let text: any = [];
              // if (regDeviceList[item.value] !== undefined) {
              text = [
                h('label', null, `${item.label}：`), //任意金额
                h('span', null, `${regDeviceList[item.value] ?? '-'}`),
              ];
              // }
              return [h('div', null, text)];
            })
          : '-',
      ]);
    },
  },
  {
    title: t('table.promotion.promotion_tunnel_visitor_amount'),
    dataIndex: '',
    minWidth: 100,
    customRender: ({ record }) => {
      let uv = '';
      if (record.detail !== undefined) {
        uv = JSON.parse(record.detail).uv;
      } else {
        uv = '-';
      }
      return topTooltip(uv);
    },
  },
  {
    title: t('table.member.member_apply_number'),
    dataIndex: '',
    minWidth: 80,
    slots: { customRender: 'appliDetail' },
  },
  {
    title: t('table.member.member_apply_amount'),
    dataIndex: 'bonus_amount',
    width: 110,
    customRender: ({ record }) => {
      return topTooltip(record.bonus_amount, 'red');
    },
  },
  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'state',
    width: 110,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: agentcolorMap[record.state] } },
        agentreviewState[record.state] ? agentreviewState[record.state] : '-',
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
    ifShow: !isControlValueSet(),
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'review_name',
    width: 80,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
  },
];
useAutoTableLabelWidth(agentColumns);
/** 轮盘活动 */
export const turntColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.promotion.promotion_invite_number'),
    dataIndex: 'team_member_count',
    width: 120,
  },
  {
    title: t('table.promotion.promotion_affect_bet'),
    dataIndex: 'sum_valid_bet_amount',
    width: 120,
    customRender: ({ record }) => {
      return setTooltip(
        record,
        'sum_valid_bet_amount',
        t('table.report.report_subordinate_bet'),
        t('table.report.report_myself_bet'),
      );
    },
  },
  {
    title: t('table.report.report_deposit_amount'),
    dataIndex: 'sum_deposit_amount',
    width: 120,
    customRender: ({ record }) => {
      return setTooltip(
        record,
        'sum_deposit_amount',
        t('table.report.report_subordinate_amount'),
        t('table.report.report_myself_amount'),
      );
    },
  },
  {
    title: t('table.report.report_withdraw_amount'),
    dataIndex: 'sum_withdraw_amount',
    width: 120,
    customRender: ({ record }) => {
      return setTooltip(
        record,
        'sum_withdraw_amount',
        t('table.report.report_subordinate_withdraw'),
        t('table.report.report_myself_withdraw'),
      );
    },
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: '',
    minWidth: 120,
    customRender: ({ record }) => {
      return setTooltip(
        record,
        'sum_profit',
        t('table.report.report_subordinate_profit'),
        t('table.report.report_myself_profit'),
      );
    },
  },
  {
    title: t('table.report.report_cash_profit_rate'),
    dataIndex: '',
    minWidth: 120,
    customRender: ({ record }) => {
      return h(() =>
        h(
          'div',
          {
            style: {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              color: Number.parseFloat(record.propor) > 0 ? '#1CD91C' : '#E91134',
            },
          },
          record.profit_rate + '%',
        ),
      );
    },
  },
  {
    title: t('modalForm.risk.risk_bet_multiplier'),
    dataIndex: 'multiple',
    minWidth: 120,
  },
  {
    title: t('table.member.member_apply_amount'),
    dataIndex: 'bonus',
    width: 120,
    customRender: ({ record }) => {
      return topTooltip(record.bonus, 'red');
    },
  },
  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'review_at',
    width: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: colorMap[record.state] } },
        reviewState[record.state] ? reviewState[record.state] : '-',
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
    ifShow: !isControlValueSet(),
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'review_name',
    width: 120,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
  },
];
useAutoTableLabelWidth(turntColumns);
// 幸运赌注
export const Lucky_betSlot: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.report.sum'),
    dataIndex: 'valid_bet_amount',
    customRender: ({ record }) => {
      return record.valid_bet_amount;
    },
  },
  {
    title: t('v.discount.activity.Note_number'),
    dataIndex: 'lucky_number',
    width: 120,
    slots: { customRender: 'lucky_number' },
  },
  {
    title: t('v.discount.activity.Reward_multiple'),
    dataIndex: 'bonus_multiple',
  },
  {
    title: t('table.discountActivity.discountActivity_bet_amount'),
    dataIndex: 'bet_amount',
  },
  {
    title: t('v.discount.activity.amount_bonus'),
    dataIndex: 'apply_amount',
  },
  {
    title: t('v.discount.activity.awardUp'),
    dataIndex: 'bonus_limit',
    customRender: ({ record }) => {
      return parseInt(record.bonus_limit) == 0 ? t('common.translate.word53') : record.bonus_limit;
    },
  },
  {
    title: t('table.report.report_deposit_application_money'),
    dataIndex: 'bonus_amount',
  },
  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'state',
    width: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: rprofitcolorMap[record.state] } },
        rprofitState[record.state] ? rprofitState[record.state] : '-',
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
    ifShow: !isControlValueSet(),
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'review_name',
    width: 120,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
  },
];
useAutoTableLabelWidth(Lucky_betSlot);
export const bonusColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.report.report_deposit_amount'),
    dataIndex: 'deposit_amount',
    width: 120,
    customRender: ({ record }) => {
      return record.deposit_amount;
    },
  },
  {
    title: t('table.report.report_withdraw_amount'),
    dataIndex: 'withdraw_amount',
    width: 120,
    customRender: ({ record }) => {
      return record.withdraw_amount;
    },
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'cash_profit',
    width: 120,
  },
  {
    title: t('table.report.report_cash_profit_rate'),
    dataIndex: 'cash_profit_percent',
    width: 120,
    customRender: ({ record }) => {
      // return '0.00%'
      return record.cash_profit_percent + '%';
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    minWidth: 120,
  },
  {
    title: t('table.report.report_negative_profit_amount'),
    dataIndex: 'loss_amount',
    width: 120,
  },
  {
    title: t('v.discount.activity.bonus_back_rate'),
    dataIndex: 'gift_rate',
    width: 120,
    customRender: ({ record }) => {
      return `LV${record.level} - ${+record.gift_rate}%`;
    },
  },
  {
    title: t('v.discount.activity.bonus_back_amount'),
    dataIndex: 'bonus_amount',
    width: 120,
  },
  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'state',
    width: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: rprofitcolorMap[record.state] } },
        rprofitState[record.state] ? rprofitState[record.state] : '-',
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
    ifShow: !isControlValueSet(),
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'review_name',
    width: 120,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
  },
];
useAutoTableLabelWidth(bonusColumns);
const depositTypeObj = {
  1: t('v.discount.activity.first_deposit_amount'),
  2: t('v.discount.activity.total_deposit_amount'),
  3: t('v.discount.activity.Topup_text3'),
};
export const chargeColumnsState = {
  0: '-',
  1: t('business.common_pending_wait_Received'),
  2: t('modalForm.discountActivity.getGift'),
  3: t('table.discountActivity.discountActivity_not_qualified'),
  4: t('business.common_pending_approval'),
  5: t('business.common_reject'),
};
const rewardMethodsObj = {
  1: t('v.discount.activity.all_can_get'),
  2: t('v.discount.activity.only_can_get'),
};
export const everyColumnsState = {
  0: '-',
  1: t('business.common_pending_approval'),
  2: t('business.common_suceess'),
  3: t('business.common_reject'),
};
export const everyDayColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.report.report_total_valid_bet'),
    dataIndex: 'valid_bet_amount',
    width: 120,
  },
  {
    title: t('table.report.report_able_condition_money'),
    dataIndex: 'tier',
    minWidth: 120,
    customRender: ({ record }) => {
      return record.tier;
    },
  },
  {
    title: t('table.report.report_reward_methods'),
    dataIndex: 'method',
    minWidth: 120,
    customRender: ({ record }) => {
      return rewardMethodsObj[record.method];
    },
  },
  {
    title: t('table.report.report_deposit_application_money'),
    dataIndex: 'amount',
    minWidth: 120,
    customRender: ({ record }) => {
      // return '0.00%'
      return record.amount;
    },
  },
  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'state',
    width: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: colorMap[record.state] } },
        everyColumnsState[record.state] ? everyColumnsState[record.state] : '-',
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
    width: 120,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
    className: 'reviewList__empty__current__table__padding',
  },
];
useAutoTableLabelWidth(everyDayColumns);
export const inviteFriendsColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },

  {
    title: t('v.discount.activity.accumulated_deposits'),
    dataIndex: 'total_deposit',
    width: 120,
    slots: { customRender: 'accumulatedDeposits' },
  },

  {
    title: t('business.common_member_valid_outlay'),
    dataIndex: 'valid_bet',
    width: 120,
    slots: { customRender: 'validOutlay' },
  },
  {
    title: t('table.report.report_deposit_application_money'),
    dataIndex: 'claim_amount',
    width: 120,
    customRender: ({ record }) => {
      const renderTooltipRow = (
        leftText: string,
        leftValue: any,
        rightText: string,
        rightValue: any,
      ) => {
        return h(
          'div',
          { style: { display: 'flex', gap: '16px', marginBottom: '4px', whiteSpace: 'nowrap' } },
          [
            h('span', [
              h('span', { style: { color: 'rgb(245, 154, 35)' } }, `${leftText}：`),
              h('span', `${leftValue ?? '-'}`),
            ]),
            h('span', [
              h('span', { style: { color: 'rgb(245, 154, 35)' } }, `${rightText}：`),
              h('span', `${rightValue ?? '-'}`),
            ]),
          ],
        );
      };

      const content = record.claim_amount ? h('a', record.claim_amount) : h('span', '-');
      if (record.claim_amount) {
        return h(
          Tooltip,
          {
            title: h('div', [
              renderTooltipRow(
                t('v.discount.activity.accumulated_deposits'),
                record.total_deposit
                  ? `${record.total_deposit} ${currentyOptions[record.currency_id]}`
                  : '-',
                t('table.promotion.bonus'),
                record.total_deposit_amount ?? '-',
              ),
              renderTooltipRow(
                t('v.discount.activity.single_deposit'),
                record.single_deposit
                  ? `${record.single_deposit} ${currentyOptions[record.currency_id]}`
                  : '-',
                t('table.promotion.bonus'),
                record.single_deposit_amount ?? '-',
              ),
              renderTooltipRow(
                t('business.common_member_valid_outlay'),
                record.valid_bet
                  ? `${record.valid_bet} ${currentyOptions[record.currency_id]}`
                  : '-',
                t('table.promotion.bonus'),
                record.valid_bet_amount ?? '-',
              ),
            ]),
            overlayStyle: {
              minWidth: 'fit-content', // 让宽度至少适应内容
              maxWidth: 'none', // 取消最大宽度限制
            },
            autoAdjustOverflow: true, // 自动调整位置，避免超出屏幕
            placement: 'top',
          },
          content,
        );
      }
      return content;
    },
  },

  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'state',
    width: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: colorMap[record.state] } },
        everyColumnsState[record.state] ? everyColumnsState[record.state] : '-',
      );
    },
  },

  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'operator',
    width: 120,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
    className: 'reviewList__empty__current__table__padding',
  },
];
useAutoTableLabelWidth(inviteFriendsColumns);
export const iMemberThs16Columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },

  {
    title: t('v.discount.activity.accumulated_deposits'),
    dataIndex: 'cycle_deposit',
    width: 120,
    customRender: ({ record }) => {
      return record.cycle_deposit ?? '-';
    },
  },

  {
    title: t('v.discount.activity.promotion_cycle_deficit'),
    dataIndex: 'cycle_deficit',
    width: 120,
    customRender: ({ record }) => {
      return record.cycle_deficit ?? '-';
    },
  },
  {
    title: t('table.promotion.promotion_affect_bet'),
    dataIndex: 'cycle_valid_bet_amount',
    width: 120,
    customRender: ({ record }) => {
      let tooltipData = [];
      let tooltipText = JSON.parse(record?.plat_bet_amount || '{}');
      const renderTooltipRow = (tooltipText) => {
        for (const key in tooltipText) {
          tooltipData.push(
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '4px',
                  whiteSpace: 'nowrap',
                },
              },
              [
                h('span', [
                  h('span', { style: { color: '#e5bf81' } }, `${key}：`),
                  h('span', `${tooltipText[key] ?? '-'}`),
                ]),
              ],
            ),
          );
        }
        return tooltipData;
      };

      const content = record.cycle_valid_bet_amount
        ? h('a', record.cycle_valid_bet_amount)
        : h('span', '-');
      if (record.bonus_amount && !isEmpty(tooltipText)) {
        return h(
          Tooltip,
          {
            title: h('div', [renderTooltipRow(tooltipText)]),
            overlayStyle: {
              minWidth: 'fit-content', // 让宽度至少适应内容
              maxWidth: 'none', // 取消最大宽度限制
            },
            autoAdjustOverflow: true, // 自动调整位置，避免超出屏幕
            placement: 'top',
          },
          content,
        );
      }
      return content;
    },
  },
  {
    title: t('table.report.report_deposit_application_money'),
    dataIndex: 'bonus_amount',
    width: 120,
    customRender: ({ record }) => {
      const renderTooltipRow = (
        leftText: string,
        leftValue: any,
        rightText: string,
        rightValue: any,
        bonus_type: boolean,
      ) => {
        return h(
          'div',
          { style: { display: 'flex', gap: '16px', marginBottom: '4px', whiteSpace: 'nowrap' } },
          [
            h('span', [
              h('span', { style: { color: '#e5bf81' } }, `${leftText}：`),
              h('span', `${leftValue ?? '-'}`),
            ]),
            h(
              'span',
              {
                style: { display: bonus_type ? 'flex' : 'none' },
              },
              [
                h('span', { style: { color: '#e5bf81' } }, `${rightText}：`),
                h('span', `${rightValue ?? '-'}`),
              ],
            ),
          ],
        );
      };

      const content = record.bonus_amount ? h('a', record.bonus_amount) : h('span', '-');
      if (record.bonus_amount) {
        return h(
          Tooltip,
          {
            title: h('div', [
              renderTooltipRow(
                t('v.discount.activity.accumulated_deposits'),
                record.cycle_deposit
                  ? `${record.cycle_deposit} ${currentyOptions[record.currency_id]}`
                  : '-',
                t('table.promotion.bonus'),
                record.bonus_amount ?? '-',
                record.bonus_type === 'recharge',
              ),
              renderTooltipRow(
                t('v.discount.activity.promotion_cycle_deficit'),
                record.cycle_deficit
                  ? `${record.cycle_deficit} ${currentyOptions[record.currency_id]}`
                  : '-',
                t('table.promotion.bonus'),
                record.bonus_amount ?? '-',
                record.bonus_type === 'loss',
              ),
              renderTooltipRow(
                t('business.common_member_valid_outlay'),
                record.cycle_valid_bet_amount
                  ? `${record.cycle_valid_bet_amount} ${currentyOptions[record.currency_id]}`
                  : '-',
                t('table.promotion.bonus'),
                record.bonus_amount ?? '-',
                record.bonus_type === 'valid_bet',
              ),
            ]),
            overlayStyle: {
              minWidth: 'fit-content', // 让宽度至少适应内容
              maxWidth: 'none', // 取消最大宽度限制
            },
            autoAdjustOverflow: true, // 自动调整位置，避免超出屏幕
            placement: 'top',
          },
          content,
        );
      }
      return content;
    },
  },

  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'bonus_status',
    width: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: colorMap[record.bonus_status] } },
        reviewStateMap[record.bonus_status] ? reviewStateMap[record.bonus_status] : '-',
      );
    },
  },

  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
    width: 120,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
    className: 'reviewList__empty__current__table__padding',
  },
];
useAutoTableLabelWidth(iMemberThs16Columns);
export const accumulatedDepositsFirstColumn = [
  {
    title: t('v.discount.activity.accumulated_deposits'),
    dataIndex: 'total_deposit',
    width: '33.33%',
  },
  {
    title: t('table.promotion.cumulative_deposit_bonus'),
    dataIndex: 'total_deposit_bonus',
    width: '33.33%',
  },
  {
    title: t('table.promotion.single_deposit_total_bonus'),
    dataIndex: 'deposit_bonus',
    width: '33.33%',
  },
];
useAutoTableLabelWidth(accumulatedDepositsFirstColumn);
export const accumulatedDepositsSecondColumn = [
  {
    title: t('table.report.report_cnt'),
    dataIndex: 'number',
    width: '33.33%',
  },
  {
    title: t('table.finance.money'),
    dataIndex: 'deposit_amount',
    width: '33.33%',
  },
  {
    title: t('table.promotion.bonus'),
    dataIndex: 'bonus_amount',
    width: '33.33%',
  },
];
useAutoTableLabelWidth(accumulatedDepositsSecondColumn);
export const validBetFirstColumn = [
  {
    title: t('table.promotion.total_valid_outlay'),
    dataIndex: 'total_valid_bet_amount',
    width: '50%',
  },
  {
    title: t('table.promotion.total_bonus'),
    dataIndex: 'total_bonus_amount',
    width: '50%',
  },
];
useAutoTableLabelWidth(validBetFirstColumn);
export const validBetSecondColumn = [
  {
    title: t('table.system.system_game_platform'),
    dataIndex: 'game_platform',
    width: '33.33%',
  },
  {
    title: t('table.promotion.promotion_affect_bet'),
    dataIndex: 'valid_bet_amount',
    width: '33.33%',
  },
  {
    title: t('table.promotion.bonus'),
    dataIndex: 'bonus_amount',
    width: '33.33%',
  },
];
useAutoTableLabelWidth(validBetSecondColumn);
export const chargeColumns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'currency_id',
    minWidth: 80,
    // customRender: ({ record }) => {
    //   return currentyOptions[record.currency_id];
    // },
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.currency_id] }),
  },
  {
    title: t('table.report.report_deposit_charge_condition'),
    dataIndex: 'deposit_type',
    minWidth: 120,
    customRender: ({ record }) => {
      return depositTypeObj[record.deposit_type];
    },
  },
  {
    title: t('table.report.report_deposit_charge_money'),
    dataIndex: 'deposit_amount',
    minWidth: 120,
    customRender: ({ record }) => {
      return record.deposit_amount;
    },
  },
  {
    title: t('table.report.report_deposit_point_money'),
    dataIndex: 'term_amount',
    minWidth: 120,
  },
  {
    title: t('table.report.report_deposit_application_money'),
    dataIndex: 'bonus_amount',
    minWidth: 120,
    customRender: ({ record }) => {
      // return '0.00%'
      return record.bonus_amount;
    },
  },
  {
    title: t('table.report.report_deposit_contact_order'),
    dataIndex: 'valid_bet_amount',
    minWidth: 120,
    slots: { customRender: 'contactSlot' },
  },
  {
    title: t('member.inquiryMember.state'),
    dataIndex: 'state',
    width: 120,
    customRender: ({ record }) => {
      return h(
        'span',
        { style: { color: rprofitcolorMap[record.state] } },
        chargeColumnsState[record.state] ? chargeColumnsState[record.state] : '-',
      );
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 160,
    ifShow: !isControlValueSet(),
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'review_name',
    width: 120,
  },
  {
    title: `${t('table.risk.applicationOperationTime')}`,
    dataIndex: 'time',
    slots: { customRender: 'time' },
    className: 'reviewList__empty__current__table__padding',
  },
];
useAutoTableLabelWidth(chargeColumns);
export const schemas: FormSchema[] = [
  {
    field: '_reload',
    labelPrefix: t('search.finance.finance_refresh'),
    labelPrefixWidth: 45,
    component: 'Select',
    colProps: { xxl: 3, xl: 3, lg: 4, md: 4, sm: 4 },
    slot: 'reloadTime',
    componentProps: {
      dropdownMatchSelectWidth: false,
    },
  },
  {
    field: 'state',
    component: 'Select',
    labelPrefix: t('member.inquiryMember.state'),
    labelPrefixWidth: 45,
    defaultValue: 1,
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    componentProps: {
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: t('business.common_pending_approval'), value: 1 },
        { label: t('business.common_pending_approval_suceess'), value: 2 },
        { label: t('business.common_pending_approval_reject'), value: 3 },
      ],
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
