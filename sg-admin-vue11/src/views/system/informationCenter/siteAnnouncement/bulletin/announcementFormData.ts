import { FormSchema } from '/@/components/Form';
import dayjs from 'dayjs';
import { isObject } from '/@/utils/is';
import { usePositionOptions, useFrequencyOptions, stateOptions } from '../../common/const';
import { commaSeparatedString } from '/@/utils/regexp';
import { useMemberStore } from '/@/store/modules/member';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMemberOptions } from '/@/views/common/commonSetting';
// import { calculateWidth } from '/@/utils';

const { memberOptions } = useMemberOptions();
const { positionOptions } = usePositionOptions();
const { frequencyOptions } = useFrequencyOptions();
const { t } = useI18n();
stateOptions[0].label = t('business.common_show'); //显示
stateOptions[1].label = t('business.common_hidden'); //隐藏

export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'flags',
    label: t('table.system.system_send_crowd') + ':', //发送人群
    //label: setTooltip(t('table.system.system_send_crowd')),
    defaultValue: '1',
    component: 'RadioGroup',
    labelWidth: 'auto',
    helpMessage: '-',
    helpComponentProps: {
      text: `
        <p><label style="color: #eabf88;">${t(
          'modalForm.discountActivity.all_members',
        )}</label>: ${t('modalForm.discountActivity.all_members_descript')}</p>
        <p><label style="color: #eabf88;">${t(
          'modalForm.discountActivity.membership_level',
        )}</label>: ${t('modalForm.discountActivity.designated_member_dialog')}</p>
        <p><label style="color: #eabf88;">${t('modalForm.discountActivity.vip_level')}</label>: ${t(
        'modalForm.discountActivity.designated_vip_dialog',
      )}</p>
        <p><label style="color: #eabf88;">${t(
          'modalForm.discountActivity.appointed_agent',
        )}</label>: ${t('modalForm.discountActivity.designated_member_announcement')}</p>
      `,
      placement: 'right',
      isBefore: true,
    },
    colProps: { span: 16 },
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        // 标志1全部，2 指定会员 ，3会员层级 4vip等级 5 指定代理
        options: [
          { label: t('common.All'), value: '1' },
          { label: t('table.system.system_designated_member'), value: '2' },
          { label: t('table.system.system_membership_level'), value: '3' },
          { label: t('table.system.system_vip_level'), value: '4' },
          { label: t('table.system.system_designated_agent'), value: '5' },
        ],
        onChange: async (e) => {
          if (isObject(e)) {
            if (e.target.value === 1) {
              await setFieldsValue({ bounce_location: 1 });
            } else {
              await setFieldsValue({ bounce_location: 3 });
            }
          }
        },
      };
    },
  },
  {
    field: 'agents',
    component: 'Input',
    label: memberOptions[4].label + ':',
    required: true,
    colProps: { span: 16 },
    labelWidth: 'auto',
    componentProps: {
      placeholder: t('table.system.separated_agents'),
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('table.system.enterPls', [memberOptions[4].label]));
          }

          if (!commaSeparatedString.test(value)) {
            return Promise.reject(t('table.system.separated_agents_error'));
          }

          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => values.flags == 5,
  },
  {
    field: 'usernames',
    component: 'Input',
    label: memberOptions[1].label + ':',
    required: true,
    colProps: { span: 16 },
    labelWidth: 'auto',
    componentProps: {
      placeholder: t('table.system.separate_member'),
    },
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('table.system.enterPls', [memberOptions[1].label]));
          }

          if (!commaSeparatedString.test(value)) {
            return Promise.reject(t('table.system.separated_member_error'));
          }

          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    ifShow: ({ values }) => values.flags == 2,
  },
  {
    field: 'user_levels',
    component: 'ApiSelect',
    label: memberOptions[2].label + ':',
    labelWidth: 'auto',
    rules: [
      {
        type: 'array',
      },
      {
        required: true,
        validator: async (rule, value) => {
          if (!Array.isArray(value))
            return Promise.reject(t('table.system.choose_pls', [memberOptions[2].label]));
          if (value.length > 0) {
            return Promise.resolve();
          } else {
            return Promise.reject(t('table.system.choose_pls', [memberOptions[2].label]));
          }
        },
        trigger: 'blur',
      },
    ],
    componentProps: {
      placeholder: t('table.system.enterPls', [memberOptions[2].label]),
      api: async () => {
        const memberStore = useMemberStore();
        const outputArray: { label: string; value: string }[] = [];
        for (const key in memberStore.levelSelect) {
          outputArray.push({ label: memberStore.levelSelect[key], value: key });
        }
        return outputArray;
      },
      mode: 'multiple',
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
    colProps: { span: 16 },
    ifShow: ({ values }) => values.flags == 3,
  },
  {
    field: 'vip_levels',
    label: memberOptions[3].label + ':',
    labelWidth: 'auto',
    component: 'ApiSelect',
    rules: [
      {
        type: 'array',
      },
      {
        required: true,
        validator: async (rule, value) => {
          if (!Array.isArray(value))
            return Promise.reject(t('table.system.choose_pls', [memberOptions[3].label]));
          if (value.length > 0) {
            return Promise.resolve();
          } else {
            return Promise.reject(t('table.system.choose_pls', [memberOptions[3].label]));
          }
        },
        trigger: 'blur',
      },
    ],
    componentProps: {
      placeholder: t('table.system.choose_pls', [memberOptions[3].label]),
      api: async () => {
        const memberStore = useMemberStore();
        const outputArray: { label: string; value: string }[] = [];
        for (const key in memberStore.vipLevelSelect) {
          outputArray.push({ label: 'VIP' + key, value: String(memberStore.vipLevelSelect[key]) });
        }
        return outputArray;
      },
      mode: 'multiple',
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
    colProps: { span: 16 },
    ifShow: ({ values }) => values.flags == 4,
  },
  {
    field: 'title',
    component: 'Input',
    slot: 'titleTextSlot',
    defaultValue: '&nbsp;',
    labelWidth: 'auto',
    label: t('table.system.system_announcement_title') + ':', //公告标题
    //label: setTooltip(t('table.system.system_announcement_title')),
    required: true,
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('table.system.announcement_no_empty'));
          }
          if (value?.length > 20) {
            return Promise.reject(t('table.system.announcement_no_more'));
          }
          return Promise.resolve();
        },
      },
    ],
    colProps: { span: 16 },
    componentProps: {
      placeholder: t('table.system.system_announce_title_tip'), //请输入公告标题(20字以内)
    },
  },
  {
    field: 'block',
    component: 'Input',
    colProps: { span: 8 },
    componentProps: {
      style: {
        display: 'none',
      },
    },
  },
  {
    field: 'start_time',
    label: t('business.common_period_start') + ':', //开始时间
    //label: setTooltip(t('business.common_period_start')),
    rules: [{ required: true, trigger: 'change', type: 'object' }],
    component: 'DatePicker',
    colProps: { span: 8 },
    labelWidth: 'auto',
    componentProps: {
      placeholder: t('table.system.system_please_time'),
    },
    defaultValue: dayjs().startOf('day').toDate(),
    slot: 'startDate',
  },
  {
    field: 'end_time',
    label: t('business.common_period_end') + ':', //结束时间
    //label: setTooltip(t('business.common_period_end')),
    rules: [{ required: true, trigger: 'change', type: 'object' }],
    component: 'DatePicker',
    labelWidth: 'auto',
    colProps: { span: 8 },
    componentProps: {
      placeholder: t('table.system.system_please_end'),
    },
    defaultValue: dayjs().endOf('day').toDate(),
    slot: 'endDate',
  },
  {
    field: 'client',
    component: 'CheckboxGroup',
    labelWidth: 'auto',
    label: t('table.report.report_client') + ':', //客户端
    //label: setTooltip(t('table.report.report_client')),
    rules: [
      {
        required: true,
        message: t('table.system.choose_pls', [t('table.report.report_client')]),
      },
    ],
    colProps: { span: 16 },
    slot: 'clientSlot',
  },
  {
    field: 'block',
    component: 'Input',
    colProps: { span: 8 },
    componentProps: {
      style: {
        display: 'none',
      },
    },
  },
  {
    field: 'bounce_location',
    component: 'Select',
    label: t('table.system.system_bounce_position') + ':', //弹跳位置
    // label: setTooltip(t('table.system.system_bounce_position')),
    required: true,
    labelWidth: 'auto',
    defaultValue: 1,
    colProps: {
      span: 8,
      class: 'max-input-width',
    },
    componentProps: {
      allowClear: false,
      options: positionOptions,
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: ({ values }) => {
      let status = false;
      if (values.flags == 1) {
        if (values.bounce_frequency === 2) {
          status = true;
        }
      } else {
        status = true;
      }
      return status;
      // return values.flags != 1 || (values.flags == 1 && values.bounce_frequency === 2);
    },
  },
  {
    field: 'bounce_frequency',
    component: 'Select',
    label: t('table.system.system_bounce_frequency') + ':', //弹跳频率
    //label: setTooltip(t('table.system.system_bounce_frequency')),
    required: true,
    defaultValue: 1,
    labelWidth: 'auto',
    colProps: {
      span: 8,
      // class: 'max-input-width',
    },
    componentProps: ({ formActionType }) => {
      const { setFieldsValue } = formActionType;
      return {
        allowClear: false,
        options: frequencyOptions,
        getPopupContainer: () => document.body,
        onChange: async (value) => {
          // 如果选择了自定义(2)
          if (value === 2) {
            // 强制设置弹跳位置为“登录后”（3）
            await setFieldsValue({
              bounce_location: 3,
            });
          }
        },
      };
    },
  },
  {
    field: 'bounce_frequency_limit',
    component: 'InputNumber',
    label: t('table.system.custom_frequency') + ':',
    required: true,
    colProps: { span: 16 },
    labelWidth: 'auto',
    componentProps: {
      placeholder: t('table.system.enterCustomFrequencypls'),
      addonAfter: t('table.system.times_a_day'),
      min: 1,
    },
    ifShow: ({ values }) => values.bounce_frequency === 2,
  },
  {
    field: 'is_limit',
    defaultValue: 1,
    component: 'Switch',
    label: t('table.system.allow_no_more_prompts') + ':',
    //label: setTooltip(t('table.system.allow_no_more_prompts')),
    colProps: { span: 16 },
    labelWidth: 'auto',
    // labelWidth:
    //   calculateWidth(t('table.system.allow_no_more_prompts')).width > '100px'
    //     ? calculateWidth(t('table.system.allow_no_more_prompts')).width
    //     : '120px',
    componentProps: {
      size: 'default',
      checkedValue: 1,
      unCheckedValue: 2,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: t('table.system.no_more_prompt'),
      placement: 'right',
      isBefore: true,
    },
    ifShow: ({ values }) => {
      if (values.bounce_frequency === 2 && values.bounce_frequency_limit < 3) {
        return false;
      } else if (values.bounce_frequency === 2 && !values.bounce_frequency_limit) {
        return false;
      } else {
        return true;
      }
    },
  },
  {
    field: 'pop_up_type',
    label: t('table.system.system_modal_content') + ':', //弹窗内容
    //label: setTooltip(t('table.system.system_modal_content')),
    defaultValue: 1,
    component: 'RadioGroup',
    colProps: { span: 16 },
    labelWidth: 'auto',
    slot: 'popContent',
  },
  {
    field: 'block',
    component: 'Input',
    colProps: { span: 8 },
    labelWidth: 'auto',
    componentProps: {
      style: {
        display: 'none',
      },
    },
  },
  // {
  //   field: 'pop_up_style',
  //   component: 'Input',
  //   label: t('table.system.system_modal_style'), //弹窗样式
  //   colProps: { span: 16 },
  //   slot: 'popStyle',
  //   ifShow: ({ values }) => values.pop_up_type === 2,
  // },
  // {
  //   field: 'color',
  //   component: 'Input',
  //   label: t('table.system.system_modal_color'), //弹窗颜色
  //   colProps: { span: 16 },
  //   slot: 'popColor',
  //   ifShow: ({ values }) => {
  //     return values.pop_up_type === 2 && values.pop_up_style != 3;
  //   },
  // },
  // {
  //   field: 'icon',
  //   component: 'Input',
  //   label: t('table.system.system_modal_icon'), //弹窗图标
  //   colProps: { span: 16 },
  //   slot: 'popIcon',
  //   ifShow: ({ values }) => values.pop_up_type === 2 && values.pop_up_style != 3,
  // },
  {
    field: 'lang',
    component: 'Input',
    colProps: { span: 16 },
    labelWidth: 'auto',
    label: t('table.system.system_announcement_content') + ':', //公告内容
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.resolve();
          }
        },
      },
    ],
    slot: 'content',
  },
  {
    field: 'content',
    component: 'Input',
    label: ' ',
    // labelWidth: 120,
    defaultValue: '',
    // rules: [{ required: true }],
    colProps: { span: 16 },
    labelWidth: 'auto',
    slot: 'contentEdit',
    ifShow: ({ values }) => values.pop_up_style !== 3,
  },
  {
    field: 'state',
    component: 'RadioGroup',
    label: t('business.common_status') + ':', //状态
    //label: setTooltip(t('business.common_status')),
    defaultValue: 1,
    colProps: { span: 16 },
    labelWidth: 'auto',
    componentProps: {
      options: stateOptions,
    },
  },
];
