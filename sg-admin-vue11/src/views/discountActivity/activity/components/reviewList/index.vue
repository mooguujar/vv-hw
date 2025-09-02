<template>
  <div>
    <BasicTable
      @register="registerReview"
      :columns="getcolumns(radioType)"
      :scroll="{ y: scrollHeight }"
    >
      <template #form-reloadTime>
        <Select
          v-model:value="reloadTime"
          :dropdownMatchSelectWidth="false"
          :options="RELOAD_TIME_OPTIONS"
          @change="handleReloadTimeChange"
        />
      </template>
      <template #form-currentType>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 52%" v-model:value="currentType" class="br-none">
            <SelectOption
              :value="'username'"
              :style="{
                minWidth: calculateWidth($t('table.discountActivity.discountActivity_member'))
                  .width,
              }"
            >
              {{ $t('table.discountActivity.discountActivity_member') }}
            </SelectOption>
            <SelectOption :value="'review_name'">
              {{ $t('table.member.member_oprate_people') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 48%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #customTableHeader>
        <div class="mb-10px ml-10px">
          <IconButton :contentList="radioList" v-model:value="radioId" @click:radio="handleList" />
        </div>
      </template>
      <template #headerTop>
        <Row class="!m-t-0">
          <div class="w-full">
            <cdButtonCurrency
              :btn-list="currentList"
              :firstList="[]"
              :showwhitebg="true"
              @change-button-currency="handleCurrency"
              v-model="getCurrencyValue"
            />
          </div>
        </Row>
      </template>
      <template #lucky_number="{ record }">
        <Tooltip>
          <template #title
            ><span class="text-#e5bf81"
              >{{ t('table.discountActivity.discountActivity_note_number') }}:
            </span>
            {{ record.order_id }}</template
          >
          <span class="text-#5895ff">
            {{ record.lucky_number }}
          </span>
        </Tooltip>
      </template>
      <template #contactSlot="{ record }">
        <div class="cursor-pointer primary-color" @click="() => openChargeModal(true, record)">{{
          $t('business.common_detail')
        }}</div>
      </template>
      <template #action="{ record }">
        <template v-if="radioType == 1">
          <Space :size="5" v-if="record.state === 1">
            <span class="cursor-pointer primary-color" @click="handlePass(record, 2)">{{
              $t('modalForm.finance.common_income.auditors_ok')
            }}</span>
            <span class="cursor-pointer" style="color: red" @click="handlePass(record, 3)">{{
              $t('modalForm.finance.common_income.auditors_reject')
            }}</span>
          </Space>
          <div v-else>-</div>
        </template>
        <template v-if="radioType == 2">
          <Space :size="5" v-if="record.state === 1">
            <span class="cursor-pointer primary-color" @click="handlePass(record, 3)">{{
              $t('modalForm.finance.common_income.auditors_ok')
            }}</span>
            <span class="cursor-pointer" style="color: red" @click="handlePass(record, 5)">{{
              $t('modalForm.finance.common_income.auditors_reject')
            }}</span>
          </Space>
          <div v-else>-</div>
        </template>
        <template v-if="radioType == 4 || radioType == 7">
          <Space :size="5" v-if="record.state === 1">
            <span class="cursor-pointer primary-color" @click="handlePass(record, 2)">{{
              $t('modalForm.finance.common_income.auditors_ok')
            }}</span>
            <span class="cursor-pointer" style="color: red" @click="handlePass(record, 4)">{{
              $t('modalForm.finance.common_income.auditors_reject')
            }}</span>
          </Space>
          <div v-else>-</div>
        </template>
        <template v-if="radioType == 8">
          <Space :size="5" v-if="record.state === 4">
            <span class="cursor-pointer primary-color" @click="handlePass(record, 2)">{{
              $t('modalForm.finance.common_income.auditors_ok')
            }}</span>
            <span class="cursor-pointer" style="color: red" @click="handlePass(record, 1)">{{
              $t('modalForm.finance.common_income.auditors_reject')
            }}</span>
          </Space>
          <div v-else>-</div>
        </template>
        <template v-if="radioType == 6">
          <Space :size="5" v-if="record.state == 1">
            <span class="cursor-pointer primary-color" @click="handlePass(record, 2)">{{
              $t('modalForm.finance.common_income.auditors_ok')
            }}</span>
            <span class="cursor-pointer" style="color: red" @click="handlePass(record, 3)">{{
              $t('modalForm.finance.common_income.auditors_reject')
            }}</span>
          </Space>
          <div v-else>-</div>
        </template>
        <template v-if="radioType == 18">
          <Space :size="5" v-if="record.state == 1">
            <span class="cursor-pointer primary-color" @click="handlePass(record, 2)">{{
              $t('modalForm.finance.common_income.auditors_ok')
            }}</span>
            <span class="cursor-pointer" style="color: red" @click="handlePass(record, 3)">{{
              $t('modalForm.finance.common_income.auditors_reject')
            }}</span>
          </Space>
          <div v-else>-</div>
        </template>
        <template v-if="radioType == 16">
          <Space :size="5" v-if="record.bonus_status == 1">
            <span class="cursor-pointer primary-color" @click="handlePass(record, 2)">{{
              $t('modalForm.finance.common_income.auditors_ok')
            }}</span>
            <span class="cursor-pointer" style="color: red" @click="handlePass(record, 3)">{{
              $t('modalForm.finance.common_income.auditors_reject')
            }}</span>
          </Space>
          <div v-else>-</div>
        </template>
      </template>
      <template #time="{ record }">
        <div v-if="radioType == 1 || radioType == 2">
          {{ toTimezone(record.apply_at || record.created_at, 'YYYY-MM-DD HH:mm:ss') }}
        </div>

        <div v-else class="h-6">
          {{ toTimezone(record.apply_at || record.created_at, 'YYYY-MM-DD HH:mm:ss') }}
        </div>
        <Divider :style="{ margin: '2px 0' }" />
        <div class="pt-2px">{{
          toTimezone(record.review_at || record.updated_at, 'YYYY-MM-DD HH:mm:ss')
        }}</div>
      </template>
      <template #appliDetail="{ record }">
        <div v-if="record.detail !== undefined">
          <span
            class="primary-color cursor"
            v-if="JSON.parse(record.detail).bonus.length > 0"
            @click="appliNumDetail(record)"
          >
            {{ JSON.parse(record.detail).bonus.length }}
          </span>
          <span v-else>0</span>
        </div>
      </template>

      <template #accumulatedDeposits="{ record }">
        <a v-if="record.total_deposit" @click="record.isDepositShow = true">{{
          record.total_deposit
        }}</a>
        <span v-else>-</span>

        <Modal
          v-model:visible="record.isDepositShow"
          :title="t('table.promotion.cumulative_deposit_detail')"
          @ok="record.isDepositShow = false"
          :footer="null"
          width="40%"
        >
          <AccumulatedDepositsCell
            :record="record"
            :firstColumns="accumulatedDepositsFirstColumn"
            :secondColumns="accumulatedDepositsSecondColumn"
            :type="'deposit'"
          />
        </Modal>
      </template>

      <template #validOutlay="{ record }">
        <a v-if="record.valid_bet" @click="record.isBetShow = true">{{ record.valid_bet }}</a>
        <span v-else>-</span>

        <Modal
          v-model:visible="record.isBetShow"
          :title="t('table.promotion.valid_bet_detail')"
          @ok="record.isBetShow = false"
          :footer="null"
          width="40%"
        >
          <AccumulatedDepositsCell
            :record="record"
            :firstColumns="validBetFirstColumn"
            :secondColumns="validBetSecondColumn"
            :type="'bet'"
          />
        </Modal>
      </template>
    </BasicTable>
    <AppliNumMadel @register="openAppliData" />
    <ChargeModal @register="registerChargeDetail" />
  </div>
</template>

<script lang="ts" setup>
  import {
    Tooltip,
    Row,
    Space,
    message,
    InputGroup,
    Select,
    SelectOption,
    Input,
    FormItemRest,
    Divider,
    Modal,
  } from 'ant-design-vue';
  import { ref, computed, onDeactivated, onActivated, watchEffect } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    turntColumns,
    agentColumns,
    schemas,
    bonusColumns,
    chargeColumns,
    everyDayColumns,
    Lucky_betSlot,
    inviteFriendsColumns,
    iMemberThs16Columns,
    accumulatedDepositsFirstColumn,
    accumulatedDepositsSecondColumn,
    validBetFirstColumn,
    validBetSecondColumn,
  } from './index.data';

  import {
    getturntableReviewList,
    getPromoReviewList,
    updateAgentReview,
    updateTurntableReview,
    getProfitReviewList,
    updateBonusReview,
    promo_lucky_bet_review,
    lucky_bet_bonus_review,
    getPromoDepositReviewList,
    getPromoAppreciatioBonusList,
    postPromoDepositBonusReview,
    postAppreciatioBonusReview,
    getInviteFriendsList,
    postPromoInviteFriendsBonusReview,
    PostPromoDailyBonusList,
    getPromoDailyBonusReview,
  } from '/@/api/activity/index';

  import { openConfirm } from '/@/utils/confirm';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { toTimezone } from '/@/utils/dateUtil';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { RELOAD_TIME_OPTIONS } from '/@/views/finance/common/const';
  import { useInterval } from '/@/utils/helper/paramsHelper';
  import { useModal } from '/@/components/Modal';
  import AppliNumMadel from './AppliNumMadel.vue';
  import { getRate } from '/@/views/common/common';
  import { useAgentreviewState, useReviewState, useRprofitStateState } from '../../common/setting';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import IconButton from '@/components/Button/src/IconButton.vue';
  import ChargeModal from './chargeModal/ChargeModal.vue';
  import { useNoticeStore } from '/@/store/modules/notice';
  import { useLocale } from '/@/locales/useLocale';
  import { useActiveMainOptions } from '/@/views/common/commonSetting';
  import { calculateWidth } from '/@/utils';
  import AccumulatedDepositsCell from './AccumulatedDepositsCell.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight540 } from '/@/views/common/component';

  const currencyListTranslate = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
  };

  const [openAppliData, { openModal: openAppliDetail }] = useModal();
  const [registerChargeDetail, { openModal: openChargeModal }] = useModal();

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight540).value);
  const noticeStore = useNoticeStore();
  const radioType = ref(1 as any);
  const radioId = ref(1 as any);
  const getCurrencyValue = ref('' as any);
  const { currencyTreeList } = useTreeListStore();
  const fromSearch = ref('' as string);
  const currentType = ref('username' as string);
  const reloadTime = ref<number>(RELOAD_TIME_OPTIONS[0].value);
  const radioList = ref([]);
  const beforeRadioType = ref(null);
  const beforeRadioId = ref(null);
  const { activityMainMap } = useActiveMainOptions();

  const radioItem = computed(() => radioList.value.filter((r: any) => r.id === radioId.value)[0]);

  const currentList = computed(() => [
    { name: t('table.member.member_money_all1'), value: '', lable: 'ALL' },
    ...currencyTreeList.filter((c) => {
      if (radioType.value == 7) {
        return '702'.includes(c.value);
      }
      if (radioItem.value) {
        if (+radioItem.value.ty === 3) {
          return true;
        } else {
          if (radioItem.value.currency_ids) {
            return radioItem.value.currency_ids.includes(c.value);
          }
          return true;
        }
      }
    }),
  ]);
  const { currencyId } = getRate();

  const { reviewStateAar } = useReviewState();

  const { agentreviewStateArr } = useAgentreviewState();

  const { rprofittreviewStateArr } = useRprofitStateState();

  const [registerReview, { reload, getForm }] = useTable({
    api: async (data) => {
      try {
        const response = await (radioType.value == 1
          ? getturntableReviewList(data)
          : radioType.value == 2
          ? getPromoReviewList(data)
          : radioType.value == 6
          ? PostPromoDailyBonusList(data)
          : radioType.value == 7
          ? promo_lucky_bet_review(data)
          : radioType.value == 8
          ? getPromoDepositReviewList(data)
          : radioType.value == 16
          ? getPromoAppreciatioBonusList(data)
          : radioType.value == 18
          ? getInviteFriendsList(data)
          : getProfitReviewList(data));
        if (radioType.value == 1 && !getCurrencyValue.value) {
          response.d = response.d.map((el) => {
            return { ...el, currency_id: response.to_cur };
          });
        }
        return response;
      } catch (error) {
        return [];
      }
    },
    title: ' ',
    useSearchForm: true,
    immediate: true,
    showIndexColumn: false,
    bordered: true,
    formConfig: {
      schemas,
      actionColOptions: {
        class: 't-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    beforeFetch: async (param) => {
      await getActiveList();

      if (getCurrencyValue.value && radioType.value != 6) {
        param['currency_id'] = getCurrencyValue.value;
      }
      if (radioType.value == 6) {
        param['tongue'] = currencyListTranslate[getCurrencyValue.value];
        if (param.state == 3) param.state = 2;
        if (param.state == 4) param.state = 3;
      }
      if (currentType.value) {
        param[currentType.value] = fromSearch.value;
      }
      if (radioType.value == 6 && param.review_name) {
        param['updated_name'] = param.review_name;
        delete param.review_name;
        delete param.currency_id;
      }

      param['id'] = radioType.value == 6 ? '' : radioId.value;
      param['pid'] = radioId.value;
      if ([10001, 10002, 10003].includes(param['id'])) {
        const pidMapping = {
          10001: '1',
          10002: '2',
          10003: '3',
        };
        param['pid'] = pidMapping[param['id']];
        param['id'] = 8;
        param['deposit_type'] = param['pid'];
      }
      if (radioType.value != 6) {
        // radioType.value == 7 ? (param['currency_id'] = '702') : (param['to_cur'] = currencyId);
        param['to_cur'] = currencyId;
      }

      param['state'] = param.state ?? 0;
      delete param.formValue;
      delete param['pid'];
      delete param['id'];
    },
  });
  const { createMessage } = useMessage();
  const { startInterval, stopInterval } = useInterval(reload);

  async function handlePass(record, state) {
    let text;
    if (radioType.value == 1)
      text = state === 3 ? t('business.common_reject') : t('business.common_suceess');
    if (radioType.value == 2)
      text = state === 5 ? t('business.common_reject') : t('business.common_suceess');
    if (radioType.value == 4 || radioType.value == 7)
      text = state === 4 ? t('business.common_reject') : t('business.common_suceess');
    if (radioType.value == 8)
      text = state == 1 ? t('business.common_reject') : t('business.common_suceess');
    if (radioType.value == 6)
      text = state == 3 ? t('business.common_reject') : t('business.common_suceess');
    if (radioType.value == 9)
      text = state == 3 ? t('business.common_reject') : t('business.common_suceess');
    if (radioType.value == 16)
      text = state == 3 ? t('business.common_reject') : t('business.common_suceess');
    if (radioType.value == 18)
      text = state == 18 ? t('business.common_reject') : t('business.common_suceess');
    openConfirm(
      t('common.warning'),
      `${t('table.discountActivity.discountActivity_handle', { len: text.toLowerCase() })}`,
      async () => {
        const { status, data } = await (radioType.value == 1
          ? updateTurntableReview({ id: record.id, state: state })
          : radioType.value == 2
          ? updateAgentReview({ id: record.id, state: state })
          : radioType.value == 7
          ? lucky_bet_bonus_review({ id: record.id, state: state })
          : radioType.value == 6
          ? getPromoDailyBonusReview({ id: record.id, val: state })
          : radioType.value == 8
          ? postPromoDepositBonusReview({ id: record.id, state: state })
          : radioType.value == 16
          ? postAppreciatioBonusReview({ id: record.id, state: state })
          : radioType.value == 18
          ? postPromoInviteFriendsBonusReview({ id: record.id, state: state })
          : updateBonusReview({ id: record.id, state: state }));
        if (status) {
          reload();
          message.success(data);
        }
        reload();
      },
      () => {
        // 取消回调（可选）
      },
    );
  }

  function showAppliNumber(record: any) {
    if (record.detail !== undefined) {
      if (JSON.parse(record.detail).bonus > 1) {
        const html = `<span class="primary-color cursor" @click="${() =>
          appliNumDetail(record)}"></span>`;
        return html;
      } else {
        return JSON.parse(record.detail).bonus.length;
      }
    }
  }
  function appliNumDetail(data?: any) {
    openAppliDetail(true, { ...data, ty: radioType.value });
  }

  function reloadRate(record) {
    createMessage.success(t('table.member.member_balance_sucess'));
  }

  function handleReloadTimeChange(time: number): void {
    if (time !== -1) {
      startInterval(time);
    } else {
      stopInterval();
    }
  }

  function getcolumns(type) {
    if (type == 1) return turntColumns;
    if (type == 2) return agentColumns;
    if (type == 7) return Lucky_betSlot;
    if (type == 6) return everyDayColumns;
    if (type == 8) return chargeColumns;
    if (type == 9) return inviteFriendsColumns;
    if (type == 16) return iMemberThs16Columns;
    if (type == 18) return inviteFriendsColumns;
    return bonusColumns;
  }
  function handleCurrency(e) {
    getCurrencyValue.value = e;
    reload();
  }
  /** 推广活动tab页 */
  async function handleList(value) {
    radioId.value = value['id'];
    radioType.value = value['ty'];
    await getForm().updateSchema({
      field: 'state',
      componentProps: {
        defaultValue: 0,
        options:
          radioType.value == 1 || radioType.value == 8 || radioType.value == 16
            ? reviewStateAar
            : radioType.value == 2
            ? agentreviewStateArr
            : rprofittreviewStateArr,
      },
    });
    getCurrencyValue.value = '';
    reload();
  }

  function dealData() {
    const getReviewCounts = noticeStore?.getReviewCounts || {};

    const resultArray: any = [];

    Object.keys(getReviewCounts).forEach((key) => {
      // 获取对应的活动信息
      const allActivities = Object.values(activityMainMap).flat();

      if (getReviewCounts[key] != 0) {
        // 邀请好友的key是8_18
        if (key === '8_1' || key === '8_2' || key === '8_3' || key === '8_18') {
          if (key === '8_1')
            resultArray.push({
              ty: 8,
              name: t('v.discount.activity.first_deposit_amount'),
              id: 10001,
              group: 1,
            });
          if (key === '8_2')
            resultArray.push({
              ty: 8,
              name: t('v.discount.activity.total_deposit_amount'),
              id: 10002,
              group: 2,
            });
          if (key === '8_3')
            resultArray.push({
              ty: 8,
              name: t('v.discount.activity.Topup_text3'),
              id: 10003,
              group: 3,
            });
          if (key === '8_18')
            resultArray.push({
              ty: 18,
              name: t('v.discount.activity.invite_friends'),
              id: 10018,
              group: 18,
            });
        } else {
          const activeItem = allActivities.find((el) => el.value == key);
          if (activeItem) {
            resultArray.push({
              ty: activeItem.value,
              name: activeItem.label,
              id: activeItem.value,
            });
          }
        }
      }
    });
    return resultArray;
  }

  async function getActiveList() {
    beforeRadioType.value = radioType.value == 1 ? '' : radioType.value;
    beforeRadioId.value = radioId.value == 1 ? '' : radioId.value;
    // const res = await getReviewReviewList({});
    radioList.value = dealData();
    apdateRadioList();
    radioType.value = beforeRadioType.value ? beforeRadioType.value : radioList.value[0]['ty'];
    radioId.value = beforeRadioId.value ? beforeRadioId.value : radioList.value[0]['id'];
    const { getLocale } = useLocale();
    const langName = getLocale.value ? getLocale.value.split('_')[0] : 'zh';
    const langNameCone = `${langName}_name`;
    if (radioList.value.length > 0) {
      radioList.value.forEach((el: any) => {
        el.icon =
          el.ty === 1
            ? 'zp'
            : el.ty === 2
            ? 'vector'
            : el.ty === 4
            ? 'dooler'
            : el.ty == 7
            ? 'lucky_bet'
            : el.ty == 8
            ? 'chargeMoneyIcon'
            : el.ty == 6
            ? 'everyDayReward'
            : null;
        el.aicon =
          el.ty === 1
            ? 'zpIs'
            : el.ty === 2
            ? 'vectorIs'
            : el.ty === 4
            ? 'doolerIs'
            : el.ty == 7
            ? 'lucky_bet_active'
            : el.ty == 8
            ? 'chargeMoneyIconActive'
            : el.ty == 6
            ? 'everyDayRewardActive'
            : null;
        // el.name = el[langNameCone];
      });
    }
  }

  onDeactivated(() => stopInterval());

  onActivated(() => {
    startInterval(reloadTime.value);
  });

  watchEffect(() => {
    apdateRadioList();
  });

  function apdateRadioList() {
    const getReviewCounts = noticeStore?.getReviewCounts || {};
    const nameToKeyMap = { 1: '8_1', 2: '8_2', 3: '8_3' };

    // Update `superscript` based on `getReviewCounts` values
    radioList.value = radioList.value.map((el: any) => {
      if (el.ty in getReviewCounts) {
        el.superscript = getReviewCounts[el.ty];
      }
      const key = el.ty === 8 ? nameToKeyMap[el.group] : null;
      if (key && getReviewCounts[key]) {
        el.superscript = getReviewCounts[key];
      }
      if (el.ty === 18 && getReviewCounts['8_18']) {
        el.superscript = getReviewCounts['8_18'];
      }
      return el;
    });

    // .filter((el: any) => {
    //  const type = el.ty === 8 ? `${el.ty}_${el.group}` : el.ty;
    //  return getReviewCounts[type] > 0;
    //});
  }
</script>
<style lang="less" scoped>
  .vben-basic-table-form-container {
    padding: 0 !important;
  }

  ::v-deep(.reviewList__empty__current__table__padding) {
    padding: 8px 8px 6px !important;
  }

  .detail-table {
    padding: 10px;
  }
  ::v-deep(.vben-basic-table-header__table-title-box) {
    display: none;
  }
  ::v-deep(.header-top) {
    margin: 0 !important;
  }
</style>
