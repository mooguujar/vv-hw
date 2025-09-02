import { BasicColumn, FormSchema } from '/@/components/Table';
import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { t } from '/@/hooks/web/useI18n';
// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('common.MemberID'),
    dataIndex: 'memberId',
    width: 150,
  },
  {
    title: t('business.common_agent_account'),
    dataIndex: 'userName',
    width: 100,
  },
  {
    title: t('common.translate.word71'),
    dataIndex: 'recordType',
    width: 120,
  },
  {
    title: t('common.translate.word72'),
    dataIndex: 'amountStr',
    width: 120,
  },
  {
    title: t('common.translate.word73'),
    dataIndex: 'startInfo',
    width: 250,
  },
  {
    title: t('common.translate.word74'),
    dataIndex: 'endInfo',
    width: 250,
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
          // text = '待审核';
          color = 'red';
          break;
        case 1:
          // text = '成功';
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
    title: t('common.translate.word75'),
    dataIndex: 'createTime',
    width: 180,
  },
];

// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'recordType',
    labelPrefix: t('common.translate.word71'),
    labelPrefixWidth: 70,
    defaultValue: '',
    component: 'Select',
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
    componentProps: {
      options: [
        { label: t('business.common_all'), value: '' },
        { label: t('common.BuyVIP'), value: '1' },
        { label: t('common.buyDiamonds'), value: '2' },
      ],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    labelPrefixWidth: 45,
    defaultValue: '',
    component: 'Select',
    componentProps: {
      options: [
        { label: t('business.common_all'), value: '' },
        { label: t('business.common_success'), value: '1' },
        { label: t('business.common_fail'), value: '0' },
      ],
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 2, xl: 2, lg: 4, md: 5, sm: 6 },
  },
  {
    field: 'sts',
    labelPrefix: t('business.common_start'),
    component: 'DatePicker',
    colProps: { xxl: 5, xl: 5, lg: 6, md: 7, sm: 8 },
    componentProps: {
      placeholder: t('business.common_start_time'),
    },
    slot: 'startDate',
  },
  {
    field: 'ets',
    labelPrefix: t('business.common_end'),
    component: 'DatePicker',
    colProps: { xxl: 5, xl: 5, lg: 6, md: 7, sm: 8 },
    componentProps: {
      placeholder: t('business.common_end_time'),
    },
    slot: 'endDate',
  },
  {
    field: 'memberId',
    labelPrefix: t('common.MemberID'),
    labelPrefixWidth: 60,
    component: 'Input',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
    componentProps: {
      placeholder: t('common.translate.word76'),
    },
  },
];
