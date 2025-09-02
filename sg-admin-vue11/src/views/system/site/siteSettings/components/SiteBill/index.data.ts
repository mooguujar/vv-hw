import { FormSchema, BasicColumn } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';
import { getFormattedMonthFromTimestamp, toTimezone } from '@/utils/dateUtil';
import { useSiteBillStatus } from '/@/views/system/common/const';
import { h } from 'vue';
import { mul } from '/@/utils/number';
import { Tooltip } from 'ant-design-vue';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { siteBillStatus } = useSiteBillStatus();
const { t } = useI18n();
//佣金审核汇总查询条件
export const searchForm: FormSchema[] = [
  {
    field: 'year',
    slot: 'yearSelect',
    component: 'Input',
    labelPrefix: t('modalForm.system.years'), //年份
    defaultValue: new Date().getFullYear(),
    labelPrefixWidth: 45,
    //colProps: { xl: 5, lg: 5, md: 5, sm: 5 },
  },
  {
    field: 'state',
    slot: 'stateSelect',
    component: 'Input',
    labelPrefix: t('modalForm.system.status'), //状态
    labelPrefixWidth: 45,
    // colProps: { xl: 5, lg: 5, md: 5, sm: 5 },
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_table_header_billing_month'), //账单月份
    dataIndex: 'time',
    minWidth: 140,
    customRender: ({ record }) => {
      return toTimezone(record.time, t('common.TimeFormat1'));
    },
  },
  {
    title: t('common.system_table_header_affiliated_group'), //所属集团
    dataIndex: 'company_name',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.group_name ? record.group_name : '-';
    },
  },
  {
    title: t('common.system_table_header_site_name'), //站点名称
    dataIndex: 'site_name',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.site_name ? record.site_name : '-';
    },
  },
  {
    title: t('table.system.system_table_header_site_code'), //站点代号
    dataIndex: 'prefix',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.prefix ? record.prefix : '-';
    },
  },
  // {
  //   title: t('table.system.system_table_header_site_code'), //站点代号
  //   dataIndex: 'prefix',
  //   width: 140,
  //   customRender: ({ record }) => {
  //     return record.prefix;
  //   },
  // },
  {
    title: t('table.system.system_table_header_active_bet'), //有效投注
    dataIndex: 'valid_bet_amount',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.valid_bet_amount;
    },
  },
  {
    title: t('table.system.system_table_header_win_or_lose_a_game'), //游戏输赢
    dataIndex: 'net_amount',
    minWidth: 140,
    customRender: ({ record }) => {
      let styleColor = '#333333';
      if (record.net_amount > 0) {
        styleColor = '#D9001B';
      }
      if (record.net_amount < 0) {
        styleColor = '#63A103';
      }
      return h('span', { style: { color: styleColor } }, record.net_amount);
    },
  },
  {
    title: t('table.system.system_table_header_profit_ratio'), //盈率
    dataIndex: 'kill_rate',
    minWidth: 140,
    customRender: ({ record }) => {
      let styleColor = '#333333';
      if (record.kill_rate > 0) {
        styleColor = '#D9001B';
      }
      if (record.kill_rate < 0) {
        styleColor = '#63A103';
      }
      return h('span', { style: { color: styleColor } }, mul(record.kill_rate, 100) + '%');
    },
  },
  {
    title: t('common.commen_guaranteed_fee') + '(U)', //平台费用(U)
    dataIndex: 'guaranteed_fee',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.guaranteed_fee ? record.guaranteed_fee : '-';
    },
  },
  {
    title: t('table.system.system_table_header_platform_cost'), //平台费用(U)
    dataIndex: 'base_fee',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.base_fee;
    },
  },
  {
    title: t('table.system.system_table_header_other_expenses'), //其他费用(U)
    dataIndex: 'other_fee',
    minWidth: 140,
    customRender: ({ record }) => {
      const totalOtherFee =
        Number(record.other_fee) +
        Number(record.cdn_overage_fee) +
        Number(record.domain_overage_fee);
      return h(
        Tooltip,
        {
          title: h('div', { style: { whiteSpace: 'normal' } }, [
            h(
              'div',
              { class: 'line' },
              `${t('common.CDNMaintenanFee')}(U):${record.cdn_overage_fee}`,
            ),
            h(
              'div',
              { class: 'line' },
              `${t('common.domainOverageFee')}:${record.domain_overage_fee}`,
            ),
          ]), // Tooltip 的标题包含两行内容
          placement: 'right',
        },
        totalOtherFee,
      );
    },
  },
  // {
  //   title: t('table.system.system_table_header_line_maintenance'), //线路维护费(U)
  //   dataIndex: 'line_maintenance_fee',
  //   width: 140,
  //   customRender: ({ record }) => {
  //     return record.line_maintenance_fee;
  //   },
  // },
  {
    title: t('table.system.system_table_header_settlement_cost'), //交收费用(U)
    dataIndex: 'actual_settlement_fee',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.actual_settlement_fee;
    },
  },
  {
    title: t('table.system.system_table_header_discount_expense'), //折扣费用(U)
    dataIndex: 'discounted_fee',
    minWidth: 140,
    customRender: ({ record }) => {
      return record.discounted_fee;
    },
  },
  {
    title: t('table.system.system_table_header_actual_settlement_fees'), //实际交收费用(U)
    dataIndex: 'actual_settlement_fee',
    minWidth: 140,
    customRender: ({ record }) => {
      let styleColor = '#333333';
      if (record.actual_settlement_fee > 0) {
        styleColor = '#D9001B';
      }
      if (record.actual_settlement_fee < 0) {
        styleColor = '#63A103';
      }
      return h('span', { style: { color: styleColor } }, record.actual_settlement_fee);
    },
  },
  {
    title: t('table.system.system_table_header_status'), //状态 1=待核对(财务) 2=待核对(总财务) 3=待支付 4=完成
    dataIndex: 'state',
    minWidth: 160,
    customRender: ({ record }) => {
      let styleColor = '#333333';
      if (record.state === 1 || record.state === 2) {
        styleColor = '#F59A23';
      }
      if (record.state === 3) {
        styleColor = '#D9001B';
      }
      if (record.state === 4) {
        styleColor = '#63A103';
      }
      if (record.state) {
        return h('span', { style: { color: styleColor } }, siteBillStatus[record.state]);
      } else {
        return h('span', { style: { color: styleColor } }, '-');
      }
    },
  },
];
useAutoTableLabelWidth(columns);
