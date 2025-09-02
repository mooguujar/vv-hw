<template>
  <div class="app-setting-box">
    <div class="app-setting-box-item">
      <!-- <LogoDragger
        :logoData="detailInfo.app_logo_white"
        :id="props.id"
        :logoPic="LogoPic"
        @mouseenter="listenAppBg('Logo')"
        @mouseleave="removeListenAppBg"
        @logo-pic-change="handelLogoPic"
      />
      <LogoDraggerAfter
        :logoData="detailInfo.app_logo_white_after_login"
        :id="props.id"
        :logoPic="LogoPic"
        @mouseenter="listenAppBg('Logo')"
        @mouseleave="removeListenAppBg"
        @logo-pic-change="handelLogoPic"
      /> -->
      <!-- <LogoDraggerAbbreviation
        :logoData="detailInfo.app_first_letter"
        :id="props.id"
        :logoPic="LogoPic"
        @mouseenter="listenAppBg('Logo')"
        @mouseleave="removeListenAppBg"
        @logo-pic-change="handelLogoPic"
      /> -->
      <!-- <DeskTopDragger
        :deskTopData="detailInfo.app_desktop"
        :id="props.id"
        :logoPic="DesktopPic"
        @mouseenter="listenAppBg('DeskTop')"
        @mouseleave="removeListenAppBg"
        @desktop-pic-change="handelDeskTop"
      /> -->

      <PwaTopDragger
        :deskTopData="detailInfo.pwa_desktop"
        :id="props.id"
        :logoPic="DesktopPic"
        @mouseenter="listenAppBg('DeskTop')"
        @mouseleave="removeListenAppBg"
        @desktop-pic-change="handelDeskTop"
      />

      <!-- <RestoreDragger
        :restoreData="detailInfo.app_restore"
        :id="props.id"
        :logoPic="RestorePic"
        @mouseenter="listenAppBg('FixedIcon')"
        @mouseleave="removeListenAppBg"
        @restore-pic-change="handelRestore"
      /> -->
      <!--H5/APP加载loding 产品已确认没有这个功能-->
      <!--      <LoadingDragger-->
      <!--        :loadingData="detailInfo.logo_gray"-->
      <!--        :id="props.id"-->
      <!--        :logoPic="LoadingPic"-->
      <!--        @mouseenter="listenAppBg('Loading')"-->
      <!--        @mouseleave="removeListenAppBg"-->
      <!--        @loadingPicChange="handelLoading"-->
      <!--      />-->
      <!-- <OpenDragger
        :openData="detailInfo.app_open"
        :id="props.id"
        :logoPic="OpenPic"
        @mouseenter="listenAppBg('Open')"
        @mouseleave="removeListenAppBg"
        @open-pic-change="handelOpen"
      /> -->
      <!-- <LeadDragger
        :leadData="detailInfo.app_lead"
        :id="props.id"
        :logoPic="DownLoadPic"
        :topLogoPic="LogoPic"
        @mouseenter="listenAppBg('DownLoad')"
        @mouseleave="removeListenAppBg"
        @download-pic-change="handelDownLoad"
      /> -->
    </div>
  </div>
</template>
<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import LogoDragger from '../components/appSetting/LogoDragger.vue';
  import LogoDraggerAfter from '../components/appSetting/LogoDraggerAfter.vue';
  import DeskTopDragger from '../components/appSetting/DeskTopDragger.vue';
  import PwaTopDragger from '../components/appSetting/PwaTopDragger.vue';
  import RestoreDragger from '../components/appSetting/RestoreDragger.vue';
  import OpenDragger from '../components/appSetting/OpenDragger.vue';
  import LeadDragger from '../components/appSetting/LeadDragger.vue';
  import LogoDraggerAbbreviation from '../components/appSetting/LogoDraggerAbbreviation.vue';
  import { getSiteBrandDetail } from '/@/api/sys';

  const props = defineProps({
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: '1',
    },
  });
  const detailInfo = ref({});
  const listenAppBgName = ref('');

  const listenAppBg = (name) => {
    listenAppBgName.value = name;
    setFooterBg();
  };

  const removeListenAppBg = () => {
    listenAppBgName.value = '';
    setFooterBg();
  };

  const setFooterBg = () => {
    let bg = document.getElementsByClassName('cell-display');
    if (!listenAppBgName.value) {
      for (var j = 0; j < bg.length; j++) {
        if (bg[j].classList.value.indexOf('active-bg') > 0) {
          bg[j].classList.remove('active-bg');
        }
      }
      if (bg.length > 0) bg[0].classList.add('active-bg');
    } else {
      for (var j = 0; j < bg.length; j++) {
        if (bg[j].classList.value.indexOf(listenAppBgName.value) > 0) {
          bg[j].classList.add('active-bg');
        } else {
          if (bg[j].classList.value.indexOf('active-bg') > 0) {
            bg[j].classList.remove('active-bg');
          }
        }
      }
    }
  };
  const LogoPic = ref('');
  const DesktopPic = ref('');
  const RestorePic = ref('');
  const LoadingPic = ref('');
  const OpenPic = ref('');
  const DownLoadPic = ref('');

  const handelLogoPic = (pic) => {
    LogoPic.value = pic;
  };
  const handelDeskTop = (pic) => {
    DesktopPic.value = pic;
  };
  const handelRestore = (pic) => {
    RestorePic.value = pic;
  };
  const handelLoading = (pic) => {
    LoadingPic.value = pic;
  };
  const handelOpen = (pic) => {
    OpenPic.value = pic;
  };

  const handelDownLoad = (pic) => {
    DownLoadPic.value = pic;
  };
  // onMounted(() => {
  //   listenAppBg('Logo');
  // });
  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    detailInfo.value = data;
  };
  onMounted(() => {
    GetSiteBrandDetail({ tag: 'app' });
    // listenAppBg('Logo');
  });
</script>

<style lang="less" scoped>
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }

  .app-setting-box {
    display: flex;
    justify-content: space-between;

    .app-setting-box-item {
      width: 100%;
      //background-color: #fff;
    }
  }

  .cell-bg {
    position: fixed;
    bottom: -10px;
    width: 288px;
    height: 571px;
    background-image: url('@/assets/images/u779.webp');
    background-size: 100%;
  }

  .loading-bg {
    position: fixed;
    z-index: 350;
    width: 259px;
    height: 560px;
    margin-top: 5px;
    margin-left: 14px;
    border: none;
    border-width: 0;
    border-radius: 35px;
    background: inherit;
    background-color: rgb(23 35 44 / 100%);
    box-shadow: none;
  }

  .open-bg {
    position: fixed;
    z-index: 360;
    width: 270px;
    height: 623px;
    margin-top: 2px;
    margin-left: 8px;
    border-radius: 20px;
    background: url('@/assets/images/u819.svg') no-repeat;
    background-size: contain;
  }

  .download-bg {
    position: fixed;
    z-index: 350;
    width: 259px;
    height: 535px;
    margin-top: 65px;
    margin-left: 14px;
    background: url('@/assets/images/u771.webp') no-repeat;
    background-size: contain;
  }

  .download-Notice {
    position: fixed;
    z-index: 366;
    width: 259px;
    height: 30px;
    margin-top: 35px;
    margin-left: 14px;
    background-image: url('@/assets/images/u808.webp');
    background-size: cover;
  }

  .cell-logo-box {
    position: fixed;
    z-index: 351;
    bottom: 483px;
    width: 46px;
    height: 38px;
    margin-left: 16px;
    overflow: hidden;
    border: 1px solid #caf982;
    background: inherit;
    background-color: #1a262f;
  }

  .cell-desktop-box {
    position: fixed;
    z-index: 360;
    width: 40px;
    height: 40px;
    margin-top: 251px;
    margin-left: 213px;
    overflow: hidden;
    border-radius: 10px;
    background-color: #fff;
  }

  .cell-desktop-title {
    position: fixed;
    z-index: 360;
    width: 40px;
    height: 15px;
    margin-top: 291px;
    margin-left: 213px;
    color: #fff;
    font-size: 10px;
    line-height: 15px;
    text-align: center;
  }

  .cell-loading-box {
    position: fixed;
    z-index: 360;
    width: 120px;
    height: 120px;
    margin-top: 220px;
    margin-left: 84px;
    overflow: hidden;
  }

  .cell-open-box {
    position: fixed;
    z-index: 361;
    width: 270px;
    height: 623px;
    margin-top: 2px;
    margin-left: 8px;
    overflow: hidden;
    border-radius: 45px;
  }

  .cell-download-box {
    position: fixed;
    z-index: 380;
    width: 22px;
    height: 22px;
    margin-top: 39px;
    margin-left: 48px;
    overflow: hidden;
    border-radius: 5px;
  }

  .logo-bg {
    position: fixed;
    z-index: 350;
    width: 259px;
    height: 535px;
    margin-top: 33px;
    margin-left: 14px;
    background: url('@/assets/images/u771.webp') no-repeat;
    background-size: contain;
  }

  .cell-display {
    display: none;
  }

  .active-bg {
    display: block !important;
  }
</style>
