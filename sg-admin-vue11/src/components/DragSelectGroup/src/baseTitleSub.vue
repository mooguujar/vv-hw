<template>
  <div class="base-sub-title">
    <div class="base-sub-title-top">{{ title }}</div>
    <div class="base-sub-text">
      <Tooltip
        v-if="
          valueRef &&
          Array.from(valueRef).reduce((acc, char) => acc + (/[^\x00-\xff]/.test(char) ? 2 : 1), 0) >
            15
        "
        placement="top"
        :title="valueRef"
      >
        <div class="base-tag-text flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
          {{ valueRef }}
        </div>
      </Tooltip>
      <div
        v-else
        ref="textRef"
        class="base-tag-text flex-1 text-ellipsis overflow-hidden whitespace-nowrap"
      >
        {{ valueRef }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  const props = defineProps({
    value: [String, Number],
    title: '',
    element: [],
  });
  const valueRef = ref(props.value);
  watch(
    () => props.value,
    (v) => {
      valueRef.value = v;
    },
  );
</script>
<style lang="less" scoped>
  .base-sub-title {
    overflow: hidden;
    border-radius: 4px;
    text-align: center;

    .base-sub-title-top {
      padding: 4px 10px;
      overflow: hidden;
      border-bottom: 1px solid rgb(225 225 225 / 26.1%);
      color: rgb(0 0 0 / 85%);
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .base-sub-text {
      padding: 3px 10px;
      overflow: hidden;
      color: rgb(0 0 0 / 85%);
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .activeMultiple {
    background: linear-gradient(90deg, #4c9bef 0%, #0b79ee 100%);
    color: #fff !important;

    .base-sub-title-top {
      color: #fff !important;
    }

    .base-sub-text {
      color: #fff;
    }
  }
</style>
