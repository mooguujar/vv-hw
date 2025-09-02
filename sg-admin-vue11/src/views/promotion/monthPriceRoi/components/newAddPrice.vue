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
      <BasicForm @register="registerFromNewAdd">
        <template #startTime="{ model, field }">
          <Row style="height: 40px">
            <Col :span="11">
              <FormItem>
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :placeholder="$t('business.common_period_start')"
                  allowClear
                  @change="
                    (val) => {
                      changTime(model[field], '1');
                    }
                  "
                  v-model:value="model[field][0]"
                />
              </FormItem>
            </Col>
            <Col :span="2">
              <div class="w-full h-full">
                <div class="line"></div>
              </div>
            </Col>
            <Col :span="11">
              <FormItem>
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :placeholder="$t('business.common_period_end')"
                  allowClear
                  v-model:value="model[field][1]"
                  @change="
                    (val) => {
                      changTime(model[field], '2');
                    }
                  "
                />
              </FormItem>
            </Col>
          </Row>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { FormItem, Row, Col, message, DatePicker } from 'ant-design-vue';
  import { defineEmits, ref } from 'vue';
  import {
    getAdGroupSelect,
    getAdBidsChannelDetail,
    postAdMonthlyInsert,
    postAdMonthlyUpdate,
  } from '/@/api/promotion';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const emits = defineEmits(['activeSuccess', 'register']);

  const FORM_SIZE = useFormSetting().getFormSize as any;

  const title = ref(t('routes.commission.add_ad'));
  const submitText = ref(t('table.promotion.promotion_confirm_add'));
  const editId = ref('' as any);
  // 渠道id
  const channel_id = ref('');
  const isSubmit = ref(false);

  // 新增:1 续费:2, 编辑:3
  const modalType = ref(1);

  const schemas: FormSchema[] = [
    {
      field: 'gid',
      label: t('table.advertise.table_grouping_name'),
      component: 'ApiSelect',
      componentProps: ({ formActionType }) => {
        return {
          api: async () => {
            const { setFieldsValue } = formActionType;
            const { data: selectList } = await getAdGroupSelect();
            const _selectList = selectList.filter((_item: any, index: number) => index != 0);
            if (_selectList && _selectList.length > 0) {
              setFieldsValue({ gid: _selectList[0].id.toString() });
            }
            return _selectList;
          },
          labelField: 'name',
          valueField: 'id',
          size: 'large',
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
      label: t('table.race_price.form_agent_account'),
      defaultValue: '',
      componentProps: {
        size: 'large',
        placeholder: t('table.promotion.promotion_p_tips'),
        allowClear: false,
      },
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value) {
              return Promise.reject(t('table.promotion.promotion_p'));
            }
            const { data, status } = await getAdBidsChannelDetail({ agent_account: value });
            if (status && data.agent_account === value) {
              const { id } = data;
              channel_id.value = id;
              return Promise.resolve(); // 校验通过
            } else {
              return Promise.reject(t('table.promotion.promotion_tips'));
            }
          },
          trigger: 'blur',
        },
      ],
      dynamicDisabled: () => {
        if (modalType.value === 2) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      field: 'name',
      component: 'Input',
      label: t('table.race_price.form_ad_name'),
      defaultValue: '',
      rules: [
        {
          required: true,
          message: t('common.enter_ad_name'),
          trigger: 'blur',
        },
      ],
      componentProps: {
        size: 'large',
        allowClear: false,
      },
      dynamicDisabled: () => {
        if (modalType.value === 2) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      field: 'backup_domain',
      component: 'InputTextArea',
      label: t('table.race_price.form_ad_romain'),
      defaultValue: '',
      componentProps: {
        size: 'large',
        allowClear: false,
        placeholder: t('table.race_price.p_ad_name'),
        autoSize: {
          minRows: 4,
          maxRows: 4,
        },
      },
      dynamicDisabled: () => {
        if (modalType.value === 2) {
          return true;
        } else {
          return false;
        }
      },
    },
    {
      field: 'time',
      label: t('table.race_price.form_ad_time_'), //开始时间
      component: 'DatePicker',
      defaultValue: [],
      slot: 'startTime',
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            if (!value[0]) {
              return Promise.reject(t('table.discountActivity.discount_select_start_time'));
            }
            if (!value[1]) {
              return Promise.reject(t('table.discountActivity.discount_select_end_time'));
            }
            if (value[0] > value[1]) {
              return Promise.reject(t('table.discountActivity.promotion_p_enter_time_err'));
            }
            return Promise.resolve(); // 校验通过
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'price',
      component: 'Input',
      label: t('table.race_price.form_ad_price'),
      defaultValue: '',
      componentProps: {
        size: 'large',
        allowClear: false,
      },
      rules: [
        {
          required: true,
          validator: async (_, value) => {
            // 正则：只允许数字和最多两位小数
            const pricePattern = /^\d+(\.\d{0,2})?$/;
            if (!value) {
              return Promise.reject(t('table.promotion.promotion_p_enter_ad_price'));
            }
            // 如果输入不是空，且不匹配正则
            if (value && !pricePattern.test(value)) {
              return Promise.reject(t('table.promotion.promotion_p_enter_ad_price_tips'));
            }
            // 检查是否是负数
            else if (parseFloat(value) < 0) {
              return Promise.reject(t('table.promotion.promotion_p_enter_ad_price_err'));
            }
            // 如果验证通过
            else {
              return Promise.resolve(); // 校验通过
            }
          },
          trigger: 'blur',
        },
      ],
    },
    {
      field: 'remark',
      component: 'InputTextArea',
      label: t('table.race_price.form_ad_position'),
      defaultValue: '',
      componentProps: {
        size: 'large',
        allowClear: false,
        placeholder: t('table.race_price.p_ad_p'),
        maxLength: 50,
        autoSize: {
          minRows: 4,
          maxRows: 4,
        },
      },
    },
  ];
  function visibleChange(visible: boolean) {
    if (!visible) {
      resetFields();
    }
  }
  function changTime(v) {
    setFieldsValue({ time: v });
  }
  const [registerNewAddModal, { closeModal }] = useModalInner(async (data) => {
    if (data.type == 1) {
      // 新增
      title.value = t('routes.commission.add_ad');
      submitText.value = t('table.promotion.promotion_confirm_add');
      modalType.value = 1;
      editId.value = '';
    } else if (data.type == 2) {
      // 续费
      title.value = t('table.promotion.promotion_renew_ad');
      submitText.value = t('table.promotion.promotion_confirm_renewal');
      modalType.value = 2;
      editId.value = '';
      data.price = '';
      const _backup_domain = data.backup_domain.replace(/,/g, '\n');
      data.backup_domain = _backup_domain;
      data.time = [];
      setFieldsValue(data);
    } else {
      // 编辑
      title.value = t('table.promotion.promotion_edit_ad');
      submitText.value = t('business.banner_confrim');
      modalType.value = 3;
      editId.value = data.id;
      const _backup_domain = data.backup_domain.replace(/,/g, '\n');
      data.backup_domain = _backup_domain;
      data.price = data.price_show;
      data.time = [
        dayjs(data.start_show * 1000).format('YYYY-MM-DD'),
        dayjs(data.end_show * 1000).format('YYYY-MM-DD'),
      ];
      setFieldsValue(data);
    }
  });

  const [registerFromNewAdd, { validate, setFieldsValue, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 'auto',
    baseColProps: { span: 24 },
  });
  async function okSubmit() {
    isSubmit.value = true;
    try {
      const values = await validate();
      values.channel_id = channel_id.value;
      values.start_time = values.time[0];
      values.end_time = values.time[1];
      delete values.time;
      const _backup_domain = values.backup_domain;
      if (_backup_domain) {
        values.backup_domain = _backup_domain.replace(/\n/g, ',');
      }
      if (modalType.value == 3) {
        values['id'] = editId.value;
      }
      const { data, status } =
        modalType.value == 3
          ? await postAdMonthlyUpdate(values)
          : await postAdMonthlyInsert(values);
      if (status) {
        message.success(data);
        emits('activeSuccess');
        resetFields();
        closeModal();
      } else {
        message.error(data);
      }
    } catch (error) {
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
