<template>
  <img :src="srcs[props.icon]" />
</template>
<script setup lang="ts">
  import question from '/@/assets/images/basicMoalTitleIcon/titlePreIcon/question.webp';

  const props = defineProps<{
    icon: string;
  }>();
  const srcs = {
    question,
  };
</script>
