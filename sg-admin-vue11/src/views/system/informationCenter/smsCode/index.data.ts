import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { useSmsCodeOptions } from '/@/views/common/commonSetting';
import { width120 } from '/@/views/common/component';

const { t } = useI18n();

const { smsCodeOptions } = useSmsCodeOptions();

export const columns: BasicColumn[] = [
  {
    title: t('business.common_agent_account'),
    dataIndex: 'sport_name',
    minWidth: width120,
  },
  {
    title: t('business.common_phone_number'),
    dataIndex: 'event_id',
    minWidth: width120,
  },
  {
    title: t('common.picture5'),
    dataIndex: 'comp_name',
    minWidth: width120,
  },
  {
    title: t('common.picture6'),
    dataIndex: 'start_at',
    minWidth: width120,
    customRender: ({ record }) => {
      return record.start_at ? toTimezone(record.start_at, 'YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
  {
    title: t('table.system.system_fsnr'),
    dataIndex: 'home_name',
    minWidth: width120,
  },
  {
    title: t('table.system.system_message_send_time'),
    dataIndex: 'away_name',
    minWidth: width120,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    colProps: {
      style: {},
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
    field: 'state',
    labelPrefix: t('common.picture6'),
    defaultValue: 0,
    labelPrefixWidth: 60,
    component: 'Select',
    componentProps: {
      options: smsCodeOptions,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];
