<template>
  <PageWrapper :contentStyle="{ margin: 0 }">
    <BasicTable @register="registerTable" class="vipClassGradeLog" :scroll="{ y: scrollHeight }">
      <template #form-typeid>
        <DateButtonGroup
          :isSelect="'days'"
          :compareRangeTime="unixRang"
          @change-button-day="changeButtonDay"
          :dateGroupButtonList="dateGroupButtonList"
          style="margin-right: 8px"
        />
      </template>
      <template #slotsLevels="{ record }"
        >{{ record.change_before }}
        <Icon icon="icon-park:double-right" />
        {{ record.change_after }}
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas, dateGroupButtonList } from './LevelLog.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { ref, nextTick, onMounted } from 'vue';
  import { getMemberLevelLog, exportLevelLog } from '/@/api/member/index';
  import { setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';
  import { Icon } from '/@/components/Icon';
  import { useExportFile } from '/@/utils/helper/paramsHelper';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight430 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight430).value);
  const unixRang = ref<Array<number>>([]);
  //定义当前选中的框
  const currentType = ref('username' as any);
  //输入当前的值
  const fromSearch = ref('' as any);
  const { exportFile } = useExportFile();
  const [registerTable, { getForm, reload }] = useTable({
    api: getMemberLevelLog,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        // class: 'button-box t-form-label-com w-150px',
        class: 'button-box t-form-label-com w-80px',
      },
      submitButtonOptions: {
        text: t('common.queryText'),
      },
      resetButtonOptions: {
        text: t('business.common_export'),
      },
      resetFunc: handleExportTableList,
      showResetButton: false,
    },
    beforeFetch: async (param) => {
      processingParams(param);
    },
    useSearchForm: true,
    bordered: true,
    columns,
  });
  const searchTypeOptions = [
    { label: t('business.common_member_account'), value: 'username' }, //会员账号
    { label: t('table.risk.report_operate_people'), value: 'created_name' }, //操作人员
  ];
  function changeButtonDay(value) {
    nextTick(async () => {
      await getForm().setFieldsValue({ time: [value[0], value[1]] });
      // await getForm().setFieldsValue({ end_time: value[1] });
      reload();
    });
  }

  async function processingParams(param) {
    if (param?.time?.length > 0) {
      param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
      param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
    }
    delete param.time;
    param['type'] = param.type ? String(param.type) : param.type === 0 ? '0' : '';
    const values = await getForm().validate();
    if (fromSearch.value) {
      param[currentType.value] = fromSearch.value;
    }
  }
  async function handleExportTableList(): Promise<void> {
    try {
      const { validate } = getForm();
      const param = await validate();
      processingParams(param);
      await exportFile(exportLevelLog, param, t('table.member.level_log'));
    } catch (e) {
      console.error(e);
    }
    // 避免汇出后自动查询
    return Promise.reject();
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
  ::v-deep(.vipClassGradeLog .ant-table-body .ant-table-tbody .ant-table-cell > div) {
    width: 100% !important;
  }
</style>
