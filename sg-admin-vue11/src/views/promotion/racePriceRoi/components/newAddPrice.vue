<template>
  <div class="newAddPrice venuesClassZoom" ref="main">
    <BasicModal
      @register="registerNewAddModal"
      :title="t('table.race_price.form_newAdd')"
      v-bind="$attrs"
      @ok="okSubmit"
      @cancel="cancel"
      :width="560"
      :okText="t('table.promotion.promotion_confirm_add')"
      cancelText=""
      :getContainer="() => $refs.main"
    >
      <BasicForm @register="registerFromNewAdd">
        <template #userSearch="{ model, field }">
          <Select
            show-search
            v-model:value="model[field]"
            :size="FORM_SIZE"
            :placeholder="t('table.promotion.promotion_p')"
            :fieldNames="{ label: 'username', value: 'username' }"
            :options="datalist"
            @search="handleSearch"
            :searchValue="searchValue"
            @focus="handleFocus"
            @change="
              (value: any) => {
                handleChange1(value);
              }
            "
            :not-found-content="fetching ? '' : ''"
            allowClear
          />
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message, Select } from 'ant-design-vue';
  import { defineEmits, ref } from 'vue';
  import { postAdBidsInsert } from '/@/api/promotion';
  import { getMemberNameList } from '/@/api/member';
  import { useDebounceFn } from '@vueuse/core';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  const FORM_SIZE = useFormSetting().getFormSize as any;

  const { t } = useI18n();

  interface Item {
    label: string;
    value: number;
  }
  const emit = defineEmits(['activeSuccess', 'register']);
  const options = ref<Item[]>();
  const isSubmit = ref(false);
  const channel_id = ref('');
  const datalist = ref([] as any);
  const searchValue = ref('');
  const searchValue1 = ref('');
  const fetching = ref(false);
  const schemas: FormSchema[] = [
    {
      field: 'gid',
      component: 'Select',
      label: t('table.advertise.table_grouping_name') + ':',
      defaultValue: '',
      componentProps: () => {
        return {
          options: options.value,
          size: 'large',
          allowClear: false,
          getPopupContainer: () => document.body,
        };
      },
      rules: [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('common.select_group_name'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'username',
      component: 'Input',
      label: t('table.race_price.form_agent_account') + ':',
      colProps: { span: 24 },
      slot: 'userSearch',
      rules: [
        {
          required: true,
          type: 'string',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('table.promotion.promotion_p'));
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'prepay',
      component: 'Input',
      label: t('table.race_price.table_prepayment_u') + ':',
      defaultValue: '',
      componentProps: {
        size: 'large',
      },
      rules: [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('table.promotion.promotion_p_enter_prepayment_u'));
            }
            const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.promotion.promotion_prepayment_u_tips'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'fee',
      component: 'Input',
      label: t('table.race_price.table_service_fee') + ':',
      defaultValue: '',
      componentProps: {
        size: 'large',
      },
      rules: [
        {
          required: true,
          validator: (_, value) => {
            if (!value) {
              return Promise.reject(t('table.promotion.promotion_p_enter_service_fee'));
            }
            const regex = /^(0|[1-9]\d*)(\.\d+)?$/;
            if (!regex.test(value)) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'remark',
      component: 'InputTextArea',
      label: t('business.common_remark') + ':',
      defaultValue: '',
      componentProps: {
        size: 'large',
        allowClear: false,
        autoSize: { minRows: 3, maxRows: 5 },
        maxlength: 200,
        showCount: true,
      },
    },
  ];
  useAutoLabelWidth(schemas);
  const [registerNewAddModal, { closeModal }] = useModalInner(async (selectList) => {
    options.value = selectList
      .filter((item, index) => index != 0)
      .map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    if (options.value) {
      setFieldsValue({ gid: options.value[0].value.toString() });
    }
  });

  const [registerFromNewAdd, { validate, setFieldsValue, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });
  const handleSearch = useDebounceFn(async (value) => {
    searchValue.value = value;
    // 确保输入长度至少为3个字符
    if (!value || value.length < 2) {
      datalist.value = []; // 清空现有数据列表（可选）
      return false;
    }
    fetching.value = true;
    if (value.length >= 2) {
      try {
        const data = await getMemberNameList({ username: value });
        datalist.value = data;
        channel_id.value = data[0].uid;
      } catch (error) {
        datalist.value = []; // 出错时清空数据列表
        channel_id.value = '';
      } finally {
        fetching.value = false;
      }
    }
  }, 500);
  const handleFocus = () => {
    searchValue.value = searchValue1.value;
  };
  const handleChange1 = (value: any) => {
    setTimeout(() => {
      searchValue.value = value;
      searchValue1.value = value;
    }, 555);
  };
  async function okSubmit() {
    isSubmit.value = true;
    let values;
    try {
      values = await validate();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      isSubmit.value = false; // 在这里确保 isSubmit 一定会被设置为 false
    }

    if (values) {
      values.channel_id = channel_id.value;
      const { status, data } = await postAdBidsInsert(values);
      if (status) {
        resetFields();
        message.success(t('layout.setting.operatingTitle'));
        emit('activeSuccess');
        searchValue.value = '';
        searchValue1.value = '';
        closeModal();
      } else {
        message.error(t(data));
      }
    }
  }
  const cancel = () => {
    closeModal();
    resetFields();
    searchValue.value = '';
    searchValue1.value = '';
  };
</script>
<style lang="scss" scoped>
  .newAddPrice {
    ::v-deep(.ant-form) {
      border-bottom: 1px solid #dce3f1;
    }

    ::v-deep(.ant-form-item-label > label) {
      display: flex;
    }

    ::v-deep(.ant-form-item-no-colon) {
      justify-content: end;
      height: auto !important;
      margin-right: 5px;
      line-height: 40px !important;
    }

    ::v-deep(.ant-modal .ant-modal-body > .scrollbar) {
      padding: 30px 35px 0;
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
  }
</style>
