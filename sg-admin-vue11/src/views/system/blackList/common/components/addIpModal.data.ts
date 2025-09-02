import { h } from 'vue';
import ipLocation from '../ipLocation';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();
//包含V4
const IPRegex =
  /^(((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\*)\.){3}((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|\*)$/;
//包含V6
// const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
//包含IP V6和V4
// const IPRegex =
//   /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;
export const accountFormSchema: FormSchema[] = [
  {
    field: 'val',
    component: 'Input',
    label: `${t('table.risk.report_ip_address')}:`,
    dynamicRules: ({ formActionType }) => {
      return [
        {
          required: true,
          validator: async (rules, value) => {
            const { category, id } = formActionType.getFieldsValue();
            if (category == 1) {
              const { setFieldsValue } = formActionType;
              // if (IPRegex.test(value) && id) return Promise.resolve();
              // else
              if (IPRegex.test(value)) {
                // 如果ip地址中含有*号，则不查询归属地
                if (!value.includes('*')) {
                  const data = await ipLocation(value);
                  let ipPlaceOfBelonging = `${data.country_name} - ${data.region} - ${data.city}`;
                  if (ipPlaceOfBelonging.length < 10) ipPlaceOfBelonging = '-';
                  setTimeout(() => {
                    setFieldsValue({ ipLocation: ipPlaceOfBelonging });
                  }, 0);
                  return Promise.resolve();
                }
              } else {
                if (formActionType.getFieldsValue()['ipLocation']) {
                  await setFieldsValue({ ipLocation: '-' });
                }

                return Promise.reject(t('table.risk.report_correct_ip_address_tip'));
              }
            } else if (category == 2) {
              if (!value) {
                return Promise.reject(t('table.member.member_device_no_correct_tip')); //请输入正确的设备号
              } else {
                return Promise.resolve();
              }
            } else if (category == 3) {
              const EmailRegex = /^(([a-zA-Z0-9._%+-]+)|\*)@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
              if (!EmailRegex.test(value)) {
                return Promise.reject(t('business.common_email_account_correct_tip')); //请输入正确的邮箱账号
              } else {
                return Promise.resolve();
              }
            }
          },
        },
      ];
    },
  },
  {
    field: 'ipLocation',
    component: 'Input',
    label: t('table.risk.report_ip_location') + ':', //IP归属地
    componentProps: {
      readonly: true,
      disabled: true,
    },
    defaultValue: '-',
    ifShow: ({ values }) => {
      return values.category == 1;
    },
  },
  {
    field: 'limit_type',
    component: 'CheckboxGroup',
    label: t('modalForm.risk.risk_limit_type') + ':', //限制类型
    colProps: { span: 24 },
    componentProps: ({ formModel }) => {
      let options: any = [];
      if (formModel.category === 1) {
        options = [
          {
            label: t('modalForm.risk.risk_web'), //注册
            value: 3,
            //disabled: formModel.limit_type !== 3
          },
          {
            label: t('modalForm.risk.risk_register'), //注册
            value: 1,
            disabled: formModel?.limit_type?.includes(3) ? true : false,
          },
          {
            label: t('modalForm.risk.risk_login'), //登录
            value: 2,
            disabled: formModel?.limit_type?.includes(3) ? true : false,
          },
        ];
      } else {
        options = [
          {
            label: t('modalForm.risk.risk_register'), //注册
            value: 1,
            //disabled: formModel.limit_type !== 3
          },
          {
            label: t('modalForm.risk.risk_login'), //登录
            value: 2,
            //disabled: formModel.limit_type !== 3
          },
        ];
      }
      return {
        options: options,
      };
    },
    rules: [{ required: true, message: t('modalForm.risk.risk_limit_type_tip') }], //请选择限制类型
  },
  {
    field: 'remark',
    component: 'Input',
    label: t('business.common_remarks_infor') + ':', //备注信息
    componentProps: {
      placeholder: t('modalForm.member.member_remark_tip1'), //请输入备注信息
    },
  },
  {
    field: 'category',
    component: 'InputNumber',
    show: false,
  },
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
];
useAutoLabelWidth(accountFormSchema);
