<template>
  <div class="flex items-center flex-wrap flex-1" :class="{ mtop: istop }">
    <BaseTag
      style="text-align: center !important"
      v-for="(item, index) in contentList"
      class="cursor mt-2 mx-1"
      :class="[{ activeTag: currentLangIndex === index }]"
      :key="item.value"
      :value="item.label"
      @click="handleClickContent(index, item)"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { BaseTag } from '/@/components/DragSelectGroup';

  const emits = defineEmits(['click:radio']);
  const props = defineProps({
    contentList: { type: Array, default: () => [] },
    istop: { type: Boolean, default: () => false },
  });

  const currentLangIndex = ref(0);

  function handleClickContent(index, value) {
    currentLangIndex.value = index;
    emits('click:radio', index, value);
  }
</script>

<style scoped lang="less">
  .activeTag {
    background: linear-gradient(90deg, rgb(76, 155, 239) 0%, lighten(@primary-color, 10%) 100%);
    color: #fff !important;
  }
  .mtop {
    margin-top: -5px;
  }
</style>
