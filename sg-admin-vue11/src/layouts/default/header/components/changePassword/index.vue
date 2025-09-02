<template>
  <div ref="main">
    <BasicModal
      @register="registerLimitModal"
      :title="t('table.system.system_root_editPassword')"
      v-bind="$attrs"
      @ok="confirmModify"
      :width="560"
      :okText="t('business.banner_confrim')"
      cancelText=""
      :showCancelBtn="false"
      :draggable="false"
      :destroyOnClose="true"
      :getContainer="() => $refs.main"
      :bodyStyle="{ height: '310px' }"
    >
      <Tabs
        v-model:tab-value="tabValue"
        class="tabs capsule_tap"
        :destroyInactiveTabPane="true"
        @change="handleChange"
      >
        <TabPane :tab="t('layout.header.loginPassword')" key="1">
          <BasicForm @register="registerPassword" ref="changePassword" />
        </TabPane>
        <TabPane :tab="t('layout.header.ROIPassword')" key="2">
          <BasicForm @register="registerRoiPassword" ref="changeRoiPassword" />
        </TabPane>
      </Tabs>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs, TabPane, message, Modal } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { modifyPassword, roiPwdUpdate } from '/@/api/sys/user';
  import { schemasPassword } from './components/ChangePassword.data';
  import { schemasRoiPassword } from './components/ChangeRoiPassword.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const { logout } = userStore;
  const { t } = useI18n();
  const [registerLimitModal, { closeModal, setModalProps }] = useModalInner(() => {
    setModalProps({ confirmLoading: false });
  });
  const tabValue = ref('1');
  /** 登陆密码：表单验证 */
  const [registerPassword, { resetFields: resetFieldsPwd, validate: validatePassword }] = useForm({
    schemas: schemasPassword,
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: { span: 24 },
  });
  /** ROI密码：表单验证 */
  const [registerRoiPassword, { resetFields: resetFieldsRoiPwd, validate: validateRoiPassword }] =
    useForm({
      schemas: schemasRoiPassword,
      showActionButtonGroup: false,
      labelWidth: 100,
      baseColProps: { span: 24 },
    });
  /** 切换tab */
  function handleChange(key: any) {
    tabValue.value = key;
  }
  /** 确认修改 */
  async function confirmModify() {
    if (tabValue.value == '1') {
      const values = await validatePassword();
      if (values) {
        const { data, status } = await modifyPassword({
          password: values.originPw,
          verification: false,
          new_password: values.newPw,
          uid: '',
          domain: '',
        });
        if (!status) {
          message.error(data);
        } else {
          // message.success(t('business.banner_confrim'));
          message.destroy();
          resetFieldsPwd();
          confirmLogout();
          setModalProps({ confirmLoading: false });
          // closeModal();
        }
      }
    } else {
      const values = await validateRoiPassword();
      if (values) {
        const { data } = await roiPwdUpdate({
          pwd_old: values.pwd_old,
          pwd_new: values.pwd_new,
          pwd_confirm: values.pwd_new,
        });
        if (!data) {
          message.error('ROI密码修改失败');
        } else {
          sessionStorage.setItem('logRoiPwd', 'true');
          message.success(t('business.banner_confrim'));
          resetFieldsRoiPwd();
          closeModal();
        }
      }
    }
  }
  /** 修改登陆密码后登出 */
  function confirmLogout() {
    Modal.confirm({
      title: t('layout.setting.operatingTitle'),
      icon: false,
      closable: true,
      wrapClassName: 'system-confirm',
      content: t('layout.setting.operatingTitle_msg'),
      width: '400px',
      centered: true,
      maskClosable: false,
      onOk() {
        logout(true);
      },
    });
  }
</script>
<style lang="scss" scoped>
  .tabs {
    border-radius: 3px;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: auto;
    margin-bottom: 20px;
  }

  .changePassword {
    ::v-deep(.ant-modal-body .scroll-container .scrollbar__wrap) {
      overflow-y: hidden;
    }

    ::v-deep(.ant-modal-footer) {
      padding-top: 0;
      padding-bottom: 10px;
    }

    ::v-deep(.scrollbar__thumb) {
      display: none;
    }

    ::v-deep(.scrollbar__bar.is-vertical) {
      display: none;
    }

    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
      justify-items: right;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      width: 90px;
      height: auto !important;
      margin-right: 5px;
      line-height: 40px !important;
    }

    ::v-deep(.ant-form-item-label) {
      width: 90px !important;
    }

    ::v-deep(.ant-checkbox-group-item) {
      width: 72px;
      margin-right: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }

    ::v-deep(.ant-checkbox-group) {
      width: 290px;
    }
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding-left: 0 !important;
  }

  ::v-deep(.ant-form-item-control-input-content) {
    .ant-btn {
      float: left;
    }
  }

  ::v-deep(.ant-btn-error) {
    position: absolute;
    //left: 0;
    bottom: 0;
  }

  ::v-deep(.anticon-copy) {
    margin-top: 0;
  }

  ::v-deep(.anticon-copy::before) {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('/@/assets/images/copy_addBlacklist.webp');
    background-size: 100%;
  }

  ::v-deep(.anticon-copy > svg) {
    display: none;
  }

  ::v-deep(.anticon-redo) {
    margin-top: 0;
  }

  ::v-deep(.anticon-redo::before) {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    background-image: url('/@/assets/images/redo_addBlacklist.webp');
    background-size: 100%;
  }

  ::v-deep(.anticon-redo > svg) {
    display: none;
  }

  ::v-deep(.ant-radio-button-wrapper-checked) {
    box-shadow: none !important;
  }
</style>
