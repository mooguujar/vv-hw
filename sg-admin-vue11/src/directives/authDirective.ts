import type { App } from 'vue';
import { usePermissionStore } from '/@/store/modules/permission';
/**
 * 用户权限指令
 * @directive 单个权限验证（v-auth="xxx"）
 */
export function authDirective(app: App) {
  // 单个权限验证（v-auth="xxx"）
  app.directive('auth', {
    mounted(el, binding) {
      const stores = usePermissionStore();
      if (!stores.permCodeList.some((v: string | number) => v === binding.value))
        el.parentNode.removeChild(el);
    },
  });
}
