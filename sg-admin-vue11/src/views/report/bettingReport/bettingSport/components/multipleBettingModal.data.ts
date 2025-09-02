import { BasicColumn } from '/@/components/Table';
import { Tooltip } from 'ant-design-vue';
import { h } from 'vue';
import { toTimezone } from '/@/utils/dateUtil';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
// 表格内容

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
export const columns: BasicColumn[] = [
  {
    title: t('business.common_member_account'),
    dataIndex: 'username',
    width: 120,
    customRender: ({ record }) => {
      return setTooltip(record.username);
    },
  },
  {
    title: t('table.report.report_platform_name'),
    dataIndex: 'platform_name',
    width: 120,
  },
  {
    title: t('table.report.report_game_name'),
    dataIndex: 'gameName',
    width: 120,
    customRender: ({ record }) => {
      return setTooltip(record.gameName);
    },
  },
  {
    title: t('table.member.member_match_name'),
    dataIndex: 'competitionName',
    //width: 120,
    customRender: ({ record }) => {
      return record.competitionName ? setTooltip(record.competitionName) : '-';
    },
  },
  {
    title: t('table.member.member_match_team'),
    dataIndex: 'eventName',
    //width: 120,
    customRender: ({ record }) => {
      return record.eventName ? setTooltip(record.eventName) : '-';
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
];
