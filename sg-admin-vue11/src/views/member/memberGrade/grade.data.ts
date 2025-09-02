import { BasicColumn } from '/@/components/Table';
import { h } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
import { toTimezone } from '/@/utils/dateUtil';
const { t } = useI18n();
export const columns: BasicColumn[] = [
  {
    title: t('modalForm.member.member_level_id'),
    dataIndex: 'level_id',
    lockWidth: true,
  },
  {
    title: t('table.member.member_grade_name'),
    dataIndex: 'name',
  },
  {
    title: t('table.member.member_people_count'),
    dataIndex: 'member_count',
    slots: { customRender: 'memberCount' },
  },
  {
    title: t('table.member.member_valide_people'),
    dataIndex: 'member_valid_count',
    slots: { customRender: 'memberValid' },
  },
  {
    title: t('modalForm.member.member_min_deposit') + '(₮)',
    dataIndex: 'min_deposit',
  },
  {
    title: t('modalForm.member.member_multiple'),
    dataIndex: 'bet_multiplier',
  },
  {
    title: t('table.member.member_creat_time'), //创建时间
    dataIndex: 'created_at',
    minWidth: 200,
    customRender: ({ record }) => {
      return record.created_at ? toTimezone(record.created_at) : '-';
    },
  },
  {
    title: t('table.member.member_defalut_level'),
    dataIndex: 'is_default',
    customRender: ({ record }) => {
      const { is_default } = record;
      let color = '';
      let text = '';
      switch (is_default) {
        case 1:
          color = 'text-green';
          text = t('business.common_yes');
          break;
        case 2:
          text = t('business.common_no');
          break;
      }
      return h('div', { class: color }, text);
    },
  },
];
useAutoTableLabelWidth(columns);
export const testData = [
  {
    vipName: t('common.monthvip'),
    userNum: 10,
    money: '10.00',
    days: 8,
    diamondGift: 10,
    vipGift: '2003-10-10',
    remarks: t('business.common_yes'),
  },
];
