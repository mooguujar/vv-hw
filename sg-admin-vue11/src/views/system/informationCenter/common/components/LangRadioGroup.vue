<template>
  <div class="flex items-center flex-wrap" :class="{ mtop: istop }">
    <BaseTag
      style="text-align: center !important"
      v-for="(item, index) in contentList"
      class="cursor mb-2 mx-1 lan-item"
      :class="[{ activeTag: currentLangIndex === index }]"
      :key="item.value"
      :value="item.label"
      @click="handleClickContent(index, item)"
    />

    <BaseTag
      style="text-align: center !important"
      class="cursor mb-2 mx-1 lan-item activeTag"
      :key="'translation'"
      v-if="showTranslation"
      :value="$t('business.translation')"
      @click="handleClickTranslation"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { BaseTag } from '/@/components/DragSelectGroup';

  const emits = defineEmits(['click:radio', 'click:translation']);
  const props = defineProps({
    isIndex: { type: Number, default: 0 },
    contentList: { type: Array, default: () => [] },
    istop: { type: Boolean, default: () => false },
    showTranslation: { type: Boolean, default: () => false },
  });
  watch(
    () => props.isIndex,
    (newVal, oldVal) => {
      currentLangIndex.value = 0;
    },
  );

  const currentLangIndex = ref(props.isIndex || 0);

  function handleClickContent(index, value) {
    currentLangIndex.value = index;
    emits('click:radio', index, value);
  }

  function handleClickTranslation() {
    emits('click:translation');
  }

  onMounted(() => {
    currentLangIndex.value = 0;
  });
</script>

<style scoped lang="less">
  .activeTag {
    border-color: #1475e1 !important;
    background-color: #1475e1 !important;
    color: #fff !important;
  }

  .mtop {
    margin-top: -5px;
  }

  .lan-item {
    height: 40px !important;
    line-height: 40px;
  }
</style>
