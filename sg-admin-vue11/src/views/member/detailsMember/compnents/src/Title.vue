<template>
  <div class="member-title leading-15 border border-slate-200 p-l-5">
    <span class="font-medium text-base !p-r-2">{{ name }}</span>
    <slot name="content"></slot>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    name: {
      type: String,
      default: '',
    },
  });
</script>
