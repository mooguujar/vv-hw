<template>
  <PageWrapper :contentStyle="{ marginTop: '10px' }" class="LayoutTable">
    <Tabs v-model:activeKey="tabValue" @change="tabValueChange" class="capsule_tap">
      <template v-for="(item, index) in navList">
        <TabPane :key="item.key" v-if="isHasAuth(item.id)">
          <template #tab>
            <span>{{ item.label }}</span>
            <div
              v-if="item.key == 3 && reviewCountsTotal > 0"
              class="absolute right-0 top-[5px] bg-[#E91134] rounded-[80px] text-3 min-w-24px text-[#FFF] leading-normal text-center translate-x-1/2 -translate-y-1/2 z-1"
            >
              {{ reviewCountsTotal }}
            </div>
          </template>
          <component :is="item.component" />
        </TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { onMounted, ref, watchEffect } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import closeActivelist from './components/closeActivelist/index.vue';
  import reviewList from './components/reviewList/index.vue';
  import activeUserList from './components/activeUserList/index.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '@/utils/authFunction';
  import { useNoticeStore } from '/@/store/modules/notice';
  import { useRoute } from 'vue-router';

  const { t } = useI18n();
  const noticeStore = useNoticeStore();
  const reviewCountsTotal = ref(0);

  const navList = [
    {
      label: t('table.discountActivity.discount_activity_list'), //活动列表
      key: 1,
      id: '40201',
      component: activeUserList,
    },
    {
      label: t('table.discountActivity.discount_close_activity'), //已关闭活动
      key: 2,
      id: '40201',
      component: closeActivelist,
    },
    {
      label: t('table.discountActivity.discount_examine'),
      id: '40603',
      key: 3,
      component: reviewList,
    },
  ];
  const route = useRoute();

  const tabValue = ref<any>(1);
  onMounted(() => {
    noticeStore.initReviewCounts();
    tabValue.value = route.query.tabValue
      ? +route.query.tabValue
      : isHasAuth('40201')
      ? 1
      : isHasAuth('40603')
      ? 3
      : 0;
  });

  watchEffect(() => {
    reviewCountsTotal.value = noticeStore?.getReviewCounts?.total || 0;
  });
  const tabValueChange = (e) => {
    // tabValue.value = e;
  };
</script>

<style lang="less" scoped>
  .tabs {
    border-radius: 3px;
    background-color: @component-background;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 0 10px 10px;
  }

  ::v-deep(.vben-page-wrapper-content) {
    margin: 10px;
  }
</style>
