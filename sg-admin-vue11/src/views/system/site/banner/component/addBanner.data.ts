import { FormSchema } from '/@/components/Table';
import {
  useBannerTypeOptions,
  clientListString,
  useRegisterbannerjumpTo,
} from '/@/views/common/commonSetting';
import { useI18n } from '/@/hooks/web/useI18n';

const { bannerTypeOptions } = useBannerTypeOptions();

const { bannerjumpTo } = useRegisterbannerjumpTo();

const { t } = useI18n();

const labelWidth = 120;

export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'basic-info1',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo1',
  },
  {
    field: 'banner_type',
    component: 'CheckboxGroup',
    // label: 'banner位置',
    label: t('business.banner_position') + ':',
    colProps: { span: 8 },
    labelWidth,
    componentProps: {
      options: bannerTypeOptions.map((itme) => {
        return {
          label: t(itme.label),
          value: itme.value,
        };
      }),
    },
    required: true,
  },
  {
    field: 'client',
    component: 'CheckboxGroup',
    label: t('business.common_client') + ':',
    colProps: { span: 8 },
    labelWidth,
    slot: 'terminalSlot',
    componentProps: {
      options: clientListString,
    },
    required: true,
  },
  {
    field: 'basic-info2',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo2',
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'basic-info6',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo6',
    ifShow: ({ values }) => values.banner_style == 3,
  },
  {
    field: 'banner_style',
    label: t('business.banner_style') + ':',
    component: 'Checkbox',
    slot: 'bannertypeSlot',
    labelWidth,
    colProps: { span: 16 },
    defaultValue: 1,
    required: true,
  },
  {
    field: 'banner_block_color',
    label: t('business.banner_color') + ':',
    component: 'Checkbox',
    slot: 'bannercolorSlot',
    labelWidth,
    colProps: { span: 24 },
    required: true,
    defaultValue: 1,
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'banner_icons',
    label: t('business.banner_icons') + ':',
    component: 'Checkbox',
    slot: 'bannericonsSlot',
    labelWidth,
    colProps: { span: 24 },
    required: true,
    defaultValue: 1,
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'basic-info3',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo3',
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'banner_language',
    label: t('business.banner_content') + ':',
    component: 'Checkbox',
    slot: 'bannerlanguageSlot',
    labelWidth,
    colProps: { span: 24 },
    required: true,
    defaultValue: 1,
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'superscript',
    component: 'Input',
    slot: 'superscriptTextSlot',
    label: t('business.banner_superscript') + ':',
    labelWidth,
    colProps: { span: 8 },
    // required: true,
    defaultValue: '&nbsp;',
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'button_state',
    label: t('business.banner_button_show') + ':',
    component: 'RadioGroup',
    defaultValue: 1,
    labelWidth,
    slot: 'btnTextState',
    colProps: { span: 9 },
    componentProps: {
      options: [
        { label: t('common.On'), value: 1 },
        { label: t('common.Off'), value: 2 },
      ],
    },
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'basic-info7',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo7',
    ifShow: ({ values }) => values.banner_style !== 3 && values.button_state === 1,
  },
  {
    field: 'btn_text',
    component: 'Checkbox',
    slot: 'btnTextSlot',
    label: t('business.banner_button_text') + ':',
    colProps: { span: 8 },
    required: true,
    labelWidth,
    defaultValue: '&nbsp;',
    ifShow: ({ values }) => values.banner_style !== 3 && values.button_state === 1,
  },
  {
    field: 'button_jump_type',
    component: 'Select',
    label: t('business.banner_go_next') + ':',
    labelWidth,
    slot: 'btnjumpTypeSlot',
    colProps: { span: 8 },
    componentProps: {
      options: bannerjumpTo,
      getPopupContainer: () => document.body,
    },
    defaultValue: 2,
    ifShow: ({ values }) => values.banner_style !== 3 && values.button_state === 1,
  },
  {
    field: 'button_jump_url',
    component: 'Input',
    label: t('business.button_redirect_type') + ':',
    slot: 'btnjumpUrlSlot',
    colProps: { span: 8 },
    labelWidth,
    componentProps: {
      placeholder: t('common.inputText'),
    },
    ifShow: ({ values }) =>
      values.banner_style !== 3 &&
      values.button_state === 1 &&
      (values.button_jump_type == 1 || values.button_jump_type == 14),
  },
  {
    field: 'button_aid',
    component: 'Select',
    label: t('table.discountActivity.discount_activity_list') + ':',
    colProps: { span: 6 },
    labelWidth,
    slot: 'selectButtonIdMapSlot',
    ifShow: ({ values }) =>
      values.banner_style !== 3 && values.button_state === 1 && values.button_jump_type == 15,
  },
  {
    field: 'basic-info4',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo4',
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'jumpConfig',
    component: 'InputNumber',
    defaultValue: 1,
    required: true,
    labelWidth,
    slot: 'jumpConfig',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'basic-info5',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo5',
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'template_style',
    label: t('business.template_style') + ':',
    component: 'Checkbox',
    slot: 'templateSlot',
    labelWidth,
    colProps: { span: 16 },
    defaultValue: 1,
    required: true,
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'banner_textarea',
    label: '',
    component: 'Checkbox',
    slot: 'bannerTextareaSlot',
    labelWidth,
    colProps: { span: 14 },
    required: false,
    ifShow: ({ values }) => values.banner_style !== 3,
  },
  {
    field: 'img_type',
    label: t('v.bannner.img_type') + ':',
    component: 'RadioGroup',
    slot: 'imgTypeContent',
    defaultValue: 1,
    labelWidth,
    helpMessage: '-',
    helpComponentProps: {
      text: `<div><span style='color:#FACD91;'>${t('v.bannner.img_type_1')}：</span>${t(
        'v.bannner.img_type_1_help1',
      )}</div>
      <div><span style='color:#FACD91;'>${t('v.bannner.img_type_2')}：</span>${t(
        'v.bannner.img_type_1_help2',
      )}</div>
     `,
      placement: 'left',
      isBefore: true,
    },
    colProps: { span: 16 },
    ifShow: ({ values }) => values.banner_style === 3,
  },
  {
    field: 'banner_update_pic',
    label: t('business.banner_upload_pic') + ':',
    component: 'Input',
    slot: 'bannerUpdatePicSlot',
    labelWidth,
    required: true,
    colProps: { span: 16 },
    ifShow: ({ values }) => values.banner_style === 3,
  },
  {
    field: 'basic-info4',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo4',
    ifShow: ({ values }) => values.banner_style == 3,
  },
  {
    field: 'jumpConfig',
    component: 'InputNumber',
    defaultValue: 1,
    required: true,
    slot: 'jumpConfig',
    labelWidth,
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => values.banner_style == 3 && values.img_type == 1,
  },
  {
    field: 'jump_state',
    label: t('v.bannner.jump_state') + ':',
    component: 'RadioGroup',
    defaultValue: 1,
    labelWidth,
    colProps: { span: 8 },
    componentProps: {
      options: [
        { label: t('common.On'), value: 1 },
        { label: t('common.Off'), value: 2 },
      ],
    },
    ifShow: ({ values }) => values.banner_style === 3 && values.img_type == 2,
  },
  {
    field: 'jump_type',
    component: 'Select',
    label: t('v.bannner.jump_type') + ':',
    colProps: { span: 8 },
    labelWidth,
    componentProps: {
      options: bannerjumpTo,
      getPopupContainer: () => document.body,
    },
    defaultValue: 2,
    ifShow: ({ values }) =>
      values.banner_style == 3 && values.jump_state == 1 && values.img_type == 2,
  },
  {
    field: 'jump_url',
    component: 'Input',
    label: t('v.bannner.jump_url') + ':',
    colProps: { span: 8 },
    labelWidth,
    componentProps: {
      placeholder: t('common.inputText'),
    },
    ifShow: ({ values }) =>
      values.banner_style == 3 &&
      values.jump_state == 1 &&
      (values.jump_type == 1 || values.jump_type == 14) &&
      values.img_type == 2,
  },
  {
    field: 'aid',
    component: 'Select',
    label: t('table.discountActivity.discount_activity_list') + ':',
    colProps: { span: 6 },
    labelWidth,
    slot: 'selectJumpUrlSlot',
    ifShow: ({ values }) =>
      values.banner_style == 3 &&
      values.jump_state == 1 &&
      values.jump_type == 15 &&
      values.img_type == 2,
  },
  {
    field: 'all_jump_url',
    component: 'Input',
    show: false,
  },
];
