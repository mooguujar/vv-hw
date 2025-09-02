import { FormSchema } from '/@/components/Form';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: 'title',
    component: 'Input',
    label: t('common.MessageTitle'),
    slot: 'zhNameTextSlot',
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          if (!value) {
            return Promise.reject(t('modalForm.system.system_input_title_tip'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      placeholder: t('modalForm.system.system_input_title_tip'),
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'start_time',
    label: t('business.common_period_start'),
    rules: [{ required: true, trigger: 'change', type: 'object' }],
    component: 'DatePicker',
    componentProps: {
      placeholder: t('table.discountActivity.discount_select_start_time'),
    },
    defaultValue: dayjs().startOf('day').toDate(),
    slot: 'startDate',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'end_time',
    label: t('business.common_period_end'),
    rules: [{ required: true, trigger: 'change', type: 'object' }],
    component: 'DatePicker',
    componentProps: {
      placeholder: t('table.discountActivity.discount_select_end_time'),
    },
    defaultValue: dayjs().endOf('day').toDate(),
    slot: 'endDate',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'client',
    component: 'CheckboxGroup',
    label: t('table.report.report_client'),
    rules: [{ required: true }],
    colProps: {
      span: 24,
    },
    slot: 'clientSlot',
  },
  {
    field: 'content',
    component: 'CheckboxGroup',
    label: t('table.system.system_notice_content'),
    rules: [{ required: true }],
    colProps: {
      span: 24,
    },
    slot: 'content',
  },
  {
    field: 'contentEdit',
    component: 'InputTextArea',
    required: true,
    colProps: { span: 24 },
    componentProps: () => {
      return {
        autoSize: { minRows: 8, maxRows: 12 },
        placeholder: t('table.promotion.promotion_please_enter'),
      };
    },
  },
  {
    field: 'state',
    label: t('modalForm.finance.finance_now_status'),
    rules: [{ required: true }],
    component: 'RadioGroup',
    colProps: { span: 24 },
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('v.discount.activity.show_amount_2'), value: 1 },
        { label: t('business.common_hidden'), value: 2 },
      ],
    },
  },
];

export function marqueeDetailFormData(contentList, currentlanguageIndex) {
  return [
    {
      field: 'content',
      component: 'CheckboxGroup',
      label: t('table.system.system_notice_content'), //消息内容
      required: true,
      colProps: {
        span: 24,
      },
      slot: 'content',
      dynamicRules: ({ values }) => {
        return [
          {
            required: true,
            validator: (_, value) => {
              return Promise.resolve();
            },
          },
        ];
      },
    },
    {
      field: 'contentEdit',
      component: 'InputTextArea',
      label: ' ',
      colProps: { span: 24 },
      componentProps: {
        autoSize: { minRows: 8, maxRows: 12 },
        disabled: true,
      },
    },
    {
      field: 'contentEdit',
      label: t('modalForm.system.system_marquee_result'), //演示效果
      component: 'Input',
      colProps: { span: 24 },
      defaultValue: 1,
      slot: 'marquee',
    },
  ];
}
