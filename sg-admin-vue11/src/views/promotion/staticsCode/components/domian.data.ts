import { FormSchema, BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { isControlValueSet } from '/@/utils/domUtils';

const { t } = useI18n();

export const searchSchema: FormSchema[] = [
  {
    field: 'modelName',
    component: 'Input',
    label: '',
    slot: 'modelNameSlot',
  },
  {
    field: '',
    component: 'Input',
    slot: 'submitSlot',
  },
];
export const columns: BasicColumn[] = [
  {
    title: t('common.domain'),
    dataIndex: 'name',
    minWidth: 120,
  },
  {
    title: t('table.google.report_columns_APP_operate'),
    minWidth: 120,
    slots: { customRender: 'action' },
    dataIndex: '',
    ifShow: !isControlValueSet(),
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
    minWidth: 100,
  },
  {
    title: t('business.common_update_time'),
    minWidth: 200,
    dataIndex: 'updated_at',
    customRender: ({ record }) => {
      if (record.updated_at) return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
      else return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
