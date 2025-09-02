<script setup lang="ts">
import { ApiMemberGameCate, ApiMemberGameCateGames } from '@tg/apis'
import { BaseImage } from '@tg/bccomponents'
import { useCasinoStore } from '@tg/stores'
import { throttle } from 'lodash'
import { computed, onMounted, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppCasinoGamesTitle from '~/components/AppCasinoGamesTitle.vue'
import AppCasinoMultiLine from '~/components/AppCasinoMultiLine.vue'
import AppGameLotteryList from '~/components/AppGameLotteryList.vue'
import AppLoading from '~/components/AppLoading.vue'
import { Message } from '~/utils'

interface ComponentItem {
  cid: string
  name: string
  icon: string
  ty: string | number
  platform_id: string
}

interface Props {
  detail: ComponentItem
}

const props = withDefaults(defineProps<Props>(), {})
const router = useRouter()
const { t } = useI18n()
const CasinoStore = useCasinoStore()
const notifyThrottle = throttle(() => {
  Message.info(t('暂无游戏内容'))
}, 5 * 1000, { leading: true, trailing: false })

const params = computed(() => {
  return {
    cid: props.detail.cid,
    ty: props.detail.ty,
  }
})
const { data, runAsync, loading } = useRequest(ApiMemberGameCate, {
  onSuccess: (res) => {
    console.log('ApiMemberGameCate', params, res)
    judgeGameEmpty(res)
  },
})
const { data: moreList, runAsync: runMoreMemberGameCateGames, loading: moreLoading } = useRequest(ApiMemberGameCateGames)

const isProvider = computed(() => props.detail.cid === '5')
const isLottery = computed(() => data.value?.id === '703')
const total = computed(() => data.value ? data.value.total : 0)

// 游戏供应商数据 平铺
const providerList = computed(() => {
  if (data.value && data.value.venue && !!data.value.venue.pc)
    return data.value.venue.pc[0]
  return []
})

// 单个游戏数据
const list = computed(() => {
  if (!(data.value && data.value.games && data.value.games.length))
    return []

  const renderList: any = data.value.games
  if (moreList.value?.d && moreList.value.d.length)
    renderList.push(...moreList.value.d)

  return renderList
})

// 多行数据  litems 下面可能是两个数组  代表每一行
const litems = computed(() => {
  if (data.value && data.value.litems) {
    const list = data.value.litems.map((a) => {
      return {
        ...a,
        path: `/group/category?cid=${a.cid}&ty=${a.ty ?? props.detail.ty}`,
        gameList: a.nav_games?.map((b, i) => {
          return {
            item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[i] ?? 4 : 4,
            list: toRaw(b),
          }
        }),
      }
    })
    return list
  }
  return []
})

function _push() {
  if (props.detail.cid === '6')
    return (`/group/provider?vid=801&ty=${props.detail.ty}`)

  if (props.detail.cid === '5')
    return (`/collection/provider?ty=${props.detail.ty}`)

  else
    return (`/group/category?cid=${props.detail.cid}&ty=${props.detail.ty}`)
}

function toProvider(item: any) {
  if (item.maintained === '2')
    return
  router.push(`/group/provider?vid=${item.id}&ty=${props.detail.ty}`)
}

function judgeGameEmpty(res: any) {
  if (isProvider.value && res.venue)
    return
  if (res.litems && res.litems.length) {
    if (res.litems.filter((rr: any) => rr.nav_games && rr.nav_games.length).length === 0)
      notifyThrottle()
  }
  else if (!(res.games && res.games.length)) {
    notifyThrottle()
  }
}

onMounted(() => {
  runAsync(CasinoStore.getTy({ ...params.value }))
})
</script>

<template>
  <div v-if="loading">
    <AppLoading :height="300" />
  </div>
  <div v-else class="pb-[16rem]">
    <!-- 提供商 -->
    <div v-if="isProvider" class="mt-[12rem]">
      <AppCasinoGamesTitle class="mb-[8rem]" :title="detail.name" :total="providerList.length" path="provider" />
      <div class="grid gap-x-[var(--ph-game-gap-x)] gap-y-[var(--ph-game-gap-y)] grid-cols-3 ">
        <div v-for="item in providerList" :key="item.name" class="overflow-hidden rounded-[6rem] cursor-pointer">
          <BaseImage is-network :url="item.icon" @click="toProvider(item)" />
        </div>
      </div>
    </div>
    <div v-else class="mt-[12rem]">
      <!-- 平铺 -->
      <template v-if="litems.length === 0">
        <AppCasinoGamesTitle class="mb-[8rem]" :title="detail.name" :total="total" :path="_push()" />
        <!-- 普通的游戏列表 -->
        <AppCasinoGameList v-if="list.length > 0 && !isLottery" :list="list" />
        <AppGameLotteryList v-else-if="list.length > 0 && isLottery" :list="list" />
        <div
          v-if="list.length < total" class="bg-[#fff] mt-[8rem] rounded-[6rem] center h-[32rem]"
          @click="router.push(_push())"
        >
          {{ t('所有游戏') }}
        </div>
      </template>
      <!-- 多行样式 -->
      <template v-else-if="litems.length > 0">
        <AppCasinoMultiLine
          v-for="item in litems" :key="item.ty + item.cid" :detail="item"
          class="mb-[16rem] last:mb-0"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
