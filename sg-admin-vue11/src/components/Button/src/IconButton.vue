<template>
  <div class="flex items-center flex-wrap flex-1">
    <div
      class="base-tag flex items-center justify-center mr-10px mb-10px relative"
      v-for="(item, index) in contentList"
      :key="item.id"
      :class="[{ activeTag: currentLangIndex === index }]"
      @click="handleClickContent(index, item)"
    >
      <div
        v-if="item.superscript && Number(item.superscript) > 0"
        class="absolute right-0 top-0 py-0 px-1 bg-[#E91134] rounded-[80px] text-3 min-w-24px text-[#FFF] leading-normal text-center translate-x-1/2 -translate-y-1/2 z-1"
        >{{ Number(item.superscript) > 99 ? '99+' : item.superscript }}</div
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
  import { nextTick, ref, watch } from 'vue';
  import zp from '/@/assets/svg/zp.svg';
  import zpIs from '/@/assets/svg/zpIs.svg';
  import vector from '/@/assets/svg/vector.svg';
  import vectorIs from '/@/assets/svg/vectorIs.svg';
  import dooler from '/@/assets/svg/dooler.svg';
  import doolerIs from '/@/assets/svg/doolerIs.svg';
  import lucky_bet from '/@/assets/svg/lucky_bet.svg';
  import chargeMoneyIcon from '/@/assets/svg/chargeMoenyIcon.svg';
  import chargeMoneyIconActive from '/@/assets/svg/chargeMoenyIcon_active.svg';
  import lucky_bet_active from '/@/assets/svg/lucky_bet_active.svg';
  import everyDayReward from '/@/assets/svg/everyDayReward.svg';
  import everyDayRewardActive from '/@/assets/svg/everyDayRewardActive.svg';
  import { useRoute, useRouter } from 'vue-router';

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
    lucky_bet,
    chargeMoneyIcon,
    chargeMoneyIconActive,
    lucky_bet_active,
    everyDayReward,
    everyDayRewardActive,
  };

  const route = useRoute();
  const title = ref<any>('');

  title.value = route.query.title ? route.query.title : '';
  const currentLangIndex = ref(0);

  nextTick(() => {
    setTimeout(() => {
      props.contentList.forEach((item: any, index) => {
        if (item.name == title.value) {
          handleClickContent(index, item);
        }
      });
    }, 1600);
  });
  // watch(
  //   () => props.contentList,
  //   (e) => {
  //     props.contentList.forEach((item: any, index) => {
  //       if (item.name == title.value) {
  //         // handleClickContent(index, item);
  //       }
  //     });
  //   },
  //   {
  //     // immediate: true,
  //   },
  // );

  watch(
    () => route.query,
    (e) => {
      title.value = e.title ? e.title : '';
    },
    {
      immediate: true,
    },
  );

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
