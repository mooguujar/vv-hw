<template>
  <PageWrapper :contentStyle="{ margin: '20px' }">
    <Tabs
      v-model:activeKey="tabValue"
      class="capsule_tap"
      :destroyInactiveTabPane="true"
      v-if="validTab.length > 0"
    >
      <template #rightExtra v-if="tabValue == '3'">
        <!-- <a-button type="link">
          {{ t('common.settlement_timezone') }}：{{ t('common.Universal') }}</a-button
        > -->
        <p
          >{{ t('common.settlement_timezone') }}:<span style="color: #1475e1">{{
            t('common.Universal')
          }}</span></p
        >
      </template>
      <template v-for="(item, index) in validTab">
        <TabPane :tab="item.label" v-if="isHasAuth(item.id)" :key="item.key">
          <component v-if="item.key === 2" :is="item.component" @on-click="toAccountRecords" />
          <component v-if="item.key === 4" :is="item.component" :creditData="creditData" />
          <component v-if="item.key !== 4 && item.key !== 2" :is="item.component" />
        </TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts" name="SiteSettings">
  import { ref, watch, defineAsyncComponent, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';

  const SiteInformation = defineAsyncComponent(
    () => import('./components/SiteInformation/index.vue'),
  );
  const SiteCredit = defineAsyncComponent(() => import('./components/SiteCredit/index.vue'));
  const SiteBill = defineAsyncComponent(() => import('./components/SiteBill/index.vue'));
  const AccountRecords = defineAsyncComponent(
    () => import('./components/AccountRecords/index.vue'),
  );
  const RechargeOrder = defineAsyncComponent(() => import('./components/RechargeOrder/index.vue'));
  const ChargingStandard = defineAsyncComponent(
    () => import('./components/ChargingStandard/index.vue'),
  );

  const { t } = useI18n();

  const navList: any = [
    {
      label: t('table.system.system_table_top_site_information'),
      key: 1,
      component: SiteInformation,
      id: '70916',
      ifShow: isHasAuth('70916'),
    },
    {
      label: t('table.system.system_table_top_site_credit'),
      key: 2,
      component: SiteCredit,
      id: '70917',
      ifShow: isHasAuth('70917'),
    },
    {
      label: t('table.system.system_table_top_site_bill'),
      key: 3,
      component: SiteBill,
      id: '70918',
      ifShow: isHasAuth('70918'),
    },
    {
      label: t('table.system.system_table_top_account_change_record'),
      key: 4,
      component: AccountRecords,
      id: '70919',
      ifShow: isHasAuth('70919'),
    },
    {
      label: t('table.system.system_table_top_top_up_order'),
      key: 5,
      component: RechargeOrder,
      id: '70920',
      ifShow: isHasAuth('70920'),
    },
    {
      label: t('table.system.system_table_top_charging_standard'),
      key: 6,
      dataKey: 'customer',
      component: ChargingStandard,
      id: '70921',
      ifShow: isHasAuth('70921'),
    },
  ];

  const { query } = useRoute();
  const tabValue: any = ref(1);
  const validTab = ref<any>([]);
  const creditData = ref('');

  watch(tabValue, (nval, oval) => {
    if (nval !== 3 && oval !== 2) {
      creditData.value = '';
    }
  });
  const toAccountRecords = (data) => {
    creditData.value = JSON.stringify(data);
    tabValue.value = 4;
  };

  onMounted(() => {
    const validList = navList.filter((item) => isHasAuth(item.id));
    validTab.value = validList;
    if (validList.length > 0) {
      tabValue.value = validList?.[0]?.key;
    }
  });
</script>
<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 12px !important;
  }

  ::v-deep(.vben-basic-table-form-container) {
    padding: 0 !important;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding: 0 0 10px;
  }
</style>
