<template>
  <div
    class="rounded !flex items-center p-4 justify-between text-white"
    :class="cssVar[popStyle]"
    :style="{
      ...outBoxStyle,
      background: `url(${bgImage}) center / cover no-repeat`,
    }"
  >
    <div
      :class="[{ item1: imageUrl }, [btnTextVar[popStyle]]]"
      :style="{ ...leftWidth, height: isTextBig ? '304px' : '192px' }"
    >
      <div v-if="SuperscriptText" :class="['superscriptText', btnTextVar[popStyle]]">
        <button class="text-xs" :class="titleBg" :style="{ ...titleStyle }">{{
          SuperscriptText
        }}</button>
      </div>
      <div v-if="titleText" :class="[btnTextVar[popStyle]]" :style="{ ...secondTitle }">
        {{ titleText }}
      </div>
      <div
        v-if="isTextShow"
        :class="[btnTextVar[popStyle]]"
        id="html_text"
        class="leading-4 flex-1 whitespace-pre-wrap break-all text-xs min-h-20"
        :style="contentText"
        v-text="htmlText"
      >
      </div>
      <div
        v-else
        id="html_text"
        :style="{ height: dynamicHeight + 'px' }"
        class="flex-1 overflow-hidden break-all"
        v-html="htmlText"
      >
      </div>
      <div v-if="btnText && btnShow" :class="['btnTextStyle', btnTextVar[popStyle]]">
        <button class="text-xs" :style="{ ...btnStyle }">{{ btnText }}</button>
      </div>
    </div>
    <div
      v-if="imageUrl"
      class="item2"
      :class="imgCssVar[popStyle]"
      :style="{ ...bgImageStyle, ...rightWidth }"
    >
      <img class="w-full h-full" :src="imageUrl" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';

  interface Props {
    outBoxStyle?: Object;
    popStyle?: number;
    htmlText?: string;
    imageUrl: string;
    bgColor?: string;
    btnText?: string;
    btnShow?: boolean;
    bgImage?: string;
    bgImageStyle?: Object;
    isTextShow?: boolean;
    SuperscriptText?: string;
    titleText?: string;
    titleBg?: string;
    titleStyle?: Object;
    secondTitle?: Object;
    contentText?: string;
    leftWidth?: Object;
    rightWidth?: Object;
    btnStyle?: Object;
    isTextBig?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    outBoxStyle: () => {
      return { width: '215px', 'min-height': '127px' };
    },
    imageUrl: '',
    popStyle: 1,
    isTextBig: false,
  });

  // const props = defineProps({
  //   btnText: String,
  //   SuperscriptText: String,
  // });

  const dynamicHeight = computed(() => {
    let height = 192;
    if (props.btnText) height = height - 40;
    if (props.SuperscriptText) height = height - 18;
    return height;
  });

  const cssVar = {
    2: 'flex-row-reverse',
  };
  const imgCssVar = {
    1: 'ml-2',
    2: 'mr-2',
  };
  const btnTextVar = {
    1: 'btnText-left',
    2: 'btnText-right',
  };
</script>

<style scoped lang="less">
  #html_text {
    p {
      margin: 0 !important;
      text-align: right !important;
    }
  }

  .btnTextStyle {
    //获取佣金配置详情
    //position: absolute;
    // bottom: calc(50% - 42px);
    width: auto;

    button {
      width: 120px;
      height: 40px;
      padding: 5px;
      overflow: hidden;
      border: 1px solid #fff;
      border-radius: 2px;
      background-color: transparent;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .superscriptText {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border-radius: 3px;
    background-color: #fff;
    color: #071824;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.5;
    white-space: nowrap;
    font-feature-settings: 'tnum';
  }

  .btnText-right {
    text-align: left;
  }

  .item1 {
    flex-basis: 70%;
  }

  .item2 {
    flex-basis: 30%;
  }

  ::v-deep .btnText-right p {
    text-align: left !important;
  }
</style>
