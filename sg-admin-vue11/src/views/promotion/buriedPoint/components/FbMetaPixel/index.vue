<template>
  <div>
    <BasicTable @register="registerTable" :scroll="{ x: 'max-content' }" class="!p-0 mb-14px">
      <template #action="{ record, column }">
        <TableAction :actions="createActions(record, column)" />
      </template>
      <template #form-currentType>
        <a-input-group compact style="display: flex" class="t-form-label-com">
          <Select v-model:value="currentType" class="select-left">
            <SelectOption :value="'url'">{{
              $t('table.promotion.promotion_bind_link')
            }}</SelectOption>
            <SelectOption :value="'track_id'">Pixel ID</SelectOption>
          </Select>
          <Input
            style="margin-right: 10px"
            allowClear
            :placeholder="$t('common.inputText')"
            v-model:value="fromSearch"
            class="select-right-input"
          />
        </a-input-group>
      </template>
      <template #form-startDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledStartDate"
          @change="onStartDateChange"
        />
      </template>
      <template #form-endDate="{ model, field }">
        <DatePicker
          v-model:value="model[field]"
          :disabledDate="disabledEndDate"
          @change="onEndDateChange"
        />
      </template>
      <template #customTableHeader v-if="isHasAuth('30102')">
        <div class="gtag_gtm mb-12px">
          <div class="gtag_gtm_box">
            <div>
              <p class="gtag_gtm_box_title">
                <span>{{ $t('table.promotion.promotion_customer_room') }}</span
                ><span class="!ml-3 primary-color cursor" @click="creatChannel">{{
                  $t('table.promotion.promotion_build_tunnel')
                }}</span>
              </p>
              <Input
                style="width: 100%"
                allowClear
                :placeholder="
                  $t('table.promotion.promotion_customer_room_place') +
                  'https://222.baidu.com/home?cid=111s'
                "
                v-model:value="url"
              >
                <template #addonBefore>
                  <Select v-model:value="domain" style="width: 110px">
                    <SelectOption value="http://">http://</SelectOption>
                    <SelectOption value="https://">https://</SelectOption>
                  </Select>
                </template>
              </Input>
            </div>
            <div>
              <p
                class="gtag_gtm_box_title"
                :title="
                  'Facebook/Meta Pixel ID(' +
                  $t('table.promotion.promotion_from_fb') +
                  '，' +
                  $t('table.promotion.promotion_detail_lessons') +
                  ')'
                "
              >
                <span
                  >Facebook/Meta Pixel ID({{ $t('table.promotion.promotion_from_fb') }}，{{
                    $t('table.promotion.promotion_detail_lessons')
                  }})</span
                >
              </p>
              <Input
                style="width: 100%"
                allowClear
                :placeholder="
                  $t('table.promotion.promotion_please_enter') +
                  'Facebook/Meta Pixel ID ，' +
                  $t('table.promotion.promotion_example') +
                  '：66666666666'
                "
                v-model:value="track_id"
              />
            </div>

            <div>
              <p class="gtag_gtm_box_title" title="Facebook/Meta access token">
                <span>Facebook/Meta access token </span>
              </p>
              <Input
                style="width: 100%"
                allowClear
                :placeholder="
                  $t('table.promotion.promotion_please_enter') +
                  'Facebook/Meta access token ，' +
                  $t('table.promotion.promotion_example') +
                  '：66666666666'
                "
                v-model:value="access_token"
              />
            </div>

            <div class="mt-22px">
              <Button type="primary" class="!h-40px" @click="createBuriedPoint">{{
                $t('common.bind')
              }}</Button>
            </div>
          </div>
        </div>
      </template>
    </BasicTable>
    <Specification />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    BasicTable,
    useTable,
    TableAction,
    EditRecordRow,
    BasicColumn,
    ActionItem,
  } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { Button } from '/@/components/Button';
  import { Select, SelectOption, Input, DatePicker, message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import Specification from './specification.vue';
  import { setDateParmas } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    getBuriedPointList,
    insertBuriedPoint,
    updateBuriedPoint,
    deleteBuriedPoint,
  } from '@/api/promotion';
  import { isHasAuth } from '/@/utils/authFunction';
  import { openConfirm } from '/@/utils/confirm';
  import { isProtocol } from '/@/utils/is';
  import { useLocaleStoreWithOut } from '@/store/modules/locale';

  interface FormModel {
    start_time: Date | null;
    end_time: Date | null;
  }
  const currentLanguage = useLocaleStoreWithOut();
  const locale = currentLanguage.getLocale;
  const labelWidth = (() => {
    switch (locale) {
      case 'zh_CN':
        return '-30px';
      case 'en_US':
        return '-310px'; // 修改为返回 'auto' 而不是 120
      case 'vi_VN':
        return '-150px'; // 修改为返回 'auto' 而不是 120
      case 'pt_BR':
        return '-180px'; // 修改为返回 'auto' 而不是 120
      default:
        return '-160px';
    }
  })();
  const model = ref<FormModel>({
    start_time: dayjs().subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss'),
    end_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  });
  const $router = useRouter();
  const { t } = useI18n();
  const url = ref('' as string);
  const domain = ref('https://' as string);
  const track_id = ref('' as string);
  const fromSearch = ref('' as string);
  const currentType = ref('url' as string);
  const access_token = ref('' as string);
  const disabledStartDate = (date) => {
    let end_time: any = null;
    if (dayjs(model.value.end_time).valueOf()) {
      end_time = model.value.end_time.valueOf();
    } else {
      end_time = dayjs().endOf('days').valueOf();
    }
    return date.valueOf() > end_time;
  };

  const disabledEndDate = (date) => {
    return (
      date.valueOf() > dayjs().endOf('days').valueOf() ||
      date.valueOf() <= dayjs(model.value.start_time).valueOf()
    );
  };
  const onStartDateChange = (value) => {
    model.value.start_time = value;
  };

  const onEndDateChange = (value) => {
    model.value.end_time = dayjs(value).endOf('days');
  };
  const [registerTable, { getDataSource, reload, clearSelectedRowKeys }] = useTable({
    api: async (params) => {
      let paramsData = {
        page: params.page,
        page_size: params.page_size,
        track_name: 'facebook',
        start_time: params.start_time,
        end_time: params.end_time,
        url: currentType.value == 'url' ? fromSearch.value : '',
        track_id: currentType.value == 'track_id' ? fromSearch.value : '',
      };
      const { data } = await getBuriedPointList(paramsData);
      return data;
    },
    columns,
    useSearchForm: true,
    bordered: true,
    striped: true,
    canResize: false,
    showIndexColumn: false,
    formConfig: {
      schemas: schemas,
      actionColOptions: {
        class: 't-form-col t-form-label-com',
        span: 1,
      },
      showAdvancedButton: false,
      showResetButton: false,
    },
    beforeFetch: (params) => {
      setDateParmas(params);
      params[currentType.value] = fromSearch.value;
      return params;
    },
    afterFetch: (data) => {
      clearSelectedRowKeys();
      data.map((o) => (o.url = normalizeFbPixelId(o.url, o.track_id)));
      return data;
    },
  });
  function normalizeFbPixelId(url, track_id) {
    // 1. 解析 URL
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);

    // 2. 获取所有 fbPixelId 的值（可能多个或没有）
    const fbPixelIds = params.getAll('fbPixelId');

    // 3. 删除所有现有的 fbPixelId
    params.delete('fbPixelId');

    // 4. 重新添加一个 fbPixelId（优先用第一个存在的，否则用默认值）
    const finalFbPixelId = track_id || fbPixelIds[0] || '000'; // 默认值可选
    params.set('fbPixelId', finalFbPixelId);

    // 5. 更新 URL 的查询参数
    urlObj.search = params.toString();

    // 6. 返回标准化后的 URL
    return urlObj.toString();
  }
  function handleEdit(record: EditRecordRow) {
    record.onEdit?.(true);
  }
  async function handleDelete(record: EditRecordRow) {
    openConfirm(
      t('table.member.member_oprate_tip'),
      t('table.promotion.deleteBuriedPoint'),
      async () => {
        try {
          const response = await deleteBuriedPoint({
            id: record.id,
          });

          if (response.status) {
            record.onEdit?.(false, true);
            reload();
          } else {
            message.error(response.data);
          }
        } catch (e) {
          console.error(e);
        }
      },
    );
  }
  async function handlePopConfirm(record: EditRecordRow) {
    openConfirm(t('table.member.member_oprate_tip'), t('common.is_remove_edit'), async () => {
      try {
        handleCancel(record);
      } catch (e) {
        console.error(e);
      }
    });
  }
  async function handleSave(record: EditRecordRow) {
    for (let key in record.editValueRefs) {
      record[key] = record.editValueRefs[key];
    }
    const response = await updateBuriedPoint({
      id: record.id,
      url: record.url,
      track_id: record.track_id,
      access_token: record.access_token,
    });
    if (response.status) {
      record.onEdit?.(false, true);
    } else {
      message.error(response.data);
    }
    reload();
  }
  function handleCancel(record: EditRecordRow) {
    record.onEdit?.(false);
    if (record.isNew) {
      const data = getDataSource();
      const index = data.findIndex((item) => item.key === record.key);
      data.splice(index, 1);
    }
  }
  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    if (!record.editable) {
      return [
        {
          label: t('common.editorText'), //编辑
          onClick: handleEdit.bind(null, record),
          ifShow: isHasAuth('30103'),
        },
        {
          label: t('common.delText'), //删除
          color: 'error',
          onClick: handleDelete.bind(null, record),
          ifShow: isHasAuth('30104'),
        },
      ];
    } else {
      return [
        {
          label: t('common.saveText'), //保存
          onClick: handleSave.bind(null, record, column),
          ifShow: isHasAuth('30103'),
        },
        {
          label: t('common.cancelText'), //取消
          color: 'error',
          ifShow: isHasAuth('30104'),
          onClick: handlePopConfirm.bind(null, record),
        },
      ];
    }
  }
  function creatChannel() {
    $router.push({
      name: 'ChannelManagement',
    });
  }
  async function createBuriedPoint() {
    if (!url.value) {
      message.error(t('table.promotion.promotion_customer_room_p'));
      return false;
    }
    if (!track_id.value) {
      message.error(t('table.promotion.promotion_customer_room_facebook_id'));
      return false;
    }
    const { status, data } = await insertBuriedPoint({
      url: isProtocol(url.value) ? url.value : domain.value + url.value,
      track_id: track_id.value,
      track_name: 'facebook',
      access_token: access_token.value,
    });
    if (status) {
      url.value = '';
      track_id.value = '';
      access_token.value = '';
      reload();
    } else message.error(data);
    reload();
  }
</script>
<style scoped>
  .gtag_gtm_box {
    display: flex;

    .gtag_gtm_box_title {
      margin-bottom: 0;
      margin-bottom: 8px;
      overflow: hidden;
      color: #444;
      font-family: 'PingFang SC';
      font-size: 14px;
      font-weight: 500;
      line-height: 14px;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::v-deep(.ant-input-affix-wrapper) {
      height: 40px !important;
    }
  }

  .gtag_gtm_box div {
    ::v-deep(.ant-btn) {
      margin-top: 22px;
    }
  }

  .gtag_gtm_box div:not(:last-child) {
    min-width: 300px;
    padding-right: 10px;
  }

  ::v-deep(.ant-form) {
    padding-left: 4px !important;
  }

  .button-group-btn {
    margin-left: 18px;
    border-radius: 4px !important;
    box-shadow: none !important;
  }

  .button-group-btn::before {
    position: absolute;
    top: 1px;
    left: -1px;
    height: calc(100% - 5px);
  }

  .button-group-btn:first-child {
    margin-left: 0;
  }

  .select-right-input {
    margin-left: -1px;
  }

  ::v-deep(.ant-select-focused) {
    border-right: none !important;
  }
</style>
