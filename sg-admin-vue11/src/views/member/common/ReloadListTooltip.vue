<template>
  <div>
    <Tooltip placement="bottom" overlayClassName="ad-tooltip">
      <!-- 使用变量无法生效，暂时用数组长度来区分类名判断 TODO：待优化 -->
      <template #title>
        <div class="flex flex-colunms" v-if="list.length > 0">
          <div class="flex flex-row" v-for="(item, index) in list" :key="index">
            <label class="mr-3">{{ item.cash_name }}:</label>
            <span>{{ item.amount }}</span>
          </div>
        </div>
      </template>
      <div class="primary-color"> {{ total }}</div>
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  interface ListItem {
    cash_name: string;
    amount: string;
  }

  const props = defineProps<{
    list: ListItem[];
    total: string;
  }>();
  const emit = defineEmits(['reload']);
  // 中心钱包刷新加载
  const list = ref(props.list);
  const total = ref(props.total);
</script>

<style lang="less">
  .ad-tooltip {
    max-width: none;

    .ant-tooltip-inner {
      padding: 10px !important;
      background-color: rgb(0 0 0 / 80%) !important;
    }
  }

  .tooltip-currency {
    margin-bottom: 5px;
    font-size: 12px !important;
    font-weight: 500;
    line-height: 1;
  }

  .tooltip-currency:nth-last-child {
    margin-bottom: 0;
  }

  .tooltip-currency-img {
    line-height: 0 !important;
  }
</style>
