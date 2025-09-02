/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTimezoneStore } from '/@/store/modules/timezone';
import { timezoneList } from '/@/settings/localeSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';

export const dateUtil = dayjs;

export const formatDate = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') =>
  dayjs(timestamp * 1000).format(format);

export const formatDateTime = (timestamp) => Math.floor(dayjs(timestamp).valueOf() / 1000);

export function formatToDateTime(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).format(format);
}

export function formatToDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).format(format);
}

export function setStartformatDate(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).startOf('day').set('hour', 0).set('minute', 0).set('second', 0).format(format);
}

export function setEndformatDate(date?: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date)
    .startOf('day')
    .set('hour', 23)
    .set('minute', 59)
    .set('second', 59)
    .format(format);
}

export function setStartDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).startOf('day').format(format);
}

export function setEndDate(date?: dayjs.ConfigType, format = DATE_FORMAT): string {
  return dayjs(date).startOf('day').format(format);
}

export function processParamDates(param) {
  if (param.start_time) param.start_time = setStartformatDate(param.start_time);
  delete param.start_time;
  if (param.end_time) param.end_time = setEndformatDate(param.end_time);
  delete param.end_time; // 删除 ets 参数
  return param;
}

export const setDateParmaTime = (values) => {
  const { time } = values;
  if (time && time.length > 0) {
    values.start_time = values.time[0];
    values.end_time = values.time[1];
    delete values.time;
  }
};

export const setDateParmas = (values) => {
  values.start_time = values.start_time ? setStartformatDate(values.start_time) : null;
  values.end_time = values.end_time ? setEndformatDate(values.end_time) : null;
};
// 整年
export const setFullYearParmas = (values, year = 2023) => {
  values.start_time = year + '-01-01 00:00:00';
  values.end_time = year + '-12-31 23:59:59';
};

export const setExportName = (name, values) => {
  return `${name}_${values.start_time}-${values.end_time}`;
};
// 转时间戳
export function getTimestampFromDate(date, type) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return date ? dayjs.tz(date, type) : '';
}
//时间=》时间戳 转换时间戳不用0时区，
export function timeChange(time) {
  const getData = new Date(time);
  const times = getData.getTime();
  return times;
}
// 根据时区转换成字符串格式（这个包含前端的计算以及切换）
export function toTimezone(date, format = 'YYYY-MM-DD HH:mm:ss', type = true) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const timezoneStore = useTimezoneStore();
  const getTiemzone = timezoneStore.getTimezone || dayjs.tz.guess();
  return date ? dayjs.tz(type ? date * 1000 : date, getTiemzone).format(format) : '-';
}

export function toTimezoneUnsecond(date, format = 'MM-DD HH:mm', type = true) {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const timezoneStore = useTimezoneStore();
  const getTimezone = timezoneStore.getTimezone || dayjs.tz.guess();
  if (!date) return '-';
  // 将时间转换为目标时区
  const targetDate = dayjs.tz(type ? date * 1000 : date, getTimezone);
  const now = dayjs.tz(dayjs(), getTimezone); // 当前时间
  // 判断是否是当天
  if (targetDate.isSame(now, 'day')) {
    // 如果是当天，去掉 "MM-DD"
    format = format.replace('MM-DD', '').trim();
  }
  return targetDate.format(format);
}

// 根据utc转换时间格式
export function toUTC(date) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return date ? dayjs.utc(date).format('YYYY-MM-DD HH:mm:ss') : '';
}

export function toUTCtime(date) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return date ? date.utc().valueOf() : '';
}

export function toUTCValue(date) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return date ? Math.floor(dayjs.utc(date).valueOf() / 1000) : '';
}

/**
 * 将时间戳转换为指定时区的时间
 * @param timestamp 时间戳（秒或毫秒），可以是数字或字符串
 * @param targetTimezone 目标时区，例如 'Asia/Shanghai', 'America/New_York'
 * @param format 输出格式，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function timestampToTimezone(
  timestamp: number | string,
  targetTimezone?: string,
  format = 'YYYY-MM-DD HH:mm:ss',
): string {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  if (!timestamp) return '-';

  // 动态获取用户 store 和默认时区
  const userStore = useUserStore();
  const defaultTimezone = targetTimezone || userStore.defaultTimezone || 'Asia/Shanghai';

  if (!defaultTimezone) return '-';

  // 将字符串转换为数字
  const timestampNum = typeof timestamp === 'string' ? Number(timestamp) : timestamp;

  // 判断时间戳是秒还是毫秒
  const timestampInMs = timestampNum.toString().length === 10 ? timestampNum * 1000 : timestampNum;

  // 将时间戳转换为指定时区的时间
  const date = dayjs.tz(timestampInMs, defaultTimezone);
  return date.format(format);
}

const range = (start, end) => {
  const result: any = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

// 禁止选择当前时间之前的日期
export const disabledStartDate = (current) => {
  return current && current < dayjs().subtract(1, 'days').endOf('day');
};

// 禁止选择当时之后的时刻
export const disabledStartDateTime = (current) => {
  if (current) {
    const today = dayjs().date();
    if (today == current.date()) {
      const minute = Number(dayjs().minute());
      const hour = Number(dayjs().hour());
      let finalHour: number, finalMinute: number;
      if (current.hour() > hour) {
        finalMinute = 0;
      } else {
        if (current.minute() >= 58) {
          finalHour = hour + 1;
          finalMinute = 0;
        } else {
          finalHour = hour;
          finalMinute = minute + 5;
        }
      }
      return {
        disabledHours: () => range(0, finalHour),
        disabledMinutes: () => range(0, finalMinute),
      };
    } else if (dayjs() > current) {
      return {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60),
        disabledSeconds: () => range(0, 60),
      };
    }
  } else {
    return {
      disabledHours: () => range(0, 24),
      disabledMinutes: () => range(0, 60),
      disabledSeconds: () => range(0, 60),
    };
  }
};

export function setTime(time) {
  return time ? dayjs(time * 1000).format('YYYY-MM-DD HH:mm:ss') : '-';
}

export function formatTime(timestamp) {
  const { t } = useI18n();

  if (String(timestamp).length === 13) {
    timestamp = timestamp / 1000;
  }
  const currentTimestamp = Date.now() / 1000;

  const diffInMinutes = Math.floor((currentTimestamp - timestamp) / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes + t('common.minutesb');
  } else {
    return setTime(timestamp);
  }
}

export function getFormattedMonthFromTimestamp(timestamp) {
  if (!timestamp) return '-';
  const date = dayjs.unix(timestamp);
  const year = date.year();
  const month = date.month() + 1; // 加1以获得实际月份
  const dateMonth = `${year}年${month}月`;
  return dateMonth;
}

export function convertSecondsToDays(seconds) {
  const secondsInADay = 24 * 60 * 60;
  const days = Math.floor(seconds / secondsInADay);
  return days;
}

export const getChineseDayOfWeek = (dayOfWeekText: any) => {
  const chineseDaysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  const index = new Date().getDay(dayOfWeekText);
  return chineseDaysOfWeek[index];
};

export const getDayOfWeek = (dateString) => {
  const date = dayjs(dateString);
  const dayOfWeek = date.day(); // 获取星期几的索引，0 表示星期日，1 表示星期一，以此类推
  const dayOfWeekText = date.format('dddd'); // 获取星期几的文本表示，如 "Sunday", "Monday" 等
  const chineseDaysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  const vietnameseDaysOfWeek = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const enDaysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const portugueseDaysOfWeek = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
  ];

  const thaiDaysOfWeek = [
    'วันอาทิตย์',
    'วันจันทร์',
    'วันอังคาร',
    'วันพุธ',
    'วันพฤหัสบดี',
    'วันศุกร์',
    'วันเสาร์',
  ];

  const hindiDaysOfWeek = [
    'रविवार',
    'सोमवार',
    'मंगलवार',
    'बुधवार',
    'गुरुवार',
    'शुक्रवार',
    'शनिवार',
  ];

  return {
    index: dayOfWeek,
    text: chineseDaysOfWeek[dayOfWeek],
    entext: enDaysOfWeek[dayOfWeek],
    vitext: vietnameseDaysOfWeek[dayOfWeek],
    pttext: portugueseDaysOfWeek[dayOfWeek],
    thtext: thaiDaysOfWeek[dayOfWeek],
    hitext: hindiDaysOfWeek[dayOfWeek],
  };
};

export const addDays = (dateString, days) => {
  const date = dayjs(dateString).add(days, 'day').format('YYYY-MM-DD');
  return date;
};

export function convertServerDateToTimeZone(
  serverDate: string,
  timeZone: string,
  locale: string,
): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const date = new Date(serverDate);
  if (locale == 'th-TH') locale = 'vi-VN';

  // 使用 DateTimeFormat 将日期格式化
  const formatter = new Intl.DateTimeFormat(locale, options);
  const formattedParts = formatter.formatToParts(date);
  // 通过解析格式化后的部分，手动构建所需的日期时间格式
  const year = formattedParts.find((part) => part.type === 'year')?.value;
  const month = formattedParts.find((part) => part.type === 'month')?.value;
  const day = formattedParts.find((part) => part.type === 'day')?.value;
  const hour = formattedParts.find((part) => part.type === 'hour')?.value;
  const minute = formattedParts.find((part) => part.type === 'minute')?.value;
  const second = formattedParts.find((part) => part.type === 'second')?.value;

  // 确保日期格式保持一致：YYYY/MM/DD HH:MM:SS
  const formattedTime = `${year}/${month}/${day} ${hour}:${minute}:${second}`;
  return formattedTime;
}

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
    // timeRange.value = time;
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
        currentDate.add(we, 'week').endOf('week').add(1, 'day'),
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
  // if (!uninfo) emit('changeButtonDay', time, value);
  return time;
};

export const updateButtonDay = async (value) => {
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
    return onChangeButtonDay(value, parsedServerDate);
  } else {
    await getServerDate();
    // setTimeout(() => {
    serverDate = useTimezoneStore().getServerDateStore;
    const parsedServerDate = convertServerDateToTimeZone(
      serverDate,
      elItem.value,
      elItem.time_type,
    );
    return onChangeButtonDay(value, parsedServerDate);
    // }, 155);
  }
};
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
