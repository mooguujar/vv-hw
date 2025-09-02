import { BasicColumn } from '@/components/Table';
import { useI18n } from '@/hooks/web/useI18n';
import { useTemplateStatus, useAgencyModeStatus } from '@/views/system/common/const';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { agencyModeStatus } = useAgencyModeStatus();
const { templateStatus } = useTemplateStatus();
const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('table.system.system_table_header_affiliated_group'), //所属集团
    dataIndex: 'company_name',
    minWidth: 100,
  },
  {
    title: t('table.system.system_table_header_site_name'), //站点名称
    dataIndex: 'name',
    minWidth: 100,
  },
  {
    title: t('business.common_site_number'), //站点编号
    dataIndex: 'code',
    minWidth: 100,
  },
  {
    title: t('table.system.system_table_header_site_template'), //站点模板
    dataIndex: 'tpl',
    minWidth: 100,
    customRender: ({ record }) => {
      return templateStatus[record.tpl];
    },
  },
  {
    title: t('table.system.system_table_header_agent_model'), //代理模式
    dataIndex: 'mode',
    minWidth: 100,
    customRender: ({ record }) => {
      return agencyModeStatus[record.mode];
    },
  },
  {
    title: t('table.system.system_table_header_operating_currency'), //运营币种
    dataIndex: 'currency',
    minWidth: 100,
    slots: { customRender: 'currency' },
  },
  {
    title: t('table.system.system_table_header_site_balance'), //站点余额(U)
    dataIndex: 'site_fee',
    minWidth: 100,
    customCell: () => ({
      class: 'text-red',
    }),
    slots: { customRender: 'siteFee' },
  },
  {
    title: t('table.system.system_table_header_background_domain'), //后台域名
    dataIndex: 'backup_domain',
    minWidth: 100,
    slots: { customRender: 'backup_domain' },
  },
  {
    title: t('table.system.system_table_header_maintenance_state'), //维护状态
    dataIndex: 'maintain',
    minWidth: 100,
    slots: { customRender: 'maintain' },
  },
];

useAutoTableLabelWidth(columns);
