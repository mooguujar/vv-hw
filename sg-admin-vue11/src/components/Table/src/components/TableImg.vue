<template>
  <div
    :class="prefixCls"
    class="flex items-center mx-auto relative previewName1"
    v-if="imgList && imgList.length"
    :style="getWrapStyle"
    @click="setVisible"
  >
    <!-- <Badge :count="!showBadge || imgList.length == 1 ? 0 : imgList.length" v-if="simpleShow">
      <div class="img-div">
        <PreviewGroup>
          <template v-for="(img, index) in imgList" :key="img">
            <Image
              :width="size"
              :style="{
                display: index === 0 ? '' : 'none !important',
              }"
              :src="srcPrefix + img"
            />
          </template>
        </PreviewGroup>
      </div>
    </Badge> -->
    <!-- <ImagePreviewGroup> -->
    <div class="linkImage whitespace-nowrap pointer-events-none" @click="setVisible">
      {{ $t('common.view') }}
    </div>
    <!-- <template v-for="(img, index) in imgList" :key="index">
      <Image
        :preview="{
          visible_,
          onVisibleChange: setVisible,
        }"
        rootClassName="previewName"
        maskClassName="maskName"
        :width="size"
        :style="{ marginLeft: index === 0 ? 0 : margin }"
        style="visibility: hidden"
        :src="img ? getDataTypePreviewUrl(img) : ''"
      />
    </template> -->
    <!-- </ImagePreviewGroup> -->

    <!-- 
    :preview="{
        visible,
      }"
    rootClassName="previewName"
      maskClassName="maskName"
    :style="{ marginLeft: 0 === 0 ? 0 : margin }"
      style="visibility: hidden" -->
  </div>
</template>
<script lang="ts">
  import type { CSSProperties } from 'vue';
  import { defineComponent, computed, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Image, Badge, ImagePreviewGroup } from 'ant-design-vue';
  import { propTypes } from '/@/utils/propTypes';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { createImgPreview } from '/@/components/Preview';

  const { t } = useI18n();
  export default defineComponent({
    name: 'TableImage',
    components: { Image, ImagePreviewGroup, Badge },
    props: {
      imgList: propTypes.arrayOf(propTypes.string),
      size: propTypes.number.def(30),
      // 是否简单显示（只显示第一张图片）
      simpleShow: propTypes.bool,
      // 简单模式下是否显示图片数量的badge
      showBadge: propTypes.bool.def(true),
      // 图片间距
      margin: propTypes.number.def(4),
      // src前缀，将会附加在imgList中每一项之前
      srcPrefix: propTypes.string.def(''),
      //显示缩略图
      visible: propTypes.bool.def(false),
    },
    setup(props) {
      const getWrapStyle = computed((): CSSProperties => {
        const { size } = props;
        const s = `${size}px`;
        return { height: s, width: s };
      });
      // function setVisible(v) {

      // }
      const visible_ = ref(props.visible);
      const { prefixCls } = useDesign('basic-table-img');
      const setVisible = (value): void => {
        createImgPreview({
          imageList: (props.imgList?.map((img: any) => getDataTypePreviewUrl(img)) as any) || [],
          maskClosable: true,
        });
      };
      return { prefixCls, visible_, setVisible, getWrapStyle, getDataTypePreviewUrl };
    },
  });
</script>
<style lang="less">
  :deep(.vben-basic-table-img) {
    position: relative;
  }

  .previewName {
    cursor: pointer !important;
  }

  .previewName1 {
    cursor: pointer !important;
  }

  .previewName > .ant-image-mask {
    visibility: hidden;
    cursor: pointer;
  }

  :deep(.vben-basic-table-img > .ant-image) {
    opacity: 0;
    cursor: pointer;
  }
  @prefix-cls: ~'@{namespace}-basic-table-img';

  .linkImage {
    position: absolute;
    z-index: 1;
    left: -10px;
    width: 50px;
    height: 50px;
    background: transparent;
    color: #1475e1;
    line-height: 50px;
    cursor: pointer;
  }
  .@{prefix-cls} {
    .ant-image {
      margin-right: 4px;
      cursor: zoom-in;

      img {
        border-radius: 2px;
      }
    }

    .img-div {
      display: inline-grid;
    }
  }
</style>
