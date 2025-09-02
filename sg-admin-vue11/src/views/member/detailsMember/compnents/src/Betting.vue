<template>
  <PageWrapper class="Betting">
    <Title :name="$t('table.member.member_bet_count')" />
    <BasicForm @register="registerFrom" class="!p-t-5" @submit="handleSubmit">
      <template #grupList>
        <DateButtonGroup
          :isSelect="isSelect"
          :compareRangeTime="unixRang"
          :dateGroupButtonList="dateGroupButtonList"
          isEndToday
          @change-button-day="changeButtonDay"
        />
      </template>
    </BasicForm>
    <BasicTable
      :columns="columnsTotal"
      :pagination="false"
      :dataSource="totalData"
      :showIndexColumn="false"
      :bordered="true"
      @change="onChange"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    />
    <BasicTable
      v-for="(item, index) in palteFormTotalData"
      :title="item[0].platform_name"
      :key="index"
      :minHeight="150"
      :columns="columnsIm"
      :pagination="false"
      :dataSource="item"
      :showIndexColumn="false"
      :bordered="true"
      class="mt-15px"
    />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { nextTick, ref, onMounted } from 'vue';
  import { Title } from '../../compnents/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { PageWrapper } from '/@/components/Page';
  import { schemasBetForm, columnsTotal, columnsIm, dateGroupButtonList } from '../../details.data';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import eventBus from '/@/utils/eventBus';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { getBetDetailReportList } from '/@/api/report';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(415).value);
  const route = useRoute();
  const unixRang = ref<Array<number>>([]);
  const isSelect = ref('days' as any);
  const totalData = ref([] as any);
  const palteFormTotalData = ref([] as any);
  //const imTotalData = ref([] as any);
  const [registerFrom, { setFieldsValue, validate }] = useForm({
    schemas: schemasBetForm,
    showResetButton: false,
    submitButtonOptions: {
      class: 't-form-label-com-btn',
    },
  });
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      await setFieldsValue({ time: [value[0], value[1]] });
      getTableData();
      // await setFieldsValue({ start_time: value[0] });
      // await setFieldsValue({ end_time: value[1] });
    });
  }
  async function getTableData(sort = {}) {
    const values = await validate();
    if (values?.time?.length > 0) {
      values.start_time = values.time[0] ? setStartformatDate(values.time[0]) : null;
      values.end_time = values.time[1] ? setEndformatDate(values.time[1]) : null;
    }
    delete values.time;

    values['uid'] = history.state.id;
    values['sort_key'] = sort.field ? sort.field : 'bet_count';
    if (sort.order) {
      if (sort.order === 'ascend') values['sort_type'] = 'asc';
      if (sort.order === 'descend') values['sort_type'] = 'desc';
    } else {
      values['sort_key'] = 'bet_count';
      values['sort_type'] = 'desc';
    }
    const data = await getBetDetailReportList(values);
    if (data?.total?.length) {
      totalData.value = data?.total?.filter((item) => item.platform_id !== '0');
    } else {
      totalData.value = [];
    }
    //过滤掉总计的数据
    const filteredData = data?.detail?.filter(
      (subArray) => !subArray.some((item) => item.platform_id === '0'),
    );
    palteFormTotalData.value = filteredData;
    //拿到PG电子的数据
  }
  function handleSubmit() {
    getTableData();
  }
  function removeSearchBtnRight() {
    for (var i = 0; i < document.getElementsByClassName('ant-btn').length; i++) {
      var isSearchBtn = document
        .getElementsByClassName('ant-btn')
        [i].parentNode.classList.contains('ant-form-item-control-input-content');
      if (isSearchBtn) {
        document.getElementsByClassName('ant-btn')[i].parentNode.style.textAlign = 'left';
      }
    }
  }
  onMounted(() => {
    setTimeout(() => {
      handleSubmit();
    }, 200);
    //调整搜寻按钮前面因为text-align:right产生的空位
    removeSearchBtnRight();
  });
  async function onChange(_, __, sorter) {
    getTableData(sorter);
  }
</script>
<style scoped>
  .Betting {
    border-top: none !important;

    /* border: 1px solid #E1E1E1!important; */
    background-color: #fff;
  }

  /deep/.ant-form {
    border: 1px solid #e1e1e1 !important;
    border-top: none !important;
    border-bottom: none !important;
  }

  /deep/.ant-form-item-control-input-content {
    margin-left: 10px !important;
  }

  ::v-deep(.alldateComponents) {
    margin-left: -10px !important;
  }
</style>
