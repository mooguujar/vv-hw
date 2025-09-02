import { FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

const { t } = useI18n();
export type Recordable = {
  id: string;
  username: string;
  images: string;
  created_at: string;
};

export const getschemasMonitorFun = (risk_code: string): FormSchema[] => {
  const SchemaLabel: any = {};
  if (risk_code == 'fightMonitor') {
    SchemaLabel.labelA = t('table.risk.report_fight_number') + '≧：'; //对打笔数≧
    SchemaLabel.labelB = t('table.risk.report_fight_amount') + '≧：'; //对打金额≧
  } else if (risk_code == 'high_multiple_prizes') {
    SchemaLabel.fieldA = 'multiple';
    SchemaLabel.fieldB = 'winning';
    SchemaLabel.labelA = t('modalForm.risk.risk_hight_multip') + '≧：'; //高爆倍数≧：
    SchemaLabel.labelB = t('table.risk.report_big_bonus') + '≧：'; //大额中奖≧：
  } else if (risk_code == 'low_multiple_bet') {
    SchemaLabel.fieldA = 'bet_multiple';
    SchemaLabel.fieldB = 'valid_bet_amount';
    SchemaLabel.labelA = t('modalForm.member.member_multiple') + '≤：'; //打码倍数≧：
    SchemaLabel.labelB = t('modalForm.risk.risk_trigger_valid_bet') + '≧：'; //触发有效投注≧：
  } else if (risk_code == 'win_top') {
    SchemaLabel.fieldA = 'profit_rate';
    SchemaLabel.fieldB = 'valid_bet_amount';
    SchemaLabel.labelA = t('modalForm.risk.risk_profit_percent') + '≧：'; //获利占比≧
    SchemaLabel.labelB = t('modalForm.risk.risk_trigger_valid_bet') + '≧：'; //触发有效投注≧
  } else if (risk_code == 'mutual_bet') {
    SchemaLabel.fieldA = 'bet_count';
    SchemaLabel.fieldB = 'bet_amount';
    SchemaLabel.labelA = t('table.risk.report_fight_number') + '≧：'; //对打笔数≧：
    SchemaLabel.labelB = t('table.risk.report_fight_amount') + '≧：'; //对打金额≧：
  } else {
    SchemaLabel.fieldA = 'null';
    SchemaLabel.fieldB = 'null';
    SchemaLabel.labelA = 'null';
    SchemaLabel.labelB = 'null';
  }

  return [
    {
      field: SchemaLabel.fieldA,
      component: 'Input',
      label: SchemaLabel.labelA,
      colProps: { span: 24 },
      componentProps: {},
      dynamicDisabled: true,
      ifShow: ({ values, field }) => {
        if (risk_code == 'win_top') {
          return values[field].length > 1;
        } else if (risk_code != 'win_top' && risk_code != 'linked_records') {
          return values[field].length > 2;
        } else {
          return false;
        }
      },
    },
    {
      field: SchemaLabel.fieldB,
      component: 'Input',
      label: SchemaLabel.labelB,
      colProps: { span: 24 },
      componentProps: {},
      dynamicDisabled: true,
      slot: 'validBet',
      ifShow: ({ values, field }) => {
        return risk_code != 'linked_records' && values[field];
      },
    },
    {
      field: 'login_ip',
      component: 'Input',
      label: t('table.risk.report_login_ip') + '≧：', //登录IP≧：
      dynamicDisabled: true,
      colProps: { span: 24 },
      ifShow: ({ values, field }) => risk_code == 'linked_records' && values[field],
    },
    {
      field: 'reg_ip',
      component: 'Input',
      label: t('table.risk.report_register_ip') + '≧：', //注册IP≧：
      dynamicDisabled: true,
      colProps: { span: 24 },
      ifShow: ({ values, field }) => risk_code == 'linked_records' && values[field],
    },
    {
      field: 'login_dev',
      component: 'Input',
      label: t('table.risk.report_login_deviceno') + '≧：', //登录设备号≧：
      colProps: { span: 24 },
      dynamicDisabled: true,
      componentProps: {},
      ifShow: ({ values, field }) => risk_code == 'linked_records' && values[field],
    },
    {
      field: 'reg_dev',
      component: 'Input',
      label: t('table.member.member_device_tip1') + '≧：', //注册设备号≧：
      dynamicDisabled: true,
      colProps: { span: 24 },
      ifShow: ({ values, field }) => risk_code == 'linked_records' && values[field],
    },
  ];
};

export const schemasRisk: FormSchema[] = [
  {
    field: 'remind',
    component: 'RadioGroup',
    label: t('modalForm.risk.risk_warn') + ':', //风控提醒
    defaultValue: 1,
    colProps: { span: 24 },
    componentProps: {
      options: [
        {
          label: t('business.common_on'), //开启
          value: 1,
        },
        {
          label: t('business.common_off'), //关闭
          value: 2,
        },
      ],
    },
  },
  {
    field: 'interval',
    component: 'InputNumber',
    label: t('modalForm.risk.risk_time_interval') + ':',
    colProps: { span: 24 },
    componentProps: ({ formModel }) => {
      return {
        min: 0,
        controls: false,
        addonAfter: 'S',
        placeholder: t('modalForm.risk.risk_time_interval_tip'),
      };
    },
    ifShow: ({ values }) => {
      return values.remind == 1;
    },
  },
];
useAutoLabelWidth(schemasRisk);
