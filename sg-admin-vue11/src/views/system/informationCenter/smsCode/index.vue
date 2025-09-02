<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" v-if="show" :scroll="{ y: scrollHeight }">
      <template #form-currentType>
        <FormItemRest>
          <InputGroup style="display: flex" class="t-form-label-com" compact>
            <Select
              style="width: 40%"
              v-model:value="currentType"
              class="br-none"
              :dropdownMatchSelectWidth="false"
            >
              <SelectOption :value="'event_id'">
                {{ $t('business.common_agent_account') }}</SelectOption
              >
              <SelectOption :value="'comp_name'">{{
                $t('business.common_phone_number')
              }}</SelectOption>
              <SelectOption :value="'home_name'">{{ $t('common.picture5') }}</SelectOption>
            </Select>
            <Input
              style="width: 59%"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </FormItemRest>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './index.data';
  import { getEventlistList } from '/@/api/sys';
  import { PageWrapper } from '/@/components/Page';
  import { InputGroup, Select, SelectOption, Input, FormItemRest } from 'ant-design-vue';
  import { ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(350).value);

  const fromSearch = ref('' as string);
  const currentType = ref('event_id' as string);

  const registerTable = ref();
  const reload = ref();
  const show = ref(true);

  function cook() {
    const [registerTable1, { reload: reload1, setColumns }] = useTable({
      api: getEventlistList,
      columns: columns,
      bordered: true,
      useSearchForm: true,
      showIndexColumn: false,
      formConfig: {
        schemas: searchFormSchema,
        showAdvancedButton: false,
        actionColOptions: {
          class: 't-form-label-com',
          span: 1,
        },
        showResetButton: false,
      },
      beforeFetch: (params) => {
        if (currentType.value) {
          params[currentType.value] = fromSearch.value;
        }
        return params;
      },
    });
    registerTable.value = registerTable1;
    reload.value = reload1;
  }
  cook();
</script>
<style lang="less" scoped></style>
