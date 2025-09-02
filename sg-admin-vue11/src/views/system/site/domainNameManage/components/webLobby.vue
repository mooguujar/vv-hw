<template>
  <div class="flex">
    <leftButton
      :tableValue="props.tabValue"
      @emit-add="emitAdd"
      @handle-change-emit="handleChangeEmit"
    />
    <ApiTable class="grow w-0" ref="childComponent" :apiMap="apiMap">
      <template #action="{ record }">
        <Space>
          <span class="primary-color cursor" @click="editHandle(record)">
            {{ t('table.system.edit') }}
          </span>
          <span
            class="caret-red cursor"
            style="color: #e91134"
            @click="handleDelete({ id: record.id, domain_id: record.domain_id })"
            >{{ $t('common.delText') }}</span
          >
        </Space>
      </template>
    </ApiTable>
    <addChildModal @register="registerAddModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { columns, schemas } from './webLobby.data';
  import ApiTable from '../common/apiTable.vue';
  import leftButton from '../common/leftButton.vue';
  import { useModal } from '/@/components/Modal';
  import addChildModal from '../common/modal/addChildModal.vue';
  import { getChildDomainList, deleteChildDomain, batchDeleteChildDomain } from '/@/api/domain';
  import { Space, message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { openConfirm } from '/@/utils/confirm';

  const { t } = useI18n();
  const props = defineProps({
    tabValue: {
      type: Number,
      default: 0,
    },
  });
  const childComponent = ref(null as any); //子组件ref
  const [registerAddModal, { openModal: addOpenModal }] = useModal();
  const apiMap = {
    list: getChildDomainList, // 列表
    batchDeleteDomain: batchDeleteChildDomain, //批量删除
    type: 1,
    columns,
    schemas,
    formHide: true, //Form搜索表单开启
    hideMultipleDelete: true,
  };
  function emitAdd() {
    addOpenModal(true, { type: 1 });
  }
  function editHandle(data) {
    addOpenModal(true, { edit: 'edit', type: 1, data: data });
  }
  //左边的按钮刷新列表
  function handleChangeEmit(v) {
    if (v == 'custom') {
      childComponent?.value?.setLoad(2);
    } else {
      childComponent?.value?.setLoad(v);
    }
  }
  function handleDelete(params) {
    openConfirm(t('common.warning'), t('table.system.system_remove_domain_tip'), async () => {
      const { status, data } = await deleteChildDomain(params);
      if (status) {
        childComponent?.value?.reload();
        message.success(data);
      } else {
        message.error(data);
      }
    });
  }
</script>
