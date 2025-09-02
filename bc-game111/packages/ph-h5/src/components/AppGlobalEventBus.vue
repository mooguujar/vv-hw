<script setup lang='ts'>
import type { VNode } from 'vue'
import { useAppStore, useCurrency } from '@tg/stores'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus, socketClient } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { debounce } from 'lodash'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { usePromoNotifications } from '~/hooks'
import { Message } from '~/utils'

defineOptions({ name: 'AppGlobalEventBus' })

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const currencyStore = useCurrency()
const { t } = useI18n()

const tokenCallBack = debounce(() => {
  appStore.removeToken()
  appStore.removeUserInfo()
  appStore.setMqttConnectedFalse()
  socketClient.connect('token失效 重新连接')
  Message.error(t('登录失效，请重新登录'))
  if (route.name !== 'Home')
    router.push('/login')
}, 1000, { leading: true, trailing: false })

function errorMessageCallback(message: string) {
  let newMessage = message
  switch (message) {
    case '5023':
      newMessage = t('余额不足')
      break
    case '':
      newMessage = t('系统错误')
      break
    default:
      break
  }
  Message.error(newMessage)
}

/** ⚾️⚾️ 体育跳转路由 ⚾️⚾️ */
function goPage(config: {
  name: ESportsToMainPageRoutes
  data?: any
}) {
  const routeName = config.name

  if (routeName === ESportsToMainPageRoutes.LOGIN) {
    router.push('/login')
  }
  else if (routeName === ESportsToMainPageRoutes.REGISTER) {
    router.push('/register')
  }
  else if (routeName === ESportsToMainPageRoutes.SPORTS_HOME) {
    router.push('/sports')
  }
  else if (routeName === ESportsToMainPageRoutes.MY_BET) {
    router.push('/bets-record?type=sports')
  }
  else if (routeName === ESportsToMainPageRoutes.SPORT) {
    const data = config.data
    const path = `/sports/${data.si}${data.query ? `?${data.query}` : ''}`
    router.push(path)
  }
  else if (routeName === ESportsToMainPageRoutes.REGION) {
    const data = config.data
    const path = `/sports/${data.si}/${data.pgid}${data.query ? `?${data.query}` : ''}`
    router.push(path)
  }
  else if (routeName === ESportsToMainPageRoutes.LEAGUE) {
    const data = config.data
    const path = `/sports/${data.si}/${data.pgid}/${data.ci}${data.query ? `?${data.query}` : ''}`
    router.push(path)
  }
  else if (routeName === ESportsToMainPageRoutes.FIXTURE) {
    const data = config.data
    const path = `/sports/${data.si}/${data.pgid}/${data.ci}/${data.ei}${data.query ? `?${data.query}` : ''}`
    router.push(path)
  }
  else if (routeName === ESportsToMainPageRoutes.OUTRIGHT) {
    const data = config.data
    router.push(`/sports/outrights?si=${data.si}&ci=${data.ci}&ei=${data.ei}`)
  }
}
function goPageLottery(url: string) {
  console.log('🚀 ~ goPageLottery ~ url:', url)
  if (url === 'back') {
    return router.back()
  }
  if (url === 'login') {
    return router.push('/login')
  }
  if (url === '/win-go/detail')
    return router.push('/lottery/win-go/detail')
  if (url === '/racing/detail')
    return router.push('/lottery/racing/detail')
  if (url === '/k3/detail')
    return router.push('/lottery/k3/detail')
  if (url === '/5d/detail')
    return router.push('/lottery/5d/detail')
  if (url === '/trx-win-go/detail')
    return router.push('/lottery/trx-win-go/detail')
}

/** 活动奖金通知 */
function onPromoBonusNotify(data: any) {
  usePromoNotifications(data)
}

function onAppGlobalMessage(data: {
  content: string | VNode
  type: 'info' | 'error' | 'success'
}) {
  Message[data.type](data.content)
}

onMounted(() => {
  // 登录实效
  appEventBus.on(EventBusNames.TOKEN, tokenCallBack)
  // 接口报错
  appEventBus.on(EventBusNames.API_ERROR_MESSAGE, errorMessageCallback)
  // 体育通知路由跳转
  appEventBus.on(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, goPage)
  // 体育通知路由跳转
  appEventBus.on(EventBusNames.LOTTERY_TO_MAIN_PAGE_ROUTE, goPageLottery)
  // 刷新余额
  appEventBus.on(EventBusNames.REFRESH_BALANCE_BUS, () => {
    currencyStore.initCurrencyList()
  })
  // 刷新用户信息
  appEventBus.on(EventBusNames.REFRESH_MEMBER_BUS, () => {
    appStore.updateUserInfo()
  })
  // 维护
  appEventBus.on(EventBusNames.SITE_MAINTAIN, (data) => {
    const { maintain, state, direct, content } = data
    if (!direct)
      data.content = content[getLangForBackend() ?? 'default']

    // state 1 正常, 2 站点限制, 3 站点冻结
    // maintain 1 开放 2 维护
    // TODO
  })
  // 活动奖金通知
  appEventBus.on(EventBusNames.PROMO_BONUS_NOTIFICATION, onPromoBonusNotify)
  // 项目外需要触发Message事件
  appEventBus.on(EventBusNames.APP_GLOBAL_MESSAGE, onAppGlobalMessage)
})
</script>

<template>
  <div />
</template>

<style lang='scss' scoped></style>
