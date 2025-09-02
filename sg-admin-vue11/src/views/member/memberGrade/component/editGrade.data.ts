import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { getkeyValues } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_member_account'),
    dataIndex: 'username',
  },
  {
    title: t('business.common_super_agent'),
    dataIndex: 'parent_name',
    customRender: ({ record }) => {
      return record.parent_name ? record.parent_name : '-';
    },
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level_id',
    customRender: ({ record }) => {
      return getkeyValues(record.level_id);
    },
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.report.report_deposit_amount'),
    dataIndex: 'deposit_amount',
    slots: { customRender: 'Deposit' },
  },
  {
    title: t('table.report.report_withdraw_amount'),
    dataIndex: 'withdraw_amount',
    slots: { customRender: 'Withdraw' },
  },
  {
    title: t('table.report.report_cash_profit'),
    dataIndex: 'cash_profit',
    slots: { customRender: 'Cash' },
  },
  {
    title: t('table.member.member_locked_'),
    dataIndex: 'level_lock_state',
    customRender: ({ record }) => {
      return record.level_lock_state === '1'
        ? h('span', { style: { color: 'red' } }, t('table.member.member_locked_'))
        : h('span', null, t('table.member.member_locked_no'));
    },
  },
  {
    title: t('table.member.member_registe_time'),
    dataIndex: 'agecyType',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];

useAutoTableLabelWidth(columns);
