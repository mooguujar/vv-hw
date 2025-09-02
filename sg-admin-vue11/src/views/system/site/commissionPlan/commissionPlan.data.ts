import { FormSchema, BasicColumn } from '/@/components/Table';

import { Tag } from 'ant-design-vue';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('modalForm.system.system_schedule_name'), //方案名称
    dataIndex: 'merchantCode',
    width: 120,
  },
  {
    title: t('modalForm.system.system_users_number'), //使用人数
    dataIndex: 'merchantCode',
    width: 120,
  },
  {
    title: t('table.report.report_valid_bet_amount') + '($)', //有效投注($)
    dataIndex: 'merchantName',
    width: 120,
  },
  {
    title: t('modalForm.system.system_receive_rate'), //佣金比例
    dataIndex: 'wayInfo',
    width: 120,
    slots: { customRender: 'wayInfo' },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'merchantName',
    width: 120,
  },
  {
    title: t('modalForm.system.system_build_data'), //创建日期
    dataIndex: 'merchantName',
    width: 120,
  },
  {
    title: t('modalForm.system.system_build_editor'), //创建人
    dataIndex: 'merchantName',
    width: 120,
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'state',
    width: 100,
    customRender: ({ record }) => {
      const status = (record as any).state;
      let text = '';
      let color = '';
      switch (status) {
        case 0:
          text = t('business.common_deactivate'); //停用
          color = 'red';
          break;
        case 1:
          text = t('business.common_on_activate'); //启用
          color = 'green';
          break;
      }
      return h(Tag, { color: color }, () => text);
    },
  },
];

// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: '_',
    label: '',
    component: 'Input',
    colProps: { xxl: 3, xl: 3, lg: 3, md: 3, sm: 7 },
    slot: 'add',
  },
  {
    field: 'merchant',
    labelPrefix: t('business.common_currency'), //币种
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
    colProps: { xxl: 4, xl: 4, lg: 4, md: 4, sm: 7 },
  },
];
