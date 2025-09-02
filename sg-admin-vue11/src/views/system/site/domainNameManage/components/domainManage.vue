<template>
  <div class="flex">
    <leftButton
      @emit-cdn-model="cdnModel"
      @emit-limit="limitModel"
      @emit-add="emitAdd"
      @handle-change-emit="handleChangeEmit"
    />
    <ApiTable class="grow w-0" :apiMap="apiMap" ref="childComponent">
      <template #action="{ record }">
        <Space>
          <span
            class="cursor primary-color"
            v-if="record.cdn_type === 1 && record.state === 2"
            @click="editModal(record)"
            >{{ t('table.system.edit') }}</span
          >
          <span
            class="cursor primary-color"
            v-if="record.cdn_type === 2"
            @click="editModal(record)"
            >{{ t('table.system.edit') }}</span
          >
          <span
            v-if="record.cdn_type === 1 && record.state !== 2"
            class="cursor"
            style="color: #e91134"
            @click="handleStoped(record)"
            >{{ t('table.system.deactivate') }}</span
          >
          <span
            v-if="record.cdn_type === 2"
            class="caret-red cursor"
            style="color: #e91134"
            @click="handleDelete(record)"
            >{{ $t('common.delText') }}</span
          >
          <span
            v-if="record.cdn_type !== 2 && record.state !== 1"
            class="caret-red cursor"
            style="color: #e91134"
            @click="handleDelete(record)"
            >{{ $t('common.delText') }}
          </span>
        </Space>
      </template>
    </ApiTable>
    <cdnMaageModel @register="registerCdnModel" />
    <limitModal @register="registerLimit" />
    <addModal @register="registerAddModal" @emit-load="emitLoad" />
    <childainModal @register="registerChildHandle" />
    <updateModal @register="registerUpdate" @activeSuccess="submitReload" />
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { columns, schemas } from './domainManage.data';
  import ApiTable from '../common/apiTable.vue';
  import leftButton from '../common/leftButton.vue';
  import cdnMaageModel from '../common/modal/cdnModel.vue';
  import { useModal } from '/@/components/Modal';
  import limitModal from '../common/modal/limitModal.vue';
  import addModal from '../common/modal/addModal.vue';
  import updateModal from '../common/modal/updateModal.vue';
  import {
    getdomainListData,
    deleteDomain,
    stateUpdateDomain,
    batchDeleteDomain,
  } from '/@/api/domain';
  import eventBus from '/@/utils/eventBus';
  import childainModal from '../common/modal/childainModal.vue';
  import { Space, message } from 'ant-design-vue';
  import { openConfirm } from '/@/utils/confirm';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const childComponent = ref(null as any); //自组件ref
  const typeName = ref('' as any);
  const apiMap = {
    list: getdomainListData, // 列表
    // batchDeleteDomain: batchDeleteDomain, //批量删除
    type: null,
    schemas: schemas,
    columns: columns,
    formHide: true, //Form搜索表单开启
    // title: '公司入款列表',
    // modelTitle: '入款详情',
    hideMultipleDelete: true,
  };
  const [registerCdnModel, { openModal: opencdnModal }] = useModal();
  const [registerLimit, { openModal: openLimit, setModalProps }] = useModal();
  const [registerAddModal, { openModal: addOpenModal }] = useModal();
  const [registerChildHandle, { openModal: openChild }] = useModal();
  const [registerUpdate, { openModal: openUpdateModal }] = useModal();
  function cdnModel() {
    opencdnModal(true, 'data');
  }
  function limitModel() {
    openLimit(true, { footer: null });
  }

  // eventBus.on('ChildDomindModal', (data) => {
  //   openChild(true, data);
  // });

  function emitLoad() {}
  function emitAdd() {
    addOpenModal(true);
  }

  //左边的按钮刷新列表
  function handleChangeEmit(v) {
    if (v == 'custom') {
      childComponent?.value?.setLoad(2);
    } else {
      childComponent?.value?.setLoad(v);
    }
  }
  onMounted(() => {
    setModalProps({ footer: false });
    eventBus.on('ChildDomindModal', (data) => {
      openChild(true, data);
    });
  });

  onBeforeMount(() => {
    eventBus.off('ChildDomindModal');
  });

  // 停用
  function handleStoped(record) {
    openConfirm(
      t('common.warning'),
      t('table.system.deactivate_domain_sure'),
      async () => {
        const state = record.state === 1 ? 2 : 1;
        const { status, data } = await stateUpdateDomain({ state: state, id: record.id });
        if (status) {
          childComponent?.value?.reload();
          message.success(data);
        } else {
          message.error(data);
        }
      },
      '',
    );
  }
  function editModal(record) {
    openUpdateModal(true, { data: record });
  }
  function submitReload() {
    childComponent?.value?.reload();
  }
  async function handleDelete(record) {
    openConfirm(
      t('common.warning'),
      t('table.system.system_remove_domain_tip'),
      async () => {
        const { status, data } = await deleteDomain({ id: record.id });
        if (status) {
          childComponent?.value?.reload();
          message.success(data);
        } else {
          message.error(data);
        }
      },
      '',
    );
  }
</script>
<style scoped>
  ::v-deep(.vben-editable-cell__normal-icon) {
    top: -13px;
    right: -18px;
  }

  ::v-deep(.edit-changeLine) {
    max-width: 400px !important;
    padding: 19px !important;
    white-space: normal;
  }

  ::v-deep(.vben-editable-cell .ellipsis-cell .cell-content) {
    white-space: normal;
  }
</style>
