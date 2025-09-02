<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('modalForm.system.system_settings_deposit')"
    @ok="handleSubmit"
    :showOkBtn="!isReadOnly"
    :showCancelBtn="!isReadOnly"
  >
    <BasicForm @register="registerForm" @submit="handleSubmit">
      <template #site-form>
        <Tabs v-model:activeKey="activeKey">
          <TabPane
            v-for="item in tabsFormSchema"
            :key="item.key"
            v-bind="omit(item, ['Form', 'key'])"
          >
            <BasicForm v-if="item.Form" @register="item.Form[0]" />
          </TabPane>
        </Tabs>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup name="AccessMoneySettingModal">
  import { ref, reactive } from 'vue';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormProps, UseFormReturnType } from '/@/components/Form';
  import { schema, getSchemaBase } from './accessMoneySettingModal.data';
  import { omit } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  type TabsFormType = {
    key: string;
    tab: string;
    forceRender?: boolean;
    Form?: UseFormReturnType;
  };

  const activeKey = ref('deposit');
  const emit = defineEmits(['submit', 'register']);

  const props = defineProps({
    isReadOnly: {
      type: Boolean,
      default: false,
    },
  });

  const [registerForm, { resetFields }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 22 },
    schemas: schema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 22,
    },
    size: FORM_SIZE,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    for (const item of tabsFormSchema) {
      const { setFieldsValue } = item.Form[1];
      setFieldsValue({ ...data.record[item.key] });
    }
  });

  const baseFormConfig: Partial<FormProps> = {
    disabled: props.isReadOnly,
    showActionButtonGroup: false,
    labelWidth: 100,
    size: FORM_SIZE,
  };

  const tabsFormSchema: TabsFormType[] = reactive([
    {
      key: 'deposit',
      tab: t('modalForm.finance.finance_min_deposit'),
      forceRender: true,
      Form: useForm(
        Object.assign({ schemas: [...getSchemaBase('deposit')] }, baseFormConfig) as FormProps,
      ),
    },
    {
      key: 'withdraw',
      tab: t('modalForm.system.system_min_withdrawal'),
      forceRender: true,
      Form: useForm(
        Object.assign({ schemas: [...getSchemaBase('withdraw')] }, baseFormConfig) as FormProps,
      ),
    },
  ]);

  async function handleSubmit() {
    let lastKey = '';
    try {
      const values: any = {};
      for (const item of tabsFormSchema) {
        lastKey = item.key;
        const { validate, getFieldsValue } = item.Form[1];
        await validate();
        values[item.key] = getFieldsValue();
      }
      emit('submit', { values });
      closeModal();
    } catch (e) {
      // 验证失败或出错，切换到对应标签页
      activeKey.value = lastKey;
      console.error(e);
    }
  }
</script>
