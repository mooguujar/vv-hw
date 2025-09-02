import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { Client } from '/@/views/common/commonSetting';
import { getLevelValues } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import setTooltip from '/@/components/abTooltipInnerEslipse';
import { COLORS } from '../../common/const';
import Icon from '/@/components/Icon';
import { SetTooltip } from '/@/views/common/component';
import { isHasAuth } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();

// 表格内容
export const BrlpixColumns: BasicColumn[] = [
  {
    title: t('business.common_sort'),
    dataIndex: 'id',
    width: 80,
    ifShow: isHasAuth('21008'),
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
  },
  {
    title: t('table.member.bank_id'),
    dataIndex: 'bank_id',
  },
  {
    title: t('modalForm.finance.bank_account'),
    dataIndex: 'bank_account',
  },
  {
    title: t('business.common_actual_name'),
    dataIndex: 'open_name',
    customRender: ({ record }) => {
      return record.open_name;
    },
  },
  {
    title: t('table.finance.finance_opening_level'),
    dataIndex: 'level',
    width: 280,
    customRender: ({ record }) => {
      const ids = JSON.parse(JSON.stringify(record.level));
      return ids ? SetTooltip(getLevelValues(ids, null), 20) : '-';
    },
  },
  {
    title: t('table.finance.finance_opening_terminal'),
    dataIndex: 'openTerminal',
    minWidth: 180,
    customRender: ({ record }) => {
      const clientArray = JSON.parse(record.client_type);
      const client = Client;
      const resultArray = [];
      for (let i = 0; i < clientArray.length; i++) {
        const id = clientArray[i].id;
        const value = client[id];
        if (value) {
          resultArray.push(value);
        }
      }
      return resultArray.join(',');
    },
  },
  {
    title: t('table.finance.finance_today_deposit'),
    dataIndex: 'today_deposit_amount',
    customRender: ({ record }) => {
      const todayDeposit = t('table.system.order_unit', [
        `${record.today_deposit_amount}/${record.today_deposit_count}`,
      ]);
      return h(() => h('div', null, todayDeposit ? todayDeposit : '-'));
    },
  },
  {
    title: t('table.finance.finance_total_deposit'),
    minWidth: 160,
    dataIndex: 'deposit_amount',
    customRender: ({ record }) => {
      const totalDeposit = t('table.system.order_unit', [
        `${record.deposit_amount}/${record.deposit_count}`,
      ]);
      return h(() => h('div', null, totalDeposit ? totalDeposit : '-'));
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
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
    customRender: ({ record }) => {
      return setTooltip(record.updated_name);
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 120,
    customRender: ({ record }) => {
      const status = record.state;
      const color = status == 1 ? COLORS.SUCCESS : COLORS.ERROR;
      const text = status == 1 ? t('business.common_normal') : t('business.common_deactivate'); //启用，停用
      return h('div', { style: { color: color } }, text);
    },
  },
];
useAutoTableLabelWidth(BrlpixColumns);
export const pixColumns: BasicColumn[] = [
  {
    title: t('business.common_sort'),
    dataIndex: 'id',
    width: 80,
    ifShow: isHasAuth('21008'),
    customRender: () => {
      return h(Icon, { icon: 'ri:drag-move-2-line' });
    },
  },
  {
    title: t('table.finance.finance_Bank_name'),
    dataIndex: 'bank_id',
  },
  {
    title: t('table.finance.finance_Cardholder_name'),
    dataIndex: 'open_name',
  },
  {
    title: t('table.finance.finance_Bank_Account'),
    dataIndex: 'bank_account',
    width: 150,
    customRender: ({ record }) => {
      return SetTooltip(record.bank_account, 18);
    },
  },
  {
    title: t('table.finance.finance_opening_level'),
    dataIndex: 'level',
    width: 280,
    customRender: ({ record }) => {
      const ids = JSON.parse(JSON.stringify(record.level));
      return ids ? SetTooltip(getLevelValues(ids, null), 20) : '-';
    },
  },
  {
    title: t('table.finance.finance_opening_terminal'),
    dataIndex: 'openTerminal',
    minWidth: 180,
    customRender: ({ record }) => {
      const clientArray = JSON.parse(record.client_type);
      const client = Client;
      // 创建一个用于存储结果的数组
      const resultArray = [];
      // 遍历clientArray数组，获取对应的Client值
      for (let i = 0; i < clientArray.length; i++) {
        const id = clientArray[i].id;
        const value = client[id];
        if (value) {
          resultArray.push(value);
        }
      }
      return resultArray.join(',');
    },
  },
  {
    title: t('table.finance.finance_today_deposit'),
    dataIndex: 'today_deposit_amount',
    customRender: ({ record }) => {
      const todayDeposit = t('table.system.order_unit', [
        `${record.today_deposit_amount}/${record.today_deposit_count}`,
      ]);
      return h(() => h('div', null, todayDeposit ? todayDeposit : '-'));
    },
  },
  {
    title: t('table.finance.finance_total_deposit'),
    minWidth: 160,
    dataIndex: 'deposit_amount',
    customRender: ({ record }) => {
      const totalDeposit = t('table.system.order_unit', [
        `${record.deposit_amount}/${record.deposit_count}`,
      ]);
      return h(() => h('div', null, totalDeposit ? totalDeposit : '-'));
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
    title: t('business.common_operate_people'),
    dataIndex: 'updated_name',
    customRender: ({ record }) => {
      return record.updated_name;
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 120,
    customRender: ({ record }) => {
      const status = record.state;
      const color = status == 1 ? COLORS.SUCCESS : COLORS.ERROR;
      const text = status == 1 ? t('business.common_normal') : t('business.common_deactivate'); //启用，停用
      return h('div', { style: { color: color } }, text);
    },
  },
];

useAutoTableLabelWidth(pixColumns);
