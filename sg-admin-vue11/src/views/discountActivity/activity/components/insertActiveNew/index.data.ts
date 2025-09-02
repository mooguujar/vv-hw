import { FormSchema } from '/@/components/Form/index';
import { useI18n } from '/@/hooks/web/useI18n';
import { periodList } from '../../common/setting';
import { useRegisterbannerjumpTo } from '/@/views/common/commonSetting';
import { ref, h } from 'vue';
import { currentyOptions } from '/@/settings/commonSetting';
import eventBus from '/@/utils/eventBus';
import CdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
import { FormItem, Input, message, Select } from 'ant-design-vue';
import { timezoneList } from '/@/settings/localeSetting';
import dayjs from 'dayjs';
import { useTimezoneStore } from '/@/store/modules/timezone';
import { useCurrencyStore } from '/@/store/modules/currency';
import { getAllCurrencyList, getAllMethodList } from '/@/api/finance';

const { t } = useI18n();
const { bannerjumpTo } = useRegisterbannerjumpTo();

const timezoneStore = useTimezoneStore();
const timezone = ref(timezoneStore.getTimezone || dayjs.tz.guess());

function ischecktiem(values) {
  if (values.timeDisable) return false;
  return !!values.id && dayjs().isAfter(values.startTime.start_at);
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

export const leftFormData: FormSchema[] = [
  {
    field: 'basic-info',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo',
  },
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
    field: 'activity',
    component: 'InputNumber',
    label: t('v.discount.activity.ty_type'), //开放终端
    defaultValue: '1',
    labelWidth: 120,
    slot: 'activeTy',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'ty',
    component: 'InputNumber',
    label: t('v.discount.activity.activity'), //活动子类
    defaultValue: '1',
    labelWidth: 120,
    slot: 'typeActive',
    colProps: {
      span: 12,
    },
    show: false,
  },
  {
    field: 'tyMain',
    component: 'InputNumber',
    label: t('v.discount.activity.activity'), //开放终端
    defaultValue: '1',
    labelWidth: 120,
    slot: 'typeActive',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'lang',
    component: 'CheckboxGroup',
    label: t('v.discount.activity.type_lange'), //开放终端
    rules: [{ required: true }],
    labelWidth: 120,
    // defaultValue: ['zh_CN'],
    slot: 'terminalSlot',
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.type_lange')}：</span>${t(
        'common.type_lange_tip',
      )}`,
      placement: 'right',
      isBefore: true,
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'zh_name',
    label: t('table.discountActivity.discount_name'),
    labelWidth: 120,
    component: 'Input',
    required: true,
    slot: 'zhNameTextSlot',
    rules: [
      {
        required: true,
        trigger: 'blur',
        validator(_rule, value) {
          if (typeof value === 'undefined') return Promise.reject(t('common.enterEventName'));
          return Promise.resolve();
        },
      },
      {
        max: 30,
      },
    ],
    colProps: {
      span: 12,
    },
  },
  {
    field: 'timezone',
    label: t('table.discountActivity.discount_Activity_classification_1'),
    component: 'Select',
    labelWidth: 120,
    defaultValue: timezone,
    required: true,
    colProps: {
      span: 12,
    },
    componentProps: {
      options: timezoneList,
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: ({ values }) => {
      // return ischecktiem(values);
      return true;
    },
  },
  {
    field: 'basic-block',
    component: 'Input',
    label: '',
    colProps: {
      span: 12,
    },
    slot: 'basicblock',
  },
  {
    field: 'startTime',
    component: 'Input',
    label: t('business.common_period_start'), //开始时间
    required: true,
    labelWidth: 120,
    colProps: {
      span: 12,
    },
    slot: 'startTime',
    rules: [
      {
        required: true,
        validator(_rule, value) {
          if (typeof value === 'undefined')
            return Promise.reject(t('table.discountActivity.discount_select_start_end_time'));
          if (!value['start_at'] || !value['end_at'])
            return Promise.reject(t('table.discountActivity.discount_select_start_end_time'));
          return Promise.resolve();
        },
      },
    ],
    ifShow: ({ values }) => {
      return values.ty !== 5; //默认类型
    },
  },
  {
    field: 'showTime',
    component: 'Input',
    label: t('table.discountActivity.discount_display_time'), //开始时间
    required: true,
    labelWidth: 120,
    colProps: {
      span: 12,
    },
    slot: 'showTime',
    rules: [
      {
        required: true,
        validator(_rule, value) {
          if (typeof value === 'undefined') return Promise.reject(t('common.translate.word6'));
          if (!value['display_start_at'] || !value['display_end_at'])
            return Promise.reject(t('common.translate.word6'));
          return Promise.resolve();
        },
      },
    ],
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
    field: 'client_type',
    label: t('v.discount.activity.type_client_type'),
    labelWidth: 120,
    component: 'CheckboxGroup',
    defaultValue: [1, 2],
    required: true,
    colProps: {
      span: 8,
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
  },
  {
    field: 'pop',
    label: t('v.discount.activity.type_pop'),
    labelWidth: 120,
    component: 'RadioGroup',
    defaultValue: '1',
    colProps: {
      span: 9,
    },
    componentProps: {
      options: [
        {
          label: t('common.On'),
          value: '1',
        },
        {
          label: t('common.Off'),
          value: '2',
        },
      ],
    },
    ifShow: ({ values }) => {
      return values.ty == 1;
    },
  },
  {
    field: 'shortcut',
    label: t('table.discountActivity.discount_home_shortcut'),
    component: 'Input',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    slot: 'shortcutSlot',
  },
  {
    field: 'multiple',
    component: 'InputNumber',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    label: t('table.discountActivity.discount_audit_multiple'),
    rules: [
      {
        required: true,
        message: t('common.discount_audit_multiple'),
      },
    ],
    ifShow: ({ values }) => {
      return (
        values.ty === 1 ||
        values.ty === 2 ||
        values.ty === 4 ||
        values.ty === 3 ||
        values.ty === 6 ||
        values.ty === 7 ||
        values.ty === 8 ||
        values.ty === 9 ||
        values.ty === 10 ||
        values.ty === 11 ||
        values.ty === 12 ||
        values.ty === 14 ||
        values.ty === 13 ||
        values.ty === 15
      ); //默认类型
    },
    componentProps: ({ formModel }) => {
      return {
        stringMode: true,
        precision: 2,
        min: 0,
        onChange: (v) => {
          if (formModel.ty == 7 || formModel.ty == 9 || formModel.ty == 14) {
            eventBus.emit('formChange_m');
          }
          if (formModel.ty == 6) {
            eventBus.emit('onEvertBetTextChange', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 8) {
            eventBus.emit('onChargeDynamicText', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 10) {
            eventBus.emit('onAgentDaysDynamicText', { value: v, type: 'multiple' });
          }
          if (formModel.ty == 11) {
            eventBus.emit('onAgentMonthsDynamicText', { value: v, type: 'multiple' });
          }
        },
      };
    },
    dynamicDisabled: ({ values }) => {
      return ischecktiem(values);
    },
  },
  {
    field: 'recommend',
    component: 'RadioGroup',
    label: t('table.discountActivity.discount_recommended_activity'),
    labelWidth: 120,
    defaultValue: 2,
    required: true,
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: t('table.discountActivity.discount_not_recommend'),
          value: 2,
        },
        {
          label: t('table.promotion.promotion_recommended'),
          value: 1,
        },
      ],
    },
  },
  {
    field: 'basic-info2',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo2',
    ifShow: ({ values }) => {
      return values.ty === 1 || values.ty === 4 || values.ty === 6 || values.ty === 8; //默认类型
    },
  },
  {
    field: 'automatic',
    component: 'RadioGroup',
    label: t('table.discountActivity.discount_way'),
    required: true,
    labelWidth: 120,
    defaultValue: 2,
    colProps: {
      span: 8,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('v.discount.activity.manual_collect_without_review'),
            value: 2,
          },
          {
            label: t('v.discount.activity.automatic_3'),
            value: 3,
          },
        ],
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
    ifShow: ({ values }) => {
      return (
        values.ty === 1 || values.ty === 4 || values.ty === 6 || values.ty === 7 || values.ty === 8
      ); //默认类型
    },
    dynamicDisabled: ({ values, formActionType }) => {
      if (values.ty == 8 && values.chargeCondition == 3) {
        formActionType.setFieldsValue({
          automatic: 2,
        });
      }
      return !!values.id || values.chargeCondition == 3;
    },
  },
  {
    field: 'rewardMethods',
    component: 'RadioGroup',
    label: t('table.discountActivity.reward_methods'),
    labelWidth: 120,
    defaultValue: 1,
    colProps: {
      span: 24,
    },
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
    ifShow: ({ values }) => {
      return values.ty === 6; //默认类型
    },
  },
  {
    field: 'statisticalPeriod',
    component: 'RadioGroup',
    label: t('table.discountActivity.statistical_period'),
    labelWidth: 120,
    defaultValue: 1,
    colProps: {
      span: 24,
    },
    helpMessage: '-',
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
    ifShow: ({ values }) => {
      return values.ty === 6; //默认类型
    },
  },
  {
    field: 'apply_limit',
    component: 'RadioGroup',
    helpMessage: ' ',
    labelWidth: 120,
    colProps: {
      span: 13,
    },
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
    ifShow: ({ values }) => {
      return values.ty === 1; //默认类型
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'period',
    component: 'RadioGroup',
    label: t('table.discountActivity.discount_bouns_clear'),
    defaultValue: 1,
    labelWidth: 120,
    helpMessage: ' ',
    colProps: {
      span: 13,
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
    ifShow: ({ values }) => {
      return values.ty === 1; //默认类型
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'period',
    component: 'RadioGroup',
    label: t('v.discount.activity.billing'),
    labelWidth: 120,
    colProps: {
      span: 8,
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
    ifShow: ({ values }) => {
      return values.ty === 7; //默认类型
    },
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
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'first_deposit_amount',
    component: 'InputNumber',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
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
      return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_deposit_amount',
    component: 'InputNumber',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
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
      return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_bet_amount',
    component: 'InputNumber',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
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
      return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_deposit_days',
    component: 'InputNumber',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    label: t('v.discount.activity.total_deposit_days'),
    // required: true,
    componentProps: {
      stringMode: true,
      precision: 0,
      min: 0,
      placeholder: t('v.discount.activity.total_deposit_days_placeholder'),
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'total_deposit_times',
    component: 'InputNumber',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    label: t('v.discount.activity.total_deposit_times'),
    // required: true,
    componentProps: {
      stringMode: true,
      placeholder: t('v.discount.activity.total_deposit_times_placeholder'),
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id && !!values.ty2;
    },
  },
  {
    field: 'condition_type',
    component: 'RadioGroup',
    labelWidth: 120,
    colProps: {
      span: 8,
    },
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
      return !!values.id;
    },
  },
  {
    field: 'basicPromotion',
    component: 'InputNumber',
    slot: 'basicPromotion',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'bonus_tpl',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_tpl'),
    required: true,
    defaultValue: 1,
    labelWidth: 120,
    colProps: {
      span: 7,
    },
    componentProps: () => {
      return {
        options: [
          {
            label: t('v.discount.activity.bonus_tpl_1'),
            value: 1,
          },
          {
            label: t('v.discount.activity.bonus_tpl_2'),
            value: 2,
          },
          {
            label: t('v.discount.activity.bonus_tpl_3'),
            value: 3,
          },
        ],
      };
    },
  },
  {
    field: 'show_amount',
    component: 'RadioGroup',
    label: t('v.discount.activity.show_amount'),
    required: true,
    labelWidth: 120,
    colProps: {
      span: 5,
    },
    defaultValue: 2,
    componentProps: () => {
      return {
        options: [
          {
            label: t('v.discount.activity.show_amount_1'),
            value: 2,
          },
          {
            label: t('v.discount.activity.show_amount_2'),
            value: 1,
          },
        ],
      };
    },
  },
  {
    field: 'bonus_type',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_type'),
    required: true,
    defaultValue: 1,
    labelWidth: 120,
    colProps: {
      span: 5,
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
      return !!values.id;
    },
  },
  {
    field: 'automatic',
    component: 'RadioGroup',
    label: t('v.discount.activity.automatic2'),
    labelWidth: 70,
    required: true,
    defaultValue: 2,
    colProps: {
      span: 7,
    },
    componentProps: () => {
      return {
        options: [
          // {
          //   label: t('v.discount.activity.automatic_1'),
          //   value: 1,
          // },
          {
            label: t('v.discount.activity.manual_collect_without_review'),
            value: 2,
          },
          {
            label: t('v.discount.activity.automatic_3'),
            value: 3,
          },
        ],
      };
    },
    ifShow: ({ values }) => {
      return values.bonus_type === 1; //默认类型
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'settings',
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

// ty==1 轮盘
export const RouletteData: FormSchema[] = [
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
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'pay',
    component: 'InputNumber',
    defaultValue: 1,
    required: true,
    slot: 'payConfig',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.ty == 1; //默认类型
    },
  },
  {
    field: 'RouletteBase2',
    component: 'InputNumber',
    slot: 'RouletteBase2',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'portfolioAll',
    component: 'InputNumber',
    slot: 'portfolioAll',
    ifShow: ({ values }) => {
      return values.ty == 1; //默认类型
    },
  },
  {
    field: 'RouletteBase3',
    component: 'InputNumber',
    slot: 'RouletteBase3',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.ty === 1 && values.id; //默认类型
    },
  },
  {
    field: 'phoneLanguage',
    component: 'Input',
    labelWidth: 120,
    label: t('v.discount.activity.phoneLanguage'),
    slot: 'phoneLanguage',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.ty === 1 && values.id; //默认类型
    },
  },
  {
    field: 'phoneConfig',
    component: 'Input',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    label: t('v.discount.activity.phoneConfig'),
    slot: 'phoneConfig',
    ifShow: ({ values }) => {
      return values.ty === 1 && values.id; //默认类型
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
    labelWidth: 120,
    component: 'RadioGroup',
    defaultValue: 1,
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
      // getPopupContainer: () => document.body,
      onChange: (value) => {
        var data = value?.target?.value || value || 'getself';
        eventBus.emit('change_Venue_statistics', data);
      },
    },
    ifShow: ({ values }) => {
      return values.ty === 4; //默认类型
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
      return values.ty === 4; //默认类型
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'prize_limit',
    component: 'InputNumber',
    label: t('v.discount.activity.prize_limit'),
    required: true,
    labelWidth: 120,
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
    ifShow: ({ values }) => {
      return values.ty === 4; //默认类型
    },
  },
  {
    field: 'negativeProfit',
    component: 'Input',
    labelWidth: 120,
    rules: [
      {
        required: true,
        validator: (rule, value) => {
          return Promise.resolve();
        },
      },
    ],
    label: t('v.discount.activity.Cashback_configuration'),
    slot: 'negativeProfit',
  },
];

// ty==5 自定义
export const customizeConfig: FormSchema[] = [
  {
    field: 'customizeConfig',
    component: 'InputNumber',
    slot: 'customizeConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'display_type',
    label: t('v.discount.activity.display_type'),
    component: 'RadioGroup',
    defaultValue: 1,
    required: true,
    labelWidth: 120,
    colProps: {
      span: 8,
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
  },
  {
    field: 'button_type_5',
    label: t('business.button_type'),
    component: 'Select',
    defaultValue: 1,
    labelWidth: 120,
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
    field: 'button_redirect_5',
    label: t('business.banner_customer_self_defined_link'),
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    required: true,
    component: 'Input',
    ifShow: ({ values }) => {
      return values.display_type === 2 && values.button_type_5 === 1;
    },
  },
];

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
    field: 'configTem',
    component: 'Input',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    label: t('common.translate.word14'),
    slot: 'configTemSlot',
    ifShow: ({ values }) => {
      // return values.ty === 3; //抢红包
      return false; //抢红包
    },
  },
  {
    field: 'dropEnvelope',
    component: 'Input',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    slot: 'dropEnvelope',
    ifShow: ({ values }) => {
      return values.ty === 3; //抢红包
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'redEnvelope',
    component: 'Input',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    label: t('v.discount.activity.redEnvelope'),
    slot: 'redEnvelope',
    // helpMessage: '-',
    // helpComponentProps: {
    //   text: `<span style='color:#FACD91;'>有效投注：</span>单个游戏返水占比小于100%的不统计`,
    //   placement: 'right',
    //   isBefore: true,
    // },
    ifShow: ({ values }) => {
      return values.ty === 3; //抢红包
    },
    // rules: [
    //   {
    //     required: true,
    //     validator: (rule, value) => {
    //       return Promise.resolve();
    //     },
    //   },
    // ],
  },
];

//按钮配置
export const buttonFormData: FormSchema[] = [
  {
    field: 'btnConfig',
    component: 'InputNumber',
    slot: 'btnConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'button',
    label: t('business.banner_button_show'),
    component: 'RadioGroup',
    defaultValue: 1,
    labelWidth: 120,
    colProps: {
      span: 8,
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
    },
  },
  {
    field: 'button_text',
    label: t('business.banner_button_text'),
    labelWidth: 120,
    colProps: {
      span: 12,
    },
    component: 'Input',
    required: true,
    slot: 'buttonTextSlot',
    ifShow: ({ values }) => {
      return values.button === 1;
    },
  },
  {
    field: 'button_type',
    label: t('business.button_type'),
    component: 'Select',
    defaultValue: 1,
    required: true,
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    componentProps: {
      options: bannerjumpTo,
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => {
      return values.button === 1;
    },
  },
  {
    field: 'button_redirect',
    label: t('business.button_redirect_type'),
    rules: [
      {
        required: true,
        message: t('common.select_custom_link'),
      },
    ],
    labelWidth: 120,
    colProps: {
      span: 9,
    },
    component: 'Input',
    ifShow: ({ values }) => {
      return values.button === 1 && values.button_type === 1;
    },
  },
];

//按钮配置
export const buttonFormDataTy5: FormSchema[] = [
  {
    field: 'btnConfig',
    component: 'InputNumber',
    slot: 'btnConfig',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.display_type == 1;
    },
  },
  {
    field: 'button',
    label: t('business.banner_button_show'),
    component: 'RadioGroup',
    defaultValue: 1,
    labelWidth: 120,
    colProps: {
      span: 8,
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
    },
    ifShow: ({ values }) => {
      return values.display_type == 1;
    },
  },
  {
    field: 'button_text',
    label: t('business.banner_button_text'),
    labelWidth: 120,
    colProps: {
      span: 12,
    },
    component: 'Input',
    required: true,
    slot: 'buttonTextSlot',
    ifShow: ({ values }) => {
      return values.button === 1 && values.display_type == 1;
    },
  },
  {
    field: 'button_type',
    label: t('business.button_type'),
    component: 'Select',
    defaultValue: 1,
    required: true,
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    componentProps: {
      options: bannerjumpTo,
      getPopupContainer: () => document.body,
    },
    ifShow: ({ values }) => {
      return values.button === 1 && values.display_type == 1;
    },
  },
  {
    field: 'button_redirect',
    label: t('business.button_redirect_type'),
    rules: [
      {
        required: true,
        message: t('common.select_custom_link'),
      },
    ],
    labelWidth: 120,
    colProps: {
      span: 9,
    },
    component: 'Input',
    ifShow: ({ values }) => {
      return values.button === 1 && values.button_type === 1 && values.display_type == 1;
    },
  },
];
//文案配置
export const ImgFormData: FormSchema[] = [
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
    labelWidth: 120,
    colProps: {
      span: 8,
    },
  },
  {
    field: 'image',
    component: 'Input',
    // label: t('table.discountActivity.discount_upload_pic'),
    label: ' ',
    slot: 'uploadImage',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return values.activeContent == 2;
    },
  },
  {
    field: 'rule_type',
    component: 'RadioGroup',
    defaultValue: 1,
    // label: t('v.discount.activity.rule_type'),
    label: t('table.discountActivity.discount_rule_sepification'),
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    componentProps: {
      options: [
        {
          label: t('v.discount.activity.rule_type_1'),
          value: 1,
        },
        {
          label: t('v.discount.activity.rule_type_2'),
          value: 2,
        },
      ],
    },
    show: ({ values }) => {
      return values.activeContent == 1;
    },
  },
  {
    field: 'content',
    component: 'Input',
    // label: t('table.discountActivity.discount_rule_sepification'),
    label: ' ',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    slot: 'uploadText',
    ifShow: ({ values }) => {
      return values.activeContent == 1 && values.rule_type == 1;
    },
  },
  {
    field: 'content',
    component: 'Input',
    // label: t('table.discountActivity.discount_rule_sepification'),
    label: ' ',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    slot: 'uploadTextRule',
    ifShow: ({ values }) => {
      return values.activeContent == 1 && values.rule_type == 2;
    },
  },
  {
    field: 'content',
    component: 'Input',
    labelWidth: 120,
    colProps: {
      span: 24,
    },
    label: t('table.discountActivity.discount_rule_sepification_content'),
    slot: 'previewText',
    ifShow: ({ values }) => {
      return values.activeContent == 1 && values.rule_type == 2;
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
    labelWidth: 120,
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
    labelWidth: 120,
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
    labelWidth: 120,
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
    labelWidth: 120,
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
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 120,
    component: 'RadioGroup',
    defaultValue: 1,
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
      // getPopupContainer: () => document.body,
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
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rewardConfig',
    component: 'Input',
    slot: 'rewardConfigSlot',
    colProps: {
      span: 24,
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
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 120,
    component: 'RadioGroup',
    defaultValue: 1,
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
      // getPopupContainer: () => document.body,
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
  },

  {
    field: 'incentiveConfig',
    label: t('v.discount.activity.Venue_set'),
    labelWidth: 120,
    component: 'RadioGroup',
    defaultValue: 1,
    colProps: {
      class: 'pop_componentProps my-2 claims_RadioGroup',
      span: 24,
    },
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
      // getPopupContainer: () => document.body,
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
      span: 24,
    },
  },
];

export const LuckyBetTy9: FormSchema[] = [
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
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },

  // {
  //   field: 'incentiveConfig',
  //   label: t('v.discount.activity.checkin_set'),
  //   labelWidth: 120,
  //   component: 'RadioGroup',
  //   defaultValue: 1,
  //   colProps: {
  //     class: 'pop_componentProps my-2 claims_RadioGroup',
  //     span: 24,
  //   },
  //   componentProps: {
  //     options: [
  //       {
  //         label: t('common.basic_configuration'),
  //         value: 1,
  //       },
  //       {
  //         label: t('common.Departmental_scholarships'),
  //         value: 2,
  //       },
  //     ],
  //     // getPopupContainer: () => document.body,
  //     onChange: (value) => {
  //       var data = value?.target?.value || value || 'getself';
  //       eventBus.emit('incentiveConfig', data);
  //     },
  //   },
  // },
  {
    field: 'checkIn_slot',
    component: 'Input',
    slot: 'checkIn_slot',
    colProps: {
      span: 24,
    },
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
    labelWidth: 120,
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
    // ifShow: ({ model }) => model.chargeCondition == 2,
    // dynamicDisabled: ({ values }) => {
    //   // return !!values.id;
    // },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'wallet_slot',
    component: 'Input',
    slot: 'wallet_slot',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rewardMethods',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_type'),
    labelWidth: 120,
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
          if (formModel.ty == 15) {
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
      return !!values.id;
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
    labelWidth: 120,
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
      return !!values.id;
    },
    show: false,
  },
  {
    field: 'isChargeTime',
    component: 'Select',
    label: t('v.discount.activity.Topup_text4'),
    labelWidth: 120,
    rules: [
      {
        required: true,
        message: t('common.select_validity_period'),
        trigger: 'blur',
      },
    ],
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
    colProps: { span: 7, style: { marginRight: '8px' } },
    ifShow: ({ model }) => model.chargeCondition == 1,
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
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
              disabled: model.id ? true : false,
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
              value: model[field]?.selectValue,
              size: 'large',
              placeholder: t('common.chooseText'),
              disabled: model.id ? true : false,
              style: { height: '40px' },
              options: [
                { label: t('component.time.minutes'), value: 1 },
                { label: t('component.time.hours'), value: 2 },
              ],
              onChange: (value) => {
                model[field] = { ...model[field], selectValue: value }; // 更新 selectValue
                eventBus.emit('onChargeDynamicText', { value: value, type: 'timeUnit' });
              },
            }),
          ),
          h(FormItem, { style: { marginLeft: '6px' } }, t('common.within')),
        ],
      );
    },

    colProps: {
      span: 6,
      style: { height: '60px' },
    },
    ifShow: ({ model }) => model.chargeCondition == 1 && model.isChargeTime == 1,
  },
  {
    field: 'firstDepositPop',
    component: 'Select',
    label: t('v.discount.activity.firstDepositPop'),
    labelWidth: 120,
    defaultValue: 1,
    rules: [
      {
        required: true,
        message: t('common.select_first_depoist'),
      },
    ],
    componentProps: ({ formActionType, formModel }) => {
      return {
        options: [
          { label: t('business.common_yes'), value: 1 },
          { label: t('business.common_no'), value: 2 },
        ],
        getPopupContainer: () => document.body,
        onChange: async (value) => {
          if (value == 1) {
            formActionType.setFieldsValue({
              appearLocation: 1,
            });
          }
        },
      };
    },
    colProps: { span: 7 },
    ifShow: ({ model }) => model.chargeCondition == 1,
  },
  {
    field: 'appearLocation',
    component: 'Select',
    label: ' ',
    labelWidth: 20,
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
    colProps: { span: 3 },
    ifShow: ({ model }) => model.chargeCondition == 1 && model.firstDepositPop == 1,
  },
  {
    field: 'cycleMode',
    component: 'RadioGroup',
    label: t('table.discountActivity.discountActivity_cycle_mode'),
    required: true,
    defaultValue: 1,
    labelWidth: 120,
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
          if (formModel.ty == 8) {
            const val = e.target ? e.target.value : e;
            eventBus.emit('onChargeDynamicText', { value: val, type: 'cycleMode' });
          }
        },
      };
    },
    ifShow: ({ model }) => model.chargeCondition == 2,
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'registerCharge',
    component: 'Select',
    label: t('table.discountActivity.discountActivity_set_days'),
    required: true,
    labelWidth: 120,
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
      return !!values.id;
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rewardMethods',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_type'),
    labelWidth: 120,
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
      return !!values.id;
    },
  },
  {
    field: 'chargeDetail',
    component: 'Input',
    slot: 'chargeDetail_slot',
    colProps: {
      span: 24,
    },
  },
];
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
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rewardConfig',
    component: 'Input',
    slot: 'memberDayConfigSlot',
    colProps: {
      span: 24,
    },
  },
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
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'statisticalPeriod',
    component: 'RadioGroup',
    label: t('v.discount.activity.statistical_time'),
    labelWidth: 120,
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
      return !!values.id;
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
    slot: 'agentDaysTitle',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'statisticalPeriod',
    component: 'RadioGroup',
    label: t('v.discount.activity.statistical_time'),
    labelWidth: 120,
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
      return !!values.id;
    },
  },
  {
    field: 'getTime',
    component: 'RadioGroup',
    label: t('v.discount.activity.get_time'),
    labelWidth: 160,
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
      return !!values.id;
    },
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
    labelWidth: 120,
    colProps: {
      span: 12,
    },
    slot: 'fixedTime',
    rules: [
      {
        validator(_rule, value) {
          if (typeof value === 'undefined')
            return Promise.reject(t('table.discountActivity.fixed_start_at'));
          if (!value['fixed_start_at'] || !value['fixed_end_at'])
            return Promise.reject(t('table.discountActivity.fixed_start_at'));
          return Promise.resolve();
        },
      },
    ],
  },
  {
    field: 'bet',
    component: 'InputNumber',
    label: t('table.race_price.table_bet_multiple'),
    required: true,
    labelWidth: 120,
    colProps: {
      span: 8,
    },
    dynamicDisabled: ({ values }) => {
      return ischecktiem(values);
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'InputNumber',
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'rewardConfig',
    component: 'Input',
    slot: 'rechargeConfigSlot',
    colProps: {
      span: 24,
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
    labelWidth: 120,
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'statisticalPeriod',
    component: 'RadioGroup',
    label: t('table.discountActivity.discountActivity_cycle_mode'),
    labelWidth: 120,
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [{ label: t('modalForm.finance.every_day_mystery'), value: 1 }],
      };
    },
    colProps: {
      span: 24,
    },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
  },
  {
    field: 'rewardMethods',
    component: 'RadioGroup',
    label: t('v.discount.activity.bonus_type'),
    labelWidth: 120,
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

          if (formModel.ty == 15) {
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
      return !!values.id;
    },
  },
  {
    field: 'chargeDetail',
    component: 'Input',
    slot: 'chargeDetail_slot',
    colProps: {
      span: 24,
    },
  },
  // {
  //   field: 'agentDays',
  //   component: 'Input',
  //   slot: 'mystery_slot',
  //   colProps: {
  //     span: 24,
  //   },
  // },
];
export function ProcessLeftData(type) {
  if (type == 1) return [...leftFormData, ...RouletteData, ...buttonFormData, ...ImgFormData];
  if (type == 2) return [...leftFormData, ...promotionData, ...buttonFormData, ...ImgFormData];
  if (type == 3) return [...leftFormData, ...RedEnvelope, ...buttonFormData, ...ImgFormData];
  if (type == 4) return [...leftFormData, ...NegativeConfig, ...buttonFormData, ...ImgFormData];
  if (type == 6) return [...leftFormData, ...everydayBetTy6, ...buttonFormData, ...ImgFormData];
  if (type == 7) return [...leftFormData, ...LuckyBetTy7, ...buttonFormData, ...ImgFormData];
  if (type == 9) return [...leftFormData, ...LuckyBetTy9, ...buttonFormData, ...ImgFormData];
  if (type == 8) return [...leftFormData, ...charge8, ...buttonFormData, ...ImgFormData];
  if (type == 10) return [...leftFormData, ...agentDaysForm, ...buttonFormData, ...ImgFormData];
  if (type == 11) return [...leftFormData, ...agentMonthsForm, ...buttonFormData, ...ImgFormData];
  if (type == 12) return [...leftFormData, ...LuckyBetTy12, ...buttonFormData, ...ImgFormData];
  if (type == 13) return [...leftFormData, ...LuckyBetTy13, ...buttonFormData, ...ImgFormData];
  if (type == 14) return [...leftFormData, ...LuckyBetTy14, ...buttonFormData, ...ImgFormData];
  if (type == 15) return [...leftFormData, ...mystery15, ...buttonFormData, ...ImgFormData];
  return [...leftFormData, ...customizeConfig, ...buttonFormDataTy5, ...ImgFormDataTy5];
}
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
// 活动6
export const getTypeObj = {
  1: {
    zh_CN: t('v.discount.activity.get_type_no_audit'),
    en_US:
      'Bonuses can only be claimed manually by the user, and must be claimed on the same day; unclaimed bonuses will be considered forfeited.',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário e devem ser reivindicados no mesmo dia; bônus não reivindicados serão considerados como renúncia.',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và phải nhận trong cùng ngày; những phần thưởng không được nhận sẽ được coi là từ bỏ.',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และต้องขอรับในวันเดียวกัน; โบนัสที่ไม่ขอรับจะถือว่าถอนตัว.',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और इन्हें उसी दिन दावा किया जाना चाहिए; जो बोनस नहीं लिए गए हैं उन्हें त्याग माना जाएगा.',
  },
  2: {
    zh_CN: t('v.discount.activity.get_type_need_audit'),
    en_US:
      'Bonuses can only be claimed manually by the user, and we will promptly review your bonus application. Once approved, the bonus will be automatically credited to your wallet;',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário, e nós iremos revisar sua solicitação de bônus prontamente. Após a aprovação, o bônus será creditado automaticamente em sua carteira;',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và chúng tôi sẽ xem xét yêu cầu thưởng của bạn kịp thời. Sau khi được phê duyệt, phần thưởng sẽ tự động được ghi có vào ví của bạn;',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และเราจะตรวจสอบคำขอรับโบนัสของคุณอย่างรวดเร็ว เมื่อได้รับการอนุมัติ โบนัสจะถูกโอนเข้ากระเป๋าเงินของคุณโดยอัตโนมัติ;',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और हम आपकी बोनस आवेदन की तुरंत समीक्षा करेंगे। स्वीकृत होने पर, बोनस स्वचालित रूप से आपके वॉलेट में जमा कर दिया जाएगा;',
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
// 活动8
export const getTypeObj2 = {
  1: {
    zh_CN: '奖金仅支持用户手动点击领取，未领取的奖金将自动发放到钱包。',
    en_US:
      'Bonuses can only be claimed manually by the user, and unclaimed bonuses will be automatically credited to the wallet.',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário, e os bônus não reivindicados serão creditados automaticamente na carteira.',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và những phần thưởng chưa nhận sẽ tự động được ghi có vào ví.',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และโบนัสที่ไม่ได้รับจะถูกโอนเข้ากระเป๋าเงินโดยอัตโนมัติ.',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और न लिए गए बोनस स्वचालित रूप से वॉलेट में जमा किए जाएंगे.',
  },
  2: {
    zh_CN: '奖金仅支持用户手动点击领取，我们将及时审核您的奖金申请，通过后奖金将自动发放到钱包.',
    en_US:
      'Bonuses can only be claimed manually by the user, and we will promptly review your bonus application. Once approved, the bonus will be automatically credited to your wallet.',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário, e nós iremos revisar sua solicitação de bônus prontamente. Após a aprovação, o bônus será creditado automaticamente em sua carteira.',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và chúng tôi sẽ xem xét yêu cầu thưởng của bạn kịp thời. Sau khi được phê duyệt, phần thưởng sẽ tự động được ghi có vào ví của bạn.',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และเราจะตรวจสอบคำขอรับโบนัสของคุณอย่างรวดเร็ว เมื่อได้รับการอนุมัติ โบนัสจะถูกโอนเข้ากระเป๋าเงินของคุณโดยอัตโนมัติ.',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और हम आपकी बोनस आवेदन की तुरंत समीक्षा करेंगे। स्वीकृत होने पर, बोनस स्वचालित रूप से आपके वॉलेट में जमा कर दिया जाएगा.',
  },
};
const { getCurrencyList } = useCurrencyStore();
let allCurrencyList = ref<any>({});
let allMethodList = ref<any>({});
let currencyList = ref<any>([]);
let currencyCNY = ref<any>([]);
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
    let selectOptions = allMethodList.value[item.id];
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
    if (id == 701) data = data.filter((item) => item.alias == 'qb');
    data.forEach((item) => {
      processItem(item);
    });
  }

  configList = ref(data);

  return configList.value;
}

export const get_text_ty7 = (platform_range, highestNum, get_leftValues) => {
  const ty7 = {
    zh_CN: `
      活动开始后，您注册后将自动参加。
      每日在${
        platform_range.value == 1 ? '所有场馆' : '指定场馆'
      }有效投注需要满足活动条件，且注单尾号与本次活动指定号码相同，即可获得一次奖金领取机会，最高可获得${
      highestNum.value || 0
    }倍奖励。
      ${
        get_leftValues.value.automatic == 2
          ? '奖金仅支持用户手动点击领取，用户需在当日内领取，过期未领取的奖金将视为放弃。'
          : '奖金仅支持用户手动点击领取，我们将及时审核您的奖金申请，通过后奖金将自动发放到钱包。'
      }
      本次活动的所有奖金，需要${get_leftValues.value.multiple || 0}倍流水才能提现。
      本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
      为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
      `,
    en_US: `
      After the event starts, you will automatically participate once you register.
      Daily valid${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      } bets must meet the event requirements to receive the corresponding bonus once. The maximum reward is ${
      highestNum.value
    }X Reward.
      ${
        get_leftValues.value.automatic == 2
          ? 'Only users can manually click to claim the bonus, users need to claim within the day, overdue bonus will be regarded as abandoned.'
          : 'Only users can manually click to claim the bonus, we will review your bonus application in time, and the bonus will be automatically released to the wallet after passing.'
      }
      All bonuses from this event require a ${
        get_leftValues.value.multiple
      }x wagering turnover before withdrawal.
      This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
      To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
      `,
    pt_BR: `
      Após o início do evento, você será automaticamente inscrito após se registrar.
      As apostas diárias válidas ${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      }em todos os locais devem atender aos requisitos do evento, e se o último dígito do bilhete de aposta corresponder ao número designado para este evento, você terá uma chance de receber um bônus. O valor máximo da recompensa é de ${
      highestNum.value
    } Reward.
      ${
        get_leftValues.value.automatic == 2
          ? 'Os bônus devem ser resgatados manualmente pelo usuário no mesmo dia; bônus não resgatados serão considerados como renunciados.'
          : 'Os bônus suportam apenas cliques manuais dos usuários para reivindicá-los. Analisaremos seu pedido de bônus a tempo e o bônus será distribuído automaticamente para a carteira após a aprovação.'
      }
        Todos os bônus deste evento exigem um turnover de apostas de ${
          get_leftValues.value.multiple
        }x antes do saque.
        Este evento é válido apenas para atividade normal de titulares de contas individuais. É proibido alugar contas, usar trapaças, bots, múltiplas contas, negociações mútuas, arbitragem, uso de APIs, exploração de vulnerabilidades, controle em grupo ou quaisquer outros meios técnicos. Caso contrário, as recompensas podem ser canceladas, deduzidas, congeladas ou até mesmo resultar em inclusão na lista negra.
      Para evitar mal-entendidos, a plataforma reserva o direito de interpretação final deste evento.
      `,
    vi_VN: `
      Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
      Cược hợp lệ ở ${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      } hàng ngày cần phải đáp ứng điều kiện của sự kiện. Nếu số cuối của đơn cược giống với số chỉ định trong sự kiện bạn sẽ có cơ hội nhận được gấp ${
      highestNum.value
    }X lần tiền thưởng.
      ${
        get_leftValues.value.automatic == 2
          ? 'Tiền thưởng phải được nhận thủ công và nhận trong ngày. Tiền thưởng chưa nhận qua hôm sau sẽ tự động khấu trừ.'
          : 'Tiền thưởng chỉ hỗ trợ người dùng nhấp chuột thủ công để nhận chúng. Chúng tôi sẽ xem xét đơn đăng ký tiền thưởng của bạn kịp thời và tiền thưởng sẽ tự động được phân phối vào ví sau khi chuyển nó.'
      }
      Tất cả tiền thưởng từ sự kiện này yêu cầu ${
        get_leftValues.value.multiple
      }x lần vòng cược mới có thể rút.
      Bất kỳ người dùng hoặc nhóm nào nhận ưu đãi sự kiện theo cách bất thường hoặc gian lận, nền tảng có quyền đóng băng hoặc đóng tài khoản liên quan không cần thông báo và không hoàn lại tiền, người dùng sẽ bị đưa vào danh sách đen.
      Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
      `,
    hi_IN: `
      After the event starts, you will automatically participate once you register.
      Daily valid${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      } bets must meet the event requirements to receive the corresponding bonus once. The maximum reward is ${
      highestNum.value
    }X Reward.
      ${
        get_leftValues.value.automatic == 2
          ? 'Only users can manually click to claim the bonus, users need to claim within the day, overdue bonus will be regarded as abandoned.'
          : 'Only users can manually click to claim the bonus, we will review your bonus application in time, and the bonus will be automatically released to the wallet after passing.'
      }
      All bonuses from this event require a ${
        get_leftValues.value.multiple
      }x wagering turnover before withdrawal.
      This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
      To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
      `,
    th_TH: `
      After the event starts, you will automatically participate once you register.
      Daily valid${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      } bets must meet the event requirements to receive the corresponding bonus once. The maximum reward is ${
      highestNum.value
    }X Reward.
      ${
        get_leftValues.value.automatic == 2
          ? 'Only users can manually click to claim the bonus, users need to claim within the day, overdue bonus will be regarded as abandoned.'
          : 'Only users can manually click to claim the bonus, we will review your bonus application in time, and the bonus will be automatically released to the wallet after passing.'
      }
      All bonuses from this event require a ${
        get_leftValues.value.multiple
      }x wagering turnover before withdrawal.
      This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
      To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
      `,
  };
  return ty7;
};
export const get_text_ty9 = (ruleData, highestNum, get_leftValues, currencyName) => {
  let ty9: any = '';
  if (ruleData.value['zh_CN']?.cond) {
    ty9 = {
      zh_CN: `
       活动开始后，您注册后将自动参加。
       每日需要满足活动条件，在当天时间内成功签到即可领取一次相应的奖金。
       连续签到${ruleData.value['zh_CN'].day}天后重置。
       连续签到$$variable3$$天可分别获得额外奖励（若签到中断，则无法享有）。
       奖金仅支持用户手动点击领取，用户需在当天内领取，过期未领取的奖金将视为放弃。
       本次活动的所有奖金，需要${get_leftValues.value.multiple || 0}倍流水才能提现。
       本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
       为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
       `,
      en_US: `
       Once the event begins, you will automatically participate after registering.
       everyday must meet the event requirements. Successfully checking in on the same day allows you to claim the corresponding bonus once.
       Check in for resets after ${ruleData.value['en_US'].day} days.
       Check in for $$variable3$$ consecutive days to receive additional rewards each day (if the check-in is interrupted, bonuses will not be granted).
       Bonuses can only be claimed manually by users on the same day. If not claimed by the end of the day, the bonus will be considered forfeited.
       All bonuses from this event require a ${
         get_leftValues.value.multiple || 0
       }x rollover before they can be withdrawn.
       This activity is only available to account holders performing regular, human-operated actions. Renting accounts, using cheats, bots, multiple accounts, mutual boosting, arbitration, APIs, exploiting loopholes, or other technical methods are strictly prohibited. Violations may result in the cancellation or deduction of bonuses, account freezing, or blacklisting.
       To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
      pt_BR: `
       Assim que o evento começar, você será automaticamente inscrito ao se registrar.
       diário devem atender aos requisitos do evento. Realizar o check-in com sucesso no mesmo dia permite que você resgate o bônus correspondente uma vez.
       Ao fazer check-in por $$variable3$$ dias consecutivos, você receberá recompensas extras diariamente (caso o check-in seja interrompido, os bônus não serão concedidos).
       Os bônus devem ser resgatados manualmente pelo usuário no mesmo dia. Caso não sejam resgatados até o final do dia, serão considerados desistidos.
       Todos os bônus deste evento exigem ${
         get_leftValues.value.multiple || 0
       }x de rollover para serem retirados.
       Esta atividade é limitada a titulares de contas que realizem operações normais e manuais. É proibido alugar contas, usar trapaças, bots, contas múltiplas, combinações de apostas, arbitragens, APIs, exploração de falhas, ou outros métodos técnicos. Violações podem resultar no cancelamento ou dedução dos bônus, congelamento da conta ou inclusão na lista negra.
       Para evitar mal-entendidos, a plataforma se reserva o direito final de interpretação deste evento.
       `,
      vi_VN: `
       Khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
       hằng ngày hợp lệ cần phải đáp ứng điều kiện của sự kiện. Nếu bạn đăng nhập thành công trong cùng ngày,Đăng nhập đặt lại sau ${
         ruleData.value['vi_VN'].day
       } ngày.
       Đăng nhập $$variable3$$ ngày liên tục để nhận thêm phần thưởng (nếu đăng nhập bị gián đoạn, bạn sẽ không thể nhận thưởng).
       Phần thưởng chỉ hỗ trợ người dùng nhận thủ công trong ngày. Quá hạn khônhg nhận sẽ được coi là bỏ cuộc, tiền thưởng sẽ tự động khấu trừ.
       Tất cả tiền thưởng từ sự kiện này yêu cầu ${
         get_leftValues.value.multiple || 0
       } lần tiền vòng cược mới có thể rút.
       Hoạt động này được chủ tài khoản giới hạn ở các hoạt động bình thường. Nghiêm cấm cho thuê, sử dụng gian lận, robot, đồng thời sử dụng các tài khoản khác nhau, đánh lừa lẫn nhau, phân xử, giao diện, giao thức, khai thác lỗ hổng, kiểm soát nhóm và các phương tiện kỹ thuật khác. Nếu phát hiện phần thưởng có thể bị hủy hoặc khấu trừ, bị đóng băng hoặc thậm chí bị đưa vào danh sách đen.
       Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
       `,
      hi_IN: `
       Once the event begins, you will automatically participate after registering.
       everyday must meet the event requirements. Successfully checking in on the same day allows you to claim the corresponding bonus once.Check in for resets after ${
         ruleData.value['en_US'].day
       } days.
      Check in for $$variable3$$ days in a row to receive $$variable4$$${currencyName} additional rewards (not available if check-in is interrupted).
       Bonuses can only be claimed manually by users on the same day. If not claimed by the end of the day, the bonus will be considered forfeited.
       All bonuses from this event require a ${
         get_leftValues.value.multiple || 0
       }x rollover before they can be withdrawn.
       This activity is only available to account holders performing regular, human-operated actions. Renting accounts, using cheats, bots, multiple accounts, mutual boosting, arbitration, APIs, exploiting loopholes, or other technical methods are strictly prohibited. Violations may result in the cancellation or deduction of bonuses, account freezing, or blacklisting.
       To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
      th_TH: `
       Once the event begins, you will automatically participate after registering.
       everyday must meet the event requirements. Successfully checking in on the same day allows you to claim the corresponding bonus once.Check in for resets after ${
         ruleData.value['en_US'].day
       } days.
      Check in for $$variable3$$ days in a row to receive $$variable4$$${currencyName} additional rewards (not available if check-in is interrupted).
       Bonuses can only be claimed manually by users on the same day. If not claimed by the end of the day, the bonus will be considered forfeited.
       All bonuses from this event require a ${
         get_leftValues.value.multiple || 0
       }x rollover before they can be withdrawn.
       This activity is only available to account holders performing regular, human-operated actions. Renting accounts, using cheats, bots, multiple accounts, mutual boosting, arbitration, APIs, exploiting loopholes, or other technical methods are strictly prohibited. Violations may result in the cancellation or deduction of bonuses, account freezing, or blacklisting.
       To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
    };
  }
  return ty9;
};
export const get_text_ty14 = (ruleData, highestNum, get_leftValues, currencyName) => {
  let ty14: any = '';
  // if (ruleData.value['zh_CN']?.cond) {
  ty14 = {
    zh_CN: `
        活动开始后，您注册后将自动参加。您仅需要在本日完成充值并累计达到充值金额要求。
        充值越多，奖励越多，最高可获得奖励${highestNum.value || 0}CNY。
        获得奖励资格后，会在次日12点后更新，请等待奖励发放。
        奖金仅支持用户手动点击领取，领取期限为1天，次日23:59:59前未领取视为放弃。
        本次活动的所有奖金，需要${get_leftValues.value.multiple || 0}倍流水才能提现。
        本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
        为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
       `,
    en_US: `
        After the event starts, you will automatically participate once you register. You only need to complete a deposit on the same day and accumulate the required deposit amount.
        The more you deposit, the greater the rewards, with a maximum reward of ${
          highestNum.value || 0
        }CNY.
        Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
        The bonus must be manually claimed by the user within 1 day. If not claimed by 11:59:59 PM the following day, it will be considered forfeited.
        All bonuses from this event require a ${
          get_leftValues.value.multiple || 0
        }x wagering turnover before withdrawal.
        This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
        To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
    pt_BR: `
       Após o início do evento, você será automaticamente inscrito após se registrar. Você só precisa fazer um depósito no mesmo dia e acumular o valor exigido.
        Quanto maior o depósito, maior a recompensa, com um valor máximo de ${
          highestNum.value || 0
        }CNY.
        Após qualificar-se para a recompensa, ela será atualizada após as 01:00:00 do dia seguinte. Por favor, aguarde a distribuição do bônus;
        O bônus só poderá ser resgatado manualmente pelo usuário, com um prazo de 1 dia. Caso não seja resgatado até as 23:59:59 do dia seguinte, será considerado como desistência.
        Todos os bônus deste evento exigem um turnover de apostas de ${
          get_leftValues.value.multiple || 0
        }x antes do saque.
        Este evento é válido apenas para atividade normal de titulares de contas individuais. É proibido alugar contas, usar trapaças, bots, múltiplas contas, negociações mútuas, arbitragem, uso de APIs, exploração de vulnerabilidades, controle em grupo ou quaisquer outros meios técnicos. Caso contrário, as recompensas podem ser canceladas, deduzidas, congeladas ou até mesmo resultar em inclusão na lista negra.
        Para evitar mal-entendidos, a plataforma reserva o direito de interpretação final deste evento.
       `,
    vi_VN: `
        Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia. Bạn chỉ cần hoàn tất việc nạp tiền ngay hôm nay và đạt đủ yêu cầu về số tiền nạp tích lũy.
        Nạp càng nhiều, thưởng càng cao. Phần thưởng tối đa lên tới ${highestNum.value || 0}CNY.
        Sau khi đủ tư cách nhận thưởng, sự kiện sẽ tự động cập vào 01:00:00, vui lòng chờ đợi phát thưởng.
        Tiền thưởng hỗ trợ nhận thủ công, thời gian nhận là 1 ngày, trước 23:59:59 cùng ngày không nhận thưởng tiền thưởng sẽ tự động khấu trừ.
        Tất cả tiền thưởng từ sự kiện này yêu cầu  ${
          get_leftValues.value.multiple || 0
        }x lần vòng cược mới có thể rút.
        Bất kỳ người dùng hoặc nhóm nào nhận ưu đãi sự kiện theo cách bất thường hoặc gian lận, nền tảng có quyền đóng băng hoặc đóng tài khoản liên quan không cần thông báo và không hoàn lại tiền, người dùng sẽ bị đưa vào danh sách đen.
        Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
       `,
    hi_IN: `
       After the event starts, you will automatically participate once you register. You only need to complete a deposit on the same day and accumulate the required deposit amount.
        The more you deposit, the greater the rewards, with a maximum reward of ${
          highestNum.value || 0
        }CNY.
        Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
        The bonus must be manually claimed by the user within 1 day. If not claimed by 11:59:59 PM the following day, it will be considered forfeited.
        All bonuses from this event require a ${
          get_leftValues.value.multiple || 0
        }x wagering turnover before withdrawal.
        This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
        To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
    th_TH: `
        After the event starts, you will automatically participate once you register. You only need to complete a deposit on the same day and accumulate the required deposit amount.
        The more you deposit, the greater the rewards, with a maximum reward of ${
          highestNum.value || 0
        }CNY.
        Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
        The bonus must be manually claimed by the user within 1 day. If not claimed by 11:59:59 PM the following day, it will be considered forfeited.
        All bonuses from this event require a ${
          get_leftValues.value.multiple || 0
        }x wagering turnover before withdrawal.
        This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
        To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
  };
  // }
  return ty14;
};
export const firstChargeObj = {
  zh_CN: '首次',
  en_US: 'first time',
  pt_BR: 'primeira vez',
  vi_VN: 'lần đầu',
  th_TH: 'ครั้งแรก',
  hi_IN: 'पहली बार',
};
