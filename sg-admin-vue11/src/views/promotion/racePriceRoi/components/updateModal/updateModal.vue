<template>
  <div
    class="updateCountModal venuesClassZoom"
    :class="[clickType == 'detail' ? 'updateCountModal--active' : '']"
    ref="main"
  >
    <BasicModal
      @register="registerUpdateModal"
      :title="titleName"
      v-bind="$attrs"
      @ok="okSubmit"
      :width="activeWidth"
      :okText="t('table.promotion.promotion_confirm_update')"
      cancelText=""
      :destroyOnClose="true"
      :okButtonProps="{ style: { display: clickType == 'detail' ? 'none' : '' } }"
      :getContainer="() => $refs.main"
    >
      <div v-if="clickType == 'update'" class="flex items-center justify-center w-full mb-2">
        <Tabs v-model:activeKey="activeKey" class="capsule_tap">
          <TabPane v-for="item in navList" :tab="item.label" :key="item.value" />
        </Tabs>
      </div>
      <BasicForm @register="registerFromUpdate" v-show="activeKey == 'money'" />
      <div v-show="activeKey == 'detail'">
        <updateTableModal :recordList="recordList" />
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message, Tabs, TabPane } from 'ant-design-vue';
  import { computed, defineEmits, ref } from 'vue';
  import { schemas } from './data';
  import updateTableModal from './updateTableModal.vue';
  import { postAdBidsUpdate } from '/@/api/promotion';

  const { t } = useI18n();

  const emit = defineEmits(['activeSuccess', 'register']);
  const activeKey = ref('money');
  const clickType = ref('update');
  const recordList = ref<any>();

  const navList = [
    { label: t('table.promotion.promotion_update_amount'), value: 'money' },
    { label: t('table.promotion.promotion_details'), value: 'detail' },
  ];
  const titleName = computed(() =>
    activeKey.value == 'detail'
      ? t('table.promotion.promotion_details')
      : t('modalForm.member.member_authorized_update'),
  );
  const [registerUpdateModal, { closeModal }] = useModalInner(async (data) => {
    const { type, data: _data } = data;
    clickType.value = type;
    recordList.value = _data;

    if (type == 'detail') {
      activeKey.value = 'detail';
    }
    if (type == 'update') {
      activeKey.value = 'money';
      setFieldsValue({
        g_name: _data?.g_name || '-',
        username: _data?.username,
        currentPayment: _data?.prepay,
        currentConsumption: _data?.consume,
        currentServiceU: _data?.fee,
      });
    }
  });

  const [registerFromUpdate, { validate, setFieldsValue, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 'auto',
    baseColProps: { span: 24 },
  });

  const activeWidth = computed(() => (activeKey.value == 'money' ? 800 : 1000));
  async function okSubmit() {
    const formValue = await validate(['prepay', 'consume', 'fee', 'username']);
    formValue.gid = recordList.value.gid.toString();
    const { prepay, consume, fee, username } = formValue;

    if (prepay || consume || fee || username) {
      const param = {
        username: recordList.value.username,
        channel_id: recordList.value.channel_id,
        ...formValue,
      };
      const { status } = await postAdBidsUpdate(param);
      if (status) {
        closeModal();
        resetFields();
        message.success(t('layout.setting.operatingTitle'));
        emit('activeSuccess');
      } else {
        message.warn(t('table.promotion.promotion_update_tips'));
      }
    } else {
      return message.warn(t('table.promotion.promotion_update_tips'));
    }
  }
</script>
<style lang="scss" scoped>
  .updateCountModal {
    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      height: auto !important;
      line-height: 40px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding: 24px 35px 0;
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
  }

  .updateCountModal--active {
    ::v-deep(.ant-modal-footer) {
      padding: 0 16px;
    }
  }
</style>
