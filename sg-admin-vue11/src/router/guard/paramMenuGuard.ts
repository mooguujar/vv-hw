import type { Router } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { roiPwdIfSet } from '/@/api/sys/user';
import { configureDynamicParamsMenu } from '../helper/menuHelper';
import { Menu } from '../types';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { useAppStoreWithOut } from '/@/store/modules/app';
import { usePermissionStoreWithOut } from '/@/store/modules/permission';
import { useTabs } from '/@/hooks/web/useTabs';
import { h } from 'vue';
import Addmoney from '/@/views/member/addSubtractMoney/index.vue';
import AddMember from '/@/views/member/createMember/index.vue';
import setRoiPwd from '/@/views/system/password/setRoiPwd.vue';
import logRoiPwd from '/@/views/system/password/logRoiPwd.vue';
import eventBus from '/@/utils/eventBus';

export function createParamMenuGuard(router: Router) {
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    if (to.path === '/member/addMoney') {
      const { refreshPage } = useTabs();
      Modal.confirm({
        icon: '',
        width: 560,
        maskClosable: true,
        wrapClassName: 'addMoney',
        centered: true,
        closable: true,
        content: () => h(Addmoney),
        getContainer: () => document.body,
      });
      eventBus.on('cancelModal', () => {
        //关闭刷新
        const nameList = ['InquiryEditor', 'ActiveEditor'];
        const name: any = from.name;
        if (!nameList.includes(name)) {
          refreshPage();
        }
      });
      next(false);
      return;
    } else if (to.path === '/member/createMember') {
      const { refreshPage } = useTabs();
      Modal.confirm({
        icon: '',
        width: 800,
        maskClosable: true,
        closable: true,
        wrapClassName: 'addCreat',
        content: () => h(AddMember),
        okButtonProps: { style: { display: 'none' } },
        cancelButtonProps: { style: { display: 'none' } }, // 取消取消按钮的显示
      });
      eventBus.on('cancelModal', () => {
        //关闭刷新
        const nameList = ['InquiryEditor', 'ActiveEditor'];
        const name: any = from.name;
        if (!nameList.includes(name)) {
          refreshPage();
        }
      });
      next(false);
      return;
    } else if (
      to.path === '/promotion/month_price_roi' ||
      to.path === '/promotion/race_price_roi'
    ) {
      /** 设置ROI密码逻辑 */
      const params = { type: 1 };
      // const { closeRight } = useTabs();
      const { data } = await roiPwdIfSet(params);
      if (data) {
        //已设置
        if (sessionStorage.getItem('logRoiPwd') === 'true') {
          next(true);
          return;
        } else {
          Modal.confirm({
            icon: '',
            width: 600,
            maskClosable: true,
            closable: true,
            centered: true, // 垂直居中
            wrapClassName: 'addCreat',
            content: () => h(logRoiPwd),
            getContainer: () => document.body,
            onCancel: () => {
              const { closeRight } = useTabs();
              closeRight();
            },
          });
        }
      } else {
        //未设置
        Modal.confirm({
          icon: '',
          width: 600,
          maskClosable: true,
          closable: true,
          centered: true, // 垂直居中
          wrapClassName: 'addCreat',
          content: () => h(setRoiPwd),
          getContainer: () => document.body,
          onCancel: () => {
            const { closeRight } = useTabs();
            closeRight();
          },
        });
      }
      eventBus.on('closeModal', () => {
        //跳转下一页
        if (to.path === '/promotion/month_price_roi') {
          router.push('/promotion/month_price_roi');
        } else if (to.path === '/promotion/race_price_roi') {
          router.push('/promotion/race_price_roi');
        }
      });
      next(false);
      return;
    }
    // filter no name route
    if (!to.name) {
      next();
      return;
    }

    // menu has been built.
    if (!permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    let menus: Menu[] = [];
    if (isBackMode()) {
      menus = permissionStore.getBackMenuList;
    } else if (isRouteMappingMode()) {
      menus = permissionStore.getFrontMenuList;
    }
    menus.forEach((item) => configureDynamicParamsMenu(item, to.params));

    next();
  });
}
const getPermissionMode = () => {
  const appStore = useAppStoreWithOut();
  return appStore.getProjectConfig.permissionMode;
};

const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK;
};

const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING;
};
