<template>
  <RadioGroup v-model:value="selectValue" button-style="solid" class="t-form-label-com">
    <RadioButton
      class="radio-button"
      :value="item.value"
      v-for="item in dateGroupButtonList"
      :key="item.label"
      @click="updateButtonDay(item.value)"
      >{{ item.label }}</RadioButton
    >
  </RadioGroup>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { RadioGroup, RadioButton } from 'ant-design-vue';

  import {
    formatToDateTime,
    setStartformatDate,
    setEndformatDate,
    convertServerDateToTimeZone,
  } from '/@/utils/dateUtil';
  import dayjs from 'dayjs';
  import { useTimezoneStore } from '/@/store/modules/timezone';
  import { timezoneList } from '/@/settings/localeSetting';

  // const selectValue = ref('');
  const selectValue = ref('days');
  const emit = defineEmits(['changeButtonDay', 'update:isCustom']);
  const timeRange = ref<any>([]);
  const count = ref(0);
  const props = defineProps({
    dateGroupButtonList: {
      type: Array as PropType<
        {
          label: string;
          value: string;
        }[]
      >,
      default: () => [],
    },
    compareRangeTime: {
      type: Array,
      default: () => [],
    },
    isSelect: {
      type: String,
      // default: '',
    },
    isEndToday: {
      type: Boolean,
      default: false,
    },
    isCustom: {
      type: String,
      default: '',
    },
  });
  const isSelect = props.isSelect as string;
  watch(
    () => props.isSelect,
    (newVal) => {
      selectValue.value = newVal;
      // if (newVal === 'week') {
      //   selectValue.value = 'week';
      // } else if (newVal === 'month') {
      //   selectValue.value = 'month';
      // } else {
      //   selectValue.value = '';
      // }
    },
    { immediate: true },
  );
  watch(
    () => props.compareRangeTime,
    (newVal: any) => {
      const startTime = dayjs(timeRange.value[0]).toDate().getTime();
      const endTime = dayjs(timeRange.value[1]).toDate().getTime();
      const outStartTime = newVal[0] ? dayjs(newVal[0]).toDate().getTime() : 0;
      const outEndTime = newVal[1] ? dayjs(newVal[1]).toDate().getTime() : 0;
      count.value++; // 防止初始赋值时出现更新的情况 大于两次才监听更新
      if (
        (outEndTime > endTime ||
          outStartTime < startTime ||
          outStartTime > endTime ||
          outEndTime === 0 ||
          outStartTime === 0) &&
        count.value > 2
      ) {
        selectValue.value = '';
      }
    },
  );

  const onChangeButtonDay = (value, ServerDate?: any, uninfo?: any) => {
    const time: any = [];
    const timetamp = Math.round(new Date() as never);
    const data = new Date(timetamp);
    const weekDay = data.getDay();
    //const we = weekDay === 0 ? week-1:week
    const currentDate = ServerDate ? dayjs(ServerDate) : dayjs();
    //weekday = currentDate.day();
    const we = weekDay === 0 ? 0 - 1 : 0;

    const setDateRange = (start, end, endType) => {
      time[0] = setStartformatDate(start);
      time[1] = endType ? formatToDateTime(end) : setEndformatDate(end);
      timeRange.value = time;
    };

    switch (value) {
      case 'days':
        setDateRange(currentDate.startOf('days'), currentDate, false); // 今日
        break;
      case 'yesterday':
        setDateRange(
          currentDate.subtract(1, 'days'),
          currentDate.subtract(1, 'days').endOf('days'),
          false,
        ); //昨日
        break;
      case 'beforeYesterday':
        setDateRange(
          currentDate.subtract(2, 'days'),
          currentDate.subtract(2, 'days').endOf('days'),
          false,
        ); //前天
        break;
      case 'week':
        setDateRange(
          currentDate.add(we, 'week').startOf('week').add(1, 'day'),
          currentDate,
          // props.isEndToday ? currentDate : currentDate.add(we, 'week').endOf('week').add(1, 'day'),
          false,
        ); //本周
        break;
      case 'lastWeek':
        const lastWeek = currentDate.subtract(1, 'week');
        setDateRange(lastWeek.startOf('week'), lastWeek.endOf('week'), true); //上周
        break;
      case 'month':
        setDateRange(currentDate.startOf('month'), currentDate, false); //本月
        break;
      case 'lastMonth':
        const lastMonthStart = currentDate.subtract(1, 'month').startOf('month'); //上月
        const lastMonthEnd = currentDate.subtract(1, 'month').endOf('month');
        setDateRange(lastMonthStart, lastMonthEnd, true);
        break;
      default:
        break;
    }

    if (!uninfo) emit('changeButtonDay', time, value);
  };
  selectValue.value = 'days';
  //onChangeButtonDay('days');
  if (isSelect === 'detail') {
    selectValue.value = '';
  } else if (isSelect === 'week') {
    selectValue.value = 'week';
    // onChangeButtonDay('week');
  } else if (isSelect === 'month') {
    selectValue.value = 'month';
    // onChangeButtonDay('month');
  } else if (isSelect === 'days') {
    // onChangeButtonDay('days', false, true);
    selectValue.value = 'days';
  } else {
    selectValue.value = '';
  }

  const updateButtonDay = async (value) => {
    emit('update:isCustom', value);
    try {
      const timezoneStore = useTimezoneStore();
      let serverDate: any = timezoneStore.getServerDateStore;
      const getTiemzone = timezoneStore.getTimezone || dayjs.tz.guess();
      const elItem: any = timezoneList?.find((el) => el.value == getTiemzone);

      if (serverDate) {
        const parsedServerDate = convertServerDateToTimeZone(
          serverDate,
          elItem.value,
          elItem.time_type,
        );
        onChangeButtonDay(value, parsedServerDate);
      } else {
        await getServerDate();
        // setTimeout(() => {
        serverDate = timezoneStore.getServerDateStore;
        const parsedServerDate = convertServerDateToTimeZone(
          serverDate,
          elItem.value,
          elItem.time_type,
        );
        onChangeButtonDay(value, parsedServerDate);
        // }, 155);
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  setTimeout(() => {
    updateButtonDay(isSelect);
  }, 88);

  function getServerDate() {
    const { setServerDateStore } = useTimezoneStore();
    const baseUrl = '';
    fetch(baseUrl + `/date?t=${Date.now()}`, { method: 'HEAD' })
      .then(function (res) {
        const serverDate = res.headers.get('date');
        if (!serverDate) {
          console.error('Server did not return the Date header');
          return;
        }
        setServerDateStore(serverDate);
      })
      .catch(function (err) {
        console.error('Failed to fetch server date:', err);
      });
  }
  watch(
    () => props.isCustom,
    (n) => {
      if (n == 'custom') {
        selectValue.value = '';
      }
    },
  );
  defineExpose({
    updateButtonDay,
  });
</script>
