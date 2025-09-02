import { useI18n } from '/@/hooks/web/useI18n';
import { auths } from '/@/utils/authFunction';
import { currentyOptions } from '/@/views/common/commonSetting';
import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

const { t } = useI18n();
/** 基础配置 */
export const basicColumn1 = [
  {
    title: t('business.commin_vip_level'),
    field: 'level',
    align: 'center',
    //fixed: 'left',
  },
  {
    title: t('table.member.member_people_count'),
    field: 'total',
    align: 'center',
  },
  {
    title: t('modalForm.member.member_promotion_points'),
    field: 'upgrade',
    align: 'center',
    editRow: true,
  },
  {
    title: t('modalForm.member.member_relegation_points'),
    field: 'retain',
    align: 'center',
    editRow: true,
  },
  {
    title: t('common.guaranteed_recharge'),
    field: 'deposit_retain',
    align: 'center',
    editRow: true,
  },
  {
    title: t('table.member.member_defalut_level'),
    align: 'center',
    field: 'is_default',
  },
  {
    title: t('business.common_operate'), //操作
    width: 150,
    align: 'center',
    field: 'oper',
    ifShow: auths(['10513', '10512', '10514']),
  },
];
useAutoTableLabelWidth(basicColumn1);
export const basicColumn2 = [
  {
    title: t('business.commin_vip_level'),
    field: 'level',
    align: 'center',
    //fixed: 'left',
  },
  {
    title: t('table.member.member_people_count'),
    field: 'total',
    align: 'center',
  },
  {
    title: t('common.advance_code'),
    field: 'upgrade',
    align: 'center',
    editRow: true,
  },
  {
    title: t('common.grade_code'),
    field: 'retain',
    align: 'center',
    editRow: true,
  },
  {
    title: t('common.guaranteed_recharge'),
    field: 'deposit_retain',
    align: 'center',
    editRow: true,
  },
  {
    title: t('table.member.member_defalut_level'),
    align: 'center',
    field: 'is_default',
  },
  {
    title: t('business.common_operate'), //操作
    field: 'oper',
    align: 'center',
    width: 150,
    ifShow: auths(['10513', '10512', '10514']),
  },
];
useAutoTableLabelWidth(basicColumn2);
export const getBasicColumn = function (type) {
  if (type === 1) {
    return basicColumn1.filter((p) => p.ifShow !== false);
  } else {
    return basicColumn2.filter((p) => p.ifShow !== false);
  }
};

export const bonusColumn = [
  {
    title: t('business.commin_vip_level'),
    field: 'level',
    align: 'center',
    // fixed: 'left',
  },
];
export const getBonusColumn = function (currenciesList, cashTypeId) {
  let currenciesColumn = [];
  switch (cashTypeId.value) {
    case '818':
      currenciesColumn = currenciesList.map((p) => {
        const currentyName = currentyOptions[p];
        return {
          title: `${t('table.member.member_promotion_gift')}(${currentyName.toUpperCase()})`,
          field: currentyName.toLowerCase(),
          currenty: p,
          align: 'center',
          editRow: true,
          moreWidth: 50,
        };
      });
      break;
    case '821':
      currenciesColumn = currenciesList.map((p) => {
        const currentyName = currentyOptions[p];
        return {
          title: `${t('table.member.member_every_month')}(${currentyName.toUpperCase()})`,
          field: currentyName.toLowerCase(),
          currenty: p,
          align: 'center',
          editRow: true,
          moreWidth: 50,
        };
      });
      break;
    case '820':
      currenciesColumn = currenciesList.map((p) => {
        const currentyName = currentyOptions[p];
        return {
          title: `${t('table.member.member_every_week')}(${currentyName.toUpperCase()})`,
          field: currentyName.toLowerCase(),
          currenty: p,
          align: 'center',
          editRow: true,
          moreWidth: 50,
        };
      });
      break;
    case '819':
      currenciesColumn = currenciesList.map((p) => {
        const currentyName = currentyOptions[p];
        return {
          title: `${t('table.member.member_every_day')}(${currentyName.toUpperCase()})`,
          field: currentyName.toLowerCase(),
          currenty: p,
          align: 'center',
          editRow: true,
          moreWidth: 50,
        };
      });
      break;
    default:
      break;
  }
  const columns = bonusColumn.concat(currenciesColumn);
  useAutoTableLabelWidth(columns);
  return columns;
};
