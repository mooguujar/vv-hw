<template>
  <PageWrapper>
    <BasicForm @register="createForm" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';

  import {
    Checkbox,
    CheckboxGroup,
    FormItem,
    FormItemRest,
    UploadDragger,
    RadioGroup,
    DatePicker,
    Row,
    Col,
    Input,
  } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { PageWrapper } from '/@/components/Page';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { options } from '../../helper';
  import dayjs from 'dayjs';

  interface FormModel {
    beginTime: Date | null;
    endTime: Date | null;
    state: string | number;
  }

  export default defineComponent({
    name: 'MarqueeForm',
    components: {
      BasicForm,
      PageWrapper,
      [Input.name]: Input,
      [Row.name]: Row,
      [Col.name]: Col,
      [Checkbox.name]: Checkbox,
      [CheckboxGroup.name]: CheckboxGroup,
      [FormItem.name]: FormItem,
      [FormItemRest.name]: FormItemRest,
      [UploadDragger.name]: UploadDragger,
      [DatePicker.name]: DatePicker,
      [RadioGroup.name]: RadioGroup,
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false,
      },
      editBulletinData: {
        type: Object,
        default: () => null,
      },
      apiMap: {
        type: Object,
        default: () => {},
      },
    },
    setup(props) {
      const FORM_SIZE: any = useFormSetting().getFormSize;

      const { createMessage } = useMessage();

      const router = useRouter();

      const memberList = ref([] as any);

      const h5IpToInstall = ref([0, 0]);

      const loading = ref(false);

      const [createForm, { setFieldsValue, validate }] = useForm({
        labelWidth: 140,
        schemas: props.apiMap.schemas,
        actionColOptions: {
          span: 18,
        },
        size: FORM_SIZE,
        submitFunc,
        submitButtonOptions: {
          text: '保存',
          size: FORM_SIZE,
          style: {
            width: '84%',
            marginTop: '20px',
          },
        },
        showResetButton: false,
      });

      // 查询会员
      // async function searchMember(value) {
      //   loading.value = true;
      //   const { data } = await getUserList({ userName: value, modelType: props.apiMap.modelType });
      //   loading.value = false;
      //   memberList.value = data;
      // }

      async function submitFunc(): Promise<void> {
        try {
        } catch (e) {
          console.error(e);
        }
      }

      const model = ref<FormModel>({
        beginTime: dayjs().startOf('day').toDate(),
        endTime: dayjs().endOf('day').toDate(),
        state: '',
      });

      const disabledStartDate = (date) => {
        if (!model.value.endTime || !date) return false;
        return date.valueOf() > model.value.endTime.valueOf();
      };

      const disabledEndDate = (date) => {
        if (!model.value.beginTime || !date) return false;
        return date.valueOf() < model.value.beginTime.valueOf();
      };

      const onStartDateChange = (value) => {
        model.value.beginTime = value;
      };

      const onEndDateChange = (value) => {
        model.value.endTime = value;
      };

      watch(
        () => props.editBulletinData,
        (val) => {
          if (val) {
            h5IpToInstall.value = val.h5IpToInstall;
            setFieldsValue({
              ...val,
            });
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );

      return {
        FORM_SIZE,
        createForm,
        disabledStartDate,
        disabledEndDate,
        onStartDateChange,
        onEndDateChange,
        // options,
        loading,
        memberList,
        h5IpToInstall,
      };
    },
  });
</script>
