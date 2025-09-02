import { BasicColumn } from '/@/components/Table';
import { Tag, Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { Client } from '/@/views/common/commonSetting';
import { getLevelValues } from '/@/utils/common';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';
import Icon from '/@/components/Icon';
import { SetTooltip } from '/@/views/common/component';
import { isHasAuth } from '/@/utils/authFunction';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const setTooltip = (text) => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' },
        },
        text,
      ),
  );
};

// 表格内容
export const usdtColumns: BasicColumn[] = [
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
    title: t('business.common_note_name'),
    dataIndex: 'remarks',
  },
  {
    title: t('business.common_currency_fullname'),
    dataIndex: 'currency_name',
  },
  {
    title: t('business.common_agreement_type'),
    dataIndex: 'contract_type_name',
  },
  {
    title: t('table.finance.finance_Payment_address'),
    dataIndex: 'wallet_address',
    width: 200,
    customRender: ({ record }) => {
      return setTooltip(record.wallet_address);
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
    minWidth: 180,
    dataIndex: 'openTerminal',
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
      const todayDeposit = `${record.today_deposit_amount}/${t('common.translate.word62', {
        unit: record.today_deposit_count,
      })}`;
      return h(() => h('div', null, todayDeposit ? todayDeposit : '-'));
    },
    minWidth: 120,
  },
  {
    title: t('table.finance.finance_total_deposit'),
    minWidth: 160,
    dataIndex: 'deposit_amount',
    customRender: ({ record }) => {
      const totalDeposit = `${record.deposit_amount}/${t('common.translate.word62', {
        unit: record.deposit_count,
      })}`;
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
      const color = status == 1 ? '#1CD91C' : '#E91134';
      const text = status == 1 ? t('business.common_normal') : t('business.common_deactivate'); //启用，停用
      return h(Tag, { color: color }, () => text);
    },
  },
];
useAutoTableLabelWidth(usdtColumns);
