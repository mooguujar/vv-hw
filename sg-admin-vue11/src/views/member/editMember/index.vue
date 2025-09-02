<template>
  <PageWrapper contentClass="editLayout" :title="bigTitle" contentBackground>
    <BasicForm @register="registerForm">
      <template #basicInfo>
        <div class="display-flex"
          ><div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div
          ><h1>{{ $t('modalForm.member.member_basic') }}</h1></div
        >
      </template>

      <template #basicSetting>
        <div class="display-flex"
          ><div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div
          ><h1>{{ $t('modalForm.member.member_config') }}</h1></div
        >
      </template>
      <template #agentSlot="{ model, field }">
        <Select
          show-search
          v-model:value="model[field]"
          :placeholder="$t('table.member.member_verify_3')"
          :options="datalist"
          @search="handleSearch"
          @change="handleSelect"
          :size="FORM_SIZE"
          :filter-option="false"
          :fieldNames="{ label: 'username', value: 'uid' }"
          :not-found-content="fetching ? undefined : null"
          allowClear
        >
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
      </template>
      <template #countryCode>
        <InputGroup>
          <Select class="countryCodeClass" :options="CodeValue" />
          <Input />
        </InputGroup>
      </template>
    </BasicForm>
    <!-- 重置密码 -->
    <Space :size="30" class="footBouutn" align="center">
      <Button
        type="primary"
        :loading="setloading"
        @click="submitFun"
        class="w-35 edit-member-save-btn"
        :size="FORM_SIZE"
        >{{ $t('business.comon_save') }}</Button
      >
      <Button @click="resetPassword('login')" v-if="isHasAuth('10105')" :size="FORM_SIZE">{{
        $t('modalForm.member.member_reset_password')
      }}</Button>
      <!-- 重置谷歌二维码 -->
      <Button @click="resetGoogle" v-if="isHasAuth('10106')" :size="FORM_SIZE">{{
        $t('modalForm.member.member_code_password')
      }}</Button>
      <!-- 重置资金密码 -->
      <Button @click="resetPassword('funds')" v-if="isHasAuth('10107')" :size="FORM_SIZE">{{
        $t('modalForm.member.member_money_password')
      }}</Button>
    </Space>

    <!-- <BasicModal
      :canFullscreen="false"
      :minHeight="20"
      :title="setTitle"
      @register="registerModal"
      @ok="confirm(setKey)"
      :cancelText="$t('business.common_cancel')"
      :okText="$t('business.common_ok')"
      :width="800"
    >
      <p class="p-2 mb-0">{{ setText }}</p>
    </BasicModal> -->
    <payPwdMdal @register="registerPay" />
  </PageWrapper>
</template>
<script setup lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { isHasAuth } from '@/utils/authFunction';
  import dayjs from 'dayjs';
  import { PageWrapper } from '/@/components/Page';
  import { schemas } from './edit.data';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Button } from '/@/components/Button';
  import { useRoute, useRouter } from 'vue-router';
  import {
    message,
    Space,
    Select,
    Spin,
    Row,
    Col,
    Tooltip,
    InputGroup,
    Input,
    Modal,
  } from 'ant-design-vue';
  import {
    updateMember,
    getMemberDetails,
    getByMemberId,
    payPwd,
    userPwd,
    setgooglePwd,
    setpayPwd,
  } from '/@/api/member/index';
  import { BasicModal, useModal } from '/@/components/Modal';
  import payPwdMdal from './payPwd.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useMemberStore } from '/@/store/modules/member';
  import { useDebounceFn } from '@vueuse/core';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { openConfirm } from '/@/utils/confirm';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import { useTreeListStore } from '/@/store/modules/treeList';

  const { countryTreeCodeList } = useTreeListStore();

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;
  const $router = useRouter();
  const memberStore = useMemberStore();
  // 获取VIP等级下拉
  memberStore.getVipLevelList();
  // 获取层级下拉
  memberStore.getLevelList();
  let getId = history.state.id;
  getDetail(getId);
  const CodeValue = ref([] as any);
  const passWordData = ref('' as any);
  useAutoLabelWidth(schemas);
  const [registerForm, { setFieldsValue, validate }] = useForm({
    schemas,
    labelWidth: 120,
    actionColOptions: {
      span: 14,
    },
    size: FORM_SIZE,
    class: 'label-item',
    showActionButtonGroup: false,
  });
  // 修改编辑的标题
  const setTitle = ref('' as any);
  // 支付密码弹框
  const [registerModal, { openModal: openModalPay }] = useModal();
  // 支付密码更改成功弹框
  const [registerPay, { openModal: openModalSuc }] = useModal();
  // 按钮的loading
  let setloading = ref(false as any);
  const editdata: any = ref({} as object);
  // 设置弹框大标题标题
  let bigTitle = ref('' as any);
  bigTitle.value =
    history.state.key === 'active'
      ? t('modalForm.member.member_edit_active')
      : t('modalForm.member.member_adit');
  // 设置弹框内容
  let setText = ref('' as any);
  // 设置弹框key
  let setKey = ref('' as any);
  const datalist = ref([] as any);
  // 设置parent_name
  let parent_name = ref('' as any);
  //设置parant_uid
  let parant_uid = ref('' as any);
  // 加载状态
  const fetching = ref(false as boolean);
  const model = ref<any>({
    maintStart: dayjs().toDate(),
    maintEnd: dayjs().endOf('day').toDate(),
  });

  const handleSearch = useDebounceFn(async (value) => {
    // 确保输入长度至少为3个字符
    if (!value || value.length < 2) {
      datalist.value = []; // 清空现有数据列表（可选）
      return false;
    }
    fetching.value = true;
    try {
      const { data, status } = await getByMemberId({ word: value, user_type: 0 });
      datalist.value = status && [{ username: data.username, uid: data.uid }]
        ? [{ username: data.username, uid: data.uid }]
        : [];
    } catch (error) {
      console.error('Error fetching data:', error);
      datalist.value = []; // 出错时清空数据列表
    } finally {
      fetching.value = false;
    }
  }, 500);

  //handleSearch();

  function handleSelect(value) {
    if (value) {
      const selectedFilter = datalist.value.find((item) => item.uid === value);
      parent_name.value = selectedFilter ? selectedFilter.username : null;
      parant_uid.value = value;
    }
  }

  async function submitFun() {
    const values = await validate();
    values.birthday = values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : '';
    if (editdata.value.realname) {
      if (!values.realname) {
        return message.error(t('modalForm.member.member_name_tip1'));
      }
    }
    if (values.phone) {
      values['phone'] = values.countryCode + '-' + values.phone;
    }
    if (values.phone && !values.countryCode) {
      return message.error(t('modalForm.member.country_code1'));
    }
    values['parent_uid'] = parant_uid.value;
    if (parant_uid.value === '0') {
      delete values['parent_uid'];
    }
    values['level_id'] = Number(values.level_id);
    values['vip'] = Number(values.vip);
    //values['note'] = values.remark;
    values['note'] = values.note ? values.note : 'sg.ipx.tw.6666';
    delete values['parent_name'];
    setloading.value = true;
    values['uid'] = getId;
    delete values['member_type'];
    delete values['countryCode'];
    const { data, status } = await updateMember(values);

    try {
      status ? message.success(data) : message.error(data);
      setloading.value = false;
      if (history.state.key === 'active') {
        status ? $router.push({ name: 'ActiveMember' }) : '';
      } else {
        status ? $router.push({ name: 'InquiryMember' }) : '';
      }
    } catch (error) {
      message.error(error);
      setloading.value = false;
    }
  }
  function resetPassword(key: any) {
    setTitle.value =
      key === 'login'
        ? t('modalForm.member.member_login_password')
        : key === 'pay'
        ? t('modalForm.member.member_google_code')
        : t('modalForm.member.member_fund');
    setText.value =
      key === 'login'
        ? t('modalForm.member.member_login_tip')
        : key === 'pay'
        ? t('modalForm.member.member_google_tip')
        : t('modalForm.member.member_fund_tip');
    setKey.value = key;
    // openModalPay(true);
    openConfirm(setTitle.value, setText.value, async () => confirm(key));
  }
  function resetGoogle() {
    openConfirm(
      t('modalForm.member.member_google_code'),
      t('modalForm.member.member_google_tip'),
      async () => {
        const params = { uid: editdata?.value?.uid };
        const { status } = await setgooglePwd(params);
        if (status) {
          message.success(t('layout.setting.operatingTitle'));
        } else {
          message.success(t('table.member.member_balance_fail'));
        }
      },
    );
  }

  async function handlePwdRequest(apiFunction, id, key) {
    const { status, data } = await apiFunction(id);
    if (status) {
      passWordData.value = data;
      Modal.destroyAll();
      message.success(data);
      openModalSuc(true, { key, passWordData });
    } else {
      message.error(data);
    }
  }
  async function confirm(key) {
    const values = await validate();
    const params = { uid: editdata?.value?.uid };
    if (key === 'login') {
      await handlePwdRequest(userPwd, params, key);
    } else if (key === 'pay') {
      await handlePwdRequest(setgooglePwd, params, key);
    } else {
      await handlePwdRequest(setpayPwd, params, key);
    }
    openModalPay(false);
  }
  //会员详情获取
  async function getDetail(id) {
    const data = await getMemberDetails({ uid: id });
    editdata.value = data;
    CodeValue.value = countryTreeCodeList.map((item) => {
      return {
        value: item.attr,
        label: item.name,
      };
    });
    editdata.value.remark = '';
    editdata.value.member_tree = data.level_id;
    parent_name.value = data.parent_name;
    editdata.value.level_lock_state = Number(editdata.value.level_lock_state);
    parant_uid.value = data['parent_uid'];
    let [code] = editdata.value.phone && editdata.value.phone.split('-');
    let [, phone] = editdata.value.phone.split('-');
    setFieldsValue({
      ...editdata.value,
      countryCode: code ? code : '+1',
      phone: phone,
      realname: history.state.realname ? history.state.realname : data.realname,
    });
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-page-header-heading-title) {
    font-size: 1rem;
    font-weight: 500;
  }

  .editLayout {
    /* padding-top: 30px!important; */
    .footBouutn {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }
  }

  .label-item {
    ::v-deep(.ant-form-item-label) {
      label {
        display: inline-block;
        // width: 112px;
        height: 40px;
        overflow: hidden;
        color: #444;
        font-size: 14px;
        font-weight: 400;
        line-height: 40px;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  ::v-deep(.ant-page-header) {
    background-color: transparent;
  }

  ::v-deep(.vben-page-wrapper-content-bg) {
    background-color: transparent !important;
  }

  .vben-page-wrapper {
    height: calc(100vh - 120px);
    // background: #eef1f7; //藏在bg-white里面，所以强制设定背景颜色
    background-color: #fff;
  }

  ::v-deep(.ant-page-header-heading-left) {
    margin-top: 0;
    margin-bottom: 0;

    .ant-page-header-heading-title {
      color: #444;
      font-size: 18px;
      font-size: 500;
      line-height: 18px;
    }

    .ant-page-header-heading-title::before {
      content: ' ';
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-top: -2px;
      margin-right: 8px;
      background: no-repeat;
      background-image: url('/@/assets/images/member-edit.webp');
      background-position: center;
      background-size: 100%;
      vertical-align: middle;
    }

    .ant-page-header-back {
      margin-right: 15px;

      div svg {
        display: none;
      }

      div::after {
        content: ' ';
        display: inline-block;
        width: 9.1px;
        height: 14px;
        background: no-repeat;
        background-image: url('/@/assets/images/btn-left.webp');
        background-size: 100%;
        vertical-align: middle;
      }
    }
  }

  ::v-deep(.ant-form-item-control-input) {
    .ant-form-item-control-input-content {
      // 统一设置表单控件宽度
      .ant-input-affix-wrapper,
      .ant-select-selector,
      .ant-select,
      .ant-picker,
      .ant-input {
        width: 100% !important;
        min-width: 200px;
        max-width: 280px;
        color: #444;
        font-size: 14px;
      }

      // 选择器文本样式
      .ant-select-selection-item {
        width: auto !important;
        max-width: 100%;
        color: #444;
        font-size: 14px;
      }
    }
  }

  // 国家代码选择器特殊处理
  ::v-deep(.countryCode .ant-form-item-control .ant-form-item-control-input) {
    .ant-form-item-control-input-content {
      .ant-select-selector,
      .countryCodeClass {
        width: 100px !important;
        min-width: 80px;
        max-width: 100px;
        color: #444;
        font-size: 14px;
      }
    }
  }

  ::v-deep(.phoneCol) {
    width: calc(25% - 180px);
    margin-right: 20px;
  }
  // @media (min-width: 1880px) and (max-width: 1930px) {
  //   ::v-deep(.phoneCol) {
  //     margin-right: 20px;
  // 		width: 14.3%;
  //   }
  // }
  // @media (min-width: 2040px) and (max-width: 2200px) {
  //   ::v-deep(.phoneCol) {
  //     margin-right: 20px;
  // 		width: 15%;
  //   }
  // }
  // @media (min-width: 2200px) and (max-width: 2700px) {
  //   ::v-deep(.phoneCol) {
  //     margin-right: 25px;
  // 		width: 17%;
  //   }
  // }

  ::v-deep(.phoneCol .ant-form-item-control .ant-form-item-control-input) {
    .ant-form-item-control-input-content {
      .countryCodeInput {
        width: 200px !important;
        height: 40px;
        color: #444;
        font-size: 14px;
      }
    }
  }

  ::v-deep(.ant-col):not(.ant-col-24, .ant-form-item-control, .ant-form-item-label) {
    //border: 1px solid red;
    .ant-form-item {
      //border: 1px solid blue;
      float: left;
    }
  }

  ::v-deep(.ant-btn) {
    color: #2f4553;
    font-size: 14px;

    &.ant-btn-primary {
      background-color: #1475e1;
    }
  }

  /* .editLayout ::v-deep(.vben-basic-form) {
      padding-top: 100px;
  } */
  ::v-deep(.compatible-style) {
    .ant-radio-group {
      white-space: nowrap !important;
    }
  }
</style>
