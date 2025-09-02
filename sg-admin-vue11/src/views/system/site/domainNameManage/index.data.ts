import domainManage from './components/domainManage.vue';
import webLobby from './components/webLobby.vue';
import clearCache from './components/clearCache.vue';
import customAnalysis from './components/customAnalysis.vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const navList = [
  {
    label: t('table.system.system_site_manage'),
    key: 1,
    component: domainManage,
  },
  {
    label: t('table.system.system_lobby'),
    key: 2,
    component: webLobby,
  },
  {
    label: t('table.system.system_costermer'),
    key: 7,
    component: customAnalysis,
  },
  {
    label: t('table.system.system_clear_cache_in_batches'),
    key: 9,
    component: clearCache, //.data
  },
];
