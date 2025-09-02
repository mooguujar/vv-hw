<template>
  <div>
    <Tooltip placement="bottom" overlayClassName="ad-tooltip">
      <!-- 使用变量无法生效，暂时用数组长度来区分类名判断 TODO：待优化 -->
      <template #title>
        <div class="flex flex-colunms" :style="cssStyle">
          <span
            class="cursor flex justify-center items-center border-b-light p-10px tooltip-currency"
            @click="hadnleRealod(record)"
          >
            <ReloadOutlined :class="['mr-2 w-14px', { 'load-animation': loading }]" />{{
              $t('common.redo')
            }}
          </span>
          <div class="flex" :class="[list.length > 1 && hasNonEmptyLists() ? 'min-w-300px' : '']">
            <span
              v-for="(item, index) in list"
              :key="index"
              :class="[
                'flex-1',
                index !== list.length - 1 && hasNonEmptyLists()
                  ? 'border-r-light p-r-10px'
                  : index == list.length - 1 && list.length > 1 && hasNonEmptyLists()
                  ? 'p-l-10px'
                  : '',
              ]"
            >
              <template v-if="item.list.length > 0">
                <div v-if="item.name" class="mb-10px tooltip-currency p-y-5px">{{ item.name }}</div>
                <div
                  class="flex tooltip-currency !justify-between min-w-100px"
                  v-for="(sItem, sIndex) in sortList(item.list)"
                  :key="sIndex"
                >
                  <div class="flex">
                    <cdIconCurrency
                      :icon="sItem.label"
                      class="w-12px mr-5px tooltip-currency-img"
                    /><span class="mr-5px">{{ sItem.label }}</span>
                  </div>
                  <div>
                    <span>{{ sItem.value }}</span>
                  </div>
                </div>
              </template>
            </span>
          </div>
        </div>
      </template>
      <div :style="styleText" class="primary-color">
        {{ balanceType ? currencyValue : currencyMoney || '-' }}</div
      >
    </Tooltip>
    <div v-for="(item, index) in list" :key="index">
      <div v-if="item.list.length === 0 && balanceType">0.00</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { ReloadOutlined } from '@ant-design/icons-vue';

  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useFinanceStore } from '/@/store/modules/finance';
  import { mulrate } from '/@/utils/number';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { sortList } from '/@/utils/common';

  const { getCurrency, getCurrencyObj } = useCurrencyStore();
  const { getRateList } = useFinanceStore();

  interface SubListItem {
    label: string;
    value: string;
  }

  interface ListItem {
    id: string;
    name?: string;
    list: Array<SubListItem>;
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
    currency: {
      type: String,
      default: () => '',
    },
    currencyId: {
      type: Number,
      default: () => 701,
    },
    type: {
      type: String,
      default: () => 'default',
    },
    balanceTotle: {
      type: String,
      default: () => '0.00',
    },
    balanceType: {
      type: String,
      default: () => '',
    },
  });
  // 根据全局的币种，决定显示哪一个
  const currencyValue = computed(() => {
    const propsList = props.list;
    if (propsList && propsList.length > 0) {
      const firstList = propsList[0].list;
      if (props.type == 'default') {
        const currencyItem = firstList.find((item) => item.label === getCurrency);
        return currencyItem ? currencyItem.value : null;
      } else if (props.type == 'rate') {
        const currencyItem = firstList.find((item) => item.label === props.currency);
        const currenRateObj = getRateList[getCurrencyObj.id];
        const rate = currenRateObj[props.currencyId] || 1;
        return currencyItem ? mulrate(Number(currencyItem.value), rate, props.currency) : null;
      } else if (props.type == 'currency') {
        const currencyItem = firstList.find((item) => item.label === props.currency);
        return currencyItem ? currencyItem.value : propsList[0].list[0].value;
      } else {
      }
    }
    return null;
  });

  const currencyMoney = computed(() => {
    return props.balanceTotle;
  });

  function hasNonEmptyLists() {
    return props.list.every((item) => item.list.length > 0);
  }

  const cssStyle = { '--tooltip-width': props.list.length * 150 + 'px' };

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
