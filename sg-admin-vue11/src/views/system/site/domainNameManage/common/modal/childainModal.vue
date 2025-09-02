<template>
  <BasicModal
    @register="registerCdnModel"
    :title="$t('table.system.system_childDemaim')"
    :width="600"
    :showCancelBtn="false"
    :showOkBtn="false"
    :destroyOnClose="true"
  >
    <BasicTable @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { h, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getChildDomainList } from '/@/api/domain/index';
  import { demondName } from '../const';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
  const { t } = useI18n();
  const domindName = ref('' as any);
  const columns: BasicColumn[] = [
    {
      title: t('table.system.system_childDemaim'),
      dataIndex: 'child_name',
    },
    {
      title: t('table.system.system_use_demain'),
      dataIndex: 'use_type',
      customRender: ({ record }) => {
        return demondName[record.use_type];
      },
    },
    {
      title: t('table.system.system_use_state'),
      dataIndex: 'use_state',
      customRender: ({ record }) => {
        return record.use_state === 1
          ? t('table.system.system_start_')
          : record.use_state === 2
          ? t('table.system.system_susess_start')
          : record.use_state === 3
          ? t('table.system.system_deact_ing')
          : t('table.system.system_started_ed');
      },
    },
  ];
  useAutoTableLabelWidth(columns);
  const [registerCdnModel] = useModalInner((data) => {
    domindName.value = data.name;
    reload();
  });
  const [registerForm, { reload }] = useTable({
    api: getCdnlink,
    immediate: false,
    showIndexColumn: false,
    columns,
    bordered: true,
    pagination: false,
  });
  async function getCdnlink(tableParams: { page_size: number; page: number; use_type: number }) {
    return getChildDomainList({
      ...tableParams,
      page: 1,
      page_size: 25,
      use_type: 0,
      is_page: 2,
      use_state: 0,
      domain_name: domindName.value,
    });
  }
</script>
