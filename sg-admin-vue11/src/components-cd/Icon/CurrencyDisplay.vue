<template>
  <div>
    <Tooltip
      v-if="currency_names.length > 2 && currency_names.length !== currencyTreeList.length"
      overlayClassName="!w-auto !max-w-260px "
    >
      <template #title>
        <div class="flex flex-wrap">
          <div class="m-b-2 w-12 text-center" v-for="item in currency_names" :key="item">
            <cdIconCurrency class="w-20px mr-3px" :icon="item" />
            {{ item }}
          </div>
        </div>
      </template>
      <div style="justify-content: center; overflow: hidden; text-overflow: ellipsis">
        <cdIconCurrency
          v-if="currency_names.length > 1 && currency_names.length !== currencyTreeList.length"
          :icon="currency_names[0]"
          class="w-20px mr-3px"
        /><span
          class="m-r-2"
          v-if="currency_names.length > 1 && currency_names.length !== currencyTreeList.length"
          >{{ currency_names[0] }}</span
        >
        <cdIconCurrency
          v-if="currency_names.length > 1 && currency_names.length !== currencyTreeList.length"
          :icon="currency_names[1]"
          class="w-20px mr-3px"
        />
        <span
          v-if="currency_names.length > 1 && currency_names.length !== currencyTreeList.length"
          >{{ currency_names[1] }}</span
        >

        <span v-if="currency_names.length > 1 && currency_names.length !== currencyTreeList.length"
          >...</span
        >
      </div>
    </Tooltip>
    <div v-else-if="currency_names.length === currencyTreeList.length">
      <cdIconCurrency icon="CAD" class="w-20px mr-3px" />
      <span>{{t('common.All')}}</span>
    </div>
    <div class="flex justify-center" v-else>
      <div v-for="(item, index) in currency_names" :key="item" class="mr-3px">
        <cdIconCurrency :icon="item" class="w-20px mr-3px" />{{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from '@/hooks/web/useI18n';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { Tooltip } from 'ant-design-vue';

  interface CurrencyItem {
    name?: string;
    id?: string | number;
    label?: string | number | null;
  }
  const { t } = useI18n();
  const props = withDefaults(
    defineProps<{
      currency_names: any;
      currencyTreeList: CurrencyItem[];
    }>(),
    {
      currency_names: [],
      currencyTreeList: [],
    },
  );
</script>
