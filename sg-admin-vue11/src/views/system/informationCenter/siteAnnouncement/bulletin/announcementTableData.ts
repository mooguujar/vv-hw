import { BasicColumn, FormSchema } from '/@/components/Table';
import { Switch, Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import { updateSiteNoticetState } from '/@/api/sys';
import Icon from '/@/components/Icon';
import { Client, useMemberOptions } from '/@/views/common/commonSetting';
import dayjs from 'dayjs';
import { usePositionOptions, useFrequencyOptions } from '../../common/const';
import { useLocalList } from '/@/settings/localeSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { useLocale } from '/@/locales/useLocale';
import { isHasAuth } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { toTimezone } from '/@/utils/dateUtil';
import { isControlValueSet } from '/@/utils/domUtils';

const { memberOptions } = useMemberOptions();
const { positionOptions } = usePositionOptions();
const { frequencyOptions } = useFrequencyOptions();
const localeList = useLocalList();
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
// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: 45,
    component: 'Select',
    defaultValue: '',
    componentProps: {
      options: [
        { label: t('common.All'), value: '' },
        { label: t('v.discount.activity.show_amount_2'), value: '1' },
        { label: t('business.common_hidden'), value: '0' },
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'searchBy',
    labelPrefix: '',
    labelPrefixWidth: 20,
    component: 'Select',
    defaultValue: 'title',
    componentProps: {
      options: [
        { label: t('business.common_title'), value: 'title' },
        { label: t('business.common_operate_people'), value: 'updated_by' },
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 2, xl: 2, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'searchVal',
    labelPrefix: '',
    component: 'Input',
    colProps: { xxl: 3, xl: 3, lg: 3, md: 3, sm: 6 },
    componentProps: {
      placeholder: t('common.inputText'),
    },
  },
];

// 弹窗公告列表
export const columns: BasicColumn[] = [
  {
    title: t('business.common_sort'), //排序
    dataIndex: 'id',
    width: 78,
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
    ifShow: isHasAuth('70518'),
  },
  {
    title: t('table.system.system_announcement_title'), //公告标题
    dataIndex: 'title',
    minWidth: 130,
    customRender: ({ record }) => {
      const lang = useLocale().getLocale.value;
      const content = record.title ? JSON.parse(record.title) : '';
      return content[lang];
      // return h(
      //   Tooltip,
      //   {
      //     title: content[lang] || '',
      //   },
      //   () =>
      //     h(
      //       'div',
      //       {
      //         style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
      //       },
      //       content[lang] || '',
      //     ),
      // );
    },
  },
  {
    title: t('table.system.system_bounce_position'), //弹跳位置
    dataIndex: 'bounce_location',
    minWidth: 130,
    customRender: ({ record }) => {
      const d = positionOptions.find((item) => item.value === record.bounce_location);
      return d?.label;
    },
  },
  {
    title: t('table.system.system_bounce_frequency'), //弹跳频率
    dataIndex: 'bounce_frequency',
    //width: 80,
    minWidth: 130,
    customRender: ({ record }) => {
      if (record.bounce_frequency === 1) {
        const d = frequencyOptions.find((item) => item.value === record.bounce_frequency);
        return d?.label;
      }
      if (record.bounce_frequency === 2) {
        return record.bounce_frequency_limit
          ? t('table.system.x_times_a_day', [record.bounce_frequency_limit])
          : '-';
      }
    },
  },
  {
    title: t('table.report.report_client'), //客户端
    dataIndex: 'client',
    minWidth: 250,
    customRender: ({ record }) => {
      record.client = typeof record.client === 'string' ? record.client.split(',') : record.client;
      const text = record.client
        .map((id) => {
          return Client[Number(id)];
        })
        .join(',');
      // return text;
      return text;
    },
  },
  {
    title: t('table.system.system_application_language'), //应用语言
    dataIndex: 'langrage',
    minWidth: 190,
    customRender: ({ record }) => {
      if (!record.content) return '-';
      const content = record.content.default
        ? record.content
        : record.content
        ? record.content
        : '';
      let lang: Array<string> = [];
      localeList.forEach((item) => {
        if (!!content[item.event] && content[item.event] != '') {
          lang.push(item.text);
        }
      });
      if (lang.length == 0) {
        const title = record.title.default
          ? record.title
          : record.title
          ? JSON.parse(record.title)
          : '';
        localeList.forEach((item) => {
          if (title[item.event]) {
            lang.push(item.text);
          }
        });
      }
      return lang.length > 0 ? lang.join('/') : '-';
    },
  },
  {
    title: t('table.system.system_send_crowd'), //发送人群
    dataIndex: 'peoples',
    minWidth: 110,
    customRender: ({ record }) => {
      const d = memberOptions.find((item) => item.value == record.flags);
      return d?.label;
    },
  },
  {
    title: t('table.system.system_announcement_content'), //公告时间
    dataIndex: 'content',
    minWidth: 110,
    slots: { customRender: 'content' },
  },
  {
    title: t('business.common_period_start'), //开始时间
    dataIndex: 'start_time',
    minWidth: 150,
    customRender: ({ record }) => {
      return toTimezone(record.start_time);
    },
  },
  {
    title: t('business.common_period_end'), //结束时间
    dataIndex: 'end_time',
    minWidth: 150,
    customRender: ({ record }) => {
      return toTimezone(record.end_time);
    },
  },
  {
    title: t('business.common_operate_people'), //操作人
    dataIndex: 'updated_by',
    minWidth: 120,
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'state',
    minWidth: 90,
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.state === 1,
        disabled: isControlValueSet() ? true : false,
        checkedChildren: t('business.common_show'), //显示
        unCheckedChildren: t('business.common_hidden'), //隐藏
        onChange(checked: boolean) {
          if (!isHasAuth('70513')) return;
          const { createMessage } = useMessage();
          const newState = checked ? 1 : 2;
          updateSiteNoticetState({ id: record.id, state: newState, notice_type: 1 })
            .then((res) => {
              if (res.status) {
                record.state = newState;
                createMessage.success(res.data);
              } else {
                createMessage.error(res.data);
              }
            })
            .catch(() => {
              createMessage.error(t('table.system.state_edit_failed'));
            });
        },
      });
    },
  },
];
useAutoTableLabelWidth(columns);
