<template>
  <div class="LayoutTable">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #form-createIpb>
        <a-button
          style="margin-right: 10px"
          type="primary"
          danger
          :disabled="isControlValueSet()"
          v-show="checkedKeys.length > 0"
          @click="showConfirm(null, 2)"
          v-if="isHasAuth('70254')"
          >{{ $t('business.batch_delete') }}</a-button
        >
      </template>
      <template #form-createIp>
        <a-button
          type="primary"
          :disabled="isControlValueSet()"
          v-if="isHasAuth('70252')"
          @click="handleEdit(null, 'add')"
          style="margin-right: 10px"
          >{{ $t('table.risk.report_new_ip') }}</a-button
        >
      </template>

      <template #form-startDate="{ model, field }">
        <a-date-picker
          :placeholder="$t('business.common_time_please')"
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <a-date-picker
          :placeholder="$t('business.common_time_please')"
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #form-custom>
        <a-input-group compact style="display: flex">
          <a-select
            style="width: 38%"
            v-model:value="currentType"
            class="pay-select"
            :listHeight="500"
          >
            <a-select-option value="ip">
              {{ $t('table.risk.report_ip_address') }}
            </a-select-option>
            <a-select-option value="updated_name">{{
              $t('table.risk.report_operate_people')
            }}</a-select-option>
          </a-select>
          <a-input
            class="pay-input"
            style="width: 62%; margin-right: 10px"
            allowClear
            :placeholder="$t('business.common_search_tip')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #action="{ record }">
        <span
          class="primary-color cursor p1"
          v-if="isHasAuth('70253')"
          @click="handleEdit(record, 'edit')"
          >{{ $t('business.common_edit') }}
        </span>
        <span class="text-red cursor p1" v-if="isHasAuth('70254')" @click="showConfirm(record, 1)"
          >{{ $t('business.common_delete') }}
        </span>
      </template>
    </BasicTable>
    <AddBlacklistModal @register="registerModal" @reload="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import AddBlacklistModal from './addBlacklistModal.vue';
  import { columns, searchFormSchema } from './ip.data';
  import { useModal } from '/@/components/Modal';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { openConfirm } from '/@/utils/confirm';
  import { DatePicker, Input, Select, TableProps } from 'ant-design-vue';
  import { deleteWhitelistList, getWhitelistList } from '/@/api/sys';
  import { setDateParmas } from '/@/utils/dateUtil';
  import { isHasAuth } from '/@/utils/authFunction';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  export default defineComponent({
    name: 'IpWhitelistNocash',
    components: {
      [Select.name]: Select,
      [DatePicker.name]: DatePicker,
      [Input.Group.name]: Input.Group,
      [Input.name]: Input,
      BasicTable,
      AddBlacklistModal,
      ASelectOption: Select.Option,
    },
    setup() {
      const scrollHeight = Number(useScrollerHeight(340).value);
      const userStore = useUserStoreWithOut();
      const model = ref<FormModel>({
        start_time: null,
        end_time: null,
      });

      const checkboxActiveList = ref([] as any);
      //定义当前选中的框
      const currentType = ref('ip' as any);
      //输入当前的值
      const fromSearch = ref('' as any);
      const { t } = useI18n();
      const selectKey = ref<any>([]);
      const selectedRow = ref<any>();
      const checkedKeys = ref<Array<string | number>>([]);

      const [registerModal, { openModal }] = useModal();

      const rowSelection: TableProps['rowSelection'] = {
        selectedRowKeys: selectKey,
        onChange: (selectedRowKeys, selectedRows) => {
          checkedKeys.value = selectedRowKeys;
          selectedRow.value = selectedRows;
        },
        getCheckboxProps: (record) => ({
          disabled: false, // Column configuration not to be checked
          name: record.name,
        }),
      };

      const [registerTable, { reload, clearSelectedRowKeys, setPagination, setProps }] = useTable({
        api: getWhitelistList,
        columns,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
          showAdvancedButton: false,
          actionColOptions: {
            class: 't-form-col t-form-label-com',
            span: 1,
          },
          showResetButton: false,
        },
        rowSelection: isControlValueSet() ? false : rowSelection,
        useSearchForm: true,
        bordered: true,
        showIndexColumn: false,
        beforeFetch: (params) => {
          setDateParmas(params);
          if (currentType.value && fromSearch.value) {
            params[currentType.value] = fromSearch.value;
          }
          return params;
        },
        afterFetch: () => {
          clearSelectedRowKeys();
        },
      });

      const disabledStartDate = (date) => {
        if (!model.value.end_time || !date) return false;
        return date.valueOf() > model.value.end_time.valueOf();
      };

      const disabledEndDate = (date) => {
        if (!model.value.start_time || !date) return false;
        return date.valueOf() < model.value.start_time.valueOf();
      };

      const onStartDateChange = (value) => {
        model.value.start_time = value;
      };
      const onEndDateChange = (value) => {
        model.value.end_time = value;
      };

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: any, type) {
        openModal(true, {
          record,
          isUpdate: true,
          type,
        });
      }

      async function handleDelete(record: any, type: number) {
        await deleteWhitelistList(
          type == 1 ? [record.ip] : selectedRow.value.map((item) => item.ip),
        );
        setPagination({ current: 1 });
        reload();
      }

      function handleSuccess() {
        reload();
      }

      function handleDrawerSuccess() {
        reload();
        userStore.afterLoginAction();
      }
      function showConfirm(record, type) {
        openConfirm(
          t('table.google.report_columns_APP_confirm'),
          t('table.system.system_message_delete_tip'),
          () => {
            handleDelete(record, type);
          },
          'confirmModal',
        );
      }
      onMounted(() => {
        if (!isHasAuth('70254')) setProps({ rowSelection: false });
      });

      return {
        registerTable,
        registerModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        showConfirm,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        checkboxActiveList,
        currentType,
        fromSearch,
        checkedKeys,
        isHasAuth,
        isControlValueSet,
        scrollHeight,
      };
    },
  });
</script>
