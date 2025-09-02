<template>
  <PageWrapper
    :title="$t('table.system.system_add_announcement')"
    :contentStyle="{ margin: '20px', marginTop: '10px', borderRadius: '6px' }"
  >
    <div class="bg-white">
      <main class="p-4">
        <AnnouncementForm :isEdit="false" />
      </main>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import AnnouncementForm from './announcementform.vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    name: 'AddAnnouncementNoCash',
    components: {
      PageWrapper,
      AnnouncementForm,
    },
    setup() {
      return {};
    },
  });
</script>
<style leng="less" scoped>
  ::v-deep(.ant-page-header) {
    background-color: transparent !important;
  }

  ::v-deep(.ant-page-header-back-button > span > svg) {
    display: none;
  }

  ::v-deep(.ant-page-header-back-button::before) {
    content: ' ';
    display: inline-block;
    width: 9.1px;
    height: 14px;
    background: no-repeat;
    background-image: url('/@/assets/images/btn-left.webp');
    background-size: 100%;
    vertical-align: middle;
  }

  ::v-deep(.ant-page-header-heading-title) {
    color: #444;
    font-size: 18px;
    font-size: 500;
    line-height: 18px;
  }

  ::v-deep(.app-iconify) {
    display: none !important;
  }

  ::v-deep(.vben-basic-help::before) {
    content: ' ';
    display: inline-block;
    width: 14px;
    height: 14px;
    background: no-repeat;
    background-image: url('/@/assets/images/help.form.title.webp');
    background-size: 100%;
    vertical-align: middle;
  }

  ::v-deep(.ant-form-item-label) {
    text-align: left;
  }

  ::v-deep(.ant-form-item-no-colon) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep(.ant-form-item-no-colon > span) {
    display: inline-block;
    position: relative;
    /* width: 113px;*/
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep(.vben-page-wrapper > .vben-page-wrapper-content) {
    margin-top: 0;
    margin-left: 0;
  }

  ::v-deep(.t-form-large-size) {
    padding-left: 44px !important;
  }

  ::v-deep(.t-form-large-size:nth-child(2)) {
    padding-left: 30px !important;
  }

  ::v-deep(.t-form-large-size:nth-child(2) > .ant-form-item > .ant-form-item-control) {
    padding-left: 15px;
  }

  ::v-deep(.t-form-large-size:nth-child(11)) {
    padding-left: 13px !important;
  }

  ::v-deep(.t-form-large-size:nth-child(12) > .ant-form-item > .ant-form-item-label) {
    padding-left: 10px !important;
  }

  ::v-deep(.ant-form-item-label > label > div),
  ::v-deep(.ant-form-item-label > label > span > div) {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ::v-deep(.ant-form-item-label > label > span > div) {
    width: 86px;
  }
</style>
