import { FormSchema, BasicColumn } from '/@/components/Table';
import { useTreeListStore } from '/@/store/modules/treeList';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import Icon from '/@/components/Icon';
import { h } from 'vue';
import { isHasAuth } from '/@/utils/authFunction';

const { getPayTypeTreeList } = useTreeListStore();

const { t } = useI18n();

// 表格内容
export const bankcolumns: BasicColumn[] = [
  {
    title: t('business.common_sort'),
    dataIndex: 'id',
    width: 80,
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
    ifShow: isHasAuth('20716'),
  },
  {
    title: t('table.finance.finance_Way'),
    dataIndex: 'name',
    minWidth: 120,
  },
  {
    title: t('table.finance.finance_Payment_types'),
    dataIndex: 'type_name',
    minWidth: 120,
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
  {
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
    minWidth: 100,
  },
  // {
  //   title: t('table.finance.finance_Payment_tag'),
  //   dataIndex: 'tag_name',
  //   minWidth: 80,
  //   customRender: ({ record }) => {
  //     return record.tag_id == 1002
  //       ? `${record.tag_name}:${record.tag_value}%`
  //       : record.tag_name || '无';
  //   },
  // },
];

export const usdtcolumns: BasicColumn[] = [
  {
    title: t('business.common_sort'),
    dataIndex: 'id',
    width: 80,
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
    ifShow: isHasAuth('20716'),
  },
  {
    title: t('modalForm.finance.finance_pay_way'),
    dataIndex: 'name',
    minWidth: 120,
  },
  {
    title: t('modalForm.finance.finance_pay_type'),
    dataIndex: 'type_name',
    minWidth: 120,
  },
  {
    title: t('business.common_agreement_type'),
    dataIndex: 'contract_name',
    minWidth: 120,
  },
  {
    title: t('business.common_update_time'),
    dataIndex: 'updated_at',
    minWidth: 160,
    customRender: ({ record }) => {
      return toTimezone(record.updated_at);
    },
  },
  {
    title: t('table.google.report_columns_APP_operator'),
    dataIndex: 'updated_name',
    minWidth: 120,
  },
  {
    title: t('table.finance.finance_Payment_tag'),
    dataIndex: 'tag_name',
    minWidth: 120,
    customRender: ({ record }) => {
      return record.tag_id == 1002 ? `${record.tag_name}:${record.tag_value}%` : record.tag_name;
    },
  },
];

// form内容
export const searchFormSchema: FormSchema[] = [
  {
    field: 'type_id',
    labelPrefix: t('modalForm.finance.finance_pay_type'), //支付类型
    component: 'Select',
    defaultValue: '',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 6 },
    componentProps: ({ formActionType }) => {
      const currencyList = getPayTypeTreeList.map((el) => ({
        label: el.name,
        value: el.id,
      }));
      currencyList.unshift({
        label: t('business.common_all'), //全部
        value: '',
      });
      return {
        dropdownMatchSelectWidth: false,
        placeholder: t('modalForm.finance.finance_pay_type_tip'), //请选择支付类型
        options: currencyList,
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'name',
    labelPrefix: t('modalForm.finance.finance_pay_way'), //支付方式
    component: 'Input',
  },
];
