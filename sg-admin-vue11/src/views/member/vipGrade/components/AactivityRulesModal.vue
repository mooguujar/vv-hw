<template>
  <BasicModal
    :title="$t('common.activity_rules')"
    :okText="$t('table.system.system_conform_save')"
    @ok="handleSubmit"
    :width="900"
    @register="registerBasicModal"
    :showCancelBtn="false"
  >
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <LangRadioGroup
          class="!m-b-5 !-mt-1"
          :contentList="contentList"
          :showTranslation="true"
          @click:radio="handlelanguageLevel"
          @click:translation="handleClickTranslation"
        />
      </template>
      <template #uploadTextRule="{ record, index }">
        <InputTextArea
          v-model:value="record.q"
          @change="handleTinymceChange($event, index, record)"
        />
      </template>
      <template #action="{ record, index }">
        <!-- <TableAction
          :actions="[
            {
              // label: $t('common.delText'),
              icon: 'clarity:note-edit-line',
              color: 'error',
              onClick: showConfirm.bind(null, index, record.id),
            },
          ]"
        /> -->
        <div class="flex justify-center">
          <img
            class="cursor-pointer disabled-link"
            :src="RECT_ADD"
            alt=""
            :style="{
              'pointer-events': 'auto',
            }"
            @click="handleAdd"
          />
          <img
            class="cursor-pointer disabled-link ml-5px"
            :src="RECT_DELETE"
            alt=""
            :style="{
              'pointer-events': 'auto',
            }"
            @click="showConfirm(index, record.id)"
          />
        </div>
      </template>
    </BasicTable>
    <div class="flex justify-center">
      <Button
        v-if="showAdd"
        class="table-add mt-5 !text-xs py-[10px] h-40px! leading-[40px]! flex! justify-center items-center w-[34%]"
        type="primary"
        preIcon="gala:add"
        @click="handleAdd"
      >
        {{ t('table.system.system_sort_add') }}
      </Button>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, watch, inject } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { ADDraggableRow } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { columnsActivityRules } from './VipConfiguration.data';
  import { openConfirm } from '/@/utils/confirm';
  import LangRadioGroup from '@/views/discountActivity/activity/components/insertActiveNew/LangRadioGroup.vue';
  import { Button } from '/@/components/Button';
  import { message } from 'ant-design-vue';
  import translateContentList from '/@/views/common/language-a';
  import { Input } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';

  const InputTextArea = Input.TextArea;

  import { useLocalList } from '/@/settings/localeSetting';
  const getData: any = inject<Function>('getData');
  const setData: any = inject<Function>('setData');
  const initData = computed(() => getData());
  const showAdd = computed(() => {
    if (!currentLang.value.transitionValue) {
      return true;
    } else if (currentLang.value.transitionValue?.length < 1) {
      return true;
    } else {
      return false;
    }
  });
  interface Props {
    vipData: vipdataI;
  }
  interface vipdataI {
    activityRules: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    vipData: { activityRules: [] },
  });
  const { t } = useI18n();
  type Recordable<T = any> = Record<string, T>;
  let tableSearchParam = ref<any>({});
  const [registerBasicModal, { closeModal }] = useModalInner((data) => {});

  const localeList = useLocalList();
  const currentlanguageVal = ref('');
  const currentlanguageQ = ref('');

  const langList = localeList.map((item) => {
    return {
      label: t('common.common_' + item.event),
      value: item.event,
      transitionValue: '',
      transitionValueTitle: '',
      image_url: '',
      language: item.language || '',
      fileList: [],
    };
  });

  const contentList: any = ref([...langList]);
  const currentLang: any = ref(contentList.value[0]); // 当前语言公告内容

  // let dataList: any = [];
  watch(
    () => props.vipData,
    (newV) => {
      if (Array.isArray(props.vipData?.activityRules)) {
        contentList.value.forEach((el) => {
          el.transitionValue = props.vipData?.activityRules.find(
            (item) => item.key == el.value,
          )?.value;
          if (!Array.isArray(el.transitionValue)) {
            el.transitionValue = JSON.parse(el.transitionValue);
          }
        });
        currentLang.value = contentList.value[currentlanguageIndex.value];
      } else {
      }
    },
  );

  function getData_(...args) {
    return new Promise((resolve, reject) => {
      try {
        if (!Array.isArray(currentLang.value.transitionValue)) {
          currentLang.value.transitionValue = [
            {
              q: currentLang.value.transitionValue ?? '',
            },
          ];
        }
        const result = currentLang.value.transitionValue;
        resolve(result); // 成功时调用resolve
      } catch (error) {
        reject(error); // 出错时调用reject
      }
    });
  }

  const [registerTable, { reload, setTableData }] = useTable({
    customRow: (record, index) => {
      return ADDraggableRow(currentLang.value.transitionValue, index, setTableData, sortTable);
    },
    api: getData_,
    columns: columnsActivityRules,
    bordered: true,
    pagination: false,
    // dataSource: dataList.value,
    showIndexColumn: false,
    actionColumn: {
      width: 160,
      title: t('business.common_operate'), //操作
      dataIndex: 'action',
      fixed: false,
      slots: { customRender: 'action' },
    },
    useSearchForm: false,
    beforeFetch: (tableParams: Recordable) => {
      return Object.assign(tableParams, tableSearchParam.value);
    },
    afterFetch: (data) => {},
  });
  function handleAdd() {
    const addRow = { q: '' };
    // currentLang.value.transitionValue.push(addRow);
    contentList.value.forEach((p) => {
      if (Array.isArray(p.transitionValue)) {
        p.transitionValue.push(addRow);
      } else {
        p.transitionValue = [addRow];
      }
    });
    // } else {
    // }
    setTimeout(() => {
      reload();
    }, 111);
  }
  async function handleSubmit() {
    // const values = await validate();
    let params = <any>[];
    params = cloneDeep(contentList.value).map((el) => {
      return {
        key: el.value,
        ty: 16,
        value: JSON.stringify(el.transitionValue),
      };
    });
    setData(params);
    closeModal();
  }

  function showConfirm(index, id) {
    //操作确认, 是否进行删除操作？删除后无法恢复
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.system.system_option_delete_tip'),
      () => {
        handleDelete(index, id);
      },
      '',
    );
  }

  function handleDelete(index, id) {
    // currentLang.value.transitionValue.splice(index, 1);
    contentList.value.forEach((p) => {
      p.transitionValue.splice(index, 1);
    });
    reload();
  }

  const currentlanguageIndex = ref(0);
  const tinymceIsChange = ref(false as any);
  // 切换语言
  const handlelanguageLevel = (value, el) => {
    tinymceIsChange.value = false;

    currentlanguageIndex.value = value;
    currentLang.value = contentList.value[currentlanguageIndex.value];
    setTimeout(() => {
      reload();
    }, 111);
  };

  const toParse_list = () => {
    contentList.value.forEach((el) => {
      if (el.value === currentlanguageVal.value) {
        el.transitionValue = currentlanguageQ.value;
      }
      el.transitionValue = el.transitionValue.split('||').map((q) => ({ q: q }));
    });
  };

  function handleClickTranslation() {
    if (!contentList.value[currentlanguageIndex.value].transitionValue) {
      message.error(t('v.bannner.origin_transitionValue'));
      return;
    }
    currentlanguageQ.value = contentList.value[currentlanguageIndex.value].transitionValue
      .map((o) => o.q)
      .join('||');
    let filterArr = contentList.value.filter((item, ind) => ind !== currentlanguageIndex.value);
    currentlanguageVal.value = contentList.value.filter(
      (item, ind) => ind === currentlanguageIndex.value,
    )[0].value;
    translateContentList(
      filterArr,
      currentlanguageQ.value,
      0,
      'transitionValue',
      contentList.value[currentlanguageIndex.value]['value'],
    ).then((res) => {
      toParse_list();
      if (res.success) {
        message.success(t('v.bannner.transitionValue_success'));
      } else {
        message.error(t('v.bannner.transitionValue_error'));
      }
    });
  }

  function handleTinymceChange(value, index, record) {
    tinymceIsChange.value = true;
    contentList.value[currentlanguageIndex.value].transitionValue[index].q = value.target.value;
  }

  async function sortTable(targetWork, tempSource, source, target) {
    if (!targetWork && !tempSource) {
      return;
    }
    //TODO 分类id  专题上一个id 下一个id
    let param = {
      index_id: targetWork.id,
      notice_type: 1, // 类型(1-公告,2-跑马灯)
      id: tempSource.id, // 广告Id
      sort_before: tempSource.seq,
      sort_after: targetWork.seq,
    };
    try {
      let dataSource = currentLang.value.transitionValue;
      if (!dataSource || !dataSource.length) {
        return;
      }
      contentList.value.forEach((p) => {
        let tempSource1 = p.transitionValue[source];
        p.transitionValue.splice(source, 1);
        p.transitionValue.splice(target, 0, tempSource1);
      });
      setTableData(dataSource);
      reload();
    } catch (e) {
      console.loerrorg(e);
    }
  }
</script>
<style scoped lang="less">
  .ant-form-item-label > label,
  .text-horizon-center {
    height: 40px;
    line-height: 40px;
  }

  .table-add {
    margin: 20px auto 0;

    ::v-deep(.app-iconify) {
      svg {
        font-size: 20px;
      }
    }
  }
</style>
