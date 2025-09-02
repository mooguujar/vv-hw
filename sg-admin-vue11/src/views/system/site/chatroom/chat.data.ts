import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import RenderNameTooltip from './tooltip/RenderNameTooltip.vue';
import { auths } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const setTooltip = (text, color = '') => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
          class: color,
        },
        t('business.common_all'),
      ),
  );
};
const setMarkTooltip = (text, color = '') => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
          class: color,
        },
        text,
      ),
  );
};
const setRealNameHooks = (names) => {
  return h(RenderNameTooltip, { nameObj: names });
};
const langs = {
  en_US: t('common.langEn'),
  pt_BR: t('common.LangPt'),
  th_TH: t('common.common_th_TH'),
  vi_VN: t('common.LangVetnam'),
  zh_CN: t('common.common_zh_CN'),
  hi_IN: t('common.LangIndia'),
};
export const columns: any = [
  {
    title: t('table.system.system_message_send_time'), //构建环境
    dataIndex: 't',
    minWidth: 300,
    customRender: ({ record }) => {
      return toTimezone(record.t, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('table.system.system_fsr'), //git仓库分支
    dataIndex: 'n',
    minWidth: 300,
  },
  {
    title: t('table.system.system_chat_content'), //git仓库分支
    dataIndex: 'c',
    minWidth: 630,
    customRender: ({ record }) => {
      return record.c.length > 30 ? setMarkTooltip(record.c) : record.c;
    },
  },
];
useAutoTableLabelWidth(columns);
export const columnsLimit: any = [
  {
    title: t('table.discountActivity.discountActivity_member'), //构建环境
    dataIndex: 'username',
  },
  {
    title: t('table.member.member_user_name'), //git仓库分支
    dataIndex: 'names',
    customRender: ({ record }) => {
      return record.names ? setRealNameHooks(JSON.parse(record.names)) : '-';
    },
  },
  {
    title: t('table.system.superior_agent'), //git仓库分支
    dataIndex: 'parent_name',
    customRender: ({ record }) => {
      return record.parent_name ? record.parent_name : '-';
    },
  },
  {
    title: t('table.report.report_member_level'),
    dataIndex: 'level_name',
  },
  {
    title: t('table.system.system_vip_level'),
    dataIndex: 'vip',
    customRender: ({ record }) => {
      return record.vip ? `VIP${record.vip}` : '-';
    },
  },
  {
    title: t('table.system.system_ban_lang'),
    dataIndex: 'tongue',
    width: 260,
    customRender: ({ record }) => {
      const tongue = [];
      const tongueString = record.tongue;
      const tongueListJosn = tongueString.replace(/'/g, '"');
      const tongueList = JSON.parse(tongueListJosn);

      tongueList.forEach((item) => tongue.push(langs[item]));
      if (tongue.length < 6) {
        return tongue.join(',');
      } else {
        return setTooltip(tongue.join(','));
      }
    },
  },
  {
    title: t('table.system.system_ban_reason'),
    dataIndex: 'remark',
    width: 260,
    customRender: ({ record }) => {
      return record.remark
        ? record.remark.length > 10
          ? setMarkTooltip(record.remark)
          : record.remark
        : '-';
    },
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: t('business.common_operate_people'), //git仓库分支
    dataIndex: 'created_name',
  },
];
useAutoTableLabelWidth(columnsLimit);
export const searchSchema: any = [
  {
    field: 'speak',
    component: 'Input',
    label: '',
    slot: 'speak',
    ifShow: auths(['70228', '70229']),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day'), dayjs().endOf('day')],
    componentProps: {
      allowClear: false,
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'speaker',
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'subButton',
  },
  {
    field: 'language',
    component: 'Input',
    label: '',
    slot: 'language',
    colProps: { span: 24 },
  },
];

export const langrageArr = [
  {
    language: 'zh_',
    value: 'zh_CN',
    label: t('common.common_zh_CN'),
    disabled: false,
  },
  {
    language: 'en_',
    value: 'en_US',
    label: t('common.common_en_US'),
    disabled: false,
  },
  {
    language: 'vn_',
    value: 'vi_VN',
    label: t('common.common_vi_VN'),
    disabled: false,
  },
  {
    language: 'th_',
    value: 'th_TH',
    label: t('common.common_th_TH'),
    disabled: false,
  },
  {
    language: 'pt_',
    value: 'pt_BR',
    label: t('common.common_pt_BR'),
    disabled: false,
  },
  {
    language: 'hi_',
    value: 'hi_IN',
    label: t('common.common_hi_IN'),
    disabled: false,
  },
];
export const searchSchemaLimit: any = [
  {
    field: 'speak',
    component: 'Input',
    label: '',
    slot: 'speak',
    ifShow: auths(['70899', '70897']),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [],
    componentProps: {
      allowClear: true,
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'speaker',
  },
];
