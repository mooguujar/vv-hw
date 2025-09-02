<template>
  <PageWrapper :contentStyle="{ marginTop: '10px' }" class="LayoutTable">
    <BasicTable @register="registerTable" class="!p-0" :scroll="{ y: scrollHeight }">
      <template #categoryNames="{ record }">
        <div v-if="record.category_name"
          >{{
            JSON.parse(record.category_name)[currentLanguage.getLocale]
              ? JSON.parse(record.category_name)[currentLanguage.getLocale]
              : firstValidValue(JSON.parse(record.category_name)) || '-'
          }}
        </div>
        <div v-else>-</div>
      </template>
      <template #paixuSlot>
        <div class="bg-light-50">
          <drag-outlined />
        </div>
      </template>
      <template #form-created>
        <div :class="isHasAuth('41003') ? 'mr-2.5' : ''">
          <Button
            @click="() => handleOpenNewAdd({ type: 1 })"
            type="primary"
            v-if="isHasAuth('41003')"
          >
            {{ t('table.discountActivity.mission_classify') }}
          </Button>
        </div>
      </template>
      <template #form-currentType>
        <FormItemRest>
          <InputGroup style="display: flex" class="t-form-label-com" compact>
            <Select style="width: 40%" v-model:value="currentType" class="br-none">
              <SelectOption :value="'category_name'">
                {{ t('common.category_name') }}
              </SelectOption>
              <SelectOption :value="'updated_name'">
                {{ t('table.risk.report_operate_people') }}
              </SelectOption>
            </Select>
            <Input
              style="width: 59%; margin-right: 10px"
              allowClear
              :placeholder="t('common.inputText')"
              v-model:value="fromSearch"
            />
          </InputGroup>
        </FormItemRest>
      </template>
      <template #action="{ record }">
        <span
          v-if="isHasAuth('41003')"
          class="mr-4 cursor-pointer text-[#1475e1]"
          @click="handleOpenNewAdd({ type: 3, ...record })"
          >{{ t('common.editorText') }}</span
        >
        <span
          v-if="isHasAuth('41006') && (record.related_count == 0 || record.state == 2)"
          class="cursor-pointer text-red"
          @click="showConfirm(record)"
          >{{ t('common.delText') }}</span
        >
        <span v-else>-</span>
      </template>
      <template #activeState="{ record }">
        <Switch
          v-model:checked="record.state"
          :checkedValue="1"
          :unCheckedValue="2"
          :disabled="isControlValueSet() ? true : record.related_count == 0"
          @change="showConfirmUpdateState(record.id, record.state)"
        />
      </template>
      <template #relatedCount="{ record }">
        <span
          :class="['mr-4 cursor-pointer', record.related_count > 0 && 'text-[#1475e1]']"
          @click="handleOpenAssociatedTask({ ...record })"
          >{{ record.related_count }}</span
        >
      </template>
    </BasicTable>
    <associatedTask @register="registerAssociatedTask" />
    <buttonTextModal @emits-values="getCategoryLangList" @register="textModal" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import buttonTextModal from '@/views/discountActivity/activity/components/insertActiveNew/buttonTextModal.vue';
  import { ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { columns, schemas } from './index.data';
  import { Button } from '/@/components/Button';
  import { useModal } from '/@/components/Modal';
  import { DragOutlined } from '@ant-design/icons-vue';
  import {
    InputGroup,
    Select,
    SelectOption,
    Input,
    FormItemRest,
    message,
    Switch,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getMissionCategoryList,
    closeMissionCategory,
    deleteMissionCategory,
    sortCategoryList,
    insertMissionCategory,
    updateMissionCategory,
  } from '/@/api/mission';
  import { ADDraggableRow } from '/@/utils';
  import { isHasAuth } from '@/utils/authFunction';
  import { openConfirm } from '/@/utils/confirm';
  import associatedTask from '../modelList/associatedTask.vue';
  import { cloneDeep } from 'lodash-es';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { useLocalList } from '/@/settings/localeSetting';
  import { useRouter } from 'vue-router';
  import { useSystemStore } from '/@/store/modules/system';
  import { tabHeight340 } from '@/views/common/component';

  const currentLanguage = useLocaleStoreWithOut();
  const [registerAssociatedTask, { openModal: OpenNewAssociatedTask }] = useModal();
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight340).value);
  const fromSearch = ref('' as string);
  const currentType = ref('category_name' as string);
  const currentId = ref('' as string);

  /** 新增任务分类操作 */
  function handleOpenNewAdd(data: any) {
    modalType.value = data.type;
    currentId.value = data.id;
    if (data.type === 1) {
      category_name.value = {};
      category_name_zh.value = '';
    } else {
      category_name.value = JSON.parse(data.category_name);
      category_name_zh.value = category_name.value['zh_CN'] || '';
    }
    handleMoreLagarage();
  }

  const $router = useRouter();

  function handleOpenAssociatedTask(record: any) {
    if (+record.related_count === 0) return;
    $router.push({
      name: 'mission_list',
      state: {
        name_: record.category_name,
        cate_id: record.id,
      },
    });
  }

  let dataSource = ref<any>([]);
  const _dataSource = ref<any>([]);

  const [registerTable, { reload, setTableData }] = useTable({
    customRow: isHasAuth('41009')
      ? (record, index) => ADDraggableRow(dataSource.value, index, setTableData, sortTable)
      : undefined,
    api: getMissionCategoryList,
    columns: columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    beforeFetch: (params) => {
      if (currentType.value) {
        params[currentType.value] = fromSearch.value;
      }
      return params;
    },
    afterFetch: (data) => {
      dataSource.value = data;
      _dataSource.value = cloneDeep(data);
    },
  });
  const firstValidValue = (obj_) => {
    let obj = obj_ || {};
    if (Object.keys(obj).length === 0) {
      return '';
    }
    return Object.values(obj).find((val) => val !== '' && val !== null && val !== undefined);
  };

  /** 拖拽排序 */
  async function sortTable(targetWork: any, tempSource: any) {
    const param = {
      id: tempSource.id,
      index_id: targetWork.id,
      sort_before: Number(tempSource.sort),
      sort_after: Number(targetWork.sort),
    };
    // 发送排序请求
    try {
      const { status, data: responseData } = await sortCategoryList(param);
      if (status) {
        message.success(responseData);
      } else {
        message.error(responseData);
      }
      // 重新加载数据
      reload();
    } catch (e) {
      console.error(e);
    }
  }

  /** 确认删除 */
  function showConfirm(record: { id: any }) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      t('table.google.report_columns_APP_delete_msg'),
      () => {
        handleDelete(record.id);
      },
      'confirmModal',
    );
  }

  /** 删除操作 */
  async function handleDelete(id: any) {
    const { data, status } = await deleteMissionCategory({ pid: id });
    if (status) {
      message.success(t('table.google.report_columns_APP_delete_success'));
      reload();
    } else {
      message.error(data);
    }
  }

  /** 确认更新状态 */
  function showConfirmUpdateState(id, state: number) {
    updateState(id, state);
  }

  /** 更新分类状态 */
  async function updateState(id: any, state: number) {
    const { status, data } = await closeMissionCategory({ pid: id, state });
    if (status) {
      message.success(data);
      reload();
    } else {
      message.error(data);
    }
  }

  // 操作类型：1:新增 3:编辑
  const modalType = ref(1);
  const [textModal, { openModal, closeModal }] = useModal();
  /** 分类任务名称 */
  const category_name = ref<string | object>('');
  /** 分类任务中文名称 */
  const category_name_zh = ref('');
  /** 语言列表 */
  let localeList = useLocalList();
  const transListArray = localeList.map((item) => ({
    label: item.label,
    language: item.language,
    value: item.event,
    transitionValue: '',
  }));
  const type = 'zh_name';
  const contentList = transListArray;

  /** 更多语言 */
  async function handleMoreLagarage() {
    contentList[0].transitionValue = category_name_zh.value;
    openModal(true, { data: category_name.value, type, localeList: localeList });
  }

  /** 通知更新字段值 */
  function getCategoryLangList(value) {
    category_name_zh.value = value['zh_CN'];
    category_name.value = value;
    handleSubmit();
  }

  updateValidList();

  async function updateValidList() {
    const systemStore = useSystemStore();

    const res = await systemStore.getValidLangList();
    localeList = localeList.filter((lang) => res && res.includes(lang.event));
  }

  async function handleSubmit() {
    const params = {};

    contentList[0].transitionValue = category_name_zh.value;
    params['category_name'] = JSON.stringify(category_name.value);
    params['id'] = currentId.value;
    const { data, status } =
      modalType.value === 1
        ? await insertMissionCategory(params)
        : await updateMissionCategory(params);
    if (status) {
      closeModal();
      reload();
    } else {
      message.error(data);
    }
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-radio-button-wrapper) {
    min-width: 88px;
    text-align: center;
  }

  .color-E46 {
    color: #5451ff;
  }

  .color-B42 {
    color: #42b3f2;
  }
</style>
