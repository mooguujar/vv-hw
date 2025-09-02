import { useI18n } from '/@/hooks/web/useI18n';
import { ref, reactive, computed, watch, toRaw } from 'vue';
import { urlClear, directoryClear } from '/@/api/domain/index';
import type { Rule } from 'ant-design-vue/es/form';
import { useFormValidor } from '/@/store/FormValidor';

// 切换清理方式
let api: any = urlClear;
export function useSwitch() {
  const { t } = useI18n();
  const activeKey = ref('0');
  const options = [
    {
      value: '0',
      label: t('v.sytem.site.URL_clear'),
    },
    // {
    //   value: '1',
    //   label: t('v.sytem.site.directory_clear'),
    // },
  ];
  watch(activeKey, () => {
    api = activeKey.value === '0' ? urlClear : directoryClear;
  });
  return { activeKey, options };
}

// formdata和提交
export function useform() {
  const formValidor = useFormValidor();
  const formData = reactive({
    name: '',
  });
  const rules: Record<string, Rule[]> = {
    name: [formValidor.required],
  };
  const nameMiddleWare = computed({
    set(val: string) {
      formData.name = val.replaceAll('\n', ',').replaceAll(' ', '');
    },
    get() {
      return formData.name.replaceAll(',', '\n');
    },
  });
  const loading = ref(false);
  const formIns = ref<any>(null);
  async function submit() {
    await formIns.value?.validate();
    loading.value = true;
    api(toRaw(formData))
      .then((res) => {
        nameMiddleWare.value = '';
      })
      .finally(() => (loading.value = false));
  }
  return { nameMiddleWare, formData, rules, formIns, submit, loading };
}
