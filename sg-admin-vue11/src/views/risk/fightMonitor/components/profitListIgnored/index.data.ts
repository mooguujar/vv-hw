import cdBlockTwoline from '/@/components-cd/block/cd-block-twoline.vue';
import { FormSchema, BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs from 'dayjs';
import { toTimezone } from '/@/utils/dateUtil';
import { useGameSortStore } from '/@/store/modules/gameSort';
import { isHasAuth } from '/@/utils/authFunction.js';
import { isControlValueSet } from '/@/utils/domUtils';

let plateOptions: any = [];

const { t } = useI18n();

export const searchForm: FormSchema[] = [
  {
    field: 'monitor',
    component: 'Input',
    label: '',
    slot: 'profitListMonitor',
    colProps: { style: { marginRight: '10px' } },
    ifShow: isControlValueSet() ? false : isHasAuth('60509'),
  },
  {
    field: 'time',
    labelPrefix: t('business.time_limite'),
    labelPrefixWidth: 75,
    component: 'RangePicker',
    defaultValue: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
    //colProps: { class: 'ant-col-auto' },
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: [t('business.common_start_time'), t('business.common_end_time')],
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'site',
    component: 'ApiSelect',
    labelPrefix: t('table.risk.report_fight_website'), //对打站点
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
  },

  {
    field: 'platform_id',
    component: 'ApiSelect',
    labelPrefix: t('table.report.report_platform_name'),
    defaultValue: '',
    colProps: { xxl: 6, xl: 6, lg: 6, md: 6, sm: 7 },
    componentProps: ({ formActionType, formModel, tableAction }) => {
      return {
        api: () => {
          const { getPlatformList } = useGameSortStore();
          plateOptions = [];
          getPlatformList.map((item: any) => {
            if (
              item.length &&
              item[0].game_type != 3 &&
              item[0].game_type != 2 &&
              item[0].game_type != 8
            ) {
              plateOptions.push(...item);
            }
          });
          plateOptions = [
            { platform_name: t('business.common_all'), platform_id: '' },
            ...plateOptions,
          ];
          return plateOptions;
        },
        labelField: 'platform_name',
        valueField: 'platform_id',
        allowClear: true,
        placeholder: t('common.chooseText'),
        optionFilterProp: 'label',
        onChange: async (value) => {},
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'username',
    component: 'Input',
    slot: 'usernameSlot',
  },
  {
    field: 'category',
    component: 'InputNumber',
    defaultValue: 3,
    show: false,
  },
];

export const columns: BasicColumn[] = [
  {
    title: t('table.member.member_member') + ' A', //会员A
    dataIndex: 'address',
    children: [
      {
        title: t('table.risk.report_website'), //所属站点
        dataIndex: 'site_a',
        minWidth: 115,
        customRender: ({ record }) => {
          return record.site_a ? record.site_a : '-';
        },
      },
      {
        title: t('business.common_member_account'), //会员账号
        dataIndex: 'username_a',
        minWidth: 135,
        customRender: ({ record }) => {
          return record.username_a ? record.username_a : '-';
        },
      },
      {
        title: t('table.report.report_valid_bet_amount'), //有效投注
        dataIndex: 'valid_bet_amount_a',
        minWidth: 110,
        customRender: ({ record }) => {
          return record.valid_bet_amount_a ? record.valid_bet_amount_a : '-';
        },
      },
      {
        title: t('table.report.report_net_amount'), //会员输赢
        dataIndex: 'net_amount_a',
        minWidth: 110,
        customRender: ({ record }) => {
          return record.net_amount_a ? record.net_amount_a : '-';
        },
      },
    ],
  },

  {
    title: t('table.member.member_member') + ' B', //会员B
    dataIndex: 'address',
    children: [
      {
        title: t('table.risk.report_website'), //所属站点
        dataIndex: 'site_b',
        minWidth: 115,
        customRender: ({ record }) => {
          return record.site_b ? record.site_b : '-';
        },
      },
      {
        title: t('business.common_member_account'), //会员账号
        dataIndex: 'username_b',
        minWidth: 135,
        customRender: ({ record }) => {
          return record.username_b ? record.username_b : '-';
        },
      },
      {
        title: t('table.report.report_valid_bet_amount'), //有效投注
        dataIndex: 'valid_bet_amount_b',
        minWidth: 110,
        customRender: ({ record }) => {
          return record.valid_bet_amount_b ? record.valid_bet_amount_b : '-';
        },
      },
      {
        title: t('table.report.report_net_amount'), //会员输赢
        dataIndex: 'net_amount_b',
        minWidth: 110,
        customRender: ({ record }) => {
          return record.net_amount_b ? record.net_amount_b : '-';
        },
      },
    ],
  },
  {
    title: t('table.report.report_platform_name'), //平台游戏
    dataIndex: 'platform_id',
    minWidth: 85,
    customRender: ({ record }) => {
      const platform = plateOptions.find((item) => item.platform_id == record.platform_id);
      return platform?.platform_name ?? '-';
    },
  },
  {
    title: t('table.report.report_game_name'), //游戏名称
    dataIndex: 'game_name',
    minWidth: 85,
    customRender: ({ record }) => {
      return record.game_name ? record.game_name : '-';
    },
  },

  {
    title: t('table.risk.report_fight_number'), //对打笔数
    dataIndex: 'num',
    minWidth: 85,
    slots: { customRender: 'num' },
  },
  {
    title: t('table.risk.report_fight_amount'), //对打金额
    dataIndex: 'bet_amount',
    minWidth: 85,
    customRender: ({ record }) => {
      return record.bet_amount ? record.bet_amount : '-';
    },
  },

  {
    title: t('table.risk.report_ignored_day'), //忽略天数
    dataIndex: 'ignore_day',
    minWidth: 85,
    customRender: ({ record }) => {
      return h('span', { style: 'color:gray' }, record.ignore_day + t('common.some_day', ''));
    },
  },

  {
    title: t('business.common_operate'), //操作
    dataIndex: 'agency_commission',
    minWidth: 70,
    ifShow: !isControlValueSet(),
    slots: { customRender: 'action' },
  },
  {
    title: t('table.risk.report_operate_people'), //操作人员
    dataIndex: 'updated_name',
    minWidth: 90,
    customRender: ({ record }) => {
      return record.updated_name ? record.updated_name : '-';
    },
  },
  {
    title: t('table.risk.report_trigger_time') + '/' + t('table.risk.report_process_time'), //触发时间/处理时间
    dataIndex: 'address',
    minWidth: 170,
    customRender: ({ record }) => {
      // return h('div', null, [
      //   h('div', null, toTimezone(record.created_at)),
      //   h('div', null, toTimezone(record.updated_at)),
      // ]);
      return h(cdBlockTwoline, {
        line1: record.created_at ? toTimezone(record.created_at) : '-',
        line2: record.updated_at ? toTimezone(record.updated_at) : '-',
      });
    },
  },
  {
    title: t('business.common_remark'), //备注
    dataIndex: 'remarks',
    minWidth: 85,
    customRender: ({ record }) => {
      return record.remarks ? record.remarks : '-';
    },
  },
];
