import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { SetTooltip } from '/@/views/common/component';
const { t } = useI18n();
// 待处理表格内容
export const processedColumns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 210,
  },
  {
    title: t('table.system.system_feedback_content'),
    dataIndex: 'description',
    width: 210,
    customRender: ({ record }) => {
      return SetTooltip(record.description, 20);
    },
  },
  {
    title: t('table.system.system_feedback_image'),
    dataIndex: 'feedbackImg',
    minWidth: 100,
    slots: { customRender: 'image-action' },
  },
  {
    title: t('table.system.system_feedback_time'),
    dataIndex: 'created_at',
    minWidth: 210,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.system.system_reply_record'),
    dataIndex: 'replys',
    minWidth: 210,
    slots: { customRender: 'replayRecord' },
  },
  {
    title: t('table.system.system_reply_time'),
    dataIndex: 'updatd_at',
    minWidth: 210,
    customRender: ({ record }) => {
      return toTimezone(record.updatd_at);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updatd_by',
    minWidth: 210,
    customRender: ({ record }) => {
      return record.updatd_by ? record.updatd_by : '-';
    },
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    fixed: false,
    minWidth: 210,
    slots: { customRender: 'action' },
  },
];

//已采纳表格内容
export const adoptedColumns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 210,
  },
  {
    title: t('table.system.system_feedback_content'),
    dataIndex: 'description',
    width: 210,
    customRender: ({ record }) => {
      return SetTooltip(record.description, 20);
    },
  },
  {
    title: t('table.system.system_feedback_image'),
    dataIndex: 'status',
    minWidth: 100,
    slots: { customRender: 'image-action' },
  },
  {
    title: t('table.system.system_feedback_time'),
    dataIndex: 'created_at',
    minWidth: 210,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.system.system_adoption_time'),
    dataIndex: 'updatd_at',
    minWidth: 210,
    customRender: ({ record }) => {
      return toTimezone(record.updatd_at);
    },
  },
  {
    title: t('table.system.system_adoption_bonus'),
    dataIndex: 'amount',
    minWidth: 185,
    slots: { customRender: 'amount' },
  },
  {
    title: t('table.system.system_collection_status'),
    dataIndex: 'bonusState',
    minWidth: 160,
    customRender: ({ record }) => {
      const text =
        record.bonusState === 1
          ? t('business.common_pending_wait_Received')
          : t('modalForm.discountActivity.getGift');
      const color = record.bonusState === 1 ? '' : '#1CD91C';
      return h('div', { style: { color: color } }, text);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updatd_by',
    minWidth: 130,
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'action',
    fixed: false,
    minWidth: 150,
    slots: { customRender: 'action' },
  },
];
//已忽略表格内容
export const ignoredColumns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 210,
  },
  {
    title: t('table.system.system_feedback_content'),
    dataIndex: 'description',
    width: 210,
    customRender: ({ record }) => {
      return SetTooltip(record.description, 15);
    },
  },
  {
    title: t('table.system.system_feedback_image'),
    dataIndex: 'username',
    minWidth: 100,
    slots: { customRender: 'image-action' },
  },
  {
    title: t('table.system.system_feedback_time'),
    dataIndex: 'created_at',
    minWidth: 280,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.system.system_ignored_time'),
    dataIndex: 'updatd_at',
    minWidth: 280,
    customRender: ({ record }) => {
      return toTimezone(record.updatd_at);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updatd_by',
    minWidth: 250,
  },
  {
    title: t('business.common_operate'),
    dataIndex: 'username',
    minWidth: 225,
    slots: { customRender: 'action' },
  },
];
// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    colProps: {
      style: {
        marginLeft: '10px',
      },
    },
    componentProps: ({ formActionType, formModel }) => {
      return {
        allowClear: false,
        format: 'YYYY-MM-DD',
        getPopupContainer: () => document.body,
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      };
    },
  },
  {
    field: 'username',
    labelPrefix: t('business.common_member_account'),
    component: 'Input',
    colProps: { xxl: 7, xl: 7, lg: 7, md: 7, sm: 7 },
    componentProps: {
      placeholder: t('common.inputText'),
    },
  },
];
