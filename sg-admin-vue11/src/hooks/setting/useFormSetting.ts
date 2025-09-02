import { computed } from 'vue';

import { useAppStore } from '/@/store/modules/app';

export function useFormSetting() {
  const appStore = useAppStore();

  // 表单尺寸
  const getFormSize = computed(() => appStore.getFormSetting.size);

  return {
    getFormSize,
  };
}
