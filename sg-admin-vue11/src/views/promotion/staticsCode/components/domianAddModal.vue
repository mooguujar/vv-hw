<template>
  <div ref="main" class="venuesClassZoom">
    <BasicModal
      @register="registerNewAddModal"
      :title="title"
      v-bind="$attrs"
      okText=""
      :width="800"
      :height="500"
      cancelText=""
      :destroyOnClose="true"
      :footer="null"
      @cancel="handleCancel"
      :getContainer="() => $refs.main"
      @visible-change="visibleChange"
    >
      <BasicTable @register="registerTable">
        <template #form-modelNameSlot>
          <FormItemRest>
            <InputGroup class="!flex" compact>
              <Select style="width: 40%" v-model:value="currentType" class="br-none">
                <SelectOption value="name">
                  {{ t('common.domain') }}
                </SelectOption>
                <SelectOption value="updated_name">
                  {{ t('business.common_operate_people') }}
                </SelectOption>
              </Select>
              <Input
                style="width: 59%"
                allowClear
                :placeholder="t('common.inputText')"
                v-model:value="fromSearch"
              />
            </InputGroup>
          </FormItemRest>
        </template>
        <template #form-submitSlot>
          <Button class="ml-1.5" type="primary" @click="getForm().submit()">{{
            t('common.queryText')
          }}</Button>
        </template>
        <template #action="{ record }">
          <span class="cursor-pointer text-red" @click="showConfirm(record)">{{
            t('common.delText')
          }}</span>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Button, Input, InputGroup, Select, SelectOption, message } from 'ant-design-vue';
  import { columns, searchSchema } from './domian.data';
  import { cloneDeep } from 'lodash-es';
  import { getStaticsCodeDomainList, getStaticsCodeDomainDelete } from '/@/api/promotion';
  import { openConfirm } from '/@/utils/confirm';
  import { ref, defineEmits } from 'vue';

  const { t } = useI18n();
  const emits = defineEmits(['activeSuccess', 'register']);

  const title = ref('');
  const domainId = ref('');
  const total = ref(0);
  /** 查询参数相关 */
  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);

  const [registerNewAddModal, { closeModal }] = useModalInner(async (data) => {
    title.value = t('table.google.report_columns_APP_domain_name');
    domainId.value = data.id;
    if (data.name) title.value = `${title.value} (${data.name})`;
  });
  /** 初始化表单 */
  const [registerTable, { reload, getForm }] = useTable({
    api: async (params) => {
      const { data } = await getStaticsCodeDomainList(params);
      const _data = cloneDeep(data);
      delete _data.c;
      return _data;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    striped: true,
    showIndexColumn: false,
    formConfig: {
      labelWidth: 120,
      schemas: searchSchema,
      actionColOptions: {
        class: 't-form-col t-form-label-com inquireButtonBox',
      },
      customClassForm: true,
      showSubmitButton: false,
      showAdvancedButton: false, //是否收起
      showResetButton: false, //导出按钮隐藏
    },
    beforeFetch: (params) => {
      processingParams(params);
    },
    afterFetch: (data) => {
      total.value = data.length;
    },
  });
  function processingParams(params) {
    params['pid'] = domainId.value;
    if (currentType.value === 'name') params['flag'] = 1;
    if (currentType.value === 'updated_name') params['flag'] = 2;
    if (fromSearch.value) params['value'] = fromSearch.value;
    return params;
  }
  /** 确认删除 */
  function showConfirm(record: { id: any }) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      t('common.confirm_delete'),
      () => {
        handleDelete(record.id);
      },
      'confirmModal',
    );
  }
  /** 删除操作 */
  async function handleDelete(id: any) {
    if (total.value === 1) {
      message.error(t('common.delete_domain_least_one'));
      return;
    }
    const { data, status } = await getStaticsCodeDomainDelete({ id: id });
    if (status) {
      message.success(t('layout.setting.operatingTitle'));
      reload();
    } else {
      message.error(data);
    }
  }
  /** 切换弹窗 */
  function visibleChange(visible: boolean) {
    if (!visible) {
      getForm().resetFields();
    }
  }
  /** 关闭弹窗 */
  function handleCancel() {
    emits('activeSuccess');
    closeModal();
  }
</script>
<style lang="scss" scoped></style>
