<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>

<script lang="ts" setup>
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  import { columns } from './index.data';

  const [registerTable] = useTable({
    //api: demoListApi,
    columns: columns,
    bordered: true,
    actionColumn: {
      width: 250,
      title: 'Action',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
</script>
