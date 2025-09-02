import { FormSchema } from '/@/components/Form';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const schemasForm: FormSchema[] = [
  {
    field: 'rate',
    component: 'Input',
    label: t('common.exchangeBase'),
    defaultValue: 1,
    colProps: {
      span: 20,
    },
    componentProps: {
      addonAfter: '$',
    },
  },
  {
    field: 'cny',
    label: 'CNY',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'brl',
    label: 'BRL',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'vnd',
    label: 'VND',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'rs',
    label: 'RS',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'thb',
    label: 'THB',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'btc',
    label: 'BTC',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'usdt',
    label: 'USDT',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'etc',
    label: 'ETC',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
  {
    field: 'bnb',
    label: 'BNB',
    required: true,
    component: 'Input',
    colProps: {
      span: 20,
    },
  },
];
