<template>
  <div>
    <Tooltip placement="bottom" overlayClassName="ad-tooltip">
      <!-- 使用变量无法生效，暂时用数组长度来区分类名判断 TODO：待优化 -->
      <template #title>
        <div class="flex flex-colunms" :style="cssStyle">
          <div>
            <div v-for="(item, index) in filterList" :key="index" class="leading-6">
              <!-- <span class="w-13">{{ item.currency_name }}:</span> -->
              <span class="mr-5px">{{ countryName[item.label] }}:</span>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </div>
      </template>
      <div :style="styleText" v-if="ifShow" class="primary-color single-line-ellipsis">
        {{ setName(list) }}
      </div>
    </Tooltip>
    <!-- <div :style="styleText" v-if="ifShow">{{ setName(list) }}</div> -->
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { ReloadOutlined } from '@ant-design/icons-vue';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useI18n } from '@/hooks/web/useI18n';

  const { getCurrency } = useCurrencyStore();

  interface ListItem {
    currency_name: string;
    amount: string;
  }
  const { t } = useI18n();
  const countryName = {
    // todo
    cn: t('common.common_zh_CN'),
    en: t('common.common_en_US'),
    vn: t('common.common_vi_VN'),
    th: t('common.common_th_TH'),
    br: t('common.common_pt_BR'),
    in: t('common.common_hi_IN'),
  };
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
    // if (propsList && propsList.length > 0) {
    //   const currencyItem: any = propsList.find((item: any) => item?.currency_name === getCurrency);
    //   return currencyItem ? currencyItem?.amount : null;
    // }
  });
  const filterList = computed(() => {
    const _list = props.list.filter((item) => {
      return item.value && item.label !== 'first' && item.label !== 'en';
    });
    return _list;
  });
  const cssStyle = { '--tooltip-width': props.list.length * 150 + 'px' };
  const ifShow = computed(() => {
    const _list = props.list.filter((item) => {
      return item.label === 'first';
    });

    return _list[0].value ? true : false;
  });
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
  function setName(value) {
    const _list = value.filter((item) => {
      return item.label === 'first';
    });
    const _value = value.filter((item) => {
      return item.label === _list[0].value;
    });
    return _value[0]?.value;
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
