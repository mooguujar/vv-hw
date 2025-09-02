import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const colSpan = 18;
const labelWidth = 220;
// form内容
const { t } = useI18n();
export const schemas: FormSchema[] = [
  {
    field: 'member',
    component: 'CheckboxGroup',
    labelWidth: labelWidth,
    colProps: { span: colSpan },
    label: t('table.member.member_batch_import'),
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (!value) {
            return Promise.reject(t('table.member.member_batch_import_err'));
          }
          return Promise.resolve();
        },
      },
    ],
    slot: 'importSlot',
  },
  {
    field: 'agency',
    component: 'Input',
    labelWidth: labelWidth,
    label: `${t('business.common_super_agent')}:`,
    rules: [
      {
        required: true,
        message: t('table.member.member_proxy_tip'),
      },
    ],
    colProps: {
      span: colSpan,
    },
    componentProps: {
      placeholder: t('table.member.member_proxy_tip'),
    },
  },
];
useAutoLabelWidth(schemas);
export const columns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.username.trim() ? record.username : '-';
    },
  },
  {
    title: t('business.common_realiy_name'),
    dataIndex: 'realname',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.realname ? record.realname : '-';
    },
  },
  {
    title: t('business.common_account_type'),
    dataIndex: 'flag',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.flag ? record.flag : '-';
    },
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.level ? record.level : '-';
    },
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.vip ? record.vip : '-';
    },
  },
  {
    title: t('business.common_phone_number'),
    dataIndex: 'phone',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.phone ? record.phone : '-';
    },
  },
  {
    title: t('common.email'),
    dataIndex: 'email',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.email ? record.email : '-';
    },
  },
  {
    title: t('table.member.member_balance_name'),
    dataIndex: 'balance',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.balance ? record.balance : '-';
    },
  },
  {
    title: t('table.member.member_commission_state'),
    dataIndex: 'commission',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.commission ? record.commission : '-';
    },
  },
  {
    title: t('layout.header.loginPassword'),
    dataIndex: 'password_login',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.password_login ? record.password_login : '-';
    },
  },
  {
    title: t('modalForm.member.member_fund'),
    dataIndex: 'password_cash',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.password_cash ? record.password_cash : '-';
    },
  },
];

export const transformData = (data) => {
  return data.map((item) => ({
    username: item[Object.keys(item)[0]],
    realname: item[Object.keys(item)[1]],
    flag: item[Object.keys(item)[2]],
    level: item[Object.keys(item)[3]],
    vip: item[Object.keys(item)[4]],
    phone: item[Object.keys(item)[5]],
    email: item[Object.keys(item)[6]],
    balance: item[Object.keys(item)[7]],
    commission: item[Object.keys(item)[8]],
    password_login: item[Object.keys(item)[9]],
    password_cash: item[Object.keys(item)[10]],
  }));
};

export const parseCommissionString = (commissionString) => {
  const commissions = commissionString.split('\n');
  const commissionObject = {};
  commissions.forEach((commission) => {
    const [currency, amount] = commission.split(':');
    commissionObject[currency] = amount;
  });
  return commissionObject;
};

export const setParamas = (outputData) => {
  return outputData.map((item) => {
    return {
      flag: item.flag,
      password_login: String(item.password_login),
      password_cash: String(item.password_cash),
      commission: parseCommissionString(item.commission),
      member: parseCommissionString(item.balance),
      phone: String(item.phone),
      email: String(item.email),
      username: String(item.username),
      vip: String(item.vip),
      level: String(item.level),
      realname: item.realname,
    };
  });
};
