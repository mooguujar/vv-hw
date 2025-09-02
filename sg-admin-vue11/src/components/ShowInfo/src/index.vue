<template>
  <div class="main venuesClassZoom" ref="main">
    <BasicModal
      :showCancelBtn="false"
      v-bind="$attrs"
      :centered="true"
      :minHeight="1"
      :title="$t('table.report.report_betInfo')"
      width="440px"
      @register="registerModal"
      :showOkBtn="false"
      :getContainer="() => $refs.main"
    >
      <div class="info-content">
        <span class="info-title">{{ $t('modalForm.finance.common_income.menber_id') }}:</span>
        <span>{{ info?.['username'] ? info?.['username'] : '-' }}</span>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.report.platform_bill_no_num') }}:</span>
        <!-- <Tooltip>
          <template #title>
            <span> {{ info?.['bill_no'] ? info?.['bill_no'] : '-' }}</span>
          </template>
          <span> {{ info?.['bill_no'] ? info?.['bill_no'] : '-' }}</span>
        </Tooltip> -->
        <span> {{ Number(recordData?.platform_id) === 801 ? '-' : info?.['bill_no'] }}</span>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.report.report_game_code') }}:</span>
        <Tooltip>
          <template #title>
            <span>{{ info?.['round_id'] ? info?.['round_id'] : '-' }}</span>
          </template>
          <span>{{ info?.['round_id'] ? info?.['round_id'] : '-' }}</span>
        </Tooltip>
      </div>
      <div class="info-content" v-if="info?.['game_class'] != '4'">
        <span class="info-title">{{ $t('table.report.report_platform_name') }}:</span>
        <span>{{ info?.['platform_name'] ? info?.['platform_name'] : '-' }}</span>
      </div>
      <div class="info-content" v-if="info?.['gameName']">
        <span class="info-title">{{ $t('table.report.report_game_name') }}:</span>
        <!-- <Tooltip>
          <template #title>
            <span>{{ info?.['gameName'] ? info?.['gameName'] : '-' }}</span>
          </template>
          <span>{{ info?.['gameName'] ? info?.['gameName'] : '-' }}</span>
        </Tooltip> -->
        <span>{{ info?.['gameName'] ? info?.['gameName'] : '-' }}</span>
      </div>
      <div class="info-content" v-else>
        <span class="info-title">{{ $t('table.report.report_game_name') }}:</span>
        <!-- <Tooltip>
          <template #title>
            <span>{{ detail?.['gameName'] ? detail?.['gameName'] : info.game_name || '-' }}</span>
          </template>
          <span>{{ detail?.['gameName'] ? detail?.['gameName'] : info.game_name || '-' }}</span>
        </Tooltip> -->
        <span>{{ detail?.['gameName'] ? detail?.['gameName'] : info.game_name || '-' }}</span>
      </div>
      <div class="info-content !py-0" v-if="detail?.eventName">
        <span class="info-title">{{ $t('table.member.member_match_name') }}:</span>
        <div>
          <div>
            <Tooltip>
              <template #title>
                <div>{{ detail?.competitionName || '-' }} </div>
              </template>
              <div>{{ detail?.competitionName || '-' }} </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip>
              <template #title>
                <div class="!text-12px">{{ detail?.eventName || '-' }} </div>
              </template>
              <div class="!text-12px">{{ detail?.eventName || '-' }} </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div class="info-content !py-0" v-else-if="info?.competitionName">
        <span class="info-title">{{ $t('table.member.member_match_name') }}:</span>
        <div>
          <div>
            <Tooltip>
              <template #title>
                <div>{{ info?.competitionName || '-' }} </div>
              </template>
              <div>{{ info?.competitionName || '-' }} </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip>
              <template #title>
                <div class="!text-12px">{{ info.eventName || '-' }} </div>
              </template>
              <div class="!text-12px">{{ info.eventName || '-' }} </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.report.report_bet_time') }}:</span>
        <span>{{
          info?.['bet_time'] ? toTimezone(info?.['bet_time'], 'YYYY-MM-DD HH:mm:ss', false) : '-'
        }}</span>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.risk.report_settlement_time') }}:</span>
        <span>{{
          info?.settle_time ? toTimezone(info?.settle_time, 'YYYY-MM-DD HH:mm:ss', false) : '-'
        }}</span>
      </div>
      <div v-if="gameDetail?.game === 'crash'" class="info-content">
        <span class="info-title">{{ $t('table.report.report_bet_content') }}:</span>
        <div>
          <!-- <Tooltip>
            <template #title>
              <div>
                {{ info?.detail?.length > 0 ? info?.detail[0].element : info?.element || '-' }}
              </div>
            </template>
            <div>
              {{ info?.detail?.length > 0 ? info?.detail[0].element : info?.element || '-' }}
            </div>
          </Tooltip> -->
          <!-- {{ info?.detail?.length > 0 ? info?.detail[0].element : info?.element || '-' }} -->
          {{ gameDetail.state.crash_point }}X

          <!-- <div class="text-red !text-14px"
            >@{{ info?.detail?.length > 0 ? info?.detail[0].odds : info.odds || '-' }}</div
          > -->
        </div>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.report.report_bet_currency_id') }}:</span>
        <div>
          <template v-if="info?.['g_currency_id'] === info?.['currency_id']">
            <cdIconCurrency
              v-if="info?.['g_currency_id']"
              :icon="setCurrencyName(info?.['g_currency_id'])"
              class="w-20px mr-3px"
            /><span>{{ setCurrencyName(info?.['g_currency_id']) }}</span>
          </template>
          <template v-else>
            <cdIconCurrency
              v-if="info?.['g_currency_id']"
              :icon="setCurrencyName(info?.['g_currency_id'])"
              class="w-20px mr-3px"
            /><span>{{ setCurrencyName(info?.['g_currency_id']) }}</span> /
            <cdIconCurrency
              v-if="info?.['currency_id']"
              :icon="setCurrencyName(info?.['currency_id'])"
              class="w-20px mr-3px"
            /><span>{{ setCurrencyName(info?.['currency_id']) }}</span>
          </template>
        </div>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.report.report_bet_amount') }}:</span>
        <span v-if="info?.['g_currency_id'] === info?.['currency_id']">
          {{ info?.['bet_amount'] ? info?.['bet_amount'] : '-' }}
        </span>
        <span v-else>
          {{
            info?.['bet_amount']
              ? formatCurrencyAmount(info?.['g_bet_amount'], info?.['g_currency_id']) +
                '/' +
                info?.['bet_amount']
              : '-'
          }}
        </span>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.report.report_valid_bet_amount') }}:</span>
        <span v-if="info?.['g_currency_id'] === info?.['currency_id']">
          {{ info?.['valid_bet_amount'] === '0.00' ? '-' : info?.['valid_bet_amount'] }}
        </span>
        <span v-else>
          {{
            info?.['valid_bet_amount']
              ? formatCurrencyAmount(info?.['g_valid_bet_amount'], info?.['g_currency_id']) +
                '/' +
                info?.['valid_bet_amount']
              : '-'
          }}
        </span>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.report.report_platform_amount') }}:</span>
        <span
          v-if="info?.['g_currency_id'] === info?.['currency_id']"
          :class="
            info?.['net_amount'] && info?.['state'] != 0
              ? Number(info?.['net_amount']) > 0
                ? 'text-red'
                : 'text-green'
              : ''
          "
        >
          {{ info?.['net_amount'] && info?.['state'] != 0 ? info?.['net_amount'] : '-' }}
        </span>
        <span
          v-else
          :class="
            info?.['net_amount'] && info?.['state'] != 0
              ? Number(info?.['net_amount']) > 0
                ? 'text-red'
                : 'text-green'
              : ''
          "
        >
          {{
            info?.['net_amount'] && info?.['state'] != 0
              ? formatCurrencyAmount(info?.['g_net_amount'], info?.['g_currency_id']) +
                '/' +
                info?.['net_amount']
              : '-'
          }}
        </span>
      </div>
      <div class="info-content" v-if="detail?.overallScore">
        <span class="info-title">{{ $t('table.report.report_game_result') }}:</span>
        <span style="text-align: right" class="text-red tracking-0.6em mr--0.6em">{{
          detail?.overallScore || '-'
        }}</span>
      </div>
      <div class="info-content" v-else>
        <template v-if="Number(recordData?.platform_id) === 801">
          <span class="info-title">{{ $t('table.report.report_game_result') }}:</span>
          <span
            style="text-align: right"
            class="!text-[#1475E1] cursor text-4"
            @click="gameDetailOpen(1)"
            >{{ $t('business.common_go_check') }}</span
          >
        </template>
        <template v-else>
          <span class="info-title">{{ $t('table.report.report_game_result') }}:</span>
          <span
            v-if="info.state === 1 && Number(info?.net_amount) > 0"
            style="text-align: right"
            class="text-red tracking-0.6em mr--0.6em"
            >{{ $t('table.report.report_game_result_win') }}</span
          >
          <span
            v-else-if="Number(info?.net_amount) < 0"
            style="text-align: right"
            class="text-green tracking-0.6em mr--0.6em"
            >{{ $t('table.report.report_game_result_lose') }}</span
          >
          <span v-else>-</span>
        </template>

        <!-- <span
          style="text-align: right"
          class="!text-[#1475E1] cursor text-4"
          @click="gameDetailOpen"
          >点击查看</span
        > -->
      </div>
      <!-- <div class="flex flex-col items-center my-6 justify-items-center">
        <Button type="primary" @click="() => closeModal()">确定</Button>
      </div> -->
    </BasicModal>
    <GameDetail :hasgameDetail="hasgameDetail" @register="registerGameDetail" />
  </div>
</template>
<script lang="ts">
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { defineComponent, ref, defineExpose, h, onMounted } from 'vue';
  import { toTimezone } from '/@/utils/dateUtil';
  import { createCurrencyMap } from '/@/utils/common';
  import report_evo from '/@/assets/images/report_evo.webp';
  import report_pg from '/@/assets/images/report_pg.webp';
  import report_evoSlot from '/@/assets/images/report_evoSlot.webp';
  import report_im from '/@/assets/images/report_im.webp';
  import { Tooltip, Button } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
  import GameDetail from '/@/components/ShowInfo/src/gameDetail/GameDetailModal.vue';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { currencyAllTreeList } = useTreeListStore();
  const currentList = ref([...currencyAllTreeList] as any);

  function setCurrencyName(id) {
    let name = currentList.value.filter((c) => c.id === id)[0]?.name || '';
    return name;
  }

  function formatCurrencyAmount(amountStr: string, currencyCode: string): string {
    // 将字符串转换为数字
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) return '-';

    // 根据货币代码决定小数位数
    const decimals = ['707', '708'].includes(currencyCode) ? 8 : 4;

    // 将数字格式化为指定小数位数的字符串
    let formattedAmount = amount.toFixed(decimals);

    // 移除末尾多余的0，但保留至少2位小数
    if (!['707', '708'].includes(currencyCode)) {
      formattedAmount = parseFloat(formattedAmount).toFixed(2);
    }

    return formattedAmount;
  }
  const props = {
    hasgameDetail: { type: Boolean, default: false },
  };
  const { t } = useI18n();
  export default defineComponent({
    components: { BasicModal, Tooltip, cdBlockCurrency, Button, GameDetail, cdIconCurrency },
    props,
    emits: ['gameDetailOpen'],
    setup(props) {
      const recordData = ref({});
      const info = ref({} as any);
      const detail = ref(null as any);
      const gameDetail = ref({});
      const platformImg = ref({
        101: report_evo,
        301: report_pg,
        302: report_evoSlot,
        401: report_im,
      } as any);
      const gameCode = [
        'dice',
        'hilo',
        'limbo',
        'blackjack',
        'mines',
        'mine',
        'crash',
        'Crash',
        'plinko',
      ];
      const [registerGameDetail, { openModal: openGameDetail }] = useModal({});

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        recordData.value = data;
        if (Array.isArray(data.detail)) gameDetail.value = data.detail;
        else gameDetail.value = JSON.parse(data.detail);
        setModalProps({ confirmLoading: false });
        detail.value = null;
        info.value = data;
        if (Array.isArray(data.detail) && data.detail.length) detail.value = data.detail[0];
      });
      const gameDetailOpen = (type) => {
        if (type === 1) {
          closeModal();

          openGameDetail(true, gameDetail.value);
        } else if (type === 2) {
          openGameDetail(true, { num: 1 });
        }
      };
      defineExpose({ gameDetailOpen });
      return {
        registerModal,
        info,
        toTimezone,
        createCurrencyMap,
        platformImg,
        detail,
        gameDetail,
        closeModal,
        registerGameDetail,
        openGameDetail,
        gameDetailOpen,
        setCurrencyName,
        formatCurrencyAmount,
        gameCode,
        recordData,
      };
    },
  });
</script>
<style lang="less" scoped>
  .main {
    ::v-deep(.ant-modal-header) {
      border-bottom: 0;
      background-color: #1475e1;

      .vben-basic-title {
        color: white;
        font-size: 28px;
      }
    }

    ::v-deep(.ant-modal-body) {
      .scrollbar__wrap {
        border-radius: 4px;
        background-color: white;
      }
    }

    ::v-deep(.ant-modal-footer) {
      border: 0;
    }

    ::v-deep(.ant-modal-content) {
      // background-image: url('../../../assets/images/infoModalBg.webp');
      background-repeat: no-repeat;
      background-size: contain;
    }

    ::v-deep(.ant-modal-close-x) {
      color: white;
    }
  }

  ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
    padding-top: 10px;
  }

  .info-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 10px;
    padding: 13.5px 0;
    border-top: 1px solid rgb(242 242 242 / 100%);

    & > span:nth-of-type(2) {
      max-width: 300px;
      overflow: hidden;
      color: #444;
      font-family: Montserrat-Bold, 'Montserrat Bold', Montserrat;
      font-size: 14px;
      font-weight: 900;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & > span:nth-of-type(1) {
      color: #444;
    }

    &:nth-of-type(1) {
      border: 0;
    }

    & div {
      max-width: 190px;
      overflow: hidden;
      color: #666;
      font-size: 14px;
      font-weight: 900;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .info-title {
    margin-right: 15px;
  }
</style>
