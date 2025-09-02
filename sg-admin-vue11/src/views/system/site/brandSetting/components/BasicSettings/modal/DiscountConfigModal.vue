<template>
  <BasicModal
    :title="t('modalForm.finance.finance_promo')"
    :okText="t('common.confirmSave')"
    :cancelText="t('common.cancelText')"
    @register="register"
    @ok="saveFun"
    wrap-class-name="discount-modal"
    :width="971"
  >
    <div>
      <cdButtonCurrency
        :btn-list="currencyList?.map((item) => ({ name: item.name, value: item.id }))"
        v-model="activeKey"
      />
    </div>
    <Transition name="fade">
      <div class="px-6 pr-9 mt-4">
        <Form :model="currentCurrencyData" :label-col="{ span: 4 }">
          <FormItem name="promo_level_flags">
            <template #label>
              <div class="flex items-center">
                <Tooltip placement="top" overlayClassName="level-flags-tooltip">
                  <template #title>
                    <div class="flex">
                      <span class="green">{{ t('modalForm.finance.finance_level_all') }}:</span>
                      <span class="w-100">{{ t('modalForm.finance.finance_level_all_text') }}</span>
                    </div>
                    <div class="flex">
                      <span class="green">{{ t('modalForm.finance.finance_level_specify') }}:</span>
                      <span class="w-100">
                        {{ t('modalForm.finance.finance_level_specify_text') }}
                      </span>
                    </div>
                  </template>
                  <AlertOutlined />
                </Tooltip>
                <span class="ml-1">{{ t('modalForm.finance.finance_promo_level') }}</span>
              </div>
            </template>
            <RadioGroup
              v-model:value="currentCurrencyData['promo_level_flags']"
              :options="radioOptions"
              @change="handleChangeRadio"
            />
          </FormItem>
          <FormItem
            v-show="currentCurrencyData['promo_level_flags'] === 2"
            :label="`${t('common.selectLevel')}:`"
          >
            <MemberLevel
              :currentMemberLevel="currentLevelData.levels"
              @set-current-member-level="setCurrentMemberLevel"
            />
          </FormItem>
        </Form>
        <Row>
          <Col :span="5"
            ><span class="ml-45px">{{ t('table.finance.finance_Deposit_method') }}</span></Col
          >
          <Col :span="6"
            ><span>{{ t('modalForm.system.system_min_deposit') }}</span></Col
          >
          <Col :span="6"
            ><span class="ml-15px">{{ t('modalForm.finance.finance_gift_rate') }}</span></Col
          >
          <Col :span="6"
            ><span class="ml-65px">{{ t('table.system.system_pay_bid') }}</span></Col
          >
        </Row>
        <div
          :class="[
            { 'h-80px': currentLevelData.content_arr.length == 1 },
            { 'h-250px': currentLevelData.content_arr.length > 2 },
          ]"
          class="py-5"
        >
          <ScrollContainer>
            <Form
              v-if="currentLevelData.content_arr.length > 0"
              ref="formRef"
              :model="currentLevelData"
              :label-col="{ style: { width: '165px' } }"
            >
              <Row v-for="(item, index) in currentLevelData.content_arr" :key="index">
                <Col :span="9">
                  <FormItem :name="item.method_name" :label="`${item.method_name}:`">
                    <InputNumber
                      v-model:value="item.amount_min"
                      :placeholder="t('business.banner_tip')"
                      :size="FORM_SIZE"
                      :stringMode="true"
                    />
                  </FormItem>
                </Col>
                <Col :span="1" />
                <Col :span="6">
                  <InputNumber
                    v-model:value="item.scale"
                    :placeholder="t('table.system.system_p_enter_gift_ratio')"
                    addonAfter="%"
                    :size="FORM_SIZE"
                    :min="0"
                    :max="100"
                    maxlength="5"
                  />
                </Col>
                <Col :span="1" />
                <Col :span="6">
                  <Select v-model:value="item.promo_tag_id" style="width: 100%" :size="FORM_SIZE">
                    <SelectOption
                      v-for="(item, index) in tagList"
                      :value="item.value"
                      :key="item.value"
                      >{{ item.label }}
                    </SelectOption>
                  </Select>
                </Col>
              </Row>
            </Form>
            <template v-else>
              <Empty />
            </template>
          </ScrollContainer>
        </div>
        <Form :model="currentLevelData" :label-col="{ span: 4 }">
          <FormItem name="bonus_max" :label="t('modalForm.finance.finance_gift_max')">
            <InputNumber
              v-model:value="currentLevelData['bonus_max']"
              :size="FORM_SIZE"
              :min="0"
              maxlength="12"
              :placeholder="t('modalForm.finance.finance_place_holder')"
            />
          </FormItem>
          <FormItem name="bonus_limit_flags" :label="t('modalForm.finance.finance_gift_times_max')">
            <RadioGroup
              v-model:value="currentLevelData['bonus_limit_flags']"
              :options="radioOptions2"
              @change="handleChangeFlags"
            />
          </FormItem>
          <FormItem
            name="bonus_limit_value"
            :wrapperCol="{ offset: 3, span: 21 }"
            v-if="currentLevelData['bonus_limit_flags'] == 1"
          >
            <InputNumber
              v-model:value="currentLevelData['bonus_limit_value']"
              :size="FORM_SIZE"
              :min="0"
              maxlength="12"
              :placeholder="t('modalForm.finance.place_holer')"
            />
          </FormItem>
          <FormItem name="bonus_limit_value_b" :wrapperCol="{ offset: 3, span: 21 }" v-else>
            <InputNumber
              v-model:value="currentLevelData['bonus_limit_value_b']"
              :size="FORM_SIZE"
              :min="0"
              maxlength="12"
              :placeholder="t('modalForm.finance.place_holer')"
            />
          </FormItem>
        </Form>
      </div>
    </Transition>

    <!-- <Loading :loading="loading" :absolute="false" /> -->
  </BasicModal>
</template>

<script setup lang="ts">
  import MemberLevel from '/@/components/MemberLevel/index.vue';
  import { ref, onMounted, computed, h, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    Button,
    RadioGroup,
    RadioButton,
    message,
    Form,
    FormItem,
    InputNumber,
    Row,
    Col,
    Space,
    Tooltip,
    Select,
    SelectOption,
    Empty,
  } from 'ant-design-vue';
  import { AlertOutlined } from '@ant-design/icons-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { cloneDeep, compact } from 'lodash-es';
  import { useMemberStore } from '/@/store/modules/member';
  import { getPaymentMerchantV2PromoList, updatePromoPayment } from '/@/api/finance';
  import { valueNumToStr, valueStrToNum, mul } from '/@/utils/number';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollContainer } from '/@/components/Container/index';
  import { useFinanceStore } from '/@/store/modules/finance';
  import { getTreeList } from '/@/api/member';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { containsProp } from '@vueuse/shared';
  import { isArray } from '/@/utils/is';

  const { t } = useI18n();
  interface CurrencyItem {
    // 币种列表每一项
    id?: string | number;
    currency_id: string; //币种id
    promo_level_flags: 1 | 2; //优惠层级，1:所有 2:指定
    level_data_all: Array<LevelItem>; // 1:所有
    level_data: Array<LevelItem>; // 2:指定
  }
  interface LevelItem {
    // 层级列表每一项
    id?: string | number;
    level: number; //分层层级
    bonus_max: string | number; //赠送金额上限
    bonus_limit_flags: 1 | 2; //赠送次数上限标识，1:每日赠送次数 2:总共赠送次数
    bonus_limit_value: string | number; //赠送次数
    bonus_limit_value_b: string | number; //赠送次数
    content_arr: Array<ContentItem>;
  }
  interface ContentItem {
    // 存款区间每一项
    scale: number; //赠送比例
    method_id: string;
    method_name: string;
    amount_min: string;
    promo_tag_id: string;
  }

  type TabsFormType = {
    value: string;
    label: string;
  };

  const radioOptions = [
    { label: t('modalForm.finance.finance_promo_all_level'), value: 1 }, //所有层级
    { label: t('modalForm.finance.finance_promo_select_level'), value: 2 }, //指定层级
  ];

  const radioOptions2 = [
    { label: t('modalForm.finance.finance_gift_times_days'), value: 1 }, //每日赠送次数
    { label: t('modalForm.finance.finance_gift_times_total'), value: 2 }, //总共赠送次数
  ];

  const { paymentMethods } = useFinanceStore();

  const { currencyTreeList } = useTreeListStore();
  const memberStore = useMemberStore();
  const currencyStore = useCurrencyStore();
  const FORM_SIZE = useFormSetting().getFormSize;
  const loading = ref(false);
  const rowId = ref<any>();
  const tagList = ref<any>([]);

  const paymentMethod = ref<any>([]);
  const activeKey = ref();

  onMounted(async () => {
    // 获取层级下拉
    getTagList();
    await memberStore.getLevelList();
  });

  async function getTagList() {
    const response = await getTreeList({ level: '010' });
    const list = [{ name: t('table.system.system_null'), id: '0' }, ...response];

    // Map the list to create the tagList format
    tagList.value = list.map(({ id, name }) => ({
      value: id,
      label: name,
    }));
  }

  const [register, { closeModal }] = useModalInner(async (values) => {
    currencyList.value.forEach((item) => {
      item.loaded = false;
    });
    activeKey.value = currencyList.value[0].id ?? '';
    handleChangeCurrencyTabs();
    setLevelTabs();
    rowId.value = values?.data?.id;
  });

  const currencyList = computed(() => {
    const { paymentMethods } = useFinanceStore();
    const currencyids = Object.keys(paymentMethods);
    const list = currencyTreeList
      .filter((item) => currencyids.includes(item.id))
      .map((item) => ({
        ...item,
        currencyData: cloneDeep(currencyData),
        loaded: false,
      }));
    return list;
  });

  const contentData: Array<ContentItem> = [
    {
      scale: 0, //赠送比例
      method_id: '0',
      method_name: t('table.finance.finance_compony_alipay'),
      amount_min: '',
      promo_tag_id: '',
    },
  ];

  const levelData: LevelItem = {
    level: 0,
    bonus_max: '',
    bonus_limit_flags: 1,
    bonus_limit_value: '',
    bonus_limit_value_b: '',
    content_arr: cloneDeep(contentData),
  };

  const currencyData: CurrencyItem = {
    currency_id: '',
    promo_level_flags: 1,
    level_data_all: cloneDeep([levelData]),
    level_data: cloneDeep([levelData]),
  };

  const levelTabs = ref<TabsFormType[]>([]); // 层级tabs
  const currentCurrencyIndex = ref(0); // 当前币种下标
  const currentCurrency = ref(currencyList.value[0]); // 当前币种
  const currentCurrencyData = ref(currencyData); // 当前币种data
  const currentLevelIndex = ref(0); // 当前层级
  const currentLevelData = ref(cloneDeep(levelData)); // 当前层级data
  // activeKey.value = currencyList.value[0].id ?? '';
  watch(activeKey, () => {
    let _currentCurrencyIndex = 0;
    currencyList.value.forEach((q, index) => {
      if (q.id == activeKey.value) {
        _currentCurrencyIndex = index;
      }
    });
    currentCurrencyIndex.value = _currentCurrencyIndex;
    currentCurrency.value = currencyList.value.filter((c) => c.id == activeKey.value)[0];
    handleChangeRadio();
    handleChangeCurrencyTabs();
  });

  // 获取配置数据处理
  function handleChangeCurrencyTabs() {
    const currency = currencyList.value.filter((c) => c.id == activeKey.value)[0];
    if (currency.loaded) {
      currentCurrencyData.value = currency.currencyData;
      handleChangeRadio();
      return;
    }

    loading.value = true;

    getPaymentMerchantV2PromoList({ currency_id: currency.id })
      .then((response) => {
        const { status, data } = response;
        if (status && data) {
          currency.currencyData = cloneDeep(data.d);
          currentCurrencyData.value = currency.currencyData;

          const origin_level_data_all = currentCurrencyData.value.level_data_all;
          const origin_level_data = currentCurrencyData.value.level_data;

          if (origin_level_data_all || origin_level_data) {
            if (!origin_level_data_all) {
              currentCurrencyData.value.level_data = setLevelData(origin_level_data);
              currentCurrencyData.value.level_data_all = copyData();
            } else if (!origin_level_data) {
              currentCurrencyData.value.level_data_all = setLevelData(origin_level_data_all);
              currentCurrencyData.value.level_data = copyData();
            } else {
              setLevelData(origin_level_data_all);
              setLevelData(origin_level_data);
            }
            handleChangeRadio();
          } else {
            levelData.content_arr = currentCurrencyData.value.level_data_all = copyData();
            currentCurrencyData.value.level_data = copyData();
            currentLevelData.value = currentCurrencyData.value.level_data_all[0];
          }
        } else {
          currency.currencyData.currency_id = currency.id;
          currentCurrencyData.value = currency.currencyData;
          currentCurrencyData.value.level_data_all = copyData();
          currentCurrencyData.value.level_data = copyData();
          currentLevelData.value = currentCurrencyData.value.level_data_all[0];
        }
      })
      .finally(() => {
        currency.loaded = true;
        loading.value = false;
      });
  }

  function setContentArr(data?: any) {
    const { paymentMethods } = useFinanceStore();
    const activePaymentMethods = paymentMethods[activeKey.value];

    // Create the initial list of payment methods
    const list = activePaymentMethods.map(({ id, name }) => ({
      method_id: id,
      method_name: name,
      amount_min: '0',
      promo_tag_id: '0',
      scale: 0,
    }));

    // Update the list with data from the provided data object
    if (data?.length > 0) {
      list.forEach((paymentMethod) => {
        const matchingData = data.find((item) => item.method_id === paymentMethod.method_id);
        if (matchingData) {
          const { amount_min, promo_tag_id, scale } = matchingData;
          paymentMethod.amount_min = amount_min;
          if (!paymentMethod.amount_min) paymentMethod.amount_min = '0';
          paymentMethod.promo_tag_id = promo_tag_id;
          paymentMethod.scale = scale;
        }
      });
    }

    return list;
  }
  function setLevelData(originalLevelData) {
    const level_data: Array<LevelItem> = [];
    originalLevelData.forEach((item) => {
      item.bonus_max = valueNumToStr(item.bonus_max);
      item.bonus_limit_value = valueNumToStr(item.bonus_limit_value);
      item.bonus_limit_value_b = valueNumToStr(item.bonus_limit_value_b);
      // item.content_arr = item.content_arr.length === 0 ? cloneDeep(contentData) : item.content_arr;
      item.content_arr = setContentArr(item.content_arr);
      item.levels = item.levels ? item.levels.split(',') : [];
      level_data[item.level] = item;
    });
    return level_data;
  }
  // 优惠层级切换
  function handleChangeRadio() {
    let originalLevelData = currentCurrencyData.value.level_data_all;
    if (currentCurrencyData.value.promo_level_flags === 2) {
      originalLevelData = currentCurrencyData.value.level_data;
      // handleChangeLevel(0);
    }
    for (let i = 0; i < originalLevelData.length; i++) {
      if (originalLevelData[i]) {
        currentLevelData.value = originalLevelData[i];
        // currentLevelIndex.value = originalLevelData[i].level;
        break;
      }
    }
    currentLevelIndex.value = currentLevelData.value.level;
  }
  // 切换赠送次数上限
  function handleChangeFlags() {}

  // 设置层级tab列表
  function setLevelTabs() {
    const list: any = Object.entries(memberStore.levelSelect).map(([k, v]) => {
      return { label: v, value: k };
    });
    levelTabs.value = list;
  }

  function getParmasLevelData(item, originalLevelData) {
    const level_data = originalLevelData.map((l) => {
      if (l) {
        l.content_arr.forEach((c, i) => {});
        l.bonus_max = valueNumToStr(l.bonus_max);
        l.bonus_limit_value = valueStrToNum(l.bonus_limit_value);
        l.bonus_limit_value_b = valueStrToNum(l.bonus_limit_value_b);
        if (isArray(l.levels)) {
          if (l.levels && l.levels.length > 0) l.levels = l.levels.join(',');
          else l.levels = '';
        }
      }
      return l;
    });
    return level_data;
  }
  // 保存设置
  async function saveFun() {
    try {
      const params = currencyList.value
        .filter((item) => item.currencyData.currency_id)
        .map((item) => {
          const level_data_all = getParmasLevelData(item, item.currencyData.level_data_all);
          const level_data = getParmasLevelData(item, item.currencyData.level_data);
          return {
            ...item.currencyData,
            level_data: level_data ? compact(level_data) : level_data,
            level_data_all: level_data_all ? compact(level_data_all) : level_data_all,
            type: 4,
          };
        });
      loading.value = true;
      const { data, status } = await updatePromoPayment(params);
      if (status) {
        loading.value = false;
        message.success(data);
        closeModal();
      } else {
        loading.value = false;
        message.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function setCurrentMemberLevel(val) {
    currentLevelData.value['levels'] = val;
  }

  function copyData() {
    levelData.content_arr = setContentArr();
    return [cloneDeep(levelData)];
  }
</script>

<style lang="less" scoped>
  .load-box {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 10%);
    font-size: 50px;
    inset: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s linear;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  ::deep(.ant-checkbox-wrapper) {
    margin-left: 0 !important;
  }

  .activeTag {
    background: linear-gradient(90deg, rgb(76 155 239) 0%, lighten(@primary-color, 10%) 100%);
    color: #fff !important;
  }

  .c-form {
    margin-bottom: 10px;

    .ant-form-item {
      margin-bottom: 0;
    }
  }

  .green {
    color: #59c0d5;
    white-space: nowrap;
  }

  ::v-deep(.ant-radio-button-wrapper:first-child) {
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper:last-child) {
    border-left: 0;
    border-radius: 0;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    border-left-width: 1px;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    width: 83px;
    border-left-width: 1px solid #d9d9d9;
    text-align: center;
  }
</style>

<style lang="less">
  .level-flags-tooltip {
    .ant-tooltip-inner {
      width: 500px;
    }
  }

  .discount-modal {
    .ant-modal .ant-modal-body > .scrollbar {
      padding-top: 0 !important;
    }
  }
</style>
<style lang="less" scoped>
  .add-btn,
  .reduce-btn {
    width: 52px;
    height: 38px;
  }

  ::v-deep(.ant-col-8 + .ant-col-3) {
    padding: 0 !important;
  }

  .add-btn {
    border: none;
    background-color: #1475e1;
    background-image: url('/@/assets/images/add.webp');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 17px;
    color: transparent;
  }

  .reduce-btn {
    border: none;
    background-color: #e91134;
    background-image: url('/@/assets/images/reduce.webp');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 17px;
    color: transparent;
  }
</style>
