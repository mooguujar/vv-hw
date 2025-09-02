<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicModal
      :okText="$t('business.common_ok')"
      cancelText=""
      @ok="closeModal"
      :title="$t('table.member.member_history')"
      :width="800"
      @register="registerHistory"
    >
      <BasicTable @register="registerHistoryTable" />
    </BasicModal>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns } from './loginHistory.data';
  import { loginList } from '/@/api/member/index.ts';

  const username = ref('' as string);
  const [registerHistory, { closeModal }] = useModalInner((list) => {
    username.value = list.username;
    reload();
  });
  const [registerHistoryTable, { reload }] = useTable({
    api: loginList,
    bordered: true,
    canResize: true,
    columns,
    showIndexColumn: false,
    immediate: false,
    beforeFetch: (params) => {
      params['search_type'] = 1;
      params['username'] = username.value;
    },
  });
</script>
