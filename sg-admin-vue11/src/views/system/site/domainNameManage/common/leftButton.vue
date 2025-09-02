<template>
  <div class="leftButton">
    <div class="inline-block">
      <Button
        v-if="!isControlValueSet()"
        class="mb-7px mt-12px"
        preIcon="ant-design:plus-outlined"
        size="large"
        @click="goToAdd"
        type="primary"
      >
        {{ $t('table.system.system_insert_button') }}
      </Button>
    </div>
    <div class="buttonItem">
      <Button
        v-for="(item, index) in buttonList"
        :key="index"
        class="m-b-4"
        @click="handleChange(item.value)"
        :class="{ 'ant-btn-primary': item.value === selectValue }"
      >
        <span v-if="item.sub" class="subTitle relative" :class="item.class">{{ item.sub }}</span>
        {{ item.label }}
        <div
          v-if="item.label === 'Cloudflare'"
          class="h-8 bg-[#1475E1] gap-20 text-center py-1 px-3 rounded-[38px] text-xl scale-50 transform-origin-left-top absolute top-0 left-23 text-white"
        >
          {{ t('business.common_internation') }}
        </div>
        <div
          v-if="item.label === 'Gcore'"
          class="h-8 bg-[#2CC293] gap-20 text-center py-1 px-3 rounded-[38px] text-xl scale-50 transform-origin-left-top absolute top-0 left-15 text-white"
        >
          {{ t('business.common_not_prc') }}
        </div>
      </Button>
      <Button v-if="!props.tableValue" class="limitInfo" @click="goTOLimit">{{
        // preIcon="mdi:warning-circle" 前图标

        $t('table.system.system_limit_info')
      }}</Button>
    </div>
    <!-- <div>
      <Button v-if="!props.tableValue" class="m-b-4 w-20 !p-0" @click="goTOCdn">{{
        $t('business.common_cdn_manager')
      }}</Button></div
    > -->
    <!--<div><Button
        v-if="!props.tableValue"
        class="!p-0 limitInfo"
        preIcon="mdi:warning-circle"
        @click="goTOLimit">{{ $t('table.system.system_limit_info') }}</Button>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { Button } from '/@/components/Button/index';
  import { useDebounceFn } from '@vueuse/core';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { domainodeSide } from './const';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const props = defineProps({
    tableValue: {
      type: Number,
      default: 0,
    },
  });
  const selectValue = ref('' as any);
  const buttonList = ref([
    {
      label: t('business.common_all'), //全部
      value: '',
      sub: '',
    },
    ...domainodeSide,
  ] as any);
  const emit = defineEmits(['emitCdnModel', 'emitLimit', 'emitAdd', 'handleChangeEmit']);
  function goTOCdn() {
    emit('emitCdnModel');
  }
  function goTOLimit() {
    emit('emitLimit');
  }
  function goToAdd() {
    emit('emitAdd');
  }
  const handleChange = useDebounceFn(async (value) => {
    selectValue.value = value;
    emit('handleChangeEmit', value);
  });
</script>

<style lang="less">
  .buttonItem {
    position: relative;
    width: 180px !important;
    height: calc(100% - 80px) !important;
    min-height: 250px !important;
    margin-top: 3px;
    padding-top: 5px;
    border: 1px solid #e1e1e1 !important;
    background-color: #fff !important;

    button {
      display: block;
      width: 178px !important;
      height: 44px !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;

      span {
        text-align: left !important;
      }

      &.ant-btn {
        text-align: left !important;
      }
    }

    .subTitle {
      display: block;
      position: absolute;
      z-index: 1;
      top: -9px;
      right: -20px;
      width: 36px;
      height: 22px;
      border-radius: 10px;
      color: #fff;
      font-size: 12px;
      line-height: 22px;
      text-align: center;
    }

    .primary {
      background-color: @primary-color;
    }

    .green {
      width: 43px;
      background-color: #63a104;
    }
  }

  .leftButton .limitInfo {
    .app-iconify {
      color: #f59a23;
    }

    span {
      margin-left: 0;
      color: rgb(0 0 0 / 85%);
    }
  }
</style>
