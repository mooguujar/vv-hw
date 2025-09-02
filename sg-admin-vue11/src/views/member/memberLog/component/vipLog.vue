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
      <template #form-custom>
        <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
          <Select
            v-model:value="currentType"
            :options="searchTypeOptions"
            class="pay-select"
            :style="{
              minWidth: calculateWidth(useI18n().t('business.common_member_account')).width,
              width: '48%',
            }"
          />
          <a-input
            class="mr-2.5"
            style="width: 54%"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #slotsLevels="{ record }"
        >{{ 'VIP' + record.before }}
        <Icon icon="icon-park:double-right" />
        {{ 'VIP' + record.after }}
      </template>
    </BasicTable>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas, dateGroupButtonList } from './vipLog.data';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { DateButtonGroup } from '/@/components/DateButtonGroup/index';
  import { ref, nextTick, onMounted } from 'vue';
  import { getMemberLogVip } from '/@/api/member/index';
  import { formatDateTime } from '/@/utils/dateUtil';
  import { Icon } from '/@/components/Icon';
  import { Select } from 'ant-design-vue';
  import { calculateWidth } from '/@/utils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight430 } from '/@/views/common/component';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight430).value);
  const unixRang = ref<Array<number>>([]);
  //定义当前选中的框
  const currentType = ref('username' as any);
  //输入当前的值
  const fromSearch = ref('' as any);
  const [registerTable, { getForm, reload }] = useTable({
    api: getMemberLogVip,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 'button-box t-form-label-com',
      },
      submitButtonOptions: {
        text: t('common.queryText'),
      },
      // resetButtonOptions: {
      //   text: t('business.common_export'),
      // },
      showResetButton: false,
    },
    beforeFetch: async (param) => {
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? formatDateTime(param.time[0]) : null;
        param.end_time = param.time[1] ? formatDateTime(param.time[1]) : null;
      }
      delete param.time;
      param['sts'] = param.start_time;
      param['ets'] = param.end_time;
      param['type'] = param.type ? String(param.type) : param.type === 0 ? '0' : '';
      delete param.start_time;
      delete param.end_time;
      const values = await getForm().validate();
      if (fromSearch.value) {
        param[currentType.value] = fromSearch.value;
      }
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
  ::v-deep(.vipClassGradeLog .ant-table-body .ant-table-tbody .ant-table-cell > div) {
    width: 100% !important;
  }
</style>
