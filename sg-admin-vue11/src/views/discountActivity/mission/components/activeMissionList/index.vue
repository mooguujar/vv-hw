<template>
  <div>
    <BasicTable @register="registerTable" class="!p-0" :scroll="{ y: scrollHeight }">
      <template #customTableHeader>
        <div class="mb-10px ml-10px">
          <RadioGroup
            button-style="solid"
            :size="'large'"
            v-model:value="langBtn"
            @change="handleModalSuccess"
          >
            <RadioButton :value="el.value" v-for="el in langList" :key="el.value"
              >{{ el.label }}
            </RadioButton>
          </RadioGroup>
        </div>
      </template>
      <template #form-cateSlot>
        <Select
          v-model:value="cate_id"
          style="width: 100%"
          :dropdownMatchSelectWidth="false"
          :placeholder="t('table.discountActivity.select_task_classification')"
          @change="selectCate"
        >
          <SelectOption value="0">{{ t('business.common_all') }}</SelectOption>
          <SelectOption
            v-for="item in cateList"
            :key="item.label[currentLanguage.getLocale]"
            :value="item.value"
          >
            {{ JSON.parse(item.label)[currentLanguage.getLocale] }}</SelectOption
          >
        </Select>
      </template>
      <template #form-currentType>
        <FormItemRest>
          <InputGroup style="display: flex" class="t-form-label-com" compact>
            <Select style="width: 40%" v-model:value="currentType" class="br-none">
              <SelectOption :value="'id'">ID</SelectOption>
              <SelectOption :value="'names'">
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
        <template v-if="record.state === 1 || record.state === 2">
          <span
            v-if="isControlValueSet() ? false : isHasAuth('40903')"
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
          @click="() => goToMissionDetail(record)"
          >{{
            JSON.parse(record.names)[currentLanguage.getLocale]
              ? JSON.parse(record.names)[currentLanguage.getLocale]
              : '-'
          }}</div
        >
        <div v-else>-</div>
      </template>
      <template #cateName="{ record }">
        <div v-if="record.names">{{
          JSON.parse(record.cate_name)[currentLanguage.getLocale]
            ? JSON.parse(record.cate_name)[currentLanguage.getLocale]
            : '-'
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
          v-model:checked="record.state"
          :checkedValue="2"
          :unCheckedValue="1"
          :disabled="isControlValueSet() ? true : record.state == 3 || record.state == 4"
          @change="showConfirmUpdateState(record.id, record.state)"
        />
      </template>
    </BasicTable>
    <recordList @register="recordTable" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
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
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getMissionList, missionDelete, closeMissionState } from '/@/api/mission';
  import recordList from '/@/views/discountActivity/mission/components/recordList/index.vue';
  import { useLocalList } from '/@/settings/localeSetting';
  import { isHasAuth } from '@/utils/authFunction';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import { openConfirm } from '/@/utils/confirm';
  import { useTaskTypeOptions } from '../../insertmission/index.data';
  import { getMissionCategoryNameListAction } from '../index.data';
  import { useLocaleStoreWithOut } from '@/store/modules/locale';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';

  const $router = useRouter();
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(400).value);
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
  const currentType = ref('id' as string);
  /** 任务分类列表 */
  const cate_id = ref('0');
  const cateList = ref<any>([]);
  const currentLanguage = useLocaleStoreWithOut();

  let dataSource = ref<any>([]);
  const _dataSource = ref<any>([]);
  const [recordTable, { openModal }] = useModal();

  const [registerTable, { reload, clearSelectedRowKeys }] = useTable({
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
    beforeFetch: (params) => {
      /** 任务列表state 任务列表不传\进行中的任务:2\已关闭的任务:3 */
      params['state'] = 2;
      params['lang'] = langBtn.value;
      if (cate_id.value !== '0') {
        params['cate_id'] = cate_id.value;
      }
      if (currentType.value) {
        params[currentType.value] = fromSearch.value;
      }
      return params;
    },
    afterFetch: (data) => {
      updateLangList(data);
      clearSelectedRowKeys();
      dataSource.value = data;
      _dataSource.value = cloneDeep(data);
    },
  });
  /** 选择任务分类 */
  function selectCate(val: any) {
    cate_id.value = val;
  }
  /** 跳转到任务详情 */
  function goToMissionDetail(record: any) {
    $router.push({
      name: 'Insertmission',
      state: {
        type: 3,
        id: record.id,
        data: JSON.stringify(record),
        list: dataSource.value.filter((e) => e.state == 2).map((i) => i.ty),
        validate_type: dataSource.value.filter((e) => e.state == 2).map((i) => i.validate_type),
      },
    });
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
    if (state === 2) {
      updateState(id, 2);
    } else {
      updateState(id, 3);
    }
  }
  /** 更新分类状态 */
  async function updateState(id: any, state: number) {
    const { status, data } = await closeMissionState({ pid: id, state });
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
  onMounted(async () => {
    cateList.value = await getMissionCategoryNameListAction();
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
