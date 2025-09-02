import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const searchFormSchema: FormSchema[] = [
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: 45,
    component: 'Select',
    colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
    defaultValue: 0,
    componentProps: {
      placeholder: t('business.common_all'), //全部
      options: [
        { label: t('business.common_all'), value: 0 },
        { label: t('business.common_normal'), value: 1 },
        { label: t('business.common_deactivate'), value: 2 },
      ],
      getPopupContainer: () => document.body,
    },
  },
];
