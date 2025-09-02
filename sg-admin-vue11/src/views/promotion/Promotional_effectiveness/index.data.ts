import { FormSchema, BasicColumn } from '/@/components/Table';
import { h, ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import eventBus from '@/utils/eventBus';
import { isControlValueSet } from '@/utils/domUtils';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const beforeTimeChange = ref('');
const isOpen = ref(false);

export const searchSchema: FormSchema[] = [
  {
    field: 'a1',
    component: 'Input',
    label: '',
    slot: 'choosenMonthWeek',
    ifShow: !isControlValueSet(),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: ({ formActionType }) => {
      return {
        allowClear: false,
        format: 'YYYY-MM-DD',
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        getPopupContainer: () => document.body,
        onFocus: () => {
          if (!isOpen.value) {
            const currentTime = formActionType.getFieldsValue().time || [];
            beforeTimeChange.value = JSON.stringify(currentTime);
            isOpen.value = true;
          }
        },
        onOpenChange: (state) => {
          if (!state) {
            const afterTimeChange = formActionType.getFieldsValue().time || [];
            const isChange = beforeTimeChange.value != JSON.stringify(afterTimeChange);
            isOpen.value = false;
            eventBus.emit('onTimeChange', isChange);
          }
        },
        onChange: (v) => {
          if (v?.length) {
            eventBus.emit('hasTime', v);
          }
        },
      };
    },
  },
  {
    field: 'a2',
    component: 'Input',
    labelPrefix: t('common.promoter'),
    slot: 'promotionSlot',
  },
  {
    field: 'a3',
    component: 'Input',
    labelPrefix: t('common.channel'),
    slot: 'channelSlot',
  },
  {
    field: 'a4',
    component: 'Input',
    slot: 'submitSlot',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.race_price.table_register_person'), //注册人数
    dataIndex: 'register_count',
    align: 'center',
  },
  {
    title: t('table.report.report_first_deposit_amount'), //首存金额
    dataIndex: 'first_deposit_amount',
    align: 'center',
    moreWidth: 30,
    slots: { title: 'title_first_deposit_amount' }, //首存金额
    customRender: ({ record }) => {
      return (
        (record.first_deposit_amount || '0') +
        `/${record.first_deposit_count || '0'}${t('component.unit.people')}`
      );
    },
  },
  {
    title: t('table.report.report_valid_bet_amount'), //有效投注
    dataIndex: 'valid_bet_amount',
    moreWidth: 30,
    slots: { title: 'title_valid_bet_amount', customRender: 'valid_bet_amount' }, //有效投注
    align: 'center',
  },
  {
    title: t('business.common_member_platform_iswin'), //平台输赢
    dataIndex: 'net_amount',
    moreWidth: 30,
    slots: { title: 'title_net_amount', customRender: 'net_amount' }, //平台输赢
    align: 'center',
  },
  {
    title: t('table.finance.finance_Discounted_price'), //优惠金额
    dataIndex: 'gift_amount',
    moreWidth: 30,
    slots: { title: 'title_gift_amount' }, // 优惠金额
    align: 'center',
    customRender: ({ record }) => {
      return (
        (record.gift_amount || '0') + `/${record.gift_count || '0'}${t('component.unit.people')}`
      );
    },
  },
  {
    title: t('table.promotion.promotion_take_amount'), //充值金额
    dataIndex: 'deposit_amount',
    moreWidth: 30,
    slots: { title: 'title_deposit_amount' }, // 充值金额
    align: 'center',
    customRender: ({ record }) => {
      return (
        (record.deposit_amount || '0') +
        `/${record.deposit_count || '0'}${t('component.unit.people')}`
      );
    },
  },
  {
    title: t('table.race_price.table_cash_profit'), //提款金额
    dataIndex: 'withdraw_amount',
    moreWidth: 30,
    slots: { title: 'title_withdraw_amount' }, // 提款金额
    align: 'center',
    customRender: ({ record }) => {
      return (
        (record.withdraw_amount || '0') +
        `/${record.withdraw_count || '0'}${t('component.unit.people')}`
      );
    },
  },
  {
    title: t('table.race_price.table_cash_profit'), //现金利润
    dataIndex: 'cash_profit',
    slots: { title: 'title_updated_name' }, // 现金利润
    align: 'center',
    moreWidth: 30,
    customRender: ({ record }) => {
      const color =
        Number(record.cash_profit) > 0
          ? '#E91134'
          : Number(record.cash_profit) < 0
          ? '#1CD91C'
          : '';
      return h('span', { style: { color } }, record.cash_profit || '0');
    },
  },
  {
    title: t('table.report.report_bet_multiplier'), // 打码倍数
    dataIndex: 'bet_multiple',
    align: 'center',
    customRender: ({ record }) => {
      return record.bet_multiple || '0';
    },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonList = [
  { label: t('table.member.member_today_day'), value: 'days' },
  { label: t('modalForm.common.yesterday'), value: 'yesterday' },
  { label: t('table.member.member_week'), value: 'isoWeek' },
  { label: t('table.member.member_month'), value: 'month' },
];
