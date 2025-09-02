import type { App } from 'vue'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('~/pages/casino/index.vue'),
  },
  {
    path: '/favourites',
    name: 'Favourites',
    component: () => import('~/pages/casino/favourites.vue'),
    meta: { needLogin: true },
  },
  {
    path: '/recent',
    name: 'Recent',
    component: () => import('~/pages/casino/recent.vue'),
    meta: { needLogin: true },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('~/pages/casino/search.vue'),
  },
  {
    path: '/group',
    children: [
      {
        path: 'provider',
        name: 'GroupProvider',
        component: () => import('~/pages/group/provider.vue'),
      },
      {
        path: 'category',
        name: 'GroupCategory',
        component: () => import('~/pages/group/category.vue'),
      },
    ],
  },
  {
    path: '/games',
    children: [
      {
        path: 'mobile-game-frame',
        name: 'MobileGameFrame',
        component: () => import('~/pages/games/mobile-game-frame.vue'),
      },
      {
        path: 'mobile-lottery',
        name: 'MobileLottery',
        component: () => import('~/pages/games/mobile-lottery.vue'),
      },
      {
        path: ':id',
        name: 'CasinoGame',
        component: () => import('~/pages/games/index.vue'),
      },
    ],
  },
  {
    path: '/original-game',
    children: [
      {
        path: 'wheel',
        name: 'OriginaGamelwheel',
        component: () => import('~/pages/original-game/wheel/index.vue'),
      },
      {
        path: 'crash',
        name: 'OriginalGameCrash',
        component: () => import('~/pages/original-game/crash/index.vue'),
      },
      {
        path: 'limbo',
        name: 'OriginalGameLimbo',
        component: () => import('~/pages/original-game/limbo/index.vue'),
      },
      {
        path: 'mines',
        name: 'OriginalGameMines',
        component: () => import('~/pages/original-game/mines/index.vue'),
      },
      {
        path: 'keno',
        name: 'OriginalGameKeno',
        component: () => import('~/pages/original-game/keno/index.vue'),
      },
      {
        path: 'dice',
        name: 'OriginalGameDice',
        component: () => import('~/pages/original-game/dice/index.vue'),
      },
      {
        path: 'hilo',
        name: 'OriginalGameHilo',
        component: () => import('~/pages/original-game/hilo/index.vue'),
      },
      {
        path: 'blackjack',
        name: 'OriginalGameBlackjack',
        component: () => import('~/pages/original-game/blackjack/index.vue'),
      },
      {
        path: 'plinko',
        name: 'OriginalGamePlinko',
        component: () => import('~/pages/original-game/plinko/index.vue'),
      },
    ],
  },
  {
    path: '/promotions',
    children: [
      {
        path: '',
        name: 'PromotionList',
        component: () => import('~/pages/promotions/index.vue'),
      },
      {
        path: 'promotion/:id',
        name: 'PromotionDetail',
        component: () => import('~/pages/promotions/promotion.vue'),
      },
    ],
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('~/pages/wallet/index.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('~/pages/chat/index.vue'),
  },
  {
    path: '/wallet/deposit-detail',
    name: 'depositDetail',
    component: () => import('~/pages/wallet/deposit-detail.vue'),
  },
  {
    path: '/wallet/vir-deposit-detail',
    name: 'virDepositDetail',
    component: () => import('~/pages/wallet/virtual-deposit-detail.vue'),
  },
  {
    path: '/wallet/deposit-detail/submit',
    name: 'depositDetailSubmit',
    component: () => import('~/pages/wallet/deposit-detail-submit.vue'),
  },
  {
    path: '/wallet/bebank/:type',
    name: 'withdrawBank',
    component: () => import('~/pages/wallet/bebank.vue'),
  },
  /** ⚾️⚾️ 体育 ⚾️⚾️ */
  {
    path: '/sports',
    children: [
      {
        path: '',
        name: 'Sports',
        component: () => import('~/pages/sports/index.vue'),
      },
      {
        path: ':sport(\\d+)',
        name: 'AppSportsSport',
        component: () => import('~/pages/sports/sport.vue'),
      },
      {
        path: ':sport(\\d+)/:region(\\d+)',
        name: 'AppSportsRegion',
        component: () => import('~/pages/sports/region.vue'),
      },
      {
        path: ':sport(\\d+)/:region(\\d+)/:league(\\d+)',
        name: 'AppSportsLeague',
        component: () => import('~/pages/sports/league.vue'),
      },
      {
        path: ':sport(\\d+)/:region(\\d+)/:league(\\d+)/:fixture(\\d+)',
        name: 'AppSportsFixture',
        component: () => import('~/pages/sports/fixture.vue'),
      },
      {
        path: 'outrights',
        name: 'AppSportsOutrights',
        component: () => import('~/pages/sports/outrights.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('~/pages/login/index.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('~/pages/register/index.vue'),
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('~/pages/policy/index.vue'),
  },
  {
    path: '/components',
    name: 'components',
    component: () => import('~/pages/components.vue'),
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('~/pages/message/index.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('~/pages/user/index.vue'),
    children: [
      {
        path: '',
        name: 'UserCenter',
        component: () => import('~/pages/user/center.vue'),
      },
      {
        path: 'coupon',
        name: 'UserCoupon',
        component: () => import('~/pages/user/coupon.vue'),
      },
      {
        path: 'language',
        name: 'UserLanguage',
        component: () => import('~/pages/user/language.vue'),
      },
      {
        path: 'info',
        name: 'UserInfo',
        component: () => import('~/pages/user/info.vue'),
      },
      {
        path: 'name',
        name: 'UserName',
        component: () => import('~/pages/user/name.vue'),
      },
      {
        path: 'gender',
        name: 'UserGender',
        component: () => import('~/pages/user/gender.vue'),
      },
      {
        path: 'nationality',
        name: 'UserNationality',
        component: () => import('~/pages/user/nationality.vue'),
      },
      /*  {
        path: 'avatar',
        name: 'UserAvatar',
        component: () => import('~/pages/user/avatar.vue'),
      }, */
    ],
  },
  {
    path: '/rebate-center',
    name: 'RebateCenter',
    component: () => import('~/pages/rebate-center/index.vue'),
    children: [
      {
        path: '',
        name: 'RebateCenterRebate',
        component: () => import('~/pages/rebate-center/rebate.vue'),
      },
      {
        path: 'record',
        name: 'RebateCenterRecord',
        component: () => import('~/pages/rebate-center/record.vue'),
      },
      {
        path: 'rebate-detail',
        name: 'RebateCenterRebateDetail',
        component: () => import('~/pages/rebate-center/rebate-detail.vue'),
      },
    ],
  },
  {
    path: '/affiliate',
    name: 'Alliance',
    component: () => import('~/pages/affiliate/index.vue'),
  },
  {
    path: '/bets-record',
    name: 'BetsRecord',
    component: () => import('~/pages/bets-record/index.vue'),
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('~/pages/service.vue'),
  },
  {
    path: '/transaction-record',
    name: 'TransactionRecord',
    component: () => import('~/pages/transaction-record/index.vue'),
  },
  {
    path: '/transaction-record-detail',
    name: 'TransactionRecordDetail',
    component: () => import('~/pages/transaction-record-detail/index.vue'),
  },
  {
    path: '/interest',
    name: 'Interest',
    component: () => import('~/pages/interest/index.vue'),
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('~/pages/setting/index.vue'),
  },
  {
    path: '/email',
    name: 'EmailSetting',
    component: () => import('~/pages/setting/email.vue'),
  },
  {
    path: '/phone',
    name: 'PhoneSetting',
    component: () => import('~/pages/setting/phone.vue'),
  },
  {
    path: '/login-password',
    name: 'LoginPasswordSetting',
    component: () => import('~/pages/setting/login-password.vue'),
  },
  {
    path: '/wallet-password',
    name: 'WalletPasswordSetting',
    component: () => import('~/pages/setting/wallet-password.vue'),
  },
  {
    path: '/social-media',
    name: 'SocialMediaSetting',
    component: () => import('~/pages/setting/social-media.vue'),
  },
  {
    path: '/login-history',
    name: 'LoginHistory',
    component: () => import('~/pages/setting/login-history.vue'),
  },
  {
    path: '/double-verify',
    name: 'DoubleVerify',
    component: () => import('~/pages/setting/double-verify.vue'),
  },
  {
    path: '/policies',
    // name: 'Policies',
    component: () => import('~/pages/policies/index.vue'),
    children: [
      {
        path: '',
        name: 'Policies',
        component: () => import('~/pages/policies/list.vue'),
      },
      {
        path: 'about-us',
        name: 'AboutUs',
        component: () => import('~/pages/policies/about-us.vue'),
      },
      {
        path: 'betting-station',
        name: 'BettingStation',
        component: () => import('~/pages/policies/betting-station.vue'),
      },
      {
        path: 'faqs',
        name: 'Faqs',
        component: () => import('~/pages/policies/faqs.vue'),
      },
      {
        path: 'responsible-gaming',
        name: 'ResponsibleGaming',
        component: () => import('~/pages/policies/responsible-gaming.vue'),
      },
      {
        path: 'terms-of-use',
        name: 'TermsOfUse',
        component: () => import('~/pages/policies/terms-of-use.vue'),
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: () => import('~/pages/policies/privacy-policy.vue'),
      },
    ],
  },
  {
    path: '/vip',
    name: 'AppVip',
    component: () => import('~/pages/vip/index.vue'),
  },
  {
    path: '/task/task-record',
    name: 'TaskRecord',
    component: () => import('~/pages/task/task-record.vue'),
  },
  {
    path: '/task/task-inner-d',
    name: 'TaskInnerD',
    component: () => import('~/pages/task/task-inner-d.vue'),
  },
  {
    path: '/task/task-inner-b',
    name: 'TaskInnerB',
    component: () => import('~/pages/task/task-inner-b.vue'),
  },
  {
    path: '/provably-fair',
    name: 'ProvablyFair',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/overview',
    name: 'ProvablyFairOverview',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/implementation',
    name: 'ProvablyFairImplementation',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/conversions',
    name: 'ProvablyFairConversions',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/game-events',
    name: 'ProvablyFairGameEvents',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/server-seed-unhash',
    name: 'ProvablyFairServerSeedUnhash',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/calculation',
    name: 'ProvablyFairCalculation',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/lottery/win-go',
    name: 'LotteryWinGo',
    component: () => import('~/pages/lottery/win-go/index.vue'),
  },
  {
    path: '/lottery/racing',
    name: 'LotteryRacing',
    component: () => import('~/pages/lottery/racing/index.vue'),
  },
  {
    path: '/lottery/racing/detail',
    name: 'LotteryRacingDetail',
    component: () => import('~/pages/lottery/racing/detail.vue'),
  },
  {
    path: '/lottery/win-go/detail',
    name: 'LotteryWinGoDetail',
    component: () => import('~/pages/lottery/win-go/detail.vue'),
  },
  {
    path: '/lottery/5d',
    name: 'Lottery5D',
    component: () => import('~/pages/lottery/5d/index.vue'),
  },
  {
    path: '/lottery/5d/detail',
    name: 'Lottery5DDetail',
    component: () => import('~/pages/lottery/5d/detail.vue'),
  },
  {
    path: '/lottery/trx-win-go',
    name: 'LotteryTrxWinGo',
    component: () => import('~/pages/lottery/trx-win-go/index.vue'),
  },
  {
    path: '/lottery/trx-win-go/detail',
    name: 'LotteryTrxWinGoDetail',
    component: () => import('~/pages/lottery/trx-win-go/detail.vue'),
  },
  {
    path: '/lottery/k3',
    name: 'LotteryK3',
    component: () => import('~/pages/lottery/k3/index.vue'),
  },
  {
    path: '/lottery/k3/detail',
    name: 'LotteryK3Detail',
    component: () => import('~/pages/lottery/k3/detail.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const { isLogin } = storeToRefs(useAppStore())
  if (to.path === '/casino') {
    return next('/')
  }
  if (to.meta.needLogin && !isLogin.value) {
    next('/login')
  }
  next()
})

let lastPosition = ''
router.afterEach((to, from, failure) => {
  const currentPosition = history.state?.position ?? 0

  if (lastPosition !== '') {
    const isBack = currentPosition < lastPosition

    lastPosition = currentPosition

    to.meta.transitionName = isBack ? 'slide-right' : 'slide-left'
  }
  else {
    lastPosition = currentPosition
  }
})

export function install(app: App<Element>) {
  app.use(router)
}
