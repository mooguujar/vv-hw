<script lang="ts" setup>
  import { Popover } from 'ant-design-vue';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

  interface Props {
    record: any;
    keyIndex: string;
  }

  const props = defineProps<Props>();

  const amount = computed(() => props.record[props.keyIndex]);
</script>

<template>
  <Popover placement="right" color="rgba(0,0,0,0.8)">
    <template #content>
      <div class="text-white text-center">
        <span>{{t('common.translate.word54')}}：<span class="text-orange">{{
            currentyOptions[record.currency_id]
            }}</span></span>
        <div>{{ amount }}</div>
      </div>
    </template>
    <span>{{ amount }}{{ props.keyIndex }}</span>
  </Popover>
</template>

<style lang="less" scoped></style>
