<template>
  <RadioGroup
    v-model:value="currentLangId"
    @change="handleClickContent"
    option-type="button"
    button-style="solid"
    size="large"
    class="pt-20px"
  >
    <Radio
      v-if="defaultTy != 14"
      :value="el.value"
      v-for="(el, index) in contentList"
      :key="index + 'Radio'"
    >
      <cdIconCurrency :icon="el.label" class="w-20px h-20px mb-5px" />
      <span class="ml-2">{{ el.label }}</span>
    </Radio>
    <RadioButton
      v-else
      :value="el.value"
      v-for="(el, index) in contentList"
      :key="index + 'RadioButton'"
    >
      <cdIconCurrency :icon="el.label" class="w-20px h-20px mb-5px" />
      <span class="ml-2">{{ el.label }}</span>
    </RadioButton>
  </RadioGroup>
</template>

<script setup lang="ts">
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  import { onMounted, ref, watch, watchEffect } from 'vue';
  import { RadioGroup, Radio, RadioButton } from 'ant-design-vue';

  const emits = defineEmits(['click:radio', 'update:modelValue', 'update:click', 'update:currencyId']);

  const props = defineProps({
    defaultTy: { type: Number },
    contentList: { type: Array, default: () => [] },
    currencyId: { type: [String, Number] },
    modelValue: { type: [String, Number], default: '' },
  });

  const currentLangId = ref<number | string>(props.modelValue);

  function handleClickContent(e) {
    emits('update:modelValue', currentLangId.value);
    emits('update:click', currentLangId.value);
    emits('update:currencyId', currentLangId.value);
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal !== undefined && newVal !== '') {
        currentLangId.value = newVal as any;
      }
    },
  );

  // 外部 currencyId 变化时，同步内部选中值（用于详情回显等场景）
  watch(
    () => props.currencyId,
    (newVal) => {
      if (newVal !== undefined && newVal !== '') {
        currentLangId.value = newVal as any;
        emits('update:modelValue', currentLangId.value);
      }
    },
  );

  watchEffect(() => {
    if (!currentLangId.value || currentLangId.value === '') {
      currentLangId.value = (props.currencyId as any) || props.contentList?.[0]?.value;
    }
  });

  defineExpose({ handleClickContent });
</script>
