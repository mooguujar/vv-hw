<template>
  <BasicModal
    v-bind="$attrs"
    :title="`实时汇率 最近更新时间：${time} (UTC)`"
    width="700px"
    :showOkBtn="false"
    :showCancelBtn="false"
    @register="registerRate"
  >
    <table class="file-table">
      <thead>
        <tr class="file-table-tr">
          <th v-for="item in columnList" :key="item.dataIndex" :class="['file-table-th', 'center']">
            {{ item.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(record, index) in dataSource"
          :key="`${index || ''}`"
          class="file-table-tr cursor"
          :class="{ 'selected-row': selectedRow === index }"
          @click="selectRow(index)"
        >
          <td v-for="item in columnList" :key="item.dataIndex" :class="['file-table-td', 'center']">
            <span>{{ record[item.dataIndex] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { toTimezone } from '/@/utils/dateUtil';

  const { getCurrencyObj, getAllCurrencyList } = useCurrencyStore();

  const selectedRow = ref(0);
  const selectValues = ref(getCurrencyObj.id);
  const dataSource = ref([]);
  const time = ref('');

  const selectRow = (index) => {
    selectedRow.value = index;
  };

  const [registerRate] = useModalInner(async (data) => {
    time.value = toTimezone(data.date);
    const obg = data.rates[selectValues.value];
    const newDataSource = Object.keys(obg).map((Currency, index) => {
      if (Currency == selectValues.value) {
        selectedRow.value = index;
      }
      const currencyInfo = getAllCurrencyList.find((item) => Currency == item.id);
      const CurrencyName = currencyInfo ? currencyInfo.name : '';
      return CurrencyName
        ? {
            Currency: CurrencyName,
            Amount: obg[Currency],
          }
        : null;
    });
    const filteredDataSource = newDataSource.filter((item) => item !== null);
    filteredDataSource.unshift({ Currency: getCurrencyObj.name, Amount: 1 });
    dataSource.value = filteredDataSource;
  });

  const columnList = [
    {
      dataIndex: 'Currency',
      title: '币种',
      width: 100,
    },
    {
      dataIndex: 'Amount',
      title: '金额',
      width: 100,
    },
  ];
</script>
<style lang="less">
  .file-table {
    width: 100%;
    border-collapse: collapse;

    .center {
      text-align: center;
    }

    .left {
      text-align: left;
    }

    .right {
      text-align: right;
    }

    &-th,
    &-td {
      padding: 12px 8px;
    }

    thead {
      background-color: @background-color-light;
    }

    table,
    td,
    th {
      border: 1px solid @border-color-base;
    }
  }

  .selected-row {
    background-color: @header-bg; /* Change the background color as desired */
  }
</style>
