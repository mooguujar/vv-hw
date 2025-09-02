<template>
  <div>
    <BasicModal
      :title="t('table.finance.finance_add_payment_detail')"
      @register="registerDetails"
      :width="943"
      :showOkBtn="false"
      :showCancelBtn="false"
      class="configDetail"
    >
      <cdButtonCurrency
        class="changeCurrency"
        :innerClass="innerClass"
        @change-button-currency="changeActive"
        :btn-list="currencyTreeList"
        :modelValue="activeKey"
      />
      <div>
        <Space :size="15">
          <Button
            v-for="(item, index) in clientList"
            @click="clickDvice(item.value)"
            :key="index"
            :class="{ 'ant-btn-primary': selectedDevice === item.value }"
            class="mt-5px mb-20px"
            size="large"
          >
            {{ item.label }}
          </Button>
        </Space>
      </div>
      <BasicTable :columns="columns" @register="registerTable" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Button } from '/@/components/Button';
  import { Space } from 'ant-design-vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { paymentSettingDetail } from '/@/api/finance/index';
  import { clientList } from '/@/views/common/commonSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';

  const { currencyTreeList } = useTreeListStore();
  const [registerDetails] = useModalInner(() => {});
  const selectedDevice = ref(24 as number);
  const activeKey = ref(currencyTreeList[0].value as any);
  const columns = ref<BasicColumn[]>([]);
  const innerClass = ref('innerClass' as any);
  const { t } = useI18n();

  const paymentList = ref([] as []);
  const [registerTable, { reload, setColumns, setTableData }] = useTable({
    api: getPaymentList,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
  });

  async function getPaymentList() {
    const response = await paymentSettingDetail({ currency_id: activeKey.value });
    paymentList.value = [];
    if (response) {
      paymentList.value = response;
      clickDvice(selectedDevice.value);
    }
  }

  async function changeActive(value) {
    activeKey.value = value;
    setTableData([]);
    setColumns([]);
    reload();
  }

  // 设置table头部
  function handleSetColumns(currentDeviceData) {
    let newColumns: any = [];

    if (currentDeviceData) {
      newColumns = currentDeviceData.table_list.map((item: any, index) => {
        return {
          title: item.title,
          dataIndex: item.type,
          width: 200,
          customRender: ({ record }) => {
            if (index > 0) {
              return h(
                'div',
                null,
                record[item.type].map((item, index) => {
                  return h(
                    'div',
                    { style: 'text-align: left; margin-left: 50px;' },
                    item ? `${index + 1}.${item}` : '-',
                  );
                }),
              );
            } else {
              return record[item.type].join();
            }
          },
        };
      });
    }
    setColumns(newColumns);
  }
  // 设置table内容
  function handleSetDataSource(currentDeviceData) {
    let dataSource: any = [];
    if (currentDeviceData) {
      currentDeviceData.table_list.forEach((item) => {
        if (item.list) {
          item.list.map((subItem, sIndex) => {
            let obj = {};
            obj[item.type] = '';
            if (dataSource.length < item.list.length) {
              dataSource.push(obj);
            }
            dataSource[sIndex][item.type] = subItem[item.type] ? subItem[item.type] : [''];
          });
        }
      });
    }
    setTableData(dataSource);
  }
  function clickDvice(value) {
    selectedDevice.value = value;
    const currentDeviceData: any = paymentList.value.find(
      (device: any) => device.device === selectedDevice.value,
    );
    setTableData([]);
    setColumns([]);
    if (currentDeviceData) {
      handleSetColumns(currentDeviceData);
      nextTick(() => {
        handleSetDataSource(currentDeviceData);
      });
    }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-radio-button-wrapper:first-child) {
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper:last-child) {
    border-left-width: 1px;
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    border-left-width: 1px;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    width: 88px;
    border-left-width: 1px solid #d9d9d9;
    text-align: center;
  }

  ::v-deep(.ant-space-item) {
    button {
      min-width: 100px;
    }
  }

  ::v-deep(.changeCurrency .inner-button) {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
