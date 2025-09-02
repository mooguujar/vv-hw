import { FormSchema } from '/@/components/Form';
import { RECHARGE_TYPE } from '../../const';

export function getFormSchema(type: number): FormSchema[] {
  return [
    // {
    //   field: 'orderNo',
    //   component: 'Input',
    //   label: '订单号',
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   componentProps: { disabled: true },
    // },
    // {
    //   field: 'memberId',
    //   component: 'Input',
    //   label: '会员ID',
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   componentProps: { disabled: true },
    // },
    // {
    //   field: 'vipName',
    //   component: 'Input',
    //   label: '会员等级',
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   componentProps: { disabled: true },
    // },
    // {
    //   field: 'cardName',
    //   component: 'Input',
    //   label: `${type === RECHARGE_TYPE.COMPANY ? '存入账户/姓名' : '存入账户'}`,
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   componentProps: { disabled: true },
    // },
    // {
    //   field: 'moneyStr',
    //   component: 'InputNumber',
    //   label: '存款金额',
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   defaultValue: 0,
    //   dynamicDisabled: true,
    //   componentProps: {
    //     class: type === RECHARGE_TYPE.COMPANY ? 'red-text-input' : '',
    //   },
    // },
    // {
    //   field: 'coinRate',
    //   component: 'Input',
    //   label: '汇率',
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   componentProps: { disabled: true },
    //   ifShow: type !== RECHARGE_TYPE.COMPANY,
    // },
    // {
    //   field: 'coin',
    //   component: 'InputNumber',
    //   label: '货币数量',
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   defaultValue: 0,
    //   dynamicDisabled: true,
    //   componentProps: {
    //     class: 'red-text-input',
    //   },
    //   ifShow: type !== RECHARGE_TYPE.COMPANY,
    // },
    {
      field: 'order_number',
      component: 'Input',
      label: '订单号',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
    },
    {
      field: 'username',
      component: 'Input',
      label: '会员账户',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
    },
    {
      field: 'realname',
      component: 'Input',
      label: '真实姓名',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
      ifShow: type === RECHARGE_TYPE.COMPANY,
    },
    {
      field: 'currency_name',
      component: 'InputNumber',
      label: '存款币种',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
        style: {
          color: '#ff0000c9',
        },
      },
      ifShow: type !== RECHARGE_TYPE.COMPANY,
    },
    {
      field: 'bank_name',
      component: 'Input',
      label: '存入账户',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
      ifShow: type === RECHARGE_TYPE.COMPANY,
    },
    {
      field: 'wallet_address',
      component: 'Input',
      label: '存入账户',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
      ifShow: type === RECHARGE_TYPE.CURRENCY,
    },
    // {
    //   field: 'cardName',
    //   component: 'Input',
    //   label: '账户号码',
    //   colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    //   componentProps: { disabled: true },
    //   ifShow: type === RECHARGE_TYPE.COMPANY,
    // },
    {
      field: 'pay_amount',
      component: 'InputNumber',
      label: '存款金额',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
        style: {
          color: '#ff0000c9',
        },
      },
    },
    {
      field: 'vipName',
      defaultValue: '0_0',
      component: 'Select',
      label: '存款优惠',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
    },
    {
      field: 'moneyStr',
      component: 'Input',
      label: '到账金额',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
    },
    {
      field: 'user_note',
      component: 'InputTextArea',
      label: '备注信息',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        rows: 3,
        disabled: true,
      },
    },
    {
      field: 'created_at',
      component: 'Input',
      label: '提交时间',
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
    },
    {
      field: 'review',
      component: 'RadioGroup',
      label: '审核操作',
      defaultValue: 1,
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        options: [
          { label: '通过', value: 1 },
          { label: '拒绝', value: 2 },
        ],
      },
    },
    {
      field: 'remark',
      component: 'InputTextArea',
      label: '拒绝理由',
      required: true,
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        placeholder: '请输入拒绝理由',
        rows: 3,
      },
      ifShow: ({ values }) => values.review === 2,
    },
  ];
}
