import { BasicColumn, FormSchema } from '/@/components/Table';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();

// 基础配置
export const setingFormLeftData: FormSchema[] = [
  {
    field: 'front_entrance',
    component: 'Select',
    label: t('table.discountActivity.activiy_status'), //活动状态
    defaultValue: 1,
    slot: 'frontEntrance',
    componentProps: {
      options: [],
    },
    serialNumber: '1',
  },
  {
    field: 'bonus_limit',
    component: 'Select',
    label: t('common.system_commission_config_limit'), // 佣金上限
    slot: 'bonusLimit',
    defaultValue: '',
    componentProps: {
      options: [],
    },
    serialNumber: '6',
  },
  {
    field: 'mode',
    component: 'InputNumber',
    label: t('table.system.system_table_header_agent_model'), //代理模式
    defaultValue: 1,
    slot: 'mode',
    serialNumber: '2',
  },
  {
    field: 'bonus_period',
    component: 'Input',
    label: t('table.discountActivity.discount_settlement_cycle'), //结算周期
    slot: 'bonusPeriod',
    rules: [
      {
        validator(_rule, value) {
          if (typeof value === 'undefined') {
            return Promise.reject(t('table.discountActivity.discount_select_start_end_time'));
          }
          if (!value['start_at'] || !value['end_at']) {
            return Promise.reject(t('table.discountActivity.discount_select_start_end_time'));
          }
          if (new Date(value['end_at']) <= new Date(value['start_at'])) {
            return Promise.reject(t('common.time_err'));
          }
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '7',
  },
  {
    field: 'platform',
    component: 'InputNumber',
    label: t('common.mode_configuration'), //模式配置
    defaultValue: 1,
    slot: 'platform',
    serialNumber: '3',
  },
  {
    field: 'rules',
    component: 'Select',
    label: t('common.activity_rules'), //活动规则
    slot: 'rules',
    defaultValue: [],
    componentProps: {
      options: [],
      mode: 'multiple',
      maxTagCount: 5,
      getPopupContainer: (triggerNode) => triggerNode.parentNode,
    },
    serialNumber: '8',
  },
  {
    field: 'bonus_type',
    component: 'CheckboxGroup',
    label: t('table.system.system_issue_way'), //发放方式
    slot: 'bonusType',
    serialNumber: '4',
  },
  {
    field: 'bonus_currency',
    component: 'Input',
    label: t('modalForm.discountActivity.sendCurency'), // 发放币种
    slot: 'bonusCurrency',
    rules: [
      {
        trigger: 'blur',
        validator(_rule, value) {
          if (typeof value === 'undefined') return Promise.reject(t('common.enterEventName'));
          return Promise.resolve();
        },
      },
    ],
    serialNumber: '5',
  },
];
useAutoLabelWidth(setingFormLeftData);
export const columnsCondition: BasicColumn[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '10%',
    ifShow: false,
  },
  {
    title: t('table.system.system_condition'),
    dataIndex: 'condition',
    width: '20%',
  },
  {
    editRow: true,
    slots: { title: 'title_amt' },
    dataIndex: 'amt',
    editComponent: 'InputNumber',
    width: '20%',
    editComponentProps: {
      min: 0,
      max: 999999999999.99,
    },
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
    title: t('table.risk.report_operate_people'),
    dataIndex: 'updated_by',
    width: '16%',
  },
];

useAutoTableLabelWidth(columnsCondition);
export const list = [
  {
    id: '162821722372111080',
    commission_id: '162821338246176188',
    type: 1,
    config_amount: '45.00',
    updated_by: 'migo1223',
    updated_at: 1699087981,
    uid: '',
  },
];
