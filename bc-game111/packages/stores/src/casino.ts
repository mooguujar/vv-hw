import type { IApiMemberGameLobbyRes, Menu } from '@tg/types'
import { ApiMemberGameLobby, ApiMemberPlatformVenueList } from '@tg/apis'
import { useBoolean } from '@tg/hooks'
import { cloneDeep } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

export const useCasinoStore = defineStore('casino', () => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const isSidebarHasProvider = ref(false)
  const currentCasinoNav = ref('')
  const firstCasinoNav = ref('')
  const sidebarClickTime = ref(0)

  const { bool: hasBetOrder, setBool: setHasBetOrder } = useBoolean(false)

  /** 游戏提供商数据(PG,EVO,...) */
  const venueList = ref()
  async function getMemberPlatformVenueList() {
    const res = await ApiMemberPlatformVenueList({ page: 1, page_size: 100, game_type: 0 })
    venueList.value = res.d
  }

  // 大厅总数据接口
  const data = ref<IApiMemberGameLobbyRes>()
  async function runAsyncGameLobby() {
    const res = await ApiMemberGameLobby()
    data.value = res
    if (res.navs && res.navs.length > 0) {
      // 修改大厅的ty
      res.navs.forEach((item, index) => {
        if (item.ty === 1 && item.cid === '1') {
          res.navs[index].ty = -1
          res.navs[index].cid = 'all'
          res.navs[index].platform_id = 'all'
        }
      })

      firstCasinoNav.value = res.navs[0].ty === 1 ? `${res.navs[0].ty}&${res.navs[0].cid}` : `${res.navs[0].ty}&${res.navs[0].platform_id}`
      currentCasinoNav.value = res.navs[0].ty === 1 ? `${res.navs[0].ty}&${res.navs[0].cid}` : `${res.navs[0].ty}&${res.navs[0].platform_id}`
    }

    if (res.sidebars && res.sidebars.find(a => a.cid === '5'))
      isSidebarHasProvider.value = true
  }

  /** 厂商列表 */
  const cateProviderData = computed(() => {
    if (data.value && data.value.venues)
      return data.value.venues
    return {
      id: '',
      name: '',
      icon: '',
      total: 0,
      venue: {
        pc: [],
        h5: [],
      },
    }
  })
  // 横向菜单
  const casinoNav = computed(() => {
    if (data.value) {
      if (data.value.navs && data.value.navs.length) {
        const _navs: {
          ty: number
          cid: string
          platform_id: string
          name: string
          icon: string
          background: string
          useCloudImg: boolean
        }[] = cloneDeep(data.value.navs)

        for (let i = 0; i < _navs.length; i++)
          _navs[i].useCloudImg = true

        return _navs.map((a) => {
          return {
            ...a,
            label: a.name,
            value: a.ty === 1 ? `${a.ty}&${a.cid}` : `${a.ty}&${a.platform_id}`,
          }
        })
      }
      return null
    }
    return []
  })
  // 大厅游戏列表
  const casinoGameList = computed(() => {
    if (data.value && data.value.litems) {
      return data.value.litems.map(a => ({
        ...toRaw(a),
        title: a.name,
        list: [],
        path: a.cid === '6'
          ? `/group/provider?vid=801&ty=${a.ty}`
          : `/group/category?cid=${a.ty === 1 ? a.cid : a.cid}&ty=${a.ty}`, // platform_id
        useCloudImg: true,
        gameList: a.nav_games?.map((b, i) => {
          return {
            item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[i] ?? 4 : 4,
            list: toRaw(b),
          }
        }),
      }))
    }
    return []
  })

  const casinoGameProvider = computed<Menu>(() => {
    if (data.value && data.value!.navs && data.value!.navs.length && data.value!.navs.filter((n: Record<string, any>) => +n.ty === 1 && n.cid === '5').length) {
      return [{
        title: t('游戏提供商'),
        callBack: () => {
          currentCasinoNav.value = '1&5'
          setTimeout(() => {
            sidebarClickTime.value = new Date().getTime()
            if (route.name !== 'casino-home')
              router.push('/')
          }, 0)
        },
        icon: 'chess-game-provider',
        list: [],
        domId: '',
      }]
    }
    return [{
      title: t('游戏提供商'),
      path: '/casino/collection/provider',
      icon: 'chess-game-provider',
      list: [],
      domId: '',
    }]
  })

  // 左侧边栏
  const casinoSidebar = computed(() => {
    if (data.value && data.value.sidebars) {
      return data.value.sidebars.filter((b: Record<string, any>) => b.cid !== '5').map((a: Record<string, any>) => {
        if ((+a.ty === 1 || +a.ty === 5) && data.value!.navs && data.value!.navs.length && data.value!.navs.filter((n: Record<string, any>) => (+n.ty === 1 || +n.ty === 5) && n.cid === a.cid).length) {
          return {
            ...a,
            title: a.name,
            list: [],
            // path: a.cid === '6'
            //   ? `/provider?vid=801&ty=${a.ty}`
            //   : `/category?cid=${a.ty === 1 ? a.cid : a.platform_id}&ty=${a.ty}`,
            callBack: () => {
              currentCasinoNav.value = `${a.ty}&${a.cid}`
              setTimeout(() => {
                sidebarClickTime.value = new Date().getTime()
                if (route.name !== 'casino-home')
                  router.push('/')
              }, 0)
            },
            useCloudImg: true,
          }
        }

        return {
          ...a,
          title: a.name,
          list: [],
          path: a.cid === '6'
            ? `/group/provider?vid=801&ty=${a.ty}`
            : `/group/category?cid=${a.ty === 1 ? a.cid : a.cid}&ty=${a.ty}`, // platform_id
          useCloudImg: true,
        }
      })
    }
    return []
  })
  // 推荐游戏
  const casinoRecData = computed(() => {
    if (data.value && data.value.bottoms) {
      const obj = data.value.bottoms[0]
      return {
        ...obj,
        path: '/category?cid=100', // ${obj.cid}
        useCloudImg: true,
      }
    }

    return {
      ty: 1,
      total: 0,
      platform_id: '0',
      name: t('热门推荐'),
      icon: 'uni-rec-games',
      games: [],
      path: '',
      cid: '',
      useCloudImg: false,
    }
  })

  function getBg(cid: string) {
    if (data.value) {
      const navs = data.value.navs ?? []
      const sidebars = data.value.sidebars ?? []
      const bottoms = data.value.bottoms ?? []
      const litems = data.value.litems ?? []
      const arr = [...navs, ...sidebars, ...bottoms, ...litems]
      const str = arr.find(a => a.cid === cid || a.platform_id === cid)?.background ?? ''
      return str
    }
    return ''
  }
  function getTitleByCid(cid: string, ty?: number) {
    if (cid === '100')
      return t('热门推荐')
    if (ty && ty === 6)
      return 'Hot'
    if (ty && ty === 7)
      return 'New'
    if (data.value) {
      const navs = data.value.navs ?? []
      const sidebars = data.value.sidebars ?? []
      const items = data.value.litems ?? []
      const bottoms = data.value.bottoms ?? []
      const arr = [...navs, ...sidebars, ...items, ...bottoms]
      const str = arr.find((a) => {
        if (ty)
          return a.cid === cid && a.ty === ty

        return a.cid === cid || a.platform_id === cid
      })?.name ?? ''
      return str
    }
    return ''
  }
  function getTitleByVid(vid: string) {
    if (venueList.value)
      return venueList.value.find((a: Record<string, any>) => a.id === vid || a.venue_id === vid)?.name ?? ''
    return ''
  }

  function getTy(params: any) {
    if (params && params.ty) {
      if (params.ty && +params.ty === 2)
        params.ty = 4
      else if (params.ty && +params.ty === 3)
        params.ty = 2
    }
    return params
  }

  // 手动
  runAsyncGameLobby()
  getMemberPlatformVenueList()
  return {
    venueList,
    casinoNav,
    casinoGameList,
    casinoSidebar,
    casinoGameProvider,
    cateProviderData,
    lobbyBdata: data,
    isSidebarHasProvider,
    casinoRecData,
    currentCasinoNav,
    firstCasinoNav,
    sidebarClickTime,
    hasBetOrder,
    runAsyncGameLobby,
    getBg,
    getTitleByCid,
    getTitleByVid,
    setHasBetOrder,
    getTy,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCasinoStore, import.meta.hot))
