<template>
  <BasicForm @register="registerForm" class="Proxy">
    <template #password="{ model, field }">
      <Input v-model:value="passwordvalue" disabled :size="FORM_SIZE">
        <template #suffix>
          <CopyOutlined class="btnClass" @click="handleCopy(passwordvalue)" />
        </template>
      </Input>
    </template>
    <template #details="{ model }">
      <div class="details">
        <table v-if="model['case'] === 0">
          <tr v-for="(item, index) in testTable1" :key="index" :class="{ th: index === 0 }">
            <td>{{ item.index }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.rate }}</td>
          </tr>
        </table>
        <table v-if="model['case'] === 1">
          <tr v-for="(item, index) in testTable2" :key="index" :class="{ th: index === 0 }">
            <td>{{ item.index }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.rate }}</td>
          </tr>
        </table>
        <table v-if="model['case'] === 2">
          <tr v-for="(item, index) in testTable3" :key="index" :class="{ th: index === 0 }">
            <td>{{ item.index }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.rate }}</td>
          </tr>
        </table>
      </div>
    </template>
    <template #localSearch="{ model, field }">
      <Select
        show-search
        v-model:value="model[field]"
        :placeholder="t('table.member.member_verify_3')"
        :fieldNames="{ label: 'username', value: 'username' }"
        :options="datalist"
        :not-found-content="fetching ? undefined : null"
        @search="handleSearch"
        :searchValue="searchValue"
        @focus="handleFocus"
        @change="handleChange"
        :size="FORM_SIZE"
        allowClear
      >
        <template v-if="fetching" #notFoundContent>
          <Spin size="small" />
        </template>
      </Select>
    </template>
  </BasicForm>
</template>

<script setup lang="ts">
  import { ref, unref, inject } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Input, Select, Spin } from 'ant-design-vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  //import { proxySchemas} from './Proxy.data';
  import { getByMemberId, getMemberNameList } from '/@/api/member/index';
  import { generateCustomPassword } from '/@/utils/auth/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { existsMember } from '/@/api/member/index';
  import { useDebounceFn } from '@vueuse/core';

  const searchValue = ref('');
  const searchValue1 = ref('');

  const handleChange = (value: string) => {
    setTimeout(() => {
      searchValue.value = value;
      searchValue1.value = value;
    }, 555);
  };

  const handleFocus = (e) => {
    searchValue.value = searchValue1.value;
  };

  const { t } = useI18n();
  const proxySchemas: FormSchema[] = [
    {
      field: 'parent_name',
      component: 'Input',
      label: t('business.common_super_agent') + ':',
      slot: 'localSearch',
      rules: [
        {
          required: true,
          type: 'string',
          trigger: 'blur',
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('table.member.member_verify_3'));
            }
            return Promise.resolve();
          },
        },
      ],
      componentProps: {
        placeholder: t('table.member.member_proxy_tip'),
      },
    },
    {
      field: 'username',
      component: 'Input',
      rules: [
        {
          required: true,
          type: 'string',
          trigger: 'blur',
          validator: async (rule, value) => {
            const pattern = /^[a-zA-Z0-9]{6,18}$/;
            let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
            if (!value) {
              return Promise.reject(t('table.member.member_agent_tip2'));
            }
            if (!pattern.test(value)) {
              return Promise.reject(t('table.member.member_verify_2'));
            }
            const { data, status } = await existsMember({ username: value });
            if (pattern.test(value) && !status) {
              return Promise.reject(data);
            }
            return Promise.resolve();
          },
        },
      ],
      label: t('table.member.member_agent_account') + ':',
      componentProps: {
        placeholder: t('table.member.member_agent_tip1'),
        maxlength: '18',
      },
    },
    {
      field: 'realname',
      component: 'Input',
      label: t('business.common_actual_name') + ':',
      componentProps: {
        placeholder: t('table.member.member_name_tip3'),
        maxlength: 20,
      },
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            const reg = /\d/;
            const english = /[a-zA-Z]/;
            const chinese = /[\u4e00-\u9fa5]/;
            if (!value) {
              return Promise.reject(t('table.member.member_name_tip'));
            } else if (reg.test(value)) {
              return Promise.reject(t('table.member.member_name_tip1'));
            } else if (chinese.test(value) && value.length < 2) {
              return Promise.reject(t('table.member.member_name_tip_text'));
            } else if (english.test(value) && value.length <= 2) {
              return Promise.reject(t('table.member.member_name_tip_text'));
            }
            return Promise.resolve();
          },
          trigger: 'change',
        },
      ],
    },
    {
      field: 'source',
      component: 'Input',
      label: t('table.member.member_promotion') + ':',
      componentProps: {
        placeholder: t('table.member.member_promotion_tip'),
        maxlength: 100,
      },
    },
    {
      field: 'password',
      component: 'Input',
      label: t('business.common_password') + ':',
      slot: 'password',
      defaultValue: generateCustomPassword(),
    },
    {
      field: 'commission_state',
      component: 'Select',
      label: t('table.member.member_rebate_model') + ':', //返佣模式
      defaultValue: 2,
      componentProps: {
        options: [
          { value: 1, label: t('business.common_on') },
          { value: 2, label: t('business.common_off') },
        ],
        getPopupContainer: () => document.body,
      },
    },
  ];
  const labelWidth = useAutoLabelWidth(proxySchemas, {
    other: [{ label: t('table.member.member_agency_type') }],
  });
  const setLabelWidth = inject('setLabelWidth');
  setLabelWidth(labelWidth);
  const emit = defineEmits(['password']);
  const datalist = ref([] as any);
  const passwordvalue = ref<any>();
  passwordvalue.value = generateCustomPassword();
  const fetching = ref(false as boolean);
  const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
  const { createMessage } = useMessage();
  const { getFormSize } = useFormSetting();
  const FORM_SIZE = getFormSize;
  const [registerForm, { validate: values, resetFields: resetFields }] = useForm({
    schemas: proxySchemas,
    showActionButtonGroup: false,
    baseColProps: {
      span: 24,
    },
    size: FORM_SIZE,
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
      } catch (error) {
        console.error('Error fetching data:', error);
        datalist.value = []; // 出错时清空数据列表
      } finally {
        fetching.value = false;
      }
    }
  }, 500);

  function handleCopy(value) {
    if (!value) {
      createMessage.warning(t('table.promotion.promotion_please_copy_content'));
      return;
    }
    clearClipboard();
    clipboardRef.value = value;
    if (unref(copiedRef)) {
      createMessage.success(t('business.common_copy_suceess'));
    }
  }
  changePassword();
  function changePassword() {
    emit('password', passwordvalue.value);
  }
  const valueData = values;
  defineExpose({ value: valueData, resetFields });
</script>

<style lang="less" scoped>
  .details > table {
    width: 100%;
    td {
      border: 1px solid #eaeaea;
      line-height: 40px;
      text-align: center;
    }

    .th {
      background: #f2f2f2;
    }
  }
</style>
