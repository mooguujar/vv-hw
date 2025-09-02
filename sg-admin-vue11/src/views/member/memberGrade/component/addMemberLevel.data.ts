import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

import { useMemberStore } from '/@/store/modules/member';
// 获取层级下拉
const memberStore = useMemberStore();
memberStore.getLevelList();
const { t } = useI18n();
const colSpan = 24;

// form内容
export const schemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: t('common.MemberID') + ':',
    show: false,
  },
  {
    field: 'level_id',
    component: 'Select',
    label: t('modalForm.member.member_level_id') + ':',
    rules: [{ required: true, message: t('common.select_level_id') }],
    colProps: { span: colSpan },
    dynamicDisabled: ({ values }) => {
      return !!values.id;
    },
    componentProps: () => {
      const { levelSelect } = useMemberStore();
      const maxLevel = 20; // 设置最大级别
      const options = Array.from({ length: maxLevel }, (_, index) => ({
        value: index + 1,
        label: String(index + 1),
      }));
      options.forEach((item: any) => {
        const matchingResponse = levelSelect[item.value.toString()];
        if (matchingResponse) {
          item.disabled = true;
        }
      });
      return {
        options: options,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'name',
    component: 'Input',
    label: t('table.member.member_grade_name') + ':',
    colProps: {
      span: colSpan,
    },
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          const chineseValidationRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/;
          if (!value) {
            return Promise.reject(t('table.member.member_input_level'));
          }
          return Promise.resolve();
        },
        trigger: 'change',
      },
    ],
    componentProps: {
      placeholder: t('table.member.member_input_level'),
      maxlength: 20,
    },
  },
  {
    field: 'min_deposit',
    component: 'InputNumber',
    slot: 'minDeposit',
    label: t('modalForm.member.member_min_deposit') + ':',
    rules: [
      {
        required: true,
        type: 'string',
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject(t('modalForm.member.member_min_tip'));
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    colProps: {
      span: colSpan,
    },
    componentProps: {
      stringMode: true,
      placeholder: t('modalForm.member.member_min_tip'),
      addonAfter: 'USDT',
      min: 0,
      precision: 2,
    },
  },
  {
    field: 'bet_multiplier',
    rules: [{ required: true, message: t('modalForm.member.bet_multiplier_tip') }],
    component: 'InputNumber',
    label: t('table.report.report_bet_multiplier') + ':',
    colProps: {
      span: colSpan,
    },
    componentProps: {
      placeholder: t('modalForm.member.member_multiple_tip'),
      max: 30,
      min: 0,
      precision: 0,
    },
  },
  {
    field: 'is_default',
    component: 'Checkbox',
    label: t('table.member.member_default_set') + ':',
    defaultValue: false,
    colProps: {
      span: 20,
    },
    slot: 'idDefault',
    show: ({ values }) => {
      return values.is_default !== 1;
    },
  },
];

useAutoLabelWidth(schemas);
