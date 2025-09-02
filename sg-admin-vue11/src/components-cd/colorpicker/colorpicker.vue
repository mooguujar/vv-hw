<template>
  <div class="color-select-container" :class="{ disabled: disabled }">
    <color-picker
      v-model:pureColor="color"
      v-model:gradientColor="gradient"
      v-model:activeKey="colorType"
      :format="props.format"
      :use-type="useType"
      class="eee"
      @update:pureColor="updatePureColor"
      @update:gradientColor="updateGradientColor"
      @update:activeKey="updateActiveKey"
    />
  </div>
</template>
<script setup>
  import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';
  import { ColorPicker } from 'vue3-colorpicker';
  import 'vue3-colorpicker/style.css';

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: 'rgb',
    },
    gradient: {
      type: String,
      default: '',
    },
    colorType: {
      type: String,
      default: 'pure',
    },
    useType: {
      type: String,
      default: 'pure',
    },
  });

  const color = ref('');
  const gradient = ref('');
  const colorType = ref('pure');
  const useType = ref(props.useType || 'pure');

  const emits = defineEmits(['update:modelValue', 'update:gradient', 'update:colorType']);

  const updateActiveKey = (val) => {
    emits('update:colorType', val);
    colorType.value = val;
    console.log('val', val);
  };

  const updatePureColor = (val) => {
    emits('update:modelValue', val);
  };

  const updateGradientColor = (val) => {
    console.log('val', val);
    gradient.value = val;
    emits('update:gradient', val);
  };

  onMounted(() => {
    const els = document.querySelectorAll('.color-select-container .vc-color-wrap');
    els.forEach((item) => {
      item.style.width = '100%';
    });
  });

  watch(
    () => props.modelValue,
    (val) => {
      console.log('val', props);
      color.value = val || 'rgba(0, 0, 0, 0)';
    },
    { immediate: true, deep: true },
  );
  watch(
    () => props.colorType,
    (val) => {
      colorType.value = val || 'pure';
    },
    { immediate: true, deep: true },
  );
  watch(
    () => props.gradient,
    (val) => {
      gradient.value =
        val || 'linear-gradient(92deg, rgba(61, 61, 61, 1) 0%, rgba(0, 0, 0, 1) 100%)';
    },
    { immediate: true, deep: true },
  );
</script>
<style>
  .color-select-container {
    position: relative;
    height: 38px;
    padding: 2px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    &.disabled {
      cursor: not-allowed;
      .vc-color-wrap {
        pointer-events: none;
      }
    }
  }

  .color-select-container .vc-color-wrap,
  .color-select-container .ant-input-affix-wrapper {
    position: absolute;
    top: 0;
    left: 0;
  }

  .color-select-container .ant-input-affix-wrapper {
    z-index: -1;
  }

  .color-select-container .vc-color-wrap {
    width: 100% !important;
    height: 36px !important;
    border-radius: 4px;
    box-shadow: none !important;
  }
</style>
