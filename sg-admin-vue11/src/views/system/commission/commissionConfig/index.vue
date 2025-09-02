<template>
  <div class="Commission">
    <div class="commission-config">
      <div class="commission-title">{{ t('common.basic_configuration') }}</div>
      <div class="commission-config-header">
        <BasicForm @register="conditionSeting" :disabled="isControlValueSet()">
          <template #frontEntrance>
            <div class="form-content">
              <span class="basic-name">{{
                frontEntranceMapping[commissionConfigV1.front_entrance]
              }}</span>
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="basicConfiguration('front_entrance')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
          <template #mode>
            <div class="form-content">
              <span class="basic-name">{{ modeMapping[commissionConfigV1.mode] }}</span>
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="basicConfiguration('mode')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
          <template #platform>
            <div class="form-content">
              <span class="basic-name platform-text">{{
                getName(commissionConfigV1.platform)
              }}</span>
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="basicConfiguration('platform')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
          <template #bonusType>
            <div class="form-content">
              <span class="basic-name">{{ bonusTypeMapping[commissionConfigV1.bonus_type] }}</span>
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="basicConfiguration('bonus_type')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
          <template #bonusCurrency>
            <div class="form-content">
              <span class="basic-name"
                ><cdIconCurrency
                  :icon="currentyOptions[commissionConfigV1.bonus_currency]"
                  class="w-20px mr-5px"
                />{{ currentyOptions[commissionConfigV1.bonus_currency] }}</span
              >
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="basicConfiguration('bonus_currency')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
          <template #bonusLimit>
            <div class="form-content">
              <span class="basic-name"
                >{{ commissionConfigV1.bonus_limit || t('table.discountActivity.discount_no_limit')
                }}<cdIconCurrency
                  v-if="!!commissionConfigV1.bonus_limit"
                  :icon="currentyOptions[commissionConfigV1.bonus_currency]"
                  class="w-20px ml-5px"
              /></span>
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="basicConfiguration('bonus_limit')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
          <template #bonusPeriod>
            <div class="form-content">
              <span class="basic-name">{{
                bonusPeriodMapping[commissionConfigV1.bonus_period]
              }}</span>
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="basicConfiguration('bonus_period')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
          <template #rules>
            <div class="form-content">
              <span class="basic-name">
                <a-button
                  type="link"
                  :disabled="isControlValueSet()"
                  @click="rulesConfiguration('rules', 'preview')"
                >
                  {{ t('common.click_preview') }}
                </a-button>
              </span>
              <a-button
                type="link"
                :disabled="isControlValueSet()"
                @click="rulesConfiguration('rules')"
                v-if="isHasAuth('70307')"
              >
                {{ t('common.click_settings') }}
              </a-button>
            </div>
          </template>
        </BasicForm>
      </div>
      <div class="flex justify-between items-center">
        <div class="commission-title commission-title2"
          >{{ t('common.conditional_configuration') }}
        </div>
      </div>
      <div class="commission-config-sec2">
        <div
          class="flex justify-between commission-header"
          v-if="
            !([2, 3].includes(commissionConfigV1.mode) && commissionConfigV1.type === 1) &&
            commissionConfigV1.mode !== 1
          "
        >
          <div class="mb-20px">
            <RadioGroup
              class="my-radio"
              button-style="solid"
              size="large"
              v-model:value="conditionalConfigurationKey"
              @change="condDirectTeam"
            >
              <RadioButton :value="el.key" v-for="el in conditionalConfiguration" :key="el.key"
                >{{ el.label }}
              </RadioButton>
            </RadioGroup>
          </div>
          <div>
            <Button
              type="primary"
              @click="editGame"
              :size="FORM_SIZE"
              v-if="isHasAuth('70307') && !isAddNewMode"
              >{{ t('common.editorText') }}
            </Button>
            <Button
              type="primary"
              @click="handleSubmit"
              :size="FORM_SIZE"
              v-if="isHasAuth('70307') && isAddNewMode"
              >{{ t('common.saveText') }}
            </Button>
            <Button
              type="default"
              @click="handleCancel"
              class="ml-12px"
              :size="FORM_SIZE"
              v-if="isHasAuth('70307') && isAddNewMode"
              >{{ t('business.common_cancel') }}
            </Button>
          </div>
        </div>
        <div class="flex justify-between commission-header">
          <div>
            <Tabs
              class="my-tabs"
              v-model:activeKey="levelsKey"
              @change="tabGame"
              @edit="onEditTab"
              :type="cardType"
              :hideAdd="true"
            >
              <TabPane
                :disabled="isTabState"
                v-for="item in gamesData"
                :key="item?.ty"
                :tab="item?.label"
              />
            </Tabs>
          </div>
          <div
            v-if="
              !(
                !([2, 3].includes(commissionConfigV1.mode) && commissionConfigV1.type === 1) &&
                commissionConfigV1.mode !== 1
              )
            "
          >
            <Button
              type="primary"
              @click="editGame"
              :size="FORM_SIZE"
              v-if="isHasAuth('70307') && !isAddNewMode"
              >{{ t('common.editorText') }}
            </Button>
            <Button
              type="primary"
              @click="handleSubmit"
              :size="FORM_SIZE"
              v-if="isHasAuth('70307') && isAddNewMode"
              >{{ t('common.saveText') }}
            </Button>
            <Button
              type="default"
              @click="handleCancel"
              class="ml-12px"
              :size="FORM_SIZE"
              v-if="isHasAuth('70307') && isAddNewMode"
              >{{ t('business.common_cancel') }}
            </Button>
          </div>
        </div>
        <BasicTable @register="regsiterTableLevel" :columns="getSchemas()" ref="tableRef">
          <template #level="{ column, record, index }"> {{ index + 1 }}</template>
          <template #title_amt="{ column, record }">
            <div class="flex justify-center align-center">
              {{ t('common.coding_requirements') }}
              <cdBlockCurrency
                :label="currentyOptions[commissionConfigV1.bonus_currency]"
                class="ml-5px"
              />
              ≥
            </div>
          </template>
          <template #action="{ column, record, index }">
            <a @click="addLevelClick" v-if="isHasAuth('70312') && isAddNewMode" class="mr-2"
              ><img :src="RECT_ADD"
            /></a>
            <a @click="handleDelete(record, index)" v-if="isHasAuth('70308')"
              ><img :src="RECT_DELETE"
            /></a>
          </template>
        </BasicTable>
        <Button
          class="table-add !text-xs py-[10px] w-300px h-50px! leading-[50px]! flex! justify-center items-center"
          type="primary"
          preIcon="gala:add"
          @click="addLevelClick"
          v-if="isHasAuth('70312') && isAddNewMode && showAddBtn"
        >
          {{ t('table.system.system_sort_add') }}
        </Button>
      </div>
      <div class="commission-title">
        <Tooltip placement="topRight">
          <template #title>
            {{ t('common.performance_calculation1') }}{{ t('common.performance_calculation2') }}
          </template>
          <span class="vben-basic-help"
            ><span class="app-iconify anticon" style="display: inline-flex; font-size: 16px"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                class="iconify iconify--tabler"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12h1m8-9v1m8 8h1M5.6 5.6l.7.7m12.1-.7l-.7.7M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3m.7 1h4.6"
                /></svg></span
          ></span>
        </Tooltip>
        {{ t('common.performance_calculation') }}
      </div>
      <div class="commission-config-sec3">
        <BasicTable @register="regsiterPerformanceCondition">
          <template #title_amt="{ column, record }">
            <div class="flex justify-center align-center">
              {{ t('table.system.system_config_amount') }}
              <cdBlockCurrency
                :label="currentyOptions[commissionConfigV1.bonus_currency]"
                class="ml-5px"
              />
            </div>
          </template>
          <template #action="{ column, record }">
            <TableAction
              :actions="createPerformanceAction(record)"
              class="table-btn-default btn-40px"
            />
          </template>
        </BasicTable>
      </div>
    </div>
    <!--  基础配置  -->
    <BasicConfigurationModel
      @register="showBasicConfiguration"
      :gamesData="gamesData"
      @close-load="closeLoad"
    />
    <!--  活动规则  -->
    <RulesModel @register="showRules" :rulesData="commissionConfigV1" @close-load="closeLoad" />
  </div>
</template>

<script setup lang="ts" name="CommissionConfig">
  import { ref, computed, nextTick, unref, watch } from 'vue';
  import { Tabs, TabPane, RadioGroup, RadioButton, Tooltip } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import BasicConfigurationModel from './components/BasicConfigurationModel.vue';
  import RulesModel from './components/RulesModel.vue';
  import { useModal } from '/@/components/Modal';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { uniqueId } from 'lodash-es';
  import { openConfirm } from '/@/utils/confirm';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { getCommissionConfigV1, updateCommissionConfigV1 } from '/@/api/commission/index.ts';
  import {
    useTable,
    BasicTable,
    TableAction,
    EditRecordRow,
    ActionItem,
    TableActionType,
  } from '/@/components/Table';
  import { setingFormLeftData, columnsCondition } from './index.data.ts';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { currentyOptions } from '@/settings/commonSetting';
  import { useUserStore } from '@/store/modules/user';
  import { useForm, BasicForm } from '@/components/Form';
  import { isControlValueSet } from '@/utils/domUtils';
  import { toTimezone } from '@/utils/dateUtil';
  import cdBlockCurrency from '@/components-cd/block/cd-block-currency.vue';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import close from '/@/assets/svg/close.svg';

  const { t } = useI18n();
  const gameMapping: any = {
    1: t('table.system.system_real_person'),
    2: t('table.system.system_fish_get'),
    3: t('table.system.system_electronic'),
    4: t('table.system.system_physical_education'),
    8: t('table.system.system_original_game'),
    5: t('table.member.member_chess'),
  };
  const frontEntranceMapping: any = {
    1: t('table.system.open'),
    0: t('table.system.close'),
  };
  const modeMapping: any = {
    1: t('common.mode1'),
    2: t('common.mode2'),
    3: t('common.mode3'),
  };
  const bonusTypeMapping: any = {
    0: t('table.system.close'),
    1: t('table.system.system_auto_send'),
    2: t('table.system.system_people_review'),
  };
  const bonusPeriodMapping: any = {
    1: t('common.daily_settlement'),
    2: t('common.weekly_settlement'),
    3: t('common.monthly_settlement'),
  };
  const tableRef = ref<Nullable<TableActionType>>(null);

  interface game_type {
    label: string;
    model_ids: string;
    lvl: [];
    id: string;
    closable: boolean;
  }

  const gamesData = ref<game_type[]>([]);
  const conditionalConfiguration = ref([
    { key: 'cond_direct', label: t('common.direct_commission_configuration') },
    { key: 'cond_team', label: t('common.team_commission_configuration') },
  ]);
  const levelsKey = ref('' as string);
  const oldLevelsKey = ref('' as string);
  const conditionalConfigurationKey = ref('cond_direct' as string);
  const filterList = ref([] as any);
  const FORM_SIZE = useFormSetting().getFormSize;
  const showAddBtn = ref(false);
  const levelDisabled = ref(false);
  const editGameDisabled = ref(false);
  const delGameDisabled = ref(false);
  const { createMessage } = useMessage();
  const currentEditKeyRef = ref('');
  const isTabState = ref(false);
  const isAddNewMode = ref(false);
  const cardType = ref('card' as string);
  const commissionConfigV1 = ref({} as any);
  const commissionConfigDetailData = ref([] as any); // 备份数据用于取消还原
  const commissionConfigDetailList = ref([] as any); // 多模式编辑储存数据
  const ifSwitch = ref('' as string); // 判断是代理mode 还是模式platform

  watch(
    () => conditionalConfigurationKey.value,
    (newV, oldV) => {
      if (newV !== oldV && isAddNewMode.value) {
        const getDataModal = getDataSource();
        let getDate =
          getDataModal?.map((item: any, ind: number) => {
            return {
              lvl: ind + 1,
              amt: String(item.editValueRefs.amt),
              rate: String(item.editValueRefs.rate),
              updated_at: item.updated_at || '',
              updated_by: item.updated_by || '',
            };
          }) || null;
        setTimeout(() => {
          let obj = JSON.parse(commissionConfigDetailList.value[oldV]).map((item: any) => {
            if (oldLevelsKey.value === item.ty) {
              return {
                lvl: getDate,
                ty: item.ty,
              };
            }
            return {
              ...item,
            };
          });
          // 存储编辑的数据
          commissionConfigDetailList.value[oldV] = JSON.stringify(obj);
          let newObj = JSON.parse(commissionConfigDetailList.value[newV]);
          let arr = newObj.filter((item) => item.ty === levelsKey.value);
          setTableData(arr[0]?.lvl || []);
        }, 400);
      }
    },
  );

  watch(
    () => levelsKey.value,
    (newV, oldV) => {
      oldLevelsKey.value = oldV;
    },
  );
  watch(
    () => [commissionConfigV1.value.mode, commissionConfigV1.value.type],
    ([modeO, typeO], [modeV, typeV]) => {
      if (modeO !== modeV || modeChange.value || modeO === 1) {
        if (!([2, 3].includes(modeO) && typeO === 1) && modeO !== 1) {
          conditionalConfigurationKey.value = 'cond_direct';
          condDirectTeam({ target: { value: 'cond_direct' } });
          modeChange.value = false;
        } else if ([2, 3].includes(modeO) || typeO === 1 || modeO === 1) {
          conditionalConfigurationKey.value = 'cond_team';
          condDirectTeam({ target: { value: 'cond_team' } });
          modeChange.value = false;
        }
      }
    },
  );

  watch(
    () => cardType.value,
    (newV, oldV) => {
      if (newV === 'editable-card') {
        setTimeout(() => {
          const elements = document.querySelectorAll('.my-tabs .anticon-close');
          elements.forEach((div) => {
            const img = document.createElement('img');
            img.src = close; // 设置图片链接
            img.alt = ''; // 设置图片的 alt 属性
            div.appendChild(img); // 将图片添加到对应的 div 中
          });
        }, 0);
      }
    },
  );

  // 初始化所有数据
  const init = async () => {
    const data = await getCommissionConfigV1();
    commissionConfigDetailList.value = { ...data };
    commissionConfigDetailData.value = { ...data };
    commissionConfigV1.value = { ...data };
    data.bonus_limit == 0 && (commissionConfigV1.value.bonus_limit = '');
  };
  init();

  // 基础配置
  const [conditionSeting, { setFieldsValue: setFieldsValueBasicSettings, validate }] = useForm({
    schemas: setingFormLeftData,
    size: FORM_SIZE as any,
    labelWidth: '260px',
    labelAlign: 'right',
    showResetButton: false,
    showSubmitButton: false,
    showActionButtonGroup: false,
  });

  const getName = (item: any) => {
    if (commissionConfigV1.value.platform_all) return t('business.common_all');
    if (item?.length) {
      let arr = JSON.parse(item)?.map((key) => {
        if (key?.includes(',')) {
          let str = key.split(',').map((v) => {
            return gameMapping[v];
          });
          return str.join('/');
        }
        return gameMapping[key];
      });
      return arr.join(',');
    }
  };

  const [showRules, { openModal: openRules }] = useModal();

  function rulesConfiguration(type, ty): void {
    openRules(true, {
      type,
      ty,
      rules: commissionConfigV1.value.rules,
    });
  }

  const [showBasicConfiguration, { openModal: openAccessMoneySettingModalBet }] = useModal();

  function basicConfiguration(ty, record): void {
    openAccessMoneySettingModalBet(true, {
      ...commissionConfigV1.value,
      ty,
      record,
    });
  }

  // 条件配置
  const [regsiterTableLevel, { setTableData, getDataSource, reload: reloadLevels }] = useTable({
    api: getCondDirectTeam,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    canResize: false,
    useSearchForm: false,
  });

  function getTableAction() {
    const tableAction = unref(tableRef);
    if (!tableAction) {
      throw new Error('tableAction is null');
    }
    return tableAction;
  }

  // 梯级编辑
  function editGame() {
    isAddNewMode.value = true;
    const data = getDataSource();
    if (data) {
      data?.forEach((item: any) => {
        item.onEdit?.(true);
      });
    }
    if (gamesData.value.length > 0) {
      levelDisabled.value = !levelDisabled.value;
    }
    delGameDisabled.value = !delGameDisabled.value;
    if (cardType.value === 'card') {
      cardType.value = 'editable-card';
    } else if (cardType.value === 'editable-card') {
      cardType.value = 'card';
    }
  }

  // 梯级单条数据保存
  async function handleSubmit() {
    isAdd.value = false;
    const getDataModal = getDataSource();
    let getDate =
      getDataModal?.map((item: any, ind: number) => {
        return {
          lvl: ind + 1,
          amt: String(item.editValueRefs.amt),
          rate: String(item.editValueRefs.rate),
        };
      }) || null;
    let obj = JSON.parse(commissionConfigDetailList.value[conditionalConfigurationKey.value]); // 使用缓存后的数据

    // 删除当前tab的模式配置
    let arrr = [];
    for (const item of obj) {
      // 旧：3组
      for (const val of currentCommissionConfig.value) {
        // 新：2组
        let objj = {};
        if (item.ty === val.ty) {
          objj['ty'] = item.ty;
          objj['lvl'] = item.lvl;
          arrr.push(objj);
        }
      }
    }
    // 删除另一个tab的模式配置
    let otherTable = conditionalConfiguration.value.filter(
      (item: any) => item.key !== conditionalConfigurationKey.value,
    )[0].key;
    let otherTableObj = JSON.parse(commissionConfigDetailList.value[otherTable]); // 使用缓存后的数据
    let otherTablearrr = [];
    for (const item of otherTableObj) {
      // 旧：3组
      for (const val of currentCommissionConfig.value) {
        // 新：2组
        let objj = {};
        if (item.ty === val.ty) {
          objj['ty'] = item.ty;
          objj['lvl'] = item.lvl;
          otherTablearrr.push(objj);
        }
      }
    }
    // 去掉多余字段：updated_at，updated_by
    const newObj = arrr.map((item) => {
      return {
        ...item,
        lvl: item.lvl?.map((level) => {
          const { updated_at, updated_by, ...levelWithoutUpdates } = level;
          return levelWithoutUpdates;
        }),
      };
    });
    const newOtherObj = otherTablearrr.map((item) => {
      return {
        ...item,
        lvl: item.lvl?.map((level) => {
          const { updated_at, updated_by, ...levelWithoutUpdates } = level;
          return levelWithoutUpdates;
        }),
      };
    });
    let arr = newObj.map((item: any) => {
      if (item.ty === levelsKey.value) {
        return {
          ...item,
          ty: item.ty,
          lvl: getDate,
        };
      }
      return {
        ...item,
      };
    });
    let otherArr = newOtherObj.map((item: any) => {
      if (item.ty === otherTable) {
        return {
          ...item,
          ty: item.ty,
          lvl: item.lvl,
        };
      }
      return {
        ...item,
      };
    });
    let newArr = {
      [conditionalConfigurationKey.value]: JSON.stringify(arr),
      [otherTable]: JSON.stringify(otherArr),
    };
    await updateCommissionConfigV1(newArr);
    await subHandleCancel();
    await getCondDirectTeam();
  }

  // 梯级取消
  function handleCancel() {
    isAdd.value = false;
    const data = getDataSource();
    if (data) {
      data?.forEach((item: any) => {
        item.onEdit?.(false, false);
      });
    }
    isAddNewMode.value = false;
    cardType.value = 'card';
    commissionConfigV1.value = commissionConfigDetailData.value;
    getCondDirectTeam();
    init();
  }

  // 保存不刷新表格
  function subHandleCancel() {
    const data = getDataSource();
    if (data) {
      data?.forEach((item: any) => {
        item.onEdit?.(false, true);
      });
    }
    levelDisabled.value = false;
    isAddNewMode.value = false;
    cardType.value = 'card';
    init();
  }

  const currentCommissionConfig = ref({} as any);

  // 初始化佣金配置
  async function getCondDirectTeam() {
    await delay(1000);
    currentCommissionConfig.value = JSON.parse(
      commissionConfigV1.value[conditionalConfigurationKey.value],
    );
    levelsKey.value = levelsKey.value || currentCommissionConfig.value[0].ty;
    gamesData.value = currentCommissionConfig.value.map((item) => {
      let label = '';
      if (commissionConfigV1.value.platform_all) {
        label = t('business.common_all');
      } else {
        label = item.ty.includes(',')
          ? item.ty
              .split(',')
              .map((val) => gameMapping[val])
              .join('/')
          : gameMapping[item.ty];
      }
      return {
        ...item,
        label,
        levels: item.lvl,
        key: item.ty,
      };
    });
    await tabGame(levelsKey.value);
    return gamesData.value[0]?.lvl;
  }

  // 切换佣金配置
  function condDirectTeam(key) {
    currentCommissionConfig.value =
      key.target.value === 'cond_direct'
        ? JSON.parse(commissionConfigV1.value?.cond_direct)
        : JSON.parse(commissionConfigV1.value?.cond_team);
    gamesData.value = currentCommissionConfig.value.map((item) => {
      let label = '';
      if (commissionConfigV1.value.platform_all) {
        label = t('business.common_all');
      } else {
        label = item.ty.includes(',')
          ? item.ty
              .split(',')
              .map((val) => gameMapping[val])
              .join('/')
          : gameMapping[item.ty];
      }
      return {
        ...item,
        label,
        levels: item.lvl,
        key: item.ty,
      };
    });
    currentCommissionConfig.value = JSON.parse(
      commissionConfigV1.value[conditionalConfigurationKey.value],
    );
    levelsKey.value = currentCommissionConfig.value[0].ty;
    tabGame(levelsKey.value);
    ifSwitch.value = 'mode';
  }

  // 切换模式
  async function tabGame(key, type?: string) {
    if (!type) ifSwitch.value = 'platform';
    // 编辑时切换逻辑
    if (isAddNewMode.value) {
      const getDataModal = getDataSource();
      let getDate =
        getDataModal?.map((item: any, ind: number) => {
          return {
            lvl: ind + 1,
            amt: String(item.editValueRefs.amt),
            rate: String(item.editValueRefs.rate),
          };
        }) || null;
      await delay(200);
      let obj = JSON.parse(commissionConfigDetailList.value[conditionalConfigurationKey.value]).map(
        (item: any) => {
          if (oldLevelsKey.value === item.ty) {
            return {
              lvl: getDate,
              ty: item.ty,
            };
          }
          return {
            ...item,
          };
        },
      );
      // 代理模式切换
      if (ifSwitch.value === 'mode') {
        let arr = obj.filter((item) => item.ty === key);
        showAddBtn.value = !arr[0].lvl?.length;
        levelsKey.value = key;
        setTableData(arr[0]?.lvl || []);
        await delay(300);
      }
      // 模式配置切换
      if (ifSwitch.value === 'platform') {
        // 存储编辑的数据
        commissionConfigDetailList.value[conditionalConfigurationKey.value] = JSON.stringify(obj);
        let newObj = JSON.parse(
          commissionConfigDetailList.value[conditionalConfigurationKey.value],
        );
        let arr = newObj.filter((item) => item.ty === key);
        showAddBtn.value = !arr[0].lvl?.length;
        levelsKey.value = key;
        setTableData(arr[0]?.lvl || []);
        await delay(100);
      }
      const data = getDataSource();
      if (data) {
        data?.forEach((item: any) => {
          item.onEdit?.(true);
        });
      }
    } else {
      // 非编辑时切换逻辑
      let arr = currentCommissionConfig.value.filter((item) => item.ty === key);
      showAddBtn.value = !arr[0].lvl?.length;
      levelsKey.value = key;
      setTableData(arr[0]?.lvl || []);
    }
  }

  // 新增梯级功能
  const isAdd = ref(false);

  function addLevelClick() {
    const data = getTableAction().getDataSource() || [];
    const item: EditRecordRow = {
      valid: '',
      amt: '0',
      rate: '0',
      editable: true,
      level: Number(uniqueId()) + 1,
    };
    currentEditKeyRef.value = toString(Number(uniqueId()) + 1);
    editGameDisabled.value = true;
    levelDisabled.value = true;

    nextTick(() => {
      data.push(item);
      showAddBtn.value = false;
      if (data.length === 1) {
        setTableData(data);
      }
    });
  }

  // 梯级删除
  function handleDelete(record: EditRecordRow, index: number) {
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.system.system_delte_tip1'),
      async () => {
        const data = getDataSource();
        data.splice(index, 1);
        record.onEdit?.(false, false);
        if (!data.length) {
          showAddBtn.value = true;
        }
      },
    );
    editGameDisabled.value = false;
    levelDisabled.value = false;
  }

  //编辑业绩的表格
  function createPerformanceAction(record: EditRecordRow): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: t('business.common_edit'),
          onClick: handlePerformanceEdit.bind(null, record),
          ifShow: isHasAuth('70307'),
        },
      ];
    }
    return [
      {
        label: t('common.saveText'),
        onClick: handlePerformancSave.bind(null, record),
      },
      {
        label: t('common.cancelText'),
        onClick: handlePerformancCancel.bind(null, record),
        color: 'default',
      },
    ];
  }

  //编辑业绩单条数据
  function handlePerformanceEdit(record: EditRecordRow) {
    record.onEdit?.(true);
  }

  //取消编辑业绩单条数据
  function handlePerformancCancel(record) {
    record.onEdit?.(false, false);
  }

  const store = useUserStore();
  const detailCurrency = computed(() => store.detailCurrency);

  // 业绩报表数据初始化
  const [
    regsiterPerformanceCondition,
    { getDataSource: getPerformanceReloadDataSource, reload: performanceReload },
  ] = useTable({
    api: columnsPerformanceData,
    columns: columnsCondition,
    bordered: true,
    pagination: false,
    canResize: false,
    useSearchForm: false,
    indexColumnProps: {
      title: t('table.system.system_index_table'),
      width: '10%',
    },
    actionColumn: {
      title: t('business.common_operate'),
      dataIndex: 'action',
      width: '16%',
      slots: { customRender: 'action' },
      ifShow: isHasAuth('70307'),
    },
  });

  //保存业绩单条数据
  async function handlePerformancSave() {
    const getDataModal = getPerformanceReloadDataSource();
    let getDate = getDataModal.map((item: any, ind: number) => {
      return {
        amt: String(item.editValueRefs.amt),
      };
    });
    let arr = {
      bet: getDate[0],
      deposit: getDate[1],
    };
    await updateCommissionConfigV1({ cond_perform: JSON.stringify(arr) });
    closePerformanc();
  }

  // 业绩报表数据初始化
  async function columnsPerformanceData() {
    await delay(1000);
    let str =
      '{"bet": {"amt": "0", "updated_at": 0, "updated_by": ""}, "deposit": {"amt": "0", "updated_at": "", "updated_by": ""}}';
    filterList.value = Object.values(
      JSON.parse(
        commissionConfigV1.value?.cond_perform.length > 2
          ? commissionConfigV1.value?.cond_perform
          : str,
      ),
    );
    let arr = filterList.value.map((item: any, ind: number) => {
      return {
        ...item,
        condition:
          ind === 0 ? t('table.system.system_week_valid') : t('table.system.system_week_deposit'),
      };
    });
    return arr;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // 删除模式tab
  async function onEditTab(targetKey: string) {
    const getDataModal = getDataSource();
    let getDate =
      getDataModal?.map((item: any, ind: number) => {
        return {
          lvl: ind + 1,
          amt: String(item.editValueRefs.amt),
          rate: String(item.editValueRefs.rate),
        };
      }) || null;
    gamesData.value = gamesData.value
      .filter((item: any) => targetKey !== item.key)
      .map((item: any, ind: number) => {
        if (item.ty === levelsKey.value) {
          return {
            ...item,
            lvl: getDate,
          };
        }
        return {
          ...item,
        };
      });
    currentCommissionConfig.value = currentCommissionConfig.value
      .filter((item: any) => targetKey !== item.ty)
      .map((item: any, ind: number) => {
        if (item.ty === levelsKey.value) {
          return {
            ...item,
            lvl: getDate,
          };
        }
        return {
          ...item,
        };
      });
    setTableData(getDate || []);
  }

  const columnsValid = [
    {
      title: 'id',
      dataIndex: 'id',
      ifShow: false,
    },
    {
      title: t('business.common_level'),
      dataIndex: 'level',
      width: isAddNewMode.value ? '10%' : '10%',
      slots: { customRender: 'level' },
    },
    {
      slots: { title: 'title_amt' },
      dataIndex: 'amt',
      width: isAddNewMode.value ? '20%' : '20%',
      editRow: true,
      editComponent: 'InputNumber',
      editComponentProps: {
        min: 0,
        max: 999999999999.99,
      },
    },
    {
      title: t('table.system.system_rebate_rate1'),
      dataIndex: 'rate',
      width: isAddNewMode.value ? '20%' : '20%',
      editRow: true,
      editComponent: 'InputNumber',
      editComponentProps: {
        precision: 2,
        min: 0,
        max: 100,
      },
      ifShow: ({ values }) => isAddNewMode.value,
    },
    {
      title: t('table.system.system_rebate_rate1'),
      dataIndex: 'rate',
      width: isAddNewMode.value ? '20%' : '20%',
      editRow: false,
      editComponent: 'InputNumber',
      ifShow: ({ values }) => !isAddNewMode.value,
      customRender: ({ record }) => {
        return Number(record.rate).toFixed(2) + '%';
      },
    },
    {
      title: t('business.common_operate'), //操作
      dataIndex: 'third_deposit_time',
      slots: { customRender: 'action', style: { textAlign: 'center' } },
      ifShow: ({ values }) => auths(['70306', '70307', '70308']) && isAddNewMode.value,
    },
    {
      title: t('table.risk.report_operating_time'),
      dataIndex: 'updated_at',
      minWidth: 220,
      customRender: ({ record }) => {
        return toTimezone(record.updated_at);
      },
    },
    {
      title: t('table.risk.report_operate_people'),
      dataIndex: 'updated_by',
      width: isAddNewMode.value ? '16%' : '16%',
    },
  ];

  function getSchemas() {
    return columnsValid.map((item) => {
      if (item.dataIndex === 'effective_amount') {
        return {
          ...item,
          helpMessage: `<p>${t('table.system.system_unit_tip1', {
            size: detailCurrency.value,
          })}<p><p>${t('table.member.member_according')}<span style="color:#F59A23;">${t(
            'table.member.member_ratae_detail',
          )}</span>${t('table.member.member_computed_')}</p>`,
        };
      }
      return {
        ...item,
      };
    });
  }

  const modeChange = ref(false);

  async function closeLoad(boo: boolean) {
    levelDisabled.value = false;
    performanceReload();
    reloadLevels();
    init();
    modeChange.value = boo;
  }

  async function closePerformanc() {
    levelDisabled.value = false;
    performanceReload();
    init();
  }
</script>
<style lang="less" scoped>
  .Commission {
    box-sizing: border-box;
    padding: 10px 20px !important;
    background-color: #eef1f7;
    margin-top: -12px;

    .commission-config-header,
    .commission-config-sec2,
    .commission-config-sec3 {
      box-sizing: border-box;
      width: 100%;
      padding: 20px;
      background-color: #e0e5ef;
    }

    .commission-config-header {
      border-radius: 4px;
      border: 1px solid #e1e1e1;
      background: #e0e5ef;
      padding: 20px 15% 0 20px;
    }

    .commission-config-sec3 {
      height: 229px;
    }
  }

  ::v-deep(
      .ant-table.ant-table-bordered
        > .ant-table-container
        > .ant-table-conten
        > table
        > thead
        > tr
        > th
    ) {
    border-right: 1px solid #e1e1e1 !important;
  }

  ::v-deep(.ant-btn.ant-btn-link.is-disabled) {
    border: 1px solid #e1e1e1 !important;
    background-color: #f7f7f7;
    color: #9e9e9e !important;
  }

  .commission-title {
    display: flex;
    color: #444444;
    font-size: 18px;
    font-weight: 500;
    line-height: 68px;
    height: 68px;
  }

  .form-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .basic-name {
      display: inline-flex;
      align-items: center;
      width: 250px;
      height: 22px;
      margin-left: -40px;
      text-align: left;

      .ant-btn {
        padding: 4px 0;
      }
    }

    .platform-text {
      width: 250px;
      height: 46px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;

      display: flex;
      align-items: center;
    }

    .ant-btn {
      padding: 4px 15px;
    }
  }

  ::v-deep(
      .ant-table.ant-table-bordered
        > .ant-table-container
        > .ant-table-content
        > table
        > thead
        > tr
        > th
    ) {
    box-sizing: border-box;
    border-right: 1px solid #e1e1e1 !important;
    border-bottom: 1px solid #e1e1e1 !important;
  }

  ::v-deep(.ant-form-item-label) {
    text-align: left;
  }

  ::v-deep(.ant-form-item-label > label) {
    font-size: 16px;
  }

  ::v-deep(.t-form-col) {
    & > div {
      width: 46%;
    }

    & > div:nth-child(2n + 1) {
      margin-right: 8%;
    }

    & > div:nth-child(7) {
      margin-right: 500px;
    }
  }

  ::v-deep(.ant-form-item) {
    font-size: 15px;
  }

  ::v-deep(.ant-btn) {
    font-size: 15px;
  }

  ::v-deep(.ant-col) {
    background: #fff;

    & > div {
      & > span {
        z-index: 100;
        top: 13px !important;
        left: 30px !important;
        background-color: #1475e1 !important;
      }
    }
  }

  ::v-deep(.ant-form-item),
  ::v-deep(.ant-form-item-no-colon),
  ::v-deep(.ant-form-item-control-input) {
    height: 46px !important;
  }

  ::v-deep(thead) {
    th {
      height: 64px !important;
    }
  }

  ::v-deep(thead) {
    th {
      height: 64px !important;
    }
  }

  ::v-deep(tbody) {
    .ant-table-cell {
      height: 64px !important;
    }
  }

  ::v-deep(.ant-input-number) {
    height: 42px !important;
    line-height: 42px !important;
  }

  .my-radio {
    label {
      margin-right: 15px;
      border-radius: 5px;
    }
  }

  .my-tabs {
    ::v-deep(.ant-tabs-tab) {
      margin-right: 12px;
      border-radius: 5px !important;
    }

    ::v-deep(.ant-tabs-tab-remove) {
      .anticon-close {
        svg {
          display: none;
        }

        img {
          width: 18px;
          height: 18px;
          position: absolute;
          right: -9px;
          top: 0;
        }
      }
    }
  }

  .commission-header .ant-tabs {
    margin-bottom: 4px;
  }

  .table-add {
    margin: 20px auto 0;

    ::v-deep(.app-iconify) {
      svg {
        font-size: 20px;
      }
    }
  }

  .vis {
    width: 120px;
    height: 40px;
    visibility: hidden;
  }

  ::v-deep(.vben-basic-help) {
    margin: 0 5px 0 0 !important;
  }
</style>

<style lang="less">
  .commission-config {
    .ant-btn,
    .ant-radio-button-wrapper,
    .ant-tabs-tab {
      height: 45px;
      padding: 3px 25px;
    }

    .ant-form {
      > .ant-row {
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
          width: 23px;
          height: 23px;
          font-size: 14px;
        }

        .ant-form-item-label {
          margin-left: 0;
          margin-right: 20%;
        }
      }
    }
  }

  @media only screen and (max-width: 1500px) {
    .Commission .commission-config-header {
      padding-right: 20px !important;
    }
  }
</style>
