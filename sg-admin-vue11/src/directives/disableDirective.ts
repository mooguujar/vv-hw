import type { Directive, App } from 'vue';
import { isControlValueSet } from '/@/utils/domUtils';

// 权限指令类型
type PermissionMode = 'disable' | 'hide';
interface PermissionBinding {
  mode?: PermissionMode; // 模式：disable-禁用，hide-隐藏（默认）
}

// 检查权限（实际项目替换为你的权限检查逻辑）
function checkPermission(): boolean {
  return isControlValueSet();
}

// 处理元素显示/禁用
function handleElementPermission(el: HTMLElement, mode: PermissionMode) {
  if (checkPermission()) {
    // 无权限 - 根据模式处理
    if (mode === 'disable') {
      el.classList.add('is-disabled');
      el.setAttribute('disabled', 'disabled');
      el.style.pointerEvents = 'not-allowed';
      // el.style.opacity = '0.8';
    } else {
      el.style.display = 'none';
    }
  } else {
    // 有权限 - 恢复元素
    if (mode === 'disable') {
      el.classList.remove('is-disabled');
      el.removeAttribute('disabled');
      el.style.pointerEvents = '';
      // el.style.opacity = '';
    } else {
      el.style.display = '';
    }
  }
}

const permissionDirective: Directive<HTMLElement, PermissionBinding | string> = {
  mounted(el, binding) {
    const { mode = 'hide' } = binding.value as PermissionBinding;
    handleElementPermission(el, mode);
  },
  updated(el, binding) {
    const { mode = 'hide' } = binding.value as PermissionBinding;

    handleElementPermission(el, mode);
  },
};

export function setupDisableDirective(app: App) {
  app.directive('permission', permissionDirective);
}

export default permissionDirective;
