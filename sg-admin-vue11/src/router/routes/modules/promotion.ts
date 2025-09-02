import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const promotion: AppRouteModule = {
  path: '/promotion',
  name: 'Promotion',
  component: LAYOUT,
  redirect: '/promotion/buried_point',
  meta: {
    id: 30000,
    orderNo: 5,
    icon: 'Promotion:svg',
    tagName: 'total',
    tag: {
      dot: false,
      content: '',
      type: 'error',
    },
    title: t('routes.promotion.promotion'),
    slectPath: '/promotion',
  },
  children: [
    {
      path: 'PromotionalManagement',
      name: 'PromotionalManagement',
      component: LAYOUT,
      redirect: '/PromotionalManagement/buried_point',
      // component: () => import('/@/views/promotion/buriedPoint/index.vue'),
      meta: {
        id: 30001,
        title: t('routes.promotion.PromotionalManagement'),
        icon: 'BuriedPoint:svg',
        slectPath: '/promotion',
      },
      children: [
        {
          path: 'buried_point',
          name: 'buried_point',
          component: () => import('/@/views/promotion/buriedPoint/index.vue'),
          meta: {
            id: 30100,
            title: t('routes.promotion.buried_point'),
            // icon: 'BuriedPoint:svg',
            slectPath: '/promotion',
          },
        },
        {
          path: 'statics_code',
          name: 'staticsCode',
          component: () => import('/@/views/promotion/staticsCode/index.vue'),
          meta: {
            id: 90231,
            title: t('routes.promotion.statics_code'),
            // icon: 'BuriedPoint:svg',
            slectPath: '/promotion',
          },
        },
        {
          path: 'google_management',
          name: 'GoogleManagement',
          component: () => import('/@/views/promotion/googleManagement/index.vue'),
          meta: {
            id: 30300,
            title: t('routes.promotion.google_management'),
            // icon: 'GoogleManager:svg',
            slectPath: '/promotion',
          },
        },
      ],
    },
    {
      path: 'channel_management',
      name: 'ChannelManagement',
      component: LAYOUT,
      redirect: '/channel_management/channel_management',
      // component: () => import('/@/views/promotion/channelManagement/index.vue'),
      meta: {
        id: 30200,
        title: t('routes.promotion.channel_management'),
        icon: 'ChannelManagement:svg',
        slectPath: '/promotion',
      },
      children: [
        {
          path: 'channel_management',
          name: 'channel_management',
          // component: () => import('/@/views/promotion/channelManagement/index.vue'),
          component: () =>
            import('/@/views/promotion/channelManagement/components/channelLink/index.vue'),
          meta: {
            id: 90246,
            title: t('routes.promotion.channel_management'),
            slectPath: '/system',
            hideChildrenInMenu: true,
            // icon: 'PersonCostumer:svg',
            tagName: 'channel_management',
          },
        },
        {
          path: 'statics_channel',
          name: 'statics_channel',
          component: () => import('/@/views/promotion/statics_channel/index.vue'),
          meta: {
            id: 90247,
            title: t('routes.promotion.statics_channel'),
            // icon: 'BuriedPoint:svg',
            slectPath: '/promotion',
          },
        },
        {
          path: 'Promotional_effectiveness',
          name: 'Promotional_effectiveness',
          component: () => import('/@/views/promotion/Promotional_effectiveness/index.vue'),
          meta: {
            id: 90248,
            title: t('routes.promotion.Promotional_effectiveness'),
            // icon: 'BuriedPoint:svg',
            slectPath: '/promotion',
          },
        },
        {
          path: 'live_analysis',
          name: 'live_analysis',
          component: () => import('/@/views/promotion/live_analysis/index.vue'),
          meta: {
            id: 90249,
            title: t('routes.promotion.live_analysis'),
            // icon: 'BuriedPoint:svg',
            slectPath: '/promotion',
          },
        },
      ],
    },
    {
      path: 'ROIManagement',
      name: 'ROIManagement',
      component: LAYOUT,
      redirect: '/ROIManagement/advertise_grouping',
      meta: {
        id: 30400,
        title: t('routes.promotion.ad_grouping_2'),
        icon: 'AdvertiseGrouping:svg',
        slectPath: '/promotion',
      },
      children: [
        {
          path: 'advertise_grouping',
          name: 'AdvertiseGrouping',
          component: () => import('/@/views/promotion/advertiseGrouping/index.vue'),
          meta: {
            id: 30401,
            title: t('routes.promotion.ad_grouping_1'),
            // icon: 'AdvertiseGrouping:svg',
            slectPath: '/promotion',
          },
        },
        {
          path: 'race_price_roi',
          name: 'RacePriceRoi',
          component: () => import('/@/views/promotion/racePriceRoi/index.vue'),
          meta: {
            id: 30402,
            title: t('routes.promotion.race_price_roi'),
            // icon: 'RacePriceRoi:svg',
            slectPath: '/promotion',
          },
        },
        {
          path: 'month_price_roi',
          name: 'MonthPriceRoi',
          component: () => import('/@/views/promotion/monthPriceRoi/index.vue'),
          meta: {
            id: 30403,
            title: t('routes.promotion.month_price_roi'),
            // icon: 'MonthPriceRoi:svg',
            slectPath: '/promotion',
          },
        },
      ],
    },
  ],
};

export default promotion;
