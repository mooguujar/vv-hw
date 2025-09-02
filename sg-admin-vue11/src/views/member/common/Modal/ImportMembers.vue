<template>
  <BasicModal
    @ok="okFun"
    :title="t('table.member.member_import_members')"
    :okText="t('table.member.member_confirm_upload')"
    :cancelText="t('business.common_cancel')"
    @register="registeraddDemond"
    :showCancelBtn="false"
    :width="800"
    :maskClosable="false"
  >
    <BasicForm @register="registeraddDemondForm">
      <template #importSlot="{ model, field }">
        <FormItemRest>
          <ImpExcel @success="loadDataSuccess" dateFormat="YYYY-MM-DD" class="w-128px">
            <a-button v-if="showText" :size="FORM_SIZE">
              <cloud-upload-outlined />
              {{ t('table.member.member_import_table') }}Excel
            </a-button>
            <div v-else
              >{{ btnText }}
              <DeleteOutlined @click.stop="deleteExcel" :style="{ color: '#e91134' }" />
            </div>
          </ImpExcel>
        </FormItemRest>
      </template>
    </BasicForm>
    <div class="alert !p-l-141px">
      <div>{{ t('table.member.member_instructions_for_use') }}</div>
      <div class="ml-2">
        <p>. {{ t('table.member.member_update_num') }}</p>
        <p>. {{ t('table.member.member_update_size') }}</p>
        <p class="p1" @click="handleDownloadByUrl"
          >. {{ t('table.member.member_download_template') }}
        </p>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, onUnmounted, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { schemas, transformData, setParamas } from './ImportMembers.data';
  import { message, FormItemRest } from 'ant-design-vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { ImpExcel, ExcelData } from '/@/components/Excel';
  import { fileUrlHandled } from '/@/utils/file/download';
  import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { getToken } from '/@/utils/auth';
  import axios from 'axios';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { socketClient } from '/@/utils/socket';
  import { useUserStore } from '/@/store/modules/user';

  const { t } = useI18n();
  const globSetting = useGlobSetting();
  const emit = defineEmits(['diamondsuccess', 'importSuccess', 'register', 'enable']);
  const FORM_SIZE = useFormSetting().getFormSize;
  const btnText = ref<any>('');
  const showText = ref<any>(true);
  const getExcelData = ref([] as any);
  const userStore = useUserStore();
  const info = userStore.getUserInfo;
  const [registeraddDemondForm, { setFieldsValue, validate, resetFields }] = useForm({
    labelAlign: 'right',
    showResetButton: false,
    showSubmitButton: false,
    schemas,
    size: FORM_SIZE,
  });

  const [registeraddDemond, { setModalProps, closeModal }] = useModalInner(async (values) => {
    setModalProps({ confirmLoading: false });
    resetFields();
    showText.value = true;
  });

  function deleteExcel() {
    showText.value = true;
    btnText.value = '';
    getExcelData.value = [];
    setFieldsValue({ member: '' });
  }

  function checkParams() {
    for (const excelData of getExcelData.value) {
      const {
        header,
        results,
        meta: { sheetName },
      } = excelData;
      const outputData = transformData(results).filter((item) => {
        return item.username.trim() !== '';
      });
      const arr: any = setParamas(outputData);
      for (const item of arr) {
        if (!item?.phone.trim()) {
          message.error(t('table.member.member_import_err1'));
          return false;
        } else if (!item?.email.trim()) {
          message.error(t('table.member.member_import_err2'));
          return false;
        } else if (!item?.vip.trim()) {
          message.error(t('table.member.member_import_err3'));
          return false;
        } else if (!item?.level.trim()) {
          message.error(t('table.member.member_import_err4'));
          return false;
        } else if (!item?.realname.trim()) {
          message.error(t('table.member.member_import_err5'));
          return false;
        } else if (!item.flag.trim()) {
          message.error(t('table.member.member_import_err6'));
          return false;
        } else if (!item.password_login.trim()) {
          message.error(t('table.member.password_login'));
          return false;
        } else if (!item.password_cash.trim()) {
          message.error(t('table.member.password_cash'));
          return false;
        }
      }
    }
    return true;
  }

  async function okFun() {
    if (userStore.importStr) {
      return message.error(t('common.feedbacktext10'));
    }
    try {
      setModalProps({ confirmLoading: true });
      const value = await validate();
      if (!checkParams()) {
        return false;
      }
      // value.d = resultList.value;
      for (const excelData of getExcelData.value) {
        const {
          header,
          results,
          meta: { sheetName },
        } = excelData;
        const outputData = transformData(results).filter((item) => {
          return item.username.trim() !== '';
        });
        const arr: any = setParamas(outputData);
        userStore.importStr = String(new Date().getTime());
        value['member'] = arr;
        value['id'] = userStore.importStr;

        const token: any = getToken();
        value.member = value.member.map((item) => {
          let realNameObj = Object.fromEntries(
            item.realname.split('\n').map((line: any) => {
              const [key, value] = line.split(':');
              if (!value) {
                return message.error(t('common.import_err4'));
              }
              return [key.trim().toLowerCase(), value.trim()];
            }),
          );
          const allValuesNotEmpty = Object.values(item.commission).every(
            (value) => value !== '' && value !== null && value !== undefined,
          );
          if (!allValuesNotEmpty) return message.error(t('common.import_err13'));
          const allMemberValuesNotEmpty = Object.values(item.member).every(
            (value) => value !== '' && value !== null && value !== undefined,
          );
          if (!allMemberValuesNotEmpty) return message.error(t('common.import_err14'));
          return {
            ...item,
            realname: realNameObj,
          };
        });

        socketClient.addSubscribe(`${info['prefix']}/merchant/import/${userStore.importStr}`);
        axios
          .post(globSetting.apiUrl + '/member/import', value, {
            headers: {
              t: token,
              lang: 'zh_CN',
              'Content-Type': 'application/octet-stream',
            },
          })
          .then((res) => {
            const { status, data } = res.data;
            if (status) {
            } else {
              message.error(data);
            }
          });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  function handleDownloadByUrl() {
    fileUrlHandled({
      url: '/assets/xlsx/users_import1.xlsx',
      filename: '会员列表-导入模板.xlsx',
      target: '_self',
    });
  }

  function loadDataSuccess(excelDataList: ExcelData[], name: any) {
    btnText.value = name;
    showText.value = false;
    getExcelData.value = excelDataList;
    for (const excelData of excelDataList) {
      const {
        header,
        results,
        meta: { sheetName },
      } = excelData;
      const columns: any = [];
      const requiredElements = [
        t('business.common_agent_account'),
        t('business.common_realiy_name'),
        t('modalForm.finance.common_income.account'),
        t('table.report.report_member_level'),
        t('table.system.system_vip_level'),
        t('business.common_phone_number'),
        t('common.email'),
      ];
      const containsAllRequiredElements = requiredElements.every((element) =>
        header.includes(element),
      );
      if (!containsAllRequiredElements) {
        return message.error(t('table.member.member_update_err'));
      }
      emit('importSuccess', excelDataList);
      const outputData = transformData(results).filter((item) => {
        return item.username.trim() !== '';
      });
      const arr = setParamas(outputData);
      checkParams();
      setFieldsValue({ member: arr });
    }
  }

  watch(
    () => userStore.importMqtt,
    (newVal) => {
      if (!newVal) return;
      const { flag, data, status } = newVal[0];
      if (status) {
        socketClient.removeSubscribe(`${info['prefix']}/merchant/import/${userStore.importStr}`); // 移除导出订阅
        userStore.importStr = '';
        message.success(data);
        closeModal();
        emit('enable');
      } else {
        const flagMap: Record<string, string> = {
          username: t('common.import_err1'),
          phone: t('common.import_err2'),
          mail: t('common.import_err3'),
          username_format: t('common.import_err4'),
          user_level: t('common.import_err5'),
          vip_level: t('common.import_err6'),
          phone_format: t('common.import_err7'),
          mail_format: t('common.import_err8'),
          logon_password_format: t('common.import_err9'),
          pay_password_format: t('common.import_err10'),
          agency_format: t('common.import_err11'),
          agency: t('common.import_err12'),
        };

        const tip = flagMap[flag];
        message.error(tip);
        socketClient.removeSubscribe(`${info['prefix']}/merchant/import/${userStore.importStr}`); // 移除导出订阅
        userStore.importStr = '';
      }
    },
  );
  onUnmounted(() => {
    socketClient.removeSubscribe(`${info['prefix']}/merchant/import/${userStore.importStr}`); // 移除导出订阅
  });
</script>
<style lang="less" scoped>
  .alert {
    display: flex;
    width: 100%;
    padding: 30px 30px 50px;
    border: 1px solid #78b7e3;
    background-color: #e1effe;
  }

  .p1 {
    color: @primary-color;
    cursor: pointer;
  }
</style>

<style lang="less">
  .import-tooltip {
    .ant-tooltip-inner {
      width: 500px;
    }
  }
</style>
