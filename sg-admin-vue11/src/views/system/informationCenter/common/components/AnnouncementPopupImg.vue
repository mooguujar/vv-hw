<template>
  <div class="rounded !flex items-center p-16px justify-between text-white" :class="cssVar[popStyle]" :style="{
    ...outBoxStyle,
    background: `url(${bgImage}) center / cover no-repeat`,
  }">
    <div :class="[{ item1: imageUrl }]" :style="{ ...leftWidth }">
      <div v-if="SuperscriptText" :class="['btnTextStyle', btnTextVar[popStyle]]">
        <button class="text-xs" :class="titleBg" :style="{ ...titleStyle }">{{
          SuperscriptText
          }}</button>
      </div>
      <div v-if="titleText" :class="[btnTextVar[popStyle]]" :style="{ ...secondTitle }">
        {{ titleText }}
      </div>
      <div v-if="isTextShow" :class="[btnTextVar[popStyle]]" id="html_text"
        class="leading-4 flex-1 whitespace-pre-wrap break-all text-xs" :style="contentText" v-text="htmlText">
      </div>
      <div v-else id="html_text" class="leading-4 flex-1 whitespace-pre-wrap break-all text-xs" :style="contentText"
        v-html="htmlText">
      </div>
      <div v-if="btnText && btnShow" :class="['btnTextStyle', btnTextVar[popStyle]]" class="enter-game-btn">
        <button class="text-xs" :style="{ ...btnStyle }">{{ btnText }}</button>
      </div>
    </div>
    <div v-if="imageUrl" class="item2" :style="{ ...bgImageStyle, ...rightWidth }">
      <img class="w-full h-full" :src="imageUrl" />
    </div>
  </div>
</template>

<script setup lang="ts">
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
}

withDefaults(defineProps<Props>(), {
  outBoxStyle: () => {
    return { width: '215px', 'min-height': '127px' };
  },
  imageUrl: '',
  popStyle: 1,
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
  }
}

.btnTextStyle {
  //获取佣金配置详情
  //position: absolute;
  // bottom: calc(50% - 42px);
  width: auto;

  button {
    background-color: transparent;
    border: 1px solid #ffffff;
    padding: 5px;
    border-radius: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.btnText-left,
.btnText-right {
  width: 215px !important;

  button {
    background: #fff;
    color: #213743;
    padding: 2px 3px;
    font-size: 12px;
    line-height: 13px;
    font-weight: 500;
    max-width: 100% !important;
  }
}

.btnText-left:nth-child(2),
.btnText-right:nth-child(2) {
  font-size: 18px !important;
  font-weight: 600 !important;
  line-height: 18px !important;
  width: 215px !important;
  margin-top: 8px;
  margin-bottom: 8px;
}

.btnText-left:nth-child(3),
.btnText-right:nth-child(3) {
  //border: 1px solid red!important;
  width: 215px !important;
  max-height: 60px !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  line-height: 20px !important;
  margin-top: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.enter-game-btn {
  position: absolute;
  bottom: 16px;
  width: 215px !important;

  button {
    border: 1px solid #ffffff;
    background: transparent !important;
    color: #fff !important;
    font-size: 14px;
    font-weight: 500;
    padding: 12px 30px;
    line-height: 14px;
    max-width: 100% !important;
  }
}

.btnText-right {
  text-align: right;
}

.item1 {
  //flex-basis: 70%;
  min-height: 192px;
  width: calc(100% - 136px) !important;
}

.item2 {
  //flex-basis: 30%;
  width: 136px !important;
}
</style>
