<template>
  <main>
    <BasicModal
      :maxHeight="550"
      :width="962"
      :title="t('business.common_detail_p')"
      :showOkBtn="false"
      :showCancelBtn="false"
      @register="registerModal"
      :destroyOnClose="true"
    >
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: t('business.common_detail'),
                  onClick: informationOpen.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
      </BasicTable>
      <ShowInfo @register="registerInfor" />
    </BasicModal>
  </main>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { columns } from './multipleBettingModal.data';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { ShowInfo } from '/@/components/ShowInfo/index';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  let record;
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    let dataObj: any = JSON.parse(JSON.stringify(data));
    if (typeof dataObj.detail == 'string') {
      dataObj.detail = JSON.parse(dataObj.detail);
    }

    const arrList = dataObj.detail.map((item) => {
      return {
        username: dataObj.username,
        platform_name: dataObj.platform_name,
        competitionName: dataObj.competitionName,
        eventName: dataObj.eventName,
        bet_time: dataObj.bet_time,
        bill_no: dataObj.bill_no,
        settle_time: dataObj.settle_time,
        currency_id: dataObj.currency_id,
        bet_amount: dataObj.bet_amount,
        valid_bet_amount: dataObj.valid_bet_amount,
        net_amount: dataObj.net_amount,
        game_class: dataObj.game_class,
        platform_id: dataObj.platform_id,
        state: dataObj.state,
        ...item,
      };
    });
    record = arrList;
  });
  const [registerTable, { reload, getForm }] = useTable({
    api: () => {
      return record;
    },
    actionColumn: {
      width: 50,
      title: t('business.common_operate'),
      dataIndex: 'action',
      // fixed: 'right',
    },
    columns,
    showIndexColumn: false,
    bordered: true,
    maxHeight: 450,
    pagination: false,
  });
  const [registerInfor, { openModal }] = useModal();
  function informationOpen(record: Recordable): void {
    openModal(true, record);
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-table-wrapper .ant-table-title) {
    min-height: 0 !important;
  }
</style>
