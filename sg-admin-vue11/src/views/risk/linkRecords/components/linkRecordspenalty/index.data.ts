import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import dayjs from 'dayjs';
import { limitTypeOptionsFilter, useLinkRecordTypeList } from '../../../common/const';
import { currencyToRealname } from '/@/views/common/commonSetting';
import { useCurrencyStore } from '/@/store/modules/currency';
import { toTimezone } from '/@/utils/dateUtil';
import { getkeyValues } from '/@/utils/common';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { getCurrency } = useCurrencyStore();
const { linkRecordTypeList } = useLinkRecordTypeList();

export const searchForm: FormSchema[] = [
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'category',
    component: 'Select',
    labelPrefix: t('table.risk.report_link_type'), //关联类型
    colProps: { xxl: 7, xl: 7, lg: 7, md: 7, sm: 7 },
    defaultValue: '',
    componentProps: {
      placeholder: t('common.chooseText'), //请选择
      options: linkRecordTypeList,
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'username',
    component: 'Input',
    slot: 'usernameSlot',
  },
];

import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';

export const columns: BasicColumn[] = [
  {
    title: t('table.risk.report_link_time') + '/' + t('table.risk.report_gruel_time'), // 关联时间/处罚时间 //Frenk说这里的处罚时间就使用更新时间，
    dataIndex: 'created_at',
    customRender: ({ record }) => {
      return h(cdBlockTwoline, {
        line1: record.created_at ? toTimezone(record.created_at) : '-',
        line2: record.updated_at ? toTimezone(record.updated_at) : '-',
      });
    },
  },

  {
    title: t('business.common_member_account'), //会员账号
    dataIndex: 'username',
  },
  {
    title: t('business.common_realiy_name'), //会员姓名
    dataIndex: 'realname',
    customRender: ({ record }: any) => {
      return record.realname[currencyToRealname[getCurrency]]
        ? record.realname[currencyToRealname[getCurrency]]
        : '-';
    },
  },
  {
    title: t('business.common_super_agent'), //上级代理
    dataIndex: 'parent_name',
  },
  {
    title: t('modalForm.finance.common_income.balance'), //账户余额
    dataIndex: 'balance',
    customRender: ({ record }: any) => {
      for (const item in record.balance) {
        if (item == getCurrency) return record.balance[item];
      }
      return '-';
    },
  },
  {
    title: t('table.member.member_commission_state'), //佣金余额
    dataIndex: 'commission',
    customRender: ({ record }: any) => {
      for (const item in record.commission) {
        if (item == getCurrency) return record.commission[item];
      }
      return '-';
    },
  },
  {
    title: t('business.common_member_level'), //会员层级
    dataIndex: 'level_id',
    customRender: ({ record }) => {
      return getkeyValues(record.level_id);
    },
  },
  {
    title: t('business.commin_vip_level'), //VIP等级
    dataIndex: 'vip',
    customRender: ({ record }: any) => {
      return `VIP${record.vip}`;
    },
  },
  {
    title: t('table.finance.finance_total_deposit'), //存款总额
    dataIndex: 'deposit_amount',
    minWidth: 160,
    customRender: ({ record }: any) => {
      return record.deposit_amount ? record.deposit_amount : '-';
    },
  },

  {
    title: t('table.member.member_withdraw_money'), //取款总额
    dataIndex: 'withdraw_amount',
    customRender: ({ record }: any) => {
      return record.withdraw_amount;
    },
  },
  {
    title: t('table.report.report_cash_profit'), //现金利润
    dataIndex: 'cash_profit',
    customRender: ({ record }: any) => {
      return record.cash_profit;
    },
  },

  {
    title: t('table.report.report_gift_amount'), //优惠金额
    dataIndex: 'gift_amount',
    customRender: ({ record }: any) => {
      return record.gift_amount;
    },
  },

  {
    title: t('table.report.report_valid_bet_amount'), //有效投注
    dataIndex: 'valid_bet_amount',
    customRender: ({ record }: any) => {
      return record.valid_bet_amount;
    },
  },
  {
    title: t('table.report.report_reg_time'), //注册时间
    dataIndex: 'reg_time',
    customRender: ({ record }) => {
      return toTimezone(record.reg_time);
    },
  },
  {
    title: t('business.common_status'), //状态
    dataIndex: 'limit_type',
    minWidth: 160,
    customRender: ({ record }) => {
      const limit_type = limitTypeOptionsFilter.find((item) => {
        return item.value == record.limit_type;
      });
      let style = '';
      if (limit_type?.value == 0) style = 'color:#0960bd';
      else if (limit_type?.value == 1) style = 'color:#d44';
      else if (limit_type?.value == 2) style = 'color:#f59a23';
      return h('div', { style }, limit_type?.label || '-');
    },
  },

  {
    title: t('table.risk.report_link_type'), //关联类型
    dataIndex: 'category',
    customRender: ({ record }: any) => {
      if (!record.category) return '-';
      return linkRecordTypeList.find((item) => item.value == record.category)?.label || '-';
    },
  },
  {
    title: t('table.risk.report_link_info'), //关联信息
    dataIndex: 'content',
    minWidth: 200,
    customRender: ({ record }: any) => {
      return record.content || '-';
    },
  },

  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'updated_name',
    customRender: ({ record }) => {
      return record.updated_name || '-';
    },
  },

  {
    title: t('business.common_remark'), //备注
    dataIndex: 'remarks',
    minWidth: 160,
    customRender: ({ record }) => {
      return record.remarks ? record.remarks : '-';
    },
  },
];
useAutoTableLabelWidth(columns);
