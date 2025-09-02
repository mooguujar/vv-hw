<template>
  <div class="mt-2px !mb--5px">
    <RadioGroup v-model:value="tabPosition" button-style="solid" @change="changeClick(tabPosition)">
      <RadioButton value="" class="!mb-5px">
        {{ props.allTitle }}
      </RadioButton>
      <RadioButton v-for="(item, index) in list" :value="item" :key="index" class="!mb-5px">
        {{ currentyOptions[item] }}
      </RadioButton>
    </RadioGroup>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, PropType } from 'vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { currentyOptions } from '/@/views/common/commonSetting';

  const { t } = useI18n();
  const props = defineProps({
    currencyid: {
      default: '',
      type: String,
    },
    allTitle: {
      default: '',
      type: String,
    }, //需要什么值传什么值
    // currency_all_text: {
    //   default: '',
    //   type: String,
    // },
    name: {
      type: String as PropType<string>,
      default: '',
    },
    list: {
      type: Array,
      default: [],
    },
  });
  const tabPosition = ref('' as string);
  if (props.currencyid) {
    tabPosition.value = props.currencyid;
  }
  watch(
    () => props.currencyid,
    () => (tabPosition.value = props.currencyid),
  );
  const emit = defineEmits(['ChangeButtonCurrency']);
  //const { currencyTreeList } = useTreeListStore();
  function changeClick(value) {
    emit('ChangeButtonCurrency', value);
  }
</script>
<!-- <style lang="less" scoped>
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
    border-left-width: 1px solid #d9d9d9;
    width: 88px;
    text-align: center;
  }
</style> -->
