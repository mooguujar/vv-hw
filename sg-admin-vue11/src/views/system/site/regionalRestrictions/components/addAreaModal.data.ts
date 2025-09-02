import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();

export const accountFormSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'country_id',
    component: 'ApiSelect',
    label: t('business.common_country_region') + ':', //IP归属地
    // labelWidth: 85,
    slot: 'area-limit',
    rules: [
      {
        required: true,
        validator: (_, value) => {
          if (!value) {
            return Promise.reject(t('table.system.selectCountry'));
          }
          return Promise.resolve();
        },
      },
    ],
    componentProps: {
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'remark',
    component: 'Input',
    // labelWidth: 85,
    label: t('business.common_remarks_infor') + ':', //备注信息
    componentProps: {
      placeholder: t('modalForm.member.member_remark_tip1'), //请输入备注信息
    },
    rules: [
      {
        validator: (rule, value) => {
          if (value && value.length > 100) {
            return Promise.reject(t('table.member.member_ramark_massage100'));
          }
          return Promise.resolve();
        },
      },
    ],
  },
];
useAutoLabelWidth(accountFormSchema);
