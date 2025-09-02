<template>
  <NoData class="mt-10" v-if="!auths(['70912', '70913'])"></NoData>
  <PageWrapper v-else :contentStyle="{ margin: '10px', marginBottom: 0 }">
    <div class="px-2 full">
      <Tabs
        v-if="validTab.length > 0"
        v-model:activeKey="tabValue"
        class="capsule_tap"
        @change="changesTab"
      >
        <template v-for="item in navList">
          <TabPane :tab="item.label" :key="item.key" v-if="isHasAuth(item.id)">
            <component
              :is="item.component"
              :bannerType="item.key"
              :key="item.key"
              ref="componentRef"
            />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts" name="SiteSettings">
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import chatTable from './chatTable.vue';
  import limitSpeakList from './limitSpeakList.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted, ref } from 'vue';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import NoData from '/@/views/sys/noData/index.vue';

  const { t } = useI18n();

  const navList = [
    {
      label: t('table.system.system_chat_history'),
      key: 1,
      component: chatTable,
      id: '70912',
    },
    {
      label: t('table.system.system_banlist'),
      key: 2,
      component: limitSpeakList,
      id: '70913',
    },
  ];
  const validTab = ref([]);

  const tabValue: any = ref(1);
  const componentRef = ref(null as any);
  onMounted(() => {
    const validList = navList.filter((item) => isHasAuth(item.id));
    validTab.value = validList;
    if (validList.length > 1) {
      tabValue.value = 1;
    } else {
      tabValue.value = validList?.[0]?.key;
    }
  });
  //切换刷新列表
  async function changesTab(val) {
    if (val === 1) {
      componentRef.value[0]?.handleSuccess();
    } else {
      componentRef.value[1]?.handleSuccess();
    }
  }
</script>
<style scoped lang="less">
  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding: 0 !important;
  }
</style>
