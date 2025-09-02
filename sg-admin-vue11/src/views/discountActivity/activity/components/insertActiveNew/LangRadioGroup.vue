<template>
  <div class="flex items-center flex-wrap flex-1" :class="{ mtop: istop }">
    <BaseTag
      style="text-align: center !important"
      v-for="(item, index) in contentList"
      class="cursor mt-2 mx-1"
      :class="[
        {
          activeTag: isButton ? currentSelected == item.value : currentLangIndex === index,
          disabled: disabledType,
        },
      ]"
      :key="item.value"
      :value="item.label"
      @click="handleClickContent(index, item)"
    />
    <BaseTag
      style="text-align: center !important"
      class="cursor mt-2 mx-1 lan-item activeTag"
      :key="'translation'"
      v-if="showTranslation"
      :value="$t('business.translation')"
      @click="handleClickTranslation"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch, watchEffect } from 'vue';
  import { BaseTag } from '/@/components/DragSelectGroup';

  const emits = defineEmits([
    'click:radio',
    'update:modelValue',
    'update:click',
    'click:translation',
  ]);

  const props = defineProps({
    basicIndex: { type: Number, default: () => 0 },
    contentList: { type: Array, default: () => [] },
    istop: { type: Boolean, default: () => false },
    selecIndex: { type: Number, default: () => 1 },
    disabledType: { type: Boolean, default: () => false },
    showTranslation: { type: Boolean, default: () => false },
    // 按钮有bug就把这个删掉
    isButton: { type: Boolean, default: () => false },
    selectValue: { type: Number, default: () => 1 },
    // 按钮有bug就把这个删掉
  });

  const currentLangIndex = ref(0);
  // index不准确，位置也不能换，这个兼容value，不改动之前逻辑，如果有bug，那就把这个currentSelected去掉
  const currentSelected = ref(1);

  watchEffect(() => {
    currentLangIndex.value = props.selecIndex - 1;
  });
  watch(
    () => props.basicIndex,
    (n) => {
      currentLangIndex.value = n;
    },
  );
  // 按钮有bug就把这个删掉
  watch(
    () => props.selectValue,
    (n) => {
      currentSelected.value = n;
    },
  );
  // 按钮有bug就把这个删掉

  function handleClickContent(index, value) {
    if (props.disabledType) return false;
    currentLangIndex.value = index;
    // 按钮有bug就把这个删掉
    currentSelected.value = value.value;
    //
    emits('click:radio', index, value);
    emits('update:modelValue', value.value);
    emits('update:click', value.value);
  }

  function handleClickTranslation() {
    emits('click:translation');
  }
</script>

<style scoped lang="less">
  .activeTag {
    border: 1px solid #1475e1 !important;
    background-color: #1475e1 !important;
    color: #fff !important;
  }

  .mtop {
    margin-top: -5px;
  }

  .disabled {
    background-color: rgb(242 242 242 / 100%);
  }
</style>
