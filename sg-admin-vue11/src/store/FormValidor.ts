import { useI18n } from '../hooks/web/useI18n';

export function useFormValidor() {
  const { t } = useI18n();
  return {
    required: { required: true, message: t('modalForm.warning.required') },
  };
}
