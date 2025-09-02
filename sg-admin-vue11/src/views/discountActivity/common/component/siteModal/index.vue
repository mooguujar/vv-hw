<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="title"
    :maxHeight="100"
    :minHeight="100"
    :showCancelBtn="false"
    :showOkBtn="false"
    @visible-change="handleVisibleChange"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, nextTick, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { joinObjectTypeOptionsFilter } from '../../const';
  import { useMemberStore } from '/@/store/modules/member';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getTextWidth } from '/@/utils/helper/tableHelper';

  const { t } = useI18n();
  const schemas: FormSchema[] = [
    {
      field: 'site_code',
      component: 'InputTextArea',
      label: '发送人群',
      required: true,
      colProps: {
        span: 24,
      },
      componentProps: {
        disabled: true,
        rows: 5,
      },
    },
  ];
  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    setup(props) {
      const [registerForm, { setFieldsValue, updateSchema }] = useForm({
        labelWidth: 80,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });
      const title = ref('' as string);

      const [register] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        const findItem = joinObjectTypeOptionsFilter.find(
          (item) => item.value === data.join_object_type,
        );
        title.value = findItem ? findItem.label : '';
        if (!data.join_object_values) return;
        switch (data.join_object_type) {
          case 3:
            updateSchema({
              field: 'site_code',
              label: t('table.common.levels'), //层级
              labelWidth: getTextWidth(t('table.common.levels')) + 40,
            });
            const { levelSelect } = useMemberStore();
            const levelString = data.join_object_values.map((item) => levelSelect[item]).join(',');
            setFieldsValue({ site_code: levelString });
            break;
          case 4:
            updateSchema({
              field: 'site_code',
              label: t('table.common.levels_vip'), //等级
              labelWidth: getTextWidth(t('table.common.levels_vip')) + 40,
            });
            const vipString = data.join_object_values.map((item) => `VIP${item}`).join(',');
            setFieldsValue({ site_code: vipString });
            break;
          case 5:
            updateSchema({
              field: 'site_code',
              label: t('table.common.agency_'), //代理
              labelWidth: getTextWidth(t('table.common.agency_')) + 40,
            });
            setFieldsValue({ site_code: data.join_object_values });
            break;
        }
      }

      function filterHtml(html) {
        return html.replace(/<[^>]+>/g, '');
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      return { register, schemas, registerForm, handleVisibleChange, title };
    },
  });
</script>
