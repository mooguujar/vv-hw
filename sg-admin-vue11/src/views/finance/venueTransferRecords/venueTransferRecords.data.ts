import { BasicColumn, FormSchema } from '/@/components/Table';
import dayjs from 'dayjs';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { t } from '/@/hooks/web/useI18n';

export const columns: BasicColumn[] = [
  {
    title: t('business.common_order_number'),
    dataIndex: 'memberId',
    width: 140,
  },
  {
    title: t('business.common_agent_account'),
    dataIndex: 'username',
    width: 140,
  },
  {
    title: t('business.common_currency'),
    dataIndex: 'fansNum',
    width: 90,
    sorter: true,
  },
  {
    title: t('common.translate.word78'),
    dataIndex: 'dynamicNum',
    width: 90,
    sorter: true,
  },
  {
    title: t('common.translate.word79'),
    dataIndex: 'videoNum',
    width: 90,
    sorter: true,
  },
  {
    title: t('common.ChangeAmount'),
    dataIndex: 'shortVideoNum',
    width: 110,
    sorter: true,
  },
  {
    title: t('table.finance.finance_before_balance'),
    dataIndex: 'imageNum',
    width: 120,
    sorter: true,
    customRender: () => {},
  },
  {
    title: t('table.finance.finance_after_balance'),
    dataIndex: 'totalPlayNum',
    width: 120,
    sorter: true,
    customRender: () => {},
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    width: 100,
    customRender: ({ record }) => {
      const status = record.state;
      let color = '';
      switch (status) {
        case 0:
          color = 'red';
          break;
        case 1:
          color = 'green';
          break;
        default:
          color = 'blue';
          break;
      }
      return h(Tag, { color: color }, () => record.stateName);
    },
  },
  {
    title: t('business.common_change_time'),
    dataIndex: 'updateTime',
    width: 150,
  },
];

// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'merchant',
    labelPrefix: t('common.translate.word78'),
    labelPrefixWidth: 70,
    defaultValue: '',
    component: 'ApiSelect',
    componentProps: {
      //   api: async () => {
      //     const response = await getAllPaymentPlatform();
      //     return [{ merchantName: '全部', merchant: '' }, ...response];
      //   },
      //   labelField: 'merchantName',
      //   valueField: 'merchant',
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 7 },
  },
  {
    field: 'merchant',
    labelPrefix: t('common.translate.word79'),
    labelPrefixWidth: 70,
    defaultValue: '',
    component: 'ApiSelect',
    componentProps: {
      getPopupContainer: () => document.body,
      //   api: async () => {
      //     const response = await getAllPaymentPlatform();
      //     return [{ merchantName: '全部', merchant: '' }, ...response];
      //   },
      //   labelField: 'merchantName',
      //   valueField: 'merchant',
    },
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 7 },
  },
  {
    field: 'sts',
    labelPrefix: t('business.common_start'),
    component: 'DatePicker',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 12 },
    componentProps: {
      placeholder: t('business.common_start_time'),
    },
    defaultValue: dayjs().startOf('day').toDate(),
    slot: 'startTime',
  },
  {
    field: 'ets',
    labelPrefix: t('business.common_end'),
    component: 'DatePicker',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 12 },
    defaultValue: dayjs().endOf('day').toDate(),
    componentProps: {
      placeholder: t('business.common_end_time'),
    },
    slot: 'endTime',
  },
  {
    field: 'searchBy',
    labelPrefix: '',
    labelPrefixWidth: 10,
    defaultValue: 'memberId',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('common.MemberID'), value: 'memberId' },
        { label: t('business.common_agent_account'), value: 'username' },
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 2, xl: 2, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'searchVal',
    labelPrefix: '',
    component: 'Input',
    colProps: { xxl: 3, xl: 3, lg: 3, md: 3, sm: 6 },
    componentProps: {
      placeholder: t('business.common_search_tip'),
    },
  },
];
