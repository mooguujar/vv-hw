import { ref, computed, unref, onBeforeUnmount } from 'vue';

export function useScrollerHeight(height: number) {
  const scrollerHeight: any = ref(0);

  // 计算可用高度
  const updateScrollerHeight = () => {
    const width = window.innerWidth;
    const scaleFactor = width < 1920 ? 0.76 : 0.85;
    scrollerHeight.value = Math.floor(
      parseFloat(((window.innerHeight - height * scaleFactor) / scaleFactor).toFixed(2)),
    );
  };
  // 初始计算
  updateScrollerHeight();

  // 监听窗口大小变化
  const resizeHandler = () => updateScrollerHeight();
  window.addEventListener('resize', resizeHandler);

  // 清理事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
  });

  return computed(() => unref(scrollerHeight));
}
