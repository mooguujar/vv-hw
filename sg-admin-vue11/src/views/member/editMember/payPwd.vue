<template>
  <BasicModal
    :title="setTitle"
    @register="registerModal"
    cancelText=""
    :okText="$t('common.okText')"
    :minHeight="30"
    width="450px"
    @ok="okFun"
    className="custom-modal"
  >
    <FormItem
      :style="{ marginBottom: '0px' }"
      :label="$t('table.member.member_new_password')"
      :label-col="{ style: { width: '130px' } }"
    >
      <Input disabled style="width: 200px" v-model:value="newpassWord">
        <template #suffix>
          <CopyOutlined @click="handleCopy(newpassWord)" />
        </template>
      </Input>
    </FormItem>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref, h, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm } from '/@/components/Form';
  import { Icon } from '/@/components/Icon';
  import { FormItem, Input, message } from 'ant-design-vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    components: { BasicModal, BasicForm, Icon, FormItem, Input, CopyOutlined },
    setup(props) {
      const setTitle = ref('' as any);
      const { createMessage } = useMessage();
      const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
      const { getFormSize } = useFormSetting();
      const FORM_SIZE = getFormSize;
      const newpassWord = ref('' as String);
      const [registerModal, { closeModal }] = useModalInner((data) => {
        newpassWord.value = data.passWordData;
        if (data.passWordData) {
          setTitle.value =
            data.key === 'login'
              ? t('table.member.member_login_success')
              : data.key === 'pay'
              ? t('table.member.member_google_success')
              : t('table.member.member_fund_success');
        }
      });
      function okFun() {
        closeModal(true);
      }
      function handleCopy(value) {
        if (!value) {
          createMessage.warning(t('business.common_copy_tip'));
          return;
        }
        clearClipboard();
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          createMessage.success(t('business.common_copy_suceess'));
        }
      }
      return { registerModal, setTitle, okFun, newpassWord, handleCopy, FORM_SIZE };
    },
  });
</script>

<style scoped lang="less">
  .custom-modal {
    ::v-deep(.ant-form-item) {
      margin-bottom: 0 !important;
    }
  }
</style>
