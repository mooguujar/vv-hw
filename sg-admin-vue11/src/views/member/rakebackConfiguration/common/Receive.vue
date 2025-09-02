<template>
  <BasicModal
    :title="$t('common.rakeback_record')"
    width="1350px"
    :showCancelBtn="false"
    :showOkBtn="false"
    :useWrapper="false"
    @register="registerReceive"
    :woModalBtnGroups="true"
    :bodyStyle="{ height: '610px' }"
  >
    <BasicTable @register="registerTable">
      <template #form-custom>
        <div class="!flex">
          <a-input-group compact style="display: flex; width: 400px">
            <Select v-model:value="currentType" class="pay-select select-left" style="width: 50%">
              <SelectOption value="username">
                {{ $t('business.common_member_account') }}
              </SelectOption>
              <SelectOption value="parent_name">
                {{ $t('business.common_super_agent') }}
              </SelectOption>
            </Select>
            <Input
              class="mr-2.5 select-right-input"
              allowClear
              style="width: 100%"
              :placeholder="$t('business.common_search_tip')"
              v-model:value="fromSearch"
            />
          </a-input-group>
        </div>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './Receive.data';
  import { Input, Select, SelectOption } from 'ant-design-vue';
  import { getBonusList } from '/@/api/member/index';
  import { setDateParmaTime, setDateParmas } from '/@/utils/dateUtil';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';

  defineEmits(['Receive']);
  const currentType = ref<any>('username');
  const fromSearch = ref<any>();
  const FORM_SIZE = useFormSetting().getFormSize;

  const [registerTable, { getForm }] = useTable({
    api: getBonusList,
    columns,
    showIndexColumn: false,
    useSearchForm: true,
    bordered: true,
    maxHeight: 450,
    formConfig: {
      schemas: searchFormSchema,
      showResetButton: false,
      showAdvancedButton: false,
      size: FORM_SIZE,
      actionColOptions: {
        class: 't-form-col t-form-label-com m-l-2',
        span: 1,
      },
    },
    beforeFetch: async (param) => {
      setDateParmaTime(param);
      setDateParmas(param);
      // const values = await getForm().validate();
      if (fromSearch.value) {
        param[currentType.value] = fromSearch.value;
      }
      param['cash_type'] = 814;
      return param;
    },
  });
  const [registerReceive] = useModalInner(async () => {
    await getForm().resetFields();
  });
</script>
<style lang="less" scoped>
  .vben-basic-table-form-container {
    padding: 0 !important;

    ::v-deep(.ant-form) {
      padding: 0 !important;
      padding-right: 30px !important;
    }
  }

  ::v-deep(.ant-form-item-control-input-content) {
    text-align: left !important;
    wdith: auto;
  }

  .select-right-input {
    margin-left: -1px;
  }

  ::v-deep(.ant-select-focused) {
    border-right: none !important;
  }
</style>
