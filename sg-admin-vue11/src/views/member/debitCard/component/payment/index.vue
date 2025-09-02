<template>
  <div>
    <Tabs>
      <template v-for="item in achieveList" :key="item.key">
        <TabPane :tab="item.name">
          <component
            :is="componentsList[item.component]"
            :apiMap="item.apiMap"
            ref="componentRef"
          />
        </TabPane>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
  //import { ref } from 'vue';
  import { TabPane, Tabs } from 'ant-design-vue';

  import { pixColumns, searchFormSchema, vndFormSchema } from './payBplColumns.data';
  import { getOutpayList } from '/@/api/member/index';
  import onlineBankTable from './onlineBankTable.vue';

  let componentsList = {
    onlineBankTable,
  };
  const achieveList: any[] = [
    {
      key: '1',
      name: 'BPL',
      component: 'onlineBankTable',
      apiMap: {
        PAGE_TYPE: 'BPL', // 类型
        pageName: 'BPL', // table name
        type: 'bpl',
        columns: pixColumns,
        schemas: searchFormSchema,
        modalType: 1,
        list: getOutpayList, // 获取列表接口
        //delListItem: outPayDele, // 删除接口
      },
    },
    {
      key: '2',
      name: 'VND',
      component: 'onlineBankTable',
      apiMap: {
        PAGE_TYPE: 'VND', // 类型
        pageName: 'VND', // table name
        type: 'vnd',
        columns: pixColumns,
        schemas: vndFormSchema,
        modalType: 1,
        list: getOutpayList, // 获取列表接口
        //delListItem: outPayDele, // 删除接口
      },
    },
    {
      key: '3',
      name: 'CNY',
      component: 'onlineBankTable',
      apiMap: {
        PAGE_TYPE: 'CNY', // 类型
        pageName: 'CNY', // table name
        type: 'cny',
        columns: pixColumns,
        schemas: vndFormSchema,
        modalType: 1,
        list: getOutpayList, // 获取列表接口
        //delListItem: outPayDele, // 删除接口
      },
    },
    // {
    //   key: '4',
    //   name: 'RS',
    //   component: 'onlineBankTable',
    // },
    // {
    //   key: '5',
    //   name: 'VND',
    //   component: 'onlineBankTable',
    // },
    // {
    //   key: '6',
    //   name: 'THB',
    //   component: 'onlineBankTable',
    // },
  ];
</script>
