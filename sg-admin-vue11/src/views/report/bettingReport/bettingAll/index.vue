<template>
  <div v-if="isBettingAll">
    <BasicTable @register="registerTable" bordered>
      <template #form-grupButton>
        <DateButtonGroup
          :isSelect="isSelect"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
        />
      </template>
    </BasicTable>

    <BasicTable
      v-for="(item, index) in betInfoTotalList"
      :columns="getDetailColumns(item[0].platform_name)"
      :dataSource="item"
      :showIndexColumn="false"
      :pagination="false"
      :key="index"
      :minHeight="300"
      class="mt-10px"
      bordered
    >
      <template #gameName="{ model, record }">
        <span @click="showbettingReportFun(record)" class="primary-color cursor">
          {{ record.game_name }}
        </span>
      </template>
    </BasicTable>
  </div>

  <div v-if="!isBettingAll">
    <BasicTable @register="registerTablebbb" :columns="getColumnsBasedOnGameType(historyData)">
      <template #form-grupButton>
        <DateButtonGroup
          :isSelect="isSelect"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
        />
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: t('business.common_detail'),
              onClick: informationOpen.bind(null, record),
            },
          ]"
        />
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
      <template #betContent="{ column, record }">
        <div v-if="record.detail.length == 0"> - </div>
        <div v-else-if="record.detail.length == 1">
          <!-- <Tooltip>
            <template #title>
              <span> {{ record.detail[0].element || '-' }}</span>
            </template>
            <div> {{ record.detail[0].element || '-' }}</div>
          </Tooltip> -->
          <span>{{ record.detail[0].element || '-' }}</span>
          <div class="text-red"> @{{ record.detail[0].odds }} </div>
        </div>
        <div v-else-if="record.detail.length >= 2">
          <a @click="lowMultipleInfoFun(record)">{{ $t('table.report.report_duplex_bet') }}</a>
        </div>
      </template>
      <template #currency="record">
        <cdIconCurrency :icon="setCurrencyName(record.value)" class="w-20px mr-3px" /><span>{{
          setCurrencyName(record.value)
        }}</span>
      </template>
      <template #tableTitle>
        <div class="w-100% pt-4 pl-1 pb-1 parentNameGroup" v-if="parentNameList.length > 1">
          <a v-for="(itme, index) in parentNameList" :key="index" @click="clickParentNameFun(index)"
            >{{ itme }}<span> > </span></a
          >
        </div>
      </template>
    </BasicTable>
  </div>
  <ShowInfo ref="gameDetail" :hasgameDetail="true" @register="registerInfor" />
  <MultipleBettingModal @register="registerMultipleBettingModal" />
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import {
    searchSchema,
    dateGroupButtonList,
    getTotalColumns,
    getDetailColumns,
    bettingRecordColumns,
    getColumnsBasedOnGameType,
  } from './index.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { getBetDetailReportList, getBetRecordList } from '/@/api/report/index'; //会员投注详情和投注记录的投注总汇共用一个接口
  import { DatePicker } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useModal } from '/@/components/Modal';
  import { ShowInfo } from '/@/components/ShowInfo/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import MultipleBettingModal from '../bettingSport/components/multipleBettingModal.vue';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';

  const { t } = useI18n();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const model: any = ref<FormModel>({
    start_time: dayjs().startOf('day'),
    end_time: dayjs().endOf('day'),
  });
  const username = ref('' as string);

  const parentNameList = ref([t('common.bettingSummary')] as any);
  const isBettingAll = ref(true as boolean);
  const isSelect = ref('days' as string);
  const betInfoTotalList = ref([]);
  const historyData = ref({});
  const gameDetail = ref(null);

  const { getAllCurrencyList } = useCurrencyStore();

  const [registerTable, { reload, getForm, getColumns }] = useTable({
    api: async (data) => {
      if (!data.username) {
        betInfoTotalList.value = [];
        return [];
      } else {
        try {
          const response = await getBetDetailReportList(data);
          betInfoTotalList.value = response.detail || [];
          return response.total;
        } catch (error) {
          return [];
        }
      }
    },
    columns: getTotalColumns,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    pagination: false,
    immediate: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      showAdvancedButton: false, //是否收起
      //resetFunc: handleExportTableList,
      showResetButton: false, //导出按钮隐藏
    },
    beforeFetch: async (params) => {
      setDateParmaTime(params);
      setDateParmas(params);
      username.value = params.username ? params.username : '';
      return params;
    },
  });

  const [registerInfor, { openModal }] = useModal();

  const [registerTablebbb, { reload: reloadBettingRecord, getForm: getBettingRecordForm }] =
    useTable({
      api: getBetRecordList,
      immediate: false,
      minHeight: 300,
      useSearchForm: true,
      bordered: true,
      showIndexColumn: false,
      formConfig: {
        labelWidth: 120,
        schemas: searchSchema,
        actionColOptions: {
          class: 't-form-col t-form-label-com',
          span: 1,
        },
        submitButtonOptions: {
          text: t('business.common_inquire'),
        },
        showAdvancedButton: false, //是否收起
        // resetFunc: handleExportTableList,
        showResetButton: false, //导出按钮隐藏
      },
      actionColumn: {
        width: 100,
        title: t('business.common_operate'),
        dataIndex: 'action',
        key: 'action',
        slots: { customRender: 'action' },

        // fixed: 'right',
      },
      beforeFetch: async (params) => {
        // if (historyData.value['platform_id'])
        //   params['platform_id'] = historyData.value['platform_id'];
        // if (historyData.value['game_type'])
        //   params['game_type'] = Number(historyData.value['game_type']);
        // if (historyData.value['game_code']) params['game_code'] = historyData.value['game_code'];
        const { platform_id, game_type, game_code, currency_id } = historyData.value;

        if (platform_id) params['platform_id'] = platform_id;
        if (game_type) params['game_type'] = Number(game_type);
        if (game_code) params['game_code'] = game_code;
        if (currency_id) params['currency_id'] = currency_id;

        params['state'] = 1;
        setDateParmaTime(params);
        setDateParmas(params);
        return params;
      },
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

  function changeButtonDay(value, time) {
    if (time) isSelect.value = time;

    nextTick(async () => {
      model.value.start_time = value[0];
      model.value.end_time = value[1];
      if (isBettingAll.value) {
        await getForm().setFieldsValue({ time: [value[0], value[1]] });
        await reload();
      } else {
        await getBettingRecordForm().setFieldsValue({ time: [value[0], value[1]] });
        await reloadBettingRecord();
      }
    });
  }

  async function showbettingReportFun(record) {
    const { validate } = getForm();
    const data = await validate();
    historyData.value = data;
    historyData.value['platform_id'] = record.platform_id;
    historyData.value['game_type'] = record.game_class;
    historyData.value['game_code'] = record.game_code;
    isBettingAll.value = !isBettingAll.value;
    setTimeout(() => {
      const { time } = historyData.value;
      changeButtonDay(time);
    }, 200);
    nextTick(async () => {
      const { username, time } = historyData.value;
      getBettingRecordForm().setFieldsValue({ game_code: record.game_code });
      getBettingRecordForm().setFieldsValue({ platform_id: record.platform_id });
      getBettingRecordForm().setFieldsValue({ username: username });
      // getBettingRecordForm().setFieldsValue({ start_time: time[1] });
      // getBettingRecordForm().setFieldsValue({ end_time: time[2] });
      parentNameList.value.push(record.platform_name, record.game_name);
      // reloadBettingRecord();
    });
  }

  function informationOpen(record: any): void {
    openModal(true, record);
  }

  function clickParentNameFun(record: any): void {
    isBettingAll.value = !isBettingAll.value;
    setTimeout(() => {
      // historyData.value.time[0] = model.value.start_time;
      // historyData.value.time[1] = model.value.end_time;
      const { time } = historyData.value;
      changeButtonDay(historyData.value.time);
      // getBettingRecordForm().setFieldsValue({
      //   time: [model.value.start_time, model.value.end_time],
      // });
      getForm().setFieldsValue({
        currency_id: historyData.value.currency_id,
        username: historyData.value.username,
      });
    }, 200);
    parentNameList.value = [t('common.bettingSummary')];
  }

  // onMounted(async () => {
  //   nextTick(async () => {
  //     if (history.state.length > 0) {
  //       setTimeout(async () => {
  //         await getForm().setFieldsValue({ time: [history.state['0'], history.state['1']] })
  //       }, 500)
  //     }
  //   })
  // })
  // const route = useRoute();

  onMounted(() => {
    // if (route.query.start) {
    //   getForm().setFieldsValue({
    //     time: [
    //       dayjs(dayjs.unix(route.query.start).format('YYYY-MM-DD HH:mm:ss')),
    //       dayjs(dayjs.unix(route.query.end).format('YYYY-MM-DD HH:mm:ss')),
    //     ],
    //   });
    //   reload();
    // }
    if (gameDetail.value && gameDetail.value.gameDetailOpen) {
      gameDetail.value.gameDetailOpen(2); // 调用子组件的方法并传递参数
    }
  });

  const [registerMultipleBettingModal, { openModal: openMultipleBettingModal }] = useModal();

  function lowMultipleInfoFun(record) {
    openMultipleBettingModal(true, record);
  }

  function setCurrencyName(id) {
    let name = getAllCurrencyList.filter((c) => c.id === id)[0].name;
    return name;
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-divider-horizontal) {
    margin: 5px 0;
  }

  .parentNameGroup > a:nth-last-of-type(1) {
    span {
      display: none;
    }
  }
</style>
