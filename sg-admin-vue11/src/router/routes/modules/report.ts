import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const report: AppRouteModule = {
  path: '/report',
  name: 'Report',
  component: LAYOUT,
  redirect: '/report/bettingReport',
  meta: {
    id: 50000,
    orderNo: 3,
    icon: 'Report:svg',
    title: t('routes.report.report'),
    slectPath: '/report',
    //hideMenu: true,
  },
  children: [
    //
    {
      path: 'comprehensiveReport',
      name: 'ComprehensiveReport',
      component: () => import('/@/views/report/comprehensiveReport/index.vue'),
      meta: {
        id: 50100,
        title: t('routes.report.comprehensiveReport'),
        icon: 'ComprehensiveReport:svg',
        slectPath: '/report',
      },
    },
    {
      path: 'bettingReport',
      name: 'BettingReport',
      component: () => import('/@/views/report/bettingReport/index.vue'),
      meta: {
        id: 50200,
        title: t('routes.report.bettingReport'),
        icon: 'BettingReport:svg',
        slectPath: '/report',
      },
    },
    {
      path: 'platformReport',
      name: 'PlatformReport',
      component: () => import('/@/views/report/platformReport/index.vue'),
      meta: {
        id: 50300,
        title: t('routes.report.platformReport'),
        icon: 'PlatformReport:svg',
        slectPath: '/report',
      },
      children: [
        {
          path: 'gameReport',
          name: 'GameReport',
          component: () => import('/@/views/report/platformReport/reportTabs/index.vue'),
          meta: {
            id: 50300,
            title: t('routes.report.gameReport'),
            icon: 'OrderRefund:svg',
            hideTab: true,
            hideMenu: true,
            currentActiveMenu: '/report/platformReport',
            slectPath: '/report',
          },
        },
      ],
    },
    {
      path: 'dailyReport',
      name: 'DailyReport',
      component: () => import('/@/views/report/dailyReport/index.vue'),
      meta: {
        id: 50400,
        title: t('routes.report.dailyReport'),
        icon: 'DailyReport:svg',
        slectPath: '/report',
      },
    },
    {
      path: 'agentReport',
      name: 'AgentReport',
      component: () => import('/@/views/report/agentReport/index.vue'),
      meta: {
        id: 50500,
        title: t('routes.report.agentReport'),
        icon: 'AgentReport:svg',
        slectPath: '/report',
      },
    },
    {
      path: 'memberReport',
      name: 'MemberReport',
      component: () => import('/@/views/report/memberReport/index.vue'),
      meta: {
        id: 50600,
        title: t('routes.report.memberReport'),
        icon: 'MemberReport:svg',
        slectPath: '/report',
      },
      children: [
        {
          path: 'betInfo',
          name: 'BetInfo',
          component: () => import('/@/views/report/memberReport/betInfo/index.vue'),
          meta: {
            id: 50600,
            title: t('routes.report.betInfo'),
            icon: 'OrderRefund:svg',
            hideTab: true,
            hideMenu: true,
            currentActiveMenu: '/report/memberReport',
            slectPath: '/report',
          },
        },
        {
          path: 'memberDetail',
          name: 'MemberDetail',
          component: () => import('/@/views/report/memberReport/memberDetail/index.vue'),
          meta: {
            id: 50600,
            title: t('routes.report.member_detail'),
            icon: 'OrderRefund:svg',
            hideTab: true,
            hideMenu: true,
            currentActiveMenu: '/report/memberReport',
            slectPath: '/report',
          },
        },
      ],
    },
    {
      path: 'firstDepositReport',
      name: 'FirstDepositReport',
      component: () => import('/@/views/report/firstDepositReport/index.vue'),
      meta: {
        id: 50700,
        title: t('routes.report.firstDepositReport'),
        icon: 'FirstDepositReport:svg',
        slectPath: '/report',
      },
    },
    {
      path: 'activityReport',
      name: 'ActivityReport',
      component: () => import('/@/views/report/activityReport/index.vue'),
      meta: {
        id: 51000,
        title: t('routes.report.activityReport'),
        icon: 'activityReport:svg',
        slectPath: '/report',
        hideChildrenInMenu: true,
      },
      children: [
        {
          path: 'activityReportSecond',
          name: 'ActivityReportSecond',
          component: () => import('/@/views/report/activityReportSecond/index.vue'),
          meta: {
            id: 51000,
            title: t('routes.report.activityReport'),
            hideTab: true,
            hideMenu: true,
            currentActiveMenu: '/report/activityReport',
            icon: 'activityReport:svg',
            slectPath: '/report',
          },
        },
      ],
    },
    {
      path: 'retainReport',
      name: 'RetainReport',
      component: () => import('/@/views/report/retainReport/index.vue'),
      meta: {
        id: 50800,
        title: t('routes.report.retainReport'),
        icon: 'RetainReport:svg',
        slectPath: '/report',
      },
    },
    {
      path: 'oneHourReport',
      name: 'OneHourReport',
      component: () => import('/@/views/report/oneHourReport/index.vue'),
      meta: {
        id: 50900,
        title: t('routes.report.oneHourReport'),
        icon: 'OneHourReport:svg',
        slectPath: '/report',
      },
    },
    // {
    //   path: 'activityReport',
    //   name: 'ActivityReport',
    //   component: () => import('/@/views/report/activityReport/index.vue'),
    //   meta: {
    //     id: 51000,
    //     title: t('优惠报表'),
    //     icon: 'activityReport:svg',
    //     slectPath: '/report',
    //     hideChildrenInMenu: true,
    //   },
    //   children: [
    //     {
    //       path: 'activityReportSecond',
    //       name: 'ActivityReportSecond',
    //       component: () => import('/@/views/report/activityReportSecond/index.vue'),
    //       meta: {
    //         id: 51000,
    //         title: t('优惠报表'),
    //         hideTab: true,
    //         hideMenu: true,
    //         currentActiveMenu: '/report/activityReport',
    //         icon: 'activityReport:svg',
    //         slectPath: '/report',
    //       },
    //     },
    //   ],
    // },
  ],
};

export default report;
