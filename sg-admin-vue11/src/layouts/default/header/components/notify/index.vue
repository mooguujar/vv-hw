<template>
  <div :class="prefixCls">
    <Popover
      trigger="hover"
      v-model:visible="opened"
      :overlayClassName="`${prefixCls}__overlay min-w-[400px]`"
      @mouseenter="onPopMouseEnter()"
    >
      <template #title>
        <div>
          <img :src="ringNotify" class="w-20px mr-5px ring-img" />
          {{ t('layout.notify.p1') }}
          <Button @click="closePopover" type="text" class="close-notify">
            <CloseOutlined />
          </Button>
        </div>
      </template>
      <Badge :numberStyle="numberStyle" :overflow-count="99" :offset="[0, 12]" showZero>
        <template #count>
          <span class="notify-count">{{ count }}</span>
        </template>
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.name">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <!-- <span v-if="item.list.length !== 0">({{ item.list.length }})</span> -->
                <Badge :status="item.status" />
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <div class="overflow-y-auto notice-box">
                <NoticeList
                  v-if="item?.list.length > 0"
                  :list="item.list"
                  @title-click="onNoticeClick"
                />
                <div v-if="item?.list.length === 0" class="notify-empty">
                  <div>
                    <img :src="woDataIcon" class="notify-empty-img mt-40px" />
                    <div class="text-white text-center notify-empty-img-title">{{
                      t('layout.notify.p2')
                    }}</div>
                    <div class="text-center notify-empty-img-descript">{{
                      t('layout.notify.p3')
                    }}</div>
                  </div>
                </div>
              </div>
              <div
                class="mt-4 flex"
                v-if="item.notification_type != 'announcement' && item?.list.length > 0"
              >
                <a-button
                  type="primary"
                  danger
                  size="large"
                  class="notify-button"
                  @click="deleteData(item)"
                  >{{ t('layout.notify.clearNotify') }}</a-button
                >
              </div>
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, onBeforeMount, onMounted, ref } from 'vue';
  import { Popover, Tabs, Badge, message, Button } from 'ant-design-vue';
  import { CloseOutlined, BellOutlined } from '@ant-design/icons-vue';
  import ringNotify from '/@/assets/images/ring-notify.webp';
  import NoticeList from './NoticeList.vue';
  import woDataIcon from '/@/assets/images/wo-data-icon.webp';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getFinance, getPromo, getRisk, removeNotificationsList } from '/@/api/sys/user';
  import eventBus from '/@/utils/eventBus';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { GetNoticeRead, GetZkNoticeList } from '/@/api/sys';

  export default defineComponent({
    components: {
      Popover,
      BellOutlined,
      Tabs,
      TabPane: Tabs.TabPane,
      Badge,
      NoticeList,
      Button,
      CloseOutlined,
      ringNotify,
      woDataIcon,
    },
    setup() {
      const { t } = useI18n();
      const onPopMouseEnter = () => {
        getDataList();
      };
      const { prefixCls } = useDesign('header-notify');
      const listData = ref<any>([]);
      const opened = ref<boolean>(false);

      const count = computed(() => {
        let count = 0;
        let unreadListData = [];
        for (let i = 0; i < listData.value.length; i++) {
          // 重置 unreadListData 为空数组
          unreadListData = [];
          if (listData.value[i].list.length) {
            unreadListData = listData.value[i].list.filter((item) => {
              return item.is_read === 1;
            });
          }
          count += unreadListData.length;
        }
        return count;
      });

      function onNoticeClick(data: any) {
        opened.value = false;
        const matchedItem = listData.value.find((item) => item.notification_type === data.type);
        if (matchedItem) {
          const selectedItem = matchedItem.list.find((item) => item.id === data.id);
          if (selectedItem) {
            selectedItem.is_read = 2;
          }
        }
        updateStatus();
        if (data.type == 'announcement') {
          eventBus.emit('openNoticeModal', data);
        }
      }

      async function deleteData(source: any) {
        const { status, data: text } = await removeNotificationsList({
          notification_type: source.notification_type,
        });
        if (status) {
          source['list'] = [];
          message.success(text);
        } else {
          message.error(text);
        }
        updateStatus();
      }

      async function getDataList() {
        let data = [
          {
            key: '1',
            name: t('layout.notify.finance'),
            list: [],
            notification_type: 'finance',
            status: 'error',
          },
          {
            key: '2',
            name: t('layout.notify.rickControl'),
            list: [],
            notification_type: 'risk',
            status: 'error',
          },
          {
            key: '3',
            name: t('layout.notify.promo_bonus'),
            list: [],
            notification_type: 'promo_bonus',
            status: 'error',
          },
          {
            key: '4',
            name: t('layout.notify. announcement'),
            list: [],
            notification_type: 'announcement',
            status: 'error',
          },
        ];

        const replaceString = async (list, notificationType, api) => {
          let notifications = [];
          if (notificationType == 'announcement') {
            let { d } = await api({});
            notifications = d;
          } else {
            notifications = await api({});
          }

          if (notificationType == 'announcement') {
            notifications &&
              notifications.forEach((el) => {
                el.type = 'announcement';
                el.is_read = el.read == true ? 0 : 1;
              });
          } else {
            if (!notifications)
              notifications &&
                notifications.forEach((el) => {
                  el.userAccount = el.content;
                  el.rowContent = el.content;
                  let replacedStr = '';
                  // let replacedStr2 = '';
                  // let replacedStr3 = '';
                  if (el.content) {
                    replacedStr = el.content.replace(
                      /\[\[(.*?)\]\]/g,
                      "<span style='color: red;'>$1</span>",
                    );
                    // const regex = /\[\[(.*?)\]\]/;
                    // const match = regex.exec(el.content);
                    // if (match) {
                    //   replacedStr2 = match[1];
                    // }
                    // replacedStr3 = el.content.split(':')[0]?.substring(1);
                  }
                  el.content = `<span>${replacedStr}</span>`;
                  // el.rowContent = replacedStr2;
                  // el.userAccount = replacedStr3;
                });
          }
          list.list = notifications ?? [];
        };
        await replaceString(data[0], 'finance', getFinance);
        await replaceString(data[1], 'risk', getRisk);
        await replaceString(data[2], 'promo_bonus', getPromo);
        await replaceString(data[3], 'announcement', GetZkNoticeList);
        listData.value = data;
        updateStatus();
      }

      function updateStatus() {
        return listData.value.map((item) => {
          const hasUnread = item.list.some((listItem) => listItem.is_read === 1);
          item.status = hasUnread ? 'error' : 'default';
          return item;
        });
      }

      const closePopover = () => {
        opened.value = false;
      };

      onMounted(() => {
        getDataList();
        eventBus.on('RefreshNotification', (res: any) => {
          getDataList();
        });
      });

      onBeforeMount(() => {
        eventBus.off('RefreshNotification');
      });

      return {
        onPopMouseEnter,
        prefixCls,
        listData,
        count,
        deleteData,
        onNoticeClick,
        numberStyle: {},
        opened,
        t,
        closePopover,
        ringNotify,
        woDataIcon,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-bottom: 1px;

    &__overlay {
      top: 50px !important;
      width: 431px;

      .ant-popover-content {
        width: 431px !important;
      }

      .ant-popover-arrow {
        display: none !important;
      }

      .ant-popover-inner {
        width: 431px !important;
        height: 80vh !important;
        background-color: #0f212e !important;
      }

      .ant-tabs-nav::before {
        display: none !important;
      }

      .ant-tabs-nav-list {
        height: 54px;
        margin: auto;
        padding-right: 7px;
        padding-left: 7px;
        transform: none;
        border-radius: 40px;
        background-color: #1a2c38;
      }

      .ant-tabs-tab {
        div {
          color: #fff !important;
          font-size: 14px;
          font-weight: 600;
        }
      }

      .ant-tabs-tab + .ant-tabs-tab {
        margin: 0 !important;
      }

      .ant-tabs-tab-btn {
        height: 40px !important;
        padding-right: 26px;
        padding-left: 26px;
        border-radius: 40px !important;
        line-height: 40px;
        text-align: center !important;
      }

      .ant-tabs-tab-active {
        .ant-tabs-tab-btn {
          background-color: #2f4554 !important;
        }
      }

      .ant-tabs-ink-bar {
        display: none !important;
      }

      .ant-popover-title {
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: none;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
      }

      .close-notify {
        margin-top: -5px;
        margin-right: -15px;
        float: right;
        color: #fff;
      }

      .ant-list-item-meta-content {
        .ant-list-item-meta-title {
          color: #fff !important;
        }

        .ant-list-item-meta-description {
          div {
            color: #fff !important;
          }
        }
      }

      .ant-list-item-action > li > div > p {
        color: #fff !important;
      }

      .ant-empty-image {
        height: 0;

        svg {
          display: none;
        }
      }

      .ant-empty-description {
        display: none;
      }

      .ant-tabs-nav-operations {
        display: none !important;
      }

      .notify-empty-img {
        display: inline-block;
        position: relative;
        width: 96px;
        height: 96px;
        margin-left: calc(50% - 48px);
      }

      .notify-empty-img-title,
      .notify-empty-img-descript {
        font-weight: 600;
      }

      .notify-empty-img-descript {
        color: #b1bad3 !important;
      }

      .ant-tabs-nav-more {
        .anticon {
          color: #fff;
        }
      }
    }

    //.ant-tabs-content {
    //  width: 300px;
    //}

    .ant-badge {
      display: flex;
      align-items: center;
      font-size: 18px;

      .anticon-bell::before {
        content: ' ';
        display: inline-block;
        position: relative;
        width: 18px;
        height: 18px;
        background-image: url('/@/assets/images/ring.webp');
        background-size: 100%;
      }

      svg {
        //width: 0.9em;
        display: none;
      }
    }

    .notify-count {
      position: absolute;
      z-index: 80;
      top: 13px;
      height: 14px;
      margin-right: 8px;
      padding: 1px 6px;
      border-radius: 20px;
      background-color: #e91134;
      font-size: 12px;
      line-height: 13px;
    }
  }
  //.ant-tabs-content {
  //  width: 300px;
  //}

  // .ant-badge {
  //   display: flex;
  //   align-items: center;
  //   font-size: 18px;

  //   .anticon-bell::before {
  //     content: ' ';
  //     display: inline-block;
  //     position: relative;
  //     width: 18px;
  //     height: 18px;
  //     background-image: url('/@/assets/images/ring.webp');
  //     background-size: 100%;
  //   }

  //   svg {
  //     //width: 0.9em;
  //     display: none;
  //   }
  // }
  .ring-img {
    margin-top: -3px;
  }

  .ant-btn-dangerous {
    &.notify-button {
      min-width: 186px;
      margin: auto;
      background-color: #e91134;
    }
  }

  .notice-box {
    height: calc(80vh - 210px) !important;
  }

  .notice-box > div {
    border: none !important;
  }
</style>
