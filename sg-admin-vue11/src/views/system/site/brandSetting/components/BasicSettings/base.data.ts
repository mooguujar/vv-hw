import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
import { ref } from 'vue';
import { useCurrencyStore } from '/@/store/modules/currency';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
import { useTimezoneStore } from '@/store/modules/timezone';
import { useTimezoneList } from '@/settings/localeSetting';

import CN from '/@/assets/svg/language/CN.svg';
import EN from '/@/assets/svg/language/US.svg';
import PT from '/@/assets/svg/language/BR.svg';
import TH from '/@/assets/svg/language/TH.svg';
import VI from '/@/assets/svg/language/VN.svg';
import HI from '/@/assets/svg/language/IN.svg';
import { useUserStore } from '/@/store/modules/user';

const currentLanguage = useLocaleStoreWithOut();
const locale = currentLanguage.getLocale;
const timezoneStore = useTimezoneStore();

const userStore = useUserStore();

// 根据不同语言设置不同的labelWidth
const getLabelWidth = (index: number) => {
  switch (locale) {
    case 'zh_CN':
      switch (index) {
        case 2:
          return 120;
        case 3:
          return 140;
        case 4:
          return 180;
        case 5:
          return 200;
        default:
          return 120;
      }
    default:
      return 'auto';
  }
};

const getOffset1 = () => {
  switch (locale) {
    case 'zh_CN':
      return 0;
    default:
      return 1;
  }
};

const labelWidth1 = locale === 'zh_CN' ? '212px' : '270px';
const labelWidth2 = locale === 'zh_CN' ? '200px' : '228px';
const labelWidth3 = locale === 'zh_CN' ? '135px' : '215px';
const labelWidth4 = locale === 'zh_CN' ? '136px' : 'auto';
const labelWidth5 = getLabelWidth(5);
const offset1 = ref(getOffset1());

const { t } = useI18n();

export const langs = [
  {
    label: t('common.common_zh_CN'),
    value: 'zh_CN',
    img: CN,
    currencyID: '701',
  },
  { label: t('common.common_en_US'), value: 'en_US', img: EN, currencyID: '706' },
  { label: t('common.common_pt_BR'), value: 'pt_BR', img: PT, currencyID: '702' },
  { label: t('common.common_th_TH'), value: 'th_TH', img: TH, currencyID: '705' },
  { label: t('common.common_vi_VN'), value: 'vi_VN', img: VI, currencyID: '704' },
  { label: t('common.common_hi_IN'), value: 'hi_IN', img: HI, currencyID: '703' },
  { label: t('common.common_tl_PH'), value: 'tl_PH', img: EN, currencyID: '735' },
  { label: t('common.common_ko_KR'), value: 'ko_KR', img: EN, currencyID: '733' },
];

const labelWidth = locale === 'zh_CN' ? '180px' : 'auto';

// 基础配置
export const schemas: FormSchema[] = [
  {
    field: 'commission_withdraw_min',
    component: 'Input',
    label: t('modalForm.system.system_minimum_deposit') + ':',
    colProps: { span: 6 },
    labelWidth: labelWidth,
    componentProps: {},
    slot: 'mini',
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          if (!value) {
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'lotteryBetting',
    component: 'Input',
    label: t('table.system.withdraw_count') + ':',
    colProps: { span: 6 },
    labelWidth: labelWidth,
    componentProps: {},
    slot: 'withdraw-times',
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          if (!value) {
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
  {
    field: 'lotteryBetting',
    component: 'Input',
    label: t('table.system.system_limit_settings_bet') + ':',
    colProps: { span: 6 },
    labelWidth: labelWidth,
    componentProps: {},
    slot: 'base-three',
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          if (!value) {
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },

  {
    field: 'PreferentialConfiguration',
    component: 'Input',
    label: t('table.system.system_deposit_preferential_conf') + ':',
    colProps: { span: 6 },
    labelWidth: labelWidth,
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          if (!value) {
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    componentProps: {},
    slot: 'PreferentialConfiguration',
  },
  {
    field: 'deposit',
    component: 'RadioGroup',
    label: t('modalForm.system.depositCording') + ':', //存款打码
    colProps: { span: 6 },
    labelWidth: labelWidth,
    defaultValue: true,
    helpMessage: '-',
    helpComponentProps: {
      text: `<div><span style='color:#FFCB00;'>${t('table.system.system_select_yes')}</span>${t(
        'table.system.system_select_yes_info',
      )}</div>
      <div><span style='color:#FFCB00;'>${t('table.system.system_select_no')}</span>${t(
        'table.system.system_select_no_info',
      )}</div>
                `,
      placement: 'top',
      isBefore: true,
    },
    componentProps: () => {
      return {
        options: [
          { label: t('business.common_yes'), value: true },
          { label: t('business.common_no'), value: false },
        ],
        // style: { width: '121px' },
      };
    },
    required: false,
  },
  {
    field: 'fast',
    component: 'RadioGroup',
    label: t('table.system.system_Security_fast') + ':',
    defaultValue: 1,
    labelWidth: labelWidth,
    helpMessage: '-',
    helpComponentProps: {
      text: `<div><span style='color:#FFCB00;'>${t(
        'table.system.system_select_not_mandatory',
      )}</span>${t('table.system.system_select_not_mandatory_info')}</div>
      <div><span style='color:#FFCB00;'>${t('table.system.system_select_mandatory')}</span>${t(
        'table.system.system_select_mandatory_info',
      )}</div>
                `,
      placement: 'top',
      isBefore: true,
    },
    colProps: {
      span: 6,
      class: 'fast-sty',
    },
    componentProps: {
      options: [
        { label: t('modalForm.member.system_Security_fast_2'), value: 1 },
        { label: t('modalForm.system.system_Security_fast_1'), value: 0 }, //谷歌二维码
      ],
    },
    required: false,
  },
  {
    field: 'verify',
    component: 'RadioGroup',
    label: t('table.system.system_Security_verification') + ':',
    defaultValue: 1,
    labelWidth: labelWidth,
    colProps: { span: 10, offset: offset1.value },
    componentProps: {
      options: [
        {
          label: t('common.All'),
          value: 3,
        },
        { label: t('modalForm.member.member_fund'), value: 2 },
        { label: t('modalForm.system.system_google_code_qr'), value: 1 }, //谷歌二维码
      ],
    },
    required: false,
  },

  {
    field: 'currency_exchange',
    component: 'Select',
    label: t('table.system.currency_exchange') + ':',
    labelWidth: labelWidth,
    defaultValue: 1,
    helpMessage: '-',
    helpComponentProps: {
      // <p>${t('table.system.tips')}</p>
      text: `
      <p> <span style='color:#FFCB00;'>${t('table.system.text1')}</span>  ${t(
        'table.system.text2',
      )}</p>
       <span style='color:#FFCB00;'>${t('table.system.text3')}</span>${t(
        'table.system.text4',
      )} <br/>
       <span style='color:#FFCB00;'>${t('table.system.text5')}</span>${t(
        'table.system.text6',
      )} <br/>
       <span style='color:#FFCB00;'>${t('table.system.text7')}</span>${t('table.system.text8')}
                `,
      placement: 'top',
      isBefore: true,
      maxWidth: '520px',
    },
    colProps: { span: 12 },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.set1'), value: 1 }, //
        { label: t('table.system.set2'), value: 2 }, //
        { label: t('table.system.set3'), value: 3 }, //
        { label: t('table.system.set0'), value: 0 }, //关闭
      ],
      getPopupContainer: () => document.body,
      style: { width: labelWidth1 },
    },
    required: false,
  },
  {
    field: 'coin_deposit',
    component: 'Select',
    label: t('table.system.coin_deposit') + ':',
    labelWidth: labelWidth,
    defaultValue: 0,
    helpMessage: '-',
    helpComponentProps: {
      text: `
       <span style='color:#FFCB00;'>${t('table.system.text9')}</span>${t(
        'table.system.text10',
      )}<br/>
       <span style='color:#FFCB00;'>${t('table.system.open')}：</span>${t(
        'table.system.text12',
      )} <br/>
                `,
      placement: 'top',
      isBefore: true,
    },
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.close'), value: 0 }, //
        { label: t('table.system.open'), value: 1 }, //
      ],
      getPopupContainer: () => document.body,
      style: { width: locale === 'zh_CN' ? '212px' : '80px' },
    },
    required: false,
  },
  {
    field: 'basic-info',
    component: 'Input',
    label: '',
    colProps: {
      span: 6,
    },
    slot: 'basicInfo',
    ifShow: ({ values }) => {
      return values.coin_deposit != 1;
    },
  },
  {
    field: 'coin_deposit_currency',
    component: 'ApiSelect',
    label: t('table.system.coin_deposit_currency') + ':',
    labelWidth: labelWidth,
    colProps: { span: 6 },
    defaultValue: '701',
    componentProps: {
      api: async () => {
        const { getCurrencyList } = useCurrencyStore();
        const list = getCurrencyList.filter((el) => el.attr == 1);
        return list;
      },
      labelField: 'label',
      valueField: 'value',
      showIcon: true,
      getPopupContainer: () => document.body,
      style: { width: locale === 'zh_CN' ? '212px' : '100px' },
    },
    required: false,
    ifShow: ({ values }) => {
      return values.coin_deposit != 0;
    },
  },
  {
    field: 'kyc',
    component: 'Select',
    label: t('common.kyc_certification') + ':',
    defaultValue: 1,
    labelWidth: labelWidth,
    colProps: { span: 6 },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.close'), value: 0 }, //
        { label: t('table.system.open'), value: 1 }, //
      ],
      getPopupContainer: () => document.body,
      style: { width: labelWidth1 },
    },
    required: false,
  },
  {
    field: 'verification',
    component: 'Select',
    label: t('table.system.system_verify_way') + ':',
    labelWidth: labelWidth,
    defaultValue: 1,
    colProps: {
      span: 6,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `
       <span style='color:#FFCB00;'>${t('table.system.system_verify_way')}:</span>${t(
        'common.verification1',
      )}
        `,
      placement: 'top',
      isBefore: true,
    },
    // required: true,
    componentProps: ({ formModel }) => {
      return {
        options:
          formModel.kyc == 1
            ? [
                { label: t('common.email_or_phone_verification'), value: 1 },
                { label: t('common.face_recognition'), value: 2 },
              ]
            : [{ label: t('common.email_or_phone_verification'), value: 1 }],
        getPopupContainer: () => document.body,
        style: { width: '212px' },
      };
    },
    required: false,
  },
  {
    field: 'nativeTY',
    component: 'Select',
    label: t('common.native_sport') + ':',
    defaultValue: true,
    labelWidth: labelWidth,
    colProps: { span: 12 },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.close'), value: false }, //
        { label: t('table.system.open'), value: true }, //
      ],
      getPopupContainer: () => document.body,
      style: { width: '212px' },
    },
    required: false,
  },
  {
    field: 'loginPwa',
    component: 'Select',
    label: t('common.login_pwa') + ':',
    defaultValue: false,
    labelWidth: labelWidth,
    colProps: { span: 12 },
    helpMessage: '-',
    helpComponentProps: {
      text: `<div>${t('common.login_pwa_info')}</div>`,
      placement: 'top',
      isBefore: true,
    },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.close'), value: false }, //
        { label: t('table.system.open'), value: true }, //
      ],
      getPopupContainer: () => document.body,
      style: { width: labelWidth1 },
    },
    required: false,
  },
  {
    field: 'pwaSetting',
    component: 'Select',
    label: t('common.pwa') + ':',
    defaultValue: false,
    labelWidth: labelWidth,
    colProps: { span: 12 },
    helpMessage: '-',
    helpComponentProps: {
      text: `
       <span style='color:#FFCB00;'>${t('table.system.open')}：</span>${t('common.pwa_info')}`,
      placement: 'top',
      isBefore: true,
    },
    slot: 'pwaSettingSlot',
    required: false,
  },
  {
    field: 'chooseLanguage',
    component: 'Select',
    label: t('table.system.system_website_language') + ':',
    defaultValue: 1,
    helpMessage: '-',
    helpComponentProps: {
      text: `<div>${t('table.system.system_default_all_languages')}</div>`,
      placement: 'top',
      isBefore: true,
    },
    labelWidth: labelWidth,
    colProps: { span: 12 },
    componentProps: {
      allowClear: false,
      options: [
        { label: t('table.system.system_language1'), value: 1 }, //开启
        { label: t('table.system.system_languages'), value: 2 }, //关闭
      ],
      getPopupContainer: () => document.body,
      style: { width: labelWidth1 },
    },
    required: false,
  },
  {
    field: 'timezone',
    component: 'Select',
    label: t('common.default_time_zone') + ':',
    labelWidth: labelWidth,
    colProps: { span: 12 },
    defaultValue: timezoneStore.getTimezone,
    helpMessage: '-',
    helpComponentProps: {
      text: `<div>${t('common.time_zone_info')}</div>`,
      placement: 'top',
      isBefore: true,
    },
    componentProps: {
      getPopupContainer: () => document.body,
      allowClear: false,
      options: useTimezoneList().map((item) => {
        return {
          label: item.label,
          value: item.value,
        };
      }),
      style: { width: '212px' },
    },
    required: false,
  },
  {
    field: 'lang',
    component: 'RadioGroup',
    label: t('table.system.system_default_language') + ':',
    labelWidth: labelWidth,
    defaultValue: 'zh_CN',
    helpMessage: ({ values }) =>
      values.chooseLanguage === 2 ? [t('common.defaultLang_info')] : [],
    helpComponentProps: {
      placement: 'top',
      isBefore: true,
      maxWidth: '200px',
    },
    componentProps: () => {
      return {
        options: langs,
        getPopupContainer: () => document.body,
      };
    },
    colProps: { span: 24 },
  },
  {
    field: 'currncy',
    component: 'Input',
    label: t('table.system.system_operating_currency') + ':',
    labelWidth: labelWidth,
    helpMessage: '-',
    helpComponentProps: {
      text: `<div>${t('table.system.system_help')}</div>`,
      placement: 'top',
      isBefore: true,
    },
    colProps: { span: 24 },
    slot: 'currency-slot',
  },
];
