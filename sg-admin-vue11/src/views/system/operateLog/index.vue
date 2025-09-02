<template>
  <div class="admin-log">
    <PageWrapper :contentStyle="{ margin: 0 }" class="LayoutTable">
      <BasicTable @register="registerTable" :scroll="{ x: 'max-content', y: scrollHeight }">
        <template #form-grupButton>
          <DateButtonGroup
            :isSelect="isSelect"
            @change-button-day="changeButtonDay"
            :dateGroupButtonList="dateGroupButtonList"
          />
        </template>
        <template #form-usernameSlot>
          <a-input-group compact style="display: flex" class="t-form-label-com">
            <Select v-model:value="currentType" :options="operateList" />
            <Input
              class="pay-select"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="fromSearch"
            />
          </a-input-group>
        </template>
        <template #content="{ record }">
          <div v-if="record.content?.length > 30" class="flex justify-center">
            <div class="truncate w-100">
              {{ record.content }}
            </div>
            <div class="cursor-pointer primary-color" @click="openDetailModal(record.content)">{{
              t('business.common_detail')
            }}</div>
          </div>
          <div v-else>{{ record.content }}</div>
        </template>
      </BasicTable>
      <operateEvent @register="registerOperateEvent" />
    </PageWrapper>
  </div>
</template>

<script lang="ts" setup name="OperateLog">
  import { nextTick, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { adminData, loginForm, dateGroupButtonList } from './adminLoginLog.data';
  import { useTable, BasicTable } from '/@/components/Table';
  import { getOperationLog } from '/@/api/sys/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { Select, Input } from 'ant-design-vue';
  import operateEvent from './modal/operateEvent.vue';
  import { useModal } from '/@/components/Modal';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const isSelect = ref('days' as string);
  const fromSearch = ref('' as string);
  const currentType = ref('created_name');
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(325).value);
  const operateList = [
    { label: t('table.google.report_columns_APP_operator'), value: 'created_name' },
    { label: t('table.member.member_operate_log'), value: 'content' },
  ];
  const [registerOperateEvent, { openModal }] = useModal();
  const [registerTable, { getForm, reload }] = useTable({
    api: getOperationLog,
    useSearchForm: true,
    columns: adminData,
    showIndexColumn: false,
    bordered: true,
    formConfig: {
      schemas: loginForm,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    beforeFetch: (param) => {
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      param[currentType.value] = fromSearch.value ? fromSearch.value : '';

      delete param.time;
      delete param.data;
      delete param.searchType;
    },
  });
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      reload();
    });
  }
  function openDetailModal(data) {
    openModal(true, data);
  }
</script>
<style lang="less" scoped>
  .t-form-label-com {
    ::v-deep(.ant-radio-button-wrapper) {
      margin-right: 4px;
      border-radius: 4px !important;
    }

    ::v-deep(.pay-select) {
      margin-right: 10px;

      .ant-input-suffix {
        display: none;
      }
    }

    ::v-deep(.ant-radio-button-wrapper:last-child) {
      margin-right: 10px;
    }

    ::v-deep(.ant-radio-button-wrapper::before) {
      display: none !important;
    }

    ::v-deep(.ant-select) {
      border-right: none !important;
    }
  }

  .cursor-pointer {
    padding: 0 10px;
    white-space: nowrap;
  }
</style>
