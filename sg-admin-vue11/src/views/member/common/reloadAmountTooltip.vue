<template>
  <Tooltip placement="bottom" overlayClassName="ad-tooltip">
    <template #title>
      <div class="flex flex-colunms">
        <span
          class="cursor flex justify-center items-center border-b-light p-10px"
          @click="hadnleRealodAmount(record)"
        >
          <ReloadOutlined :class="['mr-2', { 'load-animation': loadingAmount }]" />{{t('common.redo')}}
        </span>
        <div class="flex">
          <span class="border-r-light p-10px flex-1"
            >{{ labelName_pre || labelName_pre_ }}: {{ labelValue_pre }}</span
          >
          <span class="p-10px flex-1"
            >{{ labelName_suf || labelName_suf_ }}: {{ labelValue_suf }}</span
          >
        </div>
      </div>
    </template>
    <span class="primary-color">{{ labelValue_pre }}</span>
  </Tooltip>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tooltip } from 'ant-design-vue';
  import { ReloadOutlined } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const labelName_pre_ = ref(t('table.member.member_wallet_balance'));
  const labelName_suf_ = ref(t('table.member.member_diamond_balance'));
 

  defineProps({
    labelName_pre: {
      type: String,
      default: '',
    },
    labelValue_pre: {
      type: String,
      default: '0',
    },
    labelName_suf: {
      type: String,
      default: '',
    },
    labelValue_suf: {
      type: String,
      default: '0',
    },
    record: {
      type: Object,
      default: () => ({}),
    },
  });
  const emit = defineEmits(['reload:amount']);
  // 中心钱包刷新加载
  const loadingAmount = ref(false);
  // 单点刷新中心钱包
  async function hadnleRealodAmount(record) {
    loadingAmount.value = true;
    emit('reload:amount', record);
    setTimeout(() => {
      loadingAmount.value = false;
    }, 600);
  }
</script>

<style scoped>
  .load-animation {
    animation: loadingCircle 1s infinite linear;
  }
</style>

<style lang="less">
  .ad-tooltip {
    .ant-tooltip-inner {
      width: 300px;
    }
  }
</style>
