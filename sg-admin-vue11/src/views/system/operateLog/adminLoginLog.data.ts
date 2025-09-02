import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { getAdminOperationModel } from '/@/api/sys';
import { ref, h } from 'vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const eventList = ref([] as any);

export const adminData: BasicColumn[] = [
  {
    title: t('table.system.system_module'),
    dataIndex: 'module',
    minWidth: 150,
    customRender: ({ record }) => {
      return record.module_show ? record.module_show : '-';
    },
  },
  {
    title: t('table.member.member_oprate_event'),
    dataIndex: 'event_show',
    minWidth: 250,
    customRender: ({ record }) => {
      return record.event_show ? record.event_show : '-';
    },
  },
  {
    title: t('table.member.member_operate_log'),
    dataIndex: 'content',
    minWidth: 200,
    slots: { customRender: 'content' },
  },
  {
    title: t('table.member.member_oprate_people'),
    dataIndex: 'created_name',
    // width: 100,
  },
  {
    title: t('table.discountActivity.discountActivity_member'),
    dataIndex: 'username',
  },
  {
    title: t('IP'),
    dataIndex: 'ip',
    // width: 120,
    customRender: ({ record }) => {
      return record.ip ? record.ip : '-';
    },
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'created_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];
useAutoTableLabelWidth(adminData);
export const loginForm: FormSchema[] = [
  {
    field: 'data',
    component: 'Input',
    label: '', //会员账号
    slot: 'grupButton',
    //colProps: { style: { width: '190px' } },
  },

  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      allowClear: false,
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },

  {
    field: 'module',
    component: 'ApiSelect',
    labelPrefix: t('table.system.system_module'),
    labelPrefixWidth: '45',
    colProps: { xxl: 3, xl: 4, lg: 6 },
    defaultValue: '',
    componentProps: ({ formActionType }) => {
      return {
        api: async () => {
          const { data, status } = await getAdminOperationModel();
          const moduleList = [{ key: t('common.All'), value: '' }, ...data.module];
          eventList.value = [{ key: t('common.All'), value: '' }];
          return moduleList;
        },
        onChange: async (value) => {
          if (value) {
            const { data } = await getAdminOperationModel({ id: value });
            eventList.value = [{ key: t('common.All'), value: '' }, ...data.event];
            formActionType.setFieldsValue({ event_id: '' });
          } else {
            eventList.value = [{ key: t('common.All'), value: '' }];
            formActionType.setFieldsValue({ event_id: '' });
          }
        },
        labelField: 'key',
        valueField: 'value',
        allowClear: false,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'event_id',
    component: 'Select',
    labelPrefix: t('table.system.system_event'),
    defaultValue: '',
    componentProps: () => {
      return {
        options: eventList.value.map((item) => {
          return {
            label: item.key,
            value: item.value,
          };
        }),
        // 作用是防止样式挤压
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'searchType',
    component: 'Input',
    label: '',
    colProps: { xxl: 5, xl: 5, lg: 6 },
    slot: 'usernameSlot',
  },
];
export const dateGroupButtonList = [
  { label: t('business.common_today'), value: 'days' },
  { label: t('business.common_week'), value: 'week' },
  { label: t('business.common_month'), value: 'month' },
];
