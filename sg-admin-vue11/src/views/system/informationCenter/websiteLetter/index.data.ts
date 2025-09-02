import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { useLocalList } from '/@/settings/localeSetting';
import { useMemberOptions } from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { SetTooltip } from '/@/views/common/component';
import dayjs from 'dayjs';

const { memberOptions } = useMemberOptions();
const localeList = useLocalList();
const { t } = useI18n();
// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_application_language'), //应用语言
    dataIndex: 'langrage',
    minWidth: 200,
    customRender: ({ record }) => {
      if (!record.msg) return '-';
      const content = JSON.parse(record.msg);
      const lang: Array<string> = [];
      localeList.forEach((item) => {
        if (content[item.event]) {
          lang.push(item.text);
        }
      });
      return lang.join(',');
    },
  },
  {
    title: t('table.system.system_sender'), //发件人
    dataIndex: 'created_name',
    minWidth: 140,
  },
  {
    title: t('table.system.system_recipient'), //收件对象
    dataIndex: 'flags',
    minWidth: 150,
    customRender: ({ record }) => {
      const d = memberOptions.find((item) => item.value == record.crowd);
      return d?.label;
    },
  },
  {
    title: t('table.system.system_has_read_or_not'), //已读/未读
    dataIndex: 'read_count',
    minWidth: 150,
    slots: { customRender: 'image-action' },
  },
  {
    title: t('table.system.system_message_title'), //信息标题
    dataIndex: 'title',
    width: 250,
    customRender: ({ record }) => {
      try {
        record.title = JSON.parse(record.title);
      } catch (e) {}
      return SetTooltip(
        record.title['default'] ||
          record.title['zh_CN'] ||
          record.title['en_US'] ||
          record.title['th_TH'] ||
          record.title['pt_BR'] ||
          record.title['hi_IN'] ||
          record.title['vi_VN'] ||
          '',
        20,
      );
    },
  },
  {
    title: t('table.system.system_message_content'), //信息内容
    dataIndex: 'msg',
    minWidth: 230,
    slots: { customRender: 'centent' },
  },
  {
    title: t('table.system.system_message_send_time'), //发送时间
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
];

// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'sendletter',
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
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
    field: 'from_user',
    labelPrefix: t('table.system.system_sender'), //发件人
    labelPrefixWidth: 60,
    component: 'Input',
    colProps: { xl: 5, lg: 5, md: 5, sm: 7 },
    componentProps: {
      placeholder: t('common.inputText'), //请输入
    },
  },
];
