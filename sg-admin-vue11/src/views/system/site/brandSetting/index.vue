<template>
  <NoData
    class="mt-10"
    v-if="
      !auths([
        '70901',
        '70902',
        '70903',
        '70904',
        '70905',
        '70906',
        '70907',
        '70909',
        '70927',
        '70926',
      ])
    "
  />
  <PageWrapper :contentStyle="{ margin: '20px' }" v-else>
    <div>
      <Tabs
        v-if="validList.length > 0"
        v-model:activeKey="tabValue"
        class="tabs capsule_tap"
        :destroyInactiveTabPane="true"
      >
        <template v-for="(item, index) in navList">
          <TabPane v-if="isHasAuth(item.id)" :tab="item.label" :key="item.dataKey">
            <component :is="item.component" :detailInfo="detailInfo" :id="detailInfo.id" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </PageWrapper>
</template>
<script setup lang="ts" name="BrandSetting">
  import { defineAsyncComponent, onMounted, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import pcSetting from './components/pcSetting.vue';
  import appSetting from './components/appSetting.vue';
  import NoData from '/@/views/sys/noData/index.vue';
  import { auths, isHasAuth } from '/@/utils/authFunction';

  const thirdSiteForm = defineAsyncComponent(
    () => import('./components/ThirdSettings/thirdSiteForm.vue'),
  );
  const RegisterSettings = defineAsyncComponent(
    () => import('./components/RegisterSettings/registerSiteForm.vue'),
  );
  const serviceSiteForm = defineAsyncComponent(
    () => import('./components/ServiceSettings/serviceSiteForm.vue'),
  );
  const SmtpSettings = defineAsyncComponent(
    () => import('./components/SmtpSettings/smtpSiteForm.vue'),
  );
  const baseSiteForm = defineAsyncComponent(
    () => import('./components/BasicSettings/baseSiteForm.vue'),
  );

  const footerSettingLink = defineAsyncComponent({
    loader: () => import('./components/footerSettingNew/footerSetting.vue'),
    // loadingComponent: Loading, /* 在加载时显示 */
    // errorComponent: ErrorComponent, /* 显示是否有错误 */
    delay: 100 /* 在显示加载组件之前延迟毫秒 */,
    // timeout: 3000 /* 这个毫秒之后的超时 */
  });
  const appDownLoad = defineAsyncComponent(
    () => import('./components/appDownLoad/AppDownLoad.vue'),
  );
  const AppApiDomain = defineAsyncComponent(
    () => import('./components/appApiDomain/AppApiDoamin.vue'),
  );

  const { t } = useI18n();

  const navList = [
    {
      label: t('table.system.system_basic_setup'),
      key: 1,
      dataKey: 'base',
      component: baseSiteForm,
      id: '70901',
    },
    {
      label: t('table.system.system_tripartite_setup'),
      key: 2,
      dataKey: 'third',
      component: thirdSiteForm,
      id: '70902',
    },
    {
      label: t('table.system.system_registration_settings'),
      key: 3,
      dataKey: 'reg',
      component: RegisterSettings,
      id: '70903',
    },
    {
      label: t('table.system.system_customer_service_settings'),
      key: 4,
      dataKey: 'customer',
      component: serviceSiteForm,
      id: '70904',
    },
    {
      label: t('table.system.system_SMTP_settings'),
      key: 7,
      dataKey: 'smtp',
      component: SmtpSettings,
      id: '70905',
    },
    {
      label: t('table.system.system__PC_Settings'),
      key: 8,
      dataKey: 'pc',
      component: pcSetting,
      id: '70906',
    },
    {
      label: t('table.system.system_app_settings'),
      key: 9,
      dataKey: 'app',
      component: appSetting,
      id: '70907',
    },
    {
      label: t('table.system.system_app_update'),
      key: 10,
      dataKey: 'appDown',
      component: appDownLoad,
      id: '70927',
    },
    {
      label: t('table.system.system_api_domain_name'),
      key: 11,
      dataKey: 'api_domain',
      component: AppApiDomain,
      id: '70926',
    },
    // {
    //   label: t('table.system.system_regional_restriction'),
    //   key: 10,
    //   dataKey: 'area',
    //   component: localSetting,
    //   id: '70908',
    // },
    {
      label: t('table.system.system_page_end_setting'),
      key: 13,
      dataKey: 'bottom',
      component: footerSettingLink,
      id: '70909',
    },
  ];
  const tabValue = ref<string>('base');
  const detailInfo = ref<any>({});
  const validList = ref<typeof navList>([]);
  onMounted(() => {
    const res = navList.filter((item) => isHasAuth(item.id));
    validList.value = res;
    tabValue.value = res?.[0]?.dataKey;
  });
</script>

<style lang="less">
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }

  .ant-tabs-nav-operations {
    display: none !important;
  }
</style>
