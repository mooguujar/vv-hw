<template>
  <div style="display: flex; justify-content: space-between"></div>
  <div style="width: calc(100% - 650px)">
    <div @mouseenter="listenFooterBg('quicklink')" @mouseleave="removeListenFooterBg">
      <Divider orientation="left">{{ t('modalForm.system.quickly_jump') }}</Divider>
      <BasicForm @register="quickForm">
        <template #CheckRule="{ model, field }">
          <div class="footer-setting-box" v-for="item in quickJumpTable" v-key="item.col">
            <template v-for="(checkbox, idx) in item.checkboxs" v-key="idx">
              <Checkbox v-model:checked="checkbox.checked">{{ checkbox.name }}</Checkbox>
              <Button
                v-if="checkbox.hasLanguageLink"
                size="small"
                type="text"
                class="button-icon"
                @click="editModalOpen(checkbox.name)"
              >
                <Icon icon="ant-design:form-outlined"
              /></Button>
            </template>
          </div>
        </template>
      </BasicForm>
    </div>
    <div @mouseenter="listenFooterBg('cooperate')" @mouseleave="removeListenFooterBg">
      <Divider orientation="left">{{ t('common.Partner') }}</Divider>
      <BasicForm @register="partnerForm" />
    </div>
    <div @mouseenter="listenFooterBg('support')" @mouseleave="removeListenFooterBg">
      <Divider orientation="left">{{ t('common.SponsorInfo') }}</Divider>
      <BasicForm @register="sponsorForm">
        <template #add="{ model, field }">
          <div class="mr-8">
            <Button size="small" type="text" @click="add" v-if="field == 0" class="button-icon"
              ><Icon icon="ant-design:plus-outlined"
            /></Button>
            <Button
              size="small"
              type="text"
              @click="() => del(field)"
              v-if="field > 0"
              class="button-icon"
              ><Icon icon="ant-design:minus-outlined"
            /></Button>
            <BaseUploadDragger v-model:value="model[field]" /><br />
            <Input type="text" v-model:value="model[field]" /><br />
          </div>
        </template>
      </BasicForm>
    </div>
    <div @mouseenter="listenFooterBg('company')" @mouseleave="removeListenFooterBg">
      <Divider orientation="left">{{ t('common.companyInfo') }}</Divider>
      <BasicForm @register="companyForm" />
    </div>
    <div @mouseenter="listenFooterBg('band')" @mouseleave="removeListenFooterBg">
      <Divider orientation="left">{{ t('common.LicenseQualification') }}</Divider>
      <BasicForm @register="licenseForm">
        <template #licenseSetting> <BaseUploadDragger /> </template>
      </BasicForm>
      <EditorModal @register="editorModal" @success="handleModalSuccess" />
    </div>
  </div>
  <div class="footer-bg"></div>
  <div class="footer-bg-filter footer-bg-filter-quicklink"></div>
  <div class="footer-bg-filter footer-bg-filter-cooperate"></div>
  <div class="footer-bg-filter footer-bg-filter-support"></div>
  <div class="footer-bg-filter footer-bg-filter-company"></div>
  <div class="footer-bg-filter footer-bg-filter-band"></div>
</template>
<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import { useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import EditorModal from './EditorModal.vue';
  import Icon from '@/components/Icon/Icon.vue';

  import { Divider, Checkbox, Button, Row, Col, Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const props = defineProps({
    detailInfo: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: '1',
    },
  });

  const [quickForm, { setProps, updateSchema }] = useForm({
    schemas: [
      {
        field: 'CheckRule',
        component: 'CheckboxGroup',
        slot: 'CheckRule',
      },
    ],
    labelCol: { span: 6 },
    baseColProps: { span: 24 },
    actionColOptions: { span: 24 },
    submitButtonOptions: {
      text: t('business.comon_save'),
    },
    showResetButton: false,
    submitFunc: handleSubmit,
  });
  const [partnerForm] = useForm({
    schemas: [
      {
        field: 'quickLink',
        component: 'CheckboxGroup',
        colProps: { xl: 20, lg: 16, md: 14, sm: 12 },
        componentProps: {
          options: [
            { label: 'PG', value: 1 },
            { label: 'AG', value: 2 },
            { label: 'MG', value: 3 },
            { label: 'SB', value: 4 },
            { label: 'FB', value: 5 },
            { label: 'WG', value: 6 },
            { label: 'OB', value: 7 },
          ],
        },
      },
    ],
    labelCol: { span: 6 },
    baseColProps: { span: 18 },
    actionColOptions: { span: 24 },
    submitButtonOptions: {
      text: t('business.comon_save'),
    },
    showResetButton: false,
    submitFunc: handleSubmit,
  });
  const [sponsorForm, { appendSchemaByField, removeSchemaByField }] = useForm({
    schemas: [
      {
        field: '0',
        component: 'Input',
        colProps: { span: 4 },
        required: true,
        slot: 'add',
      },
    ],
    labelCol: { span: 6 },
    baseColProps: { span: 12 },
    actionColOptions: { span: 24 },
    submitButtonOptions: {
      text: t('business.comon_save'),
    },
    showResetButton: false,
    submitFunc: handleSubmit,
  });
  const [companyForm] = useForm({
    schemas: [
      {
        field: 'field0',
        component: 'Input',
        label: t('common.CompanyName'),
        colProps: { span: 12 },
        required: true,
      },
      {
        field: 'field0',
        component: 'Input',
        label: t('common.CopyrightInfo'),
        colProps: { span: 12 },
        required: true,
      },
    ],
    labelCol: { span: 6 },
    baseColProps: { span: 18 },
    actionColOptions: { span: 24 },
    submitButtonOptions: {
      text: t('business.comon_save'),
    },
    showResetButton: false,
    submitFunc: handleSubmit,
  });
  const [licenseForm] = useForm({
    schemas: [
      {
        field: 'pcLogo',
        component: 'Upload',
        rules: [{ required: true }],
        slot: 'licenseSetting',
      },
    ],
    labelCol: { span: 6 },
    baseColProps: { span: 18 },
    actionColOptions: { span: 24 },
    submitButtonOptions: {
      text: t('business.comon_save'),
    },
    showResetButton: false,
    submitFunc: handleSubmit,
  });
  const n = ref(1);
  function add() {
    appendSchemaByField(
      {
        field: `${n.value}`,
        colProps: { span: 4 },
        component: 'Input',
        required: true,
        slot: 'add',
      },
      '',
    );
    n.value++;
  }
  // quick_jump
  let quickJumpTable = reactive([
    {
      col: 1,
      checkboxs: [
        { name: t('common.honmepage'), checked: null, hasLanguageLink: false },
        { name: t('common.rollingBall'), checked: null, hasLanguageLink: false },
        { name: t('common.BettingRules'), checked: null, hasLanguageLink: true },
      ],
    },
    {
      col: 2,
      checkboxs: [
        { name: t('common.Game'), checked: null, hasLanguageLink: false },
        { name: t('common.VIPClub'), checked: null, hasLanguageLink: false },
        { name: t('table.system.discount_promotions'), checked: null, hasLanguageLink: false },
      ],
    },
    {
      col: 3,
      checkboxs: [
        { name: t('common.ResponsibleGambling'), checked: null, hasLanguageLink: true },
        { name: t('component.banner.alliance_center'), checked: null, hasLanguageLink: false },
        { name: t('common.OnlineSupport'), checked: null, hasLanguageLink: false },
      ],
    },
    {
      col: 4,
      checkboxs: [
        { name: 'facebook', checked: null, hasLanguageLink: true },
        { name: 'twitter', checked: null, hasLanguageLink: true },
        { name: 'instagram', checked: null, hasLanguageLink: true },
        { name: 'youtube', checked: null, hasLanguageLink: true },
        { name: 'tiktok', checked: null, hasLanguageLink: true },
      ],
    },
    {
      col: 5,
      checkboxs: [
        { name: t('common.privacyPolicy'), checked: null, hasLanguageLink: true },
        { name: t('common.LaunderingPolicy'), checked: null, hasLanguageLink: true },
        { name: t('common.TermsService'), checked: null, hasLanguageLink: true },
      ],
    },
    {
      col: 6,
      checkboxs: [
        { name: t('common.lang'), checked: null, hasLanguageLink: true },
        { name: t('common.Odds'), checked: null, hasLanguageLink: true },
      ],
    },
  ]);

  function del(field: string) {
    removeSchemaByField([`${field}`]);
    n.value--;
  }
  //表单提交
  async function handleSubmit() {
    // const data = await validate();
    // await fetch(data);
  }
  const [editorModal, { openModal }] = useModal();
  function editModalOpen(title: string) {
    openModal(true, {
      title,
    });
  }
  function handleModalSuccess() {}
  // 显示最开始加载的数据
  const handelInitdata = (_data) => {
    quickJumpTable.forEach((col) => {
      col.checkboxs.forEach((checkbox) => {});
    });
    // updateSchema([
    //   {
    //     field: 'CheckRule',
    //     defaultValue: _data.bottom.quick_jump,
    //   },
    // ],)
  };
  onMounted(() => {
    listenFooterBg('quicklink'); //右边展示效果
    // 回显数据
    handelInitdata(props.detailInfo);
    //footer-bg-filter
  });
  const listenFooterBgName = ref('');
  const listenFooterBg = (name) => {
    listenFooterBgName.value = name;
    setFooterBg();
  };
  const removeListenFooterBg = () => {
    listenFooterBgName.value = '';
    setFooterBg();
  };
  const setFooterBg = () => {
    let bg = document.getElementsByClassName('footer-bg-filter');
    if (!listenFooterBgName.value) {
      bg.forEach((item) => {
        if (item.classList.value.indexOf('active-bg') > 0) {
          item.classList.remove('active-bg');
        }
      });
    } else {
      bg.forEach((item) => {
        if (item.classList.value.indexOf(listenFooterBgName.value) > 0) {
          item.classList.add('active-bg');
        } else {
          if (item.classList.value.indexOf('active-bg') > 0) {
            item.classList.remove('active-bg');
          }
        }
      });
    }
  };
</script>

<style lang="less" scoped>
  .site-card-form {
    .ant-page-header-back {
      display: none;
    }
  }
  .footer-setting-box {
    display: flex;
    margin-bottom: 5px;
  }
  .footer-bg {
    position: fixed;
    right: 30px;
    top: 150px;
    z-index: 300;
    width: 600px;
    height: 450px;
    background-image: url('@/assets/images/u975.webp');
    background-size: 100%;
  }
  .footer-bg-filter {
    position: fixed;
    right: 30px;
    width: 600px;
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 350;
  }
  .active-bg {
    background-color: transparent !important;
  }
  .footer-bg-filter-quicklink {
    top: 150px;
    height: 107px;
  }
  .footer-bg-filter-cooperate {
    top: 257px;
    height: 83px;
  }
  .footer-bg-filter-support {
    top: 340px;
    height: 60px;
  }
  .footer-bg-filter-company {
    top: 400px;
    height: 153px;
  }
  .footer-bg-filter-band {
    top: 553px;
    height: 47px;
  }
  .button-icon {
    color: #3793f5 !important;
    background-color: transparent !important;
    border: 0 !important;
  }
  .button-icon:hover {
    border: none !important;
    background-color: transparent !important;
  }
  .button-icon:focus {
    border: none !important;
    background-color: transparent !important;
  }
  .button-icon:active {
    border: none !important;
    background-color: transparent !important;
  }
</style>
