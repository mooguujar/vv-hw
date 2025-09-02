<template>
  <PageWrapper :title="title" :contentStyle="{ margin: '10px' }" class="rounded-lg">
    <BasicTable @register="registerTable" class="m-b-20px" />
    <BasicTable
      v-for="(item, index) in betInfoTotalList"
      :columns="getBetInfoColumns(item[0].platform_name)"
      :dataSource="item"
      :showIndexColumn="false"
      :pagination="false"
      :maxHeight="300"
      :key="index"
      :bordered="true"
      class="m-b-20px"
    />
  </PageWrapper>
</template>

<script lang="ts" setup name="BetInfo">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { getBetDetailReportList } from '/@/api/report/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBetInfoColumns } from './index.data';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const betInfoTotalList = ref([]);

  const title = ref('' as string);
  const [registerTable, { getForm, getColumns }] = useTable({
    api: async (data) => {
      try {
        const response = await getBetDetailReportList(data);
        betInfoTotalList.value = response.detail;
        return response.total;
      } catch (error) {
        return [];
      }
    },
    bordered: true,
    showIndexColumn: false,
    columns: getBetInfoColumns('total'),
    pagination: false,
    maxHeight: 600,
    beforeFetch: (params) => {
      params['start_time'] = history.state.start_time;
      params['end_time'] = history.state.end_time;
      params['uid'] = history.state.uid;
      params['currency_id'] = history.state.currency_id;
      params['sort_key'] = 'valid_bet_amount'; //注单占比
      params['sort_type'] = 'desc'; //降序
      title.value = `${t('table.report.report_betInfo')} ${history.state.username}`;
      return params;
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-page-header) {
    background-color: transparent;
  }

  ::v-deep(.ant-page-header-back) {
    margin-right: 15px;

    div svg {
      display: none;
    }

    div::after {
      content: ' ';
      display: inline-block;
      width: 9.1px;
      height: 14px;
      background: no-repeat;
      background-image: url('/@/assets/images/btn-left.webp');
      background-size: 100%;
      vertical-align: middle;
    }
  }
</style>
