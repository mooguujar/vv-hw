<template>
  <PageWrapper :contentStyle="{ margin: '0' }" class="LayoutTable">
    <BasicTable @register="registerTable" v-if="show" :scroll="{ y: scrollHeight }">
      <template #action="{ record }">
        <span
          class="px-2 cursor"
          @click="recordHandle(record)"
          :class="{ 'text-green': record.is_block, 'text-blue': !record.is_block }"
        >
          {{ record.is_block ? $t('business.common_on_activate') : $t('business.common_off') }}
        </span>
      </template>
      <template #form-currentType>
        <FormItemRest>
          <InputGroup style="display: flex" class="t-form-label-com" compact>
            <Select
              style="width: 40%"
              v-model:value="currentType"
              class="br-none"
              :dropdownMatchSelectWidth="false"
            >
              <SelectOption :value="'event_id'"> {{ $t('common.sport5') }}</SelectOption>
              <SelectOption :value="'comp_name'">{{
                $t('table.member.member_match_name')
              }}</SelectOption>
              <SelectOption :value="'home_name'">{{ $t('common.sport6') }}</SelectOption>
              <SelectOption :value="'away_name'">{{ $t('common.sport7') }}</SelectOption>
              <SelectOption :value="'operated_username'">
                {{ $t('table.risk.report_operate_people') }}
              </SelectOption>
            </Select>
            <Input
              style="width: 59%; margin-right: 10px"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </FormItemRest>
      </template>
      <template #customTableHeader>
        <div class="mb-10px ml-10px">
          <RadioGroup
            button-style="solid"
            :size="'large'"
            v-model:value="tyValue"
            @change="handleModalSuccess"
          >
            <RadioButton :value="el.value" v-for="el in tyList" :key="el.value"
              >{{ el.label }}
            </RadioButton>
          </RadioGroup>
        </div>
      </template>
    </BasicTable>
    <setStatusModel
      @register="registerSetStateModel"
      @success-load="handleSuccess"
      :titleicon="'notice'"
      :operationApi="operationApi"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { championColumn, columns, searchFormSchema } from './index.data';
  import { getEventlistList, getOutrightlistList, postEventblock } from '/@/api/sys';
  import { PageWrapper } from '/@/components/Page';
  import {
    InputGroup,
    Select,
    SelectOption,
    Input,
    FormItemRest,
    RadioGroup,
    RadioButton,
  } from 'ant-design-vue';
  import { nextTick, reactive, ref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import setStatusModel from './setStatusModel.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(390).value);

  const fromSearch = ref('' as string);
  const currentType = ref('event_id' as string);

  const operationApi = <any>ref();

  const tyList = reactive([
    { value: 'generally', label: t('common.sport3') },
    { value: 'champion', label: t('common.sport4') },
  ]);

  const tyValue = ref('generally');

  const registerTable = ref();
  const reload = ref();
  const show = ref(true);

  const [registerSetStateModel, { openModal: openSetState }] = useModal();

  function cook() {
    const [registerTable1, { reload: reload1, setColumns }] = useTable({
      api: tyValue.value == 'generally' ? getEventlistList : getOutrightlistList,
      columns: tyValue.value == 'generally' ? columns : championColumn,
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

  function recordHandle(data: any) {
    operationApi.value = postEventblock;
    const text = data.is_block ? t('business.common_on_activate') : t('business.common_deactivate');
    openSetState(true, {
      data: data,
      titlePreIcon: 'question',
      title: `${t('table.member.member_are_you')} ${text.toLowerCase()} ${data.home_name}-${
        data.away_name
      }`,
      handle: 'state',
    });
  }

  function handleSuccess() {
    reload.value();
  }

  async function handleModalSuccess(value) {
    cook();
    show.value = false;
    nextTick(() => {
      show.value = true;
    });
  }
</script>
<style lang="less" scoped></style>
