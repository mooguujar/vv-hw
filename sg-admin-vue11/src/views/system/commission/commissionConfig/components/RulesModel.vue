<template>
  <BasicModal
    :maskClosable="false"
    :closeFunc="handleCloseFunc"
    :okText="t('table.system.system_conform_save')"
    :title="t('common.activity_rules')"
    @register="registerBasicModal"
    @ok="handleSubmit"
    :width="900"
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
        <a @click="handleAdd" class="mr-2" v-if="isHasAuth('70312')"><img :src="RECT_ADD" /></a>
        <a @click="showConfirm(index, record.id)" v-if="isHasAuth('70308')"
          ><img :src="RECT_DELETE"
        /></a>
      </template>
    </BasicTable>
    <div class="flex justify-center">
      <Button
        class="table-add mt-5 !text-xs py-[10px] h-40px! leading-[40px]! flex! justify-center items-center w-[34%]"
        type="primary"
        preIcon="gala:add"
        @click="handleAdd"
        v-if="isHasAuth('70312') && showAddBtn"
      >
        {{ t('table.system.system_sort_add') }}
      </Button>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { h, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { ADDraggableRow } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { openConfirm } from '/@/utils/confirm';
  import LangRadioGroup from '@/views/discountActivity/activity/components/insertActiveNew/LangRadioGroup.vue';
  import { Button } from '/@/components/Button';
  import { message } from 'ant-design-vue';
  import translateContentList from '/@/views/common/language-a';
  import { Input } from 'ant-design-vue';
  import Icon from '/@/components/Icon';
  import { useLocalList } from '/@/settings/localeSetting';
  import { updateCommissionConfigV1 } from '@/api/commission';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import { isHasAuth } from '@/utils/authFunction';

  const { t } = useI18n();
  const emit = defineEmits(['closeLoad', 'register']);
  const InputTextArea = Input.TextArea;
  type Recordable<T = any> = Record<string, T>;
  let tableSearchParam = ref<any>({});
  let rulesData = ref<any>(null);
  const showAddBtn = ref(false);
  // 打开页面
  const [registerBasicModal, { closeModal }] = useModalInner((data) => {
    reload();
    let obj = JSON.parse(data?.rules);
    rulesData.value = data;
    contentList.value.forEach((el) => {
      Object.keys(obj).forEach((key) => {
        if (el.value === key) {
          let arr = [];
          arr = obj[el.value].map((item) => {
            return {
              q: item,
            };
          });
          el.transitionValue = arr;
          if (!arr.length) {
            showAddBtn.value = true;
          }
        }
      });
    });
  });
  const localeList = useLocalList();
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
  const columns: any[] = [
    {
      title: t('business.common_sort'), // 排序
      dataIndex: 'id',
      width: 60,
      customRender: () => {
        return h(Icon, { icon: 'ri:drag-move-2-line' });
      },
    },
    {
      title: t('table.discountActivity.discount_rule_sepification'), // 规则说明
      dataIndex: 'category_name',
      editRow: true,
      editComponent: 'Input',
      slots: { customRender: 'uploadTextRule' },
    },
  ];
  const contentList: any = ref([...langList]);
  const currentLang: any = ref(contentList.value[0]); // 当前语言公告内容

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
    columns: columns,
    bordered: true,
    pagination: false,
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
  });

  const currentlanguageIndex = ref(0);
  const currentlanguageVal = ref('');
  const currentlanguageQ = ref('');
  const tinymceIsChange = ref(false as any);
  // 切换语言
  const handlelanguageLevel = (value, el) => {
    tinymceIsChange.value = false;
    currentlanguageIndex.value = value;
    currentLang.value = contentList.value[currentlanguageIndex.value];
    setTimeout(() => {
      reload();
    }, 0);
  };
  const toParse_list = () => {
    contentList.value.forEach((el) => {
      if (el.value === currentlanguageVal.value) {
        el.transitionValue = currentlanguageQ.value;
      }
      el.transitionValue = el.transitionValue.split('||').map((q) => ({ q: q }));
    });
  };

  // 一键翻译
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

  /** 拖拽排序 */
  async function sortTable(targetWork, tempSource, source, target) {
    if (!targetWork && !tempSource) {
      return;
    }
    try {
      let dataSource = currentLang.value.transitionValue;
      contentList.value.map((item) => {
        if (Array.isArray(item.transitionValue)) {
          let dataSource1 = item.transitionValue[source];
          if (!dataSource || !dataSource.length) {
            return;
          }
          item.transitionValue.splice(source, 1);
          item.transitionValue.splice(target, 0, dataSource1);
        }
        return item;
      });
      setTableData(dataSource);
      reload();
    } catch (e) {
      console.error(e);
    }
  }

  // 文本编辑
  function handleTinymceChange(value, index, record) {
    tinymceIsChange.value = true;
    contentList.value[currentlanguageIndex.value].transitionValue[index].q = value.target.value;
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

  // 梯级删除
  function handleDelete(index, id) {
    contentList.value.map((item) => {
      if (Array.isArray(item.transitionValue)) {
        item.transitionValue.splice(index, 1);
        if (!item.transitionValue.length) {
          showAddBtn.value = true;
        }
      }
      return item;
    });
    reload();
  }

  // 新增梯级功能
  function handleAdd() {
    contentList.value.map((item) => {
      if (Array.isArray(item.transitionValue)) {
        const addRow = { q: '' };
        item.transitionValue.push(addRow);
        showAddBtn.value = false;
      }
      return item;
    });
    setTimeout(() => {
      reload();
    }, 0);
  }

  function hasEmptyData(obj) {
    for (const [key, arr] of Object.entries(obj)) {
      if (arr.some((item) => item === '')) {
        return key; // 找到第一个包含空字符串的键并返回
      }
    }
    return null; // 如果没有找到，返回 null
  }

  // 梯级提交
  async function handleSubmit() {
    if (rulesData.value?.ty) {
      await closeModal();
      return;
    }
    let obj = <any>{};
    let arr = <any>[];
    contentList.value.forEach((el) => {
      if (el.transitionValue.length) {
        el.transitionValue.forEach((item) => {
          arr.push(item.q);
        });
        obj[el.value] = arr;
      } else {
        arr = [];
        obj[el.value] = arr;
      }
      arr = [];
    });
    let newObj = {
      rules: JSON.stringify(obj),
    };
    let key = hasEmptyData(obj);
    if (key) {
      let lan = contentList.value.filter((item, ind) => item.value === key)[0].label;
      return message.error(t('common.rule_tips', { n: lan }));
    }
    await updateCommissionConfigV1(newObj);
    emit('closeLoad');
    closeModal();
  }

  /** 关闭 */
  async function handleCloseFunc() {
    return true;
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
