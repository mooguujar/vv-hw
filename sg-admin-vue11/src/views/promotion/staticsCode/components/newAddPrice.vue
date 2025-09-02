<template>
  <div ref="main" class="venuesClassZoom">
    <BasicModal
      @register="registerNewAddModal"
      :title="title"
      @ok="okSubmit"
      v-bind="$attrs"
      :width="560"
      :okText="submitText"
      cancelText=""
      :getContainer="() => $refs.main"
      @visible-change="visibleChange"
    >
      <BasicForm @register="registerFromNewAdd" />
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';
  import { defineEmits, ref } from 'vue';
  import {
    postStaticsCodeInsert,
    getStaticsCodeDetail,
    postStaticsCodeUpdate,
  } from '/@/api/promotion';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const { t } = useI18n();

  const emits = defineEmits(['activeSuccess', 'register']);

  const title = ref(t('common.add_statistics'));
  const submitText = ref(t('table.promotion.promotion_confirm_add'));
  const editId = ref('' as any);

  /** 新增:1 编辑:3 */
  const modalType = ref(1);

  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: t('common.statistic_name'),
      defaultValue: '',
      componentProps: {
        size: 'large',
        placeholder: t('common.input_statistic_name'),
        allowClear: false,
      },
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject(t('common.input_statistic_name'));
            }
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'code',
      component: 'InputTextArea',
      label: t('routes.promotion.statics_code') + ':',
      defaultValue: '',
      componentProps: {
        size: 'large',
        allowClear: false,
        placeholder: t('common.input_statistic_code'),
        autoSize: {
          minRows: 4,
          maxRows: 4,
        },
      },
      rules: [{ required: true, message: t('common.statistic_code_not_empty'), trigger: 'blur' }],
    },
    {
      field: 'domain',
      component: 'InputTextArea',
      label: t('common.domain_list'),
      defaultValue: '',
      componentProps: {
        size: 'large',
        allowClear: false,
        placeholder: t('common.domain_list_200_row'),
        autoSize: {
          minRows: 4,
          maxRows: 4,
        },
      },
      rules: [{ required: true, message: t('common.domain_list_not_empty'), trigger: 'blur' }],
    },
  ];
  useAutoLabelWidth(schemas);
  function visibleChange(visible: boolean) {
    if (!visible) {
      changeOkLoading(false);
      resetFields();
    }
  }
  const [registerNewAddModal, { closeModal, changeOkLoading }] = useModalInner(async (dadas) => {
    if (dadas.type == 1) {
      // 新增
      title.value = t('common.add_statistics');
      submitText.value = t('table.promotion.promotion_confirm_add');
      modalType.value = 1;
      editId.value = '';
    } else {
      // 编辑
      title.value = t('common.modify_statistics');
      submitText.value = t('business.banner_confrim');
      modalType.value = 3;
      editId.value = dadas.id;
      const { data } = await getStaticsCodeDetail({ id: dadas.id });
      const names = data.map((item: { name: any }) => item.name).join('\n');
      dadas.domain = names;
      setFieldsValue(dadas);
    }
  });

  const [registerFromNewAdd, { validate, setFieldsValue, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 'auto',
    baseColProps: { span: 24 },
  });
  /** 提交操作 */
  async function okSubmit() {
    changeOkLoading(true);
    try {
      const values = await validate();
      const trimmedStr = values.code.trim();
      const isWrappedByScriptTag =
        trimmedStr.startsWith('<script') && trimmedStr.endsWith('script>');
      if (!isWrappedByScriptTag) {
        message.error(t('common.statistic_code_not_wrapped'));
        changeOkLoading(false);
        return;
      }
      const _domain = values.domain.replace(/\n/g, ',');
      const real_domain = _domain
        .split(',')
        .filter((item) => item.trim() !== '')
        .join(',');
      /**
      使用 split 方法按 ',' 分隔
      */
      const domainArray = real_domain.split(',');
      // 判断里面是否含有30个以上的域名
      const isInvalid = domainArray.every((str: string | any[]) => str.length <= 30);
      if (!isInvalid) {
        message.error(t('common.domain_length_not_over_30'));
        changeOkLoading(false);
        return;
      }
      // 统计每个元素的出现次数
      const countMap = {};
      domainArray.forEach((item: string | number) => {
        countMap[item] = (countMap[item] || 0) + 1;
      });
      // 筛选出重复的元素
      const duplicates = Object.keys(countMap).filter((item) => countMap[item] > 1);
      if (duplicates.length > 0) {
        message.error(t('common.domain_list_no_repeat'));
        changeOkLoading(false);
        return;
      }
      const total = real_domain.split(',').length;
      if (total > 0) {
        if (total > 200) {
          message.error(t('common.domain_list_not_over_200'));
          changeOkLoading(false);
          return;
        } else {
          values.domain = real_domain;
          values.total = total;
        }
      } else {
        values.domain = '';
        values.total = 0;
      }
      if (modalType.value == 3) {
        values['id'] = editId.value;
      }
      const { data, status } =
        modalType.value == 3
          ? await postStaticsCodeUpdate(values)
          : await postStaticsCodeInsert(values);
      if (status) {
        changeOkLoading(false);
        message.success(data);
        emits('activeSuccess');
        resetFields();
        closeModal();
      } else {
        changeOkLoading(false);
        message.error(data);
      }
    } catch (error) {
      changeOkLoading(false);
      console.error(error);
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep(.ant-form) {
    border-bottom: 1px solid #dce3f1;
  }

  .line {
    width: 80%;
    height: 1.5px;
    margin-top: 20px;
    margin-left: 10%;
    background-color: #4444;
    font-size: 14px;
    font-weight: 500;
  }
</style>
