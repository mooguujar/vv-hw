<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <div class="mx-3">
      <onlineBankTable
        ref="apiTableInstance"
        :apiMap="currentCurrency.apiMap"
        :curryId="currentCurrency"
      >
        <cdButtonCurrency
          :btn-list="achieveList?.map((item) => ({ name: item.name, value: item.key }))"
          v-model="activeKey"
        />
      </onlineBankTable>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue';
  import { pixColumns, searchFormSchema, pblColumns, CNYColumns } from './bankBplColumns.data';
  import { getOutpayList } from '/@/api/member/index';
  import onlineBankTable from './onlineBankTable.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { getFirstProperty } from '/@/utils/common';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';

  const { initBankCurrencyTreeList } = useTreeListStore();

  initBankCurrencyTreeList(getFirstProperty().id || '701');

  const activeKey = ref();

  const achieveList = ref<any>([]);

  const { currencyTreeList } = useTreeListStore();

  function createAchieveListItem(item: any, columns: any, schemas: any) {
    return {
      key: item.id,
      name: item.name,
      component: 'onlineBankTable',
      apiMap: {
        PAGE_TYPE: item.id,
        pageName: item.name,
        schemas: schemas,
        columns: columns,
        modalType: item.id,
        list: getOutpayList,
      },
    };
  }

  const filterList = currencyTreeList.filter((item) => {
    return item.attr !== '2';
  });

  filterList.forEach((item) => {
    let columns;
    let schemas;
    if (item.id == '702') {
      columns = pblColumns;
      schemas = searchFormSchema;
    } else if (item.id == '701') {
      columns = CNYColumns;
      schemas = searchFormSchema;
    } else {
      columns = pixColumns;
      schemas = searchFormSchema;
    }
    achieveList.value.push(createAchieveListItem(item, columns, schemas));
  });

  activeKey.value = achieveList?.value[0]?.key ?? '';
  const currentCurrency = computed(
    () =>
      achieveList.value.find((item) => item.key == activeKey.value) || {
        apiMap: {
          columns: pixColumns,
          schemas: searchFormSchema,
        },
      },
  );

  const apiTableInstance = ref<any>(null);

  watch(currentCurrency, () => {
    setcurrencyId();
  });

  async function setcurrencyId() {
    const { setFieldsValue } = await apiTableInstance.value?.getForm();
    setFieldsValue({ currency_id: activeKey.value, bank_name: '', type_id: '' });
    apiTableInstance.value?.reload();
  }

  onMounted(() => {
    nextTick(() => {
      setcurrencyId();
    });
  });
</script>
