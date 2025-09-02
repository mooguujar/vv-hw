import { FormSchema, BasicColumn } from '/@/components/Table';
import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import eventBus from '/@/utils/eventBus';
import { auths } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const beforeTimeChange = ref('');
const isOpen = ref(false);

export const searchSchema: FormSchema[] = [
  {
    field: 'new',
    component: 'Input',
    label: '',
    slot: 'newAdd',
    colProps: {
      style: { marginRight: '10px' },
    },
  },
  {
    field: 'date',
    component: 'Input',
    label: '',
    slot: 'dateGroup',
    colProps: {
      style: { marginRight: '10px' },
    },
  },

  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: ({ formActionType }) => {
      return {
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
            const isChange =
              beforeTimeChange.value == JSON.stringify(afterTimeChange) ? false : true;
            isOpen.value = false;
            eventBus.emit('onTimeChange', isChange);
          }
        },
        onChange: (v) => {
          if (!v) {
            eventBus.emit('onTimeChange', true);
          }
        },
      };
    },
  },
  {
    field: 'modelName',
    component: 'Input',
    label: '',
    slot: 'modelNameSlot',
  },
  {
    field: 'sub',
    component: 'Input',
    slot: 'submitSlot',
  },
  {
    field: 'ty',
    component: 'Input',
    colSlot: 'typeColSlot',
    colProps: {
      span: 24,
      style: { marginBottom: '12px', overflowX: 'auto', overflowY: 'hidden', height: '54px' },
    },
    ifShow: ({ model, field }) => (model[field] == 1 ? true : false),
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.race_price.table_date'),
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
    minWidth: 180,
    fixed: true,
    className: 'roi__first__table',
  },

  {
    title: t('table.race_price.table_grouping_name'),
    dataIndex: 'g_name',
    minWidth: 120,
    fixed: true,
    className: 'roi__second__table',
  },
  {
    title: t('table.race_price.table_agent_account'), //代理帐号
    dataIndex: 'username',
    minWidth: 120,
    fixed: true,
    className: 'roi__fourth__table',
  },
  {
    title: t('table.race_price.table_prepayment_u'),
    dataIndex: 'prepay',
    minWidth: 120,
    slots: { customRender: 'prepaymentSlot' },
  },
  {
    title: t('table.race_price.table_expend_u'),
    dataIndex: 'consume',
    minWidth: 120,
    slots: { customRender: 'expendSlot' },
  },
  {
    title: t('table.race_price.table_service_fee'),
    dataIndex: 'fee',
    minWidth: 120,
    slots: { customRender: 'serviceSlot' },
  },
  {
    title: t('table.race_price.table_balance_fee'),
    minWidth: 140,
    dataIndex: 'balance',
  },
  {
    dataIndex: 'blr',
    minWidth: 140,
  },
  {
    title: t('table.race_price.table_action'), //操作
    dataIndex: '1',
    slots: { customRender: 'action' },
    minWidth: 80,
    ifShow: auths(['30422']),
  },
  {
    title: t('table.race_price.table_action_operator'),
    dataIndex: 'created_by',
    minWidth: 120,
  },
  {
    title: t('table.system.system_update_time'),
    dataIndex: 'updated_at',
    minWidth: 180,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
  {
    title: t('table.race_price.table_register_person'),
    minWidth: 120,
    dataIndex: 'reg_cnt',
  },
  {
    title: t('table.race_price.table_first_deposit_person'),
    minWidth: 120,
    dataIndex: 'first_deposit_cnt',
  },
  {
    title: t('table.race_price.table_first_deposit_count'),
    minWidth: 120,
    dataIndex: 'first_deposit_amt',
  },
  {
    title: t('table.race_price.table_first_deposit_rate'),
    dataIndex: 'first_deposit_rate',
    minWidth: 180,
    customRender: ({ record }) => {
      return `${record.first_deposit_rate}%`;
    },
  },
  {
    title: t('table.race_price.table_per_capita'),
    minWidth: 140,
    dataIndex: 'first_deposit_agv',
  },
  {
    title: t('table.race_price.table_total_deposit'),
    minWidth: 140,
    dataIndex: 'deposit_amt',
  },
  {
    title: t('table.race_price.table_total_persons'),
    minWidth: 140,
    dataIndex: 'deposit_cnt',
  },
  {
    title: t('table.race_price.table_per_capita_deposit'),
    minWidth: 140,
    dataIndex: 'deposit_amt_agv',
  },
  {
    title: t('table.race_price.table_total_withdraw'),
    minWidth: 140,
    dataIndex: 'withdraw_amt',
  },
  {
    title: t('table.race_price.table_total_withdraw_persons'),
    minWidth: 140,
    dataIndex: 'withdraw_cmt',
  },
  {
    title: t('table.race_price.table_per_capita_withdraw'),
    minWidth: 140,
    dataIndex: 'withdraw_amt_agv',
  },
  {
    title: t('table.race_price.table_withdraw_rate'),
    minWidth: 140,
    dataIndex: 'withdraw_amt_rate',
    customRender: ({ record }) => {
      return `${record.withdraw_amt_rate}%`;
    },
  },
  {
    title: t('table.race_price.table_valid_bet'),
    minWidth: 140,
    dataIndex: 'valid_bet_amt',
  },
  {
    title: t('table.race_price.table_bet_multiple'),
    minWidth: 120,
    dataIndex: 'multiple',
  },
  {
    title: t('table.race_price.table_cash_profit'),
    minWidth: 120,
    dataIndex: 'cash_amt',
  },
  {
    title: t('table.race_price.table_register_cost'),
    minWidth: 120,
    dataIndex: 'reg_cost',
  },
  {
    title: t('table.race_price.table_recharge_cost'),
    minWidth: 120,
    dataIndex: 'deposit_cost',
  },
  {
    title: t('table.race_price.table_recharge_cost_second'),
    minWidth: 120,
    dataIndex: 're_deposit_cost',
    customRender: ({ record }) => {
      return `${record.re_deposit_cost}%`;
    },
  },
  {
    title: t('table.race_price.table_recycle_rate'),
    minWidth: 120,
    dataIndex: 'rec_rate',
    customRender: ({ record }) => {
      return `${record.rec_rate}%`;
    },
  },
  {
    title: t('business.common_remark'),
    minWidth: 120,
    maxWidth: 150,
    dataIndex: 'remark',
    ellipsis: true,
    slots: { customRender: 'remarkSlot' },
  },
];
useAutoTableLabelWidth(columns);
export const dateGroupButtonListAll = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('modalForm.common.yesterday'), value: 'yesterday' },
  { label: t('modalForm.common.current_week'), value: 'week' },
  { label: t('modalForm.common.current_month'), value: 'month' },
];
