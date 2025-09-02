import { useBoolean, useLoadDialogActivity, useLoadDialogSiteAnnouncement } from '@tg/hooks'
import { isAdmin, isFlutterApp } from '@tg/utils'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from './app'
import { useDownloadStore } from './download'
import { useLoadFirstDepositDialog } from './load-first-deposit'

export type NameType = 'Register' | 'Login' | 'Download' | 'Announcement' | 'Activity' | 'ActivityDeposit' | 'DownloadBottom'

/**
 * @description 管理页面刷新弹框
 */
export const useNotLoginReloadDialog = defineStore('notLoginReloadDialog', () => {
  const curIndex = ref(0)
  const curName = ref<NameType>()
  const route = useRoute()
  const { bool: isShow, setTrue: setShowTrue, setFalse: setShowFalse } = useBoolean(false)
  const { noticeList, isFetchOk: announcementIsFetchOk } = useLoadDialogSiteAnnouncement()
  const { unLoginOpenActivity, isFetchOk: activityIsFetchOk, turntableData, loggedOpenActivityThrottle } = useLoadDialogActivity()
  const { popData, isFetchOk: firstDepositIsFetchOk } = storeToRefs(useLoadFirstDepositDialog())
  const dialogNameList = ref<{ name: NameType, isShow: boolean | undefined }[]>([])

  const { isLogin } = storeToRefs(useAppStore())
  const { isOpenDownLoadDialog, isOpenDownLoadDialogBottom } = storeToRefs(useDownloadStore())

  function isShowContent(name: NameType) {
    return dialogNameList.value.findIndex(item => item.name === name) > -1
  }

  function next() {
    if (!isShow.value)
      return

    curIndex.value++
    const _curName = dialogNameList.value[curIndex.value]?.name
    if (_curName) {
      curName.value = _curName
    }
    else {
      curName.value = undefined
      setShowFalse()
    }
  }

  function popupClickHandle() {
    next()
  }

  watch([announcementIsFetchOk, activityIsFetchOk, firstDepositIsFetchOk], ([_announcement, _activity, _firstDeposit]) => {
    if (_announcement && _activity && _firstDeposit && route.name === 'Home' && !isAdmin() && !isFlutterApp() && !isLogin.value) {
      dialogNameList.value = [
        // {
        //   name: 'Register',
        //   isShow: globalInitMap.isOpenRegisterDialog,
        // },
        // {
        //   name: 'Login',
        //   isShow: globalInitMap.isOpenLoginDialog,
        // },
        {
          name: 'Download',
          isShow: isOpenDownLoadDialog.value,
        },
        {
          name: 'Activity', // 转盘
          isShow: turntableData.value !== null,
        },
        {
          name: 'ActivityDeposit', // 首充
          isShow: Boolean(popData.value) && popData.value.promo_info.config.firstDepositPop !== 3, // null或undefined 不显示
        },
        {
          name: 'Announcement',
          isShow: noticeList.value.length > 0,
        },
        // {
        //   name: 'DownloadBottom',
        //   isShow: isOpenDownLoadDialogBottom.value,
        // },
      ].filter(item => item.isShow) as typeof dialogNameList.value

      if (dialogNameList.value.length > 0) {
        setShowTrue()

        curName.value = dialogNameList.value[0].name
      }
    }
  }, { immediate: true })

  watch(isLogin, (val) => {
    if (!val)
      unLoginOpenActivity()
  }, { immediate: true })

  watch(() => route.name, (val) => {
    if (route.name !== 'Home') {
      isShow.value = false
    }
    else if (curName.value) {
      isShow.value = true
    }
  })

  return {
    isShow,
    curName,
    turntableData,
    noticeList,
    popData,
    popupClickHandle,
    isShowContent,
    next,
    setShowFalse,
    setShowTrue,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useNotLoginReloadDialog, import.meta.hot))
