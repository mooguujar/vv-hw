import { getAllCurrencyList, getCompanyCurrencyList } from '/@/api/finance';
import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export function paymentForm(currencyId): FormSchema[] {
  return [
    {
      field: 'state',
      labelPrefix: t('business.common_status'),
      // labelPrefixWidth: 40,
      component: 'Select',
      defaultValue: 0,
      colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
      componentProps: {
        allowClear: false,
        placeholder: t('business.common_all'),
        options: [
          { label: t('business.common_all'), value: 0 },
          { label: t('business.common_normal'), value: 1 },
          { label: t('business.common_deactivate'), value: 2 },
        ],
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'company_id',
      component: 'ApiSelect',
      labelPrefix: t('table.finance.finance_Payment_platform'),
      labelPrefixWidth: '70',
      defaultValue: '',
      componentProps: {
        api: async () => {
          const response = await getCompanyCurrencyList({
            withdraw: 2,
            currency_id: currencyId,
          });
          const companyList = response || [];
          return [...[{ name: t('business.common_all'), id: '' }], ...companyList];
        },
        allowClear: false,
        showSearch: true,
        optionFilterProp: 'label',
        labelField: 'name',
        valueField: 'id',
        getPopupContainer: () => document.body,
      },
      colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    },
    {
      field: 'method_id',
      component: 'ApiSelect',
      labelPrefix: t('table.finance.finance_Payment_method'),
      labelPrefixWidth: '70',
      defaultValue: '',
      componentProps: {
        api: async () => {
          const response = await getAllCurrencyList({
            withdraw: 2,
          });
          const methods = response[currencyId] || [];
          return [...[{ name: t('business.common_all'), id: '' }], ...methods];
        },
        allowClear: false,
        showSearch: true,
        optionFilterProp: 'label',
        labelField: 'name',
        valueField: 'id',
        getPopupContainer: () => document.body,
      },
      colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    },
  ];
}
