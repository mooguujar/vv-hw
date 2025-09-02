<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="title"
    @visible-change="handleVisibleChange"
    :showOkBtn="false"
    :showCancelBtn="false"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="model" />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getLevelValues } from '/@/utils/common';
  import { getGroupLabel } from '../setting';

  const schemas: FormSchema[] = [
    {
      field: 'group',
      component: 'Input',
      show: false,
    },
    {
      field: 'group_detail',
      component: 'Input',
      colProps: { span: 22 },
      defaultValue: 1,
      render: ({ model, field }) => {
        const { group, group_detail } = model;
        let value = '';
        if (group == 5) {
          value = JSON.parse(group_detail).join(', ');
        }
        if (group == 3) {
          let ids = JSON.parse(group_detail);
          ids = ids.map((level) => level.toString());
          value = getLevelValues(ids[0], true);
        }
        if (group == 4) {
          value = JSON.parse(group_detail)
            .map((level) => `VIP${level}`)
            .join(', ');
        }
        return h('div', { class: 'w-full h-16 rounded border border-gray-400 p-2' }, value);
      },
    },
  ];
  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    setup(props) {
      const { t } = useI18n();
      const modelRef = ref({});
      const title = ref(t('table.discountActivity.discount_save_participant'));
      const [
        registerForm,
        {
          // setFieldsValue,
          // setProps
        },
      ] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      const [register] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        title.value = `${t('table.discountActivity.discount_save_participant')} (${getGroupLabel(
          data.group,
        )})`;
        modelRef.value = { group_detail: data.group_detail, group: data.group };
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      return { register, schemas, registerForm, model: modelRef, handleVisibleChange, title };
    },
  });
</script>
