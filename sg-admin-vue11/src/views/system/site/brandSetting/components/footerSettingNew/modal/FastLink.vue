<template>
  <Form @finish="onFinish" ref="formRef" :model="modelRef">
    <Row :gutter="24">
      <Col v-for="(item, index) in socialMedia" :key="index" class="pt-5px fastlink-item">
        <Checkbox v-model:checked="item.state" :disabled="isControlValueSet()">
          <FormItem :name="item.label" :rules="[{ required: true, validator: validatePass }]">
            <label class="fastlink-label">
              <cdFooterSetting class="w-16px h-16px mr-5px" :icon="item.label" />{{ item.label }}:
            </label>
            <Input
              v-model:value="modelRef[item.label]"
              :disabled="isControlValueSet()"
              class="fastlink-input"
            />
          </FormItem>
        </Checkbox>
      </Col>
    </Row>
    <!-- <Row :gutter="24">
      <FormItem :wrapper-col="{ offset: 1 }">
        <a-button
          type="primary"
          class="w-100px ml-8px mt-15px"
          size="large"
          html-type="submit"
          @click="handleSubmit"
          >保存</a-button
        ></FormItem
      >
    </Row> -->
  </Form>
  <div class="submit-btn text-center">
    <a-button
      type="primary"
      size="large"
      :disabled="isControlValueSet()"
      @click="handleSubmit"
      class="w-240px ml-8px mt-15px"
      >{{ $t('common.saveText') }}</a-button
    >
  </div>
</template>

<script lang="ts" setup>
  import { Form, FormItem, Input, Row, Col, Checkbox, message } from 'ant-design-vue';
  import { onMounted, ref } from 'vue';
  import { getSiteBrandDetail, updateSiteBrand } from '/@/api/sys';
  import type { Rule } from 'ant-design-vue/es/form';
  import { domainRegex } from '/@/utils/regexp';
  import cdFooterSetting from '/@/components-cd/Icon/footerSetting/cd-footer-setting-icon.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isControlValueSet } from '/@/utils/domUtils';

  const { t } = useI18n();
  const formRef = ref<any>(null);

  const modelRef = ref({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    telegram: '',
  });

  const props = defineProps({
    id: {
      type: String,
      default: '1',
    },
  });

  const socialMedia = ref([
    { label: 'facebook', url: '', state: false },
    { label: 'instagram', url: '', state: false },
    { label: 'twitter', url: '', state: false },
    { label: 'youtube', url: '', state: false },
    { label: 'tiktok', url: '', state: false },
    { label: 'telegram', url: '', state: false },
  ]);

  const onFinish = (values: any) => {};

  const handleSubmit = async () => {
    const params = {
      //id: props.id,
      name: 'bottom',
    };
    const map = {};

    //const fromValue = await formRef.value.validate();
    socialMedia.value.forEach((item) => {
      const key = `${item.label}`;
      map[key] = {
        url: modelRef.value[item.label],
        state: item.state,
      };
    });
    params['content'] = JSON.stringify(map);
    const { status, data } = await updateSiteBrand({ ...params });
    if (status) {
      message.success(data);
      // emit('update:ok');
    } else {
      message.error(data);
    }
  };

  const GetSiteBrandDetail = async (param) => {
    const data = await getSiteBrandDetail(param);
    socialMedia.value.forEach((item) => {
      if (data[item.label]) {
        item.state = data[item.label].state;
        item.url = data[item.label].url;
        modelRef.value[item.label] = data[item.label].url;
      }
    });
  };

  let validatePass = async (_rule: Rule, value: string) => {
    if (!domainRegex.test(value)) {
      return Promise.reject(t('common.enterLink'));
    }
    return Promise.resolve();
  };

  onMounted(() => {
    GetSiteBrandDetail({ tag: 'bottom' });
  });
</script>
<style lang="less" scoped>
  ::v-deep(.ant-checkbox) {
    position: absolute;
    margin-top: 14px;
    float: left;
  }

  .fastlink-label {
    position: relative;
    min-width: 90px;
    margin-left: 15px;
    float: left;
    > label {
      width: 100%;
    }
  }

  .fastlink-input {
    width: calc(100% - 110px);
    //margin-bottom: 20px;
    //margin-top: -5px;
    min-width: 150px;
    float: right;
  }

  ::v-deep(.ant-form-item) {
    label {
      margin-top: 8px;
    }
  }

  ::v-deep(.ant-form-item-control-input-content) {
    width: calc((100vw / 3) - 130px);
  }

  ::v-deep(.fastlink-item) {
    width: calc(100% / 3);
    //border:1px solid red;
    > label {
      width: 100%;
    }
    .ant-checkbox + span {
      width: 100%;
    }
  }
</style>
