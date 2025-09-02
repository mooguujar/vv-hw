<template>
  <PageWrapper :contentStyle="{ margin: '10px' }" class="LayoutTable">
    <div class="px-2 py-2">
      <Tabs v-model:activeKey="defaultActiveKey" class="capsule_tap">
        <template v-for="item in tabItems" :key="item.key">
          <TabPane :tab="item.tab">
            <component :is="item.component" :bannerType="item.key" ref="componentRef" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs } from 'ant-design-vue';
  import bannerList from './component/bannerList.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRoute } from 'vue-router';

  const { t } = useI18n();
  export default defineComponent({
    name: 'CarouselListNocash',
    components: {
      Tabs,
      TabPane: Tabs.TabPane,
      PageWrapper,
      bannerList,
    },
    setup() {
      const defaultActiveKey = ref(1);
      const route = useRoute();
      if (route.query.bannerType) defaultActiveKey.value = Number(route.query.bannerType);
      const tabItems = ref([
        {
          key: 1,
          tab: t('business.banner_entertainment_city'), //娱乐城
          component: 'bannerList',
        },
        {
          key: 2,
          tab: t('business.banner_sport'), //体育
          component: 'bannerList',
        },
      ]);
      return {
        tabItems,
        defaultActiveKey,
      };
    },
  });
</script>
