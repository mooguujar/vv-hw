import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { getkeyValues } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import type { DropMenu } from '../components/Dropdown';
import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';
import { h } from 'vue';
import dayjs from 'dayjs';
import { currentyOptions } from '/@/settings/commonSetting';

const { t } = useI18n();
const timeTags = [
  // '0:00',
  { label: '1:00', value: '1' },
  { label: '2:00', value: '2' },
  { label: '3:00', value: '3' },
  { label: '4:00', value: '4' },
  { label: '5:00', value: '5' },
  { label: '6:00', value: '6' },
  { label: '7:00', value: '7' },
  { label: '8:00', value: '8' },
  { label: '9:00', value: '9' },
  { label: '10:00', value: '10' },
  { label: '11:00', value: '11' },
  { label: '12:00', value: '12' },
  { label: '13:00', value: '13' },
  { label: '14:00', value: '14' },
  { label: '15:00', value: '15' },
  { label: '16:00', value: '16' },
  { label: '17:00', value: '17' },
  { label: '18:00', value: '18' },
  { label: '19:00', value: '19' },
  { label: '20:00', value: '20' },
  { label: '21:00', value: '21' },
  { label: '22:00', value: '22' },
  { label: '23:00', value: '23' },
];
const currencyNameObj = {
  en_US: 'USDT',
  pt_BR: 'BRL',
  th_TH: 'THB',
  vi_VN: 'KVND',
  zh_CN: 'CNY',
  hi_IN: 'INR',
};
// const timeTagOptions = timeTags.map((t) => ({ value: t, label: t, icon: '' }));
export const columns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 100,
  },
  {
    title: t('table.system.superior_agent'),
    dataIndex: 'parent_name',
    minWidth: 100,
  },
  {
    title: t('business.common_member_level'),
    dataIndex: 'level_id',
    minWidth: 100,
    customRender: ({ record }) => {
      return getkeyValues(record.level_id);
    },
  },
  {
    title: t('business.commin_vip_level'),
    dataIndex: 'vip',
    minWidth: 100,
    customRender: ({ record }) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('modalForm.discountActivity.sendCurency'), //发放币种
    dataIndex: 'currency_id',
    minWidth: 100,
    customRender: ({ record }) =>
      h(cdBlockCurrency, { currencyName: currentyOptions[record.locales] }),
    // customRender: ({ record }) => {
    //   return 'USDT';
    // },
  },
  {
    title: t('modalForm.discountActivity.send_money'), //发放金额
    minWidth: 100,
    dataIndex: 'bouns',
  },
  {
    title: t('modalForm.system.status'),
    minWidth: 60,
    dataIndex: 'state',
    customRender: ({ record }) => {
      const color = record.state === 1 ? '' : 'green';
      return h(
        'div',
        { style: { color: color } },
        record.state === 1
          ? t('modalForm.discountActivity.unGetGift')
          : t('modalForm.discountActivity.getGift'),
      ); //未领取 已领取
    },
  },
  {
    title: t('modalForm.discountActivity.get_time'), //可领时间
    dataIndex: 'created_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return `${toTimezone(record.created_at, 'YYYY-MM-DD')} ${
        record.period.padStart(4, '0').slice(0, -2) + ':' + record.period.padStart(4, '0').slice(-2)
      }:00`;
    },
  },
];
export const schemas = () => {
  return [
    {
      field: 'state',
      component: 'Select',
      labelPrefix: t('modalForm.system.status'),
      labelPrefixWidth: 45,
      colProps: { span: 4 },
      componentProps: {
        getPopupContainer: () => document.body,
        placeholder: t('business.common_all'),
        options: [
          {
            label: t('modalForm.discountActivity.unGetGift'),
            value: 1,
          },
          {
            label: t('modalForm.discountActivity.getGift'),
            value: 2,
          },
        ],
      },
    },
    {
      field: 'time',
      labelPrefix: t('business.time_limite'),
      labelPrefixWidth: 75,
      component: 'RangePicker',
      defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
      //colProps: { class: 'ant-col-auto' },
      componentProps: {
        getPopupContainer: () => document.body,
        allowClear: false,
        format: 'YYYY-MM-DD',
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      },
    },
    {
      field: 'period',
      labelPrefix: t('modalForm.discountActivity.times_period'), //时间段
      labelPrefixWidth: 60,
      component: 'Select',
      colProps: { span: 4 },
      componentProps: {
        getPopupContainer: () => document.body,
        options: [],
        placeholder: t('business.common_all'),
      },
    },
    {
      field: 'searchSelect',
      label: '',
      component: 'Select',
      defaultValue: 'username',
      componentProps: {
        getPopupContainer: () => document.body,
        allowClear: false,
        options: [
          { label: t('business.common_member_account'), value: 'username' },
          { label: t('business.common_super_agent'), value: 'parent_name' },
        ],
      },
    },
    {
      field: 'searchValue',
      label: '',
      component: 'Input',
      colProps: { span: 2 },
    },
    {
      field: 'type',
      component: 'Input',
      label: '',
      slot: 'currentType',
    },
  ];
};
export enum LOCALE {
  ZH_CN = 'zh_CN', // 中文
  PT_BR = 'pt_BR', // 葡萄牙语
  EN_US = 'en_US', // 英文
  VI_VN = 'vi_VN', // 越南语
  TH_TH = 'th_TH',
  HI_IN = 'hi_IN',
}
export function useLocalList() {
  const { t } = useI18n();
  const localeList: DropMenu[] = [
    {
      label: t('common.common_zh_CN'),
      text: t('common.common_zh_CN'),
      country: t('layout.setting.menutimezone.china'),
      event: LOCALE.ZH_CN,
      language: 'zh-CN',
    },
    {
      label: t('common.common_pt_BR'),
      text: t('common.common_pt_BR'),
      event: LOCALE.PT_BR,
      country: t('layout.setting.menutimezone.brazil'),
      language: 'pt',
    },
    {
      label: t('common.common_vi_VN'),
      text: t('common.common_vi_VN'),
      country: t('layout.setting.menutimezone.vietnam'),
      event: LOCALE.VI_VN,
      language: 'vi',
    },
    {
      label: t('common.common_th_TH'),
      text: t('common.common_th_TH'),
      country: t('layout.setting.menutimezone.thailand'),
      event: LOCALE.TH_TH,
      language: 'th',
    },
    {
      label: t('common.common_hi_IN'),
      text: t('common.common_hi_IN'),
      country: t('layout.setting.menutimezone.india'),
      event: LOCALE.HI_IN,
      language: 'hi',
    },
    {
      label: t('common.common_en_US'),
      text: t('common.common_en_US'),
      country: t('layout.setting.menutimezone.europe'),
      event: LOCALE.EN_US,
      language: 'en',
    },
  ];
  return localeList;
}
