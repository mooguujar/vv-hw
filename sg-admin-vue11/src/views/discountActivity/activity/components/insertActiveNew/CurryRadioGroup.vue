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

  const emits = defineEmits(['click:radio', 'update:modelValue', 'update:click']);

  const props = defineProps({
    defaultTy: { type: Number },
    contentList: { type: Array, default: () => [] },
    currencyId: { type: String },
    modelValue: { type: [String, Number], default: '' },
  });

  const currentLangId = ref<number | string>(props.modelValue);

  function handleClickContent(e) {
    emits('update:modelValue', currentLangId.value);
    emits('update:click', currentLangId.value);
  }

  watch(
    () => props.modelValue,
    (newVal) => {
      if (newVal !== undefined && newVal !== '') {
        currentLangId.value = newVal;
      }
    },
  );

  watchEffect(() => {
    if (!currentLangId.value || currentLangId.value === '') {
      currentLangId.value = props.currencyId;
    }
  });

  defineExpose({ handleClickContent });
</script>
