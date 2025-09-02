import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { SetTooltip } from '/@/views/common/component';
import { auths } from '/@/utils/authFunction';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: 'created',
    label: '',
    component: 'Input',
    slot: 'created',
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.country_region'), //IP地址
    dataIndex: 'country_name',
    minWidth: 150,
  },
  {
    title: t('table.system.remark'),
    dataIndex: 'remark',
    width: 300,
    customRender: ({ record }) => {
      return record.remark ? SetTooltip(record.remark, 15) : '-';
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'action',
    minWidth: 150,
    slots: { customRender: 'action', style: { textAlign: 'center' } },
    ifShow: auths(['70262', '70265']),
  },
  {
    title: t('table.system.operater'),
    dataIndex: 'operate_name',
  },
  {
    title: t('table.system.system_update_time'),
    dataIndex: 'operate_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.operate_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
];
