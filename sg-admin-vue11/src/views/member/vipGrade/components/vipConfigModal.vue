<template>
  <div>
    <BasicModal
      :title="$t('table.member.member_rate_config')"
      :okText="$t('table.system.system_conform_save')"
      @ok="okFun"
      :width="530"
      @register="RegisterReteMadel"
    >
      <BasicForm @register="registerForm">
        <template #levelSlot="{ model }">
          <div v-if="model['levelType'] === '2'">
            <Button
              v-for="(item, index) of configVipList"
              class="m-r-1 m-b-1 w-20"
              :class="{ 'ant-btn-primary': selectVipStyle == index }"
              :key="index"
              @click="selectVipId(item.level)"
              >{{ 'VIP' + item.level }}
            </Button>
          </div>
        </template>
      </BasicForm>
      <Tabs v-model:activeKey="activeKey" class="capsule_tap capsule_tap_center">
        <TabPane
          v-for="item in getTitle"
          :key="item.game_type"
          :tab="gameDictionary[item.game_type]"
        >
          <Row>
            <Col span="24" class="input_number_item_box">
              <FormItem
                v-for="(tem, index) in item.data"
                :key="index"
                :label="tem.name"
                :labelCol="{ style: { width: labelMaxWidth + 'px' } }"
              >
                <div class="!flex">
                  <div class="!w-40 !ml-2 input_number_width_full">
                    <InputNumber
                      :controls="false"
                      :stringMode="true"
                      v-model:value="tem.rate"
                      addon-after="%"
                      :precision="2"
                      :min="0"
                      :max="100"
                      :step="0.01"
                      :placeholder="$t('table.member.member_rate_back')"
                    />
                  </div>
                </div>
              </FormItem>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {
    getConfigMemberVip,
    updateConfigMemberVip,
    getPlatefromAll,
    updateVipRebate,
    getRebateVipList,
    updataRebateConig,
  } from '/@/api/member/index';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { Tabs, TabPane, FormItem, InputNumber, Row, Col, message, Button } from 'ant-design-vue';
  import { useGameDictionary } from '/@/views/common/commonSetting';
  import { useI18n } from '@/hooks/web/useI18n';

  const { t } = useI18n();
  const configVipList = ref([] as any);
  const getTitle = ref([] as any);
  const FORM_SIZE = useFormSetting().getFormSize;
  const activeKey = ref('1' as string);
  const labelMaxWidth = ref(200);
  const selectVipStyle = ref(0 as any);
  const getSendType = ref('1' as any);
  const { gameDictionary } = useGameDictionary();
  /** 发放方式|等级选择 */
  const schemas: FormSchema[] = [
    {
      field: 'sendWay',
      component: 'Select',
      label: `${t('table.system.system_issue_way')}：`,
      labelWidth: 80,
      required: true,
      colProps: {
        span: 16,
      },
      componentProps: () => {
        return {
          options: [
            {
              label: t('modalForm.member.member_automatic_rebate'),
              value: '1',
            },
            {
              label: t('modalForm.member.member_pickup_the_next_day'),
              value: '2',
            },
            {
              label: t('modalForm.member.member_real_time_rebate'),
              value: '3',
            },
          ],
          onChange: async (e) => {
            const params = { key: 'automatic', value: e, ty: 1 };
            await updataRebateConig(params);
          },
          getPopupContainer: () => document.body,
        };
      },
    },
    {
      field: 'levelType',
      component: 'RadioGroup',
      label: `${t('modalForm.member.member_level_selection')}：`,
      labelWidth: 80,
      defaultValue: '1',
      colProps: {
        span: 16,
      },
      componentProps: {
        options: [
          {
            label: t('modalForm.member.member_unified_conf'),
            value: '1',
          },
          {
            label: t('modalForm.member.member_separate_configuration'),
            value: '2',
          },
        ],
        onChange: (val) => {},
      },
    },
    {
      field: 'level',
      component: 'Input',
      label: '',
      slot: 'levelSlot',
    },
  ];
  const [RegisterReteMadel, { closeModal }] = useModalInner(async (data) => {
    configVipList.value = data;
    const getDataAll = await getPlatefromAll();
    const list = [3, 5, 2, 1, 8, 4];

    const indexMap = list.reduce((map, value, index) => {
      map[value.toString()] = index;
      return map;
    }, {});

    // Rearrange list2 based on the order of list3
    getDataAll.sort((a, b) => {
      const indexA = indexMap[a.game_type];
      const indexB = indexMap[b.game_type];
      return indexA - indexB;
    });

    getTitle.value = getDataAll;
    //获取自定义列表
    const getData = await getConfigMemberVip({ flag: 1 });
    if (getData.length) {
      getSendType.value = getData[0].value;
      setFieldsValue({ sendWay: getSendType.value });
    }
    getDateList(0);
    selectVipStyle.value = 0;
  });
  async function getDateList(level: Number) {
    const params = {
      level: level,
    };
    const getDatalist = await getRebateVipList(params);
    getTitle.value.forEach((item: any) => {
      compData(getDatalist, item.game_type);
    });
  }
  const [registerForm, { validate, setFieldsValue }] = useForm({
    schemas,
    size: FORM_SIZE,
    showActionButtonGroup: false,
  });
  /** 选择Vip等级 */
  function selectVipId(level: any) {
    selectVipStyle.value = level;
    getDateList(level);
  }
  async function okFun() {
    const values = await validate();
    let newArray = getTitle.value.map((obj) => {
      return {
        game_type: obj.game_type,
        data: obj.data.map((item) => {
          return {
            id: item.id,
            rate: item.rate,
          };
        }),
      };
    });
    let params = {};
    if (values.levelType === '2') {
      params = {
        level: [String(selectVipStyle.value)],
        rebate: JSON.stringify(newArray),
      };
    } else {
      params = {
        rebate: JSON.stringify(newArray),
      };
    }
    const { status, data } = await updateVipRebate(params);
    if (status) {
      message.success(data);
      closeModal();
    }
  }
  function compData(rebate_config, tab) {
    rebate_config
      .filter((r) => r.game_type === tab)
      .forEach((r) => {
        const temp = getTitle.value.filter((g) => g.game_type === tab)[0];
        if (temp && temp.data && temp.data.length) {
          temp.data.forEach((t) => {
            t.rate = t.rate ? t.rate : '0';
            if (r.data && r.data.length) {
              r.data.forEach((rateItem) => {
                rateItem.rate = rateItem.rate ? rateItem.rate : '0';
                if (t.id === rateItem.id) {
                  if (rateItem.currency_id) {
                    t['currency_id'] = rateItem.currency_id
                      ? rateItem.currency_id.split(',')
                      : null;
                  }
                  t.rate = rateItem.rate;

                  t.rate = rateItem.rate || '0';
                }
              });
            }
          });
        }
      });
  }
</script>
<style scoped lang="less">
  ::v-deep(.ant-tabs-nav-operations) {
    display: none !important;
  }
</style>
