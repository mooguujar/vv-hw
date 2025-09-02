<template>
  <div>
    <BasicTable
      @register="registerTable"
      class="!p-0"
      v-show="!showChannelName"
      :scroll="{ y: scrollHeight }"
    >
      <template #form-dateGroup>
        <div class="mr-4">
          <DateButtonGroup
            :isSelect="isSelect"
            :compareRangeTime="unixRang"
            :dateGroupButtonList="dateGroupButtonList"
            @change-button-day="changeButtonDay"
            ref="dateButtonGroup"
          />
        </div>
      </template>
      <template #form-currentType>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption :value="'username'">{{
              $t('table.promotion.promotion_agency_account')
            }}</SelectOption>
            <SelectOption :value="'channel_name'">{{
              $t('table.promotion.promotion_tunnel_name')
            }}</SelectOption>
            <SelectOption :value="'channel_id'">{{
              $t('table.promotion.promotion_tunnel_ID')
            }}</SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #action_name="{ record }">
        <span v-if="record.channel_id">{{ record.channel_name }} </span>
        <span v-else class="primary-color cursor" @click="toChannlByName(record)"
          >{{ record.channel_name }}
        </span>
      </template>
      <template #reg_count="{ record }">
        <span class="primary-color">{{ record.reg_count }} </span>
      </template>
      <template #first_deposit_count="{ record }">
        <span class="primary-color"
          >{{ record.first_deposit_amount }} / {{ record.first_deposit_count
          }}{{ t('component.unit.people') }}
        </span>
      </template>
      <template #first_deposit_count_by_reg="{ record }">
        <span class="primary-color"
          >{{ record.first_deposit_amount_by_reg }} / {{ record.first_deposit_count_by_reg
          }}{{ t('component.unit.people') }}
        </span>
      </template>
      <template #action="{ record }">
        <span class="px-3 primary-color cursor" @click="openView(record)">{{
          $t('common.view')
        }}</span>
      </template>
    </BasicTable>
    <channelByName
      v-if="showChannelName"
      :updatedTempParams="updatedTempParams"
      @back="ishowChannelName"
    />
    <RetainModal @register="addRetainModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, nextTick, onMounted } from 'vue';
  import { BasicTable, useTable } from '@/components/Table';
  import { columns, schemas, dateGroupButtonList } from './index.data';
  import { Select, SelectOption, Input, DatePicker } from 'ant-design-vue';
  import { getChannelReport } from '@/api/promotion';
  import dayjs from 'dayjs';
  import { setDateParmas, toTimezone } from '@/utils/dateUtil';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useRouter } from 'vue-router';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import channelByName from '../channelByName/index.vue';
  import eventBus from '/@/utils/eventBus';
  import { useModal } from '/@/components/Modal';
  import RetainModal from '../../common/components/retainModal.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const props = defineProps({
    search_data: { type: Object },
  });

  const [addRetainModal, { openModal }] = useModal();

  const showChannelName = ref(false);
  const dateButtonGroup = ref();
  const updatedTempParams = ref({});
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(410).value);
  const unixRang = ref<Array<number>>([]);
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const $router = useRouter();
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  let isSelect = ref('week' as any);
  dateGroupButtonList[0].label = t('business.common_week'); //本周
  dateGroupButtonList[1].label = t('business.common_month'); //本月

  const fromSearch = ref('' as string);
  const currentType = ref('username' as string);

  if (props.search_data) {
    for (const key in props.search_data) {
      if (Object.hasOwnProperty.call(props.search_data, key)) {
        currentType.value = key;
        fromSearch.value = props.search_data[key];
      }
    }
  }
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });

  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
  };

  const disabledEndDate = (date) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };

  const tempParams = ref({} as any);

  async function getData(params) {
    tempParams.value = {
      page: params.page,
      page_size: params.page_size,
      username: currentType.value == 'username' ? fromSearch.value : '',
      channel_name: currentType.value == 'channel_name' ? fromSearch.value : '',
      channel_id: currentType.value == 'channel_id' ? fromSearch.value : '',
      start_time: params.start_time,
      end_time: params.end_time,
    };

    // if (props.search_data != undefined) {
    //   tempParams.value = {
    //     page: params.page,
    //     page_size: params.page_size,
    //     username: fromSearch.value ? props.search_data.username : '',
    //     channel_name: params.channel_name,
    //     channel_id: fromSearch.value ? props.search_data.channel_id : '',
    //     start_time: params.start_time,
    //     end_time: params.end_time,
    //   };
    // }

    // 获取渠道统计
    const response = await getChannelReport(tempParams.value);
    return response.d;
  }

  const [registerTable, { clearSelectedRowKeys, getForm, reload }] = useTable({
    api: getData,
    columns: columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    immediate: false,
    beforeFetch: (params) => {
      setDateParmas(params);
      params[currentType.value] = fromSearch.value;
      return params;
    },
    afterFetch: () => {
      clearSelectedRowKeys();
    },
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ start_time: value[0] });
      await getForm().setFieldsValue({ end_time: value[1] });
      reload();
    });
  }

  onMounted(() => {});

  function toChannlByName(record) {
    const date = toTimezone(record.created_at); // '2024-02-21'
    const startTime = dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'); // 转换为 '2024-02-21 00:00:00'
    const endTime = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'); // 转换为 '2024-02-21 23:59:59'
    updatedTempParams.value = {
      ...tempParams.value,
      start_time: startTime,
      end_time: endTime,
    };
    showChannelName.value = true;
  }

  function ishowChannelName() {
    showChannelName.value = false;
  }

  function openView(data) {
    openModal(true, {
      channel_id: data.channel_id,
      time: toTimezone(data.time, 'YYYY-MM-DD'),
    });
  }

  // const checkRange = (startTimestamp, endTimestamp) => {
  //   const startDay = dayjs(startTimestamp);
  //   const endDay = dayjs(endTimestamp);

  //   const isFullWeek =
  //     startDay.startOf('week').isSame(dayjs().startOf('week')) &&
  //     endDay.endOf('week').isSame(dayjs().endOf('week'));

  //   const isFullMonth =
  //     startDay.startOf('month').isSame(dayjs().startOf('month')) &&
  //     endDay.endOf('month').isSame(dayjs().endOf('month'));
  //   if (!isFullWeek && isFullMonth) {
  //     isSelect.value = 'month';
  //   } else if (isFullWeek && isFullMonth) {
  //     isSelect.value = 'week';
  //   } else if (!isFullWeek && !isFullMonth) {
  //     isSelect.value = '';
  //   }
  // };
</script>
