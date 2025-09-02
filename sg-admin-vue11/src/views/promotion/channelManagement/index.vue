<template>
  <div>
    <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable">
      <Tabs
        v-model:activeKey="activeKey"
        class="capsule_tap"
        :destroyInactiveTabPane="true"
        @tab-click="handleChangeTab"
      >
        <TabPane v-for="(item, index) in navList" :tab="item.label" :key="index">
          <component
            :is="item.component"
            @update-event="onUpdateEvent"
            :search_data="search_data"
          />
        </TabPane>
      </Tabs>
      <channelLink />
    </PageWrapper>
  </div>
</template>

<script setup lang="ts" name="ChannelManagementNocash">
  import { ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import channelLink from '@/views/promotion/channelManagement/components/channelLink/index.vue';
  import channelStatistics from '@/views/promotion/channelManagement/components/channelStatistics/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const navList = [
    {
      label: t('table.promotion.promotion_tunnel_link'), //渠道链接
      key: 0,
      component: channelLink,
    },
    {
      label: t('table.promotion.promotion_tunnel_sum'), //渠道统计
      key: 1,
      component: channelStatistics,
    },
  ];
  const activeKey = ref<number>(0);
  const search_data = ref<any>();

  function onUpdateEvent(data) {
    search_data.value = data;
    activeKey.value = 1;
  }
  function handleChangeTab() {
    search_data.value = null;
  }
  // 页面加缓存
  onMounted(() => {
    // if (history.state.back == '/promotion/channel_management/channel_by_name') {
    //   activeKey.value = 1;
    //   if (history.state.username) {
    //     search_data.value = { username: history.state.username };
    //   }
    // }
  });
</script>
<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px !important;
  }
</style>
