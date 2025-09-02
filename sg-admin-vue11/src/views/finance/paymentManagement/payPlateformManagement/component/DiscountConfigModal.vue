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
      <!--      <RadioGroup v-model:value="currentCurrencyIndex" button-style="solid" @change="changeClick">-->
      <!--        <RadioButton-->
      <!--          v-for="(item, index) in currencyList"-->
      <!--          class="!mb-5px"-->
      <!--          :value="index"-->
      <!--          :key="index"-->
      <!--        >-->
      <!--          {{ item.name }}-->
      <!--        </RadioButton>-->
      <!--      </RadioGroup>-->
      <cdButtonCurrency
        :btn-list="currencyList?.map((item) => ({ name: item.name, value: item.id }))"
        v-model="activeKey"
      />
    </div>
    <Transition name="fade">
      <div class="px-6 pr-9 mt-4">
        <Form :model="currentCurrencyData" :label-col="{ span: 3 }">
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
          <FormItem v-if="currentCurrencyData['promo_level_flags'] === 2">
            <div class="text-center" v-if="levelTabs.length > 0">
              <div class="px-2 py-1 pb-3 flex flex-wrap border-1 border-slate-200 rounded">
                <BaseTag
                  style="text-align: center !important"
                  v-for="(item, index) in levelTabs"
                  class="cursor mt-2 mx-1"
                  :class="{ activeTag: currentLevelIndex === index }"
                  :key="item.value"
                  :value="item.label"
                  @click="handleChangeLevel(index)"
                />
              </div>
            </div>
          </FormItem>
        </Form>
        <Form :model="currentLevelData" :label-col="{ span: 3 }">
          <FormItem name="" :label="t('modalForm.finance.finance_deposit_range')">
            <Row v-for="(item, index) in currentLevelData.content_arr" :key="index" :gutter="20">
              <Col :span="12">
                <FormItem :help="helpAmount(item)" class="c-form">
                  <Space class="flex" align="baseline">
                    <FormItem>
                      <InputNumber
                        v-model:value="item.scope[0]"
                        :placeholder="t('modalForm.finance.finance_min_deposit')"
                        :size="FORM_SIZE"
                        :disabled="index !== 0"
                        :min="0"
                        maxlength="12"
                        :stringMode="true"
                      />
                    </FormItem>
                    <span>-</span>
                    <FormItem>
                      <InputNumber
                        v-model:value="item.scope[1]"
                        :placeholder="t('modalForm.finance.finance_max_deposit')"
                        :size="FORM_SIZE"
                        :min="0"
                        maxlength="12"
                        :stringMode="true"
                        @change="(value) => handleChangeScope(value, index)"
                      />
                    </FormItem>
                  </Space>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem
                  :name="['content_arr', index, 'scale']"
                  :label="t('modalForm.finance.finance_gift_rate')"
                >
                  <InputNumber
                    v-model:value="item.scale"
                    :placeholder="t('table.system.system_p_enter_gift_ratio')"
                    addonAfter="%"
                    :size="FORM_SIZE"
                    :min="0"
                    :max="100"
                    maxlength="5"
                  />
                </FormItem>
              </Col>
              <Col :span="3">
                <div class="flex">
                  <Button
                    v-if="index === currentLevelData.content_arr.length - 1"
                    class="mr-2 add-btn"
                    @click="addContentArr"
                  >
                    +
                  </Button>
                  <Button
                    v-if="currentLevelData.content_arr.length !== 1"
                    class="reduce-btn"
                    @click="delContentArr(item)"
                  >
                    -
                  </Button>
                </div>
              </Col>
            </Row>
          </FormItem>
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
  } from 'ant-design-vue';
  import { AlertOutlined } from '@ant-design/icons-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { cloneDeep, compact } from 'lodash-es';
  import { useMemberStore } from '/@/store/modules/member';
  import { getPaymentMerchantPromoList, updatePaymentMerchantPromo } from '/@/api/finance';
  import { BaseTag } from '/@/components/DragSelectGroup';
  import Loading from '/@/components/Loading/src/Loading.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { valueNumToStr, valueStrToNum, mul } from '/@/utils/number';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { countDecimalPlaces } from '/@/utils/string';
  import { CURRENCY_UNIT } from '/@/settings/currencySetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Big from 'big.js';
  import { formatNumberFixed } from '/@/views/common/common';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';

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
    scope: Array<number>; //区间数组，第一个值为最小值，第二个值为最大值
    scale: number; //赠送比例
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

  const { currencyTreeList } = useTreeListStore();
  const memberStore = useMemberStore();
  const currencyStore = useCurrencyStore();
  const FORM_SIZE = useFormSetting().getFormSize;
  const loading = ref(false);
  const rowId = ref<any>();

  onMounted(async () => {
    // 获取层级下拉
    await memberStore.getLevelList();
  });

  const [register, { closeModal }] = useModalInner(async (values) => {
    currencyList.value.forEach((item) => {
      item.loaded = false;
    });
    handleChangeCurrencyTabs();
    setLevelTabs();
    rowId.value = values?.data?.id;
  });

  const currencyList = computed(() => {
    const list = currencyTreeList.map((item) => {
      return { ...item, currencyData: cloneDeep(currencyData), loaded: false };
    });
    return [...list];
  });

  const contentData: Array<ContentItem> = [{ scope: [0, 0], scale: 0 }];
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

  // 切换币种
  function changeClick(e) {
    currentCurrencyIndex.value = e.target.value;
    currentCurrency.value = currencyList.value[currentCurrencyIndex.value];
    handleChangeRadio();
    handleChangeCurrencyTabs();
  }
  const activeKey = ref();
  activeKey.value = currencyList.value[0].id ?? '';
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
    const currency = currencyList.value[currentCurrencyIndex.value];
    if (currency.loaded) {
      currentCurrencyData.value = currency.currencyData;
      handleChangeRadio();
      return;
    }

    loading.value = true;
    getPaymentMerchantPromoList({ currency_id: currency.id })
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
              currentCurrencyData.value.level_data_all = [cloneDeep(levelData)];
            } else if (!origin_level_data) {
              currentCurrencyData.value.level_data_all = setLevelData(origin_level_data_all);
              currentCurrencyData.value.level_data = [cloneDeep(levelData)];
            } else {
              setLevelData(origin_level_data_all);
              setLevelData(origin_level_data);
            }
            handleChangeRadio();
          } else {
            currentCurrencyData.value.level_data_all = [cloneDeep(levelData)];
            currentCurrencyData.value.level_data = [cloneDeep(levelData)];
            currentLevelData.value = currentCurrencyData.value.level_data_all[0];
          }
        } else {
          currency.currencyData.currency_id = currency.id;
          currentCurrencyData.value = currency.currencyData;
          currentCurrencyData.value.level_data_all = [cloneDeep(levelData)];
          currentCurrencyData.value.level_data = [cloneDeep(levelData)];
          currentLevelData.value = currentCurrencyData.value.level_data_all[0];
        }
      })
      .finally(() => {
        currency.loaded = true;
        loading.value = false;
      });
  }
  function setLevelData(originalLevelData) {
    const level_data: Array<LevelItem> = [];
    originalLevelData.forEach((item) => {
      item.bonus_max = valueNumToStr(item.bonus_max);
      item.bonus_limit_value = valueNumToStr(item.bonus_limit_value);
      item.bonus_limit_value_b = valueNumToStr(item.bonus_limit_value_b);
      item.content_arr = item.content_arr.length === 0 ? cloneDeep(contentData) : item.content_arr;
      // 匹配对应层级
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
  // 切换层级
  function handleChangeLevel(index) {
    currentLevelIndex.value = index;
    let originalLevelData = currentCurrencyData.value.level_data_all;
    if (currentCurrencyData.value.promo_level_flags === 2) {
      originalLevelData = currentCurrencyData.value.level_data;
    }
    const hasCurrent = originalLevelData.find((item) => item && item.level === index);
    if (hasCurrent) {
      currentLevelData.value = hasCurrent;
    } else {
      const newLevelData = cloneDeep(levelData);
      newLevelData.level = index;
      originalLevelData[index] = newLevelData;
      currentLevelData.value = originalLevelData[index];
    }
  }
  // 新增存款区间
  function addContentArr() {
    const { content_arr } = currentLevelData.value;
    const unit = currencyStore.getCurrencyUnit(currentCurrency.value.label, '1');
    content_arr.push({
      scope: [
        new Big(
          formatNumberFixed(
            content_arr[content_arr.length - 1].scope[1],
            currentCurrency.value.label,
          ),
        ).plus(unit),
        0,
      ],
      scale: 0,
    });
  }
  // 删除存款区间
  function delContentArr(item) {
    const { content_arr } = currentLevelData.value;
    const index = content_arr.indexOf(item);
    if (index !== -1) {
      content_arr.splice(index, 1);
      if (content_arr.length >= 1 && index !== 0) {
        const value = content_arr[index - 1].scope[1];
        const idx = index - 1;
        handleChangeScope(value, idx);
      }
    }
  }
  function helpAmount(item) {
    const scale = item.scale > 0 ? item.scale / 100 : item.scale;
    const fiexed = countDecimalPlaces(CURRENCY_UNIT[currentCurrency.value.label]);

    const min =
      item.scope[0] && item.scale
        ? formatNumberFixed(mul(item.scope[0], scale), currentCurrency.value.label)
        : 0;
    const max =
      item.scope[1] && item.scale
        ? formatNumberFixed(mul(item.scope[1], scale), currentCurrency.value.label)
        : 0;

    return `${t('modalForm.finance.finance_gift_expect')}${min}-${max}`; //预计赠送金额
  }
  // 更改最低存款
  function handleChangeScope(value, index) {
    const { content_arr } = currentLevelData.value;
    const unit = currencyStore.getCurrencyUnit(currentCurrency.value.label, '1');
    if (index + 1 < content_arr.length) {
      content_arr[index + 1].scope[0] = new Big(
        formatNumberFixed(value, currentCurrency.value.label),
      ).plus(unit);
    }
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

  // 数据校验
  function setRules({ currencyData, level_data_item, content_arr, index }) {
    const { level } = level_data_item;
    const { scope, scale } = content_arr;
    const { promo_level_flags, currency_id } = currencyData;
    const levelTab: TabsFormType | undefined = levelTabs.value.find((item) => item.value == level);
    const currency = currencyTreeList.find((item) => item.id === currency_id);
    let text = '';
    let prefix = `${t('business.common_currency')}${currency.name}${
      promo_level_flags === 2 ? `「${levelTab?.label}」` : ''
    }`;
    if (!scope[0] && !scope[1]) {
      level_data_item.content_arr.splice(index, 1);
      return;
    }
    // if (!parseInt(scale) && scale !== 0) {
    //   text = `${prefix}「赠送比例」第${index + 1}行不能为空`;
    // }
    if ((scale === '' || isNaN(scale)) && scale !== 0) {
      text = `${prefix}「${t('modalForm.finance.finance_gift_rate')}」${t(
        'common.translate.word63',
        [index + 1],
      )}`;
    }
    if ((!scope[0] && scope[0] !== 0) || !scope[1]) {
      text = `${prefix}「${t('modalForm.finance.finance_deposit_range')}」${t(
        'common.translate.word63',
        [index + 1],
      )}`;
    }
    if (parseInt(scope[1]) && !parseInt(scope[0]) && parseInt(scope[0]) < 0) {
      text = `${prefix}「${t('modalForm.finance.finance_deposit_range')}」${t(
        'common.translate.word64',
        [index + 1],
      )}`;
    }
    if (parseFloat(scope[1]) <= parseFloat(scope[0])) {
      text = `${prefix}「${t('modalForm.finance.finance_deposit_range')}」${t(
        'common.translate.word65',
        [index + 1],
      )}`;
    }
    if (text) {
      message.error(text);
      throw new Error(text);
    }
  }
  function getParmasLevelData(item, originalLevelData) {
    const level_data = originalLevelData.map((l) => {
      if (l) {
        l.content_arr.forEach((c, i) => {
          setRules({
            currencyData: item.currencyData,
            level_data_item: l,
            content_arr: c,
            index: i,
          });
        });
        l.bonus_max = valueNumToStr(l.bonus_max);
        l.bonus_limit_value = valueStrToNum(l.bonus_limit_value);
        l.bonus_limit_value_b = valueStrToNum(l.bonus_limit_value_b);
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
          };
        });
      loading.value = true;
      const { data, status } = await updatePaymentMerchantPromo(params);
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
