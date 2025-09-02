<template>
  <div>
    <BasicModal
      @register="registerAddModal"
      :title="titleName"
      @ok="insertSubmit"
      @cancel="cancelClose"
      :width="560"
      :okText="okText"
      cancelText=""
    >
      <BasicForm @register="registerFromInster">
        <template #cdn_name="{ model, field }">
          <RadioGroup
            v-model:value="model[field]"
            :disabled="getType"
            @change="handleChange(model[field])"
          >
            <Radio v-for="item in domainode" :key="item.value" :value="item.value">{{
              item.label
            }}</Radio>
          </RadioGroup>
        </template>
        <template #choice="{ model, field }">
          <Select
            :disabled="getType"
            :size="FORM_SIZE"
            :placeholder="$t('common.chooseText')"
            :options="choiceOptions"
            v-model:value="model[field]"
            @change="changChoiceOptions"
          />
        </template>
        <template #demond>
          <div> {{ demondName[dataType] }}</div>
        </template>
        <template #addForm="{ field }">
          <Button v-if="Number(field) === n - 1" :disabled="n >= 10" @click="addTo" class="add-btn"
            >+</Button
          >
          <Button v-if="Number(field) > 0" @click="() => delRemove(field)" class="reduce-btn"
            >-</Button
          >
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getdomainListData, insertChildDomainName, updateChildDomain } from '/@/api/domain';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { message, RadioGroup, Radio, Select, Button } from 'ant-design-vue';
  import eventBus from '/@/utils/eventBus';
  import { demondName, domainode } from '../const';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

  const { t } = useI18n();
  const getType = ref('');
  const FORM_SIZE = useFormSetting().getFormSize;
  const choiceOptions = ref([] as any);
  const cdnName = ref('' as any);
  const dataType = ref(null as any);
  const editModal = ref(true);
  const titleName = ref(t('table.system.system_insert_demain'));
  const okText = ref(t('table.system.system_conform_add'));

  const addonTitle = ref('.com');
  const schemas: FormSchema[] = [
    {
      field: 'id',
      component: 'RadioGroup',
      label: t('table.system.system_select_node'),
      show: false,
    },
    {
      field: 'cdn_name',
      component: 'RadioGroup',
      label: t('table.system.system_select_node') + ':', //选择节点
      defaultValue: 'cloudflare',
      required: true,
      slot: 'cdn_name',
    },
    {
      field: 'domain_id',
      component: 'Select',
      required: true,
      label: t('table.system.system_certificate_select') + ':',
      slot: 'choice',
      componentProps: {
        getPopupContainer: () => document.body,
      },
    },
    {
      field: 'use_type',
      label: t('table.system.system_use_demain') + ':',
      component: 'Input',
      slot: 'demond',
    },
    {
      field: 'child_name',
      component: 'Input',
      label: t('table.system.system_valid_domain') + ':',
      required: true,
      colProps: {
        span: 18,
      },
      componentProps: {
        addonAfter: addonTitle.value,
        placeholder: t('table.system.system_example'),
      },
    },
    {
      field: '0',
      component: 'Input',
      label: ' ',
      slot: 'addForm',
      labelWidth: 27,
      colProps: {
        span: 6,
      },
      ifShow: () => editModal.value,
    },
  ];

  const [registerAddModal, { closeModal, setModalProps }] = useModalInner((data) => {
    dataType.value = data.type;
    addonTitle.value = '.com';
    updateSchema([{ field: 'child_name', componentProps: { addonAfter: addonTitle.value } }]);
    getType.value = data.edit;
    if (data.edit === 'edit') {
      editModal.value = false;
      titleName.value = t('table.system.system_edit_dimoand');
      okText.value = t('table.system.system_conform_edite');
      let typeName;
      if (data.data.cdn_type === 2) {
        typeName = 'custom';
        handleChange(typeName);
      } else {
        typeName = data.data.cdn_name;
        handleChange(typeName);
      }
      setFieldsValue({
        cdn_name: typeName,
        child_name: data.data.child_name,
        domain_id: data.data.domain_id,
        id: data.data.id,
      });
      if (data.data.domain_name) addonTitle.value = data.data.domain_name;
      else addonTitle.value = '.com';
      updateSchema([{ field: 'child_name', componentProps: { addonAfter: addonTitle.value } }]);
    } else {
      titleName.value = t('table.system.system_insert_demain');
      okText.value = t('table.system.system_conform_add');
      editModal.value = true;
      handleChange('cloudflare');
    }
  });

  const [
    registerFromInster,
    {
      validate,
      setFieldsValue,
      getFieldsValue,
      resetFields,
      setProps,
      appendSchemaByField,
      removeSchemaByField,
      updateSchema,
      clearValidate,
    },
  ] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
    size: FORM_SIZE,
  });
  useAutoLabelWidth(schemas);
  async function insertSubmit() {
    let newParams: any = {};
    const values: any = await validate();
    const arrObject: any = [];
    // 动态构建属性名称并打印属性值
    for (let i = 1; i <= n.value - 1; i++) {
      const fieldName = 'field' + i + 'a';
      arrObject.push(values[fieldName] ? values[fieldName] : null);
    }
    if (n.value === 1) {
      values[`child_name`];
    } else {
      values[`child_name`] = arrObject.length && arrObject.concat(values['child_name']).join(',');
    }
    delete values[`field${n.value}a`];
    values['use_type'] = dataType.value;
    setModalProps({ confirmLoading: true });
    //delete values['cdn_name'];
    newParams = {
      child_name: values['child_name'],
      domain_id: values['domain_id'],
      cdn_name: values['cdn_name'],
      use_type: 1,
    };
    const { status, data } = !getType.value
      ? await insertChildDomainName(newParams)
      : await updateChildDomain({ ...newParams, id: values.id });
    if (status) {
      cancelClose();
      closeModal();
      message.success(data);
      eventBus.emit('emitLoad');
      resetFields();
      setModalProps({ confirmLoading: false });
      handleChange('cloudflare');
    } else {
      message.error(data);
      setModalProps({ confirmLoading: false });
    }
  }
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
    if (getType.value !== 'edit') {
      setFieldsValue({ domain_id: null });
      clearValidate();
      updateSchema([{ field: 'child_name', componentProps: { addonAfter: '.com' } }]);
      for (let i = 1; i <= n.value; i++) {
        updateSchema([{ field: `field${i}a`, componentProps: { addonAfter: '.com' } }]);
      }
    }
    choiceOptions.value = getData;
  }
  const n = ref(1);
  function addTo() {
    appendSchemaByField(
      {
        field: `field${n.value}a`,
        component: 'Input',
        label: t('table.system.system_valid_domain') + Number(n.value + 1),
        required: true,
        colProps: {
          span: 18,
        },
        componentProps: {
          addonAfter: addonTitle.value,
        },
      },
      '',
    );
    appendSchemaByField(
      {
        field: `${n.value}`,
        component: 'Input',
        label: ' ',
        labelWidth: 27,
        slot: 'addForm',
        colProps: {
          span: 6,
        },
      },
      '',
    );
    updateSchema([{ field: `field${n.value}a`, componentProps: { addonAfter: addonTitle.value } }]);
    n.value++;
  }
  function delRemove(field: string | number) {
    field = parseInt(field);
    while (field < n.value - 1) {
      setFieldsValue({ ['field' + field + 'a']: getFieldsValue()[`field${field + 1}a`] });
      field++;
    }
    removeSchemaByField([`field${n.value - 1}a`, `${n.value - 1}`]);
    n.value--;
  }
  function resetFun() {
    while (n.value > 0) {
      removeSchemaByField([`field${n.value}a`, `${n.value}`]);
      n.value--;
    }
    if (n.value == 0) {
      n.value = 1;
      return;
    }
  }
  function cancelClose() {
    addonTitle.value = '.com';
    resetFun();
    resetFields();
  }

  function changChoiceOptions(v, obj) {
    if (obj['label']) {
      addonTitle.value = obj['label'];
    } else {
      addonTitle.value = '.com';
    }
    updateSchema([{ field: 'child_name', componentProps: { addonAfter: addonTitle.value } }]);
    for (let i = 1; i <= n.value; i++) {
      updateSchema([{ field: `field${i}a`, componentProps: { addonAfter: addonTitle.value } }]);
    }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-btn) {
    position: relative;
    width: 52px;
    height: 38px;
    float: left;
  }

  ::v-deep(.ant-col-6) {
    padding-left: 13px;

    .ant-form-item-control > div > div > div > div > div {
      display: flex;
    }

    .ant-form-item-label {
      width: 0 !important;
    }

    .ant-form-item-no-colon {
      width: 0 !important;
    }

    .add-btn {
      margin-right: 10px;
      background-image: url('/@/assets/images/add-black.webp');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 21px;
      color: transparent;
    }

    .reduce-btn {
      background-image: url('/@/assets/images/reduce-black.webp');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 21px;
      color: transparent;
    }
  }
</style>
