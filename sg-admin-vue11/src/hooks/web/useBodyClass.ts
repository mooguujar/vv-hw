import { onMounted, onUnmounted, unref } from 'vue';
import { useLocale } from '/@/locales/useLocale';

export function useBodyClass() {
  const { getLocale } = useLocale();
  const className = `custom-body-${unref(getLocale)}`;
  // 在组件挂载时添加 class
  onMounted(() => {
    document.body.classList.add(className);
  });

  // 在组件卸载时移除 class
  onUnmounted(() => {
    document.body.classList.remove(className);
  });
}
