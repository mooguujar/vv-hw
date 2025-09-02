<template>
  <div class="flex">
    <leftButton
      :tableValue="props.tabValue"
      @handle-change-emit="handleChangeEmit"
      @emit-add="emitAdd"
    />
    <ApiTable class="w-0 grow" ref="childComponent" :apiMap="apiMap" />
    <addChildModal @register="registerAddModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { columns, schemas } from './payDomain.data';
  import ApiTable from '../common/apiTable.vue';
  import leftButton from '../common/leftButton.vue';
  import { getChildDomainList, deleteChildDomain, batchDeleteChildDomain } from '/@/api/domain';
  import { useModal } from '/@/components/Modal';
  import addChildModal from '../common/modal/addChildModal.vue';

  const childComponent = ref(null as any); //子组件ref
  const [registerAddModal, { openModal: addOpenModal }] = useModal();
  const props = defineProps({
    tabValue: {
      type: Number,
      default: 0,
    },
  });
  const apiMap = {
    list: getChildDomainList, // 列表
    batchDeleteDomain: batchDeleteChildDomain, //批量删除
    deleteList: deleteChildDomain,
    type: 5,
    columns: columns,
    schemas: schemas,
    formHide: true, //Form搜索表单开启
    // title: '公司入款列表',
    // modelTitle: '入款详情',
  };
  //左边的按钮刷新列表
  function handleChangeEmit(v) {
    childComponent?.value?.setLoad(v);
  }
  function emitAdd() {
    addOpenModal(true, { type: 5 });
  }
</script>
