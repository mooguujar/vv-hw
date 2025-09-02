import { ref } from 'vue';
import { Options } from '/@/types/index';
import { useI18n } from '/@/hooks/web/useI18n';

export enum COLORS {
  SUCCESS = '#1CD91C',
  INFO = '#1475E1',
  ERROR = '#E91134',
  WARNING = '#DA7023',
  DISABLED = '#AAAAAA',
}

// //发放方式
const systemIssueWayOptions = ref<Options>([]);
const systemIssueWayObject = {};
export function useSystemIssueWay() {
  if (systemIssueWayOptions.value?.length === 0) {
    const { t } = useI18n();
    systemIssueWayOptions.value = [
      {
        label: t('common.All'),
        value: 0,
      },
      {
        label: t('table.system.system_auto_issue'),
        value: 1,
      },
      {
        label: t('table.system.system_people_review'),
        value: 2,
      },
    ];
    systemIssueWayObject[1] = t('table.system.system_auto_send');
    systemIssueWayObject[2] = t('table.system.system_people_review');
  }
  return { systemIssueWayOptions, systemIssueWayObject };
}
