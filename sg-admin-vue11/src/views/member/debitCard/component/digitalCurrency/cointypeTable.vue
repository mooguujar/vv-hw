<template>
  <BasicTable @register="registerUsdt" :scroll="{ y: scrollHeight }">
    <template #customTableHeader>
      <slot></slot>
    </template>
    <template #form-custom>
      <div class="flex items-center justify-center mr-10px">
        <InputGroup class="flex" compact>
          <Select
            :style="{
              minWidth: calculateWidth(useI18n().t('business.common_member_account')).width,
              width: '48%',
            }"
            v-model:value="currentType"
            class="pay-select"
          >
            <SelectOption value="username">{{ $t('business.common_member_account') }}</SelectOption>
            <!-- <SelectOption value="open_name">{{ $t('business.common_realiy_name') }}</SelectOption> -->
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
    <template #action="{ column, record }">
      <TableAction :actions="createActions(record)" />
    </template>
  </BasicTable>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { Select, Input, InputGroup, SelectOption, message } from 'ant-design-vue';
  import { updateWalletState } from '/@/api/member/index';
  import { openConfirm } from '/@/utils/confirm';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import { calculateWidth } from '/@/utils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight480 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight480).value);
  const currentType = ref<any>('username');
  const fromSearch = ref<any>('');
  const props = defineProps({
    apiMap: {
      type: Object,
      default: () => {},
    },
  });
  const [registerUsdt, { reload, getForm, getColumns, setColumns }] = useTable({
    api: getWalletListApi,
    columns: props.apiMap.columns,
    useSearchForm: true,
    showIndexColumn: false,
    bordered: true,
    formConfig: {
      schemas: props.apiMap.schemas,
      showResetButton: false,
      resetButtonOptions: {
        text: t('common.export'),
      },
      actionColOptions: {
        class: 'inquireButtonBox t-form-col t-form-label-com',
      },
    },
    actionColumn: {
      minWidth: 80,
      title: t('business.common_operate'),
      dataIndex: 'action',
      // fixed: 'right',
      slots: { customRender: 'action' },
      ifShow: auths(['10806', '10807']),
    },
    beforeFetch: (param) => {
      if (currentType.value && fromSearch.value) {
        param[currentType.value] = fromSearch.value;
      }
    },
  });
  // function editFun() {
  // }
  async function getWalletListApi(tableParams: { rows: number; page: number }) {
    return props.apiMap.list({ ...tableParams, currency_id: props.apiMap.modalType });
  }
  async function showConfirm(record, type, msg) {
    openConfirm(
      t('common.warning'),
      msg,
      async () => {
        const state = record.state === 2 ? 1 : 2;
        if (type === 'use') {
          const { status, data } = await updateWalletState({ id: record.id, state: state });
          if (status) {
            await reload();
            message.success(data);
          }
          //disabledFun(record);
        } else if (type === 'del') {
          const { status, data } = await updateWalletState({ id: record.id, state: 3 });
          if (status) {
            await reload();
            message.success(data);
          }
        }
      },
      'class',
    );
  }
  function createActions(record) {
    const actions: ActionItem[] = [
      {
        label:
          record.state === 1 ? t('business.common_deactivate') : t('business.common_on_activate'),

        color: `${record.state === 2 ? 'success' : 'error'}`,
        disabled: record?.isDefault === 1,
        onClick: showConfirm.bind(
          null,
          record,
          'use',
          `${t('table.member.member_are_you')} ${(record.state === 1
            ? t('business.common_deactivate')
            : t('business.common_on_activate')
          ).toLowerCase()} ${t('table.member.member_account_adress')}`,
        ),
        ifShow: isHasAuth('10806'),
      },
      {
        label: t('common.delText'),
        ifShow: isHasAuth('10807'),
        color: 'error',
        onClick: showConfirm.bind(null, record, 'del', t('table.member.member_delete_adress')),
      },
    ];
    return actions;
  }
  onMounted(() => {});
  defineExpose({ reload, getForm });
</script>
