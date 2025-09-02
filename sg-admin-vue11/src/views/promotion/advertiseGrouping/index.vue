<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" class="ad__tooltip__table">
      <template #form-newAdd v-if="isHasAuth('30411')">
        <Button type="primary" @click="handleOpenNewAdd">{{
          t('table.advertise.add_grouping_name')
        }}</Button>
      </template>
      <template #form-modelNameSlot>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select style="width: 50%" v-model:value="currentType" class="br-none">
            <SelectOption value="name">
              {{ t('table.advertise.table_grouping_name') }}
            </SelectOption>
            <SelectOption value="account">
              {{ t('table.advertise.table_contact_account') }}
            </SelectOption>
            <SelectOption value="created_by">
              {{ t('table.google.report_columns_APP_operator') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            :allowClear="true"
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>

      <template #action="{ record }">
        <span
          class="mr-4 cursor-pointer text-[#1475e1]"
          @click="updateModal(record)"
          v-if="isHasAuth('30412')"
          >{{ t('business.common_edit') }}</span
        >
        <span
          class="cursor-pointer text-red"
          @click="showConfirm(record)"
          v-if="isHasAuth('30413')"
          >{{ t('business.common_delete') }}</span
        >
      </template>
    </BasicTable>
    <newAddModel @register="registerNewAddModal" @active-success="() => reload()" />
  </PageWrapper>
</template>

<script lang="ts" setup name="advertiseGrouping">
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchSchema } from './index.data';
  import {
    Select,
    Input,
    SelectOption,
    Button,
    message,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import newAddModel from './components/newAddModel.vue';
  import { openConfirm } from '/@/utils/confirm';
  import { postAdGroupList, getAdGroupDelete } from '/@/api/promotion';
  import { isHasAuth } from '/@/utils/authFunction';

  const { t } = useI18n();

  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);

  const [registerNewAddModal, { openModal: OpenNewAddModal }] = useModal();

  const [registerTable, { reload }] = useTable({
    api: async (params) => {
      const { data } = await postAdGroupList(params);
      return data;
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
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      showAdvancedButton: false, //是否收起
      showResetButton: false, //导出按钮隐藏
    },
    beforeFetch: (params) => {
      processingParams(params);
    },
  });
  function processingParams(params) {
    if (fromSearch.value) params[currentType.value] = fromSearch.value;
    return params;
  }
  function handleOpenNewAdd() {
    OpenNewAddModal(true, { id: false });
  }

  function updateModal(data) {
    OpenNewAddModal(true, data);
  }
  function showConfirm(record) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      `${t('business.common_delete_n', { n: record.name })}`,
      () => {
        handleDelete(record.id);
      },
      'confirmModal',
    );
  }

  async function handleDelete(id) {
    const { data, status } = await getAdGroupDelete({ id: id });
    if (status) {
      message.success(t('table.google.report_columns_APP_delete_success'));
      reload();
    } else {
      message.error(data);
    }
  }
</script>
<style lang="less">
  .ad__table__tooltip {
    max-width: 546px !important;
  }
</style>

<style lang="less" scoped>
  // 修复单子 10726， placeholder展示不全
  :deep(.ant-modal) {
    width: 810px !important;
  }
</style>
