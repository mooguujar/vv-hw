<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    @ok="handleSubmit"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
    width="580px"
    id="regionCountry_wrap_log"
  >
    <BasicForm @register="registerForm">
      <template #area-limit="{ model, field }">
        <Select
          :disabled="!!model['id']"
          show-search
          v-model:value="model[field]"
          :size="FORM_SIZE"
          :placeholder="t('table.system.selectCountry')"
          :fieldNames="{ label: 'name', value: 'id' }"
          :options="datalist"
          @search="handleSearch"
          @change="(_, value) => handleChange(_, value)"
          :searchValue="searchValue"
          :not-found-content="fetching ? '' : ''"
          allowClear
          :filterOption="false"
        >
          <!-- @change="(value) => handelChange(value, model)" -->
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
          <template #suffixIcon>
            <SearchOutlined />
          </template>
        </Select>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './addAreaModal.data.ts';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { insertArealimit, updateArealimit } from '/@/api/sys';
  import { getLimitCountry } from '/@/api/site';
  import { message, Select, Spin } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { SiteId } from '/@/views/common/commonSetting';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { useDebounceFn } from '@vueuse/core';
  const { t } = useI18n();
  const getCountry = ref('' as any);
  const datalist = ref([] as any);
  const emits = defineEmits(['emit']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const getTitle = ref(`t('table.system.system_add_area')` as any);

  const fetching = ref(false as any);

  const searchValue = ref('' as any);
  const [registerForm, { setFieldsValue, updateSchema, validate, resetFields }] = useForm({
    baseColProps: { span: 24 },
    schemas: accountFormSchema,
    showActionButtonGroup: false,
    actionColOptions: {
      span: 24,
    },
    size: FORM_SIZE,
  });
  const title = ref('' as string);
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    await resetFields();
    searchValue.value = '';
    handleSearch('');
    getTitle.value = t('table.system.system_add_area');
    if (data.id) {
      getTitle.value = t('table.system.system_edit_area');
      handleSearch(data.country_name);
      await setFieldsValue({ id: data.id, remark: data.remark, country_id: data.country_id });
    }
    setModalProps({ confirmLoading: false });
  });
  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      values.site_id = SiteId;
      values['area_code'] = getCountry.value;
      const { status, data } = values.id
        ? await updateArealimit(values)
        : await insertArealimit(values);
      if (status) {
        message.success(data);
        closeModal();
        emits('success');
      } else {
        message.error(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
  const handleSearch = useDebounceFn(async (value) => {
    searchValue.value = value;
    // 确保输入长度至少为3个字符
    // if (!value || value.length < 2) {
    // 	datalist.value = []; // 清空现有数据列表（可选）
    // 	return false;
    // }
    fetching.value = true;
    //if (value.length >= 2) {
    try {
      const data = await getLimitCountry({ name: value });
      datalist.value = data;
    } catch (error) {
      datalist.value = []; // 出错时清空数据列表
    } finally {
      fetching.value = false;
    }
    //}
  }, 800);
  const handleChange = (v, s) => {
    getCountry.value = s?.name?.split(/\s*-\s*/)[1];
  };
  //return { registerModal, registerForm, handleSubmit, title, getTitle, handleSearch, datalist, fetching, searchValue, t,FORM_SIZE };
</script>
<style lang="less" scoped>
  // ::v-deep(.ant-col.ant-col-24 .ant-form-item-explain-error) {
  //   transform: translateY(-10px);
  // }

  // ::v-deep(.ant-select) {
  //   width: 674px !important;
  //   overflow: hidden !important;
  // }
</style>
./addAreaModal.data.js
