<template>
  <div>
    <BasicModal
      :width="560"
      :title="setTitle"
      @register="registerUpload"
      @ok="handleSubmit"
      :okText="$t('table.system.system_conform_add')"
      cancelText=""
    >
      <BasicForm @register="registerForm">
        <template #cdn_name="{ model, field }">
          <RadioGroup v-model:value="model[field]" @change="handleChange(model[field])">
            <Radio v-for="item in domainode" :key="item.value" :value="item.value"
              >{{ item.label }}
            </Radio>
          </RadioGroup>
        </template>
        <template #choice="{ model, field }">
          <Select
            :size="FORM_SIZE"
            :placeholder="t('common.chooseText')"
            :options="choiceOptions"
            v-model:value="model[field]"
          />
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { ref } from 'vue';
  import { Select, message, RadioGroup, Radio } from 'ant-design-vue';
  import { getdomainListData, createResolveDomain, updateResolveDomain } from '/@/api/domain';
  import { customizeOptions, ttlOptions, domainode } from '../const';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const schemas: FormSchema[] = [
    {
      field: 'id',
      label: t('table.system.system_userid') + '：',
      component: 'Input',
      show: false,
    },
    {
      field: 'cdn_name',
      component: 'RadioGroup',
      label: t('table.system.system_select_node') + '：',
      defaultValue: 'cloudflare',
      required: true,
      slot: 'cdn_name',
      ifShow: ({ values }) => !values.id,
    },
    {
      field: 'domain_id',
      component: 'Select',
      label: t('table.system.system_select_value') + '：',
      required: true,
      slot: 'choice',
      ifShow: ({ values }) => !values.id,
      componentProps: {
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'host_record',
      component: 'Input',
      label: t('table.system.system_domain_record') + '：',
      required: true,
    },
    {
      field: 'resolve_type',
      component: 'Select',
      label: t('table.system.system_parse_values') + '：',
      required: true,
      componentProps: {
        options: customizeOptions,
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'record_value',
      component: 'Input',
      label: t('table.system.system_parse_record') + '：',
      required: true,
    },
    {
      field: 'ttl',
      component: 'Select',
      required: true,
      defaultValue: 600,
      label: 'TTL：',
      componentProps: {
        options: ttlOptions,
        getPopupContainer: () => document.body,
      },
    },
  ];
  useAutoLabelWidth(schemas);
  const getKey = ref(null as any);
  const choiceOptions = ref([] as any);
  const cdnName = ref('' as any);
  const setTitle = ref(t('table.system.system_new_dimoand') as any);
  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 22 },
    size: FORM_SIZE,
  });
  const [registerUpload, { closeModal, setModalProps }] = useModalInner((data) => {
    getKey.value = data.id;
    resetFields();
    if (data.id) {
      setFieldsValue(data);
      setTitle.value = t('table.system.system_edit_dimoand');
    }
  });

  //这里会报错，组件未创建
  async function handleChange(value) {
    let data = [];
    if (value == 'custom') {
      data = await getdomainListData({
        page: 1,
        page_size: 9999,
        cdn_type: 2,
        state: 1,
      });
    } else {
      cdnName.value = value;
      data = await getdomainListData({
        page: 1,
        page_size: 9999,
        cdn_name: cdnName.value,
        state: 1,
      });
    }
    const getData = data?.d?.map((item: any) => {
      return { label: item.name, value: item.id };
    });
    setFieldsValue({ domain_id: null });
    choiceOptions.value = getData;
  }

  async function handleSubmit() {
    const values = await validate();
    delete values['cdn_name'];
    setModalProps({ confirmLoading: true });
    const { data, status } = getKey.value
      ? await updateResolveDomain(values)
      : await createResolveDomain(values);
    if (status) {
      message.success(data);
      eventBus.emit('emitLoad');
      resetFields();
      setModalProps({ confirmLoading: false });
      closeModal();
    } else {
      message.error(data);
      setModalProps({ confirmLoading: false });
    }
  }
</script>
