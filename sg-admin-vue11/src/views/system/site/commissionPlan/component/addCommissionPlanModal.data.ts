import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const formSchema: FormSchema[] = [
  {
    field: 'name',
    label: t('modalForm.system.system_schedule_name'), //方案名称
    component: 'Input',
    required: true,
  },
  {
    field: 'status',
    component: 'RadioGroup',
    label: t('modalForm.finance.finance_now_status'), //当前状态
    defaultValue: 1,
    colProps: { span: 22 },
    componentProps: {
      options: [
        { label: t('business.common_normal'), value: 1 }, //正常
        { label: t('business.common_deactivate'), value: 2 }, //停用
      ],
    },
  },
  {
    field: 'reason',
    component: 'InputTextArea',
    label: t('business.common_remark'), //备注
    componentProps: {
      placeholder: t('modalForm.menber.member_remark_tip1'), //请输入备注
      rows: 3,
    },
  },
];
