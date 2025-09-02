<template>
  <ul class="dim-table-checkbox-group">
    <li v-for="tab in options" :key="tab.label">
      <Button type="link" :size="size" v-if="!tab.id || isHasAuth(tab.id)">{{ tab.label }}</Button>

      <CheckboxGroup v-model:value="current_platform_ids" style="width: 100%">
        <Checkbox
          v-for="item in tab[fieldNames.children]"
          @change="handleCheckboxChange($event, item)"
          :value="item.value"
          :key="item.value"
          >{{ item.name }}
        </Checkbox>
      </CheckboxGroup>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { CheckboxGroup, Checkbox, Button } from 'ant-design-vue';
  import { isHasAuth } from '/@/utils/authFunction';
  import { ref, watch } from 'vue';

  const disabledTab = ref(false);
  const setdisabledTab = (btn) => {
    disabledTab.value = true;
    setTimeout(() => {
      disabledTab.value = false;
    }, 111);
    emit('update:modelValue', btn.value);
  };
  const props = withDefaults(
    defineProps<{
      options: {
        label: string;
        value: string | number;
        id: string;
      }[];
      fieldNames: {
        label: string;
        value: string;
        children: string;
      };
      blackEdge: Boolean;
      modelValue: string | number | null;
      size?: 'large' | 'middle' | 'small';
    }>(),
    {
      size: 'large',
    },
  );
  const btnList_ = ref(props.btnList);
  watch(
    () => props.btnList,
    (e) => {
      btnList_.value = e;
    },
    {
      immediate: true,
      deep: true,
    },
  );
  const emit = defineEmits(['update:modelValue']);
</script>
<style lang="less" scoped>
  .dim-table-checkbox-group {
    display: flex;
    .ant-checkbox-group {
      padding: 0 20px 0 10px;
      .ant-checkbox-wrapper {
        white-space: nowrap;
        margin-left: 0;
        &:not(:first-child) {
          margin-top: 10px;
        }
      }
    }
  }
</style>
