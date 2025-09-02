import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_gradient'), //梯度
    dataIndex: 'id',
    width: 50,
  },
  {
    title: t('table.report.report_valid_bet_amount') + '≥', //有效投注≥
    dataIndex: 'cashRate',
    editRow: true,
    width: 120,
    editComponent: 'Input',
    editComponentProps: {
      placeholder: t('common.inputText'), //请输入
      'addon-after': '%',
    },
  },
  {
    title: t('table.system.system_rebate_rate'), //返佣比例
    dataIndex: 'cashMax',
    editRow: true,
    width: 120,
    editComponent: 'Input',
    editComponentProps: {
      placeholder: t('common.inputText'), //请输入
    },
  },
];
