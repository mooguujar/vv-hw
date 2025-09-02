import { BasicColumn, FormSchema } from '/@/components/Table';
//import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { auths, isHasAuth } from '/@/utils/authFunction';

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
export const schemas: FormSchema[] = [
  {
    field: 'start_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_start'), //开始时间
    labelPrefixWidth: 75,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    slot: 'startDate',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'end_time',
    component: 'DatePicker',
    labelPrefix: t('business.common_period_end'), //结束时间
    labelPrefixWidth: 75,
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    slot: 'endDate',
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 5 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.promotion.promotion_bind_time'), //绑定时间
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.promotion.promotion_corresponding'), //对应的绑定链接
    dataIndex: 'url',
    minWidth: 160,
    editRow: true,
    customRender: ({ record }) => {
      return setTooltip(record.url);
    },
  },
  {
    title: 'Kwai Pixel ID',
    dataIndex: 'track_id',
    minWidth: 160,
    editRow: true,
    ifShow: true,
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'operator_name',
    minWidth: 200,
  },
  {
    title: t('table.risk.report_operating_time'), //操作时间
    dataIndex: 'updated_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'action',
    minWidth: 200,
    slots: { customRender: 'action', style: { textAlign: 'center' } },
    ifShow: auths(['30103', '30104']),
  },
];
