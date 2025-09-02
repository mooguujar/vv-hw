import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { useActiveOptionsTy, useRegisterbannerjumpTo } from '/@/views/common/commonSetting';
import {
  periodList,
  cycle,
  cycleBs,
  daily,
  weekly,
  monthly,
  reward_type,
} from '../../common/setting';
import { useTimezoneList } from '/@/settings/localeSetting';
import { ref, h } from 'vue';
import { currentyOptions } from '/@/settings/commonSetting';
import eventBus from '/@/utils/eventBus';
import CdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
import { FormItem, Input, message, Select } from 'ant-design-vue';
// import dayjs from 'dayjs';
import { useCurrencyStore } from '/@/store/modules/currency';
import { getAllCurrencyList, getAllMethodList } from '/@/api/finance';
import { useLocaleStoreWithOut } from '/@/store/modules/locale';
import { useUserStore } from '@/store/modules/user';

// const monthlyData = monthly;
// monthlyData.length = dayjs().add(1, 'months').startOf('month').daysInMonth();

const currentLanguage = useLocaleStoreWithOut();
const locale = currentLanguage.getLocale;
const timezoneList = useTimezoneList();
// 根据不同语言设置不同的labelWidth
export const labelWidth = (() => {
  switch (locale) {
    case 'zh_CN':
      return 85;
    case 'en_US':
      return 168; // 修改为返回 'auto' 而不是 120
    case 'vi_VN':
      return 140;
    case 'pt_BR':
      return 130;
    default:
      return 85;
  }
})();
// 根据不同语言设置不同的langLabelWidth
export const langLabelWidth = (() => {
  switch (locale) {
    case 'zh_CN':
      return 100;
    case 'en_US':
      return 160;
    case 'vi_VN':
      return 140;
    case 'pt_BR':
      return 130;
    default:
      return 100;
  }
})();
const { t } = useI18n();
const { activeOptionsTy } = useActiveOptionsTy();
const { bannerjumpTo } = useRegisterbannerjumpTo();

const timezone = ref();

function ischecktiem(values) {
  if (values.timeDisable) return false;
  //return !!values.id && dayjs().isAfter(values?.startTime?.start_at);
}
export const portfolioConfig = [
  {
    label: t('v.discount.activity.portfolioAll1'),
    value: 1,
  },
  {
    label: t('v.discount.activity.portfolioAll2'),
    value: 2,
  },
  {
    label: t('v.discount.activity.portfolioAll3'),
    value: 3,
  },
  {
    label: t('v.discount.activity.portfolioAll4'),
    value: 4,
  },
  {
    label: t('v.discount.activity.portfolioAll5'),
    value: 5,
  },
  {
    label: t('v.discount.activity.portfolioAll6'),
    value: 6,
  },
  {
    label: t('v.discount.activity.portfolioAll7'),
    value: 7,
  },
  {
    label: t('v.discount.activity.portfolioAll8'),
    value: 8,
  },
];

// ty==2 推广
export const promotionData: FormSchema[] = [
  {
    field: 'Validmember',
    component: 'InputNumber',
    slot: 'Validmember',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '1',
  },
  {
    field: 'first_deposit_amount',
    component: 'InputNumber',
    labelWidth,
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '2',
    label: t('v.discount.activity.first_deposit_amount'),
    // required: true,
    componentProps: ({ formModel }) => {
      const currencyId = formModel['currentCurryId'] || '701';
      return {
        stringMode: true,
        placeholder: `${t('v.discount.activity.first_deposit_amount_placeholder')}${
          currentyOptions[currencyId]
        }`,
      };
    },
    dynamicDisabled: ({ values }) => {
      // //return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_deposit_amount',
    component: 'InputNumber',
    labelWidth,
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '3',
    label: t('v.discount.activity.total_deposit_amount'),
    // required: true,
    componentProps: ({ formModel }) => {
      const currencyId = formModel['currentCurryId'] || '701';
      return {
        stringMode: true,
        placeholder: `${t('v.discount.activity.first_deposit_amount_placeholder')}${
          currentyOptions[currencyId]
        }`,
      };
    },
    dynamicDisabled: ({ values }) => {
      // //return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_bet_amount',
    component: 'InputNumber',
    labelWidth,
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '4',
    label: t('v.discount.activity.total_bet_amount'),
    // required: true,
    componentProps: ({ formModel }) => {
      const currencyId = formModel['currentCurryId'] || '701';
      return {
        stringMode: true,
        placeholder: `${t('v.discount.activity.first_deposit_amount_placeholder')}${
          currentyOptions[currencyId]
        }`,
      };
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_deposit_days',
    component: 'InputNumber',
    labelWidth: 'auto',
    colProps: {
      span: 24,
    },
    serialNumber: '5',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    label: t('v.discount.activity.total_deposit_days'),
    // required: true,
    componentProps: {
      stringMode: true,
      precision: 0,
      min: 0,
      placeholder: t('v.discount.activity.total_deposit_days_placeholder'),
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_deposit_times',
    component: 'InputNumber',
    labelWidth: 105,
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '6',
    label: t('v.discount.activity.total_deposit_times'),
    // required: true,
    componentProps: {
      stringMode: true,
      placeholder: t('v.discount.activity.total_deposit_times_placeholder'),
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'condition_type',
    component: 'RadioGroup',
    labelWidth,
    required: true,
    colProps: {
      span: 24,
    },
    serialNumber: '7',
    label: t('v.discount.activity.condition_type'),
    // required: true,
    defaultValue: 1,
    componentProps: () => {
      return {
        options: [
          {
            label: t('v.discount.activity.condition_type_1'),
            value: 1,
          },
          {
            label: t('v.discount.activity.condition_type_2'),
            value: 2,
          },
        ],
      };
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id;
    },
  },
  // {
  //   field: 'basicPromotion',
  //   component: 'InputNumber',
  //   slot: 'basicPromotion',
  //   colProps: {
  //     span: 24,
  //   },
  // },
  {
    field: 'bonus_tpl',
    component: 'RadioGroup',
    required: true,
    label: t('v.discount.activity.bonus_tpl'),
    defaultValue: 1,
    colProps: {
      span: 24,
    },
    serialNumber: '8',
    slot: 'bonusTpl',
  },
  {
    field: 'bonus_type',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_type'),
    required: true,
    serialNumber: '9',
    defaultValue: 1,
    colProps: {
      span: 24,
    },
    componentProps: () => {
      return {
        options: [
          {
            label: t('v.discount.activity.bonus_type_1'),
            value: 1,
          },
          // {
          //   label: t('v.discount.activity.bonus_type_2'),
          //   value: 2,
          // },
        ],
      };
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id;
    },
  },
  {
    field: 'show_amount',
    component: 'RadioGroup',
    label: t('v.discount.activity.show_amount'),
    serialNumber: '10',
    required: true,
    colProps: {
      span: 24,
    },
    defaultValue: 1,
    componentProps: () => {
      return {
        options: [
          {
            label: t('v.discount.activity.show_amount_2'),
            value: 1,
          },
          {
            label: t('v.discount.activity.show_amount_1'),
            value: 2,
          },
        ],
      };
    },
  },
  {
    field: 'ip_limit',
    labelPrefixWidth: 'right',
    label: t('common.active_text25'),
    component: 'InputNumber',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    labelWidth,
    serialNumber: '11',
    defaultValue: '1',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: t('v.discount.activity.same_registered_device_limit_placeholder'),
    },
  },
  {
    field: 'device_limit',
    labelPrefixWidth: 'right',
    label: t('common.active_text26'),
    component: 'InputNumber',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    labelWidth,
    serialNumber: '12',
    defaultValue: '1',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: t('v.discount.activity.same_registered_device_limit_placeholder'),
    },
  },
  {
    field: 'settings',
    labelPrefixWidth: 'right',
    component: 'InputNumber',
    defaultValue: [
      {
        ppl: null,
        bonus: '',
      },
    ],
    slot: 'settings',
  },
];

// ty==16 会员答谢
export const MemberThs16: FormSchema[] = [
  {
    field: 'MemberThs',
    component: 'InputNumber',
    slot: 'MemberThs',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'cycle',
    component: 'RadioGroup',
    label: t('table.discountActivity.statistical_period'),
    defaultValue: 'daily',
    required: true,
    labelWidth: 'auto',
    colProps: {
      span: 24,
      class: 'noMagin_f',
    },
    componentProps: ({ formModel }) => {
      return {
        options: cycle,
        onChange: (value) => {
          if (value.target) formModel.cycle_offset = 1;
        },
      };
    },
    serialNumber: '1',
  },
  {
    field: 'cycle_offset',
    label: t('table.promotion.cycle_offset_day'),
    component: 'Select',
    defaultValue: 1,
    labelWidth,
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: daily,
      getPopupContainer: () => document.body,
    },
    serialNumber: '2',
    ifShow: ({ values }) => {
      return values.cycle == 'daily';
    },
  },
  {
    field: 'cycle_offset',
    label: t('table.promotion.cycle_offset_week'),
    component: 'Select',
    defaultValue: 1,
    labelWidth,
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: weekly,
      getPopupContainer: () => document.body,
    },
    serialNumber: '2',
    ifShow: ({ values }) => {
      return values.cycle == 'weekly';
    },
  },
  {
    field: 'cycle_offset',
    label: t('table.promotion.cycle_offset_month'),
    component: 'Select',
    defaultValue: 1,
    labelWidth,
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: monthly,
      getPopupContainer: () => document.body,
    },
    serialNumber: '2',
    ifShow: ({ values }) => {
      return values.cycle == 'monthly';
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: h('div', { class: '' }, [
      h('span', { class: 'color-red' }, '* '),
      h('span', { class: 'text' }, t('v.discount.activity.CurrencyConfig')),
    ]),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
    serialNumber: '3',
  },
  {
    field: 'actual_limit',
    component: 'InputNumber',
    serialNumber: '4',
    label: t('v.discount.activity.Roulette2'),
    labelWidth,
    // rules: [
    //   {
    //     required: true,
    //     validator: (_rule, value) => {
    //       if (typeof value === 'undefined')
    //         return Promise.reject(t('v.discount.activity.Roulette2_v'));
    //       return Promise.resolve();
    //     },
    //   },
    // ],
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        stringMode: true,
        placeholder: t('v.discount.activity.Roulette2_p'),
      };
    },
  },
  {
    field: 'display_limit',
    component: 'InputNumber',
    serialNumber: '5',
    label: t('common.active_text4'),
    required: true,
    labelWidth,
    rules: [
      {
        required: true,
        validator: (_rule, value) => {
          if (!value) return Promise.reject(t('common.active_text4_v'));
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        stringMode: true,
        placeholder: `${t('common.active_text19')}`,
      };
    },
  },
  {
    field: 'reward_type',
    component: 'RadioGroup',
    required: true,
    colProps: {
      span: 24,
    },
    serialNumber: '6',
    label: t('common.active_text9'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: reward_type,
        onChange: (value) => {
          const data = value?.target?.value || value || 'recharge';
          eventBus.emit('formChange_m', formModel);
          eventBus.emit('onmultipleText16', { value: data, type: 'reward_type' });
        },
      };
    },
  },

  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    serialNumber: '7',
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
      },
    },
    ifShow: ({ values }) => {
      return values.reward_type != 'recharge';
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.reward_type !== 'recharge' && values.platform_range == 2;
    },
  },
  {
    field: 'amount_type',
    component: 'RadioGroup',
    required: true,
    colProps: {
      class: 'adward-type',
      span: 24,
    },
    label: t('common.active_text13'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('common.active_text14'),
            value: 'fixed',
          },
          {
            label: t('common.active_text15'),
            value: 'random',
          },

          {
            label: t('common.active_text16'),
            value: 'percentage',
          },
          {
            label: t('common.active_text17'),
            value: 'random_percentage',
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          eventBus.emit('formChange_m', formModel);
        },
      };
    },
    // dynamicDisabled: ({ values }) => {
    //   //return !!values.id;
    // },
    serialNumber: ({ values }) => {
      if (['loss', 'valid_bet'].includes(values.reward_type)) {
        return '8';
      } else {
        return '7';
      }
    },
  },
  {
    field: 'activity16_table',
    component: 'Input',
    colProps: {
      span: 24,
    },
    slot: 'activity16_table',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
  },
];
// ty==1 轮盘
export const RouletteData: FormSchema[] = [
  {
    field: 'RouletteBase0',
    component: 'InputNumber',
    slot: 'RouletteBase0',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'apply_limit',
    component: 'RadioGroup',
    helpMessage: ' ',
    labelWidth: 'auto',
    colProps: {
      span: 24,
      class: 'noMagin_f',
    },
    required: true,
    helpComponentProps: {
      maxWidth: '100',
      text: `<p><span style="color:#FACD91">${t(
        'table.discountActivity.discount_number_of_participation',
      )}：</span>${t('v.discount.activity.participations_tip')}</p>`,
      isBefore: true,
      placement: 'left',
    },
    label: t('table.discountActivity.discount_number_of_participation'),
    defaultValue: 1,
    slot: 'applyLimit',
    dynamicDisabled: ({ values }) => {
      //return !!values.id;
    },
    serialNumber: '1',
  },
  {
    field: 'period',
    component: 'RadioGroup',
    label: t('table.discountActivity.discount_bouns_clear'),
    defaultValue: 1,
    required: true,
    labelWidth: 'auto',
    helpMessage: ' ',
    colProps: {
      span: 24,
      class: 'noMagin_f',
    },
    helpComponentProps: {
      maxWidth: '100',
      text: `<p><span style="color:#FACD91">${t(
        'table.discountActivity.discount_bouns_clear',
      )}：</span>${t('v.discount.activity.billing_des')}</p>`,
      isBefore: true,
      placement: 'left',
    },
    slot: 'period',
    componentProps: {
      options: periodList,
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id;
    },
    serialNumber: '2',
  },
  {
    field: 'RouletteBase1',
    component: 'InputNumber',
    slot: 'RouletteBase1',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: h('div', { class: '' }, [
      h('span', { class: 'color-red' }, '* '),
      h('span', { class: 'text' }, t('v.discount.activity.CurrencyConfig')),
    ]),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
    serialNumber: '1',
  },
  {
    field: 'pay',
    component: 'InputNumber',
    defaultValue: 1,
    labelWidth,
    // required: true,
    slot: 'payConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'portfolioAll',
    component: 'InputNumber',
    slot: 'portfolioAll',
  },
  {
    field: 'RouletteBase3',
    component: 'InputNumber',
    slot: 'RouletteBase3',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.id; //默认类型
    },
  },
  {
    field: 'phoneLanguage',
    component: 'Input',
    labelWidth,
    label: t('v.discount.activity.phoneLanguage'),
    slot: 'phoneLanguage',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.id; //默认类型
    },
  },
  {
    field: 'phoneConfig',
    component: 'Input',
    labelWidth,
    colProps: {
      span: 24,
    },
    label: t('v.discount.activity.phoneConfig'),
    slot: 'phoneConfig',
    ifShow: ({ values }) => {
      return values.id; //默认类型
    },
  },
];
// ty==4 负盈利
export const NegativeConfig: FormSchema[] = [
  {
    field: 'NegativeConfig',
    component: 'InputNumber',
    slot: 'NegativeConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 'auto',
    serialNumber: '1',
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
      },
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.platform_range == 2; //默认类型
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '2',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
      style: { marginTop: '20px' },
    },
  },
  {
    field: 'bonus_period',
    component: 'RadioGroup',
    label: t('table.discountActivity.statistical_period'),
    labelWidth: 105,
    defaultValue: 1,
    required: true,
    colProps: {
      span: 24,
    },
    helpMessage: '-',
    serialNumber: '3',
    // <div><span>${t('v.discount.activity.sec_day')}：</span>${t('common.statistics_nextday')}</div>
    // -日：每日结算一次，结算日为当天。
    // -周：每周结算一次，结算日为周日。
    // -月：每月结算一次，结算日为当月最后一天。
    helpComponentProps: {
      text: `
      <div>${t('common.text1')}</div>
      <div>${t('common.text2')}</div>
      <div>${t('common.text3')}</div>
      `,
      placement: 'right',
      isBefore: true,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('common.text4'),
            value: 1,
          },
          {
            label: t('common.text5'),
            value: 2,
          },
          {
            label: t('common.text6'),
            value: 3,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          eventBus.emit('period_4_change', data);
        },
      };
    },
  },
  {
    field: 'prize_limit',
    component: 'InputNumber',
    label: t('v.discount.activity.prize_limit'),
    rules: [
      {
        required: true,
        message: `${t('common.inputText')} ${t('v.discount.activity.prize_limit')}`,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '4',
    labelWidth,
    colProps: {
      span: 12,
    },
    componentProps: ({ schema, formActionType, formModel }) => {
      const currencyId = formModel['currentCurryId'] || '701';
      return {
        stringMode: true,
        placeholder: `${t('v.discount.activity.prize_limit_placeholder')}${
          currentyOptions[currencyId]
        }`,
        prefix: h(CdIconCurrency, { icon: currentyOptions[currencyId], style: { width: '20px' } }),
        style: { width: '100%' },
      };
    },
    // ifShow: ({ values }) => {
    //   return values.ty === 4; //默认类型
    // },
  },
  {
    field: 'bonus_type',
    serialNumber: '5',
    label: t('v.discount.activity.Cashback_configuration'),
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    // helpMessage: '-',
    // helpComponentProps: {
    //   text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
    //     'common.only_select_venues',
    //   )}`,
    //   placement: 'right',
    //   isBefore: true,
    // },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.bonus_type1'),
          value: 1,
        },
        {
          label: t('common.bonus_type2'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_bonus_type', data);
      },
    },
  },
  {
    field: 'negativeProfit',
    component: 'Input',
    labelWidth: 0,
    // colProps: {
    //   class: 'negativeProfit',
    // },
    componentProps: {},
    label: ' ',
    slot: 'negativeProfit',
    hideLabelWidth: true,
    colProps: {
      class: 'bonus_rate negativeProfit',
    },
  },
];

// ty==5 自定义
export const customizeConfig: FormSchema[] = [
  {
    field: 'display_type',
    label: t('v.discount.activity.display_type'),
    component: 'RadioGroup',
    required: true,
    labelWidth,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: [
        {
          label: t('v.discount.activity.display_type1'),
          value: 1,
        },
        {
          label: t('v.discount.activity.display_type2'),
          value: 2,
        },
      ],
    },
    serialNumber: '1',
  },
  {
    field: 'button_type_5',
    label: t('business.button_type'),
    component: 'Select',
    defaultValue: 1,
    labelWidth,
    colProps: {
      span: 8,
    },
    required: true,
    componentProps: {
      options: bannerjumpTo,
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => {
      return values.display_type === 2;
    },
  },
  {
    field: 'configBlock',
    component: 'InputNumber',
    slot: 'configBlock',
    colProps: {
      span: 1,
    },
    ifShow: ({ values }) => {
      return values.display_type === 2 && values.button_type_5 === 1;
    },
  },
  {
    field: 'button_redirect_5',
    label: t('business.banner_customer_self_defined_link'),
    labelWidth: 100,
    colProps: {
      span: 8,
    },
    rules: [
      {
        required: true,
        message: t('common.select_custom_link'),
      },
    ],
    component: 'Input',
    ifShow: ({ values }) => {
      return values.display_type === 2 && values.button_type_5 === 1;
    },
  },
];
// 红包配置
export const RedEnvelope: FormSchema[] = [
  {
    field: 'RedEnvelope',
    component: 'InputNumber',
    slot: 'RedEnvelope',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'dropEnvelope',
    component: 'Input',
    labelWidth,
    colProps: {
      span: 24,
      class: 'noMagin_f',
    },
    slot: 'dropEnvelope',
    serialNumber: '1',
  },
  {
    field: 'countdown',
    component: 'InputNumber',
    // labelPrefixWidth: 'right',
    labelWidth,
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '2',
    label: t('common.active_text42'),
    componentProps: ({ formModel }) => {
      // const currencyId = formModel['currentCurryId'] || '701';
      return {
        min: 0,
        stringMode: true,
        addonAfter: t('component.time.minutes'),
        placeholder: `${t('common.active_text43')}`,
      };
    },
    // dynamicDisabled: ({ values }) => {
    //   //return !!values.id && !!values.ty2;
    // },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '3',
  },
  {
    field: 'single_match_limit',
    component: 'InputNumber',
    labelWidth,
    ifShow: ({ model }) => false,
  },
  {
    field: 'single_match_limit_display',
    component: 'InputNumber',
    labelWidth,
    ifShow: ({ model }) => false,
  },
  {
    field: 'claim_Limit',
    component: 'InputNumber',
    labelWidth,
    ifShow: ({ model }) => false,
  },
  {
    field: 'claim_Limit_display',
    component: 'InputNumber',
    labelWidth,
    ifShow: ({ model }) => false,
  },
  {
    field: 'single_match_limit1',
    component: 'InputNumber',
    // labelPrefixWidth: 'right',
    labelWidth,
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '4',
    label: t('common.active_text45'),
    componentProps: ({ formModel }) => {
      return {
        min: 0,
        stringMode: true,
        placeholder: `${t('common.active_text46')}`,
      };
    },
    render: ({ model, field }) => {
      return h(
        'div',
        {
          style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center' },
        },
        [
          h(
            FormItem,
            {
              label: '',
              name: 'single_match_limit',
              style: { width: '50%', boxSizing: 'borderBox', paddingRight: '10px' },
              rules: [
                {
                  trigger: 'blur',
                  required: true,
                  validator: () => {
                    return Promise.resolve();
                  },
                },
              ],
            },
            h(Input, {
              value: model['single_match_limit'],
              size: 'large',
              placeholder: t('common.active_text46'),
              // disabled: model.id ? true : false,
              style: { height: '40px' },
              onChange: (e) => {
                const val = e.target ? e.target?.value : e;
                model.single_match_limit = val; // 更新 num 值
                eventBus.emit('formChange_m');
              },
            }),
          ),

          h(
            FormItem,
            {
              label: '',
              name: 'single_match_limit_display',
              style: { width: '50%' },
            },
            h(Input, {
              value: model['single_match_limit_display'],
              size: 'large',
              placeholder: t('common.active_text47'),
              // disabled: model.id ? true : false,
              style: { height: '40px' },
              onChange: (e) => {
                const val = e.target ? e.target?.value : e;
                model.single_match_limit_display = val; // 更新 num 值
                eventBus.emit('formChange_m');
              },
            }),
          ),

          h(
            FormItem,
            {
              label: '',
              name: 'claim_Limit',
              style: { width: '50%', boxSizing: 'borderBox', paddingRight: '10px' },
            },
            h(Input, {
              value: model['claim_Limit'],
              size: 'large',
              placeholder: t('common.active_text48'),
              // disabled: model.id ? true : false,
              style: { height: '40px' },
              onChange: (e) => {
                const val = e.target ? e.target?.value : e;
                model.claim_Limit = val; // 更新 num 值
                eventBus.emit('formChange_m');
              },
            }),
          ),
          h(
            FormItem,
            {
              label: '',
              name: 'claim_Limit_display',
              style: { width: '50%' },
            },
            h(Input, {
              value: model['claim_Limit_display'],
              size: 'large',
              placeholder: t('common.active_text49'),
              // disabled: model.id ? true : false,
              style: { height: '40px' },
              onChange: (e) => {
                const val = e.target ? e.target?.value : e;
                model.claim_Limit_display = val; // 更新 num 值
                eventBus.emit('formChange_m');
              },
            }),
          ),
        ],
      );
    },

    colProps: {
      class: 'mb-60px',
      span: 24,
      style: { height: '60px' },
    },
    // ifShow: ({ model }) => model.chargeCondition == 1 && model.isChargeTime == 1,
  },
  {
    field: 'redEnvelope',
    component: 'Input',
    labelWidth: 'auto',
    colProps: {
      span: 24,
    },
    label: t('common.active_text44'),
    slot: 'redEnvelope',
    serialNumber: '5',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'bonusty',
    component: 'RadioGroup',
    labelPrefixWidth: 'right',
    labelWidth,
    required: true,
    colProps: {
      span: 13,
    },
    serialNumber: '6',
    label: t('common.active_text50'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('common.active_text10'),
            value: 1,
          },
          {
            label: t('common.active_text11'),
            value: 2,
          },

          {
            label: t('common.active_text12'),
            value: 3,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          formModel.bonus?.ty && (formModel.bonus.ty = value);
          formModel.change = 1;
          eventBus.emit('formChange_m');
        },
      };
    },
    // dynamicDisabled: ({ values }) => {
    // return values.fulfil_cond != 2;
    // },
    ifShow: ({ values }) => {
      return values.fulfil_cond != 2;
    },
  },
  {
    field: 'claim_Limit1',
    component: 'InputNumber',
    labelPrefixWidth: 'right',
    labelWidth,
    label: t('table.system.system_statistical_time'),
    colProps: {
      class: 'box-right',
      span: 11,
      style: { height: '60px' },
    },
    // ifShow: ({ model }) => false,
    render: ({ model, field }) => {
      return h(
        'div',
        {
          class: 'p-10px px-15px   borderri',
          style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center' },
        },
        t('modalForm.common.yesterday'),
      );
    },
  },
  {
    field: 'bonusmethod',
    component: 'RadioGroup',
    labelWidth,
    labelPrefixWidth: 'right',
    required: true,
    colProps: {
      span: 13,
      class: 'w-550px !maxw-550px',
    },
    serialNumber: '7',
    label: t('common.active_text51'),
    defaultValue: 1,
    componentProps: ({ schema, formModel }) => {
      return {
        options: [
          {
            label: t('common.active_text14'),
            value: 1,
          },
          {
            label: t('common.active_text15'),
            value: 2,
          },

          {
            label: t('common.active_text16'),
            value: 3,
          },
          {
            label: t('common.active_text17'),
            value: 4,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          formModel.bonus?.method && (formModel.bonus.method = value);
          formModel.change = 0;
          eventBus.emit('formChange_m');
        },
      };
    },
    // dynamicDisabled: ({ values }) => {
    //   //return !!values.id;
    // },
  },
  {
    field: 'redEnvelope2',
    component: 'Input',
    labelWidth: 'auto',
    labelPrefixWidth: 'right',
    colProps: {
      span: 24,
    },
    // label: t('v.discount.activity.redEnvelope'),
    slot: 'redEnvelope2',
    // serialNumber: '3',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
  },
];
export const activity17: FormSchema[] = [
  {
    field: 'activity17',
    component: 'InputNumber',
    slot: 'activity17',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '1',
  },
  // {
  //   field: 'show_gift',
  //   component: 'InputNumber',
  //   labelWidth,
  //   rules: [
  //     {
  //       required: true,
  //       validator: () => {
  //         return Promise.resolve();
  //       },
  //     },
  //   ],
  //   colProps: {
  //     span: 13,
  //   },
  //   serialNumber: '2',
  //   label: t('common.active_text4'),
  //   // required: true,
  //   componentProps: ({ formModel }) => {
  //     // const currencyId = formModel['currentCurryId'] || '701';
  //     return {
  //       stringMode: true,
  //       placeholder: `${t('common.active_text19')}`,
  //       // placeholder: `${t('v.discount.activity.first_deposit_amount_placeholder')}${
  //       //   currentyOptions[currencyId]
  //       // }`,
  //     };
  //   },
  //   // dynamicDisabled: ({ values }) => {
  //   //   //return !!values.id && !!values.ty2;
  //   // },
  // },
  {
    field: 'daily_limit',
    component: 'InputNumber',
    labelWidth,
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 13,
    },
    serialNumber: '3',
    label: t('common.active_text5'),
    // required: true,
    componentProps: ({ formModel }) => {
      // const currencyId = formModel['currentCurryId'] || '701';
      return {
        min: 1,
        stringMode: true,
        placeholder: `${t('common.active_text20')}`,
        // placeholder: `${t('v.discount.activity.first_deposit_amount_placeholder')}${
        //   currentyOptions[currencyId]
        // }`,
      };
    },
    // dynamicDisabled: ({ values }) => {
    //   //return !!values.id && !!values.ty2;
    // },
  },
  {
    field: 'fulfil_cond',
    component: 'RadioGroup',
    labelWidth,
    required: true,
    colProps: {
      span: 13,
    },
    serialNumber: '4',
    label: t('v.discount.activity.condition_type'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('common.active_text6'),
            value: 1,
          },
          {
            label: t('common.active_text7'),
            value: 2,
          },

          {
            label: t('common.active_text8'),
            value: 3,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          if (value != 2) formModel.reward_type = 1;
          formModel.change = 1;
          eventBus.emit('formChange_m', formModel);
        },
      };
    },
    // dynamicDisabled: ({ values }) => {
    //   //return !!values.id;
    // },
  },
  {
    field: 'reward_type',
    component: 'RadioGroup',
    labelWidth,
    required: true,
    colProps: {
      span: 13,
    },
    // serialNumber: '7',
    label: t('common.active_text9'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('common.active_text10'),
            value: 1,
          },
          {
            label: t('common.active_text11'),
            value: 2,
          },

          {
            label: t('common.active_text12'),
            value: 3,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          formModel.change = 1;
          eventBus.emit('formChange_m', formModel);
        },
      };
    },
    // dynamicDisabled: ({ values }) => {
    // return values.fulfil_cond != 2;
    // },
    ifShow: ({ values }) => {
      return values.fulfil_cond != 2;
    },
  },

  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 'auto',
    // serialNumber: '1',
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
        eventBus.emit('formChange_m');
      },
    },
    ifShow: ({ values }) => {
      return values.reward_type != 1 || values.fulfil_cond == 2;
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return (values.reward_type != 1 && values.platform_range == 2) || values.fulfil_cond == 2; //默认类型
    },
  },
  {
    field: 'way',
    component: 'RadioGroup',
    labelWidth,
    required: true,
    colProps: {
      span: 13,
    },
    // serialNumber: '7',
    label: t('common.active_text13'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('common.active_text14'),
            value: 1,
          },
          {
            label: t('common.active_text15'),
            value: 2,
          },

          {
            label: t('common.active_text16'),
            value: 3,
          },
          {
            label: t('common.active_text17'),
            value: 4,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          formModel.change = 0;
          eventBus.emit('formChange_m', formModel);
        },
      };
    },
    // dynamicDisabled: ({ values }) => {
    //   //return !!values.id;
    // },
  },
  {
    field: 'activity17_table',
    component: 'Input',
    labelWidth: 'auto',
    colProps: {
      span: 24,
    },
    // label: t('common.ty17'),
    slot: 'activity17_table',
    // serialNumber: '3',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
  },
  // {
  //   field: 'popupAtHomepage',
  //   label: t('v.discount.activity.popup_at_homepage'),
  //   slot: 'popupAtHomepage',
  //   component: 'CheckboxGroup',
  //   defaultValue: [1, 2],
  //   rules: [
  //     {
  //       required: true,
  //       validator: () => {
  //         return Promise.resolve();
  //       },
  //     },
  //   ],
  //   colProps: {
  //     class: 'pop_componentProps',
  //     span: 24,
  //   },
  //   // serialNumber: () => {
  //   //   return '15';
  //   // },
  //   // ifShow: ({ model }) => model.ty == 171 || model.ty == 111,
  // },
];
//文案配置
export const ImgFormData: FormSchema[] = [
  {
    field: 'banner',
    component: 'Input',
    label: t('v.discount.activity.activeContent1') + ':',
    defaultValue: 1,
    required: true,
    slot: 'uploadImageText',
    labelWidth: 150,
    colProps: {
      span: 24,
    },
    serialNumber: '1',
  },
  {
    field: 'banner',
    component: 'Input',
    label: ' ',
    defaultValue: 1,
    slot: 'uploadImage',
    labelWidth: 0,
    colProps: {
      span: 24,
    },
    hideLabelWidth: true,
  },
  {
    field: 'activeContent',
    component: 'RadioGroup',
    label: t('v.discount.activity.activeContent2') + ':',
    defaultValue: 1,
    required: true,
    slot: 'activeContent',
    labelWidth,
    colProps: {
      span: 10,
    },
    serialNumber: '2',
  },
  {
    field: 'rule_type',
    component: 'RadioGroup',
    defaultValue: 1,
    label: t('table.discountActivity.discount_rule_sepification') + ':',
    labelWidth,
    slot: 'ruleType',
    colProps: {
      span: 12,
    },
    show: ({ values }) => {
      return values.activeContent == 1 && values.ty != 5;
    },
  },
  {
    field: 'bgColor',
    component: 'RadioGroup',
    defaultValue: 1,
    label: t('table.system.system_bg_col') + ':',
    labelWidth,
    slot: 'uploadColor',
    colProps: {
      span: 6,
    },
    show: ({ values }) => {
      return values.activeContent == 1 && values.ty == 5;
    },
  },
  {
    field: 'image',
    component: 'Input',
    label: ' ',
    slot: 'uploadImage',
    labelWidth: 0,
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.activeContent == 2;
    },
    hideLabelWidth: true,
  },
  {
    field: 'content',
    component: 'Input',
    // label: t('table.discountActivity.discount_rule_sepification'),
    label: ' ',
    labelWidth,
    colProps: {
      span: 24,
    },
    hideLabelWidth: true,
    slot: 'uploadText',
    ifShow: ({ values }) => {
      return values.activeContent == 1 && values.ty != 5 && values.rule_type == 1;
    },
  },
  {
    field: 'content',
    component: 'Input',
    // label: t('table.discountActivity.discount_rule_sepification'),
    label: ' ',
    labelWidth,
    colProps: {
      span: 24,
    },
    hideLabelWidth: true,
    slot: 'uploadTextRule',
    ifShow: ({ values }) => {
      if (values.activeContent == 1 && values.ty == 5) {
        return true;
      }
      if (values.activeContent == 1 && values.ty != 5 && values.rule_type == 2) {
        return true;
      }
      return false;
    },
  },
];

export const ImgFormDataTy5: FormSchema[] = [
  {
    field: 'imgConfig',
    component: 'InputNumber',
    slot: 'imgConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'activeContent',
    component: 'RadioGroup',
    label: t('v.discount.activity.activities_type'),
    defaultValue: 1,
    required: true,
    slot: 'activeContent',
    labelWidth,
    colProps: {
      span: 8,
    },
    ifShow: ({ values }) => {
      return values.display_type == 1;
    },
  },
  {
    field: 'image',
    component: 'Input',
    label: t('table.discountActivity.discount_upload_pic'),
    slot: 'uploadImage',
    labelWidth,
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.activeContent == 2 || values.display_type == 2;
    },
  },
  {
    field: 'content',
    component: 'Input',
    label: t('table.discountActivity.discount_rule_sepification'),
    labelWidth,
    colProps: {
      span: 24,
    },
    slot: 'uploadTextRule',
    ifShow: ({ values }) => {
      return values.activeContent == 1 && values.display_type == 1;
    },
  },
  {
    field: 'content',
    component: 'Input',
    labelWidth,
    colProps: {
      span: 24,
    },
    label: t('table.discountActivity.discount_rule_sepification_content'),
    slot: 'previewText',
    ifShow: ({ values }) => {
      return values.activeContent == 1 && values.display_type == 1;
    },
  },
];
// 每日奖励活动配置
export const everydayBetTy6: FormSchema[] = [
  {
    field: 'everydayBetTitle',
    component: 'InputNumber',
    slot: 'everydayBetTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rewardMethods',
    component: 'RadioGroup',
    label: t('table.discountActivity.reward_methods'),
    labelWidth,
    required: true,
    defaultValue: 1,
    colProps: {
      span: 24,
    },
    serialNumber: '1',
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('v.discount.activity.all_can_get'),
            value: 1,
          },
          {
            label: t('v.discount.activity.only_can_get'),
            value: 2,
          },
        ],
        onChange: (e) => {
          if (formModel.ty == 6) {
            const val = e.target ? e.target.value : e;
            eventBus.emit('onEvertBetTextChange', { value: val, type: 'getText' });
          }
        },
      };
    },
  },
  {
    field: 'statisticalPeriod',
    component: 'RadioGroup',
    label: t('table.discountActivity.statistical_period'),
    labelWidth: 105,
    defaultValue: 1,
    required: true,
    colProps: {
      span: 24,
    },
    helpMessage: '-',
    serialNumber: '2',
    helpComponentProps: {
      text: `<div style="color:#FACD91;">${t('v.discount.activity.every_bet')}：</div>
      <div><span>${t('v.discount.activity.current_day')}：</span>${t(
        'common.statistics_sameday',
      )}</div>
      <div><span>${t('v.discount.activity.sec_day')}：</span>${t('common.statistics_nextday')}</div>
      <div><span>${t('v.discount.activity.current_weed')}：</span>${t(
        'common.statistics_nextweek',
      )}</div>
      <div><span>${t('v.discount.activity.current_month')}：</span>${t(
        'common.statistics_nextmonth',
      )}</div>
      `,
      placement: 'right',
      isBefore: true,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('v.discount.activity.current_day'),
            value: 1,
          },
          {
            label: t('v.discount.activity.sec_day'),
            value: 2,
          },
          {
            label: t('v.discount.activity.current_weed'),
            value: 3,
          },
          {
            label: t('v.discount.activity.current_month'),
            value: 4,
          },
        ],
        onChange: (e) => {
          if (formModel.ty == 6) {
            const val = e.target ? e.target?.value : e;
            eventBus.emit('onEvertBetTextChange', { value: val, type: 'day' });
          }
        },
      };
    },
  },
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 'auto',
    serialNumber: '3',
    component: 'RadioGroup',
    required: true,
    defaultValue: 3,
    colProps: {
      class: 'pop_componentProps',
      span: 9,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
      },
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => values.platform_range == 2,
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '4',
    label: t('v.discount.activity.CurrencyConfig'),
    rules: [
      {
        required: true,
        validator(_rule) {
          return Promise.resolve();
        },
      },
    ],
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
      style: { marginTop: '20px' },
    },
  },
  {
    field: 'rewardConfig',
    component: 'Input',
    slot: 'rewardConfigSlot',
    colProps: {
      span: 12,
    },
  },
];
export const LuckyBetTy7: FormSchema[] = [
  {
    field: 'luckyBetBetTitle',
    component: 'InputNumber',
    slot: 'luckyBetBetTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'period',
    component: 'RadioGroup',
    label: t('v.discount.activity.billing'),
    labelWidth: 'auto',
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
      class: 'noMagin_f',
    },
    defaultValue: 1,
    helpMessage: ' ',
    helpComponentProps: {
      maxWidth: '100',
      text: `<p><span style="color:#FACD91">${t('v.discount.activity.billing')}：</span>${t(
        'v.discount.activity.perioBilling_des',
      )}</p>`,
      isBefore: true,
      placement: 'left',
    },
    slot: 'perioBilling',
    serialNumber: '1',
  },
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 'auto',
    serialNumber: '2',
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 9,
    },
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],

      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
      },
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => values.platform_range == 2,
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '3',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
      style: { marginTop: '20px' },
    },
  },
  {
    field: 'incentiveConfig',
    label: t('v.discount.activity.Venue_set'),
    serialNumber: '4',
    labelWidth,
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps my-2 claims_RadioGroup',
      span: 24,
      style: { marginTop: '20px' },
    },
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.claims'),
          value: 1,
        },
        {
          label: t('common.betAllocation'),
          value: 2,
        },
      ],

      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('incentiveConfig', data);
      },
    },
  },
  {
    field: 'Lucky_bet',
    component: 'Input',
    slot: 'Lucky_betSlot',
    colProps: {
      span: 12,
    },
  },
];

export const checkIn9: FormSchema[] = [
  {
    field: 'checkIn_Title',
    component: 'InputNumber',
    slot: 'checkIn_Title',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '1',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    rules: [
      {
        required: true,
        validator(_rule) {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    serialNumber: '2',
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('formChange_m');
        eventBus.emit('change_Venue_statistics', data);
      },
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.platform_range == 2;
    },
  },
  {
    field: 'period',
    component: 'RadioGroup',
    label: t('table.discountActivity.statistical_period'),
    defaultValue: 'weekly',
    required: true,
    labelWidth: 'auto',
    colProps: {
      span: 24,
      class: 'adward-type',
    },
    componentProps: ({ formModel }) => {
      return {
        options: cycleBs,
        onChange: (e) => {
          const val = e.target ? e.target.value : e;
          eventBus.emit('formChange_m');
          eventBus.emit('onmultipleText9', { value: val, type: 'period' });
          // if (value.target) formModel.cycle_offset = 1;
        },
      };
    },
    serialNumber: '3',
  },
  {
    field: 'loop',
    component: 'RadioGroup',
    label: t('table.discountActivity.discountActivity_cycle_mode'),
    required: true,
    defaultValue: 1,
    labelWidth: 'auto',
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('common.mystery3'), value: 1 },
          { label: t('common.mystery2'), value: 2 },
        ],
        onChange: (e) => {
          const val = e.target ? e.target.value : e;
          eventBus.emit('formChange_m');
        },
      };
    },
    serialNumber: '4',
  },
  {
    field: 'type',
    component: 'RadioGroup',
    serialNumber: '5',
    label: t('v.discount.activity.Venue_set'),
    defaultValue: 1,
    labelWidth,
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('modalForm.finance.finance_fix_amount'), value: 1 },
          { label: t('common.recharge_ratio'), value: 2 },
          { label: t('common.code_ratio'), value: 3 },
        ],
        onChange: async (e) => {
          eventBus.emit('formChange_m');
          const current = e.target ? e.target.value : e;
        },
      };
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'activity9_sign_in',
    component: 'Input',
    slot: 'activity9_sign_in',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'checkIn_Title',
    component: 'InputNumber',
    slot: 'checkIn_Title',
    labelPrefixWidth: 'right',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'extra',
    component: 'RadioGroup',
    label: t('common.extra_rewards'),
    serialNumber: '6',
    labelPrefixWidth: 'right',
    required: true,
    colProps: {
      span: 24,
    },
    defaultValue: 1,
    componentProps: () => {
      return {
        options: [
          {
            label: t('business.common_no'),
            value: 0,
          },
          {
            label: t('business.common_yes'),
            value: 1,
          },
        ],
        onChange: (e) => {
          const val = e.target ? e.target.value : e;
          eventBus.emit('formChange_m');
          eventBus.emit('onmultipleText9', { value: val, type: 'extra' });
        },
      };
    },
  },
  {
    field: 'checkin_additional_slot',
    component: 'Input',
    labelPrefixWidth: 'right',
    slot: 'activity9_additional',
    colProps: {
      span: 24,
    },
    // ifShow:({ model }) => model.extra == 1,  会销毁模版导致数据丢失
    show: ({ model }) => model.extra == 1,
  },
];

export const LuckyBetTy14: FormSchema[] = [
  {
    field: 'Title',
    component: 'InputNumber',
    slot: 'wallet_Title',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'cycleMode',
    component: 'RadioGroup',
    label: t('table.discountActivity.discountActivity_cycle_mode'),
    required: true,
    defaultValue: 1,
    labelWidth: 'auto',
    colProps: {
      span: 24,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<div><span style='color:#FFCB00;'>${t(
        'table.discountActivity.discountActivity_cycle_mode',
      )}: </span>${t('table.discountActivity.discountActivity_cycle_mode_tips')}</div>
                `,
      placement: 'right',
      isBefore: true,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('table.discountActivity.discountActivity_cycle_mode_tips1'), value: 1 },
          // { label: t('table.discountActivity.discountActivity_cycle_mode_tips2'), value: 2 },
          // { label: t('table.discountActivity.discountActivity_cycle_mode_tips3'), value: 3 },
        ],
        onChange: (e) => {
          const val = e.target ? e.target.value : e;
          eventBus.emit('onChargeDynamicText', { value: val, type: 'cycleMode' });
        },
      };
    },
    serialNumber: '1',
    // ifShow: ({ model }) => model.chargeCondition == 2,
    // dynamicDisabled: ({ values }) => {
    //   // //return !!values.id;
    // },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '2',
  },
  {
    field: 'wallet_slot',
    component: 'Input',
    slot: 'wallet_slot',
    serialNumber: '3',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rewardMethods',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_type'),
    labelWidth,
    required: true,
    serialNumber: '4',
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('modalForm.finance.finance_fix_amount'), value: 1 },
          { label: t('table.discountActivity.discountActivity_random_amount'), value: 2 },
          { label: t('table.discountActivity.discountActivity_proportional_amount'), value: 3 },
        ],
        onChange: async (e) => {
          const current = e.target ? e.target.value : e;
          eventBus.emit('formChange_m');
          eventBus.emit('onRewardMethodsChange', current);
        },
      };
    },
    colProps: {
      span: 24,
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id;
    },
  },
  {
    field: 'chargeDetail',
    component: 'Input',
    slot: 'chargeDetail14_slot',
    colProps: {
      span: 24,
    },
  },
];
// 邀请好友 ty === 18
const selectedInviteFriendsBonusType = ref<number[]>([]);
export const inviteFriends: FormSchema[] = [
  {
    field: 'validInvitationCriteria',
    component: 'InputNumber',
    slot: 'validInvitationCriteria',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'currencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '1',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    rules: [
      {
        required: true,
        validator(_rule) {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    field: 'inviteFriendsBonusType',
    serialNumber: '2',
    label: t('v.discount.activity.bonus_type'),
    component: 'CheckboxGroup',
    defaultValue: [1, 2, 3],
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value || value.length === 0) {
            return Promise.reject(new Error(t('v.discount.activity.please_select_bonus_method')));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('v.discount.activity.accumulated_deposits'),
          value: 1,
        },
        {
          label: t('v.discount.activity.Cashback_configuration2'),
          value: 2,
        },
        {
          label: t('v.discount.activity.single_deposit'),
          value: 3,
        },
      ],
      onChange: (value) => {
        eventBus.emit('inviteFriendsBonusTypeCheckbox', value);
        selectedInviteFriendsBonusType.value = value;
      },
    },
  },
  {
    field: 'inviteFriendsBonusTypeInfo',
    component: 'Input',
    slot: 'inviteFriendsBonusTypeTable',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 'auto',
    serialNumber: '3',
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
      },
    },
    ifShow: () => {
      return selectedInviteFriendsBonusType.value.includes(2);
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return selectedInviteFriendsBonusType.value.includes(2) && values.platform_range == 2; //默认类型
    },
  },
];
const beforeChangeCycleMode = ref();
function formatValidator(_: any, value: string) {
  if (!value) {
    return Promise.reject(t('common.enter_time'));
  } else {
    const regex = /^[1-9]\d*$/;
    if (!regex.test(value)) {
      return Promise.reject(t('common.enter_integer'));
    } else {
      return Promise.resolve();
    }
  }
}

export const charge8: FormSchema[] = [
  {
    field: 'chargeTitle',
    component: 'InputNumber',
    slot: 'chargeTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'chargeCondition',
    component: 'RadioGroup',
    label: t('table.report.report_deposit_charge_condition'),
    required: true,
    labelWidth,
    defaultValue: 1,
    componentProps: ({ formActionType, formModel }) => {
      return {
        options: [
          { label: t('v.discount.activity.first_deposit_amount'), value: 1 },
          { label: t('v.discount.activity.total_deposit_amount'), value: 2 },
          { label: t('v.discount.activity.Topup_text3'), value: 3 },
        ],
        onChange: async (e) => {
          const { cycleMode } = await formActionType.getFieldsValue();
          beforeChangeCycleMode.value = cycleMode || 1;
          const current = e.target?.value;
          if (current == 2) {
            formActionType.setFieldsValue({
              cycleMode: beforeChangeCycleMode.value,
            });
          }
          if (current == 3) {
            formActionType.setFieldsValue({
              automatic: 2,
            });
          }
          if (formModel.ty == 8) {
            const val = e.target ? e.target.value : e;
            eventBus.emit('onChargeDynamicText', { value: val, type: 'chargeType' });
          }
        },
      };
    },
    colProps: {
      span: 24,
    },
    dynamicDisabled: ({ values }) => {
      //return !!values.id;
    },
    show: false,
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '1',
  },
  {
    field: 'isChargeTime',
    component: 'Select',
    label: t('v.discount.activity.Topup_text4'),
    labelWidth: 265,
    // required: true,
    defaultValue: 1,
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    // rules: [{ required: true, message: t('v.discount.activity.Topup_text4_select') }],
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('v.discount.activity.Topup_text5'), value: 1 },
          { label: t('v.discount.activity.Topup_text6'), value: 0 },
        ],
        getPopupContainer: () => document.body,
        onChange: (v) => {
          if (formModel.ty == 8) {
            eventBus.emit('onChargeDynamicText', { value: v, type: 'isLimit' });
          }
        },
      };
    },
    colProps: { span: 8, style: { marginRight: '8px' }, class: 'isChargeTime' },
    ifShow: ({ model }) => model.chargeCondition == 1,
    dynamicDisabled: ({ values }) => {
      //return !!values.id;
    },
    serialNumber: '2',
  },
  {
    field: 'chargeTimeList',
    component: 'Input',
    defaultValue: { num: '', selectValue: 1 },
    render: ({ model, field }) => {
      return h(
        'div',
        {
          style: { display: 'flex', alignItems: 'center' },
        },
        [
          h(
            FormItem,
            {
              label: '',
              name: ['chargeTimeList', 'num'],
              style: { width: '60%%', marginRight: '10px' },
              rules: [
                {
                  trigger: 'blur',
                  required: true,
                  validator: formatValidator,
                },
              ],
            },
            h(Input, {
              value: model[field]?.num,
              size: 'large',
              placeholder: t('table.promotion.promotion_please_enter'),
              // disabled: model.id ? true : false,
              style: { height: '40px' },
              onChange: (e) => {
                model[field] = { ...model[field], num: e.target.value }; // 更新 num 值
                if (model.ty == 8) {
                  const val = e.target ? e.target?.value : e;
                  eventBus.emit('onChargeDynamicText', { value: val, type: 'time' });
                }
              },
            }),
          ),

          h(
            FormItem,
            {
              label: '',
              name: ['chargeTimeList', 'selectValue'],
              style: { width: '40%' },
            },
            h(Select, {
              value: model[field]?.selectValue || 1,
              size: 'large',
              defaultValue: 1,
              placeholder: t('common.chooseText'),
              // disabled: model.id ? true : false,
              style: { height: '40px' },
              options: [
                { label: t('component.time.minutes'), value: 1 },
                { label: t('component.time.hours'), value: 2 },
              ],
              onChange: (value) => {
                model[field] = { ...model[field], selectValue: value }; // 更新 selectValue
                eventBus.emit('onChargeDynamicText', { value: value, type: 'timeUnit' });
              },
              getPopupContainer: () => document.body,
            }),
          ),
          h(FormItem, { style: { marginLeft: '6px' } }, t('common.within')),
        ],
      );
    },

    colProps: {
      span: 5,
      style: { height: '60px', marginLeft: '26px' },
    },
    ifShow: ({ model }) => model.chargeCondition == 1 && model.isChargeTime == 1,
  },
  {
    field: 'chargeBlock',
    component: 'InputNumber',
    slot: 'chargeBlock',
    colProps: {
      span: 9,
    },
    ifShow: ({ model }) => model.chargeCondition == 1,
  },
  // {
  //   field: 'firstDepositPop',
  //   component: 'Select',
  //   label: t('v.discount.activity.firstDepositPop'),
  //   labelWidth,
  //   defaultValue: 1,
  //   required: true,
  //   rules: [
  //     {
  //       required: true,
  //       validator(_rule, value) {
  //         return Promise.resolve();
  //       },
  //     },
  //   ],
  //   // rules: [{ required: true, message: t('v.discount.activity.firstDepositPop_select') }],
  //   componentProps: ({ formActionType, formModel }) => {
  //     return {
  //       options: [
  //         { label: t('business.common_yes'), value: 1 },
  //         { label: t('business.common_no'), value: 2 },
  //       ],
  //       onChange: async (value) => {
  //         if (value == 1) {
  //           formActionType.setFieldsValue({
  //             appearLocation: 1,
  //           });
  //         }
  //       },
  //     };
  //   },
  //   colProps: { span: 7, style: { marginRight: '8px' }, class: 'isChargeTime' },
  //   serialNumber: '3',
  //   ifShow: ({ model }) => model.chargeCondition == 1,
  // },
  {
    field: 'appearLocation',
    component: 'Select',
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('v.discount.activity.firstDepositPop_1'), value: 1 },
          { label: t('v.discount.activity.firstDepositPop_2'), value: 2 },
        ],
        getPopupContainer: () => document.body,
      };
    },
    colProps: { span: 5 },
    ifShow: ({ model }) => model.chargeCondition == 1 && model.firstDepositPop == 1,
  },
  {
    field: 'cycleMode',
    component: 'RadioGroup',
    label: t('table.discountActivity.discountActivity_cycle_mode'),
    required: true,
    defaultValue: 1,
    labelWidth,
    colProps: {
      span: 24,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<div><span style='color:#FFCB00;'>${t(
        'table.discountActivity.discountActivity_cycle_mode',
      )}: </span>${t('table.discountActivity.discountActivity_cycle_mode_tips')}</div>
                `,
      placement: 'right',
      isBefore: true,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('table.discountActivity.discountActivity_cycle_mode_tips1'), value: 1 },
          { label: t('table.discountActivity.discountActivity_cycle_mode_tips2'), value: 2 },
          { label: t('table.discountActivity.discountActivity_cycle_mode_tips3'), value: 3 },
        ],
        onChange: (e) => {
          const val = e.target ? e.target.value : e;
          eventBus.emit('onChargeDynamicText', { value: val, type: 'cycleMode' });
        },
      };
    },
    ifShow: ({ model }) => model.chargeCondition == 2,
    serialNumber: '2',
  },
  {
    field: 'registerCharge',
    component: 'Select',
    label: t('table.discountActivity.discountActivity_set_days'),
    required: true,
    labelWidth: 'auto',
    colProps: {
      span: 10,
    },
    componentProps: () => {
      return {
        mode: 'multiple',
        showArrow: true,
        showSearch: false,
        options: [
          {
            label: t('table.discountActivity.discountActivity_set_num_days', { len: 2 }),
            value: 2,
          },
          {
            label: t('table.discountActivity.discountActivity_set_num_days', { len: 3 }),
            value: 3,
          },
          {
            label: t('table.discountActivity.discountActivity_set_num_days', { len: 5 }),
            value: 5,
          },
          {
            label: t('table.discountActivity.discountActivity_set_num_days', { len: 7 }),
            value: 7,
          },
          {
            label: t('table.discountActivity.discountActivity_set_num_days', { len: 15 }),
            value: 15,
          },
          {
            label: t('table.discountActivity.discountActivity_set_num_days', { len: 30 }),
            value: 30,
          },
        ],
        getPopupContainer: () => document.body,
        onChange: (value) => {
          value = value.sort((a, b) => a - b);
          eventBus.emit('onChargeDynamicText', { value: value, type: 'days' });
        },
      };
    },
    ifShow: ({ model }) => model.chargeCondition == 3,
    dynamicDisabled: ({ values }) => {
      // //return !!values.id;
    },
    serialNumber: '2',
  },
  {
    field: 'rewardMethods',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_type'),
    labelWidth,
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('modalForm.finance.finance_fix_amount'), value: 1 },
          { label: t('table.discountActivity.discountActivity_random_amount'), value: 2 },
          { label: t('table.discountActivity.discountActivity_proportional_amount'), value: 3 },
        ],
        onChange: async (e) => {
          const current = e.target ? e.target.value : e;
          eventBus.emit('onRewardMethodsChange', current);

          if (formModel.ty == 8) {
            const val = e.target ? e.target.value : e;
            eventBus.emit('onChargeDynamicText', { value: val, type: 'rewardMethods' });
          }
        },
      };
    },
    colProps: {
      span: 24,
    },
    dynamicDisabled: ({ values }) => {
      // //return !!values.id;
    },
    serialNumber: ({ model }) => {
      return model.chargeCondition == 1 ? '3' : '3';
    },
  },

  {
    field: 'chargeDetail',
    component: 'Input',
    slot: 'chargeDetail_slot',
    labelWidth,
    colProps: {
      span: 24,
    },
    serialNumber: ({ model }) => {
      return model.chargeCondition == 1 ? '4' : '4';
    },
  },
];
// 会员日活动: 奖励配置
export const LuckyBetTy12: FormSchema[] = [
  {
    field: 'Every8MemberTitle',
    component: 'InputNumber',
    slot: 'Every8MemberTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'timeType',
    label: t('common.collection_date'),
    labelWidth,
    component: 'Select',
    defaultValue: [1, 2],
    required: true,
    colProps: {
      span: 12,
    },
    componentProps: {
      options: [
        {
          label: t('common.cycle3'),
          value: 1,
        },
        {
          label: t('common.cycle5'),
          value: 2,
        },
        {
          label: t('common.cycle7'),
          value: 3,
        },
        {
          label: t('common.cycle8'),
          value: 0,
        },
      ],
      onChange: (value) => {
        // const data = value?.target?.value || value || 'recharge';
        eventBus.emit('onmultipleText12', { value: value, type: 'timeType' });
      },
      getPopupContainer: () => document.body,
    },
    serialNumber: '1',
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '2',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
  },
  {
    field: 'staticType',
    component: 'RadioGroup',
    required: true,
    colProps: {
      span: 24,
    },
    serialNumber: '3',
    label: t('common.statistic_type'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('v.discount.activity.accumulated_deposits'),
            value: 0,
          },
          {
            label: t('common.negative_profit'),
            value: 3,
          },
          {
            label: t('common.platform_loss'),
            value: 1,
          },
          {
            label: t('common.active_text12'),
            value: 2,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'recharge';
          eventBus.emit('formChange_m', formModel);
          // eventBus.emit('onmultipleText12', { value: data, type: 'reward_type' });
        },
      };
    },
  },
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}：</span>${t(
        'common.only_select_venues',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: 1,
        },
        {
          label: t('common.Designated_venue'),
          value: 2,
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
      },
    },
    ifShow: ({ values }) => {
      return [1, 2].includes(values.staticType);
    },
    serialNumber: '4',
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return [1, 2].includes(values.staticType) && values.platform_range == 2;
    },
  },
  {
    field: 'adwardType',
    component: 'RadioGroup',
    required: true,
    colProps: {
      class: 'adward-type',
      span: 24,
    },
    label: t('v.discount.activity.BonusType1'),
    defaultValue: 1,
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('common.active_text14'),
            value: 0,
          },
          {
            label: t('common.active_text15'),
            value: 1,
          },

          {
            label: t('common.active_text16'),
            value: 2,
          },
          {
            label: t('common.active_text17'),
            value: 3,
          },
        ],
        onChange: (value) => {
          const data = value?.target?.value || value || 'getself';
          eventBus.emit('formChange_m', formModel);
        },
      };
    },
    // dynamicDisabled: ({ values }) => {
    //   //return !!values.id;
    // },
    serialNumber: ({ values }) => {
      if ([1, 2].includes(values.staticType)) {
        return '5';
      } else {
        return '4';
      }
    },
  },
  {
    field: 'activity12_table',
    component: 'Input',
    required: true,
    colProps: {
      span: 12,
    },
    // serialNumber: '5',
    slot: 'activity12_table',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
  },
  // {
  //   field: 'rewardConfig',
  //   component: 'Input',
  //   slot: 'memberDayConfigSlot',
  //   colProps: {
  //     span: 24,
  //   },
  // },
];
export const agentDaysForm: FormSchema[] = [
  {
    field: 'agentDaysTitle',
    component: 'InputNumber',
    slot: 'agentDaysTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '1',
    label: t('v.discount.activity.CurrencyConfig'),
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    serialNumber: '2',
    field: 'statisticalPeriod',
    component: 'RadioGroup',
    label: t('v.discount.activity.statistical_time'),
    labelWidth,
    defaultValue: 1,
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [
          // { label: t('modalForm.finance.before_natural_day'), value: 1 },
          // { label: t('modalForm.finance.before_natural_week'), value: 2 },
          // { label: t('modalForm.finance.before_natural_month'), value: 3 },
          { label: t('modalForm.finance.every_day'), value: 1 },
        ],
      };
    },
    colProps: {
      span: 24,
    },
    dynamicDisabled: ({ values }) => {
      // //return !!values.id;
    },
  },
  {
    field: 'agentDays',
    component: 'Input',
    slot: 'agentDays_slot',
    colProps: {
      span: 24,
    },
  },
];
export const agentMonthsForm: FormSchema[] = [
  {
    field: 'agentMonthsTitle',
    component: 'InputNumber',
    slot: 'agentMonthsTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    rules: [
      {
        required: true,
        validator(_rule, value) {
          return Promise.resolve();
        },
      },
    ],
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
    serialNumber: '1',
  },
  {
    field: 'statisticalPeriod',
    component: 'RadioGroup',
    label: t('v.discount.activity.statistical_time'),
    labelWidth,
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [{ label: t('modalForm.finance.last_months'), value: 3 }],
      };
    },
    colProps: {
      span: 24,
    },
    dynamicDisabled: ({ values }) => {
      // //return !!values.id;
    },
    serialNumber: '2',
  },
  {
    field: 'getTime',
    component: 'RadioGroup',
    label: t('v.discount.activity.get_time'),
    labelWidth,
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [{ label: t('modalForm.finance.next_months'), value: 2 }],
      };
    },
    colProps: {
      span: 24,
    },
    dynamicDisabled: ({ values }) => {
      // //return !!values.id;
    },
    serialNumber: '3',
  },
  {
    field: 'agentMonths',
    component: 'Input',
    slot: 'agentMonths_slot',
    colProps: {
      span: 24,
    },
  },
];
// 定点充值活动
export const LuckyBetTy13: FormSchema[] = [
  {
    field: 'RechargeAmountTitle',
    component: 'InputNumber',
    slot: 'RechargeAmountTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'fixedTime',
    component: 'Input',
    label: t('table.discountActivity.fixedTime_display_time'), //开始时间
    labelWidth,
    colProps: {
      span: 12,
      class: 'noMagin_f',
    },
    slot: 'fixedTime',
    rules: [
      {
        required: true,
        validator(_rule, value) {
          if (typeof value === 'undefined')
            return Promise.reject(t('table.discountActivity.fixed_start_at'));
          if (!value['fixed_start_at'] || !value['fixed_end_at'])
            return Promise.reject(t('table.discountActivity.fixed_start_at'));
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '1',
  },
  {
    field: 'fixedBlock',
    component: 'InputNumber',
    slot: 'fixedBlock',
    colProps: {
      span: 11,
    },
  },
  {
    field: 'bet',
    component: 'InputNumber',
    label: t('table.race_price.table_bet_multiple'),
    rules: [
      {
        required: true,
        message: t('common.enter_bet_multiple'),
      },
    ],
    componentProps: ({ formModel }) => {
      return {
        onChange: async (e) => {
          eventBus.emit('onmultipleText13', { value: e, type: 'bet' });
        },
      };
    },
    labelWidth,
    colProps: {
      span: 12,
    },
    dynamicDisabled: ({ values }) => {
      return ischecktiem(values);
    },
    serialNumber: '2',
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
    },
    serialNumber: '3',
  },
  {
    field: 'rewardConfig',
    component: 'Input',
    slot: 'rechargeConfigSlot',
    colProps: {
      span: 12,
    },
  },
];

export const mystery15: FormSchema[] = [
  {
    field: 'mysteryTitle',
    component: 'InputNumber',
    slot: 'mysteryTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 'auto',
    serialNumber: '1',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'reset_mode',
    component: 'RadioGroup',
    label: t('common.mystery1'),
    labelWidth,
    serialNumber: '2',
    defaultValue: 'one',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('common.mystery2'), value: 'one' },
          { label: t('common.mystery3'), value: 'for' },
        ],
      };
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `
      <div><span style='color:#FFCB00;'>${t('common.mystery2')}: </span>${t(
        'common.mystery16',
      )}</div>
      <div><span style='color:#FFCB00;'>${t('common.mystery3')}: </span>${t(
        'common.mystery17',
      )}</div>
      `,
      placement: 'right',
      isBefore: true,
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'award_mode',
    component: 'RadioGroup',
    label: t('table.discountActivity.reward_methods'),
    labelWidth,
    serialNumber: '3',
    defaultValue: 1,
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('table.report.report_deposit_charge_money'), value: 'recharge' },
          { label: t('common.platform_loss'), value: 'loss' },
        ],
      };
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'reward_config',
    component: 'Input',
    serialNumber: '4',
    label: t('v.discount.activity.Venue_set'),
    slot: 'reward_config_slot',
    colProps: {
      span: 24,
    },
  },
  // {
  //   field: 'rewardMethods',
  //   component: 'RadioGroup',
  //   serialNumber: '3',
  //   label: t('v.discount.activity.bonus_type'),
  //   defaultValue: 1,
  //   labelWidth,
  //   required: true,
  //   componentProps: ({ formModel }) => {
  //     return {
  //       options: [
  //         { label: t('modalForm.finance.finance_fix_amount'), value: 1 },
  //         { label: t('table.discountActivity.discountActivity_random_amount'), value: 2 },
  //         { label: t('table.discountActivity.discountActivity_proportional_amount'), value: 3 },
  //       ],
  //       onChange: async (e) => {
  //         const current = e.target ? e.target.value : e;
  //         eventBus.emit('onRewardMethodsChange', current);
  //         if (formModel.ty == 15) {
  //           const val = e.target ? e.target.value : e;
  //           eventBus.emit('onChargeDynamicText', { value: val, type: 'rewardMethods' });
  //         }
  //       },
  //     };
  //   },
  //   colProps: {
  //     span: 24,
  //   },
  // },
  {
    field: 'chargeDetail',
    component: 'Input',
    slot: 'chargeDetail15_slot',
    colProps: {
      span: 24,
    },
  },
];

export const dayObj = {
  1: {
    zh_CN: t('v.discount.activity.current_day'),
    en_US: 'Same Day',
    pt_BR: 'Mesmo dia',
    vi_VN: 'Cùng ngày',
    th_TH: 'วันนี้',
    hi_IN: 'आज',
  },
  2: {
    zh_CN: t('v.discount.activity.sec_day'),
    en_US: 'Next Day',
    pt_BR: 'Próximo dia',
    vi_VN: 'Ngày tiếp theo',
    th_TH: 'วันถัดไป',
    hi_IN: 'अगले दिन',
  },
  3: {
    zh_CN: t('v.discount.activity.current_weed'),
    en_US: 'This Week',
    pt_BR: 'Esta semana',
    vi_VN: 'Tuần này',
    th_TH: 'สัปดาห์นี้',
    hi_IN: 'इस सप्ताह',
  },
  4: {
    zh_CN: t('v.discount.activity.current_month'),
    en_US: 'This Month',
    pt_BR: 'Este mês',
    vi_VN: 'Tháng này',
    th_TH: 'เดือนนี้',
    hi_IN: 'इस महीने',
  },
};

export const rewardTextObj = {
  1: {
    zh_CN: t('v.discount.activity.correspond_bonus'),
    en_US: 'Corresponding Bonus',
    pt_BR: 'Bônus correspondente',
    vi_VN: 'Thưởng tương ứng',
    th_TH: 'โบนัสที่เกี่ยวข้อง',
    hi_IN: 'संबंधित बोनस',
  },
  2: {
    zh_CN: t('v.discount.activity.high_bonus'),
    en_US: 'Top-tier Bonus',
    pt_BR: 'Bônus de nível máximo',
    vi_VN: 'Thưởng cao nhất',
    th_TH: 'โบนัสระดับสูงสุด',
    hi_IN: 'उच्चतम बोनस',
  },
};
export const unitObj = {
  1: {
    zh_CN: '分钟',
    en_US: 'minute',
    pt_BR: 'minuto',
    vi_VN: 'phút',
    th_TH: 'นาที',
    hi_IN: 'मिनट',
  },
  2: {
    zh_CN: '小时',
    en_US: 'hours',
    pt_BR: 'hora',
    vi_VN: 'giờ',
    th_TH: 'ชั่วโมง',
    hi_IN: 'घंटा',
  },
};
export const cycleModeObj = {
  1: {
    zh_CN: '本日',
    en_US: 'today',
    pt_BR: 'hoje',
    vi_VN: 'hôm nay',
    th_TH: 'วันนี้',
    hi_IN: 'आज',
  },
  2: {
    zh_CN: '本周',
    en_US: 'hhis Week',
    pt_BR: 'esta Semana',
    vi_VN: 'tuần này',
    th_TH: 'สัปดาห์นี้',
    hi_IN: 'इस सप्ताह',
  },
  3: {
    zh_CN: '本月',
    en_US: 'this Month',
    pt_BR: 'este Mês',
    vi_VN: 'tháng này',
    th_TH: 'เดือนนี้',
    hi_IN: 'इस महीने',
  },
};
const userStore = useUserStore();
const { getCurrencyList } = useCurrencyStore();
const allCurrencyList = ref<any>({});
const allMethodList = ref<any>({});
const currencyList = ref<any>([]);
const currencyCNY = ref<any>([]);
export let currencyList14: any = [...currencyCNY.value, ...currencyList.value];

async function fetchData() {
  try {
    allCurrencyList.value = await getAllCurrencyList({ withdraw: 1, company: 1 });
    allMethodList.value = await getAllMethodList();
    currencyList.value = setCurrencyList();

    currencyList.value = currencyList.value.filter((item) => item.clientList?.length > 0);
    currencyCNY.value = currencyList.value.filter((item) => item.id == 701);
    currencyList.value = currencyList.value.filter((item) => item.attr == 2);

    currencyList14 = [...currencyCNY.value, ...currencyList.value];
    currencyList14.selectList = currencyList14
      .reduce((acc, item) => {
        return acc.concat(item.clientList.map((Obj) => Obj.selectOptions));
      }, [])
      .flat()
      .map((item) => item.id);
  } catch (error) {
    // Handle any errors here
    console.error(error);
  }
}
fetchData();
function setCurrencyList() {
  return getCurrencyList.map((item) => {
    return {
      ...item,
      clientList: setClientList(allCurrencyList.value[item.id], item.id),
    };
  });
}

function setClientList(data, id) {
  return setConfigList(id, data);
}
function setConfigList(id, data) {
  function processItem(item) {
    item.label = item.name;
    item.value = item.id;
    const selectOptions = allMethodList.value[item.id];
    if (selectOptions) {
      selectOptions.forEach((option) => {
        option.label = option.name;
        option.value = `${option.id}%${option.name}`;
      });
    }
    item.selectOptions = selectOptions || [];
    delete item.id;
  }

  let configList = ref([]);

  if (data) {
    if (id == 701) data = data.filter((item) => item.alias === 'qb');
    data.forEach((item) => {
      processItem(item);
    });
  }

  configList = ref(data);

  return configList.value;
}
export const firstChargeObj = {
  zh_CN: '首次',
  en_US: 'first time',
  pt_BR: 'primeira vez',
  vi_VN: 'lần đầu',
  th_TH: 'ครั้งแรก',
  hi_IN: 'पहली बार',
};

export const setingFormData: FormSchema[] = [
  {
    field: 'currentCurryId',
    component: 'Input',
    label: 'currentCurryId',
    show: false,
  },
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    show: false,
  },
  {
    field: 'timeDisable',
    component: 'Input',
    label: 'timeDisable',
    defaultValue: false,
    show: false,
  },
  {
    field: 'ty2',
    component: 'Input',
    label: 'ty2',
    show: false,
  },
  {
    field: 'type8Ty',
    component: 'Input',
    label: 'type8Ty',
    defaultValue: 10001,
    show: false,
  },
  {
    field: 'ty',
    component: 'InputNumber',
    label: t('v.discount.activity.activity'), //活动子类
    defaultValue: '1',
    labelWidth,
    slot: 'typeActive',
    colProps: {
      span: 12,
    },
    show: false,
  },
  {
    field: 'types',
    component: 'InputNumber',
    label: t('v.discount.activity.ty_type'), //活动子类
    defaultValue: 1,
    labelWidth,
    slot: 'typeActive',
    colProps: {
      span: 12,
    },
    show: false,
  },
  {
    field: 'startTime',
    component: 'InputNumber',
    label: t('v.discount.activity.ty_type'), //活动子类
    defaultValue: [],
    labelWidth,
    slot: 'typeActive',
    colProps: {
      span: 12,
    },
    show: false,
  },
];

export const setingFormLeftData: FormSchema[] = [
  {
    field: 'types',
    component: 'Select',
    label: t('v.discount.activity.ty_type'), //开放终端
    defaultValue: 1,
    required: true,
    labelWidth,
    slot: 'typesSlot',
    colProps: {
      span: 24,
    },
    componentProps: {
      options: activeOptionsTy,
      getPopupContainer: () => document.body,
    },
    serialNumber: '1',
  },
  {
    field: 'activity',
    component: 'InputNumber',
    label: t('common.event_statistics'), //开放终端
    defaultValue: '1',
    labelWidth,
    required: true,
    slot: 'activeTy',
    colProps: {
      span: 24,
    },
    serialNumber: '2',
    ifShow: ({ model }) => model.types == 1,
  },
  {
    field: 'tyMain',
    component: 'InputNumber',
    label: t('v.discount.activity.activity'), //开放终端
    defaultValue: '1',
    labelWidth,
    required: true,
    slot: 'typeActive',
    colProps: {
      span: 24,
    },
    serialNumber: '3',
    ifShow: ({ model }) => model.types == 1,
  },
  {
    field: 'lang',
    component: 'CheckboxGroup',
    label: t('v.discount.activity.type_lange'), // 显示语言
    rules: [{ required: true }],
    labelWidth: langLabelWidth,
    slot: 'terminalSlot',
    helpMessage: '-',
    helpComponentProps: {
      maxWidth: '100',
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.type_lange')}：</span>${t(
        'common.type_lange_tip',
      )}`,
      isBefore: true,
      placement: 'left',
    },
    colProps: {
      span: 24,
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '4' : '2';
    },
  },
  {
    field: 'zh_name',
    label: t('table.discountActivity.discount_name'),
    labelWidth,
    component: 'Input',
    required: true,
    slot: 'zhNameTextSlot',
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator(_rule, value) {
          if (!value) return Promise.reject(t('common.enterEventName'));
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      span: 24,
      class: 'noMagin_f',
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '5' : '3';
    },
  },
  {
    field: 'timezone',
    label: t('table.discountActivity.discount_Activity_classification_1'),
    component: 'Select',
    labelWidth,
    defaultValue: timezone,
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: timezoneList,
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: () => {
      return false;
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '6' : '4';
    },
  },
  {
    field: 'startTime',
    component: 'Input',
    label: t('table.system.activity_time'), //开始时间
    required: true,
    labelWidth,
    colProps: {
      span: 24,
      class: 'noMagin_f',
    },
    slot: 'startTime',
    rules: [
      {
        required: true,

        validator(_rule, value) {
          if (typeof value === 'undefined') {
            return Promise.reject(t('table.discountActivity.discount_select_start_end_time'));
          }
          if (!value['start_at'] || !value['end_at']) {
            return Promise.reject(t('table.discountActivity.discount_select_start_end_time'));
          }
          if (new Date(value['end_at']) <= new Date(value['start_at'])) {
            return Promise.reject(t('common.time_err'));
          }
          return Promise.resolve();
        },
      },
    ],
    serialNumber: ({ values }) => {
      return values.types == 1 ? '7' : '5';
    },
  },
  {
    field: 'category_id',
    component: 'Select',
    label: t('common.activity_type_fs_ty'), //开放终端
    labelWidth,
    slot: 'categoryId',
    defaultValue: [],
    colProps: {
      span: 24,
    },
    componentProps: {
      options: [],
      mode: 'multiple',
      maxTagCount: 5,
      getPopupContainer: () => document.body,
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '8' : '6';
    },
  },
  {
    field: 'automatic',
    component: 'RadioGroup',
    label: t('table.discountActivity.discount_way'),
    required: true,
    labelWidth,
    defaultValue: 2,
    colProps: {
      span: 24,
    },
    // serialNumber: '8',
    componentProps: ({ formModel }) => {
      const options =
        formModel.ty === 18
          ? []
          : [
              {
                label: t('v.discount.activity.manual_collect_without_review'),
                value: 2,
              },
            ];
      if (
        [1, 2, 4, 16, 7, 18].includes(formModel.ty) ||
        ([10001, '10001', '10002'].includes(formModel.type8Ty) && formModel.ty === 8)
      ) {
        options.push({
          label: t('v.discount.activity.automatic_3'),
          value: 3,
        });
      }
      return {
        options,
        onChange: (e) => {
          if (formModel.ty == 7) {
            eventBus.emit('formChange_m');
          }
          if (formModel.ty == 6) {
            const val = e.target ? e.target.value : e;
            eventBus.emit('onEvertBetTextChange', { value: val, type: 'get' });
          }
          if (formModel.ty == 8) {
            const val = e.target ? e.target.value : e;
            eventBus.emit('onChargeDynamicText', { value: val, type: 'get' });
          }
        },
      };
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '9' : '7';
    },
    ifShow: ({ model }) => model.types == 1,
    dynamicDisabled: ({ values }) => {
      // //return !!values.id;
    },
  },
  {
    field: 'multiple',
    component: 'InputNumber',
    labelWidth,
    colProps: {
      span: 24,
    },
    label: t('table.discountActivity.discount_audit_multiple'),
    required: true,
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator(_rule, value) {
          if (typeof value === 'undefined')
            return Promise.reject(t('common.discount_audit_multiple'));
          return Promise.resolve();
        },
      },
    ],
    componentProps: ({ formModel }) => {
      return {
        stringMode: true,
        precision: 2,
        min: 0,
        onChange: (v) => {
          if ([7, 9, 14, 3].includes(formModel.ty)) {
            eventBus.emit('formChange_m');
          }
          if (formModel.ty == 6) {
            eventBus.emit('onEvertBetTextChange', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 8) {
            eventBus.emit('onChargeDynamicText', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 9) {
            eventBus.emit('onmultipleText9', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 10) {
            eventBus.emit('onAgentDaysDynamicText', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 11) {
            eventBus.emit('onAgentMonthsDynamicText', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 12) {
            eventBus.emit('onmultipleText12', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 13) {
            eventBus.emit('onmultipleText13', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 16) {
            eventBus.emit('onmultipleText16', { value: v, type: 'multiple' });
          }
        },
      };
    },
    dynamicDisabled: ({ values }) => {
      // return ischecktiem(values);
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '10' : '8';
    },
    ifShow: ({ model }) => model.types == 1,
  },
];

export const setingFormRightData: FormSchema[] = [
  // {
  //   field: 'multiple_',
  //   component: 'RadioGroup',
  //   label: t('common.active_text1'), //开
  //   defaultValue: 1,
  //   required: true,
  //   labelWidth,
  //   colProps: {
  //     class: 'pop_componentProps',
  //     span: 24,
  //   },
  //   componentProps: {
  //     options: [
  //       {
  //         label: t('common.all_venues'),
  //         value: 1,
  //       },
  //       {
  //         label: t('common.Designated_venue'),
  //         value: 2,
  //       },
  //     ],
  //     onChange: (value) => {
  //       const data = value?.target?.value || value || 'getself';
  //       eventBus.emit('change_Venue_statistics1', data);
  //     },
  //   },
  //   ifShow: ({ values }) => {
  //     return values.ty == 17;
  //   },
  //   dynamicDisabled: ({ values }) => {
  //     //return !!values.id ? true : false;
  //   },
  //   helpMessage: '-',
  //   helpComponentProps: {
  //     maxWidth: '100',
  //     text: `<span style='color:#FACD91;'>${t('common.active_text1')}：</span>${t(
  //       'common.active_text2',
  //     )}`,
  //     isBefore: true,
  //     placement: 'left',
  //   },
  //   // serialNumber: ({ values }) => {
  //   //   return values.types == 1 ? '11' : '7';
  //   // },
  // },
  // {
  //   field: 'platform_ids',
  //   component: 'InputNumber',
  //   slot: 'NegativeConfigType',
  //   colProps: {
  //     span: 24,
  //   },
  //   ifShow: ({ values }) => {
  //     return values.multiple_ == 2; //默认类型
  //   },
  // },
  {
    field: 'state',
    component: 'Select',
    label: t('business.common_status'), //开放终端
    defaultValue: 1,
    required: true,
    labelWidth,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: [
        {
          label: t('common.On'),
          value: 1,
        },
        {
          label: t('common.Off'),
          value: 2,
        },
      ],
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: ({ values }) => {
      // //return !!values.id ? values.state == 2 : values.state == 2 && values.defaultState == 3;
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '11' : '7';
    },
    show: false,
  },
  {
    field: 'defaultState',
    component: 'Select',
    label: t('v.discount.activity.ty_type'), //活动子类
    defaultValue: 1,
    labelWidth,
    colProps: {
      span: 12,
    },
    componentProps: {
      options: activeOptionsTy,
      getPopupContainer: () => document.body,
    },
    show: false,
  },
  {
    field: 'display_mode',
    label: t('common.display_mode'),
    labelWidth,
    component: 'RadioGroup',
    required: true,
    defaultValue: 0,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: [
        {
          label: t('common.show_all'),
          value: 0,
        },
        {
          label: t('common.show_login'),
          value: 1,
        },
        {
          label: t('common.show_banner'),
          value: 2,
        },
        {
          label: t('common.close_all'),
          value: 3,
        },
      ],
      getPopupContainer: () => document.body,
    },
    serialNumber: ({ values }) => {
      return values.types == 1 ? '11' : '7';
    },
    ifShow: ({ model }) => model.state != 2 || model.defaultState == 3,
  },
  {
    field: 'recommend',
    component: 'Switch',
    label: t('table.discountActivity.discount_recommended_activity'),
    labelWidth: 'auto',
    defaultValue: false,
    required: true,
    colProps: {
      span: 24,
    },
    serialNumber: ({ values }) => {
      if (values.defaultState == 3) {
        return values.types == 1 ? '12' : '8';
      } else {
        return values.types == 1
          ? values.state == 1
            ? '12'
            : '11'
          : values.state == 1
          ? '8'
          : '7';
      }
    },
  },
  {
    field: 'client_type',
    label: t('common.publish_type'),
    labelWidth,
    component: 'CheckboxGroup',
    defaultValue: [1, 2],
    required: true,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: [
        {
          label: 'WEB',
          value: 1,
        },
        {
          label: 'APP',
          value: 2,
        },
      ],
    },
    serialNumber: ({ values }) => {
      if (values.defaultState == 3) {
        return values.types == 1 ? '13' : '9';
      } else {
        return values.types == 1
          ? values.state == 1
            ? '13'
            : '12'
          : values.state == 1
          ? '9'
          : '8';
      }
    },
    // ifShow: ({ model }) => model.ty != 5,
  },
  {
    field: 'shortcut',
    label: t('table.discountActivity.discount_home_shortcut'),
    component: 'Input',
    labelWidth: 'auto',
    required: false,
    /* rules: [
      {
        required: true,
        message: t('common.homepage_shortcut'),
      },
    ], */
    colProps: {
      span: 24,
    },
    slot: 'shortcutSlot',
    serialNumber: ({ values }) => {
      if (values.defaultState == 3) {
        return values.types == 1 ? '14' : '10';
      } else {
        return values.types == 1
          ? values.state == 1
            ? '14'
            : '13'
          : values.state == 1
          ? '10'
          : '9';
      }
    },
    // ifShow: ({ model }) => model.ty != 5,
  },
  {
    field: 'pop',
    label: t('v.discount.activity.popup_at_homepage'),
    // slot: 'pop',
    component: 'RadioGroup',
    defaultValue: '1',
    componentProps: {
      options: [
        {
          label: t('business.common_off'),
          value: '1',
        },
        {
          label: t('v.discount.activity.not_log_in'),
          value: '2',
        },
        {
          label: t('v.discount.activity.log_in'),
          value: '3',
        },
        {
          label: t('common.active_text22'),
          value: '4',
        },
      ],
    },
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    colProps: {
      class: 'pop_componentProps',
      span: 24,
    },
    serialNumber: () => {
      return '15';
    },
    ifShow: ({ model }) =>
      model.ty == 17 ||
      model.ty == 1 ||
      model.ty === 18 ||
      (model.type8Ty == 10001 && model.ty == 8),
  },
];

export function processSetingData(type, area) {
  const setingFormLeft = area === 'setingFormLeftData';
  const setingFormRight = area === 'setingFormRightData';
  const activeTitle2 = area === 'activeTitle2';
  const activeTitle3 = area === 'activeTitle3';
  if (setingFormLeft) return [...setingFormData, ...setingFormLeftData];
  if (setingFormRight) return [...setingFormData, ...setingFormRightData];
  if (activeTitle3) return [...setingFormData, ...ImgFormData];
  if (activeTitle2) {
    if (type == 1) return [...setingFormData, ...RouletteData];
    if (type == 2) return [...setingFormData, ...promotionData];
    if (type == 3) return [...setingFormData, ...RedEnvelope];
    if (type == 4) return [...setingFormData, ...NegativeConfig];
    if (type == 5) return [...setingFormData, ...customizeConfig];
    if (type == 6) return [...setingFormData, ...everydayBetTy6];
    if (type == 7) return [...setingFormData, ...LuckyBetTy7];
    if (type == 9) return [...setingFormData, ...checkIn9];
    if (type == 8) return [...setingFormData, ...charge8];
    if (type == 10) return [...setingFormData, ...agentDaysForm];
    if (type == 11) return [...setingFormData, ...agentMonthsForm];
    if (type == 12) return [...setingFormData, ...LuckyBetTy12];
    if (type == 13) return [...setingFormData, ...LuckyBetTy13];
    if (type == 14) return [...setingFormData, ...LuckyBetTy14];
    if (type == 17) return [...setingFormData, ...activity17];
    if (type == 15) return [...setingFormData, ...mystery15];
    if (type == 16) return [...setingFormData, ...MemberThs16];
    if (type == 18) return [...setingFormData, ...inviteFriends];
  }
}
