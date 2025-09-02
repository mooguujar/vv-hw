<template>
  <BasicModal
    v-bind="$attrs"
    :title="modalTitle"
    :okText="$t('table.system.system_qd_save')"
    :cancelText="$t('common.cancelText')"
    :width="752"
    @register="registerModal"
    @ok="handleSubmit"
    class="ip-modal"
  >
    <div class="overflow-auto" :style="{ height: dynamicHeight + 'px' }">
      <BasicForm @register="registerForm" @submit="handleSubmit" :schemas="addSchema(isEdit)">
        <template #add="{ field }">
          <Button v-if="Number(field) === 0" @click="add" class="add-btn ml-2.5" :size="FORM_SIZE"
            >+
          </Button>
          <Button v-if="field > 0" @click="del(field)" class="reduce-btn ml-2.5" :size="FORM_SIZE"
            >-
          </Button>
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { FormItemRest, DatePicker, message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Button } from '/@/components/Button';
  import { insertWhitelistList, updateWhitelistList } from '/@/api/sys';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';
  import { ipSettingList } from '../../common/const';
  import addImg from '/@/assets/images/add.webp';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm';

  export default defineComponent({
    name: 'AddBlacklistModal',
    components: {
      BasicModal,
      BasicForm,
      [DatePicker.name]: DatePicker,
      [FormItemRest.name]: FormItemRest,
      Button,
      addImg,
    },
    emits: ['reload', 'register'],
    setup(_, context) {
      const { t } = useI18n();
      const FORM_SIZE = useFormSetting().getFormSize;
      const isEdit = ref<boolean>(false);
      const ipId = ref<string>('');
      const dynamicHeight = ref(80);
      const modalTitle = computed(() =>
        isEdit.value ? t('table.risk.report_edit_ip') : t('table.risk.report_new_ip'),
      );

      const n = ref(1);
      const toAddIP = ref(false);
      let addSchemaIsType = [
        {
          field: 'flags',
          component: 'CheckboxGroup',
          label: t('business.common_access_permission'),
          colProps: { span: 24 },
          componentProps: {
            options: ipSettingList,
          },
          rules: [
            {
              required: true,
              validator: async (rule, value) => {
                if (!value) {
                  return Promise.reject(
                    t('common.chooseText') + t('business.common_access_permission').toLowerCase(),
                  );
                }
                return Promise.resolve();
              },
            },
          ],
        },
        {
          field: 'field0ip',
          component: 'Input',
          label: t('table.risk.report_ip_address'),
          colProps: { span: 10 },
          rules: [
            {
              required: true,
              validator: (_, value) => {
                const reg =
                  /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
                if (!value) {
                  return Promise.reject(t('table.risk.report_ip_address_tip'));
                } else if (!reg.test(value)) {
                  return Promise.reject(t('table.risk.report_correct_ip_address_tip'));
                }
                return Promise.resolve();
              },
            },
          ],
        },
        {
          field: 'field0note',
          component: 'Input',
          colProps: { span: 10 },
          label: t('table.member.member_ramark_massage'),
          rules: [
            {
              validator: (rule, value) => {
                if (value && value.length > 100) {
                  return Promise.reject(t('table.member.member_ramark_massage100'));
                }
                return Promise.resolve();
              },
            },
          ],
        },
      ];
      let addSchemaIsNotType = [
        {
          field: 'flags',
          component: 'CheckboxGroup',
          label: t('business.common_access_permission') + ':',
          colProps: { span: 24 },
          componentProps: {
            options: ipSettingList,
          },
          rules: [
            {
              required: true,
              validator: async (rule, value) => {
                if (!value) {
                  return Promise.reject(
                    t('common.chooseText') + t('business.common_access_permission').toLowerCase(),
                  );
                }
                return Promise.resolve();
              },
            },
          ],
        },
        {
          field: 'field0ip',
          component: 'Input',
          label: t('table.risk.report_ip_address') + ':',
          colProps: { span: 10 },
          rules: [
            {
              required: true,
              validator: (_, value) => {
                const reg =
                  /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
                if (!value) {
                  return Promise.reject(t('table.risk.report_ip_address_tip'));
                } else if (!reg.test(value)) {
                  return Promise.reject(t('table.risk.report_correct_ip_address_tip'));
                }
                return Promise.resolve();
              },
            },
          ],
        },
        {
          field: 'field0note',
          component: 'Input',
          colProps: { span: 10 },
          label: t('table.member.member_ramark_massage') + ':',
          rules: [
            {
              validator: (rule, value) => {
                if (value && value.length > 100) {
                  return Promise.reject(t('table.member.member_ramark_massage100'));
                }
                return Promise.resolve();
              },
            },
          ],
        },
        {
          field: '0',
          component: 'Input',
          label: ' ',
          slot: 'add',
          colProps: { span: 4 },
        },
      ];
      const labelWidth = isEdit.value
        ? useAutoLabelWidth(addSchemaIsType)
        : useAutoLabelWidth(addSchemaIsNotType);
      const [
        registerForm,
        {
          appendSchemaByField,
          removeSchemaByField,
          validate,
          resetFields,
          clearValidate,
          setFieldsValue,
        },
      ] = useForm({
        labelWidth,
        actionColOptions: { span: 24 },
        showActionButtonGroup: false,
        size: FORM_SIZE,
      });

      function addSchema(type) {
        if (type) {
          return addSchemaIsType;
        } else {
          return addSchemaIsNotType;
        }
      }

      function add() {
        n.value++;
        toAddIP.value = true;
        appendSchemaByField(
          {
            field: `field${n.value}ip`,
            component: 'Input',
            colProps: { span: 10 },
            label: t('table.risk.report_ip_address'),
            rules: [
              {
                required: true,
                validator: (_, value) => {
                  const reg =
                    /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[0-9])\.((1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)\.){2}(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)$/;
                  if (!value) {
                    return Promise.reject(t('table.risk.report_ip_address_tip'));
                  } else if (!reg.test(value)) {
                    Promise.reject(t('table.risk.report_correct_ip_address_tip'));
                  }
                  return Promise.resolve();
                },
              },
            ],
          },
          '',
        );
        appendSchemaByField(
          {
            field: `field${n.value}note`,
            component: 'Input',
            colProps: { span: 10 },
            label: t('table.member.member_ramark_massage'),
            rules: [
              {
                validator: (rule, value) => {
                  if (value && value.length > 100) {
                    return Promise.reject(t('table.member.member_ramark_massage100'));
                  }
                  return Promise.resolve();
                },
              },
            ],
          },
          '',
        );
        appendSchemaByField(
          {
            field: `${n.value}`,
            component: 'Input',
            label: ' ',
            slot: 'add',
            colProps: { span: 4 },
          },
          '',
        );
        n.value++;
        resetHeight('add');
      }

      function del(field) {
        removeSchemaByField([`field${field}ip`, `field${field}note`, `${field}`]);
        n.value--;
        resetHeight('del');
      }

      function resetHeight(type = 'add') {
        let _selectedLength =
          document.getElementsByClassName('add-btn').length +
          document.getElementsByClassName('reduce-btn').length;
        let _maxHeight = 80;
        if (type === 'add') {
          _maxHeight += (_selectedLength + 1) * 60;
        } else {
          if (_selectedLength == 2) {
            _maxHeight += _selectedLength * 60;
          } else {
            _maxHeight += (_selectedLength - 1) * 60;
          }
        }
        let _autoHeightBox =
          document.getElementsByClassName('ip-modal')[0].parentNode.previousSibling.childNodes[1]
            .childNodes[0].childNodes[0].childNodes[2];
        _autoHeightBox.style.maxHeight = _maxHeight + 'px';
        _autoHeightBox.style.height = _maxHeight + 'px';
        if (document.getElementsByClassName('ant-modal-body').length == 1) {
          let _outBox = document.getElementsByClassName('ant-modal-body')[0];
          _outBox.children[0].children[0].children[0].style.height = _maxHeight + 'px';
        }
      }

      function initHeight() {
        let _autoHeightBox =
          document.getElementsByClassName('ip-modal')[0].parentNode.previousSibling.childNodes[1]
            .childNodes[0].childNodes[0].childNodes[2];
        _autoHeightBox.style.minHeight = 120 + 'px!important'; //120 + 'px!important' 設置不了
      }

      const [registerModal, { setModalProps, closeModal }] = useModalInner(
        async (data: { record: Recordable }) => {
          initHeight();
          resetFields();
          clearValidate();
          isEdit.value = data.type === 'add' ? false : true;
          if (data?.record) {
            const { id, ip, note, flags } = data.record;
            isEdit.value = true;
            ipId.value = id;
            setFieldsValue({
              field0ip: ip,
              field0note: note,
              flags: [flags],
            });
          } else {
            isEdit.value = false;
          }
          setModalProps({ confirmLoading: false });
        },
      );

      function convertListToList2(list, flags) {
        const list2 = [];

        for (let i = 0; true; i++) {
          const ipKey = `field${i}ip`;
          const noteKey = `field${i}note`;

          if (list[ipKey] !== undefined) {
            list2.push({
              ip: list[ipKey],
              note: list[noteKey] ? list[noteKey] : null,
              flags: flags[0],
            });
          } else {
            // 当遇到不存在的键时跳出循环
            break;
          }
        }
        return list2;
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          const { flags } = values;
          const params: any = convertListToList2(values, flags);
          const { data, status } = isEdit.value
            ? await updateWhitelistList({ ...params[0], id: ipId.value })
            : await insertWhitelistList(params);

          if (status) {
            message.success(data);
            context.emit('reload');
            closeModal();
          } else {
            message.error(data);
          }
        } catch (e) {
          console.error(e);
        }
      }

      return {
        FORM_SIZE,
        modalTitle,
        registerForm,
        registerModal,
        handleSubmit,
        isEdit,
        dayjs,
        add,
        del,
        addSchema,
        addImg,
        dynamicHeight,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-btn) {
    &.add-btn {
      width: 52px;
      height: 38px;
      border: none;
      background: #1475e1 url('/@/assets/images/add.webp') no-repeat center;
      background-size: 17px;
      color: transparent;
    }

    &.reduce-btn {
      width: 52px;
      height: 38px;
      border: none;
      background: #e91134 url('/@/assets/images/reduce.webp') no-repeat center;
      background-size: 17px;
      color: transparent;
    }
  }

  .overflow-auto {
    position: absolute;
    min-height: 60px;
    overflow: visible !important;
  }

  ::v-deep(.ant-col-4 > div > div:first-child) {
    width: 0 !important;
  }

  ::v-deep(.ant-col-4 > div) {
    text-align: center;
  }
</style>
