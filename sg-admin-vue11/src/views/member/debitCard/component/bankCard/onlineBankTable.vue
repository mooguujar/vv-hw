<template>
  <BasicTable @register="registerTable" :columns="apiMap.columns" :scroll="{ y: scrollHeight }">
    <template #form-custom>
      <div class="flex items-center justify-center mr-10px">
        <InputGroup class="flex" compact>
          <Select style="width: 48%" v-model:value="currentType" class="pay-select">
            <SelectOption value="username">{{ $t('business.common_member_account') }}</SelectOption>
            <SelectOption value="open_name">{{ $t('business.common_realiy_name') }}</SelectOption>
            <SelectOption value="email">
              {{ $t('business.common_email_account') }}
            </SelectOption>
            <SelectOption value="phone">
              {{ $t('business.common_phone_number') }}
            </SelectOption>
          </Select>
          <Input
            style="width: 52%"
            class="pay-input"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </InputGroup>
      </div>
    </template>
    <template #customTableHeader>
      <slot></slot>
    </template>
    <template #action="{ column, record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>
  <editCardForm
    @register="registerCardForm"
    :currency_id="curryId"
    @diamondsuccess="diamondsuccess"
  />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import editCardForm from './components/editCardForm.vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { Select, Input, InputGroup, SelectOption, message } from 'ant-design-vue';
  import { openConfirm } from '/@/utils/confirm';
  import { updateBankState, bankcard_delete } from '/@/api/member/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auths, isHasAuth } from '@/utils/authFunction';
  import { useModal } from '/@/components/Modal';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight480 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight480).value);

  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
    curryId: {
      type: Object,
      default: '',
    },
  });
  const currentType = ref<any>('username');
  const fromSearch = ref<any>('');

  const [registerTable, { reload, getColumns, setColumns, getForm }] = useTable({
    api: outpayList,
    showIndexColumn: false,
    formConfig: {
      showAdvancedButton: true,
      schemas: props.apiMap.schemas,
      showResetButton: false,
      resetButtonOptions: {
        text: t('common.export'),
      },
      actionColOptions: {
        class: 'inquireButtonBox t-form-col t-form-label-com',
      },
    },
    bordered: true,
    useSearchForm: true,
    actionColumn: {
      minWidth: 80,
      title: t('business.common_operate'),
      dataIndex: 'action',
      slots: { customRender: 'action' },
      ifShow: auths(['10806', '10807']),
    },
    beforeFetch: (param) => {
      if (currentType.value && fromSearch.value) {
        param[currentType.value] = fromSearch.value;
      }
    },
  });
  const [registerCardForm, { openModal: CardForm }] = useModal();
  function diamondsuccess() {
    reload();
  }
  const createActions = (record) => {
    const actions: ActionItem[] = [
      {
        label: `${
          record.state === 1 ? t('business.common_deactivate') : t('business.common_on_activate')
        }`,
        color: `${record.state === 2 ? 'success' : 'error'}`,
        disabled: record?.isDefault === 1,
        onClick: showConfirm.bind(
          null,
          record,
          'use',
          `${t('table.member.member_are_you')} ${(record.state === 1
            ? t('business.common_deactivate')
            : t('business.common_on_activate')
          ).toLowerCase()} ${t('table.member.member_this_account')}`,
        ),
        ifShow: isHasAuth('10806'),
      },
      {
        label: t('common.editorText'),
        onClick: handleEdit.bind(null, record),
      },
      {
        label: t('common.delText'),
        color: 'error',
        ifShow: isHasAuth('10807'),
        onClick: showConfirm.bind(null, record, 'del', t('table.member.member_delete_account')),
      },
    ];
    return actions;
  };
  function handleEdit(record: any): void {
    CardForm(true, record);
  }
  async function outpayList(tableParams: { rows: number; page: number }) {
    return props.apiMap.list({ ...tableParams, currency_id: props.apiMap.modalType });
  }

  function showConfirm(record: any, type: any, msg: any) {
    openConfirm(
      t('common.warning'),
      msg,
      async () => {
        const state = record.state === 2 ? 1 : 2;
        if (type === 'use') {
          const { data, status } = await updateBankState({ id: record.id, state: state });
          if (status) {
            await reload();
            message.success(data);
          }
        } else if (type === 'del') {
          const { data, status } = await bankcard_delete({ id: record.id, state: 3 });
          if (status) {
            message.success(data);
            await reload();
          }
        }
      },
      'class',
    );
  }
  defineExpose({ reload, getForm });
</script>

<style>
  .ant-modal-confirm-content {
    line-height: 1.5 !important;
  }
</style>
