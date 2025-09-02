<template>
  <div>
    <BasicTable @register="registerTable" class="LayoutTable" :scroll="{ y: scrollHeight }">
      <template #form-insertAccount>
        <a-button
          type="primary"
          v-if="isHasAuth('70823')"
          @click="handleCreate(false)"
          class="!mr-10"
          >{{ t('modalForm.system.add_role') }}</a-button
        >
      </template>
      <template #actions="{ record }">
        <Space>
          <!-- 70826 -->
          <span
            class="cursor-pointer primary-color"
            v-if="isHasAuth('70911')"
            @click="handlePriv(record)"
            >{{ t('table.system.authority') }}</span
          >
          <span
            class="cursor-pointer primary-color"
            v-if="isHasAuth('70910')"
            @click="handleCreate(true, record)"
            >{{ t('common.editorText') }}</span
          >
          <span
            class="cursor-pointer"
            v-if="isHasAuth('70825') && record.total == 0"
            style="color: red"
            @click="deletFun(record)"
          >
            {{ t('common.delText') }}
          </span>
        </Space>
      </template>
      <template #total="{ record }">
        <span
          :class="
            record?.total == 0 || !isControlValueSet() || !isHasAuth('70814')
              ? ''
              : 'cursor-pointer primary-color'
          "
          @click="
            record.total > 0 && (isControlValueSet() || isHasAuth('70814')) && handlesRoles(record)
          "
          >{{ record.total }}</span
        >
      </template>
    </BasicTable>
    <Modal_total @register="registerModal_total" @success="handleSuccess" />
    <RoleModal @register="registerModal" @success="handleSuccess" />
    <PrivModal @register="registerPrivModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { Space } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import Modal_total from './components/registerModal_total.vue';
  import RoleModal from './components/RoleModal.vue';
  import PrivModal from './components/PrivListModal.vue';
  import { columns, searchFormSchema } from './index.data';
  import { useModal } from '/@/components/Modal';
  import { useUserStore } from '/@/store/modules/user';
  import { getGroupList, deleteGroup, getadminPrivList } from '/@/api/sys/rootManage';
  import { openConfirm } from '/@/utils/confirm';
  import { useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(325).value);
  const useStoreSite = useUserStore();
  const [registerModal_total, { openModal: openModal_total }] = useModal();
  const [registerModal, { openModal }] = useModal();
  const [registerPrivModal, { openModal: openPrivModal }] = useModal();
  const router = useRouter();
  const [registerTable, { reload }] = useTable({
    api: getGroupList,
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      showActionButtonGroup: false,
      actionColOptions: {
        class: 't-form-col',
        xxl: 12,
        xl: 12,
        lg: 12,
      },
    },
    canResize: true,
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    beforeFetch: (param) => {
      param['pid'] = '0';
      param['site_id'] = useStoreSite.getCurrentSite['id'];
    },
  });

  function handleCreate(isUpdate, record = {}) {
    openModal(true, {
      isUpdate,
      record,
    });
  }

  function handlesRoles(record) {
    openModal_total(true, { record });
  }
  function handleSuccess() {
    reload();
  }
  async function handlePriv(record: any) {
    const res = await getadminPrivList();
    const selectId = res.filter((item) => item.flag === 3).map((item) => item.id);
    openPrivModal(true, { record, source: res, selectId });
  }
  // 刪除
  const deletFun = (record) => {
    openConfirm(t('common.warning'), t('table.google.report_columns_APP_delete_msg'), async () => {
      try {
        await deleteGroup(record.gid);
        reload();
      } catch (error) {
        console.error(error);
      }
    });
  };
  onMounted(() => {
    handleSuccess();
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-form-horizontal) {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
