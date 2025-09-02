import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const feedBackTypesData = {
  1: t('common.programError'),
  2: t('common.displayProblem'),
  3: t('common.networkProblems'),
  4: t('common.FeatureSuggestions'),
  5: t('common.UnablePlay'),
  6: t('table.report.report_other'),
};

export const processingState = {
  0: { label: t('common.NotReply'), color: 'black' },
  1: { label: t('common.Replied'), color: '#1CD91C' },
  2: { label: t('common.NoReply'), color: '#E91134' },
};

export const imageStatusTypes = {
  '-1': { label: t('business.common_delete'), color: '#E91134' },
  0: { label: t('component.upload.uploading'), color: 'black' },
  1: { label: t('common.view'), color: '#0A5FBD' },
  2: { label: t('business.common_fail'), color: '#E91134' },
};
