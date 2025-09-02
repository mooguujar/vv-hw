<template>
  <div class="main" ref="main">
    <BasicModal
      @register="registeraddDemond"
      :title="t('table.system.system_banner_browsing')"
      :width="765"
      :showCancelBtn="false"
      :showOkBtn="false"
      :getContainer="() => $refs.main"
      @cancel="handleCancel"
      @after-close="close"
    >
      <div class="languageBox">
        <div class="languageContainer">
          <div
            v-for="(lan, idx) in langtitle"
            :key="lan.name"
            :class="['bannerLanguage', isActie == lan.value ? 'bannerLanguageChecked' : '']"
            @click.stop="handelLanguage(idx)"
          >
            {{ lan.name }}
          </div>
        </div>
      </div>
      <div class="carouselBox" draggable="false">
        <Carousel arrows autoplay ref="bannerCarousel" :afterChange="pageChanged">
          <template #preArrow>
            <div>left</div>
          </template>
          <template #nextArrow>
            <div>right</div>
          </template>
          <div v-for="(item, index) in carouselArray" :key="index">
            <div class="carouselDiv">
              <Image
                v-if="item.type == 'img'"
                maskClassName="mask-img"
                :src="getDataTypePreviewUrl(item.img)"
              />
              <AnnouncementPopupImgBnaner
                v-if="item.type !== 'img'"
                id="announcement"
                :bgImage="changeBannerData(item.img, 'background')"
                :imageUrl="changeBannerData(item.img, 'icon')"
                :popStyle="item.img.banner_style"
                :htmlText="handelText(item.img, 'content')"
                :btnText="handelText(item.img, 'button_content')"
                :SuperscriptText="handelText(item.img, 'superscript')"
                :titleText="handelText(item.img, 'title')"
                :btnShow="item.img.btnshow == 1 ? true : false"
                :isTextShow="false"
                :titleBg="'bg-white'"
                :outBoxStyle="{ width: '585px', 'min-height': '336px' }"
                :bgImageStyle="{ 'min-width': '216px', 'min-height': '150px' }"
                :isTextBig="true"
              />
            </div>
          </div>
        </Carousel>
      </div>
    </BasicModal>
  </div>
</template>
<script setup lang="ts" name="setBannerLanguage">
  import { reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { Carousel, Image, Tabs, TabPane } from 'ant-design-vue';
  import AnnouncementPopupImgBnaner from '/@/views/system/informationCenter/common/components/AnnouncementPopupImgBnaner.vue';
  import imagesMap from '/@/assets/images/images';
  import eventBus from '/@/utils/eventBus';
  import Button from '@/views/member/addSubtractMoney/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  let carouselArray = ref<any>([]);
  const emit = defineEmits(['cancel', 'register']);
  const isActie = ref<any>();
  let carousel = ref<any>();
  const bannerCarousel = ref<any>();

  const { t } = useI18n();

  let language: any = reactive([
    { name: t('common.common_zh_CN'), checked: true, value: 'zh_CN', list: [] },
    { name: t('common.common_vi_VN'), checked: false, value: 'vi_VN', list: [] },
    { name: t('common.common_en_US'), checked: false, value: 'en_US', list: [] },
    { name: t('common.common_th_TH'), checked: false, value: 'th_TH', list: [] },
    { name: t('common.common_pt_BR'), checked: false, value: 'pt_BR', list: [] },
    { name: t('common.common_hi_IN'), checked: false, value: 'hi_IN', list: [] },
    { name: t('common.common_tl_PH'), checked: false, value: 'tl_PH', list: [] },
    { name: t('common.common_ko_KR'), checked: false, value: 'ko_KR', list: [] },
  ]);

  const [registeraddDemond, { setModalProps }] = useModalInner(async (data) => {
    // 处理轮播图数据
    const selectedId = data.bannerId;
    const carouselList = data.bannerList.filter((el) => el.id === selectedId);
    language.forEach((el) => {
      el.list = [];
    });
    carouselList.forEach((el) => {
      if (!el.banner_url) el['banner_url'] = {};
      if (!el.banner_info) el['banner_info'] = {};
      const isBannerStyle3 = el.banner_style === 3;
      const item = isBannerStyle3 ? el.banner_url : el.banner_info;
      let modeUrl = '';
      if (el.banner_info.pic_mode_setting.mode == 2) {
        modeUrl = el.banner_info.pic_mode_setting.config.all.url;
      }
      language.forEach((languageItem) => {
        const value = languageItem.value;
        const data = isBannerStyle3 ? item[value] : el.banner_info;
        if (item) {
          const payload = {
            type: isBannerStyle3 ? 'img' : 'content',
            img: isBannerStyle3
              ? modeUrl
                ? modeUrl
                : data
              : {
                  ...data,
                  banner_style: el.banner_style,
                  id: el.id,
                  btnshow: el.button_state_map?.[languageItem.value] ?? 2,
                },
          };
          languageItem.list.push(payload);
        }
      });
    });
    language = language.filter((el) => el.list.length > 0);
    isActie.value = language.length > 0 ? language[0].value : '';
    getCarousel();
    setModalProps({ confirmLoading: false });
  });

  const handelLanguage = (idx) => {
    bannerCarousel.value.goTo(idx);
    language[idx] && (isActie.value = language[idx].value);
  };
  const handelText = (data: any, type: string) => {
    if (!data[type]) return null;
    return data[type][isActie.value];
  };

  const currentSlide = ref();

  const langtitle = ref([]);

  const getCarousel = () => {
    carouselArray.value.length = 0;
    langtitle.value = [];
    language.map((el) => {
      if (el.list[0].type === 'img') {
        if (el.list[0].img) {
          carouselArray.value.push(el.list[0]);
          langtitle.value.push(el);
        }
      } else {
        carouselArray.value.push(el.list[0]);
        langtitle.value.push(el);
      }
      // carouselArray.value.push(el.list[0]);
    });
  };
  const changeBannerData = (data: any, type: string) => {
    if (type == 'icon') {
      return imagesMap[data['icon'].replace('.webp', '')];
    }
    if (type == 'background') {
      return imagesMap[data['background'].replace('.webp', '')];
    }
  };

  function handleCancel() {
    eventBus.emit('RefreshDraggable', false);
  }

  function pageChanged(activeIdx: any) {
    getCarousel();
    // let slickDots = document.getElementsByClassName('slick-dots')[0].children;
    // let activeIdx;
    // slickDots.forEach((el, idex) => {
    //   if (el.classList[0] === 'slick-active') {
    //     activeIdx = idex;
    //   }
    // });
    handelLanguage(activeIdx);
  }
</script>
<style lang="less" scoped>
  .main {
    ::v-deep(.ant-modal-header) {
      border-bottom: 0;
      background: #0f212e !important;
    }
  }

  .languageBox {
    display: flex;
    top: 20px;
    justify-content: center;
    width: auto;
    border-radius: 50px;
  }

  .languageContainer {
    width: 685px;
    height: 56px;
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 4px;
    border-radius: 65px;
    background-color: #1a2c38;
  }

  .bannerLanguage {
    display: inline-block;
    z-index: 88;
    min-width: 88px;
    height: 42px;
    margin-top: 3px;
    margin-left: 2px;
    padding-right: 18px;
    padding-left: 18px;
    border: none;
    border-radius: 50px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    line-height: 42px;
    text-align: center;
    cursor: pointer;
  }

  .bannerLanguageChecked {
    background: #486171;
    color: #fff;
  }

  .carouselBox {
    position: relative;
    width: 100%;
    height: auto;
    float: left;

    /deep/.btnText-left > .bg-white,
    /deep/.btnText-right > .bg-white {
      position: absolute;
      top: 20px;
      padding: 5px !important;
      border-radius: 6px !important;
      color: #213743 !important;
      font-size: 17.77px !important;
    }

    /deep/.btnText-left > .bg-white {
      left: 20px;
    }

    /deep/.btnText-right > .bg-white {
      left: 250px;
    }

    /deep/.btnText-left + div {
      position: relative;
      width: 100%;
      margin-top: 15px;

      p {
        margin-bottom: 0;
        font-size: 20.73px;
        font-weight: 400;
        line-height: 29px;
        text-align: left;
      }
    }

    /deep/.btnText-right + div {
      position: relative;
      width: 100%;
      margin-top: 15px;
      margin-left: 10px;

      p {
        margin-bottom: 0;
        font-size: 20.73px;
        font-weight: 400;
        line-height: 29px;
        text-align: left;
      }
    }

    /deep/.btnText-left:last-child,
    /deep/.btnText-right:last-child {
      position: absolute;
      bottom: 20px;

      button {
        min-width: 180px !important;
        padding: 30px 45px;
        border-radius: 6px !important;
        font-size: 20px;
        font-weight: 500;
        line-height: 0px;
      }
    }

    /deep/.btnText-right:last-child {
      margin-left: 10px;
    }
  }

  .carouselDiv {
    position: relative;
    width: auto;
    margin-right: calc(50% - 292.5px);
    margin-left: calc(50% - 292.5px);
    float: left;
  }

  ::v-deep(.ant-modal-body) {
    .scrollbar {
      padding: 0 !important;
    }
  }

  /* For demo */
  :deep(.slick-slide) {
    height: 388px;
    //line-height: 160px;
    overflow: hidden;
    text-align: center;
  }

  ::v-deep(.ant-carousel .slick-prev) {
    z-index: 999 !important;
    left: 15px !important;
    width: 13px !important;
    height: 20px !important;
    background-image: url('/@/assets/images/carousel/left.webp');
    background-size: 100%;
  }

  ::v-deep(.ant-carousel .slick-next) {
    z-index: 999 !important;
    right: 15px !important;
    width: 13px !important;
    height: 20px !important;
    background-image: url('/@/assets/images/carousel/right.webp');
    background-size: 100%;
  }

  :deep(.slick-arrow.custom-slick-arrow:hover) {
    opacity: 0.5;
    color: #fff;
  }

  ::v-deep(.ant-carousel .slick-dots) {
    li button {
      width: 12px;
      height: 12px;
      border-radius: 15px;
      background-color: #b1bad3;
    }

    .slick-active button {
      width: 12px;
      height: 12px;
      border-radius: 15px;
      background-color: #486171;
    }
  }

  ::v-deep(.ant-modal-title) {
    padding-left: 35px;
  }

  ::v-deep(.ant-modal-title::before) {
    content: ' ';
    display: inline-block;
    position: absolute;
    left: 40px;
    width: 15.5px;
    height: 20px;
    background-image: url('/@/assets/images/bannerbg/bannerCardListModel.webp');
    background-size: 100%;
  }
</style>
