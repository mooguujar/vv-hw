<template>
  <Card class="bannerCard">
    <Card class="innerBannerCard" :bordered="false" @click="toCarouselPage">
      <template #cover>
        <img v-if="bannerData.banner_style == 3" alt="example" :src="innerBannerCardSrc" />
        <AnnouncementPopupImgBnaner
          v-else
          id="announcement"
          :bgImage="changeBannerData(bannerData, 'background')"
          :imageUrl="changeBannerData(bannerData, 'icon')"
          :popStyle="bannerData.banner_style"
          :htmlText="handelText(bannerData.banner_info, 'content')"
          :btnText="handelText(bannerData.banner_info, 'button_content')"
          :SuperscriptText="handelText(bannerData.banner_info, 'superscript')"
          :titleText="handelText(bannerData.banner_info, 'title')"
          :btnShow="bannerData.banner_info.button_state == 1 ? true : false"
          :outBoxStyle="{ width: '390px', 'min-height': '224px' }"
          :bgImageStyle="{ 'min-width': '136px', 'min-height': '128px' }"
          :isTextShow="false"
        />
      </template>
    </Card>
    <div class="bannerCardFooter">
      <div class="flex justify-center align-center">
        <div>
          <Switch
            v-model:checked="bannerSwitchChecked"
            @change="handelBannerSwitch"
            :disabled="bannerData.is_ash == 1"
            class="bigger-switch"
          />
        </div>
        <div class="l-30">
          {{ getBannerType(bannerData.banner_type) }}
        </div>
      </div>
      <div>
        <span v-if="bannerData.is_ash == 1 && isHasAuth('708123')" style="color: #999">{{
          $t('common.editorText')
        }}</span>
        <Button type="link" size="small" v-if="isHasAuth('708123')" @click.prevent="toEdit">{{
          $t('common.editorText')
        }}</Button>
        <Button type="link" danger size="small" v-if="isHasAuth('708125')" @click="toDelete">{{
          $t('common.delText')
        }}</Button>
      </div>
    </div>
  </Card>
  <SetBannerLanguage @register="registerCardForm" />
</template>
<script lang="ts" setup>
  import { Card, Switch, Button } from 'ant-design-vue';
  import { ref, onMounted } from 'vue';
  import { useModal } from '@/components/Modal';
  import SetBannerLanguage from './setBannerLanguage.vue';
  import { deleteBannerV2, updateBannerV2state } from '/@/api/sys/banner';
  import { openConfirm } from '/@/utils/confirm';
  import { router } from '/@/router';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import AnnouncementPopupImgBnaner from '/@/views/system/informationCenter/common/components/AnnouncementPopupImgBnaner.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import imagesMap from '/@/assets/images/images';
  import eventBus from '/@/utils/eventBus';
  import { isHasAuth } from '/@/utils/authFunction';

  const { t } = useI18n();

  const [registerCardForm, { openModal: CardForm }] = useModal();

  const toCarouselPage = () => {
    // const carouselList = props.bannerList.filter(
    //   (el) => el.state === 1 && el.id === props.bannerData.id,
    // );
    // if (!carouselList.length) {
    //   message.error(t('common.banner_msg'));
    //   return false;
    // }
    CardForm(true, {
      bannerId: props.bannerData.id,
      bannerList: props.bannerList,
    });
    eventBus.emit('RefreshDraggable', true);
  };

  // eslint-disable-next-line no-redeclare
  const props = defineProps({
    bannerData: {
      type: Object,
      default: null,
    },
    bannerList: {
      type: Array,
      default: null,
    },
    bannerType: { type: Number, default: () => 1 },
    bannerClient: { type: Number, default: () => 1 },
  });

  const innerBannerCardSrc = ref('');

  onMounted(() => {
    if (props.bannerData.banner_style == 3) {
      if (props.bannerData.banner_info.pic_mode_setting.mode == 2) {
        const bannerUrl = props.bannerData['banner_info'].pic_mode_setting.config.all.url;
        if (bannerUrl) {
          innerBannerCardSrc.value = getDataTypePreviewUrl(bannerUrl);
        }
      } else {
        const CardSrc = getFirstNonEmptyPropertyValue(props.bannerData['banner_url']);
        if (CardSrc) {
          const previewUrl = getDataTypePreviewUrl(CardSrc);
          innerBannerCardSrc.value = previewUrl;
        }
      }
    }
  });

  let bannerSwitchChecked = ref(props.bannerData['state'] === 1 || props.bannerData['state']); //接口传回数字1与true两种，待确认要用哪一种
  const emit = defineEmits(['toEditBanner', 'click:success']);

  //修改状态
  const handelBannerSwitch = (switchOpen) => {
    const id = props.bannerData['id'];
    let state = 1;
    if (!switchOpen) state = 2;
    const data = {
      id,
      state,
      banner_type: Number(props.bannerType),
      client_type: Number(props.bannerClient),
    };
    updateBannerV2state(data).then(() => {
      emit('click:success', true);
    });
  };

  const toEdit = () => {
    router.push({
      name: 'EditorCarouseForm',
      query: { id: props.bannerData.id, bannerType: props.bannerType },
    });
  };

  const changeBannerData = (data: any, type: string) => {
    if (type == 'icon') {
      return imagesMap[data['banner_info']['icon'].replace('.webp', '')];
    }
    if (type == 'background') {
      return imagesMap[data['banner_info']['background'].replace('.webp', '')];
    }
  };

  function getFirstNonEmptyPropertyValue(obj) {
    if (!obj) return null;

    if (obj['zh_CN']) {
      return obj['zh_CN'];
    }

    for (const key in obj) {
      if (key !== 'default_lang' && obj.hasOwnProperty(key) && obj[key] !== '') {
        return obj[key];
      }
    }

    return null;
  }
  const handelText = (data: any, type: string) => {
    return getFirstNonEmptyPropertyValue(data[type]);
  };

  //删除
  const toDelete = () => {
    //操作确认, 是否进行删除操作？删除后无法恢复
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.system.system_option_delete_tip'),
      () => {
        const data = {
          id: props.bannerData['id'],
          banner_type: props.bannerType,
        };
        deleteBannerV2(data).then((res) => {
          if (res === '操作成功') {
            emit('click:success', true);
          }
        });
      },
    );
  };

  function getBannerType(bannerType) {
    const types = bannerType.join(',');
    switch (types) {
      case '1':
        return t('table.discountActivity.discount_entertainment_city');
      case '2':
        return t('table.discountActivity.discount_physical_education');
      case '1,2':
        return t('table.system.system_yl_ty');
      default:
        return '';
    }
  }
</script>

<style lang="less" scoped>
  .bannerCard {
    width: 418px;
    height: 312px;
    margin-right: 20px;
    margin-bottom: 20px;
    float: left;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
  }

  .innerBannerCard {
    position: absolute;
    top: 20px;
    left: 12px;
    width: 390px;
    height: 224px;
    overflow: hidden;
    //background: linear-gradient(
    //  -59.5657642465566deg,
    //  rgba(254, 163, 250, 1) 0%,
    //  rgba(178, 160, 255, 1) 100%
    //);
    cursor: pointer;
  }
  ::v-deep(.ant-card-cover) {
    height: 100%;
    img {
      height: 100%;
    }
  }
  .innerBannerCard:hover::after {
    content: ' ';
    display: flex;
    position: absolute;
    z-index: 6;
    top: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    width: 390px;
    height: 224px;
    border-radius: 8px;
    background-color: rgb(0 0 0 / 30%);
    background-image: url('/@/assets/svg/eye-yes.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 30px;
    color: #fff;
    cursor: pointer;
  }

  .innerBannerCardSrcStyle {
    width: 100%;
    height: 100%;
  }

  .style_type2 {
    float: left;
  }

  .innerBannerCardDiv {
    display: -webkit-box;
    position: absolute;
    width: 140px;
    margin-top: 30px;
    margin-left: 20px;
    overflow: hidden;
    color: #fff;
    font-weight: 400;
    text-align: left;
    text-overflow: ellipsis;
    word-wrap: break-word;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;

    button {
      width: 120px;
      height: 40px;
      overflow: hidden;
      border: 1px solid #fff;
      border-radius: 5px;
      background-color: transparent;
      line-height: 40px;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .div_type2 {
    right: 0;
  }

  .innerBannerCardTitle {
    font-size: 14px;
    font-style: normal;
    font-weight: 650;
  }

  .innerBannerCardContent {
    height: 60px;
    margin-top: 60px;
  }

  .innerBannerCardBottonBox {
    height: 40px;
    margin-top: 128px;
  }

  .bannerCardFooter {
    display: flex;
    position: absolute;
    bottom: 17px;
    left: 10px;
    align-items: center;
    justify-content: space-between;
    width: 390px;
    height: 30px;
    //background-color: red;
  }

  ::v-deep(.ant-switch) {
    min-width: 64px !important;
    height: 30px !important;
  }

  ::v-deep(.ant-switch-handle)::before {
    border-radius: 25px !important;
  }

  ::v-deep(.ant-switch-handle) {
    top: 2px !important;
    width: 25px !important;
    height: 25px !important;
  }

  ::v-deep(.ant-switch-checked .ant-switch-handle) {
    left: calc(100% - 25px - 2px);
  }

  ::v-deep(.ant-btn-link) {
    color: #1475e1;
  }

  ::v-deep(.ant-btn-dangerous) {
    color: #e91134;
  }

  /deep/ p {
    margin-bottom: 0;
  }

  .l-30 {
    margin-left: 10px;
    line-height: 30px;
  }
</style>
