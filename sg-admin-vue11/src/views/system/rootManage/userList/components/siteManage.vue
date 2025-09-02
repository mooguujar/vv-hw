<template>
  <BasicModal
    :width="800"
    @register="registerSite"
    :title="$t('table.system.system_root_useSite') + nickname"
    :okText="$t('common.confirmSave')"
    :showCancelBtn="false"
    :destroyOnClose="true"
    :showOkBtn="getType === '2' ? false : true"
    @ok="submitOk"
    :closeFunc="handleClose"
  >
    <div class="siteModalUserList">
      <div class="allBox">
        <div class="allItem !ml-8px">
          <Checkbox
            v-model:checked="state.checkAll"
            :indeterminate="state.indeterminate"
            @change="onCheckAllChange"
            :disabled="getType === '2'"
          >
            <span>{{ $t('business.common_select_all') }}</span>
          </Checkbox>
        </div>
      </div>
      <CheckboxGroup
        v-model:value="state.checkedList"
        @change="checkedListChange"
        :disabled="getType === '2'"
      >
        <Checkbox
          class="border border-gray-200 !ml-8px !pl-2 !py-2 !mb-2 !mt-2 w-138px siteCheckedList whitespace-nowrap overflow-hidden text-ellipsis"
          v-for="item in listSite"
          :value="item.value"
          :key="item.value"
        >
          {{ item?.label }}
        </Checkbox>
      </CheckboxGroup>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, watch, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Checkbox, CheckboxGroup } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { adminGroupSiteLink } from '/@/api/sys';

  const props = defineProps({
    sites: {
      default: [],
      type: Array,
    },
    edit: {
      default: false,
      type: Boolean,
    },
  });
  const emit = defineEmits(['emitList', 'register', 'successEmit']);
  const state = reactive({
    checkAll: false,
    checkedList: <any>[],
    indeterminate: false,
  });
  const uid = ref();
  const nickname = ref('');
  const getType = ref('' as any);
  const openType = ref('' as any);
  const [registerSite, { closeModal }] = useModalInner((data) => {
    state.checkedList = [];
    openType.value = data.type;
    getType.value = data.data.zk;
    uid.value = data.data.id;
    nickname.value = props.edit ? '' : '(' + data.data.username + ')';
    state.checkedList = data.data.sites;
    if (props.sites.length) {
      state.checkedList = props.sites;
    }
    initList();
  });
  const userStore: any = useUserStore();
  const checkValue = ref([] as any);

  const listSite = ref([] as any);
  const initList = () => {
    if (props.edit) {
      listSite.value = userStore.getGroupSiteList.map((t) => {
        return {
          label: t.name,
          value: t.id,
        };
      });
      if (openType.value == 'add') {
        // allChooise();
      }
    } else {
      listSite.value = [];
      userStore.getGroupSiteList.forEach((item) => {
        state.checkedList.forEach((element) => {
          if (element == item.id) {
            listSite.value.push(item);
          }
        });
      });
      listSite.value = listSite.value.map((t) => {
        return {
          label: t.name,
          value: t.id,
        };
      });
    }
  };
  initList();

  const onCheckAllChange = (e: any) => {
    const allSelect = [];
    listSite.value.map((item: any) => {
      return allSelect.push(item.value as never);
    });
    Object.assign(state, {
      checkedList: e.target.checked ? allSelect : [],
      indeterminate: false,
    });
  };
  function checkedListChange(v) {
    checkValue.value = v;
  }
  function handleClose() {
    return true;
  }
  function allChooise() {
    let listArr = [];
    listSite.value.forEach((v) => {
      listArr.push(v.value as never);
    });
    state.checkedList = listArr;
  }
  function prioritizeObject(arr, key) {
    const index = arr.findIndex((obj) => obj.i === key.toString());
    if (index !== -1) {
      const obj = arr.splice(index, 1)[0];
      arr.unshift(obj);
    }
    return arr;
  }
  onMounted(() => {});
  async function submitOk() {
    if (props.edit) {
      closeModal();
      emit('emitList', state.checkedList);
    } else {
      // state.checkedList.push(listSite.value[0].value as never)
      let checkedList: any = [];
      state.checkedList.forEach((element) => {
        checkedList.push(element);
      });
      let parm = { id: '', uid: uid.value, sites: checkedList };
      const response = await adminGroupSiteLink(parm);
      if (response) {
        closeModal();
        emit('successEmit');
      }
    }
  }
  watch(
    () => state.checkedList,
    (val) => {
      state.indeterminate = !!val?.length && val.length < listSite.value.length;
      state.checkAll = val?.length >= listSite.value.length;
    },
  );
</script>

<style lang="less">
  .siteModalUserList .ant-checkbox-group {
    .ant-checkbox-group-item {
      height: 40px !important;
      margin: 10px 5px;
      padding: 0 10px;
      border: 1px solid #ccc;
      border-radius: 2px;
      line-height: 40px !important;
    }
  }

  .allBox .allItem {
    width: 135px;
    height: 40px;
    margin: 10px 5px;
    padding: 0 10px;
    border: 1px solid #ccc;
    line-height: 40px;
  }

  .siteCheckedList {
    span {
      // width:inherit;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
