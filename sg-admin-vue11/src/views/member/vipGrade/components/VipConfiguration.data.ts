import { useI18n } from '/@/hooks/web/useI18n';
import { daily, evenyWeekly, monthly } from '/@/views/discountActivity/activity/common/setting';

import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { BasicColumn, FormSchema } from '/@/components/Table';
import Icon from '/@/components/Icon';
import { h } from 'vue';
import { Input } from 'ant-design-vue';

const InputTextArea = Input.TextArea;
const { t } = useI18n();
export const setingFormData1: FormSchema[] = [
  {
    field: 'entrance',
    label: t('table.discountActivity.activiy_status'),
    serialNumber: '1',
    component: 'InputNumber',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'vipMode',
    // label: t('modalForm.member.member_vip_model'),
    label: t('common.currency_mode'),
    serialNumber: '2',
    component: 'InputNumber',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'statilPlat',
    component: 'InputNumber',
    serialNumber: '3',
    label: t('common.statistical_platform'),
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'bonusConditions',
    component: 'InputNumber',
    label: t('common.Departmental_scholarships'),
    serialNumber: '4',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'multiple',
    component: 'InputNumber',
    label: t('table.discountActivity.discount_audit_multiple'),
    serialNumber: '5',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
];
useAutoLabelWidth(setingFormData1);
export const setingFormData2: FormSchema[] = [
  {
    field: 'deliverySwitch',
    component: 'InputNumber',
    label: t('common.delivery_switch'),
    serialNumber: '6',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'deliveryTime',
    component: 'InputNumber',
    label: t('common.delivery_time'),
    serialNumber: '7',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'protectionSwitch',
    component: 'InputNumber',
    label: t('common.protection_switch'),
    serialNumber: '8',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'activityRules',
    component: 'InputNumber',
    label: t('common.activity_rules'),
    serialNumber: '9',
    slot: 'CurrencyConfig',
    colProps: {
      span: 24,
    },
  },
];

useAutoLabelWidth(setingFormData2);

/**
 * 前台入口
 */
export const schemasEntrance: FormSchema[] = [
  {
    field: 'entrance',
    component: 'RadioGroup',
    label: t('table.discountActivity.activiy_status'),
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('business.common_on'),
            value: '1',
          },
          {
            label: t('business.common_off'),
            value: '2',
          },
        ],
        onChange: (e) => {},
      };
    },
  },
];
useAutoLabelWidth(schemasEntrance);
/**
 * 统计平台
 */
export const schemasStatilPlat: FormSchema[] = [
  {
    field: 'platform_range',
    label: t('v.discount.activity.Venue_statistics'),
    labelWidth: 'auto',
    labelPrefixWidth: 'right',
    component: 'RadioGroup',
    defaultValue: '0',
    colProps: {
      span: 24,
    },
    componentProps: {
      options: [
        {
          label: t('common.all_venues'),
          value: '0',
        },
        {
          label: t('common.Designated_venue'),
          value: '1',
        },
      ],
      onChange: (value) => {
        const data = value?.target?.value || value || 'getself';
      },
    },
  },
  {
    field: 'platform_ids',
    component: 'InputNumber',
    slot: 'NegativeConfigType',
    labelPrefixWidth: 'right',
    colProps: {
      span: 24,
      class: 'vip_platform_range',
    },
    ifShow: ({ values }) => {
      return values.platform_range === '1';
    },
  },
];
useAutoLabelWidth(schemasStatilPlat);
/**
 * 稽核倍数
 */
export const schemasAuditMultiplier: FormSchema[] = [
  {
    field: 'multiple',
    component: 'InputNumber',
    colProps: {
      span: 24,
    },
    label: t('table.discountActivity.discount_audit_multiple'),
    componentProps: ({ formModel }) => {
      return {
        stringMode: true,
        precision: 2,
        min: 0,
        onChange: (v) => {},
      };
    },
  },
];
useAutoLabelWidth(schemasAuditMultiplier);
/**
 * 派送开关
 */
export const schemasDeliverySwitch: FormSchema[] = [
  {
    field: 'dispatch818',
    component: 'RadioGroup',
    label: t('table.member.member_promotion_gift'),
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('business.common_on'),
            value: '1',
          },
          {
            label: t('business.common_off'),
            value: '2',
          },
        ],
        onChange: (e) => {},
      };
    },
  },
  {
    field: 'dispatch819',
    component: 'RadioGroup',
    label: t('table.member.member_every_day'),
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('business.common_on'),
            value: '1',
          },
          {
            label: t('business.common_off'),
            value: '2',
          },
        ],
        onChange: (e) => {},
      };
    },
  },
  {
    field: 'dispatch820',
    component: 'RadioGroup',
    label: t('table.member.member_every_week'),
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('business.common_on'),
            value: '1',
          },
          {
            label: t('business.common_off'),
            value: '2',
          },
        ],
        onChange: (e) => {},
      };
    },
  },
  {
    field: 'dispatch821',
    component: 'RadioGroup',
    label: t('table.member.member_every_month'),
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('business.common_on'),
            value: '1',
          },
          {
            label: t('business.common_off'),
            value: '2',
          },
        ],
        onChange: (e) => {},
      };
    },
  },
];
useAutoLabelWidth(schemasDeliverySwitch);
/**
 * 派送时间
 */
export const schemasDeliveryTime: FormSchema[] = [
  {
    field: 'dispatchTime818',
    component: 'Select',
    label: t('table.member.member_promotion_gift'),
    defaultValue: '1',
    componentProps: {
      disabled: true,
      options: [
        {
          label: t('table.discountActivity.real_time_release'),
          value: '1',
        },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'dispatchTime819',
    label: t('table.member.member_every_day'),
    component: 'Select',
    defaultValue: '1',
    colProps: {
      span: 24,
    },
    componentProps: {
      disabled: true,
      options: [{ label: t('table.discountActivity.next_day_release'), value: '1' }],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'dispatchTime820',
    label: t('table.member.member_every_week'),
    component: 'Select',
    defaultValue: 1,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: evenyWeekly.map((p) => {
        return {
          ...p,
          value: p.value.toString(),
        };
      }),
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: () => {
      return false;
    },
  },
  {
    field: 'dispatchTime821',
    label: t('table.member.member_every_month'),
    component: 'Select',
    defaultValue: 1,
    colProps: {
      span: 24,
    },
    componentProps: {
      options: monthly.map((p) => {
        return {
          ...p,
          value: p.value.toString(),
        };
      }),
      getPopupContainer: () => document.body,
    },
    dynamicDisabled: () => {
      return false;
    },
  },
];
useAutoLabelWidth(schemasDeliveryTime);
/**
 * 保级开关
 */
export const schemasProtectionSwitch: FormSchema[] = [
  {
    field: 'protectionSwitch',
    component: 'RadioGroup',
    label: t('common.protection_switch'),
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        options: [
          {
            label: t('business.common_on'),
            value: '1',
          },
          {
            label: t('business.common_off'),
            value: '2',
          },
        ],
        onChange: (e) => {},
      };
    },
  },
];
useAutoLabelWidth(schemasProtectionSwitch);
/**
 * 活动规则
 */
export const columnsActivityRules: BasicColumn[] = [
  {
    title: t('business.common_sort'), //排序
    dataIndex: 'id',
    width: 78,
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
  },
  {
    dataIndex: 'q',
    title: t('table.discountActivity.discount_rule_sepification'),
    maxWidth: 600,
    slots: { customRender: 'uploadTextRule' },
  },
];
useAutoTableLabelWidth(columnsActivityRules);
