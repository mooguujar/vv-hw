<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    @ok="handleSubmit"
    :width="['zh_CN'].includes(unref(getLocale)) ? 600 : 750"
    :cancelText="$t('common.cancelText')"
    :okText="$t('common.okText')"
  >
    <BasicForm @register="registerForm" @field-value-change="fieldChang">
      <template #domain_id_domain="{ model, field }">
        <Select
          show-search
          v-model:value="model[field]"
          :placeholder="$t('table.report.report_p_enter_web_domain_name')"
          :fieldNames="{ label: 'name', value: 'id' }"
          :options="datalist"
          :not-found-content="fetching ? undefined : null"
          @search="handleSearch"
          @change="(value, section) => changeValue(value, section)"
          @focus="handleSearch(false, true)"
          :size="FORM_SIZE"
          allowClear
          :filterOption="false"
          style="width: 413px"
        >
          <template v-if="fetching" #notFoundContent>
            <Spin size="small" />
          </template>
        </Select>
      </template>
      <template #down_apk="{ model, field }">
        <Input v-model:value="model[field]" style="width: 230px; margin-right: 10px" size="large" />
        <UploadBtton
          v-model:fileList="model[field]"
          :accept="'application/vnd.android.package-archive'"
          :limitNum="1"
          :modalSize="[400, 700]"
          :showUpload="1"
          :name="'uploadfile'"
          :api="uploadUnderGroundManager"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, unref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema, TemplateList } from './addChannelLinkModal.data.ts';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { message, Select, Spin, Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    insertChannelList,
    updateChannelList,
    getDomainMeili,
    getDomainCache,
    uploadUnderGroundManager,
  } from '/@/api/promotion';
  import { coinType } from '/@/settings/commonSetting.js';
  import UploadBtton from '/@/components-cd/upload/UploadBtton.vue';
  import { useTreeListStore } from '/@/store/modules/treeList.js';
  import { useLocale } from '@/locales/useLocale';

  const { t } = useI18n();
  const { getLocale } = useLocale();

  export default defineComponent({
    name: 'AddChannelModal',
    components: { BasicModal, BasicForm, Select, Spin, Input, UploadBtton },
    props: {
      userData: { type: Object },
    },
    emits: ['success', 'register'],
    setup(props, { emit }) {
      const FORM_SIZE = useFormSetting().getFormSize;
      const [
        registerForm,
        { setFieldsValue, validate, getFieldsValue, clearValidate, resetFields },
      ] = useForm({
        labelWidth: 'auto',
        baseColProps: { span: 22 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 22,
        },
        size: FORM_SIZE,
      });
      const title = ref('' as string);
      const fetching = ref(false as any);
      const datalist = ref([] as any);
      const getdomainData = ref('' as any);
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        getdomainData.value = data.domain_child_id;
        await resetFields();
        nextTick(async () => {
          let group_id = undefined;
          if (data.group_ids === '0' || !data.group_ids) {
            group_id = undefined;
          } else {
            group_id = data.group_ids;
          }
          if (data.category == 1) {
            await setFieldsValue({
              isEdit: true,
              group_id: group_id,
              group_idsDisabled: true,
              app_open: data.app_open,
              apk: data.app_open == 4 ? t('common.follow_system') : data.apk,
              ios: data.app_open == 4 ? t('common.follow_system') : data.ios,
              apk_name: data.apk_name,
              ios_name: data.ios_name,
              nav_template: data.nav_template,
            });
          } else {
            // let { android, ios } = props.userData;
            // //主地址，备用地址
            // const apkUrl = android?.link?.primary || android?.link?.backup;
            // const iosUrl = ios?.link?.primary || ios?.link?.backup;
            // let apk_name = '';
            // let ios_name = '';
            // if (apkUrl) {
            //   apk_name = apkUrl.split('/').pop();
            // }
            // if (iosUrl) {
            //   ios_name = iosUrl.split('/').pop();
            // }
            await setFieldsValue({
              isEdit: false,
              group_id: group_id,
              group_idsDisabled: !!group_id,
              app_open: 4,
              // nav_template: undefined,
              apk: t('common.follow_system'),
              ios: t('common.follow_system'),
              // apk_name: apk_name,
              // ios_name: ios_name,
            });
          }
        });
        title.value = data.title;
        if (data.id) {
          if (data.fix == 0) data.fix = 1;
          if (data.gift == 0) data.gift = 1;
          if (data.fix_type == 0) data.fix_type = 1;
          if (data.down_button == 0) data.down_button = 1;
          if (data.lead_page == 0) data.lead_page = 1;
          if (!data.apk) data.apk_name = '';

          // const { getPostChannelTemplateListData } = useTreeListStore();

          // const findtemplate = getPostChannelTemplateListData?.find(
          //   (el) => el.id == data.nav_template,
          // );

          // if (!findtemplate) {
          //   const randomItem: any =
          //     getPostChannelTemplateListData[
          //       Math.floor(Math.random() * getPostChannelTemplateListData.length)
          //     ];
          //   data.nav_template = randomItem?.id;
          // }

          if (data.apk == '-') {
            data.apk = '';
            data.apk_name = '';
          }

          if (data.channel_type == 1) {
            data.nav_location1 = data.nav_location;
          } else {
            data.nav_location2 = data.nav_location;
          }

          if (!data.app_open) data.app_open = 2;

          if (data.state == 4) data.domain_id = null;
          if (data.domain_id && data.domain_child_id) {
            data.domain_id = `${data.domain_id}_${data.domain_child_id}`;
          }

          await setFieldsValue(data);
        }
        /**
         * 处理表格进来就校验
         */
        nextTick(() => {
          clearValidate();
        });
        setModalProps({ confirmLoading: false });
      });

      const oldData = ref({ apk: '', ios: '' });
      async function fieldChang(field, value) {
        let data = await getFieldsValue();
        if (field == 'app_open') {
          if (value == '4') {
            oldData.value = {
              apk: data.apk === t('common.follow_system') ? oldData.value.apk : data.apk,
              ios: data.ios === t('common.follow_system') ? oldData.value.ios : data.ios,
            };
            await setFieldsValue({
              apk: t('common.follow_system'),
              ios: t('common.follow_system'),
            });
          } else {
            const { apk, ios } = oldData.value;
            await setFieldsValue({
              apk: apk,
              ios: ios,
            });
          }
        }
        clearValidate();
      }
      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          // values.nav_location =
          //   values.channel_type == 1 ? values.nav_location1 : values.nav_location2;

          // if (values.channel_type == 1) {
          //   delete values.nav_location1;
          // } else {
          //   delete values.nav_location2;
          // }
          if (!values.apk && !values.ios) {
            message.error(t('common.ios_apk_e'));
            return;
          }
          // const { getPostChannelTemplateListData } = useTreeListStore();
          // const findtemplate = getPostChannelTemplateListData?.find(
          //   (el) => el.id == values.nav_template,
          // );

          // if (!findtemplate) {
          //   const randomItem: any =
          //     getPostChannelTemplateListData[
          //       Math.floor(Math.random() * getPostChannelTemplateListData.length)
          //     ];
          //   values.nav_template = randomItem?.id;
          // }
          if (values.app_open == 4) {
            values.apk = '';
            values.ios = '';
            values.apk_name = '';
            values.ios_name = '';
          }
          if (values.domain_id) {
            const domain = values.domain_id.split('_');
            values.domain_id = domain[0];
            values.domain_child_id = domain[1];
          }
          if (values.nav_template == '0') {
            const randomItem: any = TemplateList[Math.floor(Math.random() * TemplateList.length)];
            values.nav_template = randomItem.id;
          }
          if (values.nav_location == 5 && values.fix_type == 3) {
            values.fix = 1;
          }
          const { status, data } = values.id
            ? await updateChannelList({
                ...values,
                group_id: values.group_id || undefined,
                id: values.id,
                domain_child_id: getdomainData.value,
                currency: coinType[values?.lang],
              })
            : await insertChannelList({
                ...values,
                group_id: values.group_id || undefined,
                domain_child_id: getdomainData.value,
                currency: coinType[values?.lang],
              });
          if (status) {
            message.success(data);
            emit('success');
            closeModal();
          } else {
            message.error(data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }

      async function handleSearch(value?: any, isCache?) {
        fetching.value = true;
        datalist.value = [];
        const { data } = isCache ? await getDomainCache({}) : await getDomainMeili({ name: value });
        datalist.value = data.map((item) => {
          return { ...item, id: `${item.domain_id}_${item.domain_child_id}` };
        });
        fetching.value = false;
      }

      function changeValue(v, s) {
        if (s) {
          getdomainData.value = s.domain_child_id;
          setFieldsValue({ domain_id: `${s.domain_id}_${s.domain_child_id}` });
        } else {
          getdomainData.value = '';
          setFieldsValue({ domain_id: null });
        }
      }

      onMounted(() => {
        handleSearch(false, true);
      });

      return {
        registerModal,
        registerForm,
        fieldChang,
        handleSubmit,
        unref,
        getLocale,
        title,
        fetching,
        datalist,
        handleSearch,
        FORM_SIZE,
        changeValue,
        uploadUnderGroundManager,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-col.ant-col-24 .ant-form-item-explain-error) {
    transform: translateY(-10px);
  }
</style>
