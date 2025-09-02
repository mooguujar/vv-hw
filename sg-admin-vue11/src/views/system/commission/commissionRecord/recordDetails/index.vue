<template>
  <PageWrapper :title="`${username}  ${$t('table.system.system_commission_details')}`">
    <BasicTable @register="registerRecord">
      <template #commissionSlots="{ record }">
        <span class="cursor-pointer">{{ record.commission_amount_total }}</span>
      </template>
      <template #usernameSlot="{ record }">
        <span>{{ record.username }}</span>
      </template>
      <template #currency_id="{ record }">
        <div v-if="record.currency_id">
          <cdIconCurrency :icon="currentyOptions[record.currency_id]" class="w-20px mr-5px" />
          {{ currentyOptions[record.currency_id] }}
        </div>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="RecordDetails">
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { columns } from '../commissionDetails/index.data.ts';
  import { getRecordList } from '/@/api/commission/index';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { currentyOptions } from '/@/views/common/commonSetting';

  const username = ref('' as any);
  username.value = history.state.username;
  const [registerRecord] = useTable({
    api: getRecordList,
    columns,
    bordered: true,
    showIndexColumn: false,
    beforeFetch: (paramas) => {
      paramas['username'] = username.value;
    },
  });
</script>
