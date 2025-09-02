import { usePermissionStore } from '/@/store/modules/permission';

/**
 * 单个权限验证是否有
 */
export function isHasAuth(value: string): boolean {
  const stores = usePermissionStore();
  return stores.permCodeList.some((v: any) => v == value);
}

/**
 * 多个权限验证，满足一个则为 true
 * @param value 权限值
 * @returns 有权限，返回 `true`，反之则反
 */
export function auths(value: Array<string>): boolean {
  let flag = false;
  const stores = usePermissionStore();
  stores.permCodeList.map((val: any) => {
    value.map((v: string) => {
      if (val === v) flag = true;
    });
  });
  return flag;
}

/**
 * 多个权限验证，全部满足则为 true
 * @param value 权限值
 * @returns 有权限，返回 `true`，反之则反
 */
export function authAll(valueArr: Array<string>): boolean {
  const stores = usePermissionStore();
  return stores.permCodeList.every((item1) => valueArr.some((item2) => item1 === item2));
}

/**
 * 多个权限验证是否都没有 都没有返回 true
 */
export function isUnAuthAll<T>(valueArr: Array<T>): boolean {
  const stores = usePermissionStore();
  return stores.permCodeList.every((item1) => !valueArr.some((item2) => item1 === item2));
}
