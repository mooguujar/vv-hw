<template>
  <div
    class="flex justify-center items-center margin-right-10 t-form-label-com"
    :class="{ 't-form-label pl-2': labelBorder }"
  >
    <div
      class="t-form-label__title flex"
      :class="{ 'mr-1': !labelBorder }"
      :style="{ minWidth: _labelPrefixWidth }"
    >
      <!--      <div class="truncate hover:text-clip"-->
      <!--        >{{ labelPrefix }}-->
      <!--        -->
      <!--      </div>-->
      <!-- <Tooltip :title="labelPrefix">
        <span class="truncate max-w-30 cursor-pointer">{{ labelPrefix }}</span>
      </Tooltip> -->
      <span class="truncate min-w-10 cursor-pointer">{{ labelPrefix }}:</span>
      <div v-if="labelPrefix.trim() && labelBorder"></div>
    </div>
    <div :style="{ flex: 1 }">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { Tooltip } from 'ant-design-vue';

  const props = defineProps({
    labelPrefix: {
      type: String,
      default: '',
    },
    labelPrefixWidth: {
      type: [String, Number],
      default: '40',
    },
    labelBorder: {
      type: Boolean,
      default: true,
    },
  });

  const _labelPrefixWidth = computed(() => `${props.labelPrefixWidth}px`);
</script>

<style lang="less">
  .t-form-col.ant-col-xl-1,
  .t-form-col.ant-col-xxl-1,
  .ant-col-xxl-1,
  .ant-col-xl-1 {
    display: block;
    flex: 0 0 7.9% !important;
    max-width: 7.9% !important;
  }

  .t-form-col.ant-col-xl-2,
  .t-form-col.ant-col-xxl-2 {
    display: block;
    flex: 0 0 8.6% !important;
    max-width: 8.6% !important;
  }

  .t-form-col.ant-col-xl-3,
  .t-form-col.ant-col-xxl-3 {
    display: block;
    flex: 0 0 10.4% !important;
    max-width: 10.4% !important;
  }

  .t-form-col.ant-col-xl-4,
  .t-form-col.ant-col-xxl-4 {
    display: block;
    flex: 0 0 11.5% !important;
    max-width: 11.5% !important;
  }

  .t-form-col.ant-col-xl-5,
  .t-form-col.ant-col-xxl-5 {
    display: block;
    flex: 0 0 14% !important;
    max-width: 14% !important;
  }

  .t-form-col.ant-col-xl-6,
  .t-form-col.ant-col-xxl-6 {
    display: block;
    flex: 0 0 18.7% !important;
    max-width: 18.7% !important;
  }

  .t-form-col.ant-col-xl-7,
  .t-form-col.ant-col-xxl-7 {
    display: block;
    flex: 0 0 22% !important;
    max-width: 22% !important;
  }

  // 争夺右侧栏按钮位置
  .t-form-col.ant-col-xl-10,
  .t-form-col.ant-col-xxl-10 {
    display: block;
    flex: 0 0 15.2% !important;
    max-width: 15.2% !important;
  }

  .t-form-col.ant-col-xl-11,
  .t-form-col.ant-col-xxl-11 {
    display: block;
    flex: 0 0 6.3% !important;
    max-width: 6.3% !important;
  }

  .t-form-col.ant-col-xl-12,
  .t-form-col.ant-col-xxl-12 {
    display: block;
    flex: 0 0 11.7% !important;
    max-width: 11.7% !important;
  }

  .t-form-export-col.ant-col-xl-12,
  .t-form-export-col.ant-col-xxl-12 {
    display: block;
    flex: 0 0 12% !important;
    max-width: 12% !important;
  }

  .t-form-more-col.ant-col-xl-12,
  .t-form-more-col.ant-col-xxl-12 {
    display: block;
    flex: 0 0 25% !important;
    max-width: 25% !important;
  }

  .t-form-col.ant-col-auto {
    flex-basis: 0 !important;
    flex-grow: 1 !important;
  }

  .t-form-col.ant-col-auto-width {
    flex-grow: 1 !important;
  }

  .margin-right-10 {
    // margin-right: 8px;
    margin-right: 10px;
  }

  .t-form-label {
    padding-left: 0.2em !important;
    transition: all 0.3s;
    border: 1px solid #d9d9d9;
    border-radius: 6px;

    &__title {
    }

    &:hover,
    &:focus {
      border-color: @primary-color;
    }

    // .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    //   height: 30px !important;
    // }

    .ant-select-clear,
    .ant-select-arrow {
      right: 5px;
    }

    .ant-select-selector,
    .ant-picker,
    .ant-input-affix-wrapper {
      width: 100% !important;
      padding-right: 0 !important;
      padding-left: 4px !important;
    }

    .ant-picker {
      padding-right: 6px !important;
    }

    .ant-input-affix-wrapper {
      padding-top: 4px !important;
      padding-bottom: 4px !important;
    }

    .ant-picker-input > input:focus,
    .ant-picker-input > input-focused,
    .ant-picker,
    .ant-input,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector,
    .ant-input:focus,
    .ant-input-focused,
    .ant-input-affix-wrapper:focus,
    .ant-input-affix-wrapper-focused,
    .ant-input-affix-wrapper:hover {
      border: 0 !important;
      background-color: transparent !important;
      box-shadow: none !important;
    }
  }

  .ant-form-item-control-input-content {
    .ant-btn:last-child {
      margin-right: 0;
    }
  }

  //.t-form-label-com {
  //  border: 1px solid red;
  //  .t-form-label__title + div {
  //    height: 40px;
  //    line-height: 40px;
  //    font-size: 14px;
  //    .ant-select-arrow {
  //      margin-top: 0;
  //    }
  //  }
  //  .ant-select > .ant-select-selector,
  //  .ant-select > .ant-select-selection-item,
  //  .ant-form-item,
  //  .ant-form-item-control-input,
  //  .t-form-label__title,
  //  .ant-btn,
  //  .t-form-label > div,
  //  .ant-btn > span,
  //  .ant-select > .ant-select-selector > span {
  //    height: 40px;
  //    line-height: 40px;
  //    font-size: 14px;
  //  }
  //  .ant-select > .ant-select-selector {
  //    border-radius: 4px;
  //  }
  //  .t-form-label {
  //    border-radius: 4px;
  //  }
  //}
  //.ant-select > .ant-select-selector,
  //.ant-select > .ant-select-selection-item,
  //.ant-form-item,
  //.ant-form-item-control-input,
  //.t-form-label__title,
  //.ant-btn,
  //.t-form-label > div,
  //.ant-btn > span,
  //.ant-select > .ant-select-selector > span
  // {
  //  height: 40px;
  //  line-height: 40px;
  //  font-size: 14px;
  //}
  //.ant-select > .ant-select-selector {
  //  border-radius: 4px;
  //}
  //.t-form-label {
  //  border-radius: 4px;
  //}
</style>
