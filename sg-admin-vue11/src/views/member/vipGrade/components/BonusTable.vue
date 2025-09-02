<template>
  <div>
    <Space :size="10" class="mb-20px">
      <Tabs v-model:activeKey="cashTypeId" class="capsule_tap" :destroyInactiveTabPane="true">
        <TabPane v-for="item in typeItems" :tab="item.name" :key="item.id" />
      </Tabs>
    </Space>
    <KeepAlive>
      <component :is="activeComponent" />
    </KeepAlive>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import PromotTable from './PromotTable.vue';
  import MonthTable from './MonthTable.vue';
  import WeekTable from './WeekTable.vue';
  import DayTable from './DayTable.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Space, Tabs, TabPane } from 'ant-design-vue';

  const { t } = useI18n();
  const cashTypeId = ref<string>('818');
  interface TypeItem {
    id: String;
    name: String;
    component: String;
  }

  const typeItems = ref<TypeItem[]>([
    { id: '818', component: 'PromotTable', name: t('table.member.member_promotion_gift') },
    { id: '821', component: 'MonthTable', name: t('table.member.member_every_month') },
    { id: '820', component: 'WeekTable', name: t('table.member.member_every_week') },
    { id: '819', component: 'DayTable', name: t('table.member.member_every_day') },
  ]);

  const activeComponent = computed(() => {
    const componentName = typeItems.value.find((item) => item.id == cashTypeId.value)?.component;
    switch (componentName) {
      case 'PromotTable':
        return PromotTable;
      case 'MonthTable':
        return MonthTable;
      case 'WeekTable':
        return WeekTable;
      case 'DayTable':
        return DayTable;
      default:
        return PromotTable;
    }
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
</style>
