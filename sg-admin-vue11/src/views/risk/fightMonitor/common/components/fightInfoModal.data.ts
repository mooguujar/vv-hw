import { BasicColumn } from '/@/components/Table';
import { Divider } from 'ant-design-vue';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useGameSortStore } from '/@/store/modules/gameSort';
import { SetTooltip } from '/@/views/common/component';
const gameSortStore = useGameSortStore();

const { t } = useI18n();

// 表格内容
export const columns: BasicColumn[] = [
  {
    title: t('table.risk.report_fight_website'), //对打站点
    dataIndex: 'accountTypeName',
    width: 90,
    customRender: ({ record }) => {
      return h('div', null, [
        h('div', null, record.site_a ? record.site_a : '-'),
        h(Divider),
        h('div', null, record.site_b ? record.site_b : '-'),
      ]);
    },
  },
  {
    title: t('table.risk.report_fight_member'), //对打会员
    dataIndex: 'review_name',
    minWidth: 100,
    customRender: ({ record }) => {
      return h('div', null, [
        h('div', null, record.username_a ? record.username_a : '-'),
        h(Divider),
        h('div', null, record.username_b ? record.username_b : '-'),
      ]);
    },
  },
  {
    title: t('business.common_game_type'), //游戏类型
    dataIndex: 'game_class',
    minWidth: 100,
    customRender: ({ record }) => {
      const game_class = gameSortStore.getgame_typeList.find(
        (item) => item.game_type == record.game_class,
      );
      return game_class?.name ?? '-';
    },
  },

  {
    title: t('table.report.report_platform_name'), //游戏平台
    dataIndex: 'platform_name',
    minWidth: 100,
    customRender: ({ record }) => {
      return record.platform_name ? record.platform_name : '-';
    },
  },
  {
    title: t('table.report.report_game_name'), //游戏名称
    dataIndex: 'game_name',
    width: 100,
    customRender: ({ record }) => {
      return record.game_name ? SetTooltip(record.game_name, 10) : '-';
    },
  },

  {
    title: t('table.risk.report_phase') + '/' + t('table.report.report_game_code'), //期数/局号
    dataIndex: 'game_code',
    minWidth: 150,
    customRender: ({ record }) => {
      return record.game_code ? record.game_code : '-';
    },
  },
  {
    title: t('table.risk.report_bet_content'), //下注内容
    dataIndex: 'device',
    width: 100,
    slots: { customRender: 'betContent' },
  },
  {
    title: t('table.risk.report_bet_amount'), //下注金额
    dataIndex: 'firstDepositAmount',
    minWidth: 100,
    customRender: ({ record }) => {
      return h('div', null, [
        h('div', null, record.bet_amount_a ? record.bet_amount_a : '-'),
        h(Divider),
        h('div', null, record.bet_amount_b ? record.bet_amount_b : '-'),
      ]);
    },
  },
  {
    title: t('table.report.report_win_lose'), //输赢
    dataIndex: 'firstDepositAmount',
    minWidth: 100,
    customRender: ({ record }) => {
      return h('div', null, [
        h('div', null, record.net_amount_a ? record.net_amount_a : '-'),
        h(Divider),
        h('div', null, record.net_amount_b ? record.net_amount_b : '-'),
      ]);
    },
  },
];
