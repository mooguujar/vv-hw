import { BasicColumn, FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { useMemberStore } from '/@/store/modules/member';
import { toTimezone } from '/@/utils/dateUtil';
import { getLevelValues } from '/@/utils/common';
import { PaymentSettingLevel } from '/@/api/finance';
import { useI18n } from '/@/hooks/web/useI18n';
import setTooltip from '/@/components/abTooltipInnerEslipse';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();

// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('table.finance.finance_Payment_plan_ID'),
    dataIndex: 'id',
    minWidth: 80,
  },
  {
    title: t('table.finance.finance_application_level'),
    dataIndex: 'level',
    width: 280,
    customRender: ({ record }) => {
      return record.level ? setTooltip(getLevelValues(record.level.join(','), null)) : '-';
    },
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
    minWidth: 100,
    customRender: ({ record }) => {
      const handName = record.updated_name;
      return h('P', null, handName ? handName : '-');
    },
  },
];
useAutoTableLabelWidth(columns);
export const schemas: FormSchema[] = [
  {
    field: 'level',
    label: t('modal.finance.finance_application_level'), //应用层级
    labelWidth: 100,
    rules: [
      {
        type: 'array',
      },
      {
        // ApiSelect 不知为何第一次选值后会出现 undefined
        required: true,
        validator: async (rule, value) => {
          if (!Array.isArray(value)) return;
          if (value.length > 0) {
            return Promise.resolve();
          } else {
            return Promise.reject(t('modal.finance.finance_choose_application_level')); //请选择应用层级
          }
        },
        trigger: 'change',
      },
    ],
    component: 'ApiSelect',
    componentProps: {
      mode: 'multiple',
      api: async () => {
        const memberStore = useMemberStore();
        // const response = await PaymentSettingLevel();
        const outputArray: { label: string; value: number }[] = [];
        for (const key in memberStore.levelSelect) {
          outputArray.push({
            label: memberStore.levelSelect[key],
            value: Number(key),
            // disabled: !response.includes(key),
          });
        }
        return outputArray;
      },
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
    colProps: {
      span: 12,
    },
  },
  {
    field: 'config',
    label: t('modalForm.finance.finance_pay_application'),
    labelWidth: 100,
    component: 'Input',
    slot: 'config',
    colProps: {
      span: 24,
    },
  },
];
useAutoLabelWidth(schemas);
export function getWithdrawForm(type: string): FormSchema[] {
  const schema = [
    {
      field: 'level',
      label: t('modalForm.finance.finance_application_level'),
      rules: [
        {
          type: 'array',
        },
        {
          // ApiSelect 不知为何第一次选值后会出现 undefined
          required: true,
          validator: async (rule, value) => {
            if (!Array.isArray(value)) return;
            if (value.length > 0) {
              return Promise.resolve();
            } else {
              return Promise.reject(t('modalForm.finance.finance_choose_application_level'));
            }
          },
          trigger: 'change',
        },
      ],
      component: 'ApiSelect',
      componentProps: {
        mode: 'multiple',
        api: async () => {
          const memberStore = useMemberStore();
          // const response = await PaymentSettingLevel();
          const outputArray: { label: string; value: number }[] = [];
          for (const key in memberStore.levelSelect) {
            outputArray.push({
              label: memberStore.levelSelect[key],
              value: Number(key),
              // disabled: !response.includes(key),
            });
          }
          return outputArray;
        },
        labelField: 'label',
        valueField: 'value',
        getPopupContainer: () => document.body,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'config',
      label: t('modalForm.finance.finance_pay_application'),
      component: 'Input',
      slot: 'config',
      colProps: {
        span: 24,
      },
    },
  ];
  useAutoLabelWidth(schema);
  return schema;
}
