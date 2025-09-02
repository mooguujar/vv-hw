<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-newAdd v-if="isHasAuth('90232')">
        <Button class="!mr-2.5" type="primary" @click="handleOpenNewAdd({ type: 1 })">{{
          t('business.add_new')
        }}</Button>
      </template>
      <template #form-modelNameSlot>
        <FormItemRest>
          <InputGroup class="!flex" compact>
            <Select style="width: 50%" v-model:value="currentType" class="br-none">
              <SelectOption value="name">
                {{ t('table.google.report_columns_APP_statistical_name') }}
              </SelectOption>
              <SelectOption value="domain">
                {{ t('common.domain') }}
              </SelectOption>
              <SelectOption value="updated_name">
                {{ t('table.system.operater') }}
              </SelectOption>
            </Select>
            <Input
              style="width: 49%"
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
      <template #codeSlots="{ record }">
        <div class="flex items-center">
          <span
            class="ml-1"
            style="
              display: inline-block;
              width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
            >{{ `${record.code}` }}</span
          >
          <span class="ml-1 primary-color cursor" @click="handleCopy(record)">{{
            t('modalForm.finance.common_income.copy')
          }}</span>
        </div>
      </template>
      <template #domainTotal="{ record }">
        <span
          v-if="record.total > 0"
          class="text-[#1475e1] cursor-pointer"
          @click="
            openDomianModal(true, {
              name: record.name,
              id: record.id,
            })
          "
          >{{ record.total }}</span
        >
        <span v-else>0</span>
      </template>
      <template #action="{ record }" v-if="auths(['90233', '90234'])">
        <span
          v-if="isHasAuth('90233') && record.status !== 1"
          class="mr-4 cursor-pointer text-[#1475e1]"
          @click="handleOpenNewAdd({ type: 3, ...record })"
          >{{ t('common.editorText') }}</span
        >
        <span
          class="cursor-pointer text-red"
          @click="showConfirm(record)"
          v-if="isHasAuth('90234')"
          >{{ t('common.delText') }}</span
        >
      </template>
    </BasicTable>
    <newAddPrice @register="registerNewAddPriceModal" @active-success="() => reload()" />
    <domianAddModal @register="registerDomianModal" @active-success="() => reload()" />
  </PageWrapper>
</template>

<script lang="ts" setup name="racePriceRoi">
  import { ref, unref } from 'vue';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema } from './index.data';
  import {
    InputGroup,
    Select,
    Input,
    SelectOption,
    FormItemRest,
    Button,
    message,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import newAddPrice from './components/newAddPrice.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import domianAddModal from './components/domianAddModal.vue';
  import { getStaticsCodeList, getStaticsCodeDelete } from '/@/api/promotion';
  import { cloneDeep } from 'lodash-es';
  import { openConfirm } from '/@/utils/confirm';
  import { isHasAuth, auths } from '/@/utils/authFunction';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(340).value);
  /** 查询相关字段 */
  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);

  const [registerNewAddPriceModal, { openModal: openNewAddModal }] = useModal();
  const [registerDomianModal, { openModal: openDomianModal }] = useModal();
  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const { createMessage } = useMessage();

  const [registerTable, { reload, getForm, setPagination }] = useTable({
    api: async (params) => {
      const { data } = await getStaticsCodeList(params);
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
  });
  /** 复制操作 */
  function handleCopy(record) {
    clearClipboard();
    clipboardRef.value = record.code;
    if (unref(copiedRef)) {
      createMessage.success(t('business.common_copy_suceess'));
    }
  }
  function processingParams(params) {
    setDateParmaTime(params);
    setDateParmas(params);
    if (params['start_time'] && params['end_time']) {
      params['st'] = params['start_time'];
      params['et'] = params['end_time'];
      delete params['start_time'];
      delete params['end_time'];
    }
    if (fromSearch.value) {
      if (currentType.value === 'name') params['flag'] = 1;
      else if (currentType.value === 'domain') params['flag'] = 2;
      else if (currentType.value === 'updated_name') params['flag'] = 3;
      params['value'] = fromSearch.value;
    }
    return params;
  }
  /** 新增、编辑事件 */
  function handleOpenNewAdd(data: any) {
    openNewAddModal(true, data);
  }

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
  async function handleDelete(id: any) {
    const { data, status } = await getStaticsCodeDelete({ id: id });
    if (status) {
      message.success(t('layout.setting.operatingTitle'));
      setPagination({ current: 1 });
      reload();
    } else {
      message.error(data);
    }
  }
</script>
<style lang="less" scoped></style>
