<template>
  <div>
    <BasicTable @register="registerTable" class="LayoutTable" :scroll="{ y: scrollHeight }">
      <template #form-insertAccount>
        <Button type="primary" v-if="isHasAuth('70813')" class="!mr-10px" @click="insertAcount"
          >{{ $t('modalForm.system.system_add_username') }}
        </Button>
      </template>
      <template #action="{ record }">
        <Space v-if="record.zk === '1'">
          <span
            v-if="isHasAuth('70815')"
            class="cursor-pointer primary-color"
            @click="handleStoped(record)"
            :class="{ red: record.state === 1 }"
            >{{
              record.state === 1
                ? $t('business.common_deactivate')
                : $t('business.common_on_activate')
            }}</span
          >

          <span
            class="cursor-pointer primary-color"
            v-if="isHasAuth('70814')"
            @click="handleEdit(record)"
            >{{ $t('business.common_edit') }}</span
          >
          <span
            class="cursor-pointer primary-color"
            v-if="isHasAuth('70816')"
            @click="handleUpdatePassword(record)"
            >{{ $t('table.system.system_root_editPassword') }}</span
          >
          <span
            class="cursor-pointer primary-color"
            v-if="isHasAuth('70884')"
            @click="loginKeyHandle(record)"
            >{{ t('table.system.longin_single') }}</span
          >
          <span
            class="cursor-pointer primary-color"
            @click="handlesAmount(record)"
            v-if="isHasAuth('70869')"
          >
            {{ $t('table.system.system_limit_') }}
          </span>
          <span
            class="cursor-pointer red"
            v-if="isHasAuth('70817')"
            @click="handleDelete(record)"
            >{{ $t('business.common_delete') }}</span
          >
        </Space>
        <span v-else>-</span>
      </template>
      <template #settingSite="{ record }">
        <span
          :class="isHasAuth('70814') ? 'cursor-pointer primary-color' : ''"
          @click="isHasAuth('70814') && siteHandle(record)"
          >{{
            record.sites.length >= userStore.getSiteList.length
              ? t('table.system.system_all_sites')
              : record.sites.length
          }}</span
        >
      </template>
      <template #addmoney="{ record }">
        <span
          v-if="(limit_bulk_data[record.id]?.funds_limit_state &&
            Object.values(limit_bulk_data[record.id].funds_limit_state).every(
              (value) => value === 0,
            )) ||
          !!!(limit_bulk_data[record.id] as any)?.funds_limit_state"
        >
          {{ t('common.no_restriction_currency') }}
        </span>
        <span v-else class="cursor-pointer primary-color" @click="handleViews(record, 'add')">{{
          t('common.view')
        }}</span>
      </template>
      <template #root_role="{ record }"
        >{{ record.group_ids ? getRole(record.group_ids) : '-' }}
      </template>
      <template #singleMoney="{ record }">
        <span
          v-if="(limit_bulk_data[record.id]?.single_limit_state &&
            Object.values(limit_bulk_data[record.id].single_limit_state).every(
              (value) => value === 0,
            )) ||
          !!!(limit_bulk_data[record.id] as any)?.single_limit_state"
        >
          {{ t('common.no_restriction_currency') }}
        </span>
        <span v-else class="cursor-pointer primary-color" @click="handleViews(record, 'single')">{{
          t('common.view')
        }}</span>
      </template>
      <template #memberId="{ record }">
        <div v-if="record.online === 1">{{ record.username }}</div>
        <div v-else-if="record.online === 2">
          <img v-if="record.online === 2" src="/@/assets/webp/code.webp" alt="" />
          {{ record.username }}
        </div>
        <div v-else>{{ record.username }}</div>
      </template>
    </BasicTable>
    <accountModal @register="registerModal" @success-emit="reload" />
    <quotaModalShow @register="registerQuota" @success-emit="reload" />
    <updatePassword @register="registerUpdatePassword" @success-emit="reload" />
    <siteManage @register="registerSite" @success-emit="reload" />
    <singleLimitModal @register="registerSingle" />
    <loginKeyModal @register="loginKeyModalRegister" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './index.data.ts';
  import { Button, Space, message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import accountModal from './accountModal.vue';
  import {
    getAdminList,
    deleteAdmin,
    updateState,
    adminGroupsList,
    limit_detail,
    limit_bulk,
  } from '/@/api/sys/index';
  import { openConfirm } from '/@/utils/confirm';
  import { useI18n } from '/@/hooks/web/useI18n';
  import quotaModalShow from './components/quotaModal.vue';
  import updatePassword from './components/editPassword.vue';
  import siteManage from './components/siteManage.vue';
  import singleLimitModal from './components/singleLimitModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { isHasAuth } from '/@/utils/authFunction.js';
  import loginKeyModal from './components/loginKeyModal.vue';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight.js';

  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(325).value);
  const userStore = useUserStore();
  const listValue = ref([]);
  const limit_bulk_data = ref({});
  const [registerTable, { reload }] = useTable({
    api: getAdminList,
    columns,
    formConfig: {
      schemas: searchFormSchema,
      showResetButton: false,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
    },
    useSearchForm: true,
    bordered: true,
    showIndexColumn: false,
    beforeFetch: (params) => {
      params['gid'] = '0';
      params['state'] = '0';
    },
    afterFetch: (data) => {
      limit_bulk({ uids: data.map((item) => item.id).join(',') }).then((data_) => {
        limit_bulk_data.value = data_.data;
      });

      return data;
    },
  });
  const [registerModal, { openModal: insertModal }] = useModal();
  const [registerQuota, { openModal: quotaModal }] = useModal();
  const [registerUpdatePassword, { openModal: openUpdateModal }] = useModal();
  const [registerSite, { openModal: openSite }] = useModal();
  const [registerSingle, { openModal: openSingle }] = useModal();
  const [loginKeyModalRegister, { openModal: loginKey }] = useModal();

  function insertAcount() {
    insertModal(true, 'data');
  }

  function handleStoped(record) {
    let state = record.state === 1 ? 2 : 1;
    let text =
      record.state === 1
        ? t('table.common.deactivate').toLowerCase()
        : t('table.common.activate').toLowerCase();
    openConfirm(
      t('common.warning'),
      `${t('table.system.system_handle', { len: text })}`,
      async () => {
        const { data, status } = await updateState({ state: state, id: record.id });
        if (status) {
          message.success(data);
          reload();
        } else {
          message.error(data);
        }
      },
    );
  }

  function siteHandle(record) {
    openSite(true, { type: 'site', data: record });
  }

  async function handlesAmount(record) {
    let { data, status } = await limit_detail({ uid: record.id });
    if (status) {
      record.data = data ?? {};
      quotaModal(true, record);
    }
  }

  function handleUpdatePassword(record) {
    openUpdateModal(true, record);
  }

  function handleEdit(data) {
    insertModal(true, data);
  }

  function handleDelete(record) {
    openConfirm(t('common.warning'), t('table.system.system_message_delete_tip'), async () => {
      const { status, data } = await deleteAdmin({ id: record.id });
      if (status) {
        message.success(data);
        reload();
      } else {
        message.error(data);
      }
    });
  }

  function loginKeyHandle(record) {
    loginKey(true, { data: record });
  }

  async function handleViews(record, row) {
    let { data, status } = await limit_detail({ uid: record.id });
    if (status) {
      openSingle(true, { record: data ?? {}, type: row });
    }
  }

  function getRole(v) {
    const filste = listValue.value.filter((item) => {
      return item.gid == v['s' + userStore.getCurrentSite['id']];
    });
    return filste[0]?.name;
  }

  onMounted(async () => {
    const data = await adminGroupsList({ gid: '1', site_id: '1' });
    listValue.value = data;
  });
</script>

<style lang="less" scoped>
  .red {
    color: #e91134;
  }

  ::v-deep(.vben-basic-table-form-container .ant-form) {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
