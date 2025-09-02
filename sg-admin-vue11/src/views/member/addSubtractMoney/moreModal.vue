<template>
  <div class="moreModal">
    <BasicModal
      okText=""
      cancelText
      :title="`${getTitle}${t('table.member.member_tip_title')}`"
      @register="moreRegitser"
    >
      <div v-if="getData.invalid_format?.length">
        <p>
          {{ t('table.member.member_follow') }}{{ getData?.invalid_format?.length
          }}{{ t('table.member.member_ge') }} {{ t('table.member.member_format1') }}{{ getTitle
          }}{{ t('business.common_success') }}</p
        ><div class="textArea"
          ><p
            class="m-b-2"
            v-for="(item, index) in changeForm(getData.invalid_format).split(',')"
            :key="index"
            >{{ item }}</p
          ></div
        >
      </div>
      <div v-if="getData.non_exist?.length">
        <p class="my-2 leading-normal"
          >{{ t('table.member.member_follow') }} {{ getData.non_exist.length
          }}{{ t('table.member.member_ge') }} {{ t('table.member.member_format2') }}{{ getTitle
          }}{{ t('business.common_success') }}</p
        ><div class="textArea">{{ changeForm(getData.non_exist) }}</div>
      </div>
      <div v-if="getData.insufficient_balance?.length">
        <p class="my-2 leading-normal"
          >{{ t('table.member.member_follow') }}{{ getData.insufficient_balance.length
          }}{{ t('table.member.member_ge') }}{{ t('table.member.member_format3') }}{{ getTitle
          }}{{ t('business.common_success') }}</p
        >
        <div class="textArea">{{ changeForm(getData.insufficient_balance) }}</div>
      </div>
      <div v-if="getData.disabled?.length">
        <p class="my-2 leading-normal"
          >{{ t('table.member.member_follow') }}{{ getData.disabled.length
          }}{{ t('table.member.member_ge') }}{{ t('table.member.member_format4') }}{{ getTitle
          }}{{ t('business.common_success') }}</p
        >
        <div class="textArea">{{ changeForm(getData.disabled) }}</div>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import 'uno.css';
  import '@/design/index.less';
  import '@/components/VxeTable/src/css/index.scss';
  import 'ant-design-vue/dist/antd.less';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const getTitle = ref('' as any);
  const getData = ref({} as any);
  const [moreRegitser] = useModalInner((data) => {
    getData.value = data.data;
    getTitle.value = data.title;
  });
  function changeForm(item: any) {
    const invalidFormatArray = item
      ?.map(function (item) {
        return item.split('=')[0];
      })
      .join(',');
    return invalidFormatArray;
  }
  //   function moreModalEmit(data) {
  //     getData.value = data.data;
  //     getTitle.value = data.titleStr;
  //   }
</script>

<style scoped>
  ::v-deep(.textArea) {
    border: 1px solid #ccc;
    padding: 10px;
    min-height: 100px;
  }
</style>
