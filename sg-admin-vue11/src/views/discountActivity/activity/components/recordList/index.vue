<template>
  <div>
    <BasicModal
      :showCancelBtn="false"
      :showOkBtn="false"
      :width="1260"
      @register="recordModal"
      :title="`${$t('table.member.member_receive_record')} (${setTitle})`"
    >
      <BasicTable @register="registerTbale">
        <template #form-currentType>
          <a-input-group compact style="display: flex; width: 380px" class="t-form-label-com">
            <Select style="width: 50%" v-model:value="currentType">
              <SelectOption value="username">
                {{ $t('business.common_member_account') }}
              </SelectOption>
              <SelectOption value="parent_name">
                {{ $t('business.common_super_agent') }}
              </SelectOption>
            </Select>
            <Input
              style="width: 50%; margin-right: 10px"
              allowClear
              :placeholder="$t('common.inputText')"
              v-model:value="fromSearch"
            />
          </a-input-group>
        </template>
      </BasicTable>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBonusRecordList } from '/@/api/activity';
  import { columns, schemas } from './index.data';
  import { Select, Input, SelectOption } from 'ant-design-vue';
  import { useMemberStore } from '/@/store/modules/member';
  import { setDateParmas, setEndformatDate, setStartformatDate } from '/@/utils/dateUtil';

  const setTitle = ref('' as any);
  const result = ref('' as any);
  const [recordModal] = useModalInner((data) => {
    setTitle.value = data.zh_name;
    result.value = data;
    methods.reload();
  });
  const currentType = ref('username' as any);
  const fromSearch = ref('' as any);
  const memberStore = useMemberStore();
  // 获取层级下拉
  memberStore.getLevelList();
  const [registerTbale, methods] = useTable({
    api: getBonusRecordList,
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
    beforeFetch: async (param) => {
      setDateParmas(param);
      if (param?.time?.length > 0) {
        param.start_time = param.time[0] ? setStartformatDate(param.time[0]) : null;
        param.end_time = param.time[1] ? setEndformatDate(param.time[1]) : null;
      }
      delete param.time;

      if (currentType.value) {
        param[currentType.value] = fromSearch.value;
      }
      param['pid'] = result.value['id'];
      return param;
    },
  });
</script>
