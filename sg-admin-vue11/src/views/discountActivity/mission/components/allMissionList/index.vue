<template>
  <div>
    <BasicTable @register="registerTable" class="!p-0" :scroll="{ y: scrollHeight }">
      <template #customTableHeader>
        <div class="mb-10px ml-10px" v-if="typeof systemCurrency !== 'string'">
          <RadioGroup
            button-style="solid"
            :size="'large'"
            v-model:value="langBtn"
            @change="handleModalSuccess"
            v-if="langList.length > 1"
          >
            <RadioButton :value="el.value" v-for="el in langList" :key="el.value"
              >{{ el.label }}
            </RadioButton>
          </RadioGroup>
        </div>
        <div class="ml-10px" v-if="transformedCateList.length > 1">
          <DragTabs
            v-model:panes="transformedCateList"
            v-model:activeKey="activeKey"
            @set-active="setActive"
            :noaddBut="true"
          />
        </div>
      </template>
      <template #form-created>
        <div :class="isHasAuth('40903') ? 'mr-2.5' : ''">
          <Button @click="openAddIpModalFun()" type="primary" v-if="isHasAuth('40903')">
            {{ t('table.discountActivity.discountActivity_mission') }}
          </Button>
        </div>
      </template>
      <template #form-currentType>
        <FormItemRest>
          <InputGroup style="display: flex" class="t-form-label-com" compact>
            <Select style="width: 40%" v-model:value="currentType" class="br-none">
              <!-- <SelectOption :value="'id'">ID</SelectOption> -->
              <SelectOption :value="'name'">
                {{ t('table.discountActivity.task_name') }}
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
        <template v-if="record.state == 1 || record.state == 2">
          <span
            v-if="isHasAuth('40903')"
            class="mr-2 cursor-pointer text-[#1475e1]"
            @click="EditFun(record)"
            >{{ t('common.editorText') }}</span
          >
        </template>
        <template v-if="record.state !== 2">
          <span
            v-if="isControlValueSet() ? false : isHasAuth('40906')"
            class="mr-2 cursor-pointer text-red"
            @click="showConfirm(record)"
            >{{ t('common.delText') }}</span
          >
        </template>
        <span class="cursor-pointer text-[#1475e1]" @click="recordHandle(record)">{{
          t('business.common_jl')
        }}</span>
      </template>
      <template #categoryNames="{ record }">
        <div
          v-if="record.names"
          class="text-[#1475e1] cursor-pointer"
          @click="goToMissionDetail(record)"
          >{{ JSON.parse(record.names)[langBtn] ? JSON.parse(record.names)[langBtn] : '-' }}</div
        >
        <div v-else>-</div>
      </template>
      <template #cateName="{ record }">
        <div v-if="record.names">{{
          JSON.parse(record.cate_name)[langBtn]
            ? JSON.parse(record.cate_name)[langBtn]
            : firstValidValue(JSON.parse(record.cate_name)) || '-'
        }}</div>
        <div v-else>-</div>
      </template>
      <template #taskType="{ record }">
        {{ record.ty ? taskTypeOptions.find((item) => item.value === record.ty)?.label : '-' }}
      </template>
      <template #lang="{ record }">
        {{
          record.lang
            ? JSON.parse(record.lang).length > 1
              ? t('table.system.system_languages')
              : t('common.common_zh_CN')
            : '-'
        }}
      </template>
      <template #activeState="{ record }">
        <!-- 任务列表state 1待开启，2进行中，3关闭，4删除 -->
        <Switch
          :checked="record.state"
          :checkedValue="2"
          :unCheckedValue="1"
          :disabled="isControlValueSet() ? true : record.state == 3 || record.state == 4"
          @click="showConfirmUpdateState(record.id, record.state)"
        />
      </template>
    </BasicTable>
    <recordList @register="recordTable" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { Button } from '/@/components/Button';
  import {
    InputGroup,
    Select,
    SelectOption,
    Input,
    FormItemRest,
    message,
    Switch,
    RadioGroup,
    RadioButton,
  } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { DragTabs } from '/@/components/Dragtabs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getMissionList,
    missionDelete,
    closeMissionState,
    sortMission_list,
  } from '/@/api/mission';
  import recordList from '/@/views/discountActivity/mission/components/recordList/index.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import { isHasAuth } from '@/utils/authFunction';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { openConfirm } from '/@/utils/confirm';
  import { useTaskTypeOptions } from '../../insertmission/index.data';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight510, tabHeight480 } from '/@/views/common/component';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { getMissionCategoryNameListAction } from '../index.data';
  import { ADDraggableRow } from '/@/utils';
  import { useSystemStore } from '@/store/modules/system';

  const { t } = useI18n();
  // // 转换cateList中的label
  let transformedCateList = ref([] as any);
  const currentLanguage = useLocaleStoreWithOut();
  let cateList: any = [];
  getMissionCategoryNameListAction().then((res) => {
    transformedCateList.value =
      res.map((item) => ({
        ...item,
        key: item.value,
        title: JSON.parse(item.label as string)[currentLanguage.getLocale] || '-',
      })) || [];
    // 过滤出包含指定 key 的对象
    cateList = [...transformedCateList.value];
  });

  const activeKey = ref(transformedCateList.value[0]?.value || '0');
  const setActive = (key: string) => {
    activeKey.value = key;
    cate_id.value = key;
    reload();
  };
  const $router = useRouter();
  const systemCurrency = ref('');
  const systemStore = useSystemStore();
  const scrollHeight = ref(Number(useScrollerHeight(tabHeight480).value));
  const route = useRouter().currentRoute.value;
  const localeList = useLocalList();
  const { taskTypeOptions } = useTaskTypeOptions();
  /** 语言列表 */
  const langList = ref(
    localeList.map((item) => {
      return {
        label: t('common.common_' + item.event),
        value: item.event,
      };
    }),
  );
  const langBtn = ref('zh_CN' as string);
  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);
  /** 任务分类列表 */
  const cate_id = ref('0');

  let dataSource = ref<any>([]);
  const _dataSource = ref<any>([]);
  const [recordTable, { openModal }] = useModal();
  const firstValidValue = (obj_) => {
    let obj = obj_ || {};
    // try {
    //   obj = JSON.parse(JSON.parse(obj_));
    // } catch (e) {
    //   console.error('Error parsing JSON:', e);
    //   return '';
    // }
    if (Object.keys(obj).length === 0) {
      return '';
    }
    return Object.values(obj).find((val) => val !== '' && val !== null && val !== undefined);
  };
  const [registerTable, { reload, clearSelectedRowKeys, setTableData }] = useTable({
    api: getMissionList,
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
    customRow: true
      ? (record, index) => ADDraggableRow(dataSource.value, index, setTableData, sortTable)
      : undefined,
    beforeFetch: async (params) => {
      /** 任务列表state 任务列表不传\进行中的任务:2\已关闭的任务:3 */
      // params['state'] = 2;
      /** 获取语言配置 */
      const res = await systemStore.getValidLangList();
      systemCurrency.value = res;
      if (typeof systemCurrency.value !== 'string') {
        scrollHeight.value = Number(useScrollerHeight(tabHeight510).value);
      }
      params['lang'] = typeof systemCurrency.value !== 'string' ? langBtn.value : null;
      if (history.state.name_) {
        params['lang'] = null;
      }
      if (cate_id.value !== '0') {
        params['cate_id'] = cate_id.value;
      } else {
        delete params['cate_id'];
      }
      if (currentType.value) {
        params[currentType.value] = fromSearch.value;
      }
      return params;
    },
    afterFetch: (data_) => {
      const { c, d, l } = data_ || {};
      const data = d || [];
      // data = data.map((item: any, index) => {
      //   item.index = index + 1;
      //   return item;
      // });
      updateLangList(data);
      clearSelectedRowKeys();
      dataSource.value = data;
      _dataSource.value = cloneDeep(data);

      nextTick(() => {
        langList.value = langList.value.filter((obj) => l && l.some((key) => obj.value == key));
        // transformedCateList.value = cateList.filter(
        //   (obj) => c && c.some((key) => obj.value == key.id),
        // );
        transformedCateList.value = c.map((item: any) => ({
          ...item,
          value: item.id,
          key: item.id,
          title:
            JSON.parse(item.category_name as string)[currentLanguage.getLocale] ||
            firstValidValue(JSON.parse(item.category_name as string)) ||
            '-',
        }));
        transformedCateList.value.unshift({
          value: '0',
          key: '0',
          title: t('business.common_all'),
        });
      });
      return data;
    },
  });
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
      const { status, data: responseData } = await sortMission_list(param);
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
  nextTick(() => {
    if (history.state.name_) {
      // const name_: any = JSON.parse(history.state.name_ as string)[currentLanguage.getLocale];
      // currentType.value = 'name';
      // fromSearch.value = name_;
      cate_id.value = history.state.cate_id ? (history.state.cate_id as string) : '';
      setActive(cate_id.value);
      reload();
    }
  });

  /** 选择任务分类 */
  function selectCate(val: any) {
    cate_id.value = val;
  }
  /** 跳转到任务详情 */
  function goToMissionDetail(record: any) {
    $router.push({
      name: 'Insertmission',
      state: { id: record.id, data: JSON.stringify(record), type: 3 },
    });
    // $router.push({ name: 'Insertmission', query: { id } });
  }
  /** 更新语言列表 */
  function updateLangList(list: any[]) {
    if (langBtn.value) return;
    const currentLangList = list.map((item) => JSON.parse(item.lang));
    const mergeLangList = currentLangList.flat();
    const filterMergeLangList = [...new Set(mergeLangList)];
    langList.value = localeList
      .filter((lang) => filterMergeLangList.includes(lang.event))
      .map((item) => {
        return {
          label: t('common.common_' + item.event),
          value: item.event,
        };
      });
    langBtn.value = langList.value[0].value as string;
    reload();
  }
  /** 新增任务操作 */
  function openAddIpModalFun() {
    $router?.push({
      name: 'Insertmission',
      state: {
        list: dataSource.value?.filter((e) => e.state == 2).map((i) => i.ty),
        validate_type: dataSource.value?.filter((e) => e.state == 2).map((i) => i.validate_type),
      },
    });
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
    const { data, status } = await missionDelete({ pid: id });
    if (status) {
      message.success(t('table.google.report_columns_APP_delete_success'));
      reload();
    } else {
      message.error(data);
    }
  }
  /** 确认更新状态 */
  function showConfirmUpdateState(id: any, state: number) {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      t('common.gg1'),
      () => {
        if (state === 2) {
          state = 3;
          updateState(id);
        } else {
          state = 2;
          updateState(id);
        }
      },
      'confirmModal',
    );
  }
  /** 更新分类状态 */
  async function updateState(id: any) {
    const { status, data } = await closeMissionState({ pid: id });
    if (status) {
      message.success(data);
      reload();
    } else {
      message.error(data);
    }
  }
  /** 编辑操作 */
  function EditFun(record: { id: any }) {
    $router.push({
      name: 'Insertmission',
      state: {
        id: record.id,
        data: JSON.stringify(record),
        list: dataSource.value.filter((e) => e.state == 2).map((i) => i.ty),
        validate_type: dataSource.value.filter((e) => e.state == 2).map((i) => i.validate_type),
      },
    });
  }
  /** 打开领取记录 */
  function recordHandle(data: any) {
    openModal(true, data);
  }
  /** 切换语言操作 */
  function handleModalSuccess() {
    reload();
  }
  onBeforeUnmount(() => {
    langBtn.value = '';
  });
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
