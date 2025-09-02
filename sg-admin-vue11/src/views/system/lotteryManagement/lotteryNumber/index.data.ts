import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { toTimezone } from '/@/utils/dateUtil';
import { useTimezoneStore } from '@/store/modules/timezone';
import { h } from 'vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

import { setClounmsWidth, setClassWidthNew } from '/@/views/common/component';
const { t } = useI18n();
const stateRenderCompanyData = [
  {
    label: t('common.All'),
    value: 0,
  },
  {
    label: t('business.progress'),
    value: 1,
  },
  {
    label: t('table.report.report_Settl'), //未结算
    value: 2,
  },
  {
    label: t('business.finsh'),
    value: 3,
  },
  {
    label: t('common.cp20'), //已撤单
    value: 4,
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('common.cp5'), // 期数
    dataIndex: 'issue_id',
  },
  {
    title: t('common.cp9'), // 开奖号码
    dataIndex: 'balls',
    customRender: ({ record }) => {
      const status = (record as any).state;
      let text = record.balls?.split(',');
      let color = '';
      switch (status) {
        case 1:
          color = '#1475e1';
          break;
        case 4:
          color = '#D9001B';
          break;
        case 3:
          color = '#63A103';
          break;
        case 2:
          color = '#7F7F7F';
          break;
      }
      if (record.balls && text.length) {
        const name = text.map((p) => {
          return h(
            'span',
            {
              style: {
                color: color,
                border: '4px solid ' + color,
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                lineHeight: '28px',
                display: 'inline-block',
                marginRight: '15px',
              },
            },
            p,
          );
        });
        return h('div', { class: 'flex  items-center justify-center' }, name);
      } else {
        return h(
          'span',
          {
            style: {
              lineHeight: '38.48px',
              marginRight: '15px',
            },
          },
          '-',
        );
      }
    },
  },
  {
    title: t('common.cp8'), // 开奖时间
    dataIndex: 'settle_time',
    minWidth: 160,
    customRender: ({ record }) => {
      return record.settle_time ? toTimezone(record.settle_time) : '-';
    },
  },
  {
    title: t('business.common_status'), // 状态
    dataIndex: 'state',
    customRender: ({ record }) => {
      const status = (record as any).state;
      let text = '';
      let color = '';
      switch (status) {
        case 1:
          text = stateRenderCompanyData[1].label;
          color = '#1475e1';
          break;
        case 4:
          text = stateRenderCompanyData[4].label;
          color = '#D9001B';
          break;
        case 3:
          text = stateRenderCompanyData[3].label;
          color = '#63A103';
          break;
        case 2:
          text = stateRenderCompanyData[2].label;
          color = '#7F7F7F';
          break;
      }
      return h('span', { style: 'color:' + color }, text);
    },
  },
  {
    slots: { title: 'valid_bet_amount' },
    dataIndex: 'valid_bet_amount',
    moreWidth: 30,
  },
  {
    slots: { title: 'net_amount' },
    dataIndex: 'net_amount',
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
];
useAutoTableLabelWidth(columns);
export const searchForm: FormSchema[] = [
  {
    field: '_reload',
    labelPrefix: t('common.redo'),
    labelPrefixWidth: setClassWidthNew({ vi_VN: 120, default: 40 }),
    component: 'Select',
    colProps: setClassWidthNew({
      vi_VN: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
      default: { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 },
    }),
    slot: 'reloadTime',
  },
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
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: setClassWidthNew({ vi_VN: 80, default: 40 }),
    defaultValue: 0,
    component: 'Select',
    componentProps: {
      options: stateRenderCompanyData,
      dropdownMatchSelectWidth: false,
      getPopupContainer: () => document.body,
      allowClear: false,
    },
    colProps: { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 },
  },
  {
    field: 'search_type',
    labelPrefix: '',
    labelPrefixWidth: 10,
    component: 'Select',
    defaultValue: 'issue_id',
    componentProps: {
      class: 't-form-label-com select-left pay-select',
      allowClear: false,
      getPopupContainer: () => document.body,
      options: [
        { label: t('common.cp15'), value: 'issue_id' },
        { label: t('table.system.operater'), value: 'updated_by' },
      ],
    },
    colProps: { xxl: 2, xl: 2, lg: 2, md: 3, sm: 4 },
  },
  {
    field: 'search_value',
    component: 'Input',
    colProps: { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 },
    componentProps: {
      class: 'select-value-input',
    },
  },
];
