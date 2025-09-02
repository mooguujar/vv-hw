<template>
  <a-list :class="prefixCls" bordered style="min-height: 26rem">
    <template v-for="item in getData" :key="item.id">
      <a-list-item class="list-item cursor-pointer mb-12px" @click="actionFun(item)">
        <!-- 去处理 -->
        <template #actions>
          <div v-if="item.type != 'announcement'" class="flex flex-col handel-box">
            <div class="to-handel-icon"></div>
            <a-button type="primary" ghost size="small" class="!text-12px">
              {{ t('business.common_deal_with') }}
            </a-button>
          </div>
        </template>
        <a-list-item-meta>
          <!-- 标题 -->
          <template #title>
            <div class="title flex justify-between">
              <div class="break-all truncate" v-if="item.type == 'announcement'">{{ announcementDescriptionTitle(item) }} </div>
              <div class="break-all truncate" v-else>{{ item.title }} </div>
              <div class="notify-time-stamp">
                <span v-if="item.is_read == 2 ||item.read ==true" class="notify-time-read"></span>
                <span v-else class="notify-time-read-light"></span>
                <span v-if="item.type != 'announcement'">
                  {{
                    item.type != 'announcement'
                      ? formatTime(item.timestamp)
                      : formatTime(item.created_at)
                  }}
                </span>
                <span v-else>
                  {{formatTime(item.start_time)
                  }}
                </span>
              </div>
            </div>
          </template>

          <!-- 图标 -->
          <template #avatar>
            <div class="avatar" v-if="item.type !== 'announcement'">
              <cdNoticeListIcon :icon="item.target" :isRead="item.is_read == 2" />
            </div>
            <div class="avatar" v-if="item.type == 'announcement'">
              <cdNoticeListIcon :icon="item.type" :isRead="item.read == true" />
            </div>
          </template>

          <!-- 描述 -->
          <template #description>
            <div
              class="description truncate overflow-hidden announcement-description"
              v-if="item.type === 'announcement'"
            >
              <div v-html="announcementDescriptionContent(item)"></div>
            </div>
            <p
              v-if="
                item.target === 'CompanyDeposit' ||
                item.target === 'CurrencyDeposit' ||
                item.target === 'OnlineWithdrawal' ||
                item.target === 'CurrencyWithdrawal'
              "
            >
              <span class="description-title">{{ descriptionContent(item).title }}:</span>
              <span class="description-doller">{{ descriptionContent(item).dollers }}</span>
              <cdNoticeCurrency
                :icon="descriptionContent(item).currencyName"
                class="w-14px description-currency"
              />
            </p>
            <p v-else-if="item.target == 'Activity'" class="leading-13px;">
              <p class="description-title">{{ item.title?.match(/\(([^)]+)\)/)?.length?item.title?.match(/\(([^)]+)\)/)[1]:'' }}</p>
              <span class="description-title">{{ descriptionContent(item).title }}:</span>
              <span class="description-doller">{{ descriptionContent(item).dollers }}</span>
              <cdNoticeCurrency
                :icon="descriptionContent(item).currencyName"
                class="w-14px description-currency"
              />
            </p>
            <!-- 赢取 -->
            <p v-else-if="item.target == 'WinTop'">
              <span class="description-title">{{
                winTapDescriptionContent(item).beforeTitle
              }}</span>
              <span class="description-doller">{{ winTapDescriptionContent(item).percent }}</span>
            </p>
            <p v-else-if="item.target === 'LowMultiple' ">
              <span class="description-title">{{ LowMultipleDescriptionContent(item).title }}</span>
              <span class="description-doller">{{
                LowMultipleDescriptionContent(item).percent
              }}</span>
              <span class="description-title ml-5px">倍</span>
            </p>
            <p v-else-if="item.target === 'HighMultiple'">
              <span class="description-title">{{ LowMultipleDescriptionContent(item).title }}</span>
              <span class="description-doller">{{
                LowMultipleDescriptionContent(item).percent
              }}</span>
            </p>
            <p v-else-if="item.target === 'LinkRecords'">
              <span class="description-title">{{ LinkRecordsDescriptionContent(item).title }}</span>
              <span class="description-doller">{{
                LinkRecordsDescriptionContent(item).about
              }}</span>
            </p>
            <!-- 其他 -->
            <p v-else>
              {{ item.target }}
            </p>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType, ref, watch, unref } from 'vue';
  import { ListItem } from './data';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { List, Avatar, Tag, Typography } from 'ant-design-vue';
  import { formatTime } from '/@/utils/dateUtil';
  import { useRouter } from 'vue-router';
  import reply from '/@/assets/images/reply.webp';
  import replym from '/@/assets/images/replym.webp';
  import { readNotifications, readMerchantNotice } from '/@/api/sys/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  import cdNoticeListIcon from '/@/components-cd/Icon/noticeListIcon/cd-notice-listIcon.vue';
  import { useTreeListStore } from '@/store/modules/treeList';
  import cdNoticeCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { useLocale } from '/@/locales/useLocale';

  export default defineComponent({
    components: {
      Avatar: Avatar,
      List: List,
      [List.Item]: List.Item,
      AListItemMeta: List.Item.Meta,
      ATypographyParagraph: Typography.Paragraph,
      Tag: Tag,
      cdNoticeListIcon,
      cdNoticeCurrency,
    },
    props: {
      list: {
        type: Array as PropType<ListItem[] | any>,
        default: () => [],
      },
      pageSize: {
        type: [Boolean, Number] as PropType<Boolean | Number>,
        default: 5,
      },
      currentPage: {
        type: Number,
        default: 1,
      },
      titleRows: {
        type: Number,
        default: 1,
      },
      descRows: {
        type: Number,
        default: 2,
      },
      onTitleClick: {
        type: Function as PropType<(Recordable) => void>,
      },
    },
    emits: ['update:currentPage'],
    setup(props, { emit }) {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-notify-list');
      const current = ref(props.currentPage || 1);
      const router = useRouter();
      const getData = computed(() => {
        const { pageSize, list } = props;
        // if (pageSize === false) return [];
        // let size = isNumber(pageSize) ? pageSize : 5;
        // return list.slice(size * (unref(current) - 1), size * unref(current));
        return list;
      });

      watch(
        () => props.currentPage,
        (v) => {
          current.value = v;
        },
      );
      const isTitleClickable = computed(() => !!props.onTitleClick);
      const getPagination = computed(() => {
        const { list, pageSize } = props;
        if (+pageSize > 0 && list && +list.length > +pageSize) {
          return {
            total: list.length,
            pageSize,
            //size: 'small',
            current: unref(current),
            onChange(page) {
              current.value = page;
              emit('update:currentPage', page);
            },
          };
        } else {
          return false;
        }
      });

      function handleTitleClick(item: ListItem) {
        props.onTitleClick && props.onTitleClick(item);
      }

      async function actionFun(source: any) {
        const { target, target_id, id, type, timestamp, title } = source;
        const readApi = type == 'announcement' ? readMerchantNotice : readNotifications;
        const param =
          type == 'announcement'
            ? { id: id }
            : {
                notification_type: type == 'promo_bonus' ? 'promo' : type,
                notification_id: id,
              };
        const { status } = await readApi(param);

        if (status) {
          props.onTitleClick && props.onTitleClick(source);
        }

        // title?.match(/\(([^)]+)\)/)?.length?item.title?.match(/\(([^)]+)\)/)[1]:''

        if (type != 'announcement') {
          const query = {
            ...(type == 'finance'
              ? { order: target_id }
              : target == 'LinkRecords'
              ? { rowContent: target_id, time: timestamp }
              : type == 'promo_bonus'
              ? {
                  tabValue: 3,
                  title: title?.match(/\(([^)]+)\)/)?.length ? title?.match(/\(([^)]+)\)/)[1] : '',
                }
              : { userAccount: target_id, time: timestamp }),
          };

          router.push({
            name: target,
            query: query,
          });
        }
      }
      const { currencyAllTreeList } = useTreeListStore();

      function descriptionContent(item) {
        let text = item.content.substring(1, item.content.length - 1);
        let title = text.split(':')[0];
        let descript = text.split(':')[1];
        let currency = [...currencyAllTreeList].filter((c) => text.includes(c.name))[0];
        let dollers = descript.split(currency?.name ?? '')[0];
        let currencyName = currency?.name ?? '';
        let _data = { title, dollers, currencyName };
        return _data;
      }
      function winTapDescriptionContent(item) {
        let text = item.content.substring(1, item.content.length - 1);
        let title = text.split(':')[0];
        let descript = text.split(':')[1];
        let percent = descript.split('\[\[')[1].substring(0, descript.split('\[\[')[1].length - 2);
        let beforeTitle = title + ':' + descript.split('\[\[')[0];
        let _data = { beforeTitle, percent };
        return _data;
      }
      function LowMultipleDescriptionContent(item) {
        let text = item.content.substring(1, item.content.length - 1);
        let title = text.split('\[\[')[0];
        let percent = text.split('\[\[')[1].substring(0, text.split('\[\[')[1].length - 2);
        let _data = { title, percent };
        return _data;
      }
      const lang = useLocale().getLocale.value;
      function announcementDescriptionContent(item) {
        let _data = item.content
        try{
          _data = item.content&&JSON.parse(item.content)[lang];
        }catch(e){
        }
        return _data;
      }

      function announcementDescriptionTitle(item) {
        let _data = item.title;
        try{
          _data = item.title&&JSON.parse(item.title);
          _data= _data[lang]??''
        }catch(e){
          // _data = item;
        }
        return _data;
      }
      function LinkRecordsDescriptionContent(item) {
        let text = item.content.substring(1, item.content.length - 1);
        let title = text.split('\[\[')[0];
        let about = text.split('\[\[')[1];
        let _data = { title, about };
        return _data;
      }

      return {
        prefixCls,
        getPagination,
        getData,
        handleTitleClick,
        isTitleClickable,
        formatTime,
        actionFun,
        reply,
        replym,
        t,
        descriptionContent,
        winTapDescriptionContent,
        LowMultipleDescriptionContent,
        announcementDescriptionContent,
        LinkRecordsDescriptionContent,
        announcementDescriptionTitle
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-notify-list';

  .@{prefix-cls} {
    :deep(.description) {
      span {
        overflow: scroll;
      }
    }

    &::-webkit-scrollbar {
      display: none;
    }

    :deep(.ant-pagination-disabled) {
      display: inline-block !important;
    }

    &-item {
      padding: 6px;
      overflow: hidden;
      transition: all 0.3s;
      cursor: pointer;

      .title {
        margin-bottom: 8px;
        font-weight: normal;

        .extra {
          margin-top: -1.5px;
          margin-right: 0;
          float: right;
          font-weight: normal;

          .tag {
            margin-right: 0;
          }
        }

        .avatar {
          position: relative;
          //margin-top: 4px;
          margin-left: calc(50% - 10px);
          //border: 1px solid red!important;
        }

        .description {
          font-size: 12px;
          line-height: 18px;
        }

        .datetime {
          display: flex;
          flex-direction: column;
        }
      }
    }

    .list-item {
      padding: 0;
      box-shadow: 0 1px 2px -1px rgb(0 0 0 / 25%), 0 2px 3px -1px rgb(0 0 0 / 30%);
    }

    :deep(.ant-list-item-action) {
      margin-left: 0;
    }

    :deep(.ant-list-item-action > li) {
      height: 70px;
      padding-right: 0;
      background-color: #1475e1;

      button {
        margin: auto;
        border: none;
        box-shadow: none;
        color: #fff !important;
      }
    }

    :deep(.ant-list-item-action > li > div) {
      padding: 15px 0 !important;
    }

    :deep(.ant-list-item-meta-avatar) {
      display: flex;
      align-items: center;
      height: 70px;
      margin-right: 0;
      background-color: #213743;
      text-align: center;

      span {
        margin: auto;
      }

      div {
        margin: auto;
      }
    }

    :deep(.ant-list-item-action > li),
    :deep(.ant-list-item-meta-avatar) {
      width: 70px;
    }

    :deep(.ant-list-item-meta) {
      width: 100%;
      background-color: #2f4553;
    }

    :deep(.ant-list-item),
    :deep(.ant-list-bordered) {
      border: none !important;
    }

    .handel-box {
      height: 100%;
    }

    .to-handel-icon {
      width: 20px;
      height: 20px;
      margin: auto;
      background-image: url('/@/assets/images/to-handel.webp');
      background-size: 100%;
    }

    :deep(.ant-list-item) {
      overflow: hidden !important;
      border-radius: 4px !important;
    }

    :deep(.ant-list-item-meta-content) {
      padding: 8px !important;
    }

    .break-all {
      max-width: 100px;
      color: #fff !important;
      font-size: 14px !important;
      font-weight: 500 !important;
    }

    .notify-time-stamp {
      color: #b1bbd3 !important;
      font-size: 11px !important;
      font-weight: 400 !important;
    }

    .notify-time-read,
    .notify-time-read-light {
      display: block;
      position: relative;
      width: 6px;
      height: 6px;
      margin-top: 6px !important;
      margin-right: 5px;
      float: left;
      border-radius: 10px;
      background-color: #b1bad3;
    }

    .notify-time-read-light {
      background-color: #1fff20 !important;
    }

    .description-title {
      margin-right: 5px;
      color: #b1bad3;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .description-doller {
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }

    .description-currency {
      margin-top: -5px;
      margin-left: 5px;
    }

    :deep(.ant-list-item-meta-description > div) {
      &.announcement-description {
        p {
          display: -webkit-box !important;
          height: 22px !important;
          margin-bottom: 0 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: normal !important;
          -webkit-line-clamp: 1 !important;
          -webkit-box-orient: vertical !important;
          work-break: break-all !important;
        }
      }
    }

    :deep(.ant-list-item-meta-title) {
      margin-bottom:2px;
    }
    :deep(.ant-list-item-meta-description) {
      color: #fff;
      height:14px;
      > p {
        width: 100%;
      }

      line-height:14px;
      p {
        display: inline-block;
        vertical-align: bottom;
        margin-bottom: 0 !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: normal !important;
        -webkit-line-clamp: 1 !important;
        -webkit-box-orient: vertical !important;
      }
    }
  }
</style>
