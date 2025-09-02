<template>
  <div :class="{ 'bg-white': showwhitebg, 'w-full': true }">
    <div class="!overflow-x-auto whitespace-nowrap" ref="scrollContainer">
      <cdBlockCurrency
        v-for="btn in btnListData"
        :key="btn.value"
        :class="innerClass"
        class="inline-block mx-15px my-15px cursor-pointer"
        :active="modelValue === btn.value"
        :currencyName="btn.name"
        :label="btn.lable"
        @click="changeClick(btn.value, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watchEffect } from 'vue';
  import cdBlockCurrency from '../block/cd-block-currency.vue';
  import { isEmpty } from '/@/utils/is';

  const props = withDefaults(
    defineProps<{
      btnList: {
        name: string;
        value: string | number;
        lable?: string | number | null;
      }[];
      firstList: {
        name: string;
        value: string | number;
        lable?: string | number | null;
      }[];
      modelValue: string | number | null;
      showwhitebg: boolean | null;
      innerClass: String | null | string[]; //子元素样式
    }>(),
    {
      firstList: <any>[], // 默认值为 null
      showwhitebg: true,
    },
  );

  const btnListData: any = ref([]);
  const scrollContainer = ref<HTMLElement | null>(null);

  watchEffect(() => {
    btnListData.value = !isEmpty(props.firstList)
      ? isEmpty(props.firstList)
        ? [...props.btnList]
        : [...props.firstList, ...props.btnList]
      : props.btnList;
  });

  const emit = defineEmits(['update:modelValue', 'ChangeButtonCurrency']);

  function changeClick(value, event: MouseEvent) {
    if (event != undefined || event != null) {
      const element = event.target as HTMLElement;
      if (scrollContainer.value) {
        const elementCenter = element.offsetLeft + element.offsetWidth / 2;
        const containerCenter = scrollContainer.value.offsetWidth / 2;
        const scrollTarget = elementCenter - containerCenter;
        scrollContainer.value.scroll({
          left: scrollTarget,
          behavior: 'smooth',
        });
      }
    }
    emit('ChangeButtonCurrency', value);
    emit('update:modelValue', value);
  }
</script>

<style>
  .innerClass {
    margin-top: 0 !important;
  }
</style>
