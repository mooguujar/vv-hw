<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable
      :key="showPromotionChannelDetail ? 'promotion' : 'main'"
      :columns="showPromotionChannelDetail ? promotionChannelColumns : columns"
      :formConfig="formConfig"
      @register="registerTable"
      :scroll="{ y: scrollHeight }"
    >
      <template #form-choosenMonthWeek v-if="isHasAuth('90232')">
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
      <template #form-promotionSlot>
        <div class="mr-2">
          <FormItemRest>
            <Select
              :maxTagCount="2"
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
      <template #form-channelSlot>
        <div class="mr-2">
          <FormItemRest>
            <Select
              :maxTagCount="2"
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

      <template #promotionChannel="{ record, column }">
        <Button
          v-if="record && record[column.dataIndex]"
          type="link"
          @click="handlePromotionChannel(record)"
        >
          {{ record[column.dataIndex] }}
        </Button>
        <div v-else>-</div>
      </template>

      <template #form-back>
        <div class="mr-2">
          <Button
            type="primary"
            @click="
              showPromotionChannelDetail = false;
              nextTick(() => {
                getForm().setFieldsValue({ time: saveTime });
              });
            "
            ><img :src="RECT_BACK" width="20" class="mr-1" />{{ t('sys.login.backSignIn') }}
          </Button>
        </div>
      </template>

      <template #form-modelNameSlot>
        <FormItemRest>
          <InputGroup class="!flex">
            <Select :dropdownMatchSelectWidth="false" v-model:value="currentType">
              <SelectOption value="username">
                {{ t('table.member.member_agent_account') }}
              </SelectOption>
              <SelectOption value="group_name">
                {{ t('common.promoter') }}
              </SelectOption>
              <SelectOption value="channel_name">
                {{ t('table.race_price.form_channel_name') }}
              </SelectOption>
              <SelectOption value="channel_id">
                {{ t('table.promotion.promotion_tunnel_ID') }}
              </SelectOption>
            </Select>
            <Input
              class="mr-3"
              allowClear
              :placeholder="t('common.inputText')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </FormItemRest>
      </template>

      <template #form-submitSlot>
        <Button type="primary" @click="getForm().submit()">{{ t('common.queryText') }}</Button>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup name="racePriceRoi">
  import { ref, watch, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { BasicTable, useTable } from '/@/components/Table';
  import {
    columns,
    promotionChannelColumns,
    searchSchema,
    promotionChannelSchema,
  } from './index.data';
  import {
    InputGroup,
    Select,
    Input,
    SelectOption,
    FormItemRest,
    Button,
    ButtonGroup,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { postChannelReport, getChannelLinkSelect } from '/@/api/promotion';
  import { cloneDeep } from 'lodash-es';
  import { isHasAuth } from '/@/utils/authFunction';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import isoWeek from 'dayjs/plugin/isoWeek'; // ISO 周（周一为起点）
  import utc from 'dayjs/plugin/utc'; // 如果你需要处理 UTC 时间
  import timezone from 'dayjs/plugin/timezone';
  import RECT_BACK from '/@/assets/svg/rect_back.svg';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  dayjs.extend(isoWeek);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const { t } = useI18n();
  const dateGroupButtonList = [
    { label: t('table.member.member_week'), value: 'isoWeek' },
    { label: t('table.member.member_month'), value: 'month' },
  ];
  const showPromotionChannelDetail = ref(false);
  const timeNum = ref(0 as number | string);
  const choosenMonthWeek = ref('month');
  const chosenPromotion = ref(['all']);
  const chosenChannel = ref(['all']);
  const fromSearch = ref('' as string);
  const currentType = ref('username' as string);
  const saveTime = ref([]);
  const scrollHeight = Number(useScrollerHeight(340).value);

  interface optionItem {
    label?: string;
    value?: string;
  }

  const chanelSelections = ref<optionItem[]>([]);
  const promotionSelections = ref<optionItem[]>([]);
  const promotionChannelArr = ref([]);
  const totalNum = ref<number>(0);

  const formConfig = computed(() => ({
    schemas: showPromotionChannelDetail.value ? promotionChannelSchema : searchSchema, // 动态 schemas
    actionColOptions: { class: 't-form-col t-form-label-com inquireButtonBox' },
    customClassForm: true,
    showSubmitButton: false,
    showAdvancedButton: false,
    showResetButton: false,
  }));

  const [registerTable, { reload, getForm, setPagination, setColumns }] = useTable({
    api: async (params) => {
      try {
        const { data } = await postChannelReport(params);

        totalNum.value = data?.t || 0;

        const summary = data?.sum?.length
          ? { ...cloneDeep(data.sum[0]), id: 'sumId', currency_id: t('business.common_total') }
          : {};

        if (data?.d?.length) {
          const _data = showPromotionChannelDetail.value
            ? cloneDeep(data.d)
            : cloneDeep([...data.d, summary]);

          return _data;
        }
        return [];
      } catch (error) {
        console.error('加载失败:', error);
        return [];
      }
    },
    pagination: {
      showTotal: () => t('component.table.total', { total: totalNum.value }),
    },
    useSearchForm: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    beforeFetch: (params) => {
      processingParams(params);
    },
  });
  const filterOption = (input: string, option: any) => {
    const label = option?.key?.toString().toLowerCase() || '';
    const searchText = input.toLowerCase();
    return label.includes(searchText);
  };
  const handleMonthWeekChange = (value) => {
    choosenMonthWeek.value = value;
    const [start, end] = getTimeRange(value);
    getForm().setFieldsValue({ time: [dayjs(start), dayjs(end)] });
  };

  function getTimeRange(type) {
    const validTypes = ['isoWeek', 'month'];
    if (!validTypes.includes(type)) return [];

    const now = dayjs();
    return [
      now.startOf(type).format('YYYY-MM-DD HH:mm:ss'),
      now.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ];
  }

  function processingParams(params) {
    if (!chosenChannel.value.length) {
      chosenChannel.value = ['all'];
    }
    if (!chosenPromotion.value.length) {
      chosenPromotion.value = ['all'];
    }
    Object.assign(params, {
      group_ids: chosenPromotion.value.includes('all') ? [] : chosenPromotion.value,
      channel_ids: chosenChannel.value.includes('all') ? [] : chosenChannel.value,
    });

    setDateParmaTime(params);
    setDateParmas(params);

    if (saveTime.value?.length === 2) {
      params.start_time = saveTime.value[0];
      params.end_time = saveTime.value[1];
    }

    if (showPromotionChannelDetail.value && fromSearch.value) {
      params[currentType.value] = fromSearch.value;
    }

    if (!showPromotionChannelDetail.value) {
      delete params[currentType.value];
    }

    if (showPromotionChannelDetail.value) {
      params['detail'] = true;
      params['start_time'] = dayjs.unix(+timeNum.value).format('YYYY-MM-DD 00:00:00');
      params['end_time'] = dayjs.unix(+timeNum.value).format('YYYY-MM-DD 23:59:59');
    } else {
      delete params['detail'];
    }
    return params;
  }

  const onHasTime = (timeArr: []) => {
    if (timeArr?.length) {
      saveTime.value = timeArr;
      reload();
    }
  };

  function handleChannelChange(data: string[], refName: string) {
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
        chanelSelections.value = promotionChannelArr.value
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
        const filtered = promotionChannelArr.value.filter((item: any) =>
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
      promotionChannelArr.value = data;
      promotionSelections.value = data.map((item: any) => ({
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

  const handlePromotionChannel = (record) => {
    const formTime = getForm().getFieldsValue()?.time;
    if (formTime?.length) {
      saveTime.value = formTime;
    }
    timeNum.value = record?.time;
    showPromotionChannelDetail.value = true;
  };

  watch(
    () => saveTime.value,
    (newVal) => {
      if (!newVal || newVal.length !== 2) {
        choosenMonthWeek.value = '';
        return;
      }

      const [start, end] = newVal;
      const now = dayjs();
      const isWeek =
        dayjs(start).isSame(now.startOf('isoWeek'), 'day') &&
        dayjs(end).isSame(now.endOf('day'), 'day');

      const isMonth =
        dayjs(start).isSame(now.startOf('month'), 'day') &&
        dayjs(end).isSame(now.endOf('day'), 'day');

      if (isWeek) {
        choosenMonthWeek.value = 'isoWeek';
      } else if (isMonth) {
        choosenMonthWeek.value = 'month';
      } else {
        choosenMonthWeek.value = '';
      }
    },
    { immediate: false },
  );

  onMounted(() => {
    eventBus.on('hasTime', (timeArr: unknown) => {
      onHasTime(timeArr as []);
    });

    getChanelPromotionOptions();

    handleMonthWeekChange('month');
  });

  onBeforeUnmount(() => {
    eventBus.off('hasTime', (timeArr: unknown) => {
      onHasTime(timeArr as []);
    });
  });
</script>
<style lang="less" scoped>
  :deep(.multiple-select .ant-select-selection-item) {
    height: 30px !important;
    margin: 0 0 4px 4px !important;
    line-height: 30px !important;
  }
</style>

<style lang="less">
  .custom-popover .ant-popover-inner,
  .custom-popover .ant-popover-arrow-content {
    background: rgb(51 51 51 / 85%);
  }

  .custom-popover .ant-popover-inner-content {
    padding: 0;
  }
</style>
