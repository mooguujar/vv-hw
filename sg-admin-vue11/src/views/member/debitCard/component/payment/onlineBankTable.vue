<template>
  <div>
    <BasicTable @register="registerTable">
      <template #form-custom>
        <div class="flex items-center justify-center">
          <InputGroup class="flex" compact>
            <Select style="width: 38%" v-model:value="currentType" class="pay-select">
              <SelectOption value="userName">
                {{ $t('business.common_agent_account') }}
              </SelectOption>
              <SelectOption value="cardId"> {{ $t('business.common_realiy_name') }} </SelectOption>
            </Select>
            <Input
              style="width: 59%"
              class="pay-input"
              allowClear
              :placeholder="$t('common.separateMultiples')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: `${
                  record.state === 1
                    ? t('business.common_deactivate')
                    : t('business.common_on_activate')
                }`,
                icon: 'ant-design:stop-outlined',
                color: `${record.state === 0 ? 'success' : 'error'}`,
                disabled: record?.isDefault === 1,
                onClick: showConfirm.bind(
                  null,
                  record,
                  'use',
                  record.state === 1 ? t('common.stopMemberTips') : t('common.activeMemberTips'),
                ),
                // popConfirm: {
                //   title: `您确定要${record.state === 1 ? '停用' : '启用'}该会员吗？`,
                //   placement: 'left',
                //   confirm: disabledFun.bind(null, record),
                // },
              },
              {
                label: t('business.common_edit'),
                onClick: editFun.bind(null, record),
                icon: 'ant-design:edit-outlined',
              },
              {
                label: t('common.delete'),
                icon: 'ant-design:delete-outlined',
                color: 'error',
                onClick: showConfirm.bind(null, record, 'del', t('common.deleteCard')),
                // popConfirm: {
                //   title: '您确定删除该银行卡吗？',
                //   placement: 'left',
                //   confirm: handleDelete.bind(null, record),
                // },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Select, Input, InputGroup, SelectOption } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  //import editModal from '../../component/editModal.vue';
  const { t } = useI18n();
  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
  });
  const currentType = ref<any>('userName');
  const [registerTable] = useTable({
    api: outpayList,
    columns: props.apiMap.columns,
    showIndexColumn: false,
    formConfig: {
      schemas: props.apiMap.schemas,
      labelWidth: 120,
      actionColOptions: {
        class: 't-form-col',
        xxl: 12,
        xl: 12,
        lg: 12,
      },
      submitButtonOptions: {
        text: t('business.common_inquire'),
      },
      resetButtonOptions: {
        text: t('common.export'),
      },
    },
    bordered: true,
    useSearchForm: true,
    // showTableSetting: true,
    actionColumn: {
      width: 220,
      title: t('component.upload.operating'),
      dataIndex: 'action',
      // fixed: 'right',
    },
  });
  async function outpayList(tableParams: { rows: number; page: number }) {
    return props.apiMap.list({ ...tableParams, type: props.apiMap.modalType });
  }
  function editFun(value) {
    // openModal(true, {
    //   value,
    //   isUpdate: false,
    // });
  }
  function showConfirm(record, type, msg) {
    // openConfirm('操作确认', msg, () => {
    //   if (type === 'use') {
    //     disabledFun(record);
    //   } else if (type === 'del') {
    //     handleDelete(record);
    //   }
    // });
  }
</script>
