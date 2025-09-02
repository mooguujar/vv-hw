<template>
  <div class="vip-configuration flex">
    <div class="flex-1 min-w-580px">
      <BasicForm
        :size="FORM_SIZE"
        :schemas="setingFormData1"
        layout="horizontal"
        :showActionButtonGroup="false"
      >
        <template #CurrencyConfig="{ model, field }">
          <Row class="flex items-center">
            <Col :span="12">
              <template v-if="field === 'bonusConditions'">
                <a-button type="link" @click="previewDetails(field)">
                  {{ $t('common.click_preview') }}
                </a-button>
              </template>
              <template v-else-if="field === 'vipMode'">
                <span class="py-[4px] pl-[15px]"> {{ showText(field) }}</span>
                <template v-if="vipData.vipMode === '2'">
                  <cdIconCurrency class="!w-5" :icon="currentyOptions[vipData.currency]" />
                  <span class="!align-middle m-l-8px">{{ currentyOptions[vipData.currency] }}</span>
                </template>
              </template>
              <template v-else>
                <div class="py-[4px] pl-[15px]"> {{ showText(field) }}</div>
              </template>
            </Col>
            <Col :span="12" class="text-end">
              <a-button type="link" @click="openModal(field)">
                {{ $t('common.click_settings') }}
              </a-button>
            </Col>
          </Row>
        </template>
      </BasicForm>
    </div>
    <div class="w-8% min-w-20px"></div>
    <div class="flex-1 min-w-580px">
      <BasicForm
        :size="FORM_SIZE"
        :schemas="setingFormData2"
        layout="horizontal"
        :showActionButtonGroup="false"
      >
        <template #CurrencyConfig="{ model, field }">
          <Row class="flex items-center">
            <Col :span="12">
              <template v-if="['deliveryTime', 'activityRules'].includes(field)">
                <a-button type="link" @click="previewDetails(field)">
                  {{ $t('common.click_preview') }}
                </a-button>
              </template>
              <template v-else>
                <div class="py-[4px] pl-[15px]"> {{ showText(field) }}</div>
              </template>
            </Col>
            <Col :span="12" class="text-end">
              <a-button type="link" @click="openModal(field)">
                {{ $t('common.click_settings') }}
              </a-button>
            </Col>
          </Row>
        </template>
      </BasicForm>
    </div>
    <!-- 前台入口 -->
    <EntranceModal @register="registerEntranceConfig" />
    <!-- vip模式 -->
    <VipModeModal @register="registeVipModeConfig" />
    <!-- 统计平台 -->
    <StatilPlatModal @register="registeStatilPlatConfig" />
    <!-- 奖金条件 -->
    <PrizeConditionModal @register="registerPrizeConfig" />
    <!-- 稽核倍数 -->
    <AuditMultiplierModal @register="registeAuditMultiplierConfig" />
    <!-- 派送开关 -->
    <DeliverySwitchModal @register="registeDeliverySwitchConfig" />
    <!-- 派送时间 -->
    <DeliveryTimeModal @register="registeDeliveryTimeConfig" />
    <!-- 保级开关-->
    <ProtectionSwitchModal @register="registeProtectionSwitchConfig" />
    <!-- 活动规则 -->
    <AactivityRulesModal @register="registeAactivityRulesConfig" :vipData="vipData" />
  </div>
</template>
<script lang="ts" setup>
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { setingFormData1, setingFormData2 } from './VipConfiguration.data';
  import { BasicForm } from '/@/components/Form/index';
  import { Col, Row } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import { useModal } from '/@/components/Modal';
  import { ref, onBeforeMount, provide, inject } from 'vue';
  import { updateVipRebateWay, updateVipUpdate, getConfigMemberVip } from '@/api/member/index';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import EntranceModal from './EntranceModal.vue';
  import VipModeModal from './VipModeModal.vue';
  import StatilPlatModal from './StatilPlatModal.vue';
  import PrizeConditionModal from './PrizeConditionModal.vue';
  import AuditMultiplierModal from './AuditMultiplierModal.vue';
  import DeliverySwitchModal from './DeliverySwitchModal.vue';
  import DeliveryTimeModal from './DeliveryTimeModal.vue';
  import ProtectionSwitchModal from './ProtectionSwitchModal.vue';
  import AactivityRulesModal from './AactivityRulesModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { createMessage } = useMessage();
  provide('getData', () => getData.value);
  provide('setData', (data) => setData(data));
  const initTableData = inject<Function>('initTableData');

  const [registerEntranceConfig, { openModal: openEntranceConfig }] = useModal();
  const [registeVipModeConfig, { openModal: openVipModeConfig }] = useModal();
  const [registeStatilPlatConfig, { openModal: openStatilPlatConfig }] = useModal();
  const [registerPrizeConfig, { openModal: openPrizeConfig }] = useModal();
  const [registeAuditMultiplierConfig, { openModal: openAuditMultiplierConfig }] = useModal();
  const [registeDeliverySwitchConfig, { openModal: openDeliverySwitchConfig }] = useModal();
  const [registeDeliveryTimeConfig, { openModal: openDeliveryTimeConfig }] = useModal();
  const [registeProtectionSwitchConfig, { openModal: openProtectionSwitchConfig }] = useModal();
  const [registeAactivityRulesConfig, { openModal: openAactivityRulesConfig }] = useModal();
  const { t } = useI18n();
  const FORM_SIZE: any = useFormSetting().getFormSize;
  const disabled = ref(true);
  const vipData = ref({
    entrance: undefined,
    multiple: undefined,
    vipMode: undefined,
    protectionSwitch: undefined,
    currency: '701',
    deliverySwitch: undefined,
    statilPlat: undefined,
  });
  const getData = ref([]);

  function previewDetails(string) {
    disabled.value = true;
    switch (string) {
      // 积分条件
      case 'bonusConditions':
        openPrizeConfig(true, 'data');
        break;
      // 派送时间
      case 'deliveryTime':
        openDeliveryTimeConfig(true, 'data');
        break;
      // 活动规则
      case 'activityRules':
        openAactivityRulesConfig(true, 'data');
        break;
      default:
        break;
    }
  }

  /**
   * 打开对应模态窗
   */
  function openModal(string) {
    disabled.value = false;

    switch (string) {
      // 前台入口
      case 'entrance':
        openEntranceConfig(true, 'data');
        break;
      // vip模式
      case 'vipMode':
        openVipModeConfig(true, 'data');
        break;
      // 统计平台
      case 'statilPlat':
        openStatilPlatConfig(true, 'data');
        break;
      // 积分条件
      case 'bonusConditions':
        openPrizeConfig(true, 'data');
        break;
      // 稽核倍数
      case 'multiple':
        openAuditMultiplierConfig(true, 'data');
        break;
      // 派送开关
      case 'deliverySwitch':
        openDeliverySwitchConfig(true, 'data');
        break;
      // 派送时间
      case 'deliveryTime':
        openDeliveryTimeConfig(true, 'data');
        break;
      // 保级开关
      case 'protectionSwitch':
        openProtectionSwitchConfig(true, 'data');
        break;
      // 活动规则
      case 'activityRules':
        openAactivityRulesConfig(true, 'data');
        break;
      default:
        break;
    }
  }

  /**
   * 过滤回显文字
   */
  function showText(string) {
    let text = '-';
    switch (string) {
      case 'entrance':
        let entrance = vipData.value?.entrance;
        text =
          entrance === '1'
            ? t('business.common_on')
            : entrance === '2'
            ? t('business.common_off')
            : '-';
        return text;
      case 'vipMode':
        // let vipMode = vipData.value?.vipMode;
        text = '';
        // if (vipMode === '1') {
        //   text = t('common.integration_mode');
        // } else if (vipMode === '2') {
        //   text = t('common.currency_mode') + '：';
        // } else {
        //   text = '-';
        // }
        return text;
      case 'multiple':
        let multiple = vipData.value?.multiple;
        return multiple;
      case 'statilPlat':
        let statilPlat = vipData.value?.statilPlat;
        return statilPlat ? t('common.all_venues') : t('common.Designated_venue');
      case 'deliverySwitch':
        let deliverySwitch = vipData.value?.deliverySwitch;
        return deliverySwitch === '1'
          ? t('common.open_all')
          : deliverySwitch === '2'
          ? t('common.close_all')
          : t('common.open_partially');
      case 'protectionSwitch':
        let protectionSwitch = vipData.value?.protectionSwitch;
        text =
          protectionSwitch === '1'
            ? t('business.common_on')
            : protectionSwitch === '2'
            ? t('business.common_off')
            : '-';
        return text;
      default:
        return t('common.view');
    }
  }

  async function setData(data) {
    try {
      let { status } = Array.isArray(data)
        ? await updateVipUpdate(data)
        : await updateVipRebateWay(data);
      if (status) {
        createMessage.success(t(`sys.api.operationSuccess`));
      } else {
        createMessage.error(t(`sys.api.operationFailed`));
      }
      reloadData();
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  }

  async function initData() {
    getData.value = await getConfigMemberVip({ flag: 0 });
    vipData.value = {
      //  前台入口展示
      entrance: getData.value.filter((p) => p.ty === 9 && p.key === 'show')[0].value,
      // vip模式
      vipMode: getData.value.filter((p) => p.ty === 10 && p.key === 'mode')[0].value,
      // 币种模式
      currency: getData.value.filter((p) => p.ty === 10 && p.key === 'currency')[0].value,
      // 稽核倍数
      multiple: getData.value.filter((p) => p.ty === 12 && p.key === 'multiple')[0].value,
      // 保级开关
      protectionSwitch: getData.value.filter((p) => p.ty === 15 && p.key === 'keep')[0].value,
      // 奖金派送开关
      deliverySwitch: getData.value.filter((p) => p.ty === 13).every((p) => p.value === '1')
        ? '1'
        : getData.value.filter((p) => p.ty === 13).every((p) => p.value === '2')
        ? '2'
        : '3',
      // 统计平台
      statilPlat: getData.value.filter((p) => p.ty === 11 && p.key === 'platform')[0].value === '0',
      // 统计平台
      activityRules: getData.value.filter((p) => p.ty === 16),
    };
  }
  async function reloadData() {
    await initData();
    await initTableData?.(getData.value);
  }
  onBeforeMount(async () => {
    reloadData();
  });

  defineExpose({
    initData,
  });
</script>
<style lang="less" scoped>
  .vip-configuration {
    border-radius: 4px;
    border: 1px solid #e1e1e1;
    background: #e0e5ef;
    padding: 20px 15% 0 20px;
  }
  ::v-deep(label.ant-form-item-no-colon) {
    font-size: 16px;
  }
  ::v-deep(.ant-form-item-control-input-content) {
    font-size: 15px;
    button {
      font-size: 15px !important;
    }
  }
  ::v-deep(.form-item-serial) {
    height: 23px;
    width: 23px;
    font-size: 16px;
    background-color: #1475e1 !important;
  }
  ::v-deep(.ant-form-item-label) {
    text-align: left;
    margin-left: 5px;
  }
  :deep(.t-form-large-size) {
    height: 53px;
  }
</style>

<style lang="less">
  .vip-configuration {
    .ant-form {
      > .ant-row {
        // margin-left: 30px;
        > .ant-col {
          padding: 15px 9px 11px 24px;
          height: 50px;
          line-height: 50px;
          border-radius: 4px;
          border: 1px solid #e1e1e1;
          background: #fff;
          margin-bottom: 20px;
          > div {
            height: 20px;
            display: flex;
            align-items: center;
            .ant-form-item {
              margin-bottom: 0;
              display: flex;
              width: 100%;
            }
          }
        }
        .form-item-serial {
          position: inherit;
          margin-right: 8px;
        }
        .ant-form-item-label {
          margin-left: 0;
        }
        .ant-form-item-control {
          flex-grow: 1;
          width: 20px !important;
          min-width: max-content;
        }
      }
    }
  }

  @media only screen and (min-width: 1500px) {
    .vip-configuration {
      .ant-form {
        > .ant-row .ant-form-item-label {
          margin-right: 20%;
        }
      }
    }
  }
</style>
