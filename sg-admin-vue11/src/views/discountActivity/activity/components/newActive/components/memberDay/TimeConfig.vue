<script lang="ts" setup>
  import { ref, withDefaults, defineProps, computed, defineExpose } from 'vue';
  import {
    CheckboxGroup,
    Select,
    SelectOption,
    Tag,
    Form,
    FormItem,
    Row,
    Col,
  } from 'ant-design-vue';
  // import { t } from '/@/hooks/web/useI18n';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  interface Props {
    selectedWeek: string[];
    startDate: number;
    endDate: number;
    dayTimeTagSelected: string[];
    otherTimeTagSelected: string[];
  }

  const props = withDefaults(defineProps<Props>(), {
    selectedWeek: () => [],
    startDate: null,
    endDate: null,
    dayTimeTagSelected: () => [],
    otherTimeTagSelected: () => [],
  });

  const timeTags = [
    '0:00~0:59',
    '1:00~1:59',
    '2:00~2:59',
    '3:00~3:59',
    '4:00~4:59',
    '5:00~5:59',
    '6:00~6:59',
    '7:00~7:59',
    '8:00~8:59',
    '9:00~9:59',
    '10:00~10:59',
    '11:00~11:59',
    '12:00~12:59',
    '13:00~13:59',
    '14:00~14:59',
    '15:00~15:59',
    '16:00~16:59',
    '17:00~17:59',
    '18:00~18:59',
    '19:00~19:59',
    '20:00~20:59',
    '21:00~21:59',
    '22:00~22:59',
    '23:00~23:59',
  ];
  const timeTagOptions = timeTags.map((t) => ({ value: t, label: t, icon: '' }));

  const weekdays = [
    { label: t('common.translate.word35'), value: 'monday' },
    { label: t('common.translate.word36'), value: 'tuesday' },
    { label: t('common.translate.word37'), value: 'wednesday' },
    { label: t('common.translate.word38'), value: 'thursday' },
    { label: t('common.translate.word39'), value: 'friday' },
    { label: t('common.translate.word40'), value: 'saturday' },
    { label: t('common.translate.word41'), value: 'sunday' },
  ];

  const timeConfigRef = ref();

  const emit = defineEmits([
    'update:selectedWeek',
    'update:startDate',
    'update:endDate',
    'update:dayTimeTagSelected',
    'update:otherTimeTagSelected',
  ]);

  const formState = computed(() => ({
    selectedWeek: props.selectedWeek,
    startDate: props.startDate,
    endDate: props.endDate,
    dayTimeTagSelected: props.dayTimeTagSelected,
    otherTimeTagSelected: props.otherTimeTagSelected,
  }));

  async function validationFunc() {
    return new Promise((resolve, reject) => {
      timeConfigRef.value
        .validate()
        .then((r) => {
          resolve(true);
        })
        .catch((err) => {
          resolve(false);
        });
    });
  }

  function sortTag(a: string, b: string) {
    return a.split(':')[0] - b.split(':')[0];
  }

  defineExpose({
    validationFunc,
  });
</script>

<template>
  <div class="time-config">
    <Form ref="timeConfigRef" :model="formState" validate-trigger="blur">
      <table>
        <thead>
          <tr>
            <th colspan="2">{{ t('common.translate.word42') }}</th>
            <th>{{ t('business.common_count_time') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ t('modalForm.finance.every_day') }}</td>
            <td>/</td>
            <td>
              <FormItem
                label=""
                :rules="[{ required: true, message: `${t('common.translate.word43')}!` }]"
                name="dayTimeTagSelected"
              >
                <div ref="dayTimeSelectWrapperRef">
                  <Select
                    :value="formState.dayTimeTagSelected?.toSorted(sortTag)"
                    mode="multiple"
                    class="!mt-5"
                    style="text-align: left"
                    :placeholder="t('common.chooseText')"
                    :options="timeTagOptions"
                    size="large"
                    @change="(val) => emit('update:dayTimeTagSelected', val)"
                  >
                    <template #option="{ value: val, label, icon }">
                      {{ label }}
                    </template>
                    <template #tagRender="{ value: val, label, closable, onClose, option }">
                      <Tag :closable="closable" style="margin-right: 3px" @close="onClose">
                        {{ label }}
                      </Tag>
                    </template>
                  </Select>
                </div>
              </FormItem>
            </td>
          </tr>
          <tr>
            <td>{{ t('common.translate.word44') }}</td>
            <td>
              <div class="flex">
                <FormItem
                  label=""
                  :rules="[{ required: true, message: `${t('common.translate.word45')}!` }]"
                  name="selectedWeek"
                >
                  <CheckboxGroup
                    :value="selectedWeek"
                    name="weekdays"
                    :options="weekdays"
                    @change="(val) => emit('update:selectedWeek', val)"
                  />
                </FormItem>
              </div>
            </td>
            <td rowspan="2">
              <FormItem
                label=""
                :rules="[{ required: true, message: `${t('common.translate.word46')}!` }]"
                name="otherTimeTagSelected"
              >
                <div>
                  <Select
                    :value="formState.otherTimeTagSelected?.toSorted(sortTag)"
                    mode="multiple"
                    size="large"
                    style="width: 100%; min-height: 38px; text-align: left"
                    :placeholder="t('common.chooseText')"
                    :options="timeTagOptions"
                    @change="(val) => emit('update:otherTimeTagSelected', val)"
                  >
                    <template #option="{ value: val, label, icon }">
                      {{ label }}
                    </template>
                    <template #tagRender="{ value: val, label, closable, onClose, option }">
                      <Tag :closable="closable" style="margin-right: 3px" @close="onClose">
                        {{ label }}
                      </Tag>
                    </template>
                  </Select>
                </div>
              </FormItem>
            </td>
          </tr>
          <tr>
            <td>{{ t('common.translate.word47') }}</td>
            <td>
              <Row>
                <Col :span="11">
                  <FormItem
                    label=""
                    :rules="[{ required: true, message: `${t('common.translate.word48')}!` }]"
                    name="startDate"
                  >
                    <Select
                      size="large"
                      class="!mt-5"
                      :value="startDate"
                      style="width: 200px"
                      @change="(val) => emit('update:startDate', val)"
                      :placeholder="t('common.chooseText')"
                    >
                      <SelectOption v-for="i in 31" :key="i" :value="i">{{ i }}</SelectOption>
                    </Select>
                  </FormItem>
                </Col>
                <Col :span="1">
                  <div class="w-full h-full">
                    <div class="line"></div>
                  </div>
                </Col>
                <Col :span="11">
                  <FormItem
                    label=""
                    :rules="[{ required: true, message: `${t('common.translate.word49')}!` }]"
                    name="endDate"
                  >
                    <Select
                      size="large"
                      class="!mt-5"
                      :value="endDate"
                      style="width: 200px"
                      @change="(val) => emit('update:endDate', val)"
                      :placeholder="t('common.chooseText')"
                    >
                      <template v-for="i in 31" :key="i">
                        <SelectOption v-if="+startDate > 0 ? i >= +startDate : true" :value="i">{{
                          i
                        }}</SelectOption>
                      </template>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
            </td>
          </tr>
        </tbody>
      </table>
    </Form>
  </div>
</template>

<style lang="less" scoped>
  .time-config {
    table {
      width: 100%;
      border-radius: 4px 4px 0 0;
      color: #444;
      text-align: center;

      tr {
        td,
        th {
          min-height: 60px;
          padding: 0 12px;
          border: 1px solid #e1e1e1;
          line-height: 60px;
        }
      }

      thead {
        tr {
          background: #f6f7fb;

          th {
            width: 50%;
            font-size: 16px;
            font-weight: 600;
          }
        }
      }

      tbody {
        font-size: 14px;
        font-weight: 500;

        tr {
          td:first-child {
            width: 58px;
            min-width: 58px;
          }

          td:nth-child(2) {
            padding: 0 6px;
          }
        }

        tr:nth-child(odd) {
          background: #fff;
        }

        tr:nth-child(even) {
          background: #f6f7fb;
        }
      }
    }
  }

  .line {
    width: 80%;
    height: 1.5px;
    margin-top: 40px;
    margin-left: 10%;
    background-color: #4444;
    font-size: 14px;
    font-weight: 500;
  }
</style>
