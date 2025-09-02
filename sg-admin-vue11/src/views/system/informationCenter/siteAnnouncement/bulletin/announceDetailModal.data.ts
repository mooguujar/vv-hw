import { h } from 'vue';
import { FormSchema } from '/@/components/Table';
import { useMemberOptionsMap } from '/@/views/common/commonSetting';
import { getLevelValues } from '/@/utils/common';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { memberOptionsMap } = useMemberOptionsMap();
const { t } = useI18n();
export const announceDetailFrom: FormSchema[] = [
  {
    field: 'content',
    component: 'CheckboxGroup',
    label: t('table.system.system_announcement_content') + ':', //消息内容
    required: true,
    colProps: {
      span: 24,
    },
    slot: 'content',
  },
  {
    field: 'usernames',
    component: 'Input',
    show: false,
  },
  {
    field: 'agents',
    component: 'Input',
    show: false,
  },
  {
    field: 'user_levels',
    component: 'Input',
    show: false,
  },
  {
    field: 'vip_levels',
    component: 'Input',
    show: false,
  },
  {
    field: 'pop_up_type',
    component: 'Input',
    show: false,
  },
  {
    field: 'contentEdit',
    component: 'InputTextArea',
    label: ' ',
    colProps: { span: 24 },
    slot: 'contentEdit',
  },
  // {
  //   field: 'imageUrl',
  //   component: 'InputTextArea',
  //   label: ' ',
  //   colProps: { span: 24 },
  //   slot: 'imageUrl',
  //   ifShow: ({ values }) => values.pop_up_type == 2,
  // },
  {
    field: 'flags',
    label: t('table.system.system_send_crowd') + ':', //发送人群
    component: 'Input',
    colProps: { span: 24 },
    defaultValue: 1,
    render: ({ model, field }) => {
      let { flags, usernames, crowd_content, user_levels, vip_levels, agents } = model;
      flags = Number(flags);
      let value = '';
      if (flags == 1 || flags == 6) {
        value = memberOptionsMap[model[field]];
      } else if (flags == 2) {
        value = usernames && usernames.join(',');
      } else if (flags == 3) {
        let ids = JSON.parse(JSON.stringify(user_levels));
        ids = ids.map((level) => level.toString());
        value = getLevelValues(ids.join(','), null);
      } else if (flags == 4) {
        value = vip_levels.map((level) => `VIP${level}`).join(', ');
      } else if (flags == 5) {
        value = agents.join(',');
      }
      return h('div', { class: 'rounded border dark-div p-1' }, value);
    },
  },
];
useAutoLabelWidth(announceDetailFrom);
