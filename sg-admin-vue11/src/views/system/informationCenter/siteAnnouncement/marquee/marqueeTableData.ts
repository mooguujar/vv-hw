import { BasicColumn, FormSchema } from '/@/components/Table';
import { Switch } from 'ant-design-vue';
import { h } from 'vue';
import { useMessage } from '/@/hooks/web/useMessage';
import Icon from '/@/components/Icon';
import { marquee_update_state } from '/@/api/sys';
import { Client } from '/@/views/common/commonSetting';
import { useLocalList } from '/@/settings/localeSetting';
import { useLocale } from '/@/locales/useLocale';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { isHasAuth } from '/@/utils/authFunction';
import setTooltip from '/@/components/abTooltipInnerEslipse';
import { isControlValueSet } from '/@/utils/domUtils';

const localeList = useLocalList();
const { t } = useI18n();
// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'state',
    component: 'Input',
    slot: 'beforeSlots',
    colProps: {
      style: {
        marginRight: '10px',
      },
    },
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'), //状态
    labelPrefixWidth: 45,
    component: 'Select',
    defaultValue: 0,
    componentProps: {
      allowClear: false,
      options: [
        { label: t('business.common_all'), value: 0 }, //全部
        { label: t('business.common_show'), value: 1 }, //显示
        { label: t('business.common_hidden'), value: 2 }, //隐藏
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'inputGroup',
    labelPrefix: '',
    labelPrefixWidth: 35,
    labelBorder: false,
    component: 'InputGroup',
    slot: 'input-group',
    colProps: { style: { marginRight: '10px' } },
  },
];

// 跑马灯列表
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
    title: t('table.system.system_notice_title'), //消息标题
    dataIndex: 'title',
    minWidth: 224,
    customRender: ({ record }) => {
      const lang = useLocale().getLocale.value;
      const content = record.title;
      return h('div', content[lang]);
    },
  },
  {
    title: t('table.report.report_client'), //客户端
    dataIndex: 'client',
    minWidth: 250,
    customRender: ({ record }) => {
      const text = record.client
        .map((id) => {
          return Client[Number(id)];
        })
        .join(',');
      return text;
    },
  },
  {
    title: t('table.system.system_application_language'), //应用语言
    dataIndex: 'langrage',
    minWidth: 230,
    customRender: ({ record }) => {
      if (!record.content) return '-';
      const content = record.content;
      const lang: Array<string> = [];
      localeList.forEach((item) => {
        if (content[item.event]) {
          lang.push(item.text);
        }
      });
      return lang.join('/');
    },
  },
  {
    title: t('table.system.system_notice_content'), //消息内容
    dataIndex: 'content',
    width: 200,
    customRender: ({ record }) => {
      const lang = useLocale().getLocale.value;
      const content = record.content;
      return setTooltip(content[lang]);
    },
  },
  {
    title: t('business.common_period_start'), //开始时间
    dataIndex: 'start_time',
    minWidth: 150,
    customRender: ({ record }) => {
      return dayjs(record.start_time * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('business.common_period_end'), //结束时间
    dataIndex: 'end_time',
    minWidth: 150,
    customRender: ({ record }) => {
      return dayjs(record.end_time * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('business.common_operate_people'), //操作人
    dataIndex: 'updated_name',
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
          const { createMessage } = useMessage();
          const newState = checked ? 1 : 2;
          marquee_update_state({ id: record.id, state: newState, notice_type: 2 })
            .then(({ status, data }) => {
              if (status) {
                record.state = newState;
                createMessage.success(data);
              } else {
                createMessage.error(data);
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
