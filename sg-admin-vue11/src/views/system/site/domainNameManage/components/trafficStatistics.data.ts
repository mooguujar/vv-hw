import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('common.month'),
    dataIndex: 'name',
  },
  {
    title: t('common.totalFee'),
    dataIndex: 'address',
  },
  {
    title: t('common.CNDNode'),
    dataIndex: 'address',
  },
  {
    title: t('common.NodeFee'),
    dataIndex: 'address',
  },
  {
    title: t('common.FreeData'),
    dataIndex: 'address',
  },
  {
    title: t('common.Used'),
    dataIndex: 'address',
  },
  {
    title: t('common.exceeded'),
    dataIndex: 'address',
  },
  {
    title: t('common.ExceedsUnitPrice'),
    dataIndex: 'address',
  },
  {
    title: t('common.ExceedsPrice'),
    dataIndex: 'address',
  },
  {
    title: t('common.FreeSubdomain'),
    dataIndex: 'address',
  },
  {
    title: t('common.Subdomain'),
    dataIndex: 'address',
  },
  {
    title: t('common.ExceededNum'),
    dataIndex: 'address',
  },
];
