<template>
  <div class="flex">
    <leftButton
      :tableValue="props.tabValue"
      @handle-change-emit="handleChangeEmit"
      @emit-add="emitAdd"
    />
    <ApiTable class="w-0 grow" ref="childComponent" :apiMap="apiMap">
      <template #customizeAction="{ record }">
        <Space>
          <span class="caret-red cursor" style="color: #e91134" @click="handleDelete(record)">{{
            t('table.common.delete')
          }}</span>
        </Space>
      </template>
    </ApiTable>
    <customizationModal @register="registerAddModal" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { columns, schemas } from './customAnalysis.data';
  import ApiTable from '../common/apiTable.vue';
  import leftButton from '../common/leftButton.vue';
  import { getDomainResolve, batchDeleteResolveDomain } from '/@/api/domain/index';
  import customizationModal from '../common/modal/customizationModal.vue';
  import { useModal } from '/@/components/Modal';
  import { Space, message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { openConfirm } from '/@/utils/confirm';

  const { t } = useI18n();
  const childComponent = ref(null as any); //自组件ref
  const props = defineProps({
    tabValue: {
      type: Number,
      default: 0,
    },
  });
  const apiMap = {
    list: getDomainResolve, // 列表
    useType: 'custom',
    batchDeleteDomain: batchDeleteResolveDomain, //批量删除
    columns: columns,
    schemas: schemas,
    formHide: true, //form搜索开启
    hideMultipleDelete: true,
  };
  const [registerAddModal, { openModal: addOpenModal }] = useModal();
  //左边的按钮刷新列表
  function handleChangeEmit(v) {
    if (v == 'custom') {
      childComponent?.value?.setLoad(2);
    } else {
      childComponent?.value?.setLoad(v);
    }
  }
  // 添加
  function emitAdd() {
    addOpenModal(true);
  }
  // 删除 - 单个
  async function handleDelete(record) {
    //警告提示
    openConfirm(t('common.warning'), t('table.system.system_remove_domain_tip'), async () => {
      const { status, data } = await batchDeleteResolveDomain({ ids: record.id });
      if (status) {
        childComponent?.value?.reload();
        message.success(data);
      } else {
        message.error(data);
      }
    });
  }
</script>
