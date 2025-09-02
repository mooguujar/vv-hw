<template>
  <PageWrapper :contentStyle="{ margin: '10px', paddingLeft: '10px' }">
    <BasicTable @register="registerRole" @change="handleTableChange">
      <template #actions="{ record }">
        <Space>
          <!-- 70826 -->
          <span
            class="primary-color cursor-pointer"
            v-if="isHasAuth('70911')"
            @click="handlePriv(record)"
            >{{ t('table.system.authority') }}</span
          >
          <span
            class="primary-color cursor-pointer"
            v-if="isHasAuth('70910')"
            @click="handleOpenExtendInsertModal(record)"
            >{{ t('common.editorText') }}</span
          >
          <span
            class="cursor-pointer"
            v-if="isHasAuth('70825')"
            style="color: red"
            @click="deletFun(record)"
            >{{ t('common.delText') }}</span
          >
        </Space>
      </template>
      <template #tableTitle>
        <Space>
          <!-- <Button preIcon="uiw:left" type="primary" size="large" @click="handleBack">{{ t('common.back') }}</Button> -->
          <BasicButton type="primary" :iconSize="20" @click="handleBack" preIcon="RectBack:svg">
            {{ t('common.back') }}
          </BasicButton>
          <Button type="primary" size="large" v-if="isHasAuth('70823')" @click="handleInsert">{{
            t('modalForm.system.add_role')
          }}</Button>
        </Space>
      </template>
    </BasicTable>
    <extendInsertModal @register="registermodal" @success="handleSuccess" />
    <PrivModal @register="registerPrivModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup name="ExtendRole">
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { Space } from 'ant-design-vue';
  import { Button } from '/@/components/Button/index';
  import { PageWrapper } from '/@/components/Page';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import extendInsertModal from './components/extendInsertModal.vue';
  import { useModal } from '/@/components/Modal';
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { getGroupList, deleteGroup, getadminPrivList } from '/@/api/sys/rootManage';
  import { openConfirmCancelHidden } from '/@/utils/confirm';
  import { toTimezone } from '/@/utils/dateUtil';
  import { searchFormSchema } from './index.data';
  import PrivModal from './components/PrivListModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { SetTooltip } from '/@/views/common/component';
  import { auths, isHasAuth } from '/@/utils/authFunction';
  import BasicButton from '/@/components/Button/src/BasicButton.vue';

  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize;

  const columns: BasicColumn[] = [
    {
      title: t('modalForm.system.superior_role'),
      dataIndex: 'superiorName',
      minWidth: 280,
    },
    {
      title: t('table.system.role_name'),
      dataIndex: 'name',
      minWidth: 280,
    },
    {
      title: t('table.system.role_description'),
      dataIndex: 'noted',
      width: 280,
      customRender: ({ record }) => {
        return SetTooltip(record?.noted, 20);
      },
    },
    {
      title: t('table.google.report_columns_APP_updated'),
      dataIndex: 'updated_at',
      minWidth: 280,
      customRender: ({ record }) => {
        return toTimezone(record.updated_at, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: t('table.google.report_columns_APP_operator'),
      dataIndex: 'updated_name',
      minWidth: 280,
    },
    {
      title: t('table.system.operate'),
      minWidth: 280,
      dataIndex: 'action',
      ifShow: auths(['70911', '70910', '70825']),
      slots: {
        customRender: 'actions',
      },
    },
  ];
  const [registermodal, { openModal }] = useModal();
  const [registerPrivModal, { openModal: openPrivModal }] = useModal();
  const useStoreSite = useUserStore();
  const router = useRouter();
  const tableData = ref([]);

  const [registerRole, { reload }] = useTable({
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
    bordered: true,
    showIndexColumn: false,
    beforeFetch: (params) => {
      params['pid'] = history.state.gid;
      params['site_id'] = useStoreSite.getCurrentSite['id'];
    },
    afterFetch: (response) => {
      return response.map((item) => {
        return {
          ...item,
          superiorName: history.state.name, // 为每行数据添加 superiorName 字段
        };
      });
    },
  });
  function handleSuccess() {
    reload();
  }
  const handleTableChange = (pagination) => {
    const res = getGroupList({
      pid: history.state.gid,
      site_id: useStoreSite.getCurrentSite['id'],
      page: pagination.current,
      page_size: pagination.pageSize,
    });
    tableData.value = res.d;
  };
  onMounted(() => {});
  function handleBack() {
    router.go(-1);
  }
  function handleInsert() {
    openModal(true, {
      isUpdate: false,
      gid: history.state.gid,
      superiorName: history.state.name,
      site_id: history.state.site_id,
      permission: history.state.permission,
    });
  }
  // 二級角色用
  function handleOpenExtendInsertModal(record) {
    openModal(true, {
      isUpdate: true,
      record,
      gid: history.state.gid,
      superiorName: history.state.name,
    });
  }
  async function handlePriv(record: any) {
    const res = await getadminPrivList();
    const selectId = [];
    res.forEach((el) => {
      if (el.flag == 3) selectId.push(el.id);
    });
    const data = res.filter((el) => {
      return history.state.permission.includes(el.id);
    });
    openPrivModal(true, { record, source: data, selectId });
  }
  const deletFun = (record) => {
    openConfirmCancelHidden(
      t('common.warning'),
      t('table.system.system_dele_message_tip'),
      async () => {
        try {
          await deleteGroup(record.gid);
          reload();
        } catch (error) {
          console.error(error);
        }
      },
    );
  };
</script>
<style lang="less" scoped>
  ::v-deep(.vben-basic-table-header__tableTitle > *) {
    margin-bottom: 10px;
  }

  ::v-deep(.ant-table) {
    background-color: transparent;

    table > tbody > tr:nth-child(even) {
      background-color: #fff !important;
    }
  }
</style>
