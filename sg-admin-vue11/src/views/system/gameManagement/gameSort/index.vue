<template>
  <PageWrapper :contentStyle="{ margin: '10px 10px 20px 20px' }">
    <div class="no-select">
      <Tabs v-model:activeKey="languageModal" @change="clickTab(languageModal)" class="capsule_tap">
        <TabPane
          v-for="(item, index) in langrageArr"
          :disabled="PAGE_EDIT && languageModal != item.value"
          :tab="item.label"
          :key="item.value"
        />
      </Tabs>
      <Tabs
        v-model:activeKey="currentTopIndex"
        @change="handleClickTopNav(currentTopIndex)"
        class="capsule_tap !mt-10px"
      >
        <TabPane v-for="(item, index) in topNavList" :tab="item.value" :key="index" />
      </Tabs>
      <Tabs
        v-model:activeKey="firstNavIndex"
        @change="firstHandle(firstNavIndex)"
        class="capsule_tap !mt-10px"
      >
        <TabPane v-for="(item, index) in firstNavs" :tab="item.value" :key="index" />
      </Tabs>
      <div class="flex mt-10px">
        <div class="w-20px grow-3">
          <!-- 大厅导航 -->
          <div
            class="!min-h-4 sxjuz_j lobbylistBG"
            v-if="currentTopIndex === 0 && firstNavIndex === 0"
          >
            <label class="gameSortLabel">{{ $t('table.system.system_sort_hall') }}:</label>

            <DragSelectGroup
              item-key="id"
              suffix="move"
              :isLogo="true"
              :activation="true"
              :move="disabledMove"
              :end="addFunc"
              :dragDisabled="!disabledLangrage"
              class="group-nav5 w-full nav-list 大厅导航"
              :group="{ name: 'moveBox', pull: false, put: true }"
              :showPrefixIcon="PAGE_EDIT"
              :showSuffixIcon="PAGE_EDIT"
              :showAddIcon="false"
              :showCloseIcon="PAGE_EDIT"
              :currentIndex="currentIndexLitems"
              @change="
                (data) =>
                  handleChangeMoveBox1(
                    data,
                    categoryList[currentTopIndex]?.navs ? categoryList[currentTopIndex]?.navs : [],
                    getListNavsLitems(getNavElementId),
                    t('common.Lobby_navigation'),
                  )
              "
              :draggableList="
                categoryList[currentTopIndex]?.navs ? categoryList[currentTopIndex]?.navs : []
              "
              @click:add="handleAddCategory"
              @click:del="
                (index) =>
                  handleDelete(
                    index,
                    categoryList[currentTopIndex]?.navs,
                    t('common.Lobby_navigation'),
                  )
              "
              @click:tag="handleCategoryNav"
            />
            <p class="" v-show="categoryList[currentTopIndex]?.navs.length == 1">
              <Button type="dashed" danger ghost>{{ $t('common.Drag_type_f') }}</Button>
            </p>
          </div>
          <!-- 体育 -->
          <template v-if="currentTopIndex === 1">
            <div :class="CLASS_ENUM[2].innerBox" class="resize-box">
              <DragSelectGroup
                class="flex flex-wrap group-list"
                item-key="id"
                suffix="move"
                group="moveBox"
                :activation="false"
                :showPrefixIcon="PAGE_EDIT"
                :showSuffixIcon="PAGE_EDIT"
                :showAddIcon="false"
                :showCloseIcon="false"
                :draggableList="topNavList[currentTopIndex].items"
                @change="(el) => handleChangeMoveBox(el, topNavList[currentTopIndex].items)"
                @click:del="(index) => handleDelete(index, topNavList[currentTopIndex].items)"
              />
            </div>
          </template>
          <!-- 大厅列表-导航列表 -->
          <template v-if="currentTopIndex === 0 && firstNavIndex === 1">
            <div class="sxjuz_j lobbylistBG">
              <label class="!min-h-4 gameSortLabel">
                {{ $t('table.system.system_sort_hallList') }}:</label
              >
              <div class="w-100% relative">
                <DragSelectGroup
                  class="group-nav5 lobby-list"
                  :class="
                    categoryList[currentTopIndex]?.litems.length == 0
                      ? 'opacity0 relative z-11 min-h-70px'
                      : ''
                  "
                  item-key="id"
                  suffix="move"
                  :dragDisabled="!disabledLangrage"
                  :isLogo="true"
                  :end="addFunc"
                  :move="disabledMove"
                  :group="{ name: 'moveBox', pull: false, put: true }"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :showCloseIcon="PAGE_EDIT && Number(currentTopIndex) !== 2"
                  :showAddIcon="false"
                  :activation="true"
                  :currentIndex="currentIndexNaveItems"
                  @change="() => (isChange = true)"
                  :draggableList="
                    categoryList[currentTopIndex]?.litems
                      ? categoryList[currentTopIndex]?.litems
                      : []
                  "
                  @click:del="
                    (index) =>
                      handleDelete(
                        index,
                        categoryList[currentTopIndex]?.litems,
                        t('common.lobbyNavNotCategory'),
                      )
                  "
                  @click:tag="handleCategoryNavItems"
                />
                <p
                  class="absolute top-20px left-20px"
                  v-show="categoryList[currentTopIndex]?.litems.length == 0"
                >
                  <Button type="dashed" danger ghost>{{ $t('common.Drag_type_f') }}</Button>
                </p>
              </div>
            </div>
          </template>
          <!-- 侧边栏 -->
          <template v-if="currentTopIndex === 0 && firstNavIndex === 2">
            <div class="sxjuz_j lobbylistBG">
              <label class="gameSortLabel"> {{ $t('table.system.system_sort_sliader') }}: </label>
              <div class="w-100%">
                <DragSelectGroup
                  class="group-nav5 grayness"
                  :class="
                    categoryList[currentTopIndex]?.sidebars == 0 ? 'opacity0 relative z-11' : ''
                  "
                  item-key="id"
                  suffix="move"
                  :isLogo="true"
                  :dragDisabled="!disabledLangrage"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :showAddIcon="false"
                  :move="disabledMove"
                  :activation="false"
                  :currentIndex="sidebarIndex"
                  :group="{ name: 'moveBox', pull: false, put: true }"
                  :showCloseIcon="PAGE_EDIT"
                  :draggableList="
                    categoryList[currentTopIndex]?.sidebars
                      ? categoryList[currentTopIndex]?.sidebars
                      : []
                  "
                  @click:del="
                    (index) =>
                      handleDelete(
                        index,
                        categoryList[currentTopIndex].sidebars,
                        t('common.Lobby_navigation'),
                      )
                  "
                />
                <p class="" v-show="categoryList[currentTopIndex]?.sidebars == 0">
                  <Button type="dashed" danger ghost>{{ $t('common.Drag_type_f') }}</Button>
                </p>
              </div>
            </div>
          </template>
          <!-- 导航 分类列表 -->
          <template
            v-if="
              currentNavIndex != 5 &&
              firstNavIndex === 0 &&
              currentCategoryCompanyIndex != 0 &&
              sidebarIndexRecommended != 0 &&
              !currentCategoryIndex &&
              currentCategoryIndex != 0 &&
              (PAGE_EDIT || (!PAGE_EDIT && getListNavsLitems(getNavElementId).length > 0)) &&
              (getListNavsLitems(getNavElementId)[currentIndexNaveItems]?.ty == 2 ||
                !getNavesgame_type)
            "
          >
            <div class="mt-10px sxjuz_j lobbylistBG" v-if="showQuantity">
              <label class="!min-h-4 gameSortLabel"> {{ $t('common.cp28') }}: </label>
              <div class="w-100% relative min-h-71px">
                <DragSelectGroup
                  class="flex flex-wrap relative z-7 group-nav classificate 非大厅分类列表"
                  item-key="id"
                  suffix="move"
                  :dragDisabled="!disabledLangrage"
                  :isLogo="true"
                  :move="disabledMove"
                  :group="{ name: 'moveBox', pull: false, put: true }"
                  :currentIndex="currentIndexNaveItems"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :showCloseIcon="PAGE_EDIT && Number(currentTopIndex) !== 2"
                  :showAddIcon="false"
                  :end="addFunc"
                  :activation="true"
                  @change="
                    (data) =>
                      handleChangeMoveBox1(
                        data,
                        categoryList[currentTopIndex]?.navs
                          ? categoryList[currentTopIndex]?.navs
                          : [],
                        getListNavsLitems(getNavElementId),
                        t('common.Lobby_navigation'),
                      )
                  "
                  :draggableList="getListNavsLitems(getNavElementId)"
                  @click:del="
                    (index) =>
                      handleDelete(
                        index,
                        getListNavsLitems(getNavElementId),
                        t('common.lobbyNavNotCategory'),
                      )
                  "
                  @click:tag="handleCategoryNavItems"
                />
                <p
                  v-if="getListNavsLitems(getNavElementId).length == 0"
                  class="absolute top-0 mb-0 pointer-events-none ml-20px py-20px"
                >
                  <Button type="dashed" danger ghost>{{
                    t('table.system.system_cate_des')
                  }}</Button>
                </p>
              </div>
            </div>
            <div class="mt-10px sxjuz_j lobbylistBG" v-else>
              <label class="!min-h-4 gameSortLabel">
                {{ $t('table.system.system_cate_game1') }}:
              </label>
              <div class="w-100% relative min-h-71px">
                <DragSelectGroup
                  class="flex flex-wrap relative z-7 group-nav classificate 非大厅分类列表"
                  item-key="id"
                  suffix="move"
                  :dragDisabled="!disabledLangrage"
                  :isLogo="true"
                  :move="disabledMove"
                  :group="{ name: 'moveBox', pull: false, put: true }"
                  :currentIndex="currentIndexNaveItems"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :showCloseIcon="PAGE_EDIT && Number(currentTopIndex) !== 2"
                  :showAddIcon="false"
                  :end="addFunc"
                  :activation="true"
                  @change="
                    (data) =>
                      handleChangeMoveBox1(
                        data,
                        categoryList[currentTopIndex]?.navs
                          ? categoryList[currentTopIndex]?.navs
                          : [],
                        getListNavsLitems(getNavElementId),
                        t('common.Lobby_navigation'),
                      )
                  "
                  :draggableList="getListNavsLitems(getNavElementId)"
                  @click:del="
                    (index) =>
                      handleDelete(
                        index,
                        getListNavsLitems(getNavElementId),
                        t('common.lobbyNavNotCategory'),
                      )
                  "
                  @click:tag="handleCategoryNavItems"
                />
                <p
                  v-if="getListNavsLitems(getNavElementId).length == 0"
                  class="absolute top-0 mb-0 pointer-events-none ml-20px py-20px"
                >
                  <Button type="dashed" danger ghost>{{
                    t('table.system.system_cate_des')
                  }}</Button>
                </p>
              </div>
            </div>
          </template>
          <!-- {{
            'currentLobbyIndex:' +
            currentLobbyIndex +
            '--currentIndexNaveItems' +
            currentIndexNaveItems
          }} -->
          <!-- 行数配置 -->
          <template v-if="showQuantity">
            <template
              v-if="
                currentTopIndex === 0 &&
                Number(currentNavIndex) !== 5 &&
                Number(currentLobbyIndex) !== 5 &&
                (currentLobbyIndex || currentLobbyIndex == 0) &&
                (currentIndexNaveItems || currentIndexNaveItems == 0) &&
                firstNavIndex != 2 &&
                !getNavesgame_type
              "
            >
              <div class="flex flex-col overflow-y-auto resize-box mt-10px lobbylistBG">
                <div class="flex w-100% items-center">
                  <label class="gameSortLabel">
                    {{ $t('table.system.system_sort_sliader_side') }}:
                  </label>
                  <div class="grow sxjuz_j lineSort_relative">
                    <DragSelectGroup
                      class="lineSort_m group-nav3 unforbid"
                      item-key="id"
                      :currentIndex="getSelectLobbyIndex"
                      :showPrefixIcon="false"
                      :showSuffixIcon="false"
                      :showAddIcon="PAGE_EDIT && getListByIdNavs(currentLobbyIndex)?.length < 16"
                      :showCloseIcon="PAGE_EDIT"
                      :lastClose="true"
                      :activation="true"
                      :topPadding="true"
                      :dragDisabled="true"
                      :subTitle="true"
                      :draggableList="getListByIdNavs(currentLobbyIndex) || []"
                      @click:tag="navColRow"
                      @click:add="addIconCol"
                      @click:del="
                        (index) => handleDeleteRow(index, getListByIdNavs(currentLobbyIndex))
                      "
                    />
                  </div>
                  <div class="mx-20px">
                    <SvgIcon
                      name="Delete1:svg"
                      :size="20"
                      v-if="PAGE_EDIT"
                      @click="handleRmoveRow"
                    />
                    <SvgIcon
                      name="BomArrow:svg"
                      class="ml-20px"
                      :size="20"
                      v-if="fold_row"
                      @click="change_over"
                    />
                    <SvgIcon
                      name="TopArrow:svg"
                      :size="20"
                      class="ml-20px"
                      v-else
                      @click="change_over"
                    />
                  </div>
                </div>
                <template v-if="showQuantity">
                  <Divider
                    style="background-color: rgb(225 225 225 / 10%)"
                    class="!mt-0px !mb-0px"
                  />
                  <div class="w-100% flex items-center py-10px">
                    <label class="gameSortLabel"> {{ t('common.display_quantity') }}: </label>
                    <RadioGroup
                      class="!leading-[54px] !ml-16px"
                      v-model:value="current_element.item_nums[getSelectStyle]"
                      name="radioGroup"
                      :disabled="!PAGE_EDIT"
                    >
                      <Radio :value="4">{{ t('common.picture4') }}</Radio>
                      <Radio :value="3">{{ t('common.picture3') }}</Radio>
                      <Radio :value="2">{{ t('common.picture2') }}</Radio>
                    </RadioGroup>
                  </div>
                </template>

                <Divider style="background-color: rgb(225 225 225 / 10%)" class="!mt-0px !mb-0px" />
                <div
                  v-show="fold_row"
                  v-for="(item, index) in getListByIdNavs(currentLobbyIndex)"
                  :key="index"
                  class="w-100%"
                >
                  <div
                    :class="
                      CLASS_ENUM[2].innerBox + ' ' + item.list.length == 0 ? 'opacity0 z-11  ' : ''
                    "
                    class="relative rightlistBG unborder"
                    v-show="getSelectLobbyIndex === item.pid"
                  >
                    <DragSelectGroup
                      :draggableList="item.list"
                      class="group-nav4 rightlistBG unborder row-config min-h-70px"
                      suffix="move"
                      :dragDisabled="!disabledLangrage"
                      :group="{ name: 'fixMove', pull: false, put: true }"
                      :showAddIcon="false"
                      :subTitle="true"
                      :move="disabledMove"
                      :showCloseIcon="PAGE_EDIT"
                      :showPrefixIcon="PAGE_EDIT"
                      :showSuffixIcon="PAGE_EDIT"
                      :activation="false"
                      @click:del="(index) => handleDeleteRowItem(index, item.list)"
                      @change="
                        (index) => handleChangeMoveBox1(index, item.list, t('common.RowNumber'))
                      "
                    />
                    <p
                      class="absolute pointer-events-none top-20px left-20px z-99"
                      v-show="item.list.length == 0"
                    >
                      <Button type="dashed" danger ghost>{{ $t('common.Drag_type_all') }}</Button>
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <template
              v-if="
                currentTopIndex === 0 &&
                Number(currentNavIndex) !== 5 &&
                Number(currentLobbyIndex) !== 5 &&
                (currentLobbyIndex || currentLobbyIndex == 0) &&
                (currentIndexNaveItems || currentIndexNaveItems == 0) &&
                firstNavIndex != 2
              "
            >
              <div class="flex flex-col overflow-y-auto resize-box mt-10px lobbylistBG">
                <div class="flex w-100% items-center">
                  <label class="gameSortLabel">
                    {{ $t('table.system.system_sort_sliader_side') }}:
                  </label>
                  <div class="grow sxjuz_j lineSort_relative">
                    <DragSelectGroup
                      class="lineSort_m group-nav3 unforbid"
                      item-key="id"
                      :currentIndex="getSelectLobbyIndex"
                      :showPrefixIcon="false"
                      :showSuffixIcon="false"
                      :showAddIcon="PAGE_EDIT && getListByIdNavs(currentLobbyIndex)?.length < 16"
                      :showCloseIcon="PAGE_EDIT"
                      :lastClose="true"
                      :activation="true"
                      :topPadding="true"
                      :dragDisabled="true"
                      :subTitle="true"
                      :draggableList="getListByIdNavs(currentLobbyIndex) || []"
                      @click:tag="navColRow"
                      @click:add="addIconCol"
                      @click:del="
                        (index) => handleDeleteRow(index, getListByIdNavs(currentLobbyIndex))
                      "
                    />
                  </div>
                  <div class="mx-20px">
                    <SvgIcon
                      name="Delete1:svg"
                      :size="20"
                      v-if="PAGE_EDIT"
                      @click="handleRmoveRow"
                    />
                    <SvgIcon
                      name="BomArrow:svg"
                      class="ml-20px"
                      :size="20"
                      v-if="fold_row"
                      @click="change_over"
                    />
                    <SvgIcon
                      name="TopArrow:svg"
                      :size="20"
                      class="ml-20px"
                      v-else
                      @click="change_over"
                    />
                  </div>
                </div>
                <template v-if="showQuantity">
                  <Divider
                    style="background-color: rgb(225 225 225 / 10%)"
                    class="!mt-0px !mb-0px"
                  />
                  <div class="w-100% flex items-center py-10px">
                    <label class="gameSortLabel"> {{ t('common.display_quantity') }}: </label>
                    <RadioGroup
                      class="!leading-[54px] !ml-16px"
                      v-model:value="current_element.item_nums[getSelectStyle]"
                      name="radioGroup"
                      :disabled="!PAGE_EDIT"
                    >
                      <Radio :value="4">{{ t('common.picture4') }}</Radio>
                      <Radio :value="3">{{ t('common.picture3') }}</Radio>
                      <Radio :value="2">{{ t('common.picture2') }}</Radio>
                    </RadioGroup>
                  </div>
                </template>

                <Divider style="background-color: rgb(225 225 225 / 10%)" class="!mt-0px !mb-0px" />
                <div
                  v-show="fold_row"
                  v-for="(item, index) in getListByIdNavs(currentLobbyIndex)"
                  :key="index"
                  class="w-100%"
                >
                  <div
                    :class="
                      CLASS_ENUM[2].innerBox + ' ' + item.list.length == 0 ? 'opacity0 z-11  ' : ''
                    "
                    class="relative rightlistBG unborder"
                    v-show="getSelectLobbyIndex === item.pid"
                  >
                    <DragSelectGroup
                      :draggableList="item.list"
                      class="group-nav4 rightlistBG unborder row-config min-h-70px"
                      suffix="move"
                      :dragDisabled="!disabledLangrage"
                      :group="{ name: 'fixMove', pull: false, put: true }"
                      :showAddIcon="false"
                      :subTitle="true"
                      :move="disabledMove"
                      :showCloseIcon="PAGE_EDIT"
                      :showPrefixIcon="PAGE_EDIT"
                      :showSuffixIcon="PAGE_EDIT"
                      :activation="false"
                      @click:del="(index) => handleDeleteRowItem(index, item.list)"
                      @change="
                        (index) => handleChangeMoveBox1(index, item.list, t('common.RowNumber'))
                      "
                    />
                    <p
                      class="absolute pointer-events-none top-20px left-20px z-99"
                      v-show="item.list.length == 0"
                    >
                      <Button type="dashed" danger ghost>{{ $t('common.Drag_type_all') }}</Button>
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <template
            v-if="
              PAGE_EDIT
                ? currentTopIndex === 0 &&
                  Number(currentNavIndex) !== 5 &&
                  Number(currentNavIndex) !== 100 &&
                  (currentIndexLitems ||
                    isNumber(currentIndexNaveItems) ||
                    isNumber(currentCategoryIndex)) &&
                  firstNavIndex != 2 &&
                  !getNavesgame_type
                : currentTopIndex === 0 &&
                  Number(currentNavIndex) !== 100 &&
                  Number(currentNavIndex) !== 5 &&
                  !currentIndexNaveItems &&
                  currentIndexNaveItems != 0 &&
                  (currentIndexLitems ||
                    isNumber(currentIndexNaveItems) ||
                    isNumber(currentCategoryIndex)) &&
                  firstNavIndex != 2 &&
                  !getNavesgame_type
            "
          >
            <div class="mt-10px" :class="['lobbylistBG', CLASS_ENUM[2].outBox]">
              <div class="py-20px all-type">
                <label class="gameSortLabel">{{ $t('common.Categorize_all_games') }}</label>
                <div class="all-type-icon mr-20px">
                  <PlusCircleOutlined
                    @click="handleAddAllGame_row"
                    class="mr-15px add-icon"
                    v-if="
                      PAGE_EDIT &&
                      multipleSelectGame.length &&
                      currentTopIndex === 0 &&
                      Number(currentNavIndex) !== 5 &&
                      Number(currentLobbyIndex) !== 5 &&
                      (currentLobbyIndex || currentLobbyIndex == 0) &&
                      firstNavIndex != 2
                    "
                  />
                  <SvgIcon
                    name="Delete1:svg"
                    :size="20"
                    v-if="PAGE_EDIT"
                    @click="handleDelAllGame"
                  />
                  <SvgIcon
                    name="BomArrow:svg"
                    class="ml-20px"
                    :size="20"
                    v-if="fold_game"
                    @click="change_over1"
                  />
                  <SvgIcon
                    name="TopArrow:svg"
                    class="ml-20px"
                    :size="20"
                    v-else
                    @click="change_over1"
                  />
                </div>
              </div>
              <Divider style="background-color: rgb(225 225 225 / 10%)" class="!my-0" />
              <div
                :class="CLASS_ENUM[2].innerBox"
                class="relative overflow-y-auto unborder bg_lobbylist resize-box"
                v-show="fold_game"
                v-if="
                  PAGE_EDIT ||
                  isNumber(currentCategoryIndex) ||
                  isNumber(currentIndexLitems) ||
                  isNumber(currentIndexNaveItems)
                "
              >
                <DragSelectGroup
                  class="flex flex-wrap group-list all-game"
                  :class="{ 'box-size': getListById(currentNavIndex)?.length === 0 }"
                  item-key="id"
                  suffix="move"
                  :subTitle="true"
                  :group="{ name: 'fixMove', pull: 'clone', put: true }"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :move="disabledMove"
                  :showAddIcon="false"
                  :showCloseIcon="PAGE_EDIT"
                  :activation="false"
                  :dragDisabled="!disabledLangrage"
                  :activeMultipleState="true"
                  :selectRemove="multipleSelectGame"
                  :draggableList="getListById(currentNavIndex)"
                  @click:tag="handleChildElementGame"
                  @change="
                    (index) =>
                      handleChangeMoveBox1(
                        index,
                        getListById(currentNavIndex),
                        t('common.Categorize_all_games'),
                      )
                  "
                  @click:del="(index) => handleDeleteAllGame(index, getListById(currentNavIndex))"
                />
                <p
                  class="absolute mb-0 pointer-events-none z-99 top-13px"
                  v-show="getListById(currentNavIndex)?.length == 0"
                >
                  <Button type="dashed" danger ghost>{{ $t('common.Drag_type_p') }}</Button>
                </p>
              </div>
            </div>
          </template>
          <!--   内页推荐 -->
          <div v-show="currentNavIndex == '100'">
            <div
              class="!pl-0 overflow-y-auto resize-box relative"
              :class="['lobbylistBG', CLASS_ENUM[2].outBox]"
            >
              <div class="!text-left w-full">
                <label class="gameSortLabel mr-15px"
                  >{{ $t('table.system.system_sort_sliader_side_all_lei') }}:</label
                >
                <a-button
                  class="mb-20px mr-20px"
                  v-for="(item, index) in gameListRecommend"
                  :key="index"
                  :type="recommendActive == item.game_type ? 'primary' : ''"
                  size="large"
                  style="font-size: 14px"
                  @click="recommendActivehanle(item.game_type)"
                >
                  <img
                    class="base-logo w-15px h-15px mr-5px"
                    :src="getDataTypePreviewUrl(item.icon)"
                    alt=""
                  />
                  {{ gameMapping[item.game_type] }}
                </a-button>
              </div>
              <div class="absolute right-17px top-14px">
                <SvgIcon name="Delete1:svg" :size="20" v-if="PAGE_EDIT" @click="handleDelAllGame" />
              </div>
              <Divider style="background-color: rgb(225 225 225 / 10%)" class="!mt-0px !mb-10px" />
              <div :class="CLASS_ENUM[2].innerBox" class="!mt-0 unborder bg_lobbylist bg_white">
                <DragSelectGroup
                  class="flex flex-wrap group-list move-area 内页推荐"
                  :class="{ 'box-size': true }"
                  item-key="id"
                  suffix="move"
                  :group="{ name: 'fixMove', pull: 'clone', put: true }"
                  :selectWidth="'149px'"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :move="disabledMove"
                  :showAddIcon="false"
                  :showCloseIcon="PAGE_EDIT"
                  :subTitle="true"
                  :activation="false"
                  :dragDisabled="!disabledLangrage"
                  :draggableList="recommendGetListById(currentNavIndex)"
                  @change="
                    (el) =>
                      handleChangeMoveBox1(
                        el,
                        recommendGetListById(currentNavIndex),
                        t('table.system.recommended_inside_pages'),
                      )
                  "
                  @click:del="
                    (index) =>
                      handleDelete(
                        index,
                        addmultipleSelect.length === 0
                          ? recommendGetListById(currentNavIndex)
                          : addmultipleSelect,
                        t('common.Lobby_navigation'),
                      )
                  "
                />
              </div>
            </div>
          </div>
          <div v-if="getNavesgame_type && firstNavIndex === 0">
            <template v-if="showQuantity">
              <div class="w-100% flex items-center py-10px lobbylistBG mt-10px">
                <label class="gameSortLabel"> {{ t('common.display_quantity') }}: </label>
                <RadioGroup
                  class="!leading-[54px] !ml-16px"
                  name="radioGroup"
                  v-model:value="current_element.display_num"
                  :disabled="!PAGE_EDIT"
                >
                  <Radio :value="4">{{ t('common.picture4') }}</Radio>
                  <Radio :value="3">{{ t('common.picture3') }}</Radio>
                  <Radio :value="2">{{ t('common.picture2') }}</Radio>
                </RadioGroup>
              </div>
            </template>
          </div>
          <div
            v-if="
              (getNavesgame_type && !PAGE_EDIT && firstNavIndex === 0) ||
              (PAGE_EDIT && currentTopIndex === 0 && Number(currentNavIndex) !== 5)
            "
            class="mt-10px !pb-0 lobbylistBG game-footer"
          >
            <div
              class="sxjuz_j brand-name"
              v-if="getNavesgame_type || !getNavesgame_type || firstNavIndex == 2"
            >
              <label class="gameSortLabelExtral"
                >{{ $t('table.system.system_sort_sliader_side_site_1') }}:</label
              >
              <DragSelectGroup
                class="flex flex-wrap group-nav1 itemDrage"
                item-key="id"
                :currentIndex="currentgame_typeIndex"
                :showPrefixIcon="false"
                :showSuffixIcon="false"
                :showAddIcon="false"
                :dragDisabled="true"
                :showCloseIcon="false"
                :draggableList="plateFormAllVenues"
                @click:tag="handleClickgame_type"
              />
            </div>
            <!-- 品牌类型 -->
            <div
              v-if="
                getNavesgame_type ||
                (PAGE_EDIT &&
                  currentTopIndex === 0 &&
                  Number(currentNavIndex) !== 5 &&
                  !getNavesgame_type) ||
                firstNavIndex == 2
              "
              class="sxjuz_j"
            >
              <label class="gameSortLabelExtral"
                >{{ $t('table.system.system_sort_sliader_side_site_2') }}:</label
              >
              <div :class="CLASS_ENUM[3].innerBox">
                <DragSelectGroup
                  class="flex flex-wrap brand-list"
                  item-key="id"
                  suffix="move"
                  :sort="false"
                  :move="disabledMove"
                  :group="{ name: 'fixMove', pull: 'clone', put: false }"
                  :clone="cloneGame"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :showAddIcon="false"
                  :showCloseIcon="false"
                  :activation="true"
                  :draggableList="getFirstListGame"
                  :currentIndex="getFirstListGameIndex"
                  @click:tag="handleClickPlatformFirst"
                />
                <DragSelectGroup
                  class="flex flex-wrap brand-list"
                  item-key="id"
                  suffix="move"
                  :sort="false"
                  :move="disabledMove"
                  :group="{ name: 'fixMove', pull: 'clone', put: false }"
                  :clone="cloneGame"
                  :showPrefixIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :showAddIcon="false"
                  :showCloseIcon="false"
                  :activation="true"
                  :currentIndex="currentPlatformIndex"
                  :draggableList="platformList ? platformList : []"
                  @click:tag="handleClickPlatform"
                />
              </div>
            </div>
            <!-- 所有子游戏 -->
            <div
              :class="CLASS_ENUM[2].outBox"
              class=""
              v-if="currentTopIndex === 0 && Number(currentNavIndex) !== 5 && firstNavIndex != 2"
            >
              <div class="flex items-center w-100%">
                <span class="gameSortLabelExtral"
                  >{{ getGameTitle }} {{ $t('table.system.system_game_all') }}:</span
                >
                <div class="ml-20px">
                  <a-button
                    v-if="
                      (PAGE_EDIT && firstNavIndex != 0) ||
                      (PAGE_EDIT && !getNavesgame_type && firstNavIndex == 0)
                    "
                    class="button-bg-basic mr-10px"
                    type="primary"
                    size="large"
                    @click="handleAddAllGame"
                  >
                    {{ $t('table.system.system_all_insert') }}
                  </a-button>
                  <Input
                    v-model:value="searchGameName"
                    :allow-clear="true"
                    :placeholder="$t('table.system.system_input_gameName')"
                    style="width: 160px"
                    size="large"
                  />
                  <a-button
                    :loading="searchLoading"
                    class="ml-10px button-bg-basic"
                    type="primary"
                    size="large"
                    @click="handleSearchGameList"
                  >
                    {{ $t('common.queryText') }}
                  </a-button>
                  <a-button
                    class="!ml-10px button-bg-basic"
                    size="large"
                    type="primary"
                    v-if="multipleSelect.length > 0"
                    @click="multipleAdd"
                  >
                    {{ t('table.system.system_sort_add') }}</a-button
                  >
                </div>
              </div>
              <div
                :class="CLASS_ENUM[2].innerBox"
                class="overflow-y-auto bg_lobbylist unborder resize-box"
                style="position: relative"
                ref="listRef"
              >
                <DragSelectGroup
                  class="group-list subgame 所有子游戏"
                  :class="plateFormAllVenues[currentgame_typeIndex]?.name + '_Venues'"
                  item-key="id"
                  :group="{
                    name: 'moveBox',
                    pull: 'clone',
                    put: false,
                  }"
                  :move="disabledMove"
                  :clone="cloneGame"
                  :showPrefixIcon="false"
                  :isToolTip="true"
                  :showSuffixIcon="PAGE_EDIT"
                  :showAddIcon="false"
                  :showCloseIcon="false"
                  :activation="false"
                  :activeMultipleState="
                    getNavesgame_type ? (firstNavIndex == 1 ? true : false) : true
                  "
                  :dragDisabled="!disabledLangrage"
                  @click:tag="handleChildElement"
                  @move:change-move="multipleSelect = []"
                  :selectRemove="multipleSelect"
                  :draggableList="gameList ? gameList : []"
                />
                <Loading :loading="searchLoading" :absolute="true" />
              </div>
            </div>
          </div>

          <!-- 品牌提供商 -->
          <template
            v-if="currentTopIndex === 0 && firstNavIndex != 2 && Number(currentNavIndex) === 5"
          >
            <div class="mt-10px sxjuz_j !py-20px lobbylistBG">
              <label class="!min-h-4 text-right left gameSortLabel">
                {{ $t('table.system.applied_port') }}:</label
              >
              <div class="ml-20px">
                <a-button
                  class="mr-20px left"
                  v-for="(item, index) in apply_port"
                  :key="index"
                  :type="applyportActive == item.id ? 'primary' : ''"
                  size="large"
                  style="font-size: 14px"
                  @click="applyportActivehanle(item.id)"
                >
                  {{ item.value }}
                </a-button>
              </div>
              <!-- <p
                v-show="getListNavsLitems(getNavElementId).length == 0"
                class="absolute m-0 left-119px z-1"
              >
                <Button type="dashed" danger ghost>{{ $t('common.system_cate_des') }}</Button>
              </p> -->
            </div>
            <div class="relative flex flex-col lobbylistBG sxjuz_j mt-10px unborder bg_lobbylist">
              <div class="flex items-center w-full my-20px">
                <div class="flex flex-1 lineSort_relative">
                  <label class="gameSortLabel mr-20px"
                    >{{ t('table.system.system_sort_add_show') }}:</label
                  >
                  <DragSelectGroup
                    v-show="applyportActive == 'h5'"
                    class="flex flex-wrap lineSort_m unforbid"
                    itemClass="mr-20px"
                    item-key="id"
                    :currentIndex="applyportActiveRow"
                    :showPrefixIcon="false"
                    :showSuffixIcon="false"
                    :showAddIcon="PAGE_EDIT && getListByApply_port(applyportActiveRow)?.length < 5"
                    :showCloseIcon="PAGE_EDIT"
                    :lastClose="true"
                    :activation="true"
                    :topPadding="true"
                    :dragDisabled="true"
                    :subTitle="true"
                    :draggableList="getListByApply_port(applyportActiveRow) || []"
                    @click:tag="navColRowApply"
                    @click:add="addIconColApply"
                    @click:del="
                      (index) =>
                        handleDeleteRowApply(index, getListByApply_port(applyportActiveRow))
                    "
                  />
                </div>
                <div class="mr-20px">
                  <SvgIcon
                    name="Delete1:svg"
                    :size="20"
                    v-if="PAGE_EDIT"
                    @click="handleDelAllGame"
                  />
                </div>
              </div>
              <Divider style="background-color: rgb(225 225 225 / 10%)" class="!mt-0px !mb-0px" />

              <div class="w-full overflow-y-auto p-20px unborder drag-box">
                <DragSelectGroup
                  class="group-list 展示品牌"
                  :showPrefixIcon="PAGE_EDIT"
                  :showAddIcon="false"
                  :isLogo="true"
                  :move="disabledMove"
                  :group="{
                    name: 'moveBox',
                    pull: false,
                    put: true,
                  }"
                  :showCloseIcon="PAGE_EDIT"
                  :showSuffixIcon="PAGE_EDIT"
                  :selectWidth="'159px'"
                  :activation="false"
                  :dragDisabled="!disabledLangrage"
                  :categoryId="currentNavIndex"
                  :draggableList="getListByApply_port(applyportActiveRow)[applyportActiveRow].list"
                  @click:del="
                    (index) =>
                      handleDelete(
                        index,
                        getListByApply_port(applyportActiveRow)[applyportActiveRow].list,
                      )
                  "
                />
              </div>
            </div>
          </template>
          <!-- 全部品牌 -->
          <template
            v-if="
              currentTopIndex === 0 &&
              firstNavIndex != 2 &&
              PAGE_EDIT &&
              Number(currentNavIndex) == 5
            "
          >
            <div class="flex flex-col mt-10px lobbylistBG">
              <label class="w-full text-left pl-10px py-20px gameSortLabel">
                {{ $t('table.system.system_all_modal') }}:
              </label>
              <Divider style="background-color: #d7d7d7" class="!my-0px" />
              <!-- <Button type="primary" size="small" @click="handleAddAllBrand">全部添加</Button> -->
              <div class="flex w-full overflow-y-auto p-20px drag-box unborder bg_lobbylis">
                <DragSelectGroup
                  :group="{
                    name: 'moveBox',
                    pull: 'clone',
                    put: false,
                  }"
                  :end="addFunc"
                  class="group-list h-fit 全部品牌"
                  :showPrefixIcon="PAGE_EDIT"
                  :showAddIcon="false"
                  :isLogo="true"
                  :disable="PAGE_EDIT"
                  :categoryId="currentNavIndex"
                  :showCloseIcon="false"
                  :showSuffixIcon="PAGE_EDIT"
                  :activation="false"
                  :draggableList="getVenuesData"
                />
              </div>
            </div>
          </template>
        </div>
        <!-- 右边游戏类别 -->
        <div class="w-20px grow-2 ml-10px">
          <div class="rightlistBG" v-if="currentTopIndex === 0">
            <p class="!min-h-4 text-centre leading-20px gameSortLabel !pt-15px pb-14px m-0">{{
              firstNavIndex == 0
                ? $t('table.system.system_nav_game')
                : firstNavIndex == 1
                ? $t('table.system.system_cate_game')
                : $t('common.Hall_side_sorting')
            }}</p>
            <Divider style="background-color: rgb(225 225 225 / 10%)" class="!mb-0 !mt-0" />
            <div class="flex flex-wrap items-center flex-1">
              <DragSelectGroup
                class="category-list"
                item-key="id"
                :group="{ name: 'moveBox', pull: 'clone', put: false }"
                :clone="cloneGame"
                :isLogo="true"
                :show100="true"
                suffix="move"
                :move="disabledMove"
                :end="addFunc"
                :disable="false"
                :isSort="false"
                :activation="isNumber(currentCategoryIndex) ? true : false"
                :dragDisabled="!disabledLangrage"
                :rightPadding="true"
                :showPrefixIcon="PAGE_EDIT"
                :showSuffixIcon="PAGE_EDIT"
                :showAddIcon="false"
                :draggableList="
                  firstNavIndex === 2
                    ? categoryList[currentTopIndex]?.navs.filter((item) => {
                        return item.ty == 5;
                      }) || []
                    : recreationList || []
                "
                :showCloseIcon="false"
                :isToolTip="true"
                :currentIndex="currentCategoryIndex"
                @click:tag="handleClickCategory"
                @click:add="handleAddCategory"
                @detete:complete="handleDelCategory"
                @edit:complete="handleCompleteCategory"
                @update:value="handleCompleteName"
                @click:del="(index) => handleNavDelete(index, recreationList)"
              />
            </div>
            <Divider
              v-if="firstNavIndex !== 2"
              style="background-color: rgb(225 225 225 / 10%)"
              class="!my-5px"
            />
            <!-- 游戏厂商 -->
            <div class="flex-1 px-10px pb-6px" v-if="firstNavIndex !== 2">
              <p class="font-medium text-left my-5px ml-5px"> {{ $t('common.Shared_list') }}</p>
              <DragSelectGroup
                class="flex flex-wrap 游戏厂商"
                item-key="id"
                :group="{ name: 'moveBox', pull: 'clone', put: false }"
                :clone="cloneGame"
                :isLogo="true"
                suffix="move"
                :move="disabledMove"
                :disable="false"
                :activation="true"
                :dragDisabled="!disabledLangrage"
                :showPrefixIcon="PAGE_EDIT"
                :showSuffixIcon="PAGE_EDIT"
                :showAddIcon="false"
                :showCloseIcon="false"
                :selectWidth="'149px'"
                :sixRightPadding="true"
                :draggableList="recreationListCompany"
                :currentIndex="currentCategoryCompanyIndex"
                @click:tag="handleClickCategoryCompany"
              />
            </div>
            <Divider
              style="background-color: rgb(225 225 225 / 10%)"
              v-if="firstNavIndex !== 2"
              class="!my-5px"
            />
            <!-- 内页推荐 -->
            <div class="px-10px pb-10px" v-if="firstNavIndex !== 2">
              <p class="font-medium text-left my-5px ml-5px">
                {{ $t('common.contentpagelist') }}
              </p>
              <DragSelectGroup
                class="flex flex-wrap"
                item-key="id"
                :group="{ name: 'moveBox', pull: 'clone', put: false }"
                :clone="cloneGame"
                :isLogo="true"
                suffix="move"
                :disable="false"
                :activation="true"
                :dragDisabled="true"
                :showPrefixIcon="false"
                :showSuffixIcon="false"
                :showAddIcon="false"
                :sixRightPadding="true"
                :showCloseIcon="false"
                :selectWidth="'149px'"
                :currentIndex="sidebarIndexRecommended"
                :draggableList="gameListRecommend.length ? [gameListRecommend[0]] : []"
                @click:tag="handleClickCategoryRecommendedList"
              />
            </div>
            <!-- 菲站 -->
            <Divider
              style="background-color: rgb(225 225 225 / 10%)"
              v-if="firstNavIndex == 0 && showQuantity && delhotCategoryList().length > 0"
              class="!my-5px"
            />
            <div class="pb-10px" v-if="firstNavIndex == 0 && showQuantity">
              <DragSelectGroup
                class="category-list fli-bottom"
                item-key="id"
                :group="{ name: 'moveBox', pull: 'clone', put: false }"
                :clone="cloneGame"
                :isLogo="true"
                :show100="true"
                suffix="move"
                :move="disabledMove"
                :end="addFunc"
                :disable="false"
                :isSort="false"
                :activation="isNumber(currentCategoryIndex) ? true : false"
                :dragDisabled="!disabledLangrage"
                :rightPadding="true"
                :showPrefixIcon="PAGE_EDIT"
                :showSuffixIcon="PAGE_EDIT"
                :showAddIcon="false"
                :draggableList="delhotCategoryList() || []"
                :showCloseIcon="false"
                :isToolTip="true"
                :currentIndex="currentCategoryIndex"
                @click:add="handleAddCategory"
                @detete:complete="handleDelCategory"
                @edit:complete="handleCompleteCategory"
                @update:value="handleCompleteName"
                @click:del="(index) => handleNavDelete(index, recreationList)"
              />
            </div>
          </div>
        </div>
        <!-- 同步语言弹框 -->
        <div class="absolute flex justify-end right-10px top-0px">
          <!-- <Button
            type="primary"
            @click="handleLangrage"
            class="mr-4 button-bg-basic"
            :size="FORM_SIZE"
            preIcon="uil:setting"
            :disabled="disabledLangrage"
            >{{ $t('table.system.system_sort_language') }}</Button
          > -->
          <template v-if="PAGE_EDIT">
            <Button plain @click="handleCancelSort" :size="FORM_SIZE">
              {{ $t('business.common_cancel') }}
            </Button>
            <Button
              class="ml-15px"
              type="primary"
              @click="handleSaveSort"
              :size="FORM_SIZE"
              :loading="saveLoadingButton"
              >{{ $t('business.comon_save') }}</Button
            >
          </template>
          <!-- 修改排序 -->
          <template v-else>
            <Button
              v-if="isHasAuth('70435')"
              plain
              class="button-bg-basic"
              type="primary"
              @click="handleEditSort"
              :size="FORM_SIZE"
              preIcon="fa-solid:user-edit"
              >{{ $t('table.system.system_edit_sort') }}</Button
            >
          </template>
        </div>
      </div>
    </div>
    <Loading :loading="saveLoading" :absolute="false" />
    <langrageModal @register="registerHandle" />
  </PageWrapper>
</template>

<script lang="ts" setup name="GameSort">
  import { ref, onBeforeMount, computed, nextTick, onMounted, watch, watchEffect } from 'vue';
  import {
    Input,
    message,
    RadioGroup,
    Radio,
    RadioButton,
    Divider,
    Tabs,
    TabPane,
  } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { DragSelectGroup } from '/@/components/DragSelectGroup';
  import Loading from '/@/components/Loading/src/Loading.vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { PlusCircleOutlined } from '@ant-design/icons-vue';
  import {
    getGameCategoryList,
    updateGameCategoryItem,
    updateGameCategorySports,
    updateGameCategoryIndex,
    // insertGameCategory,
    //updateGameCategory,
    delGameCategory,
    // getPlatformGames,
    getSearchGameAllList,
    getAllPlatform,
    updateCategoryName,
    getVenuesPlatform,
    getPlatformSearch,
    updateGameBacthSorting,
    getVenueAll,
    updateVenuesSort,
  } from '/@/api/sys/index';
  import { cloneDeep } from 'lodash-es';
  import { useRouter } from 'vue-router';
  import { openConfirm } from '/@/utils/confirm';
  import { isNumber } from '/@/utils/is';
  import langrageModal from './common/langrageModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Button } from '/@/components/Button';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { langrageArr, firstNavs } from './move';
  import { SvgIcon } from '/@/components/Icon/index';
  import { useLocale } from '/@/locales/useLocale';
  import { isHasAuth } from '/@/utils/authFunction';
  import { getPlatefromAll } from '/@/api/member/index';
  import { getHtmlPageLang } from '/@/locales/helper';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  /**
   * 是否是菲律宾模板
   */
  const showQuantity = computed(() => {
    return userStore.getCurrentSite['tpl'] == 7;
  });
  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  //const { getLanguageObject } = useLocale();
  const listRef = ref(null); // 游戏列表dom
  const isChange = ref(false); // 监听当前页是否有更改
  const saveLoading = ref(false); // 保存加载
  const searchLoading = ref(false); // 游戏列表加载
  const searchGameName = ref(''); // 游戏搜索名称
  const recreationList = ref<any>([]); // 娱乐城类别
  const filrecreationList = ref<any>([]); // 菲站
  const categoryList = ref<any>([]); // 游戏类别
  const game_typeList = ref<any>([]); // 游戏类型
  const platformList = ref<any>([]); // 游戏平台列表
  const gameList = ref<any>([]); // 游戏列表
  const currentTopIndex = ref(0); // 排序修改tab下标
  const currentCategoryIndex = ref<any>(null); // 娱乐城类别tab下标
  const currentCategoryData = ref<any>(null); // 娱乐城单个类别
  const currentgame_typeIndex = ref(0); // 游戏类型tab下标
  const currentPlatformIndex = ref(null as any); // 游戏平台tab下标
  const currentPlatformData = ref<any>(null); // 游戏平台tab
  const PAGE_EDIT = ref(false as any);
  const responseAll = ref([] as any);
  const tagNameTitle = ref(' as any');
  const disabledTab = ref(false as boolean);
  const languageName = ref('en' as string);
  const plateFormAllGame = ref([] as any); //所有游戏平台
  const getVenuesData = ref([] as any); //获取游戏厂商
  const [registerHandle, { openModal }] = useModal();
  const disabledLangrage = ref(false as any);
  const hallIndex = ref(null as any);
  const hallId = ref(null as any);
  const sidebarIndex = ref(null as any);
  const sidebarId = ref(null as any);
  const currentPlatformDataId = ref('' as any);
  const plateFormState = ref(false as Boolean);
  const multipleSelect = ref([] as any);
  const addmultipleSelect = ref([] as any);
  const currentIndexLitems = ref(0);
  const firstNavIndex = ref(0 as any);
  const currentIndexNaveItems = ref(null as any);
  const recreationListCompany = ref([] as any);
  const plateFormAllVenues = ref([] as any); //品牌列表
  const recommendActive = ref(1); //品牌列表
  const getVenueId = ref(null as any);
  const getgame_type = ref('1' as any);
  //const count = ref(0 as any); //记录初始值
  //const navIndex = ref(0 as any);
  const currentNavIndex = ref('' as any);
  const getFirstListGame = ref([] as any);
  const currentLobbyIndex = ref('' as any);
  const gameListRecommend = ref([] as any);
  const getSelectLobbyIndex = ref(0 as any);
  const sidebarIndexRecommended = ref(null as any);
  const languageVal = ref('en_');
  const getNavElementId = ref('1' as any);
  const ButtonList = ref([{ label: t('common.firstRow'), value: 1, list: [] }] as any);
  const radioModalRow = ref(1 as any);
  const getSelectStyle = ref(0 as any);
  const draggableListNavsList = ref([] as any);
  const tipleSelect = ref([] as any);
  const saveLoadingButton = ref(false);
  const getListChild = ref(null as any);
  const fold_row = ref(true);
  const fold_game = ref(true);
  const currentwindowWidth = ref(1673);
  const rowDeleteValue = ref(null as any);
  const getFirstListGameIndex = ref(null as any);
  const currentCategoryCompanyIndex = ref(null as any);
  const multipleSelectGame = ref([] as any);
  const getNavesgame_type = ref(false);
  const getElementName = ref('' as any);
  //const activeState = ref(false as boolean);
  const lobbyObject = ref({
    en_US: 'Lobby',
    vi_VN: 'Sảnh',
    zh_CN: '大厅',
    th_TH: 'Lobby',
    pt_BR: 'Lobby',
  });
  const languageModal = ref('zh_CN' as string);
  languageModal.value = useLocale().getLocale.value;
  const getGameTitle = computed(() => {
    if (currentPlatformIndex.value !== null) {
      const langnameGet = getHtmlPageLang() ?? 'zh_CN';
      let langname = langnameGet.split('_')[0] + '_name';
      langname === 'zh_name' ? (langname = 'name') : langname;
      return platformList.value[currentPlatformIndex.value]?.[langname];
    } else {
      // 此处接口数据没适配不要适配上面的方案
      return getFirstListGame.value[getFirstListGameIndex.value]?.name;
    }
  });
  const lobbyArray = ref([
    {
      name: t('common.lobby'),
      value: 'Lobby',
      index: 0,
      icon: '/images/CATE/lobby.webp',
      logo: '/images/CATE/lobby.webp',
      ty: 1,
      cid: '1',
      id: '1',
    },
  ] as any);
  const applyportActiveRow = ref(0);
  const applyportActive = ref('pc');
  const apply_port = ref([
    {
      value: t('common.PC'),
      id: 'pc',
    },
    { value: t('common.Mobile'), id: 'h5' },
  ] as any);
  const applyportActivehanle = (i) => {
    applyportActive.value = i;
    applyportActiveRow.value = 0;
  };
  const gameMainClassList = ref([
    // 游戏主类
    { id: '2', value: t('table.system.system_entertainment_city'), ty: MOVE_TYPE.M },
    { id: '3', value: t('table.system.system_physical_education'), ty: MOVE_TYPE.M },
  ]);
  const $router = useRouter();

  const enum OPERATE_EVENT {
    CLOSE = 'close',
    MOVE = 'move',
    ADD = 'add',
    EDIT = 'edit',
  }

  const enum MOVE_TYPE {
    T = 1, // 游戏类别
    P = 2, // 游戏平台
    G = 3, // 游戏列表
    M = 4, // 游戏主类
  }
  const KeyOptions = {
    p1: t('table.system.system_real_person'),
    p2: t('table.member.member_fish'),
    p3: t('table.system.system_electronic'),
    p4: t('table.system.system_sport'),
    p5: t('common.card'),
    p6: t('table.system.system_sports_ele'),
    p7: t('table.system.system_sports_lottery'),
    p8: t('table.system.system_original_game'),
  };
  const gameMapping: any = {
    1: t('table.system.system_real_person'),
    2: t('table.system.system_fish_get'),
    3: t('table.system.system_electronic'),
    4: t('table.system.system_physical_education'),
    5: t('table.system.system_get_chess'),
    6: t('table.system.system_sports_ele'),
    7: t('table.system.system_sports_lottery'),
    8: t('table.system.system_original_game'),
  };
  const topNavList = ref([
    // {
    //   id: 1,
    //   value: '首页',
    //   items: [],
    // },
    { id: 2, value: t('table.system.system_entertainment_city') },
    { id: 3, value: t('table.system.system_sport'), items: [] },
  ]);

  const CLASS_ENUM = {
    // 列表样式
    1: {
      outBox: 'flex items-center w-100%',
      innerBox: 'flex items-center flex-wrap flex-1',
    },
    2: {
      outBox: 'flex flex-col ',
      innerBox: 'w-full drag-box px-20px py-10px my-10px overflow-y-auto',
    },
    3: {
      outBox: 'flex flex-col',
      innerBox: 'flex items-center flex-wrap flex-1 my-20px brand-type',
    },
  };
  // 所有平台 分类
  async function getPlateFormAll() {
    plateFormAllGame.value = await getAllPlatform();
    const data = await getVenueAll();
    plateFormAllVenues.value = data.map((item) => {
      return {
        ...item,
        id: item.venue_id,
        id_true: item.venue_id,
        value: item.name,
        logo: item.nav || item.logo,
      };
    });
  }
  const filteredItems = computed(() => {
    return gameList.value.filter((item, index) => {
      item._index = -1;
      if (
        searchGameName.value !== '' &&
        item.name.toLowerCase() === searchGameName.value.toLowerCase()
      ) {
        item._index = index;
        return item;
      }
    });
  });

  onBeforeMount(async () => {
    await getCategoryList('en_US');
  });
  function getListById(id) {
    let foundObject;
    foundObject = categoryList.value.find((obj) => {
      return obj.id === id;
    });
    return foundObject ? foundObject.items : [];
  }

  function recommendGetListById(id) {
    let foundObject;
    foundObject = categoryList.value.find(
      (obj) => obj.id === id && obj.game_type == recommendActive.value,
    );
    if (id == '100') {
      foundObject =
        categoryList.value.filter(
          (obj) => obj.id === id && obj.game_type == recommendActive.value,
        ) || [];
      return foundObject && foundObject[0].items ? foundObject[0].items : [];
    } else {
      return foundObject ? foundObject.items : [];
    }
  }

  function recommendActivehanle(getgame_type) {
    recommendActive.value = getgame_type;
    const listClone = cloneDeep(recommendGetListById(currentNavIndex.value));
    nextTick(() => {
      checkIsMoved(OPERATE_EVENT.MOVE, gameList.value, listClone);
    });
  }
  function getListByIdNavs(id: string, type?: string): any[] {
    let foundObject;
    const currentNavObject = categoryList.value.find((obj) => obj.id == getNavElementId.value);
    foundObject = currentNavObject?.litems.find((obj) => obj.id == id);
    if (foundObject && !foundObject.item_navs) {
      foundObject.item_navs = [{ value: t('common.firstRow'), id: id, list: [], pid: 0 }];
    }
    return foundObject
      ? foundObject.item_navs
      : [{ value: t('common.firstRow'), id: id, list: [], pid: 0 }];
  }
  function getListByApply_port(id: any, type?: string): any[] {
    let foundObject;
    const currentNavObject = categoryList.value.find((obj) => obj.id == 5);
    foundObject = currentNavObject?.items[applyportActive.value];
    if (foundObject && !foundObject.list) {
      foundObject.list = [{ value: t('common.firstRow'), id: id, list: [], pid: 0 }];
    }
    return foundObject ? foundObject : [{ value: t('common.firstRow'), id: id, list: [], pid: 0 }];
  }
  // 导航列表
  function getListNavsLitems(id) {
    const foundObject = categoryList.value.find((obj) => obj.id === id);
    return foundObject ? foundObject.litems : [];
  }
  function clickTab(val) {
    handleClickgame_type(0);
    lobbyArray.value[0].value = lobbyObject.value[languageModal.value];
    languageName.value = val.slice(0, -2);
    if (PAGE_EDIT.value) {
      return message.error(t('sys.exception.pls_sel_save'));
    }
    getCategoryList(val);
    firstHandle(0);
  }
  function itemsHandle(c) {
    let data: any = [];
    if (c.id === '5') {
      if (c.venue.pc) {
        c.venue.pc = c.venue.pc.map((arr, index) => {
          return {
            name: t('common.rowN', [toChineseNumberString(index + 1)]),
            label: t('common.rowN', [toChineseNumberString(index + 1)]),
            value: t('common.rowN', [toChineseNumberString(index + 1)]),
            pid: index,
            list: ref(
              arr?.length
                ? arr?.map((item) => {
                    let item_data = {
                      ...item,
                      name: item.name,
                      value: item.name,
                      //logo: item.logo,
                      id: item.id,
                      logo: item.logo ? item.icon : item.icon,
                      icon: item.logo ? item.icon : item.icon,
                      state: false,
                    };
                    return item_data;
                  })
                : [],
            ),
          };
        });

        c.venue.h5 = c.venue.h5.map((arr, index) => {
          return {
            name: t('common.rowN', [toChineseNumberString(index + 1)]),
            label: t('common.rowN', [toChineseNumberString(index + 1)]),
            value: t('common.rowN', [toChineseNumberString(index + 1)]),
            pid: index,
            list: ref(
              arr?.length
                ? arr?.map((item) => ({
                    ...item,
                    name: item.name,
                    value: item.name,
                    //logo: item.logo,
                    id: item.id,
                    logo: item.logo ? item.icon : item.icon,
                    icon: item.logo ? item.icon : item.icon,
                    state: false,
                  }))
                : [],
            ),
          };
        });
        data = c.venue;
      } else {
        data = {
          pc: [{ value: t('common.firstRow'), id: 0, list: [], pid: 0 }],
          h5: [{ value: t('common.firstRow'), id: 0, list: [], pid: 0 }],
        };
      }
    } else {
      data =
        c.items?.map((item) => ({
          ...item,
          value: item.name ? item.name : item.value,
          ty: MOVE_TYPE.G,
          [`${languageName.value}name`]: item.name,
          name: item.name,
          logo: item.logo ? item.icon : item.icon,
          icon: item.logo ? item.icon : item.icon,
          is_hot: item.is_hot ? item.is_hot : '0',
          is_new: item.is_new ? item.is_new : '0',
          platform_name: item.platform_name ? item.platform_name : '',
          type: 'game-bottom',
        })) || [];
    }
    return data;
  }
  const PlatefromAll = ref();
  const filter_id = (item) => {
    let id = '';
    let obj = PlatefromAll.value.filter((PF_item) => {
      return PF_item.game_type == item.cid[0];
    })[0];
    id = obj?.data.filter((data_item) => {
      return data_item.id == item.cid;
    })[0]?.venue_id;
    return id;
  };
  let recreationListData: any = [];
  async function getCategoryList(val, uninfo?) {
    saveLoading.value = true;
    await getPlatefromAll().then((data) => {
      PlatefromAll.value = data;
    });
    return getGameCategoryList({ lang: languageModal.value }).then((response) => {
      console.log('获取游戏类别列表', JSON.parse(JSON.stringify(response)));
      responseAll.value = response;
      saveLoading.value = false;
      categoryList.value = response[0].data.map((c, i) => {
        if (showQuantity.value && c.ty == 5) {
          c.litems = c.lnavs ? c.lnavs : [];
        }
        return {
          ...c,
          value: c.name,
          state: c.id === '1' ? true : false,
          id: c.ty == 5 ? '5_' + c.id : c.id,
          id_true: c.id,
          logo: c.icon,
          items: ref(itemsHandle(c)),
          litems: ref(
            c.litems
              ? c.litems?.map((item) => {
                  if (item.ty == 6) item.name = 'HOT';
                  if (item.ty == 7) item.name = 'NEW';
                  const el = {
                    ...item,
                    value: cloneDeep(item.name),
                    name:
                      item.name || Number(item.cid || item.platform_id) > 100
                        ? item.name
                        : item.name,
                    type: 'game-top',
                    id:
                      item.ty == 3
                        ? '3' + item.cid
                        : item.ty == 5
                        ? '5_' + item.cid
                        : item.platform_id === '0'
                        ? item.cid
                        : item.ty == 6
                        ? '5_1000_' + item.cid
                        : item.ty == 7
                        ? '5_2000_' + item.cid
                        : item.platform_id,
                    id_true: item.cid,
                    logo: item.logo ? item.icon : item.icon,
                    icon: item.icon ? item.icon : item.logo,
                    // ty_true: item.ty,
                    // ty: item.ty == 3 ? 2 : item.ty,
                    ty_true: c.ty == 5 && item.ty == 1 ? 5 : item.ty,
                    ty: item.ty,
                    venue_id:
                      Number(item.cid || item.platform_id) > 100
                        ? item.venue_id != ''
                          ? item.venue_id
                          : filter_id(item)
                        : item.venue_id,
                    // venue_id:
                    //   Number(item.cid || item.platform_id) > 100 ? item.venue_id : item.venue_id,
                    is_hot: String(item.is_hot ? item.is_hot : 0),
                    is_new: String(item.is_new ? item.is_new : 0),
                    item_nums: item.item_nums || Array(item.item_navs?.length).fill(4),
                    item_navs: item.item_navs?.length
                      ? item.item_navs?.map((arr, index) => {
                          return {
                            name: t('common.rowN', [toChineseNumberString(index + 1)]),
                            label: t('common.rowN', [toChineseNumberString(index + 1)]),
                            value: t('common.rowN', [toChineseNumberString(index + 1)]),
                            pid: index,
                            list: ref(
                              arr?.length
                                ? arr?.map((item) => ({
                                    ...item,
                                    name: item.name,
                                    value: item.name,
                                    //logo: item.logo,
                                    id: item.id,
                                    logo: item.logo ? item.icon : item.icon,
                                    icon: item.logo ? item.icon : item.icon,
                                    state: false,
                                  }))
                                : [],
                            ),
                          };
                        })
                      : [{ value: t('common.firstRow'), id: '1', list: [], pid: 0 }],
                  };
                  if (c.ty == 5 && item.ty == 1) {
                    el.ty = 5;
                  }
                  if (item.ty == 3) {
                    el.ty = 2;
                  }
                  if (item.ty == 6 || item.ty == 7) {
                    el.ty = 5;
                  }
                  return el;
                })
              : [],
          ),
          navs: ref(
            c.navs
              ? c.navs?.map((item) => ({
                  ...item,
                  ty_true: item.ty,
                  ty: item.ty == 3 ? 2 : item.ty,
                  name: item.name,
                  value: item.name,
                  id:
                    item.ty == 3
                      ? '3' + item.cid
                      : item.ty == 5
                      ? '5_' + item.cid
                      : item.platform_id === '0'
                      ? item.cid
                      : item.platform_id,
                  id_true: item.cid,
                  logo: item.logo ? item.icon : item.icon,
                  icon: item.logo ? item.icon : item.icon,
                  state: item.cid === '1' ? 2 : 0,
                  type: 'game-top',
                  // venue_id: item.venue_id != '' ? item.venue_id : filter_id(item),
                  venue_id:
                    Number(item.cid || item.platform_id) > 100
                      ? item.venue_id != ''
                        ? item.venue_id
                        : filter_id(item)
                      : item.venue_id,
                  game_type: item.game_type ? item.game_type : '0',
                  // 菲站
                  display_num: item.display_num ? item.display_num : 4,
                }))
              : [],
          ),
          sidebars: ref(
            c.sidebars
              ? c.sidebars?.map((item) => ({
                  ...item,
                  name: item.name,
                  value: item.name,
                  //logo: item.logo,
                  id:
                    item.ty == 3
                      ? '3' + item.cid
                      : item.platform_id === '0'
                      ? item.cid
                      : item.platform_id,
                  id_true: item.cid,
                  logo: item.logo ? item.icon : item.icon,
                  icon: item.logo ? item.icon : item.icon,
                  type: 'game-top',
                  ty_true: item.ty,
                  ty: item.ty == 3 ? 2 : item.ty,
                }))
              : [],
          ),
          bottoms: ref(
            c.bottoms
              ? c.bottoms?.map((item) => ({
                  ...item,
                  name: item.name,
                  value: item.name,
                  //logo: item.logo,
                  id: item.platform_id === '0' ? item.cid : item.platform_id,
                  logo: item.logo ? item.icon : item.icon,
                  icon: item.logo ? item.icon : item.icon,
                  type: 'game-top',
                }))
              : [],
          ),
          item_navs: ref([{ value: t('common.firstRow'), id: '1', list: [], pid: 0 }]),
          ty: c.ty,
        };
      });
      gameListRecommend.value = categoryList.value.filter((item) => {
        return item.id === '100';
      });
      recreationListData = categoryList.value.filter(
        (item) => item.id !== '1' && item.id !== '5' && item.id !== '100',
      );
      const filterCompany = categoryList.value
        .filter((item) => item.id === '5')
        .map((item) => {
          return { ...item };
        });
      recreationListCompany.value = filterCompany;

      recreationList.value = recreationListData.filter(
        (item) => item.ty == (firstNavIndex.value == 0 ? 5 : 1),
      );
      if (showQuantity.value) delCategoryList();

      if (uninfo) return;
      categoryList.value[currentTopIndex.value]?.navs != 0 &&
        handleCategoryNav(1, categoryList.value[currentTopIndex.value]?.navs[1]);
    });
  }

  function delCategoryList() {
    // 处理菲站的数据
    const sourceCategoryList = JSON.parse(JSON.stringify(categoryList.value));
    const topCategoryList = sourceCategoryList
      .filter((item) => item.ty == 5 && item.id.startsWith('5_'))
      .map((item) => {
        return {
          cid: item.id_true,
          display_num: item.display_num ? item.display_num : 4,
          icon: '',
          name: '',
          platform_id: '',
          ty: item.ty,
          venue_id: '',
          id_true: item.id_true,
        };
      });
    // const topCategoryList = categoryList.value[0].navs.filter((item) => item.ty == 5);

    function setItems(id, type) {
      const itemsCate = categoryList.value.find((item) => item.id === id);
      if (itemsCate) {
        return type === 'hot'
          ? itemsCate.hots?.map((item) => ({
              ...item,
              value: item.name ? item.name : item.value,
              ty: MOVE_TYPE.G,
              [`${languageName.value}name`]: item.name,
              name: item.name,
              logo: item.logo ? item.icon : item.icon,
              icon: item.logo ? item.icon : item.icon,
              is_hot: item.is_hot ? item.is_hot : '0',
              is_new: item.is_new ? item.is_new : '0',
              platform_name: item.platform_name ? item.platform_name : '',
              type: 'game-bottom',
            })) || []
          : itemsCate.news?.map((item) => ({
              ...item,
              value: item.name ? item.name : item.value,
              ty: MOVE_TYPE.G,
              [`${languageName.value}name`]: item.name,
              name: item.name,
              logo: item.logo ? item.icon : item.icon,
              icon: item.logo ? item.icon : item.icon,
              is_hot: item.is_hot ? item.is_hot : '0',
              is_new: item.is_new ? item.is_new : '0',
              platform_name: item.platform_name ? item.platform_name : '',
              type: 'game-bottom',
            })) || [];
      }
      return [];
    }
    const hotList = topCategoryList.map((item) => {
      return {
        ...item,
        name: 'HOT',
        value: 'HOT',
        id: '5_1000_' + item.cid,
        item_navs: ref([{ value: t('common.firstRow'), id: '1', list: [], pid: 0 }]),
        cateType: 'hot',
        logo: '/images/CATE/hot.webp',
        items: ref(setItems('5_' + item.cid, 'hot')),
      };
    });
    const newList = topCategoryList.map((item) => {
      return {
        ...item,
        name: 'NEW',
        value: 'NEW',
        id: '5_2000_' + item.cid,
        item_navs: ref([{ value: t('common.firstRow'), id: '1', list: [], pid: 0 }]),
        cateType: 'new',
        logo: '/images/CATE/recommended_slot.webp',
        items: ref(setItems('5_' + item.cid, 'new')),
      };
    });
    categoryList.value.push(...hotList, ...newList);
    console.log('菲站数据', categoryList.value);
  }

  function delhotCategoryList() {
    const navId = getNavElementId.value;
    if (!navId.startsWith('5_')) {
      return [];
    }

    const value = navId.split('_')[1]; // 获取后面的部分

    return categoryList.value.filter(
      (item) =>
        (item.id.startsWith('5_1000') || item.id.startsWith('5_2000')) &&
        item.id.split('_')[2] === value,
    );
  }

  watch(
    () => firstNavIndex.value,
    (newV) => {
      recreationList.value = recreationListData.filter((item) => item.ty == (newV == 0 ? 5 : 1));
    },
  );
  watch(
    () => plateFormAllVenues.value,
    (e) => {
      if (e.length) {
        e.map((c) => {
          return {
            ...c,
            value: c.name,
            state: c.id === '1' ? true : false,
            logo: c.icon,
            items: ref(itemsHandle(c)),
            litems: ref(
              c.litems
                ? c.litems?.map((item) => {
                    return {
                      ...item,
                      value: cloneDeep(item.name),
                      name: item.name,
                      type: 'game-top',
                      id: item.platform_id === '0' ? item.cid : item.platform_id,
                      logo: item.logo ? item.icon : item.icon,
                      icon: item.logo ? item.icon : item.icon,
                      is_hot: String(item.is_hot ? item.is_hot : 0),
                      is_new: String(item.is_new ? item.is_new : 0),
                      item_nums: item.item_nums,
                      item_navs: item.item_navs?.length
                        ? item.item_navs?.map((arr, index) => {
                            return {
                              name: t('common.rowN', [toChineseNumberString(index + 1)]),
                              label: t('common.rowN', [toChineseNumberString(index + 1)]),
                              value: t('common.rowN', [toChineseNumberString(index + 1)]),
                              pid: index,
                              list: ref(
                                arr?.length
                                  ? arr?.map((item) => ({
                                      ...item,
                                      name: item.name,
                                      value: item.name,
                                      //logo: item.logo,
                                      id: item.id,
                                      logo: item.logo ? item.icon : item.icon,
                                      icon: item.logo ? item.icon : item.icon,
                                      state: false,
                                    }))
                                  : [],
                              ),
                            };
                          })
                        : [{ value: t('common.firstRow'), id: '1', list: [], pid: 0 }],
                    };
                  })
                : [],
            ),
            navs: ref(
              c.navs
                ? c.navs?.map((item) => ({
                    ...item,
                    name: item.name,
                    value: item.name,
                    id: item.platform_id === '0' ? item.cid : item.platform_id,
                    logo: item.logo ? item.icon : item.icon,
                    icon: item.logo ? item.icon : item.icon,
                    state: item.cid === '1' ? 2 : 0,
                    type: 'game-top',
                    venue_id: item.venue_id ? item.venue_id : '',
                    game_type: item.game_type ? item.game_type : '0',
                    // 菲站
                  }))
                : [],
            ),
            sidebars: ref(
              c.sidebars
                ? c.sidebars?.map((item) => ({
                    ...item,
                    name: item.name,
                    value: item.name,
                    //logo: item.logo,
                    id: item.platform_id === '0' ? item.cid : item.platform_id,
                    logo: item.logo ? item.icon : item.icon,
                    icon: item.logo ? item.icon : item.icon,
                    type: 'game-top',
                  }))
                : [],
            ),
            bottoms: ref(
              c.bottoms
                ? c.bottoms?.map((item) => ({
                    ...item,
                    name: item.name,
                    value: item.name,
                    //logo: item.logo,
                    id: item.platform_id === '0' ? item.cid : item.platform_id,
                    logo: item.logo ? item.icon : item.icon,
                    icon: item.logo ? item.icon : item.icon,
                    type: 'game-top',
                  }))
                : [],
            ),
            item_navs: ref([{ value: t('common.firstRow'), id: '1', list: [], pid: 0 }]),
            ty: MOVE_TYPE.T,
          };
        });
      }
    },
  );
  function firstHandle(index) {
    if (index === 0) {
      recreationList.value = recreationListData.filter((item) => item.ty == 5);
      handleCategoryNav(1, categoryList.value[currentTopIndex.value]?.navs[1]);
      checkIsMoved(
        OPERATE_EVENT.MOVE,
        platformList.value,
        categoryList.value[currentTopIndex.value]?.navs
          ? categoryList.value[currentTopIndex.value]?.navs
          : [],
        getListNavsLitems(getNavElementId.value),
      );
    }
    if (index === 1) {
      recreationList.value = recreationListData.filter((item) => item.ty == 1);
      handleCategoryNav(0, categoryList.value[currentTopIndex.value]?.navs[0]);
      categoryList.value[currentTopIndex.value]?.litems.length &&
        handleCategoryNavItems(0, categoryList.value[currentTopIndex.value]?.litems[0]);
      checkIsMoved(
        OPERATE_EVENT.MOVE,
        platformList.value,
        getListNavsLitems(getNavElementId.value),
      );
    }
    if (index === 2) {
      recreationList.value = recreationListData.filter((item) => item.ty == 5);
      handleClickgame_type(0);
      currentNavIndex.value = 0;
      checkIsMoved(
        OPERATE_EVENT.MOVE,
        platformList.value,
        categoryList.value[currentTopIndex.value]?.sidebars
          ? categoryList.value[currentTopIndex.value]?.sidebars
          : [],
      );
    }
    firstNavIndex.value = index;
  }
  function navColRow(v) {
    getSelectStyle.value = v;
    getSelectLobbyIndex.value = v;
    multipleSelectGame.value = [];
    checkIsMoved(
      OPERATE_EVENT.MOVE,
      categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
      getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
    );
    gameDisableReset();
  }
  function navColRowApply(v) {
    applyportActiveRow.value = v;
  }
  const current_element = ref();
  const current_Navelement = ref();
  async function handleCategoryNav(val, element, UnItems?) {
    console.log('handleCategoryNav', val, element, UnItems);

    current_Navelement.value = element = element ?? {};
    current_element.value = element = element ?? {};
    currentIndexLitems.value = element?.id ? val : null;
    getNavElementId.value = element?.id;
    currentLobbyIndex.value = null;
    // currentIndexNaveItems.value = null;

    sidebarIndexRecommended.value = null;
    currentCategoryCompanyIndex.value = null;

    if (element?.id == 5) {
      currentIndexNaveItems.value = null;
      // currentLobbyIndex.value- = null;
      handleClickCategoryCompany(null, element, true);
      return;
    }
    if (element?.ty === MOVE_TYPE.P || element?.ty === 3) {
      handleInfo_game();
    } else {
      getNavesgame_type.value = false;
    }

    currentCategoryIndex.value = null;
    // currentIndexNaveItems.value = 0;
    currentNavIndex.value = element ? element?.id : '0';
    if (element?.id == 1) {
      categoryList.value[currentTopIndex.value]?.litems.length &&
        currentIndexNaveItems.value != 0 &&
        handleCategoryNavItems(0, categoryList.value[currentTopIndex.value]?.litems[0]);
    } else {
      getListNavsLitems(getNavElementId.value).length && !UnItems
        ? handleCategoryNavItems(0, getListNavsLitems(getNavElementId.value)[0])
        : (currentIndexNaveItems.value = null);
    }
    gameDisableReset();
  }
  //大厅列表 分类列表点击方法
  function handleCategoryNavItems(val, element) {
    console.log('handleCategoryNavItems', val, element);
    current_element.value = element;
    if (!Array.isArray(current_element.value.item_nums)) {
      current_element.value.item_nums = [];
    }
    if (current_element.value.item_navs && current_element.value.item_nums) {
      const numsLenth = current_element.value.item_nums.length;
      const navsLenth = current_element.value.item_navs.length;

      if (numsLenth < navsLenth) {
        current_element.value.item_nums = current_element.value.item_nums.concat(
          Array(navsLenth - numsLenth).fill(4),
        );
      }
    }
    getSelectLobbyIndex.value = 0;
    sidebarIndexRecommended.value = null;
    currentCategoryCompanyIndex.value = null;
    currentIndexNaveItems.value = val;

    if (element && element?.id == 5) {
      // currentIndexNaveItems.value = null;
      // currentLobbyIndex.value- = null;
      handleClickCategoryCompany(null, element, true);
      return;
    }

    currentLobbyIndex.value = element?.id || element?.cid || null;
    handleClickCategory(null, null, currentLobbyIndex.value, true);
    currentCategoryIndex.value = null;
    sidebarIndexRecommended.value = null;

    if ((element && element?.ty === MOVE_TYPE.P) || element?.ty == 3) {
      handleInfo_game();
    } else {
      getNavesgame_type.value = false;
    }
    checkIsMoved(
      OPERATE_EVENT.MOVE,
      categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
      getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
    );
    gameDisableReset();
  }
  const current_Venues = ref();
  // 场馆处理
  const handleInfo_game = async () => {
    let element = current_element.value;
    if ((element && element?.ty === MOVE_TYPE.P) || element?.ty == 3) {
      //handleClickgame_type(0);
      getElementName.value = element.name;
      getNavesgame_type.value = true;
      getVenueId.value = element?.venue_id;
      currentPlatformDataId.value = element?.platform_id;
      searchLoading.value = true;
      // getPlateFormApi1()
      currentgame_typeIndex.value = plateFormAllVenues.value.findIndex(
        (item) => item.venue_id === element?.venue_id,
      );
      const data = plateFormAllVenues.value.find((item) => {
        return item.venue_id == element.venue_id;
      })?.data;
      //currentPlatformIndex.value = data.findIndex(item=> item.plateform_id === element?.id)
      let getIndex: any = 0;
      if (element.cid) {
        getIndex = data.findIndex((item) => item.id === (element?.id_true || element?.id));
      } else if (element?.id === '312' || element?.id === '316') {
        getIndex = data.findIndex((item) => item.id === (element?.id || element?.cid));
      } else {
        getIndex = data.findIndex((item) => item.game_type === element?.game_type);
      }
      if (element.ty_true == 3) {
        getIndex = null;
      }
      await handleClickgame_type(currentgame_typeIndex.value);
      current_Venues.value = plateFormAllVenues.value[currentgame_typeIndex.value]?.name;
      handleClickPlatform(getIndex);
    } else {
      handleClickgame_type(0);
    }
  };
  //获取游戏厂商
  async function getVenues() {
    const response = await getVenuesPlatform();
    const dataList = response.map((res) => {
      return {
        value: res.name,
        platform_id: res.id,
        logo: res.logo,
        name: res.name,
      };
    });
    getVenuesData.value = dataList;
  }
  getVenues();
  async function getCategorySport() {
    // 体育
    const response = await getPlatformSearch({
      page: 1,
      page_size: 50,
      game_type: 4,
      maintained: 0,
      state: 1,
    });
    const dList: any = response.d;
    if (dList) {
      const list: any = dList.map((item) => {
        return {
          id: item.id,
          value: item.zh_name,
        };
      });
      topNavList.value[currentTopIndex.value].items = ref(list);
    }
  }

  function toChineseNumberString(num) {
    num = Number(num);
    const chineseNums = [
      t('common.zero'),
      t('common.one'),
      t('common.two'),
      t('common.three'),
      t('common.four'),
      t('common.five'),
      t('common.six'),
      t('common.seven'),
      t('common.eight'),
      t('common.nine'),
    ];
    const chineseUnits = ['', t('common.ten'), t('common.hundred'), t('common.thousand')];

    if (num === 0) {
      return chineseNums[0];
    }

    let result = '';
    let unitIndex = 0; // 用于确定 "十、百、千" 的单位

    while (num > 0) {
      const digit = num % 10;
      if (digit !== 0) {
        result = chineseNums[digit] + chineseUnits[unitIndex] + result;
      } else if (result[0] !== t('common.zero')) {
        result = chineseNums[digit] + result; // 保证只添加一个 "零"
      }
      unitIndex++;
      num = Math.floor(num / 10);
    }

    // 处理 10~19 的特殊情况，如 "十一" 而不是 "一十一"
    if (result.startsWith('一十')) {
      result = result.substring(1);
    }
    // 去掉末尾的 "零"
    if (result.endsWith(t('common.zero'))) {
      result = result.slice(0, -1);
    }

    return result;
  }

  //行数点击
  function addIconCol() {
    isChange.value = true;
    const labelName = t('common.rowN', [
      toChineseNumberString(getListByIdNavs(currentLobbyIndex.value).length + 1),
    ]);
    getListByIdNavs(currentLobbyIndex.value).push({
      name: labelName,
      label: labelName,
      pid: getListByIdNavs(currentLobbyIndex.value).length,
      value: labelName,
      list: [],
    });
    current_element.value.item_nums.push(4);
  }
  //行数点击
  function addIconColApply() {
    isChange.value = true;
    const labelName = t('common.rowN', [
      toChineseNumberString(getListByApply_port(applyportActiveRow).length + 1),
    ]);
    getListByApply_port(applyportActiveRow).push({
      name: labelName,
      label: labelName,
      pid: getListByApply_port(applyportActiveRow).length,
      value: labelName,
      list: [],
    });
  }

  function addFunc(e) {
    isChange.value = true;
    if (e.oldIndex == currentIndexLitems.value) {
      if (e.to.className.includes('nav-list')) {
        if (e.from.className.includes('nav-list')) {
          currentIndexLitems.value = e.newDraggableIndex;
        }
      }
    }
    if (e.oldIndex == currentIndexNaveItems.value) {
      if (e.to.className.includes('group-list')) {
        if (e.from.className.includes('group-list')) {
          currentIndexNaveItems.value = e.newDraggableIndex;
        }
      }
    }
    if (e.to.className.includes('nav-list')) {
      if (e.from.className.includes('nav-list') && e.oldIndex <= currentIndexLitems.value) return;
      if (e.newIndex <= currentIndexLitems.value) {
        currentIndexLitems.value = currentIndexLitems.value + 1;
      }
    }
    if (e.to.className.includes('lobby-list')) {
      if (e.from.className.includes('lobby-list') && e.oldIndex <= currentIndexNaveItems.value)
        return;
      if (e.newIndex <= currentIndexNaveItems.value) {
        currentIndexNaveItems.value = currentIndexNaveItems.value + 1;
      }
    }
    if (e.to.className.includes('非大厅分类列表')) {
      if (e.from.className.includes('非大厅分类列表') && e.oldIndex <= currentIndexNaveItems.value)
        return;
      if (e.newIndex <= currentIndexNaveItems.value) {
        currentIndexNaveItems.value = currentIndexNaveItems.value + 1;
      }
    }
  }

  // 拖拽 移动
  function disabledMove(e) {
    isChange.value = true;
    multipleSelectGame.value = [];
    const { from, to } = e;
    if (e.to.className.includes('nav-list')) {
      if (e.from.className.includes('all-game')) {
        return false;
      }
    } else if (e.to.className.includes('lobby-list')) {
      if (e.from.className.includes('all-game')) {
        return false;
      }
    } else if (e.to.className.includes('classificate')) {
      if (e.from.className.includes('all-game')) {
        return false;
      }
      // if (e.form.className.includes('brand-list')) {
      //   return false;
      // }
    } else if (e.to.className.includes('all-game')) {
      if (e.from.className.includes('category-list')) {
        return false;
      }
      if (e.from.className.includes('brand-list')) {
        return false;
      }
      if (e.from.className.includes('游戏厂商')) {
        return false;
      }
      // if (Number(currentNavIndex.value) > 100) {
      //   if (!e.from.className.includes(current_Venues.value)) {
      //     return false;
      //   }
      // }
    } else if (e.to.className.includes('row-config')) {
      if (e.from.className.includes('category-list')) {
        return false;
      }
      if (e.from.className.includes('brand-list')) {
        return false;
      }
      if (e.from.className.includes('游戏厂商')) {
        return false;
      }
      if (e.from.className.includes('subgame')) {
        if (Number(currentLobbyIndex.value) > 100 || Number(currentNavIndex.value) > 100) {
          if (!e.from.className.includes(current_Venues.value)) {
            return true;
          } else {
            let draggedContextId =
              e.draggedContext.element?.id || e.draggedContext.element.platform_id;
            let exetId =
              e.relatedContext.list &&
              e.relatedContext.list.find(
                (item) => item.id == draggedContextId || item.platform_id == draggedContextId,
              );
            if (exetId) {
              if (e.draggedContext.element?.id) message.warn(t('table.system.sys_msg_1'));
              else message.warn(t('table.system.sys_msg_2'));
              return false;
            }
            return true;
          }
        }
        return false;
      }
    } else if (e.to.className.includes('内页推荐')) {
      if (e.from.className.includes('category-list')) {
        return false;
      }
      if (e.from.className.includes('brand-list')) {
        return false;
      }
      if (e.from.className.includes('游戏厂商')) {
        return false;
      }
    } else if (e.to.className.includes('展示品牌')) {
      if (e.from.className.includes('category-list')) {
        return false;
      }
      if (e.from.className.includes('brand-list')) {
        return false;
      }
      if (e.from.className.includes('游戏厂商')) {
        return false;
      }
      //禁止品牌拖动到分类列表
    }

    if (e.to.className.includes(t('common.Lobby_navigation'))) {
      if (e.from.className.includes('全部品牌')) {
        return false;
      }
    }
    if (e.to.className.includes(t('common.Lobby_navigation'))) {
      if (e.from.className.includes('fli-bottom')) {
        return false;
      }
    }

    if (e.to.className.includes('所有子游戏')) {
      let isLobby =
        (e.draggedContext.element.game_id == 0 && e.draggedContext.element.game_type == 1) ||
        e.draggedContext.element.name.includes('大厅');
      let fromIsLobby =
        (e.relatedContext.element.game_id == 0 && e.relatedContext.element.game_type == 1) ||
        e.relatedContext.element.name.includes('大厅');
      if (fromIsLobby || isLobby) {
        return false;
      }
    }
    if (from != to) {
      let draggedContextId = e.draggedContext.element?.id || e.draggedContext.element.platform_id;
      let exetId =
        e.relatedContext.list &&
        e.relatedContext.list.find((item) => (item.id || item.platform_id) == draggedContextId);
      if (exetId) {
        if (e.draggedContext.element?.id) message.warn(t('table.system.sys_msg_1'));
        else message.warn(t('table.system.sys_msg_2'));
        return false;
      }
    }
    const isGameBottom =
      e.draggedContext.element && e.draggedContext.element.type === 'game-bottom';
    const isGameTop =
      e.relatedContext.list && e.relatedContext.list.find((item) => item.type == 'game-top');
    if (isGameBottom && isGameTop) {
      return false;
    }

    if (e.relatedContext.element && e.relatedContext.element?.id === '1') {
      return false;
    }

    const realList = e.to.__draggable_component__.realList;
    const element = e.draggedContext.element;
    const has = realList.some((item) => (item.id || item.cid) === element?.id);
    const isSame = e.to === e.from;
    if (has && !isSame) {
      return false;
    } else {
      return true;
    }
  }
  function handleClickHall() {
    hallIndex.value = null;
    sidebarIndex.value = null;
    currentCategoryIndex.value = 0;
  }
  function gameListDisabledMove(e) {
    if (e.to === e.from) {
      return false;
    }
  }

  function resetData() {
    searchGameName.value = '';
    gameList.value = [];
  }

  const findArrayDifferences = (event, sourceList, ...otherArrays) => {
    // otherArrays[0] = JSON.parse(JSON.stringify( otherArrays[0] ));
    const addedItems: any = [];
    sourceList.forEach((item) => {
      item.state = false;
      const existsInOtherArrays = otherArrays.every((array: []) => {
        return (
          Array.isArray(array) &&
          array?.some((obj) => {
            if (event == 'CLOSE_') {
              if (obj.id == item.id) {
                item.state = false;
              }
              // else{
              //   item.state = true;
              // }
            } else {
              if (obj.id == item.id) {
                item.state = true;
              } else {
                item.state = false;
              }
            }
            return obj.id == item.id;
          })
        );
      });

      if (existsInOtherArrays) {
        addedItems.push(item);
      }
    });

    const removedItems = [];
    return {
      addedItems,
      removedItems,
    };
  };
  const handleClickCategoryRecommendedList = (index, value) => {
    getNavesgame_type.value = false;
    sidebarIndexRecommended.value = index;
    currentCategoryCompanyIndex.value = null;
    currentIndexNaveItems.value = null;
    currentLobbyIndex.value = null;
    currentIndexLitems.value = null;
    currentCategoryIndex.value = null;
    currentNavIndex.value = value.id;
    checkIsMoved(OPERATE_EVENT.MOVE, gameList.value, recommendGetListById(currentNavIndex.value));
  };
  // 置灰
  const checkIsMoved = (event, sourceList, ...targetList) => {
    getListById(currentNavIndex.value)?.length &&
      getListById(currentNavIndex.value)?.forEach((item) => {
        item.state = false;
      });
    const { addedItems, removedItems } = findArrayDifferences(event, sourceList, ...targetList);
    switch (event) {
      case OPERATE_EVENT.CLOSE:
        // 删除动作时，更改游戏主类的列表状态
        sourceList.forEach((item) => {
          item.state = true;
        });
        addedItems.forEach((item) => {
          item.state = false;
        });
        break;
      case 'CLOSE_':
        if (getNavesgame_type.value) {
          sourceList.forEach((item) => {
            item.state = false;
          });
          setTimeout(() => {
            addedItems.forEach((item) => {
              item.state = true;
            });
          }, 111);
        } else {
          sourceList.forEach((item) => {
            item.state = true;
          });
          setTimeout(() => {
            addedItems.forEach((item) => {
              item.state = false;
            });
          }, 111);
        }
        break;
      case OPERATE_EVENT.MOVE:
        addedItems.forEach((item) => {
          item.state = true;
        });
        removedItems?.forEach((item) => {
          item.state = true;
        });
        //const data = cloneDeep(sourceList)
        // data.forEach(_=> {
        // 	_.state = false
        // })
        break;
      default:
        sourceList.forEach((item) => {
          item.state = false;
        });
    }
  };
  function handleCompleteName(element) {
    tagNameTitle.value = element.value;
  }
  // 点击排序修改分类
  async function handleClickTopNav(index) {
    if (isChange.value) {
      handleCancelSort(index);
    } else {
      currentTopIndex.value = index;
      if (index === 1) {
        getCategorySport();
      } else {
        const keyArray = plateFormAllGame.value.map((key) => ({
          key: key.game_type,
          value: KeyOptions['p' + key.game_type],
          list: key.data,
        }));
        game_typeList.value = keyArray
          .filter((item) => item.key !== '4')
          .map((item) => {
            return { id: item.key, value: item.value, list: item.list };
          });
        handleClickCategory(0, recreationList?.value[0]);
        handleClickgame_type(0);
      }
    }
  }

  function cloneGame(data) {
    return { ...data };
  }

  // 监听移动改变事件
  function handleChangeMoveBox({ added }, ...targetList) {
    isChange.value = true;
    if (added) {
      const { element } = added;
      switch (element?.ty) {
        // case MOVE_TYPE.T:
        //   checkIsMoved(OPERATE_EVENT.MOVE, recreationList.value, ...targetList);
        //   break;
        case MOVE_TYPE.P:
          checkIsMoved(OPERATE_EVENT.MOVE, platformList.value, ...targetList);
          break;
        case MOVE_TYPE.G:
          checkIsMoved(OPERATE_EVENT.MOVE, gameList.value, ...targetList);
          checkIsMoved(
            OPERATE_EVENT.MOVE,
            categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
            ...targetList,
          );
          break;
        case MOVE_TYPE.M:
          checkIsMoved(OPERATE_EVENT.MOVE, gameMainClassList.value, ...targetList);
          break;
        default:
      }
    }
  }
  //监听变化
  watch(
    () => rowDeleteValue.value,
    (val) => {
      if (getSelectLobbyIndex.value === val) {
        getSelectLobbyIndex.value = val - 1;
      }
      navColRow(getSelectLobbyIndex.value);
    },
  );
  //
  function handleChangeMoveBox1({ added }, ...targetList) {
    isChange.value = true;
    if (added) {
      const { element } = added;
      switch (element?.ty) {
        // case MOVE_TYPE.T:
        //   checkIsMoved(OPERATE_EVENT.MOVE, recreationList.value, ...targetList);
        //   break;
        case MOVE_TYPE.P:
          if (targetList.includes(t('common.Lobby_navigation'))) {
            checkIsMoved(OPERATE_EVENT.MOVE, platformList.value, ...targetList);
            gameDisableReset();
          }
          // checkIsMoved(OPERATE_EVENT.MOVE, platformList.value, ...targetList);
          break;
        case MOVE_TYPE.G:
          if (targetList.includes('内页推荐')) {
            nextTick(() => {
              checkIsMoved(OPERATE_EVENT.MOVE, gameList.value, targetList[0]);
            });
          }
          if (targetList.includes('分类全部游戏')) {
            // setTimeout(() => {
            checkIsMoved(OPERATE_EVENT.MOVE, gameList.value, targetList[0]);
            // }, 555);
            checkIsMoved(
              OPERATE_EVENT.MOVE,
              categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
              getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
            );
          }
          if (targetList.includes('行数配置')) {
            checkIsMoved(OPERATE_EVENT.MOVE, getListById(currentNavIndex.value), targetList[0]);
            if (getNavesgame_type.value) {
              checkIsMoved(OPERATE_EVENT.MOVE, gameList.value, targetList[0]);
            }
          }
          break;
        case MOVE_TYPE.M:
          checkIsMoved(OPERATE_EVENT.MOVE, gameMainClassList.value, ...targetList);
          break;
        default:
      }
    }
  }
  // 监听删除事件
  function handleDelete(index, ...targetList) {
    const element = targetList[0][index];
    let sourceList: any = [];
    switch (element?.ty) {
      //游戏分类删除disable
      case MOVE_TYPE.T:
        break;
      case MOVE_TYPE.P:
        sourceList = platformList.value;
        break;
      case MOVE_TYPE.G:
        sourceList = gameList.value;
        break;
      case MOVE_TYPE.M:
        sourceList = gameMainClassList.value;
        break;
    }

    if (targetList.some((item) => item.includes(t('common.Lobby_navigation')))) {
      if (targetList.includes(t('common.Lobby_navigation'))) {
        if (getNavElementId.value == element?.id) {
          const delelement = targetList[0][index - 1] || {};
          // getNavElementId.value = delelement?.id || null;
          currentIndexLitems.value = index - 1;
          index - 1 != 0 && handleCategoryNav(index - 1, delelement);
        }
      }

      if (
        targetList.some((item) => item.includes('非大厅分类列表')) ||
        targetList.some((item) => item.includes('大厅列表导航列表'))
      ) {
        if (currentIndexNaveItems.value == index) {
          const delelement = targetList[0][index - 1] || null;
          currentIndexNaveItems.value = index - 1 < 0 ? null : index - 1;
          if (index - 1 < 0) {
            handleCategoryNav(currentIndexLitems.value, current_Navelement.value, 1);
          } else {
            handleCategoryNavItems(currentIndexNaveItems.value, delelement);
          }
        }
      }

      sourceList.length && checkIsMoved('CLOSE_', sourceList, [targetList[0][index]]);
      gameDisableReset();
    } else {
      sourceList.length && checkIsMoved(OPERATE_EVENT.CLOSE, sourceList, ...targetList);
      // sourceList.length && checkIsMoved(OPERATE_EVENT.MOVE, sourceList, ...targetList);
    }
    targetList[0].splice(index, 1);
    if (Array.isArray(current_element.value.item_nums)) {
      current_element.value.item_nums.splice(index, 1);
    }
    isChange.value = true;
  }
  //删除 全部游戏 置灰的效果
  function handleDeleteAllGame(index, targetList) {
    checkIsMoved('CLOSE_', gameList.value, [targetList[index]]);
    setTimeout(() => {
      targetList.splice(index, 1);
      gameDisableReset();
    }, 1);
  }
  function handleDeleteRowItem(index, targetList) {
    targetList.splice(index, 1);
    if (getNavesgame_type.value) {
      checkIsMoved('CLOSE_', gameList.value, targetList);
    } else {
      checkIsMoved(OPERATE_EVENT.MOVE, getListById(currentNavIndex.value), targetList);
    }
    gameDisableReset();
  }
  function handleDeleteRow(index, ...targetList) {
    rowDeleteValue.value = index;
    if (index + 1 !== getListByIdNavs(currentLobbyIndex.value).length) {
      return false;
    }
    const element = targetList[0][index];
    let sourceList: any = [];
    switch (element?.ty) {
      case MOVE_TYPE.T:
        sourceList = recreationList.value;
        break;
      case MOVE_TYPE.P:
        sourceList = platformList.value;
        break;
      case MOVE_TYPE.G:
        sourceList = gameList.value;
        break;
      case MOVE_TYPE.M:
        sourceList = gameMainClassList.value;
        break;
    }

    targetList[0].splice(index, 1);
    current_element.value.item_nums.splice(index, 1);
    if ([...targetList][0].length === 1) {
      getSelectLobbyIndex.value = 0;
    }
    if (getNavesgame_type.value) {
      setTimeout(() => {
        checkIsMoved('CLOSE_', gameList.value, ...targetList);
        // checkIsMoved(OPERATE_EVENT.CLOSE, gameList.value, ...targetList);
      }, 444);
    } else {
      checkIsMoved(OPERATE_EVENT.CLOSE, sourceList, ...targetList);
    }
    gameDisableReset();
    isChange.value = true;
  }
  function handleDeleteRowApply(index, targetList) {
    // rowDeleteValue.value = index;
    if (index + 1 !== targetList.length) {
      return false;
    }
    if (applyportActiveRow.value === index) {
      applyportActiveRow.value = index - 1;
      navColRowApply(applyportActiveRow.value);
    }
    targetList.splice(index, 1);
    isChange.value = true;
  }

  function handleClickCategory(index, element, id?: string, noset?) {
    if (element !== null) current_element.value = {};
    if (!noset) getNavesgame_type.value = false;
    if (id) {
      if (id.startsWith('5_1000') || id.startsWith('5_2000')) {
        element = categoryList.value.find((el) => el.id === id);
      } else {
        index = recreationList?.value.findIndex((el) => el.id === id);
        if (index !== -1) {
          element = recreationList.value[index];
        }
      }
    } else {
      // you
      if (!!index || index == 0) {
        currentIndexNaveItems.value = null;
        currentLobbyIndex.value = null;
        currentIndexLitems.value = null;
      }
      if (currentCategoryIndex.value == index) {
        // currentCategoryIndex.value = null;
        return false;
      }
    }
    currentCategoryCompanyIndex.value = null;
    sidebarIndexRecommended.value = null;
    currentNavIndex.value = element ? element?.id : '0';
    currentCategoryIndex.value = index;
    radioModalRow.value = 1;
    currentCategoryData.value = categoryList.value[index];
    // 这里先注释 因为很卡
    // handleClickPlatform(0);
    // checkIsMoved(
    //   OPERATE_EVENT.CLOSE,
    //   recreationList.value,
    //   categoryList.value[index]?.litems,
    //   categoryList.value[index]?.navs,
    //   categoryList.value[index]?.sidebars,
    //   categoryList.value[index]?.bottoms,
    // );
    if (element?.id == 5) getVenues();
    gameDisableReset();
  }
  function handleClickCategoryCompany(index, element, id?: any) {
    currentCategoryCompanyIndex.value = index;
    getNavesgame_type.value = false;
    if (!id) {
      currentIndexNaveItems.value = null;
      currentLobbyIndex.value = null;
      currentIndexLitems.value = null;
    }

    currentCategoryIndex.value = null;
    sidebarIndexRecommended.value = null;
    currentNavIndex.value = element ? element?.id : '0';
    if (index !== null) {
      // currentIndexNaveItems.value = null;
      // currentLobbyIndex.value- = null;
    }
  }
  //全部添加品牌
  function handleAddAllBrand() {
    const activeList = gameList.value.filter((item) => !item.state);
    const currentCategoryList = categoryList.value[currentCategoryIndex.value].items;
    categoryList.value[currentCategoryIndex.value].items = currentCategoryList.concat(
      cloneDeep(activeList),
    );
    // checkIsMoved(
    //   OPERATE_EVENT.MOVE,
    //   gameList.value,
    //   categoryList.value[currentCategoryIndex.value].items,
    // );
    isChange.value = true;
  }
  // 添加类别
  function handleAddCategory() {
    const obj: any = recreationList.value[recreationList.value.length - 1];
    const items = ref([]);
    recreationList.value.push({ ...obj, id: '', value: '', isEdit: true, items });
  }
  // 完成编辑类别
  async function handleCompleteCategory(element) {
    if (element.value) {
      const { data, status } = await updateCategoryName({
        id: element?.id,
        name: tagNameTitle.value,
        lang: languageModal.value,
      });
      if (status) {
        element.isEdit = false;
        message.success(data);
      } else {
        message.error(data);
      }
    } else {
      message.error(`$t('table.system.system_name_category')`);
    }
  }
  // 删除
  async function handleDelCategory(index) {
    const { data, status } = await delGameCategory({ id: categoryList.value[index].id });
    if (status) {
      message.success(data);
      categoryList.value.splice(index, 1);
    } else {
      message.error(data);
    }
  }
  function handleChildElement(item) {
    //activeState.value = true;
    const arr = item.value?.length ? item.value.filter((item) => !item.state) : [];
    let uniqueItems = [];
    arr.forEach((item) => {
      // 检查 uniqueItems 数组中是否已经存在相同 id 的项目
      if (!uniqueItems.some((uniqueItem: any) => uniqueItem.id === item.id)) {
        // 如果不存在，则将此项目添加到 uniqueItems 数组中
        uniqueItems.push(item as never);
      }
    });
    multipleSelect.value = uniqueItems;
  }
  function handleChildElementGame(item) {
    const arr = item.value?.length ? item.value.filter((item) => !item.state) : [];
    let uniqueItems = [];
    arr.forEach((item) => {
      // 检查 uniqueItems 数组中是否已经存在相同 id 的项目
      if (!uniqueItems.some((uniqueItem: any) => uniqueItem.id === item.id)) {
        // 如果不存在，则将此项目添加到 uniqueItems 数组中
        uniqueItems.push(item as never);
      }
    });
    multipleSelectGame.value = uniqueItems;
  }
  // 多个添加
  function multipleAdd() {
    let currentCategory =
      categoryList.value.find((obj) => obj.id === currentNavIndex.value) || current_element.value;
    let currentCategoryList = currentCategory.items;
    openConfirm(
      t('modalForm.finance.finance_operation_confirmation'),
      t('common.confirmMutiAdd', [
        multipleSelect.value.length,
        currentCategory.name || t('common.Game'),
      ]),
      () => {
        if (currentNavIndex.value === '100') {
          let recomendList =
            categoryList.value.find(
              (obj) => obj.id === currentNavIndex.value && obj.game_type == recommendActive.value,
            ).items || [];
          categoryList.value.find(
            (obj) => obj.id === currentNavIndex.value && obj.game_type == recommendActive.value,
          ).items = recomendList.concat(cloneDeep(multipleSelect.value));
        } else if (getNavesgame_type.value) {
          getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value].list =
            getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value].list.concat(
              cloneDeep(multipleSelect.value),
            );
        } else {
          categoryList.value.find((obj) => obj.id === currentNavIndex.value).items =
            currentCategoryList.concat(cloneDeep(multipleSelect.value));
        }
        multipleSelect.value = [];
        message.success(t('common.AddedSuccessfully'));
        isChange.value = true;
        if (getNavesgame_type.value) return gameDisableReset();
        checkIsMoved(
          OPERATE_EVENT.MOVE,
          gameList.value,
          categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
        );
      },
      '',
    );
  }
  async function handleClickgame_type(index, type = null) {
    //可选参数
    getVenueId.value = plateFormAllVenues.value[index].venue_id;
    resetData();

    currentgame_typeIndex.value = index;
    let gameSubList: any = plateFormAllVenues.value[index]?.data;
    const list: any = gameSubList ? gameSubList : [];
    const arr = langrageArr.filter((item) => {
      return item.value === languageModal.value;
    });
    if (list) {
      platformList.value = list?.map((item) => {
        return {
          ...item,
          id: item.id,
          logo: item.nav || item.logo,
          value: item[`${arr[0].language}name`],
          isEdit: false,
          ty: 2,
          name: item.zh_name ? item.zh_name : item.name,
          platform_id: item.platform_id ? item.platform_id : '',
          venue_id: item.venue_id ? item.venue_id : '',
          display_num: item.display_num || 4,
        };
      });
      //platformList.value.unshift(plateFormAllVenues.value[index]);
      let first_data = plateFormAllVenues.value[index];
      getFirstListGame.value = [
        {
          ...first_data,
          id: '3' + first_data.id || '3' + first_data.venue_id,
          cid: '3' + first_data.id || '3' + first_data.venue_id,
          logo: first_data.nav || first_data.logo,
          value: first_data.zh_name ? first_data.zh_name : first_data.name,
          isEdit: false,
          ty: 2,
          ty_true: 3,
          name: first_data.zh_name ? first_data.zh_name : first_data.name,
          platform_id: first_data.platform_id ? first_data.platform_id : '',
          venue_id: first_data.venue_id ? first_data.venue_id : '',
          display_num: 4,
        },
      ];
      if (type !== 'game_type' && type !== 'gamePlate') {
        searchLoading.value = true;
        await handleClickPlatformFirst(0);
        searchLoading.value = false;
      }
    } else {
      platformList.value = [];
    }
  }
  async function handleClickPlatformFirst(index) {
    getFirstListGameIndex.value = index;
    currentPlatformIndex.value = null;

    //handleClickPlatform(null)
    // getPlateFormApi();
    await getPlateFormApi1();
    // disableReset();
  }
  // 点击游戏平台获取游戏列表
  async function handleClickPlatform(index) {
    if (index === null) {
      getFirstListGameIndex.value = 0;
    } else {
      getFirstListGameIndex.value = null;
    }
    if (index !== currentPlatformIndex.value) {
      resetData();
    }
    plateFormState.value = false;
    currentPlatformIndex.value = index;
    currentPlatformData.value = platformList.value[currentPlatformIndex.value];
    currentPlatformDataId.value = currentPlatformData.value?.id;
    searchLoading.value = true;
    //const platform_id: any = currentPlatformData.value?.id;
    getPlateFormApi1();
    // disableReset();
  }
  async function getPlateFormApi1() {
    const response = await getSearchGameAllList({
      // game_type: game_type,
      online: 1,
      venue_id: getVenueId.value || '101',
      platform_id: getFirstListGameIndex.value === 0 ? null : currentPlatformDataId.value,
      lang: languageModal.value,
    });
    searchLoading.value = false;
    const list: any = response;
    if (list) {
      gameList.value = list.map((item) => {
        return {
          ...item,
          value: item.name,
          ty: MOVE_TYPE.G,
          type: 'game-bottom',
        };
      });

      let item = gameList.value.splice(
        Math.max(
          gameList.value.findIndex(
            (item) =>
              (item.game_id == 0 && item.game_type == 1) || item.name.includes(t('common.lobby')),
          ),
          0,
        ),
        1,
      )[0];
      gameList.value.unshift(item);
      if (getListByIdNavs(currentLobbyIndex.value).length === 1) {
        getSelectStyle.value = 0;
      }
      const newArray = [];
      getListByIdNavs(currentLobbyIndex.value).forEach((subArray) => {
        Object.values(subArray.list).forEach((item) => {
          newArray.push(item as never);
        });
      });

      gameDisableReset();
    }
  }
  // 重置
  function gameDisableReset() {
    setTimeout(() => {
      if (currentNavIndex.value == 100) {
        checkIsMoved(
          OPERATE_EVENT.MOVE,
          gameList.value,
          recommendGetListById(currentNavIndex.value),
        );
      } else {
        if (currentNavIndex.value == 5) return;
        checkIsMoved(OPERATE_EVENT.MOVE, gameList.value, getListById(currentNavIndex.value));
        checkIsMoved(
          OPERATE_EVENT.MOVE,
          categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
          getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
        );
      }
      if (getNavesgame_type.value) {
        checkIsMoved(
          OPERATE_EVENT.MOVE,
          gameList.value,
          getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
        );
      }
    }, 455);
  }
  function gameDisableDel() {
    setTimeout(() => {
      if (currentNavIndex.value == 100) {
        checkIsMoved(
          OPERATE_EVENT.CLOSE,
          gameList.value,
          recommendGetListById(currentNavIndex.value),
        );
      } else {
        checkIsMoved(OPERATE_EVENT.CLOSE, gameList.value, getListById(currentNavIndex.value));

        // checkIsMoved(
        //   OPERATE_EVENT.CLOSE,
        //   categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
        //   getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
        // );
      }
    }, 455);
  }
  // 添加所有
  function handleAddAllGame() {
    let currentCategory =
      categoryList.value.find((obj) => obj.id === currentNavIndex.value) || current_element.value;
    openConfirm(
      t('modalForm.finance.finance_operation_confirmation'),
      t('common.confirmAdd', [currentCategory.name || t('common.Game')]),
      () => {
        const activeList = gameList.value.filter((item) => !item.state);
        const currentCategoryList =
          categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items ?? [];

        if (currentNavIndex.value === '100') {
          let recomendList =
            categoryList.value.find(
              (obj) => obj.id === currentNavIndex.value && obj.game_type == recommendActive.value,
            ).items || [];
          categoryList.value.find(
            (obj) => obj.id === currentNavIndex.value && obj.game_type == recommendActive.value,
          ).items = recomendList.concat(cloneDeep(activeList));
        } else if (getNavesgame_type.value) {
          getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value].list =
            getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value].list.concat(
              cloneDeep(activeList),
            );
        } else {
          let objC = categoryList.value.find((obj) => obj.id === currentNavIndex.value);
          if (objC) objC.items = currentCategoryList.concat(cloneDeep(activeList));
        }

        isChange.value = true;

        checkIsMoved(
          OPERATE_EVENT.MOVE,
          gameList.value,
          categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
        );
        gameDisableReset();
      },
      '',
    );
  }

  function handleAddAllGame_row() {
    openConfirm(
      t('modalForm.finance.finance_operation_confirmation'),
      t('common.confirmRowMutiAdd', [
        multipleSelectGame.value.length,
        toChineseNumberString(getSelectLobbyIndex.value + 1),
      ]),
      () => {
        let exetId = false;
        multipleSelectGame.value.forEach((_) => {
          exetId = getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value].list.find(
            (item) => item.id_ || item.id === _.id,
          );
        });
        if (exetId) {
          message.error(t('common.CannotAddedRepeatedly'));
          return false;
        } else {
          let currentCategoryList = getListByIdNavs(currentLobbyIndex.value)[
            getSelectLobbyIndex.value
          ].list;
          getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value].list =
            currentCategoryList
              .concat(cloneDeep(multipleSelectGame.value))
              .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));
          multipleSelectGame.value = [];
          message.success(t('common.AddedSuccessfully'));
        }

        isChange.value = true;
        checkIsMoved(
          OPERATE_EVENT.MOVE,
          categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
          getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
        );
      },
      '',
    );
  }

  function handleDelAllGame() {
    openConfirm(
      t('modalForm.finance.finance_operation_confirmation'),
      t('common.confirmRemoveAll'),
      () => {
        setTimeout(() => {
          if (currentNavIndex.value == 100) {
            setTimeout(() => {
              checkIsMoved('CLOSE_', gameList.value, recommendGetListById(currentNavIndex.value));
              gameDisableReset();
            }, 333);

            let foundObject = categoryList.value.filter(
              (obj) => obj.id === '100' && obj.game_type == recommendActive.value,
            );
            if (foundObject && foundObject[0].items) {
              foundObject[0].items = [];
            }
          } else if (currentNavIndex.value == 5) {
            // checkIsMoved('CLOSE_', gameList.value, recommendGetListById(currentNavIndex.value));
            let foundObject = getListByApply_port(applyportActiveRow.value)[
              applyportActiveRow.value
            ];
            if (foundObject && foundObject.list) foundObject.list = [];
          } else {
            checkIsMoved(
              'CLOSE_',
              gameList.value,
              categoryList.value.find((obj) => obj.id === currentNavIndex.value).items,
            );
            categoryList.value.find((obj) => obj.id === currentNavIndex.value).items = [];
            gameDisableReset();
          }
          isChange.value = true;
        }, 455);
      },
      '',
    );
  }
  function handleRmoveRow() {
    const row = getSelectLobbyIndex.value + 1;
    openConfirm(
      t('modalForm.finance.finance_operation_confirmation'),
      t('common.confirmRemoveRowNum', [row]),
      () => {
        const currentNavObject = categoryList.value.find((obj) => obj.id == getNavElementId.value);

        getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value].list = [];
        checkIsMoved(
          OPERATE_EVENT.MOVE,
          categoryList.value.find((obj) => obj.id === currentNavIndex.value)?.items || [],
          getListByIdNavs(currentLobbyIndex.value)[getSelectLobbyIndex.value]?.list,
        );
        gameDisableReset();
        getSelectStyle.value = 0;
        isChange.value = true;
      },
      '',
    );
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

  const change_over = () => {
    fold_row.value = !fold_row.value;
  };

  const change_over1 = () => {
    fold_game.value = !fold_game.value;
  };

  function handleToSubGame() {
    $router.push({ name: 'SubGameSort' });
  }

  // 打开 编辑
  function handleEditSort() {
    // checkIsMoved(
    //   OPERATE_EVENT.MOVE,
    //   recreationList.value,
    //   categoryList.value[currentTopIndex.value]?.litems,
    //   categoryList.value[currentTopIndex.value]?.navs,
    //   categoryList.value[currentTopIndex.value]?.sidebars,
    //   categoryList.value[currentTopIndex.value]?.bottoms,
    // );

    handleInfo_game();
    PAGE_EDIT.value = true;
    disabledTab.value = true;
    disabledLangrage.value = true;
    // firstHandle(firstNavIndex.value);
  }

  // 取消
  function handleCancelSort(index) {
    disabledTab.value = false;
    disabledLangrage.value = false;
    // currentCategoryIndex.value = false;
    // currentIndexNaveItems.value = false;
    // 关闭并重新请求数据渲染
    if (isChange.value) {
      openConfirm(
        t('modalForm.finance.finance_operation_confirmation'),
        t('common.confirmCancelSave'),
        () => {
          PAGE_EDIT.value = false;
          if (isNumber(index)) {
            currentTopIndex.value = index;
          }
          switch (currentTopIndex.value) {
            case 0:
              getCategoryList(languageModal.value, true);
              break;
            case 1:
              getCategorySport();
              break;
          }
          getVenues();
          isChange.value = false;
        },
        '',
      );
    } else {
      PAGE_EDIT.value = false;
      if (isNumber(index)) {
        currentTopIndex.value = index;
      }
      switch (currentTopIndex.value) {
        case 0:
          //getCategoryIndex();
          break;
        case 1:
          getCategoryList(languageModal.value);
          break;
        case 2:
          getCategorySport();
          break;
      }
    }
  }

  // 保存
  async function handleSaveSort() {
    isChange.value = false;
    disabledTab.value = false;
    disabledLangrage.value = false;
    saveLoadingButton.value = true;
    switch (currentTopIndex.value) {
      //case 0:
      //saveIndexPage();
      //break;
      case 0:
        saveCategory();
        break;
      case 1:
        saveSport();
        break;
    }
  }
  // 首页
  async function saveIndexPage() {
    saveLoading.value = true;
    const params = topNavList.value[currentTopIndex.value].items?.map((item: any) => {
      return { id: item.id, name: item.value };
    });
    const { data, status } = await updateGameCategoryIndex(params);
    if (status) {
      saveLoading.value = false;
      message.success(data);
      PAGE_EDIT.value = false;
      //getCategoryIndex();
    } else {
      message.error(data);
    }
  }

  let venueData = {};
  const dataHandle = function (items) {
    var data: any = { h5: [], pc: [] };
    let { h5, pc } = items;
    h5 = h5?.map((item0) => {
      let dataitem = item0.list.map((item) => {
        return {
          id: item.id ? item.id : item.platform_id,
          platform_id: item.platform_id,
          logo: item.logo,
          icon: item.logo,
          //game_type: String(item.game_type),
          lang: languageModal.value,
          name: item.zh_name ? item.zh_name : item.name,
          is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
          is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
        };
      });
      return dataitem;
    });
    pc = pc?.map((item0) => {
      let dataitem = item0.list.map((item) => {
        return {
          id: item.id ? item.id : item.platform_id,
          platform_id: item.platform_id,
          logo: item.logo,
          icon: item.logo,
          //game_type: String(item.game_type),
          lang: languageModal.value,
          name: item.zh_name ? item.zh_name : item.name,
          is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
          is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
        };
      });
      return dataitem;
    });
    data.h5 = h5;
    data.pc = pc;
    venueData = data;
    return [];
  };
  // 保存 娱乐城
  async function saveCategory() {
    const params: any = {
      lobby: null,
      cates: [],
      venue: {},
    };
    const sorceCategoryList = JSON.parse(JSON.stringify(categoryList.value));
    let copyCategoryList = JSON.parse(JSON.stringify(categoryList.value));

    if (showQuantity.value) {
      copyCategoryList = copyCategoryList.filter((item) => {
        return !item.id.startsWith('5_1000') && !item.id.startsWith('5_2000');
      });
    }

    copyCategoryList.forEach((item) => {
      if (item.id === '1') {
        const items = item?.litems?.map((item) => {
          return item.ty === 1 || Number(item.id) > 100
            ? {
                ty: Number(item.id) > 100 ? item.ty_true || item.ty || 1 : item.ty_true || item.ty,
                cid: item.id_true || item.id,
                id: item.id_true || item.id,
                platform_id: '0',
                icon: item.nav || item.logo,
                name: item.zh_name ? item.zh_name : item.name,
                is_hot: String(item.is_hot ? item.is_hot : 0),
                venue_id: item.venue_id,
                item_nums: item.item_nums,
                item_navs: item?.item_navs?.length
                  ? item?.item_navs?.map((arr) => {
                      return [
                        ...(arr.list
                          ? arr.list.map((item) => ({
                              id: item.id ? item.id : item.platform_id,
                              platform_id: item.platform_id || item.id,
                              platform_name: item.platform_name,
                              logo: item.nav || item.logo || '',
                              icon: item.nav || item.logo || '',
                              lang: languageModal.value,
                              name: item.zh_name ? item.zh_name : item.name,
                              is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
                              is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
                            }))
                          : []),
                      ];
                    })
                  : null,
              }
            : {
                id: item.id_true || item.id,
                ty: item.ty_true || item.ty,
                cid: item.id_true || item.id || '0',
                platform_id: item.id,
                icon: item.logo,
                item_nums: item.item_nums,
                item_navs: item?.item_navs?.length
                  ? item?.item_navs?.map((arr) => {
                      return [
                        ...(arr.list
                          ? arr.list.map((item) => ({
                              id: item.id ? item.id : item.platform_id,
                              platform_id: item.platform_id || item.id,
                              platform_name: item.platform_name,
                              logo: item.nav || item.logo || '',
                              icon: item.nav || item.logo || '',
                              lang: languageModal.value,
                              name: item.zh_name ? item.zh_name : item.name,
                              is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
                              is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
                            }))
                          : []),
                      ];
                    })
                  : null,
                venue_id: item.venue_id,
                name: item.zh_name ? item.zh_name : item.name,
                is_hot: String(item.is_hot ? item.is_hot : 0),
              };
        });

        const navs = item?.navs?.map((item) => {
          return item.ty === 1
            ? {
                ty: item.ty,
                cid: item.id,
                id: item.id_true || item.id,
                platform_id: '0',
                icon: item.logo,
                lang: languageModal.value,
                name: item.zh_name ? item.zh_name : item.name,
                display_num: item.display_num || 4,
              }
            : {
                ty: item.ty_true || item.ty,
                cid: item.id_true || item.id,
                id: item.id_true || item.id,
                platform_id: item.id_true || item.id,
                icon: item.logo,
                lang: languageModal.value,
                name: item.zh_name ? item.zh_name : item.name,
                venue_id: item.venue_id ? item.venue_id : '',
                display_num: item.display_num || 4,
              };
        });
        const lobby_item = navs.filter((item) => item.id == 1);
        if (lobby_item.length == 0) {
          navs.unshift({
            cid: '1',
            icon: '/images/CATE/lobby.webp',
            id: '1',
            lang: 'zh_CN',
            name: '大厅',
            platform_id: '0',
            ty: 1,
          });
        }
        const sidebars = item?.sidebars?.map((item) => {
          return item.ty === 1
            ? {
                ty: item.ty,
                cid: item.id_true || item.id,
                id: item.id_true || item.id,
                platform_id: '0',
                icon: item.logo,
                lang: languageModal.value,
                //name: item.name,
                name: item.zh_name ? item.zh_name : item.name,
              }
            : {
                ty: item.ty_true || item.ty,
                id: item.id_true || item.id,
                cid: item.id_true || item.id,
                icon: item.logo,
                platform_id: item.id_true || item.id,
                lang: languageModal.value,
                //name: item.name,
                name: item.zh_name ? item.zh_name : item.name,
              };
        });
        const bottoms = item?.bottoms?.map((item) => {
          return item.ty === 1
            ? {
                ty: item.ty,
                cid: item.id_true || item.id,
                id: item.id_true || item.id,
                platform_id: '0',
                icon: item.logo,
                lang: languageModal.value,
                //name: item.name,
                name: item.zh_name ? item.zh_name : item.name,
              }
            : {
                ty: item.ty,
                cid: '0',
                icon: item.logo,
                platform_id: item.id,
                lang: languageModal.value,
                //name: item.name,
                name: item.zh_name ? item.zh_name : item.name,
              };
        });
        const data = {
          id: item.id_true || item.id,
          navs: navs ? navs : null,
          litems: items ? items : null,
          sidebars: sidebars ? sidebars : null,
          bottoms: bottoms ? bottoms : null,
          lang: languageModal.value,
          [`${languageName.value}_name`]: item.name,
          itemNavs: [],
        };
        params.lobby = data;
      } else {
        const items =
          item.id === '5'
            ? dataHandle(item?.items)
            : item?.items?.map((item) => {
                return {
                  id: item.id ? item.id : item.platform_id,
                  platform_id: item.platform_id,
                  logo: item.logo,
                  icon: item.logo,
                  //game_type: String(item.game_type),
                  lang: languageModal.value,
                  name: item.zh_name ? item.zh_name : item.name,
                  is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
                  is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
                };
              }) || [];
        const navs = item?.navs?.map((item) => {
          //const nameObject = getLanguageObject('name', item);
          return {
            ty: item.ty_true || item.ty,
            id: item.id_true || item.id,
            cid: item.id_true || item.id,
            platform_id: item.platform_id || item.id_true || item.id,
            logo: item.logo,
            //...nameObject,
            // name: item.name,
            lang: languageModal.value,
            name: item.zh_name ? item.zh_name : item.name,
            venue_id: item.venue_id ? item.venue_id : '',
          };
        });
        const litems = item?.litems?.map((item) => {
          return {
            cateType: item.cateType ? item.cateType : 'default',
            ty: item.ty_true || item.ty || 1,
            cid: item.id ? item.id_true || item.id : item.cid,
            id: item.id ? item.id_true || item.id : item.platform_id,
            platform_id: item.platform_id ? item.platform_id : item.id_true || item.cid || item.id,
            logo: item.logo,
            icon: item.logo,
            lang: languageModal.value,
            name: item.name,
            venue_id: item.venue_id,
            item_nums: item.item_nums,
            display_num: item.display_num || 4,
            item_navs: item?.item_navs?.length
              ? item?.item_navs?.map((arr) => {
                  return [
                    ...(arr.list
                      ? arr.list.map((item) => ({
                          id: item.id ? item.id_true || item.id : item.platform_id,
                          platform_id: item.platform_id || item.id_true || item.id,
                          logo: item.nav || item.logo || '',
                          icon: item.nav || item.logo || '',
                          lang: languageModal.value,
                          name: item.zh_name ? item.zh_name : item.name,
                          is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
                          is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
                          platform_name: item.platform_name ? item.platform_name : '',
                        }))
                      : []),
                  ];
                })
              : null,
          };
        });
        const data = {
          ty: String(item.ty),
          id: item.id_true || item.id,
          navs: navs ? navs : null,
          items: items ? items : null,
          logo: item.logo,
          lang: languageModal.value,
          [`${languageName.value}_name`]: item.name,
          litems: litems,
          game_type: item.game_type ? item.game_type + '' : '0',
          news: [],
          hots: [],
        };
        // 菲站
        if (showQuantity.value) {
          data.navs = litems;
          if (item.id.startsWith('5_')) {
            let copyId = item.id;
            let newId = copyId.replace('5_', '5_1000_');
            const copycategoryItem = sorceCategoryList.find((item) => item.id === newId);
            if (copycategoryItem) {
              data.hots =
                copycategoryItem?.items?.map((item) => {
                  return {
                    id: item.id ? item.id : item.platform_id,
                    platform_id: item.platform_id,
                    logo: item.logo,
                    icon: item.logo,
                    //game_type: String(item.game_type),
                    lang: languageModal.value,
                    name: item.zh_name ? item.zh_name : item.name,
                    is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
                    is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
                  };
                }) || [];
            }
          }
          if (item.id.startsWith('5_')) {
            let copyId = item.id;
            let newId = copyId.replace('5_', '5_2000_');
            const copycategoryItem = sorceCategoryList.find((item) => item.id === newId);
            if (copycategoryItem) {
              data.news =
                copycategoryItem?.items?.map((item) => {
                  return {
                    id: item.id ? item.id : item.platform_id,
                    platform_id: item.platform_id,
                    logo: item.logo,
                    icon: item.logo,
                    //game_type: String(item.game_type),
                    lang: languageModal.value,
                    name: item.zh_name ? item.zh_name : item.name,
                    is_hot: item.is_hot !== 'null' ? String(item.is_hot) : '0',
                    is_new: item.is_new !== 'null' ? String(item.is_new) : '0',
                  };
                }) || [];
            }
          }
          // 更新 navs 的类型
          const updateNavType = (categoryType, typeValue) => {
            data.navs
              .filter((item) => item.cateType == categoryType)
              .forEach((el) => {
                el.ty = typeValue;
              });
          };

          updateNavType('hot', 6);
          updateNavType('new', 7);

          data.litems = [];
        }
        if (item.id != '5') {
          params.cates.push(data);
        }
      }
    });
    params.venue = venueData;

    childGame();
    updateSortBrand();
    //1.愿数组转换如图的格式2.当前的数组替换愿数组
    saveLoading.value = true;
    try {
      const { data, status } = await updateGameCategoryItem([params]);
      if (status) {
        setTimeout(() => {
          saveLoading.value = false;
          message.success(data);
          saveLoadingButton.value = false;
          PAGE_EDIT.value = false;
          disabledTab.value = false;
          getCategoryList(languageModal.value, true);
          disabledLangrage.value = false;
          getVenues();
          checkIsMoved(
            OPERATE_EVENT.MOVE,
            recreationList.value,
            categoryList.value[currentTopIndex.value]?.litems,
            categoryList.value[currentTopIndex.value]?.navs,
            categoryList.value[currentTopIndex.value]?.sidebars,
            categoryList.value[currentTopIndex.value]?.bottoms,
          );
        }, 800);
      } else {
        saveLoadingButton.value = false;
        message.error(data);
      }
    } catch (error) {
      // 在这里处理捕获的异常
      saveLoadingButton.value = false;
      // 在这里执行适当的错误处理逻辑
    }
  }
  async function childGame() {
    //saveLoading.value = true;
    const paramsGame = {
      platform_id: currentPlatformData.value?.id,
      data: [],
      venue_id: getVenueId.value,
    };
    paramsGame.data = gameList.value.map((item) => {
      return { id: item.id };
    });
    paramsGame.platform_id = platformList.value[currentPlatformIndex.value]?.id;
    paramsGame.lang = languageModal.value;
    const { data, status } = await updateGameBacthSorting(paramsGame);
    if (status) {
      saveLoading.value = false;
      handleClickPlatform(currentPlatformIndex.value);
      message.success(data);
    } else {
      message.error(data);
    }
    //1.愿数组转换如图的格式2.当前的数组替换愿数组
    //saveLoading.value = true;
  }
  //全部品牌排序
  async function updateSortBrand() {
    const paramsGame = {
      venue_ids: [],
    };
    getVenuesData.value.forEach((item) => {
      paramsGame.venue_ids.push(item.platform_id as never);
    });
    const { data, status } = await updateVenuesSort(paramsGame);
    if (status) {
      message.success(data);
    }
  }
  //大厅导航删除
  function handleNavDelete(index, element) {
    element.splice(index, 1);
  }
  // 保存体育
  async function saveSport() {
    //disabledLangrage.value = false;
    saveLoading.value = true;
    const params = topNavList.value[currentTopIndex.value].items?.map((item: any) => {
      return { id: item.id };
    });
    const { data, status } = await updateGameCategorySports(params);
    if (status) {
      saveLoading.value = false;
      message.success(data);
      PAGE_EDIT.value = false;
      // getCategorySport();
    } else {
      message.error(data);
    }
  }

  onMounted(() => {
    getPlateFormAll();
  });
</script>
<style lang="less" scoped>
  .button-bg-basic {
    background-color: #1475e1;
    color: rgb(0 0 0 / 85%);
    font-size: 14px;
  }

  ::v-deep(
      .ant-tabs-top > .ant-tabs-nav,
      .ant-tabs-bottom > .ant-tabs-nav,
      .ant-tabs-top > div > .ant-tabs-nav,
      .ant-tabs-bottom > div > .ant-tabs-nav
    ) {
    margin: 0;
  }

  .button-bg-basic[disabled] {
    border-color: #d9d9d9 !important;
    background-color: #d9d9d9 !important;
  }

  .drag-box {
    min-height: 60px;
    max-height: 270px;
    border: 1px solid lighten(@primary-color, 10%);
    border-radius: 6px;
    background-color: #e0e5ef;
  }

  .group-list {
    //padding-bottom: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    width: 100%;
    min-height: 40px;
    // grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
    gap: 20px;
  }

  .move-area {
    padding-bottom: 200px;
  }

  .group-nav {
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    // min-height: 40px;
    // display: grid;
    // grid-template-columns: repeat(auto-fill, minmax(100px, max-content));
    gap: 20px;
  }

  .group-nav1 {
    flex-wrap: nowrap;
    // min-width: calc(100% - 90px);
    // max-width: 1200px;
    min-height: 40px;
    margin: 20px 20px 0;
    padding-bottom: 4px;
    overflow: scroll hidden;
    gap: 20px;
  }

  .group-nav2 {
    // min-height: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, max-content));
    flex-grow: 1;
    width: 20px;
    padding: 20px;
    gap: 20px;
  }

  .group-nav3 {
    // min-height: 40px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, max-content));
    gap: 20px;
    flex-grow: 1;
    padding: 20px;
  }

  .group-nav4 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .group-nav5 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
    padding: 20px;
  }

  .category-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    gap: 10px;
    width: 100%;
    padding: 10px 10px 6px;
  }

  .resize-box {
    // height: 270px;
    max-height: 470px;
    resize: vertical;
  }

  .box-size {
    max-height: 270px;

    .flex {
      height: 227px;
    }
  }

  .gameSortBox > div:not(.game-type-box) > div > div {
    ::v-deep(.group-item) {
      padding-right: 10px !important;
      padding-left: 0 !important;
    }

    ::v-deep(.group-item > div:not(.is-hot)) {
      // width: 130px;
      padding: 0 !important;
    }

    ::v-deep(.forbid) {
      .active {
        color: #444 !important;
      }
    }
  }

  ::v-deep(.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within) {
    box-shadow: none !important;
  }

  .primaryGroup {
    border-radius: 59px;
    background: #fff;

    ::v-deep(.ant-radio-button-wrapper) {
      width: auto;
      margin-right: 10px;
      border: unset !important;
      border-radius: 59px;
      background: #fff;

      span:not(.ant-radio-button) {
        display: inline-block;
        // width: 109px !important;
        font-size: 14px !important;
        text-align: center !important;
        vertical-align: middle;
      }
    }
  }

  ::v-deep(.ant-radio-group) {
    height: 50px;
    padding: 3px;
    border: 1px solid #e1e1e1;
  }

  ::v-deep(.ant-radio-group-large .ant-radio-button-wrapper) {
    height: 42px;
  }

  .gameSortLabel {
    margin-left: 10px;
    color: #444 !important;
    font-size: 18px !important;
    font-weight: 500 !important;
    white-space: nowrap;
  }

  .gameSortLabelExtral {
    display: flex !important;
    margin-left: 10px;
    color: #444 !important;
    font-size: 18px !important;
    font-weight: 500 !important;
    white-space: nowrap;
  }

  .game-type-box > div > div {
    ::v-deep(.group-item) {
      padding: 0 !important;
    }

    ::v-deep(.base-tag) {
      width: 140px !important;
      margin-right: 0 !important;
      //&.active {
      //  background-color: red!important;
      //}
    }

    ::v-deep(.base-tag-text) {
      font-size: 14px !important;
      font-weight: 600 !important;
    }

    ::v-deep(.items-center:first-child > div > div) {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }

    ::v-deep(.items-center:nth-last-child(2) > div > div) {
      border-left: none !important;
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }

  .all-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .game-footer {
    display: flex;
    flex-direction: column;

    > div {
      display: flex;
      // padding-left: 10px;
      align-items: center;
      width: 100%;
      // .brand-list {
      //   margin-left: 20px;
      // }
    }
  }

  .vben-svg-icon {
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }

  .brand-type {
    margin-left: 20px;

    ::v-deep(.group-item) {
      margin-right: 20px;
    }
  }
</style>
<style scoped>
  .add-icon {
    color: rgb(64 158 255 / 100%);
    font-size: 20px;
  }

  .primaryGroup .ant-radio-button-wrapper-checked {
    background-color: #1475e1 !important;
    color: #fff !important;
  }

  .primaryGroup .ant-radio-button-wrapper-checked {
    border: 1px solid #aaa !important;
  }

  primarygroup .ant-radio-button-wrapper-checked:hover {
    color: #fff !important;
  }

  .primaryGroup .ant-radio-button-wrapper-disabled {
    color: #000;
  }

  .primaryGroup .ant-radio-button-wrapper:not(:first-child)::before {
    display: none !important;
  }

  .brand-name {
    display: flex;

    .itemDrage {
      flex-grow: 1;
      width: 20px;
    }
  }

  .lobbylistBG {
    display: flex;
    align-items: center;
    padding: 0;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    background: #e0e5ef;
  }

  .rightlistBG {
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    background: #e0e5ef;
    color: rgb(0 0 0 / 85%);
    text-align: center;

    .group-item {
      padding: 0;
    }
  }

  .unborder {
    border: unset !important;
  }

  .bg_lobbylist {
    background: #e0e5ef !important;
  }

  .opacity0 {
    opacity: 0;
  }

  @keyframes rotate {
    from {
      transform: rotate(180deg);
    }

    to {
      transform: rotate(180deg);
    }
  }

  .unforbid .base-tag {
    background-color: #1475e1 !important;
  }
</style>
