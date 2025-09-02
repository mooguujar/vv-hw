// 基础配置
import { useI18n } from '/@/hooks/web/useI18n';
import { siteProtocolOptions } from '/@/views/common/commonSetting';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { FormSchema } from '/@/components/Form';

// 注册配置表单
export function registerSchema() {
  const { t } = useI18n();
  const schema: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: t('table.common.sender_name') + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
    },
    {
      field: 'host',
      component: 'Input',
      label: t('table.common.SMTP_server') + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
    },
    {
      field: 'protocol',
      component: 'Select',
      label: t('business.common_protocol') + ':',
      colProps: { span: 22 },
      componentProps: {
        options: siteProtocolOptions,
        getPopupContainer: () => document.body,
      },
      required: true,
    },
    {
      field: 'port',
      component: 'Input',
      label: t('table.common.port') + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
    },
    {
      field: 'account',
      component: 'Input',
      label: t('business.common_email_account') + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
    },
    {
      field: 'password',
      component: 'Input',
      label: t('table.common.email_password') + ':',
      colProps: { span: 22 },
      componentProps: {},
      required: true,
    },
  ];
  useAutoLabelWidth(schema);
  return schema;
}
