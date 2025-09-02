<template>
  <BasicModal
    @register="registerBasicModal"
    :width="400"
    :minHeight="50"
    :destroyOnClose="true"
    :cancelText="$t('business.common_cancel')"
    :okText="$t('common.sure')"
    :title="t('table.discountActivity.mission_classify')"
    @ok="handleSubmit"
  >
    <BasicForm :size="FORM_SIZE" @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { addActivityClassify } from './addActivityClassify.data';
  import { insertPromoCategory } from '/@/api/activity';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref } from 'vue';

  const FORM_SIZE = useFormSetting().getFormSize;
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const lang = ref('');

  const emits = defineEmits(['add-success', 'register']);
  /** 新增分类 */
  const [registerForm, { validate }] = useForm({
    schemas: addActivityClassify,
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: { span: 24 },
  });

  const [registerBasicModal, { closeModal }] = useModalInner((data) => {
    lang.value = data.lang;
  });
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    try {
      const params = {
        ...values,
        lang: lang.value,
      };
      const { data } = await insertPromoCategory(params);
      if (data) {
        emits('add-success');
        closeModal();
      } else {
        createMessage.error(t('common.translate.word7'));
      }
    } catch (error) {
      console.error('新增分类失败，请重新输入');
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep(.scroll-container .scrollbar__view > div) {
    min-height: 100px !important;
    max-height: 100px !important;
  }
</style>
