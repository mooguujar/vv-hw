<template>
  <PageWrapper
    :back="goBack"
    :title="setTitle"
    contentBackground
    :contentStyle="{ margin: '10px', marginLeft: '20px' }"
    class="rounded-lg"
  >
    <Tabs v-model:active-key="activeKey" :destroyInactiveTabPane="true">
      <Tab-pane key="1" :tab="t('table.member.member_info_')">
        <BasicInfo
          :key="Math.random()"
          @history-route="historyRoute"
          :history_="DetailsMember_state"
          @account-route="linkAccountRoute"
        />
      </Tab-pane>
      <Tab-pane key="2" :tab="t('table.member.member_bet_count')">
        <Betting />
      </Tab-pane>
      <Tab-pane key="3" :tab="t('table.member.member_account_chnages')">
        <AccountChanges />
      </Tab-pane>
      <Tab-pane key="9" :tab="t('table.member.Rebate_list')">
        <rebateLogList />
      </Tab-pane>
      <Tab-pane key="4" :tab="t('table.member.member_fund_log')" v-if="isHasAuth('10127')">
        <FundingLog />
      </Tab-pane>
      <Tab-pane key="5" :tab="t('table.member.member_operate_log')" v-if="isHasAuth('10125')">
        <Operationlog />
      </Tab-pane>
      <Tab-pane key="6" :tab="t('table.member.member_login_log')" v-if="isHasAuth('10123')">
        <LoginLog />
      </Tab-pane>
      <Tab-pane key="7" :tab="t('table.member.member_link_accont')">
        <LinkAccount ref="refMode" :data="getDetail" />
      </Tab-pane>
    </Tabs>
    <loginHistory @register="registerHistory" />
  </PageWrapper>
</template>
<script setup lang="ts" name="DetailsMember">
  import { ref, watch, nextTick, onActivated } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import loginHistory from '/@/views/member/memberLog/component/loginHistory.vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '@/utils/authFunction';

  import {
    BasicInfo,
    Betting,
    LinkAccount,
    Operationlog,
    AccountChanges,
    LoginLog,
    FundingLog,
    rebateLogList,
  } from './compnents/index';
  import { router } from '/@/router';

  const { t } = useI18n();
  const getDetail = ref({ value: '', type: 5 } as any);
  const activeKey = ref('1');

  defineEmits(['register']);
  let refMode = ref(null);
  watch(activeKey, (newVal) => {
    DetailsMember_state.value.path == '/member/inquiryMember'
      ? sessionStorage.setItem('inquiryMember_activeKey', newVal)
      : sessionStorage.setItem('activeMember_activeKey', newVal);
    nextTick(() => {
      if (newVal === '7') {
        refMode?.value?.sucessReload();
      }
    });
  });
  //const props = defineProps<any>();
  const [registerHistory] = useModal();
  let setTitle = ref('' as any);
  let DetailsMember_state = ref({});

  const infoDetailsMember_state = () => {
    try {
      let data = JSON.parse(sessionStorage.getItem('DetailsMember_state') as string);
      DetailsMember_state.value = data;
      history.replaceState(data, '');
    } catch (e) {
      console.error('e', e);
    }
    DetailsMember_state.value.path == '/member/inquiryMember'
      ? (activeKey.value = sessionStorage.getItem('inquiryMember_activeKey') || '1')
      : (activeKey.value = sessionStorage.getItem('activeMember_activeKey') || '1');
    if (activeKey.value == 'null' || activeKey.value == null) activeKey.value = '1';
    sessionStorage.setItem('detailsMember', DetailsMember_state.value.path || '');
    setTitle.value =
      history.state.key === 'active'
        ? `${t('routes.member.online_detail')} ${history.state.username}`
        : `${t('routes.member.details')} ${history.state.username}`; // 在线会员详情，会员详情
  };

  const goBack = () => {
    sessionStorage.setItem('DetailsMember_state', '');
    sessionStorage.setItem('detailsMember', '');
    DetailsMember_state.value.path ? router.replace(DetailsMember_state.value.path) : router.go(-1);
  };
  // 支付密码弹框

  function historyRoute() {
    activeKey.value = '6';
  }
  function linkAccountRoute(data) {
    getDetail.value = data;
    activeKey.value = '7';
  }
  onActivated(() => {
    infoDetailsMember_state();
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-page-header-heading-title) {
    //font-size: 1rem;
    font-size: 18px !important;
    font-weight: 500;
  }

  ::v-deep(.vben-page-wrapper-content) {
    margin: 0;
  }

  ::v-deep(.ant-table-wrapper) {
    padding: 0;
  }

  ::v-deep(.ant-tabs-content-holder) {
    //  margin: 20px 20px 40px;
    margin-top: 20px;
  }

  ::v-deep(.ant-tabs-nav) {
    margin-bottom: 0;
    //margin-left: 20px;
    margin-left: 0;
  }

  ::v-deep(.ant-page-header) {
    background-color: transparent !important;
  }

  ::v-deep(.vben-page-wrapper-content-bg) {
    background-color: transparent !important;
  }

  //这页的胶囊tab
  ::v-deep(.ant-tabs-nav-list) {
    padding: 5px !important;
    border: 1px solid #e1e1e1;
    border-radius: 50px;
    background-color: #fff;
  }

  ::v-deep(.ant-tabs-nav-list > .ant-tabs-tab) {
    width: 100% !important;
    margin-left: 0 !important;
    //border: 1px solid blue;
    padding: 0 !important;
  }

  ::v-deep(.ant-tabs-tab-btn) {
    height: 42px;
    padding-right: 18px;
    padding-left: 18px;
    border-radius: 50px;
    font-size: 16px;
    line-height: 42px;
  }

  ::v-deep(.ant-tabs-tab-btn):hover {
  }

  ::v-deep(.ant-tabs-tab-active > .ant-tabs-tab-btn) {
    background-color: #1475e1;
    color: #fff;
    font-size: 16px;
  }

  ::v-deep(.ant-tabs-ink-bar) {
    display: none !important;
    font-family: 'PingFang SC';
    font-size: 18px;
    font-weight: 600;
    line-height: 22px;
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

  // 胶囊结束
  //表格样式 （不用放公共区）
  ::v-deep(.text-base) {
    //background-color: red!important;
    color: #444 !important;
  }

  ::v-deep(.member-title) {
    background-color: #f6f7fb;
  }

  ::v-deep(.ant-tag-red) {
    height: 28px;
    padding-right: 10px;
    padding-left: 10px;
    border: 1px solid #e91134;
    background-color: transparent;
    color: #e91134;
    font-size: 14px;
    font-weight: 500;
    line-height: 28px;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav::before) {
    border-bottom: none !important;
  }

  .desc-wrap {
    padding: 16px;
    background-color: @component-background;
  }

  .disButton {
    display: flex;
    justify-content: center;
    margin: 40px auto;
  }

  .description-item-content {
    //  width: 200px ;
    white-space: normal;

    /* 或者使用 pre-line */
  }
</style>
