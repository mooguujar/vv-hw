import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import eventBus from '/@/utils/eventBus';
import { TIMEZONE, useTimezoneList } from '@/settings/localeSetting';
import { ref, computed } from 'vue';

const { t } = useI18n();
const kyc = ref(0 as number);
const showLang = ref(2 as number);

export function useTaskTypeOptions() {
  const { t } = useI18n();
  /** 任务类型列表 */
  const taskTypeOptions = computed(() => [
    {
      label: t('v.discount.activity.accumulated_deposits'),
      value: 4,
    },
    { label: t('common.deposit1'), value: 8 },
    { label: t('common.active_text12'), value: 5 },
    { label: t('sys.login.registerButton'), value: 1 },
    { label: t('sys.login.download'), value: 2 },
    { label: t('common.phone_verify'), value: 3 },
    { label: t('modalForm.system.system_email_verification'), value: 6 },
    { label: t('common.kyc_certification'), value: 7, disabled: +kyc.value === 0 },
  ]);

  return { taskTypeOptions };
}

function getArrayByLang() {
  const { taskTypeOptions } = useTaskTypeOptions();
  const arr = [
    {
      field: 'cate_id',
      label: t('table.discountActivity.task_category'),
      component: 'Select',
      labelWidth: 'auto',
      defaultValue: '0',
      required: true,
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      serialNumber: '1',
      sortNum: 1,
      componentProps: () => {
        return {
          onChange: (e, option) => {},
          getPopupContainer: () => document.body,
          options: [
            {
              label: t('table.discountActivity.task_category_0'),
              value: '0',
            },
          ],
        };
      },
    },
    {
      field: 'ty',
      label: t('table.discountActivity.ty'),
      component: 'Select',
      labelWidth: 'auto',
      defaultValue: 1,
      required: true,
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      serialNumber: '2',
      sortNum: 2,
      componentProps: () => {
        return {
          options: taskTypeOptions,
          getPopupContainer: () => document.body,
          onChange: (e) => {
            eventBus.emit('tyChange', e);
          },
        };
      },
    },
    {
      field: 'names',
      label: t('table.discountActivity.task_name'),
      labelWidth: 'auto',
      component: 'Input',
      slot: 'zhNameTextSlot',
      rules: [
        {
          required: true,
          trigger: 'blur',
          validator(_rule, value) {
            if (!value || value.trim() === '') {
              return Promise.reject(new Error(t('v.discount.activity.mission_name')));
            }
            return Promise.resolve();
          },
        },
        {
          max: 30,
        },
      ],
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      serialNumber: '3',
      sortNum: 3,
    },
    {
      field: 'lang',
      component: 'CheckboxGroup',
      label: t('v.discount.activity.type_lange'),
      rules: [{ required: true }],
      labelWidth: 'auto',
      slot: 'langSlot',
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      serialNumber: '4',
      sortNum: 4,
      show: +showLang.value === 1,
    },
    {
      field: 'device',
      component: 'CheckboxGroup',
      label: t('common.show_terminal'), //展示终端
      rules: [
        {
          required: true,
          validator(_rule, value) {
            if (!Array.isArray(value) || value.length === 0) {
              return Promise.reject(new Error(t('table.member.member_choice_money1')));
            }
            return Promise.resolve();
          },
        },
      ],
      labelWidth: 'auto',
      slot: 'clientSlot1',
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      serialNumber: +showLang.value === 1 ? '5' : '4',
      sortNum: 5,
    },
    {
      field: 'time_zone',
      label: t('common.mission_time_zone'), //任务时区
      component: 'Select',
      labelWidth: 'auto',
      defaultValue: TIMEZONE.CST,
      required: true,
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      serialNumber: +showLang.value === 1 ? '6' : '5',
      sortNum: 6,
      componentProps: () => {
        return {
          onChange: (e, option) => {},
          getPopupContainer: () => document.body,
          options: useTimezoneList().map((item) => {
            return {
              label: item.label,
              value: item.value,
            };
          }),
        };
      },
    },
    {
      field: 'time',
      label: t('table.discountActivity.task_time'),
      labelWidth: 'auto',
      component: 'Input',
      colProps: {
        span: 12,
        class: 'my-col-12',
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
      serialNumber: +showLang.value === 1 ? '7' : '6',
      sortNum: 7,
    },
    {
      field: 'audit_multiple',
      component: 'InputNumber',
      labelWidth: 'auto',
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      label: t('table.discountActivity.discount_audit_multiple'),
      rules: [
        {
          required: true,
          trigger: 'blur',
          validator(_rule, value) {
            return Promise.resolve();
          },
        },
      ],
      serialNumber: +showLang.value === 1 ? '8' : '7',
      sortNum: 8,
      componentProps: () => {
        return {
          stringMode: true,
          precision: 2,
          placeholder: t('v.discount.activity.same_registered_device_limit_placeholder'),
          min: 0,
          onChange: (v) => {},
        };
      },
    },
    {
      field: 'ip_limit',
      component: 'InputNumber',
      labelWidth: 'auto',
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      label: t('common.ip_limit'), //同IP领取限制
      rules: [
        {
          required: true,
          trigger: 'blur',
          validator(_rule, value) {
            return Promise.resolve();
          },
        },
      ],
      serialNumber: +showLang.value === 1 ? '9' : '8',
      sortNum: 9,
      componentProps: () => {
        return {
          stringMode: true,
          min: 0,
          placeholder: t('v.discount.activity.same_registered_device_limit_placeholder'),
          onChange: (v) => {},
        };
      },
    },
    {
      field: 'device_limit',
      component: 'InputNumber',
      labelWidth: 'auto',
      colProps: {
        span: 12,
        class: 'my-col-12',
      },
      label: t('common.device_limit'), //同设备领取限制
      rules: [
        {
          required: true,
          trigger: 'blur',
          validator(_rule, value) {
            return Promise.resolve();
          },
        },
      ],
      serialNumber: +showLang.value === 1 ? '10' : '9',
      sortNum: 10,
      componentProps: () => {
        return {
          stringMode: true,
          min: 0,
          placeholder: t('v.discount.activity.same_registered_device_limit_placeholder'),
          onChange: (v) => {},
        };
      },
    },
  ];

  if (+showLang.value === 1) {
    const order1 = [1, 6, 2, 7, 3, 8, 4, 9, 5, 10];
    return arr.sort((a, b) => order1.indexOf(+a.sortNum) - order1.indexOf(+b.sortNum));
  } else if (+showLang.value === 2) {
    const order2 = [1, 7, 2, 8, 3, 9, 5, 10, 6];
    return arr.sort((a, b) => order2.indexOf(+a.sortNum) - order2.indexOf(+b.sortNum));
  } else {
    return [];
  }
}

/** 基本信息表单 */
export const schemas1 = (indexData: any) => {
  let type = [1, 0];
  if (indexData) {
    type = indexData.split('&');
    showLang.value = type[0];
    kyc.value = type[1];
  }
  return [
    {
      field: 'id',
      component: 'Input',
      show: false,
    },
    {
      field: 'state',
      component: 'Input',
      show: false,
    },
    {
      field: 'cate_name',
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
    ...getArrayByLang(),
  ];
};

/** 任务规则表单 */
export const schemas2: FormSchema[] = [
  {
    field: 'basic-info2',
    component: 'Input',
    label: '',
    colProps: {
      span: 24,
    },
    slot: 'basicInfo2',
  },
  {
    field: 'NegativeConfigType1',
    component: 'InputNumber',
    slot: 'NegativeConfigType1',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return [8].includes(values.ty);
    },
  },
  {
    field: 'CurrencyConfig',
    component: 'RadioGroup',
    labelWidth: 'auto',
    label: t('v.discount.activity.CurrencyConfig'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    rules: [
      {
        required: true,
        trigger: 'change',
        validator(_rule, value) {
          if (!value && value !== 0) {
            return Promise.reject(
              new Error(t('common.chooseText') + t('v.discount.activity.CurrencyConfig')),
            );
          }
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '1',
  },
  {
    field: 'cycle',
    label: t('table.discountActivity.statistical_period'),
    labelWidth: 'auto',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    component: 'RadioGroup',
    defaultValue: 1,
    serialNumber: '2',
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    componentProps: {
      options: [
        {
          label: t('modalForm.finance.every_day_mystery'),
          value: 1,
        },
        {
          label: t('modalForm.finance.every_day_mystery2'),
          value: 2,
        },
        {
          label: t('modalForm.finance.every_day_mystery3'),
          value: 3,
        },
      ],
      onChange: (value) => {},
    },
    ifShow: ({ values }) => {
      return [4, 5, 8].includes(values.ty);
    },
  },
  {
    field: 'statistic_type',
    label: t('common.active_text132'),
    labelWidth: 'auto',
    rules: [
      {
        required: true,
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    component: 'RadioGroup',
    defaultValue: 1,
    serialNumber: '3',
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    componentProps: {
      options: [
        {
          label: t('v.discount.activity.Topup_text2'),
          value: 1,
        },
      ],
      onChange: (value) => {},
    },
    ifShow: ({ values }) => {
      return [4, 8].includes(values.ty);
    },
  },
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 'auto',
    component: 'RadioGroup',
    defaultValue: 1,
    serialNumber: '3',
    colProps: {
      class: 'pop_componentProps',
      span: 9,
    },
    helpMessage: '-',
    helpComponentProps: {
      text: `<span style='color:#FACD91;'>${t('v.discount.activity.Venue_statistics')}:</span>${t(
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
    ifShow: ({ values }) => {
      return [5].includes(values.ty);
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
      return [5].includes(values.ty) && values.platform_range === 2;
    },
    // show: false,
  },
  {
    field: 'client',
    label: t('common.register_port'), //注册端口
    component: 'CheckboxGroup',
    rules: [
      {
        required: true,
        validator: (value) => {
          if (!value) {
            return Promise.reject(new Error(t('table.member.member_choice_money1')));
          }
          return Promise.resolve();
        },
      },
    ],
    labelWidth: 'auto',
    slot: 'clientSlot2',
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    serialNumber: '2',
    ifShow: ({ values }) => {
      return [1].includes(values.ty);
    },
  },
  {
    field: 'client2',
    label: t('下载端口'), //下载端口
    component: 'CheckboxGroup',
    required: true,
    labelWidth: 'auto',
    slot: 'clientSlot3',
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    serialNumber: '2',
    ifShow: ({ values }) => {
      return [2].includes(values.ty);
    },
  },
  {
    field: 'bonus_type',
    component: 'RadioGroup',
    label: t('table.discountActivity.reward_methods'),
    defaultValue: 1,
    labelWidth: 'auto',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        options: [
          { label: t('modalForm.finance.finance_fix_amount'), value: 1 },
          {
            label: [4, 5, 8].includes(formModel.ty)
              ? t('common.active_text16')
              : t('table.discountActivity.discountActivity_random_amount'),
            value: 2,
          },
        ],
        onChange: async (e) => {
          const current = e.target ? e.target.value : e;
          eventBus.emit('onRewardMethodsChange', current);
        },
      };
    },
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    serialNumber: ({ values }) => {
      return [1, 2].includes(values.ty) ? '3' : [4, 5, 8].includes(values.ty) ? '4' : '2';
    },
  },
  {
    field: 'rewardConfig',
    label: '',
    component: 'Input',
    labelWidth: 'auto',
    slot: 'commonTable',
    colProps: {
      span: 24,
    },
    ifShow: ({ values }) => {
      return [4, 5, 8].includes(values.ty);
    },
  },
  {
    field: 'bonus_amount',
    component: 'InputNumber',
    labelWidth: 'auto',
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    label: t('v.discount.activity.amount_bonus1'),
    rules: [
      {
        required: true,
        message: t('table.discountActivity.discountActivity_p_enter_reward_amount'),
        trigger: 'blur',
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: () => {
      return {
        stringMode: true,
        precision: 2,
        min: 0,
        onChange: (value) => {
          const data = value?.target?.value || value || '';
          eventBus.emit('bonus_amount', data);
        },
      };
    },
    ifShow: ({ values }) => {
      return ![4, 5, 8].includes(values.ty) && values.bonus_type === 1;
    },
    slot: 'bonusAmountSlot',
    serialNumber: ({ values }) => {
      return [1, 2].includes(values.ty) ? '4' : '3';
    },
  },
  {
    field: 'bonus_amount2',
    component: 'InputNumber',
    labelWidth: 'auto',
    colProps: {
      span: 24,
      class: 'my-col-24',
    },
    label: t('v.discount.activity.amount_bonus1'),
    rules: [
      {
        required: true,
        message: t('table.discountActivity.discountActivity_p_enter_reward_amount'),
        trigger: 'blur',
        validator: () => {
          return Promise.resolve();
        },
      },
    ],
    componentProps: () => {
      return {
        stringMode: true,
        precision: 2,
        min: 0,
        onChange: (value) => {
          const data = value?.target?.value || value || '';
          eventBus.emit('bonus_amount2', data);
        },
      };
    },
    ifShow: ({ values }) => {
      return ![4, 5, 8].includes(values.ty) && values.bonus_type === 2;
    },
    slot: 'bonusAmountSlot2',
    serialNumber: ({ values }) => {
      return [1, 2].includes(values.ty) ? '4' : '3';
    },
  },
  {
    field: 'button',
    label: t('business.banner_button_text'),
    labelWidth: 'auto',
    colProps: {
      span: 12,
    },
    itemProps: {
      labelCol: { style: { marginLeft: '10px' } },
    },
    component: 'Input',
    required: false,
    slot: 'buttonTextSlot',
    show: false,
  },
  {
    field: 'button_redirect',
    label: t('business.button_redirect_type'),
    required: true,
    rules: [
      {
        required: true,
        message: t('common.select_custom_link'),
      },
    ],
    labelWidth: 'auto',
    itemProps: {
      labelCol: { style: { marginLeft: '10px' } },
    },
    colProps: {
      span: 12,
    },
    component: 'Input',
    show: false,
  },
];

/** 导出所有表单 */
export function ProcessLeftData() {
  return [...schemas1(), ...schemas2];
}
