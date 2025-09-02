<template>
  <template v-if="amount != 0">
    <Tooltip placement="rightTop" @visible-change="onVisibleChange" overlayClassName="ad-tooltip">
      <!-- 使用变量无法生效，暂时用数组长度来区分类名判断 TODO：待优化 -->
      <template #title>
        <div class="flex flex-col">
          <div class="flex flex-row border-b-light">
            <div class="py-2 px-5 w-[134px] text-center">
              {{ $t('table.report.report_platform_name') }}
            </div>
            <div class="py-2 grow px-5 min-w-[123px] text-center">
              {{
                props.type == 'valid_bet_amount'
                  ? $t('table.promotion.promotion_affect_bet')
                  : props.type == 'real_valid_bet_amount'
                  ? $t('table.report.real_valid_bet_amount')
                  : $t('table.report.report_platform_amount')
              }}
            </div>
          </div>
          <div class="flex flex-row" v-for="bet in props.record?.tip?.bet" :key="bet.platform_Id">
            <div class="py-2 px-5 border-r-light w-[134px] whitespace-nowrap text-center">
              {{ bet.platform_name }}
            </div>
            <div class="py-2 px-5 text-center grow min-w-[123px]">
              {{
                props.type == 'valid_bet_amount'
                  ? bet.valid_bet_amount
                  : props.type == 'real_valid_bet_amount'
                  ? bet.real_valid_bet_amount
                  : bet.net_amount
              }}
            </div>
          </div>
        </div>
      </template>
      <div :class="[amount > 0 ? 'text-red' : 'text-green']">{{ amount }}</div>
    </Tooltip>
  </template>
  <template v-else-if="amount == 0">
    <div :class="['text-green']">{{ amount }}</div>
  </template>
</template>

<script lang="ts" setup>
  import { ref, defineProps } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  const props = defineProps({
    currency_id: {},
    timeRange: {},
    record: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
    },
  });
  const onVisibleChange = async (isShow) => {
    if (isShow) {
    }
  };
  const amount = ref(0 as number);
  amount.value =
    props.type == 'valid_bet_amount'
      ? props.record.valid_bet_amount
      : props.type == 'real_valid_bet_amount'
      ? props.record.real_valid_bet_amount
      : props.record.net_amount;
</script>

<style scoped>
  .load-animation {
    animation: loadingCircle 1s infinite linear;
  }
</style>

<style lang="less">
  .ad-tooltip {
    max-width: none;
  }
</style>
