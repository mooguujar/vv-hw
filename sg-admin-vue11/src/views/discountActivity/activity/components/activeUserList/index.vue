<template>
  <div>
    <BasicTable
      @register="registerTable"
      class="!p-0"
      :scroll="{ x: 'max-content', y: scrollHeight }"
    >
      <template #paixuSlot>
        <div class="bg-light-50"><drag-outlined /></div>
      </template>

      <template #customTableHeader>
        <div class="mb-10px ml-10px" v-if="listLength > 0">
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
        <div class="ml-10px">
          <DragTabs
            v-model:panes="panesSource"
            v-model:activeKey="activeKey"
            @on-drag-end="onDragEnd"
            @remove-tab="removeTab"
            @add-tab="addTab"
            @set-active="setActive"
            :disabled="isControlValueSet()"
          />
        </div>
      </template>

      <template #form-created>
        <div class="flex">
          <div :class="isHasAuth('40204') ? 'mr-2.5' : ''">
            <Button @click="openAddIpModalFunNew()" type="primary" v-if="isHasAuth('40204')">
              {{ $t('table.discountActivity.discountActivity_type_new_activity') }}
            </Button>
          </div>
        </div>
      </template>
      <template #form-currentType>
        <a-input-group compact style="display: flex" class="t-form-label-com">
          <Select v-model:value="currentType" class="br-none">
            <SelectOption :value="'id'">ID</SelectOption>
            <SelectOption :value="'name'">
              {{ $t('table.discountActivity.discount_name') }}
            </SelectOption>
            <SelectOption :value="'updated_name'">
              {{ $t('table.risk.report_operate_people') }}
            </SelectOption>
          </Select>
          <Input
            style="margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
          />
        </a-input-group>
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #group="{ record }">
        <!--文字' : '图片'-->
        <div v-if="record.group == 1">{{ getGroupLabel(record.group) }}</div>
        <div class="primary-color cursor" v-else @click="handleGroup(record)">{{
          getGroupLabel(record.group)
        }}</div>
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template v-if="isControlValueSet()" #action="{ record }">
        <span
          class="px-2 cursor primary-color"
          v-if="dayjs(record.start_at_tz).valueOf() < dayjs().valueOf() && record.ty != 5"
          @click="recordHandle(record)"
        >
          {{ t('business.common_jl') }}
        </span>
      </template>
      <template v-else #action="{ record }">
        <span
          v-if="
            record.state != 2 &&
            (JSON.parse(record.client_type).includes(24) ||
              JSON.parse(record.client_type).length == 4)
          "
          class="px-2 cursor primary-color"
          @click="previewActivity(record)"
        >
          {{ t('component.upload.preview') }}
        </span>
        <span
          class="px-2 cursor primary-color"
          v-if="isHasAuth('40204') && record.state != 2"
          @click="EditFun2(record)"
          >{{ t('business.common_edit') }}</span
        >
        <span
          class="px-2 cursor primary-color"
          v-if="dayjs(record.start_at_tz).valueOf() < dayjs().valueOf() && record.ty != 5"
          @click="recordHandle(record)"
        >
          {{ t('business.common_jl') }}
        </span>
        <span
          class="px-2 primary-color cursor"
          v-if="record.ty == 3"
          @click="handleRedenleoped(record)"
          >{{ t('business.common_hb') }}</span
        >
        <span
          v-if="activeKey !== '0'"
          class="px-2 cursor primary-color"
          @click="deleteshowConfirm(record)"
        >
          {{ t('business.common_delete_b') }}
        </span>
        <template v-if="record.ty == 5 && isHasAuth('40210') && activeKey === '0'">
          <span
            class="primary-color cursor"
            v-if="record.state == 2 || record.state == 3"
            @click="showConfirm(record)"
          >
            {{ t('business.common_delete') }}
          </span>
        </template>

        <template v-else-if="isHasAuth('40210')">
          <span
            class="mr-3 primary-color cursor"
            v-if="(record.state == 2 || record.state == 3) && activeKey === '0'"
            @click="showConfirm(record)"
          >
            {{ t('business.common_delete') }}
          </span>
        </template>
      </template>
      <template #dataTimeSlot="{ record }">
        <div>
          <div>
            {{ record['start_at_tz'] ? record['start_at_tz'] : '-' }}
          </div>
          <div>
            {{ record['end_at_tz'] ? record['end_at_tz'] : '-' }}
          </div>
        </div>
      </template>
      <template #showDataTime="{ record }">
        <div v-if="record.ty === 3">
          <div>
            {{ record['display_start_at_tz']?.split(' ')[0] }}
          </div>
          <div>
            {{ record['display_end_at_tz']?.split(' ')[0] }}
          </div>
        </div>
        <div v-else>
          <div>
            {{ record['display_start_at_tz']?.split(' ')[0] }}
          </div>
          <div>
            {{ record['display_end_at_tz']?.split(' ')[0] }}
          </div>
        </div>
      </template>
      <template #activeState="{ record }">
        <Switch
          v-if="
            (record.state == 1 || record.state == 2) && (isControlValueSet() || isHasAuth('40208'))
          "
          v-model:checked="record.state"
          :checkedValue="1"
          :unCheckedValue="2"
          :disabled="isControlValueSet() ? true : record.state == 2 || record.state == 3"
          @change="handleActiveState(record)"
        />
        <Switch
          v-if="record.state == 3 && isHasAuth('40208')"
          v-model:checked="record.state"
          :disabled="isControlValueSet() ? true : record.state == 2 || record.state == 3"
          :checkedValue="3"
          :unCheckedValue="2"
        />
      </template>
      <template #showState="{ record }">
        <Switch
          :disabled="!isHasAuth('40208')"
          v-model:checked="record.display"
          :checkedValue="1"
          :unCheckedValue="2"
          @change="handleDisplayState(record)"
        />
      </template>
      <template #recommendState>
        <Switch v-model:checked="recommendSwich" />
      </template>
    </BasicTable>
    <recordList @register="recordTable" />
    <detailModal @register="registerDetailModal" />
    <RedEnvelope @register="registerRedModal" />
    <addClassifyModal @register="addActivityClassifyModal" @add-success="handleModalSuccess" />
    <moveActivityModal @register="RegMoveActivityModal" @remove-success="handleModalSuccess" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect, onBeforeUnmount } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { Button } from '/@/components/Button';
  import { DragOutlined } from '@ant-design/icons-vue';
  import {
    Select,
    SelectOption,
    Input,
    DatePicker,
    message,
    Switch,
    RadioGroup,
    RadioButton,
  } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useModal } from '/@/components/Modal';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getPromoList,
    updatePromoClose,
    updatePromoDisplay,
    getPromoCategoryList,
    deletePromoCategory,
    sortPromoCategory,
    updateMerchantClose,
    removePromoCategory,
  } from '/@/api/activity';
  import { promoActivitySort } from '/@/api/sys';
  import recordList from '../recordList/index.vue';
  import { getGroupLabel, activeJumpUrl } from '../../common/setting';
  import detailModal from '../../common/components/detailModal.vue';
  import addClassifyModal from '../../common/components/addClassifyModal.vue';
  import moveActivityModal from '../../common/components/moveActivityModal.vue';
  import { ADDraggableRow } from '/@/utils';
  import { useLocalList, domainObj, LangURL } from '/@/settings/localeSetting';
  import RedEnvelope from '../redEnvelope/index.vue';
  import { isHasAuth } from '@/utils/authFunction';
  import { cloneDeep } from 'lodash-es';
  import { DragTabs } from '/@/components/Dragtabs';
  import { openConfirm } from '/@/utils/confirm';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { isControlValueSet } from '/@/utils/domUtils';
  import { useUserStore } from '/@/store/modules/user';
  import { useScrollerHeight } from '/@/hooks/web/useScrollHeight';
  import { tabHeight510 } from '/@/views/common/component';

  const currentLanguage = useLocaleStoreWithOut();
  const [addActivityClassifyModal, { openModal: openActivityClassify }] = useModal();
  const [RegMoveActivityModal] = useModal();
  const $router = useRouter();
  const userStore = useUserStore();
  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  interface Panes {
    title: string;
    key: string;
    sorting: number;
    closable: boolean;
  }
  const model = ref<FormModel>({
    start_time: null,
    end_time: null,
  });
  const { t } = useI18n();
  const scrollHeight = Number(useScrollerHeight(tabHeight510).value);
  const currentDomain = ref('');
  const localeList = useLocalList();
  const panesSource = ref<Panes[]>([]);
  const activeKey = ref('0');
  const listLength = ref(0);
  const setActive = (key: string) => {
    activeKey.value = key;
    setPagination({ current: 1 });
    reload();
  };
  const onDragEnd = async (tempIndex: number, targetIndex: number) => {
    // 跳过"全部"选项的拖拽
    if (tempIndex === 0 || targetIndex === 0) {
      message.warning(t('common.translate.word10'));
      return;
    }
    // 获取实际的面板项（不包括"全部"选项）
    const actualPanes = panesSource.value.slice(1);
    const tempPane = actualPanes[tempIndex - 1]; // 减1是因为要跳过"全部"选项
    const targetPane = actualPanes[targetIndex - 1];
    if (!tempPane || !targetPane) {
      message.error(t('common.translate.word11'));
      return;
    }
    const param = {
      id: targetPane.key,
      index_id: tempPane.key,
      sort_before: targetPane.sorting,
      sort_after: tempPane.sorting,
    };

    try {
      const { status, data } = await sortPromoCategory({
        lang: langBtn.value,
        ...param,
      });
      if (status) {
        message.success(data);
        await getCategoryList();
      } else {
        message.error(data);
      }
    } catch (e) {
      console.error('排序失败:', e);
      message.error(t('common.translate.word12'));
    }
  };
  const removeTab = (targetKey: string, element: any) => {
    openConfirm(
      t('table.google.report_columns_APP_confirm'),
      t('common.activity_delete_confirm', { name: element.title }),
      () => {
        handleDelete(targetKey);
      },
      'confirmModal',
    );
  };
  /** 删除操作 */
  async function handleDelete(id: any) {
    const { data, status } = await deletePromoCategory({ id: id });
    if (status) {
      message.success(t('table.google.report_columns_APP_delete_success'));
      handleModalSuccess();
    } else {
      message.error(data);
    }
  }
  const addTab = () => {
    openActivityClassify(true, { lang: langBtn.value });
  };
  const langList = ref(
    localeList.map((item) => {
      return {
        label: t('common.common_' + item.event),
        value: item.event,
      };
    }),
  );
  const langBtn = ref('' as string);
  const fromSearch = ref('' as string);
  const currentType = ref('name' as string);
  const recommendSwich = ref(false as any);
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  /** 获取活动分类列表数据 */
  async function getCategoryList() {
    try {
      const { data, status } = await getPromoCategoryList({ lang: langBtn.value });
      if (status) {
        if (data === null) {
          panesSource.value = [
            {
              title: t('business.common_all'),
              key: '0',
              sorting: -1,
              closable: false,
            },
          ];
        } else {
          const formattedData = data
            .map((item) => ({
              title: item.name,
              key: item.id,
              sorting: item.sorting,
              closable: isControlValueSet() ? false : true,
            }))
            .sort((a, b) => a.sorting - b.sorting); // 按 sorting 升序排列

          // 添加"全部"选项
          panesSource.value = [
            {
              title: t('business.common_all'),
              key: '0',
              sorting: -1,
              closable: false,
            },
            ...formattedData,
          ];
        }

        // 如果没有选中的标签，默认选中第一个
        if (!activeKey.value || !panesSource.value.find((p) => p.key === activeKey.value)) {
          activeKey.value = panesSource.value[0].key;
        }
      } else {
        message.error(data);
        panesSource.value = [
          {
            title: t('business.common_all'),
            key: '0',
            sorting: -1,
            closable: false,
          },
        ];
      }
    } catch (error) {
      message.error(t('common.translate.word13'));
    }
  }
  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time?.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
  };

  const disabledEndDate = (date) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };

  let dataSource = ref<any>([]);
  const _dataSource = ref<any>([]);

  const [registerTable, { reload, clearSelectedRowKeys, setTableData, setPagination }] = useTable({
    customRow: isHasAuth('40206')
      ? (record, index) => ADDraggableRow(dataSource.value, index, setTableData, sortTable)
      : undefined,
    api: getPromoList,
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
      params['flag'] = 1;
      params['lang'] = langBtn.value;
      if (activeKey.value !== '0') params['category_id'] = activeKey.value;

      if (currentType.value) {
        params[currentType.value] = fromSearch.value;
      }
      return params;
    },
    afterFetch: (data) => {
      listLength.value = data.length;
      if (listLength.value > 0) {
        updateLangList(data);
      }
      clearSelectedRowKeys();
      dataSource.value = data;
      _dataSource.value = cloneDeep(data);
    },
  });
  const [recordTable, { openModal }] = useModal();
  const [registerRedModal, { openModal: openRed }] = useModal();
  function handleRedenleoped(record: any) {
    openRed(true, { data: record });
  }
  async function sortTable(targetWork: any, tempSource: any) {
    const param = {
      id: tempSource.id,
      index_id: targetWork.id,
      sort_before: tempSource.seq_id,
      sort_after: targetWork.seq_id,
    };

    // 发送排序请求
    try {
      const { status, data: responseData } = await promoActivitySort({
        lang: langBtn.value,
        ...param,
      });

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

  function updateLangList(list) {
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
    if (langList.value.length > 0 && langList.value[0]?.value) {
      if (
        userStore.getSingleLanguage &&
        langList.value.some((item) => item.value === userStore.getDefaultLanguage)
      ) {
        langBtn.value = userStore.getDefaultLanguage as string;
      } else {
        langBtn.value = langBtn.value = langList.value[0]?.value;
      }
    }
    getCategoryList();
    reload();
  }
  function openAddIpModalFunNew() {
    $router.push({ name: 'NewActive' });
  }
  function recordHandle(data) {
    openModal(true, data);
  }

  function previewActivity(data) {
    const currentNet = window.location.hostname;
    const currentLang = LangURL[langBtn.value];
    const currentJumpUrl = activeJumpUrl[data.ty];
    Object.keys(domainObj).forEach((item) => {
      if (currentNet.includes(item)) currentDomain.value = domainObj[item];
    });
    if (data?.display_mode && data?.display_mode == 2) {
      window.open(currentDomain.value + '/' + currentLang + '/promotion', '_blank');
    } else {
      const baseUrl = `${currentDomain.value}/${currentLang}/promotions/promotion/${currentJumpUrl}`;
      let queryParam = '';

      if (data.ty === 8) {
        queryParam = `?pid=${data.id}&cond=${data.cond}&preview=1`;
      } else if (data.ty === 3) {
        queryParam = `?promoid=${data.id}&preview=1`;
      } else {
        queryParam = `?pid=${data.id}&preview=1`;
      }

      window.open(baseUrl + queryParam, '_blank');
    }
  }

  async function handleActiveState(v) {
    const { status, data } = await updatePromoClose({ pid: v.id });
    if (status) {
      message.success(data);
    }
    handleModalSuccess();
  }
  /** 删除操作 */
  function showConfirm(params: { id: any; zh_name: string }) {
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('common.activity_delete_confirm', { name: params.zh_name }),
      async () => {
        try {
          const { status, data } = await updateMerchantClose({ pid: params.id });
          if (status) {
            message.success(data);
          }
          handleModalSuccess();
        } catch (e) {
          console.error(e);
        }
      },
      'confirmModal',
    );
  }

  function deleteshowConfirm(recode) {
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('common.activity_remove_confirm', { name: recode.zh_name }),
      async () => {
        try {
          const params = {
            promo_id: recode.id,
            category_id: activeKey.value,
          };
          const { status, data } = await removePromoCategory(params);
          if (status) {
            message.success(data);
          }
          handleModalSuccess();
        } catch (e) {
          console.error(e);
        }
      },
      'confirmModal',
    );
  }

  async function handleDisplayState(v) {
    const { status, data } = await updatePromoDisplay({ pid: v.id, display: v.display });
    if (status) {
      message.success(data);
    }
    handleModalSuccess();
  }
  function handleGroup(data) {
    openDetailModal(true, data);
  }

  function EditFun2(record) {
    $router.push({ name: 'NewActive', state: { id: record.id } });
  }

  async function handleModalSuccess() {
    await getCategoryList(); // 先获取分类列表
    reload(); // 然后重新加载数据
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

  ::v-deep(.ant-tabs-nav-list) {
    padding: 0 !important;
    border: 0;
    border-radius: 0;
    background-color: transparent;
  }

  ::v-deep(.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active) {
    background: #1475e1;
  }

  ::v-deep(.ant-tabs-tab-btn) {
    padding-right: 12px;
    padding-left: 12px;
    border-radius: 4px 4px 0 0;
  }

  ::v-deep(.ant-tabs-tab-remove) {
    margin-right: 4px;
    margin-left: 0;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin: 0 !important;
  }

  .color-E46 {
    color: #5451ff;
  }

  .color-B42 {
    color: #42b3f2;
  }

  ::v-deep(.columnSelectBar) {
    cursor: pointer;

    td:first-child {
      cursor: pointer;
    }
  }
</style>
