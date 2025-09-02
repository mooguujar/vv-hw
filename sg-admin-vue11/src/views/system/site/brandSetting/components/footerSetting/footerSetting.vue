<template>
  <div class="flex">
    <div class="w-full" style="width: calc(100% - 650px)">
      <CollapseContainer :title="t('modalForm.system.quickly_jump')">
        <template #operate>
          <FormItemRest>
            <Checkbox v-model:checked="checkedRadio" @change="handleChange">{{
              t('table.system.system_hid_l')
            }}</Checkbox>
          </FormItemRest>
        </template>
        <FastLink />
        <!--        <BasicForm @register="quickForm">-->
        <!--          <template #CheckRule="{ model, field }">-->
        <!--            <div v-for="item in quickJumpTable" :key="item.col">-->
        <!--              <FormItemRest>-->
        <!--                <Checkbox v-model:checked="item.check_box">{{ item.name }}</Checkbox>-->
        <!--              </FormItemRest>-->
        <!--              <template v-for="checkbox in item.info" :key="checkbox.name">-->
        <!--                <Checkbox v-model:checked="checkbox.check_box" :disabled="!item.check_box">{{-->
        <!--                  checkbox.name-->
        <!--                }}</Checkbox>-->
        <!--                <Button-->
        <!--                  v-if="checkbox.content_is_edit || checkbox.content_state"-->
        <!--                  size="small"-->
        <!--                  type="text"-->
        <!--                  class="button-icon"-->
        <!--                  @click="editModalOpen(checkbox)"-->
        <!--                >-->
        <!--                  <Icon icon="ant-design:form-outlined" />-->
        <!--                </Button>-->
        <!--              </template>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </BasicForm>-->
      </CollapseContainer>
      <CollapseContainer :title="t('common.Partner')">
        <BasicForm @register="partnerForm" />
      </CollapseContainer>
    </div>
    <div class="w-2/4">
      <div class="footer-bg"></div>
    </div>
  </div>
  <LangModal @register="editorLang" @update:ok="handleModalSuccess" />
  <Editor @register="editorModal" @update:ok="handleModalSuccess" />
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, nextTick, watch } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container';
  import { Input, Radio, Checkbox, message, FormItemRest } from 'ant-design-vue';
  import { Button } from '/@/components/Button';
  import Icon from '@/components/Icon/Icon.vue';
  import { updateSiteBrandBottomCheckbox, uploadCategoryBrand } from '/@/api/sys';
  import LangModal from './modal/LangModal.vue';
  import Editor from './modal/Editor.vue';
  import FastLink from './modal/FastLink.vue';
  import { useModal } from '/@/components/Modal/src/hooks/useModal';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  export default defineComponent({
    components: {
      BasicForm,
      CollapseContainer,
      [Input.name]: Input,
      Button,
      Radio,
      Checkbox,
      Icon,
      LangModal,
      Editor,
      FormItemRest,
      FastLink,
    },
    props: {
      detailInfo: {
        type: Object,
        default: () => ({}),
      },
      id: {
        type: String,
        default: '1',
      },
    },
    setup(props, { emit }) {
      const checkedRadio = ref(false);
      const quickJumpTable = ref([]);

      const [quickForm, { validate }] = useForm({
        schemas: [
          {
            field: 'CheckRule',
            component: 'CheckboxGroup',
            slot: 'CheckRule',
          },
        ],
        labelCol: { span: 6 },
        baseColProps: { span: 24 },
        actionColOptions: { span: 24 },
        submitButtonOptions: {
          text: t('business.comon_save'),
        },
        showResetButton: false,
        submitFunc: handleSubmit,
      });

      const [partnerForm] = useForm({
        schemas: [
          {
            field: 'quickLink',
            component: 'CheckboxGroup',
            colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
            componentProps: {
              options: [
                { label: 'PG', value: 1 },
                { label: 'AG', value: 2 },
                { label: 'MG', value: 3 },
                { label: 'SB', value: 4 },
                { label: 'FB', value: 5 },
                { label: 'WG', value: 6 },
                { label: 'OB', value: 7 },
              ],
            },
          },
        ],
        labelCol: { span: 6 },
        baseColProps: { span: 18 },
        actionColOptions: { span: 24 },
        submitButtonOptions: {
          text: t('business.comon_save'),
        },
        showResetButton: false,
        submitFunc: handleSubmit,
      });

      const [editorLang, { openModal: openLangModal }] = useModal();

      const [editorModal, { openModal }] = useModal();

      const handleModalSuccess = () => {
        emit('update:ok');
      };

      const editModalOpen = (value) => {
        if (value.jump_is_edit == 1) {
          openModal(true, {
            ...value,
          });
        } else {
          openLangModal(true, {
            ...value,
          });
        }
      };

      const handleChange = async (e) => {
        const { status, data } = await uploadCategoryBrand({
          id: props.id,
          bottom_quick_jump: { state: checkedRadio.value ? 1 : 2 },
        });
        if (status) {
          message.success(data);
          emit('update:ok');
        } else {
          message.error(data);
        }
      };
      async function handleSubmit() {
        try {
          const category = quickJumpTable.value
            .filter(({ check_box }) => check_box === true)
            .map(({ id }) => ({ id, check_box: 1 }));

          const category_info = quickJumpTable.value.flatMap(({ info }) =>
            info.map(({ check_box, id }) => ({
              id,
              check_box: check_box === true ? 1 : 2,
            })),
          );
          const { status, data } = await updateSiteBrandBottomCheckbox({ category, category_info });
          if (status) {
            message.success(data);
            emit('update:ok');
          } else {
            message.error(data);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const setFormList = async (baseInfo) => {
        if (!baseInfo) return;
        quickJumpTable.value = transformData(baseInfo['quick_jump']);
        checkedRadio.value = baseInfo['license']['state'] == 1 ? true : false;
      };
      function transformData(data) {
        if (Array.isArray(data)) {
          return data.map((item) => transformData(item));
        } else if (typeof data === 'object' && data !== null) {
          for (let key in data) {
            if (key === 'check_box') {
              if (data[key] === 1) {
                data[key] = true;
              } else if (data[key] === 2) {
                data[key] = false;
              }
            } else {
              data[key] = transformData(data[key]);
            }
          }
        }
        return data;
      }
      onMounted(() => {
        nextTick(() => {
          setFormList(props.detailInfo);
        });
      });

      watch(
        () => props.detailInfo,
        (val) => {
          if (val) {
            setFormList(props.detailInfo);
          }
        },
        { deep: true },
      );

      return {
        quickJumpTable,
        checkedRadio,
        quickForm,
        editorModal,
        handleModalSuccess,
        editModalOpen,
        editorLang,
        handleChange,
        partnerForm,
        t,
      };
    },
  });
</script>
<style lang="less" scoped>
  .footer-bg {
    position: fixed;
    right: 30px;
    top: 200px;
    z-index: 300;
    width: 600px;
    height: 450px;
    background-image: url('@/assets/images/u975.webp');
    background-size: 100%;
  }
  .footer-bg-filter {
    position: fixed;
    right: 30px;
    width: 600px;
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 350;
  }
  .active-bg {
    background-color: transparent !important;
  }
  .footer-bg-filter-quicklink {
    top: 150px;
    height: 107px;
  }
  .footer-bg-filter-cooperate {
    top: 257px;
    height: 83px;
  }
  .footer-bg-filter-support {
    top: 340px;
    height: 60px;
  }
  .footer-bg-filter-company {
    top: 400px;
    height: 153px;
  }
  .footer-bg-filter-band {
    top: 553px;
    height: 47px;
  }
</style>
