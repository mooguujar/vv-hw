<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="$t('common.site_list_1')"
    drawerType="site-change-drawer"
  >
    <div class="flex">
      <div class="pl-10px h-606px left-item-box">
        <div class="w-160px">
          <div class="w-160px h-42px item-bg pl-18px pt-6px collect_favorite">
            <img :src="star" class="w-20px mr-16px" />
            <span>{{ $t('common.site_sc') }}</span>
          </div>
          <div class="h-532px mt-16px item-bg">
            <div
              class="w-160px h-40px mt-20px left-item cursor pl-18px pt-6px"
              v-for="sites in saveSites"
              :key="sites.id"
            >
              <img :src="saveStar" class="w-20px mr-16px star-img" />
              <span style="line-height: 30px">{{ sites.n }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="w-751px ml-10px item-bg pl-18px">
        <div class="w-700px mt-30px mb-10px">
          <a-input-search
            :enter-button="$t('common.site_sx')"
            :size="'large'"
            class="site-search"
            :placeholder="$t('common.site_sx_p')"
            v-model:value="searchSites"
            @search="onSearch"
          />
        </div>
        <div class="mt-20px" v-if="showAllSites">
          <div class="mb-5px" sstyle="position: relative;float:left">
            <img :src="siteChangeIcon" class="site-change-title-icon !w-18px !mr-10px" />
            <span class="text-white site-change-title">{{ $t('common.site_cy') }}</span>
            <span>（{{ $t('common.site_1') }}{{ showList.length }}）</span>
          </div>
          <div class="!w-700px site-card-box">
            <div class="cursor site-card flex p-10px" v-for="item in showList" :key="item.id">
              <div
                class="w-120px"
                :class="saveSites.indexOf(item) > -1 ? 'collectSite' : ''"
                @click="chooseSite(item)"
              >
                <div>{{ $t('common.site_name') }}: {{ item.n }}</div>
                <div>{{ $t('common.site_code') }}: {{ item.c }}</div>
              </div>
              <div class="w-16px site-card-star">
                <!--抄云博的，云博没有，这里就没有功能-->
                <!--<img :src="star" class="w-16px" />-->
              </div>
            </div>
          </div>
        </div>
        <div style="position: relative; float: left">
          <div class="mb-5px">
            <img :src="siteChangeIcon" class="site-change-title-icon !w-18px !mr-10px" />
            <span class="text-white site-change-title">{{ allows }}</span>
            <span>（{{ $t('common.site_1') }}{{ showList.length }}）</span>
          </div>
          <div class="!w-700px site-card-box">
            <div
              class="cursor site-card flex p-10px"
              v-for="item in showList"
              :key="item.id"
              :class="{ current: current == item.i }"
            >
              <div class="w-120px" @click="chooseSite(item)">
                <div>{{ $t('common.site_name') }}: {{ item.n }}</div>
                <div>{{ $t('common.site_code') }}: {{ item.c }}</div>
              </div>
              <div class="w-16px site-card-star" @click="handelSaveSite(item)">
                <img v-if="saveSites.indexOf(item) > -1" :src="saveStar" class="w-16px" />
                <img v-else :src="star" class="w-16px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--    <a-row style="border:1px solid red">-->
    <!--      <a-col v-for="item in list" :key="item.id" :span="3">-->
    <!--        <div-->
    <!--          class="custom-block px-6 py-3 bg-gray-100 cursor text-center"-->
    <!--          :class="{ current: current == item.i }"-->
    <!--          @click="chooseSite(item)"-->
    <!--        >-->
    <!--          {{ item.n }}-->
    <!--        </div>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
  </BasicDrawer>
</template>
<script lang="ts">
  import { computed, defineComponent, ref, reactive } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { Row, Col } from 'ant-design-vue';
  import { getSiteList, getCurrentSite } from '/@/utils/auth';
  import { useUserStore } from '/@/store/modules/user';
  import siteChangeIcon from '/@/assets/images/siteChangeIcon/siteChangeIcon.webp';
  import star from '/@/assets/images/star/star.webp';
  import saveStar from '/@/assets/images/star/save-star.webp';
  import { useCollectSitesStoreWithOut } from '/@/store/modules/collectSites';

  export default defineComponent({
    components: {
      BasicDrawer,
      [Row.name]: Row,
      [Col.name]: Col,
    },
    setup: function () {
      const [registerDrawer, { closeDrawer }] = useDrawerInner();

      const userStore = useUserStore();
      const token = userStore.getToken;
      const info = userStore.getUserInfo;

      let list = ref<any>();

      list.value = getSiteList();

      const current = computed(() => {
        return userStore.getCurrentSite['id'] || 1;
      });

      const allows = computed(() => {
        return userStore.getCurrentSite['allows'] || 'SG';
      });

      const chooseSite = (item) => {
        if (current.value == item.i) return;
        let domain = window.origin;
        let containsUat = domain.includes('uat');
        const url = `${containsUat ? item.uat : item.prod}#/login?token=${token}&prefix=${
          item.c
        }&name=${info?.name}`;
        localStorage.removeItem('hasLoaded');
        localStorage.removeItem('hasIimeLoaded');
        window.location.href = url;
        closeDrawer();
      };

      const saveSiteStore = useCollectSitesStoreWithOut();
      const saveSites = computed(() => {
        return saveSiteStore.getCollectSites;
      });

      const handelSaveSite = (item) => {
        saveSiteStore.updateCollectSitesList(item);
      };

      let showList = reactive([]);

      showList.push(...list.value);
      const searchSites = ref('');
      const showAllSites = ref(true);
      const onSearch = () => {
        if (searchSites.value.length === 0) {
          showList.length = 0;
          showList.push(...list.value);
          showAllSites.value = true;
        } else {
          showList.length = 0;
          showList.push(...list.value.filter((c) => c.n.indexOf(searchSites.value) > -1));
          showAllSites.value = false;
        }
      };
      document.onkeydown = (event) => {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode === 13) {
          onSearch();
        }
      };

      return {
        registerDrawer,
        current,
        showList,
        chooseSite,
        siteChangeIcon,
        star,
        saveStar,
        handelSaveSite,
        saveSites,
        onSearch,
        searchSites,
        showAllSites,
        allows,
      };
    },
  });
</script>

<style lang="less" scoped>
  // .app-site-drawer {
  //     .ant-drawer-content-wrapper {
  //         width: 60% !important;
  //     }
  // }

  .custom-block {
    border-left: 5px solid @primary-color;

    // border: 1px dashed @primary-color;
    &:hover {
      background-color: rgb(218 218 218 / 60%);
    }
  }

  .current {
    background-color: @primary-color;
    color: #fff;

    &:hover {
      background-color: @primary-color;
      color: #fff;
    }
  }

  .item-bg {
    background-color: #1a2c38;
  }

  .left-item:hover {
    background-color: #2f4553;
  }

  .left-item-box {
    color: #fff !important;
    font-family: 'PingFang SC';
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
  }

  .site-search {
    ::v-deep(.ant-input) {
      width: 610px !important;
      height: 40px !important;
      padding-left: 45px;
      border: 2px solid #557086 !important;
      border-radius: 30px;
      background-color: transparent;
      color: #fff;
    }

    ::v-deep(.ant-input::placeholder) {
      color: #557086 !important;
      font: 'PingFang SC';
      font-size: 16px;
      font-weight: 600;
    }

    ::v-deep(.ant-input-group-addon) {
      //border:1px solid red!important;
      left: 0 !important;
      background-color: transparent;
    }

    ::v-deep(.ant-input-group-addon > .ant-input-search-button) {
      border-radius: 4px !important;
    }
  }

  ::v-deep(.site-search::before) {
    content: '';
    display: inline-block;
    position: absolute;
    width: 22px;
    height: 20px;
    margin-top: 10px;
    margin-left: 15px;
    background-image: url('/@/assets/images/search.svg');
    background-size: 100%;
    color: #557086;
  }

  .site-change-title-icon {
    margin-top: -5px;
  }

  .site-change-title {
    font-size: 18px !important;
  }

  .site-change-title + span {
    color: #b1bad3 !important;
    font-size: 18px !important;
  }

  .site-card-box {
    position: relative;
    float: left;
  }

  .site-card {
    justify-content: space-between;
    width: 160px;
    height: 64px;
    margin-right: 20px;
    margin-bottom: 20px;
    float: left;
    border-radius: 4px;
    background-color: #2f4553;

    div:nth-child(1) {
      font-size: 13px;
      font-weight: 500;

      div:nth-child(1) {
        color: white;
      }

      div:nth-child(2) {
        color: #b1bad3;
      }
    }
  }

  .site-card:nth-child(4n) {
    margin-right: 0;
  }

  .site-card-star img {
    //margin-top: calc(50% - 10px);
    margin-top: 12px;
  }

  .current {
    background-color: #1475e1 !important;
  }

  .collectSite {
    div {
      color: #1cd91c !important;
    }
  }

  .collect_favorite {
    img {
      margin-top: -5px;
    }

    span {
      line-height: 30px;
    }
  }

  .star-img {
    margin-top: -5px;
  }
</style>
