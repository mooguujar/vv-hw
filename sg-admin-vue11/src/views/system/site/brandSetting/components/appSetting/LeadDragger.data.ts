import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchema } from '/@/components/Table';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();

const colProps = { span: 24 };

export const leaderschemas: FormSchema[] = [
  {
    field: 'barType',
    label: t('table.system.system_guide_download_bar') + ':',
    component: 'RadioGroup',
    defaultValue: 1,
    colProps,
    componentProps: {
      options: [
        { label: t('common.text'), value: 1 },
        { label: t('common.pic'), value: 2 },
      ],
    },
  },
  {
    field: 'bgColor',
    component: 'Input',
    label: t('table.system.system_bg_col') + ':',
    colProps,
    slot: 'bgColorSlot',
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'btnColor',
    component: 'Input',
    label: t('table.system.system_btn_bg') + ':',
    colProps,
    slot: 'btnColorSlot',
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'btnIcon',
    component: 'Input',
    label: t('table.system.system_ico_col') + ':',
    colProps,
    slot: 'btnIconSlot',
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'btnPosition',
    component: 'RadioGroup',
    label: t('table.system.system_close_btn') + ':',
    colProps,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('table.system.system_r'), value: 1 },
        { label: t('table.system.system_l'), value: 2 },
        { label: t('table.system.system_r_t'), value: 3 },
        { label: t('table.system.system_l_t'), value: 4 },
      ],
    },
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'titleText',
    component: 'Input',
    label: t('table.system.system_title_content') + ':',
    colProps,
    slot: 'titleTextSlot',
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'mainTitle',
    component: 'Input',
    label: t('table.system.system_main_title') + ':',
    colProps,
    slot: 'mainTitleSlot',
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'subTitle',
    component: 'Input',
    label: t('table.system.system_subtitle') + ':',
    colProps,
    slot: 'subTitleSlot',
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'btnText',
    component: 'Input',
    label: t('business.banner_button_text') + ':',
    colProps,
    slot: 'btnTextSlot',
    ifShow: ({ values }) => values.barType == 1,
  },
  {
    field: 'logoSetting',
    component: 'Input',
    label: ' ',
    colProps,
    slot: 'logoSetting',
    ifShow: ({ values }) => values.barType == 2,
  },
];
useAutoLabelWidth(leaderschemas);
export const appschemas: FormSchema[] = [
  {
    field: 'flag',
    component: 'RadioGroup',
    label: t('table.system.system_flag') + ':',
    colProps,
    defaultValue: 1,
    componentProps: {
      options: [
        { label: t('table.system.system_flag_1'), value: 1 },
        { label: t('table.discountActivity.discount_custom'), value: 2 },
      ],
    },
  },
  {
    field: 'android',
    component: 'Input',
    label: t('table.system.system_android_link') + ':',
    colProps,
    show: ({ values }) => values.flag == 2,
  },
  {
    field: 'ios',
    component: 'Input',
    label: t('table.system.system_ios_link') + ':',
    colProps,
    show: ({ values }) => values.flag == 2,
  },
  {
    field: 'bgColor',
    component: 'Input',
    label: t('table.system.system_bg_col') + ':',
    colProps,
    slot: 'bgColorSlot',
  },
  {
    field: 'btnIcon',
    component: 'Input',
    label: 'ICON:',
    colProps,
    slot: 'logoSetting',
  },
  {
    field: 'titleText',
    component: 'Input',
    label: t('table.system.system_title_content_lang') + ':',
    colProps,
    slot: 'titleTextSlot',
  },
  {
    field: 'subTitle',
    component: 'Input',
    label: t('table.system.app_subtitle') + ':',
    colProps,
    slot: 'subTitleSlot',
  },
  {
    field: 'mainTitle',
    component: 'Input',
    label: t('table.system.app_main_title') + ':',
    colProps,
    slot: 'mainTitleSlot',
  },
  {
    field: 'btnText',
    component: 'Input',
    label: t('business.banner_button_text') + ':',
    colProps,
    slot: 'btnTextSlot',
  },
  {
    field: 'btnIcon',
    component: 'Input',
    label: t('table.system.system_ico_col') + ':',
    colProps,
    slot: 'btnIconSlot',
  },
  {
    field: 'buttonBorder',
    component: 'Input',
    label: t('table.system.app_btn_bg') + ':',
    colProps,
    slot: 'buttonBorderSlot',
  },
];
useAutoLabelWidth(appschemas);
export const footerAppschemas: FormSchema[] = [
  {
    field: 'bgColor',
    component: 'Input',
    label: t('table.system.system_bg_col') + ':',
    colProps,
    slot: 'bgColorSlot',
  },
  {
    field: 'btnIcon',
    component: 'Input',
    label: 'ICON:',
    colProps,
    slot: 'logoSetting',
  },
  {
    field: 'titleText',
    component: 'Input',
    label: t('table.system.system_title_content_lang') + ':',
    colProps,
    slot: 'titleTextSlot',
  },
  {
    field: 'subTitle',
    component: 'Input',
    label: t('table.system.app_subtitle') + ':',
    colProps,
    slot: 'subTitleSlot',
  },
  {
    field: 'mainTitle',
    component: 'Input',
    label: t('table.system.app_main_title') + ':',
    colProps,
    slot: 'mainTitleSlot',
  },
  {
    field: 'btnText',
    component: 'Input',
    label: t('business.banner_button_text') + ':',
    colProps,
    slot: 'btnTextSlot',
  },
  {
    field: 'btnIcon',
    component: 'Input',
    label: t('table.system.system_ico_col') + ':',
    colProps,
    slot: 'btnIconSlot',
  },
  {
    field: 'buttonBorder',
    component: 'Input',
    label: t('table.system.app_btn_bg') + ':',
    colProps,
    slot: 'buttonBorderSlot',
  },
];
useAutoLabelWidth(footerAppschemas);
