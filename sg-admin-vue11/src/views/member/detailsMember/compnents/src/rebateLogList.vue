<template>
  <div class="loginLog">
    <Title :name="$t('table.member.Rebate_list')" />
    <BasicTable
      @register="registerTable"
      class="!p-0"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-grupList>
        <DateButtonGroup
          :isSelect="isSelect"
          :compareRangeTime="unixRang"
          :dateGroupButtonList="dateGroupButtonList"
          isEndToday
          @change-button-day="changeButtonDay"
        />
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
  import { nextTick, ref, onMounted } from 'vue';
  import { Title } from '../../compnents/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columnRebate, schemasRebate, dateGroupButtonList } from '../../details.data';
  import { getMemberRebateList } from '/@/api/member/index';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import dayjs from 'dayjs';
  import eventBus from '/@/utils/eventBus';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const unixRang = ref<Array<number>>([]);
  const scrollHeight = Number(useScrollerHeight(415).value);
  const isSelect = ref('days' as any);
  const [registerTable, { getForm, reload }] = useTable({
    columns: columnRebate,
    api: getMemberRebateList,
    bordered: true,
    useSearchForm: true,
    formConfig: {
      schemas: schemasRebate,
      showResetButton: false,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        xxl: 4,
        xl: 5,
        lg: 5,
      },
    },
    showIndexColumn: false,
    beforeFetch: (param) => {
      param['uid'] = history.state.id;
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
      return param;
    },
  });
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  function removeSearchBtnRight() {
    for (var i = 0; i < document.getElementsByClassName('ant-btn').length; i++) {
      var isSearchBtn = document
        .getElementsByClassName('ant-btn')
        [i].parentNode.classList.contains('ant-form-item-control-input-content');
      if (isSearchBtn) {
        document.getElementsByClassName('ant-btn')[i].parentNode.style.textAlign = 'left';
        document.getElementsByClassName('ant-btn')[i].parentNode.style.marginLeft = '0px';
      }
    }
  }
  onMounted(() => {
    //调整搜寻按钮前面因为text-align:right产生的空位
    removeSearchBtnRight();
  });
</script>
