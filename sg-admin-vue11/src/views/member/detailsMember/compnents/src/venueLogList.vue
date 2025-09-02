<template>
  <div class="loginLog">
    <Title :name="$t('table.system.Venue_transfer')" />
    <BasicTable @register="registerTable" class="!p-0">
      <template #form-Loginip>
        <InputGroup compact style="display: flex">
          <Select
            style="width: 38%; border-right: none"
            v-model:value="currentType"
            class="pay-select"
          >
            <!-- <SelectOption :value="1"> 会员账号 </SelectOption> -->
            <SelectOption :value="3"> {{ $t('table.system.system_login_ip') }} </SelectOption>
            <!-- <SelectOption :value="3"> 登录域名 </SelectOption> -->
          </Select>
          <Input
            class="mr-5"
            allowClear
            :placeholder="$t('business.common_search_tip')"
            v-model:value="fromSearch"
          />
        </InputGroup>
      </template>

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
  import { InputGroup, Select, SelectOption, Input } from 'ant-design-vue';
  import { Title } from '../../compnents/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columnVenue, schemasVenue, dateGroupButtonList } from '../../details.data';
  import { getTransferGameList } from '/@/api/member/index';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import dayjs from 'dayjs';
  import eventBus from '/@/utils/eventBus';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';

  const currentType = ref<any>(3);
  const fromSearch = ref<any>();
  const unixRang = ref<Array<number>>([]);
  const isSelect = ref('days' as any);
  const [registerTable, { getForm, reload }] = useTable({
    columns: columnVenue,
    api: getTransferGameList,
    bordered: true,
    useSearchForm: true,
    formConfig: {
      schemas: schemasVenue,
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
      param['search_type'] = currentType.value;
      param['uid'] = history.state.id;
      if (fromSearch.value) {
        param['search_value'] = fromSearch.value;
      }
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
    },
  });
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      // await getForm().setFieldsValue({ start_time: value[0] });
      // await getForm().setFieldsValue({ end_time: value[1] });
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
