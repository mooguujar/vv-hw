import { BasicColumn } from '/@/components/Table';
import { useCurrencyStore } from '/@/store/modules/currency';
import { stateGameRecordColor, stateGameRecordData } from '/@/views/finance/common/const';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { Tag, Tooltip } from 'ant-design-vue';
import { useGameSortStore } from '/@/store/modules/gameSort';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();
const setTooltip = (text, color = '') => {
  return h(
    Tooltip,
    {
      title: text,
    },
    () =>
      h(
        'div',
        {
          style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
          class: color,
        },
        text,
      ),
  );
};
const gameSortStore = useGameSortStore();
await gameSortStore.setgame_typeList(); //调用游戏类型接口
const { getgame_typeList } = useGameSortStore();
const newGetgame_typeList = getgame_typeList.filter((itemn) => itemn.game_type == 4);
const { getPlatformList } = useGameSortStore();
let datagetPlatformList = [
  ...[{ platform_name: t('business.common_all'), platform_id: '' }],
  ...(getPlatformList?.[4] ?? []),
];
export const searchSchema: any = () => {
  return [
    {
      field: 'currency_id',
      labelPrefix: t('business.common_currency'),
      labelPrefixWidth: 45,
      component: 'ApiSelect',
      defaultValue: '',
      componentProps: {
        api: async () => {
          const outputArray: any = getCurrencyList;
          return [...[{ label: t('business.common_all'), value: '' }], ...outputArray];
        },
        labelField: 'label',
        valueField: 'value',
        getPopupContainer: () => document.body,
        allowClear: false,
        showIcon: true,
      },
      colProps: { xxl: 3, xl: 3, lg: 4, md: 5, sm: 6 },
    },

    {
      field: 'game_type',
      component: 'ApiSelect',
      labelPrefix: t('business.common_game_type'),
      labelPrefixWidth: 75,
      defaultValue: '4',
      colProps: { xxl: 5, xl: 5, lg: 4, md: 5, sm: 7 },
      componentProps: ({ formActionType, formModel, tableAction }) => {
        return {
          allowClear: true,
          placeholder: t('common.chooseText'),
          api: () => {
            return newGetgame_typeList;
          },
          labelField: 'name',
          valueField: 'game_type',
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'platform_id',
      component: 'ApiSelect',
      labelPrefix: t('table.report.report_platform_name'),
      defaultValue: '',
      colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
      componentProps: ({ formActionType, formModel, tableAction }) => {
        return {
          allowClear: true,
          placeholder: t('common.chooseText'),
          api: () => {
            return datagetPlatformList;
          },
          labelField: 'platform_name',
          valueField: 'platform_id',
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'time',
      labelPrefix: t('business.common_count_time'),
      labelPrefixWidth: 45,
      component: 'RangePicker',
      defaultValue: [dayjs().endOf('day').toDate(), dayjs().endOf('day').toDate()],
      colProps: { xxl: 7, xl: 7, lg: 7, md: 7, sm: 7 },
      componentProps: {
        allowClear: false,
        format: 'YYYY-MM-DD',
        placeholder: [t('business.common_start_time'), t('business.common_end_time')],
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'state',
      labelPrefix: t('business.common_status'),
      defaultValue: 0,
      component: 'Select',
      componentProps: {
        options: [
          { label: t('business.common_all'), value: 0 },
          { label: t('table.report.report_Settled'), value: 1 },
          { label: t('table.report.report_Settl'), value: 2 },
          { label: t('table.report.repoart_order_canceled'), value: 3 },
        ],
        getPopupContainer: () => document.body,
        allowClear: false,
      },
      colProps: { xxl: 5, xl: 5, lg: 5, md: 5, sm: 6 },
    },
    {
      field: '',
      labelPrefix: '',
      //labelPrefixWidth: 35,
      labelBorder: false,
      component: 'InputGroup',
      slot: 'custom',
      // colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 8 },
    },
  ];
};

export const columns: BasicColumn[] = [
  {
    title: t('table.report.report_bill_no'),
    dataIndex: 'bill_no',
    customRender: ({ record }) => {
      return setTooltip(record.bill_no);
    },
  },
  {
    title: t('table.report.platform_bill_no_num'),
    dataIndex: 'platform_bill_no',
    customRender: ({ record }) => {
      return record?.platform_name == '赌场游戏' // todo
        ? '-'
        : record.platform_bill_no.length > 20
        ? setTooltip(record.platform_bill_no)
        : record.platform_bill_no;
    },
  },
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 120,
    customRender: ({ record }) => {
      return record.username ? record.username : '-';
    },
  },
  {
    title: t('table.report.report_game_code'),
    dataIndex: 'player_name',
    customRender: ({ record }) => {
      return setTooltip(record.player_name);
    },
  },
  {
    title: t('table.report.report_platform_name'),
    dataIndex: 'platform_name',
    width: 80,
  },
  {
    title: t('table.report.report_game_name'),
    dataIndex: 'game_name',
    width: 80,
    customRender: ({ record }) => {
      if (typeof record.detail === 'string') {
        record.detail = JSON.parse(record.detail);
      }
      if (record.detail.length >= 2) return '-';
      return record.game_name;
    },
  },

  {
    title: t('table.member.member_match_name'),
    dataIndex: 'competitionName',
    customRender: ({ record }) => {
      if (typeof record.detail === 'string') {
        record.detail = JSON.parse(record.detail);
      }
      return record.detail.length < 2 ? setTooltip(record.detail[0].competitionName) : '-';
    },
  },
  {
    title: t('table.member.member_match_team'),
    dataIndex: 'eventName',
    width: 120,
    customRender: ({ record }) => {
      if (typeof record.detail == 'string') {
        record.detail = JSON.parse(record.detail);
      }
      if (record.detail.length == 1) return setTooltip(record.detail[0].eventName);
      return '-';
    },
  },

  {
    title: t('table.report.report_bet_content'),
    width: 120,
    slots: { customRender: 'betContent' },
  },

  {
    title: t('table.report.report_bet_currency_id'),
    dataIndex: 'currency_id',
    minWidth: 120,
    slots: { customRender: 'currency' },
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    width: 120,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    width: 120,
    customRender: ({ record }) => {
      if (record.state == 0) return '-';
      return record.valid_bet_amount;
    },
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    customRender: ({ record }) => {
      if (record.state == 0) return '-';
      const color = record.net_amount > 0 ? 'text-red' : 'text-green';
      return h('div', { class: color }, record.net_amount || '-');
    },
  },
  {
    title: t('table.report.report_bet_time'),
    dataIndex: 'bet_time',
    minWidth: 200,
    customRender: ({ record }) => {
      return toTimezone(record.bet_time, 'YYYY-MM-DD HH:mm:ss', false);
    },
  },
  {
    title: t('business.common_status'),
    dataIndex: 'state',
    minWidth: 160,
    customRender: ({ record }) => {
      const state = record.state;
      return h(Tag, { color: stateGameRecordColor[state] }, () => stateGameRecordData[state]);
    },
  },
];
useAutoTableLabelWidth(columns);
