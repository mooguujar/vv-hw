<template>
  <div ref="main" class="venuesClassZoom">
    <BasicModal
      @register="registerNewAddModal"
      :title="titleName"
      v-bind="$attrs"
      :width="900"
      :okText="t('common.sure')"
      :cancelText="t('common.cancelText')"
      :destroyOnClose="true"
      :getContainer="() => $refs.main"
      @ok="showConfirmDialog"
      @cancel="handleCloseModal"
    >
      <BasicForm @register="registerNewAdd">
        <template #addCategoryName>
          <Row>
            <Col :span="18">
              <FormItem>
                <Input
                  :size="FORM_SIZE as any"
                  :placeholder="t('v.discount.activity.input_task_categories_name')"
                  v-model:value="category_name_zh"
                  :rules="rules.inputField"
                  style="height: 40px"
                />
              </FormItem>
            </Col>
            <Col :span="6">
              <Button
                type="primary"
                :size="FORM_SIZE as any"
                class="m-l-5"
                @click="handleMoreLagarage"
                >{{ t('v.discount.activity.more_language') }}</Button
              >
            </Col>
          </Row>
        </template>
      </BasicForm>
      <buttonTextModal @emits-values="getCategoryLangList" @register="textModal" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  import { useRouter } from 'vue-router';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import translateContentList from '/@/views/common/language';
  import { useI18n } from '/@/hooks/web/useI18n';
  import UploadImg from '/@/components-cd/upload/UploadImg.vue';
  import {
    relatedMissionCategoryList,
    relatedMissionCategory,
    uploadMissionImage,
    insertMissionCategory,
    updateMissionCategory,
  } from '/@/api/mission';
  import {
    TableProps,
    message,
    Switch,
    FormItem,
    Input,
    Button,
    Row,
    Col,
    Modal,
  } from 'ant-design-vue';
  import { omit } from 'lodash-es';
  import { useLocalList } from '/@/settings/localeSetting';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { columns } from './addClassify.data';
  import { BasicTable, useTable } from '/@/components/Table';
  import { useTaskTypeOptions } from '../insertmission/index.data';
  import buttonTextModal from '@/views/discountActivity/activity/components/insertActiveNew/buttonTextModal.vue';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const currentLanguage = useLocaleStoreWithOut();
  const $router = useRouter();
  const { t } = useI18n();
  const FORM_SIZE = useFormSetting().getFormSize as any;
  const { taskTypeOptions } = useTaskTypeOptions();
  /** 语言列表 */
  const localeList = useLocalList();
  const transListArray = localeList.map((item) => ({
    label: item.label,
    language: item.language,
    value: item.event,
    transitionValue: '',
  }));
  const contentList = transListArray;
  const type = 'zh_name';
  const [textModal, { openModal }] = useModal();

  const emits = defineEmits(['activeSuccess']);

  const titleName = ref(t('v.discount.activity.new_task_categories'));
  const langBtn = ref(currentLanguage.getLocale);
  // app图标
  const iconDescribe = ref(t('common.upload_format'));
  const iconLimitNum = ref('54 x 54');
  const iconLimitSizeObj = {
    width: 54,
    height: 54,
  };
  /** 分类任务名称 */
  const category_name = ref<string | object>('');
  /** 分类任务中文名称 */
  const category_name_zh = ref('');
  const shownFieldsState = ref<any>([]);
  /** 搜索ID值 */
  const searchValue = ref('');
  /** 选择行ID */
  const selRowKeys = ref<(string | number)[]>([]);
  /** 选择行cate_id */
  const selRowCateIds = ref<(string | number)[]>([]);
  const isDestroy = ref(false);
  /** 编辑的Id */
  const editId = ref('');
  // 操作类型：1:新增 3:编辑
  const modalType = ref(1);
  /** 校验规则 */
  const rules = {
    inputField: [
      {
        required: true,
        message: t('v.discount.activity.input_task_categories_name'),
        trigger: 'blur',
      },
    ],
  };
  function validateChinese(str: string) {
    // 匹配所有汉字的正则表达式
    const regex = /[\u4e00-\u9fa5]/g;
    // 使用 match 方法提取所有汉字，可能为 null
    const chineseMatches = str.match(regex);
    // 判断提取到的汉字数量是否不超过 2
    return !chineseMatches || chineseMatches.length <= 2;
  }
  const schemas: FormSchema[] = [
    {
      field: 'category_name',
      component: 'Input',
      label: t('common.category_name') + ':',
      colProps: {
        span: 24,
      },
      slot: 'addCategoryName',
    },
    // {
    //   field: 'images0',
    //   component: 'Input',
    //   label: t('v.discount.activity.categories_icon') + ':',
    //   defaultValue: [],
    //   slot: 'appIconSlot0',
    //   colProps: {
    //     span: 12,
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       validator: async (rule, value) => {
    //         if (value.length < 1) {
    //           return Promise.reject(t('v.discount.activity.input_categories_icon'));
    //         }
    //         return Promise.resolve();
    //       },
    //       trigger: 'blur',
    //     },
    //   ],
    // },
    // {
    //   field: 'images1',
    //   component: 'Input',
    //   defaultValue: [],
    //   slot: 'appIconSlot1',
    //   colProps: {
    //     span: 12,
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       validator: async (rule, value) => {
    //         if (value.length < 1) {
    //           return Promise.reject(t('v.discount.activity.input_categories_icon'));
    //         }
    //         return Promise.resolve();
    //       },
    //       trigger: 'blur',
    //     },
    //   ],
    // },
    // {
    //   field: 'id',
    //   label: t('table.discountActivity.task_related_tasks'),
    //   component: 'InputSearch',
    //   colProps: { span: 24 },
    //   componentProps: {
    //     size: FORM_SIZE as any,
    //     placeholder: t('v.discount.activity.input_categories_id'),
    //     style: { width: '94%' },
    //     onSearch: (value: string) => {
    //       searchValue.value = value;
    //       reload();
    //     },
    //   },
    // },
  ];
  useAutoLabelWidth(schemas);
  const [registerNewAddModal, { closeModal }] = useModalInner(async (data) => {
    modalType.value = data.type;
    // 编辑
    if (data && data.type === 3) {
      resetForm();
      titleName.value = t('v.discount.activity.edit_categories');
      isDestroy.value = true;
      editId.value = data.id;
      const formData = omit(data, [
        'id',
        'type',
        'created_at',
        'key',
        'created_name',
        'created_uid',
        'updated_at',
        'updated_name',
        'updated_uid',
      ]);
      const _images0 = JSON.parse(formData.images)[0];
      const _images1 =
        JSON.parse(formData.images).length === 1
          ? JSON.parse(formData.images)[0]
          : JSON.parse(formData.images)[1];
      category_name_zh.value = JSON.parse(formData.category_name)[langBtn.value];
      formData.images0 = [
        {
          backUrl: _images0,
          url: getDataTypePreviewUrl(_images0),
        },
      ];
      formData.images1 = [
        {
          backUrl: _images1,
          url: getDataTypePreviewUrl(_images1),
        },
      ];
      await setFieldsValue({ ...formData });
    } else {
      // 新增
      category_name_zh.value = '';
      titleName.value = t('v.discount.activity.add_categories');
    }
  });
  /** 初始化表单数据 */
  const [registerNewAdd, { resetFields, setFieldsValue, getFieldsValue, clearValidate }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  /** 选择行操作 */
  const rowSelection: TableProps['rowSelection'] = {
    onChange: (selectedRowKeys, selectedRows) => {
      selRowKeys.value = [];
      selRowCateIds.value = [];
      selectedRowKeys.forEach((item) => selRowKeys.value.push(item));
      selectedRows.forEach((item) => selRowCateIds.value.push(item.cate_id));
    },
    getCheckboxProps: (record) => ({
      disabled: record.state !== 2, // 禁用条件：state 为 true
    }),
  };
  const [registerTable, { reload }] = useTable({
    api: relatedMissionCategoryList,
    columns,
    bordered: true,
    useSearchForm: true,
    showIndexColumn: false,
    rowKey: 'id',
    rowSelection: rowSelection,
    formConfig: {
      showResetButton: false,
      showAdvancedButton: false,
      showActionButtonGroup: false,
      size: FORM_SIZE as any,
    },
    beforeFetch: (params) => {
      params['cate_type'] = 1;
      if (searchValue.value) {
        params['job_id'] = searchValue.value;
      }
      return params;
    },
  });
  /** 更多语言 */
  async function handleMoreLagarage() {
    // if (category_name_zh.value === '') {
    //   message.error(t('v.discount.activity.input_task_categories_name'));
    //   return;
    // }
    contentList[0].transitionValue = category_name_zh.value;
    await translateContentList(contentList, contentList[0].transitionValue, 0, 'transitionValue');
    category_name.value = transListArray.reduce((acc, cur) => {
      let value = cur.transitionValue;
      // 对特定语言进行首字母大写处理
      if (['en_US', 'pt_BR', 'vi_VN'].includes(cur.value as string)) {
        value = value.charAt(0).toUpperCase() + value.slice(1);
      }
      acc[cur.value] = value;
      return acc;
    }, {});
    openModal(true, { data: category_name.value, type });
  }
  /** 通知更新字段值 */
  function getCategoryLangList(value) {
    category_name_zh.value = value['zh_CN'];
    category_name.value = value;
  }
  /** 跳转到任务详情 */
  function goToMissionDetail(record: any) {
    $router.push({
      name: 'Insertmission',
      state: { id: record.id, data: JSON.stringify(record), type: 3 },
    });
  }
  /** 选择批量关联操作 */
  async function handleBatchRelation() {
    if (selRowKeys.value.length > 0) {
      const { data, status } = await relatedMissionCategory({
        cate_id: modalType.value === 3 ? editId.value : selRowCateIds.value[0],
        ids: JSON.stringify(selRowKeys.value),
      });
      if (status) {
        message.success(t('v.discount.activity.relation_success'));
        reload();
      } else {
        message.error(data);
      }
    } else {
      message.error(t('v.discount.activity.select_related_task'));
    }
  }
  function handleIconRemoveClick(model, field) {
    model[field] = [];
  }

  function handleCloseModal() {
    if (isDestroy.value) {
      resetForm();
      isDestroy.value = false;
    }
  }
  function resetForm() {
    resetFields();
    shownFieldsState.value = [];
    editId.value = '';
  }
  /** 确认操作弹出框 */
  const showConfirmDialog = () => {
    Modal.confirm({
      title: t('modalForm.finance.finance_operation_confirmation'),
      icon: false,
      closable: true,
      wrapClassName: 'system-confirm',
      content: t('v.discount.activity.comfit_opera_task'),
      width: '400px',
      centered: true,
      maskClosable: false,
      class: '',
      onCancel() {},
      onOk: async () => {
        try {
          await handleSubmit();
        } catch (error) {
          message.error(t('table.risk.random_text_err'), error);
        }
      },
    });
  };
  async function handleSubmit() {
    const params = getFieldsValue();
    if (modalType.value === 3) {
      params['id'] = editId.value;
    }
    if (modalType.value === 1) {
      params['state'] = 1;
    }
    const imagesArr: string[] = [];
    imagesArr.push(params['images0'][0].backUrl);
    imagesArr.push(params['images1'][0].backUrl);
    params['images'] = JSON.stringify(imagesArr);
    params['related'] = JSON.stringify(selRowKeys.value);
    if (category_name_zh.value === '') {
      message.error(t('v.discount.activity.input_task_categories_name'));
      return;
    } else if (!validateChinese(category_name_zh.value)) {
      message.error(t('v.discount.activity.categories_name_max_two_word'));
      return;
    } else {
      contentList[0].transitionValue = category_name_zh.value;
      await translateContentList(contentList, contentList[0].transitionValue, 0, 'transitionValue');
      category_name.value = transListArray.reduce((acc, cur) => {
        let value = cur.transitionValue;
        // 对特定语言进行首字母大写处理
        if (['en_US', 'pt_BR', 'vi_VN'].includes(cur.value as string)) {
          value = value.charAt(0).toUpperCase() + value.slice(1);
        }
        acc[cur.value] = value;
        return acc;
      }, {});
    }
    params['category_name'] = JSON.stringify(category_name.value);
    if (imagesArr.length < 2) {
      message.error(t('v.discount.activity.input_categories_icon'));
      return;
    }
    if (modalType.value === 1 && selRowKeys.value.length < 1) {
      message.error(t('v.discount.activity.select_relate_task'));
      return;
    }
    const { data, status } =
      modalType.value === 1
        ? await insertMissionCategory(params)
        : await updateMissionCategory(params);
    if (status) {
      emits('activeSuccess');
      closeModal();
    } else {
      message.error(data);
    }
  }
</script>
<style lang="scss" scoped>
  .batch-operation {
    display: flex;
    justify-content: flex-start;
  }

  ::v-deep(.ant-modal-footer) {
    padding: 20px 27px;
  }

  .flex-container {
    display: flex; /* 使用Flexbox布局 */
    flex-direction: row;
    align-items: center; /* 子元素在交叉轴方向上居中对齐 */
    justify-content: start; /* 子元素在主轴方向上均匀分布 */
    padding: 10px; /* 内边距 */
  }

  .flex-item {
    margin: 0 10px; /* 子元素之间的间距 */
    padding: 20px; /* 子元素内边距 */
    text-align: center; /* 文本居中 */
  }

  .googleNewAddClass {
    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      width: 100px;
      height: auto !important;
      margin-right: 5px;
      line-height: 40px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      max-height: 734px;
      padding: 30px 35px 0;
    }

    ::v-deep(.ant-form-item-label) {
      width: 108px !important;
    }

    ::v-deep(.ant-modal-footer) {
      padding: 20px 16px;
    }

    ::v-deep(.ant-checkbox-group-item) {
      width: 72px;
      margin-right: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }

    ::v-deep(.ant-checkbox-group) {
      width: 290px;
    }

    .ant-upload-select-picture-card i {
      color: #999;
      font-size: 32px;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }

    .appIconClass {
      width: 120px;
      height: 120px;
      overflow: hidden;

      ::v-deep(.ant-upload.ant-upload-select-picture-card) {
        width: 120px !important;
        height: 120px !important;
      }

      ::v-deep(.ant-upload-list-picture-card-container) {
        width: 120px !important;
        height: 120px !important;
      }
    }

    .appNoticeClass {
      ::v-deep(.ant-upload.ant-upload-select-picture-card) {
        width: 126px !important;
        height: 224px !important;
      }

      ::v-deep(.ant-upload-list-picture-card-container) {
        width: 126px !important;
        height: 224px !important;
      }

      ::v-deep(.uploadMain .ant-upload-list-item-thumbnail img) {
        width: 126px !important;
        object-fit: cover;
      }
    }
  }
</style>
