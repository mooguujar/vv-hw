<template>
  <Tooltip v-if="isEllipsis" :title="title" :placement="showPosition">
    <div :class="{ 'words-ellipsis': isEllipsis }">{{ content ? content : '-' }}</div>
  </Tooltip>
  <div v-bind="$attrs" v-if="!isEllipsis">{{ content ? content : '-' }}</div>
</template>

<script setup lang="ts">
  import { withDefaults, computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  interface Props {
    title: number | string;
    content: string;
    maxLength?: number;
    showPosition?: string;
  }
  const props = withDefaults(defineProps<Props>(), {
    showPosition: 'top',
    maxLength: 20,
  });
  const isEllipsis = computed(() => {
    if (!props.content) return false;
    return props.content.length > props.maxLength ? true : false;
  });
</script>
<style lang="scss" scoped>
  .words-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
