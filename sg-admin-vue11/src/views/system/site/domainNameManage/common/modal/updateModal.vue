<template>
  <div>
    <BasicModal
      :title="$t('table.system.system_edit_domain_name')"
      @register="registerUpdata"
      :cancelText="$t('common.cancelText')"
      :okText="$t('table.system.system_qd_save')"
      :width="600"
      :minHeight="230"
      @ok="handelOK"
    >
      <BasicForm @register="registerUpdataForm">
        <template #name="{ model, field }">
          <span v-if="model[field] != 'cloudflare' && model[field] != 'gcore'">
            {{ $t('table.discountActivity.discount_custom') }}
          </span>
          <span v-else>{{ model[field] }}</span></template
        >
        <template #choice="{ model, field }">
          <div v-if="cdnType.type == 2">{{ cdnType.name }}</div>
          <template v-else>
            <RadioGroup v-model:value="model[field]">
              <Radio :value="0">
                {{ $t('table.system.system_tj') }}
              </Radio>
            </RadioGroup>
          </template>
        </template>

        <template #helpMsg>
          <div class="text-orange ml-22.5">
            {{ $t('table.system.system_tip') }}
          </div>
        </template>
      </BasicForm>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { RadioGroup, Radio, message } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { updateMainDomain } from '/@/api/domain';
  import { useI18n } from '@/hooks/web/useI18n';

  const emit = defineEmits(['activeSuccess']);

  const FORM_SIZE = useFormSetting().getFormSize;
  const cdnType = ref({});
  const defalutName = ref('');
  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      field: 'cdn_name',
      component: 'Input',
      label: t('table.system.system_current_node'),
      slot: 'name',
    },
    {
      field: 'choice',
      component: 'RadioGroup',
      label:
        cdnType.value.type == 2
          ? `${t('table.system.system_cdnname')}：`
          : t('table.system.system_certificate'),
      defaultValue: 0,
      slot: 'choice',
    },
    {
      field: 'name',
      label: t('table.system.system_domain_main') + '：',
      rules: [
        {
          required: true,
          validator: async (rule, value) => {
            if (!value) {
              return Promise.reject(t('table.system.system_p_enter_primary_cdnname'));
            }

            const valueList = value.trim().split('\n');

            for (const item of valueList) {
              if (item.split('.').length < 2) {
                return Promise.reject(t('table.system.system_incorrect_format'));
              }
            }
            const allowedCharsRegex = /^(?=.*\.)[^\s]+$/;
            if (!allowedCharsRegex.test(value.split('\n').join(''))) {
              return Promise.reject(t('table.system.system_incorrect_format'));
            }
            return Promise.resolve();
          },
        },
      ],
      component: 'Input',
    },
    {
      field: '',
      component: 'Input',
      slot: 'helpMsg',
    },
  ];

  const getDaminId = ref('' as any);
  const [registerUpdata, { closeModal }] = useModalInner((data) => {
    const cdnList = { type: data.data.cdn_type, name: data.data.cdn_name };
    if (cdnList.type == 2) {
      updateSchema({
        field: 'choice',
        label: `${t('table.system.system_cdnname')}：`,
        slot: 'choice',
      });
    } else {
      updateSchema({
        field: 'choice',
        label: t('table.system.system_certificate'),
        defaultValue: 0,
        slot: 'choice',
      });
    }
    cdnType.value = cdnList;
    getDaminId.value = data.data.id;
    setFieldsValue(data.data);
    if (data.data.name) defalutName.value = data.data.name;
    //setFieldsValue(data);
  });
  const [registerUpdataForm, { setFieldsValue, validate, updateSchema }] = useForm({
    schemas,
    showActionButtonGroup: false,
    labelWidth: 100,
    baseColProps: { span: 22 },
    size: FORM_SIZE,
  });
  async function handelOK() {
    const values = await validate();
    if (defalutName.value == values.name) {
      closeModal();
      return false;
    }
    const { status, data } = await updateMainDomain({
      id: getDaminId.value,
      remark: 'sg.ipx.tw.6666',
      cdn_name: values.cdn_name,
      name: values.name,
    });
    if (status) {
      emit('activeSuccess');
      message.success(data);
      closeModal();
    }
  }
</script>
<style scoped></style>
