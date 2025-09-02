<template>
  <div class="pop-preview flex w-65 h-120 items-center justify-center">
    <canvas ref="canvasRef" class="rounded-md" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { useCanvas } from '/@/hooks/web/useCanvas';

  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const { initCanvas, changeLinearGradient, changeBackImage, changeText } = useCanvas();

  const props = defineProps({
    width: { type: Number, default: 215 },
    height: { type: Number, default: 130 },
    popStyle: { type: [String, Number], default: '' },
    bgColor: { type: Object, default: () => {} },
    image: { type: [String, Number], default: '' },
    text: { type: [String, Number], default: '' },
  });

  const emits = defineEmits(['get:canvas', 'generate:file']);

  onMounted(() => {
    initCanvas(canvasRef);
    emits('get:canvas', canvasRef.value);
    setCanvas(props.bgColor, props.image, props.text, props.popStyle);
  });

  watch(
    () => props.text,
    (v) => {
      setCanvas(props.bgColor, props.image, v, props.popStyle);
    },
  );

  watch(
    () => props.popStyle,
    (v) => {
      if (v) {
        setCanvas(props.bgColor, props.image, props.text, v);
      }
    },
  );

  watch(
    () => props.bgColor,
    (v) => {
      setCanvas(v, props.image, props.text, props.popStyle);
    },
  );

  watch(
    () => props.image,
    (v) => {
      setCanvas(props.bgColor, v, props.text, props.popStyle);
    },
  );

  function setPosition(v) {
    return v === 1
      ? {
          imagePosition: { x: 120, y: 20 },
          textPosition: { x: 15, y: 40 },
        }
      : {
          imagePosition: { x: 10, y: 20 },
          textPosition: { x: 100, y: 40 },
        };
  }

  function setCanvas(color, src, text, popStyle) {
    const { textPosition, imagePosition } = setPosition(popStyle);
    changeLinearGradient(color.startColor, color.endColor);
    changeBackImage(src, [imagePosition.x, imagePosition.y, 80, 80]);
    changeText(text, { x: textPosition.x, y: textPosition.y, maxWidth: 100, lineHeight: 16 });
    if (canvasRef.value) {
      canvasRef.value.toBlob(function (blob) {
        const file = new File([blob], 'image.webp', { type: 'image/webp' });
        emits('generate:file', file);
      });
    }
  }
</script>

<style>
  .pop-preview {
    background-color: rgba(51, 51, 51, 0.8);
    position: absolute;
    z-index: 10;
    right: 50px;
    top: 0;
  }
</style>
