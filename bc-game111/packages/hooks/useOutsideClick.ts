import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted } from 'vue'

export function useOutsideClick(
  ref: Ref<HTMLElement | null>,
  callback: () => void,
): void {
  const callbackRef = (event: MouseEvent) => {
    callback()
  }

  onMounted(() => {
    document.addEventListener('click', callbackRef)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', callbackRef)
  })
}
