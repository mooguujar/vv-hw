<template>
  <main>
    <BasicModal
      :centered="true"
      :minHeight="250"
      :maxHeight="550"
      :title="`「${infoData.username}」${
        isReply
          ? $t('table.system.system_feefbook_replay')
          : $t('table.system.system_feedbook_detail')
      }`"
      @register="registerModal"
      :showCancelBtn="false"
      :showOkBtn="false"
      :closeFunc="closeFunc"
    >
      <div class="info-content justify-between">
        <div class="whitespace-nowrap">
          <span class="info-title">{{ $t('business.common_member_account') }}:</span>
          <span>{{ infoData.username }}</span>
        </div>
        <div v-if="infoData?.amount" class="whitespace-nowrap ml-[10px]">
          <span>{{ $t('table.system.system_adoption_bonus') }}：</span
          ><span style="color: red">{{
            infoData?.amount ? infoData?.amount + '.00USDT' : ''
          }}</span>
        </div>
      </div>
      <div class="info-content">
        <span class="info-title">{{ $t('table.system.system_feedback_time') }}:</span>
        <span>{{ toTimezone(infoData.created_at) }}</span>
      </div>
      <div class="info-content" v-if="infoData?.images && JSON.parse(infoData?.images).length">
        <span class="info-title">{{ $t('table.system.system_feedback_image') }}:</span>
        <template v-if="infoData?.images">
          <div class="w-15 pr-2" :key="index" v-for="(img, index) in JSON.parse(infoData?.images)">
            <Image
              rootClassName="feedback-img"
              maskClassName="mask-img"
              :src="getDataTypePreviewUrl(img)"
            />
          </div>
        </template>
        <template v-else> - </template>
      </div>
      <div class="info-content">
        <label class="info-title !w-31 !m-0 whitespace-nowrap"
          >{{ $t('table.system.system_history_replay') }}:</label
        >
        <div class="bg-#f2f2f2 pl-8px pr-8px w150" v-if="chatListValue?.length">
          <div
            v-for="(item, index) in chatListValue"
            :key="index"
            class="m-y-8px flex justify-start"
            :class="{ 'justify-end': item.uid != infoData.uid }"
          >
            <span
              class="bg-#fff p-2 max-w-350px"
              style="border-radius: 10px"
              :class="{ '!bg-#1475E1 !text-#fff': item.uid != infoData.uid }"
              >{{ item.content }}</span
            >
          </div>
        </div>
      </div>
      <div class="info-content" v-if="isReply">
        <BasicForm @register="registerForm" />
      </div>

      <template v-if="isReply" #centerFooter>
        <a-button @click="closeModal">{{ $t('common.cancelText') }}</a-button>
        <a-button type="primary" @click="handleSubmit">{{ $t('common.okText') }}</a-button>
      </template>
    </BasicModal>
  </main>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getfeedbackChatList, insertFeedbackChat } from '/@/api/sys/index';
  import { Image } from 'ant-design-vue';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { toTimezone } from '/@/utils/dateUtil';
  import { Recordable } from './Model.data';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const isReply = ref<number>(0);
  const infoData = ref<Recordable>({
    id: '',
    username: '',
    images: '',
    created_at: '',
    amount: '',
    uid: '',
  });
  const chatListValue = ref([] as any);
  const chatId = ref('' as string);
  const emit = defineEmits(['reload', 'register', 'closeModelFun']);
  const [registerForm, { resetFields, validate, getFieldsValue }] = useForm({
    schemas: [
      {
        field: 'remark',
        label: t('table.system.system_relpay_content') + ':',
        rules: [{ required: true, message: t('common.reply_content') }],
        component: 'Input',
        colProps: { style: { width: '450px' } },
        componentProps: {
          maxlength: 200,
          placeholder: t('table.system.system_replay_message'),
        },
      },
    ],
    showActionButtonGroup: false,
  });
  const [registerModal, { setModalProps, closeModal }] = useModalInner(
    async (data: { response: Recordable; reply: number }) => {
      chatId.value = data?.response?.id;
      getChatList(data?.response?.id);
      setModalProps({ confirmLoading: false });
      if (isReply.value) {
        resetFields();
      }
      isReply.value = data.reply;
      infoData.value = data.response;
    },
  );
  async function getChatList(value) {
    const { data, status } = await getfeedbackChatList({ feed_id: value });
    if (status) {
      chatListValue.value = data.reverse();
    }
  }
  function closeFunc() {
    emit('closeModelFun');
    return true;
  }
  async function handleSubmit(): Promise<void> {
    const isValid = await validate();
    if (!isValid) {
      return;
    }
    try {
      setModalProps({ confirmLoading: true });
      let payload = {
        feed_id: chatId.value,
        content: getFieldsValue().remark,
        source: 2,
      };
      const { status, data } = await insertFeedbackChat(payload);
      if (status) {
        createMessage.success(data);
        emit('reload');
        resetFields();
      } else {
        createMessage.error(data);
      }
      closeModal();
    } catch (e) {
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
<style scoped>
  .info-content {
    display: flex;
    margin-top: 20px;
    padding: 0 20px;
  }

  ::v-deep(.feedback-img) {
    width: 40px;
    height: 40px;
  }

  ::v-deep(.ant-image-img) {
    height: 100%;
  }

  ::v-deep(.feedback-img .ant-image-mask-info) {
    font-size: 0;
  }

  ::v-deep(.feedback-img .ant-image-mask-info span) {
    font-size: 18px;
  }

  .info-title {
    margin-right: 15px;
  }
</style>
