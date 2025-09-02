import { FormSchema } from '@/components/Form';
import { useI18n } from '@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
const { t } = useI18n();

export const editData: FormSchema[] = [
  {
    field: 'maintain',
    component: 'RadioGroup',
    label: t('common.maintenanOp') + ':',
    required: true,
    defaultValue: 1,
    colProps: {
      span: 18,
    },
    componentProps: {
      options: [
        { label: t('common.maintenance'), value: 2 },
        { label: t('common.open'), value: 1 },
      ],
    },
  },
  {
    field: 'maintain_start_time',
    component: 'DatePicker',
    required: true,
    label: t('business.common_period_start') + ':',
    slot: 'startTime',
    colProps: {
      span: 18,
    },
    ifShow: (record) => (String(record.values.maintain) === '2' ? true : false),
  },
  {
    field: 'maintain_end_time',
    component: 'DatePicker',
    required: true,
    label: t('business.common_period_end') + ':',
    slot: 'endTime',
    colProps: {
      span: 18,
    },
    ifShow: (record) => (String(record.values.maintain) === '2' ? true : false),
  },
  {
    field: 'notice',
    component: 'Input',
    label: t('table.system.system_matain_info') + ':',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          return Promise.resolve();
        },
      },
    ],
    slot: 'notice',
    ifShow: (record) => String(record.values.maintain) === '2',
  },
];
useAutoLabelWidth(editData);
