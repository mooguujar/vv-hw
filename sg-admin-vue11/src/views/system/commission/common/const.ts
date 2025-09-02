import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const stateOptions = {
  1: t('table.member.member_locked_no'),
  3: t('table.system.system_locked'),
};

export const stateLockOptions = [
  { label: t('business.common_all'), value: 0 },
  { label: t('table.member.member_locked_no'), value: 1 },
  { label: t('table.system.system_locked'), value: 3 },
];
