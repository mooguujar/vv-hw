import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { useTimezoneStore } from '@/store/modules/timezone';
import { setClassWidthNew } from '/@/views/common/component';
import { h } from 'vue';
const { t } = useI18n();
const timezoneStore = useTimezoneStore();
export const columns: BasicColumn[] = [
  {
    title: t('common.cp2'), // 彩票名称
    dataIndex: 'lottery_name',
  },
  {
    title: t('table.report.report_bet_count'),
    dataIndex: 'bet_num',
    sorter: true,
  },
  {
    title: t('table.report.report_member_count'),
    dataIndex: 'valid_bet_cnt',
    sorter: true,
    customRender: ({ record }) => {
      if (record.valid_bet_cnt) {
        return record.valid_bet_cnt + t('component.unit.people');
      } else {
        return '-';
      }
    },
  },
  {
    // title: t('table.promotion.promotion_affect_bet'), //有效投注
    dataIndex: 'valid_bet_amount',
    sorter: true,
    moreWidth: 30,
    slots: { title: 'valid_bet_amount' },
  },
  {
    // title: t('table.report.report_platform_amount'), // 平台输赢
    dataIndex: 'net_amount',
    slots: { title: 'net_amount' },
    sorter: true,
    moreWidth: 30,
    customRender: ({ record }) => {
      const net_amount = (record as any).net_amount;
      let color = '';
      if (net_amount >= 0) {
        color = '#D9001B';
      } else {
        color = '#63A103';
      }
      return h(
        'span',
        {
          style: {
            color: color,
          },
        },
        net_amount,
      );
    },
  },
  {
    title: t('table.report.report_profit_rate'), // 平台输赢
    dataIndex: 'profit_rate',
    sorter: true,
    customRender: ({ record }) => {
      const profit_rate = (record as any).profit_rate;
      let color = '';
      if (profit_rate >= 0) {
        color = '#D9001B';
      } else {
        color = '#63A103';
      }
      return h(
        'span',
        {
          style: {
            color: color,
          },
        },
        profit_rate,
      );
    },
  },
  {
    // title: t('common.extract_amount'), // 平台输赢
    dataIndex: 'fee',
    sorter: true,
    moreWidth: 30,
    slots: { title: 'fee' },
  },
];
export const schemasForm: FormSchema[] = [
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'typeid',
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: setClassWidthNew({ vi_VN: 120, default: 70 }),
    component: 'RangePicker',
    defaultValue: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
    componentProps: () => {
      return {
        allowClear: false,
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        getPopupContainer: () => document.body,
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      };
    },
  },
];
