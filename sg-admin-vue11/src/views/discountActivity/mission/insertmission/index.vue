<template>
  <PageWrapper contentClass="editLayout" :title="bigTitle" contentBackground>
    <template #headerContent>
      <a-button :size="FORM_SIZE" @click="goBack" class="mr-10px">
        {{ t('business.common_cancel') }}
      </a-button>
      <a-button
        type="primary"
        :size="FORM_SIZE"
        :disabled="toDisabled"
        :loading="btnloading"
        @click="submitOk"
      >
        {{ $t('common.saveText') }}
      </a-button>
    </template>
    <div class="bg-white mission-box">
      <BasicForm @register="registerForm" :size="FORM_SIZE" :schemas="ProcessLeftData()">
        <template #basicInfo1>
          <div class="activHeader">
            <h3>{{ t('common.activeTitle1') }}</h3>
          </div>
        </template>
        <template #basicInfo2>
          <div class="activHeader">
            <h3>{{ t('common.conditional_configuration') }}</h3>
          </div>
        </template>
        <template #basicInfo3>
          <div class="display-flex">
            <div class="w-2 h-4 mt-1 mr-2 bg-blue-500"></div>
            <h1>{{ t('table.member.mission_basic3') }}</h1>
          </div>
        </template>
        <template #langSlot="{ model, field }">
          <!-- 语言框 -->
          <Row>
            <FormItemRest>
              <Checkbox
                :disabled="toDisabled"
                v-model:checked="openTerminalState.checkAll"
                :indeterminate="openTerminalState.indeterminate"
                @change="onCheckAllChange($event, model, field)"
              >
                {{ t('business.common_select_all') }}
              </Checkbox>
            </FormItemRest>
            <CheckboxGroup
              :disabled="toDisabled"
              v-model:value="openTerminalState.checkedList"
              :options="langOptions"
              @change="onChangeOpenTerminal($event, model, field)"
            />
          </Row>
        </template>
        <template #clientSlot1="{ model, field }">
          <!-- 展示终端 -->
          <Row>
            <FormItemRest>
              <Checkbox
                :disabled="toDisabled"
                v-model:checked="openClientState1.checkAll"
                :indeterminate="openClientState1.indeterminate"
                @change="onClientCheckAllChange1($event, model, field)"
              >
                {{ t('business.common_select_all') }}
              </Checkbox>
            </FormItemRest>
            <CheckboxGroup
              :disabled="toDisabled"
              v-model:value="openClientState1.checkedList"
              :options="ClientOptions1"
              @change="onChangeOpenClient1($event, model, field)"
            />
          </Row>
        </template>
        <template #clientSlot2="{ model, field }">
          <!-- 注册端口 -->
          <Row>
            <FormItemRest>
              <Checkbox
                :disabled="toDisabled"
                v-model:checked="openClientState2.checkAll"
                :indeterminate="openClientState2.indeterminate"
                @change="onClientCheckAllChange2($event, model, field)"
              >
                {{ t('business.common_select_all') }}
              </Checkbox>
            </FormItemRest>
            <CheckboxGroup
              :disabled="toDisabled"
              v-model:value="openClientState2.checkedList"
              :options="ClientOptions2"
              @change="onChangeOpenClient2($event, model, field)"
            />
          </Row>
        </template>
        <template #clientSlot3="{ model, field }">
          <!-- 下载端口 -->
          <Row>
            <FormItemRest>
              <Checkbox
                :disabled="toDisabled"
                v-model:checked="openClientState3.checkAll"
                :indeterminate="openClientState3.indeterminate"
                @change="onClientCheckAllChange3($event, model, field)"
              >
                {{ t('business.common_select_all') }}
              </Checkbox>
            </FormItemRest>
            <CheckboxGroup
              :disabled="toDisabled"
              v-model:value="openClientState3.checkedList"
              :options="ClientOptions3"
              @change="onChangeOpenClient3($event, model, field)"
            />
          </Row>
        </template>
        <!-- 开始时间 -->
        <template #startTime>
          <Row>
            <Col :span="11">
              <FormItem>
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :allowClear="false"
                  v-model:value="time.start_at"
                  @change="
                    () => {
                      changTime('start_at');
                    }
                  "
                  :disabled="toDisabled"
                />
              </FormItem>
            </Col>
            <Col :span="2">
              <div class="w-full">
                <div class="line"></div>
              </div>
            </Col>
            <Col :span="11">
              <FormItem>
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :disabled="toDisabled"
                  :allowClear="false"
                  v-model:value="time.end_at"
                  @change="
                    () => {
                      changTime('end_at');
                    }
                  "
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <!-- 奖励金额 -->
        <template #bonusAmountSlot>
          <div>
            <Row>
              <Col :span="24">
                <FormItem>
                  <InputNumber
                    :size="FORM_SIZE"
                    :placeholder="t('table.promotion.promotion_please_enter')"
                    stringMode
                    v-model:value="valid_bet_amount"
                    style="width: 100%"
                    :disabled="toDisabled"
                  >
                    <template #prefix>
                      <CdIconCurrency :icon="currentyOptions[currentCurryId]" style="width: 20px" />
                    </template>
                  </InputNumber>
                </FormItem>
              </Col>
            </Row>
          </div>
        </template>
        <template #bonusAmountSlot2>
          <div>
            <Row>
              <Col :span="11">
                <FormItem>
                  <InputNumber
                    :size="FORM_SIZE"
                    :placeholder="t('table.promotion.promotion_please_enter')"
                    stringMode
                    v-model:value="valid_bet_amount"
                    style="width: 100%"
                    :disabled="toDisabled"
                  >
                    <template #prefix>
                      <CdIconCurrency :icon="currentyOptions[currentCurryId]" style="width: 20px" />
                    </template>
                  </InputNumber>
                </FormItem>
              </Col>
              <Col :span="2" class="!text-center mt-2">～</Col>
              <Col :span="11">
                <FormItem>
                  <InputNumber
                    :size="FORM_SIZE"
                    :placeholder="t('table.promotion.promotion_please_enter')"
                    stringMode
                    v-model:value="bonus_rate"
                    style="width: 100%"
                    :disabled="toDisabled"
                  >
                    <template #prefix>
                      <CdIconCurrency :icon="currentyOptions[currentCurryId]" style="width: 20px" />
                    </template>
                  </InputNumber>
                </FormItem>
              </Col>
            </Row>
          </div>
        </template>
        <!-- :disabled="toDisabled" -->
        <template #CurrencyConfig="{ model, field }">
          <CurryRadioGroup
            ref="currencyRadioRef"
            :contentList="currenyLang"
            @update:click="changeHandleCurry"
            v-model="model[field]"
            v-model:currencyId="currentCurryId"
          />
        </template>
        <template #task_params>
          <Row>
            <Col :span="24">
              <FormItem>
                <Select
                  :size="FORM_SIZE as any"
                  :disabled="toDisabled"
                  v-model:value="taskActive"
                  :options="taskOptions"
                  @change="changTaskActive"
                  style="height: 40px"
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <template #zhNameTextSlot="{ model, field }">
          <div class="flex">
            <Input
              :size="FORM_SIZE"
              :placeholder="t('v.discount.activity.mission_name')"
              v-model:value="model[field]"
              :disabled="toDisabled"
              @blur="handleTinymceBlurZx"
              style="height: 40px"
            />
            <Button
              type="primary"
              class="m-l-5"
              :disabled="toDisabled"
              :size="FORM_SIZE"
              @click="handleMoreLagarage('zh_name')"
              v-if="typeof systemCurrency !== 'string'"
              >{{ t('v.discount.activity.more_language') }}
            </Button>
          </div>
        </template>
        <template #NegativeConfigType v-if="platform_range == 2">
          <TableCheckbox
            class="ml-20px"
            v-model:checkedKeys="current_platform_ids"
            :current_platform_ids="current_platform_ids"
            :data="venueList"
            :check-strictly="false"
            :model_current_platform_ids="true"
            :default-checked-keys="platform_ids"
            v-model:tabValue="tabValue"
            defaultExpandAll
            :replaceFields="{
              children: 'list',
              title: 'name',
              key: 'value',
              label: 'label',
            }"
            @handle-checkbox-change="handleCheckboxChange"
          />
        </template>
        <template #NegativeConfigType1>
          <wallet
            ref="wallet_slot"
            class="left ml-20px"
            v-model:selectList="selectList"
            :currencyName_="currencyName"
            :clientList="clientList"
            :incentiveConfig="0"
            v-model="currentCurryId"
            :firstCurrencyId="'CNY'"
            :XYtableData="[]"
            :getDeatilId="false"
            :getDeatilId1="Timestamp_before_disabled"
          />
        </template>
        <template #vip="{ model, field }">
          <Space class="space-box">
            <Button
              :disabled="toDisabled"
              :class="{
                'ant-btn-primary': VIPLevelActiveIndex.some((item) => item === +index),
              }"
              class="w-[53px] h-[36px] mr-5px mb-5px"
              style="padding: 0 !important"
              v-for="(item, index) in allVipConfig"
              :key="index"
              @click="changeVIPLevelActiveIndex(item, index)"
              >{{ 'VIP' + item.level }}
            </Button>
          </Space>
        </template>
        <!-- 表格 -->
        <template #commonTable>
          <commonTable
            ref="commonTable_"
            v-model="currentCurryId"
            :toDisabled="toDisabled"
            :currencyList="currencyList"
            :platform_range="platform_range"
            :current_platform_ids="current_platform_ids"
            :all_platform_ids="all_platform_ids"
            :plateOptions="plateOptions"
            :firstCurrencyId="'CNY'"
            :type="defaultTy"
            :getDeatilId="false"
            :getDeatilId1="Timestamp_before_disabled"
          />
        </template>
      </BasicForm>
    </div>
    <buttonTextModal @emits-values="emitsValues" @register="textModal" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import {
    reactive,
    watch,
    ref,
    onBeforeMount,
    onUnmounted,
    nextTick,
    computed,
  } from 'vue';
  import commonTable from '../components/commonTable/index.vue';
  import { currencyList14 } from '@/views/discountActivity/activity/components/newActive/index.data';
  import wallet from '@/views/discountActivity/activity/components/newActive/components/wallet/table.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import buttonTextModal from '@/views/discountActivity/activity/components/insertActiveNew/buttonTextModal.vue';
  import TableCheckbox from '@/components/TableCheckbox/index.vue';
  import {
    Input,
    FormItem,
    Row,
    Col,
    FormItemRest,
    message,
    CheckboxGroup,
    Checkbox,
    InputNumber,
    Select,
    DatePicker,
  } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { ProcessLeftData, schemas1 } from './index.data';
  import { useLocalList } from '/@/settings/localeSetting';
  import CurryRadioGroup from '../../activity/components/insertActiveNew/CurryRadioGroup.vue';
  import { Button } from '/@/components/Button/index';
  import { useRouter } from 'vue-router';
  import {
    UpdateMission,
    InsertMission,
    getMissionList,
    getMissionCategoryList,
  } from '/@/api/mission';
  import { useGameSortStore } from '/@/store/modules/gameSort';
  import { useSystemStore } from '/@/store/modules/system';
  import { useModal } from '/@/components/Modal';
  import { useLocale } from '/@/locales/useLocale';
  import dayjs, { Dayjs } from 'dayjs';
  import translateContentList from '/@/views/common/language';
  import { LangItem } from '/@/views/system/informationCenter/common/setting';
  import eventBus from '/@/utils/eventBus';
  import { getMemberRebateConfig } from '/@/api/member';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import CdIconCurrency from '@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { currentyOptions } from '@/settings/commonSetting';
  import { useTreeListStore } from '@/store/modules/treeList';
  import { getSiteBrandDetail } from '@/api/sys';
  import { useCurrencyStore } from '/@/store/modules/currency';

  const currentLanguage = useLocaleStoreWithOut();
  const $router = useRouter();
  const { t } = useI18n();
  const clientList = ref([]);
  const selectList = ref([]);
  const currencyName = ref('CNY');

  const commonTable_ = ref();
  const VIPLevelActiveIndex = ref([0]);
  const allVipConfig = ref<Record<string, any>>([]);
  const tabValue = ref<string>('1');
  const detail = ref('');
  const zhText = ref<any>(null);
  const btnLange: any = ref({});
  const btnText: any = ref(null);
  const zxLange = ref<any>({});
  const btnloading = ref(false);
  const Timestamp_before_disabled = ref(false);
  const defaultTy = ref<any>(1);
  const systemCurrency = ref('');

  const bigTitle = ref(t('v.discount.mission_add'));
  const FORM_SIZE = useFormSetting().getFormSize || 23;
  const currencyRadioRef = ref(null);
  const langList: any = ref<any[]>([]);
  const currentCurryId = ref('701' as string);
  const getDeatilId = ref('' as any);
  const gameSortStore = useGameSortStore();
  const systemStore = useSystemStore();
  const syslang = useLocale().getLocale.value;
  const disabledType = ref(false as any);

  const cateId = ref('' as any); // 默认任务分类
  const valid_bet_amount = ref('' as any);
  const bonus_rate = ref('' as any);
  let { currencyTreeList } = useTreeListStore();
  const currencyListTranslate = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
  };

  function goBack() {
    $router.go(-1);
  }

  const localeList = useLocalList();
  const langOptions = localeList.map((item) => {
    return {
      label: item.label,
      value: item.event,
    };
  });
  /** 所有语言：['zh_CN', 'en_US', 'vi_VN', 'pt_BR', 'th_TH', 'hi_IN'] */
  let openLangOptions: Array<any> = [];
  const openTerminalState = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openLangOptions,
  });
  /** 监听语言切换的变化 */
  watch(
    () => openTerminalState.checkedList,
    (newVal) => {
      if (newVal.length === localeList.length) {
        openTerminalState.checkAll = true;
        openTerminalState.indeterminate = false;
      } else if (newVal.length > 0 && newVal.length < localeList.length) {
        openTerminalState.indeterminate = true;
        openTerminalState.checkAll = false;
      } else {
        openTerminalState.indeterminate = false;
        openTerminalState.checkAll = false;
      }
      zxLange.value = updateObj(openTerminalState.checkedList, zxLange.value);
      contentList.value = langOptions.filter((currency) =>
        openTerminalState.checkedList.includes(currency.value),
      );
    },
  );

  // 全选开放所有语言
  function onCheckAllChange(e: any, model: any, field: any): void {
    if (openTerminalState.checkAll) {
      langOptions.map((item: any) => {
        openTerminalState.checkedList.push(item.value);
        return item;
      });
    } else {
      openTerminalState.checkedList = [];
    }
    Object.assign(openTerminalState, {
      checkedList: e.target.checked ? openLangOptions : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openLangOptions : [];
  }

  function onChangeOpenTerminal(value: string[], model: any, field: any): void {
    model[field] = value;
  }

  const ClientOptions1 = [
    {
      label: 'PC',
      value: '24',
    },
    {
      label: 'H5',
      value: '25',
    },
    {
      label: 'PWA',
      value: '28',
    },
    {
      label: 'IOS',
      value: '27',
    },
    {
      label: 'Android',
      value: '26',
    },
  ];
  let openClientOptions: Array<any> = [];
  const openClientState1 = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openClientOptions,
  });
  /** 监听展示终端的变化 */
  watch(
    () => openClientState1.checkedList,
    (newVal) => {
      if (newVal.length === 5) {
        openClientState1.checkAll = true;
        openClientState1.indeterminate = false;
      } else if (newVal.length > 0 && newVal.length < 5) {
        openClientState1.indeterminate = true;
        openClientState1.checkAll = false;
      } else {
        openClientState1.indeterminate = false;
        openClientState1.checkAll = false;
      }
    },
  );

  function onClientCheckAllChange1(e: any, model: any, field: any): void {
    if (openClientState1.checkAll) {
      ClientOptions1.map((item: any) => {
        openClientState1.checkedList.push(item.value);
        return item;
      });
    } else {
      openClientState1.checkedList = [];
    }
    Object.assign(openClientState1, {
      checkedList: e.target.checked ? openClientOptions : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openClientOptions : [];
  }

  function onChangeOpenClient1(value: string[], model: any, field: any): void {
    model[field] = value;
  }

  const ClientOptions2 = [
    {
      label: 'PC',
      value: '24',
    },
    {
      label: 'H5',
      value: '25',
    },
    {
      label: 'PWA',
      value: '28',
    },
    {
      label: 'IOS',
      value: '27',
    },
    {
      label: 'Android',
      value: '26',
    },
  ];
  let openClientOptions1: Array<any> = [];

  const openClientState2 = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openClientOptions1,
  });
  /** 监听展示终端的变化 */
  watch(
    () => openClientState2.checkedList,
    (newVal) => {
      if (newVal.length === 5) {
        openClientState2.checkAll = true;
        openClientState2.indeterminate = false;
      } else if (newVal.length > 0 && newVal.length < 5) {
        openClientState2.indeterminate = true;
        openClientState2.checkAll = false;
      } else {
        openClientState2.indeterminate = false;
        openClientState2.checkAll = false;
      }
    },
  );

  function onClientCheckAllChange2(e: any, model: any, field: any): void {
    if (openClientState2.checkAll) {
      ClientOptions2.map((item: any) => {
        openClientState2.checkedList.push(item.value);
        return item;
      });
    } else {
      openClientState2.checkedList = [];
    }
    Object.assign(openClientState2, {
      checkedList: e.target.checked ? openClientOptions1 : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openClientOptions1 : [];
  }

  function onChangeOpenClient2(value: string[], model: any, field: any): void {
    model[field] = value;
  }

  const ClientOptions3 = [
    {
      label: 'PWA',
      value: '28',
    },
    {
      label: 'IOS',
      value: '27',
    },
    {
      label: 'Android',
      value: '26',
    },
  ];
  let openClientOptions2: Array<any> = [];

  const openClientState3 = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openClientOptions2,
  });
  /** 监听展示终端的变化 */
  watch(
    () => openClientState3.checkedList,
    (newVal) => {
      if (newVal.length === 3) {
        openClientState3.checkAll = true;
        openClientState3.indeterminate = false;
      } else if (newVal.length > 0 && newVal.length < 3) {
        openClientState3.indeterminate = true;
        openClientState3.checkAll = false;
      } else {
        openClientState3.indeterminate = false;
        openClientState3.checkAll = false;
      }
    },
  );

  function onClientCheckAllChange3(e: any, model: any, field: any): void {
    if (openClientState3.checkAll) {
      ClientOptions3.map((item: any) => {
        openClientState3.checkedList.push(item.value);
        return item;
      });
    } else {
      openClientState3.checkedList = [];
    }
    Object.assign(openClientState3, {
      checkedList: e.target.checked ? openClientOptions2 : [],
      indeterminate: false,
    });
    model[field] = e.target.checked ? openClientOptions2 : [];
  }

  function onChangeOpenClient3(value: string[], model: any, field: any): void {
    model[field] = value;
  }

  const currencyList = currencyTreeList.map((item) => {
    return {
      label: item.label,
      value: item.value,
      lang: currencyListTranslate[item.value],
    };
  });

  const currenyLang = ref(defaultTy.value == 8 ? currencyList14 : currencyList);
  const taskActive = ref<any>(null);
  const taskOptions = ref<any>([]);
  let historyData = {};
  try {
    history.state.data && (historyData = JSON.parse(history.state.data));
  } catch (e) {
    console.error('e', e);
  }
  const toDisabled = history.state.type == 3;

  const currencyNameList_award = ref({
    '701': { award: '' },
    '702': { award: '' },
    '704': { award: '' },
    '705': { award: '' },
    '703': { award: '' },
    '706': { award: '' },
  });

  const time = ref({
    start_at: undefined as string | Dayjs | undefined,
    end_at: undefined as string | Dayjs | undefined,
  });

  async function changTime(type: string) {
    if (type == 'start_at' || type == 'end_at') {
      await setFieldsValueLeft({
        time: {
          start_at: time.value.start_at,
          end_at: time.value.end_at,
        },
      });
    }
  }
  const { getCurrencyList } = useCurrencyStore();

  onBeforeMount(async () => {
    const res = await systemStore.getValidLangList();
    const { kyc } = await getSiteBrandDetail({ tag: 'base' });
    systemCurrency.value = res;
    indexData.value = schemas1(`${typeof res === 'string' ? 2 : 1}&${kyc}`);

    //编辑
    if (history.state.id) {
      await gameSortStore.setgame_typeList();
      const data = JSON.parse(history.state.data);
      if ([1, 2, 3, 4, 6, 7].includes(data.ty)) {
        dataEcho(data, history.state.id);
      } else {
        getEditData().then(async () => {
          info_venue();
        });
      }
      document.title = t('v.discount.activity_editor1');
      disabledType.value = true;
      bigTitle.value = t('v.discount.activity_editor1');
      if (toDisabled) {
        bigTitle.value = t('v.discount.activity_check1');
      }
    } else {
      // 展示终端
      const allClientValues1 = ClientOptions1.map((item: any) => {
        openClientState1.checkedList.push(item.value);
        return item;
      });
      const device1 = [];
      allClientValues1.map((item) => {
        device1.push(item.value);
        return item;
      });
      // 注册端口
      const allClientValues2 = ClientOptions2.map((item: any) => {
        openClientState2.checkedList.push(item.value);
        return item;
      });
      const device2 = [];
      allClientValues2.map((item) => {
        device2.push(item.value);
        return item;
      });
      // 下载端口
      const allClientValues3 = ClientOptions3.map((item: any) => {
        openClientState3.checkedList.push(item.value);
        return item;
      });
      const device3 = [];
      allClientValues3.map((item) => {
        device3.push(item.value);
        return item;
      });
      // 多语言
      langList.value = langOptions.map((item: any) => {
        openTerminalState.checkedList.push(item.value);
        zxLange.value[item.value] = '';
        return item;
      });
      const langData = [];
      langList.value.map((item) => {
        langData.push(item.value);
        return item;
      });
      await gameSortStore.setgame_typeList().then(() => {
        info_venue();
      }); //调用游戏类型接口
      await getMissionCategoryList_();
      const config = {
        device: defaultTy.value === 1 ? device2 : device3,
      };
      nextTick(async () => {
        // 确保在新增时默认选中第一个币种
        const defaultCurrency = currenyLang.value?.[0]?.value || '701';
        if (currentCurryId.value === '701' && currenyLang.value?.length > 0) {
          currentCurryId.value = defaultCurrency;
        }
        
        await setFieldsValueLeft({
          cate_id: cateId.value, //默认任务分类没有不要打开
          device: device1,
          config: config,
          client: device2,
          client2: device3,
          lang: langData,
          CurrencyConfig: currentCurryId.value || defaultCurrency,
        });
      });
      const allConfig = await getMemberRebateConfig();
      allVipConfig.value = allConfig.vip;
    }
    contentList.value = langOptions.filter((currency) =>
      openTerminalState.checkedList.includes(currency.value),
    );
  });

  function changeVIPLevelActiveIndex(item, index) {
    if (VIPLevelActiveIndex.value.some((item) => item == index)) {
      VIPLevelActiveIndex.value = VIPLevelActiveIndex.value.filter((item) => item != index);
    } else {
      VIPLevelActiveIndex.value.push(index);
    }
  }

  const indexData = ref(null as any);
  const contentList: any = ref<Array<LangItem>>([...langList.value]);
  const currentLang = ref(contentList.value[0]);

  const [
    registerForm,
    {
      validate: leftValue,
      setFieldsValue: setFieldsValueLeft,
      updateSchema,
      getFieldsValue,
      clearValidate,
    },
  ] = useForm({
    disabled: toDisabled,
    labelWidth: 120,
    colon: true,
    baseColProps: {
      span: 24,
    },
    showActionButtonGroup: false,
  });
  const getMissionCategoryList_ = async () => {
    const d = await getMissionCategoryList({ page: 1, page_size: 251 });
    const data = d.d?.map(({ category_name, id }) => {
      let label_name = '-';
      try {
        const nameObj = JSON.parse(category_name);
        label_name =
          nameObj[currentLanguage.getLocale] ||
          Object.values(nameObj).find((val) => !!val) ||
          nameObj['zh_CN'] ||
          nameObj['en_US'] ||
          category_name;
      } catch (e) {
        label_name = category_name;
        console.error(e);
      }
      return {
        category_name: category_name,
        label: label_name,
        value: id,
      };
    });
    cateId.value = data[0].value; //默认没有不要打开
    if (updateSchema) {
      updateSchema({
        field: 'cate_id',
        componentProps: ({ formModel }) => {
          return {
            options: data,
            onChange: (e, option) => {
              formModel.cate_name = option?.category_name;
            },
            getPopupContainer: () => document.body,
          };
        },
      });
    }
  };

  function changTaskActive(value) {
    taskActive.value = value;
    let itemActive = taskOptions.value.filter((item) => item.value == value);
    getEditData(itemActive[0].itemData);
  }

  let plateOptions: any = [];

  const currentTimestamp = Date.now();

  async function getEditData(itemData?) {
    let data = itemData || {};
    let config: any = {};
    try {
      if (!itemData) {
        data = JSON.parse(history.state.data);
        config = JSON.parse(data.config);
        getDeatilId.value = data.id;
      } else {
        data = itemData;
        config = JSON.parse(itemData.config);
      }
    } catch (e) {
      console.error('e', e);
    }
    defaultTy.value = data.ty;
    if (new Date(data.start_at_tz).getTime() < currentTimestamp) {
      Timestamp_before_disabled.value = true;
    } else {
      Timestamp_before_disabled.value = false;
    }

    if (JSON.parse(data.names)) zxLange.value = JSON.parse(data.names);

    contentList.value.forEach((item) => {
      item.zxTransitionValue = zxLange.value[item.value];
    });
    zhText.value =
      JSON.parse(data.names)[currentLanguage.getLocale] || JSON.parse(data.names).default || '';

    if (btnLange.value.hasOwnProperty(syslang)) {
      btnText.value = btnLange.value[syslang];
      setFieldsValueLeft({ button: btnText.value });
    }
    // 币种处理
    if (Array.isArray(systemCurrency.value)) {
      openTerminalState.checkedList = JSON.parse(data.lang);
    } else {
      openTerminalState.checkedList = [systemCurrency.value];
    }
    currenyLang.value = filterHandleCurry(openTerminalState.checkedList);
    currentCurryId.value = config.currency_id || '701';
    let tongue = config.tongue || {};
    currencyNameList_award.value = tongue;
    time.value = {
      start_at: dayjs(data.start_at_tz),
      end_at: dayjs(data.end_at_tz),
    };
    openClientState1.checkedList = JSON.parse(data.device);
    openTerminalState.checkedList = JSON.parse(data.lang);
    await setFieldsValueLeft({
      ...data,
      award: tongue[currentCurryId.value]?.award || '',
      button: btnLange.value?.zh_CN || '1',
      names: JSON.parse(data.names)[currentLanguage.getLocale] || '1',
      lang: JSON.parse(data.lang),
      device: config.device,
      CurrencyConfig: currentCurryId.value || config.currency_id || '701',
      time: {
        start_at: dayjs(data.start_at_tz),
        end_at: dayjs(data.end_at_tz),
      },
    });
    time.value = {
      start_at: dayjs(data.start_at_tz),
      end_at: dayjs(data.end_at_tz),
    };
    setTimeout(() => {
      setFieldsValueLeft({
        names: zhText.value,
        bonus_type: config.bonus_type,
      });
      zxLange.value = JSON.parse(data.names);
    }, 888);
    getMissionCategoryList_();

    openClientState1.checkedList = config.device || [];
    nextTick(() => {
      setTimeout(() => {
        let tableData = commonTable_.value?.conditionData;
        if ((data.ty === 4 || data.ty === 5) && commonTable_.value?.conditionData) {
          if (data.ty === 4) {
            VIPLevelActiveIndex.value = config.vip;
          } else if (data.ty === 5) {
            commonTable_.value.conditionData3 = config.tongue;
            VIPLevelActiveIndex.value = config.vip;
          }
        }
        if (data.ty === 8 && commonTable_.value?.conditionData) {
          const tableData1 = wallet_slot.value?.conditionData;
          currenyLang.value = currencyList14;
          clientList.value = currencyList14[0]?.clientList;
          clientList.value.forEach((p) => {
            p.name = t('business.common_select_all');
            p.id = p.contract_id;
          });

          tableData1.bonus = {};
          tableData1.cryptocurrency = config.coin_method_ids;
          tableData1.wallet = config.wallet_method_ids;
          selectList.value = config.coin_method_ids.concat(config.wallet_method_ids);

          tableData[currentCurryId.value] = config.bonus_config;
          changeHandleCurry(currentCurryId.value);
        }
      }, 333);
    });
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 回显数据
  const dataEcho = async (data, id) => {
    getDeatilId.value = id;
    let config = JSON.parse(data.config);
    currentCurryId.value = config.currency_id;
    valid_bet_amount.value = config.bonus_amount[0];
    setTimeout(() => {
      zxLange.value = JSON.parse(data.names);
    }, 500);
    zhText.value =
      JSON.parse(data.names)[currentLanguage.getLocale] || JSON.parse(data.names).default;
    if (config.bonus_type == 2) {
      bonus_rate.value = config.bonus_amount[1];
    }
    if ([1].includes(data.ty)) {
      openClientState2.checkedList = config.device || [];
    }
    if ([2].includes(data.ty)) {
      openClientState3.checkedList = config.device || [];
    }
    openClientState1.checkedList = JSON.parse(data.device);
    openTerminalState.checkedList = JSON.parse(data.lang);
    time.value = {
      start_at: dayjs(data.start_at_tz),
      end_at: dayjs(data.end_at_tz),
    };
    await delay(2000);
    setTimeout(() => {
      const tableData = commonTable_.value?.conditionData;
      if (data.ty === 4 && tableData) {
        tableData[currentCurryId.value] = config.bonus_config.map((item) => {
          return {
            deposit: item.amount,
            amount: item.amount,
            award: item.award,
          };
        });
      }
    }, 400);
    await setFieldsValueLeft({
      ...data,
      config: config,
      bonus_type: +config.bonus_type,
      lang: JSON.parse(data.lang),
      names: JSON.parse(data.names)[currentLanguage.getLocale] || JSON.parse(data.names).default,
      cate_name: data.cate_name,
      device: JSON.parse(data.device),
      ip_limit: String(data.ip_limit),
      device_limit: String(data.device_limit),
      CurrencyConfig: currentCurryId.value || config.currency_id || '701',
      time: {
        start_at: dayjs(data.start_at_tz).format('YYYY-MM-DD'),
        end_at: dayjs(data.end_at_tz).format('YYYY-MM-DD'),
      },
      ...(data.ty === 1 && { client: config.device }),
      ...(data.ty === 2 && { client2: config.device }),
    });
    await getMissionCategoryList_();
    await handleTinymceBlurZx('修改');
  };

  async function submitOk() {
    const leftValues = await leftValue();
    const {
      ty,
      cate_id,
      state,
      cycle,
      device,
      cate_name,
      bonus_type,
      statistic_type,
    } = leftValues;

    let tableData = commonTable_.value?.conditionData;
    let config: any = {
      device: [],
      bonus_amount: [],
      bonus_config: [],
      bonus_type: bonus_type,
      claim_expired_days: 0,
      currency_id: '701',
      cycle: cycle,
      sport: 0,
      assign_sport: {},
      statistic_type: 0,
    };
    if (leftValues.ty === 4 || leftValues.ty === 5) {
      if (leftValues.ty === 4) {
        config.currency_id = currentCurryId.value;
        config.bonus_type = leftValues.bonus_type;
        config.bonus_config = tableData[currentCurryId.value].map((item) => {
          return {
            amount: item.deposit,
            award: item.award,
          };
        });
      } else if (leftValues.ty == 5) {
        let assign_sport = {};

        venueList.value.forEach((item) => {
          if (platform_range.value == 1) {
            // assign_sport[item.value] = item.allVen.map((el) => el.value);
          } else {
            if (item.appointVen.map((el) => el.value).length && item.value == tabValue.value) {
              assign_sport[item.value] = item.appointVen.map((el) => el.value);
            }
          }
        });
        config = {
          sport: platform_range.value, // 统计场馆 1全部场馆 2指定场馆
          assign_sport: assign_sport,
          cycle: cycle, // 统计周期: 1:每日 2:每周 3:每月
          bonus_config: tableData[currentCurryId.value], // 任务类型=累计存款,钱包/虚拟币存款,有效投注时, 奖励配置,
          bonus_type: bonus_type, // 1:固定金额, 2:随机金额, 如果任务类型=累计存款,钱包/虚拟币存款时, 1:固定金额, 2:固定比例
          claim_expired_days: 0, // 过期时间(天数)
          currency_id: currentCurryId.value || '701', //条件配置-币种配置
          device: device || [
            // 任务类型=注册or下载使用, 注册端口 or 下载端口
            '26',
          ],
          statistic_type: statistic_type, // 任务类型=累计存款,钱包/虚拟币存款时才会用到 统计方式: 1:累计充值, 基本上任务类型=累计存款,钱包/虚拟币存款时都会是1
        };
      }
    } else if ([1, 2, 3, 6, 7].includes(leftValues.ty)) {
      config.currency_id = currentCurryId.value;
      config.device = leftValues.client || leftValues.client2;
      config.bonus_type = leftValues.bonus_type;
      config.bonus_amount.push(valid_bet_amount.value);
      if (leftValues.bonus_type == 2) {
        config.bonus_amount.push(bonus_rate.value);
      }
    } else if (leftValues.ty == 8) {
      const tableData1 = wallet_slot.value?.conditionData;
      const { wallet, cryptocurrency } = tableData1;
      config = {
        cycle: cycle, // 统计周期: 1:每日 2:每周 3:每月
        bonus_config: tableData[currentCurryId.value], // 任务类型=累计存款,钱包/虚拟币存款,有效投注时, 奖励配置,
        bonus_type: bonus_type, // 1:固定金额, 2:随机金额, 如果任务类型=累计存款,钱包/虚拟币存款时, 1:固定金额, 2:固定比例
        claim_expired_days: 0, // 过期时间(天数)
        currency_id: currentCurryId.value || '701', //条件配置-币种配置
        device: device || [
          // 任务类型=注册or下载使用, 注册端口 or 下载端口
          '26',
        ],
        wallet_method_ids: wallet || [],
        coin_method_ids: cryptocurrency || [],
        statistic_type: statistic_type, // 任务类型=累计存款,钱包/虚拟币存款时才会用到 统计方式: 1:累计充值, 基本上任务类型=累计存款,钱包/虚拟币存款时都会是1
      };
    }
    if (typeof systemCurrency.value === 'string') {
      zxLange.value = {
        [systemCurrency.value]: zhText.value[systemCurrency.value] || zhText.value,
      };
    }
    zxLange.value.default = zhText.value;
    // return;
    const data_ = {
      ...leftValues,
      audit_multiple: leftValues.audit_multiple || '0',
      ip_limit: +leftValues.ip_limit || 0,
      device_limit: +leftValues.device_limit || 0,
      id: getDeatilId.value ? getDeatilId.value : '',
      device: JSON.stringify(leftValues.device),
      names: JSON.stringify(zxLange.value),
      ty, //任务类型：1.注册, 2.下载, 3.验证, 4.存款, 5.投注
      cate_name: cate_name || '-', //分类关联 sg_job_category.id（例如新手任务, KYC验证）
      CurrencyConfig: currentCurryId.value || '701', //条件配置-币种配置
      cate_id, //分类关联 sg_job_category.id（例如新手任务, KYC验证）
      state: getDeatilId.value ? Number(state) : 1, //状态：1.未开始, 2.进行中, 3.已关闭, 4.删除
      start_at_tz: dayjs(leftValues.time.start_at).format('YYYY-MM-DD 00:00:00'),
      end_at_tz: dayjs(leftValues.time.end_at).format('YYYY-MM-DD 23:59:59'), //结束时间（时间戳）
      config: JSON.stringify(config), //动态配置信息
      lang: JSON.stringify(openTerminalState.checkedList || []), //多语言
      start_at: 0,
      end_at: 0,
    };
    delete data_.time;
    btnloading.value = true;
    const { status, data } = getDeatilId.value
      ? await UpdateMission(data_)
      : await InsertMission(data_);

    if (status) {
      btnloading.value = false;
      message.success(data);
      $router.push({ name: 'mission_list' });
    } else {
      btnloading.value = false;
      message.error(data);
    }
  }

  const wallet_slot: any = ref(null);
  let assign_sportList: any = [];

  async function getMissionListData() {
    return getMissionList({
      page: '1',
      page_size: '100',
      state: '2',
      ty: 5,
      lang: syslang,
    }).then(({ data }) => {
      try {
        taskOptions.value = data.d?.map((item) => {
          return {
            label: JSON.parse(item.names)['zh_CN'],
            value: item.id,
            itemData: item,
            config: item.config,
          };
        });
        assign_sportList = taskOptions.value
          ?.map((list) => JSON.parse(list.config))
          ?.map((item) => item.assign_sport);
        assign_sportList = assign_sportList?.map((item) => {
          return Object.values(item);
        });
      } catch (e) {
        console.error(e);
        assign_sportList = [];
      }
      assign_sportList = assign_sportList?.flat(Infinity);
    });
  }

  getMissionListData();

  const platform_ids = ref<any>([]);

  const venueList: any = ref([
    {
      label: '老虎机',
      value: '1',
      id: '',
      list: [
        { name: 'pg', state: 1 },
        { name: 'pp', state: 2 },
        { name: 'pp1', state: 1 },
      ],
    },
  ]);
  const info_venue = () => {
    plateOptions = [];
    let { getPlatformList, getgame_typeList } = useGameSortStore();
    for (const key in getPlatformList) {
      plateOptions.push(...(getPlatformList[key] as any));
    }
    plateOptions =
      plateOptions &&
      plateOptions.map((item: any) => {
        return {
          ...item,
          label: item.platform_name,
          name: item.name,
          value: item.platform_id,
          state: platform_ids.value.some((el) => el == item.platform_id) ? 1 : 2,
        };
      });
    getgame_typeList = getgame_typeList.filter((item: any) => {
      return item.name != '全部' && item.game_type != '6';
    });
    let list: any = [];
    getgame_typeList.forEach((element: any) => {
      list.push({
        label: element.name,
        value: element.game_type,
        id: '',
        name: t('business.common_select_all'),
        list: plateOptions.filter((item) => item.game_type == element.game_type),
        allVen: plateOptions
          .filter((item) => item.game_type == element.game_type)
          .map((el) => {
            return {
              name: el.name,
              value: el.value,
            };
          }),
        appointVen: plateOptions
          .filter((item) => item.game_type == element.game_type)
          .filter((obj) => obj.state === 1)
          .map((el) => {
            return {
              name: el.name,
              value: el.value,
            };
          }),
      });
    });
    venueList.value = list;
    setFieldsValueLeft({ incentiveConfig: 1 });
  };
  const Venue_statistics = ref('allVen');
  const platform_range: any = ref(1);

  watch(
    () => tabValue.value,
    (newV) => {
      handleTab();
    },
  );

  function handleTab() {
    venueList.value
      .filter((item) => item.value != tabValue.value)
      .forEach((item) => {
        item.list.forEach((el) => {
          el.state = 2;
          el.disabled = true;
        });
      });
  }

  const current_platform_ids: any = computed(() => {
    let list =
      (venueList.value.filter((item) => item.value == tabValue.value)[0]?.allVen &&
        venueList.value
          .filter((item) => item.value == tabValue.value)[0]
          [Venue_statistics.value].map((el) => {
            return el.value;
          })) ||
      [];
    return list;
  });
  const all_platform_ids: any = computed(() => {
    let list = venueList.value
      .map((item) => item[Venue_statistics.value]?.map((el) => el.value))
      .flat();
    return list;
  });

  const incentiveConfig = ref(1);
  const handleCheckboxChange = (e, item, checkedKeys) => {
    setTimeout(() => {
      item.state = e ? 1 : 2;
      item.disabled = false;
      if (!item.platform_id) {
        if (checkedKeys.length < 1) {
          venueList.value
            .filter((item) => item.value == tabValue.value)[0]
            .list.forEach((element) => {
              element.state = e ? 1 : 2;
              element.disabled = false;
            });
        } else {
          venueList.value
            .filter((item) => item.value == tabValue.value)[0]
            .list.filter((o) => checkedKeys.includes(o.platform_id))
            .forEach((element) => {
              element.state = e ? 1 : 2;
              element.disabled = false;
            });
        }
      } else {
        venueList.value
          .filter((item) => item.value == tabValue.value)[0]
          .list.filter((o) => o.platform_id == item.platform_id)
          .forEach((element) => {
            element.state = item.state;
          });
        venueList.value
          .filter((item) => item.value == tabValue.value)[0]
          .list.filter((o) => o.platform_id == item.platform_id)
          .forEach((element) => {
            element.disabled = false;
          });
      }
      venueList.value.filter((item) => item.value == tabValue.value)[0][Venue_statistics.value] =
        plateOptions
          .filter((item) => item.game_type == tabValue.value)
          .filter((obj) => obj.state === 1)
          .map((el) => {
            return {
              name: el.name,
              value: el.value,
            };
          });
    }, 111);
  };

  function changeHandleCurry(value) {
    currentCurryId.value = value;
    if (defaultTy.value != 4 || defaultTy.value != 5) {
      setFieldsValueLeft({
        award: currencyNameList_award.value[currentCurryId.value]?.award || '',
      });
    }
    if (defaultTy.value == 8) {
      let cIndex = currencyList14.findIndex((item) => item.id == value) || 0;
      clientList.value = currencyList14[cIndex]?.clientList;
      clientList.value?.forEach((p) => {
        p.name = t('business.common_select_all');
        p.id = p.contract_id;
      });
      currencyName.value = currencyList14[cIndex]?.name;
    }
  }

  /** 过滤选择的语言，筛选出对应的法币 */
  function filterHandleCurry(langArr: string | string[]) {
    return currencyList.filter((currency) => langArr.includes(currency.lang));
  }

  const [textModal, { openModal }] = useModal();

  function pushContentList() {
    contentList.value.forEach((el) => {
      zxLange.value[el.value] = el.zxTransitionValue;
    });
  }

  //更多语言
  function handleMoreLagarage(type) {
    pushContentList();
    zxLange.value.default = zhText.value;
    openModal(true, { data: zxLange.value, type, default: true });
  }

  function emitsValues(value, type) {
    if (openTerminalState.checkedList.includes(syslang)) {
      zhText.value = value['default'];
      setFieldsValueLeft({ names: zhText.value });
    }
  }

  async function handleTinymceBlurZx(e) {
    if (e.target?.value) {
      zhText.value = e.target?.value;
    }
    if (typeof systemCurrency.value === 'string') return;
    await translateContentList(contentList.value, zhText.value, 0, 'zxTransitionValue');
    pushContentList();
  }

  function updateObj(arr, obj) {
    if (typeof obj !== 'object' || obj === null) {
      return {};
    }
    // 删除不在cehis1中的键
    for (const key in obj) {
      if (!arr.includes(key)) {
        delete obj[key];
      }
    }
    // 添加cehis1中缺少的键
    for (const key of arr) {
      if (!(key in obj)) {
        obj[key] = null;
      }
    }
    return obj;
  }

  watch(
    () => defaultTy.value,
    (newVal, oldVal) => {
      if (newVal == 8) {
        if (currencyList14) {
          currenyLang.value = currencyList14;
          clientList.value = currencyList14[0]?.clientList;
          clientList.value &&
            clientList.value.forEach((p) => {
              p.name = t('business.common_select_all');
              p.id = p.contract_id;
            });
          selectList.value = currencyList14?.selectList;
        }
      } else {
        currenyLang.value = currencyList;
      }
    },
  );
  eventBus.on('cycleCharge', (val) => {
    let e = defaultTy.value;
    if (val == 1) {
      if (e == 4 || e == 5) {
        if (e == 4) {
          zhText.value = '每日存款';
        } else if (e == 5) {
          zhText.value = '每日投注';
        }
      }
    } else if (val == 2) {
      if (e == 4) {
        zhText.value = '每周存款';
      } else if (e == 5) {
        zhText.value = '每周投注';
      }
    } else if (val == 3) {
      if (e == 4) {
        zhText.value = '每月存款';
      } else if (e == 5) {
        zhText.value = '每月投注';
      }
    }
    handleTinymceBlurZx('修改');
  });
  eventBus.on('tyChange', (e) => {
    defaultTy.value = e || 1;
    if (e == 4 || e == 5) {
      if (e == 4) {
        zhText.value = '每日存款';
      } else if (e == 5) {
        zhText.value = '每日投注';
      }
      handleTinymceBlurZx('修改');
    }
  });
  eventBus.on('change_award', (data) => {
    if (currencyNameList_award.value[currentCurryId.value]) {
      currencyNameList_award.value[currentCurryId.value].award = data;
    } else {
      currencyNameList_award.value[currentCurryId.value] = {};
      currencyNameList_award.value[currentCurryId.value].award = data;
    }
  });
  eventBus.on('change_Venue_statistics', (v: any) => {
    if (v !== 'getself') platform_range.value = v;
    platform_range.value == 1
      ? (Venue_statistics.value = 'allVen')
      : (Venue_statistics.value = 'appointVen');
    if (v == 1) {
      setFieldsValueLeft({
        configuration: 1,
      });
    }
  });
  eventBus.on('incentiveConfig', (v: any) => {
    if (v !== 'getself') incentiveConfig.value = v;
  });
  onUnmounted(() => {
    eventBus.off('updatedailyCollectionLimit');
    eventBus.off('onRewardMethodsChange');
    eventBus.off('cycleCharge');
    eventBus.off('change_Venue_statistics');
    eventBus.off('formChange_m');
    eventBus.off('tyChange');
  });
</script>
<style lang="less" scoped>
  .ant-btn-primary[disabled] {
    background: #a2a2a2;
  }

  ::v-deep(.ant-col) {
    &.my-col-12 {
      box-sizing: border-box;
      padding-right: 20px;
      padding-left: 48px;
    }

    &.my-col-24 {
      box-sizing: border-box;
      padding-right: calc(50% + 20px);
      padding-left: 48px;
    }

    & > div {
      & > span {
        z-index: 100;
        top: 10px !important;
        left: 24px !important;
      }
    }

    &.ant-col-11 {
      .ant-form-item {
        margin-bottom: 0;
      }
    }
  }

  .activHeader {
    width: 100%;
    height: 62px;
    padding-left: 10px;
    border-bottom: 1px solid #d9d9d9;
    background-color: #f6f7fb;
    line-height: 60px;
  }

  .mission-box {
    min-height: 100vh;
  }

  ::v-deep(.ant-page-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background-color: transparent;
  }

  ::v-deep(.ant-page-header-content) {
    padding-top: 0;
  }

  ::v-deep(.vben-page-wrapper-content-bg) {
    background-color: transparent !important;
  }

  ::v-deep(.ant-page-header-heading-left) {
    margin-top: 0;
    margin-bottom: 0;

    .ant-page-header-heading-title {
      color: #444;
      font-size: 18px;
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
      background-image: url('/@/assets/images/active-add.webp');
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

  ::v-deep(.ant-input[disabled]) {
    background-color: #f6f7fb !important;
  }

  ::v-deep(.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    background-color: #f6f7fb !important;
  }

  ::v-deep(.ant-picker.ant-picker-disabled) {
    background-color: #f6f7fb !important;
  }

  ::v-deep(.ant-btn-primary[disabled]) {
    background-color: rgb(0 0 0 / 4%) !important;
  }

  .line {
    width: 80%;
    height: 1.5px;
    margin-top: 20px;
    margin-left: 10%;
    background-color: #4444;
    font-size: 14px;
    font-weight: 500;
  }
  ::v-deep(.pop_componentProps) {
    .ant-form-item-label > label {
      margin-left: 45px;
    }
  }
</style>
