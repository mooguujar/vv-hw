import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchema } from '/@/components/Form';
import { toTimezone } from '/@/utils/dateUtil';

const { t } = useI18n();

export const schemas: FormSchema[] = [
  {
    field: 'g_name',
    component: 'Input',
    label: t('table.advertise.table_grouping_name') + '：',
    defaultValue: '',
    componentProps: () => {
      return {
        size: 'large',
        allowClear: false,
        disabled: true,
      };
    },
  },
  {
    field: 'username',
    component: 'Input',
    label: t('table.member.member_agent_account') + '：',
    defaultValue: '',
    componentProps: {
      size: 'large',
      disabled: true,
      allowClear: false,
    },
  },
  {
    field: 'currentPayment',
    component: 'Input',
    label: t('table.promotion.promotion_current_prepaid_U') + '：',
    defaultValue: '',
    componentProps: {
      size: 'large',
      disabled: true,
      style: { width: '90%' },
    },
    colProps: { span: 12 },
  },
  {
    field: 'prepay',
    component: 'Input',
    label: t('table.promotion.promotion_promotion_current_prepaid_U') + '：',
    defaultValue: '',
    componentProps: {
      size: 'large',
    },
    rules: [
      {
        validator: (_, value) => {
          if (value) {
            const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.promotion.promotion_promotion_tips'));
            }
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    colProps: { span: 12, style: { paddingLeft: '20px' } },
  },
  {
    field: 'currentConsumption',
    component: 'Input',
    label: t('table.promotion.promotion_current_consumption_U') + '：',
    defaultValue: '',
    componentProps: {
      size: 'large',
      disabled: true,
      style: { width: '90%' },
    },

    colProps: { span: 12 },
  },
  {
    field: 'consume',
    component: 'Input',
    label: t('table.promotion.promotion_t_consumptionU') + '：',
    defaultValue: '',
    componentProps: {
      size: 'large',
    },
    rules: [
      {
        validator: (_, value) => {
          if (value) {
            const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.promotion.promotion_t_consumption_tips'));
            }
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
    colProps: { span: 12, style: { paddingLeft: '20px' } },
  },
  {
    field: 'currentServiceU',
    component: 'Input',
    label: t('table.promotion.promotion_current_service_fee_U') + '：',
    defaultValue: '',
    componentProps: {
      size: 'large',
      allowClear: false,
      disabled: true,
      style: { width: '90%' },
    },
    colProps: { span: 12 },
  },
  {
    field: 'fee',
    component: 'Input',
    label: t('table.promotion.promotion_t_service_fee_U') + '：',
    defaultValue: '',
    componentProps: {
      size: 'large',
    },
    colProps: { span: 12, style: { paddingLeft: '20px' } },
    rules: [
      {
        validator: (_, value) => {
          if (value) {
            const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.promotion.promotion_t_service_fee_tips'));
            }
            return Promise.resolve();
          }
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
];
export const dataColumns: any = [
  {
    title: t('business.common_member_date'),
    dataIndex: 'created_at',
    width: 180,
    customRender: ({ record }) => {
      return toTimezone(record.created_at);
    },
  },
  {
    title: t('table.race_price.table_prepayment_u'),
    dataIndex: 'prepay',
    width: 180,
    textAligin: 'center',
    customRender: ({ record }) => {
      return record.prepay;
    },
  },
  {
    title: t('table.race_price.table_expend_u'),
    dataIndex: 'consume',
    customRender: ({ record }) => {
      return record.consume;
    },
  },
  {
    title: t('table.race_price.table_service_fee'),
    dataIndex: 'fee',
    width: 180,

    customRender: ({ record }) => {
      return record.fee;
    },
  },
  {
    title: t('table.risk.report_operate_people'),
    dataIndex: 'created_by',
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    width: 180,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
];
export const sumColumns: any = [
  {
    title: t('table.member.member_all_'),
    dataIndex: '1',
    width: 180,
    customRender: () => {
      return t('business.common_total');
    },
  },
  {
    title: t('table.race_price.table_prepayment_u'),
    dataIndex: 'prepay',
    width: 180,
    customRender: ({ record }) => {
      return record.prepay;
    },
  },
  {
    title: t('table.race_price.table_expend_u'),
    dataIndex: 'consume',
    width: 130,
    customRender: ({ record }) => {
      return record.consume;
    },
  },
  {
    title: t('table.race_price.table_service_fee'),
    dataIndex: 'fee',
    width: 180,
    customRender: ({ record }) => {
      return record.fee;
    },
  },
  {
    title: t('common.balance'),
    width: 130,
    dataIndex: 'balance',
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    width: 180,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
];
