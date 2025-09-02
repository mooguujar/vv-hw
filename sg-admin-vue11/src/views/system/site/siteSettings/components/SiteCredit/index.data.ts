import { BasicColumn } from '@/components/Table';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

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

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_table_header_affiliated_group'), //所属集团
    dataIndex: 'company_name',
    width: 140,
    customRender: ({ record }) => {
      return setTooltip(record.company_name);
    },
  },
  {
    title: t('table.system.system_table_header_site_name'), //站点名称
    dataIndex: 'name',
    minWidth: 140,
    customRender: ({ record }) => {
      return setTooltip(record.name);
    },
  },
  {
    title: t('business.common_site_number'), //站点编号
    dataIndex: 'code',
    minWidth: 140,
    customRender: ({ record }) => {
      return setTooltip(record.code);
    },
  },
  {
    title: t('table.system.system_table_header_site_quota'), //站点模板
    dataIndex: 'available_balance',
    minWidth: 140,
    customCell: () => ({
      class: 'text-red',
    }),
  },
  {
    title: t('table.system.system_table_header_site_balance'), //站点余额(U)
    dataIndex: 'quota_limit',
    minWidth: 140,
    customCell: () => ({
      class: 'text-red',
    }),
    customRender: ({ record }) => {
      return record?.site_balance?.USDT || '-';
    },
  },
  {
    title: t('table.system.system_table_header_site_deposit'), //站点押金
    dataIndex: 'bond',
    minWidth: 140,
  },
  {
    title: t('table.system.system_table_header_maximum_overdraft'), //最大透支额(U)
    dataIndex: 'overdraft',
    minWidth: 140,
  },
  {
    title: t('table.system.system_table_header_outstanding_statement'), //未结算账单(U)
    dataIndex: 'unsettled_bill',
    minWidth: 140,
  },
  {
    title: t('table.system.system_table_header_overdraft_ratio'), //透支比例
    dataIndex: 'overdraft_ratio',
    minWidth: 140,
  },
  {
    title: t('table.system.system_table_header_site_status'), //站点状态
    dataIndex: 'state',
    minWidth: 140,
    slots: { customRender: 'state' },
  },
];
useAutoTableLabelWidth(columns);
