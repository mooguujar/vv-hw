<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerOpe" :scroll="{ x: 'max-content', y: scrollHeight }">
      <template #form-typeid>
        <DateButtonGroup
          :isSelect="'days'"
          :compareRangeTime="unixRang"
          :dateGroupButtonList="dateGroupButtonList"
          @change-button-day="changeButtonDay"
          style="margin-right: 8px"
        />
      </template>
      <template #form-custom>
        <InputGroup class="!flex" compact style="width: 380px">
          <Select style="width: 50%" v-model:value="currentType">
            <SelectOption :value="1"> {{ $t('table.system.system_member_account') }} </SelectOption>
            <SelectOption :value="2">{{ $t('table.risk.report_login_ip') }}</SelectOption>
            <SelectOption :value="3">{{ $t('table.member.member_login_demond') }}</SelectOption>
          </Select>
          <Input
            style="width: 50%; margin-right: 10px"
            allowClear
            :placeholder="t('common.chooseText')"
            v-model:value="fromSearch"
          />
        </InputGroup>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema, dateGroupButtonList } from './operate.data';
  import { getuOperationList } from '/@/api/member/index';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { InputGroup, Select, SelectOption, Input } from 'ant-design-vue';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { tabHeight430 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight430).value);
  //输入当前的值
  const fromSearch = ref('' as any);
  //定义当前选中的框
  const currentType = ref<any>(1);
  const unixRang = ref<Array<number>>([]);
  const [registerOpe, { getForm, reload }] = useTable({
    api: getuOperationList,
    columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    beforeFetch: (param) => {
      param['search_type'] = currentType.value;
      param['search_value'] = fromSearch.value;
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;
    },
    formConfig: {
      schemas: searchFormSchema,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        class: 'button-box t-form-label-com',
      },
    },
  });

  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      // await getForm().setFieldsValue({ end_time: value[1] });
      reload();
    });
  }
  function reSetButtonBox() {
    if (document.getElementsByClassName('button-box').length > 0) {
      for (var i = 0; i < document.getElementsByClassName('button-box').length; i++) {
        document.getElementsByClassName('button-box').item(i).classList.remove('ant-col-4');
      }
    }
  }
  onMounted(() => {
    reSetButtonBox();
  });
</script>
<style scoped>
  .ant-input-group.ant-input-group-compact > .ant-select-focused {
    z-index: 0;
  }
</style>
