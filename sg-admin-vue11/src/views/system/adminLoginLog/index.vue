<template>
  <div class="admin-log">
    <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable">
      <BasicTable @register="registerTable">
        <template #form-grupButton>
          <DateButtonGroup
            :isSelect="isSelect"
						isEndToday
            @change-button-day="changeButtonDay"
            :dateGroupButtonList="dateGroupButtonList"
          />
        </template>
        <template #form-usernameSlot>
          <FormItemRest>
            <InputGroup style="display: flex" class="t-form-label-com" compact>
              <Select style="width: 38%" v-model:value="currentType">
                <SelectOption value="1">
                  {{ t('table.system.system_root_user') }}
                </SelectOption>
                <SelectOption value="2">
                  {{ t('table.risk.report_login_ip') }}
                </SelectOption>
              </Select>
              <Input
                style="width: 59%"
                class="pay-select"
                allowClear
                :placeholder="$t('common.inputText')"
                v-model:value="fromSearch"
              />
            </InputGroup>
          </FormItemRest>
        </template>
      </BasicTable>
      </PageWrapper
  ></div>
</template>
<script lang="ts" setup name="AdminLoginLog">
  import { PageWrapper } from '/@/components/Page';
  import { adminData, loginForm,dateGroupButtonList } from './adminLoginLog.data';
  import { useTable, BasicTable } from '/@/components/Table';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { getLoginLog } from '/@/api/sys/index';
  import { nextTick, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setDateParmas, setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import {
    InputGroup,
    Select,
    Input,
    SelectOption,
    FormItemRest,
  } from 'ant-design-vue';

  const isSelect = ref('days' as string);
  const fromSearch = ref('' as string);
  const currentType = ref('1' as string);

  const { t } = useI18n();

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }

  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  
  const [registerTable,{ getForm, reload }] = useTable({
    api: getLoginLog,
    useSearchForm: true,
    columns: adminData,
    bordered: true,
    showIndexColumn: false,
    formConfig: {
      schemas: loginForm,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span:1,
      },
      showResetButton:false,
    },
    beforeFetch: (params) => {
      setDateParmas(params);
			 if (params?.time?.length > 0) {
        params.start_time = params.time[0] ? setStartformatDate(params.time[0]) : null;
        params.end_time = params.time[1] ? setEndformatDate(params.time[1]) : null;
      }
      delete params.time;
      params['search_value'] = fromSearch.value
      params['search_type'] = Number(currentType.value)
      return params;
    },
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      model.value.start_time = value[0];
      model.value.end_time = value[1];
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
			reload();
      //await getForm().setFieldsValue({ end_time: value[1] });
    });
  }
</script>
<style lang="less" scoped>
.t-form-label-com {
  ::v-deep(.ant-radio-button-wrapper) {
    margin-right: 4px;
    border-radius: 4px!important;
  }
  ::v-deep(.ant-radio-button-wrapper:last-child){
    margin-right: 10px;
  }
  ::v-deep(.ant-radio-button-wrapper:before) {
    display: none!important;
  }
  ::v-deep(.ant-select) {
    border-right: none!important;
  }
}
</style>
