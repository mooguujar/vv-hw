<template>
  <div
    class="rounded flex items-center p-3 pt-5 justify-between text-white"
    :class="cssVar[popStyle]"
    :style="{ ...outBoxStyle, background: bgColor }"
  >
    <div :class="[{ item1: imageUrl }]">
      <div
        id="html_text"
        class="leading-4 flex-1 whitespace-pre-wrap break-all text-xs"
        v-html="htmlText"
      >
      </div>
      <div v-if="btnText && btnShow" :class="['btnTextStyle', btnTextVar[popStyle]]">
        <button class="text-xs">{{ btnText }}</button>
      </div>
    </div>
    <div v-if="imageUrl" class="item2" :class="imgCssVar[popStyle]">
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
      max-width: 100px;
      max-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .btnText-right {
    right: 35px;
  }
  .item1 {
    flex-basis: 70%;
  }

  .item2 {
    flex-basis: 30%;
  }
</style>
