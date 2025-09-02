import { FormSchema } from '/@/components/Form';
import { WITHDRAWAL_TYPE } from '../../const';
import { h } from 'vue';
import ReloadTooltip from '/@/views/member/common/ReloadTooltip.vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();

function setBalanceList(item, id, name, _list) {
  if (Reflect.has(item[id], 'uid')) {
    delete item[id].uid;
  }
  const list = {
    id: id,
    name: name,
    list: Object.keys(item[id]).map((label) => ({ label, value: item[id][label] })),
  };
  _list.push(list);
}

export function getFormSchema(type: number): FormSchema[] {
  const schema = [
    {
      field: 'currency_id',
      component: 'Input',
      label: t('table.member.member_money_'), //货币
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
      show: false,
    },
    {
      field: 'order_number',
      component: 'Input',
      label: t('table.member.order_number'), //订单号
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
    },
    {
      field: 'username',
      component: 'Input',
      label: t('table.member.member_account'), //会员账号
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
    },
    {
      field: 'user_balance',
      component: 'Input',
      label: t('table.member.member_balance'), //账号余额
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
      render: ({ model, field }) => {
        const obj = {
          balance: model[field],
        };
        const _list = [];
        if (obj.balance) {
          setBalanceList(obj, 'balance', '', _list);
        }
        return h(ReloadTooltip, {
          record: model,
          list: _list,
          styleText: {
            padding: '7.5px 11px',
            'font-size': '16px',
            color: 'rgba(0, 0, 0, 0.25)',
            'background-color': '#f5f5f5',
            border: '1px solid #d9d9d9',
            'border-radius': '4px',
            opacity: 1,
          },
        });
      },
    },
    {
      field: 'currency_name',
      component: 'InputNumber',
      label: t('table.member.deposit_currency'), //存款币种
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
        style: {
          color: type === WITHDRAWAL_TYPE.CURRENCY ? '#ff0000c9' : '',
        },
      },
    },
    {
      field: 'currency_name',
      component: 'InputNumber',
      label: t('table.member.deposit_currency'), //存款币种
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
        style: {
          color: type === WITHDRAWAL_TYPE.CURRENCY ? '#ff0000c9' : '',
        },
      },
    },
    {
      field: 'contract_type',
      component: 'InputNumber',
      label: t('table.member.contract_type'), //协议类型
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
        style: {
          color: '#ff0000c9',
        },
      },
      ifShow: type === WITHDRAWAL_TYPE.CURRENCY,
    },
    {
      field: 'contract_type',
      component: 'InputNumber',
      label: t('table.member.withdraw_address'),
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
      },
      ifShow: type === WITHDRAWAL_TYPE.CURRENCY,
    },
    {
      field: 'withdraw_method',
      component: 'Input',
      label: t('table.member.withdraw_method'), //取款方式
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
      ifShow: type !== WITHDRAWAL_TYPE.CURRENCY,
      // ifShow: type === RECHARGE_TYPE.COMPANY,
    },
    {
      field: 'wallet_address',
      component: 'Input',
      label: t('table.member.withdraw_account'), //取款账号
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
      ifShow: type !== WITHDRAWAL_TYPE.CURRENCY,
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
      field: 'amount',
      component: 'InputNumber',
      label: t('table.member.withdraw_amount'), //取款金额
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'fee',
      component: 'InputNumber',
      label: t('table.member.withdraw_fee'), //手续费
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'finally_amount',
      component: 'InputNumber',
      label: t('table.member.finally_withdraw_amount'), //实际取款
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        disabled: true,
        style: {
          color: '#ff0000c9',
        },
      },
    },
    {
      field: 'user_note',
      component: 'InputTextArea',
      label: t('table.member.remark_info'), //备注信息
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        placeholder: t('table.member.please_enter_remark_info'),
        rows: 2,
        disabled: true,
      },
    },
    {
      field: 'created_at',
      component: 'Input',
      label: t('table.member.submit_time'),
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: { disabled: true },
    },
    {
      field: 'review',
      component: 'RadioGroup',
      label: t('table.member.audit_operation'), //审核操作
      defaultValue: 1,
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        options: [
          { label: t('table.member.pass'), value: 1 }, //通过
          { label: t('table.member.refuse'), value: 2 }, //拒绝
        ],
      },
    },
    {
      field: 'withdraw_merchant_id',
      component: 'ApiSelect',
      defaultValue: 0,
      label: t('table.member.withdraw_merchant'), //代付平台
      componentProps: ({ formActionType, formModel }) => {
        return {
          allowClear: false,
          showSearch: true,
          optionFilterProp: 'label',
          labelField: 'name',
          valueField: 'id',
          options: [],
          getPopupContainer: () => document.body,
        };
      },
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      ifShow: ({ values }) => values.review === 1,
    },
    {
      field: 'remark',
      component: 'InputTextArea',
      label: t('table.member.refuse_reason'), //拒绝理由
      required: true,
      colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
      componentProps: {
        placeholder: t('table.member.please_enter_refuse_reason'), //请输入拒绝理由
        rows: 3,
      },
      ifShow: ({ values }) => values.review === 2,
    },
  ];
  useAutoLabelWidth(schema);
  return schema;
}
