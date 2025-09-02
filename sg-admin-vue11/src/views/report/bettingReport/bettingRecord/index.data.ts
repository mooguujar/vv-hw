import { BasicColumn } from '/@/components/Table';
import { useCurrencyStore } from '/@/store/modules/currency';
import { h, ref } from 'vue';
import { Tag, Tooltip } from 'ant-design-vue';
import { toTimezone } from '/@/utils/dateUtil';
import { stateGameRecordColor, stateGameRecordData } from '/@/views/finance/common/const';
import { useGameSortStore } from '/@/store/modules/gameSort';
import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import eventBus from '/@/utils/eventBus';
import { useTreeListStore } from '/@/store/modules/treeList';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
const { getCurrencyList } = useCurrencyStore();
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
          style: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        },
        text,
      ),
  );
};
const gameSortStore = useGameSortStore();
await gameSortStore.setgame_typeList(); //调用游戏类型接口
const { getPlatformList } = useGameSortStore();
let plateOptions: any = [];
for (const key in getPlatformList) {
  plateOptions.push(...getPlatformList[key]);
}
plateOptions =
  plateOptions &&
  plateOptions.map((item) => {
    return {
      ...item,
      label: item.platform_name,
      value: item.platform_id,
    };
  });
plateOptions = [{ label: t('business.common_all'), value: '' }, ...plateOptions];
plateOptions = plateOptions.filter((item) => item.game_type != 4);

const { getgame_typeList } = useGameSortStore();
const newGetgame_typeList = getgame_typeList.filter((itemn) => itemn.game_type != 4);
const { currencyAllTreeList } = useTreeListStore();
const currentList = ref([...currencyAllTreeList] as any);

function setCurrencyName(id) {
  let name = currentList.value.filter((c) => c.id === id)[0]?.name || '';
  return name;
}

function formatCurrencyAmount(amountStr: string, currencyCode: string): string {
  // 将字符串转换为数字
  const amount = parseFloat(amountStr);
  if (isNaN(amount)) return '-';

  // 根据货币代码决定小数位数
  const decimals = ['707', '708'].includes(currencyCode) ? 8 : 4;

  // 将数字格式化为指定小数位数的字符串
  let formattedAmount = amount.toFixed(decimals);

  // 移除末尾多余的0，但保留至少2位小数
  if (!['707', '708'].includes(currencyCode)) {
    formattedAmount = parseFloat(formattedAmount).toFixed(2);
  }

  return formattedAmount;
}

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
      colProps: { xxl: 3, xl: 3, lg: 3, md: 5, sm: 6 },
    },
    {
      field: 'game_type',
      component: 'ApiSelect',
      labelPrefix: t('business.common_game_type'),
      defaultValue: 'all',
      colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 6 },
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
          onChange: async (value) => {
            const { getPlatformList } = useGameSortStore();
            if (!value) return;
            let plateOptions: any = [];
            if (value == 'all') {
              for (const key in getPlatformList) {
                plateOptions.push(...getPlatformList[key]);
              }
            } else {
              plateOptions = getPlatformList[value];
            }
            plateOptions =
              plateOptions &&
              plateOptions.map((item) => {
                return {
                  ...item,
                  label: item.platform_name,
                  value: item.platform_id,
                };
              });
            plateOptions = [{ label: t('business.common_all'), value: '' }, ...plateOptions];
            const { updateSchema, setFieldsValue } = formActionType;
            await setFieldsValue({ platform_id: null });
            updateSchema(
              {
                field: 'platform_id',
                componentProps: {
                  optionFilterProp: 'label',
                  placeholder: t('common.chooseText'),
                  api: () => {
                    return plateOptions;
                  },
                  getPopupContainer: () => document.body,
                  onChange: async (value, platform) => {
                    // if (!value) return;
                    // await setFieldsValue({ game_type: platform?.game_type });
                  },
                },
              },
              false,
            );
          },
        };
      },
    },
    {
      field: 'platform_id',
      component: 'ApiSelect',
      labelPrefix: t('table.report.report_platform_name'),
      colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 6 },
      defaultValue: '',
      componentProps: ({ formActionType, formModel, tableAction }) => {
        return {
          api: () => {
            return plateOptions;
          },
          allowClear: true,
          placeholder: t('common.chooseText'),
          optionFilterProp: 'label',
          getPopupContainer: () => document.body,
        };
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
        ],
        getPopupContainer: () => document.body,
        allowClear: false,
      },
      colProps: { xxl: 4, xl: 4, lg: 4, md: 5, sm: 6 },
    },
    {
      field: 'time',
      labelPrefix: t('sys.errorLog.tableColumnDate'),
      component: 'RangePicker',
      defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
      colProps: { xxl: 7, xl: 7, lg: 7, md: 8, sm: 9 },
      // componentProps: {
      //   allowClear: false,
      //   format: 'YYYY-MM-DD HH:mm:ss',
      //   showTime: {
      //     hideDisabledOptions: true,
      //     defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
      //   },
      //   placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      //   getPopupContainer: () => document.body,
      // },
      componentProps: ({ formActionType, formModel }) => {
        return {
          allowClear: false,
          format: 'YYYY-MM-DD HH:mm:ss',
          showTime: {
            hideDisabledOptions: true,
            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
          },
          placeholder: [t('business.common_start_time'), t('business.common_end_time')],
          getPopupContainer: () => document.body,
          onChange: async (e) => {
            eventBus.emit('mittChangeTime', [formModel.time[0], formModel.time[1]]);
          },
        };
      },
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
      return record.bill_no.length > 20
        ? setTooltip(record.bill_no)
        : record.bill_no
        ? record.bill_no
        : '-';
    },
    minWidth: 200,
  },
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    minWidth: 120,
  },
  {
    title: t('table.report.report_player_name'),
    dataIndex: 'player_name',
    customRender: ({ record }) => {
      return record.player_name
        ? record.player_name.length > 10
          ? setTooltip(record.player_name)
          : record.player_name
        : '-';
    },
    minWidth: 120,
  },
  {
    title: t('table.report.report_platform_name'),
    dataIndex: 'platform_name',
  },
  {
    title: t('table.report.report_game_name'),
    dataIndex: 'game_name',
    minWidth: 120,
  },
  {
    title: t('table.report.report_beted') + '/' + t('business.qb_bz'),
    dataIndex: ['g_currency_id', 'currency_id'],
    /* customRender: ({ record }) => {
      return setCurrencyName(record.g_currency_id) + '/' + setCurrencyName(record.currency_id);
    }, */
    slots: { customRender: 'currency' },
  },
  {
    title: t('table.report.report_bet_amount'),
    dataIndex: 'bet_amount',
    customRender: ({ record }) => {
      return record.g_currency_id === record.currency_id
        ? record.bet_amount
        : formatCurrencyAmount(record.g_bet_amount, record.g_currency_id) + '/' + record.bet_amount;
    },
    minWidth: 120,
  },
  {
    title: t('table.report.report_valid_bet_amount'),
    dataIndex: 'valid_bet_amount',
    customRender: ({ record }) => {
      if (record.state == 0) return '-';
      return record.g_currency_id === record.currency_id
        ? record.valid_bet_amount
        : formatCurrencyAmount(record.g_valid_bet_amount, record.g_currency_id) +
            '/' +
            record.valid_bet_amount;
    },
    minWidth: 120,
  },
  {
    title: t('table.report.report_platform_amount'),
    dataIndex: 'net_amount',
    customRender: ({ record }) => {
      if (record.state == 0) return '-';
      const color = record.net_amount > 0 ? 'text-red' : 'text-green';
      return h(
        'div',
        { class: color },
        record.g_currency_id === record.currency_id
          ? record.net_amount
          : formatCurrencyAmount(record.g_net_amount, record.g_currency_id) +
              '/' +
              record.net_amount,
      );
    },
    minWidth: 120,
  },
  {
    title: t('table.report.report_bet_content'),
    dataIndex: 'detail',
    minWidth: 180,
    customRender: ({ record }) => {
      if (record.game_class == '8') return '-';
      if (record.detail == '[]') return '-';
      return record.detail.length > 9 ? setTooltip(record.detail) : record.detail;
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
  {
    title: t('business.common_operate'),
    dataIndex: '',
    minWidth: 120,
    slots: { customRender: 'action' },
  },
];
useAutoTableLabelWidth(columns);
