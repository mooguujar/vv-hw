import { FormSchema } from '/@/components/Form';
import dayjs from 'dayjs';
import { Tinymce } from '/@/components/Tinymce/index';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: 'maintStart',
    label: t('business.common_period_start'),
    rules: [{ required: true, trigger: 'change', type: 'object' }],
    component: 'DatePicker',
    colProps: { span: 22 },
    componentProps: {
      placeholder: t('table.system.system_please_time'),
    },
    defaultValue: dayjs().format('YYYY-MM-DD HH:mm'),
    slot: 'startDate',
  },
  {
    field: 'maintEnd',
    label: t('business.common_period_end'),
    rules: [{ required: true, trigger: 'change', type: 'object' }],
    component: 'DatePicker',
    colProps: { span: 22 },
    componentProps: {
      placeholder: t('table.system.system_please_end'),
    },
    slot: 'endDate',
  },
  // {
  //     field: 'maintDes',
  //     component: 'InputTextArea',
  //     labelWidth: 100,
  //     componentProps: {
  //         placeholder: '维护说明',
  //         autoSize: { minRows: 6, maxRows: 8 },
  //     },
  //     colProps: { span: 22 },
  //     required: true,
  //     label: '维护说明'
  // },
  {
    field: 'maintDes',
    component: 'Input',
    label: t('table.system.system_matain_info'),
    labelWidth: 100,
    defaultValue: '',
    rules: [{ required: true }],
    render: ({ model, field }) => {
      return h(Tinymce, {
        value: model[field],
        onChange: (value: string) => {
          model[field] = value;
        },
        showImageUpload: false,
        toolbar: ['fontsizeselect | bold | italic | underline '],
        plugins: [],
        options: {
          width: 351,
          height: 250,
          // selector: '.my-mce-selector',
          // inline: true,
          // toolbar_persist:true,
          // toolbar_location:'left',
          menubar: false,
          elementpath: false,
          resize: false,
          statusbar: false,
        },
      });
    },
  },
];
