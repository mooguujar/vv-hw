<template>
  <PageWrapper>
    <div class="pay-bottom">
      <BasicForm @register="registerForm" @submit="handleSubmit">
        <template #beforeSlots>
          <div class="t-form-label-com">
            <!--新增公告-->
            <Button
              type="primary"
              v-if="isControlValueSet() ? false : isHasAuth('70922')"
              @click="goToCreateButton"
            >
              {{ $t('table.system.system_add_announcement') }}
            </Button>
            <!--新增跑马灯-->
            <Button
              class="ml-10px"
              v-if="isControlValueSet() ? false : isHasAuth('70923')"
              type="primary"
              @click="goToCreateMarqButton"
              >{{ $t('table.system.system_add_marquee') }}</Button
            >
          </div>
        </template>
        <template #input-group>
          <FormItemRest>
            <InputGroup compact class="!flex t-form-label-com">
              <Select v-model:value="currentType" class="pay-select">
                <!--标题-->
                <SelectOption value="title">{{ $t('business.common_title') }}</SelectOption>
                <!--操作人-->
                <SelectOption value="updated_by">{{
                  $t('business.common_operate_people')
                }}</SelectOption>
              </Select>
              <Input
                allowClear
                class="pay-input"
                :placeholder="$t('common.inputText')"
                v-model:value="fromSearch"
                style="width: 168px"
              />
            </InputGroup>
          </FormItemRest>
        </template>
      </BasicForm>
      <Tabs :activeKey="activeKey" @tabClick="tabClick" class="tap capsule_tap">
        <template v-for="item in achieveList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="item.component" ref="componentRef" />
          </TabPane>
        </template>
      </Tabs>
    </div>
    <AddMarqueeModal @register="register" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, InputGroup, Input, Select, SelectOption, FormItemRest } from 'ant-design-vue';
  import { Button } from '/@/components/Button';
  import AnnouncementTable from './bulletin/AnnouncementTable.vue';
  import MarqueeTable from './marquee/MarqueeTable.vue';
  import AddMarqueeModal from './marquee/AddMarqueeModal.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { searchFormSchema } from './marquee/marqueeTableData';
  import eventBus from '/@/utils/eventBus';
  import { useRouter } from 'vue-router';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isHasAuth } from '/@/utils/authFunction';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const currentType = ref<any>('title');
  const fromSearch = ref<any>('');
  const achieveList: any[] = [
    {
      key: '1',
      name: t('table.system.system_announcement'), //弹窗公告
      component: 'AnnouncementTable',
    },
    {
      key: '2',
      name: t('table.system.system_marquee'), //跑马灯
      component: 'MarqueeTable',
    },
  ];

  export default defineComponent({
    name: 'SiteAnnouncementNocash',
    components: {
      PageWrapper,
      Button,
      Tabs,
      TabPane: Tabs.TabPane,
      Input,
      InputGroup,
      Select,
      SelectOption,
      FormItemRest,
      AnnouncementTable,
      MarqueeTable,
      BasicForm,
      AddMarqueeModal,
    },
    setup() {
      let activeKey = ref('1');
      let tableParams = ref<any>({});
      const router = useRouter();

      const [registerForm, { getFieldsValue }] = useForm({
        labelWidth: 120,
        schemas: searchFormSchema,
        showAdvancedButton: false,
        actionColOptions: {
          class: 't-form-col t-form-label-com',
          span: 1,
        },
        submitButtonOptions: {
          text: t('business.common_inquire'), //查询
        },
        showResetButton: false,
      });

      const [register, { openModal: openAdd }] = useModal();

      function tabClick(event) {
        activeKey.value = event;
        if (activeKey.value === '1') eventBus.emit('searchSubmit', tableParams.value);
        if (activeKey.value === '2') eventBus.emit('marqSearchSubmit', tableParams.value);
      }

      async function handleSubmit() {
        const search = await getFieldsValue();
        tableParams.value = {};
        if (fromSearch.value) tableParams.value[currentType.value] = fromSearch.value;
        tableParams.value['state'] = search.state;
        if (activeKey.value === '1') eventBus.emit('searchSubmit', tableParams.value);
        if (activeKey.value === '2') eventBus.emit('marqSearchSubmit', tableParams.value);
      }

      function goToCreateButton() {
        router.push({ name: 'AddAnnouncement' });
      }

      function goToCreateMarqButton() {
        openAdd(true, { type: 'editor' });
      }

      return {
        currentType,
        fromSearch,
        achieveList,
        registerForm,
        handleSubmit,
        tableParams,
        activeKey,
        tabClick,
        goToCreateButton,
        goToCreateMarqButton,
        register,
        isHasAuth,
        isControlValueSet,
      };
    },
  });
</script>
<style lang="less" scoped>
  .pay-bottom {
    padding: 0;
    border-radius: 3px;
    background-color: transparent;
  }

  ::v-deep(.ant-tabs-top > .ant-tabs-nav) {
    margin-bottom: 12px !important;
  }

  ::v-deep(.vben-basic-form .ant-form-item) {
    margin-bottom: 0 !important;
  }

  .pay-select {
    border-right: none;
  }
  // .ant-tabs-nav
</style>
