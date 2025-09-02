<template>
  <div class="feedback-container" ref="feedbackContainer">
    <Popover
      v-model:visible="isPopoverVisible"
      placement="topLeft"
      trigger="click"
      :overlayStyle="{ width: '580px' }"
      :destroyTooltipOnHide="true"
      :clickToHide="false"
      @update:visible="handleVisibleChange"
      overlayClassName="feedback-popover"
    >
      <template #content>
        <div class="feedback-panel">
          <div class="feedback-header">
            <h3>{{ currentView === 'chat' ? t('common.feedback') : t('common.feedback') }}</h3>
            <Button type="link" @click="closePopover" class="close-button">
              <Icon icon="material-symbols:close" />
            </Button>
          </div>

          <!-- Main -->
          <div>
            <Tabs v-model:activeKey="activeTab" type="card">
              <TabPane key="create" :tab="t('common.createfeedback')">
                <Form :model="formData" @submit="handleSubmit" class="feedback-form">
                  <p class="mb-5px">{{ t('common.feedbackC') }}</p>
                  <FormItem label="" :colon="false" required>
                    <Textarea
                      :maxlength="200"
                      v-model:value="formData.content"
                      :placeholder="t('common.feedbackText')"
                      :rows="6"
                    />
                  </FormItem>
                  <p class="mb-5px">{{ t('common.feedbackpic') }}</p>
                  <FormItem label="" :colon="false">
                    <div class="upload-container">
                      <UploadImg
                        v-if="formData.fileList"
                        v-model:fileList="formData.fileList"
                        list-type="picture-card"
                        :modalSize="['40%', 'auto']"
                        :limitNum="iconLimitNum"
                        :limitSizeObj="iconLimitSizeObj"
                        :showUpload="5"
                        :maxCount="5"
                        :describe="t('common.feedbackPNG1')"
                        :accept="'image/jpg,image/jpeg,image/png'"
                        :name="'uploadfile'"
                        :lang="lang"
                        :fileList_clear="fileList_clear"
                        @remove="() => {}"
                        @success="uploadSuccess"
                        :beforeUpload_="beforeUpload"
                        :modalTitle="t(' ') + ':'"
                        :api="uploadfeedbackImage"
                      />
                      <!-- <UploadImg
                        v-model:fileList="formData.fileList"
                        list-type="picture-card"
                        :max-count="5"
                        :modalSize="[150, 150]"
                        :limitNum="iconLimitNum"
                        :limitSizeObj="iconLimitSizeObj"
                        :showUpload="5"
                        :describe="t('格式是PNG或WEBP.')"
                        :accept="'image/webp,image/png'"
                        @remove="() => {}"
                        @success="() => {}"
                        :before-upload="beforeUpload"
                        :modalTitle="t(' ') + ':'"
                        :api="uploadfeedbackImage"
                      >
                      </UploadImg> -->
                      <div class="upload-hint">{{ t('common.feedbacktext2') }}</div>
                    </div>
                  </FormItem>

                  <!-- <FormItem> -->
                  <Button type="primary" size="large" html-type="submit" class="submit-button">{{
                    t('common.submitFeedback')
                  }}</Button>
                  <!-- </FormItem> -->
                </Form>
              </TabPane>
              <TabPane key="list" :tab="t('common.feedbacktext3')">
                <div v-if="currentView === 'chat'" class="chat-container">
                  <!-- Back button -->
                  <div class="back-button" @click="backToList">
                    <Icon icon="material-symbols:arrow-back" />
                    <span>{{ t('common.feedbacktext4') }}</span>
                  </div>

                  <!-- Chat   -->
                  <div class="chat-messages" ref="chatMessagesRef">
                    <div
                      class="message-item"
                      v-for="item in data_chat_list"
                      :key="item.id"
                      :class="item.customer ? 'customer' : 'support'"
                    >
                      <div class="message-content">
                        {{ item.content }}

                        <!-- 显示图片 -->
                        <div class="message-images" v-if="item.images && item.images.length > 0">
                          <img
                            v-for="(img, index) in item.images"
                            :key="index"
                            :src="img.url || img"
                            class="chat-image"
                            @click="previewImage(img.url || img)"
                          />
                        </div>
                      </div>
                      <div class="message-time">{{ item.date }}</div>
                    </div>
                  </div>

                  <!--   input -->
                  <div class="chat-input-container" v-if="current_state == 1">
                    <Input
                      v-model:value="chatMessage"
                      :placeholder="t('business.banner_tip')"
                      class="chat-input"
                    />
                    <Button type="primary" class="send-button" @click="sendMessage">{{
                      t('common.feedbacktext5')
                    }}</Button>
                  </div>
                </div>
                <div v-else class="feedback-list">
                  <div
                    v-for="item in feedbackList"
                    :key="item.id"
                    class="feedback-item"
                    :class="{ read: item.isRead }"
                    @click="openChatView(item)"
                  >
                    <div class="feedback-item-header">
                      <div class="feedback-status">
                        <!-- {{ item.state }} -->
                        <Badge :status="item.state == 1 ? 'processing' : 'success'" />
                        <span
                          >{{ t('common.feedbacktext6') }}
                          <span :class="item.state == 1 ? 'text-#e89e42' : 'text-#719f2f'">
                            {{
                              item.state == 1
                                ? t('common.feedbacktext10')
                                : t('common.feedbacktext11')
                            }}
                          </span>
                        </span>
                      </div>
                      <div class="feedback-read-status">
                        <Badge
                          :color="item.isRead ? '#ccc' : '#52c41a'"
                          :text="
                            item.isRead
                              ? t('table.system.system_have_read')
                              : t('table.system.system_unread')
                          "
                        />
                      </div>
                    </div>

                    <div class="feedback-item-content">
                      <div class="feedback-id">{{ t('common.feedbacktext7') }}{{ item.id }}</div>
                      <div class="feedback-date">{{ item.date }}</div>
                    </div>

                    <div class="feedback-body">{{ item.content }}</div>
                  </div>

                  <Empty
                    v-if="feedbackList.length === 0"
                    :description="t('common.feedbacktext8')"
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </template>

      <!-- Button r -->
      <div class="feedback-button" @click="info_data()">
        <Icon icon="material-symbols:feedback" class="feedback-icon" />
        <span class="mr-8px">{{ t('common.feedback') }}</span>
        <Badge v-if="unreadCount > 0" :count="unreadCount" />
      </div>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
  import { uploadfeedbackImage } from '/@/api/mission';
  import { ref, reactive, nextTick, h } from 'vue';
  import {
    Button,
    Form,
    Input,
    Tabs,
    Badge,
    Upload,
    message,
    Empty,
    Popover,
    Modal,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import UploadImg from '/@/components-cd/upload/UploadImg.vue';

  import Icon from '@/components/Icon/Icon.vue';
  import {
    feedback_insert,
    feedback_list,
    feedback_update,
    chat_list,
    chat_insert,
  } from '/@/api/sys';
  import { toTimezoneUnsecond } from '/@/utils/dateUtil';
  import { useLocale } from '/@/locales/useLocale';
  import eventBus from '/@/utils/eventBus';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import { createImgPreview } from '/@/components/Preview';

  const { t } = useI18n();

  const TabPane = Tabs.TabPane;
  const FormItem = Form.Item;
  const Textarea = Input.TextArea;

  // state
  const isPopoverVisible = ref(false);
  const isExplicitClose = ref(false);
  const fileList_clear = ref(false);
  const feedbackContainer = ref();
  const activeTab = ref('create');
  const unreadCount = ref(0);
  const currentView = ref('tabs'); // 'tabs' or 'chat'
  const selectedFeedback = ref(null);
  const chatMessage = ref('');
  const lang = useLocale().getLocale.value;

  // data
  const formData = reactive({
    content: '',
    fileList: [],
  });

  // feedback list
  const feedbackList = ref([
    {
      newest_m: 1,
      id: '10086',
      state: 1,
      isRead: false,
      date: '20/10 12:11',
      content: ' ',
    },
    {
      id: '10085',
      state: 2,
      newest_m: 1,
      isRead: true,
      date: ' ',
      content: ' ',
    },
  ]);

  const data_chat_list = ref([
    {
      id: '10086',
      status: '1',
      isRead: false,
      date: '20/10 12:11',
      customer: true,
      content: ' ',
    },
    {
      id: '10085',
      status: '2',
      isRead: true,
      customer: false,
      date: ' ',
      content: '   ',
    },
  ]);
  const iconLimitNum = ref(' ');
  const iconLimitSizeObj = {
    width: false,
    height: false,
  };
  let current_id = '0';
  let current_state = ref(0);
  const chatMessagesRef = ref();

  nextTick(async () => {
    info_data();
    eventBus.on('feedback_data', (res: any) => {
      if (currentView.value == 'chat') {
        openChatView(selectedFeedback.value);
      } else {
        info_data();
      }
    });
  });

  const info_data = async () => {
    let parms = {
      page: 1,
      page_size: 1111,
      start_time: '',
      end_time: '',
      // state: 1,
    };
    const { d, status } = await feedback_list(parms);
    if (d) {
      feedbackList.value = d.map((item) => {
        return {
          ...item,
          // state: item.state == 1 ? '处理中' : '已完成',
          isRead: item.newest_m < 1 ? true : false,
          date: toTimezoneUnsecond(item.created_at) ? toTimezoneUnsecond(item.created_at) : '-',
          content: item.description,
        };
      });
      unreadCount.value = Math.max(
        0,
        // feedbackList.value.filter((item) => item.newest_m && +item.newest_m > 1).length,
        feedbackList.value.reduce((sum, item) => sum + item?.newest_m, 0),
      );
    } else {
      feedbackList.value = [];
      // message.error('反馈列表数据获取错误，请联系管理员');
    }
  };

  //    拦截关闭行为
  const handleVisibleChange = (visible: boolean) => {
    if (!visible) {
      //  强制保持弹窗打开
      if (!isExplicitClose.value) {
        isPopoverVisible.value = true;
      }
    }
  };

  // 关闭按钮点击事件
  const closePopover = () => {
    fileList_clear.value = true;
    formData.fileList = [];
    img_list = [];

    isExplicitClose.value = true;
    setTimeout(() => {
      isPopoverVisible.value = false;
      isExplicitClose.value = false;
      // Reset
      currentView.value = 'tabs';
    }, 100);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(t('common.feedbacktext12'));
      return false;
    }

    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error(t('common.feedbacktext13'));
      return false;
    }

    return isJpgOrPng && isLt1M;
  };
  let img_list: any = [];

  const uploadSuccess = (e: any) => {
    fileList_clear.value = false;
    img_list.push(e);
  };

  const handleSubmit = async () => {
    if (!formData.content) {
      message.error(t('common.feedbacktext14'));
      return;
    }
    // Add
    const newFeedback = {
      images: JSON.stringify(img_list), //图片 多张图片地址逗号分隔
      description: formData.content, //反馈描述
      isRead: false,
      // date: new Date().toLocaleDateString().replace(/\//g, '/'),
      content: formData.content.substring(0, 40) + (formData.content.length > 40 ? '...' : ''),
    };

    await feedback_insert({ ...newFeedback }).then((data) => {
      unreadCount.value += 1;

      // Reset
      formData.content = '';
      formData.fileList = [];
      img_list = [];
      fileList_clear.value = true;

      //   submission
      //   message.success('反馈提交成功');
      // } else {
      //   message.warn('接口返回错误，请联系管理员。');
      // }
    });
    await info_data();
    activeTab.value = 'list';
  };

  // Chat
  const openChatView = async (item) => {
    //  as read
    // if (item.state == 1) {
    selectedFeedback.value = item;
    await get_chat_list(item);
    current_id = item.id;
    current_state.value = item.state;
    currentView.value = 'chat';
    // 添加滚动到底部的逻辑
    nextTick(() => {
      if (chatMessagesRef.value) {
        chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
      }
    });
    await feedback_update({ id: item.id });
    info_data();
    // item.isRead = true;
    // unreadCount.value = Math.max(0, unreadCount.value - 1);
    // }
  };

  async function get_chat_list(item) {
    return chat_list({
      feed_id: item.id,
    }).then((data) => {
      data_chat_list.value = data.reverse().map((item) => {
        let images: any = [];
        if (item.images) {
          try {
            images = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
            images = images.map((item) => getDataTypePreviewUrl(item));
          } catch (e) {
            console.error('解析图片数据失败:', e);
          }
        }
        return {
          ...item,
          // state: item.state == 1 ? '处理中' : '已完成',
          isRead: item.newest_m < 1 ? true : false,
          date: toTimezoneUnsecond(item.created_at) || '-',
          customer: item.source != 2,
          images: images, // 添加图片数组
        };
      });
    });
  }
  // 添加图片预览方法
  const previewImage = (url: string) => {
    createImgPreview({ imageList: [url], defaultWidth: 470, maskClosable: true });
  };
  const backToList = () => {
    currentView.value = 'tabs';
    activeTab.value = 'list';
  };

  const sendMessage = async () => {
    if (!chatMessage.value.trim() || current_state.value != 1) {
      return;
    }
    chat_insert({
      feed_id: current_id, //反馈ID
      content: chatMessage.value, //聊天内容
    });
    setTimeout(async () => {
      await get_chat_list({ id: current_id });
      chatMessage.value = '';

      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
        }
      });
    }, 100);

    // Clear t
  };
</script>

<style scoped lang="less">
  :deep(.feedback-panel) {
    .ant-tabs-nav {
      margin: 0;
      margin-top: 20px;

      .ant-tabs-nav-list {
        padding-left: 20px;
      }

      .ant-tabs-tab {
        margin: 0 !important;
        padding: 8px 16px;
        transition: all 0.2s;
        border: 1px solid #d9d9d9 !important;
        border-radius: 0;
        background: #f5f5f5;

        /* 左侧按钮：左侧圆角 */
        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }

        &:nth-child(2) {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        /* 激活状态 */
        &.ant-tabs-tab-active {
          border-color: #1890ff !important;
          background: #1890ff;
          color: white;

          .ant-tabs-tab-btn {
            color: inherit;
          }
        }

        /* 悬停效果 */
        &:hover:not(.ant-tabs-tab-active) {
          border-color: #1890ff;
          color: #1890ff;
        }
      }

      &::before {
        border-bottom: none !important;
      }
    }

    .ant-tabs-ink-bar {
      display: none !important;
    }
    // 添加图片相关样式
    .message-images {
      display: flex;
      flex-wrap: wrap;
      margin-top: 8px;
      gap: 5px;
    }

    .chat-image {
      max-width: 200px;
      max-height: 200px;
      transition: transform 0.2s;
      border-radius: 4px;
      cursor: pointer;
      object-fit: cover;

      &:hover {
        transform: scale(1.05);
      }
    }

    // 调整消息内容样式以适应图片
    .message-item {
      &.customer {
        .message-images {
          justify-content: flex-end;
        }
      }

      &.support {
        .message-images {
          justify-content: flex-start;
        }
      }
    }
  }

  .feedback-container {
    position: fixed;
    z-index: 1000;
    bottom: 20px;
    left: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      sans-serif;
  }

  .feedback-button {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    background-color: #1890ff;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    color: white;
    cursor: pointer;
  }

  .feedback-icon {
    margin-right: 8px;
  }

  .feedback-panel {
    width: 100%;
    height: 652px;
    overflow: hidden;
    border-radius: 8px;
    background: white;
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
  }

  .feedback-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: #1890ff;
    color: white;

    h3 {
      margin: 0;
      color: #fff;
    }

    span {
      font-size: 22px !important;
    }
  }

  .feedback-form {
    height: 536px;
    padding: 16px;
  }

  .ant-tabs-tabpane {
    position: relative;
    height: 536px;
  }

  .submit-button {
    position: absolute;
    right: 30px;
    bottom: 25px;
    // float: right;
  }

  .feedback-list {
    max-height: 536px;
    padding: 16px;
    overflow-y: auto;
  }

  .feedback-item {
    margin-bottom: 12px;
    padding: 12px;
    transition: all 0.1s;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      border-color: #1890ff;
      background-color: #f0f8ff;
    }
  }

  .feedback-item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .feedback-item-content {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    color: #888;
    font-size: 12px;
  }

  .feedback-body {
    color: #333;
  }

  .feedback-info {
    padding: 16px;
    background-color: #e6f7ff;
    font-size: 12px;
  }

  .status-info {
    margin-top: 16px;
  }

  .upload-container {
    display: flex;
    flex-direction: column;
  }

  .upload-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .upload-text {
    margin-top: 8px;
  }

  .upload-hint {
    margin-top: 8px;
    color: #888;
    font-size: 12px;
  }

  .close-button {
    color: white;
  }

  /* Chat  */
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .back-button {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: #1890ff;
    font-size: 14px;
    cursor: pointer;

    svg {
      margin-right: 8px;
    }

    &:hover {
      // background-color: #f0f8ff;
    }
  }

  .chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: #f5f5f5;
  }

  .message-item {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    margin-bottom: 16px;
  }

  .customer {
    align-items: flex-end;
    align-self: flex-end;
  }

  .support {
    align-items: flex-start;
    align-self: flex-start;
  }

  .message-content {
    padding: 8px 12px;
    border-radius: 4px;
    word-break: break-word;
  }

  .customer .message-content {
    border-radius: 8px 8px 0;
    background-color: #1890ff;
    color: white;
  }

  .support .message-content {
    border: 1px solid #e8e8e8;
    border-radius: 8px 8px 8px 0;
    background-color: white;
  }

  .message-time {
    margin-top: 4px;
    color: #888;
    font-size: 12px;
  }

  .chat-input-container {
    display: flex;
    padding: 12px;
    border-top: 1px solid #e8e8e8;
  }

  .chat-input {
    flex: 1;
    margin-right: 8px;
  }

  .send-button {
    width: 80px;
  }

  :deep(.ant-popover-inner) {
    padding: 0;
  }

  :deep(.ant-popover-inner-content) {
    padding: 0 !important;
  }

  :deep(.close-button) {
    width: 30px;
  }

  :deep(.ant-popover-arrow) {
    display: none;
  }
</style>
<style>
  .feedback-container {
    border-radius: 8px;
  }

  .feedback-container .ant-popover-content .ant-popover-inner {
    border-radius: 8px;
  }

  .feedback-container .ant-popover-inner-content {
    padding: 0 !important;
  }
</style>
