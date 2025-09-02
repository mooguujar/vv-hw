<template>
  <div class="child flex justify-between">
    <div class="flex">
      <Tooltip v-if="getDateDiff?.name?.length > 10" placement="top">
        <template #title>
          <span>{{ getDateDiff?.name }}</span>
        </template>
        <div class="textChild">{{ getDateDiff?.name }}</div>
      </Tooltip>
      <div v-else class="textChild">{{ getDateDiff.name }}</div>
      <div>
        <span
          :class="[getDateDiff.child_count ? 'cursor block min-w-3' : '']"
          @click="handleChildDomind(getDateDiff)"
        >
          ({{ getDateDiff.child_count }})
        </span>
      </div>
    </div>
    <div>
      <CopyOutlined
        class="btnClass m-t-1 m-l-2 primary-color"
        @click="handleCopy(getDateDiff.name)"
      />
      <RedoOutlined
        class="btnClass m-t-0.8 m-l-2 primary-color cursor-pointer"
        @click="handleReload"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, unref, watchEffect, watch, computed } from 'vue';
  import { Tooltip, message } from 'ant-design-vue';
  import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import eventBus from '/@/utils/eventBus';

  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const { t } = useI18n();
  // const getDateDiff = ref({} as any);
  const props = defineProps({
    records: {
      type: Object,
      defalut: { name: '' },
    },
  });
  // onMounted(() => {
  //   getDateDiff.value = props.records;
  // });

  const getDateDiff = computed(() => props.records);
  // watch(props.records, (v) => {
  //   getDateDiff.value = v;
  // });

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
  function handleChildDomind(record) {
    if (record.child_count) {
      eventBus.emit('ChildDomindModal', record);
    }
  }
  function handleReload() {
    eventBus.emit('handleLoad');
  }
</script>

<style scoped lang="less">
  .child {
    width: 156px;
    margin: auto;

    .textChild {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .cursor {
      color: @primary-color;
      cursor: pointer;
    }
  }

  .child > div:first-child {
    width: auto;
    font-size: 14px;
    text-align: left;

    .textChild {
      position: relative;
      width: auto;
      max-width: 80px;
      float: left;
    }

    span {
      display: inline-block;
      position: relative;
      float: left;
    }
  }
</style>
