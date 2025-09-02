<template>
  <div>
    <BasicModal
      :showCancelBtn="false"
      :showOkBtn="false"
      :width="1000"
      :height="600"
      @register="recordModal"
      :destroyOnClose="true"
      @cancel="handleCloseModal"
      :title="`${t('table.member.member_receive_record')} (${setTitle})`"
    >
      <BasicTable @register="restartable">
        <template #form-currentType>
          <FormItemRest>
            <InputGroup class="!flex" compact>
              <Select :style="{ width: getSelectWidth() }" v-model:value="currentType">
                <SelectOption value="username">
                  {{ t('business.common_member_account') }}
                </SelectOption>
              </Select>
              <Input
                :style="{ width: getInputWidth() }"
                allowClear
                :placeholder="t('common.inputText')"
                v-model:value="fromSearch"
              />
            </InputGroup>
          </FormItemRest>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, schemas } from './index.data';
  import { FormItemRest, InputGroup, Select, Input, SelectOption } from 'ant-design-vue';
  import { useMemberStore } from '/@/store/modules/member';
  import { setDateParmas, setDateParmaTime } from '/@/utils/dateUtil';
  import { getReceiveList } from '/@/api/mission';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';

  const currentLanguage = useLocaleStoreWithOut();

  const { t } = useI18n();
  const setTitle = ref('' as any);
  const result = ref('' as any);
  const currentType = ref('username' as any);
  const fromSearch = ref('' as any);
  const memberStore = useMemberStore();
  // 获取层级下拉
  memberStore.getLevelList();
  /** 打开弹出框 */
  const [recordModal] = useModalInner((data) => {
    setTitle.value = JSON.parse(data.names)['zh_CN'];
    result.value = data;
    methods.reload();
  });
  const [restartable, methods] = useTable({
    api: getReceiveList,
    columns,
    showIndexColumn: false,
    bordered: true,
    useSearchForm: true,
    formConfig: {
      schemas,
      showAdvancedButton: false,
      actionColOptions: {
        class: 't-form-label-com',
        span: 1,
      },
      showResetButton: false,
    },
    beforeFetch: (param) => {
      setDateParmaTime(param);
      setDateParmas(param);
      if (currentType.value) {
        param[currentType.value] = fromSearch.value;
      }
      param['id'] = result.value['id'];
      return param;
    },
  });
  function handleCloseModal() {
    fromSearch.value = '';
  }

  const getSelectWidth = () => {
    const currentLang = currentLanguage.getLocale || 'zh_CN';
    const widthMap = {
      zh_CN: '40%', // 中文
      en_US: '47%', // 英文
      vi_VN: '40%', // 越南语
      pt_BR: '50%', // 巴西葡萄牙语
    };
    return widthMap[currentLang] || '40%'; // 默认值
  };

  const getInputWidth = () => {
    const currentLang = currentLanguage.getLocale || 'zh_CN';
    const widthMap = {
      zh_CN: '59%', // 中文
      en_US: '52%', // 英文
      vi_VN: '59%', // 越南语
      pt_BR: '49%', // 巴西葡萄牙语
    };
    return widthMap[currentLang] || '59%'; // 默认值
  };
</script>
