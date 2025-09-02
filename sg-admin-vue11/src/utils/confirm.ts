import { Modal } from 'ant-design-vue';
import { useI18n } from '../hooks/web/useI18n';

export function openConfirm(title, content, callback, class_) {
  const { t } = useI18n();
  Modal.confirm({
    title: title || '操作确认',
    icon: false,
    closable: true,
    wrapClassName: 'system-confirm',
    content: content,
    onOk: callback,
    width: '553px',
    centered: true,
    maskClosable: true,
    cancelButtonProps: { style: { display: 'none' } },
    okText: t('common.okText'),
    class: class_,
    onCancel() {},
  });
}
export function openGameListConfirm(title, content, callback, class_) {
  Modal.confirm({
    title: title || '操作确认',
    icon: false,
    closable: true,
    wrapClassName: 'game-list-confirm',
    content: content,
    onOk: callback,
    width: '553px',
    centered: true,
    maskClosable: true,
    cancelButtonProps: { style: { display: 'none' } },

    class: class_,
    onCancel() {},
  });
}
export function openConfirmCancelHidden(title, content, callback, class_) {
  Modal.confirm({
    title: title || '操作确认',
    icon: false,
    closable: true,
    wrapClassName: 'system-confirm',
    content: content,
    onOk: callback,
    cancelButtonProps: { style: { display: 'none' } },
    centered: true,
    maskClosable: true,
    class: class_,
    onCancel() {},
  });
}

export function openConfirmTip(title = '操作确认', content, callback) {
  Modal.confirm({
    title: title,
    icon: false,
    closable: true,
    wrapClassName: 'system-confirm-Tip',
    content: content,
    onOk: callback,
    centered: true,
    onCancel() {},
  });
}
export function openConfirmLimit(title, content, callback, class_) {
  Modal.confirm({
    title: title || '错误提示',
    icon: false,
    closable: true,
    wrapClassName: 'system-confirm',
    content: content,
    onOk: callback,
    centered: true,
    maskClosable: true,
    cancelButtonProps: { style: { display: 'none' } },

    class: class_,
    onCancel() {},
  });
}

export function openConfirmBoolean(title, content, callback, cancelCallback, class_) {
  const { t } = useI18n();
  Modal.confirm({
    title: title || '操作确认',
    icon: false,
    closable: true,
    wrapClassName: 'system-confirm',
    content: content,
    onOk: callback,
    width: '553px',
    centered: true,
    maskClosable: true,
    cancelButtonProps: { style: { display: 'none' } },
    okText: t('common.okText'),
    class: class_,
    onCancel() {
      cancelCallback();
    },
  });
}
