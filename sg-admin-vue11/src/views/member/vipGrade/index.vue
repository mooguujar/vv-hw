<template>
  <div class="vip-level">
    <PageWrapper :contentStyle="{ margin: '20px 15px 20px 20px' }">
      <header>
        <Space :size="12">
          <Button type="primary" @click="editGrade" v-if="isHasAuth('10516')">
            {{ $t('table.member.member_update_level') }}</Button
          >
          <!-- <Button @click="setVipUpdate" v-if="isHasAuth('10540')">{{
            $t('table.member.member_rate_config')
          }}</Button> -->
          <!-- <Button @click="openScoreConfigModal" v-if="isHasAuth('10533')">{{
            $t('table.member.member_points_config')
          }}</Button> -->
          <!-- <Button @click="openPrizeConfigModal" v-if="isHasAuth('10534')">{{
            $t('table.member.member_bouns_condition')
          }}</Button> -->
          <Button type="primary" @click="receive" v-if="isHasAuth('10515')">{{
            $t('table.member.member_receive_record')
          }}</Button>
        </Space>
      </header>
      <div class="activeBox">
        <div class="activHeader">
          <h3 class="leading-50px">{{ t('common.activeTitle1') }}</h3>
        </div>
        <VipConfiguration ref="VipConfigurationRef" />
      </div>
      <div class="activeBox">
        <div class="activHeader">
          <h3 class="leading-50px">{{ t('common.level_list') }}</h3>
        </div>
        <div class="activeBody">
          <Space :size="12" class="mb-20px">
            <Button :type="configType === 1 ? 'primary' : ''" @click="selectConfigType(1)">{{
              t('modalForm.system.system_basic_configuration')
            }}</Button>
            <Button
              :type="configType === 2 ? 'primary' : ''"
              @click="selectConfigType(2)"
              v-if="isHasAuth('10520')"
              >{{ t('modalForm.member.member_bonus_allocation') }}</Button
            >
          </Space>
          <KeepAlive>
            <component :is="activeComponent" />
          </KeepAlive>
        </div>
      </div>
    </PageWrapper>
    <EditGrade @register="registerEditModal" />
    <Receive @register="registerReceive" />
    <vipConfigModal @register="registerVipConfig" />
    <ScoreConfigModal @register="registerScoreConfig" />
    <PrizeConditionModal @register="registerPrizeConfig" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref, provide, nextTick } from 'vue';
  import { auths, isHasAuth } from '@/utils/authFunction';
  import { Space, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import Receive from './components/Receive.vue';
  import EditGrade from './components/EditGrade.vue';
  import vipConfigModal from './components/vipConfigModal.vue';
  import ScoreConfigModal from './components/ScoreConfigModal.vue';
  import PrizeConditionModal from './components/PrizeConditionModal.vue';
  import VipConfiguration from './components/VipConfiguration.vue';
  import BasiaTable from './components/BasiaTable.vue';
  import BonusTable from './components/BonusTable.vue';

  const [registerEditModal, { openModal: openEdit }] = useModal();
  const [registerVipConfig] = useModal();
  const [registerReceive, { openModal: openReceive }] = useModal();
  provide('initTableData', initData);
  provide('reloadTableData', reloadTable);
  provide('reloadFormData', reloadForm);
  const baseData = ref([]);
  const baseKey = ref(0);
  const VipConfigurationRef = ref(null);
  /** 更新VIP等级 */
  function editGrade() {
    openEdit(true, 'data');
  }

  /** 领取记录 */
  function receive() {
    openReceive(true, 'data');
  }

  const { t } = useI18n();
  /** 配置类型 */
  const configType = ref<number>(1);

  const activeComponent = computed(() => {
    return configType.value == 1 ? BasiaTable : BonusTable;
  });

  function selectConfigType(type) {
    configType.value = type;
  }

  function initData(data) {
    baseKey.value++;
    baseData.value = data;
  }

  function reloadTable() {
    return {
      baseKey: baseKey.value,
      baseData: baseData.value,
    };
  }
  function reloadForm() {
    VipConfigurationRef.value.initData();
  }
</script>
<style lang="less" scoped>
  .vip-level {
    // padding: 20px;
    background-color: #eef1f7;

    .ant-btn {
      height: 45px;
      padding: 5px 25px;
    }

    ::v-deep(.capsule_tap .ant-tabs-tab-btn) {
      height: 45px;
      padding: 5px 40px;
      line-height: 36px;
    }

    ::v-deep(.t-form-label-com) {
      margin-bottom: 26px;
    }

    .save-toolbar-box {
      margin-bottom: 20px;
    }
  }
  .activeBody {
    border-radius: 4px;
    border: 1px solid #e1e1e1;
    background: #e0e5ef;
    padding: 20px;
  }
  ::v-deep(.ant-input-number-input) {
    text-align: center;
  }

  ::v-deep(.toolbar-box .savaButton[disabled]) {
    border: 1px solid #e1e1e1 !important;
    background: #f5f5f5 !important;
  }

  ::v-deep(.add-creat-vip-c) {
    display: flex;
    justify-content: center;

    .ant-btn.add-creat-vip {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20%;
      // width: 122px !important;
      height: 42px !important;
      margin-top: 10px;
      // margin-left: calc(50% - 61px);
      // border-radius: 42px !important;
      // border-color: #1475e1;
      background-color: #1475e1;
      color: #fff;

      &[disabled] {
        border: 1px solid #e1e1e1 !important;
        background: #f5f5f5 !important;
        color: rgb(0 0 0 / 25%);
      }
      // font-size: 22px !important;
      svg {
        font-size: 20px;
      }
    }
  }

  ::v-deep(.ant-table) {
    background-color: transparent !important;
  }

  ::v-deep(.ant-btn) {
    //width: 120px;
    height: 42px;
    //padding: 0 !important;
    border: 1px solid #e1e1e1 !important;
    box-shadow: none !important;
    font-size: 14px !important;
    font-weight: 500 !important;

    &.ant-btn-primary {
      border: 1px solid #1475e1 !important;
      background-color: #1475e1 !important;
    }
  }

  ::v-deep(.vben-basic-table .ant-table-wrapper .ant-table-title) {
    padding-top: 2px !important;
    padding-bottom: 0 !important;
  }

  ::v-deep(.ant-table-container) {
    th {
      height: 62px !important;
    }

    tr:not(:first-child) > td {
      height: 62px !important;
    }
  }

  ::v-deep(.ant-input-number-input) {
    height: 40px !important;
  }

  ::v-deep(.ant-table.ant-table-middle .ant-table-tbody > tr > td) {
    padding: 8px 6px;
  }

  ::v-deep(.vben-basic-table-header__tableTitle > *) {
    margin-bottom: 0 !important;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  .toolbar-box {
    display: flex;
    position: absolute;
    margin-right: 0 !important;

    button {
      margin-left: 10px !important;
    }
  }

  .member-number {
    color: #409eff;
  }

  .btn-icon {
    margin-top: -2px !important;
    margin-right: 5px;
  }

  ::v-deep(.ant-btn-link) {
    border: none !important;
    text-align: center !important;

    span {
      width: 100%;
      text-align: center !important;
    }

    &::v-deep(.ant-btn-error) {
      span {
        color: #e91134 !important;
      }
    }
  }

  ::v-deep(.vipClassGrade .ant-table-body .ant-table-tbody .ant-table-cell > div) {
    width: 100% !important;
  }

  ::v-deep(.vipClassGrade .ant-table-row:nth-of-type(odd)) {
    background-color: #f6f7fb !important;
  }

  //
  ::v-deep(.vipClassGrade .ant-table-row:nth-of-type(even)) {
    background-color: #fff !important;
  }

  ::v-deep(.vipClassGrade .ant-table-row:nth-of-type(even) > .ant-table-cell-row-hover) {
    background-color: transparent !important;
  }

  ::v-deep(.vipClassGrade .ant-table-row:nth-of-type(odd) > .ant-table-cell-row-hover) {
    background-color: transparent !important;
  }

  :deep(.vipTableAction) {
    .ant-btn {
      width: 50px;
    }
  }

  .activeBox {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    margin-bottom: 0;
    // border: 1px solid #d9d9d9;
    // background-color: #f6f7fb;

    .activHeader {
      display: flex;
      align-items: center;
      width: 100%;
      height: 68px;

      > h3 {
        margin-bottom: 0;
        color: #444;
        font-size: 18px;
      }
    }

    .activContent {
      width: 100%;
      min-height: 350px;
      padding: 20px;
      background-color: #e0e5ef;
    }
  }

  ::v-deep(.vipClassGrade .vben-editable-cell .ellipsis-cell .cell-content) {
    max-width: 100%;
  }

  ::v-deep(.ant-table-title) {
    padding-top: 2px;
  }
  ::v-deep(.ant-table-body) {
    overflow-y: hidden !important;
  }
</style>

<style lang="less">
  #app:has(.vip-level) {
    .ant-back-top {
      display: none;
    }
  }
  :root {
    --vxe-ui-table-row-striped-background-color: #f6f7fb;
    --vxe-ui-table-header-background-color: #f6f7fb;
    --vxe-ui-font-size-default: 14px;
    --vxe-ui-table-header-font-color: #000000d9;
  }
</style>
