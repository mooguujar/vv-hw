<template>
  <PageWrapper :contentStyle="{ margin: 0 }" contentBackground>
    <div class="ant-modal-confirm-title">
      <a class="addmoneyText">
        {{ t('table.report.report_add_member') }}
      </a>
    </div>
    <div class="step-form">
      <FormItem
        :labelCol="{ style: { width: labelWidth + 'px' } }"
        class="item-agecy"
        :label="t('table.member.member_agency_type')"
      >
        <Select
          :options="optionsList"
          v-model:value="active"
          @change="changeFun"
          :size="FORM_SIZE"
          :placeholder="t('common.selectSuperiorAgent')"
        />
      </FormItem>
      <component ref="childComponents" :is="componentsList[tabAct]" @password="password" />
      <div class="step-buton">
        <!-- <Button type="primary" class="buton-t" :size="FORM_SIZE" @click="createClick"
          >确认新增</Button
        > -->
        <Button type="primary" :loading="loading" @click="createClick" :size="FORM_SIZE">{{
          t('table.member.member_creat_member')
        }}</Button>
      </div>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, provide } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Select, FormItem, Button } from 'ant-design-vue';
  import member from './components/Member.vue';
  import proxy from './components/Proxy.vue';
  import partner from './components/Partner.vue';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { userSave } from '/@/api/member/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { getAuthCache } from '/@/utils/auth';
  import { USER_INFO_KEY } from '/@/enums/cacheEnum';
  import { useI18n } from '/@/hooks/web/useI18n';
  import eventBus from '/@/utils/eventBus';

  const { prefix, sites } = getAuthCache(USER_INFO_KEY);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const { getFormSize } = useFormSetting();
  const FORM_SIZE = getFormSize;
  //组件注册
  let componentsList = {
    member,
    proxy,
    partner,
  };
  //无限极会员类型getSiteType
  const noMemberTypeList = [
    { value: 2, label: t('table.member.member_proxy'), type: 'proxy' },
    { value: 3, label: t('table.member.member_partner'), type: 'partner' },
  ];
  const active = ref<any>(2);
  const tabAct = ref<any>('proxy');
  const childComponents = ref<any>({});
  const passwordValue = ref('' as String);

  const loading = ref(false as any);
  const userStore = useUserStore();
  const getSiteType = ref('' as any);
  const info = userStore.getUserInfo;
  function changeFun(key, option) {
    tabAct.value = option.type;
  }
  const optionsList = computed(() => {
    return noMemberTypeList;
  });
  async function createClick() {
    const values = await childComponents.value?.value();
    values['member_type'] = active.value;
    values['password'] = passwordValue.value;
    try {
      const { status, data } = await userSave(values);
      if (status) {
        createMessage.success(data);
        childComponents.value?.resetFields();
        eventBus.emit('cancelModal');
        //$router.push({ name: 'InquiryMember' });
      } else {
        createMessage.error(data);
      }
    } catch (errow) {
      console.error(errow);
    }
  }
  function password(e) {
    passwordValue.value = e;
  }

  //处理站点的类型函数
  function siteType() {
    const filter = sites.filter((t: any) => {
      return t.c === prefix;
    });
    getSiteType.value = filter[0].a;
    if (getSiteType.value === '1') {
      //active.value = 2;
      tabAct.value = 'proxy';
    }
  }
  onMounted(() => {
    //默认第一个
    //siteType();
  });
  /** labelWidth auto resize. begin */
  const labelWidth = ref(0);
  provide('setLabelWidth', (width: number) => (labelWidth.value = width));
  /** labelWidth auto resize. end */
</script>

<style lang="less">
  .addMoney .ant-row {
    max-height: 530px;
  }

  .addCreat .ant-modal-confirm .ant-modal-body {
    padding: 0 !important;
  }

  .addCreat .ant-modal-confirm-body .ant-modal-confirm-content {
    margin: 0 !important;
  }

  .addCreat .ant-modal-confirm {
    width: 560px !important;
    margin-top: 90px !important;
  }

  .addCreat .ant-modal-confirm-title {
    margin-bottom: 30px;
    padding: 17.5px 17.5px 17.5px 20px;
    border-bottom: 1px solid #f0f0f0;
    border-radius: 4px 4px 0 0;
    //background-color: @header-bg !important;
    background-color: #1475e1 !important;
    color: rgb(0 0 0 / 85%);
    font-size: 18px;
    line-height: 24px;

    img {
      padding-bottom: 1px;
    }

    .addmoneyText {
      height: 25px !important;
      padding-right: 16px;
      //color: #000;
      color: #fff !important;
      font-weight: 600 !important;
      line-height: 25px !important;
    }

    .primary-color {
      color: @primary-color;
    }
  }

  .ant-modal-close {
    color: #eef1f7 !important;
  }

  .addCreat {
    .ant-modal-confirm-btns {
      display: none;
    }
  }
</style>
<style lang="less" scoped>
  .step-form {
    width: 490px;
    margin: auto;

    //margin-left: 60px;
    //margin: 0 auto;
    .item-agecy ::v-deep(.ant-form-item-label > label) {
      height: 100%;
    }
  }

  ::v-deep(.ant-form-item-label > label) {
    height: 100%;
    color: #444 !important;
    font-weight: 500 !important;
  }

  ::v-deep(.ant-input-affix-wrapper) {
    //border: 1px solid #B1BAD3;
  }

  ::v-deep(.ant-input-affix-wrapper > input::placeholder) {
    color: #ccc;
  }

  ::v-deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    //border: 1px solid #B1BAD3;
  }

  ::v-deep(.ant-select > .ant-select-selector) {
    //border: 1px solid #B1BAD3!important;
    box-shadow: none !important;
  }

  //a:link,a:hover,a:visited,a:active,a:focus
  ::v-deep(.ant-input-affix-wrapper):link,
  ::v-deep(.ant-input-affix-wrapper):hover,
  ::v-deep(.ant-input-affix-wrapper):visited,
  ::v-deep(.ant-input-affix-wrapper):active,
  ::v-deep(.ant-input-affix-wrapper):focus {
    // border: 1px solid #B1BAD3;
    box-shadow: none !important;
  }

  ::v-deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector):link,
  ::v-deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector):hover,
  ::v-deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector):visited,
  ::v-deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector):active,
  ::v-deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector):focus {
    // border: 1px solid #B1BAD3;
    box-shadow: none !important;
  }

  ::v-deep(.ant-input-affix-wrapper-focused) {
    // border: 1px solid #B1BAD3;
    box-shadow: none !important;
  }

  ::v-deep(.ant-select-selection-item) {
    //color: #B1BAD3;
  }

  ::v-deep(.ant-select-arrow) {
    //color: #B1BAD3;
  }

  ::v-deep(.ant-input-affix-wrapper-disabled) {
    //background: #F6F7FB;
  }

  ::v-deep(.ant-input-affix-wrapper-disabled > input) {
    color: #444;
  }

  ::v-deep(.anticon-copy) {
    // background-color: #B1BAD3;
    position: absolute;
    right: 0;
    width: 38px;
    height: 100%;
    line-height: 38px;
  }

  ::v-deep(.anticon-copy > svg) {
    display: none;
  }

  ::v-deep(.anticon-copy::after) {
    content: ' ';
    display: block;
    width: 20px;
    height: 20px;
    margin: auto;
    margin-top: 10px;
    background-image: url('@/assets/images/copy.webp');
    background-repeat: no-repeat;
    background-size: 100%;
  }

  ::v-deep(.ant-select-open > .ant-select-selector) {
    //border: 1px solid #B1BAD3!important;
    box-shadow: none !important;
  }

  //::v-deep(.ant-select-dropdown) {
  //  border: 1px solid red!important;
  //}
  ::v-deep(.ant-select-clear svg) {
    // color: #B1BAD3 !important;
  }

  .step-buton {
    width: 490px;
    // border-top: 1px solid #B1BAD3;
    margin-top: 6px;
    //padding-top: 30px;
    padding-top: 10px;
    // padding-bottom: 15px;
    padding-bottom: 10px;
    text-align: right;
  }
</style>
