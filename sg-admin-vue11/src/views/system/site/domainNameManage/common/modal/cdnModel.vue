<template>
  <div>
    <BasicModal
      @register="registerCdnModel"
      :title="$t('table.system.system_cdn_manage')"
      :width="600"
      :showCancelBtn="false"
      :showOkBtn="false"
    >
      <BasicTable @register="registerForm">
        <template #action="{ record }">
          <span class="primary-color cursor-pointer" @click="handleState(record)">
            {{
              record.is_open === 2
                ? $t('table.system.system_open_')
                : $t('table.system.system_close_')
            }}
          </span>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getCdnlinkList, updateCdnLink } from '/@/api/domain/index';
  import { openConfirm } from '/@/utils/confirm';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const columns: BasicColumn[] = [
    {
      title: t('table.system.system_cdn_name'),
      dataIndex: 'cdn_name',
    },
    {
      title: t('business.common_status'),
      dataIndex: 'is_open',
      customRender: ({ record }) => {
        const text =
          record.is_open === 1 ? t('table.system.ststem_') : t('table.system.system_no_open');
        const color = record.is_open === 1 ? '#63A103' : '#D9001B';
        return h('span', { style: { color: color } }, text);
      },
    },
    {
      title: t('business.common_operate'),
      dataIndex: 'operate',
      slots: { customRender: 'action' },
    },
  ];

  const [registerCdnModel] = useModalInner(() => {
    reload();
  });
  const [registerForm, { reload }] = useTable({
    api: getCdnlink,
    immediate: false,
    showIndexColumn: false,
    columns,
    bordered: true,
  });
  async function getCdnlink(tableParams: { rows: number; page: number }) {
    return getCdnlinkList(tableParams);
  }
  function handleState(record) {
    const text =
      record.is_open === 1 ? t('table.system.system_close_') : t('table.system.system_open_');
    const state = record.is_open === 1 ? 2 : 1;
    openConfirm(
      t('common.warning'),
      `${t('table.member.member_are_you')} ${text} ${t('table.member.member_cdn_node')}`,
      async () => {
        const { status, data } = await updateCdnLink({ state: state, cdn_id: record.cdn_id });
        if (status) {
          message.success(data);
          reload();
        } else {
          message.error(data);
        }
      },
    );
  }
</script>
