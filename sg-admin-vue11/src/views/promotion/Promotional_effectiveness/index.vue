<template>
  <PageWrapper>
    <BasicForm @register="registerForm">
      <template #choosenMonthWeek>
        <ButtonGroup v-model:value="choosenMonthWeek" class="mr-2">
          <Button
            v-for="(timeBtn, key) in dateGroupButtonList"
            :key="key"
            :type="choosenMonthWeek === timeBtn.value ? 'primary' : 'default'"
            size="large"
            @click="handleMonthWeekChange(timeBtn.value)"
            >{{ timeBtn.label }}
          </Button>
        </ButtonGroup>
      </template>
      <template #promotionSlot>
        <div class="mr-2">
          <FormItemRest>
            <Select
              :maxTagCount="1"
              mode="multiple"
              class="multiple-select min-w-[150px]"
              v-model:value="chosenPromotion"
              showSearch
              :filter-option="filterOption"
              @change="handleChannelChange($event, 'chosenPromotion')"
            >
              <SelectOption value="all"> {{ t('business.common_all') }}</SelectOption>
              <SelectOption
                v-for="(option, key) in promotionSelections"
                :key="option.label"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </Select>
          </FormItemRest>
        </div>
      </template>
      <template #channelSlot>
        <div class="mr-2">
          <FormItemRest>
            <Select
              :maxTagCount="1"
              mode="multiple"
              class="multiple-select min-w-[150px]"
              v-model:value="chosenChannel"
              showSearch
              :filter-option="filterOption"
              @change="handleChannelChange($event, 'chosenChannel')"
            >
              <SelectOption value="all"> {{ t('business.common_all') }}</SelectOption>
              <SelectOption
                v-for="(option, key) in chanelSelections"
                :key="option.label"
                :value="option.value"
              >
                {{ option.label }}
              </SelectOption>
            </Select>
          </FormItemRest>
        </div>
      </template>
      <template #submitSlot>
        <Button class="ml-1.5" type="primary" @click="init" size="large"
          >{{ t('common.queryText') }}
        </Button>
      </template>
    </BasicForm>
    <div class="details" v-for="index in 3" :class="index">
      <div class="title-text"
        >{{
          [
            t('common.comprehensive_effect'),
            t('common.direct_push_effect'),
            t('common.fission_effect'),
          ][index - 1]
        }}
      </div>
      <Table
        bordered
        :data-source="[dataSource0, dataSource1, dataSource2][index - 1]"
        :columns="columns"
        size="small"
        :pagination="false"
        ref="redBagRainRef"
        :loading="loading"
        :scroll="{ x: 'max-content' }"
      >
        <!-- 自定义表头插槽 -->
        <template #title_first_deposit_amount="{ column, record }">
          <div class="flex items-center justify-center">
            {{ t('table.report.report_first_deposit_amount') }}
            <cdBlockCurrency class="ml-5px" :label="main_cur" />
          </div>
        </template>
        <template #title_valid_bet_amount="{ column, record }">
          <div class="flex items-center justify-center">
            {{ t('table.report.report_valid_bet_amount') }}
            <cdBlockCurrency class="ml-5px" :label="main_cur" />
          </div>
        </template>
        <template #title_net_amount="{ column, record }">
          <div class="flex items-center justify-center">
            {{ t('business.common_member_platform_iswin') }}
            <cdBlockCurrency class="ml-5px" :label="main_cur" />
          </div>
        </template>
        <template #title_gift_amount="{ column, record }">
          <div class="flex items-center justify-center">
            {{ t('table.finance.finance_Discounted_price') }}
            <cdBlockCurrency class="ml-5px" :label="main_cur" />
          </div>
        </template>
        <template #title_deposit_amount="{ column, record }">
          <div class="flex items-center justify-center">
            {{ t('table.report.report_deposit_charge_money') }}
            <cdBlockCurrency class="ml-5px" :label="main_cur" />
          </div>
        </template>
        <template #title_withdraw_amount="{ column, record }">
          <div class="flex items-center justify-center">
            {{ t('table.promotion.promotion_take_amount') }}
            <cdBlockCurrency class="ml-5px" :label="main_cur" />
          </div>
        </template>
        <template #title_updated_name="{ column, record }">
          <div class="flex items-center justify-center">
            {{ t('table.race_price.table_cash_profit') }}
            <cdBlockCurrency class="ml-5px" :label="main_cur" />
          </div>
        </template>
        <!-- 自定义表格内容插槽 -->
        <template #valid_bet_amount="{ column, record }">
          <div
            :class="[
              'flex items-center justify-center',
              +record.net_amount > 0 && 'big-c',
              +record.net_amount < 0 && 'small-c',
            ]"
            @mouseover="handleMouseOver(index - 1)"
            @mouseleave="handleMouseLeave"
          >
            <Tooltip placement="rightTop" v-if="hoveredRow">
              <template #title>
                <div class="promotional-tooltip">
                  <div class="promotional-tooltip-header">
                    <span>{{ t('table.report.report_platform_name') }}</span>
                    <span>{{ t('table.report.report_valid_bet_amount') }}</span>
                  </div>
                  <ul>
                    <li v-for="(val, ind) in Object.keys(gameMapData0)" :key="ind">
                      <div>{{ val }}</div>
                      <div
                        :class="[
                          'whitespace-nowrap',
                          +gameMapData0[val]['net_amount'] > 0 && 'big-c',
                          +gameMapData0[val]['net_amount'] < 0 && 'small-c',
                        ]"
                        >{{ gameMapData0[val]['valid_bet_amount'] }}/{{
                          gameMapData0[val]['member_count']
                        }}{{ t('component.unit.people') }}
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
              <span class="cursor-pointer">{{
                (record.valid_bet_amount || '0') +
                `/${record.valid_bet_count || '0'}${t('component.unit.people')}`
              }}</span>
            </Tooltip>
            <div v-else
              >{{
                (record.valid_bet_amount || '0') +
                `/${record.valid_bet_count || '0'}${t('component.unit.people')}`
              }}
            </div>
          </div>
        </template>
        <template #net_amount="{ column, record }">
          <div
            :class="[
              'flex items-center justify-center',
              +record.net_amount > 0 && 'big-c',
              +record.net_amount < 0 && 'small-c',
            ]"
            @mouseenter="handleMouseOver(index - 1)"
            @mouseleave="handleMouseLeave"
          >
            <Tooltip placement="rightTop" v-if="hoveredRow">
              <template #title>
                <div class="promotional-tooltip">
                  <div class="promotional-tooltip-header">
                    <span>{{ t('table.report.report_platform_name') }}</span>
                    <span>{{ t('table.report.report_valid_bet_amount') }}</span>
                  </div>
                  <ul>
                    <li v-for="(val, ind) in Object.keys(gameMapData0)" :key="ind">
                      <div>{{ val }}</div>
                      <div
                        :class="[
                          'whitespace-nowrap',
                          +gameMapData0[val]['net_amount'] > 0 && 'big-c',
                          +gameMapData0[val]['net_amount'] < 0 && 'small-c',
                        ]"
                      >
                        {{ gameMapData0[val]['net_amount'] }}
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
              <span class="cursor-pointer">{{ record.net_amount || '0' }}</span>
            </Tooltip>
            <div v-else>{{ record.net_amount || '0' }}</div>
          </div>
        </template>
      </Table>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup name="racePriceRoi">
  import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
  import { columns, dateGroupButtonList, searchSchema } from './index.data';
  import {
    Button,
    ButtonGroup,
    FormItemRest,
    Select,
    SelectOption,
    Table,
    Tooltip,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import cdBlockCurrency from '@/components-cd/block/cd-block-currency.vue';
  import {
    getChannelLinkSelect,
    postChannelReportEffect,
    postChannelReportEffectGameMap,
  } from '@/api/promotion';
  import { CURRENCY_KEY } from '@/enums/cacheEnum';
  import { createLocalStorage } from '/@/utils/cache';
  import eventBus from '@/utils/eventBus';
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek';
  import { BasicForm, useForm } from '@/components/Form';
  import { useFormSetting } from '@/hooks/setting/useFormSetting';
  // ISO 周（周一为起点）
  dayjs.extend(isoWeek);

  const { t } = useI18n();
  /** 查询相关字段 */
  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);
  const isSelect = ref('days' as any);
  const effectData = ref([] as any);
  const chosenPromotion = ref(['all']);
  const chosenChannel = ref(['all']);
  const promotionSelections = ref<any>([]);
  const chanelSelections = ref<any>([]);
  const selectionsData = ref([]);
  const dataSource0 = ref([]);
  const dataSource1 = ref([]);
  const dataSource2 = ref([]);
  const loading = ref(false);

  function handleChannelChange(data: any, refName: string) {
    const target = refName === 'chosenChannel' ? chosenChannel : chosenPromotion;
    if (data.length > 1 && data[0] === 'all') {
      const index = data.indexOf('all');
      if (index !== -1) {
        data.splice(index, 1);
        target.value = data;
      }
    } else if (data.length > 1 && data.includes('all')) {
      target.value = ['all'];
    }

    if (refName === 'chosenPromotion') {
      if (chosenPromotion.value.includes('all')) {
        chanelSelections.value = selectionsData.value
          .filter((item: any) => item?.channels?.length)
          .flatMap((item: any) =>
            item?.channels.map((channel) => ({
              label: channel.channel_name,
              value: channel.id,
            })),
          );
      } else if (chosenPromotion.value.length === 0) {
        chanelSelections.value = [];
        chosenChannel.value = [];
      } else {
        const filtered = selectionsData.value.filter((item: any) =>
          chosenPromotion.value.includes(item.id),
        );

        const channels = filtered
          .flatMap((item: any) => item?.channels || [])
          .map((channel) => ({
            label: channel.channel_name,
            value: channel.id,
          }));

        chanelSelections.value = channels;

        // 如果当前所选渠道中有值但不在新列表中，则重置渠道选择
        const validIds = channels.map((c) => c.value);
        if (!chosenChannel.value.every((id) => validIds.includes(id))) {
          chosenChannel.value = ['all'];
        }
      }
    }
  }

  const getChanelPromotionOptions = async () => {
    const { data } = await getChannelLinkSelect({ state: 0 });
    if (data?.length) {
      selectionsData.value = data;
      promotionSelections.value = data?.map((item: any) => ({
        label: item.group_name,
        value: item.id,
      }));

      chanelSelections.value = data
        // 过滤出有channels的项
        .filter((item) => item.channels?.length)
        // 将channels数组扁平化
        .flatMap((item) =>
          item.channels.map((channel) => ({
            label: channel.channel_name,
            value: channel.id,
          })),
        );
    }
  };
  getChanelPromotionOptions();

  const filterOption = (input: string, option: any) => {
    const label = option?.key?.toString().toLowerCase() || '';
    const searchText = input.toLowerCase();
    return label.includes(searchText);
  };

  const FORM_SIZE = useFormSetting().getFormSize;
  const [registerForm, { validate, getFieldsValue, setFieldsValue }] = useForm({
    size: FORM_SIZE as any,
    schemas: searchSchema,
    showResetButton: false,
    showSubmitButton: true,
    showActionButtonGroup: false,
  });

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const params = ref({} as any);
  const init = async () => {
    loading.value = true;
    if (!chosenChannel.value.length) {
      chosenChannel.value = ['all'];
    }
    if (!chosenPromotion.value.length) {
      chosenPromotion.value = ['all'];
    }
    await delay(1000);
    let saveTime = getFieldsValue();
    if (saveTime.time.length) {
      params.value['start_time'] = saveTime.time[0];
      params.value['end_time'] = saveTime.time[1];
    }
    Object.assign(params.value, {
      group_ids: chosenPromotion.value.includes('all') ? [] : chosenPromotion.value,
      channel_ids: chosenChannel.value.includes('all') ? [] : chosenChannel.value,
    });
    const { data } = await postChannelReportEffect(params.value);
    loading.value = false;
    main_cur.value = ls.get(CURRENCY_KEY);
    effectData.value = data;
    dataSource0.value = data.filter((item: any) => item.effect_type === 0);
    await effect_type1();
    await effect_type2();
  };
  init();

  const ls = createLocalStorage();
  const main_cur = ref('' as string);

  function effect_type1() {
    let data = null;
    if (effectData.value.filter((item: any) => item.effect_type === 1).length) {
      data = effectData.value.filter((item: any) => item.effect_type === 1);
    }
    dataSource1.value = data;
  }

  function effect_type2() {
    let data = null;
    if (effectData.value.filter((item: any) => item.effect_type === 2).length) {
      data = effectData.value.filter((item: any) => item.effect_type === 2);
    }
    dataSource2.value = data;
  }

  const saveTime = ref([]);
  const choosenMonthWeek = ref('days');
  const onHasTime = (timeArr: []) => {
    if (timeArr?.length) {
      saveTime.value = timeArr;
    }
  };
  const handleMonthWeekChange = (value) => {
    choosenMonthWeek.value = value;
    const [start, end] = getTimeRange(value);
    nextTick(async () => {
      await setFieldsValue({ time: [dayjs(start), dayjs(end)] });
      await init();
    });
  };

  function getTimeRange(type) {
    const validTypes = ['days', 'yesterday', 'isoWeek', 'month'];
    if (!validTypes.includes(type)) return [];

    if (type === 'yesterday') {
      return [
        dayjs().subtract(1, 'day').format('YYYY-MM-DD 00:00:00'),
        dayjs().subtract(1, 'day').format('YYYY-MM-DD 23:59:59'),
      ];
    }

    if (type === 'isoWeek') {
      const now = dayjs();
      return [
        now.startOf(type).format('YYYY-MM-DD HH:mm:ss'),
        now.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ];
    }
    return [
      dayjs().startOf(type).format('YYYY-MM-DD HH:mm:ss'),
      dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ];
  }

  const hoveredRow = ref(false);
  const gameMapData0 = ref({
    '': {
      member_count: '',
      valid_bet_amount: '',
      channel_id: '',
      net_amount: '',
    },
  });
  const handleMouseOver = async (index) => {
    if (hoveredRow.value) return;
    hoveredRow.value = true;
    params.value['effect_type'] = index;
    const { data } = await postChannelReportEffectGameMap(params.value);
    gameMapData0.value = data;
  };

  const handleMouseLeave = () => {
    hoveredRow.value = false;
    delete params.value?.effect_type;
    gameMapData0.value = {
      '': {
        member_count: '',
        valid_bet_amount: '',
        channel_id: '',
        net_amount: '',
      },
    };
  };

  onMounted(() => {
    eventBus.on('hasTime', (timeArr: unknown) => {
      onHasTime(timeArr as []);
    });

    getChanelPromotionOptions();

    handleMonthWeekChange('days');
  });

  onBeforeUnmount(() => {
    eventBus.off('hasTime', (timeArr: unknown) => {
      onHasTime(timeArr as []);
    });
  });
</script>
<style lang="less" scoped>
  ::v-deep(.vben-basic-table .ant-table-wrapper .ant-table.ant-table-bordered .ant-table-title) {
    height: 62px;
    border-top: 1px solid #e1e1e1 !important;
    border-right: 1px solid #e1e1e1 !important;
    border-left: 1px solid #e1e1e1 !important;
    background: rgb(#f6f7fb);
    color: #444;
  }

  ::v-deep(.vben-basic-table-header__tableTitle > *) {
    box-sizing: border-box;
    margin-bottom: 0;
    padding-left: 20px;
    font-size: 20px !important;
    font-weight: bold;
  }

  :deep(.multiple-select .ant-select-selection-item) {
    height: 30px !important;
    margin: 0 0 4px 4px !important;
    line-height: 30px !important;
  }

  :deep(.ant-form-item-label) {
    width: auto !important;
  }

  .big-c {
    color: #e91134;
  }

  .small-c {
    color: #1cd91c;
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
    border-top: 1px solid #e1e1e1 !important;
    border-right: 1px solid #e1e1e1 !important;
    border-bottom: 1px solid #e1e1e1 !important;
  }

  ::v-deep(
      .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > thead > tr
    ) {
    th:first-child {
      border-left: 1px solid #e1e1e1 !important;
    }
  }

  ::v-deep(
      .ant-table.ant-table-bordered > .ant-table-container > .ant-table-content > table > tbody > tr
    ) {
    td:first-child {
      border-left: 1px solid #e1e1e1 !important;
    }
  }

  .promotional-tooltip {
    min-width: 200px;

    .promotional-tooltip-header {
      display: flex;
      justify-content: center;
      height: 40px;
      border-bottom: 1px solid #eee;
    }

    span {
      display: inline-block;
      width: 50%;
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      line-height: 40px;

      div {
        width: 50%;
        height: 100%;
        text-align: center;
      }

      div:last-child {
        border-left: 1px solid #eee;
      }
    }
  }

  .details {
    margin-bottom: 40px;
  }

  ::v-deep(.ant-spin-spinning) {
    @keyframes l43 {
      0% {
        background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
          calc(3 * 100% / 3) 50%;
      }

      16.67% {
        background-position: calc(0 * 100% / 3) 0, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
          calc(3 * 100% / 3) 50%;
      }

      33.33% {
        background-position: calc(0 * 100% / 3) 100%, calc(1 * 100% / 3) 0, calc(2 * 100% / 3) 50%,
          calc(3 * 100% / 3) 50%;
      }

      50% {
        background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 100%, calc(2 * 100% / 3) 0,
          calc(3 * 100% / 3) 50%;
      }

      66.67% {
        background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 100%,
          calc(3 * 100% / 3) 0;
      }

      83.33% {
        background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
          calc(3 * 100% / 3) 100%;
      }

      100% {
        background-position: calc(0 * 100% / 3) 50%, calc(1 * 100% / 3) 50%, calc(2 * 100% / 3) 50%,
          calc(3 * 100% / 3) 50%;
      }
    }

    .ant-spin-dot {
      transform: rotate(0deg);

      .ant-spin-dot-item {
        display: none !important;
      }
    }

    .ant-spin-dot {
      --_g: no-repeat radial-gradient(farthest-side, #026ee6 90%, #0000);

      width: 75px;
      height: 30px;
      animation: l43 1s infinite linear;
      background: var(--_g), var(--_g), var(--_g), var(--_g);
      background-size: 20% 50%;
      aspect-ratio: 2.5;
    }
  }

  ::v-deep(.vben-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin-bottom: 0;
  }

  .title-text {
    box-sizing: border-box;
    height: 60px;
    padding-left: 20px;
    background-color: #f6f7fb;
    font-size: 20px;
    line-height: 60px;
  }
</style>
