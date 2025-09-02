import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import { toTimezone } from '/@/utils/dateUtil';
import { useLocalList } from '/@/settings/localeSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { SetTooltip } from '/@/views/common/component';
const localeList = useLocalList();
const { t } = useI18n();
// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_application_language'), //应用语言
    dataIndex: 'langrage',
    minWidth: 220,
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
    dataIndex: 'to_user',
    minWidth: 150,
  },
  {
    title: t('table.system.system_Letter_status'), //信件状态
    dataIndex: 'state',
    minWidth: 150,
    customRender: ({ record }) => {
      const state = record.state;
      const color = state == 2 ? '#02A7F0' : '#aaaaaa';
      const type = state == 2 ? 'fluent:mail-24-filled' : 'fluent:mail-read-16-filled';
      const text = '';
      return h(Icon, { color: color, icon: type }, () => text);
    },
  },
  {
    title: t('table.system.system_message_title'), //信息标题
    dataIndex: 'title',
    width: 250,
    customRender: ({ record }) => {
      return SetTooltip(record.title['default'], 20);
    },
  },
  {
    title: t('table.system.system_message_content'), //信息内容
    dataIndex: 'accountTypeName',
    minWidth: 230,
    slots: { customRender: 'letterInfo' },
  },
  {
    title: t('table.system.system_Receiving_time'), //收件时间
    dataIndex: 'sentTime',
    minWidth: 190,
    customRender: ({ record }) => {
      return toTimezone(record.sentTime);
    },
  },
  {
    title: t('table.system.system_query_time'), //查询时间
    dataIndex: 'read_at',
    minWidth: 190,
    customRender: ({ record }) => {
      return record.read_at ? toTimezone(record.read_at) : '-';
    },
  },
  {
    title: t('business.common_operate'), //操作
    dataIndex: 'status',
    minWidth: 150,
    slots: { customRender: 'action' },
  },
];

// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'state',
    labelPrefix: t('business.common_status'), //状态
    labelPrefixWidth: 45,
    component: 'Select',
    defaultValue: '',
    componentProps: {
      options: [
        { label: t('business.common_all'), value: '' }, //全
        { label: t('table.system.system_have_read'), value: 1 }, //已读
        // { label: t('table.system.system_unread'), value: 2 }, //未读
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  },
  {
    field: 'to_user',
    labelPrefix: t('table.system.system_receiver'), //收件人
    labelPrefixWidth: 75,
    component: 'Input',
    colProps: { xl: 5, lg: 5, md: 5, sm: 7 },
    componentProps: {
      placeholder: t('common.inputText'), //请输入
    },
  },
];
