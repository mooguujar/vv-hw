<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <PageWrapper :contentStyle="{ paddingLeft: '10px', margin: '10px' }">
    <Tabs v-model:activeKey="activeTableKey" class="capsule_tap" :destroyInactiveTabPane="true">
      <template v-for="item in gameTabList" :key="item.key">
        <TabPane :tab="item.value">
          <ApiTable :apiMap="{ ...apiMap, modalType: item.key }" />
        </TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts">
  import { Tabs } from 'ant-design-vue';
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { baseColumns } from './platformManage.data';
  import ApiTable from './component/ApiTable.vue';

  import { getPlatformSearch } from '/@/api/sys/index';
  import { useGameTabList } from '/@/views/common/commonSetting';

  export default defineComponent({
    name: 'PlatformManageNocash',
    components: {
      Tabs,
      TabPane: Tabs.TabPane,
      ApiTable,
      PageWrapper,
    },
    setup() {
      const activeTableKey = ref('4');

      const apiMap = {
        list: getPlatformSearch,
        columns: baseColumns,
      };
      const { gameTabList } = useGameTabList();
      return {
        activeTableKey,
        apiMap,
        gameTabList,
      };
    },
  });
</script>
<style lang="less" scoped>
  .pay-bottom {
    padding: 10px;
    border-radius: 3px;
    background-color: @component-background;
  }
</style>
