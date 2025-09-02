import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const risk: AppRouteModule = {
  path: '/risk',
  name: 'Risk',
  component: LAYOUT,
  redirect: '/risk/blackList',
  meta: {
    id: 60000,
    orderNo: 4,
    icon: 'Risk:svg',
    title: t('routes.risk.risk'),
    tagName: 'total',
    slectPath: '/risk',
  },
  children: [
    // {
    //   path: 'blackList',
    //   name: 'BlackList',
    //   component: () => import('/@/views/risk/blackList/index.vue'),
    //   meta: {
    //     id: 60100,
    //     title: t('routes.risk.black_list'),
    //     icon: 'BlackList:svg',
    //     slectPath: '/risk',
    //   },
    // },
    {
      path: 'winTop',
      name: 'WinTop',
      component: () => import('/@/views/risk/winTop/index.vue'),
      meta: {
        id: 60200,
        title: t('routes.risk.win_top'),
        icon: 'WinTop:svg',
        tagName: 'win_top_num',
        slectPath: '/risk',
      },
    },
    {
      path: 'lowMultiple',
      name: 'LowMultiple',
      component: () => import('/@/views/risk/lowMultiple/index.vue'),
      meta: {
        id: 60300,
        title: t('routes.risk.low_multiple'),
        icon: 'LowMultiple:svg',
        tagName: 'low_bet_num',
        slectPath: '/risk',
      },
    },
    {
      path: 'highMultiple',
      name: 'HighMultiple',
      component: () => import('/@/views/risk/highMultiple/index.vue'),
      meta: {
        id: 60400,
        title: t('routes.risk.high_bonus'),
        icon: 'HighMultiple:svg',
        tagName: 'high_prize_num',
        slectPath: '/risk',
      },
    },
    {
      path: 'fightMonitor',
      name: 'FightMonitor',
      component: () => import('/@/views/risk/fightMonitor/index.vue'),
      meta: {
        id: 60500,
        title: t('routes.risk.fight_monitor'),
        icon: 'FightMonitor:svg',
        tagName: 'fight_num',
        slectPath: '/risk',
      },
    },
    {
      path: 'linkRecords',
      name: 'LinkRecords',
      component: () => import('/@/views/risk/linkRecords/index.vue'),
      meta: {
        id: 60600,
        title: t('routes.risk.link_records'),
        icon: 'LinkRecords:svg',
        slectPath: '/risk',
      },
      children: [
        {
          path: 'associatedInfo',
          name: 'AssociatedInfo',
          component: () =>
            import(
              '/@/views/risk/linkRecords/components/linkRecordsassociated/associatedInfo/index.vue'
            ),
          meta: {
            id: 60605,
            title: t('routes.risk.associated_info'),
            icon: 'Table:svg',
            hideTab: true,
            hideMenu: true,
            currentActiveMenu: '/risk/linkRecords',
            slectPath: '/risk',
          },
        },
      ],
    },
  ],
};

export default risk;
