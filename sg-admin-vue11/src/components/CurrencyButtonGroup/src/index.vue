<template>
  <div class="mt-2px !mb--5px">
    <RadioGroup
      v-model:value="tabPosition"
      button-style="solid"
      @change="changeClick(tabPosition)"
      class="t-form-label-com"
    >
      <RadioButton
        v-for="(item, index) in currentList"
        :value="item.id"
        :key="index"
        class="!mb-5px"
      >
        {{ item.name }}
      </RadioButton>
    </RadioGroup>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, PropType } from 'vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { useI18n } from '/@/hooks/web/useI18n';

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

  const { currencyTreeList } = useTreeListStore();

  const currentList = computed(() => {
    const all = { name: props?.allTitle, id: '' };
    return [all, ...currencyTreeList];
  });

  function changeClick(value) {
    const filterItem = currentList.value.filter((item: any) => {
      return item.id === value;
    });
    emit('ChangeButtonCurrency', filterItem);
  }
</script>
<style lang="less" scoped>
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
</style>
