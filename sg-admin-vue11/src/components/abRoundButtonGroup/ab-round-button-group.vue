<template>
  <div>
    <div
      class="inline-block p-1 rounded-full bg-white overflow-x-auto whitespace-nowrap max-w-[100%]"
      :class="blackEdge ? 'border1' : ''"
    >
      <template v-for="btn in btnList_" :key="btn.label">
        <Button
          v-if="!btn.id || isHasAuth(btn.id)"
          shape="round"
          :size="size"
          :type="modelValue === btn.value ? 'primary' : 'text'"
          @click="setdisabledTab(btn)"
          >{{ btn.label }}</Button
        >
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Button } from 'ant-design-vue';
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
      btnList: {
        label: string;
        value: string | number;
        id: string;
      }[];
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
