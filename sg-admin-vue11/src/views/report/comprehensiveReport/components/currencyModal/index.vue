<template>
  <BasicModal
    v-bind="$attrs"
    :width="800"
    :minHeight="150"
    @register="registerModal"
    :title="$t('modalForm.member.member__currency_tip_1')"
    @ok="handleSubmit"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
  >
    <div>
      <RadioGroup
        class="currentListGroup"
        v-model:value="currency_id"
        button-style="solid"
        @change="changeClick"
      >
        <RadioButton v-for="(item, index) in currentList" :value="item.value" :key="item.value">
          {{ item.label }}
        </RadioButton>
      </RadioGroup>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { RadioGroup, RadioButton } from 'ant-design-vue';

  const { t } = useI18n();

  export default defineComponent({
    name: 'AddIpModal',
    components: { BasicModal, RadioGroup, RadioButton },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      let currency_id = ref('' as string);
      const currentList = ref([{ label: t('table.member.member_currency'), value: '' }] as any);

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        currency_id.value = data.currency_id;
        currentList.value = data.currentList;
      });

      async function handleSubmit() {
        try {
          closeModal();
          emit('success', currency_id.value);
        } catch (error) {
          console.error(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      function changeClick(v) {
        currency_id.value = v.target.value;
      }

      return { registerModal, handleSubmit, changeClick, currency_id, currentList };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-radio-button-wrapper) {
    margin-bottom: 10px;
  }

  .currentListGroup {
    ::v-deep(.ant-radio-button-wrapper:first-child) {
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper:last-child) {
      border-left-width: 1px;
      border-radius: 0;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      border-left-width: 1px;
    }

    ::v-deep(.ant-radio-button-wrapper) {
      width: 88px;
      border-left-width: 1px solid #d9d9d9;
      text-align: center;
    }
  }
</style>
