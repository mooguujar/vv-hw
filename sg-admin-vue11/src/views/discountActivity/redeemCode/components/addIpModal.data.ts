import { useI18n } from '/@/hooks/web/useI18n';
import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
import { useTreeListStore } from '@/store/modules/treeList';

const { t } = useI18n();
export const accountFormSchema: any = [
  {
    field: 'currency_id',
    component: 'ApiSelect',
    label: t('common.gift_currency'), //赠送币种
    required: true,
    componentProps: {
      api: async () => {
        const { currencyTreeList } = useTreeListStore();
        const list = currencyTreeList;
        let arr = list.map((item: any) => {
          return {
            name: list.name,
            value: item.id,
            label: item.name,
          };
        });
        return arr;
      },
      showIcon: true,
      labelField: 'label',
      valueField: 'value',
      getPopupContainer: () => document.body,
    },
  },
  {
    field: 'amount',
    component: 'Input',
    required: true,
    label: t('table.discountActivity.discount_amount'), //赠送金额
    componentProps: {
      placeholder: t('modalForm.discountActivity.member_amount_tip'), //请输入金额
    },
  },
  {
    field: 'expire_at',
    component: 'Input',
    required: true,
    label: t('table.system.system_expired_time'), //过期时间
    slot: 'startTime',
  },
  {
    field: 'count',
    component: 'Input',
    required: true,
    label: t('common.gift_code_num'), //生成数量
    componentProps: {
      placeholder: t('business.banner_tip'), //请输入生成数量
    },
  },
  {
    field: 'multiple',
    component: 'Input',
    required: true,
    label: t('table.discountActivity.discount_audit_multiple'), //生成数量
    componentProps: {
      placeholder: t('business.banner_tip'), //请输入生成数量
    },
  },
];

useAutoLabelWidth(accountFormSchema);
