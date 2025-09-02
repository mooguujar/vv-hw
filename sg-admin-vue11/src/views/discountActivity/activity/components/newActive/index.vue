<template>
  <PageWrapper contentClass="editLayout" :title="bigTitle" contentBackground>
    <template #headerContent>
      <a-button :size="FORM_SIZE" @click="goBack" class="mr-10px">
        {{ t('business.common_cancel') }}
      </a-button>
      <a-button type="primary" :size="FORM_SIZE" @click="submitOk">
        {{ t('common.saveText') }}
      </a-button>
    </template>
    <div class="activeBox">
      <div class="activHeader">
        <h3>{{ t('common.activeTitle1') }}</h3>
      </div>
      <div class="flex activContent">
        <div class="flex-1">
          <BasicForm
            ref="promoForm"
            :size="FORM_SIZE"
            @register="registerFormSettingLeft"
            :schemas="processSetingData(defaultTy, 'setingFormLeftData')"
            layout="horizontal"
            @field-value-change="fieldChang"
          >
            <!-- 活动大类 -->
            <template #activeTy="{ model, field }">
              <LangRadioGroup
                class="!-mt-10px"
                :selectValue="activityTy"
                :contentList="typeDataList"
                @update:click="changeHandleActivity"
                :disabledType="disabledType"
                v-model="model[field]"
                :isButton="true"
              />
            </template>
            <!-- 活动类型 -->
            <template #typesSlot>
              <Select
                v-model:value="typesTy"
                size="large"
                @change="changeHandleTypes"
                :options="activeOptionsTy"
                :disabled="disabledType"
              ></Select>
            </template>
            <!-- 活动分类 -->
            <template #categoryId="{ model, field }">
              <Select
                v-model:value="model[field]"
                size="large"
                :mode="'multiple'"
                :maxTagCount="5"
                :options="categoryIDList"
                :placeholder="
                  categoryIDList?.length
                    ? t('common.chooseText')
                    : t('common.return_activity_list_create_category')
                "
              ></Select>
            </template>
            <!-- 活动子类 -->
            <template #typeActive>
              <Select
                v-model:value="defaultTyMain"
                size="large"
                @change="changeHandle"
                :options="ActivityOptions"
                :disabled="disabledType"
              ></Select>
            </template>
            <!-- 显示语言 -->
            <template #terminalSlot="{ model, field }">
              <Row v-if="openTerminalOptions.length !== 1">
                <FormItemRest>
                  <Checkbox
                    v-model:checked="openTerminalState.checkAll"
                    :indeterminate="openTerminalState.indeterminate"
                    @change="onCheckAllChange($event, model, field)"
                    :disabled="timedIdisable"
                  >
                    {{ t('business.common_select_all') }}
                  </Checkbox>
                </FormItemRest>
                <CheckboxGroup
                  v-model:value="openTerminalState.checkedList"
                  :options="openTerminalOptions"
                  :disabled="timedIdisable"
                  @change="onChangeOpenTerminal($event, model, field)"
                />
              </Row>
              <Row v-else>
                <CheckboxGroup
                  v-model:value="openTerminalState.checkedList"
                  :options="openTerminalOptions"
                  :disabled="timedIdisable"
                  @change="onChangeOpenTerminal($event, model, field)"
                />
              </Row>
            </template>
            <!-- 活动名称 -->
            <template #zhNameTextSlot="{ model, field }">
              <div class="flex">
                <Input
                  :size="FORM_SIZE"
                  :placeholder="t('v.discount.activity.active_name')"
                  v-model:value="zhText"
                  @change="changInputzhText"
                  @blur="handleTinymceBlurZx"
                  style="height: 40px"
                />
                <Button
                  v-if="openTerminalState.checkedList.length > 0"
                  type="primary"
                  class="ml-20px"
                  :size="FORM_SIZE"
                  @click="handleMoreLagarage('zh_name')"
                  >{{ t('v.discount.activity.more_language') }}</Button
                >
              </div>
            </template>
            <!-- 开始时间 -->
            <template #startTime>
              <Row>
                <Col :span="11">
                  <!-- :disabledDate="disabledStartDate" -->
                  <FormItem>
                    <DatePicker
                      :show-time="false"
                      :size="FORM_SIZE"
                      style="width: 100%"
                      :allowClear="false"
                      v-model:value="startTime.start_at"
                      @change="
                        () => {
                          changTime('start_at');
                        }
                      "
                      :disabled="timedIdisable"
                    />
                  </FormItem>
                </Col>
                <Col :span="2">
                  <div class="w-full h-full">
                    <div class="line"></div>
                  </div>
                </Col>
                <Col :span="11">
                  <FormItem>
                    <!-- :disabledDate="disabledStartDate" -->
                    <DatePicker
                      :show-time="false"
                      :size="FORM_SIZE"
                      style="width: 100%"
                      :disabled="timedIdisable"
                      :allowClear="false"
                      v-model:value="startTime.end_at"
                      @change="
                        () => {
                          changTime('end_at');
                        }
                      "
                    />
                  </FormItem>
                </Col>
              </Row>
            </template>
          </BasicForm>
        </div>
        <div class="w-80px"></div>
        <div class="flex-1">
          <BasicForm
            :size="FORM_SIZE"
            @register="registerFormSettingRight"
            :schemas="processSetingData(defaultTy, 'setingFormRightData')"
            layout="horizontal"
            @field-value-change="fieldChang"
          >
            <template #pop>
              <div>
                <CheckboxGroup
                  v-model:value="pop"
                  :options="popOptions"
                  @change="
                    setFieldsValueSettingRight({
                      pop: pop,
                    })
                  "
                />
                <Radio
                  :checked="pop.includes('2')"
                  @change="
                    (pop = ['2']),
                      setFieldsValueSettingRight({
                        pop: pop,
                      })
                  "
                  >{{ t('business.common_off') }}</Radio
                >
              </div>
            </template>
            <!-- 首页快捷入口 -->
            <template #shortcutSlot>
              <div :class="{ 'h-40px': switchState === 2 }">
                <FormItem>
                  <Switch
                    @change="changeSwitch"
                    :checkedValue="1"
                    :unCheckedValue="2"
                    v-model:checked="switchState"
                  />
                </FormItem>
                <div class="overflow-auto shortcut-open h-222px" v-if="switchState === 1">
                  <FormItem :label="t('common.show_terminal')">
                    <CheckboxGroup
                      v-model:value="clientType"
                      :defaultValue="[1, 2]"
                      :options="[
                        { label: 'WEB', value: 1 },
                        { label: 'APP', value: 2 },
                      ]"
                    />
                  </FormItem>
                  <div class="upload-cur">
                    <FormItem required>
                      <Upload
                        :showUploadList="false"
                        multiple
                        list-type="picture-card"
                        accept="image/webp, image/png"
                        :customRequest="customUpload"
                        :headers="{
                          authorization: 'authorization-text',
                          t: token,
                          lang: 'zh_CN',
                        }"
                      >
                        <div class="image-container">
                          <img
                            v-if="imageUrl"
                            class="w-full h-full"
                            :src="getDataTypePreviewUrl(imageUrl)"
                            alt=""
                          />
                          <!-- <div v-if="imageUrl" class="flex items-center justify-center overlay">
                          <delete-outlined
                            @click.stop="deletePic"
                            :style="{
                              fontSize: '20px',
                              color: '#fff',
                            }"
                          />
                        </div> -->
                          <!-- 添加的蒙层 -->
                          <div class="pic-text" v-else>
                            <plus-outlined />
                            <div class="ant-upload-text">{{ t('business.banner_upload_pic') }}</div>
                            <div class="ant-upload-text">220*220</div>
                          </div>
                        </div>
                      </Upload>
                    </FormItem>
                    <div>{{ t('common.upload_pic_info') }}</div>
                  </div>
                </div>
              </div>
            </template>
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
        </div>
      </div>
    </div>
    <div class="activeBox">
      <div class="activHeader">
        <h3>{{ t('common.activeTitle2') }}</h3>
      </div>
      <div class="flex activContent">
        <div class="flex-1" :class="{ 'pdd-wheel': [1, 16, 17].includes(defaultTyMain) }">
          <BasicForm
            :size="FORM_SIZE"
            @register="registerFormBaseLeft"
            :schemas="
              (processSetingData(defaultTy, 'activeTitle2') || []).filter(
                (item) => item.labelPrefixWidth != 'right',
              )
            "
            @field-value-change="fieldChang"
            layout="horizontal"
          >
            <template #perioBilling="{ model, field }">
              <Row>
                <Col :span="15">
                  <!-- {{model}} -->
                  <FormItem>
                    <RadioGroup
                      v-model:value="model[field]"
                      :disabled="model['ids']"
                      @change="periodChange"
                    >
                      <Radio :value="1">{{ $t('v.discount.activity.everyday') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
              </Row>
            </template>
            <!-- 返现配置 -->
            <template #negativeProfit>
              <div>
                <Row>
                  <Col :span="4" class="text-center">
                    <label>
                      {{ t('table.promotion.promotion_affect_bet') }}≥
                      <CdIconCurrency
                        :icon="currentyOption[currentCurryId]"
                        style="width: 20px; margin-left: 4px"
                      />
                    </label>
                  </Col>
                  <Col :span="4" offset="1" class="text-center">
                    <!-- <Tooltip placement="topLeft" :title="t('v.discount.activity.bonus_tishi')">
                      <Icon icon="tabler:bulb" />
                    </Tooltip> -->
                    <label v-if="settingsTy_4_data.bonus_type === 1">
                      {{ t('common.bonus_type1') }}</label
                    >
                    <label v-else> {{ t('v.discount.activity.bonus_back_rate') }}(%)</label>
                  </Col>
                  <Col :span="4" class="text-center">
                    {{ t('v.discount.activity.operation') }}
                  </Col>
                </Row>
                <Row v-for="(item, index) in settingsTy_4" :key="index">
                  <Col :span="4">
                    <FormItem>
                      <InputNumber
                        :placeholder="`${t('v.discount.activity.valid_bet_amount_p')}${
                          currentyOption[currentCurryId]
                        }`"
                        :size="FORM_SIZE"
                        v-model:value="item.valid_bet_amount"
                        stringMode
                        style="width: 100%"
                      >
                        <template #prefix>
                          <CdIconCurrency
                            :icon="currentyOption[currentCurryId]"
                            style="width: 20px"
                          />
                        </template>
                      </InputNumber>
                    </FormItem>
                  </Col>
                  <Col :span="4" offset="1">
                    <FormItem>
                      <InputNumber
                        :size="FORM_SIZE"
                        :placeholder="
                          settingsTy_4_data.bonus_type === 1
                            ? t('common.bonus_type1')
                            : t('v.discount.activity.bonus_back_rate')
                        "
                        :min="1"
                        :addon-after="settingsTy_4_data.bonus_type === 1 ? '' : '%'"
                        v-model:value="item.bonus_rate"
                        stringMode
                      />
                    </FormItem>
                  </Col>
                  <Col :span="4">
                    <a @click="addRateConfigty_4" class="m-l-15"
                      ><img :src="RECT_ADD" class="h-40px"
                    /></a>
                    <!-- <Button
                      v-if="index == 0"
                      class="mt-0 m-l-3"
                      :size="FORM_SIZE"
                      preIcon="material-symbols:add"
                      type="primary"
                      @click="addRateConfigty_4"
                    />
                    <Button
                      v-if="index > 0"
                      :size="FORM_SIZE"
                      class="m-l-3"
                      preIcon="material-symbols:remove"
                      @click="removeRateConfigty_4(item)"
                    /> -->
                    <a @click="removeRateConfigty_4(item)" v-if="index > 0" class="m-l-10px"
                      ><img :src="RECT_DELETE" class="h-40px"
                    /></a>
                  </Col>
                </Row>
              </div>
            </template>
            <!-- 推广开宝箱 -->
            <template #Validmember>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.configuration_memeber_config') }}</h1>
                <BasicHelp
                  placement="top"
                  class="mx-1"
                  :text="t('v.discount.activity.configuration_memeber_tip')"
                />
              </div>
            </template>
            <!-- 轮盘配置 -->
            <template #RouletteBase1>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.RouletteBase1') }}</h1>
              </div>
            </template>
            <!-- 参与配置 -->
            <template #RouletteBase0>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('common.parti_setting') }}</h1>
              </div>
            </template>
            <!-- 领取配置 -->
            <template #MemberThs>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ $t('v.discount.activity.configuration_Get') }}</h1>
              </div>
            </template>
            <!-- 推广配置 -->
            <template #basicPromotion>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.configuration_promotion') }}</h1>
              </div>
            </template>
            <!-- 币种配置 -->
            <template #CurrencyConfig="{ model, field }">
              <!-- 切换币种 -->
              <!-- :contentList="currenyLang" -->
              <CurryRadioGroup
                class="currency-tree"
                ref="currencyRadioRef"
                :defaultTy="defaultTy"
                :contentList="currencyTreeList"
                @update:click="changeHandleCurry"
                v-model="model[field]"
                v-model:currencyId="currentCurryId"
              />
            </template>
            <template #payConfig="{ model, field }">
              <Form
                :model="settingsTy_1"
                class="no-mb"
                :label-col="{ style: { width: '', overflow: 'visible' } }"
              >
                <Row>
                  <Col :span="24">
                    <FormItem
                      name="limit_amount"
                      :colon="true"
                      :required="true"
                      labelAlign="left"
                      :serialNumber="'2'"
                      :rules="[
                        {
                          required: true,
                          message: `${t('common.inputText')}${t('v.discount.activity.Roulette2')}`,
                        },
                      ]"
                    >
                      <template #label>
                        <span
                          class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
                        >
                          2
                        </span>
                        <div class="_zw">
                          {{ t('v.discount.activity.Roulette2') }}
                        </div>
                      </template>
                      <InputNumber
                        min="0"
                        type="text"
                        :size="FORM_SIZE"
                        :placeholder="t('v.discount.activity.Roulette2_p')"
                        stringMode
                        v-model:value="settingsTy_1['limit_amount']"
                      />
                    </FormItem>
                  </Col>
                  <Col :span="24">
                    <FormItem
                      name="withdraw_amount"
                      :colon="true"
                      :required="true"
                      labelAlign="left"
                      :rules="[
                        {
                          required: true,
                          message: `${t('common.inputText')}${t(
                            'v.discount.activity.Roulette1ti',
                          )}`,
                        },
                      ]"
                    >
                      <template #label>
                        <span
                          class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
                        >
                          3
                        </span>
                        <div class="_zw">
                          {{ t('v.discount.activity.Roulette1ti') }}
                        </div>
                      </template>
                      <InputNumber
                        min="0"
                        type="text"
                        :size="FORM_SIZE"
                        :placeholder="t('v.discount.activity.Roulette1_p')"
                        stringMode
                        v-model:value="settingsTy_1['withdraw_amount']"
                        @change="changTextData(1)"
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col :span="24">
                    <FormItem
                      name="first_roll_min_amount"
                      :colon="true"
                      :required="true"
                      labelAlign="left"
                      :rules="[
                        {
                          required: true,
                          message: `${t('common.inputText')}${t('v.discount.activity.Roulette3')}`,
                        },
                      ]"
                    >
                      <template #label>
                        <span
                          class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
                        >
                          4
                        </span>
                        <div class="_zw">
                          {{ t('v.discount.activity.Roulette3') }}
                        </div>
                      </template>
                      <Row>
                        <Col :span="11">
                          <InputNumber
                            min="0"
                            type="text"
                            :size="FORM_SIZE"
                            :placeholder="t('v.discount.activity.Minimum_prize')"
                            stringMode
                            v-model:value="settingsTy_1['first_roll_min_amount']"
                          />
                        </Col>
                        <Col :span="2" class="!text-center mt-2"> ～ </Col>
                        <Col :span="11">
                          <InputNumber
                            min="0"
                            type="text"
                            :size="FORM_SIZE"
                            stringMode
                            :placeholder="t('v.discount.activity.max_prize')"
                            v-model:value="settingsTy_1['first_roll_max_amount']"
                          />
                        </Col>
                      </Row>
                    </FormItem>
                  </Col>
                  <Col :span="24">
                    <FormItem
                      name="daily_roll_times"
                      :colon="true"
                      :required="true"
                      labelAlign="left"
                      :rules="[
                        {
                          required: true,
                          message: `${t('common.inputText')}${t('v.discount.activity.Roulette4')}`,
                        },
                      ]"
                    >
                      <template #label>
                        <span
                          class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
                        >
                          5
                        </span>
                        <div class="_zw">
                          {{ t('v.discount.activity.Roulette4') }}
                        </div>
                      </template>
                      <InputNumber
                        min="0"
                        type="text"
                        :size="FORM_SIZE"
                        :placeholder="t('v.discount.activity.Roulette4_p')"
                        v-model:value="settingsTy_1['daily_roll_times']"
                        @change="changTextData(1)"
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Form>
            </template>
            <!-- 赠送配置+ 组合赠送上限 + 组合管理 -->
            <template #portfolioAll="{ model, field }">
              <Col :span="24">
                <FormItem
                  name="pay"
                  :colon="true"
                  labelAlign="left"
                  :label-col="{ style: { width: '', overflow: 'visible' } }"
                >
                  <template #label>
                    <span
                      class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
                    >
                      6
                    </span>
                    <div class="_zw">
                      <span class="color-red">*</span>{{ t('v.discount.activity.payConfig') }}
                    </div>
                  </template>
                  <RadioGroup v-model:value="settingsTy_1['pay']" @change="handleChangePayConfig">
                    <Radio :value="2">{{ t('v.discount.activity.payConfig2') }}</Radio>
                    <Radio :value="1">{{ t('v.discount.activity.payConfig1') }}</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col :span="24">
                <FormItem
                  name="rules_roll_times"
                  :colon="true"
                  labelAlign="left"
                  :label-col="{ style: { width: '', overflow: 'visible' } }"
                >
                  <template #label>
                    <span
                      class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
                    >
                      7
                    </span>
                    <div class="_zw">
                      <span class="color-red">*</span> {{ t('v.discount.activity.Roulette5') }}
                    </div>
                  </template>
                  <InputNumber
                    min="0"
                    type="text"
                    :size="FORM_SIZE"
                    :placeholder="t('v.discount.activity.Roulette5_p')"
                    v-model:value="settingsTy_1['rules_roll_times']"
                  />
                </FormItem>
              </Col>
              <Form
                :model="settingsTy_1"
                :label-col="{ style: { width: '', overflow: 'visible' } }"
              >
                <Row>
                  <FormItem
                    :colon="true"
                    :required="true"
                    labelAlign="left"
                    @change="ruleTimesChange"
                  >
                    <template #label>
                      <span
                        class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-10px left--25px"
                      >
                        8
                      </span>
                      <div class="_zw">
                        {{ t('v.discount.activity.portfolioName') }}
                      </div>
                    </template>
                    <RadioGroup v-model:value="settingsTy_1.rule_times">
                      <Radio :value="1">{{ t('v.discount.activity.portfolio1') }}</Radio>
                      <Radio :value="2">{{ t('v.discount.activity.portfolio2') }}</Radio>
                      <Radio :value="3">{{ t('v.discount.activity.portfolio3') }}</Radio>
                      <Radio :value="4">{{ t('v.discount.activity.portfolio4') }}</Radio>
                      <Radio :value="5">{{ t('v.discount.activity.portfolio5') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                </Row>
                <div class="overflow-auto mh-360px">
                  <div v-for="(item, index) in settingsTy_1.roll_config" :key="index">
                    <p>{{ `${t('v.discount.activity.roll_config')}${index + 1}` }}:</p>
                    <Row>
                      <Col :span="11">
                        <FormItem name="withdrawPrice" :colon="true" labelAlign="left">
                          <InputGroup compact style="display: flex" class="mb-5">
                            <Select
                              style="width: 200px"
                              class="pay-select br-none"
                              v-model:value="item['roll_type']"
                              :size="FORM_SIZE"
                              :listHeight="500"
                            >
                              <template v-for="option in portfolioConfig">
                                <SelectOption :value="option.value">
                                  {{ option.label }}
                                </SelectOption>
                              </template>
                            </Select>
                            <InputNumber
                              class="pay-input mr-2.5"
                              allowClear
                              :size="FORM_SIZE"
                              min="1"
                              :precision="0"
                              :stringMode="true"
                              v-model:value="item['roll_condition']"
                              :placeholder="`${t('common.inputText')}`"
                            />
                          </InputGroup>

                          <InputGroup
                            compact
                            style="display: flex; margin-top: 20px"
                            v-if="settingsTy_1['pay'] == 1"
                          >
                            <Select
                              style="width: 200px"
                              class="pay-select br-none"
                              :size="FORM_SIZE"
                              v-model:value="item['pay_type']"
                              :listHeight="500"
                            >
                              <template v-for="option in portfolioConfig">
                                <SelectOption :value="option.value">
                                  {{ option.label }}
                                </SelectOption>
                              </template>
                            </Select>
                            <InputNumber
                              class="pay-input mr-2.5"
                              allowClear
                              :size="FORM_SIZE"
                              min="1"
                              :precision="0"
                              v-model:value="item['pay_condition']"
                              :placeholder="`${t('v.discount.activity.pay_condition')}`"
                            />
                          </InputGroup>
                        </FormItem>
                      </Col>
                      <Col :span="1"> </Col>
                      <Col :span="12">
                        <FormItem
                          :label="t('v.discount.activity.roll_times')"
                          :colon="true"
                          labelAlign="left"
                          name="roll_times"
                        >
                          <InputNumber
                            min="1"
                            type="text"
                            :size="FORM_SIZE"
                            :placeholder="`${t('v.discount.activity.roll_times_p')}`"
                            :precision="0"
                            :stringMode="true"
                            v-model:value="item['roll_times']"
                          />
                        </FormItem>
                        <div
                          name="pay_date_type"
                          :colon="true"
                          labelAlign="left"
                          v-if="settingsTy_1['pay'] == 1"
                          class="flex mb-10px"
                        >
                          <div class="flex items-center justify-end">
                            <label slot="lable" class="text-right" style="white-space: nowrap">
                              <BasicHelp
                                placement="top"
                                class="mx-1"
                                :text="`<p><span style='color:#FACD91;'>${$t(
                                  'common.bonus_distribution_date_title',
                                )}</span>${$t('common.bonus_distribution_date_text')}</p>`"
                              />
                              {{ t('v.discount.activity.pay_date_type') }}:
                            </label>
                            <p class="w-10px"></p>
                          </div>
                          <Select
                            v-model:value="item['pay_date_type']"
                            :size="FORM_SIZE"
                            :listHeight="500"
                          >
                            <SelectOption :value="1">
                              {{ t('v.discount.activity.pay_date_type_1') }}
                            </SelectOption>
                            <SelectOption :value="2">
                              {{ t('v.discount.activity.pay_date_type_2') }}
                            </SelectOption>
                          </Select>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Form>
            </template>
            <template #RouletteBase3>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.RouletteBase3') }}</h1>
              </div>
            </template>
            <!-- 号码语言 -->
            <template #phoneLanguage>
              <LangRadioGroup :contentList="contentList" @click:radio="handlePhoneDetail" />
            </template>
            <!-- 号码配置 -->
            <template #phoneConfig>
              <phoneUpload :phonelang="phonelang" :activityid="getDeatilId" />
            </template>
            <!-- 奖金清零 -->
            <template #period="{ model, field }">
              <Row>
                <Col :span="16">
                  <FormItem :colon="true">
                    <RadioGroup
                      v-model:value="model[field]"
                      @change="periodChange"
                      :disabled="model['ids']"
                    >
                      <!-- <Radio :value="86400">1天</Radio> -->
                      <Radio :value="259200">{{ t('v.discount.activity.three_day') }}</Radio>
                      <Radio :value="604800">{{ t('v.discount.activity.serven_day') }}</Radio>
                      <Radio :value="0">{{ t('table.discountActivity.discount_no_limit') }}</Radio>
                      <Radio :value="5">{{ t('v.discount.activity.customize') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col :span="8" v-if="model[field] === 5">
                  <FormItem :required="true" :label="t('common.days')" :colon="true">
                    <InputNumber
                      min="0"
                      max="999"
                      :precision="0"
                      :size="FORM_SIZE"
                      v-model:value="periodModel"
                      :placeholder="t('common.input_set_days')"
                      :disabled="model['ids']"
                      @change="changTextData(1, 5)"
                    />
                  </FormItem>
                </Col>
              </Row>
            </template>
            <!-- 参与次数 -->
            <template #applyLimit="{ model, field }">
              <Row>
                <Col :span="16">
                  <FormItem disabled>
                    <RadioGroup v-model:value="model[field]" :disabled="model['ids']">
                      <Radio :value="1">{{ t('v.discount.activity.customize_one') }}</Radio>
                      <Radio :value="2">{{ t('v.discount.activity.customize_two') }}</Radio>
                      <Radio :value="3">{{ t('v.discount.activity.customize_three') }}</Radio>
                      <Radio :value="0">{{ t('table.discountActivity.discount_no_limit') }}</Radio>
                      <Radio :value="5">{{ t('v.discount.activity.customize') }}</Radio>
                    </RadioGroup>
                  </FormItem>
                </Col>
                <Col :span="8" v-if="model[field] === 5">
                  <FormItem :required="true" :label="t('v.discount.activity.frequency')">
                    <InputNumber
                      min="0"
                      max="999"
                      :size="FORM_SIZE"
                      :precision="0"
                      v-model:value="applyLimit"
                      :placeholder="t('v.discount.activity.please_enter')"
                      :disabled="model['ids']"
                    />
                  </FormItem>
                </Col>
              </Row>
            </template>
            <!-- 红包配置 -->
            <template #RedEnvelope>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.RedEnvelope') }}</h1>
              </div>
            </template>
            <template #activity17>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('common.active_text3') }}</h1>
              </div>
            </template>
            <!-- 红包模板 -->
            <template #configTemSlot="{ model, field }">
              <LangRadioGroup
                class="!-mt-2"
                :selecIndex="defaultTemp"
                :contentList="tempList"
                @update:click="changeTemp"
                v-model="model[field]"
              />
              <!-- :disabledType="disabledType" -->
            </template>
            <template #dropEnvelope>
              <FormItem
                :label="t('v.discount.activity.dropEnvelope')"
                :colon="true"
                :required="true"
                class="dropEnvelope"
                :labelCol="{ style: { width: labelWidth + 'px' } }"
              >
                <RadioGroup v-model:value="dropStyle" @change="changdropStyle">
                  <Radio :value="1">
                    <img :src="drop_1" :style="{ width: '35px', height: '40px' }" />
                  </Radio>
                  <Radio :value="2">
                    <img :src="drop_2" :style="{ width: '35px', height: '40px' }" />
                  </Radio>
                  <Radio :value="3">
                    <img :src="drop_3" :style="{ width: '35px', height: '40px' }" />
                  </Radio>
                </RadioGroup>
              </FormItem>
            </template>
            <!-- 红包配置 -->
            <template #redEnvelope>
              <!-- 新模版 -->
              <!-- 红包红包 -->
              <redLope
                ref="newRefRedEmvelope"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                @update:model-value="handleChangeCurryId"
                v-if="defaultTemp == 1"
                :getDeatilId="timedIdisable"
                :form_data="get_leftValues"
                :type="1"
              />
              <dollarWaves ref="refRedEmvelope" v-if="defaultTemp == 2" />
            </template>
            <!-- activity17_table -->
            <template #activity17_table>
              <activity17_table
                ref="activity17_table_"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                @update:model-value="handleChangeCurryId"
                :getDeatilId="timedIdisable"
                :form_data="form_data"
              />
            </template>

            <!-- 负盈利配置 -->
            <template #NegativeConfig>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.NegativeConfig') }}</h1>
              </div>
            </template>
            <template #NegativeConfigType v-if="platform_range == 2">
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
            <!-- 每日投注奖励 -->
            <template #everydayBetTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.every_bet') }}</h1>
              </div>
            </template>
            <!-- 每日投注：领取条件 -->
            <template #rewardConfigSlot>
              <everydayBet
                ref="everydayBetRef"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
              />
            </template>
            <!-- 幸运赌注配置 -->
            <template #luckyBetBetTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.luckyBet') }}</h1>
              </div>
            </template>
            <!-- 幸运赌注: 奖励配置 -->
            <template #Lucky_betSlot>
              <luckyBet
                ref="Lucky_betSlot"
                :incentiveConfig="incentiveConfig"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                :XYtableData="XYtableData"
                :getDeatilId="Timestamp_before_disabled"
                @update:model-value="handleChangeCurryId"
              />
            </template>
            <!-- 充值配置 -->
            <template #chargeTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.chargeBet') }}</h1>
              </div>
            </template>
            <template #reward_config_slot>
              <RadioGroup
                v-model:value="selectDayValue"
                option-type="button"
                button-style="solid"
                size="large"
                @change="changDayValue"
              >
                <RadioButton :value="2" size="large">{{ t('common.mystery4') }}</RadioButton>
                <RadioButton :value="3" size="large">{{ t('common.mystery5') }}</RadioButton>
                <RadioButton :value="7" size="large">{{ t('common.mystery6') }}</RadioButton>
                <RadioButton :value="15" size="large">{{ t('common.mystery7') }}</RadioButton>
                <RadioButton :value="30" size="large">{{ t('common.mystery8') }}</RadioButton>
              </RadioGroup>
            </template>
            <!-- 神秘盲盒：奖励配置 -->
            <template #chargeDetail15_slot>
              <mysteryDetail
                ref="mysteryDetailRef"
                v-model:mysterySource="mysterySource"
                :current="currentCurryId"
                :selectValue="selectDayValue"
                :getDeatilId="timedIdisable"
                v-if="mysteryShow"
              />
            </template>
            <template #chargeDetail_slot>
              <RewardForm
                ref="rewardFormValidate"
                :current="currentCurryId"
                :selectValue="rewardMethodsSelected"
                :getDeatilId="timedIdisable"
              />
            </template>
            <!-- 签到配置 -->
            <template #checkIn_Title>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.checkIn_Title') }}</h1>
              </div>
            </template>
            <!-- 签到组件 -->
            <template #activity9_sign_in>
              <activity9_sign_in
                ref="activity9_sign_in_table_"
                v-model="currentCurryId"
                :form_data="form_data"
                class="-mt-30px"
              ></activity9_sign_in>
            </template>
            <!-- 代理额外日奖励 -->
            <template #agentDaysTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.agent_days_reward') }}</h1>
              </div>
            </template>
            <template #agentMonthsTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.agentMonthsTitle') }}</h1>
              </div>
            </template>
            <!-- 代理额外日奖励 -->
            <template #agentDays_slot>
              <AgentDaysForm
                ref="agentDaysFormValidate"
                :current="currentCurryId"
                :selectValue="agentRewardMethodsSelected"
                :type="'Agent'"
                :getDeatilId="timedIdisable"
              />
            </template>
            <!-- 代理额外月奖励 -->
            <template #agentMonths_slot>
              <AgentMonthsForm
                ref="agentMonthsFormValidate"
                :current="currentCurryId"
                :selectValue="agentRewardMethodsSelected"
                :getDeatilId="timedIdisable"
                :type="'Agent'"
              />
            </template>
            <!-- 逢8会员日配置 -->
            <template #Every8MemberTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.every8MemberTitle') }}</h1>
              </div>
            </template>
            <!-- 每日投注 -->
            <template #memberDayConfigSlot>
              <memberDay
                ref="memberDayRef"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                :type="'memberDay'"
                :getDeatilId="timedIdisable"
              />
            </template>
            <!-- 奖金条件 -->
            <template #activity12_table>
              <activity12_table
                ref="activity12_table_"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                @update:model-value="handleChangeCurryId"
                :getDeatilId="timedIdisable"
                :initData="initData12"
                :form_data="form_data"
              />
            </template>
            <!-- 定点充值 -->
            <template #RechargeAmountTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.RechargeAmountTitle') }}</h1>
              </div>
            </template>
            <!-- 定点时间 -->
            <template #fixedTime>
              <Row>
                <Col :span="11">
                  <FormItem>
                    <TimePicker
                      :size="FORM_SIZE"
                      value-format="HH:mm:ss"
                      style="width: 100%"
                      :allowClear="false"
                      v-model:value="get_leftValues13.fixed_start_at"
                      @change="
                        () => {
                          changTime('fixed_start_at');
                        }
                      "
                      :disabled="timedIdisable"
                    />
                  </FormItem>
                </Col>
                <Col :span="2">
                  <div class="w-full h-full">
                    <div class="line"></div>
                  </div>
                </Col>
                <Col :span="11">
                  <FormItem>
                    <TimePicker
                      :size="FORM_SIZE"
                      style="width: 100%"
                      value-format="HH:mm:ss"
                      :allowClear="false"
                      v-model:value="get_leftValues13.fixed_end_at"
                      @change="
                        () => {
                          changTime('fixed_end_at');
                        }
                      "
                      :disabled="timedIdisable"
                    />
                  </FormItem>
                </Col>
              </Row>
            </template>
            <!-- 定点充值活动: 奖励配置 -->
            <template #rechargeConfigSlot>
              <activity13_table
                ref="rechargeDayRef"
                v-model="currentCurryId"
                :type="'rechargeDay'"
                :getDeatilId="timedIdisable"
              ></activity13_table>
            </template>
            <!-- 钱包支付配置 -->
            <template #wallet_Title>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.wallet_Title') }}</h1>
              </div>
            </template>
            <!-- 钱包充值组件 -->
            <template #wallet_slot>
              <wallet
                ref="wallet_slot"
                v-model:selectList="selectList"
                :currencyName_="currencyName"
                :clientList="clientList"
                :incentiveConfig="incentiveConfig"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                :XYtableData="XYtableData"
                :getDeatilId="false"
                :getDeatilId1="Timestamp_before_disabled"
              />
            </template>
            <!-- 钱包支付充值： 充值配置表 -->
            <template #chargeDetail14_slot>
              <RewardForm
                ref="rewardFormValidate"
                :current="currentCurryId"
                :selectValue="rewardMethodsSelected"
                :getDeatilId="timedIdisable"
              />
            </template>
            <!-- 神秘盲盒配置 -->
            <template #mysteryTitle>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.mysteryTitle') }}</h1>
              </div>
            </template>
            <!-- 邀请好友 -->
            <template #validInvitationCriteria>
              <div class="display-flex">
                <div class="w-2 h-4 mt-1 mr-2 bg-blue-500 ml--25px"></div>
                <h1>{{ t('v.discount.activity.valid_invitation_criteria') }}</h1>
              </div>
            </template>
            <!-- 邀请好友: 奖金方式配置表 -->
            <template #inviteFriendsBonusTypeTable>
              <InviteFriendsBonusTypeTable
                ref="inviteFriendsBonusTypeTabldeRef"
                :current="currentCurryId"
                v-model:selectType="inviteFriendsInfo.inviteFriendsBonusTypeSelected"
                v-model:tableInfo="inviteFriendsInfo.inviteFriendsBonusTypeInfo"
              />
            </template>

            <!-- 奖励样式 -->
            <template #bonusTpl="{ model }">
              <div class="bonus-tpl-container">
                <div v-for="(item, index) in bonusTplOptions" :key="item.value" class="bonus-item">
                  <div class="bonus-row">
                    <RadioGroup v-model:value="model.bonus_tpl">
                      <Radio :value="item.value">{{ item.label }}</Radio>
                    </RadioGroup>
                    <div class="icon-preview-container">
                      <span @click.stop="toggleSingleIcon(index)" class="eye-icon">
                        <component
                          :is="activeIndex === index ? EyeOutlined : EyeInvisibleOutlined"
                        />
                      </span>
                      <img
                        v-if="activeIndex === index"
                        :src="item.previewUrl"
                        alt="previewUrl"
                        class="preview-image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- 奖金条件 -->
            <template #activity16_table>
              <activity16_table
                ref="activity16_table_"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                @update:model-value="handleChangeCurryId"
                :getDeatilId="timedIdisable"
                :form_data="form_data"
              />
            </template>

            <!-- 会员答谢礼 -->
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
        </div>
        <div class="w-80px" v-if="showType"></div>
        <div class="flex-1 2" v-if="showType">
          <BasicForm
            :size="FORM_SIZE"
            @register="registerFormBaseRight"
            :schemas="
              processSetingData(defaultTy, 'activeTitle2')?.filter(
                (item) => item.labelPrefixWidth == 'right',
              )
            "
            @field-value-change="fieldChang"
            layout="horizontal"
          >
            <!-- 红包配置：奖金方式 -->
            <template #redEnvelope2>
              <redLope
                ref="newRefRedEmvelope2"
                v-model="currentCurryId"
                v-model:firstCurrencyId="firstCurrencyId"
                @update:model-value="handleChangeCurryId"
                v-if="defaultTemp == 1"
                :getDeatilId="timedIdisable"
                :form_data="form_data"
                :type="2"
              />
            </template>
            <!-- 签到活动：额外奖励 -->
            <template #activity9_additional>
              <activity9_additional
                ref="activity9_additional_table_"
                v-model="currentCurryId"
                class="-mt-30px"
                :form_data="form_data"
              ></activity9_additional>
            </template>
            <template #settings="{ model, field }">
              <div class="ml-0 overflow-auto h-500px">
                <Row v-for="(item, index) in settingsTy_2">
                  <Col :span="9">
                    <FormItem :key="index">
                      <div
                        v-if="index == 0"
                        :class="[
                          '!w-100% text-center',
                          index === 0 ? 'h-40px leading-40px mb-20px' : 'no-mb',
                        ]"
                      >
                        <span
                          class="flex justify-center items-center w-20px h-20px rounded-full bg-#344552 text-white font-bold absolute top-2px left--25px"
                        >
                          11
                        </span>
                        <span class="content-style">*</span>
                        {{ t('v.discount.activity.Effective_outreach') }}(≥)
                      </div>
                      <div v-if="index == 0" class="mb-2"></div>
                      <InputNumber
                        class="!w-86% right"
                        :placeholder="t('v.discount.activity.Personal_Player')"
                        :size="FORM_SIZE"
                        v-model:value="item.ppl"
                        :min="0"
                        :precision="0"
                        :disabled="model['id'] && model['ty2']"
                      />
                    </FormItem>
                  </Col>
                  <Col :span="9" offset="1">
                    <FormItem>
                      <div
                        :class="[
                          '!w-100% text-cente',
                          index === 0 ? 'h-40px leading-40px mb-20px' : 'no-mb',
                        ]"
                      >
                        <label v-if="index == 0">
                          <span class="content-style">*</span>
                          {{ t('v.discount.activity.amount_bonus') }}
                        </label>
                      </div>
                      <div v-if="index == 0" class="mb-2"></div>
                      <InputNumber
                        :placeholder="t('v.discount.activity.amount_bonus')"
                        :addon-after="model['bonus_type'] == 2 ? t('common.translate.word15') : ''"
                        :size="FORM_SIZE"
                        :stringMode="true"
                        :precision="2"
                        v-model:value="item.bonus"
                        :disabled="model['id'] && model['ty2']"
                        @change="changTextData(2)"
                      />
                    </FormItem>
                  </Col>
                  <Col :span="5">
                    <div
                      v-if="index == 0"
                      :class="[
                        '!w-100% text-center',
                        index === 0 ? 'h-40px leading-40px mb-20px' : 'no-mb',
                      ]"
                      >{{ t('v.discount.activity.operation') }}</div
                    >
                    <div class="flex">
                      <a
                        @click="addRateConfigty_2"
                        class="m-l-5"
                        :class="{ 'disabled-link': !!(model['id'] && model['ty2']) }"
                        :style="{
                          'pointer-events': !!(model['id'] && model['ty2']) ? 'none' : 'auto',
                          opacity: !!(model['id'] && model['ty2']) ? 0.5 : 1,
                        }"
                        ><img :src="RECT_ADD" class="h-40px"
                      /></a>
                      <a
                        @click="removeRateConfigty_2(item)"
                        v-if="index > 0"
                        class="m-l-5px"
                        :class="{ 'disabled-link': !!(model['id'] && model['ty2']) }"
                        :style="{
                          'pointer-events': !!(model['id'] && model['ty2']) ? 'none' : 'auto',
                          opacity: !!(model['id'] && model['ty2']) ? 0.5 : 1,
                        }"
                        ><img :src="RECT_DELETE" class="h-40px"
                      /></a>
                    </div>
                  </Col>
                </Row>
              </div>
            </template>
          </BasicForm>
        </div>
      </div>
    </div>
    <div class="activeBox">
      <div class="activHeader">
        <h3>{{ t('common.activeTitle3') }}</h3>
      </div>
      <div class="flex activContent">
        <div class="flex-1">
          <BasicForm
            :size="FORM_SIZE"
            @register="registerFormSettingContent"
            :schemas="
              processSetingData(defaultTy, 'activeTitle3')?.filter((item) => item.field == 'banner')
            "
            layout="horizontal"
          >
            <template #uploadImageText>
              <!-- <div> {{ t('common.pic_format_msg') }}</div> -->
              <div>
                {{
                  `${t('common.pic_format')}：WEBP, PNG, JPEG， ${t(
                    'common.pic_size',
                  )}： ${getActiveWidth(currentTpl, 'w*h')}，${t('common.size')}：500KB`
                }}</div
              >
            </template>
            <template #uploadImage>
              <div>
                <FormItemRest>
                  <LangRadioGroup
                    :contentList="contentList.filter(({ value }) => value !== 'original')"
                    @click:radio="handleClickContentImg"
                  />
                  <div class="w-full m-t-5 h-354px">
                    <BaseUploadImage
                      name="uploadfile"
                      :upload-text="t('modalForm.system.system_drag_doc_tip')"
                      :isUploadTextBotom="true"
                      :maxNumber="3"
                      :maxSize="500"
                      :sizeUnit="'KB'"
                      :showUploadList="true"
                      :isShowPopover="true"
                      :height="getActiveWidth(currentTpl, 'h')"
                      :width="getActiveWidth(currentTpl, 'w')"
                      :CheckSize="true"
                      :url="currentLangImg?.image_url"
                      :apiMap="apiMap"
                      :file-list="currentLangImg?.fileList"
                      :accept="'image/webp,image/png,image/jpeg'"
                      @change="handleChangeUpload"
                      @remove="handleRemoveUpload"
                    />
                  </div>
                </FormItemRest>
              </div>
            </template>
          </BasicForm>
        </div>
        <div class="w-50px"></div>
        <div class="flex-1">
          <BasicForm
            :size="FORM_SIZE"
            @register="registerFormSettingContent"
            :schemas="
              processSetingData(defaultTy, 'activeTitle3')?.filter((item) => item.field != 'banner')
            "
            layout="horizontal"
          >
            <template #activeContent="{ model, field }">
              <RadioGroup v-model:value="model[field]" @change="handleChangePopContent">
                <Radio :value="1">{{ t('common.text') }}</Radio>
                <!-- <Radio :value="2">{{ t('common.pic') }}</Radio> -->
              </RadioGroup>
            </template>
            <template #ruleType="{ model, field }">
              <RadioGroup v-model:value="model[field]" @change="handleChangeRuleType">
                <Radio :value="1">{{ t('v.discount.activity.rule_type_1') }}</Radio>
                <Radio :value="2">{{ t('v.discount.activity.rule_type_2') }}</Radio>
              </RadioGroup>
            </template>
            <template #uploadColor="{ model, field }">
              <input-color v-model="bgColor" @update:modelValue="colorValue" />
            </template>
            <template #uploadTextRule>
              <div>
                <FormItem required>
                  <LangRadioGroup
                    class="!m-b-5"
                    :contentList="contentListDetail"
                    :showTranslation="true"
                    @click:radio="handlelanguageLevelTextConfig"
                    @click:translation="handleClickTranslation"
                  />
                  <Tinymce
                    v-if="showColor"
                    v-model="currentLangText.transitionValue"
                    :showImageUpload="true"
                    :TinBg="bgColor"
                    :height="354"
                    @change="handleTinymceChange"
                  />
                </FormItem>
              </div>
            </template>
            <template #uploadText>
              <div>
                <FormItem required v-if="currentLang">
                  <LangRadioGroup
                    class="!m-b-5"
                    :contentList="contentList"
                    @click:radio="handlelanguageLevelText"
                  />
                  <Textarea
                    :rows="16"
                    :width="800"
                    v-model:value="currentLang.textContent"
                    style="height: 354px"
                    disabled
                  />
                </FormItem>
              </div>
            </template>
            <template #previewText>
              <div class="w-full h-1 p-2 overflow-y-scroll border border-gray-300 h-400px bg">
                <div class="tg-rich-area" v-html="currentLang?.transitionValue"></div>
              </div>
            </template>
            <template #uploadImage>
              <div>
                <FormItemRest>
                  <LangRadioGroup :contentList="contentList" @click:radio="handleClickContent" />
                  <div class="w-full m-t-5 h-354px">
                    <BaseUploadImage
                      name="uploadfile"
                      :upload-text="t('modalForm.system.system_drag_doc_tip')"
                      :maxNumber="3"
                      :maxSize="500"
                      :sizeUnit="'KB'"
                      :showUploadList="true"
                      :isShowPopover="true"
                      :height="480"
                      :width="1300"
                      :CheckSize="true"
                      :url="currentLang?.text_image_url"
                      :apiMap="apiMap"
                      :file-list="currentLang?.textFileList"
                      :accept="'image/webp,image/png,image/jpeg'"
                      @change="handleChangeUploadText"
                      @remove="handleRemoveUploadText"
                    />
                  </div>
                </FormItemRest>
              </div>
            </template>
          </BasicForm>
        </div>
      </div>
    </div>
    <buttonTextModal @emits-values="emitsValues" @register="textModal" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import {
    RadioGroup,
    Input,
    FormItem,
    Row,
    Col,
    FormItemRest,
    Switch,
    Upload,
    message,
    CheckboxGroup,
    Checkbox,
    InputNumber,
    Textarea,
    Radio,
    Tooltip,
    Form,
    DatePicker,
    Select,
    SelectOption,
    InputGroup,
    TimePicker,
    RadioButton,
  } from 'ant-design-vue';
  import {
    ref,
    onMounted,
    reactive,
    watch,
    h,
    computed,
    onBeforeMount,
    onUnmounted,
    nextTick,
    onBeforeUnmount,
  } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Button } from '/@/components/Button/index';
  import { Icon } from '/@/components/Icon';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import LangRadioGroup from './LangRadioGroup.vue';
  import CurryRadioGroup from './CurryRadioGroup.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLocalList } from '/@/settings/localeSetting';
  import {
    processSetingData,
    portfolioConfig,
    dayObj,
    rewardTextObj,
    unitObj,
    cycleModeObj,
    firstChargeObj,
    currencyList14,
    labelWidth,
  } from './index.data';
  import {
    get_text_ty1,
    get_text_ty7,
    getTypeObj,
    getTypeObj2,
    get_text_ty9,
    get_text_ty10,
    get_text_ty11,
    get_text_ty14,
    get_text_ty12,
    get_text_ty13,
    get_text_ty17,
    get_text_ty16,
    get_text_ty3,
  } from './index.text';
  import { BaseUploadImage } from '/@/components/BaseUploadImage';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import dollarWaves from './components/dollarWaves/index.vue';
  // import redLope from './components/redLope/index.vue';
  import redLope from './components/new_redLope/index.vue';
  import activity17_table from './components/activity17/index.vue';
  import activity16_table from './components/activity16/index.vue';
  import activity12_table from './components/activity12/index.vue';
  import activity13_table from './components/activity13/index.vue';
  import everydayBet from './components/everydayBet/index.vue';
  import luckyBet from './components/luckyBet/index.vue';
  import activity9_sign_in from './components/activity9/signIn.vue';
  import activity9_additional from './components/activity9/index.vue';
  import wallet from './components/wallet/table.vue';
  import memberDay from './components/memberDay/index.vue';
  import phoneUpload from './components/sg-upload.vue';
  import {
    updatePromoActive,
    insertPromoActive,
    uploadPromoImage,
    getPromoDetail,
    getCategoryList,
  } from '/@/api/activity';
  import { convertSecondsToDays, getDayOfWeek, getTimestampFromDate } from '/@/utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { Tinymce } from '/@/components/Tinymce/index';
  import translateContentList from '/@/views/common/language';
  import buttonTextModal from './buttonTextModal.vue';
  import { useRouter } from 'vue-router';
  import { transform } from 'lodash-es';
  import { getDataTypePreviewUrl } from '/@/utils/helper/paramsHelper';
  import type { Rule, FormInstance } from 'ant-design-vue/es/form';
  import { useSystemStore } from '/@/store/modules/system';
  import drop_1 from '/@/assets/images/reportDataCards/drop_1.webp';
  import drop_2 from '/@/assets/images/reportDataCards/drop_2.webp';
  import drop_3 from '/@/assets/images/reportDataCards/drop_3.png';

  import { periodList, periodListBilling } from '../../common/setting';
  import { useModal } from '/@/components/Modal';
  import { BasicHelp } from '/@/components/Basic';
  import { useLocale } from '/@/locales/useLocale';
  import dayjs, { Dayjs } from 'dayjs';
  import { currentyOptions } from '/@/settings/commonSetting';
  import eventBus from '/@/utils/eventBus';
  import { useGameSortStore } from '/@/store/modules/gameSort';
  import CdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import RewardForm from './components/chargeDetail/index.vue';
  import mysteryDetail from './components/mysteryDetail/index.vue';
  import AgentDaysForm from './components/agentDaysDetail/index.vue';
  import AgentMonthsForm from './components/agentMonthsDetail/index.vue';
  import {
    useActiveMainOptions,
    useActiveOptions,
    useActiveOptionsTy,
  } from '/@/views/common/commonSetting';
  import InputColor from '@/components-cd/colorpicker/colorpicker.vue';
  import { getActiveWidth } from '/@/views/common/common';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import { useLocaleStoreWithOut } from '/@/store/modules/locale';
  import InviteFriendsBonusTypeTable from './InviteFriendsBonusTypeTable.vue';
  import utc from 'dayjs/plugin/utc';
  import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';
  import RedPocket from '/@/assets/svg/promote-box/red-pocket.png';
  import Box from '/@/assets/svg/promote-box/box.png';
  import BackgroundBox from '/@/assets/svg/promote-box/background-box.png';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import TableCheckbox from '@/components/TableCheckbox/index.vue';
  import { cloneDeep } from 'lodash-es';
  import { isEqual } from 'lodash-es';

  let { currencyTreeList } = useTreeListStore();

  const cloneDeepInitData12 = ref({
    staticType0: {
      adwardType0: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType1: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
      adwardType2: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType3: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
    },
    staticType1: {
      adwardType0: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType1: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
      adwardType2: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType3: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
    },
    staticType2: {
      adwardType0: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType1: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
      adwardType2: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType3: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
    },
    staticType3: {
      adwardType0: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType1: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
      adwardType2: [
        {
          d: undefined,
          b: undefined,
        },
      ],
      adwardType3: [
        {
          d: undefined,
          b: undefined,
          e: undefined,
        },
      ],
    },
  }); // 参拷贝原始数据
  const currencyTreeList12 = ref({}); // 参拷贝后数据
  const originalData12 = ref({}); // 回显拿到的数据
  const initData12 = ref({}); // 当前选择的数据
  // currencyTreeList=currencyTreeList.map((item) => {
  //   return {
  //     ...item,
  //     value: item.id,
  //     label: item.name,
  //     key: item.id,
  //   };
  // });
  dayjs.extend(utc);

  const activeIndex = ref(null);

  function toggleSingleIcon(index) {
    activeIndex.value = activeIndex.value === index ? null : index;
  }

  const chosenLang18 = ref([]);
  const promoForm = ref();

  const currentLanguage = useLocaleStoreWithOut();
  const { activeOptions } = useActiveOptions();
  const { activityMainMap } = useActiveMainOptions();
  const { activeOptionsTy } = useActiveOptionsTy();
  const { t } = useI18n();

  const bonusTplOptions = [
    {
      label: t('v.discount.activity.bonus_tpl_1'),
      value: 1,
      previewUrl: RedPocket,
    },
    {
      label: t('v.discount.activity.bonus_tpl_2'),
      value: 2,
      previewUrl: Box,
    },
    {
      label: t('v.discount.activity.bonus_tpl_3'),
      value: 3,
      previewUrl: BackgroundBox,
    },
  ];

  const inviteFriendsBonusTypeTabldeRef = ref();
  const logInOptions = [
    {
      label: t('v.discount.activity.not_log_in'),
      value: 1,
    },
    {
      label: t('v.discount.activity.log_in'),
      value: 2,
    },
  ];
  const popOptions = [
    {
      label: t('v.discount.activity.not_log_in'),
      value: '1',
    },
    {
      label: t('v.discount.activity.log_in'),
      value: '3',
    },
  ];

  const [
    registerFormBaseLeft,
    {
      validate: SettingBaseLeft,
      setFieldsValue: setFieldsBaseLeft,
      getFieldsValue: getFieldsBaseLeft,
      updateSchema: updateSchema,
    },
  ] = useForm({
    // labelCol: { class: 'pl-25px' },
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    colon: true,
    labelAlign: 'left',
    showActionButtonGroup: false,
  });

  const [
    registerFormBaseRight,
    {
      validate: SettingBaseRight,
      setFieldsValue: setFieldsBaseRight,
      getFieldsValue: getFieldsBaseRight,
      clearValidate: clearValidate,
    },
  ] = useForm({
    labelWidth: 120,
    // labelCol: { class: '!pl-20px' },
    baseColProps: {
      span: 24,
    },
    colon: true,
    labelAlign: 'left',
    showActionButtonGroup: false,
  });

  const [
    registerFormSettingLeft,
    {
      validate: SettingLeft,
      setFieldsValue: setFieldsValueSettingLeft,
      getFieldsValue: getFieldsValueSettingLeft,
    },
  ] = useForm({
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    colon: true,
    labelAlign: 'left',
    showActionButtonGroup: false,
  });

  const [
    registerFormSettingRight,
    {
      validate: SettingRight,
      setFieldsValue: setFieldsValueSettingRight,
      getFieldsValue: getFieldsValueSettingRight,
    },
  ] = useForm({
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    colon: true,
    labelAlign: 'left',
    showActionButtonGroup: false,
  });

  const [
    registerFormSettingContent,
    {
      validate: SettingContent,
      setFieldsValue: setFieldsValueSettingContent,
      getFieldsValue: getFieldsValueSettingContent,
    },
  ] = useForm({
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    colon: false,
    labelAlign: 'left',
    showActionButtonGroup: false,
  });
  const setFieldsValueLeft = async (obj) => {
    if (haveCommonKey(obj, await getFieldsValueSettingLeft())) {
      setFieldsValueSettingLeft(obj);
    }
    if (haveCommonKey(obj, await getFieldsValueSettingRight())) {
      setFieldsValueSettingRight(obj);
    }
    setFieldsBaseLeft(obj);
    if (showType.value) setFieldsBaseRight(obj);
    setFieldsValueSettingContent(obj);
  };

  async function getFieldsValue() {
    const promises = [
      getFieldsValueSettingLeft(),
      getFieldsValueSettingRight(),
      getFieldsBaseLeft(),
      getFieldsValueSettingContent(),
    ];

    // 根据 showType 条件添加 getFieldsBaseRight
    if (showType.value) {
      promises.push(getFieldsBaseRight());
    }

    const results = await Promise.all(promises);

    // 使用解构来构建数据对象
    const data = {
      ...results[0], // data1
      ...results[1], // data2
      ...results[2], // data3
      ...(showType.value ? results[3] : {}), // data4, only if showType is true
      ...results[results.length - 1], // data5 (getFieldsBaseRight if showType is true)
    };
    return data;
  }
  async function getFieldsValue1() {
    const promises = [
      getFieldsValueSettingLeft(),
      getFieldsValueSettingRight(),
      getFieldsBaseLeft(),
      // getFieldsValueSettingContent(),
    ];

    // 根据 showType 条件添加 getFieldsBaseRight
    if (showType.value) {
      promises.push(getFieldsBaseRight());
    }

    const results = await Promise.all(promises);

    // 使用解构来构建数据对象
    const data = {
      ...results[0], // data1
      ...results[1], // data2
      ...results[2], // data3
      ...(showType.value ? results[3] : {}), // data4, only if showType is true
      // ...results[results.length - 1], // data5 (getFieldsBaseRight if showType is true)
    };

    return data;
  }

  // 检查是否有相同的键
  function haveCommonKey(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // 检查是否有至少一个共同的键
    return keys1.some((key) => keys2.includes(key));
  }

  const typeKeys = {
    1: 'constants',
    2: 'arbitrary',
    3: 'rateMoney',
  };
  interface rewardFormElement extends HTMLElement {
    overallVerification: () => void;
    conditions: any[];
  }
  const gameSortStore = useGameSortStore();
  const systemStore = useSystemStore();
  onBeforeMount(async () => {
    //编辑
    if (history.state.id) {
      await gameSortStore.setgame_typeList().then(() => {
        getEditData().then(() => {
          info_venue();
        });
      });
      disabledType.value = true;
      bigTitle.value = t('v.discount.activity_editor');
    } else {
      await gameSortStore.setgame_typeList().then(() => {
        info_venue();
      }); //调用游戏类型接口
    }
  });

  const bgColor = ref('#D9D9D9');
  const showColor = ref(true);
  // 活动分类
  const categoryIDList = ref([]);

  const clientList = ref([]);
  const XYtableData = ref();
  const tabValue = ref<string>('1');
  const platform_ids = ref([]);
  const systemCurrency = ref('');
  const rewardFormValidate = ref<rewardFormElement | null>(null);
  const mysteryDetailRef = ref(null);
  const agentDaysFormValidate = ref<rewardFormElement | null>(null);
  const agentMonthsFormValidate = ref<rewardFormElement | null>(null);
  const agentDaysMinAndMax = ref<any>({});
  const agentMonthsMinAndMax = ref<any>({});
  const activity9_sign_in_table_ = ref<any>(null);
  const activity9_additional_table_ = ref<any>(null);
  const selectDayValue = ref(2);

  const createConfig = () => ({
    reset_mode: 'one',
    award_mode: 'recharge',
    reward_config: {
      '2': createReward(),
      '3': createReward(),
      '7': createReward(),
      '15': createReward(),
      '30': createReward(),
    },
  });

  const createReward = () => ({
    award_type: '0',
    recharge_config: [
      { deposit: '', show_min: '', show_max: '' },
      { deposit: '', show_min: '', show_max: '' },
    ],
    reward_cond: {
      '0': [{ bet_multiple: '', min: '', max: '', key: 1, index: 1 }],
      '1': [{ bet_multiple: '', min: '', max: '', key: 1, index: 1 }],
    },
  });

  const mysterySource = ref(
    currencyTreeList.reduce((acc, item) => {
      acc[item.id] = createConfig();
      return acc;
    }, {}),
  );

  const everyDayBetActiveText = reactive({
    day: dayObj[1],
    rewardText: rewardTextObj[1],
    getType: getTypeObj[1],
    money: {},
    multipleCount: 0,
    memberDayaward: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
      tl_PH: 0,
      ko_KR: 0,
    },
    memberRecharge: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
      tl_PH: 0,
      ko_KR: 0,
    },
  });

  const rechargeActiveText = reactive({
    bet: '',
    rechargeMount: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
      tl_PH: 0,
      ko_KR: 0,
    },
    rechargeBet: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
      tl_PH: 0,
      ko_KR: 0,
    },
  });

  // 充值动态文字
  const chargeDynamicText = reactive({
    // 时间
    time: 0,
    // 时间单位
    timeUnit: unitObj[1],
    // 钱列表
    money: {},
    // 当前钱列表
    currentMoney: {},
    // 1不用审核
    getType: getTypeObj2[1],
    // 3的时候显示第几天用的
    dayList: [],
    // 当前充值类型吧
    currentType: 1,
    // 循环方式
    cycleText: {},
    // 是否限制
    isLimit: 0,
  });

  const dropStyle = ref<any>(1);
  const active_ontent = ref<any>(1);
  const rule_type = ref<any>(1);
  // 每日奖励活动配置数据
  const everydayBetRef = ref<any>(null);
  const memberDayRef = ref<any>(null);
  const rechargeDayRef = ref<any>(null);
  // 奖励方式 1: 全部可领取 2: 只领取最高档
  const rewardMethods = ref(1);
  const maxReward = ref(0);
  const sumReward = ref(0);
  const selectedCurrencyName = ref('');

  const timezone = ref('');

  const venueList: any = ref([
    {
      label: t('table.system.system_electronic'),
      value: '1',
      id: '',
      list: [
        { name: 'pg', state: 1 },
        { name: 'pp', state: 2 },
        { name: 'pp1', state: 1 },
      ],
    },
  ]);
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
          name: item.name,
          value: item.platform_id,
          state: platform_ids.value.some((el) => el == item.platform_id) ? 1 : 2,
        };
      });
    getgame_typeList = getgame_typeList.filter((item: any) => {
      return item.name != '全部' && item.game_type != '6';
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
    setFieldsValueLeft({ incentiveConfig: 1 });
  };

  const Venue_statistics = ref('allVen');

  const current_platform_ids: any = ref([]);
  const platform_range: any = ref(1);

  const timeDisable = ref(false);

  const timedIdisable: any = computed(() => {
    if (timeDisable.value) return false;
    // return dayjs().isAfter(startTime.value.start_at) && !!getDeatilId.value;
  });

  eventBus.on('change_Venue_statistics', (v: any) => {
    if (v !== 'getself') platform_range.value = v;
    platform_range.value == 1
      ? (Venue_statistics.value = 'allVen')
      : (Venue_statistics.value = 'appointVen');
    if (defaultTy.value == 7) changTextData(7);
  });
  eventBus.on('change_Venue_statistics1', (v: any) => {
    if (v !== 'getself') platform_range.value = v;
    platform_range.value == 1
      ? (Venue_statistics.value = 'allVen')
      : (Venue_statistics.value = 'appointVen');
    if (defaultTy.value == 17) changTextData(17);
  });
  eventBus.on('change_bonus_type', (v: any) => {
    if (v !== 'getself') {
      set_Ty_4_data('bonus_type', v);
    }
  });
  eventBus.on('period_4_change', (v: any) => {
    if (v !== 'getself') {
      set_Ty_4_data('bonus_period', v);
      // set_Ty_4_data('bonus_type',1)
    }
  });

  const incentiveConfig = ref(1);
  eventBus.on('incentiveConfig', (v: any) => {
    if (v !== 'getself') incentiveConfig.value = v;
  });
  const handleCheckboxChange = (e, item) => {
    if (defaultTy.value == 9) {
      nextTick(async () => {
        await setFieldsValueLeft({
          platform_ids: current_platform_ids.value,
        });
        eventBus.emit('formChange_m');
      });
    }

    setTimeout(() => {
      if (defaultTy.value == 17) {
        changTextData(17);
      }
    }, 111);
  };

  onUnmounted(() => {
    eventBus.off('change_Venue_statistics');
    eventBus.off('formChange_m');
  });

  const currentlanguageIndex = ref(0);

  const siteName = ref();
  const newRefRedEmvelope: any = ref(null);
  const newRefRedEmvelope2: any = ref(null);
  const activity17_table_: any = ref(null);
  const activity16_table_: any = ref(null);
  const activity12_table_: any = ref(null);
  const activity9_table_: any = ref(null);
  const currentyOption = currentyOptions;
  const temporaryStorage = ref();
  const currencyRadioRef = ref(null);
  const rewardMethodsSelected = ref<number>(1);

  // 邀请好友独特的3个字段
  const inviteFriendsInfoData = ref({
    inviteFriendsBonusTypeSelected: [],
    inviteFriendsBonusTypeInfo: {
      accumulatedDepositCondition: '',
      accumulatedDepositBonus: '',
      validBetCondition: '',
      validBetBonus: '',
      singleDepositType: 'fixed',
      singleDepositCondition: '',
      singleDepositBonus: '',
    },
  });
  const inviteFriendsInfo = ref({
    inviteFriendsBonusTypeSelected: [],
    inviteFriendsBonusTypeInfo: {
      accumulatedDepositCondition: '',
      accumulatedDepositBonus: '',
      validBetCondition: '',
      validBetBonus: '',
      singleDepositType: 'fixed',
      singleDepositCondition: '',
      singleDepositBonus: '',
    },
  });
  const pop = ref(['3']);
  const agentRewardMethodsSelected = ref<number>(1);

  const ActivityList: any = activityMainMap;
  const ActivityOptions: any = ref(ActivityList[1]);
  const initNum: any = ref(1);
  const defaultTyMain: any = ref(1);
  const init = (ty?: number) => {
    // 语言与品牌设置挂钩，与右上角语言无关 -- 单一语言
    if (typeof systemCurrency.value === 'string') {
      if (!['zh_CN', 'pt_BR'].includes(systemCurrency.value)) {
        ActivityOptions.value = ActivityOptions.value.filter((item) => item.value !== 1);
        ty === 1 && (defaultTyMain.value = 2); // 针对拼多多转盘
      }
      if (!['zh_CN'].includes(systemCurrency.value)) {
        ActivityOptions.value = ActivityOptions.value.filter((item) => ![14].includes(item.value));
      }
    }
  };
  const typeDataList = activeOptions.filter((el) => el.value != 4);

  const tempList = ref([
    { label: t('common.translate.word16'), value: 1 },
    // { label: t('模板1'), value: 2 },
  ]);
  const currencyListTranslate = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
    '735': 'tl_PH',
    '733': 'ko_KR',
  };
  const ty2_config = {
    first_deposit_amount: null,
    total_deposit_amount: null,
    total_bet_amount: null,
    total_deposit_days: null,
    total_deposit_times: null,
    ip_limit: null,
    device_limit: null,
    pplBonus: [{ ppl: null, bonus: '' }],
  };

  const ty4_config = {
    prize_limit: '',
    bonus_period: 1, //统计周期 1:日 2:周 3:月
    bonus_type: 1, //返现配置 1:固定金额 2:比例金额
    profit_prize_config: [
      {
        level: '1',
        valid_bet_amount: '',
        bonus_rate: '',
      },
    ],
  };

  const ty1_config = {
    pay: 2,
    withdraw_amount: '',
    limit_amount: '',
    first_roll_min_amount: '',
    first_roll_max_amount: '',
    daily_roll_times: '',
    rule_times: 1,
    roll_config: [
      {
        id: 1,
        roll_type: 1,
        roll_condition: '',
        roll_times: '',
        pay_type: 1,
        pay_condition: '',
        pay_date_type: 1,
      },
    ],
  };
  // 测试一下这个方法有没有用，红包多语言
  const ty3_config = {
    tableData: [
      {
        key: '1',
        index: '1',
        type: '1',
        conditionType: '1',
        miniDeposit: '',
        chipsMultiple: '',
        // dollarPercent: '',
      },
    ],
    dailyBonus: '',
    countdown: '',
  };

  const activityTy = ref(1);
  const typesTy = ref(1);
  currencyTreeList = currencyTreeList.map((item) => {
    return {
      ...item,
      value: item.id,
      label: item.name,
      lang: item.name,
      key: item.id,
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    };
  });

  const langMap = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
    '735': 'tl_PH',
    '733': 'ko_KR',
  };

  const currencyList = ref(
    currencyTreeList.map((item) => ({
      label: item.label,
      value: item.value,
      lang: langMap[item.value] || '', // 默认语言
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    })),
  );

  const defaultTy = ref(1);
  const defaultState = ref(1);

  // 1代表新模板
  const defaultTemp = ref(1);

  const setTxtcontent = ref({
    multiple: 0, //
    dailyCollectionLimit: 0, //
    period: defaultTy.value == 1 ? 259200 : 604800,
    apply_period: 0,
  });

  const RawData: any = [];

  const currenyLang = ref(activityTy.value == 14 ? currencyList14 : currencyList.value);

  const XYcurrentCurryId = ref('702' as string);
  const currentCurryId = ref(currencyTreeList[0].value);

  const settingsTy_2 = computed(() => {
    const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
    if (itmeConfig.length > 0) {
      return itmeConfig[0].ty2_config['pplBonus'];
    }
    return currencyList.value[0]['ty2_config']['pplBonus'];
  });

  // 负盈利
  const settingsTy_4 = computed(() => {
    const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
    if (itmeConfig.length > 0) {
      return itmeConfig[0]['ty4_config']['profit_prize_config'];
    }
    return currencyList.value[0]['ty4_config']['profit_prize_config'];
  });
  const settingsTy_4_data = computed(() => {
    const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
    if (itmeConfig.length > 0) {
      setFieldsValueLeft({
        bonus_period: itmeConfig[0]['ty4_config']?.bonus_period || 1,
        bonus_type: itmeConfig[0]['ty4_config']?.bonus_type,
        prize_limit: itmeConfig[0]['ty4_config']?.prize_limit,
      });
      return itmeConfig[0]['ty4_config'];
    }
    setFieldsValueLeft({
      bonus_period: currencyList[0]['ty4_config']?.bonus_period || 1,
      bonus_type: currencyList[0]['ty4_config']?.bonus_type,
    });
    return currencyList.value[0]['ty4_config'];
  });
  const set_Ty_4_data = (key, val) => {
    currenyLang.value.forEach((el) => {
      if (el.value == currentCurryId.value) {
        el.ty4_config[key] = val;
      }
    });
  };

  const settingsTy_1 = computed(() => {
    const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
    if (itmeConfig.length > 0) {
      return itmeConfig[0].ty1_config;
    }
    return currencyList.value[0]['ty1_config'];
  });

  const showType = computed(() => {
    let _showType =
      ![5].includes(defaultTy.value) &&
      processSetingData(defaultTy.value, 'activeTitle2')?.filter(
        (item) => item.labelPrefixWidth == 'right',
      ).length;
    return _showType;
  });

  const startTime = ref({
    start_at: undefined as string | Dayjs | undefined,
    end_at: undefined as string | Dayjs | undefined,
  });

  const showTime = ref({
    display_start_at: null,
    display_end_at: null,
  });

  const switchState = ref(2 as any);
  const $router = useRouter();
  const Lucky_betSlot = ref(null);
  const checkIn_slot: any = ref(null);
  const wallet_slot: any = ref(null);
  const imageUrl = ref('' as any);
  const clientType = ref([1, 2] as any);
  const currentLangIndex = ref(0 as any);
  const currentLangImgIndex = ref(0 as any);
  const userStore = useUserStore();
  const token = userStore.getToken;
  const currentPopStyle = ref(3); // 弹窗样式
  const tinymceIsChange = ref(false as any);
  const commonMapping = {
    1: [24, 25],
    2: [26, 27],
  };
  const disabledType = ref(false as any);
  const cnList = [
    {
      label: t('common.common_zh_CN'),
      text: t('common.common_zh_CN'),
      country: t('layout.setting.menutimezone.china'),
      event: 'zh_CN',
      language: 'zh-CN',
    },
  ];
  const localeList = useLocalList();
  // const localeList = await systemStore.getValidLangList();

  //标题
  const bigTitle = ref(t('v.discount.activity_add'));
  const getStateId = ref(null as any);
  const validMemberNum = ref(null as any);
  const getDeatilId = ref('' as any);
  const applyLimit = ref(null as any);
  const periodModel = ref(null as any);
  const refRedEmvelope = ref(null as any);

  const phonelang = ref('zh_CN' as any);
  const btnloading = ref(false);

  const extraList = [
    {
      label: t('table.discountActivity.discountActivity_yw'), //翻译原文
      value: 'original',
      transitionValue: '',
      image_url: '',
      language: 'original',
      textContent: '',
    },
  ];
  const { getLocale } = useLocale();

  let openLangOptions = [];

  const btnLange = ref({});
  const btnText = ref(null);

  const zxLange = ref({});
  const zhText = ref('');

  const currencyName = ref('CNY');
  const get_tableData = ref({ lucky_number_config: [{ t: 0 }] });
  const get_leftValues: any = ref({
    automatic: 2,
    multiple: 0,
  });
  const get_leftValues9: any = ref({
    period: 1,
    extra: 1,
    accumulated: [],
    continuous: [],
  });
  const get_leftValues12: any = ref({
    timeType: [5, 15, 25],
    multiple: 0,
  });
  const get_leftValues13: any = ref({
    fixed_start_at: '',
    fixed_end_at: '',
    rechargeMount: '',
    currencyName: '',
    bet: '',
    rechargeBet: '',
    multiple: '',
  });
  const get_leftValues16: any = ref({
    reward_type: 'recharge',
    multiple: 0,
  });
  const ruleData: any = ref({});
  const highestNum: any = ref(0);

  const highestNumNew = ref(
    currencyTreeList.reduce((acc, item) => {
      acc[item.id] = 0;
      return acc;
    }, {}),
  );

  const setRuleData = (lang) => {
    let bonus_base = get_tableData.value[lang].bonus_base;
    bonus_base.selectList = bonus_base?.reduce((acc, current) => acc.concat(current.day), []);
    ruleData.value[lang].day = '$$variable2$$';
    ruleData.value[lang].highestNum = '$$variable1$$';
  };
  const get_tabelConfig = () => {
    if (defaultTy.value == 7 && Lucky_betSlot.value) {
      get_tableData.value = Lucky_betSlot.value?.conditionData;
      // 晚点再处理
      if (get_tableData.value) {
        Object.keys(get_tableData.value).forEach((key) => {
          const list = get_tableData.value[key].lucky_number_config;
          highestNumNew.value[key] = Math.max(...list.map((obj) => obj.t || 0)); // 确保 t 有值
        });
      }
    } else if (defaultTy.value == 14 && wallet_slot.value) {
      get_tableData.value = wallet_slot.value?.conditionData;
      if (get_tableData.value?.bonus) {
        let list = get_tableData.value.bonus['701'];
        const data = Math.max(...list.map((obj) => obj.c));
        highestNum.value = data;
      }
    } else if (defaultTy.value == 12 && wallet_slot.value) {
      get_tableData.value = activity12_table_.value?.conditionData;
      if (get_tableData.value?.bonus) {
        let list = get_tableData.value.bonus['701'];
        const data = Math.max(...list.map((obj) => obj.c));
        highestNum.value = data;
      }
    } else if (defaultTy.value == 17 && activity17_table_.value) {
      get_tableData.value =
        activity17_table_.value?.conditionData[currencyListTranslate[currentCurryId.value]][0];

      if (get_tableData.value?.conditionTime) {
        highestNum.value = get_tableData.value?.conditionTime.length;
      }
    } else if (defaultTy.value == 3 && newRefRedEmvelope.value) {
      if (!!!get_tableData.value[currencyListTranslate[currentCurryId.value]]) {
        get_tableData.value = newRefRedEmvelope.value?.conditionData;
      }
    }
  };
  const form_data = ref({});
  eventBus.on('formChange_m', async (v: any) => {
    let data: any = {};
    nextTick(async () => {
      if (!!v) {
        //tabel 表格变化时或者需要使用初始表单数据
        get_tabelConfig();
        get_leftValues.value = form_data.value = v;
      } else {
        //单纯的 form 表单变化和数据
        data = await getFieldsValue1();
        if (data) {
          get_leftValues.value = data;
          form_data.value = data;
        }
      }
      if (defaultTy.value == 3) changTextData(3);
      if (defaultTy.value == 7) changTextData(7);
      if (defaultTy.value == 9) changTextData(9);
      if (defaultTy.value == 14) changTextData(14);
      if (defaultTy.value == 17) changTextData(17);
      if (defaultTy.value == 16) changTextData(16);
      if (defaultTy.value == 12) changTextData(12);
    });
  });

  const langList = ref<any[]>([]);
  // 初始化，没办法，只能写在这里，不然要大改
  function initValidList() {
    langList.value = localeList.map((item) => {
      openLangOptions.push(item.event);
      btnLange.value[item.event] = null;
      zxLange.value[item.event] = null;
      return {
        label: t('common.common_' + item.event),
        value: item.event,
        transitionValue: '',
        image_url: '',
        fileList: [],
        language: item.language || '',
        phoneData: '',
        textContent: getTextData(defaultTy.value, item.event)[item.event],
        zxTransitionValue: '',
        btnTransitionValue: '',
        text_image_url: '',
        textFileList: [],
      };
    });
    if (defaultTy.value == 1 && typesTy.value === 1 && typeof systemCurrency.value !== 'string') {
      langList.value = langList.value.filter((e) => {
        return e.value == 'zh_CN' || e.value == 'pt_BR';
      });
    }
  }
  initValidList();
  // 更新值，写在最下方生命周期
  async function updateValidList(btn?, data?) {
    const res = await systemStore.getValidLangList();
    console.log(res);
    systemCurrency.value = res;
    openLangOptions = [];
    init(initNum.value);
    let list = defaultTy.value == 14 ? cnList : localeList;
    langList.value = list
      .filter((lang) => res && res.includes(lang.event))
      .map((item) => {
        openLangOptions.push(item.event);
        if (!btn) {
          btnLange.value[item.event] = null;
          zxLange.value[item.event] = null;
        }
        let image_url = '';
        if (data) {
          image_url = JSON.parse(data?.['images'] || '')?.[item.event];
        }

        return {
          label: t('common.common_' + item.event),
          value: item.event,
          transitionValue: '',
          image_url: image_url,
          fileList: [],
          language: item.language || '',
          phoneData: '',
          textContent: getTextData(defaultTy.value) ? getTextData(defaultTy.value)[item.event] : '',
          zxTransitionValue: '',
          btnTransitionValue: '',
          text_image_url: '',
          textFileList: [],
        };
      });
    if (Array.isArray(res)) {
      openTerminalState.checkedList =
        defaultTy.value === 18 && chosenLang18.value?.length
          ? chosenLang18.value
          : openLangOptions.filter((e) => e == getLocale.value);
    }
    setTimeout(() => {
      if (defaultTy.value == 1 && typesTy.value === 1 && typeof systemCurrency.value !== 'string') {
        langList.value = langList.value.filter((e) => {
          return e.value == 'zh_CN' || e.value == 'pt_BR';
        });
      }
      // openLangOptions = openLangOptions.filter((e) => e == getLocale.value);
      if (typeof res === 'string') {
        openTerminalState.checkedList = [res];
      }
      console.log('openTerminalState.checkedList', langList.value);
      openTerminalOptions.value = langList.value;
    }, 888);
  }

  const openTerminalState = reactive({
    indeterminate: false,
    checkAll: false,
    checkedList: openLangOptions,
  });

  const openTerminalOptions = ref(langList.value);

  const syslang = useLocale().getLocale.value;

  const [textModal, { openModal }] = useModal();

  const contentList = ref<any>([...langList.value]);

  const contentListDetail = computed(() => {
    const hasOriginalValue = contentList.value.some((item) => item.value === 'original');
    if (hasOriginalValue) return contentList.value;
    else return [...extraList, ...contentList.value];
  });

  const currentLang: any = ref(contentList.value[0]);

  const currentLangImg: any = ref(contentList.value[0]);

  const currentLangText = ref(contentListDetail.value[0]);

  const mysteryShow = ref(true);

  const disabledStartDate = (current) => {
    return current && current < dayjs().startOf('day');
  };
  const apiMap = reactive({
    uploadApi: uploadPromoImage,
    language: 'zh-CN',
  });

  const FORM_SIZE: any = useFormSetting().getFormSize;

  const current = computed(() => {
    return userStore.getCurrentSite;
  });

  const siteObj = current.value?.sites.find((el) => el.i === current.value?.id);

  if (siteObj) siteName.value = siteObj['n'] || 'SG';
  else siteName.value = 'SG';

  const handlelanguageLevelText = (value) => {
    currentlanguageIndex.value = value;
    tinymceIsChange.value = false;
    currentLang.value = contentList.value[currentlanguageIndex.value];
    if (defaultTy.value == 2) changTextData(2);
    if (defaultTy.value == 9) changTextData(9);
    if (defaultTy.value == 12) changTextData(12);
    if (defaultTy.value == 13) changTextData(13);
    if (defaultTy.value == 14) changTextData(14);
    if (defaultTy.value == 15) changTextData(15);
    if (defaultTy.value == 17) changTextData(17);
    if (defaultTy.value == 16) changTextData(16);
  };

  const handlelanguageLevelTextConfig = (value) => {
    tinymceIsChange.value = false;
    currentLangText.value = contentListDetail.value[value] || '';
    if (currentLangText.value) {
      apiMap.language = currentLangText.value.value;
    }
  };

  function checkIdAndReturnFirst(id: number | string) {
    const exists = currencyTreeList.some((item) => item.value == id);
    return exists ? id : currencyTreeList[0].value;
  }

  function changeSwitch() {
    setFieldsValueSettingRight({ shortcut: '3333' });
  }

  async function changeHandleActivity(value) {
    ActivityOptions.value = ActivityList[value];
    initNum.value = value;
    init(initNum.value);
    defaultTyMain.value = ActivityOptions.value[0].value;
    if (
      defaultTyMain.value == 10001 ||
      defaultTyMain.value == 10002 ||
      defaultTyMain.value == 10003
    ) {
      dealTy8(defaultTyMain.value);
    } else {
      defaultTy.value = ActivityOptions.value[0].value;
    }
    setFieldsValueLeft({ ty: defaultTy.value });
    if (defaultTyMain.value == 6 || defaultTyMain.value == 5) {
      changeHandle(defaultTyMain.value);
    } else {
      setTimeout(() => {
        setContentList();
      });
    }
    updateValidList();
  }

  async function dealTy8(value) {
    let val = 1;
    defaultTy.value = 8;
    await setFieldsValueLeft({ ty: 8 });
    if (value == 10001) {
      setTimeout(() => {
        setFieldsValueLeft({ chargeCondition: 1 });
      });
    }
    if (value == 10002) {
      val = 2;
      setTimeout(() => {
        setFieldsValueLeft({ chargeCondition: 2, cycleMode: 1 });
      }, 100);
    }
    if (value == 10003) {
      val = 3;
      setTimeout(() => {
        setFieldsValueLeft({ chargeCondition: 3, automatic: 2 });
      });
    }
    eventBus.emit('onChargeDynamicText', { value: val, type: 'chargeType' });
    setTxtcontent.value.period = 259200;
    await Initializationty_8();
  }
  const selectList = ref([]);

  async function changeHandleTypes(value) {
    typesTy.value = value;
    setFieldsValueLeft({ types: value });
    if (value == 2) {
      defaultTy.value = 5;
      await setFieldsValueLeft({ ty: 5 });
      await setFieldsBaseLeft({ display_type: 1 });
      setTimeout(() => {
        setContentList();
      });
    } else {
      defaultTyMain.value = 1;
      defaultTy.value = 1;
      await setFieldsValueLeft({ ty: 1 });
    }
    getCategory(openTerminalState.checkedList);
    updateValidList();
  }

  async function changeHandle(value) {
    info_venue();
    defaultTy.value = value;
    defaultTyMain.value = value;
    setFieldsValueLeft({ ty: value });
    if (defaultTy.value == 1) {
      currencyList.value = currencyTreeList;
    }
    if (value === 5) {
      setFieldsValueLeft({ activeContent: 1, display_type: 1, rule_type: 2 });
      handleChangePopContent({
        target: {
          value: 1,
        },
      });
    } else {
      setFieldsValueLeft({ activeContent: 1 });
    }
    if (value === 2) {
      Initializationty_2();
    }
    if (value === 4) {
      setTxtcontent.value.bonus_period = 1;
      Initializationty_4();
    }
    if (value === 7) {
      // setTxtcontent.value.period = 604800;
      Initializationty_7();
    }
    if (value === 9) {
      // setTxtcontent.value.period = 604800;
      Initializationty_9();
    }
    if (value === 12) {
      Initializationty_12();
    }
    if (value === 16) {
      Initializationty_16();
    }
    if (value === 17) {
      Initializationty_17();
    }
    if (value == 10001 || value == 10002 || value == 10003) {
      setFieldsValueLeft({ type8Ty: value });
    }
    if (value === 6) {
      setTxtcontent.value.period = 604800;
      setTimeout(() => {
        setFieldsValueLeft({ statisticalPeriod: 1, rewardMethods: 1 });
      });
      Initializationty_6();
    }
    if (value === 1) {
      await setFieldsValueLeft({ period: 259200 });
      setTxtcontent.value.period = 259200;
    }
    if (value == 10001 || value == 10002 || value == 10003) {
      dealTy8(value);
    }
    if (value === 10) {
      setTxtcontent.value.period = 259200;
      await Initializationty_10();
    }
    if (value === 11) {
      setTxtcontent.value.period = 259200;
      await Initializationty_11();
    }
    if (value === 15) {
      setTimeout(() => {
        setFieldsValueLeft({ statisticalPeriod: 1, rewardMethods: 1 });
      });
    }
    if (value === 18) {
      Initializationty_18();
    }
    updateValidList();
    setTimeout(() => {
      setContentList();
    });
  }

  async function changeTemp(value) {
    defaultTemp.value = value;
  }

  function periodChange(v) {
    periodModel.value = '';
    if (defaultTy.value == 1) {
      setTxtcontent.value.period = v.target.value;
      changTextData(1);
    }
    if (defaultTy.value == 4) {
      setTxtcontent.value.period = v.target.value;
      changTextData(4);
    }
    if (defaultTy.value == 7) {
      setTxtcontent.value.period = v.target.value;
      changTextData(7);
    }
  }

  //计算清零周期
  function daysToSeconds(days) {
    const secondsInDay = 86400;
    return days * secondsInDay;
  }
  //清零周期回显
  function secondsToDays(days) {
    const secondsInDay = 86400;
    return days / secondsInDay;
  }

  function handlePhoneDetail(value, el) {
    phonelang.value = el.value;
  }

  // 富文本
  function handleTinymceChange(value) {
    tinymceIsChange.value = true;
    contentList.value[currentlanguageIndex.value].transitionValue = value;
  }

  function handleChangeCurryId(v) {}

  function handleTinymceBlurZx(e) {
    const item = contentList.value.find((el) => el.value == syslang);
    if (item?.['zxTransitionValue'] != zhText.value) {
      translateContentList(contentList.value, zhText.value, 0, 'zxTransitionValue');
    }
  }

  // 切换弹窗内容
  function handleChangePopContent(e) {
    active_ontent.value = e.target.value;
    setFieldsValueLeft({ activeContent: e.target.value });
    setTimeout(() => {
      setContentList();
    });
    if (e.target.value == 2) {
      handleClickContent(0, { event: currentLang.value['value'] });
    }
    currentPopStyle.value = 1;
  }

  function handleChangeRuleType(e) {
    rule_type.value = e.target.value;
    setFieldsValueLeft({ rule_type: e.target.value });
  }

  function handleChangePayConfig(e) {}

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  async function validateEveryDayConditionData(dataList) {
    const chosenLangDataList = dataList?.[currencyListTranslate?.[currentCurryId.value]] || [];

    let hasEmptyField = false;
    chosenLangDataList.forEach((entry, index) => {
      // if (!entry.conditionType) {
      //   hasEmptyField = true;
      //   message.error(`请选择奖励条件`);
      // }
      if (!entry.miniDeposit || !entry.everyReward) {
        hasEmptyField = true;
        const langName = currencyList.value.filter((item) => item.value == currentCurryId.value)[0]
          ?.label;
        // 使用 message 提示
        message.error(t('common.bonus_conditions06', { langName: langName }));
      }
    });

    if (!hasEmptyField) {
      // 如果没有空字段，继续提交操作
      return true;
      // 这里可以进行提交逻辑
    } else {
      return false;
    }
  }

  async function validateBeforeSubmit(leftValues) {
    function checkValuesExist(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === '') {
          return false;
        }
      }
      return true;
    }

    if (!checkValuesExist(zxLange.value)) {
      message.error(t('common.bonus_conditions07'));
      return false;
    }

    if (!imageUrl.value && switchState.value === 1) {
      message.error(
        `${t('table.discountActivity.discount_home_shortcut')}${t(
          'table.discountActivity.discount_upload_pic',
        )}`,
      );
      return false;
    }

    if (leftValues.ty === 1) {
      const chosenCurr = currenyLang.value.filter((x) => x.value === currentCurryId.value) || [];
      const invalidConfigs = [];
      for (const item of chosenCurr) {
        if (
          !item.ty1_config.withdraw_amount ||
          !item.ty1_config.limit_amount ||
          !item.ty1_config.first_roll_min_amount ||
          !item.ty1_config.first_roll_max_amount ||
          !item.ty1_config.daily_roll_times
        ) {
          // 如果limit_amount或withdraw_amount为空，则将当前配置添加到校验失败的列表中
          invalidConfigs.push(item);
          continue;
        }
      }

      if (invalidConfigs.length > 0) {
        message.error(t('common.bonus_conditions08', { label: invalidConfigs[0].label }));
        return false;
      }
    }

    if (leftValues.ty == 1) {
      const chosenCurr = currenyLang.value.filter((x) => x.value === currentCurryId.value) || [];
      const invalidConfigs = [];
      for (const item of chosenCurr) {
        if (Number(item.ty1_config.withdraw_amount) < Number(item.ty1_config.limit_amount)) {
          invalidConfigs.push(item);
          continue;
        }
      }

      if (invalidConfigs.length > 0) {
        message.error(t('common.bonus_conditions09', { label: invalidConfigs[0].label }));
        return false;
      }
    }
    if (leftValues.ty == 9) {
      const validate = await activity9_additional_table_.value.valide();
      const currencyName = currentyOptions[currentCurryId.value];
      if (validate) {
        message.error(t('common.bonus_conditions06', { langName: currencyName }));
        return false;
      }
    }
    if (leftValues.ty == 12) {
      const validate = activity12_table_.value?.validate12();
      if (validate) {
        message.error(t('common.active_text50_f'));
        return false;
      }
    }
    if (leftValues.ty == 13) {
      const validate = await rechargeDayRef.value?.valide();
      const currencyName = currentyOptions[currentCurryId.value];
      if (validate) {
        message.error(t('common.bonus_conditions06', { langName: currencyName }));
        return;
      }
    }
    if (leftValues.ty == 15) {
      const validate = await mysteryDetailRef.value?.valide();
      const currencyName = currentyOptions[currentCurryId.value];
      if (!validate) {
        message.error(t('common.bonus_conditions06', { langName: currencyName }));
        return;
      }
    }
    let allEmptyItem = contentList.value.find(
      (item) => item.value != 'original' && item['image_url'] == '',
    );
    if (allEmptyItem && !allEmptyItem.image_url) {
      message.error(t('common.bonus_conditions10', { label: allEmptyItem.label }));
      return false;
    }
    return true;
  }

  /** 活动提交开始 */
  async function submitOk() {
    // 通用配置右边边from
    const promises = [SettingLeft(), SettingRight(), SettingBaseLeft(), SettingContent()];

    if (showType.value) {
      promises.push(SettingBaseRight());
    }

    const [settingLeft, settingRight, settingConfig1, settingContent, settingBaseRight] =
      await Promise.all(promises);

    const leftValues = {
      ...(showType.value ? settingConfig1 : {}),
      ...settingConfig1,
      ...settingContent,
      ...settingRight,
      ...settingLeft,
      ...(showType.value && settingBaseRight ? settingBaseRight : {}),
    };
    // const rightValues = await rightValue(); SettingConfig
    // 先注释校验
    const isValid = await validateBeforeSubmit(leftValues);
    if (!isValid) {
      return false;
    }
    btnloading.value = true;
    //判断是那个活动类型
    let config: any = {};
    let transformTableData: any = () => {};
    if (leftValues.ty === 1) {
      if (
        (leftValues.apply_limit == 5 && !!!applyLimit.value) ||
        (leftValues.period == 5 && !!!periodModel.value)
      ) {
        return message.warn(t('common.active_text39'));
      }
      // return;
      config = [];

      currenyLang.value.forEach(({ value, ty1_config }) => {
        const configItem = {
          currency_id: value,
          ...ty1_config,
        };
        configItem.roll_config = configItem.roll_config.map((item) => {
          if (!item.pay_condition) item.pay_condition = 1;
          item.roll_condition = Number(item.roll_condition);
          item.roll_times = Number(item.roll_times);
          return item;
        });
        config.push(configItem);
      });

      // config = config.filter((x) => x.currency_id === currentCurryId.value);
    } else if (leftValues.ty === 2) {
      config = {
        cur: {},
      };
      currenyLang.value.forEach((item) => {
        const { value, ty2_config } = item;
        // config['ip_limit'] = String(leftValues.ip_limit ?? '1');
        // config['device_limit'] = String(leftValues.device_limit ?? '1');
        config['bonus_tpl'] = String(leftValues.bonus_tpl ?? '1');
        config['show_amount'] = String(leftValues.show_amount ?? '1');
        config['bonus_type'] = String(leftValues.bonus_type ?? '1');
        (config['condition_type'] = String(leftValues.condition_type)),
          (config.cur[value] = {
            settings: ty2_config.pplBonus,
            ip_limit: String(ty2_config.ip_limit),
            device_limit: String(ty2_config.device_limit),
            first_deposit_amount: ty2_config.first_deposit_amount,
            total_deposit_amount: ty2_config.total_deposit_amount,
            total_bet_amount: ty2_config.total_bet_amount,
            total_deposit_days: ty2_config.total_deposit_days,
            total_deposit_times: ty2_config.total_deposit_times,
          });
      });
    } else if (leftValues.ty === 3) {
      // 这里的2是老模板
      if (defaultTemp.value == 2) {
        const redConfig = refRedEmvelope.value.conditionData?.map((item) => {
          return {
            scope: [item.chipsRange.min, item.chipsRange.max],
            deposit: refRedEmvelope.value.conditionType == 2 ? '0' : item.miniDeposit,
            times: String(item.chipsMultiple) || '0',
            scale: item.dollarPercent,
          };
        });

        const weeklyObject = {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        };

        refRedEmvelope.value.selectedWeek.forEach((day) => {
          weeklyObject[capitalizeFirstLetter(day)] = true;
        });
        config = {
          // 这里的1是提交参数，老模板
          tpl: 1,
          limit: {
            bonus: '0',
            daily: refRedEmvelope.value.dailyCollectionLimit,
          },
          date: {
            weekly: weeklyObject,
            base: refRedEmvelope.value.dayTimeTagSelected,
            custom: refRedEmvelope.value.otherTimeTagSelected,
            monthly: [refRedEmvelope.value.startDate, refRedEmvelope.value.endDate],
          },
          cond: {
            flag: Number(refRedEmvelope.value?.conditionType),
            list: redConfig,
          },
          drop: 1,
        };
      } else {
        // const newRedValidor = await newRefRedEmvelope.value?.valide(openTerminalState.checkedList);
        // if (!newRedValidor) return;
        // 模板提交逻辑
        const tableData = newRefRedEmvelope.value?.conditionData;
        const tableData2 = newRefRedEmvelope2.value?.conditionData;

        function hasNullOrDuplicateFirstElements(arr) {
          const seen = new Set();
          let prev = -Infinity;
          let hasnull = false;
          for (let i = 0; i < arr.length; i++) {
            const [first, two] = arr[i];
            if (first === null) hasnull = true;
            if (two === null) hasnull = true;
            if (seen.has(first)) hasnull = true;
            seen.add(first);
            if (hasnull) {
              return message.error(t('common.text56'));
            }
            // 检查是否严格递增
            if (first <= prev) {
              message.error(t('common.text57', { index: i + 1 }));
              return true;
            }
            prev = first;
          }
          return false;
        }

        function hasNullOrDuplicateFirstElements1(arr, bonus) {
          // const bonus = tableData[lang][0].bonus;
          const method = bonus.method;
          // const seen = new Set();
          // let prev = -Infinity;
          let hasnull = false;
          for (let i = 0; i < arr.length; i++) {
            const { value, amount } = arr[i];
            const [first, two] = amount;
            if (!!!first || first == 0) hasnull = true;
            if (!!!value || value == 0) hasnull = true;
            if ((method == 2 || method == 4) && two == 0) hasnull = true;
            // if (two === null) hasnull = true;
            // if (seen.has(first)) hasnull = true;
            // seen.add(first);
            if (hasnull) {
              return message.error(t('common.text58'));
            }
            // 检查是否严格递增
            // if (first <= prev) {
            //   message.error(t('common.text57', { index: i + 1 }));
            //   return true;
            // }
            // prev = first;
          }
          return false;
        }
        if (hasNullOrDuplicateFirstElements(tableData[currentCurryId.value][0].period)) {
          return;
        }

        if (
          hasNullOrDuplicateFirstElements1(
            tableData2[currentCurryId.value][0]?.cond,
            tableData[currentCurryId.value][0]?.bonus,
          )
        ) {
          return;
        }

        const res = Object.keys(tableData).reduce((acc, key) => {
          const firstElement = tableData[key][0]; // 取出数组的第一个元素
          firstElement.period = firstElement.period.map((period) =>
            period.map((item) => (item === null ? '8888999' : item)),
          );
          tableData2[key][0]?.cond.map((item) => {
            item.amount = item.amount.map((amount) => (amount == '' ? '8888999' : amount));
          });
          acc[key] = {
            ...firstElement,
            config: {
              ...firstElement.config,
              drop: dropStyle.value,
              countdown: Number(leftValues.countdown),
            },
            cond: tableData2[key][0]?.cond, // 确保存在
          };

          return acc;
        }, {});

        res['currency'] = currentCurryId.value;
        config = res;
      }
      // return;
    } else if (leftValues.ty === 17) {
      // 模板提交逻辑
      const tableData = activity17_table_.value?.conditionData;
      // const conditionVerify = await validateRedBagConditionData(tableData);
      // if (!conditionVerify) return;
      function generateLangCond(lang: string) {
        return tableData[lang].map((item) => {
          return {
            time: item?.conditionTime.reduce((acc, current) => {
              acc[current.str] = current.end;
              return acc;
            }, {}),
            deposit: item?.intervalDeposit.reduce((acc, current, currentIndex) => {
              let obj = {};
              // reward_type: leftValues.reward_type, //奖励类型 1充值 2亏损 3有效投注 0以上都需要(对应fulfil_cond 2)
              if (current.min && (leftValues.fulfil_cond == 2 || leftValues.reward_type == 1)) {
                obj['amount'] = String(current.min);
                obj['fixed'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple);
                obj['min'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple);
                obj['max'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple2);
                acc.push(obj);
              }
              return acc;
            }, []),

            wax: item?.wax?.reduce((acc, current, currentIndex) => {
              let obj = {};
              if (current.min && (leftValues.fulfil_cond == 2 || leftValues.reward_type == 2)) {
                obj['amount'] = String(current.min);
                obj['fixed'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple);
                obj['min'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple);
                obj['max'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple2);
                acc.push(obj);
              }
              return acc;
            }, []),

            coded: item?.coded?.reduce((acc, current, currentIndex) => {
              let obj = {};
              if (current.min && (leftValues.fulfil_cond == 2 || leftValues.reward_type == 3)) {
                obj['amount'] = String(current.min);
                obj['fixed'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple);
                obj['min'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple);
                obj['max'] = String(item?.chipsMultiples[currentIndex]?.chipsMultiple2);
                acc.push(obj);
              }
              return acc;
            }, []),
            // coded: item?.chipsMultiples.reduce((acc, current) => {
            //   acc = acc['amount']=current.min;
            //   !!!acc
            //     ? acc.concat('', current.chipsMultiple)
            //     : acc.concat(',', current.chipsMultiple);
            //   return acc;
            // }, {}),
          };
        });
      }
      // 生成cond参数
      const res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
        langObj['bonus_cond'] = { ...generateLangCond(lang)[0] };
        return langObj;
      }, {});
      config = {
        show_gift: leftValues.show_gift, //会员显示礼金
        daily_limit: leftValues.daily_limit, //会员每日上限
        fulfil_cond: leftValues.fulfil_cond, //满足条件 1满足任意一个 2必须全部满足 3充值后可领取
        reward_type: leftValues.reward_type, //奖励类型 1充值 2亏损 3有效投注 0以上都需要(对应fulfil_cond 2)
        plat_ids: platform_range.value == 1 ? [] : current_platform_ids.value, //统计场馆 全部场馆为空数组
        platform_range: platform_range.value, //platform_range
        way: leftValues.way, //奖金方式 1固定金额 2随机金额 3固定比例 4随机比例
        bonus_cond: {
          ...res.bonus_cond,
          // time: {
          //   '2025-01-01 00:00:00': '2025-01-01 00:59:59',
          //   '2025-01-01 01:00:00': '2025-01-01 01:59:59',
          // },
          // deposit: '1000', // 按存款(最低门槛≥)
          // coded: '1000', // 按打码(最低门槛≥)
          // wax: '1000', // 按盈亏(最低门槛≥)
          // fixed: '1000', //固定金额或固定比例
          // min: '0', //随机金额或随机比例 起步金额
          // max: '0', //随机金额或随机比例 最大金额
        },
      };
    } else if (leftValues.ty === 16) {
      // 模板提交逻辑
      // activity16_table_.value?.initData[leftValues.reward_type][leftValues.amount_type];
      let tableData = activity16_table_.value?.getData();
      config = {
        cycle: leftValues.cycle,
        currency_id: currentCurryId.value,
        cycle_offset: leftValues.cycle_offset,
        actual_limit: leftValues.actual_limit,
        display_limit: leftValues.display_limit,
        reward_type: leftValues.reward_type,
        amount_type: leftValues.amount_type,
        platform_range: leftValues.platform_range, //奖励类型 1充值 2亏损 3有效投注 0以上都需要(对应fulfil_cond 2)
        platform_ids: platform_range.value == 1 ? [] : current_platform_ids.value, //统计场馆 全部场馆为空数组
        ladder: tableData,
      };
    } else if (leftValues.ty === 4 || leftValues.ty === 7 || leftValues.ty === 6) {
      config = [];
      if (leftValues.ty === 4) {
        config = {
          platform_ids: platform_range.value == 1 ? [] : current_platform_ids.value,
          platform_range: platform_range.value,
          profit_cur_config: currenyLang.value.map((item) => {
            return {
              currency_id: item.value,
              ...item.ty4_config,
            };
          }),
        };
      }
      if (leftValues.ty === 6) {
        // 每日奖励活动配置数据提交
        function transformTableData(lang: string) {
          return tableData[lang].map((item) => {
            return {
              valid: Number(item.miniDeposit),
              bonus: String(item.everyReward),
            };
          });
        }
        const tableData = everydayBetRef.value?.conditionData;
        const tableDataKey = Object.keys(tableData);
        /* const valideRes = await validateEveryDayConditionData(tableData);
              if (!valideRes) return;
              const res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
                const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
                langObj[langToValue[0].value] = transformTableData(lang);
                return langObj;
              }, {}); */
        //过滤后
        const filterCurrencyLangMap = (() => {
          const result = {};
          currencyList.value.forEach((item) => {
            if (currentyOptions[item.value]) {
              result[item.value] = currentyOptions[item.value];
            }
          });
          return result;
        })();
        const filterLangMap = Object.entries(filterCurrencyLangMap).reduce((acc, [key, value]) => {
          if (tableDataKey.includes(value as string)) {
            acc[key] = value;
          }
          return acc;
        }, {});
        const res = Object.assign(
          {},
          ...Object.keys(filterLangMap).map((item) => ({
            [item]: transformTableData(filterLangMap[item]),
          })),
        );
        config = {
          currency: res,
          plat_ids: current_platform_ids.value,
          all: platform_range.value,
          method: leftValues.rewardMethods,
          period: leftValues.statisticalPeriod,
        };
      }
      if (leftValues.ty === 7) {
        // 幸运赌注
        let tableData = get_tableData.value;
        let conditionVerify = true;
        const curyData = tableData[currentCurryId.value];

        curyData.lucky_bet_prize_config.forEach((item, index) => {
          const { m, n } = item;
          if (!!!m || !!!n) {
            message.error(t('common.bonus_conditions11'));
            conditionVerify = false;
          }
        });
        curyData.lucky_number_config.forEach((item, index) => {
          const { c, l } = item;
          const tt = item.t || '';
          if (!!!c || !!!tt || !!!l) {
            message.error(t('common.bonus_conditions11'));
            conditionVerify = false;
          }
        });

        if (!conditionVerify) return;
        const res = Object.keys(tableData).map((currency_id) => {
          const { lucky_bet_prize_config, lucky_number_config } = tableData[currency_id];
          return {
            currency_id,
            lucky_bet_prize_config: lucky_bet_prize_config.map((item, index) => ({
              level: String(index + 1), // 奖金等级
              valid_bet_amount: String(item.m), // 有效打码
              receive_count: Number(item.n), // 领取次数
            })),
            lucky_number_config: lucky_number_config.map((item) => ({
              lucky_number: item.c, // 注单尾号
              bonus_multiple: item.t, // t = 奖励倍数
              limit: item.l, // l = 奖励上限
            })),
          };
        });

        // 使用 list2 和 conditionVerify 继续处理逻辑
        if (platform_range.value == 2 && current_platform_ids.value.length < 1) {
          return message.error(t('common.bonus_conditions12'));
        }
        config = {
          platform_ids: current_platform_ids.value,
          platform_range: platform_range.value,
          lucky_bet_cur_config: res,
        };
      }
    } else if (leftValues.ty == 8) {
      if (rewardFormValidate.value) {
        const {
          chargeCondition,
          isChargeTime,
          rewardMethods,
          chargeTimeList,
          cycleMode,
          registerCharge,
          firstDepositPop,
          appearLocation,
        } = leftValues;
        const validateRewardFormRes: any = await rewardFormValidate.value.overallVerification();
        if (!validateRewardFormRes) return;
        const tableContent = rewardFormValidate.value.conditions;
        const validateRes = await validateRewardForm(tableContent, rewardMethods, 'charge');
        if (!validateRes) return;
        if (leftValues.button == 1 && !leftValues.button_text) return;
        // 充值
        if (chargeCondition == 1) {
          config = {
            currency: currentCurryId.value,
            cond: 1,
            period: {
              days: [],
              flag: isChargeTime,
              val: isChargeTime == 0 ? 0 : Number(chargeTimeList.num),
              ty: isChargeTime == 0 ? 0 : chargeTimeList.selectValue,
            },
            bonus: rewardMethods,
            tongue: dealActiveEight(tableContent, rewardMethods),
            firstDepositPop,
          };
          if (firstDepositPop == 1) config['appearLocation'] = appearLocation;
        }
        if (chargeCondition == 2) {
          config = {
            currency: currentCurryId.value,
            cond: 2,
            period: {
              days: [],
              flag: cycleMode,
              val: 0,
              ty: 0,
            },
            bonus: rewardMethods,
            tongue: dealActiveEight(tableContent, rewardMethods),
          };
        }
        if (chargeCondition == 3) {
          config = {
            currency: currentCurryId.value,
            cond: 3,
            period: {
              days: registerCharge,
              flag: 0,
              val: 0,
              ty: 0,
            },
            bonus: rewardMethods,
            tongue: dealActiveEight(tableContent, rewardMethods),
          };
        }
      }
    } else if (leftValues.ty === 9) {
      let activity9_sign_in_table_data = activity9_sign_in_table_.value?.getData();
      let activity9_additional_table_data = activity9_additional_table_.value?.getData();
      const conf = Object.values(activity9_sign_in_table_data).map((val: any) => {
        const period_1_extra_conf = activity9_additional_table_data[val.currency_id]['period_1'];
        const period_2_extra_conf = activity9_additional_table_data[val.currency_id]['period_2'];
        if (val['period_1'].extra == 0) {
          val['period_1']['extra_conf'] = {
            serial: [],
            jackpot: [],
          };
        } else {
          val['period_1']['extra_conf'] = period_1_extra_conf;
        }

        val['period_1']['base_conf'] =
          val['period_1']['base_conf']['type' + val['period_1']['type']];

        if (val['period_2'].extra == 0) {
          val['period_2']['extra_conf'] = {
            serial: [],
            jackpot: [],
          };
        } else {
          val['period_2']['extra_conf'] = period_2_extra_conf;
        }

        val['period_2']['base_conf'] =
          val['period_2']['base_conf']['type' + val['period_2']['type']];
        if (val.platform_range === 1) {
          val.platform_ids = [];
        }
        return {
          ...val,
        };
      });
      config = {
        currency_id: currentCurryId.value,
        conf: conf,
      };
    } else if (leftValues.ty === 14) {
      const tableData = get_tableData.value;
      let conditionVerify = true;

      if (rewardFormValidate.value) {
        const { rewardMethods, cycleMode } = leftValues;
        const validateRewardFormRes: any = await rewardFormValidate.value.overallVerification();
        if (!validateRewardFormRes) return;
        const tableContent = rewardFormValidate.value.conditions;
        const validateRes = await validateRewardForm(tableContent, rewardMethods, 'charge');
        if (!validateRes) return;
        config = {
          cycleMode: cycleMode,
          ...tableData,
          tongue: rewardMethods,
          bonus: dealActiveEight(tableContent, rewardMethods),
        };
      }
    } else if (leftValues.ty === 10) {
      if (agentDaysFormValidate.value) {
        const { statisticalPeriod } = leftValues;
        const validateRewardFormRes: any = await agentDaysFormValidate.value.overallVerification();
        if (!validateRewardFormRes) return;
        const tableContent = agentDaysFormValidate.value.conditions;
        const validateRes = await validateManyRewardForm(tableContent, 1, 'agentDays');
        if (!validateRes) return;
        if (leftValues.button == 1 && !leftValues.button_text) return;
        config = {
          bonus: 1,
          period: statisticalPeriod,
          currency: currentCurryId.value,
          tongue: dealManyDaysActive(tableContent, 1),
        };
      }
    } else if (leftValues.ty === 11) {
      if (agentMonthsFormValidate.value) {
        const { statisticalPeriod, getTime } = leftValues;
        const validateRewardFormRes: any =
          await agentMonthsFormValidate.value.overallVerification();
        if (!validateRewardFormRes) return;
        const tableContent = cloneDeep(agentMonthsFormValidate.value.conditions);
        const validateRes = await validateManyRewardForm(tableContent, 1, 'agentMonths');
        if (!validateRes) return;
        if (leftValues.button == 1 && !leftValues.button_text) return;
        config = {
          bonus: 1,
          period: statisticalPeriod,
          claim: getTime,
          currency: currentCurryId.value,
          tongue: dealManyDaysActive(tableContent, 1),
        };
      }
    } else if (leftValues.ty === 12) {
      platform_ids.value = venueList.value
        .map((item) => item[Venue_statistics.value].map((el) => el.value))
        .flat();
      const tableData = {};
      Object.keys(currencyTreeList12.value).forEach((key) => {
        const adwardType2Data =
          currencyTreeList12.value[key][`staticType${leftValues.staticType}`][
            `adwardType${leftValues.adwardType}`
          ];
        tableData[key] = adwardType2Data.map((item) => {
          if (!item.e) {
            return {
              b: item.b,
              d: item.d,
            };
          }
          return {
            b: item.b,
            d: item.d,
            e: item.e,
          };
        });
      });
      config = {
        timeType: leftValues.timeType,
        currency_id: currentCurryId.value,
        staticType: leftValues.staticType,
        adwardType: leftValues.adwardType,
        platform_range: leftValues.platform_range, //奖励类型 1充值 2亏损 3有效投注 0以上都需要(对应fulfil_cond 2)
        platform_ids: platform_range.value == 1 ? [] : platform_ids.value, //统计场馆 全部场馆为空数组
        ladder: tableData,
      };
    } else if (leftValues.ty === 13) {
      const tableData = rechargeDayRef.value?.getData();
      config = {
        currency_id: currentCurryId.value,
        fixed_start_at: get_leftValues13.value.fixed_start_at,
        fixed_end_at: get_leftValues13.value.fixed_end_at,
        bet: leftValues.bet, // 投注倍数
        recharge: tableData,
      };
    } else if (leftValues.ty === 15) {
      for (const awardType in mysterySource.value[currentCurryId.value]['reward_config']) {
        const config = mysterySource.value[currentCurryId.value]['reward_config'][awardType];

        for (const condIndex in config['recharge_config']) {
          const rechargeConfig = config['recharge_config'][condIndex];
          const { deposit, show_max, show_min } = rechargeConfig;
          if (!deposit || !show_max || !show_min) {
            message.error(
              t('common.mystery20', {
                awardType: awardType,
                condIndex: Number(condIndex) + 1,
              }),
            );
            return false;
          }
        }

        for (const condIndex in config['reward_cond']) {
          for (let index = 0; index < config['reward_cond'][condIndex].length; index++) {
            const condition = config['reward_cond'][condIndex][index];
            const { bet_multiple, max, min } = condition;

            if (!bet_multiple || !max || max == '0' || !min || min == '0') {
              message.error(
                t('common.mystery19', {
                  awardType: awardType,
                  condIndex: Number(condIndex) + 1,
                  index: index + 1,
                }),
              );
              return false;
            }
            // if (index > 0) {
            // }
          }
        }
      }
      config = {
        currency_id: currentCurryId.value,
        config_info: mysterySource.value,
      };

      // if (rewardFormValidate.value) {
      //   const { rewardMethods, statisticalPeriod } = leftValues;
      //   const validateRewardFormRes: any = await rewardFormValidate.value.overallVerification();
      //   if (!validateRewardFormRes) return;
      //   const tableContent = rewardFormValidate.value.conditions;
      //   const validateRes = await validateRewardForm(tableContent, rewardMethods, 'charge');
      //   if (!validateRes) return;
      //   config = {
      //     period: statisticalPeriod,
      //     bonus: rewardMethods,
      //     tongue: dealActiveEight(tableContent, rewardMethods),
      //     chargeDynamicText: chargeDynamicText.currentMoney?.['701'] || 0,
      //   };
      // }
    }
    //活动规则
    const content = transform(
      leftValues['ty'] == 5 ? contentListDetail.value : contentList.value,
      function (result, item, key) {
        if (leftValues['ty'] == 5) {
          result[item.value] = item.transitionValue;
        } else {
          if (leftValues['rule_type'] == 2) {
            result[item.value] = item.transitionValue;
          } else {
            // 这里不加问号报错，暂时没有分析什么原因，有时间看下这里？。replace这个，如果有影响就换其他解决办法
            result[item.value] = item.textContent?.replace(
              /CNY|BRL|KVND|THB|INR|USDT|PHP|KRW/g,
              (match) => `${leftValues['ty'] == 10 ? match : match + '$$currency$$'}`,
            );
            if (leftValues['ty'] == 1) {
              let regexzh_CN = /每个用户每天将获得[0-9]+次免费旋转/;
              let regexen_US = /Each user will receive [0-9]+ free spin per day/;
              let regexpt_BR = /Cada usuário receberá [0-9]+ giro grátis por dia/;
              let regexvi_VN = /Mỗi một người dùng thể nhận được [0-9]+ lần quay miễn phí mỗi ngày/;
              let regexth_TH = /ผู้เล่นแต่ละคนจะได้รับฟรีสปินวันละ [0-9]+ ครั้ง/;
              let regexhi_IN =
                /प्रत्येक उपयोगकर्ता को प्रति दिन [0-9]+ निःशुल्क स्पिन प्राप्त होगी/;
              if (item.value === 'zh_CN')
                result[item.value] = result[item.value].replace(
                  regexzh_CN,
                  '每个用户每天将获得$$$freetimes$$$次免费旋转',
                );
              if (item.value === 'en_US')
                result[item.value] = result[item.value].replace(
                  regexen_US,
                  'Each user will receive $$$freetimes$$$ free spin per day',
                );
              if (item.value === 'pt_BR')
                result[item.value] = result[item.value].replace(
                  regexpt_BR,
                  'Cada usuário receberá $$$freetimes$$$ giro grátis por dia',
                );
              if (item.value === 'vi_VN')
                result[item.value] = result[item.value].replace(
                  regexvi_VN,
                  'Mỗi một người dùng thể nhận được $$$freetimes$$$ lần quay miễn phí mỗi ngày',
                );
              if (item.value === 'th_TH')
                result[item.value] = result[item.value].replace(
                  regexth_TH,
                  'ผู้เล่นแต่ละคนจะได้รับฟรีสปินวันละ $$$freetimes$$$ ครั้ง',
                );
              if (item.value === 'hi_IN')
                result[item.value] = result[item.value].replace(
                  regexhi_IN,
                  'प्रत्येक उपयोगकर्ता को प्रति दिन $$$freetimes$$$ निःशुल्क स्पिन प्राप्त होगी',
                );
              if (item.value === 'tl_PH')
                result[item.value] = result[item.value].replace(
                  regexhi_IN,
                  'पBawat user ay makakakuha ng $$$freetimes$$$ libreng spins bawat araw',
                );
              if (item.value === 'ko_KR')
                result[item.value] = result[item.value].replace(
                  regexhi_IN,
                  '매일 각 사용자당 $$$freetimes$$$회 무료 스핀을 받을 수 있습니다',
                );
            }
          }
        }
      },
      {},
    );
    if (leftValues.ty === 5) {
      //自定义
      config = {
        page_content: content,
      };
    }

    if (leftValues.ty === 18) {
      let obj18 = {
        inviteFriendsBonusTypeInfo: {},
      };
      for (const key in cloneDeep18.value) {
        if (cloneDeep18.value.hasOwnProperty(key)) {
          // 将原数据结构中的字段提取出来，直接赋值给新的对象
          obj18['inviteFriendsBonusTypeInfo'][key] = {
            accumulatedDepositCondition:
              cloneDeep18.value[key].inviteFriendsBonusTypeInfo.accumulatedDepositCondition + '',
            accumulatedDepositBonus:
              cloneDeep18.value[key].inviteFriendsBonusTypeInfo.accumulatedDepositBonus + '',
            validBetCondition:
              cloneDeep18.value[key].inviteFriendsBonusTypeInfo.validBetCondition + '',
            validBetBonus: cloneDeep18.value[key].inviteFriendsBonusTypeInfo.validBetBonus + '',
            singleDepositType: cloneDeep18.value[key].inviteFriendsBonusTypeInfo.singleDepositType,
            singleDepositCondition:
              cloneDeep18.value[key].inviteFriendsBonusTypeInfo.singleDepositCondition + '',
            singleDepositBonus:
              cloneDeep18.value[key].inviteFriendsBonusTypeInfo.singleDepositBonus + '',
            inviteFriendsBonusType: cloneDeep18.value[key].inviteFriendsBonusTypeSelected,
          };
        }
      }
      // 邀请好友自定义
      config = {
        currencyConfig: currentCurryId.value,

        ...obj18,

        platform_range: platform_range.value,
        ...(platform_range.value === 2 && { platform_ids: current_platform_ids.value }),
      };
    }

    //活动简介
    const detail = transform(
      contentListDetail.value,
      function (result, item, key) {
        result[item.value] = item.transitionValue;
      },
      {},
    );
    const backgroundImage = contentList.value.reduce((acc, item) => {
      // 将 item.event 作为键，item.img_url 作为值添加到累加器对象中
      acc[item.value] = item.image_url;
      return acc;
    }, {});
    const backgroundImageText = contentList.value.reduce((acc, item) => {
      // 将 item.event 作为键，item.img_url 作为值添加到累加器对象中
      acc[item.value] = item.text_image_url;
      return acc;
    }, {});
    const client = leftValues.client_type.flatMap((type) => commonMapping[type] || []);
    const shortcut = clientType.value.flatMap((type) => commonMapping[type] || []);

    const currentLang = currentLanguage.getLocale;
    if (!openTerminalState.checkedList.includes(currentLang)) {
      zxLange.value[currentLang] = leftValues.zh_name;
    }
    const { en_US, hi_IN, pt_BR, th_TH, vi_VN, zh_CN, tl_PH, ko_KR } = zxLange.value;
    const data_ = {
      ...leftValues,
      bg_color: bgColor.value,
      detail_images: JSON.stringify(backgroundImageText),
      types: typesTy.value,
      category_id: JSON.stringify(leftValues.category_id),
      state: defaultState.value == 3 ? 3 : leftValues.state,
      display_mode: leftValues.display_mode,
      created_uid: '0',
      id: getDeatilId.value ? getDeatilId.value : '0',
      group: 1,
      category: JSON.stringify([1, 2]),
      display_type: leftValues.display_type ? leftValues.display_type.toString() : '',
      start_at_tz:
        leftValues.ty == 2 || leftValues.ty == 4
          ? dayjs(leftValues.startTime.start_at).format('YYYY-MM-DD 00:00:00')
          : dayjs(leftValues.startTime.start_at).format('YYYY-MM-DD 00:00:00'),
      end_at_tz:
        leftValues.ty == 2 || leftValues.ty == 4
          ? dayjs(leftValues.startTime.end_at).format('YYYY-MM-DD 23:59:59')
          : dayjs(leftValues.startTime.end_at).format('YYYY-MM-DD 23:59:59'),
      // : dayjs(leftValues.startTime.end_at).utc().format('YYYY-MM-DD 23:59:59'),
      multiple: leftValues.multiple || '0', //稽核倍数
      recommend: leftValues.recommend ? 1 : 2, //推荐活动
      apply_limit: leftValues.apply_limit == 5 ? applyLimit.value : leftValues.apply_limit, //参数次数
      period:
        leftValues.ty == 1 && leftValues.period == 5
          ? periodModel.value
            ? daysToSeconds(periodModel.value)
            : leftValues.period
          : leftValues.period, //清零周期
      apply_period: leftValues.apply_period ? daysToSeconds(leftValues.apply_period) : null, //清零周期
      group_detail: JSON.stringify([]), // 参与对象详情
      client_type: JSON.stringify(client),

      apply_condition: JSON.stringify(leftValues.apply_condition), //领取条件
      shortcut: switchState.value, //首页快捷入口
      shortcut_client: JSON.stringify(shortcut), //领取入口
      lang: JSON.stringify(openTerminalState.checkedList),
      shortcut_detail: JSON.stringify([imageUrl.value]), //快捷入口的图片
      images: JSON.stringify(backgroundImage), //背景图片
      summary: JSON.stringify(detail), //简介
      detail: leftValues.ty != 5 ? JSON.stringify(content) : JSON.stringify(content), //规则
      automatic: leftValues.automatic, //领取方式
      button_text:
        leftValues.button == 1 ? JSON.stringify(btnLange.value) : JSON.stringify({ zh_CN: null }), //按钮配置
      updated_uid: '0',
      updated_name: '',
      currency_id: currentCurryId.value,
      config: JSON.stringify(config),
      ty: leftValues.ty,
      pop: leftValues.pop ? leftValues.pop : '1',
      button: leftValues.ty != 5 ? leftValues.button : leftValues.button,
      button_type:
        leftValues.ty != 5
          ? leftValues.button_type
          : leftValues.display_type == 2
          ? leftValues.button_type_5
          : leftValues.button_type,
      button_redirect:
        leftValues.ty != 5
          ? leftValues.button_redirect
          : leftValues.display_type == 2
          ? leftValues.button_redirect_5
          : leftValues.button_redirect,
      zh_name: zh_CN, //leftValues.zh_name, //名称
      en_name: en_US,
      pt_name: pt_BR,
      vn_name: vi_VN,
      th_name: th_TH,
      hi_name: hi_IN,
      tl_name: tl_PH,
      ko_name: ko_KR,
      rule_type: rule_type.value,
      timezone: leftValues.timezone,
      active_content: active_ontent.value,
    };

    if (leftValues.automatic === 2) {
      data_['withdraw_type'] = 1;
    } else if (leftValues.automatic === 3) {
      data_['withdraw_type'] = 2;
      data_['automatic'] = 2;
    }

    if (leftValues.automatic === 1) data_['withdraw_type'] = 1;

    if (leftValues.ty == 2 && leftValues.bonus_type == 2) {
      data_['withdraw_type'] = 1;
      data_['automatic'] = 1;
    }

    if (leftValues.ty === 18) {
      const { inviteFriendsBonusTypeSelected = [], inviteFriendsBonusTypeInfo = {} } =
        inviteFriendsInfo.value;

      const bonusTypeChecks = {
        1: ['accumulatedDepositCondition', 'accumulatedDepositBonus'],
        2: ['validBetCondition', 'validBetBonus'],
        3: ['singleDepositType', 'singleDepositCondition', 'singleDepositBonus'],
      };

      const isInvalidConfig = !inviteFriendsBonusTypeSelected.length;

      if (isInvalidConfig) {
        message.warning(t('v.discount.activity.please_complete_activity_configuration'));
        return false;
      }

      for (const type of inviteFriendsBonusTypeSelected) {
        const requiredFields = bonusTypeChecks[type];
        if (requiredFields && !requiredFields.every((field) => inviteFriendsBonusTypeInfo[field])) {
          message.warning(t('v.discount.activity.please_complete_activity_configuration'));
          return false;
        }
      }
    }
    const { status, data } = getDeatilId.value
      ? await updatePromoActive(data_)
      : await insertPromoActive(data_);
    if (status) {
      btnloading.value = false;
      message.success(data);
      $router.push({ name: 'Activity' });
    } else {
      btnloading.value = false;
      message.error(data);
    }
  }

  /** 活动提交结束 */
  function emitsValues(value, type) {
    if (type == 'zh_name') {
      // if (openTerminalState.checkedList.includes(syslang)) {
      zhText.value = value[syslang];
      setFieldsValueSettingLeft({ zh_name: zhText.value });
      // }
      zxLange.value = value;
      contentList.value.forEach((el) => {
        el.zxTransitionValue = value[el.value];
      });
    } else if (type == 'button_text') {
      // if (openTerminalState.checkedList.includes(syslang)) {
      btnText.value = value[syslang];
      setFieldsValueLeft({ button_text: btnText.value });
      // }
      btnLange.value = value;
    } else {
      // if (openTerminalState.checkedList.includes(syslang)) {
      btnText.value = value[syslang];
      setFieldsValueLeft({ button_text: btnText.value });
      // }
      btnLange.value = value;
    }
  }
  //更多语言
  async function handleMoreLagarage(type) {
    contentList.value.forEach((el) => {
      zxLange.value[el.value] = el.zxTransitionValue;
      btnLange.value[el.value] = el.btnTransitionValue;
    });
    let res = type == 'zh_name' ? zxLange.value : btnLange.value;
    openModal(true, { data: res, type });
  }

  function handleChangeUpload(data) {
    currentLangImg.value.image_url = data;
    currentLangImg.value.fileList = [{ uid: '1', name: data, status: 'done' }];
    contentList.value[currentLangImgIndex.value].image_url = data;
    contentList.value[currentLangImgIndex.value].fileList = [
      { uid: '1', name: data, status: 'done' },
    ];
  }

  async function handleRemoveUpload() {
    currentLangImg.value.image_url = '';
    currentLangImg.value.fileList = [];
    contentList.value[currentLangImgIndex.value].image_url = '';
    contentList.value[currentLangImgIndex.value].fileList = [];
  }

  function handleChangeUploadText(data) {
    currentLang.value.text_image_url = data;
    currentLang.value.textFileList = [{ uid: '1', name: data, status: 'done' }];
    contentList.value[currentLangIndex.value].textFileList = [
      { uid: '1', name: data, status: 'done' },
    ];
    localeList.forEach((item) => {
      if (item.event === apiMap.language) {
        item['text_image_url'] = currentLang.value.image_url;
      }
    });
  }

  async function handleRemoveUploadText() {
    currentLang.value.text_image_url = '';
    currentLang.value.textFileList = [];
    contentList.value[currentLangIndex.value].textFileList = [];
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/webp' || file.type === 'image/png';
    const isLt2M = file.size / 1024 < 600;
    if (!isJpgOrPng || !isLt2M) {
      // 修正多语言拼接
      message.error(`${t('common.only_upload_webpandpng')} 600KB`);
      return false;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        if (event.target?.result) {
          const img = new (window as any).Image();
          img.src = event.target.result as string;
          img.onload = () => {
            const isSizeValid = img.width === 220 && img.height === 220;
            if (!isSizeValid) {
              message.error(`${t('common.must_size')} ${220} * ${220}`);
              resolve(false);
            } else {
              resolve(true);
            }
          };
        } else {
          message.error(`${t('v.discount.activity.cannot_read_file')}`);
          resolve(false);
        }
      };
    });
  };

  function handleClickContent(el, value) {
    setTimeout(() => {
      currentLangIndex.value = el;
      currentLang.value = contentList.value[currentLangIndex.value];
      apiMap.language = currentLang.value['value'];
    });
  }

  function handleClickContentImg(el) {
    setTimeout(() => {
      currentLangImgIndex.value = el;
      currentLangImg.value = contentList.value[currentLangImgIndex.value];
      apiMap.language = currentLangImg.value['value'];
    });
  }

  function getType(array) {
    const result = [];

    if (array.includes(24)) {
      result.push(1);
    }
    if (array.includes(26)) {
      result.push(2);
    }
    return result;
  }
  const Timestamp_before_disabled = ref(false);
  const currentTimestamp = Date.now();

  function getKeyByValue(value: string | number): number | undefined {
    const strValue = value; // 转为字符串
    for (const key in ActivityList) {
      if (ActivityList[key].some((item: any) => item.value == strValue)) {
        return Number(key); // 转为数字类型返回
      }
    }
    return 1; // 没有匹配时返回 1
  }
  //处理回显数据
  async function getEditData() {
    const data = await getPromoDetail({ pid: history.state.id });
    let datatype = data.ty;
    typesTy.value = data.types;
    if (data.bg_color) bgColor.value = data.bg_color;
    if (data.ty == 8) {
      const echoData = JSON.parse(data.config);
      datatype = `1000${echoData.cond}`;
      defaultTyMain.value = Number(`1000${echoData.cond}`);
      await setFieldsValueLeft({ type8Ty: defaultTyMain.value });
    }
    data.activity = getKeyByValue(datatype);
    activityTy.value = data.activity;

    defaultState.value = data.state;
    if (data.state == 3) data.state = 2;

    ActivityOptions.value = ActivityList[activityTy.value];
    getDeatilId.value = data.id;
    active_ontent.value = data.active_ontent || 1;
    if (data.ty != 5) rule_type.value = data.rule_type;

    defaultTy.value = data.ty;
    if (data.ty != 8) defaultTyMain.value = data.ty;
    if (!data.timezone) data.timezone = '';

    timezone.value = data.timezone;
    if (new Date(data.start_at_tz).getTime() < currentTimestamp) {
      checkIn_slot;
      // Timestamp_before_disabled.value = true;
    } else {
      Timestamp_before_disabled.value = false;
    }
    if (data.button_type == 0) data.button_type = 1;
    await setFieldsValueLeft({ activeContent: 1 });

    if (data['withdraw_type'] == 2) {
      data['automatic'] = 3;
    }
    btnLange.value = JSON.parse(data.button_text);

    if (btnLange.value.hasOwnProperty(syslang)) {
      btnText.value = btnLange.value[syslang];
      setFieldsValueLeft({ button_text: btnText.value });
    }
    zxLange.value['en_US'] = data['en_name'] ? data['en_name'] : null;
    zxLange.value['hi_IN'] = data['hi_name'] ? data['hi_name'] : null;
    zxLange.value['pt_BR'] = data['pt_name'] ? data['pt_name'] : null;
    zxLange.value['th_TH'] = data['th_name'] ? data['th_name'] : null;
    zxLange.value['vi_VN'] = data['vn_name'] ? data['vn_name'] : null;
    zxLange.value['zh_CN'] = data['zh_name'] ? data['zh_name'] : null;
    zxLange.value['tl_PH'] = data['tl_name'] ? data['tl_name'] : null;
    zxLange.value['ko_KR'] = data['ko_name'] ? data['ko_name'] : null;
    const currentLang = currentLanguage.getLocale;
    data.zh_name = zxLange.value[currentLang];
    // 语言设置问题
    zhText.value = data.zh_name;
    // 币种处理
    if (Array.isArray(systemCurrency.value)) {
      openTerminalState.checkedList = JSON.parse(data.lang);
    } else {
      openTerminalState.checkedList = [systemCurrency.value];
    }

    currentCurryId.value = checkIdAndReturnFirst(data.currency_id);

    if (data.apply_period) data.apply_period = secondsToDays(data.apply_period);
    if (data.apply_condition) {
      let apply_condition = JSON.parse(data.apply_condition);
      if (!Array.isArray(apply_condition)) {
        data.apply_condition = '[]';
      }
    }

    startTime.value = {
      start_at: dayjs(data.start_at_tz),
      end_at: dayjs(data.end_at_tz),
    };
    if (!data.category_id || data.category_id == 'null') {
      data.category_id = '[]';
    }
    await setFieldsValueLeft({
      ...data,
      recommend: data.recommend == 1 ? true : false,
      category_id: JSON.parse(data.category_id),
      lang: JSON.parse(data.lang),
      client_type: getType(JSON.parse(data.client_type)),
      category: JSON.parse(data.category),
      apply_condition: JSON.parse(data.apply_condition),
      startTime: {
        start_at: dayjs(data.start_at_tz),
        end_at: dayjs(data.end_at_tz),
      },
      currency_id: data.currency_id,
      display_type: Number(data.display_type),
      rule_type: data.rule_type,
      activeContent: data.active_content,
      defaultState: defaultState.value,
    });

    setTxtcontent.value.multiple = data.multiple;

    (clientType.value = getType(JSON.parse(data.shortcut_client))),
      setFieldsValueLeft({
        button_redirect: data.button_redirect,
        button: data.button,
        button_type: data.button_type,
      });

    if (data.ty == 5 && data.display_type == 2) {
      setFieldsValueLeft({
        button_redirect_5: data.button_redirect,
        button_type_5: data.button_type,
      });
    }

    contentList.value.forEach((item: any) => {
      if (data['detail_images'] && JSON.parse(data['detail_images'])?.[item.value]) {
        item.text_image_url = JSON.parse(data['detail_images'])[item.value];
        item.textFileList = [
          { uid: '1', name: JSON.parse(data['detail_images'])[item.value], status: 'done' },
        ];
      }
    });

    if (data.ty == 14 || data.ty === 18) {
      if (data.ty === 18) {
        chosenLang18.value = data.lang;
      }
      await updateValidList(true, data);
      await nextTick();
      const echoLangs = JSON.parse(data.lang);
      openTerminalState.checkedList = Array.isArray(echoLangs) ? echoLangs : [echoLangs];
      // 然后再把 lang 值同步到表单
      setFieldsValueLeft({
        lang: openTerminalState.checkedList,
        CurrencyConfig: openTerminalState.checkedList,
      });

      setTimeout(() => {
        promoForm.value?.validateFields(['lang']);
      }, 0);

      contentList.value.forEach((item) => {
        if (data['images'] && JSON.parse(data['images'])?.[item.value])
          item.image_url = JSON.parse(data['images'])[item.value];
        //item.image_url = image_url[item.value]
        item.transitionValue = data.summary[item.value];
        //item.transitionValueTitle = title[item.value]
        if (data['images'] && JSON.parse(data['images'])?.[item.value])
          item.fileList = [
            { uid: '1', name: JSON.parse(data['images'])[item.value], status: 'done' },
          ];
      });
      if (data.ty == 14) {
        const echoData = JSON.parse(data.config);
        const echoKeys = Object.keys(echoData.bonus);
        const transformData = echoKeys.reduce((pre, langVal) => {
          pre[langVal] = echoChargeData(echoData.bonus, langVal, echoData.tongue);
          return pre;
        }, {});
        rewardMethodsSelected.value = echoData.tongue;
        const currentKey = typeKeys[echoData.tongue];
        const tranKeys = Object.keys(transformData);
        tranKeys.forEach((key) => {
          rewardFormValidate.value.conditions[currentKey][key] = transformData[key];
        });
        setFieldsValueLeft({ rewardMethods: echoData.tongue });
        setTimeout(() => {
          chargeDynamicText.currentMoney = chargeDynamicText.money[echoData.tongue];
          changTextData(14);
        }, 100);
      }
    } else {
      contentList.value.forEach((item) => {
        if (data['images'] && JSON.parse(data['images'])?.[item.value])
          item.image_url = JSON.parse(data['images'])[item.value];
        item.transitionValue = data.summary[item.value];
        if (data['images'] && JSON.parse(data['images'])?.[item.value])
          item.fileList = [
            { uid: '1', name: JSON.parse(data['images'])[item.value], status: 'done' },
          ];
      });
    }

    let redTempConfig;
    if (data.ty == 3) {
      redTempConfig = JSON.parse(data.config);
    }

    if (data.ty === 1) {
      const result = JSON.parse(data.config);
      for (let i = 0; i < result.length; i++) {
        const currencyId = result[i].currency_id;
        for (let j = 0; j < currenyLang.value.length; j++) {
          if (currenyLang.value[j].value === currencyId) {
            currenyLang.value[j].ty1_config = result[i];
            break;
          }
        }
      }
      //规则说明
    } else if (data.ty === 2) {
      const result = JSON.parse(data.config);
      result.bonus_tpl = Number(result.bonus_tpl);
      result.condition_type = Number(result.condition_type);
      result.show_amount = Number(result.show_amount);
      result.bonus_type = Number(result.bonus_type);
      setFieldsValueLeft(result);
      currenyLang.value.forEach((currency) => {
        if (result.cur[currency.value]) {
          RawData.push(currency.value);
          currency.ty2_config = {
            first_deposit_amount: result.cur[currency.value].first_deposit_amount,
            pplBonus: result.cur[currency.value].settings,
            device_limit: result.cur[currency.value].device_limit,
            ip_limit: result.cur[currency.value].ip_limit,
            total_deposit_amount: result.cur[currency.value].total_deposit_amount,
            total_bet_amount: result.cur[currency.value].total_bet_amount,
            total_deposit_days: result.cur[currency.value].total_deposit_days,
            total_deposit_times: result.cur[currency.value].total_deposit_times,
            bonus_tpl: result.bonus_tpl,
            condition_type: result.condition_type,
            show_amount: result.show_amount,
            bonus_type: result.bonus_type,
          };
        }
      });

      changeHandleCurry(currentCurryId.value);
    } else if (data.ty == 3 && redTempConfig?.tpl == 1) {
      // 老模板
      defaultTemp.value = 2;
      nextTick(() => {
        const daysArray = Object.keys(redTempConfig.date.weekly).filter(
          (day) => redTempConfig.date.weekly[day],
        );
        // refRedEmvelope.value.redUpperLimit = result.limit.bonus;
        refRedEmvelope.value.dailyCollectionLimit = redTempConfig.limit.daily;
        setTxtcontent.value.dailyCollectionLimit = redTempConfig.limit.daily;
        refRedEmvelope.value.selectedWeek = daysArray;
        refRedEmvelope.value.dayTimeTagSelected = redTempConfig.date.base;
        refRedEmvelope.value.startDate = redTempConfig.date.monthly[0];
        refRedEmvelope.value.endDate = redTempConfig.date.monthly[1];
        refRedEmvelope.value.otherTimeTagSelected = redTempConfig.date.custom;
        refRedEmvelope.value.conditionType = String(redTempConfig.cond.flag);
        const redList =
          redTempConfig.cond.list &&
          redTempConfig.cond.list.map((item) => {
            return {
              chipsRange: { min: item.scope[0], max: item.scope[1] },
              miniDeposit: item.deposit,
              chipsMultiple: item.times,
              dollarPercent: item.scale,
            };
          });
        refRedEmvelope.value.conditionData = redList;
      });
    } else if (data.ty === 3) {
      currentCurryId.value = checkIdAndReturnFirst(redTempConfig.currency);
      const config = redTempConfig[currentCurryId.value].config;
      await setFieldsValueLeft({
        ...config,
        bonusty: redTempConfig[currentCurryId.value]?.bonus.ty,
        bonusmethod: redTempConfig[currentCurryId.value]?.bonus.method,
      });
      dropStyle.value = config.drop;
      const tableData = newRefRedEmvelope.value.conditionData;
      const tableData2 = newRefRedEmvelope2.value.conditionData;
      delete redTempConfig.currency;
      Object.keys(redTempConfig).forEach((key) => {
        redTempConfig[key].cond.map((item) => {
          item.amount = item.amount.map((amount) => (amount == '8888999' ? '' : amount));
        });
        const cond = redTempConfig[key].cond;
        const period = redTempConfig[key].period.map((period) =>
          period.map((item) => (item === '8888999' ? null : item)),
        );

        tableData2[key][0].cond = cond;
        tableData[key][0].period = period;
        tableData[key][0].config = redTempConfig[key].config;
        tableData[key][0].bonus = redTempConfig[key].bonus;
      });

      // openTerminalState.checkedList.forEach((lang) => {
      //   if (newRefRedEmvelope.value && lang == currencyListTranslate[currentCurryId.value]) {
      //     const cond = redTempConfig[lang].cond;

      //     const period = redTempConfig[lang].period;
      //     tableData2[lang][0].cond = cond;
      //     tableData[lang][0].period = period;
      //     tableData[lang][0].config = redTempConfig[lang].config;
      //     tableData[lang][0].bonus = redTempConfig[lang].bonus;
      //   }
      // });
    } else if (data.ty == 12) {
      redTempConfig = JSON.parse(data.config);
      setFieldsValueLeft({ ...redTempConfig });
      if (!redTempConfig.platform_ids.length) setFieldsValueLeft({ platform_range: 1 });
      platform_range.value = redTempConfig?.platform_range;
      originalData12.value = redTempConfig.ladder;
      nextTick(() => {
        if (Object.keys(originalData12.value).length) {
          Object.keys(originalData12.value).forEach((key) => {
            const extractedArray = originalData12.value[key];

            Object.keys(
              currencyTreeList12.value[key][`staticType${redTempConfig.staticType}`],
            ).forEach((adwardType) => {
              if (adwardType === `adwardType${redTempConfig.adwardType}`) {
                currencyTreeList12.value[key][`staticType${redTempConfig.staticType}`][
                  adwardType
                ].length = 0;
                extractedArray.forEach((item) => {
                  currencyTreeList12.value[key][`staticType${redTempConfig.staticType}`][
                    adwardType
                  ].push(item);
                });
              }
            });
          });
        }
      });

      if (platform_range.value === 2) {
        platform_ids.value = redTempConfig?.platform_ids;
      }
    } else if (data.ty == 13) {
      const echoData = JSON.parse(data.config);
      const { bet, fixed_start_at, fixed_end_at, recharge } = echoData;
      get_leftValues13.value = {
        fixed_start_at,
        bet,
        fixed_end_at,
        multiple: data.multiple,
      };
      setFieldsValueLeft({ bet, fixedTime: get_leftValues13.value });
      nextTick(() => {
        rechargeDayRef.value.conditionData = recharge;
      });
      changeHandleCurry(currentCurryId.value);
    } else if (data.ty == 16) {
      redTempConfig = JSON.parse(data.config);
      const oldCurrentCurryId = redTempConfig?.currency_id;
      currentCurryId.value = checkIdAndReturnFirst(redTempConfig?.currency_id);
      changeHandleCurry(currentCurryId.value);
      redTempConfig.currency_id = currentCurryId.value;
      setFieldsValueLeft({ ...redTempConfig });
      if (!!!redTempConfig.platform_ids.length) setFieldsValueLeft({ platform_range: 1 });
      platform_range.value = redTempConfig?.platform_range;
      if (platform_range.value === 2) {
        platform_ids.value = redTempConfig?.platform_ids;
      }
      if (currentCurryId.value === oldCurrentCurryId) {
        nextTick(() => {
          let tableData = {};
          for (const key in redTempConfig.ladder) {
            let templateData = cloneDeep(activity16_table_.value.templateData);
            templateData[redTempConfig.reward_type][redTempConfig.amount_type] =
              redTempConfig.ladder[key];
            tableData[key] = templateData;
          }
          activity16_table_.value.initData = tableData;
        });
      }
    } else if (data.ty == 17) {
      redTempConfig = JSON.parse(data.config);
      setFieldsValueLeft({ ...redTempConfig });
      if (!!!redTempConfig.plat_ids.length) setFieldsValueLeft({ platform_range: 1 });

      platform_range.value = redTempConfig?.platform_range;
      if (platform_range.value === 2) {
        platform_ids.value = redTempConfig?.plat_ids;
      }
      if (Array.isArray(systemCurrency.value && redTempConfig)) {
        openTerminalState.checkedList = Object.keys(redTempConfig);
        const fistLang = openTerminalState.checkedList[0];
        dropStyle.value = redTempConfig[fistLang].drop;
        const orderedList = Object.values(currencyListTranslate);
        openTerminalState.checkedList = openTerminalState.checkedList.sort((a, b) => {
          return orderedList.indexOf(a) - orderedList.indexOf(b);
        });
      }

      openTerminalState.checkedList.forEach((lang) => {
        if (activity17_table_.value) {
          const tableData = activity17_table_.value.conditionData;
          const backCond = [redTempConfig.bonus_cond];
          // const backConfig = redTempConfig.config;
          // const backType = redTempConfig.type;

          tableData[lang] = backCond.map((_, index) => ({
            key: (index + 1).toString(),
            index: (index + 1).toString(),
            type: '2',
            miniDeposit: '',
            chipsMultiple: '',
            conditionType: '1',
            conditionTime: [{ str: undefined, end: undefined }],
            conPartType: '2',
            miniPartDeposit: '',
            intervalDeposit: [{ min: '', max: '' }],
            chipsMultiples: [{ chipsMultiple: '' }],
          }));
          tableData[lang].forEach((entry, index) => {
            const serverEntry = backCond[index];

            const timeToMinutes = (timeStr) => {
              const [hours, minutes] = timeStr.split(':').map(Number);
              return hours * 60 + minutes; // 转换为总分钟数
            };
            entry.conditionTime = Object.entries(serverEntry.time)
              .sort(([aStr], [bStr]) => timeToMinutes(aStr) - timeToMinutes(bStr)) // 按 str 升序排序
              .map(([str, end]) => ({
                str,
                end,
              }));

            if (!Array.isArray(serverEntry.deposit) || serverEntry.deposit.length < 1) {
              serverEntry.deposit = [
                {
                  amount: serverEntry.deposit ?? '', //存款金额
                  fixed: serverEntry.fixed ?? '', //固定金额或固定比例
                  min: '0', //随机金额或随机比例 起步金额
                  max: '0', //随机金额或随机比例 最大金额
                },
              ];
            }
            if (!Array.isArray(serverEntry.coded) || serverEntry.coded.length < 1) {
              serverEntry.coded = [
                {
                  amount: serverEntry.coded ?? '', //存款金额
                  fixed: serverEntry.fixed ?? '', //固定金额或固定比例
                  min: '0', //随机金额或随机比例 起步金额
                  max: '0', //随机金额或随机比例 最大金额
                },
              ];
            }
            if (!Array.isArray(serverEntry.wax) || serverEntry.wax.length < 1) {
              serverEntry.wax = [
                {
                  amount: serverEntry.wax ?? '', //存款金额
                  fixed: serverEntry.fixed ?? '', //固定金额或固定比例
                  min: '0', //随机金额或随机比例 起步金额
                  max: '0', //随机金额或随机比例 最大金额
                },
              ];
            }
            entry.intervalDeposit = serverEntry.deposit.map(({ amount, fixed, min, max }) => ({
              fixed: fixed ?? '',
              min: amount ?? '',
              max: max ?? '',
            }));
            entry.wax = serverEntry.wax?.map(({ amount, fixed, min, max }) => ({
              fixed: fixed ?? '',
              min: amount ?? '',
              max: max ?? '',
            }));
            entry.coded = serverEntry.coded?.map(({ amount, fixed, min, max }) => ({
              fixed: Number(fixed) || '',
              min: Number(amount) || '',
              max: Number(max) || '',
            }));

            serverEntry.chipsMultiple = !!serverEntry.wax[0].fixed
              ? serverEntry.wax
              : !!serverEntry.coded[0].fixed
              ? serverEntry.coded
              : serverEntry.deposit;

            entry.chipsMultiples = serverEntry.chipsMultiple.map(
              ({ amount, fixed, min, max, scal }) => ({
                chipsMultiple: Number(fixed) || '',
                chipsMultiple2: Number(max) || '',
              }),
            );
          });
          // newRefRedEmvelope.value.dailyCollectionLimit[lang] = backConfig.claimLimit;
          // newRefRedEmvelope.value.redBagCountDown[lang] = backConfig.countdown;
        }
      });
    } else if (data.ty === 4 || data.ty === 7 || data.ty == 6) {
      if (data.ty == 4 || data.ty === 7) {
        const result_ = JSON.parse(data.config);
        setFieldsValueLeft({ period: 1 });
        setFieldsValueLeft({ incentiveConfig: 1 });
        setFieldsValueLeft({ platform_range: Number(result_.platform_range) });
        setFieldsValueLeft({ platform_ids: result_.platform_ids });
        platform_ids.value = result_.platform_range == 1 ? [] : result_.platform_ids;
        platform_range.value = Number(result_.platform_range);
        // if (defaultTy.value == 7) changTextData(7);
        if (data.ty === 4) {
          const result = result_.profit_cur_config;
          for (let i = 0; i < result.length; i++) {
            const currencyId = result[i].currency_id;
            if (currencyId == currentCurryId.value) {
              setTimeout(() => {
                setFieldsValueLeft({ prize_limit: result[i].prize_limit });
              }, 111);
            }
            for (let j = 0; j < currenyLang.value.length; j++) {
              if (currenyLang.value[j].value === currencyId) {
                setTimeout(() => {
                  currenyLang.value[j].ty4_config = result[i];
                }, 111);
                break;
              }
            }
          }
        }
        if (data.ty === 7 && Lucky_betSlot.value) {
          let tableData = result_.lucky_bet_cur_config;

          const res = tableData.reduce((acc, item) => {
            acc[item.currency_id] = {
              lucky_bet_prize_config: item.lucky_bet_prize_config.map((element, index) => ({
                index: index + 1,
                m: element.valid_bet_amount,
                n: element.receive_count,
                c: '',
                t: '',
                l: '',
              })),
              lucky_number_config: item.lucky_number_config.map((element, index) => ({
                index: index + 1,
                c: element.lucky_number,
                t: element.bonus_multiple,
                l: element.limit,
                m: '',
                n: '',
              })),
            };
            return acc;
          }, {});

          XYtableData.value = res;

          // Lucky_betSlot.value.conditionData = res;
        }
      }
      // 每日奖励活动config配置数据回显
      if (data.ty == 6) {
        const echoData = JSON.parse(data.config);
        // 方法
        setFieldsValueLeft({
          rewardMethods: echoData.method,
          statisticalPeriod: echoData.period,
        });
        rewardMethods.value = echoData.method;
        // 场馆
        if (echoData.all == 2) {
          await setFieldsValueLeft({ platform_range: 2 });
          setFieldsValueLeft({ platform_ids: echoData.plat_ids });
          platform_range.value = 2;
          platform_ids.value = echoData.plat_ids;
        } else {
          platform_range.value = 1;
          setFieldsValueLeft({ platform_range: 1 });
        }
        // 表格
        //过滤后的
        const filterCurrencyLangMap = (() => {
          const result = {};
          currencyList.value.forEach((item) => {
            if (currentyOptions[item.value]) {
              result[item.value] = currentyOptions[item.value];
            }
          });
          return result;
        })();
        const filterLangMap = Object.entries(filterCurrencyLangMap).reduce((acc, [key, value]) => {
          if (Object.keys(echoData.currency).includes(key as string)) {
            acc[key] = value;
          }
          return acc;
        }, {});
        if (everydayBetRef.value) {
          // 初始化 conditionData
          if (!everydayBetRef.value.conditionData) {
            everydayBetRef.value.conditionData = {};
          }

          Object.entries(filterLangMap).reduce((acc, [currencyKey, langValue]) => {
            if (echoData.currency[currencyKey]) {
              // 确保该语言的数组已初始化
              if (!everydayBetRef.value.conditionData[langValue as string]) {
                everydayBetRef.value.conditionData[langValue as string] = [];
              }

              echoData.currency[currencyKey].forEach((item, index) => {
                everydayBetRef.value.conditionData[langValue as string][index as number] = {
                  key: (index + 1).toString(),
                  index: (index + 1).toString(),
                  type: '1',
                  miniDeposit: item.valid,
                  everyReward: item.bonus,
                };
              });
            }
            return acc;
          }, {});
        }
        /* openTerminalState.checkedList.forEach((lang) => {
                if (everydayBetRef.value) {
                  const tableData = everydayBetRef.value.conditionData;
                  const langIndex = currencyList.value.filter((cur) => cur.lang == lang);
                  const actualList = echoData.currency[langIndex[0].value];

                  if (tableData[lang].length !== actualList.length) {
                    // 调整 conditionData 的行数与 返回的行数 一致
                    tableData[lang] = actualList.map((_, index) => ({
                      key: (index + 1).toString(),
                      index: (index + 1).toString(),
                      type: '1',
                      miniDeposit: '',
                      // conditionType: '1',
                      everyReward: '',
                    }));
                  }
                  tableData[lang].forEach((recordData, index) => {
                    const serverEntry = actualList[index];
                    recordData.miniDeposit = serverEntry.valid || '';
                    // recordData.conditionType = serverEntry.f.toString();
                    recordData.everyReward = serverEntry.bonus;
                  });
                }
              }); */
      }
      changeHandleCurry(currentCurryId.value);
    } else if (data.ty == 8) {
      // 充值回显
      const echoData = JSON.parse(data.config);
      await setFieldsValueLeft({ rewardMethods: echoData.bonus });
      await setFieldsValueLeft({
        chargeCondition: echoData.cond,
        isChargeTime: echoData.cond == 1 ? echoData.period.flag : '',
        cycleMode: echoData.cond == 2 ? echoData.period.flag : '',
        chargeTimeList:
          echoData.cond == 1
            ? { num: echoData.period.val, selectValue: echoData.period.ty }
            : { num: '', selectValue: '' },
        registerCharge: echoData.cond == 3 ? echoData.period.days : [],
      });
      if (echoData.cond == 1) {
        setFieldsValueLeft({ firstDepositPop: echoData.firstDepositPop });
        if (echoData.firstDepositPop == 1)
          setFieldsValueLeft({ appearLocation: echoData.appearLocation });
        eventBus.emit('onChargeDynamicText', { value: echoData.period.flag, type: 'isLimit' });
        if (echoData.period.flag == 1) {
          eventBus.emit('onChargeDynamicText', { value: echoData.period.val, type: 'time' });
          eventBus.emit('onChargeDynamicText', { value: echoData.period.ty, type: 'timeUnit' });
        }
      }
      rewardMethodsSelected.value = echoData.bonus;
      const echoKeys = Object.keys(echoData.tongue);
      const transformData = echoKeys.reduce((pre, langVal) => {
        pre[langVal] = echoChargeData(echoData.tongue, langVal, echoData.bonus);
        return pre;
      }, {});

      const currentKey = typeKeys[echoData.bonus];
      const tranKeys = Object.keys(transformData);
      tranKeys.forEach((key) => {
        rewardFormValidate.value.conditions[currentKey][key] = transformData[key];
      });
    } else if (data.ty === 9) {
      redTempConfig = JSON.parse(data.config);
      const { currency_id, conf } = redTempConfig;
      const oldCurrentCurryId = currency_id;
      currentCurryId.value = checkIdAndReturnFirst(currency_id);
      // changeHandleCurry(currentCurryId.value);
      const {
        platform_range,
        platform_ids: dataPlatform_ids,
        period,
        period_1,
        period_2,
      } = conf.find((f) => f.currency_id === currency_id);
      let periodData = { loop: undefined, type: undefined, extra: undefined };
      if (period == 1) {
        periodData = period_1;
      } else {
        periodData = period_2;
      }
      const { loop, type, extra } = periodData;
      redTempConfig.currency_id = currentCurryId.value;
      await setFieldsValueLeft({
        period,
        platform_range,
        platform_ids: dataPlatform_ids,
        currency_id: currentCurryId.value,
        loop,
        type,
        extra,
      });
      if (platform_range === 2) {
        platform_ids.value = dataPlatform_ids;
      } else {
        platform_ids.value = [];
      }
      if (currentCurryId.value === oldCurrentCurryId) {
        nextTick(() => {
          const activity9_sign_in_table_data = {};
          const activity9_additional_table_data = {};
          const temWeek = new Array(7).fill({}).map((p, index) => {
            return {
              // signIn: p.label,
              day: index + 1,
              deposit: '',
              bet: '',
              bonus: '',
            };
          });
          const temMonthly = new Array(31).fill({}).map((p, index) => {
            return {
              // signIn: p.label,
              day: index + 1,
              deposit: '',
              bet: '',
              bonus: '',
            };
          });
          const temRow = [{ day: undefined, deposit: '', bet: '', bonus: '' }];
          conf.forEach((p) => {
            activity9_sign_in_table_data[p.currency_id] = {
              ...p,
              period_1: {
                ...p.period_1,
                base_conf: {
                  type1: temWeek,
                  type2: temWeek,
                  type3: temWeek,
                  ['type' + p.period_1.type]: p.period_1.base_conf,
                },
              },
              period_2: {
                ...p.period_2,
                base_conf: {
                  type1: temMonthly,
                  type2: temMonthly,
                  type3: temMonthly,
                  ['type' + p.period_2.type]: p.period_2.base_conf,
                },
              },
            };
            activity9_additional_table_data[p.currency_id] = {
              period_1: {
                serial: p.period_1.extra_conf.serial?.length
                  ? p.period_1.extra_conf.serial
                  : cloneDeep(temRow),
                jackpot: p.period_1.extra_conf.jackpot?.length
                  ? p.period_1.extra_conf.jackpot
                  : cloneDeep(temRow),
              },
              period_2: {
                serial: p.period_2.extra_conf.serial?.length
                  ? p.period_2.extra_conf.serial
                  : cloneDeep(temRow),
                jackpot: p.period_2.extra_conf.jackpot?.length
                  ? p.period_2.extra_conf.jackpot
                  : cloneDeep(temRow),
              },
            };
          });
          activity9_sign_in_table_.value.conditionData = activity9_sign_in_table_data;
          activity9_additional_table_.value.conditionData = activity9_additional_table_data;
        });
      }
    } else if (data.ty === 14 && wallet_slot.value) {
      const result_ = JSON.parse(data.config);
      const tableData = get_tableData.value;
      setFieldsValueLeft({ cycleMode: 1 });
      tableData.bonus = result_.bonus;
      tableData.cryptocurrency = result_.cryptocurrency;
      tableData.wallet = result_.wallet;
      currenyLang.value = currencyList14;
      clientList.value = currencyList14[0]?.clientList;
      selectList.value = result_.cryptocurrency.concat(result_.wallet);
    } else if (data.ty == 10) {
      setFieldsValueLeft({ statisticalPeriod: 1 });
      // 代理日
      const echoData = JSON.parse(data.config);
      nextTick(() => {
        currentCurryId.value = checkIdAndReturnFirst(echoData?.currency);
        const currentKey = typeKeys[1];
        if ((currentCurryId.value = echoData?.currency)) {
          agentDaysFormValidate.value.conditions[currentKey] = echoData.tongue;
        }
      });
    } else if (data.ty == 11) {
      setFieldsValueLeft({ statisticalPeriod: 3, getTime: 2 });
      // 代理月
      const echoData = JSON.parse(data.config);
      nextTick(() => {
        currentCurryId.value = checkIdAndReturnFirst(echoData?.currency);
        const currentKey = typeKeys[1];
        if ((currentCurryId.value = echoData?.currency)) {
          agentMonthsFormValidate.value.conditions[currentKey] = echoData.tongue;
        }
      });
    } else if (data.ty == 15) {
      const echoData = JSON.parse(data.config);
      mysteryShow.value = false;
      setTimeout(() => {
        mysterySource.value = echoData['config_info'];
        const currencyData = mysterySource.value[currentCurryId.value];
        setFieldsValueLeft({
          reset_mode: currencyData?.reset_mode || 'one',
          award_mode: currencyData?.award_mode || 'recharge',
        });
        mysteryShow.value = true;
        changTextData(15);
      }, 200);
      // 代理日
      // const echoData = JSON.parse(data.config);
      // const echoKeys = Object.keys(echoData.tongue);
      // const transformData = echoKeys.reduce((pre, langVal) => {
      //   pre[langVal] = echoChargeData(echoData.tongue, langVal, echoData.bonus);
      //   return pre;
      // }, {});
      // rewardMethodsSelected.value = echoData.bonus;
      // const currentKey = typeKeys[echoData.bonus];
      // const tranKeys = Object.keys(transformData);
      // tranKeys.forEach((key) => {
      //   rewardFormValidate.value.conditions[currentKey][key] = transformData[key];
      // });
      // setFieldsValueLeft({ statisticalPeriod: echoData.period, rewardMethods: echoData.bonus });
      // setTimeout(() => {
      //   chargeDynamicText.currentMoney = chargeDynamicText.money[echoData.bonus];
      //   changTextData(15);
      // }, 100);
    } else if (data.ty === 18) {
      const inviteFriendsData = JSON.parse(data.config);
      currentCurryId.value = checkIdAndReturnFirst(inviteFriendsData?.currencyConfig);

      init18.value++;
      for (let key in inviteFriendsData['inviteFriendsBonusTypeInfo']) {
        if (inviteFriendsData['inviteFriendsBonusTypeInfo'].hasOwnProperty(key)) {
          cloneDeep18.value[key] = {
            inviteFriendsBonusTypeInfo: {
              accumulatedDepositCondition:
                inviteFriendsData['inviteFriendsBonusTypeInfo'][key].accumulatedDepositCondition,
              accumulatedDepositBonus:
                inviteFriendsData['inviteFriendsBonusTypeInfo'][key].accumulatedDepositBonus,
              validBetCondition:
                inviteFriendsData['inviteFriendsBonusTypeInfo'][key].validBetCondition,
              validBetBonus: inviteFriendsData['inviteFriendsBonusTypeInfo'][key].validBetBonus,
              singleDepositType:
                inviteFriendsData['inviteFriendsBonusTypeInfo'][key].singleDepositType,
              singleDepositCondition:
                inviteFriendsData['inviteFriendsBonusTypeInfo'][key].singleDepositCondition,
              singleDepositBonus:
                inviteFriendsData['inviteFriendsBonusTypeInfo'][key].singleDepositBonus,
            },
            inviteFriendsBonusTypeSelected:
              inviteFriendsData['inviteFriendsBonusTypeInfo'][key].inviteFriendsBonusType,
          };
        }
      }

      inviteFriendsInfo.value.inviteFriendsBonusTypeSelected =
        cloneDeep18.value[currentCurryId.value]?.inviteFriendsBonusTypeSelected;

      inviteFriendsInfo.value.inviteFriendsBonusTypeInfo =
        cloneDeep18.value[currentCurryId.value]?.inviteFriendsBonusTypeInfo;

      platform_range.value = inviteFriendsData?.platform_range;

      if (platform_range.value === 2) {
        platform_ids.value = inviteFriendsData?.platform_ids;
      }

      setFieldsValueLeft({
        ...cloneDeep18.value[currentCurryId.value],
        inviteFriendsBonusType: inviteFriendsInfo.value.inviteFriendsBonusTypeSelected,
      });
    }

    const content = JSON.parse(data.detail);
    const summary = JSON.parse(data.summary);
    //参与次数
    if (data.apply_limit > 3) {
      setFieldsValueLeft({ apply_limit: 5 });
      applyLimit.value = data.apply_limit;
    }
    if (data.ty == 1) {
      if (!periodList.some((item) => item.value === data.period)) {
        setFieldsValueLeft({ period: 5 });
        periodModel.value = secondsToDays(data.period);
        setTxtcontent.value.period = 5;
      }
    }

    if (data.ty == 4 || data.ty === 7) {
      if (!periodListBilling.some((item) => item.value === data.period)) {
        // setFieldsValueLeft({ period: 5 });
        periodModel.value = secondsToDays(data.period);
      }
      setTxtcontent.value.apply_period = data.apply_period;
      setTxtcontent.value.period = data.period;
    }
    // 推广活动

    //活动简介
    switchState.value = data.shortcut;
    validMemberNum.value = JSON.parse(data.config).additional_config;
    imageUrl.value = JSON.parse(data.shortcut_detail)[0];

    setTimeout(() => {
      contentList.value.forEach((item) => {
        if (data.ty == 5 || data.ty == 18) {
          item.transitionValue = content[item.value];
        } else {
          if (data.rule_type == 2) item.transitionValue = content[item.value];
          else item.textContent = content[item.value];
        }
        if (defaultTy.value != 5)
          item.textContent =
            defaultTy.value != 3
              ? getTextData(defaultTy.value)[item.value]
              : getTextData('newRedTemp')[item.value];

        item.zxTransitionValue = zxLange.value[item.value];
        item.btnTransitionValue = btnLange.value[item.value];
      });
      if (data.ty == 1) handlePhoneDetail(null, contentList.value[0]);
      handleClickContentImg(0);
      setContentList();
    });
    contentListDetail.value.forEach((item) => {
      item.transitionValue = summary[item.value];
    });
    setFieldsValueLeft({
      contentEdit:
        contentList.value && contentList.value.length > 0
          ? contentList.value[0].transitionValueContent
          : '',
    });
  }

  onMounted(async () => {
    await setFieldsValueLeft({
      ty: 1,
      period: 259200,
      rule_type: 1,
      automatic: 2,
      currentCurryId: currentCurryId.value,
    });
    disabledType.value = false;
    getStateId.value = history.state.id;
    eventBus.on('updatedailyCollectionLimit', (value) => {
      if (defaultTemp.value == 2) {
        setTxtcontent.value.dailyCollectionLimit = value;
        changTextData(3);
      }
    });
    updateValidList();
    eventBus.on('onRewardMethodsChange', (data: any) => {
      rewardMethodsSelected.value = data;
    });
    eventBus.on('inviteFriendsBonusTypeCheckbox', (data: any) => {
      inviteFriendsInfo.value.inviteFriendsBonusTypeSelected = data;
    });
  });
  onUnmounted(() => {
    eventBus.off('updatedailyCollectionLimit');
    eventBus.off('onRewardMethodsChange');
    eventBus.off('inviteFriendsBonusTypeCheckbox');
  });

  // 全选开放终端
  function onCheckAllChange(e: any, model: any, field: any): void {
    Object.assign(openTerminalState, {
      checkedList: e.target.checked
        ? defaultTy.value == 15
          ? [openLangOptions[0]]
          : openLangOptions
        : [],
      indeterminate: false,
    });
    model[field] = e.target.checked
      ? defaultTy.value == 15
        ? [openLangOptions[0]]
        : openLangOptions
      : [];
  }

  function onChangeOpenTerminal(value: string[], model: any, field: any): void {
    model[field] = value;
  }
  // 按这个顺序传值
  const defaultCurrencies = [
    'zh_CN',
    'pt_BR',
    'vi_VN',
    'th_TH',
    'hi_IN',
    'en_US',
    'tl_PH',
    'ko_KR',
  ];

  // 这里报错 先默认写死 701
  const firstCurrencyId: any = computed(() => {
    // for (let lang of defaultCurrencies) {
    //   if (openTerminalState.checkedList.includes(lang)) {
    //     return currencyList.value.filter((item) => item.lang == lang)[0].value;
    //   }
    // }
    return currencyTreeList[0].value; // 如果没有找到，则返回 null 或者其他默认值
  });

  async function getCategory(lang) {
    if (lang.length == 0) {
      categoryIDList.value = [];
      return false;
    }
    const data = await getCategoryList({ lang: currentLanguage.getLocale });
    categoryIDList.value = data?.map((item) => {
      return { label: item.name, value: item.id };
    });
  }

  watch(
    () => openTerminalState.checkedList,
    (val) => {
      openTerminalState.indeterminate =
        !!val.length && val.length < openTerminalOptions.value.length;
      openTerminalState.checkAll = val.length === openTerminalOptions.value.length;
      setFieldsValueSettingLeft({
        lang: openTerminalState.checkedList,
        CurrencyConfig: openTerminalState.checkedList,
      });
      if (defaultTy.value != 14)
        zxLange.value = updateObj(openTerminalState.checkedList, zxLange.value);
      btnLange.value = updateObj(openTerminalState.checkedList, btnLange.value);
      contentList.value = filterHandleCurrylang(openTerminalState.checkedList);

      if (contentList.value.length > 0) currentLang.value = contentList.value[0];
      else currentLang.value = langList.value[0];
      currentCurryId.value = currentCurryId.value || currenyLang.value[0]?.value || '701';
      changeHandleCurry(currentCurryId.value);
      if (defaultTy.value != 5 && defaultTemp.value != 1) {
        contentList.value.forEach((item) => {
          item.textContent = getTextData(defaultTy.value)[item.value];
        });
      }
      if (defaultTy.value == 5) {
        setTimeout(() => {
          setContentList();
        });
      }
      getCategory(openTerminalState.checkedList);
    },
  );

  watch(
    () => defaultTy.value,
    (newVal, oldVal) => {
      if (newVal == 14) {
        setFieldsValueLeft({ cycleMode: 1 });
        currenyLang.value = currencyList14;
        clientList.value = currencyList14[0]?.clientList;
        selectList.value = currencyList14?.selectList;
      } else {
        currenyLang.value = currencyList.value;
      }

      if (newVal != 5 && newVal != 3) {
        contentList.value.forEach((item) => {
          item.textContent = getTextData(newVal)[item.value];
        });
      } else if (newVal == 3) {
        if (defaultTemp.value == 1) {
          contentList.value.forEach((item) => {
            item.textContent = getTextData('newRedTemp')[item.value];
          });
        }
      }
    },
    { immediate: true },
  );

  watch(defaultTemp, (newVal) => {
    if (newVal == 1) {
      contentList.value.forEach((item) => {
        item.textContent = getTextData('newRedTemp')[item.value];
      });
    }
    if (newVal == 2) {
      // fieldChang('multiple', temporaryStorage.value);

      contentList.value.forEach((item) => {
        item.textContent = getTextData(3)[item.value];
      });
    }
  });
  function addRateConfigty_2() {
    settingsTy_2.value.push({
      ppl: null,
      bonus: '',
    });
  }

  function changdropStyle(v) {
    changTextData(3);
    // contentList.value.forEach((item) => {
    //   item.textContent = getTextData('newRedTemp')[item.value];
    // });
  }

  function changDayValue(e) {
    selectDayValue.value = e.target.value;
  }

  //抽奖金额删减
  function removeRateConfigty_2(item) {
    const index = settingsTy_2.value.indexOf(item);
    if (index !== -1) {
      settingsTy_2.value.splice(index, 1);
    }
  }

  //抽奖金额新增
  function addRateConfigty_4() {
    settingsTy_4.value.push({
      level: (settingsTy_4.value.length + 1).toString(),
    });
  }
  function removeRateConfigty_4(item) {
    const index = settingsTy_4.value.indexOf(item);
    if (index !== -1) {
      settingsTy_4.value.splice(index, 1);

      // 重新生成 level 值
      settingsTy_4.value.forEach((config, index) => {
        config.level = (index + 1).toString();
      });
    }
  }

  async function Initializationty_2() {
    await setFieldsValueLeft({ condition_type: 1, bonus_tpl: 1, show_amount: 1, bonus_type: 1 });
  }

  async function Initializationty_4() {
    await setFieldsValueLeft({ bonus_period: 1, platform_range: 1, bonus_type: 1 });
    // set_Ty_4_data('period', 1);
    // set_Ty_4_data('bonus_type', 1);
    // await setFieldsValueLeft({ period: 604800, platform_range: 1 });
  }
  async function Initializationty_7() {
    await setFieldsValueLeft({ period: 1, platform_range: 1 });
  }
  async function Initializationty_9() {
    await setFieldsValueLeft({
      platform_range: 1,
      period: 1,
      loop: 1,
      type: 1,
      extra: 0,
    });
  }

  async function Initializationty_12() {
    // "show_gift": "100",//会员显示礼金
    // "daily_limit": "100",//会员每日上限
    // "fulfil_cond": 1,//满足条件 1满足任意一个 2必须全部满足 3充值后可领取
    // "reward_type": 1,//奖励类型 1充值 2亏损 3有效投注 0以上都需要(对应fulfil_cond 2)
    // "plat_ids": ["101", "102", "103", "104"],//统计场馆 全部场馆为空数组
    // "way":1,//奖金方式 1固定金额 2随机金额 3固定比例 4随机比例
    await setFieldsValueSettingLeft({
      automatic: 2,
    });
    await setFieldsValueLeft({
      timeType: 0,
      staticType: 0,
      plat_ids: [],
      platform_range: 1,
      adwardType: 0,
    });
  }
  async function Initializationty_16() {
    // "show_gift": "100",//会员显示礼金
    // "daily_limit": "100",//会员每日上限
    // "fulfil_cond": 1,//满足条件 1满足任意一个 2必须全部满足 3充值后可领取
    // "reward_type": 1,//奖励类型 1充值 2亏损 3有效投注 0以上都需要(对应fulfil_cond 2)
    // "plat_ids": ["101", "102", "103", "104"],//统计场馆 全部场馆为空数组
    // "way":1,//奖金方式 1固定金额 2随机金额 3固定比例 4随机比例
    await setFieldsValueLeft({
      cycle: 'daily',
      cycle_offset: 1,
      reward_type: 'recharge',
      plat_ids: [],
      platform_range: 1,
      amount_type: 'fixed',
    });
  }
  async function Initializationty_17() {
    // "show_gift": "100",//会员显示礼金
    // "daily_limit": "100",//会员每日上限
    // "fulfil_cond": 1,//满足条件 1满足任意一个 2必须全部满足 3充值后可领取
    // "reward_type": 1,//奖励类型 1充值 2亏损 3有效投注 0以上都需要(对应fulfil_cond 2)
    // "plat_ids": ["101", "102", "103", "104"],//统计场馆 全部场馆为空数组
    // "way":1,//奖金方式 1固定金额 2随机金额 3固定比例 4随机比例
    await setFieldsValueLeft({
      // show_gift: 1,
      // daily_limit: 1,
      fulfil_cond: 1,
      reward_type: 1,
      plat_ids: [],
      platform_range: 1,
      way: 1,
    });
  }
  async function Initializationty_6() {
    await setFieldsValueLeft({ period: 604800, platform_range: 1, automatic: 2 });
  }
  async function Initializationty_8() {
    await setFieldsValueLeft({ rewardMethods: 1 });
    await setFieldsValueLeft({
      period: 604800,
      chargeCondition: 1,
      chargeTimeList: { num: '', selectValue: 1 },
    });
  }
  async function Initializationty_10() {
    await setFieldsValueLeft({ statisticalPeriod: 1 });
  }
  async function Initializationty_11() {
    await setFieldsValueLeft({ statisticalPeriod: 3, getTime: 2 });
  }
  async function Initializationty_18() {
    await setFieldsValueLeft({
      inviteFriendsBonusType: [1, 2, 3],
      platform_range: 1,
      automatic: 3,
    });
  }
  function changInput(type) {
    if (openTerminalState.checkedList.includes(syslang)) {
      btnLange.value[syslang] = btnText.value;
    }
    if (type == 'RIGHT') setFieldsValueLeft({ button_text: btnText.value });
    else setFieldsValueLeft({ button_text: btnText.value });
  }
  function changInputzhText(e) {
    // if (openTerminalState.checkedList.includes(syslang)) {
    zxLange.value[syslang] = zhText.value;
    // }
    setFieldsValueSettingLeft({ zh_name: zhText.value });
  }

  async function fieldChang(k, v) {
    if (k == 'types') {
      setFieldsValueLeft({ types: v });
      if (v == 2) {
        defaultTy.value = 5;
        await setFieldsValueLeft({ ty: 5 });
      } else {
        defaultTy.value = 1;
        await setFieldsValueLeft({ ty: 1 });
      }
    }
    temporaryStorage.value = v;
    const values = await getFieldsValue();
    // 新模版不需要动态变化
    if (k == 'multiple') {
      setTxtcontent.value.multiple = v;
      if (defaultTy.value == 2) changTextData(2);
      else if (defaultTemp.value != 1) {
        changTextData(3);
      }
      if (values.ty == 3) changTextData(3);
      if (values.ty == 12) changTextData(12);
      if (values.ty == 13) changTextData(13);
      if (values.ty == 15) changTextData(15);
      if (values.ty == 16) changTextData(16);
    }
    if (k == 'rule_type' || k == 'display_type') setContentList();
    if (values.ty == 2) dealwithTy_2(k, v);
    if (values.ty == 4 && k == 'prize_limit') {
      const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
      if (itmeConfig) {
        itmeConfig[0].ty4_config[k] = v;
      }
      changTextData(4);
    }
    if (k == 'timezone') {
      timezone.value = v;
      if (startTime.value.start_at || startTime.value.end_at) {
        setFieldsValueLeft({
          // startTime: {
          //   start_at: getTimestampFromDate(startTime.value.start_at, timezone.value),
          //   end_at: getTimestampFromDate(startTime.value.end_at, timezone.value),
          // },
        });
      }
      if (showTime.value.display_start_at || showTime.value.display_end_at) {
        setFieldsValueLeft({
          showTime: {
            display_start_at: getTimestampFromDate(showTime.value.display_start_at, timezone.value),
            display_end_at: getTimestampFromDate(showTime.value.display_end_at, timezone.value),
          },
        });
      }
    }
    if (k == 'bet') {
      rechargeActiveText.bet = v;
      if (values.ty == 13) changTextData(13);
    }

    if (k == 'reset_mode') {
      mysterySource.value[currentCurryId.value]['reset_mode'] = v;
    }
    if (k == 'award_mode') {
      mysterySource.value[currentCurryId.value]['award_mode'] = v;
      changTextData(15);
    }
  }

  async function dealwithTy_2(k, v) {
    const dataSource = [
      'first_deposit_amount',
      'total_deposit_amount',
      'total_bet_amount',
      'ip_limit',
      'device_limit',
      'total_deposit_days',
      'total_deposit_times',
    ];
    if (dataSource.includes(k)) {
      const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
      if (itmeConfig) {
        itmeConfig[0].ty2_config[k] = v;
      }
    }
  }

  const customUpload = async (e) => {
    const isFileValid = await beforeUpload(e.file);
    if (!isFileValid) return false;

    const params = {
      file: e.file,
      name: 'uploadfile',
      lang: 'zh_CN',
    };
    try {
      const { data } = await uploadPromoImage(params);
      imageUrl.value = data.data;
      e.onSuccess(imageUrl, e);
      message.success(t('component.upload.uploadSuccess'));
      setFieldsValueSettingRight({ shortcut: imageUrl.value });
    } catch (error) {
      message.error(t('component.upload.uploadError'));
      throw new Error(error.response.data);
    }
  };

  // function deletePic() {
  //   imageUrl.value = null;
  // }

  const cloneDeep18 = ref({});
  const init18 = ref(0);
  const initNum18 = ref(0 as number);
  async function changeHandleCurry(value) {
    console.log('changeHandleCurry', value);
    const item1 = currencyList.value.find((item1) => item1.value === value);
    // 限制--只为推广开宝箱活动
    if (initNum.value === 1 && defaultTy.value === 2 && !item1) {
      currencyList.value.push({
        label: currentyOptions[value],
        value: value,
        lang: '',
        ty2_config: cloneDeep(ty2_config),
        ty4_config: cloneDeep(ty4_config),
        ty1_config: cloneDeep(ty1_config),
        ty3_config: cloneDeep(ty3_config),
      });
    }
    // 限制--只为会员日
    if (initNum.value === 1 && defaultTy.value === 12 && !initNum18.value) {
      initNum18.value++;
      currencyTreeList.map((val) => {
        currencyTreeList12.value[val.id] = cloneDeep(cloneDeepInitData12.value);
        return val;
      });
    }
    if (initNum.value === 1 && defaultTy.value === 12) {
      console.log('currencyTreeList12.value', currencyTreeList12.value);
      console.log('value', value);
      initData12.value = currencyTreeList12.value[value];
      console.log('initData12.value', initData12.value);
    }
    // 限制--只为邀请好友活动
    if (!init18.value) {
      init18.value++;
      currencyTreeList.map((val) => {
        cloneDeep18.value[val.id] = {
          inviteFriendsBonusTypeInfo: cloneDeep(
            inviteFriendsInfoData.value.inviteFriendsBonusTypeInfo,
          ),
          inviteFriendsBonusTypeSelected: cloneDeep([1, 2, 3]),
        };
        return val;
      });
    }
    if (initNum.value === 1 && defaultTy.value === 18) {
      inviteFriendsInfo.value = cloneDeep18.value[value];
    }
    currentCurryId.value = value;
    setFieldsValueLeft({ currentCurryId: currentCurryId.value });
    const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
    if (itmeConfig.length > 0) {
      if (defaultTy.value == 2) {
        // 推广
        setFieldsValueLeft(itmeConfig[0].ty2_config);
        settingsTy_2.value = itmeConfig[0]['ty2_config']['pplBonus'];
      }
      if (defaultTy.value == 4) {
        settingsTy_4.value = itmeConfig[0]['ty4_config']['profit_prize_config'];
        await setFieldsValueLeft({ prize_limit: itmeConfig[0]['ty4_config']['prize_limit'] });
        // set_Ty_4_data('bonus_period', itmeConfig[0]['ty4_config']['bonus_period']);
        // set_Ty_4_data('bonus_type', itmeConfig[0]['ty4_config']['bonus_type']);
        setTimeout(() => {
          nextTick(() => clearValidate());
        }, 222);
      }
    }
    if (history.state.id && defaultTy.value == 2) {
      if (!RawData.includes(currentCurryId.value)) {
        setFieldsValueLeft({ ty2: false });
      } else {
        setFieldsValueLeft({ ty2: true });
      }
    }
     if (defaultTy.value == 10) changTextData(10);
    if (defaultTy.value == 1) changTextData(1);
    if (defaultTy.value == 2) changTextData(2);
    if (defaultTy.value == 9) {
      nextTick(() => {
        const conf = activity9_sign_in_table_.value.conditionData[value];
        const { platform_range, platform_ids: dataPlatform_ids, period, period_1, period_2 } = conf;
        let periodData = { loop: undefined, type: undefined, extra: undefined };
        if (period == 1) {
          periodData = period_1;
        } else {
          periodData = period_2;
        }
        const { loop, type, extra } = periodData;
        setFieldsValueLeft({
          period,
          platform_range,
          platform_ids: dataPlatform_ids,
          currency_id: currentCurryId.value,
          loop,
          type,
          extra,
        });
        if (platform_range === 2) {
          platform_ids.value = dataPlatform_ids;
        } else {
          platform_ids.value = [];
        }
        //  form_data.value = {
        //     period,
        //     platform_range,
        //     platform_ids: dataPlatform_ids,
        //     currency_id: currentCurryId.value,
        //     loop,
        //     type,
        //     extra,
        //   };
        // const activity9_sign_in_table_data = {};
        // const activity9_additional_table_data = {};xs
        // conf.forEach((p) => {
        //   activity9_sign_in_table_data[p.currency_id] = p;
        //   activity9_additional_table_data[p.currency_id] = {
        //     period_1: {
        //       ...p.period_1.extra_conf,
        //     },
        //     period_2: {
        //       ...p.period_2.extra_conf,
        //     },
        //   };
        // });
        // activity9_sign_in_table_.value.conditionData = activity9_sign_in_table_data;
        // if (extra == 1) {
        //   activity9_additional_table_.value.conditionData = activity9_additional_table_data;
        // }
        changTextData(9);
      });
    }
    if (defaultTy.value == 8) changTextData(8);
    if (defaultTy.value == 15) {
      const currencyData = mysterySource.value[currentCurryId.value];
      setTimeout(() => {
        setFieldsValueLeft({
          reset_mode: currencyData?.reset_mode || 'one',
          award_mode: currencyData?.award_mode || 'recharge',
        });
      }, 111);
      changTextData(15);
    }
    if (defaultTy.value == 13) {
      const currencyName = currentyOptions[value];
      get_leftValues13.value.currencyName = currencyName;
      changTextData(13);
    }
    if (defaultTy.value == 14) {
      let cIndex = currencyList14.findIndex((item) => item.id == value) || 0;
      clientList.value = currencyList14[cIndex]?.clientList;
      currencyName.value = currencyList14[cIndex]?.name;
      changTextData(14);
    }
    // if (defaultTy.value == 3 && openTerminalState.checkedList.length > 0) {
    //   const langList = [currencyListTranslate[currentCurryId.value]];
    //   newRefRedEmvelope.value &&
    //     newRefRedEmvelope.value?.valide &&
    //     newRefRedEmvelope.value?.valide(langList, false);
    // }
    if (defaultTy.value == 3) {
      // get_tableData.value[currencyListTranslate[currentCurryId.value]][0]
      if (newRefRedEmvelope.value?.conditionData) {
        get_tableData.value = newRefRedEmvelope.value.conditionData;
        let currentData = get_tableData.value[currentCurryId.value][0] || {};
        setTimeout(() => {
          setFieldsValueLeft({
            ...currentData.config,
            bonusty: currentData.bonus?.ty,
            bonusmethod: currentData.bonus?.method,
          });
        }, 111);
      }
    }
  }

  function filterHandleCurry(langArr) {
    return currencyList.value.filter((currency) => langArr.includes(currency.lang));
  }

  function filterHandleCurrylang(langArr) {
    return langList.value.filter((currency) => langArr.includes(currency.value));
  }

  function updateObj(arr, obj) {
    // 删除不在cehis1中的键
    for (const key in obj) {
      if (!arr.includes(key)) {
        delete obj[key];
      }
    }
    // 添加cehis1中缺少的键
    for (const key of arr) {
      if (!(key in obj)) {
        obj[key] = null;
      }
    }
    return obj;
  }

  function hangimg(url) {
    imageUrl.value = url;
    setFieldsValueSettingRight({ shortcut: imageUrl.value });
  }

  async function changTime(type: string) {
    if (getDeatilId.value && type == 'start_at') {
      timeDisable.value = true;
      setFieldsValueSettingLeft({ timeDisable: true });
    }
    if (type == 'start_at' || type == 'end_at') {
      setFieldsValueSettingLeft({
        startTime: {
          start_at: startTime.value.start_at,
          end_at: startTime.value.end_at,
          // start_at: getTimestampFromDate(startTime.value.start_at, timezone.value),
          // end_at: getTimestampFromDate(startTime.value.end_at, timezone.value),
        },
      });
      if (type == 'start_at' && defaultTy.value == 4) changTextData(4);
      if (type == 'start_at') {
        if (!dayjs().isAfter(startTime.value.start_at)) {
          setFieldsValueLeft({ state: 2, defaultState: 3 });
          defaultState.value = 3;
        } else {
          setFieldsValueLeft({ state: 1, defaultState: 1 });
          defaultState.value = 1;
        }
      }
    }
    if (type == 'fixed_start_at' || type == 'fixed_end_at') {
      setFieldsValueLeft({ fixedTime: get_leftValues13.value });
      changTextData(13);
    }
  }

  function updateRollConfig(num, roll_config) {
    const currentLength = roll_config.length;
    if (num > currentLength) {
      const diff = num - currentLength;
      for (let i = 0; i < diff; i++) {
        roll_config.push({
          id: currentLength + i + 1,
          roll_type: 1,
          roll_condition: '',
          roll_times: '',
          pay_type: 1,
          pay_condition: '',
          pay_date_type: 1,
        });
      }
    } else if (num < currentLength) {
      const diff = currentLength - num;
      roll_config.splice(num, diff);
    }
    return roll_config;
  }

  function ruleTimesChange(e) {
    settingsTy_1.value['roll_config'] = updateRollConfig(
      e.target.value,
      settingsTy_1.value['roll_config'] || ty1_config['roll_config'],
    );
  }

  async function setContentList() {
    handlelanguageLevelText(currentlanguageIndex.value);
  }

  function changTextData(type, value?) {
    contentList.value.forEach((item) => {
      item.textContent = getTextData(type, value)[item.value];
    });
  }
  const validWarnText = {
    charge: t('v.discount.activity.recharge_amount'),
    agentDays: t('table.report.report_agent_money'),
    agentMonths: t('table.report.low_charge_money'),
  };
  async function validateRewardForm(dataList, type, ty) {
    let hasEmptyField = false;
    const currentKey = typeKeys[type];
    openTerminalState.checkedList.forEach((lang) => {
      // 大于0
      const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
      // 大于等于0
      const regex2 = /^(0|[1-9]\d*)(\.\d+)?$/;
      const langToValue = currencyTreeList.filter(
        (currency) => currency.value === currentCurryId.value,
      );
      const langVal = langToValue[0]?.value;
      dataList?.[currentKey][langVal].forEach((entry, index) => {
        if (!entry.charge) {
          hasEmptyField = true;
          message.error(t('common.newactive_error01', { label: langToValue[0].label }));
        }
        if (!hasEmptyField) {
          if (!regex.test(entry.charge)) {
            hasEmptyField = true;
            message.error(
              t('common.newactive_error02', {
                label: langToValue[0].label,
                type: validWarnText[ty],
              }),
            );
          }
          if (type == 1) {
            if (!entry.reward) {
              hasEmptyField = true;
              message.error(t('common.newactive_error01', { label: langToValue[0].label }));
            }
            if (!hasEmptyField && !regex.test(entry.reward)) {
              hasEmptyField = true;
              message.error(t('common.newactive_error03', { label: langToValue[0].label }));
            }
          }
          if (type == 2) {
            if (!entry.reward[0] || !entry.reward[1]) {
              hasEmptyField = true;
              message.error(t('common.newactive_error01', { label: langToValue[0].label }));
            }
            if ((!hasEmptyField && !regex.test(entry.reward[0])) || !regex.test(entry.reward[1])) {
              hasEmptyField = true;
              message.error(t('common.newactive_error03', { label: langToValue[0].label }));
            }
          }
          if (type == 3) {
            if (!entry.rewardLimit || !entry.rewardRate) {
              hasEmptyField = true;
              message.error(t('common.newactive_error01', { label: langToValue[0].label }));
            }
            if (!hasEmptyField && !regex2.test(entry.rewardLimit)) {
              hasEmptyField = true;
              message.error(t('common.newactive_error03', { label: langToValue[0].label }));
            }
            if (!hasEmptyField && !regex.test(entry.rewardRate)) {
              hasEmptyField = true;
              message.error(t('common.newactive_error04', { label: langToValue[0].label }));
            }
          }
        }
      });
    });
    if (hasEmptyField) {
      return false;
    } else {
      return true;
    }
  }
  async function validateManyRewardForm(dataList, type, ty) {
    let hasEmptyField = false;
    const currentKey = typeKeys[type];
    openTerminalState.checkedList.forEach((lang) => {
      // 大于0
      const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
      // 大于等于0
      const regex2 = /^(0|[1-9]\d*)(\.\d+)?$/;
      for (const key in dataList?.[currentKey]) {
        const rowData = dataList?.[currentKey]?.[key];

        const langToValue = currentyOptions[key];
        if (
          rowData?.length === 1 &&
          !rowData[0].commission &&
          !rowData[0].min &&
          key !== currentCurryId.value
        ) {
          break;
        }
        rowData.forEach((entry, index) => {
          if (!entry.commission) {
            hasEmptyField = true;
            message.error(t('common.newactive_error01', { label: langToValue }));
          }
          if (!hasEmptyField) {
            if (!regex.test(entry.commission)) {
              hasEmptyField = true;
              message.error(
                t('common.newactive_error02', {
                  label: langToValue,
                  type: validWarnText[ty],
                }),
              );
            }
            if (type == 1) {
              if (!entry.min) {
                hasEmptyField = true;
                message.error(t('common.newactive_error01', { label: langToValue }));
              }
              if (!hasEmptyField && !regex.test(entry.min)) {
                hasEmptyField = true;
                message.error(t('common.newactive_error03', { label: langToValue }));
              }
            }
          }
        });
      }
    });
    if (hasEmptyField) {
      return false;
    } else {
      return true;
    }
  }
  const formatValue = (val) => (val ? parseFloat(val).toFixed(2) : '0');

  function dealChargeTableData(list, langVal, kind) {
    const currentKey = typeKeys[kind];
    return list?.[currentKey][langVal].map((item) => {
      return {
        deposit: item.charge || '0',
        limit: currentKey === 'rateMoney' ? (item.rewardLimit == '' ? '0' : item.rewardLimit) : '0',
        scale: currentKey === 'rateMoney' ? (item.rewardRate == '' ? '0' : item.rewardRate) : '0',
        min:
          currentKey === 'arbitrary'
            ? formatValue(item.reward?.[0])
            : currentKey === 'rateMoney'
            ? '0'
            : formatValue(item.reward),
        max: currentKey === 'arbitrary' ? formatValue(item.reward?.[1]) : '0',
      };
    });
  }
  // 充值处理函数
  function dealActiveEight(params, type) {
    // 1 固定 2随机 3比例
    const res = openTerminalState.checkedList.reduce((langObj, lang) => {
      currencyTreeList.forEach((currency) => {
        langObj[currency.value] = dealChargeTableData(params, currency.value, type);
      });
      return langObj;
    }, {});
    return res;
  }
  function dealAgentDaysTableData(list, langVal, kind) {
    const currentKey = typeKeys[kind];
    return list?.[currentKey][langVal].map((item) => {
      return {
        commission: item.charge || '0',
        limit: currentKey === 'rateMoney' ? item.rewardLimit : '0',
        scale: currentKey === 'rateMoney' ? item.rewardRate : '0',
        min:
          currentKey === 'arbitrary'
            ? formatValue(item.reward?.[0])
            : currentKey === 'rateMoney'
            ? '0'
            : formatValue(item.reward),
        max: currentKey === 'arbitrary' ? formatValue(item.reward?.[1]) : '0',
      };
    });
  }
  function dealDaysActive(params, type) {
    const res = openTerminalState.checkedList.reduce((langObj, lang) => {
      const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
      langObj[langToValue[0].value] = dealAgentDaysTableData(params, langToValue[0].value, type);
      return langObj;
    }, {});
    return res;
  }

  function dealManyDaysActive(params, type) {
    const currentKey = typeKeys[type];
    for (const key in params[currentKey]) {
      let rowData = params?.[currentKey]?.[key];
      if (rowData?.length === 1 && !rowData[0].commission && !rowData[0].min) {
        delete params?.[currentKey]?.[key];
      }
    }
    return params[currentKey];
  }

  // 充值回显
  function echoChargeData(list, value, type) {
    return list[value].map((item) => {
      return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        charge: item.deposit,
        reward: type == 2 ? [item.min, item.max] : type == 1 ? item.min : '0',
        rewardRate: type == 3 ? item.scale : '0',
        rewardLimit: type == 3 ? item.limit : '0',
      };
    });
  }
  // 代理日回显
  function echoAgentDaysData(list, value, type) {
    return list[value].map((item) => {
      return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        charge: item.commission,
        reward: type == 2 ? [item.min, item.max] : type == 1 ? item.min : '0',
        rewardRate: type == 3 ? item.scale : '0',
        rewardLimit: type == 3 ? item.limit : '0',
      };
    });
  }

  onMounted(() => {
    // 每日投注动态说明
    eventBus.on('onEvertBetTextChange', (data) => {
      const { type, value } = data as any;
      if (type === 'get') {
        value == 2
          ? (everyDayBetActiveText.getType = getTypeObj[1])
          : (everyDayBetActiveText.getType = getTypeObj[2]);
      }
      if (type === 'day') {
        everyDayBetActiveText.day = dayObj[value];
      }
      if (type === 'getText') {
        value == 1
          ? (everyDayBetActiveText.rewardText = rewardTextObj[1])
          : (everyDayBetActiveText.rewardText = rewardTextObj[2]);
        rewardMethods.value = value;
        if (rewardMethods.value == 1) {
          everyDayBetActiveText.money = {
            [selectedCurrencyName.value]: sumReward.value,
          };
        } else {
          everyDayBetActiveText.money = {
            [selectedCurrencyName.value]: maxReward.value,
          };
        }
      }
      if (type === 'condition') {
        selectedCurrencyName.value = Object.keys(value)[0];
        maxReward.value = value[selectedCurrencyName.value].maxReward;
        sumReward.value = value[selectedCurrencyName.value].sumReward;
        if (rewardMethods.value == 1) {
          everyDayBetActiveText.money = {
            [selectedCurrencyName.value]: sumReward.value,
          };
        } else {
          everyDayBetActiveText.money = {
            [selectedCurrencyName.value]: maxReward.value,
          };
        }
      }
      if (type === 'memberDayaward') {
        everyDayBetActiveText.memberDayaward = value;
      }
      if (type === 'memberRecharge') {
        everyDayBetActiveText.memberRecharge = value;
      }
      if (type === 'multiple') {
        everyDayBetActiveText.multipleCount = value;
      }
      changTextData(6);
    });
    eventBus.on('onmultipleText9', (data) => {
      const { value, type } = data as any;
      if (type === 'period') {
        nextTick(() => {
          const conf = activity9_sign_in_table_.value.conditionData[currentCurryId.value];
          const { period_1, period_2 } = conf;
          let periodData = { loop: undefined, type: undefined, extra: undefined };
          if (value == 1) {
            periodData = period_1;
          } else {
            periodData = period_2;
          }
          const { loop, type, extra } = periodData;
          setFieldsValueLeft({
            loop,
            type,
            extra,
          });
          // form_data.value = {
          //   ...form_data.value,
          //   loop,
          //   type,
          //   extra,
          // };
        });
        get_leftValues9.value.period = value;
      }
      if (type === 'extra') {
        get_leftValues9.value.extra = value;
      }
      if (type === 'accumulated') {
        get_leftValues9.value.accumulated = value;
      }
      if (type === 'continuous') {
        get_leftValues9.value.continuous = value;
      }
      if (type === 'multiple') {
        get_leftValues.value.multiple = value;
      }

      changTextData(9);
    });
    eventBus.on('onEvertMemberTextChange', (data) => {
      const { type, value } = data as any;
      if (defaultTy.value == 12) {
        if (type === 'memberDayaward') {
          everyDayBetActiveText.memberDayaward = value;
        }

        if (type === 'memberRecharge') {
          everyDayBetActiveText.memberRecharge = value;
        }
        changTextData(12);
      } else if (defaultTy.value == 13) {
        if (type === 'rechargeBet13') {
          get_leftValues13.value.rechargeBet = value;
        }
        if (type === 'rechargeMoney13') {
          get_leftValues13.value.rechargeMount = value;
        }
        changTextData(13);
      }
    });
    eventBus.on('onAgentDaysDynamicText', (data) => {
      const { value, type } = data as any;
      if (type === 'list') {
        agentDaysMinAndMax.value = value;
      }
      if (type === 'multiple') {
        everyDayBetActiveText.multipleCount = value;
      }

      if (defaultTy.value == 10) changTextData(10);
      if (defaultTy.value == 15) changTextData(15);
    });
    eventBus.on('onAgentMonthsDynamicText', (data) => {
      const { value, type } = data as any;
      if (type === 'list') {
        agentMonthsMinAndMax.value = value;
      }
      if (type === 'multiple') {
        everyDayBetActiveText.multipleCount = value;
      }
      changTextData(11);
    });
    eventBus.on('onmultipleText12', (data) => {
      const { value, type } = data as any;
      if (type === 'timeType') {
        if (value === 1) {
          get_leftValues12.value.timeType = [3, 13, 23];
        } else if (value === 2) {
          get_leftValues12.value.timeType = [5, 15, 25];
        } else if (value === 3) {
          get_leftValues12.value.timeType = [7, 17, 27];
        } else {
          get_leftValues12.value.timeType = [8, 18, 28];
        }
      }
      if (type === 'multiple') {
        get_leftValues12.value.multiple = value;
      }
      changTextData(12);
    });
    eventBus.on('onmultipleText16', (data) => {
      const { value, type } = data as any;
      if (type === 'reward_type') {
        get_leftValues16.value.reward_type = value;
      }
      if (type === 'multiple') {
        get_leftValues16.value.multiple = value;
      }
      changTextData(16);
    });
    eventBus.on('onmultipleText13', (data) => {
      const { value, type } = data as any;
      if (type === 'multiple') {
        get_leftValues13.value.multiple = value;
      }
      if (type === 'bet') {
        get_leftValues13.value.bet = value;
      }
      changTextData(13);
    });
    // 充值动态文字
    eventBus.on('onChargeDynamicText', (data) => {
      const { value, type } = data as any;
      if (type === 'time') {
        chargeDynamicText.time = value;
      }
      if (type === 'timeUnit') {
        chargeDynamicText.timeUnit = unitObj[value];
      }
      if (type === 'get') {
        chargeDynamicText.getType = value == 2 ? getTypeObj2[1] : getTypeObj2[2];
      }
      if (type === 'chargeType') {
        chargeDynamicText.currentType = value;
      }
      if (type === 'cycleMode') {
        chargeDynamicText.cycleText = cycleModeObj[value];
      }
      if (type === 'isLimit') {
        chargeDynamicText.isLimit = value;
      }
      if (type === 'days') {
        chargeDynamicText.dayList = value;
      }
      if (type === 'tableData') {
        chargeDynamicText.money = value;
        getFieldsValue().then((values) => {
          const rewardMethods = values?.rewardMethods || 1;
          chargeDynamicText.currentMoney = chargeDynamicText.money[rewardMethods];
          if (defaultTy.value == 8) changTextData(8);
          if (defaultTy.value == 14) changTextData(14);
          if (defaultTy.value == 15) changTextData(15);
        });
      }
      if (type == 'multiple') {
        everyDayBetActiveText.multipleCount = value;
      }
      if (type == 'rewardMethods') {
        chargeDynamicText.currentMoney = chargeDynamicText.money[value];
      }
      if (defaultTy.value == 8) changTextData(8);
      if (defaultTy.value == 14) changTextData(14);
      if (defaultTy.value == 15) changTextData(15);
    });
  });
  onBeforeUnmount(() => {
    eventBus.off('onEvertBetTextChange');
    eventBus.off('onChargeDynamicText');
    eventBus.off('onEvertMemberTextChange');
    eventBus.off('onAgentDaysDynamicText');
    eventBus.off('onAgentMonthsDynamicText');
    eventBus.off('onmultipleText16');
    eventBus.off('onmultipleText9');
    eventBus.off('onmultipleText13');
  });

  const inviteFriendsSelectedCurrencyName = computed(() => currentyOptions[currentCurryId.value]);

  const generateInviteFriendsRules = (language) => {
    const {
      accumulatedDepositCondition,
      accumulatedDepositBonus,
      validBetCondition,
      validBetBonus,
      singleDepositType,
      singleDepositCondition,
      singleDepositBonus,
    } = inviteFriendsInfo.value.inviteFriendsBonusTypeInfo;

    const currency = inviteFriendsSelectedCurrencyName.value;
    const multiple = setTxtcontent.value.multiple;

    const languages = {
      zh_CN: {
        intro: '邀请好友加入游戏，被邀请的好友在平台完成注册、存款、投注，您将获得：',
        accumulatedDeposit: `累计存款奖金：当推荐好友的总存款达到${accumulatedDepositCondition}${currency}时，您将获得${accumulatedDepositBonus}${currency}的佣金奖励。`,
        validBet: `累计有效投注奖金：当推荐好友累计有效投注达到${validBetCondition}${currency}时，可获得${validBetBonus}${currency}佣金奖励。`,
        singleDeposit: `每笔充值奖金：邀请好友每笔充值≥${singleDepositCondition}${currency}时，可获得${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        }佣金奖励。`,
        claimNote: '奖励仅支持用户手动领取。过期未领取的奖励将视为放弃。',
        wagering: `本活动赠送的奖金（不含本金）需达到有效投注额的${multiple}倍才可提现。`,
        terms:
          '此活动仅限账户持有人进行正常人为操作。禁止使用租用、作弊、机器人、不同账号、多人游戏、仲裁、接口、协议、利用漏洞、群控或其他技术手段。否则，奖励可能被取消、扣除、冻结，甚至列入黑名单。',
        disclaimer: '为避免对文本解释产生误解，本平台保留解释权及最终决定权。',
      },
      en_US: {
        intro:
          'Invite friends to join the game. When the invited friends complete registration, make deposits, and place bets on the platform, you will receive:',
        accumulatedDeposit: `Cumulative deposit bonus: When the total deposit amount of referred friends reaches ${accumulatedDepositCondition}${currency}, you will receive ${accumulatedDepositBonus}${currency} commission bonus.`,
        validBet: `Cumulative valid bet bonus: When the cumulative valid bets of referred friends reach ${validBetCondition}${currency}, you will receive ${validBetBonus}${currency} commission bonus.`,
        singleDeposit: `Per deposit bonus: For each deposit made by an invited friend ≥ ${singleDepositCondition}${currency}, you will receive ${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        } commission bonus.`,
        claimNote:
          'Rewards must be claimed manually by the user. Unclaimed rewards after the expiry date will be considered forfeited.',
        wagering: `Bonuses given in this event (excluding principal) must be wagered ${multiple} times before withdrawal.`,
        terms:
          'This event is only open to account holders for normal manual participation. The use of rented accounts, cheating, bots, multiple accounts, team play, arbitration, API access, protocol manipulation, exploit of bugs or loopholes, multi-device control, or any other technical methods is strictly prohibited. Otherwise, rewards may be canceled, deducted, frozen, or the user may even be blacklisted.',
        disclaimer:
          'To avoid misinterpretation, the platform reserves the right of final explanation and decision.',
      },
      vi_VN: {
        intro:
          'Mời bạn bè tham gia trò chơi. Khi bạn bè hoàn tất đăng ký, nạp tiền và đặt cược trên nền tảng, bạn sẽ nhận được:',
        accumulatedDeposit: `Thưởng tích lũy nạp tiền: Khi tổng số tiền nạp của bạn bè được giới thiệu đạt ${accumulatedDepositCondition}${currency}, bạn sẽ nhận được phần thưởng hoa hồng trị giá ${accumulatedDepositBonus}${currency}.`,
        validBet: `Thưởng tích lũy cược hợp lệ: Khi tổng số cược hợp lệ của bạn bè được giới thiệu đạt ${validBetCondition}${currency}, bạn sẽ nhận được phần thưởng hoa hồng trị giá ${validBetBonus}${currency}.`,
        singleDeposit: `Thưởng theo mỗi lần nạp: Với mỗi lần bạn bè được mời nạp ≥ ${singleDepositCondition}${currency}, bạn sẽ nhận được phần thưởng hoa hồng trị giá ${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        }.`,
        claimNote:
          'Phần thưởng chỉ hỗ trợ người dùng tự tay nhận. Phần thưởng không được nhận trong thời gian quy định sẽ bị xem là từ chối.',
        wagering: `Tiền thưởng nhận được từ sự kiện này (không bao gồm tiền gốc) cần đạt mức cược hợp lệ gấp ${multiple} lần mới có thể rút.`,
        terms:
          'Sự kiện này chỉ dành cho chủ tài khoản thao tác thủ công một cách hợp lệ. Cấm sử dụng tài khoản thuê, gian lận, bot, tài khoản khác, chơi nhóm, trọng tài, giao diện, giao thức, khai thác lỗ hổng, điều khiển nhóm hay các phương thức kỹ thuật khác. Nếu vi phạm, phần thưởng có thể bị hủy, trừ, đóng băng hoặc bị liệt vào danh sách đen.',
        disclaimer: 'Để tránh hiểu nhầm, nền tảng này có quyền giải thích và quyết định cuối cùng.',
      },

      pt_BR: {
        intro:
          'Convide amigos para participar do jogo. Quando os amigos convidados concluírem o cadastro, fizerem depósitos e apostas na plataforma, você receberá:',
        accumulatedDeposit: `Bônus de depósito cumulativo: quando o valor total do depósito de amigos indicados atingir ${accumulatedDepositCondition}${currency}, você receberá ${accumulatedDepositBonus}${currency} de bônus de comissão.`,
        validBet: `Bônus de aposta válida cumulativa: quando as apostas válidas cumulativas de amigos indicados atingirem ${validBetCondition}${currency}, você receberá ${validBetBonus}${currency} de bônus de comissão.`,
        singleDeposit: `Bônus por depósito: Para cada depósito feito por um amigo convidado ≥ ${singleDepositCondition}${currency}, você receberá um bônus de comissão de ${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        }.`,
        claimNote:
          'As recompensas devem ser reivindicadas manualmente pelo usuário. Recompensas não reivindicadas após a data de validade serão consideradas perdidas.',
        wagering: `Os bônus concedidos neste evento (excluindo o principal) devem ser apostados ${multiple} vezes antes da retirada.`,
        terms:
          'Este evento está aberto apenas a titulares de contas para participação manual normal. É estritamente proibido o uso de contas alugadas, trapaças, bots, contas múltiplas, jogo em equipe, arbitragem, acesso à API, manipulação de protocolos, exploração de bugs ou brechas, controle de múltiplos dispositivos ou quaisquer outros métodos técnicos. Caso contrário, as recompensas poderão ser canceladas, deduzidas, congeladas ou o usuário poderá até mesmo ser colocado na lista negra.',
        disclaimer:
          'Para evitar interpretações errôneas, a plataforma reserva-se o direito de explicação e decisão final.',
      },

      th_TH: {
        intro:
          'เชิญเพื่อนเข้าร่วมเกม หากเพื่อนที่คุณเชิญมาทำการลงทะเบียน ฝากเงิน และเดิมพันบนแพลตฟอร์มเรียบร้อยแล้ว คุณจะได้รับ:',
        accumulatedDeposit: `โบนัสจากยอดฝากสะสม: เมื่อยอดฝากรวมของเพื่อนที่คุณแนะนำถึง ${accumulatedDepositCondition}${currency} คุณจะได้รับค่าคอมมิชชั่น ${accumulatedDepositBonus}${currency}`,
        validBet: `โบนัสจากยอดฝากสะสม: เมื่อยอดฝากรวมของเพื่อนที่คุณแนะนำถึง ${validBetCondition}${currency} คุณจะได้รับค่าคอมมิชชั่น ${validBetBonus}${currency}`,
        singleDeposit: `โบนัสต่อยอดฝากแต่ละครั้ง: เมื่อเพื่อนที่คุณแนะนำมียอดฝาก ≥ ${singleDepositCondition}${currency} ต่อครั้ง คุณจะได้รับค่าคอมมิชชั่น ${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        }`,
        claimNote: `รางวัลสามารถรับได้เฉพาะแบบกดรับด้วยตนเองเท่านั้น หากหมดอายุและไม่ได้กดรับ จะถือว่าสละสิทธิ์`,
        wagering: `โบนัสที่ได้รับจากกิจกรรมนี้ (ไม่รวมเงินต้น) ต้องทำยอดเดิมพันหมุนเวียนให้ครบ ${multiple} เท่าก่อนจึงจะสามารถถอนได้`,
        terms:
          'กิจกรรมนี้จำกัดเฉพาะเจ้าของบัญชีที่ดำเนินการด้วยตนเองตามปกติเท่านั้น ห้ามใช้บัญชีเช่า การโกง บอท หลายบัญชี การเล่นเป็นกลุ่ม การตัดสินแบบอัตโนมัติ การใช้ API โปรโตคอล การเจาะระบบ การควบคุมหลายบัญชี หรือวิธีทางเทคนิคอื่น ๆ มิฉะนั้น รางวัลอาจถูกยกเลิก หักคืน ระงับ หรือขึ้นบัญชีดำ',
        disclaimer:
          'เพื่อหลีกเลี่ยงความเข้าใจผิดในการตีความข้อตกลง แพลตฟอร์มขอสงวนสิทธิ์ในการตีความและการตัดสินใจขั้นสุดท้าย',
      },

      hi_IN: {
        intro:
          'दोस्तों को खेल में शामिल होने के लिए आमंत्रित करें। जब आमंत्रित मित्र पंजीकरण पूरा कर लेंगे, जमा कर देंगे, और मंच पर दांव लगा देंगे, तो आपको प्राप्त होगा:',
        accumulatedDeposit: `संचयी जमा बोनस: जब संदर्भित मित्रों की कुल जमा राशि ${accumulatedDepositCondition}${currency} तक पहुंच जाती है, तो आपको ${accumulatedDepositBonus}${currency} कमीशन बोनस प्राप्त होगा।`,
        validBet: `संचयी वैध दांव बोनस: जब संदर्भित मित्रों के संचयी वैध दांव ${validBetCondition}${currency} तक पहुंच जाते हैं, तो आपको ${validBetBonus}${currency} कमीशन बोनस प्राप्त होगा।`,
        singleDeposit: `प्रति जमा बोनस: आमंत्रित मित्र द्वारा की गई प्रत्येक जमा राशि ≥ ${singleDepositCondition}${currency} के लिए, आपको ${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        } कमीशन बोनस प्राप्त होगा।`,
        claimNote:
          'पुरस्कार का दावा उपयोगकर्ता द्वारा मैन्युअल रूप से किया जाना चाहिए। समाप्ति तिथि के बाद दावा न किए गए पुरस्कार जब्त माने जाएंगे।',
        wagering: `इस इवेंट में दिए गए बोनस (मूलधन को छोड़कर) को निकासी से पहले ${multiple} बार दांव पर लगाना होगा।`,
        terms:
          'यह कार्यक्रम केवल सामान्य मैनुअल भागीदारी के लिए खाताधारकों के लिए खुला है। किराए के खातों का उपयोग, धोखाधड़ी, बॉट्स, एकाधिक खाते, टीम प्ले, मध्यस्थता, एपीआई एक्सेस, प्रोटोकॉल हेरफेर, बग या खामियों का फायदा उठाना, मल्टी-डिवाइस नियंत्रण, या किसी भी अन्य तकनीकी तरीकों पर सख्त प्रतिबंध है। अन्यथा, पुरस्कार रद्द किए जा सकते हैं, काटे जा सकते हैं, रोके जा सकते हैं, या उपयोगकर्ता को काली सूची में भी डाला जा सकता है।',
        disclaimer:
          'गलत व्याख्या से बचने के लिए, प्लैटफ़ॉर्म अंतिम स्पष्टीकरण और निर्णय का अधिकार सुरक्षित रखता है।',
      },

      tl_PH: {
        intro:
          'Mag-imbita ng mga kaibigan na sumali sa laro. Kapag ang inimbitahang kaibigan ay nakumpleto ang rehistro, nagdeposito, at tumaya sa platform, makakakuha ka ng:',
        accumulatedDeposit:
          'Kabuuang Bonus sa Deposito: Kapag umabot sa ${accumulatedDepositCondition}${currency} ang kabuuang deposito ng mga nirekomendang kaibigan, makakakuha ka ng ${accumulatedDepositBonus}${currency} na komisyon bilang gantimpala.',
        validBet:
          'Kabuuang Bonus sa Balidong Taya: Kapag ang kabuuang balidong taya ng mga nirekomendang kaibigan ay umabot sa ${validBetCondition}${currency}, makakakuha ka ng ${validBetBonus}${currency} na komisyon bilang gantimpala.',
        singleDeposit: `Bonus sa Bawat Deposito: Sa bawat deposito ng kaibigan na ≥${singleDepositCondition}${currency}, makakakuha ka ng ${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        } na komisyon bilang gantimpala.`,
        claimNote:
          'Ang gantimpala ay kailangang i-claim nang manu-mano ng user. Ang hindi na-claim bago ang petsa ng pag-expire ay ituturing na tinanggihan.',
        wagering: `Ang bonus na ibinigay sa promosyon na ito (hindi kasama ang principal) ay kailangang magkaroon ng kabuuang balidong taya na ${multiple}x bago ma-withdraw.`,
        terms:
          'Ang promosyon na ito ay limitado lamang sa normal at personal na paggamit ng account holder. Mahigpit na ipinagbabawal ang paggamit ng nirentahang account, pandaraya, bot, iba’t ibang account, multi-player gaming, arbitration, API, protocol, exploitation ng bug, group control, o iba pang teknikal na paraan. Kung hindi, maaaring kanselahin, bawasan, i-freeze ang gantimpala, o ilagay sa blacklist.',
        disclaimer:
          'Upang maiwasan ang maling interpretasyon ng teksto, ang platform na ito ay may karapatang magpaliwanag at gumawa ng pinal na desisyon.',
      },
      ko_KR: {
        intro:
          '친구를 초대하여 게임에 참여시키고, 초대받은 친구가 플랫폼에서 등록、입금、베팅을 완료하면, 다음을 받게 됩니다：',
        accumulatedDeposit: `누적 입금 보너스：추천한 친구의 총 입금액이 ${accumulatedDepositCondition}${currency}에 도달하면, ${accumulatedDepositBonus}${currency}의 커미션 보상을 받게 됩니다。`,
        validBet: `누적 유효베팅 보너스：추천한 친구의 누적 유효 베팅이 ${validBetCondition}${currency}에 도달하면, ${validBetBonus}${currency}의 커미션 보상을 받을 수 있습니다。`,
        singleDeposit: `각 입금 보너스：초대한 친구가 각 입금액 ≥ ${singleDepositCondition}${currency}일 때, ${singleDepositBonus}${
          singleDepositType === 'percentage' ? '%' : currency
        }의 커미션 보상을 받을 수 있습니다。`,
        claimNote:
          '보상은 사용자가 직접 수령해야 합니다。기한 내 수령하지 않은 보상은 포기로 간주됩니다。',
        wagering:
          '본 이벤트로 지급된 보너스(원금 제외)는 출금하려면 유효베팅액의 ${multiple}배에 도달해야 합니다。',
        terms:
          '본 이벤트는 계정 소유자가 정상적인 수작업으로 진행해야 합니다。대여, 부정행위, 봇 사용, 다른 계정, 다인 플레이, 중재, 인터페이스·프로토콜 악용, 취약점 이용, 집단 제어 또는 기타 기술적 수단의 사용을 금지합니다。위반 시 보상이 취소·차감·동결되거나 블랙리스트에 등록될 수 있습니다。',
        disclaimer:
          '문구의 해석상 오해를 피하기 위해, 본 플랫폼은 해석권 및 최종 결정권을 보유합니다。',
      },
    };

    const lang = languages[language] || languages.en_US;

    const rules = [
      lang.intro,
      accumulatedDepositCondition && accumulatedDepositBonus && lang.accumulatedDeposit,
      validBetCondition && validBetBonus && lang.validBet,
      singleDepositCondition && singleDepositBonus && lang.singleDeposit,
      lang.claimNote,
      multiple && lang.wagering,
      lang.terms,
      lang.disclaimer,
    ];

    return rules.filter(Boolean).join('\n    ');
  };

  function getCurrentName() {
    console.log(currentCurryId.value);
    const currentCurrency = currencyList.value.find(
      (currency) => currency.value === currentCurryId.value,
    );
    return currentCurrency ? currentCurrency.label : 'CNY';
  }

  function getTextData(type, value?) {
    const currentName = getCurrentName();
    let award_mode = 'recharge';
    if (type == 15) {
      const currencyData = mysterySource.value[currentCurryId.value];
      award_mode = currencyData?.award_mode;
    }
    let currentNum = 0;
    let ty1_config = ref({});
    let ty2_config = ref({});
    let ty4_config = ref({});
    let ty7_config = <any>ref({});
    if (type === 1) {
      const defaultBonus = {
        zh_CN: 0,
        en_US: 0,
        pt_BR: 0,
        vi_VN: 0,
        th_TH: 0,
        hi_IN: 0,
        tl_PH: 0,
        ko_KR: 0,
      };
      const currencyName = currentyOptions[currentCurryId.value];

      const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value)[0][
        'ty1_config'
      ];
      ty1_config.value = {
        withdraw_amount: itmeConfig['withdraw_amount'] || 0,
        currencyName: currencyName,
        daily_roll_times: itmeConfig['daily_roll_times'] || 0,
        ...defaultBonus,
        period:
          (setTxtcontent.value.period == 0
            ? '0'
            : setTxtcontent.value.period == 5
            ? periodModel.value
            : convertSecondsToDays(setTxtcontent.value.period)) || 3,
      };
      currenyLang.value.forEach((el) => {
        ty1_config.value[el.lang] = el.ty1_config['daily_roll_times'] || 0;
      });
    }
    if (type === 2) {
      const defaultBonus = {
        zh_CN: 0,
        en_US: 0,
        pt_BR: 0,
        vi_VN: 0,
        th_TH: 0,
        hi_IN: 0,
        tl_PH: 0,
        ko_KR: 0,
      };

      ty2_config.value = {
        ...defaultBonus,
      };
      currenyLang.value.forEach((el) => {
        ty2_config.value[el.lang || el.name] =
          el.ty2_config.pplBonus[el.ty2_config.pplBonus.length - 1]?.bonus || 0;
      });
      let lan = currenyLang.value.filter((item) => item.label === currentName)[0].lang;
      currentNum = ty2_config.value[lan] || 0;
    }

    if (type == 4 || type == 7) {
      const defaultBonus = {
        zh_CN: 0,
        en_US: 0,
        pt_BR: 0,
        vi_VN: 0,
        th_TH: 0,
        hi_IN: 0,
        tl_PH: 0,
        ko_KR: 0,
      };

      const addDays = (dateString, days) => {
        const date = dayjs(dateString).add(days, 'day');
        const formattedDate = date.format('YYYY-MM-DD');
        return formattedDate;
      };

      let start = startTime.value.start_at
        ? dayjs(startTime.value.start_at).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD');

      let end = addDays(start, secondsToDays(setTxtcontent.value.period) - 1);

      let f_start = addDays(end, 1);
      let endtime = setTxtcontent.value.apply_period > 0 ? setTxtcontent.value.apply_period - 1 : 0;

      let f_end = addDays(f_start, endtime);

      const periodDays = secondsToDays(setTxtcontent.value.period);
      ty4_config.value = {
        period_zh: periodDays === 7 ? '周' : periodDays === 14 ? '2周' : '月',
        period_en: periodDays === 7 ? 'week' : periodDays === 14 ? 'weeks' : 'month',
        period_vi: periodDays === 7 ? '1 tuần' : periodDays === 14 ? '2 tuần' : '1 tháng',
        period_th: periodDays === 7 ? '1 สัปดาห์' : periodDays === 14 ? '2 สัปดาห์' : '1 เดือน',
        period_pt: periodDays === 7 ? '1 semana' : periodDays === 14 ? '2 semanas' : '1 mês',
        period_hi: periodDays === 7 ? '1 सप्ताह' : periodDays === 14 ? '2 सप्ताह' : '1 महीना',
        ...defaultBonus,
        start_at: getDayOfWeek(start).text,
        end_at: getDayOfWeek(end).text,
        f_start: getDayOfWeek(f_start).text,
        f_end: getDayOfWeek(f_end).text,

        start_at_zh: periodDays == 7 ? `周${getDayOfWeek(start).text} 00:00` : `${start} 00:00`,
        start_at_en: periodDays == 7 ? `${getDayOfWeek(start).entext} 00:00` : `${start} 00:00`,
        start_at_vi: periodDays == 7 ? `${getDayOfWeek(start).vitext} 00:00` : `${start} 00:00`,
        start_at_th: periodDays == 7 ? `${getDayOfWeek(start).thtext} 00:00` : `${start} 00:00`,
        start_at_pt: periodDays == 7 ? `${getDayOfWeek(start).pttext} 00:00` : `${start} 00:00`,
        start_at_hi: periodDays == 7 ? `${getDayOfWeek(start).hitext} 00:00` : `${start} 00:00`,
        end_at_zh: periodDays == 7 ? `下周${getDayOfWeek(end).text} 23:59` : `${end} 23:59`,
        end_at_en: periodDays == 7 ? `next ${getDayOfWeek(end).entext} 23:59` : `${end} 23:59`,
        end_at_vi: periodDays == 7 ? `${getDayOfWeek(end).vitext} 23:59` : `${end} 23:59`,
        end_at_th: periodDays == 7 ? `${getDayOfWeek(end).thtext} 23:59` : `${end} 23:59`,
        end_at_pt: periodDays == 7 ? `próxima ${getDayOfWeek(end).pttext} 23:59` : `${end} 23:59`,
        end_at_hi: periodDays == 7 ? `${getDayOfWeek(end).hitext} 23:59` : `${end} 23:59`,
        fstart_at_zh:
          periodDays == 7 ? `周${getDayOfWeek(f_start).text} 02:00` : `${f_start} 02:00`,
        fstart_at_en:
          periodDays == 7 ? `${getDayOfWeek(f_start).entext} 02:00` : `${f_start} 02:00`,
        fstart_at_vi:
          periodDays == 7 ? `${getDayOfWeek(f_start).vitext} 02:00` : `${f_start} 02:00`,
        fstart_at_th:
          periodDays == 7 ? `${getDayOfWeek(f_start).thtext} 02:00` : `${f_start} 02:00`,
        fstart_at_pt:
          periodDays == 7 ? `${getDayOfWeek(f_start).pttext} 02:00` : `${f_start} 02:00`,
        fstart_at_hi:
          periodDays == 7 ? `${getDayOfWeek(f_start).hitext} 02:00` : `${f_start} 02:00`,
        fend_at_zh:
          periodDays == 7
            ? `周${getDayOfWeek(f_end).text} 23:59 (utc+0)`
            : `${f_end} 23:59 (utc+0)`,
        fend_at_en:
          periodDays == 7
            ? `${getDayOfWeek(f_end).entext} 23:59 (utc+0)`
            : `${f_end} 23:59 (utc+0)`,
        fend_at_vi:
          periodDays == 7
            ? `${getDayOfWeek(f_end).vitext} 23:59 (utc+0)`
            : `${f_end} 23:59 (utc+0)`,
        fend_at_th:
          periodDays == 7
            ? `${getDayOfWeek(f_end).thtext} 23:59 (utc+0)`
            : `${f_end} 23:59 (utc+0)`,
        fend_at_pt:
          periodDays == 7
            ? `${getDayOfWeek(f_end).pttext} 23:59 (utc+0)`
            : `${f_end} 23:59 (utc+0)`,
        fend_at_hi:
          periodDays == 7
            ? `${getDayOfWeek(f_end).hitext} 23:59 (utc+0)`
            : `${f_end} 23:59 (utc+0)`,
      };
      ty7_config.value = ty4_config.value;
      currenyLang.value.forEach((el) => {
        if (type == 4) {
          ty4_config.value[el.lang] = el.ty4_config.prize_limit || 0;
        } else {
          ty7_config.value[el.lang] = el.ty4_config.prize_limit || 0;
        }
      });
    }
    const ty2 = {
      zh_CN: `
              只有新注册的下属，符合活动要求的下属。
              发展好友开宝箱，完成不同人数，可获得对应宝箱，金额最高${currentNum}${currentName}，发展越多，奖励越高。
              本活动所赠送的奖金（不含本金）需${setTxtcontent.value.multiple}倍有效投注才能提现，投注不限游戏平台。
              此活动属平台额外赠送，同时享有其他代理奖励和佣金，即直接享受多倍快乐。
              奖励仅限在iOS、Android、H5、PC端手动领取，过期自动派发。
              本活动仅限账号本人进行正常的人为操作，禁止租借、使用外挂、机器人、不同账号对赌、互刷、套利、接口、协议、利用漏洞、群控或其他技术手段参与，否则将取消或扣除奖励、冻结、甚至拉入黑名单。
              为避免文字理解差异，平台将保留本活动最终解释权。
                    `,
      en_US: `
              Only newly registered subordinates who meet the requirements of the activity.
              Develop friends to open treasure chests. Complete different numbers of people to receive corresponding treasure chests, with amounts up to ${currentNum} ${currentName}. The more you develop, the higher the reward.
              The bonus given in this activity (excluding the principal) must be wagered ${setTxtcontent.value.multiple} time before withdrawal, with no limit on game platforms.
              This activity is an extra gift from the platform, while also enjoying other agent rewards and commissions, thus directly enjoying multiple joys.
              Rewards can only be manually received on iOS, Android, H5, PC terminals, and are automatically distributed if expired.
              This activity is only for the account holder to carry out normal manual operations. Renting, using cheats, bots, gambling between different accounts, mutual brushing, arbitrage, interfaces, protocols, exploiting vulnerabilities, group control, or other technical means of participation are prohibited. Otherwise, rewards may be canceled or deducted, accounts may be frozen, or even blacklisted.
              To avoid differences in textual understanding, the platform reserves the final interpretation of this activity.
                    `,
      pt_BR: `
              Apenas subordinados recém-registrados que atendam aos requisitos da atividade.
              Desenvolva amigos para abrir caixas, complete diferentes números e receba caixas correspondentes, com um valor máximo de ${currentNum} ${currentName}. Quanto mais desenvolver, maior será a recompensa.
              O valor do bônus concedido por esta promoção (excluindo o principal) terá um rollover de ${setTxtcontent.value.multiple}x antes de poder ser retirado, e as apostas não estão limitadas a uma única plataforma de jogos.
              Esta promoção é um presente adicional da plataforma, e você também pode desfrutar de outras recompensas e comissões de agentes, aumentando a sua satisfação.
              As recompensas só podem ser resgatadas manualmente no iOS, Android, H5 e PC, e serão distribuídas automaticamente quando expirarem.
              Somente o próprio titular da conta poderá participar desta promoção de forma normal e é estritamente proibido o aluguel, uso de bots, múltiplas contas para apostar, apostas cruzadas, arbitragem, interfaces, protocolos, exploração de falhas, controle de grupo ou outras manipulações técnicas. Caso contrário, as recompensas serão canceladas ou deduzidas, a conta será congelada ou até mesmo adicionada à lista negra.
              Para evitar discrepâncias na interpretação do texto, a plataforma reserva-se o direito de interpretação final desta promoção.
                    `,
      vi_VN: `
              Chỉ có cấp dưới mới đăng ký, cấp dưới phù hợp với yêu cầu của sự kiện.
              Phát triển số lượng bạn bè và mở rương kho báu, hoàn thành số lượng người khác nhau có thể nhận được rương kho báu tương ứng, tiền thưởng cao nhất lên đến ${currentNum} ${currentName} phát triển càng nhiều tiền thưởng càng cao.
              Tất cả phần thưởng trong sự kiện (không bao gồm tiền gốc) cần đặt cược toàn bộ ít nhất ${setTxtcontent.value.multiple} lần mới có thể rút, không giới hạn trò chơi trên nền tảng.
              Hoạt động này thuộc về quà tặng bổ sung từ nền tảng, có thể nhận đồng thời tiền thưởng và hoa hồng đại lý, trực tiếp nhân nhiều niềm vui.
              Phần thưởng chỉ có thể nhận thủ công trên các nền tảng IOS, Android, H5 và PC, nếu không nhận thì sẽ hết hiệu lực.
              Hoạt động này bị giới hạn ở thao tác thủ công thông thường của chủ tài khoản, cho thuê, sử dụng phần mềm gian lận, robot, đặt cược giữa các tài khoản khác nhau, thao túng lẫn nhau, hành vi gian lận, API, giao thức, lợi dụng sơ hở, kiểm soát nhóm hoặc các phương tiện kỹ thuật khác đều bị cấm, nếu không thì phần thưởng sẽ được phát có thể bị hủy, khấu trừ hoặc tài khoản có thể bị đóng băng, thậm chí bị đưa vào danh sách đen.
              Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
                    `,
      th_TH: `
              กิจกรรมนี้นับเฉพาะลูกทีมที่สมัครใหม่เท่านั้น และลูกทีมต้องมีคุณสมบัติตรงตามข้อกำหนดของกิจกรรม.
              ผลักดันเพื่อนของคุณเพื่อเปิดกล่องสมบัติ เมื่อสำเร็จในแต่ละขั้น คุณจะได้รับกล่องสมบัติที่ตรงตามเงื่อนไขจำนวนสูงสุด ${currentNum} ${currentName} ยิ่งคุณพัฒนามากเพื่อนของคุณได้มากเท่าไร รางวัลก็จะยิ่งมากขึ้นเท่านั้น.
              โบนัสจากกิจกรรมนี้ (ไม่รวมเงินต้น) ต้องทำการเดิมพันเพิ่มเติมอีก ${setTxtcontent.value.multiple} เท่าถึงจะสามารถถอนเงินออกได้ การเดิมพันนั้นไม่จำกัดประเภทของเกม.
              กิจกรรมนี้เป็นของขวัญเพิ่มเติมจากแพลตฟอร์ม แต่คุณยังได้รับรางวัลและค่าคอมมิชชั่นอื่นๆ อีกด้วย และนั่นคือคุณสามารถเพลิดเพลินกับความสุขอย่างไม่จำกัด.
              เงินรางวัลสามารถรับได้ในวันถัดไปเท่านั้นและสามารถรับได้ด้วยตนเองบนแพลตฟอร์ม iOS, Android, H5, PC เท่านั้น *จะมีการแจกจ่ายอัตโนมัติเมื่อหมดอายุ.
              กิจกรรมนี้จำกัดเฉพาะการเดิมพันโดยเจ้าของบัญชีเท่านั้น ห้ามมีการเช่าบัญชี การเดิมพันแบบโกงความเสี่ยง การเก็งกำไรที่อันตราย การใช้ ปลั๊กอิน บอท และการใช้ประโยชน์จากโปรโตคอล ช่องโหว่ อินเตอร์เฟซ การควบคุมกลุ่มหรือวิธีการทางเทคนิคอื่นๆ ที่เกี่ยวข้อง มิฉะนั้น รางวัลที่จะได้รับอาจถูกยกเลิก หัก หรือบัญชีอาจถูกระงับหรือแม้กระทั่งติดแบล็คลิสต์.
              เพื่อหลีกเลี่ยงการเข้าใจข้อความผิด แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของรายการข้างต้นนี้.
                    `,
      hi_IN: `
              केवल नए पंजीकृत अधीनस्थ जो गतिविधि की आवश्यकताओं को पूरा करते हैं।.
              खज़ाना संदूक खोलने के लिए मित्र विकसित करें। संबंधित खज़ाना संदूक प्राप्त करने के लिए अलग-अलग संख्या में लोगों को पूरा करें, अधिकतम राशि ${currentNum} ${currentName} के साथ। आप जितने अधिक मित्र बनाएंगे, इनाम उतना ही अधिक होगा।.
              इस गतिविधि में दिए गए बोनस (मूलधन को छोड़कर) को निकासी से पहले ${setTxtcontent.value.multiple} बार दांव लगाना होगा, सट्टेबाजी के लिए गेम प्लेटफॉर्म पर कोई सीमा नहीं होगी।.
              यह गतिविधि मंच से एक अतिरिक्त उपहार है, जबकि अन्य एजेंट पुरस्कार और कमीशन का आनंद लेते हुए, इस प्रकार सीधे कई खुशियों का आनंद ले रहे हैं।.
              पुरस्कार केवल iOS, Android, H5 और PC प्लेटफ़ॉर्म पर मैन्युअल रूप से प्राप्त किए जा सकते हैं, और समाप्त होने पर स्वचालित रूप से वितरित किए जाएंगे।.
              यह गतिविधि केवल खाताधारक के लिए सामान्य मैन्युअल संचालन करने के लिए है, किराए पर लेना, प्लग-इन, रोबोट का उपयोग करना, विभिन्न खातों के साथ जुआ खेलना, आपसी ब्रशिंग, मध्यस्थता, इंटरफेस, प्रोटोकॉल, कमजोरियों का फायदा उठाना, समूह नियंत्रण, या अन्य तकनीकी साधन निषिद्ध हैं। . अन्यथा, पुरस्कार रद्द या काटे जा सकते हैं, खाते फ़्रीज़ किए जा सकते हैं, या काली सूची में भी डाले जा सकते हैं।.
              समझ में अंतर से बचने के लिए, मंच इस गतिविधि की अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
                    `,
      tl_PH: `
              Mga bagong rehistradong downline lamang na kwalipikado ayon sa patakaran ng event.
              Mag-refer ng kaibigan para magbukas ng treasure chest. Kumpletuhin ang kinakailangang bilang ng tao upang makakuha ng katumbas na chest na may halagang hanggang ${currentNum}PHP. Mas maraming ma-i-refer, mas malaki ang gantimpala.
              Ang bonus mula sa event na ito (hindi kasama ang principal) ay kailangang may kabuuang balidong taya na ${setTxtcontent.value.multiple}x bago ma-withdraw, at walang limitasyon sa platform ng laro na maaaring tayaan.
              Ang event na ito ay dagdag na bonus mula sa platform at maaari pang pagsabayin sa iba pang gantimpala at komisyon ng ahente — ibig sabihin, multiple happiness agad!
              Ang gantimpala ay kailangang i-claim nang manu-mano sa iOS, Android, H5, o PC. Kapag nag-expire, ito ay awtomatikong ipapadala.
              Ang event na ito ay para lamang sa personal at normal na paggamit ng account holder. Mahigpit na ipinagbabawal ang pagrerenta, paggamit ng cheat, bot, magkaibang account para maglaban, mutual brushing, arbitrage, API, protocol, pag-exploit ng bug, group control, o anumang teknikal na paraan ng paglahok. Kung lumabag, maaaring kanselahin o bawasan ang gantimpala, i-freeze ang account, o ilagay sa blacklist.
              Upang maiwasan ang maling interpretasyon ng teksto, ang platform na ito ay may karapatang magpaliwanag at gumawa ng pinal na desisyon para sa event na ito.
            `,
      ko_KR: `
            본 이벤트는 신규로 등록된 하위 계정 중 이벤트 요건을 충족하는 계정만 해당됩니다。
            친구를 유치하여 보물상자를 열고，달성한 인원수에 따라 해당 보상 상자를 받을 수 있으며，최고 금액은 ${currentNum} ${currentName} 입니다，더 많이 유치할수록 보상이 커집니다。
            본 이벤트로 지급된 보너스(원금 제외)는 출금하려면 ${setTxtcontent.value.multiple} 배의 유효 베팅을 충족해야 하며，베팅 플랫폼에는 제한이 없습니다。
            본 이벤트는 플랫폼의 추가 지급으로，기타 에이전트 보상 및 커미션과 동시에 적용되어 즉시 다중 혜택을 누릴 수 있습니다。
            보상은 iOS、Android、H5、PC에서 수동으로만 수령 가능하며，기한이 지나면 자동으로 지급됩니다。
            본 이벤트는 계정 소유자 본인이 정상적인 수작업으로만 참여해야 하며，계정 대여、외부 프로그램(外挂) 사용、봇 사용、다른 계정 간 맞대응 베팅、互刷、차익거래、API/프로토콜 악용、취약점 이용、집단 제어(群控) 또는 기타 기술적 수단을 이용한 참여를 금지합니다。위반 시 보상이 취소·차감·동결되거나 블랙리스트에 등록될 수 있습니다。
            문구 이해 차이를 방지하기 위해 플랫폼은 본 이벤트에 대한 최종 해석권을 보유합니다。`,
    };
    const ty4 = {
      zh_CN: `
              凡是在我司投注达到指定门槛，即可获得对应门槛输赢比例。
              每个统计周期可领取一次，领取后将重新计算有效投注，未领取将一直累计。
              部分老虎机桌面游戏有效投注将不统计在内，例:美式21点、21点之富贵临门、百家乐、龙宝百家乐、龙虎榜……
              真实资金损失数乘以现金返还比例百分比即为现金返还。
              返现金额可直接提款或用于继续玩。
              为避免文字理解差异，平台将保留本活动最终解释权。
                       `,
      en_US: `
              Anyone who bets with us and meets the specified threshold will receive the corresponding win/loss ratio.
              It can be claimed once in each statistical period. After claiming, the valid bets will be recalculated. If not claimed, the amount will continue to accumulate.
              The cashback is calculated by multiplying the real loss amount by the cashback percentage.
              The cashback amount can be withdrawn directly or used to continue playing.
              To avoid any misunderstanding, the platform reserves the right to the final interpretation of this promotion.
                        `,
      pt_BR: `
              Quem apostar conosco e atingir o limite especificado receberá a proporção correspondente de ganhos/perdas.
              Pode ser reivindicado uma vez em cada período estatístico. Após a reivindicação, as apostas válidas serão recalculadas. Se não for reivindicado, o valor continuará a acumular.
              Algumas apostas em jogos de caça-níqueis e mesas não serão contadas, como Blackjack Americano, Blackjack Prosperidade, Baccarat, Baccarat Dragão Tesouro, Dragão-Tigre, etc.
              O cashback é calculado multiplicando o valor da perda real pela porcentagem de cashback.
              O valor do cashback pode ser retirado diretamente ou usado para continuar jogando.
              Para evitar mal-entendidos, a plataforma reserva-se o direito de interpretação final desta promoção.
                        `,
      th_TH: `
              เดิมพันเกมต่างๆในแพลตฟอร์มของเรา  รับทันที่โบนัสเงินคืนเมื่อถึงเกณฑ์ที่กำหนด.
              สามารถขอรับได้ 1 ครั้งในแต่ละช่วงสถิติ หลังจากการอ้างสิทธิ์แล้ว การเดิมพันที่ถูกต้องจะถูกคำนวณใหม่ หากไม่ได้รับการเรียกร้อง จำนวนเงินจะถูกสะสมต่อไป
              ยอดเดิมพันบางส่วนของเกมสล็อต และคาสิโน จะไม่ได้รับการนับ ตัวอย่างเช่นแบล็คแจ็คอเมริกัน, แบล็คแจ็ครวย Linmen, บาคาร่า, Dragon Baccarat, Dragon Tiger ...
              ยอดเสียจริงคูณด้วยเปอร์เซ็นต์อัตราส่วนเงินคืน (Cash Back) และจะได้รับออกเป็นโบนัสเงินคืน.
              จำนวนเงินคืนสามารถใช้เพื่อเล่นต่อได้ หรือถอนออกได้โดยตรง.
              เพื่อหลีกเลี่ยงความแตกต่างในการทำความเข้าใจข้อความ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของกิจกรรมนี้.
                     `,
      vi_VN: `
              Chỉ cần trên nền tảng của công ty đặt cược đến ngưỡng quy địng sẽ nhận được tỷ lệ thắng thua tương ứng.
              Có thể yêu cầu một lần trong mỗi giai đoạn thống kê. Sau khi yêu cầu, các cược hợp lệ sẽ được tính toán lại. Nếu không yêu cầu, số tiền sẽ tiếp tục tích lũy.
              Một số trò chơi sẽ không được tham gia vào sự kiện này, ví dụ: American Blackjack, Blackjack Fortune, Baccarat, Long Bao Baccarat, Dragon Tiger List...
              Số tiền hoàn cược được tính bằng cách nhân số tiền thua thực tế nhân phần trăm tỷ lệ hoàn tiền.
              Tiền hoàn cược có thể rút trực tiếp hoặc tiếp tục chơi các trò chơi khác.
              Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
                     `,
      hi_IN: `
              जो कोई भी हमारी कंपनी में दांव लगाता है और निर्दिष्ट सीमा तक पहुंचता है, वह सीमा के अनुरूप जीत-हार अनुपात प्राप्त कर सकता है।.
              इसका दावा प्रत्येक सांख्यिकीय अवधि में एक बार किया जा सकता है। दावा करने के बाद, वैध दांव की पुनः गणना की जाएगी। यदि दावा नहीं किया गया तो राशि जमा होती रहेगी।
              कुछ स्लॉट मशीन टेबल गेम्स पर वैध दांवों को नहीं गिना जाएगा, उदाहरण के लिए: अमेरिकन ब्लैकजैक, ब्लैकजैक फॉर्च्यून, बैकारेट, लॉन्ग बाओ बैकारेट, ड्रैगन टाइगर लिस्ट...
              कैश बैक की गणना खोए गए धन की वास्तविक राशि को कैश बैक प्रतिशत से गुणा करके की जाती है।.
              कैशबैक राशि सीधे निकाली जा सकती है या खेलना जारी रखने के लिए उपयोग की जा सकती है।.
              पाठ की समझ में अंतर से बचने के लिए, मंच इस घटना की अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
                    `,
      tl_PH: `
              Kapag umabot ang iyong taya sa aming platform sa itinakdang threshold, makakakuha ka ng katumbas na porsyento ng panalo/talo para sa threshold na iyon.
              Maaaring i-claim nang isang beses bawat cycle ng estadistika. Pagkatapos mag-claim, muling kakalkulahin ang valid na taya; kung hindi i-claim, patuloy itong maiipon.
              Ang ilang valid na taya sa mga slot at table games ay hindi isasama sa bilang, hal: American 21, 21 Rich Arrival, Baccarat, Dragon Treasure Baccarat, Dragon Tiger Rank...
              Ang aktwal na halagang natalo gamit ang totoong pera ay imumultiplika sa porsyento ng cashback upang makuha ang halaga ng cashback.
              Maaaring direktang i-withdraw ang cashback o gamitin para magpatuloy sa paglalaro.
              Upang maiwasan ang hindi pagkakaunawaan sa teksto, nakalaan sa platform ang pinal na karapatan sa pagpapaliwanag ng event na ito.
              `,
      ko_KR: `
              당사에서 지정된 기준에 도달한 베팅 금액은 해당 기준에 따른 손익 비율을 받을 수 있습니다.
              각 집계 주기마다 1회 수령 가능하며, 수령 후에는 유효 베팅이 다시 계산되고, 미수령 시에는 계속 누적됩니다.
              일부 슬롯 및 테이블 게임의 유효 베팅은 집계되지 않습니다.
              예: 아메리칸 블랙잭, 블랙잭의 부귀, 바카라, 드래곤 보너스 바카라, 드래곤 타이거 등…
              실제 자금 손실 금액 × 캐시백 비율(%) = 캐시백 금액이 됩니다.
              캐시백 금액은 바로 출금하거나 계속 플레이하는 데 사용할 수 있습니다.
              본 이벤트에 대한 최종 해석 권한은 플랫폼에 있습니다.`,
    };
    const ty6 = {
      zh_CN: `
                      活动开始后，您注册后将自动参加。
                      ${
                        everyDayBetActiveText.day?.['zh_CN']
                      }有效投注需要满足活动条件，即可领取一次${
        everyDayBetActiveText?.rewardText?.['zh_CN']
      }。最高可获得奖励${Object.values(everyDayBetActiveText?.money)}${Object.keys(
        everyDayBetActiveText?.money,
      )}。
                      ${
                        everyDayBetActiveText?.getType?.['zh_CN']
                          ? everyDayBetActiveText?.getType?.['zh_CN']
                          : ''
                      }
                      本次活动的所有奖金，需要${everyDayBetActiveText.multipleCount}倍流水才能提现。
                      本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
                      为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
                    `,
      en_US: `
                      After the event starts, you will automatically participate once you register.
                      ${
                        everyDayBetActiveText.day?.['en_US']
                      } valid bets must meet the event requirements to receive the ${
        everyDayBetActiveText.rewardText['en_US']
      } once. The maximum reward is ${Object.values(everyDayBetActiveText?.money)}${Object.keys(
        everyDayBetActiveText?.money,
      )}.
                      ${
                        everyDayBetActiveText.getType?.['en_US']
                          ? everyDayBetActiveText.getType?.['en_US']
                          : ''
                      }
                      All bonuses from this event require a ${
                        everyDayBetActiveText.multipleCount
                      }x wagering turnover before withdrawal.
                      This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
                      To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
                    `,
      pt_BR: `
                      Após o início do evento, você será automaticamente inscrito após se registrar.
                      As apostas ${
                        everyDayBetActiveText.day?.['pt_BR']
                      } válidas devem atender aos requisitos do evento para receber o ${
        everyDayBetActiveText?.rewardText?.['pt_BR']
      } uma vez. O valor máximo da recompensa é de ${Object.values(
        everyDayBetActiveText?.money,
      )}${Object.keys(everyDayBetActiveText?.money)}.
                      ${
                        everyDayBetActiveText?.getType?.['pt_BR']
                          ? everyDayBetActiveText?.getType?.['pt_BR']
                          : ''
                      }
                      Todos os bônus deste evento exigem um turnover de apostas de ${
                        everyDayBetActiveText.multipleCount
                      }x antes do saque.
                      Qualquer usuário ou grupo que receber incentivos de eventos de forma anormal ou fraudulenta, a plataforma tem o direito de congelar ou fechar a conta relevante sem aviso prévio e sem reembolso, o usuário será colocado na lista negra.
                      Para evitar mal-entendidos, a plataforma reserva o direito de interpretação final deste evento.
                   `,
      vi_VN: `
                      Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
                      Cược hợp lệ ${
                        everyDayBetActiveText.day?.['vi_VN']
                      } chỉ cần đáp ứng điều kiện sự kiện liền có thể nhận một lần ${
        everyDayBetActiveText.rewardText['vi_VN']
      }. Phần thưởng tối đa lên tới ${Object.values(everyDayBetActiveText?.money)}${Object.keys(
        everyDayBetActiveText?.money,
      )}.
                      ${
                        everyDayBetActiveText.getType?.['vi_VN']
                          ? everyDayBetActiveText.getType?.['vi_VN']
                          : ''
                      }
                      Tất cả tiền thưởng từ sự kiện này yêu cầu ${
                        everyDayBetActiveText.multipleCount
                      } lần vòng cược mới có thể rút.
                      Qualquer usuário ou grupo que receber incentivos de eventos de forma anormal ou fraudulenta, a plataforma tem o direito de congelar ou fechar a conta relevante sem aviso prévio e sem reembolso, o usuário será colocado na lista negra.
                      Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.

                   `,
      th_TH: `
                      หลังจากกิจกรรมเริ่มขึ้น ท่านจะเข้าร่วมโดยอัตโนมัติเมื่อสมัครสมาชิก
                      ต้องมียอดเดิมพันที่เข้าเงื่อนไขในช่วง ${
                        everyDayBetActiveText.day?.['th_TH']
                      } เพื่อรับ${everyDayBetActiveText?.rewardText?.['th_TH']} 1 ครั้ง
                      รับรางวัลสูงสุดได้ ${Object.values(
                        everyDayBetActiveText?.money,
                      )}${Object.keys(everyDayBetActiveText?.money)}
                      ${
                        everyDayBetActiveText?.getType?.['th_TH']
                          ? everyDayBetActiveText?.getType?.['th_TH']
                          : ''
                      }
                      โบนัสทั้งหมดในกิจกรรมนี้ ต้องทำยอดเทิร์น ${
                        everyDayBetActiveText.multipleCount
                      } เท่าก่อนถอน
                      กิจกรรมนี้จำกัดเฉพาะเจ้าของบัญชีที่ดำเนินการด้วยตัวเองเท่านั้น ห้ามเช่า ใช้โปรแกรมโกง บอท บัญชีซ้ำ เล่นสลับกัน ระงับ คำสั่ง API โปรโตคอล ช่องโหว่ หรือเครื่องมือควบคุมหลายบัญชี ไม่เช่นนั้นรางวัลอาจถูกยกเลิก ถูกระงับ หรือขึ้นบัญชีดำ
                      แพลตฟอร์มขอสงวนสิทธิ์ในการตีความกิจกรรมนี้แต่เพียงผู้เดียว
                    `,

      hi_IN: `
                      गतिविधि शुरू होने के बाद, आप पंजीकरण करने के बाद स्वचालित रूप से भाग लेंगे।
                      ${
                        everyDayBetActiveText.day?.['hi_IN']
                      } वैध दांव को गतिविधि की शर्तों को पूरा करना होगा, तभी आप एक बार प्राप्त कर सकते हैं ${
        everyDayBetActiveText?.rewardText?.['hi_IN']
      }। अधिकतम प्राप्त पुरस्कार ${Object.values(everyDayBetActiveText?.money)}${Object.keys(
        everyDayBetActiveText?.money,
      )}।
                      ${
                        everyDayBetActiveText?.getType?.['hi_IN']
                          ? everyDayBetActiveText?.getType?.['hi_IN']
                          : ''
                      }
                      इस गतिविधि के सभी पुरस्कारों को निकालने के लिए ${
                        everyDayBetActiveText.multipleCount
                      } गुना रिवर्स प्रवाह की आवश्यकता है।
                      यह गतिविधि केवल खाता धारक द्वारा सामान्य मानव संचालन के लिए सीमित है। पट्टे पर देना, धोखाधड़ी का उपयोग करना, बोट्स, विभिन्न खातों के साथ खेलना, एक-दूसरे को बढ़ावा देना, मध्यस्थता, इंटरफेस, प्रोटोकॉल, खामियों का उपयोग करना, समूह नियंत्रण आदि तकनीकी तरीकों की अनुमति नहीं है। अन्यथा, पुरस्कार रद्द किए जा सकते हैं या काटे जा सकते हैं, जमा हो सकते हैं या काले सूची में डाल दिए जा सकते हैं।
                      शब्दों के अर्थ में मतभेदों से बचने के लिए, मंच इस गतिविधि के अंतिम व्याख्याकार का अधिकार रखता है।
                    `,

      tl_PH: `
                Pagkatapos magsimula ang event, awtomatikong sasali ka matapos magrehistro.
                ${
                  everyDayBetActiveText.day?.['tl_PH']
                } na valid na taya ay kailangang matugunan ang kondisyon ng event upang makapag-claim nang isang beses ng ${
        everyDayBetActiveText?.rewardText?.['tl_PH']
      }。
                Pinakamataas na gantimpala: ${Object.values(
                  everyDayBetActiveText?.money,
                )}${Object.keys(everyDayBetActiveText?.money)}。
                ${
                  everyDayBetActiveText?.getType?.['tl_PH']
                    ? everyDayBetActiveText?.getType?.['tl_PH']
                    : ''
                }
                Lahat ng bonus sa event na ito ay kailangang magkaroon ng ${
                  everyDayBetActiveText.multipleCount
                }x turnover bago ma-withdraw.
                Ang event na ito ay para lamang sa normal na operasyon ng may-ari ng account. Ipinagbabawal ang pagpaparenta, paggamit ng cheat, bot, iba’t ibang account para maglaro, mutual brushing, arbitration, API, protocol, paggamit ng bug, group control, at iba pang teknikal na paraan. Kung hindi, maaaring kanselahin o bawasan ang gantimpala, i-freeze ang account, o ilagay sa blacklist.
                Upang maiwasan ang hindi pagkakaunawaan sa teksto, nakalaan sa platform ang pinal na karapatan sa pagpapaliwanag ng event na ito.
                    `,
      ko_KR: `
                    이벤트 시작 후, 회원 가입 시 자동으로 참여됩니다.
                    ${
                      everyDayBetActiveText.day?.['ko_KR']
                    } 유효 베팅이 이벤트 조건을 충족하면 1회 ${
        everyDayBetActiveText?.rewardText?.['ko_KR']
      }을(를) 받을 수 있습니다. 최대 보상은 ${Object.values(
        everyDayBetActiveText?.money,
      )}${Object.keys(everyDayBetActiveText?.money)}입니다.
                    ${
                      everyDayBetActiveText?.getType?.['ko_KR']
                        ? everyDayBetActiveText?.getType?.['ko_KR']
                        : ''
                    }
                    본 이벤트에서 획득한 모든 보상은 ${
                      everyDayBetActiveText.multipleCount
                    }배의 베팅 조건을 충족해야 출금할 수 있습니다.
                    본 이벤트는 계정 소유자의 정상적인 이용만 허용됩니다.  계정 임대, 부정행위, 봇 사용, 다계정 플레이, 상호 베팅, 중재, API·프로토콜·버그·그룹 컨트롤 등 기술적 수단의 사용은 금지됩니다. 위반 시 보상이 취소·차감·동결되거나 블랙리스트에 등재될 수 있습니다.
                    텍스트 해석에 대한 이견을 방지하기 위해, 본 이벤트의 최종 해석 권한은 플랫폼에 있습니다.`,
    };
    const ty8PartObj = {
      1: {
        zh_CN: `活动开始后，您注册后将自动参加。您需要在${
          chargeDynamicText.isLimit == 1
            ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['zh_CN'] || ''}内`
            : firstChargeObj['zh_CN']
        }充值并达到充值金额要求。
                      仅一次机会，充值越多，奖励越多，最高可获得奖励${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      }${currentName}。
                      ${chargeDynamicText.getType?.['zh_CN']}`,
        en_US: `
                      After the event starts, you will automatically participate once you register. You must make a deposit within ${
                        chargeDynamicText.isLimit == 1
                          ? `${chargeDynamicText.time}${
                              chargeDynamicText.timeUnit?.['en_US'] || ''
                            }`
                          : firstChargeObj['en_US']
                      } and meet the deposit amount requirement.
                      You only have one chance. The more you deposit, the more rewards you receive, with a maximum reward of ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      ${chargeDynamicText.getType?.['en_US']}`,
        pt_BR: `
                      Após o início do evento, você será automaticamente inscrito após se registrar. Você precisa fazer um depósito dentro de ${
                        chargeDynamicText.isLimit == 1
                          ? `${chargeDynamicText.time}${
                              chargeDynamicText.timeUnit?.['pt_BR'] || ''
                            }e`
                          : firstChargeObj['pt_BR']
                      } atingir o valor mínimo exigido.
                      Há apenas uma chance, quanto maior o depósito, maior a recompensa, com um valor máximo de ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      ${chargeDynamicText.getType?.['pt_BR']}`,
        vi_VN: `
                      Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia. Bạn cần nạp tiền trong ${
                        chargeDynamicText.isLimit == 1
                          ? `${chargeDynamicText.time}${
                              chargeDynamicText.timeUnit?.['vi_VN'] || ''
                            }`
                          : firstChargeObj['vi_VN']
                      } và đáp ứng yêu cầu về số tiền nạp.
                      Chỉ có một cơ hội, nạp càng nhiều, thưởng càng cao. Phần thưởng tối đa lên tới ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      ${chargeDynamicText.getType?.['vi_VN']}`,
        th_TH: `หลังจากกิจกรรมเริ่มขึ้น ท่านจะเข้าร่วมโดยอัตโนมัติเมื่อสมัครสมาชิก${
          chargeDynamicText.isLimit == 1
            ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['th_TH'] || ''}ภายในเวลา`
            : firstChargeObj['th_TH']
        } ท่านจำเป็นต้องเติมเงินและถึงยอดตามที่กำหนด
                      มีเพียง 1 โอกาส ยิ่งเติมมาก ยิ่งได้มาก รับโบนัสสูงสุด ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      }${currentName}
                      ${chargeDynamicText.getType?.['th_TH']}`,
        hi_IN: `गतिविधि शुरू होने के बाद, आप पंजीकरण करने के बाद स्वचालित रूप से भाग लेंगे। आपको ${
          chargeDynamicText.isLimit == 1
            ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['hi_IN'] || ''} के भीतर`
            : firstChargeObj['hi_IN']
        } जमा करना होगा और जमा राशि की शर्तों को पूरा करना होगा।
                      यह केवल एक बार का अवसर है, जितना अधिक आप जमा करेंगे, उतना अधिक पुरस्कार मिलेगा, अधिकतम पुरस्कार ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName} प्राप्त किया जा सकता है।
                      ${chargeDynamicText.getType?.['hi_IN']}
                      `,
        tl_PH: `
              Pagkatapos magsimula ang event, awtomatikong sasali ka matapos magrehistro. Kailangan mong mag-recharge sa loob ng ${
                chargeDynamicText.isLimit == 1
                  ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['tl_PH'] || ''}`
                  : firstChargeObj['tl_PH']
              } at maabot ang kinakailangang halaga ng recharge.
              Isang beses lang ang pagkakataon — mas mataas ang recharge, mas malaki ang gantimpala, na may pinakamataas na maaaring makuha na ${
                chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
              }${currentName}。
              ${chargeDynamicText.getType?.['tl_PH']}
            `,
        ko_KR: `이벤트 시작 후, 회원 가입 시 자동으로 참여됩니다.${
          chargeDynamicText.isLimit == 1
            ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['ko_KR'] || ''}내`
            : firstChargeObj['ko_KR']
        }충전 후, 충전 금액 요건을 충족해야 합니다.
                      기회는 단 한 번뿐이며, 충전 금액이 많을수록 보상이 커집니다. 최대 보상은${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      }${currentName}。
                      ${chargeDynamicText.getType?.['ko_KR']}`,
      },
      2: {
        zh_CN: `
                      活动开始后，您注册后将自动参加。您仅需要在${
                        chargeDynamicText.cycleText?.['zh_CN']
                      }完成充值并累计达到充值金额要求。
                      充值越多，奖励越多，最高可获得奖励${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}。
                      获得奖励资格后，会在次日01:00:00后更新，请等待奖励发放。
                      ${chargeDynamicText.getType?.['zh_CN']}`,
        en_US: `
                      After the event starts, you will automatically participate once you register. You only need to complete a deposit on the ${
                        chargeDynamicText.cycleText?.['en_US']
                      } and accumulate the required deposit amount.
                      The more you deposit, the greater the rewards, with a maximum reward of ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
                      ${chargeDynamicText.getType?.['en_US']}`,
        pt_BR: `
                      Após o início do evento, você será automaticamente inscrito após se registrar. Você só precisa fazer um depósito no mesmo dia e acumular o valor exigido.
                      Quanto maior o depósito, maior a recompensa, com um valor máximo de ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      Após qualificar-se para a recompensa, ela será atualizada após as 01:00:00 do dia seguinte. Por favor, aguarde a distribuição do bônus.
                      ${chargeDynamicText.getType?.['pt_BR']}`,
        vi_VN: `
                      Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia. Bạn chỉ cần hoàn tất việc nạp tiền ${
                        chargeDynamicText.cycleText?.['vi_VN']
                      } và đạt đủ yêu cầu về số tiền nạp tích lũy.
                      Nạp càng nhiều, thưởng càng cao. Phần thưởng tối đa lên tới ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      Sau khi đủ tư cách nhận thưởng, sự kiện sẽ tự động cập vào 01:00:00, vui lòng chờ đợi phát thưởng.
                      ${chargeDynamicText.getType?.['vi_VN']}`,
        th_TH: `หลังจากกิจกรรมเริ่มต้น คุณจะเข้าร่วมโดยอัตโนมัติหลังจากการลงทะเบียน คุณเพียงแค่ต้องทำการฝากเงินภายใน ${
          chargeDynamicText.cycleText?.['th_TH']
        } และทำให้ถึงจำนวนเงินฝากที่กำหนด
                      ยิ่งฝากมาก ยิ่งได้รับรางวัลมาก รางวัลสูงสุดที่สามารถได้รับคือ ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}
                      เมื่อได้รับสิทธิ์ในการรับรางวัลแล้ว รางวัลจะได้รับการอัปเดตหลังเวลา 01:00:00 ของวันถัดไป โปรดรอการแจกจ่ายรางวัล
                      ${chargeDynamicText.getType?.['th_TH']}
              `,
        hi_IN: `गतिविधि शुरू होने के बाद, आप पंजीकरण करने के बाद स्वचालित रूप से भाग लेंगे। आपको केवल ${
          chargeDynamicText.cycleText?.['hi_IN']
        } के भीतर जमा करना होगा और जमा राशि की शर्तों को पूरा करना होगा।
                      जितना अधिक आप जमा करेंगे, उतना अधिक पुरस्कार मिलेगा, अधिकतम पुरस्कार ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName} प्राप्त किया जा सकता है।
                      पुरस्कार प्राप्त करने के योग्य होने के बाद, यह अगले दिन 01:00:00 के बाद अपडेट होगा, कृपया पुरस्कार वितरित होने का इंतजार करें।
                      ${chargeDynamicText.getType?.['hi_IN']}
                    `,
        tl_PH: `
                  Pagkatapos magsimula ang event, awtomatikong sasali ka matapos magrehistro. Kailangan mo lamang mag-recharge sa loob ng ${
                    chargeDynamicText.cycleText?.['tl_PH']
                  } at maabot ang kinakailangang kabuuang halaga ng recharge.
                  Mas mataas ang recharge, mas malaki ang gantimpala, na may pinakamataas na maaaring makuha na ${
                    chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                  } ${currentName}。
                  Kapag nakuha ang kwalipikasyon para sa gantimpala, ito ay maa-update pagkatapos ng 01:00:00 kinabukasan. Mangyaring maghintay para sa pagpapadala ng gantimpala.
                  ${chargeDynamicText.getType?.['tl_PH']}
              `,
        ko_KR: `
              이벤트 시작 후, 회원 가입 시 자동으로 참여됩니다.   ${
                chargeDynamicText.cycleText?.['ko_KR']
              } 내에 충전을 완료하고 누적 충전 금액 요건을 충족해야 합니다.
              충전 금액이 많을수록 보상이 커지며, 최대 보상은 ${
                chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
              } ${currentName}입니다.
              보상 자격을 획득한 후에는 익일 01:00:00 이후에 갱신되며, 보상 지급을 기다려 주시기 바랍니다.   ${
                chargeDynamicText.getType?.['ko_KR']
              }`,
      },
      3: {
        zh_CN: `活动开始后，您注册后将自动参加。自注册时间开始，第${chargeDynamicText.dayList.join(
          '，',
        )}天内均可领取注册奖金。
                      充值越多，奖励越多，最高可获得奖励${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}。
                      未领取的奖金将在第${
                        chargeDynamicText.dayList.length > 0
                          ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                          : ''
                      }天00:00:00自动发放到钱包。`,
        en_US: `
                      After the event starts, you will automatically participate once you register. From the time of registration, you can claim the registration bonus on the 2nd, 3rd, 7th, 15th, and 30th days.
                      The more you deposit, the greater the rewards, with a maximum reward of ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      Unclaimed bonuses will be automatically credited to your wallet at 00:00:00 on the ${
                        chargeDynamicText.dayList.length > 0
                          ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                          : ''
                      }st day.`,
        pt_BR: `
                      Após o início do evento, você será automaticamente inscrito após se registrar. A partir da data de registro, você pode resgatar o bônus de registro nos dias ${chargeDynamicText.dayList.join(
                        '，',
                      )}.
                      Quanto maior o depósito, maior a recompensa, com um valor máximo de ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      Bônus não resgatados serão automaticamente creditados na carteira às 00:00:00 do ${
                        chargeDynamicText.dayList.length > 0
                          ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                          : ''
                      }º dia.`,
        vi_VN: `
                      Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia. Kể từ thời điểm Đăng Ký, bạn có thể nhận thưởng này trong ngày thứ ${chargeDynamicText.dayList.join(
                        '，',
                      )}.
                      Nạp càng nhiều, thưởng càng cao. Phần thưởng tối đa lên tới ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}.
                      Tiền thưởng chưa nhận sẽ tự động chuyển vào ví vào lúc 00:00:00 ngày thứ ${
                        chargeDynamicText.dayList.length > 0
                          ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                          : ''
                      }.`,
        th_TH: `หลังจากกิจกรรมเริ่มขึ้น ท่านจะเข้าร่วมโดยอัตโนมัติเมื่อสมัครสมาชิก
                      ตั้งแต่วันที่สมัคร วันที่ ${chargeDynamicText.dayList.join(
                        '、',
                      )} ท่านสามารถรับโบนัสลงทะเบียนได้
                      ยิ่งเติมเงินมาก ยิ่งรับโบนัสมาก สูงสุด ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName}
                      โบนัสที่ยังไม่ได้รับจะถูกโอนเข้ากระเป๋าเงินโดยอัตโนมัติในวันที่ ${
                        chargeDynamicText.dayList.length > 0
                          ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                          : ''
                      } เวลา 00:00:00
                    `,
        hi_IN: `गतिविधि शुरू होने के बाद, आप पंजीकरण करने के बाद स्वचालित रूप से भाग लेंगे। पंजीकरण के समय से, आप ${chargeDynamicText.dayList.join(
          '，',
        )} दिन के भीतर पंजीकरण बोनस प्राप्त कर सकते हैं।
                      जितना अधिक आप जमा करेंगे, उतना अधिक पुरस्कार मिलेगा, अधिकतम पुरस्कार ${
                        chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                      } ${currentName} प्राप्त किया जा सकता है।
                      जो बोनस प्राप्त नहीं किया गया है, वह ${
                        chargeDynamicText.dayList.length > 0
                          ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                          : ''
                      } दिन 00:00:00 पर स्वचालित रूप से वॉलेट में वितरित कर दिया जाएगा।
                    `,
        tl_PH: `
                Kapag nagsimula ang event, awtomatiko kang sasali pagkatapos magparehistro. Mula sa oras ng pagpaparehistro, sa loob ng ika-${chargeDynamicText.dayList.join(
                  '，',
                )}
                araw ay maaari mong kunin ang registration bonus. Mas malaki ang recharge, mas malaki ang reward, hanggang sa maximum
                na ${
                  chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
                } ${currentName}. Ang mga bonus na hindi nakolekta ay awtomatikong ilalagay sa wallet sa
                ika-${
                  chargeDynamicText.dayList.length > 0
                    ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                    : ''
                } araw 00:00:00.
              `,
        ko_KR: `
              이벤트 시작 후, 회원 가입 시 자동으로 참여됩니다.   가입 시점부터 ${chargeDynamicText.dayList.join(
                '일, ',
              )}일 동안 등록 보너스를 받을 수 있습니다.
              충전 금액이 많을수록 보상이 커지며, 최대 보상은 ${
                chargeDynamicText.currentMoney?.[currentCurryId.value] || 0
              } ${currentName}입니다.
              수령하지 않은 보너스는 ${
                chargeDynamicText.dayList.length > 0
                  ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
                  : ''
              }일차 00:00:00에 자동으로 지갑에 지급됩니다.`,
      },
    };
    const ty8 = {
      zh_CN: `
                      ${ty8PartObj[chargeDynamicText.currentType]?.['zh_CN']}
                      本次活动的所有奖金，需要${everyDayBetActiveText.multipleCount}倍流水才能提现。
                      ${chargeDynamicText.currentType == 1 ? '本活动同一个ip只能参与一次。' : ''}
                      本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
                      为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
                    `
        .replace(/\n\s*\n/g, '\n')
        .trim(),
      en_US: `
                      ${ty8PartObj[chargeDynamicText.currentType]?.['en_US']}
                      All bonuses from this event require a ${
                        everyDayBetActiveText.multipleCount
                      }x wagering turnover before withdrawal.
                       ${
                         chargeDynamicText.currentType == 1
                           ? 'Each IP address can participate in this promotion only once.'
                           : ''
                       }
                      This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
                      To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
                   `
        .replace(/\n\s*\n/g, '\n')
        .trim(),
      pt_BR: `
                      ${ty8PartObj[chargeDynamicText.currentType]?.['pt_BR']}
                      Todos os bônus deste evento exigem um turnover de apostas de ${
                        everyDayBetActiveText.multipleCount
                      }x antes do saque.
                      ${
                        chargeDynamicText.currentType == 1
                          ? 'Cada IP pode participar desta promoção apenas uma vez.'
                          : ''
                      }
                      Este evento é válido apenas para atividade normal de titulares de contas individuais. É proibido alugar contas, usar trapaças, bots, múltiplas contas, negociações mútuas, arbitragem, uso de APIs, exploração de vulnerabilidades, controle em grupo ou quaisquer outros meios técnicos. Caso contrário, as recompensas podem ser canceladas, deduzidas, congeladas ou até mesmo resultar em inclusão na lista negra.
                      Para evitar mal-entendidos, a plataforma reserva o direito de interpretação final deste evento.
                   `
        .replace(/\n\s*\n/g, '\n')
        .trim(),
      vi_VN: `
                      ${ty8PartObj[chargeDynamicText.currentType]?.['vi_VN']}
                      Tất cả tiền thưởng từ sự kiện này yêu cầu ${
                        everyDayBetActiveText.multipleCount
                      } lần vòng cược mới có thể rút.
                       ${
                         chargeDynamicText.currentType == 1
                           ? 'Sự kiện này mỗi một IP chỉ được than gia một lần.'
                           : ''
                       }
                      Qualquer usuário ou grupo que receber incentivos de eventos de forma anormal ou fraudulenta, a plataforma tem o direito de congelar ou fechar a conta relevante sem aviso prévio e sem reembolso, o usuário será colocado na lista negra.
                      Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.

                   `
        .replace(/\n\s*\n/g, '\n')
        .trim(),
      th_TH: `${ty8PartObj[chargeDynamicText.currentType]?.['th_TH']}
                      โบนัสทั้งหมดในกิจกรรมนี้ ต้องทำยอดเทิร์น ${
                        everyDayBetActiveText.multipleCount
                      } เท่าก่อนถอน
                      ${
                        chargeDynamicText.currentType == 1
                          ? 'กิจกรรมนี้สามารถเข้าร่วมได้เพียงครั้งเดียวต่อ IP เท่านั้น'
                          : ''
                      }
                      กิจกรรมนี้จำกัดเฉพาะเจ้าของบัญชีที่ดำเนินการด้วยตัวเองเท่านั้น ห้ามเช่า ใช้โปรแกรมโกง บอท บัญชีซ้ำ เล่นสลับกัน ระงับ คำสั่ง API โปรโตคอล ช่องโหว่ หรือเครื่องมือควบคุมหลายบัญชี ไม่เช่นนั้นรางวัลอาจถูกยกเลิก ถูกระงับ หรือขึ้นบัญชีดำ
                      แพลตฟอร์มขอสงวนสิทธิ์ในการตีความกิจกรรมนี้แต่เพียงผู้เดียว
                    `,
      hi_IN: `${ty8PartObj[chargeDynamicText.currentType]?.['hi_IN']}
                    इस गतिविधि के सभी पुरस्कारों को निकालने के लिए ${
                      everyDayBetActiveText.multipleCount
                    } गुना रिवर्स प्रवाह की आवश्यकता है।
                    ${
                      chargeDynamicText.currentType == 1
                        ? 'इस गतिविधि में एक ही आईपी केवल एक बार भाग ले सकता है।'
                        : ''
                    }
                    यह गतिविधि केवल खाता धारक द्वारा सामान्य मानव संचालन के लिए सीमित है। पट्टे पर देना, धोखाधड़ी का उपयोग करना, बोट्स, विभिन्न खातों के साथ खेलना, एक-दूसरे को बढ़ावा देना, मध्यस्थता, इंटरफेस, प्रोटोकॉल, खामियों का उपयोग करना, समूह नियंत्रण आदि तकनीकी तरीकों की अनुमति नहीं है। अन्यथा, पुरस्कार रद्द किए जा सकते हैं या काटे जा सकते हैं, जमा हो सकते हैं या काले सूची में डाल दिए जा सकते हैं।
                    शब्दों के अर्थ में मतभेदों से बचने के लिए, मंच इस गतिविधि के अंतिम व्याख्याकार का अधिकार रखता है।
                  `,
      tl_PH: `
              ${ty8PartObj[chargeDynamicText.currentType]?.['tl_PH']}
              Ang lahat ng bonus sa event na ito ay kailangang magkaroon ng ${
                everyDayBetActiveText.multipleCount
              } na beses na turnover bago ma-withdraw.
              ${
                chargeDynamicText.currentType == 1
                  ? 'Ang event na ito ay maaaring salihan ng isang IP address nang isang beses lamang.'
                  : ''
              }
              Ang event na ito ay para lamang sa normal na manu-manong operasyon ng may-ari ng account. Mahigpit na ipinagbabawal ang pagrenta ng account, paggamit ng pandaraya, bot, paglalaro gamit ang iba’t ibang account, mutual brushing, arbitration, API, protocol, paggamit ng bug, group control, at iba pang teknik. Kung hindi, maaaring kanselahin, kaltasin, i-freeze ang reward o ilagay sa blacklist.
              Upang maiwasan ang hindi pagkakaunawaan sa interpretasyon ng mga patakaran, ang platform ay may karapatang sa huling pagpapaliwanag ng event na ito.
            `,
      ko_KR: `${ty8PartObj[chargeDynamicText.currentType]?.['ko_KR']}
            본 이벤트에서 획득한 모든 보상은 출금을 위해 ${
              everyDayBetActiveText.multipleCount
            } 배의 베팅 조건을 충족해야 합니다.
            ${
              chargeDynamicText.currentType == 1
                ? '본 이벤트는 동일한 IP에서 한 번만 참여할 수 있습니다.'
                : ''
            }
            본 이벤트는 계정 소유자의 정상적인 이용만 허용됩니다. 계정 임대, 부정행위, 봇 사용, 다계정 플레이, 상호 베팅, 중재, API·프로토콜·버그·그룹 컨트롤 등 기술적 수단의 사용은 금지됩니다. 위반 시 보상이 취소·차감·동결되거나 블랙리스트에 등재될 수 있습니다.
            텍스트 해석에 대한 이견을 방지하기 위해, 본 이벤트의 최종 해석 권한은 플랫폼에 있습니다.`,
    };

    const ty15 = {
      zh_CN: `
              除以上时间外，公司还会不定期额外发放神秘奖金，玩家还请留意手机短信或关注电报群，以免错过。
              活动开始后，您将自动注册参与,${
                award_mode == 'recharge' ? '充值' : '亏损'
              }即可获得神秘奖品，第2天、第3天、第7天、第15天、第30天均可领取。
              本活动赠送的奖金，需至少有效投注${
                setTxtcontent.value.multiple
              }倍才能提现（投注金额不限平台及游戏）。
              为避免对文本理解上的差异，平台保留本次活动的最终解释权。
                    `,
      en_US: `
              In addition to the scheduled times, the company may also issue surprise bonuses from time to time. Please check your SMS or join our Telegram group to avoid missing out.
              You’ll be auto-registered when the event starts. You can receive mystery rewards by simply ${
                award_mode == 'recharge' ? 'recharging' : 'incurring losses'
              }, and rewards will be available on Day 2, 3, 7, 15, and 30.
              The bonus from this event must be betted at least ${
                setTxtcontent.value.multiple
              } times before it can be withdrawn (no restrictions on platform or game types).
              To prevent any misunderstanding, the platform reserves final interpretation rights.
                    `,
      pt_BR: `
              Além dos horários programados, a empresa também pode emitir bônus surpresa de tempos em tempos. Verifique seu SMS ou entre em nosso grupo do Telegram para não perder nada.
              Você será registrado automaticamente quando o evento começar. Você pode receber recompensas misteriosas simplesmente ${
                award_mode == 'recharge' ? 'recharging' : 'incurring losses'
              }, e as recompensas estarão disponíveis nos dias 2, 3, 7, 15 e 30.
              O bônus desse evento deve ser apostado pelo menos ${
                setTxtcontent.value.multiple
              } vezes antes de poder ser retirado (sem restrições de plataforma ou tipos de jogos).
              Para evitar qualquer mal-entendido, a plataforma se reserva os direitos de interpretação final.
                    `,
      vn_VN: `
              Ngoài thời gian trên, công ty cũng sẽ phát hành các phần thưởng ẩn không định kì, người chơi vui lòng chú ý đến tin nhắn văn bản trên điện thoại hoặc theo dõi nhóm để tránh bỏ lỡ.
              Sau khi sự kiện bắt đầu,sau khi đăng ký sẽ tự động tham gia ${
                award_mode == 'recharge' ? 'Nạp tiền' : 'Thiệt hại'
              } liền có thể nhận được giải thưởng bí ẩn và nhận vào các ngày thứ 2, 3, 7, 15 và 30.
              Tất cả phần thưởng trong sự kiện này đều yêu cầu ${
                setTxtcontent.value.multiple
              } tiền vòng cược mới có thể rút (không giới hạn tiền cược ở nền tảng và trò chơi).
              Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
                    `,
      th_TH: `
              อาจมีการแจกโบนัสลับเป็นครั้งคราว — โปรดตรวจสอบ SMS หรือกลุ่ม Telegram เพื่อไม่พลาด.
              คุณจะเข้าร่วมกิจกรรมโดยอัตโนมัติเมื่อเริ่มต้น เติมเงินเพื่อรับรางวัลลับในวันที่ 2, 3, 7, 15 และ 30.
              โบนัสต้องทำเทิร์นอย่างน้อย ${setTxtcontent.value.multiple} เท่าก่อนถอน (ไม่จำกัดเกมหรือแพลตฟอร์ม).
              แพลตฟอร์มขอสงวนสิทธิ์ในการตีความกิจกรรมนี้.
                    `,
      hi_IN: `
              सरप्राइज बोनस समय-समय पर दिए जा सकते हैं — छूट न जाए, इसके लिए SMS या Telegram ग्रुप चेक करें।
              इवेंट शुरू होते ही आप ऑटोमैटिक शामिल हो जाएंगे। टॉप-अप करें और दिन 2, 3, 7, 15 और 30 पर रिवार्ड पाएं।
              बोनस निकालने से पहले कम से कम ${setTxtcontent.value.multiple} गुना रोलओवर ज़रूरी है (कोई गेम या प्लेटफॉर्म लिमिट नहीं)।
              किसी भी पाठ व्याख्या संबंधी अंतर से बचने के लिए,प्लेटफ़ॉर्म इस इवेंट की अंतिम व्याख्या का अधिकार सुरक्षित रखता है।
                    `,
      tl_PH: `
              Bukod sa mga oras na nabanggit sa itaas, magbibigay din ang kumpanya ng mga extra na misteryosong bonus paminsan-minsan. Mangyaring bantayan ang SMS sa iyong telepono o sumali sa Telegram group upang hindi ito mapalampas.
              Kapag nagsimula ang event, awtomatiko kang marehistro at makakasali, at sa pamamagitan ng ${
                award_mode == 'recharge' ? 'recharge' : 'pagkalugi'
              } ay maaari kang makakuha ng misteryosong premyo. Maaari itong kunin sa ika-2, ika-3, ika-7, ika-15, at ika-30 araw.
              Ang bonus na ibibigay sa event na ito ay kailangang magkaroon ng hindi bababa sa ${
                setTxtcontent.value.multiple
              } na beses na valid na taya bago ito ma-withdraw (walang limitasyon sa platform o laro para sa halaga ng taya).
              Upang maiwasan ang hindi pagkakaunawaan sa pagbasa ng teksto, ang platform ay may karapatan sa huling pagpapaliwanag ng event na ito.
                    `,
      ko_KR: `
              위의 시간 외에도, 회사는 비정기적으로 추가 미스터리 보너스를 지급하니, 놓치지 않도록 문자 메시지 또는 텔레그램 그룹을 꼭 확인하시기 바랍니다.
              이벤트 시작 후 자동으로 참여되며, ${
                award_mode == 'recharge' ? '충전' : '손실'
              } 시 미스터리 보상을 받을 수 있습니다. 2일차, 3일차, 7일차, 15일차, 30일차에 수령 가능합니다.
              본 이벤트에서 지급된 보너스는 출금을 위해 최소 ${
                setTxtcontent.value.multiple
              } 배의 유효 베팅이 필요합니다(베팅 금액은 플랫폼 및 게임에 제한 없음).
              텍스트 해석에 대한 차이를 방지하기 위해, 본 이벤트의 최종 해석 권한은 플랫폼에 있습니다.`,
    };
    if (type == 1) return get_text_ty1(siteName, ty1_config);
    if (type == 2) return ty2;
    if (type == 3)
      return get_text_ty3(ruleData, dropStyle.value, get_leftValues.value, currencyName.value);
    if (type == 4) return ty4;
    if (type == 'newRedTemp')
      return get_text_ty3(ruleData, dropStyle.value, get_leftValues.value, currencyName.value);
    if (type == 6) return ty6;
    if (type == 7)
      return get_text_ty7(
        platform_range,
        highestNumNew,
        get_leftValues,
        currentCurryId.value,
        currencyName.value,
      );
    if (type == 9) return get_text_ty9(get_leftValues9, get_leftValues);
    if (type == 14)
      return get_text_ty14(
        ruleData,
        ref(chargeDynamicText.currentMoney?.['701']),
        get_leftValues,
        currencyName.value,
      );
    if (type == 17)
      return get_text_ty17(
        ruleData,
        highestNum,
        get_leftValues.value,
        currencyName.value,
        platform_ids.value,
        plateOptions,
      );
    if (type == 8) return ty8;
    if (type == 10) return get_text_ty10(agentDaysMinAndMax, everyDayBetActiveText, currentName);
    if (type == 11) return get_text_ty11(agentMonthsMinAndMax, everyDayBetActiveText);
    if (type == 12)
      return get_text_ty12(ruleData, highestNum, get_leftValues12, currencyName.value);
    if (type == 13) {
      return get_text_ty13(ruleData, highestNum, get_leftValues13, currencyName.value);
    }

    if (type == 15) return ty15;
    if (type == 16)
      return get_text_ty16(ruleData, highestNum, get_leftValues16, currencyName.value);

    if (type == 18)
      return {
        zh_CN: computed(() => generateInviteFriendsRules('zh_CN')),
        en_US: computed(() => generateInviteFriendsRules('en_US')),
        pt_BR: computed(() => generateInviteFriendsRules('pt_BR')),
        vi_VN: computed(() => generateInviteFriendsRules('vi_VN')),
        th_TH: computed(() => generateInviteFriendsRules('th_TH')),
        hi_IN: computed(() => generateInviteFriendsRules('hi_IN')),
        tl_PH: computed(() => generateInviteFriendsRules('tl_PH')),
        ko_KR: computed(() => generateInviteFriendsRules('ko_KR')),
      };
  }

  function handleClickTranslation() {
    if (!contentListDetail.value[0].transitionValue) {
      message.error(t('v.bannner.origin_transitionValue'));
      return false;
    }

    translateContentList(
      contentListDetail.value,
      contentListDetail.value[0].transitionValue,
      0,
      'transitionValue',
    ).then((res) => {
      if (res.success) {
        message.success(t('v.bannner.transitionValue_success'));
      } else {
        message.error(t('v.bannner.transitionValue_error'));
      }
    });
  }

  function goBack() {
    $router.go(-1);
  }

  function colorValue(value) {
    showColor.value = false;
    setTimeout(() => {
      showColor.value = true;
    });
  }
  const currentTpl = computed(() => {
    return userStore.getCurrentSite['tpl'] || 1;
  });
  const settingsTy_1_rules: Record<string, Rule[]> = {
    // pass: [{ required: true, validator: validatePass, trigger: 'change' }],
    // checkPass: [{ validator: validatePass2, trigger: 'change' }],
    withdraw_amount: [
      {
        validator: async (_rule: Rule, value: number) => {
          if (!value) {
            return Promise.reject('Please input the age');
          } else {
            return Promise.resolve();
          }
        },
        trigger: 'change',
      },
    ],
  };
</script>
<style lang="less" scoped>
  ::v-deep(.ant-page-header-heading-title) {
    font-size: 1rem;
    font-weight: 500;
  }

  .editLayout {
    .footBouutn {
      display: flex;
      justify-content: center;
      margin: 30px 0;
    }
  }

  .label-item {
    ::v-deep(.ant-form-item-label) {
      label {
        display: inline-block;
        height: 40px;
        overflow: hidden;
        color: #444;
        font-size: 14px;
        font-weight: 400;
        line-height: 40px;
        text-align: right;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  ::v-deep(.ant-page-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background-color: transparent;
  }

  ::v-deep(.ant-page-header-content) {
    padding-top: 0;
  }

  ::v-deep(.vben-page-wrapper-content-bg) {
    background-color: transparent !important;
  }

  ::v-deep(.ant-page-header-heading-left) {
    margin-top: 0;
    margin-bottom: 0;

    .ant-page-header-heading-title {
      color: #444;
      font-size: 18px;
      font-size: 500;
      line-height: 18px;
    }

    .ant-page-header-heading-title::before {
      content: ' ';
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-top: -2px;
      margin-right: 8px;
      background: no-repeat;
      background-image: url('/@/assets/images/active-add.webp');
      background-position: center;
      background-size: 100%;
      vertical-align: middle;
    }

    .ant-page-header-back {
      margin-right: 15px;

      div svg {
        display: none;
      }

      div::after {
        content: ' ';
        display: inline-block;
        width: 9.1px;
        height: 14px;
        background: no-repeat;
        background-image: url('/@/assets/images/btn-left.webp');
        background-size: 100%;
        vertical-align: middle;
      }
    }
  }

  .line {
    width: 80%;
    height: 1.5px;
    margin-top: 20px;
    margin-left: 10%;
    background-color: #4444;
    font-size: 14px;
    font-weight: 500;
  }

  :deep(.pop_componentProps) {
    .ant-form-item {
      margin-bottom: 0 !important;
    }

    & + .adward-type {
      margin-top: 15px;
    }
  }

  .dropEnvelope {
    ::v-deep(.ant-form-item-label) {
      display: flex;
      align-items: center;
      justify-content: start;
    }
  }

  .activeBox {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    border: 1px solid #d9d9d9;
    background-color: #f6f7fb;

    .activHeader {
      width: 100%;
      height: 62px;
      padding-left: 10px;
      border-bottom: 1px solid #d9d9d9;
      background-color: #f6f7fb;
      line-height: 60px;
    }

    .activContent {
      width: 100%;
      padding: 20px 24px 20px 48px;
      background-color: #fff;
    }
  }

  ::v-deep(.noMagin_f) {
    display: block;

    .ant-form-item .ant-form-item {
      margin-bottom: 0;
    }
  }

  ::v-deep(.bonus_rate) {
    label {
      height: 22px;
      margin-bottom: 14px;
    }

    .ant-row {
      margin-bottom: 14px;
    }
  }

  ::v-deep(.ant-radio-wrapper) {
    margin-right: 1px;
  }

  .disabled-link {
    cursor: not-allowed;
  }

  :deep(.isChargeTime) {
    .ant-form-item-label-left {
      width: 172px !important;
    }
  }

  :deep(.ant-form-item) {
    .ant-form-item-label-left {
      width: auto !important;
    }
  }

  :deep(.negativeProfit) {
    .ant-form-item-label-left {
      display: none !important;
    }
  }

  .bonus-tpl-container {
    display: flex;
    gap: 32px;

    .bonus-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .bonus-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .icon-preview-container {
          display: flex;
          position: relative;
          align-items: center;

          .eye-icon {
            display: inline-flex;
            cursor: pointer;
          }

          .preview-image {
            position: absolute;
            z-index: 1;
            top: calc(100% + 8px);
            left: 50%;
            width: 350px;
            height: auto;
            transform: translateX(-50%);
          }
        }
      }
    }
  }

  .shortcut-open {
    position: relative;
    right: 95px;
  }

  :deep(.ant-upload.ant-upload-select-picture-card) {
    width: 180px;
    height: 180px;
  }

  .pdd-wheel {
    flex: 0.5 0.5 0%;
  }

  :deep(.mb-60px) {
    margin-bottom: 60px;
  }

  :deep(.box-right) {
    div {
      float: right;
    }
  }

  :deep(.borderri) {
    padding: 8px 15px;
    border: solid #d7d7d7 1px;
    border-radius: 3px;
    background: #f2f2f2;
  }

  :deep(.w-550px) {
    width: 550px;

    .ant-form-item {
      width: 550px !important;
    }
  }

  :deep(.currency-tree .ant-radio-wrapper) {
    width: 120px;
  }

  .no-mb {
    & > div:last-child {
      & > div:last-child div {
        margin-bottom: 0;
      }
    }
  }
</style>
