<template>
  <div>
    <BasicModal
      okText=""
      cancelText=""
      :minHeight="200"
      :maxHeight="500"
      :title="$t('table.member.member_remar_history')"
      @register="registerHistoryModal"
      :width="600"
      :titleIcon="props.titleicon"
      :woModalBtnGroups="true"
    >
      <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }" />
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getHistoryListNote } from '/@/api/member';
  import { typeShowOptions } from '../../../../common/const';
  import { toTimezone } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';

  const { t } = useI18n();
  const props = defineProps<{
    titleicon: string;
  }>();
  const getUid = ref('' as string);
  const columns: BasicColumn[] = [
    {
      title: t('table.member.member_add_data'),
      dataIndex: 'created_at',
      minWidth: 200,
      customRender: ({ record }) => {
        return toTimezone(record.created_at, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: t('table.member.member_oprate_people'),
      dataIndex: 'created_by',
      customRender: ({ record }) => {
        return record.created_by ? record.created_by : '-';
      },
    },
    {
      title: t('table.member.member_oprate_event'),
      dataIndex: 'type',
      customRender: ({ record }) => {
        const arr: any = [];
        //return typeShowOptions[record.type];
        record?.type?.forEach((item) => {
          arr.push(typeShowOptions[item]);
        });
        return arr.length ? arr.join(',') : '-';
      },
    },
    {
      title: t('table.member.member_ramark_massage'),
      minWidth: 200,
      dataIndex: 'note',
    },
  ];
  useAutoTableLabelWidth(columns);
  const [registerHistoryModal] = useModalInner((data) => {
    getUid.value = data.uid;
  });
  const [registerTable] = useTable({
    api: getHistoryListNote,
    columns,
    bordered: true,
    maxHeight: 450,
    showIndexColumn: false,
    beforeFetch: (param) => {
      param['uid'] = getUid.value;
    },
  });
</script>
