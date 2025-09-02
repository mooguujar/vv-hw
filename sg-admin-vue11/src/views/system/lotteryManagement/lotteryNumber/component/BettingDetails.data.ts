import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const columns = [
  // {
  //   title: t('business.game_type'),
  //   dataIndex: 'game_class_name',
  //   minWidth: 100,
  //   customRender: ({ text, record }) => {
  //     if (!text) return '汇总小计';
  //   },
  // },
  {
    title: t('business.common_site_name'), // 站点名称
    dataIndex: 'ip',
    slots: { customRender: 'content' },
  },
  {
    title: t('table.race_price.table_valid_bet'), // 有效投注
    dataIndex: 'username',
  },
  {
    title: t('table.report.report_platform_amount'), // 平台输赢
    dataIndex: 'username',
  },
];
