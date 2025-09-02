import { BasicColumn,FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 50,
  },
  {
    title: t('common.username'),
    dataIndex: 'username',
    width: 60,
  },
  {
    title: t('common.UserOp'),
    dataIndex: 'operation',
    width: 100,
  },
  {
    title: t('common.RequestMethod'),
    dataIndex: 'method',
    customRender: ({record}) => {
      return h(Tooltip,
          {
              title: record.method
          },
          () => h('div',
              {
                  style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }
              },
              record.method)
      );
    }
    // width: 180,
  },
  {
    title: t('common.RequestParam'),
    dataIndex: 'params',
    customRender: ({record}) => {
      return h(Tooltip,
          {
              title: record.params
          },
          () => h('div',
              {
                  style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }
              },
              record.params)
      );
    }
    // width: 180,
  },
  {
    title: t('common.ExecutionTime'),
    dataIndex: 'time',
    width: 100,
  },
  {
    title: t('table.risk.report_ip_address'),
    dataIndex: 'ip',
    width: 180,
  },
  {
    title: t('table.member.member_creat_time'),
    dataIndex: 'createTime',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'userName',
    labelPrefix: t('table.system.system_username'),
    labelPrefixWidth: 60,
    component: 'Input',
    colProps: { xxl: 5, xl: 5, lg: 5, md: 6, sm: 7 },
  },
];