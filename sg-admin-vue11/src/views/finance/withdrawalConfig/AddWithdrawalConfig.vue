<template>
  <PageWrapper :title="title" :contentStyle="{ margin: '10px' }">
    <div class="bg-white">
      <main class="py-4">
        <ApiConfigForm :apiMap="apiMap" />
      </main>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import ApiConfigForm from '/@/views/finance/common/component/form/ApiConfigForm.vue';
  import { schemas } from './withdrawalConfig.data';
  import { useRoute } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';

  export default defineComponent({
    name: 'AddWithdrawalConfig',
    components: {
      PageWrapper,
      ApiConfigForm,
    },
    setup() {
      let title = ref('');
      const { t } = useI18n();
      const route = useRoute();
      title.value =
        route.params.modalType === 'editor'
          ? t('table.finance.finance_editor_payment')
          : t('table.finance.finance_add_payment');
      return {
        apiMap: {
          schemas: schemas,
        },
        title,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-page-header) {
    right: 0 !important;
    background: transparent;
  }

  ::v-deep(.vben-page-wrapper-content) {
    margin-right: 0 !important;
    margin-left: 20px !important;
    border-radius: 6px !important;

    .bg-white {
      padding-left: 20px !important;
    }
  }

  ::v-deep(.ant-page-header-heading-title) {
    font-size: 18px !important;
  }

  ::v-deep(.anticon-arrow-left) {
    svg {
      display: none !important;
    }
  }

  ::v-deep(.anticon-arrow-left::before) {
    content: '';
    display: inline-block;
    width: 9px;
    height: 14px;
    background-image: url('/@/assets/images/btn-left.webp');
    background-size: 100%;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    min-width: 100px !important;
    margin-right: 20px;
    border-radius: 4px !important;
    box-shadow: none !important;
    text-align: center !important;
  }

  ::v-deep(.ant-radio-button-wrapper::before) {
    display: none !important;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    border-left-width: 1px;
  }

  ::v-deep(.ant-form-item-control-input-content) {
    .bg-white {
      padding-left: 0 !important;

      .whitespace-nowrap {
        // width: calc(100vw - 380px);
      }
    }
  }

  ::v-deep(.app-iconify) {
    &.close {
      svg {
        display: none;
      }
    }

    &.close::before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 16px;
      background-image: url('/@/assets/images/close-iconfy.webp');
      background-size: 100%;
    }
  }

  ::v-deep(.anticon-plus-circle) {
    svg {
      display: none;
    }
  }

  ::v-deep(.anticon-plus-circle)::before {
    content: '';
    display: inline-block;
    width: 29px;
    height: 29px;
    background-image: url('/@/assets/images/plus-circle.webp');
    background-size: 100%;
  }

  ::v-deep(.ant-col-4) {
    button {
      position: absolute;
      top: 0;
      left: 100px;
    }
  }

  ::v-deep(.ant-page-header) {
    padding-top: 10px !important;
  }
</style>
