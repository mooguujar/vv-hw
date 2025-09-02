<template>
  <div>
    <div class="m-0 flex" v-for="(item, index) in getList" :key="index">
      <p class="w-36 textChild">
        <Tooltip placement="top">
          <template #title>
            <span class="cursor-pointer">{{ item.name }}</span>
          </template>
          <span class="nds-text">{{ item.value }}: {{ item.name }}</span>
        </Tooltip>
      </p>
      <CopyOutlined class="btnClass m-t-1 primary-color" @click="handleCopy(item.name)" />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted, unref } from 'vue';
  import { Tooltip, message } from 'ant-design-vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const getList = ref([] as any);
  const props = defineProps({
    serverList: {
      type: Array,
      defalut: [],
    },
  });
  function handleCopy(value) {
    if (!value) {
      message.warning(t('business.common_copy_tip'));
      return;
    }
    clearClipboard();
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      message.success(t('business.common_copy_suceess'));
    }
  }
  onMounted(() => {
    getList.value = props.serverList;
  });
</script>

<style scoped>
  .textChild {
    text-indent: 20px;
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
  }
  .nds-text {
    font-size: 13px;
  }
</style>
