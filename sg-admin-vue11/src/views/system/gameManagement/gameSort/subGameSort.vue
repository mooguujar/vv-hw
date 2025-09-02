<template>
  <PageWrapper
    :title="$t('table.system.system_subgame_sorting')"
    :contentStyle="{ margin: '10px' }"
  >
    <div class="flex bg-white px-3 py-3">
      <div class="flex-1 mr-10">
        <div :class="CLASS_ENUM[3].outBox">
          <label class="w-22 text-left mr-2 mt-2 mb-2"
            >{{ $t('business.common_game_type') }}:</label
          >
          <div :class="CLASS_ENUM[3].innerBox">
            <DragSelectGroup
              class="flex mr-2 flex-wrap"
              item-key="id"
              :currentIndex="currentgame_typeIndex"
              :showPrefixIcon="PAGE_EDIT"
              :showSuffixIcon="false"
              :showAddIcon="false"
              :showCloseIcon="false"
              :draggableList="game_typeList"
              @click:tag="(dIndex) => handleClickgame_type(dIndex)"
            />
          </div>
        </div>
        <div :class="CLASS_ENUM[3].outBox">
          <label class="w-22 text-left mr-2 mt-2 mb-2"
            >{{ $t('table.system.system_game_platform') }}:</label
          >
          <div :class="CLASS_ENUM[3].innerBox">
            <DragSelectGroup
              class="flex mr-2 flex-wrap"
              item-key="id"
              :currentIndex="currentPlatformIndex"
              :showPrefixIcon="PAGE_EDIT"
              :showSuffixIcon="currentCategoryData && currentCategoryData.id === '1'"
              :showAddIcon="false"
              :showCloseIcon="false"
              :disabled="false"
              :activation="true"
              :draggableList="platformList"
              @click:tag="handleClickPlatform"
            />
          </div>
        </div>
        <div :class="CLASS_ENUM[2].outBox">
          <div class="flex items-center">
            <span class="w-30 text-left mr-2"
              >{{ currentPlatformData?.name }}{{ $t('table.system.system_game_all') }}:</span
            >
            <Input
              v-model:value="searchGameName"
              :allow-clear="true"
              :placeholder="$t('table.system.system_input_gameName')"
              style="width: 160px"
            />
            <a-button
              :loading="searchLoading"
              class="ml-2"
              type="primary"
              size="small"
              @click="handleSearchGameList"
            >
              {{ $t('common.queryText') }}
            </a-button>
          </div>
          <div
            ref="listRef"
            :class="CLASS_ENUM[2].innerBox"
            class="resize-box"
            style="position: relative"
          >
            <DragSelectGroup
              class="flex mr-2 flex-wrap"
              item-key="id"
              :group="{ name: 'moveBox', pull: 'clone', put: false }"
              :clone="cloneGame"
              :selectWidth="150"
              :showPrefixIcon="true"
              :showSuffixIcon="true"
              :showAddIcon="false"
              :showCloseIcon="false"
              :activation="false"
              :draggableList="gameList"
            />
            <Loading :loading="searchLoading" :absolute="true" />
          </div>
        </div>
      </div>
      <div class="w-68 flex justify-end">
        <a-button :loading="searchLoading" class="mr-2" plain @click="handleCancelSort">
          {{ $t('common.resetText') }}
        </a-button>
        <a-button type="primary" @click="handleSaveSort">{{ $t('common.saveText') }}</a-button>
      </div>
    </div>
    <Loading :loading="saveLoading" :absolute="false" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount, nextTick, computed } from 'vue';
  import { Input, message } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { DragSelectGroup } from '/@/components/DragSelectGroup';
  import { useGameTabList } from '/@/views/common/commonSetting';
  import Loading from '/@/components/Loading/src/Loading.vue';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { gameTabList } = useGameTabList();
  const { t } = useI18n();
  const listRef = ref(null); // 游戏列表dom
  const saveLoading = ref(false); // 保存加载
  const searchLoading = ref(false); // 游戏列表加载
  const searchGameName = ref(''); // 游戏搜索名称
  const recreationList = ref<any>([]); // 娱乐城类别
  const categoryList = ref<any>([]); // 游戏类别
  const game_typeList = ref<any>([]); // 游戏类型
  const platformList = ref<any>([]); // 游戏平台列表
  const gameList = ref<any>([]); // 游戏列表
  const currentCategoryData = ref<any>(null); // 娱乐城单个类别
  const currentgame_typeIndex = ref(0); // 游戏类型tab下标
  const currentPlatformIndex = ref(0); // 游戏平台tab下标
  const currentPlatformData = ref<any>(null); // 游戏平台tab
  const PAGE_EDIT = ref(false);

  game_typeList.value = gameTabList.map((item) => {
    return { id: item.key, value: item.value };
  });

  handleClickgame_type(0);

  const enum MOVE_TYPE {
    T = 1, // 游戏类别
    P = 2, // 游戏平台
    G = 3, // 游戏列表
    M = 4, // 游戏主类
  }

  const CLASS_ENUM = {
    // 列表样式
    1: {
      outBox: 'flex items-center',
      innerBox: 'flex items-center flex-wrap flex-1',
    },
    2: {
      outBox: 'mt-3 flex flex-col',
      innerBox: 'flex w-full drag-box px-2 py-2 mt-3 items-start flex-wrap overflow-y-auto',
    },
    3: {
      outBox: 'flex flex-col',
      innerBox: 'flex items-center flex-wrap flex-1',
    },
  };

  const filteredItems = computed(() => {
    return gameList.value.filter((item, index) => {
      item._index = -1;
      if (
        searchGameName.value !== '' &&
        // item.name.toLowerCase().includes(searchGameName.value.toLowerCase())
        item.name.toLowerCase() === searchGameName.value.toLowerCase()
      ) {
        item._index = index;
        return item;
      }
    });
  });

  onBeforeMount(async () => {
    await getCategoryList();
  });

  function getCategoryList() {
    return getGameCategoryList({ state: 1 }).then((response) => {
      if (response) {
        categoryList.value = response.map((c, i) => {
          return {
            ...c,
            value: c.zh_name,
            state: c.id === '1' ? true : false,
            items: ref(
              c.items
                ? c.items.map((item) => ({
                    ...item,
                    value: item.zh_name,
                    ty: MOVE_TYPE.G,
                  }))
                : [],
            ),
            litems: ref(
              c.litems
                ? c.litems.map((item) => ({
                    ...item,
                    value: item.zh_name,
                    id: item.platform_id === '0' ? item.cid : item.platform_id,
                  }))
                : [],
            ),
            navs: ref(
              c.navs
                ? c.navs.map((item) => ({
                    ...item,
                    value: item.zh_name,
                    id: item.platform_id === '0' ? item.cid : item.platform_id,
                  }))
                : [],
            ),
            ty: MOVE_TYPE.T,
          };
        });
        const recreationListData = categoryList.value.filter((item) => item.id !== '1');
        recreationList.value = cloneDeep(recreationListData);
      }
    });
  }

  function resetData() {
    searchGameName.value = '';
    gameList.value = [];
  }

  function cloneGame(data) {
    return { ...data };
  }

  // 点击游戏类型获取游戏平台
  async function handleClickgame_type(index) {
    resetData();
    currentgame_typeIndex.value = index;
    const game_type: any = game_typeList.value[index].id;
    const response = await getPlatformSearch({
      page: 1,
      page_size: 50,
      game_type: game_type,
      maintained: 0,
      state: 1,
    });
    const list: any = response ? response.d : [];
    if (list) {
      platformList.value = list.map((item) => {
        return { ...item, id: item.id, value: item.zh_name, ty: MOVE_TYPE.P };
      });
      handleClickPlatform(0);
    } else {
      platformList.value = [];
    }
  }

  // 点击游戏平台获取游戏列表
  async function handleClickPlatform(index) {
    if (index !== currentPlatformIndex.value) {
      resetData();
    }
    currentPlatformIndex.value = index;
    currentPlatformData.value = platformList.value[currentPlatformIndex.value];
    searchLoading.value = true;
    const platform_id: any = platformList.value[currentPlatformIndex.value].id;

    const response = await getSearchGameAllList({
      //   game_type: game_type,
      online: 1,
      platform_id: platform_id,
    });
    searchLoading.value = false;
    const list: any = response;
    if (list) {
      gameList.value = list.map((item) => {
        return {
          ...item,
          value: item.zh_name,
          ty: MOVE_TYPE.G,
        };
      });
    }
  }

  function handleSearchGameList() {
    scrollToFirstItem();
  }

  function scrollToFirstItem() {
    nextTick(() => {
      if (filteredItems.value.length > 0 && listRef.value) {
        listRef.value.scrollTo({
          top: listRef.value.firstChild.children[filteredItems.value[0]._index].offsetTop,
          behavior: 'smooth',
        });
      } else {
        if (searchGameName.value === '') {
          return;
        }
        message.error(t('table.system.system_know_game'));
      }
    });
  }

  // 重置
  function handleCancelSort() {
    handleClickPlatform(currentPlatformIndex.value);
  }

  // 保存
  async function handleSaveSort() {
    saveLoading.value = true;
    const params = {
      platform_id: null,
      data: [],
    };
    params.data = gameList.value.map((item) => {
      return { id: item.id };
    });
    params.platform_id = platformList.value[currentPlatformIndex.value].id;

    const { data, status } = await updateGameBacthSorting(params);
    if (status) {
      saveLoading.value = false;
      handleClickPlatform(currentPlatformIndex.value);
      message.success(data);
    } else {
      message.error(data);
    }
  }
</script>

<style lang="less" scoped>
  .drag-box {
    min-height: 60px;
    max-height: 270px;
    border: 1px solid lighten(@primary-color, 10%);
    border-radius: 6px;
    background-color: rgb(242 242 242 / 50%);
  }

  .group-list {
    width: 100%;
    min-height: 40px;
  }

  .resize-box {
    height: 270px;
    max-height: 470px;
    resize: vertical;
  }
</style>
