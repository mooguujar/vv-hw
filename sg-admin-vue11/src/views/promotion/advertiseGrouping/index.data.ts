import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { Tooltip } from 'ant-design-vue';
import { toTimezone } from '/@/utils/dateUtil';
import { auths } from '/@/utils/authFunction';

const { t } = useI18n();
const setAccountTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
      overlayClassName: 'ad__table__tooltip',
    },
    () =>
      h(
        'div',
        {
          style: {
            width: '520px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        },
        text,
      ),
  );
};
const setNameTooltip = (text, color = '') => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: {
            width: '246px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
          class: color,
        },
        text,
      ),
  );
};

export const searchSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'newAdd',
    colProps: {
      style: { marginRight: '10px' },
    },
  },
  {
    field: 'modelName',
    component: 'Input',
    label: '',
    slot: 'modelNameSlot',
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.advertise.table_grouping_name'),
    dataIndex: 'name',
    minWidth: 160,
    customRender: ({ record }) => {
      return record.name.length > 17 ? setNameTooltip(record.name) : record.name;
    },
  },
  {
    title: t('table.advertise.table_contact_account'),
    dataIndex: 'account',
    minWidth: 160,
    customRender: ({ record }) => {
      return record.account.length > 70 ? setAccountTooltip(record.account) : record.account;
    },
  },
  {
    title: t('table.google.report_columns_APP_operate'),
    minWidth: 180,
    slots: { customRender: 'action' },
    dataIndex: 'page',
    ifShow: auths(['30412', '30413']),
  },
  {
    title: t('table.google.report_columns_APP_operator'),
    minWidth: 120,
    dataIndex: 'created_by',
  },
  {
    title: t('table.google.report_columns_APP_updated'),
    minWidth: 200,
    dataIndex: 'updated_at',
    customRender: ({ record }) => {
      return toTimezone(record?.updated_at);
    },
  },
];
