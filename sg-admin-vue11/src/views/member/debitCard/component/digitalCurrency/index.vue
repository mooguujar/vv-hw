<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <div class="mx-3">
      <cointypeTable ref="apiTableInstance" :apiMap="currentCurrency.apiMap">
        <cdButtonCurrency :btn-list="achieveList?.map((item) => ({ name: item.name, value: item.key }))"
          v-model="activeKey" />
      </cointypeTable>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { usdtData, btcForm, usdtForm } from './usdtCoin.data';
import { getWalletList } from '/@/api/member/index';
import cointypeTable from './cointypeTable.vue';
import { useTreeListStore } from '/@/store/modules/treeList';
import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';

const activeKey = ref('706');
const achieveList = ref<any>([]);
const { currencyTreeList } = useTreeListStore();

function createAchieveListItem(item: any) {
  return {
    key: item.id,
    name: item.name,
    component: 'cointypeTable',
    apiMap: {
      PAGE_TYPE: item.id,
      pageName: item.name,
      schemas: item.id === '707' ? btcForm : usdtForm,
      columns: usdtData,
      modalType: item.id,
      list: getWalletList,
    },
  };
}

const filterList = currencyTreeList.filter((item) => {
  return item.attr !== '1';
});

activeKey.value = filterList[0].id;

filterList.forEach((item) => {
  achieveList.value.push(createAchieveListItem(item));
});

const currentCurrency = computed(() =>
  achieveList.value.find((item) => item.key == activeKey.value),
);

const apiTableInstance = ref<any>(null);

watch(currentCurrency, () => {
  setcurrencyId()
});

async function setcurrencyId() {
  const { setFieldsValue } = await apiTableInstance.value?.getForm();
  setFieldsValue({ currency_id: activeKey.value })
  apiTableInstance.value?.reload();
}

onMounted(() => {
  nextTick(() => {
    setcurrencyId();
  });
});

</script>
