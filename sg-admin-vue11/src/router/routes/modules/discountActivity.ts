import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
const report: AppRouteModule = {
  path: '/discountActivity',
  name: 'DiscountActivity',
  component: LAYOUT,
  redirect: '/discountActivity/activity',
  meta: {
    id: 40000,
    orderNo: 6,
    icon: 'Discount:svg',
    title: t('routes.discountActivity.discountActivity'),
    slectPath: '/discountActivity',
  },
  children: [
    {
      path: 'activity',
      name: 'Activity',
      component: () => import('/@/views/discountActivity/activity/index.vue'),
      meta: {
        id: 40200,
        title: t('routes.discountActivity.activity'),
        icon: 'Activity:svg',
        slectPath: '/discountActivity',
      },
      children: [
        {
          path: 'newActive',
          name: 'NewActive',
          component: () =>
            import('/@/views/discountActivity/activity/components/newActive/index.vue'),
          meta: {
            id: 40200,
            title: t('routes.discountActivity.add_offer'),
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/discountActivity/activity',
            slectPath: '/discountActivity',
          },
        },
      ],
    },
    {
      path: 'redeemCode',
      name: 'redeemCode',
      meta: {
        id: 41100,
        title: t('common.redeemCode'),
        icon: 'DepositCardManagement:svg',
        slectPath: '/discountActivity',
      },
      component: () => import('/@/views/discountActivity/redeemCode/index.vue'),
      children: [
        {
          path: 'exchangeCode',
          name: 'ExchangeCode',
          component: () => import('/@/views/discountActivity/redeemCode/exchangeCode/index.vue'),
          meta: {
            id: 41100,
            hideMenu: true,
            hideTab: true,
            title: t('common.redeemCode1'),
            slectPath: '/discountActivity2',
          },
        },
        {
          path: 'codeExpired',
          name: 'CodeExpired',
          component: () => import('/@/views/discountActivity/redeemCode/codeExpired/index.vue'),
          meta: {
            id: 41100,
            hideMenu: true,
            hideTab: true,
            title: t('common.redeemCode1'),
            slectPath: '/discountActivity1',
          },
        },
        {
          path: 'codeDetails',
          name: 'CodeDetails',
          component: () =>
            import('/@/views/discountActivity/redeemCode/exchangeCodeDetails/index.vue'),
          meta: {
            id: 41100,
            hideMenu: true,
            hideTab: true,
            hideBreadcrumb: true,
            title: '',
            currentActiveMenu: '/discountActivity/redeemCode',
            slectPath: '/discountActivity',
          },
        },
      ],
    },
    {
      path: 'interest',
      name: 'InterestTreasure',
      component: () => import('/@/views/discountActivity/interest/index.vue'),
      meta: {
        id: 40300,
        title: t('routes.discountActivity.interest'),
        icon: 'Interest:svg',
        slectPath: '/discountActivity',
      },
    },
    {
      path: 'mission',
      name: 'Mission',
      redirect: '/mission/mission_list',
      meta: {
        id: 40900,
        title: t('routes.discountActivity.mission'),
        icon: 'Activity:svg',
        slectPath: '/discountActivity',
      },
      children: [
        {
          path: 'mission_list',
          name: 'mission_list',
          component: () => import('/@/views/discountActivity/mission/index.vue'),
          meta: {
            id: 40901,
            title: t('v.discount.mission_list'),
            slectPath: '/discountActivity',
          },
        },
        {
          path: 'mission_classify',
          name: 'mission_classify',
          component: () => import('/@/views/discountActivity/mission/classify/index.vue'),
          meta: {
            id: 41000,
            title: t('v.discount.mission_classify'),
            slectPath: '/discountActivity',
          },
        },
        {
          path: 'insertmission',
          name: 'Insertmission',
          component: () => import('/@/views/discountActivity/mission/insertmission/index.vue'),
          meta: {
            id: 40903,
            title: t('v.discount.mission_add'),
            hideMenu: true,
            hideTab: true,
            currentActiveMenu: '/discountActivity/mission/mission_list',
            slectPath: '/discountActivity',
          },
        },
      ],
    },
  ],
};

export default report;
