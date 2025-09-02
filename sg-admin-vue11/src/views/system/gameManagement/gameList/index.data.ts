import { getSports } from '/@/api/sys';
import { BasicColumn, FormSchema } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import { auths } from '/@/utils/authFunction';
import { toTimezone } from '/@/utils/dateUtil';
import { stateSportColor, useSportStatusOptions } from '/@/views/common/commonSetting';

import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { h } from 'vue';

const { t } = useI18n();

const { sportsStatusOptions } = useSportStatusOptions();

export const columns: BasicColumn[] = [
  {
    title: t('common.sport2'),
    dataIndex: 'sport_name',
  },
  {
    title: t('common.sport5'),
    dataIndex: 'event_id',
  },
  {
    title: t('table.member.member_match_name'),
    dataIndex: 'comp_name',
  },
  {
    title: t('business.common_period_start'),
    dataIndex: 'start_at',
    width: 160,
    customRender: ({ record }) => {
      return record.start_at ? toTimezone(record.start_at, 'YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
  {
    title: t('common.sport6'),
    dataIndex: 'home_name',
  },
  {
    title: t('common.sport7'),
    dataIndex: 'away_name',
  },
  {
    title: t('common.sport8'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      const stateLable = sportsStatusOptions.map((item) => {
        if (item.value === record.state) {
          return item.label;
        }
      });
      return h('div', { style: { color: stateSportColor[record.state] } }, stateLable);
    },
  },
  {
    title: t('business.common_operate'),
    width: 180,
    slots: { customRender: 'action' },
    ifShow: auths(['70427']),
  },
  {
    title: t('table.system.operater'),
    dataIndex: 'operated_username',
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'updated_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return record.updated_at ? toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
];
useAutoTableLabelWidth(columns);
export const searchFormSchema: FormSchema[] = [
  {
    field: 'sport_id',
    labelPrefix: t('common.sport2'),
    labelPrefixWidth: 45,
    component: 'ApiSelect',
    defaultValue: '',
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
    componentProps: () => {
      return {
        placeholder: t('business.common_all'),
        api: async () => {
          const all = { name: t('business.common_all'), id: '' };
          const data = await getSports();
          return [all, ...data];
        },
        labelField: 'name',
        valueField: 'id',
        getPopupContainer: () => document.body,
      };
    },
  },
  {
    field: 'state',
    labelPrefix: t('business.common_status'),
    defaultValue: 0,
    labelPrefixWidth: 60,
    component: 'Select',
    componentProps: {
      options: sportsStatusOptions,
      getPopupContainer: () => document.body,
    },
    colProps: { xxl: 4, xl: 4, lg: 5, md: 6, sm: 7 },
  },
  {
    field: '',
    component: 'Input',
    label: '',
    slot: 'currentType',
  },
];
useAutoLabelWidth(searchFormSchema);

export const championColumn: BasicColumn[] = [
  {
    title: t('common.sport2'),
    dataIndex: 'sport_name',
  },
  {
    title: t('common.sport5'),
    dataIndex: 'event_id',
  },
  {
    title: t('table.member.member_match_name'),
    dataIndex: 'comp_name',
  },
  {
    title: t('business.common_period_start'),
    dataIndex: 'start_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return record.start_at ? toTimezone(record.start_at, 'YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
  {
    title: t('common.sport8'),
    dataIndex: 'state',
    customRender: ({ record }) => {
      const stateLable = sportsStatusOptions.map((item) => {
        if (item.value === record.state) {
          return item.label;
        }
      });
      return h('div', { style: { color: stateSportColor[record.state] } }, stateLable);
    },
  },
  {
    title: t('business.common_operate'),
    width: 180,
    slots: { customRender: 'action' },
    ifShow: auths(['70427']),
  },
  {
    title: t('table.system.operater'),
    dataIndex: 'operated_username',
  },
  {
    title: t('table.risk.report_operating_time'),
    dataIndex: 'updated_at',
    minWidth: 220,
    customRender: ({ record }) => {
      return record.updated_at ? toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
];
useAutoTableLabelWidth(championColumn);
