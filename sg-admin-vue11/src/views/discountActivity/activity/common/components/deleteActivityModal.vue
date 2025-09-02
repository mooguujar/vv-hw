<template>
  <BasicModal
    @register="registerBasicModal"
    :width="400"
    :minHeight="50"
    :cancelText="t('business.common_cancel')"
    :okText="t('common.sure')"
    :title="t('table.discountActivity.delete_activity')"
    @ok="handleSubmit"
  >
    <div class="flex flex-row items-center justify-center">
      <Icon
        class="text-2xl text-center"
        type="exclamation-circle"
        theme="filled"
        style="color: #faad14"
      /><span class="text-center text-lg">
        {{ t('common.activity_delete_confirm', { name: activityName }) }}
      </span>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { removePromoCategory } from '/@/api/activity';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ref } from 'vue';
  import Icon from '/@/components/Icon/Icon.vue';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const activityName = ref('');
  const promoId = ref('');
  const categoryId = ref('');
  const emits = defineEmits(['remove-success', 'register']);
  const [registerBasicModal, { closeModal }] = useModalInner((data) => {
    activityName.value = data.zh_name;
    promoId.value = data.id;
    categoryId.value = data.category_id;
  });
  async function handleSubmit() {
    try {
      const params = {
        promo_id: promoId.value,
        category_id: categoryId.value,
      };
      const { data } = await removePromoCategory(params);
      if (data) {
        emits('remove-success');
        closeModal();
      } else {
        createMessage.error(t('common.translate.word8'));
      }
    } catch (error) {
      console.error('移除分类失败');
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep(.scroll-container .scrollbar__view > div) {
    min-height: 100px !important;
    max-height: 100px !important;
  }
</style>
