import { useI18n } from '../hooks/web/useI18n';
import { commaSeparatedNumber, commaSeparatedNumberNoLimit } from './regexp';
import { isValid } from './is';

// 多个数字以英文逗号分隔,且不能超过9组，如:1,2
export function useValidateAmount() {
  const { t } = useI18n();
  return {
    validator: (_rule, value) => {
      if (!isValid(value?.trim())) return Promise.resolve();
      if (!commaSeparatedNumber.test(value)) {
        return Promise.reject(t('modalForm.finance.finance_common_amount_tip_9'));
      }
      return Promise.resolve();
    },
  };
}
// 多个数字以英文逗号分隔
export function useValidateAmountNoLimit() {
  const { t } = useI18n();
  return {
    validator: (_rule, value) => {
      if (!isValid(value?.trim())) return Promise.resolve();
      if (!commaSeparatedNumberNoLimit.test(value))
        return Promise.reject(t('modalForm.finance.finance_common_amount_tip'));
      return Promise.resolve();
    },
  };
}
