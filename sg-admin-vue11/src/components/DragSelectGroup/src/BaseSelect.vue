<template>
  <Select
    v-bind="$attrs"
    @change="handleChange"
    :dropdown-match-select-width="false"
    v-model:value="valueRef"
    :placeholder="placeholderRef"
    style="width: 100%"
  >
    <template #option="{ name, id, sqIndex }">
      <div style="width: 100%; display: flex; justify-content: space-between" :key="id">
        <div
          ><span>{{ name }}</span></div
        >
        <div style="color: red" v-if="sqIndex">{{ sqIndex }}</div>
      </div>
    </template>
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </Select>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  // import { useRuleFormItem } from '/@/hooks/component/useFormItem';

  const emit = defineEmits(['default:change']);

  const props = defineProps({
    value: [Array, Object, String, Number],
    placeholder: [String],
  });

  const valueRef = ref(props.value);
  const placeholderRef = ref(props.placeholder);

  watch(placeholderRef, (newValue, oldValue) => {
    // 执行相应的操作，例如打印新旧值
  });

  // const emitData = ref<any[]>([]);
  // Embedded in the form, just use the hook binding to perform form verification
  // const [state] = useRuleFormItem(props, 'value', 'change', emitData);

  function handleChange(value) {
    emit('default:change', value);
  }
</script>
