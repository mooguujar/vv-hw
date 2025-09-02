import { h } from 'vue';
// import ipLocation from '../ipLocation';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
//包含IP V6和V4
const IPRegex =
  /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;
export const accountFormSchema: FormSchema[] = [
  // {
  //   field: 'channelName',
  //   component: 'Input',
  //   labelWidth: 85,
  //   label: '渠道名称', //渠道名称
  //   componentProps: {
  //     placeholder: '请输入渠道名称', //请输入渠道名称
  //   },
  //   required: true,
  // },
  // {
  //   field: 'agentAccount',
  //   component: 'Input',
  //   labelWidth: 85,
  //   label: '代理账号', //渠道名称
  //   componentProps: {
  //     placeholder: '请输入代理账号', //请输入渠道名称
  //   },
  //   required: true,
  // },
  // {
  //   field: 'chanel_type',
  //   component: 'RadioGroup',
  //   label: '生成类型', //生成类型
  //   labelWidth: 85,
  //   colProps: { span: 24 },
  //   componentProps: {
  //     options: [
  //       {
  //         label: '渠道链接', //渠道链接
  //         value: 1,
  //       },
  //       {
  //         label: '独立渠道包', //独立渠道包
  //         value: 2,
  //       },
  //     ],
  //   },
  //   required: true,
  //   // rules: [{ required: true, message: t('modalForm.risk.risk_limit_type_tip') }], //请选择限制类型
  // },
  // {
  //   field: 'channel_package_type',
  //   component: 'RadioGroup',
  //   label: '渠道包', //渠道包
  //   labelWidth: 85,
  //   colProps: { span: 24 },
  //   componentProps: {
  //     options: [
  //       {
  //         label: 'Android', //渠道链接
  //         value: 1,
  //       },
  //       {
  //         label: 'IOS', //独立渠道包
  //         value: 2,
  //       },
  //       {
  //         label: 'Google Play', //独立渠道包
  //         value: 2,
  //       },
  //     ],
  //   },
  //   required: true,
  //   // rules: [{ required: true, message: t('modalForm.risk.risk_limit_type_tip') }], //请选择限制类型
  // },
  // {
  //   field: 'remarks',
  //   component: 'Input',
  //   labelWidth: 85,
  //   label: '包名', //包名
  //   componentProps: {
  //     placeholder: '请输入渠道包名' //请输入渠道包名
  //   },
  //   required: true,
  // },
];
