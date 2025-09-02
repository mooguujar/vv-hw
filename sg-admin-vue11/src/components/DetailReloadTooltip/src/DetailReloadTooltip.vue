<template>
  <Tooltip placement="bottom" overlayClassName="ad-tooltip">
    <!-- 使用变量无法生效，暂时用数组长度来区分类名判断 TODO：待优化 -->
    <template #title>
      <div class="flex flex-colunms min-w-100px" :style="cssStyle">
        <span
          class="cursor flex justify-center items-center border-b-light p-10px"
          @click="hadnleRealod(record)"
        >
          <ReloadOutlined :class="['mr-2', { 'load-animation': loading }]" />{{ $t('common.redo') }}
        </span>
        <div class="tooltip-currency">
          <div
            v-for="(item, index) in sortList(list)"
            :key="index"
            class="flex leading-6 justify-between"
          >
            <!-- <span class="w-13">{{ item.currency_name }}:</span> -->
            <div>
              <cdIconCurrency :icon="item.label" class="w-12px mr-5px tooltip-currency-img" />
              <span class="mr-5px">{{ item.label }}</span>
            </div>
            <div>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div :style="styleText" class="primary-color">{{ currencyValue || '0.00' }}</div>
  </Tooltip>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { ReloadOutlined } from '@ant-design/icons-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { sortList } from '/@/utils/common.ts';

  const { getCurrency } = useCurrencyStore();

  interface ListItem {
    currency_name: string;
    amount: string;
  }

  const props = defineProps({
    list: {
      type: Array<ListItem>,
      default: () => [],
    },
    record: {
      type: Object,
      default: () => ({}),
    },
    styleText: {
      type: Object,
      default: () => ({}),
    },
    totalAmount: {
      type: String,
      default: () => ({}),
    },
  });

  // 根据全局的币种，决定显示哪一个
  const currencyValue = computed(() => {
    return props.totalAmount;
  });
  const cssStyle = { '--tooltip-width': props.list.length * 150 + 'px', 'min-with': '150px' };

  const emit = defineEmits(['reload']);
  // 中心钱包刷新加载
  const loading = ref(false);
  // 单点刷新中心钱包
  function hadnleRealod(record) {
    loading.value = true;
    emit('reload', record);
    setTimeout(() => {
      loading.value = false;
    }, 600);
  }
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
