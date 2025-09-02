<template>
  <div class="flex items-center flex-wrap flex-1">
    <div
      class="base-tag flex items-center justify-center mr-2.5"
      v-for="(item, index) in contentList"
      :key="item.id"
      :class="[{ activeTag: currentLangIndex === index }]"
      @click="handleClickContent(index, item)"
    >
      <div class="base-tag-text flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
        <img
          :src="currentLangIndex === index ? imgSrc[item.aicon] : imgSrc[item.icon]"
          alt=""
          class="mt--2px"
        />
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import zp from '/@/assets/svg/zp.svg';
  import zpIs from '/@/assets/svg/zpIs.svg';
  import vector from '/@/assets/svg/vector.svg';
  import vectorIs from '/@/assets/svg/vectorIs.svg';
  import dooler from '/@/assets/svg/dooler.svg';
  import doolerIs from '/@/assets/svg/doolerIs.svg';

  const emits = defineEmits(['click:radio']);

  const props = defineProps({
    contentList: { type: Array, default: () => [] },
    istop: { type: Boolean, default: () => false },
  });

  const imgSrc = {
    zp,
    zpIs,
    vector,
    vectorIs,
    dooler,
    doolerIs,
  };

  const currentLangIndex = ref(0);

  function handleClickContent(index, value) {
    currentLangIndex.value = index;
    emits('click:radio', value);
  }
</script>

<style scoped lang="less">
  .activeTag {
    border: 1px solid #1475e1 !important;
    background-color: #1475e1 !important;
    color: #fff !important;
  }
</style>

<style lang="less" scoped>
  .base-tag {
    position: relative;
    min-width: 80px;
    height: 40px;
    border: 1px solid #e1e1e1;
    border-radius: @border-radius-base;
    background-color: #fff;
    color: #2f4553;
    cursor: pointer;

    .base-tag-text {
      //width: 67px;
      height: 100%;
      padding: 0 10px;
      //padding: 4px 7px;
      font-size: 14px;
      font-weight: 600;
      line-height: 40px;
    }
  }
</style>
