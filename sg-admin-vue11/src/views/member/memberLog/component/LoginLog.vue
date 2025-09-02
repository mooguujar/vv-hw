<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerLog" :scroll="{ y: scrollHeight }">
      <template #form-typeid>
        <DateButtonGroup
          :isSelect="'days'"
          :compareRangeTime="unixRang"
          :dateGroupButtonList="dateGroupButtonList"
          @change-button-day="changeButtonDay"
          style="margin-right: 8px"
        />
      </template>
      <template #action="{ column, record }">
        <TableAction
          :actions="[
            {
              label: $t('table.member.member_history'),
              onClick: historyFun.bind(null, record),
            },
          ]"
        />
      </template>
      <template #form-custom>
        <InputGroup compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select class="br-none" v-model:value="currentType" :dropdownMatchSelectWidth="false">
            <SelectOption :value="1"> {{ $t('table.system.system_member_account') }} </SelectOption>
            <SelectOption :value="2"> {{ $t('business.common_super_agent') }} </SelectOption>
            <SelectOption :value="3">{{ $t('table.system.system_login_ip') }}</SelectOption>
            <SelectOption :value="4">{{ $t('table.member.member_device_no') }}</SelectOption>
            <SelectOption :value="5">{{ $t('table.member.memer_login_in_dimond') }}</SelectOption>
          </Select>
          <Input
            class="mr-2.5"
            allowClear
            :placeholder="$t('common.chooseText')"
            v-model:value="fromSearch"
          />
        </InputGroup>
      </template>
    </BasicTable>
    <loginHistory @register="registerHistory" />
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, nextTick, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns, searchFormSchema, dateGroupButtonList } from './login.data';
  import { loginList } from '/@/api/member/index';
  import { useModal } from '/@/components/Modal';
  import loginHistory from './loginHistory.vue';
  import { InputGroup, Select, Input, SelectOption } from 'ant-design-vue';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import dayjs from 'dayjs';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight430 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight430).value);
  const currentType = ref<any>(1);
  const unixRang = ref<Array<number>>([]);
  //输入当前的值
  const fromSearch = ref('' as any);
  const { exportFile } = useExportFile();
  const [registerLog, { getForm, getColumns, setColumns, reload }] = useTable({
    api: loginList,
    columns,
    useSearchForm: true,
    showIndexColumn: false,
    bordered: true,
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
      labelWidth: 120,
      schemas: searchFormSchema,
      showAdvancedButton: false,
      showResetButton: false,
      actionColOptions: {
        // class: 't-form-col',
        class: 'button-box t-form-label-com',
        // xxl: 12,
        // xl: 12,
        // lg: 12,
      },
      fieldMapToTime: [['data', ['sts', 'ets'], 'YYYY-MM-DD']],
      resetButtonOptions: {
        text: t('business.common_export'),
      },
      resetFunc: handleExportTableList,
    },
    actionColumn: {
      // width: 160,
      title: t('business.common_operate'),
      dataIndex: 'action',
      slots: { customRender: 'action' },
      // fixed: 'right',
    },
  });
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const values = await validate();
      if (currentType.value) {
        values[currentType.value] = fromSearch.value;
      }
    } catch (e) {
      console.error(e);
    }
    // 避免匯出後自動查詢
    return Promise.reject();
  }
  eventBus.on('mittChange', (rangTime: any) => {
    const startTime = rangTime[0] ? dayjs(rangTime[0]).toDate().getTime() : 0;
    const endTime = rangTime[1] ? dayjs(rangTime[1]).toDate().getTime() : 0;
    unixRang.value = [startTime, endTime];
  });
  const [registerHistory, { openModal }] = useModal();
  async function historyFun(record) {
    openModal(true, record);
  }
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
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
