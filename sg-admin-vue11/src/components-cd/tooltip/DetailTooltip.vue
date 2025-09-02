<template>
  <div class="w-text">
    <Tooltip
      :placement="placementPosition"
      v-if="dataDetail.length > num"
      :title="dataDetail"
      :content="dataDetail ? dataDetail : '-'"
    >
      <Col class="truncate">{{ dataDetail ? dataDetail : '-' }}</Col>
    </Tooltip>
    <span v-else>{{ dataDetail ? dataDetail : '-' }}</span>
  </div>
</template>

<script setup lang="ts">
  import { Tooltip, Col } from 'ant-design-vue';

  defineProps({
    dataDetail: {
      type: String,
      default: '',
    },
    placementPosition: {
      type: String,
      default: 'top',
    },
    num: {
      type: Number,
      default: 18,
    },
  });
</script>

<style lang="less" scoped>
  @media only screen and (min-width: 1200px) and (max-width: 1800px) {
    .w-text {
      width: 130px;
    }
  }
  @media only screen and (min-width: 1900px) and (max-width: 2000px) {
    .w-text {
      width: 200px;
    }
  }
</style>
