<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :okText="okText"
    :showCancelBtn="false"
    @ok="handleSubmit"
    :minHeight="260"
    :width="695"
    :maxHeight="560"
    :footer="isControlValueSet() ? false : undefined"
  >
    <div class="flex unselectable relative" style="flex-wrap: wrap" ref="scrollContainer">
      <div
        class="base-tag flex items-center justify-center cursor relative mr-10px mb-15px"
        v-for="(element, index) in associatedAccount_list"
      >
        <div
          class="base-tag-text leading-loose flex-1 text-ellipsis overflow-hidden whitespace-nowrap flex items-center justify-center"
          style="position: relative"
          @click="!isControlValueSet() && handleClick(element, index)"
        >
          {{ element.name }}
          <CheckOutlined class="check-icon" v-show="element.state == 1" />
          <div class="triangle" v-show="element.state == 1"> </div>
        </div>
      </div>
      <div ref="loadMoreTrigger" class="load-more-trigger">{{
        UnloadMore ? '' : $t('table.system.system_more')
      }}</div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { CheckOutlined } from '@ant-design/icons-vue';
  import { ref, computed, unref, onBeforeUnmount } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { admin_list, admin_link } from '/@/api/sys/rootManage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  const emit = defineEmits(['success']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const isUpdate = ref(true);
  const gid = ref('');
  const dataTotal = ref(0);
  const name = ref('');
  const UnloadMore = ref(false);
  const list_parm = <any>ref({
    page: 1,
    gid: 1,
    zk: 1,
    page_size: 100,
  });
  const userId = ref('');
  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    setModalProps({ confirmLoading: false });

    userId.value = data.record.gid;
    UnloadMore.value = false;
    list_parm.value.page = 1;
    name.value = data.record.name;
    associatedAccount_list.value = [];

    data = data.record;
    list_parm.value.gid = String(data.gid) || '';
    list_parm.value.zk = data.zk || '1';

    loadMoreItems();
    createObserver();
  });

  const associatedAccount_list = <any>ref([]);

  const scrollContainer = ref(null);
  const loadMoreTrigger = ref(null);

  const loadMoreItems = async () => {
    UnloadMore.value = true;
    const res = await admin_list(list_parm.value);
    UnloadMore.value = false;
    if (res.d) {
      list_parm.value.page == 1 && (dataTotal.value = res.t);
      res.d.forEach((element) => {
        associatedAccount_list.value.push({ name: element.username, id: element.id, state: 1 });
      });
      if (res.d?.length != list_parm.value.page_size) {
        UnloadMore.value = true;
      }
    } else {
      UnloadMore.value = true;
    }
  };

  const handleClick = async (el, index) => {
    const { id, state } = el;
    associatedAccount_list.value[index].state = state === 1 ? 2 : 1;
  };

  let observer: any = null;
  const createObserver = () => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !UnloadMore.value) {
          setTimeout(() => {
            if (entry.isIntersecting && !UnloadMore.value) {
              list_parm.value.page += 1;
              loadMoreItems();
            }
          }, 333);
        }
      });
    });

    if (loadMoreTrigger.value) {
      observer.observe(loadMoreTrigger.value);
    }
  };

  onBeforeUnmount(() => {
    if (observer && loadMoreTrigger.value) {
      observer.unobserve(loadMoreTrigger.value);
    }
  });

  const { t } = useI18n();
  const getTitle = computed(() =>
    !unref(isUpdate)
      ? `「${name.value}」${t('table.system.extended_role')}`
      : `「${name.value}」${t('table.system.extended_role')}`,
  );
  const okText = computed(() =>
    !unref(isUpdate) ? t('table.system.system_conform_add') : t('business.banner_confrim'),
  );
  async function handleSubmit() {
    try {
      let sitesList: any = [];
      associatedAccount_list.value.forEach((element) => {
        if (element.state == 2) {
          sitesList.push(element.id);
        }
      });
      if (sitesList.length == 0) {
        closeModal();
        return false;
      }

      const res = await admin_link({ id: userId.value, uid: '', sites: sitesList });

      if (res) {
      }
      setModalProps({ confirmLoading: true });
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style lang="less" scoped>
  .base-tag {
    width: 120px;
    min-width: 120px;
    height: 35px;
    border: 1px solid #d9d9d9;
    border-radius: @border-radius-base;
    background-color: #fff;

    .base-tag-text {
      padding: 4px 7px;
      font-size: 12px;
    }

    .check-icon {
      position: absolute;
      z-index: 100;
      right: -2px;
      bottom: 1px;
      color: #fff;
      font-size: 14px;
    }

    .triangle {
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
    }

    .triangle::before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-bottom: 20px solid rgb(76 155 239);
      border-left: 20px solid transparent;
    }
  }

  .load-more-trigger {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
</style>
