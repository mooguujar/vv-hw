<template>
  <PageWrapper :title="$t('routes.risk.associated_info')" class="rounded-lg">
    <BasicTable @register="registerTable" :scroll="{ y: scrollHeight }">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: t('business.common_deal_with'), //处理
              onClick: editFun.bind(null, record),
              ifShow: () => record.limit_type == 0,
            },
            {
              label:
                record.limit_type == 3
                  ? t('table.risk.report_cancel_ignored')
                  : t('table.risk.report_set_ignored'), //取消忽略 ： 设置忽略
              onClick: ignoreFun.bind(null, record),
              ifShow: isHasAuth('60602'),
            },
          ]"
        />
      </template>
    </BasicTable>
    <div class="absolute bottom-11px" v-show="checkboxActive.length > 0">
      <span class="px-2">
        {{ t('business.common_all_dispath') }} {{ checkboxActive.length }}
        {{ t('business.common_all_dispath_1') }}
      </span>
      <Button type="primary" class="!h-28px all-del-btn" @click="batchFun" danger>
        <div class="btn">{{ t('business.common_all_dispatch') }}</div>
      </Button>
    </div>
    <HandleModal @register="registerHandleModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { columns } from './index.data';
  import { message } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import { PageWrapper } from '/@/components/Page';
  import { openConfirm } from '/@/utils/confirm';
  import HandleModal from '../../../../common/components/HandleModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getAssociateDetailList, updateAssociateDetailList } from '/@/api/risk';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(285).value);
  const [registerHandleModal, { openModal }] = useModal();
  const checkboxActive = ref([] as any);
  const sortKey = ref('');
  const sortType = ref('');
  const [registerTable, { reload, getForm, getColumns, clearSelectedRowKeys }] = useTable({
    api: getAssociateDetailList,
    columns,
    bordered: true,
    showIndexColumn: false,
    rowSelection: isControlValueSet()
      ? false
      : {
          onChange: (_, record) => {
            checkboxActive.value = [];
            record.map((item) => {
              checkboxActive.value.push(item.id);
            });
          },
        },
    beforeFetch: (params) => {
      params['sort_key'] = sortType.value ? sortKey.value : '';

      params['sort_type'] = sortType.value;
      params['associate_id'] = history.state.id;
      return params;
    },
    afterFetch: () => {
      clearSelectedRowKeys();
      checkboxActive.value = [];
    },
    sortFn: (sortInfo) => {
      const { field, order } = sortInfo;
      (sortType.value = order === 'ascend' ? 'asc' : order === 'descend' ? 'desc' : ''),
        (sortKey.value = field ? field : '');
    },
  });

  function editFun(record) {
    openModal(true, { risk_code: 'linked_records', ...record });
  }

  function batchFun() {
    openModal(true, { risk_code: 'linked_records_batch', ids: checkboxActive.value });
  }

  function ignoreFun(record) {
    let confirmMessage = t('modalForm.risk.risk_ignore_tip'); //您确定要忽略这条记录吗？
    let limit_type = 3;
    if (record.limit_type == 3) {
      confirmMessage = t('modalForm.risk.risk_cancel_ignore_tip'); //您确定要取消忽略这条记录吗？
      limit_type = 0;
    }
    //警告提示
    openConfirm(t('common.warning'), confirmMessage, async () => {
      try {
        const { status, data } = await updateAssociateDetailList({ id: record.id, limit_type });
        if (status) {
          message.success(data);
          reload();
        } else {
          message.error(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    });
  }

  function handleSuccess() {
    reload();
  }
</script>
<style lang="less" scoped>
  ::v-deep(.vben-basic-table .ant-pagination) {
    margin-bottom: 8px;
  }

  ::v-deep(.ant-page-header) {
    //padding-top: 0!important;
    // background-color: #f0f4fc;
    background-color: #edf1f8;
  }

  ::v-deep(.ant-page-header-back > div > span > svg) {
    display: none !important;
    border: 1px solid red !important;
  }

  ::v-deep(.ant-page-header-back > div::after) {
    content: ' ';
    display: inline-block;
    width: 9.1px;
    height: 14px;
    background: no-repeat;
    background-image: url('/src/assets/images/btn-left.webp');
    background-size: 100%;
    vertical-align: middle;
  }

  ::v-deep(.vben-page-wrapper-content) {
    background-color: #edf1f8 !important;
  }

  //::v-deep(.vben-layout-content) {
  //  background-color: orange!important;
  //}
  ::v-deep(.ant-page-header-heading-title) {
    color: #444;
    font-size: 18px;
    line-height: 18px;
  }

  //::v-deep(.vben-default-layout-main) {
  //  background-color: orange!important;
  //}
  .all-del-btn {
    width: auto;
    padding: 0 5px;
    box-sizing: border-box;
  }
</style>
