import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

const system: AppRouteModule = {
  path: '/system',
  name: 'System',
  component: LAYOUT,
  redirect: '/system/site_management/carousel_list',
  meta: {
    id: 70000,
    orderNo: 7,
    icon: 'System:svg',
    title: t('routes.system.system_manage'),
    // hideMenu: true,
    slectPath: '/system',
    tagName: 'total',
  },
  children: [
    {
      path: 'site_management',
      name: 'SiteManagement',
      redirect: '/site_management/banner_list',
      meta: {
        id: 70200,
        title: t('routes.system.site_manage'),
        icon: 'SiteManage:svg',
        slectPath: '/system',
      },
      children: [
        {
          path: 'carousel_list',
          name: 'CarouselList',
          component: () => import('/@/views/system/site/banner/index.vue'),
          meta: {
            id: 70210,
            title: t('routes.system.banner_setting'),
            slectPath: '/system',
            //hideChildrenInMenu: true,
            // icon: 'menuEdit:svg',
          },
          children: [
            {
              path: 'add_carouse',
              name: 'AddCarouseForm',
              component: () => import('/@/views/system/site/banner/AddBanner.vue'),
              meta: {
                id: 70210,
                title: t('routes.system.add_banner'),
                icon: 'menuData:svg',
                hideMenu: true,
                hideTab: true,
                //hideBreadcrumb: true,
                currentActiveMenu: '/system/site_management/carousel_list',
                slectPath: '/system',
              },
            },
            {
              path: 'editor_carouse',
              name: 'EditorCarouseForm',
              component: () => import('/@/views/system/site/banner/EditorBanner.vue'),
              meta: {
                id: 70210,
                title: t('routes.system.add_banner'),
                icon: 'menuData:svg',
                hideMenu: true,
                hideTab: true,
                //hideBreadcrumb: true,
                currentActiveMenu: '/system/site_management/carousel_list',
                slectPath: '/system',
              },
            },
          ],
        },
        {
          path: 'brand_setting',
          name: 'BrandSetting',
          component: () => import('/@/views/system/site/brandSetting/index.vue'),
          meta: {
            id: 70220,
            title: t('routes.system.brand_setting'),
            slectPath: '/system',
            // icon: 'menuEdit:svg',
          },
        },
        {
          path: 'site_settings',
          name: 'SiteSettings',
          component: () => import('/@/views/system/site/siteSettings/index.vue'),
          meta: {
            id: 70230,
            title: t('routes.system.site_settings'),
            slectPath: '/system',
            // icon: 'menuEdit:svg',
          },
        },
        {
          path: 'chatroom',
          name: 'ChatRoom',
          component: () => import('/@/views/system/site/chatroom/index.vue'),
          meta: {
            id: 70226,
            title: t('routes.system.chatroom_sys'),
            slectPath: '/system',
            // icon: 'menuEdit:svg',
          },
        },
        // {
        //   path: 'app_packaging',
        //   name: 'Apppackaging',
        //   component: () => import('/@/views/system/site/apppackaging/index.vue'),
        //   meta: {
        //     id: 70240,
        //     title: t('routes.system.apppackaging'),
        //     // icon: 'menuEdit:svg',
        //   },
        // },
        {
          path: 'ip_whitelist',
          name: 'IpWhitelist',
          component: () => import('/@/views/system/site/IpWhitelist/index.vue'),
          meta: {
            id: 70250,
            title: t('routes.system.ip_whitelist'),
            slectPath: '/system',
            // icon: 'Money:svg',
          },
        },
        {
          path: 'blackList',
          name: 'BlackList',
          component: () => import('/@/views/system/blackList/index.vue'),
          meta: {
            id: 60100,
            title: t('routes.risk.black_list'),
            slectPath: '/system',
          },
        },
        {
          path: 'Regional_restrictions',
          name: 'RegionalRestrictions',
          component: () => import('/@/views/system/site/regionalRestrictions/index.vue'),
          meta: {
            id: 70260,
            title: t('routes.system.Regional_restrictions'),
            slectPath: '/system',
            // icon: 'Money:svg',
          },
        },
        {
          path: 'domain_name_manage',
          name: 'DomainNameManage',
          component: () => import('/@/views/system/site/domainNameManage/index.vue'),
          meta: {
            id: 70270,
            title: t('routes.system.domain_name_manage'),
            slectPath: '/system',
            // icon: 'Money:svg',
          },
        },
      ],
    },
    {
      path: 'commission',
      name: 'Commission',
      component: LAYOUT,
      redirect: '/commission/commissionReview',
      meta: {
        id: 70300,
        //orderNo: 5,
        icon: 'Commission:svg',
        title: t('routes.commission.commission'),
        slectPath: '/system',
      },
      children: [
        {
          path: 'commissionReview',
          name: 'CommissionReview',
          component: () => import('/@/views/system/commission/commissionReview/index.vue'),
          meta: {
            id: 70302,
            title: t('routes.commission.commissionReview'),
            slectPath: '/system',
            hideChildrenInMenu: true,
            // icon: 'PersonCostumer:svg',
            tagName: 'unreviewed_num',
          },
        },
        {
          path: 'commissionRecord',
          name: 'CommissionRecord',
          component: () => import('/@/views/system/commission/commissionRecord/index.vue'),
          meta: {
            id: 70303,
            title: t('routes.commission.commissionRecord'),
            slectPath: '/system',
            hideChildrenInMenu: true,
            // icon: 'PersonCostumer:svg',
          },
          children: [
            {
              path: '',
              name: 'First',
              redirect: 'First', // 默认重定向到 SiteAnnouncement
              meta: {
                title: t('routes.commission.commissionRecord'),
                id: 70303,
              },
            },
            {
              path: 'first',
              name: 'First',
              meta: {
                id: 70303,
                title: t('routes.commission.commissionRecord'),
              },
            },
            {
              path: 'recordDetails',
              name: 'RecordDetails',
              component: () =>
                import('/@/views/system/commission/commissionRecord/recordDetails/index.vue'),
              meta: {
                id: 70303,
                title: '',
                // hideMenu: true,
                hideTab: true,
                hideBreadcrumb: true,
                currentActiveMenu: '/system/commission/commissionRecord',
                slectPath: '/system',
              },
            },
          ],
        },
        {
          path: 'commissionConfig',
          name: 'CommissionConfigNocash',
          component: () => import('/@/views/system/commission/commissionConfig/index.vue'),
          meta: {
            id: 70301,
            title: t('common.surrogate_placement'),
            slectPath: '/system',
            // icon: 'PersonCostumer:svg',
          },
        },
      ],
    },
    {
      path: 'game_management',
      name: 'GameManagement',
      redirect: '/system/game_management/platform',
      meta: {
        id: 70400,
        title: t('routes.system.platform_manage'),
        icon: 'GameManagement:svg',
        slectPath: '/system',
      },
      children: [
        {
          path: 'game_ist',
          name: 'GameLst',
          component: () => import('/@/views/system/gameManagement/gameList/index.vue'),
          meta: {
            id: 70426,
            title: t('common.sport1'),
            slectPath: '/system',
          },
        },
        {
          path: 'platform',
          name: 'PlatformManage',
          component: () => import('/@/views/system/gameManagement/platformManage/index.vue'),
          meta: {
            id: 70410,
            title: t('routes.system.game_manage'),
            // icon: 'Star:svg',
            hideChildrenInMenu: true,
            slectPath: '/system',
          },
          children: [
            {
              path: '',
              name: 'First',
              redirect: 'First', // 默认重定向到 SiteAnnouncement
              meta: {
                title: t('routes.system.game_manage'),
                id: 70410,
              },
            },
            {
              path: 'first',
              name: 'First',
              meta: {
                id: 70410,
                title: t('routes.system.game_manage'),
              },
            },
            {
              path: 'game_list',
              name: 'GameList',
              component: () => import('/@/views/system/gameManagement/gameManage/index.vue'),
              meta: {
                id: 70424,
                title: t('routes.system.game_list'),
                icon: 'Trophy:svg',
                hideTab: true,
                hideBreadcrumb: true,
                currentActiveMenu: '/system/game_management/platform',
                slectPath: '/system',
              },
            },
          ],
        },
        {
          path: 'game_sort',
          name: 'GameSort',
          component: () => import('/@/views/system/gameManagement/gameSort/index.vue'),
          meta: {
            id: 70430,
            title: t('routes.system.game_sort'),
            // icon: 'Trophy:svg',
            hideChildrenInMenu: true,
            slectPath: '/system',
          },
          children: [
            {
              path: '',
              name: 'First',
              redirect: 'First', // 默认重定向到 SiteAnnouncement
              meta: {
                title: t('routes.system.game_sort'),
                id: 70430,
              },
            },
            {
              path: 'first',
              name: 'First',
              meta: {
                id: 70430,
                title: t('routes.system.game_sort'),
              },
            },

            {
              path: 'sub_game_sort',
              name: 'SubGameSort',
              component: () => import('/@/views/system/gameManagement/gameSort/subGameSort.vue'),
              meta: {
                id: 70430,
                title: t('routes.system.game_sort'),
                icon: 'Trophy:svg',
                hideTab: true,
                hideBreadcrumb: true,
                currentActiveMenu: '/system/game_management/game_sort',
                slectPath: '/system',
              },
            },
          ],
        },
      ],
    },
    {
      path: 'lotteryManagement',
      name: 'LotteryManagement',
      redirect: '/lotteryManagement/lotteryList',
      meta: {
        id: 70800,
        title: t('common.cp22'),
        icon: 'Lottery:svg',
        slectPath: '/system',
      },
      children: [
        {
          path: 'lotteryNumber',
          name: 'LotteryNumber',
          component: () => import('/@/views/system/lotteryManagement/lotteryNumber/index.vue'),
          meta: {
            title: t('common.cp9'),
            id: 70800,
            slectPath: '/system',
          },
        },
        {
          path: 'lotteryStatistics',
          name: 'LotteryStatistics',
          component: () => import('/@/views/system/lotteryManagement/lotteryStatistics/index.vue'),
          meta: {
            title: t('common.lottery_statistics'),
            id: 70800,
            slectPath: '/system',
          },
        },
      ],
    },
    {
      path: 'information_center',
      name: 'InformationCenter',
      redirect: '/site_management/information_center',
      meta: {
        id: 70500,
        title: t('routes.system.information_center'),
        icon: 'InformationCenter:svg',
        slectPath: '/system',
      },
      children: [
        {
          path: 'site_announcement',
          name: 'SiteAnnouncement',
          component: () => import('/@/views/system/informationCenter/siteAnnouncement/index.vue'),
          meta: {
            id: 70510,
            title: t('routes.system.site_announcement'),
            // icon: 'menuData:svg',
            slectPath: '/system',
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '',
              name: 'First',
              redirect: 'First', // 默认重定向到 SiteAnnouncement
              meta: {
                title: t('routes.system.site_announcement'),
                id: 70510,
              },
            },
            {
              path: 'first',
              name: 'First',
              meta: {
                id: 70510,
                title: t('routes.system.site_announcement'),
              },
            },
            {
              path: 'add_announcement',
              name: 'AddAnnouncement',
              component: () =>
                import(
                  '/@/views/system/informationCenter/siteAnnouncement/bulletin/AddAnnouncement.vue'
                ),
              meta: {
                id: 70510,
                title: t('routes.system.add_announcement'),
                icon: 'menuData:svg',
                // hideMenu: true,
                // hideTab: true,
                hideBreadcrumb: true,
                currentActiveMenu: '/system/information_center/site_announcement',
                slectPath: '/system',
              },
            },
            {
              path: 'edit_announcement/:id',
              name: 'EditAnnouncement',
              component: () =>
                import(
                  '/@/views/system/informationCenter/siteAnnouncement/bulletin/EditAnnouncement.vue'
                ),
              meta: {
                id: 70510,
                title: t('routes.system.edit_announcement'),
                icon: 'menuData:svg',
                // hideMenu: true,
                // hideTab: true,
                hideBreadcrumb: true,
                currentActiveMenu: '/system/information_center/site_announcement',
                slectPath: '/system',
              },
            },
          ],
        },
        {
          path: 'website_letter',
          name: 'WebsiteLetter',
          component: () => import('/@/views/system/informationCenter/websiteLetter/index.vue'),
          meta: {
            id: 70530,
            title: t('routes.system.website_letter'),
            // icon: 'menuDocument:svg',
            slectPath: '/system',
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: 'website_letter_info',
              name: 'WebsiteLetterInfo',
              component: () =>
                import(
                  '/@/views/system/informationCenter/websiteLetter/websiteLetterInfo/index.vue'
                ),
              meta: {
                id: 70530,
                title: t('routes.system.website_letter_info'),
                icon: 'menuDocument:svg',
                hideMenu: true,
                // hideTab: true,
                hideBreadcrumb: true,
                currentActiveMenu: '/system/information_center/website_letter',
                slectPath: '/system',
              },
            },
          ],
        },
        {
          path: 'customer_feedback',
          name: 'CustomerFeedback',
          component: () => import('/@/views/system/informationCenter/customerFeedback/index.vue'),
          meta: {
            id: 70540,
            title: t('routes.system.customer_feedback'),
            slectPath: '/system',
            tagName: 'feedback_notice',
            // icon: 'menuUser:svg',
          },
        },
        {
          path: 'sms_code',
          name: 'smsCode',
          component: () => import('/@/views/system/informationCenter/smsCode/index.vue'),
          meta: {
            id: 70426,
            title: t('sys.login.smsCode'),
            slectPath: '/system',
          },
        },
      ],
    },
    {
      path: 'rootManage',
      name: 'RootManage',
      redirect: '/rootManage/roleManage',
      meta: {
        id: 70800,
        title: t('routes.system.authority_management'),
        icon: 'RootManage:svg',
        slectPath: '/system',
      },
      children: [
        {
          path: 'roleManage',
          name: 'RoleManage',
          component: () => import('/@/views/system/rootManage/role/index.vue'),
          meta: {
            id: 70820,
            title: t('common.role_manage'),
            slectPath: '/system',
            hideChildrenInMenu: true,
          },
          children: [
            {
              path: '',
              name: 'eput',

              redirect: 'role', // 默认重定向到 role
              meta: {
                title: t('common.role_manage'),
                id: 70820,
              },
            },
            {
              path: 'role',
              name: 'Role',
              // component: () => import('/@/views/system/rootManage/role/role.vue'),
              meta: {
                id: 70820,
                title: t('routes.system.role'),
              },
            },
            {
              path: 'extendRole',
              name: 'ExtendRole',
              component: () => import('/@/views/system/rootManage/role/extendRole.vue'),
              meta: {
                id: 70820,
                title: '',
                hideTab: true,
                // hideMenu: true,
                hideBreadcrumb: true,
                currentActiveMenu: '/system/rootManage/roleManage',
                slectPath: '/system',
              },
            },
          ],
        },
        {
          path: 'userManage',
          name: 'UserManage',
          component: () => import('/@/views/system/rootManage/userList/index.vue'),
          meta: {
            id: 70810,
            title: t('routes.system.account_list'),
            slectPath: '/system',
          },
        },
        {
          path: 'operate_log',
          name: 'OperateLog',
          component: () => import('/@/views/system/operateLog/index.vue'),
          meta: {
            id: 70700,
            title: t('routes.system.operate_log'),
          },
        },
        // {
        //   path: 'admin_loginLog',
        //   name: 'AdminLoginLog',
        //   component: () => import('/@/views/system/adminLoginLog/index.vue'),
        //   meta: {
        //     id: 70600,
        //     title: t('routes.system.login_manage'),
        //     slectPath: '/system',
        //   },
        // },
      ],
    },
  ],
};

export default system;
