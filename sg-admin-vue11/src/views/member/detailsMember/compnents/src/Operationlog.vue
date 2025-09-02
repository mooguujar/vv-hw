<template>
  <div class="Operationlog">
    <Title :name="$t('table.member.member_operate_log')" />
    <BasicTable
      @register="registerTable"
      class="!p-0"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #form-Loginip>
        <InputGroup compact style="display: flex">
          <Select :dropdownMatchSelectWidth="false" v-model:value="currentType" class="pay-select">
            <!-- <SelectOption :value="1"> 会员账号 </SelectOption> -->
            <SelectOption :value="2"> {{ $t('table.system.system_login_ip') }} </SelectOption>
            <SelectOption :value="3"> {{ $t('table.member.member_login_demond') }} </SelectOption>
          </Select>
          <Input
            class="mr-5"
            allowClear
            :placeholder="$t('business.common_search_tip')"
            v-model:value="fromSearch"
          />
        </InputGroup>
      </template>
      <template #form-grupList
        ><DateButtonGroup
          :isSelect="isSelect"
          :compareRangeTime="unixRang"
          :dateGroupButtonList="dateGroupButtonList"
          isEndToday
          @change-button-day="changeButtonDay"
      /></template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue';
  import { Title } from '../../compnents/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { OperaColumns, schemasOperateForm, dateGroupButtonList } from '../../details.data';
  import { getuOperationList } from '/@/api/member/index';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { InputGroup, Select, SelectOption, Input } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import dayjs from 'dayjs';
  import eventBus from '/@/utils/eventBus';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const route = useRoute();
  const scrollHeight = Number(useScrollerHeight(415).value);
  const fromSearch = ref<any>();
  const currentType = ref<any>(2);
  const unixRang = ref<Array<number>>([]);
  const isSelect = ref('days' as any);
  const [registerTable, { getForm, reload }] = useTable({
    api: getuOperationList,
    columns: OperaColumns,
    useSearchForm: true,
    bordered: true,
    formConfig: {
      schemas: schemasOperateForm,
      showResetButton: false,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        xxl: 4,
        xl: 5,
        lg: 5,
      },
    },
    beforeFetch: (params) => {
      params['search_type'] = currentType.value;
      params['username'] = history.state.username;
      if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      if (fromSearch.value) {
        params['search_value'] = fromSearch.value;
      }
    },
    showIndexColumn: false,
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
      // await getForm().setFieldsValue({ start_time: value[0] });
      // await getForm().setFieldsValue({ end_time: value[1] });
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
