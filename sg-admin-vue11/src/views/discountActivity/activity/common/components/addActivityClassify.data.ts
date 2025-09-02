import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { FormSchema } from '/@/components/Form/index';

const { t } = useI18n();
const newPw = ref('');
/** 新增分类 */
export const addActivityClassify: FormSchema[] = [
  {
    field: 'name',
    component: 'Input',
    label: t('common.category_name') + ':',
    labelWidth: 'auto',
    defaultValue: '',
    componentProps: () => {
      return {
        size: 'large',
        rows: 2,
        placeholder: t('common.input_category_name'),
        maxLength: 20,
        allowClear: false,
      };
    },
    rules: [
      {
        required: true,
        validator: async (rule, value) => {
          if (value) {
            newPw.value = value;
          }
          if (!value) {
            return Promise.reject(t('common.input_category_name'));
          }
          /* const regex = /^[a-zA-Z0-9]\w{2,19}$/;
          if (value.length < 2 || value.length > 20 || !regex.test(value)) {
            return Promise.reject(t('分类名称只能输入2-20位的数字、字母'));
          } */
          return Promise.resolve();
        },
        trigger: 'blur',
      },
    ],
  },
];
