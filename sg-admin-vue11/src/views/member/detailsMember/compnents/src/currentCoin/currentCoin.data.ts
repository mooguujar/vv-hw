import { BasicColumn } from '/@/components/Table';
import { Tag, Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { protocolOptions } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { isControlValueSet, showControlValue } from '/@/utils/domUtils';

const { t } = useI18n();
const setTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
        },
        text,
      ),
  );
};
export const cnyColumns: BasicColumn[] = [
  {
    title: t('modalForm.system.system_username'),
    dataIndex: 'open_name',
  },
  {
    title: t('modalForm.system.payment_method'),
    dataIndex: 'type_name',
  },
  {
    title: t('modalForm.finance.finance_collection_way'),
    dataIndex: 'bank_name',
  },
  {
    title: t('table.member.member_open_bank'),
    dataIndex: 'address',
  },
  {
    title: t('table.member.member_recive_account'),
    width: 200,
    dataIndex: 'bank_account',
    customRender: ({ record }) => {
      return isControlValueSet() ? showControlValue() : setTooltip(record.bank_account);
    },
  },
  {
    title: t('table.member.member_defalut'),
    dataIndex: 'is_default',
    customRender: ({ record }) => {
      const text = record.is_default === 1 ? t('business.common_yes') : t('business.common_no');
      const color = record.is_default === 1 ? 'green' : 'bloack';
      return h('span', { style: { color: color } }, text);
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? '#E91134' : '#1CD91C';
      const text = enable ? t('business.common_deactivate') : t('business.common_on_activate');
      return h('span', { style: { color: color } }, text);
    },
  },
];
export const brlColumns: BasicColumn[] = [
  {
    title: t('modalForm.system.system_username'),
    dataIndex: 'open_name',
  },
  {
    title: t('modalForm.system.payment_method'),
    dataIndex: 'type_name',
  },
  {
    title: t('modalForm.finance.finance_collection_way'),
    dataIndex: 'bank_name',
  },
  {
    title: t('table.member.member_recive_account'),
    width: 200,
    customRender: ({ record }) => {
      return isControlValueSet() ? showControlValue() : setTooltip(record.bank_account);
    },
    dataIndex: 'bank_account',
  },
  {
    title: 'CPF',
    dataIndex: 'bank_area_cpf',
  },
  {
    title: t('table.member.member_defalut'),
    dataIndex: 'is_default',
    customRender: ({ record }) => {
      return record.is_default === 1 ? t('business.common_yes') : t('business.common_no');
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? '#E91134' : '#1CD91C';
      const text = enable ? t('business.common_deactivate') : t('business.common_on_activate');
      return h(Tag, { color: color }, () => text);
    },
  },
];
export const usdtColumns: BasicColumn[] = [
  {
    title: t('modalForm.finance.finance_contract_type'),
    dataIndex: 'contract_type',
    minWidth: 200,
    customRender: ({ record }) => {
      return protocolOptions[record.contract_type];
    },
  },
  {
    title: t('table.member.member_wallet_adress'),
    dataIndex: 'address',
    minWidth: 200,
  },
  {
    title: t('table.member.member_defalut'),
    dataIndex: 'is_default',
    minWidth: 150,
    customRender: ({ record }) => {
      const { is_default } = record;
      let color = '';
      let text = '';
      switch (is_default) {
        case 1:
          color = 'text-green';
          text = t('business.common_yes');
          break;
        case 2:
          text = t('business.common_no');
          break;
      }
      return h('div', { class: color }, text);
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 150,
    customRender: ({ record }) => {
      const state = record.state;
      const enable = state === 2;
      const color = enable ? '#E91134' : '#1CD91C';
      const text = enable ? t('business.common_deactivate') : t('business.common_on_activate');
      return h(Tag, { color: color }, () => text);
    },
  },
];
