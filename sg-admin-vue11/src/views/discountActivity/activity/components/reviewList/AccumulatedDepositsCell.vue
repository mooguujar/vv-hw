<template>
  <div class="detail-table">
    <BasicTable
      :showIndexColumn="false"
      :dataSource="firstTableInfo"
      :columns="firstColumns"
      :pagination="false"
      class="mb-1"
    />
    <BasicTable
      :showIndexColumn="false"
      :dataSource="secondTableInfo"
      :columns="secondColumns"
      :pagination="paginationConfig"
      :scroll="{ y: 475 }"
      @change="handleTableChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import {
    getPromoInviteFriendsTotalDepositList,
    getPromoInviteFriendsValidBetList,
  } from '/@/api/activity/index';

  const props = defineProps(['record', 'firstColumns', 'secondColumns', 'type']);
  const currPageNum = ref(1);
  const firstTableInfo = ref([]);
  const secondTableInfo = ref([]);

  const paginationConfig = {
    showTotal: (total) => `共 ${total} 条数据`,
    pageSize: 10,
    showQuickJumper: false,
    showSizeChanger: false,
  };

  const handleTableChange = ({ current }) => {
    currPageNum.value = current;
    fetchTableData();
  };

  const fetchTableData = async () => {
    try {
      const api =
        props.type === 'deposit'
          ? getPromoInviteFriendsTotalDepositList
          : getPromoInviteFriendsValidBetList;

      const { total, d } = await api({
        page: currPageNum.value,
        page_size: 10,
        id: props.record.id,
      });

      firstTableInfo.value = total || [];
      secondTableInfo.value = d || [];
    } catch (e) {
      console.error('Error fetching table data:', e);
    }
  };

  onMounted(fetchTableData);
</script>

<style lang="less" scoped>
  .detail-table {
    padding: 10px;

    .mb-1 {
      margin-bottom: 5px;
    }
  }
</style>
