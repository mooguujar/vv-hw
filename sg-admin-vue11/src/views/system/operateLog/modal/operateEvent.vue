<template>
  <div class="operateEventClass" ref="main">
    <BasicModal
      @register="registerLimitModal"
      :title="$t('business.common_detail')"
      v-bind="$attrs"
      @ok="closeModal"
      :width="560"
      :okText="$t('table.system.system_qd_save')"
      cancelText=""
      :centered="true"
      :showCancelBtn="false"
      :bodyStyle="{ height: '600px' }"
      :getContainer="() => $refs.main"
    >
      <template #default>
        <ul>
          <li v-for="(item, index) of record" :key="index">{{ item }}</li>
        </ul>
      </template>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ref } from 'vue';

  const record = ref('');
  const [registerLimitModal, { closeModal, setModalProps }] = useModalInner((data) => {
    record.value = data.split('\n');
  });
</script>
<style lang="scss" scoped>
  .operateEventClass {
    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      width: 86px;
      height: auto !important;
      margin-right: 5px;
      line-height: 32px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding: 30px 35px 0;
    }

    ::v-deep(.ant-form-item-label) {
      width: 100px !important;
    }

    ::v-deep(.ant-modal-footer) {
      padding: 20px 16px;
    }

    ::v-deep(.ant-checkbox-group-item) {
      width: 72px;
      margin-right: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }

    ::v-deep(.ant-checkbox-group) {
      width: 290px;
    }

    ::v-deep(.ant-modal-body .scroll-container .scrollbar__wrap) {
      padding: 10px;
      border: 1px solid #dce3f1;
      border-radius: 4px;
    }
  }
</style>
