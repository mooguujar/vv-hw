<template>
  <BasicModal
    :title="$t('common.statistical_platform')"
    :okText="$t('table.system.system_conform_save')"
    @ok="handleSubmit"
    :width="BaseHeight"
    :minHeight="100"
    @register="registerBasicModal"
    :showCancelBtn="false"
  >
    <BasicForm
      @register="registerForm"
      :schemas="schemasStatilPlat"
      layout="horizontal"
      :showActionButtonGroup="false"
      @field-value-change="fieldChang"
    >
      <template #NegativeConfigType>
        <TableCheckbox
          :data="venueList"
          :check-strictly="false"
          :default-checked-keys="platform_ids"
          v-model:checkedKeys="current_platform_ids"
          defaultExpandAll
          :replaceFields="{
            children: 'list',
            title: 'name',
            key: 'value',
            label: 'label',
          }"
          @check-change="handleCheckboxChange"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, inject, computed, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { schemasStatilPlat } from './VipConfiguration.data';
  import TableCheckbox from '@/components/TableCheckbox/index.vue';
  import { useGameSortStore } from '/@/store/modules/gameSort';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  const getData = inject<Function>('getData');
  const setData = inject<Function>('setData');
  const initData = computed(() => getData());
  const tabValue = ref<string>('1');
  const platform_range = ref<string>('0');
  const platform_ids = ref([]);
  const current_platform_ids = ref([]);
  const Venue_statistics = ref('appointVen');
  const venueList: any = ref([]);
  const BaseHeight = ref(520);
  let plateOptions: any = [];
  const info_venue = () => {
    plateOptions = [];
    let { getPlatformList, getgame_typeList } = useGameSortStore();
    for (const key in getPlatformList) {
      plateOptions.push(...(getPlatformList[key] as any));
    }
    plateOptions =
      plateOptions &&
      plateOptions.map((item: any) => {
        return {
          ...item,
          label: item.platform_name,
          name: item.name || item.platform_name,
          value: item.platform_id,
          state: platform_ids.value.some((el) => el == item.platform_id) ? 1 : 2,
        };
      });
    getgame_typeList = getgame_typeList.filter((item: any) => {
      return item.name != '全部' && item.game_type != 'all';
    });
    let list: any = [];
    getgame_typeList.forEach((element: any) => {
      list.push({
        label: element.name,
        value: element.game_type,
        id: '',
        name: t('business.common_select_all'),
        list: plateOptions.filter((item) => item.game_type == element.game_type),
        allVen: plateOptions
          .filter((item) => item.game_type == element.game_type)
          .map((el) => {
            return {
              name: el.name,
              value: el.value,
            };
          }),
        appointVen: plateOptions
          .filter((item) => item.game_type == element.game_type)
          .filter((obj) => obj.state === 1)
          .map((el) => {
            return {
              name: el.name,
              value: el.value,
            };
          }),
      });
    });
    venueList.value = list;
  };

  const current_game: any = computed(() => {
    let list = venueList.value.filter((item) => item.value == tabValue.value)[0].list;
    return list;
  });
  const [
    registerForm,
    {
      validate: validate,
      setFieldsValue: setFieldsValue,
      //   getFieldsValue: getFieldsValue,
    },
  ] = useForm({
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    colon: true,
    labelAlign: 'right',
    showActionButtonGroup: false,
  });

  const [registerBasicModal, { closeModal }] = useModalInner((data) => {
    let platform_rangeValue = initData.value.filter((p) => p.ty === 11 && p.key === 'platform')[0]
      .value;
    if (platform_rangeValue === '0') {
      platform_range.value = '0';
    } else {
      platform_range.value = '1';
      current_platform_ids.value = platform_ids.value = platform_rangeValue.split(',');
      info_venue();
      // current_platform_ids.value = platform_rangeValue.split(',');
    }

    setFieldsValue({
      platform_range: platform_range.value,
    });
    fieldChang('platform_range', platform_range.value);
  });
  async function handleSubmit() {
    const values = await validate();
    let params = <any>[];
    if (values.platform_range === '0') {
      params = [
        {
          ...initData.value.filter((p) => p.ty === 11 && p.key === 'platform')[0],
          value: '0',
        },
      ];
    } else {
      params = [
        {
          ...initData.value.filter((p) => p.ty === 11 && p.key === 'platform')[0],
          value: current_platform_ids.value.join(','),
        },
      ];
    }
    setData(params);
    closeModal();
  }
  const handleCheckboxChange = (e, item) => {
    setTimeout(() => {
      item.state = e.target?.checked ? 1 : 2;
      venueList.value.filter((item) => item.value == tabValue.value)[0][Venue_statistics.value] =
        plateOptions
          .filter((item) => item.game_type == tabValue.value)
          .filter((obj) => obj.state === 1)
          .map((el) => {
            return {
              name: el.name,
              value: el.value,
            };
          });
    }, 150);
  };
  async function fieldChang(field, value) {
    if (field === 'platform_range') {
      if (value === '0') {
        BaseHeight.value = 520;
      } else {
        BaseHeight.value = 1100;
      }
    }
  }
  onMounted(() => {
    info_venue();
  });
</script>
<style scoped lang="less">
  .ant-form-item-label > label,
  .text-horizon-center {
    height: 40px;
    line-height: 40px;
  }

  ::v-deep(.vip_platform_range .ant-form-item-control-input-content) {
    > div > div {
      display: block !important;
    }
  }
</style>
