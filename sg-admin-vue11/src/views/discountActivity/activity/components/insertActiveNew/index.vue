<template>
  <PageWrapper contentClass="editLayout" :title="bigTitle" contentBackground>
    <div class="bg-white px-4 py-4 ml-2">
      <BasicForm
        :size="FORM_SIZE"
        @register="registerFormLeft"
        :schemas="ProcessLeftData(defaultTy)"
        layout="horizontal"
        @field-value-change="fieldChang"
      >
        <template #basicInfo>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('modalForm.member.member_basic') }}</h1>
          </div>
        </template>
        <template #activeTy="{ model, field }">
          <!-- 切换按钮 -->
          <LangRadioGroup
            class="!-mt-1"
            :selectValue="activityTy"
            :contentList="typeDataList"
            @update:click="changeHandleActivity"
            :disabledType="disabledType"
            v-model="model[field]"
            :isButton="true"
          />
        </template>
        <template #typeActive>
          <Select
            v-model:value="defaultTyMain"
            size="large"
            @change="changeHandle"
            :options="ActivityOptions"
            :disabled="disabledType"
          ></Select>
        </template>

        <template #basicInfo1>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ t('v.discount.activity.configuration_home') }}</h1>
          </div>
        </template>

        <template #mysteryTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.mysteryTitle') }}</h1>
          </div>
        </template>

        <template #imgConfig>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.configuration_img') }}</h1>
          </div>
        </template>

        <template #basicInfo2>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.configuration_Get') }}</h1>
          </div>
        </template>

        <template #RouletteBase2>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.RouletteBase2') }}</h1>
          </div>
        </template>

        <template #RouletteBase3>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.RouletteBase3') }}</h1>
          </div>
        </template>

        <template #NegativeConfig>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.NegativeConfig') }}</h1>
          </div>
        </template>
        <template #everydayBetTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.every_bet') }}</h1>
          </div>
        </template>
        <template #luckyBetBetTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.luckyBet') }}</h1>
          </div>
        </template>
        <!-- 签到配置标题 -->
        <template #checkIn_Title>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.checkIn_Title') }}</h1>
          </div>
        </template>
        <template #wallet_Title>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.wallet_Title') }}</h1>
          </div>
        </template>
        <template #chargeTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.chargeBet') }}</h1>
          </div>
        </template>
        <template #agentDaysTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.agent_days_reward') }}</h1>
          </div>
        </template>
        <template #agentMonthsTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.agent_months_reward') }}</h1>
          </div>
        </template>
        <template #Every8MemberTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.every8MemberTitle') }}</h1>
          </div>
        </template>
        <template #RechargeAmountTitle>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.RechargeAmountTitle') }}</h1>
          </div>
        </template>

        <template #NegativeConfigType v-if="platform_range == 2">
          <div class="zyjuz_j">
            <div class="w-70%">
              <div class="">
                <abRoundButtonGroup
                  class="mt-4"
                  v-model="tabValue"
                  :blackEdge="true"
                  :btnList="venueList"
                />
              </div>
              <CheckboxGroup
                class="!mt-10px"
                v-model:value="current_platform_ids"
                style="width: 100%"
              >
                <Row>
                  <Col :span="4" v-for="item in current_game">
                    <Checkbox @change="handleCheckboxChange($event, item)" :value="item.value">{{
                      item.name
                    }}</Checkbox>
                  </Col>
                </Row>
              </CheckboxGroup>
            </div>
          </div>
        </template>
        <template #rewardConfigSlot>
          <!-- 每日投注 -->
          <everydayBet
            ref="everydayBetRef"
            v-model="currentCurryId"
            v-model:firstCurrencyId="firstCurrencyId"
          />
        </template>
        <template #memberDayConfigSlot>
          <!-- 每日投注 -->
          <memberDay
            ref="memberDayRef"
            v-model="currentCurryId"
            v-model:firstCurrencyId="firstCurrencyId"
            :type="'memberDay'"
            :getDeatilId="timedIdisable"
          />
        </template>
        <template #rechargeConfigSlot>
          <!-- 每日投注 -->
          <memberDay
            ref="rechargeDayRef"
            v-model="currentCurryId"
            v-model:firstCurrencyId="firstCurrencyId"
            :type="'rechargeDay'"
            :getDeatilId="timedIdisable"
          />
        </template>
        <template #Lucky_betSlot>
          <!-- 幸运赌注 -->
          <luckyBet
            ref="Lucky_betSlot"
            :incentiveConfig="incentiveConfig"
            v-model="XYcurrentCurryId"
            v-model:firstCurrencyId="XYcurrentCurryId"
            :XYtableData="XYtableData"
            :getDeatilId="Timestamp_before_disabled"
            @update:model-value="handleChangeCurryId"
          />
        </template>
        <!-- 签到组件 -->
        <template #checkIn_slot>
          <checkIn
            ref="checkIn_slot"
            :incentiveConfig="incentiveConfig"
            v-model="currentCurryId"
            v-model:firstCurrencyId="firstCurrencyId"
            :XYtableData="XYtableData"
            :getDeatilId="Timestamp_before_disabled"
            @update:model-value="handleChangeCurryId"
          />
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
            @update:model-value="handleChangeCurryId"
          />
        </template>
        <!-- 充值 -->
        <template #chargeDetail_slot>
          <RewardForm
            ref="rewardFormValidate"
            :current="currentCurryId"
            :selectValue="rewardMethodsSelected"
            :getDeatilId="timedIdisable"
          />
        </template>
        <template #chargeDetail14_slot>
          <RewardForm
            ref="rewardFormValidate"
            :current="701"
            :selectValue="rewardMethodsSelected"
            :getDeatilId="timedIdisable"
          />
        </template>
        <template #agentDays_slot>
          <AgentDaysForm
            ref="agentDaysFormValidate"
            :current="currentCurryId"
            :selectValue="agentRewardMethodsSelected"
            :type="'Agent'"
            :getDeatilId="timedIdisable"
          />
        </template>
        <template #agentMonths_slot>
          <AgentMonthsForm
            ref="agentMonthsFormValidate"
            :current="currentCurryId"
            :selectValue="agentRewardMethodsSelected"
            :getDeatilId="timedIdisable"
            :type="'Agent'"
          />
        </template>

        <template #mystery_slot>
          <AgentDaysForm
            ref="mysteryFormValidate"
            :current="currentCurryId"
            :selectValue="agentRewardMethodsSelected"
            :type="'mystery'"
            :getDeatilId="timedIdisable"
          />
        </template>

        <template #dropEnvelope>
          <FormItem
            :label="$t('v.discount.activity.dropEnvelope')"
            :colon="false"
            class="dropEnvelope"
            :labelCol="{ style: { width: 120 + 'px' } }"
            :labelAlign="'right'"
          >
            <RadioGroup v-model:value="dropStyle" @change="changdropStyle">
              <Radio :value="1">
                <img :src="drop_1" :style="{ width: '84px', height: '96px' }" />
              </Radio>
              <Radio :value="2">
                <img :src="drop_2" :style="{ width: '84px', height: '96px' }" />
              </Radio>
            </RadioGroup>
          </FormItem>
        </template>

        <template #RedEnvelope>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.RedEnvelope') }}</h1>
          </div>
        </template>

        <template #customizeConfig>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.customizeConfig') }}</h1>
          </div>
        </template>

        <template #terminalSlot="{ model, field }">
          <!-- 语言框 -->
          <Row>
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
        </template>

        <template #RouletteBase1>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.RouletteBase1') }}</h1>
          </div>
        </template>
        <template #startTime="{ model, field }">
          <!-- 时间时间 -->
          <Row>
            <Col :span="11">
              <FormItem>
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :allowClear="false"
                  :disabledDate="disabledStartDate"
                  v-model:value="startTime.start_at"
                  @change="
                    (val) => {
                      changTime(val, 'start_at');
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
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :disabledDate="disabledStartDate"
                  :disabled="timedIdisable"
                  :allowClear="false"
                  v-model:value="startTime.end_at"
                  @change="
                    (val) => {
                      changTime(val, 'end_at');
                    }
                  "
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <template #showTime="{ model, field }">
          <Row>
            <Col :span="11">
              <FormItem>
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :allowClear="false"
                  v-model:value="showTime.display_start_at"
                  @change="
                    (val) => {
                      changTime(val, 'display_start_at');
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
                <DatePicker
                  :show-time="false"
                  :size="FORM_SIZE"
                  style="width: 100%"
                  :allowClear="false"
                  v-model:value="showTime.display_end_at"
                  @change="
                    (val) => {
                      changTime(val, 'display_end_at');
                    }
                  "
                  :disabled="timedIdisable"
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <template #fixedTime="{ model, field }">
          <Row>
            <Col :span="11">
              <FormItem>
                <TimePicker
                  :size="FORM_SIZE"
                  value-format="HH:mm:ss"
                  style="width: 100%"
                  :allowClear="false"
                  v-model:value="fixedTime.fixed_start_at"
                  @change="
                    (val) => {
                      changTime(val, 'fixed_start_at');
                    }
                  "
                  :disabled="timedIdisable"
                />
              </FormItem>
            </Col>
            <Col :span="1">
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
                  v-model:value="fixedTime.fixed_end_at"
                  @change="
                    (val) => {
                      changTime(val, 'fixed_end_at');
                    }
                  "
                  :disabled="timedIdisable"
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <!-- 大转盘 -->
        <template #zhNameTextSlot="{ model, field }">
          <Row>
            <Col :span="16">
              <FormItem>
                <Input
                  :size="FORM_SIZE"
                  :placeholder="$t('v.discount.activity.active_name')"
                  v-model:value="zhText"
                  @change="changInputzhText"
                  @blur="handleTinymceBlurZx"
                  style="height: 40px"
                />
              </FormItem>
            </Col>
            <Col :span="8">
              <Button
                type="primary"
                class="m-l-5"
                :size="FORM_SIZE"
                @click="handleMoreLagarage('zh_name')"
                >{{ $t('v.discount.activity.more_language') }}</Button
              >
            </Col>
          </Row>
        </template>
        <template #portfolioAll="{ model, field }">
          <Form ref="formRef" :model="settingsTy_1" :label-col="{ style: { width: '120px' } }">
            <Row>
              <FormItem
                :label="$t('v.discount.activity.portfolioName')"
                :colon="false"
                @change="ruleTimesChange"
              >
                <RadioGroup v-model:value="settingsTy_1.rule_times">
                  <Radio :value="1">{{ $t('v.discount.activity.portfolio1') }}</Radio>
                  <Radio :value="2">{{ $t('v.discount.activity.portfolio2') }}</Radio>
                  <Radio :value="3">{{ $t('v.discount.activity.portfolio3') }}</Radio>
                  <Radio :value="4">{{ $t('v.discount.activity.portfolio4') }}</Radio>
                  <Radio :value="5">{{ $t('v.discount.activity.portfolio5') }}</Radio>
                </RadioGroup>
              </FormItem>
            </Row>
            <Row v-for="(item, index) in settingsTy_1.roll_config" :key="index">
              <Col :span="12">
                <FormItem
                  :label="`${$t('v.discount.activity.roll_config')}${index + 1}`"
                  name="withdrawPrice"
                  :colon="false"
                >
                  <InputGroup compact style="display: flex; margin-bottom: 20px" class="mb-5">
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
                      :placeholder="`${$t('common.inputText')}`"
                    />
                  </InputGroup>

                  <InputGroup compact style="display: flex" v-if="settingsTy_1['pay'] == 1">
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
                      :placeholder="`${$t('v.discount.activity.pay_condition')}`"
                    />
                  </InputGroup>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem
                  :label="$t('v.discount.activity.roll_times')"
                  :colon="false"
                  name="roll_times"
                >
                  <InputNumber
                    min="1"
                    type="text"
                    :size="FORM_SIZE"
                    :placeholder="`${$t('v.discount.activity.roll_times_p')}`"
                    :precision="0"
                    :stringMode="true"
                    v-model:value="item['roll_times']"
                  />
                </FormItem>
                <div
                  name="pay_date_type"
                  :colon="false"
                  v-if="settingsTy_1['pay'] == 1"
                  class="flex"
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
                  <Select v-model:value="item['pay_date_type']" :size="FORM_SIZE" :listHeight="500">
                    <SelectOption :value="1">
                      {{ $t('v.discount.activity.pay_date_type_1') }}
                    </SelectOption>
                    <SelectOption :value="2">
                      {{ $t('v.discount.activity.pay_date_type_2') }}
                    </SelectOption>
                  </Select>
                </div>
              </Col>
            </Row>
          </Form>
        </template>
        <template #Validmember>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.configuration_memeber_config') }}</h1>
            <BasicHelp
              placement="top"
              class="mx-1"
              :text="$t('v.discount.activity.configuration_memeber_tip')"
            />
          </div>
        </template>
        <template #basicPromotion>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.configuration_promotion') }}</h1>
          </div>
        </template>
        <template #btnConfig>
          <div class="display-flex">
            <div class="w-2 h-4 bg-blue-500 mt-1 mr-2"></div>
            <h1>{{ $t('v.discount.activity.configuration_btn') }}</h1>
          </div>
        </template>
        <template #CurrencyConfig="{ model, field }">
          <!-- <LangRadioGroup class="!-mt-1" :contentList="currenyLang" @update:click="changeHandleCurry"
            v-model="model[field]" /> -->
          <!-- 切换币种 -->
          <CurryRadioGroup
            ref="currencyRadioRef"
            :defaultTy="defaultTy"
            :contentList="currenyLang"
            @update:click="changeHandleCurry"
            v-model="model[field]"
            v-model:currencyId="currentCurryId"
          />
        </template>
        <template #Statisticslimit>
          <div>
            <span class="text-2xl font-bold ml-10">{{ $t('v.discount.activity.Head_limit') }}</span>
            <BasicHelp
              placement="top"
              class="mx-1"
              :text="'<p>' + $t('v.discount.activity.Maximum_statistics') + '</p>'"
            />
          </div>
        </template>
        <template #settings="{ model, field }">
          <div class="ml-10">
            <Row v-for="(item, index) in settingsTy_2">
              <Col :span="8">
                <FormItem :key="index">
                  <label v-if="index == 0"
                    >{{ $t('v.discount.activity.Effective_outreach') }}(≥)：</label
                  >
                  <div v-if="index == 0" class="mb-2"></div>
                  <InputNumber
                    :placeholder="$t('v.discount.activity.Personal_Player')"
                    :size="FORM_SIZE"
                    v-model:value="item.ppl"
                    :min="0"
                    :precision="0"
                    :disabled="model['id'] && model['ty2']"
                  />
                </FormItem>
              </Col>
              <Col :span="8" offset="1">
                <FormItem>
                  <label v-if="index == 0">{{ $t('v.discount.activity.amount_bonus') }} :</label>
                  <div v-if="index == 0" class="mb-2"></div>
                  <InputNumber
                    :placeholder="$t('v.discount.activity.amount_bonus')"
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
              <Col :span="4" :class="{ 'pt-5': index == 0 }">
                <div v-if="index == 0" class="mb-2"></div>
                <Button
                  v-if="index === 0"
                  class="m-l-5"
                  preIcon="material-symbols:add"
                  type="primary"
                  :size="FORM_SIZE"
                  @click="addRateConfigty_2"
                  :disabled="model['id'] && model['ty2']"
                />
                <Button
                  v-if="index > 0"
                  class="m-l-5"
                  type="primary"
                  danger
                  preIcon="ant-design:close-outlined"
                  :size="FORM_SIZE"
                  @click="removeRateConfigty_2(item)"
                  :disabled="model['id'] && model['ty2']"
                />
              </Col>
            </Row>
          </div>
        </template>

        <template #phoneLanguage>
          <LangRadioGroup :contentList="contentList" @click:radio="handlePhoneDetail" />
        </template>
        <template #phoneConfig>
          <phoneUpload :phonelang="phonelang" :activityid="getDeatilId" />
        </template>
        <template #negativeProfit>
          <div>
            <Row class="mb-3">
              <Col :span="3">
                <p class="text-center">{{ $t('v.discount.activity.bonus_rate_level') }}</p>
              </Col>
              <Col :span="8" class="ml-2">
                <label>
                  {{ $t('table.promotion.promotion_affect_bet') }}(≥)<CdIconCurrency
                    :icon="currentyOption[currentCurryId]"
                    style="width: 20px; margin-left: 4px"
                /></label>
              </Col>
              <Col :span="8" class="ml-5">
                <Tooltip placement="topLeft" :title="$t('v.discount.activity.bonus_tishi')">
                  <Icon icon="tabler:bulb" />
                </Tooltip>
                <label> {{ $t('v.discount.activity.bonus_back_rate') }}(%)</label>
              </Col>
            </Row>
            <Row v-for="(item, index) in settingsTy_4" :key="index" class="ml-16">
              <Col :span="2">
                <p class="pt-2">{{ index + 1 }}</p>
              </Col>
              <Col :span="8">
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
                      <CdIconCurrency :icon="currentyOption[currentCurryId]" style="width: 20px" />
                    </template>
                  </InputNumber>
                </FormItem>
              </Col>
              <Col :span="8" offset="1">
                <FormItem>
                  <InputNumber
                    :size="FORM_SIZE"
                    :placeholder="$t('v.discount.activity.bonus_back_rate')"
                    :min="1"
                    addon-after="%"
                    v-model:value="item.bonus_rate"
                    stringMode
                  />
                </FormItem>
              </Col>
              <Col :span="4">
                <Button
                  v-if="index == 0"
                  class="m-l-5 mt-0"
                  :size="FORM_SIZE"
                  preIcon="material-symbols:add"
                  type="primary"
                  @click="addRateConfigty_4"
                />
                <Button
                  v-if="index > 0"
                  :size="FORM_SIZE"
                  class="m-l-5"
                  preIcon="material-symbols:remove"
                  @click="removeRateConfigty_4(item)"
                />
              </Col>
            </Row>
          </div>
        </template>
        <!-- 配置模版，红包配置 -->
        <template #configTemSlot="{ model, field }">
          <LangRadioGroup
            class="!-mt-2"
            :selecIndex="defaultTemp"
            :contentList="tempList"
            @update:click="changeTemp"
            :disabledType="disabledType"
            v-model="model[field]"
          />
        </template>
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
          />
          <!-- <newDollarWaves
            ref="newRefRedEmvelope"
            v-model="currentCurryId"
            v-model:firstCurrencyId="firstCurrencyId"
            @update:model-value="handleChangeCurryId"
            v-if="defaultTemp == 1"
          /> -->
          <dollarWaves ref="refRedEmvelope" v-if="defaultTemp == 2" />
        </template>
        <template #shortcutSlot="{ model, field }">
          <FormItem>
            <Switch
              @change="changeSwitch"
              :checkedValue="1"
              :unCheckedValue="2"
              v-model:checked="switchState"
            />
          </FormItem>
          <FormItem v-if="switchState === 1" :label="t('common.show_terminal')">
            <CheckboxGroup
              v-model:value="clientType"
              :defaultValue="[1, 2]"
              :options="[
                { label: 'WEB', value: 1 },
                { label: 'APP', value: 2 },
              ]"
            />
          </FormItem>
          <div class="upload-cur" v-if="switchState === 1">
            <FormItem :label="t('v.discount.activity.display_type')">
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
                <div class="w-102px h-102px image-container">
                  <img
                    v-if="imageUrl"
                    class="w-full h-full"
                    :src="getDataTypePreviewUrl(imageUrl)"
                    alt=""
                  />
                  <div v-if="imageUrl" class="overlay flex justify-center items-center">
                    <delete-outlined
                      @click.stop="deletePic"
                      :style="{
                        fontSize: '20px',
                        color: '#fff',
                      }"
                    />
                  </div>
                  <!-- 添加的蒙层 -->
                  <div class="mt-5" v-else>
                    <plus-outlined />
                    <div class="ant-upload-text">{{
                      t('table.discountActivity.discount_upload_pic')
                    }}</div>
                    <div class="ant-upload-text">200*200</div>
                  </div>
                </div>
              </Upload>
            </FormItem>
            <div class="mt-2">
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1721639652275.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1721639652275.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1721390851440.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1721390851440.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1713619203542.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1713619203542.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1713619282436.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1713619282436.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1713619473060.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1713619473060.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1721390772259.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1721390772259.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1721476841777.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1721476841777.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1722586675428.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1722586675428.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1724845099997.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1724845099997.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1724915991254.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1724915991254.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1725084727543.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1725084727543.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1725084609735.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1725084609735.webp')"
              />
              <!-- <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1726675990861.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1726675990861.webp')"
              /> -->
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1729684092585.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1729684092585.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1729785869294.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1729785869294.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1729785982357.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1729785982357.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1732531037386.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1732531037386.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1732531075711.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1732531075711.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1732531150555.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1732531150555.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1732531206763.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1732531206763.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1732531263480.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1732531263480.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1734086798046.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1734086798046.webp')"
              />
              <img
                class="w-50px h-50px cursor-pointer"
                @click="hangimg('/promos/zh_CN/1734104626929.webp')"
                :src="getDataTypePreviewUrl('/promos/zh_CN/1734104626929.webp')"
              />
            </div>
            <div>{{ t('common.upload_pic_info') }}</div>
          </div>
        </template>
        <template #applyLimit="{ model, field }">
          <Row>
            <Col :span="15">
              <FormItem disabled>
                <RadioGroup v-model:value="model[field]" :disabled="model['id']">
                  <Radio :value="1">{{ $t('v.discount.activity.customize_one') }}</Radio>
                  <Radio :value="2">{{ $t('v.discount.activity.customize_two') }}</Radio>
                  <Radio :value="3">{{ $t('v.discount.activity.customize_three') }}</Radio>
                  <Radio :value="0">{{ $t('table.discountActivity.discount_no_limit') }}</Radio>
                  <Radio :value="5">{{ $t('v.discount.activity.customize') }}</Radio>
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
                  :placeholder="$t('v.discount.activity.please_enter')"
                  :disabled="model['id']"
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <template #period="{ model, field }">
          <Row>
            <Col :span="15">
              <FormItem>
                <RadioGroup
                  v-model:value="model[field]"
                  @change="periodChange"
                  :disabled="model['id']"
                >
                  <!-- <Radio :value="86400">1天</Radio> -->
                  <Radio :value="259200">{{ $t('v.discount.activity.three_day') }}</Radio>
                  <Radio :value="604800">{{ $t('v.discount.activity.serven_day') }}</Radio>
                  <Radio :value="0">{{ $t('table.discountActivity.discount_no_limit') }}</Radio>
                  <Radio :value="5">{{ $t('v.discount.activity.customize') }}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col :span="8" v-if="model[field] === 5">
              <FormItem :required="true" :label="t('common.days')">
                <InputNumber
                  min="0"
                  max="999"
                  :precision="0"
                  :size="FORM_SIZE"
                  v-model:value="periodModel"
                  :placeholder="t('common.input_set_days')"
                  :disabled="model['id']"
                  @change="changTextData(1, 5)"
                />
              </FormItem>
            </Col>
          </Row>
        </template>
        <template #perioBilling="{ model, field }">
          <Row>
            <Col :span="15">
              <!-- {{model}} -->
              <FormItem>
                <RadioGroup
                  v-model:value="model[field]"
                  :disabled="model['id']"
                  @change="periodChange"
                >
                  <Radio :value="1">{{ $t('v.discount.activity.everyday') }}</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
          </Row>
        </template>
        <template #apply_period="{ model, field }">
          <Row>
            <Col :span="16">
              <div class="flex">
                <FormItem :label="$t('v.discount.activity.apply_period')">
                  <InputNumber
                    min="1"
                    max="999"
                    :precision="0"
                    v-model:value="model[field]"
                    :placeholder="$t('v.discount.activity.apply_period_p')"
                    :size="'large'"
                    :disabled="model['id']"
                    @change="changeapply"
                  />
                </FormItem>
                <div class="ml-2 flex justify-center items-center h-40px"
                  >{{ $t('v.discount.activity.apply_period_p_1') }}
                </div>
              </div>
            </Col>
            <!-- <Col :span="5">
              <div class="flex justify-center items-center h-40px"
                >{{ $t('v.discount.activity.apply_period_p_1') }}
              </div>
            </Col> -->
          </Row>
        </template>
        <template #uploadText>
          <FormItem required v-if="currentLang">
            <LangRadioGroup
              class="!m-b-5 !-mt-1"
              :contentList="contentList"
              @click:radio="handlelanguageLevelText"
            />
            <Textarea :rows="12" :width="800" v-model:value="currentLang.textContent" disabled />
            <!-- <Tinymce v-model="currentLangText.transitionValue" :showImageUpload="false" @change="handleTinymceChange"
              @blur="handleTinymceBlur" /> -->
          </FormItem>
        </template>
        <template #uploadTextRule>
          <FormItem required>
            <LangRadioGroup
              class="!m-b-5 !-mt-1"
              :contentList="contentList"
              :showTranslation="true"
              @click:radio="handlelanguageLevelText"
              @click:translation="handleClickTranslation"
            />
            <Tinymce
              v-model="currentLangText.transitionValue"
              :showImageUpload="true"
              @change="handleTinymceChange"
            />
          </FormItem>
        </template>
        <template #buttonTextSlot="{ model, field }">
          <Row>
            <Col :span="17">
              <FormItem>
                <!-- <Input :size="FORM_SIZE" placeholder="请输入按钮文字" @blur="onBlurInput(model[field])"
                v-model:value="model[field]" /> -->
                <Input
                  :size="FORM_SIZE"
                  :placeholder="$t('v.discount.activity.btnText')"
                  v-model:value="btnText"
                  @change="changInput('LEFT')"
                  @blur="handleTinymceBlurBtn"
                  style="height: 40px"
                />
              </FormItem>
            </Col>
            <Col :span="7">
              <Button type="primary" :size="FORM_SIZE" class="m-l-5" @click="handleMoreLagarage">{{
                $t('v.discount.activity.more_language')
              }}</Button>
            </Col>
          </Row>
        </template>
        <template #activeContent="{ model, field }">
          <RadioGroup v-model:value="model[field]" @change="handleChangePopContent">
            <Radio :value="1">{{ $t('common.text') }}</Radio>
            <Radio :value="2">{{ $t('common.pic') }}</Radio>
          </RadioGroup>
        </template>
        <template #payConfig="{ model, field }">
          <Form ref="formRef" :model="settingsTy_1" :label-col="{ style: { width: '120px' } }">
            <Row>
              <Col :span="8">
                <FormItem :label="$t('v.discount.activity.payConfig')" name="pay" :colon="false">
                  <RadioGroup v-model:value="settingsTy_1['pay']" @change="handleChangePayConfig">
                    <Radio :value="2">{{ $t('v.discount.activity.payConfig2') }}</Radio>
                    <Radio :value="1">{{ $t('v.discount.activity.payConfig1') }}</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem
                  :label="$t('v.discount.activity.Roulette1ti')"
                  name="withdraw_amount"
                  :colon="false"
                >
                  <InputNumber
                    min="0"
                    type="text"
                    :size="FORM_SIZE"
                    :placeholder="$t('v.discount.activity.Roulette1_p')"
                    stringMode
                    v-model:value="settingsTy_1['withdraw_amount']"
                    @change="changTextData(1)"
                  />
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem
                  :label="$t('v.discount.activity.Roulette2')"
                  name="limit_amount"
                  :colon="false"
                >
                  <InputNumber
                    min="0"
                    type="text"
                    :size="FORM_SIZE"
                    :placeholder="$t('v.discount.activity.Roulette2_p')"
                    stringMode
                    v-model:value="settingsTy_1['limit_amount']"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :span="8">
                <FormItem
                  :label="$t('v.discount.activity.Roulette3')"
                  name="first_roll_min_amount"
                  :colon="false"
                >
                  <InputNumber
                    min="0"
                    type="text"
                    :size="FORM_SIZE"
                    :placeholder="$t('v.discount.activity.Minimum_prize')"
                    stringMode
                    v-model:value="settingsTy_1['first_roll_min_amount']"
                  />
                </FormItem>
              </Col>
              <Col :span="1" class="!text-center mt-2"> ～ </Col>
              <Col :span="7">
                <InputNumber
                  min="0"
                  type="text"
                  :size="FORM_SIZE"
                  stringMode
                  :placeholder="$t('v.discount.activity.max_prize')"
                  v-model:value="settingsTy_1['first_roll_max_amount']"
                />
              </Col>
              <Col :span="8">
                <FormItem
                  :label="$t('v.discount.activity.Roulette4')"
                  name="daily_roll_times"
                  :colon="false"
                >
                  <InputNumber
                    min="0"
                    type="text"
                    :size="FORM_SIZE"
                    :placeholder="$t('v.discount.activity.Roulette4_p')"
                    v-model:value="settingsTy_1['daily_roll_times']"
                    @change="changTextData(1)"
                  />
                </FormItem>
              </Col>
              <Col :span="8">
                <FormItem
                  :label="$t('v.discount.activity.Roulette5')"
                  name="rules_roll_times"
                  :colon="false"
                >
                  <InputNumber
                    min="0"
                    type="text"
                    :size="FORM_SIZE"
                    :placeholder="$t('v.discount.activity.Roulette5_p')"
                    v-model:value="settingsTy_1['rules_roll_times']"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </template>
        <template #uploadImage="{ model }">
          <FormItemRest>
            <LangRadioGroup :contentList="contentList" @click:radio="handleClickContent" />
            <div class="m-t-5 w-520px h-291px">
              <BaseUploadDragger
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
                :url="currentLang?.image_url"
                :apiMap="apiMap"
                :file-list="currentLang?.fileList"
                :accept="'image/webp,image/png,image/jpeg'"
                @change="handleChangeUpload"
                @remove="handleRemoveUpload"
              />
            </div>
          </FormItemRest>
        </template>
        <template #previewText>
          <div class="w-full h-400px h-1 border border-gray-300 bg p-2 overflow-y-scroll">
            <div class="tg-rich-area" v-html="currentLang?.transitionValue"></div>
          </div>
        </template>
      </BasicForm>
    </div>
    <buttonTextModal @emits-values="emitsValues" @register="textModal" />
    <template #rightFooter>
      <a-button type="primary" :size="FORM_SIZE" @click="submitOk">
        {{ $t('common.saveText') }}
      </a-button>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import {
    ref,
    onMounted,
    reactive,
    watch,
    computed,
    watchEffect,
    onBeforeMount,
    onUnmounted,
    nextTick,
    toRefs,
    h,
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
    ProcessLeftData,
    portfolioConfig,
    dayObj,
    getTypeObj,
    rewardTextObj,
    unitObj,
    cycleModeObj,
    getTypeObj2,
    get_text_ty7,
    firstChargeObj,
    get_text_ty9,
    currencyList14,
    get_text_ty14,
  } from './index.data';
  import { BaseUploadDragger } from '/@/components/BaseUploadDragger';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import dollarWaves from './components/dollarWaves/index.vue';
  import redLope from './components/redLope/index.vue';
  import everydayBet from './components/everydayBet/index.vue';
  import luckyBet from './components/luckyBet/index.vue';
  import checkIn from './components/check_in/index.vue';
  import wallet from './components/wallet/index.vue';
  import memberDay from './components/memberDay/index.vue';
  import phoneUpload from './components/sg-upload.vue';
  import {
    updatePromoActive,
    insertPromoActive,
    uploadPromoImage,
    getPromoDetail,
  } from '/@/api/activity';
  import {
    convertSecondsToDays,
    formatDateTime,
    getDayOfWeek,
    getTimestampFromDate,
    toTimezone,
  } from '/@/utils/dateUtil';
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

  import {
    RadioGroup,
    Input,
    FormItem,
    Row,
    Col,
    FormItemRest,
    Switch,
    Upload,
    //Button,
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
  } from 'ant-design-vue';
  import { periodList, periodListBilling } from '../../common/setting';
  import { useModal } from '/@/components/Modal';
  import { BasicHelp } from '/@/components/Basic';
  import { useLocale } from '/@/locales/useLocale';
  import dayjs from 'dayjs';
  import { currentyOptions } from '/@/settings/commonSetting';
  import eventBus from '/@/utils/eventBus';
  import abRoundButtonGroup from '/@/components/abRoundButtonGroup/ab-round-button-group.vue';
  import { useGameSortStore } from '/@/store/modules/gameSort';
  import CdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import RewardForm from './components/chargeDetail/index.vue';
  import AgentDaysForm from './components/agentDaysDetail/index.vue';
  import AgentMonthsForm from './components/agentMonthsDetail/index.vue';
  import { useActiveMainOptions, useActiveOptions } from '/@/views/common/commonSetting';
  import { LangItem } from '/@/views/system/informationCenter/common/setting';
  const { activeOptions } = useActiveOptions();
  const { activityMainMap } = useActiveMainOptions();

  const { t } = useI18n();

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

  const clientList = ref([]);
  const XYtableData = ref();
  const tabValue = ref<string>('1');
  const platform_ids = ref([]);
  const systemCurrency = ref('');
  const rewardFormValidate = ref<rewardFormElement | null>(null);
  const agentDaysFormValidate = ref<rewardFormElement | null>(null);
  const mysteryFormValidate = ref<rewardFormElement | null>(null);
  const agentMonthsFormValidate = ref<rewardFormElement | null>(null);
  const agentDaysMinAndMax = ref<any>({});
  const agentMonthsMinAndMax = ref<any>({});

  const everyDayBetActiveText = reactive({
    day: dayObj[1],
    rewardText: rewardTextObj[1],
    getType: getTypeObj[1],
    money: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
    },
    multipleCount: 0,
    memberDayaward: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
    },
    memberRecharge: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
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
    },
    rechargeBet: {
      zh_CN: 0,
      pt_BR: 0,
      vi_VN: 0,
      th_TH: 0,
      hi_IN: 0,
      en_US: 0,
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
  const everydayBetRef = ref(null);
  const memberDayRef = ref(null);
  const rechargeDayRef = ref(null);

  const timezone = ref('Asia/Shanghai');

  const venueList: any = ref([
    {
      label: t('common.slot'),
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
          name: item.platform_name,
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

  // const current_platform_ids: any = ref([]);
  const platform_range: any = ref(1);

  const current_game: any = computed(() => {
    let list = venueList.value.filter((item) => item.value == tabValue.value)[0].list;
    return list;
  });

  const timeDisable = ref(false);

  const timedIdisable: any = computed(() => {
    if (timeDisable.value) return false;
    return dayjs().isAfter(startTime.value.start_at) && !!getDeatilId.value;
  });

  const current_platform_ids: any = computed(() => {
    let list =
      (venueList.value.filter((item) => item.value == tabValue.value)[0]?.allVen &&
        venueList.value
          .filter((item) => item.value == tabValue.value)[0]
          [Venue_statistics.value].map((el) => {
            return el.value;
          })) ||
      [];
    return list;
  });

  eventBus.on('change_Venue_statistics', (v: any) => {
    if (v !== 'getself') platform_range.value = v;
    platform_range.value == 1
      ? (Venue_statistics.value = 'allVen')
      : (Venue_statistics.value = 'appointVen');
    if (defaultTy.value == 7) changTextData(7);
  });
  const incentiveConfig = ref(1);
  eventBus.on('incentiveConfig', (v: any) => {
    if (v !== 'getself') incentiveConfig.value = v;
  });
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
    }, 111);
  };

  onUnmounted(() => {
    eventBus.off('change_Venue_statistics');
    eventBus.off('formChange_m');
  });

  const currentlanguageIndex = ref(0);

  const siteName = ref();
  const newRefRedEmvelope = ref(null);
  const currentyOption = currentyOptions;
  const temporaryStorage = ref();
  const currencyRadioRef = ref(null);
  const rewardMethodsSelected = ref<number>(1);
  const agentRewardMethodsSelected = ref<number>(1);

  const ActivityList: any = activityMainMap;
  const ActivityOptions: any = ref(ActivityList[1]);

  const typeDataList = ref(activeOptions);

  const tempList = ref([
    { label: t('common.translate.word16'), value: 1 },
    // { label: t('模板1'), value: 2 },
  ]);
  const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));
  const currencyListTranslate = {
    '701': 'zh_CN',
    '702': 'pt_BR',
    '704': 'vi_VN',
    '705': 'th_TH',
    '703': 'hi_IN',
    '706': 'en_US',
  };
  const ty2_config = {
    first_deposit_amount: null,
    total_deposit_amount: null,
    total_bet_amount: null,
    total_deposit_days: null,
    total_deposit_times: null,
    pplBonus: [{ ppl: null, bonus: '' }],
  };

  const ty4_config = {
    prize_limit: '',
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
  let currencyList = ref([
    {
      label: 'CNY',
      value: '701',
      lang: 'zh_CN',
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    },
    {
      label: 'BRL',
      value: '702',
      lang: 'pt_BR',
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    },
    {
      label: 'KVND',
      value: '704',
      lang: 'vi_VN',
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    },

    {
      label: 'THB',
      value: '705',
      lang: 'th_TH',
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    },

    {
      label: 'INR',
      value: '703',
      lang: 'hi_IN',
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    },

    {
      label: 'USDT',
      value: '706',
      lang: 'en_US',
      ty2_config: cloneDeep(ty2_config),
      ty4_config: cloneDeep(ty4_config),
      ty1_config: cloneDeep(ty1_config),
      ty3_config: cloneDeep(ty3_config),
    },
  ]);

  const langChineses = {
    en_US: '英文',
    pt_BR: '葡萄牙语',
    th_TH: '泰语',
    vi_VN: '越南文',
    zh_CN: '中文',
    hi_IN: '印度语',
  };
  const defaultTy = ref(1);
  const defaultTyMain: any = ref(1);

  // 1代表新模板
  const defaultTemp = ref(1);

  const setTxtcontent = ref({
    multiple: 0, //
    dailyCollectionLimit: 0, //
    period: defaultTy.value == 1 ? 259200 : 604800,
    apply_period: 0,
  });

  const RawData = [];

  const currenyLang = ref(activityTy.value == 14 ? currencyList14 : currencyList.value);

  const XYcurrentCurryId = ref('702' as string);
  const currentCurryId = ref('701' as string);

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

  const settingsTy_1 = computed(() => {
    const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value);
    if (itmeConfig.length > 0) {
      return itmeConfig[0].ty1_config;
    }
    return currencyList.value[0]['ty1_config'];
  });

  const startTime = ref({
    start_at: null,
    end_at: null,
  });

  const showTime = ref({
    display_start_at: null,
    display_end_at: null,
  });

  const fixedTime = ref({
    fixed_start_at: null,
    fixed_end_at: null,
  });

  const switchState = ref(2 as any);
  const $router = useRouter();
  const Lucky_betSlot = ref(null);
  const checkIn_slot: any = ref(null);
  const wallet_slot: any = ref(null);
  const imageUrl = ref('' as any);
  const clientType = ref([1, 2] as any);
  const currentLangIndex = ref(0 as any);
  const userStore = useUserStore();
  const token = userStore.getToken;
  const getFileList = ref([] as any);
  const currentPopStyle = ref(3); // 弹窗样式
  const tinymceIsChange = ref(false as any);
  const commonMapping = {
    1: [24],
    2: [25, 26, 27],
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

  const formState = ref({
    withdrawPrice: null,
    firstMinPrice: null,
    firstMaxPrice: null,
    anyLogin: null,
    rollConfigValidateForm: [{ rate: '', roll_min_amount: '', roll_max_amount: '' }],
    inviteValidateForm: [{ rate: '', roll_min_amount: '', roll_max_amount: '' }],
    additionalValidateForm: [
      {
        valid_member_num: null,
        multiple: null,
        lose_rate: '',
        prize_rate: '',
        total_roll: null,
      },
    ],
    profit_prize_config: [
      {
        level: '1',
        valid_bet_amount: '',
        bonus_rate: '',
      },
    ],
  } as any);

  const getStateId = ref(null as any);
  const validMemberNum = ref(null as any);
  const getDeatilId = ref('' as any);
  const applyLimit = ref(null as any);
  const periodModel = ref(null as any);
  const translateBottonText = ref([] as any);
  const formRef = ref<FormInstance>();
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

  const rules: Record<string, Rule[]> = {
    withdrawPrice: [{ required: true, message: '请输入提款奖金上限', trigger: 'change' }],
    firstMinPrice: [{ required: true, message: '请输入首次奖金最低金额', trigger: 'change' }],
    firstMaxPrice: [{ required: true, message: '请输入首次奖金最大金额', trigger: 'change' }],
    anyLogin: [{ required: true, message: '请输入每天登录次数', trigger: 'change' }],
  };

  let openLangOptions = [];

  const btnLange = ref({});
  const btnText = ref(null);

  const zxLange = ref({});
  const zhText = ref(null);

  const currencyName = ref('CNY');
  const get_tableData = ref({ lucky_number_config: [{ t: 0 }] });
  const get_leftValues: any = ref({
    automatic: 2,
    multiple: 0,
  });
  const ruleData: any = ref({});
  const highestNum: any = ref(0);
  const setRuleData = (lang) => {
    let bonus_base = get_tableData.value[lang].bonus_base;
    bonus_base.selectList = bonus_base?.reduce((acc, current) => acc.concat(current.day), []);
    ruleData.value[lang].day = '$$variable2$$';
    // ruleData.value[lang].day = bonus_base.selectList?.length;
    ruleData.value[lang].highestNum = '$$variable1$$';
  };
  const get_tabelConfig = () => {
    if (defaultTy.value == 7 && Lucky_betSlot.value) {
      get_tableData.value = Lucky_betSlot.value?.conditionData['pt_BR'];
      if (get_tableData.value?.lucky_number_config) {
        let list = get_tableData.value.lucky_number_config;
        const data = Math.max(...list.map((obj) => obj.t));
        highestNum.value = data;
      }
    } else if (defaultTy.value == 9 && checkIn_slot.value) {
      get_tableData.value = checkIn_slot.value?.conditionData;
      ruleData.value = checkIn_slot.value?.conditionData;
      currencyName.value = checkIn_slot.value?.currencyName;
      if (get_tableData.value[currencyListTranslate[currentCurryId.value]].cond) {
        let res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
          const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
          langObj[langToValue[0].value] = setRuleData(lang);
          return langObj;
        }, {});
      }
    } else if (defaultTy.value == 14 && wallet_slot.value) {
      get_tableData.value = wallet_slot.value?.conditionData;
      if (get_tableData.value?.bonus) {
        let list = get_tableData.value.bonus['701'];
        const data = Math.max(...list.map((obj) => obj.c));
        highestNum.value = data;
      }
    }
  };
  eventBus.on('formChange_m', async (v: any) => {
    let data = {};
    nextTick(async () => {
      if (v) {
        get_tabelConfig();
      } else {
        data = await getFieldsValue();
        if (data) get_leftValues.value = data;
      }
      if (defaultTy.value == 7) changTextData(7);
      if (defaultTy.value == 9) changTextData(9);
      if (defaultTy.value == 14) changTextData(14);
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
        language: item.language || '',
        phoneData: '',
        textContent: getTextData(defaultTy.value, item.event)[item.event],
        zxTransitionValue: '',
        btnTransitionValue: '',
      };
    });
  }
  initValidList();
  // 更新值，写在最下方生命周期
  async function updateValidList(btn?) {
    const res = await systemStore.getValidLangList();
    systemCurrency.value = res;
    openLangOptions = [];
    let list = defaultTy.value == 14 ? cnList : localeList;
    langList.value = list
      .filter((lang) => res && res.includes(lang.event))
      .map((item) => {
        openLangOptions.push(item.event);
        if (!btn) {
          btnLange.value[item.event] = null;
          zxLange.value[item.event] = null;
        }
        // const textContent = ref(getTextData(defaultTy.value)[item.event]);
        return {
          label: t('common.common_' + item.event),
          value: item.event,
          transitionValue: '',
          image_url: '',
          language: item.language || '',
          phoneData: '',
          textContent: getTextData(defaultTy.value)[item.event],
          zxTransitionValue: '',
          btnTransitionValue: '',
          // textContent:textContent.value,
        };
      });
    if (Array.isArray(res)) {
      openTerminalState.checkedList =
        defaultTy.value == 15 ? [openLangOptions[0]] : openLangOptions;
    }
    if (typeof res === 'string') {
      openTerminalState.checkedList = [res];
    }
    openTerminalOptions.value = defaultTy.value == 15 ? [langList.value[0]] : langList.value;
  }

  const openTerminalState = reactive({
    indeterminate: false,
    checkAll: true,
    checkedList: openLangOptions,
  });

  const openTerminalOptions = ref(langList.value);

  const syslang = useLocale().getLocale.value;

  const [textModal, { openModal }] = useModal();
  const quickFileList = ref([] as any);

  const contentList = ref<Array<LangItem>>([...langList.value]);

  const contentListDetail = ref<Array<LangItem>>([...extraList, ...langList.value]);

  const currentLang = ref(contentList.value[0]);

  const currentLangText = ref(contentList.value[0]);

  const currentPopIcon = ref(''); // 弹窗图标

  const disabledStartDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const apiMap = reactive({
    uploadApi: uploadPromoImage,
    language: 'zh-CN',
  });

  const FORM_SIZE = useFormSetting().getFormSize;

  const [
    registerFormLeft,
    { validate: leftValue, setFieldsValue: setFieldsValueLeft, getFieldsValue, clearValidate },
  ] = useForm({
    labelWidth: 120,
    baseColProps: {
      span: 24,
    },
    showActionButtonGroup: false,
  });

  const current = computed(() => {
    return userStore.getCurrentSite;
  });

  const siteObj = current.value?.sites.find((el) => el.i === current.value?.id);

  if (siteObj) siteName.value = siteObj['n'] || 'SG';
  else siteName.value = 'SG';

  const handlelanguageLevelText = (value) => {
    currentlanguageIndex.value = value;
    tinymceIsChange.value = false;
    currentLangText.value = contentList.value[currentlanguageIndex.value] || '';
    currentLang.value = contentList.value[currentlanguageIndex.value];
    if (currentLangText.value) {
      apiMap.language = currentLangText.value.value;
    }
    // if (defaultTy.value == 7) changTextData(7);
    if (defaultTy.value === 2) changTextData(2);
    if (defaultTy.value === 12) changTextData(12);
    if (defaultTy.value === 13) changTextData(13);
    if (defaultTy.value === 14) changTextData(14);
    if (defaultTy.value === 15) changTextData(15);
  };

  function changeSwitch() {}

  async function changeHandleActivity(value) {
    ActivityOptions.value = ActivityList[value];
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

  async function changeHandle(value) {
    info_venue();
    defaultTy.value = value;
    defaultTyMain.value = value;
    setFieldsValueLeft({ ty: value });

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
      setTxtcontent.value.period = 604800;
      Initializationty_4();
    }
    if (value === 7) {
      // setTxtcontent.value.period = 604800;
      Initializationty_7();
    }
    if (value === 6) {
      setTxtcontent.value.period = 604800;
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
    if (defaultTy.value === 1) changTextData(1, v.target.value);
    if (defaultTy.value === 4) {
      setTxtcontent.value.period = v.target.value;
      changTextData(4);
    }
    if (defaultTy.value === 7) {
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

  function handleTinymceBlur(e) {
    translateContentList(
      contentList.value,
      currentLang.value['transitionValue'],
      currentLangIndex.value,
      'transitionValue',
    );
  }
  function handleChangeCurryId(v) {}

  function handleTinymceBlurZx(e) {
    const item = contentList.value.find((el) => el.value == syslang);
    if (item?.['zxTransitionValue'] != zhText.value) {
      translateContentList(contentList.value, zhText.value, 0, 'zxTransitionValue');
    }
  }

  function handleTinymceBlurBtn(e) {
    const item = contentList.value.find((el) => el.value == syslang);
    if (item?.['btnTransitionValue'] != btnText.value) {
      translateContentList(contentList.value, btnText.value, 0, 'btnTransitionValue');
    }
  }

  // 切换弹窗内容
  function handleChangePopContent(e) {
    setFieldsValueLeft({ activeContent: e.target.value });
    setTimeout(() => {
      setContentList();
    });
    if (e.target.value == 2) {
      handleClickContent(0, { event: currentLang.value['value'] });
    }
    currentPopStyle.value = 1;
  }

  function handleChangePayConfig(e) {}

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  function validateArray(array) {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (item.valid_bet_amount == null || item.bonus_rate == null || item.bonus_rate >= 100) {
        return false;
      }
    }
    return true;
  }

  async function validateRedBagConditionData(dataList) {
    let hasEmptyField = false;

    openTerminalState.checkedList.forEach((lang) => {
      const langName = currencyList.value.filter((item) => item.lang == lang)[0].label;
      dataList?.[lang].forEach((entry, index) => {
        for (let i = 0; i < entry.conditionTime.length; i++) {
          const { str, end } = entry.conditionTime[i];
          // 检查 str 和 end 是否为空
          if (str == undefined || str === null || str === '') {
            hasEmptyField = true;
            message.error(`${langName}红包条件,第 ${i + 1} 行的 开始时间不能为空`);
          }

          if (end == undefined || end === null || end === '') {
            hasEmptyField = true;
            message.error(`${langName}红包条件,第 ${i + 1} 行的 结束时间不能为空`);
          }

          // 检查 str 和 end 是否相等
          if (str == end) {
            hasEmptyField = true;
            message.error(`${langName}红包条件,第 ${i + 1} 行的 开始时间 和 结束时间 不能相等`);
          }
        }

        if (entry.type == 2) {
          for (let i = 0; i < entry.intervalDeposit.length; i++) {
            const { min, max } = entry.intervalDeposit[i];
            // 检查当前行的 max 是否大于 min
            if (Number(max) <= Number(min)) {
              hasEmptyField = true;
              message.error(
                `${langName}红包条件,梯级门槛计算条件, 第${i + 1}行的 最高 必须大于 最低`,
              );
            }

            // 检查当前行的 min 是否大于前一行的 max
            if (i > 0 && Number(min) <= Number(entry.intervalDeposit[i - 1].max)) {
              hasEmptyField = true;
              message.error(
                `${langName}红包条件,梯级门槛计算条件,第${
                  i + 1
                }行的 最低 必须大于第 ${i} 行的 最高`,
              );
            }
          }
        }
      });
    });

    if (!hasEmptyField) {
      // 如果没有空字段，继续提交操作
      return true;
      // 这里可以进行提交逻辑
    } else {
      return false;
    }
  }

  async function validateEveryDayConditionData(dataList) {
    let hasEmptyField = false;

    openTerminalState.checkedList.forEach((lang) => {
      dataList?.[lang].forEach((entry, index) => {
        // if (!entry.conditionType) {
        //   hasEmptyField = true;
        //   message.error(`请选择奖励条件`);
        // }
        if (!entry.miniDeposit || !entry.everyReward) {
          hasEmptyField = true;
          const langName = currencyList.value.filter((item) => item.lang == lang)[0].label;
          // 使用 message 提示
          message.error(`${langName}条件下有未填项`);
        }
      });
    });

    if (!hasEmptyField) {
      // 如果没有空字段，继续提交操作
      return true;
      // 这里可以进行提交逻辑
    } else {
      return false;
    }
  }

  // 定义验证函数
  function validateRows(rows: any): boolean {
    if (!rows) return true;
    for (let i = 0; i < rows.length; i++) {
      // 检查每一行的最大值是否大于最小值
      if (Number(rows[i].chipsRange.max) <= Number(rows[i].chipsRange.min)) {
        message.error(`第 ${i + 1} 行的最大值不大于最小值`);
        return false;
      }

      // 检查第i+1行的最小值是否大于第i行的最大值
      if (
        i < rows.length - 1 &&
        Number(rows[i + 1].chipsRange.min) <= Number(rows[i].chipsRange.max)
      ) {
        message.error(`红包条件要求范围第 ${i + 2} 行的最小值要大于第 ${i + 1} 行的最大值`);
        return false;
      }
    }
    return true;
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
      message.error(`配置活动名称多语言`);
      return false;
    }

    if (leftValues.ty == 1) {
      const invalidConfigs = [];
      for (const item of currenyLang.value) {
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
        message.error(`请完善${invalidConfigs[0].label}轮盘配置`);
        return false;
      }
    }

    if (leftValues.ty == 1) {
      const invalidConfigs = [];
      for (const item of currenyLang.value) {
        if (Number(item.ty1_config.withdraw_amount) < Number(item.ty1_config.limit_amount)) {
          invalidConfigs.push(item);
          continue;
        }
      }

      if (invalidConfigs.length > 0) {
        message.error(`${invalidConfigs[0].label}实际领取奖金不能大于提款所需奖金`);
        return false;
      }
    }

    let allEmptyItem = contentList.value.find(
      (item) => item.value != 'original' && item['image_url'] == '',
    );
    if (allEmptyItem && !allEmptyItem.image_url) {
      message.error(`请上传${allEmptyItem.label}图片`);
      return false;
    }
    return true;
  }

  function convertToCurrencyListTranslate(translate, translate2) {
    const result = {};

    for (const key in translate) {
      const languageCode = translate[key];
      if (translate2.hasOwnProperty(languageCode)) {
        result[key] = translate2[languageCode];
      }
    }

    return result;
  }
  /** 活动提交开始 */
  async function submitOk() {
    const leftValues = await leftValue();
    // const rightValues = await rightValue();
    // 先注释校验
    const isValid = await validateBeforeSubmit(leftValues);
    if (!isValid) {
      return false;
    }
    btnloading.value = true;
    //判断是那个活动类型
    let config: any = {};
    let ruleAmount: any = {};
    let transformTableData: any = () => {};
    if (leftValues.ty === 1) {
      function isEveryElementNull(arr) {
        return arr.every((item) => {
          for (let key in item) {
            if (item[key] !== null) {
              return false; // 如果有任何属性值不为 null，返回 false
            }
          }
          return true; // 所有属性值均为 null
        });
      }
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
    } else if (leftValues.ty === 2) {
      config = {
        cur: {},
      };
      currenyLang.value.forEach((item) => {
        const { value, ty2_config } = item;
        config['bonus_tpl'] = String(leftValues.bonus_tpl);
        config['show_amount'] = String(leftValues.show_amount);
        config['bonus_type'] = String(leftValues.bonus_type);
        (config['condition_type'] = String(leftValues.condition_type)),
          (config.cur[value] = {
            settings: ty2_config.pplBonus,
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
        const newRedValidor = await newRefRedEmvelope.value?.valide(openTerminalState.checkedList);
        if (!newRedValidor) return;
        // 模板提交逻辑
        const tableData = newRefRedEmvelope.value?.conditionData;
        const conditionVerify = await validateRedBagConditionData(tableData);
        if (!conditionVerify) return;
        // eslint-disable-next-line no-inner-declarations
        function generateLangCond(lang: string) {
          return tableData[lang].map((item) => {
            return {
              cycle:
                item?.conditionTime.map((itemTime) => [
                  itemTime?.str ? Number(itemTime?.str?.split(':')[0] || 0) : 0,
                  itemTime?.end ? Number(itemTime?.end?.split(':')[0] || 0) : 0,
                ]) || [], // 开始-结束时间 [{str:'',end:''}]
              calc1: {
                type: Number(item.conditionType),
                value: item.miniDeposit || '0',
                scale: item.chipsMultiple != null ? String(item.chipsMultiple) : '0',
              },
              calc2: {
                type: Number(item.conditionType),
                value: item?.intervalDeposit.map((el, index) => [
                  el.min ? el.min.toString() : '0',
                  el.max ? el.max.toString() : '0',
                  item?.chipsMultiples[index].chipsMultiple
                    ? (item?.chipsMultiples[index].chipsMultiple).toString()
                    : '0',
                ]),
              },
              join: {
                type: Number(item.conPartType),
                value: item.miniPartDeposit || '0',
              },
              // scale: String(item.chipsMultiple) || '0', // 红包比列
              // type: Number(item.type), // 奖金类型 '1' 固定门槛 '2' 梯级门槛
              // interval: item?.intervalDeposit, // 当奖金类型为2的时候 是数组[{min:'',max:''}] 计算条件
            };
          });
        }
        // 生成cond参数
        const res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
          langObj[lang] = {
            config: {
              claimLimit: newRefRedEmvelope.value?.dailyCollectionLimit[lang],
              countdown: Number(newRefRedEmvelope.value?.redBagCountDown[lang]),
            },
            cond: { ...generateLangCond(lang)[0] },
            drop: dropStyle.value,
            type: Number(tableData[lang][0].type),
          };
          return langObj;
        }, {});
        config = res;
      }
    } else if (leftValues.ty === 4 || leftValues.ty === 7 || leftValues.ty === 6) {
      config = [];
      platform_ids.value = venueList.value
        .map((item) => item[Venue_statistics.value].map((el) => el.value))
        .flat();
      if (leftValues.ty === 4) {
        config = {
          platform_ids: platform_ids.value,
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
        // 每日奖励
        function transformTableData(lang: string) {
          return tableData[lang].map((item) => {
            return {
              // f: Number(item.conditionType),
              valid: Number(item.miniDeposit),
              bonus: String(item.everyReward),
            };
          });
        }
        const tableData = everydayBetRef.value?.conditionData;
        const valideRes = await validateEveryDayConditionData(tableData);
        if (!valideRes) return;
        const res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
          const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
          langObj[langToValue[0].value] = transformTableData(lang);
          return langObj;
        }, {});
        config = {
          currency: res,
          plat_ids: platform_ids.value,
          all: platform_range.value,
          method: leftValues.rewardMethods,
          period: leftValues.statisticalPeriod,
        };
      }
      if (leftValues.ty === 7) {
        // 幸运赌注
        let obj: any = {
          lucky_bet_prize_config: [],
          lucky_number_config: [],
        };

        let tableData = get_tableData.value;
        let conditionVerify = true;
        tableData.lucky_bet_prize_config.forEach((item, index) => {
          const { m, n } = item;
          if (!!!m || !!!n) {
            message.error(`请填写完整奖励配置信息`);
            conditionVerify = false;
          }
          obj.lucky_bet_prize_config.push({
            level: String(index + 1), //奖金等级
            valid_bet_amount: String(item.m), //有效打码
            receive_count: Number(item.n), //领取次数
          });
        });
        tableData.lucky_number_config.forEach((item, index) => {
          const { c, t, l } = item;
          if (!!!c || !!!t || !!!l) {
            message.error(`请填写完整奖励配置信息`);
            conditionVerify = false;
          }
          obj.lucky_number_config.push({
            lucky_number: item.c, //注单尾号
            bonus_multiple: item.t, //t = 奖励倍数
            limit: item.l, //l = 奖励上限
          });
        });
        if (!conditionVerify) return;
        if (platform_range.value == 2 && platform_ids.value.length < 1) {
          return message.error(`请指定最少一个场馆`);
        }
        config = {
          platform_ids: platform_ids.value,
          platform_range: platform_range.value,
          lucky_bet_cur_config: [
            {
              currency_id: '702',
              ...obj,
            },
          ],
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
      const tableData = get_tableData.value;

      let conditionVerify = true;

      transformTableData = (lang: string, payback?: any) => {
        // tableData[lang].bonus_serial.sort((a, b) => a.day - b.day);
        tableData[lang].bonus_serial.forEach((item, index, arr) => {
          item.index = Number(item.index);
          const { amt, day } = item;
          if (!!!amt || !!!day) {
            // const langName = currencyList.filter((item) => item.lang == lang)[0].label;
            // // 使用 message 提示
            // message.error(`请填写完整${langName}基础配置信息`);

            // conditionVerify = false;
            arr.splice(index, 1);
          }
        });

        // tableData[lang].bonus_base.sort((a, b) => a.day - b.day);
        tableData[lang].bonus_base.forEach((item, index) => {
          item.index = Number(item.index);
          let { amt, day } = item;
          if (!!!amt || !!!day) {
            const langName = currencyList.value.filter((item) => item.lang == lang)[0].label;
            // 使用 message 提示
            message.error(`请填写完整${langName}奖金条件配置信息`);

            conditionVerify = false;
            // throw new Error('请填写完整');
          }
          if (payback === true) {
            item.day = item.day.split(',');
          } else if (payback === 1) {
            if (Array.isArray(item.day)) item.day = item.day.join(',');
          }
        });
        // if (checkIn_slot.value?.keyv2 == 1 && !payback) {
        //   let bet = String(tableData[lang].cond.bet);
        //   let deposit = String(tableData[lang].cond.deposit);
        //   tableData[lang].cond.deposit = bet;
        //   tableData[lang].cond.bet = deposit;
        // } else {
        //   tableData[lang].cond.bet = String(tableData[lang].cond.bet);
        //   tableData[lang].cond.deposit = String(tableData[lang].cond.deposit);
        // }

        return tableData[lang];
      };

      let res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
        const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
        langObj[langToValue[0].value] = transformTableData(lang);
        return langObj;
      }, {});

      if (conditionVerify) {
        res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
          const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
          langObj[langToValue[0].value] = transformTableData(lang, 1);
          return langObj;
        }, {});
      } else {
        return;
      }
      config = {
        ...res,
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
        const validateRes = await validateRewardForm(tableContent, 1, 'agentDays');
        if (!validateRes) return;
        if (leftValues.button == 1 && !leftValues.button_text) return;
        config = {
          bonus: 1,
          period: statisticalPeriod,
          tongue: dealDaysActive(tableContent, 1),
        };
      }
    } else if (leftValues.ty === 11) {
      if (agentMonthsFormValidate.value) {
        const { statisticalPeriod, getTime } = leftValues;
        const validateRewardFormRes: any =
          await agentMonthsFormValidate.value.overallVerification();
        if (!validateRewardFormRes) return;
        const tableContent = agentMonthsFormValidate.value.conditions;
        const validateRes = await validateRewardForm(tableContent, 1, 'agentMonths');
        if (!validateRes) return;
        if (leftValues.button == 1 && !leftValues.button_text) return;
        config = {
          bonus: 1,
          period: statisticalPeriod,
          claim: getTime,
          tongue: dealDaysActive(tableContent, 1),
        };
      }
    } else if (leftValues.ty === 12) {
      function transformTableData(lang: string) {
        return tableData[lang].map((item) => {
          return {
            d: String(item.miniDeposit),
            b: String(item.everyReward),
          };
        });
      }
      const tableData = memberDayRef.value?.conditionData;
      const valideRes = await validateEveryDayConditionData(tableData);
      if (!valideRes) return;
      const res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
        const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
        langObj[langToValue[0].value] = transformTableData(lang);
        return langObj;
      }, {});
      config = res;
      ruleAmount = {
        amount: convertToCurrencyListTranslate(
          currencyListTranslate,
          everyDayBetActiveText?.memberRecharge,
        ),
        award: convertToCurrencyListTranslate(
          currencyListTranslate,
          everyDayBetActiveText?.memberDayaward,
        ),
      };
    } else if (leftValues.ty === 13) {
      function transformTableData(lang: string) {
        return tableData[lang].map((item) => {
          return {
            d: String(item.miniDeposit),
            b: String(item.everyReward),
          };
        });
      }
      config = {
        fixed_start_at: fixedTime.value.fixed_start_at,
        fixed_end_at: fixedTime.value.fixed_end_at,
        bet: leftValues.bet, // 投注倍数
        recharge: {},
      };
      const tableData = rechargeDayRef.value?.conditionData;
      const valideRes = await validateEveryDayConditionData(tableData);
      if (!valideRes) return;
      const res = openTerminalState.checkedList.reduce<any>((langObj, lang) => {
        const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
        langObj[langToValue[0].value] = transformTableData(lang);
        return langObj;
      }, {});
      config.recharge = res;
    } else if (leftValues.ty === 15) {
      if (rewardFormValidate.value) {
        const { rewardMethods, statisticalPeriod } = leftValues;
        const validateRewardFormRes: any = await rewardFormValidate.value.overallVerification();
        if (!validateRewardFormRes) return;
        const tableContent = rewardFormValidate.value.conditions;
        const validateRes = await validateRewardForm(tableContent, rewardMethods, 'charge');
        if (!validateRes) return;
        config = {
          period: statisticalPeriod,
          bonus: rewardMethods,
          tongue: dealActiveEight(tableContent, rewardMethods),
          chargeDynamicText: chargeDynamicText.currentMoney?.['701'] || 0,
        };
      }
    }
    //活动规则
    const content = transform(
      contentList.value,
      function (result, item, key) {
        if (leftValues['ty'] == 5) {
          result[item.value] = item.transitionValue;
        } else {
          if (leftValues['rule_type'] == 2) {
            result[item.value] = item.transitionValue;
          } else {
            // 这里不加问号报错，暂时没有分析什么原因，有时间看下这里？。replace这个，如果有影响就换其他解决办法
            result[item.value] = item.textContent?.replace(
              /CNY|BRL|KVND|THB|INR|USDT/g,
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
              if (item.value == 'zh_CN')
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
        // display_type: leftValues.display_type.toString(),s
        page_content: content,
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
    //按钮翻译
    // onBlurInput(rightValues.button_text);

    // const objectData = translateBottonText.value.reduce((acc, obj) => {
    //   // 获取对象的第一个键
    //   const key = Object.keys(obj)[0];
    //   // 将对象的第一个键和对应的值添加到累加器中
    //   acc[key] = obj[key];
    //   return acc;
    // }, {});

    //活动入口

    const client = leftValues.client_type.flatMap((type) => commonMapping[type] || []);
    const shortcut = clientType.value.flatMap((type) => commonMapping[type] || []);
    // 处理参与对象
    // let groupDetail: any = [];

    // const mapping = {
    //   2: 'uids',
    //   3: 'level_ids',
    //   4: 'vips',
    //   5: 'agent_usernames',
    // };
    // const group = leftValues.group;
    // if (mapping[group]) {
    //   if (group == 2 || group == 5) groupDetail = leftValues[mapping[group]].split(',');
    //   if (group == 3 || group == 4) groupDetail = leftValues[mapping[group]];
    // }
    const { en_US, hi_IN, pt_BR, th_TH, vi_VN, zh_CN } = zxLange.value;
    const data_ = {
      created_uid: '0',
      id: getDeatilId.value ? getDeatilId.value : '0',
      group: 1,
      // category: JSON.stringify(leftValues.category),
      category: JSON.stringify([1, 2]),
      zh_name: leftValues.zh_name, //名称
      // zh_name: JSON.stringify(zxLange.value),
      display_type: leftValues.display_type ? leftValues.display_type.toString() : '',
      // start_at: leftValues.ty != 5 ? formatDateTime(leftValues.startTime.start_at) : 0, //开始时间
      // end_at: leftValues.ty != 5 ? formatDateTime(leftValues.startTime.end_at) : 0, //结束时间
      // display_start_at: formatDateTime(leftValues.showTime.display_start_at), //展示开始时间
      // display_end_at: formatDateTime(leftValues.showTime.display_end_at), //展示结束时间
      start_at_tz:
        leftValues.ty != 5
          ? leftValues.ty == 2 || leftValues.ty == 4
            ? dayjs(leftValues.startTime.start_at).format('YYYY-MM-DD 00:00:00')
            : leftValues.startTime.start_at.format('YYYY-MM-DD 00:00:00')
          : '1970-01-01 00:00:00', //开始时间
      end_at_tz:
        leftValues.ty != 5
          ? leftValues.ty == 2 || leftValues.ty == 4
            ? dayjs(leftValues.startTime.end_at).format('YYYY-MM-DD 00:00:00')
            : leftValues.startTime.end_at.format('YYYY-MM-DD 23:59:59')
          : '1970-01-01 00:00:00', //结束时间
      display_start_at_tz:
        leftValues.ty == 2 || leftValues.ty == 4
          ? dayjs(leftValues.showTime.display_start_at).format('YYYY-MM-DD 00:00:00')
          : leftValues.showTime.display_start_at.format('YYYY-MM-DD 00:00:00'), //展示开始时间
      display_end_at_tz:
        leftValues.ty == 2 || leftValues.ty == 4
          ? dayjs(leftValues.showTime.display_end_at).format('YYYY-MM-DD 00:00:00')
          : leftValues.showTime.display_end_at.format('YYYY-MM-DD 23:59:59'), //展示结束时间

      multiple: leftValues.multiple || '0', //稽核倍数
      recommend: leftValues.recommend, //推荐活动
      apply_limit: applyLimit.value ? applyLimit.value : leftValues.apply_limit, //参数次数
      period: periodModel.value ? daysToSeconds(periodModel.value) : leftValues.period, //清零周期
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
      state:
        leftValues.ty != 5 ? (dayjs(leftValues.startTime.start_at).isAfter(dayjs()) ? 3 : 1) : 1,
      currency_id: '706',
      config: JSON.stringify(config),
      ty: leftValues.ty,
      pop: leftValues.pop ? leftValues.pop : '2',
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
      en_name: en_US,
      pt_name: pt_BR,
      vn_name: vi_VN,
      th_name: th_TH,
      hi_name: hi_IN,
      rule_type: leftValues.rule_type,
      timezone: leftValues.timezone,
      // rule: JSON.stringify(ruleAmount),
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
    if (leftValues.ty === 9) {
      openTerminalState.checkedList.reduce<any>((langObj, lang) => {
        const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
        langObj[langToValue[0].value] = transformTableData(lang, true);
      }, {});
    }
    // }
  }

  /** 活动提交结束 */

  function onBlurInput(value) {
    translateContentList(localeList as never, value, 0, 'transitionValue');
    localeList[0]['transitionValue'] = value;
    translateBottonText.value = [
      { event: 'original', language: 'original', transitionValue: value },
      ...localeList,
    ].map((item: any) => {
      return {
        [item.event]: item.transitionValue ? item.transitionValue : item['original'],
      };
    });
  }

  function emitsValues(value, type) {
    if (type === 'zh_name') {
      if (openTerminalState.checkedList.includes(syslang)) {
        zhText.value = value[syslang];
        setFieldsValueLeft({ zh_name: zhText.value });
      }
      zxLange.value = value;
    } else if (type === 'button_text') {
      if (openTerminalState.checkedList.includes(syslang)) {
        btnText.value = value[syslang];
        setFieldsValueLeft({ button_text: btnText.value });
      }
      btnLange.value = value;
    } else {
      if (openTerminalState.checkedList.includes(syslang)) {
        btnText.value = value[syslang];
        setFieldsValueLeft({ button_text: btnText.value });
      }
      btnLange.value = value;
    }
  }

  async function changeUpload(e, el) {}
  //更多语言
  async function handleMoreLagarage(type) {
    contentList.value.forEach((el) => {
      zxLange.value[el.value] = el.zxTransitionValue;
      btnLange.value[el.value] = el.btnTransitionValue;
    });
    let res = type === 'zh_name' ? zxLange.value : btnLange.value;
    openModal(true, { data: res, type });
  }

  // 切换弹窗图标
  function handleChangePopIcon(value) {
    currentPopIcon.value = value;
  }
  function handleChangeUpload(data) {
    currentLang.value.image_url = data;
    currentLang.value.fileList = [{ uid: '1', name: data, status: 'done' }];
    contentList.value[currentLangIndex.value].fileList = [{ uid: '1', name: data, status: 'done' }];
    localeList.forEach((item) => {
      if (item.event === apiMap.language) {
        item['img_url'] = currentLang.value.image_url;
      }
    });
  }

  async function handleRemoveUpload() {
    currentLang.value.image_url = '';
    currentLang.value.fileList = [];
    contentList.value[currentLangIndex.value].fileList = [];
    const params = {
      name: 'uploadfile',
      // lang: 'zh-CN',
    };
    const { data } = await uploadPromoImage(params);
    imageUrl.value = data.data;
    const imageArr = [];
    quickFileList.value = [{ uid: '1', name: data.data, status: 'done' }];
    //quickFileList.value[currentLangIndex.value].fileList = [{ uid: '1', name: data, status: 'done' }];
  }

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/webp' || file.type === 'image/png';
    const isLt2M = file.size / 1024 < 600;
    if (!isJpgOrPng || !isLt2M) {
      message.error('只能上传webp,png格式图片，且小于600KB');
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
          message.error('无法读取文件');
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

  function getType(array) {
    const result = [];

    if (array.includes(24)) {
      result.push(1);
    }
    if (array.some((num) => num >= 25 && num <= 27)) {
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

    if (data.ty == 8) {
      const echoData = JSON.parse(data.config);
      datatype = `1000${echoData.cond}`;
      defaultTyMain.value = Number(`1000${echoData.cond}`);
    }
    data.activity = getKeyByValue(datatype);
    activityTy.value = data.activity;

    ActivityOptions.value = ActivityList[activityTy.value];
    getDeatilId.value = data.id;
    defaultTy.value = data.ty;
    if (data.ty != 8) defaultTyMain.value = data.ty;
    if (!data.timezone) data.timezone = 'Asia/Shanghai';

    timezone.value = data.timezone;
    if (new Date(data.start_at_tz).getTime() < currentTimestamp) {
      Timestamp_before_disabled.value = true;
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

    // 语言设置问题
    zhText.value = data.zh_name;
    // 币种处理
    if (Array.isArray(systemCurrency.value)) {
      openTerminalState.checkedList = JSON.parse(data.lang);
    } else {
      openTerminalState.checkedList = [systemCurrency.value];
    }
    currenyLang.value = filterHandleCurry(openTerminalState.checkedList);
    currentCurryId.value = currenyLang.value[0]?.value || '701';

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

    showTime.value = {
      display_start_at: dayjs(data.display_start_at_tz),
      display_end_at: dayjs(data.display_end_at_tz),
    };

    await setFieldsValueLeft({
      ...data,
      lang: JSON.parse(data.lang),
      client_type: getType(JSON.parse(data.client_type)),
      category: JSON.parse(data.category),
      apply_condition: JSON.parse(data.apply_condition),
      startTime: {
        start_at: dayjs(data.start_at_tz),
        end_at: dayjs(data.end_at_tz),
      },
      showTime: {
        display_start_at: dayjs(data.display_start_at_tz),
        display_end_at: dayjs(data.display_end_at_tz),
      },
      currency_id: data.currency_id,
      display_type: Number(data.display_type),
      rule_type: data.rule_type,
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

    if (data.ty == 15 || data.ty == 14) {
      await updateValidList(true);
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
        //item.image_url = image_url[item.value]
        item.transitionValue = data.summary[item.value];
        //item.transitionValueTitle = title[item.value]
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
            total_deposit_amount: result.cur[currency.value].total_deposit_amount,
            total_bet_amount: result.cur[currency.value].total_bet_amount,
            total_deposit_days: result.cur[currency.value].total_deposit_days,
            total_deposit_times: result.cur[currency.value].total_deposit_times,
          };
        }
      });

      changeHandleCurry(currentCurryId.value);
    } else if (data.ty == 3 && redTempConfig?.tpl == 1) {
      // 老模板
      defaultTemp.value = 2;

      // const result = JSON.parse(data.config);
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
      if (Array.isArray(systemCurrency.value)) {
        openTerminalState.checkedList = Object.keys(redTempConfig);
        const fistLang = openTerminalState.checkedList[0];
        dropStyle.value = redTempConfig[fistLang].drop;
        const orderedList = Object.values(currencyListTranslate);
        openTerminalState.checkedList = openTerminalState.checkedList.sort((a, b) => {
          return orderedList.indexOf(a) - orderedList.indexOf(b);
        });
      }

      openTerminalState.checkedList.forEach((lang) => {
        if (newRefRedEmvelope.value) {
          const tableData = newRefRedEmvelope.value.conditionData;
          const backCond = [redTempConfig[lang].cond];
          const backConfig = redTempConfig[lang].config;
          const backType = redTempConfig[lang].type;

          tableData[lang] = backCond.map((_, index) => ({
            key: (index + 1).toString(),
            index: (index + 1).toString(),
            type: '1',
            miniDeposit: '',
            chipsMultiple: '',
            conditionType: '1',
            conditionTime: [{ str: undefined, end: undefined }],
            conPartType: '2',
            miniPartDeposit: '',
            intervalDeposit: [{ min: '', max: '' }],
            chipsMultiples: [{ chipsMultiple: '' }],
          }));
          // if (tableData[lang].length !== redTempConfig.length) {
          //   // 调整 conditionData 的行数与 serverCond 一致
          // }
          tableData[lang].forEach((entry, index) => {
            const serverEntry = backCond[index];
            entry.miniPartDeposit = serverEntry.join.value || '';
            entry.conPartType = serverEntry.join.type.toString();
            entry.miniDeposit = serverEntry.calc1.value || '';
            entry.conditionType = serverEntry.calc1.type.toString();
            entry.type = backType.toString();
            entry.chipsMultiple = serverEntry.calc1.scale || '';

            entry.conditionTime = serverEntry.cycle.map(([str, end]) => ({
              str: str == 0 ? `00:00` : `${str}:00`,
              end: end == 0 ? undefined : `${end}:00`,
            }));
            entry.intervalDeposit = serverEntry.calc2.value.map(([min, max]) => ({
              min: min,
              max: max,
            }));
            entry.chipsMultiples = serverEntry.calc2.value.map(([min, max, scal]) => ({
              chipsMultiple: scal,
            }));
          });

          newRefRedEmvelope.value.dailyCollectionLimit[lang] = backConfig.claimLimit;
          newRefRedEmvelope.value.redBagCountDown[lang] = backConfig.countdown;
        }
      });
    } else if (data.ty === 4 || data.ty === 7 || data.ty == 6 || data.ty == 12 || data.ty == 13) {
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
            for (let j = 0; j < currenyLang.value.length; j++) {
              if (currenyLang.value[j].value === currencyId) {
                currenyLang.value[j].ty4_config = result[i];
                break;
              }
            }
          }
        }
        if (data.ty === 7 && Lucky_betSlot.value) {
          let tableData = Lucky_betSlot.value.conditionData['pt_BR'];
          tableData = { lucky_bet_prize_config: [], lucky_number_config: [] };
          result_?.lucky_bet_cur_config[0]?.lucky_bet_prize_config?.forEach((element, index) => {
            tableData.lucky_bet_prize_config.push({
              index: index,
              m: element.valid_bet_amount,
              n: element.receive_count,
            });
          });
          result_?.lucky_bet_cur_config[0]?.lucky_number_config?.forEach((element, index) => {
            tableData.lucky_number_config.push({
              index: index,
              c: element.lucky_number,
              t: element.bonus_multiple,
              l: element.limit,
            });
          });
          XYtableData.value = tableData;
          // obj.lucky_bet_cur_config.push({
          //   "level": String(index+1), //奖金等级
          //   valid_bet_amount: Number(item.m), //有效打码
          //   receive_count: Number(item.n), //领取次数
          // });

          // obj.lucky_number_config.push({
          //   lucky_number: item.c, //注单尾号
          //   bonus_multiple: item.t, //t = 奖励倍数
          //   limit: item.l, //l = 奖励上限
        }
      }
      if (data.ty == 6) {
        const echoData = JSON.parse(data.config);
        // 方法
        setFieldsValueLeft({
          rewardMethods: echoData.method,
          statisticalPeriod: echoData.period,
        });
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
        openTerminalState.checkedList.forEach((lang) => {
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
        });
      }
      if (data.ty == 12) {
        const echoData = JSON.parse(data.config);
        openTerminalState.checkedList.forEach((lang) => {
          if (memberDayRef.value) {
            const tableData = memberDayRef.value.conditionData;
            const langIndex = currencyList.value.filter((cur) => cur.lang == lang);
            const actualList = echoData[langIndex[0].value];

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
              recordData.miniDeposit = serverEntry.d || '';
              // recordData.conditionType = serverEntry.f.toString();
              recordData.everyReward = serverEntry.b;
            });
          }
        });
      }

      if (data.ty == 13) {
        const echoData = JSON.parse(data.config);
        const { bet, fixed_start_at, fixed_end_at, recharge } = echoData;
        fixedTime.value.fixed_start_at = fixed_start_at;
        fixedTime.value.fixed_end_at = fixed_end_at;
        setFieldsValueLeft({ bet, fixedTime: fixedTime.value });
        rechargeActiveText.bet = bet;
        openTerminalState.checkedList.forEach((lang) => {
          if (rechargeDayRef.value) {
            const tableData = rechargeDayRef.value.conditionData;
            const langIndex = currencyList.value.filter((cur) => cur.lang == lang);
            const actualList = recharge[langIndex[0].value];
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
              recordData.miniDeposit = serverEntry.d || '';
              // recordData.conditionType = serverEntry.f.toString();
              recordData.everyReward = serverEntry.b;
            });
          }
        });
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
    } else if (data.ty === 9 && checkIn_slot.value) {
      const result_ = JSON.parse(data.config);
      result_.currency = Object.keys(result_);
      if (checkIn_slot.value) {
        const tableData = get_tableData.value;
        openTerminalState.checkedList.forEach((lang) => {
          const langIndex = currencyList.value.filter((cur) => cur.lang == lang);
          tableData[lang] = { bonus_serial: [], bonus_base: [], cond: { bet: '', deposit: '' } };
          tableData[lang].cond = result_[langIndex[0].value]?.cond;
          result_[langIndex[0].value]?.bonus_serial?.forEach((element, index) => {
            tableData[lang].bonus_serial.push({
              index: index,
              amt: element.amt,
              day: element.day,
            });
          });
          result_[langIndex[0].value]?.bonus_base?.forEach((element, index) => {
            tableData[lang].bonus_base.push({
              index: index,
              bet: element.bet,
              deposit: element.deposit,
              amt: element.amt,
              day: element.day.split(','),
            });
          });
        });
        XYtableData.value = tableData;
      }
    } else if (data.ty === 14 && wallet_slot.value) {
      const result_ = JSON.parse(data.config);
      // result_.currency = Object.keys(result_);
      const tableData = get_tableData.value;
      setFieldsValueLeft({ cycleMode: 1 });
      // openTerminalState.checkedList.forEach((lang) => {
      //   const langIndex = currencyList.value.filter((cur) => cur.lang == lang);
      //   tableData[lang] = { bonus_serial: [], bonus_base: [], cond: { bet: '', deposit: '' } };
      //   tableData[lang].cond = result_[langIndex[0].value]?.cond;
      //   result_[langIndex[0].value]?.bonus_serial?.forEach((element, index) => {
      //     tableData[lang].bonus_serial.push({
      //       index: index,
      //       amt: element.amt,
      //       day: element.day,
      //     });
      //   });
      //   result_[langIndex[0].value]?.bonus_base?.forEach((element, index) => {
      //     tableData[lang].bonus_base.push({
      //       index: index,
      //       amt: element.amt,
      //       day: element.day.split(','),
      //     });
      //   });
      // });
      // XYtableData.value = tableData;
      tableData.bonus = result_.bonus;
      tableData.cryptocurrency = result_.cryptocurrency;
      tableData.wallet = result_.wallet;
      currenyLang.value = currencyList14;
      clientList.value = currencyList14[0]?.clientList;
      selectList.value = result_.cryptocurrency.concat(result_.wallet);
    } else if (data.ty == 10) {
      // 代理日
      const echoData = JSON.parse(data.config);
      const echoKeys = Object.keys(echoData.tongue);
      const transformData = echoKeys.reduce((pre, langVal) => {
        pre[langVal] = echoAgentDaysData(echoData.tongue, langVal, 1);
        return pre;
      }, {});

      const currentKey = typeKeys[1];
      const tranKeys = Object.keys(transformData);
      tranKeys.forEach((key) => {
        if (agentDaysFormValidate.value) {
          agentDaysFormValidate.value.conditions[currentKey][key] = transformData[key];
        }
      });
    } else if (data.ty == 11) {
      setFieldsValueLeft({ statisticalPeriod: 3, getTime: 2 });
      const echoData = JSON.parse(data.config);
      const echoKeys = Object.keys(echoData.tongue);
      const transformData = echoKeys.reduce((pre, langVal) => {
        pre[langVal] = echoAgentDaysData(echoData.tongue, langVal, 1);
        return pre;
      }, {});

      const currentKey = typeKeys[1];
      const tranKeys = Object.keys(transformData);
      tranKeys.forEach((key) => {
        if (agentMonthsFormValidate.value) {
          agentMonthsFormValidate.value.conditions[currentKey][key] = transformData[key];
        }
      });
    } else if (data.ty == 15) {
      // 代理日
      const echoData = JSON.parse(data.config);
      const echoKeys = Object.keys(echoData.tongue);
      const transformData = echoKeys.reduce((pre, langVal) => {
        pre[langVal] = echoChargeData(echoData.tongue, langVal, echoData.bonus);
        return pre;
      }, {});
      rewardMethodsSelected.value = echoData.bonus;
      const currentKey = typeKeys[echoData.bonus];
      const tranKeys = Object.keys(transformData);
      tranKeys.forEach((key) => {
        rewardFormValidate.value.conditions[currentKey][key] = transformData[key];
      });
      setFieldsValueLeft({ statisticalPeriod: echoData.period, rewardMethods: echoData.bonus });
      setTimeout(() => {
        chargeDynamicText.currentMoney = chargeDynamicText.money[echoData.bonus];
        changTextData(15);
      }, 100);
    }
    setContentList();
    const content = JSON.parse(data.detail);
    // const content =
    //   data.rule_type == 2 ? JSON.parse(data.detail) : JSON.parse(data.config).page_content;
    //formState.value.lang = JSON.parse(data.lang);
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
        if (data.ty == 5) {
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
    });
    contentListDetail.value.forEach((item) => {
      item.transitionValueContent = summary[item.value];
    });
    // setFieldsValueLeft({ contentEdit: contentList.value[0].transitionValueContent });
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
  });
  onMounted(() => {
    updateValidList();
  });
  onMounted(() => {
    eventBus.on('onRewardMethodsChange', (data: any) => {
      rewardMethodsSelected.value = data;
    });
  });
  onUnmounted(() => {
    eventBus.off('updatedailyCollectionLimit');
    eventBus.off('onRewardMethodsChange');
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
  const defaultCurrencies = ['zh_CN', 'pt_BR', 'vi_VN', 'th_TH', 'hi_IN', 'en_US'];
  const firstCurrencyId: any = computed(() => {
    for (let lang of defaultCurrencies) {
      if (openTerminalState.checkedList.includes(lang)) {
        return currencyList.value.filter((item) => item.lang == lang)[0].value;
      }
    }
    return null; // 如果没有找到，则返回 null 或者其他默认值
  });
  watch(
    () => openTerminalState.checkedList,
    (val) => {
      openTerminalState.indeterminate =
        !!val.length && val.length < openTerminalOptions.value.length;
      openTerminalState.checkAll = val.length === openTerminalOptions.value.length;
      setFieldsValueLeft({ lang: openTerminalState.checkedList });
      if (defaultTy.value != 14)
        currenyLang.value = filterHandleCurry(openTerminalState.checkedList);
      zxLange.value = updateObj(openTerminalState.checkedList, zxLange.value);
      btnLange.value = updateObj(openTerminalState.checkedList, btnLange.value);
      contentList.value = filterHandleCurrylang(openTerminalState.checkedList);

      if (contentList.value.length > 0) currentLang.value = contentList.value[0];
      else currentLang.value = langList.value[0];
      currentCurryId.value = currenyLang.value[0]?.value || '701';
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
    },
  );

  const _openTerminalState = reactive({
    checkAll: true,
    checkedList: [],
    inderterminate: false,
  });

  watch(
    defaultTy,
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
    contentList.value.forEach((item) => {
      item.textContent = getTextData('newRedTemp')[item.value];
    });
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
    await setFieldsValueLeft({ condition_type: 1, bonus_tpl: 1, show_amount: 2, bonus_type: 1 });
  }

  async function Initializationty_4() {
    await setFieldsValueLeft({ period: 604800, platform_range: 1 });
  }
  async function Initializationty_7() {
    await setFieldsValueLeft({ period: 1, platform_range: 1 });
  }
  async function Initializationty_6() {
    await setFieldsValueLeft({ period: 604800, platform_range: 1 });
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

  function changInput(type) {
    if (openTerminalState.checkedList.includes(syslang)) {
      btnLange.value[syslang] = btnText.value;
    }
    if (type == 'RIGHT') setFieldsValueLeft({ button_text: btnText.value });
    else setFieldsValueLeft({ button_text: btnText.value });
  }

  function changInputzhText(e) {
    if (openTerminalState.checkedList.includes(syslang)) {
      zxLange.value[syslang] = zhText.value;
    }
    setFieldsValueLeft({ zh_name: zhText.value });
  }

  async function fieldChang(k, v) {
    // 暂存，在监听器中重新调用这个函数
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
          startTime: {
            start_at: getTimestampFromDate(startTime.value.start_at, timezone.value),
            end_at: getTimestampFromDate(startTime.value.end_at, timezone.value),
          },
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
  }

  async function dealwithTy_2(k, v) {
    const dataSource = [
      'first_deposit_amount',
      'total_deposit_amount',
      'total_bet_amount',
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
    } catch (error) {
      message.error(t('component.upload.uploadError'));
      throw new Error(error.response.data);
    }
  };

  function deletePic() {
    imageUrl.value = null;
  }

  function changeHandleCurry(value) {
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
        setFieldsValueLeft({ prize_limit: itmeConfig[0]['ty4_config']['prize_limit'] });
      }
      if (defaultTy.value == 1) {
        settingsTy_1.value = itmeConfig[0]['ty1_config'];
      }
    }
    if (history.state.id && defaultTy.value == 2) {
      if (!RawData.includes(currentCurryId.value)) {
        setFieldsValueLeft({ ty2: false });
      } else {
        setFieldsValueLeft({ ty2: true });
      }
    }
    if (defaultTy.value === 1) changTextData(1);
    if (defaultTy.value === 9) changTextData(9);
    if (defaultTy.value === 15) changTextData(15);
    if (defaultTy.value === 14) {
      let cIndex = currencyList14.findIndex((item) => item.id == value) || 0;
      clientList.value = currencyList14[cIndex]?.clientList;
      currencyName.value = currencyList14[cIndex]?.name;
      changTextData(14);
    }
    if (defaultTy.value == 3 && openTerminalState.checkedList.length > 0) {
      const langList = [currencyListTranslate[currentCurryId.value]];
      newRefRedEmvelope.value && newRefRedEmvelope.value.valide(langList, false);
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
  }

  async function changTime(v, type) {
    if (getDeatilId.value && type == 'start_at') {
      timeDisable.value = true;
      setFieldsValueLeft({ timeDisable: true });
    }
    if (type === 'start_at' || type === 'end_at') {
      // setFieldsValueLeft({ startTime: startTime.value });
      setFieldsValueLeft({
        startTime: {
          start_at: getTimestampFromDate(startTime.value.start_at, timezone.value),
          end_at: getTimestampFromDate(startTime.value.end_at, timezone.value),
        },
      });
      if (type === 'start_at' && defaultTy.value == 4) changTextData(4);
    }
    if (type === 'display_start_at' || type === 'display_end_at') {
      // setFieldsValueLeft({ showTime: showTime.value });
      setFieldsValueLeft({
        showTime: {
          display_start_at: getTimestampFromDate(showTime.value.display_start_at, timezone.value),
          display_end_at: getTimestampFromDate(showTime.value.display_end_at, timezone.value),
        },
      });
    }
    if (type === 'fixed_start_at' || type === 'fixed_end_at') {
      setFieldsValueLeft({ fixedTime: fixedTime.value });
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
    const values = await getFieldsValue();
    const hasOriginalValue = contentList.value.some((item) => item.value === 'original');
    if (values.ty == 5) {
      if (values.activeContent == 1) {
        if (!hasOriginalValue) contentList.value = [...extraList, ...contentList.value];
      } else if (contentList.value[0].value === 'original') {
        contentList.value.shift();
      }
      if (values.display_type == 2 && contentList.value[0].value === 'original')
        contentList.value.shift();
    } else {
      if (values.activeContent == 1) {
        if (values.rule_type == 2) {
          if (!hasOriginalValue) contentList.value = [...extraList, ...contentList.value];
        } else if (contentList.value?.[0]?.value === 'original') {
          contentList.value.shift();
        }
      } else if (contentList.value?.[0]?.value === 'original') {
        contentList.value.shift();
      }
    }
    handlelanguageLevelText(currentlanguageIndex.value);
  }

  function changTextData(type, value?) {
    // currentLang.value['textContent'] = getTextData(type)[currentLang.value.value];
    contentList.value.forEach((item) => {
      item.textContent = getTextData(type, value)[item.value];
    });
  }
  const validWarnText = {
    charge: '充值金额',
    agentDays: '佣金金额',
    agentMonths: '下级充值金额',
  };
  async function validateRewardForm(dataList, type, ty) {
    let hasEmptyField = false;
    const currentKey = typeKeys[type];
    openTerminalState.checkedList.forEach((lang) => {
      // 大于0
      const regex = /^((0\.+\d+)|[1-9]\d*)(\.\d+)?$/;
      // 大于等于0
      const regex2 = /^(0|[1-9]\d*)(\.\d+)?$/;
      const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
      const langVal = langToValue[0].value;
      dataList?.[currentKey][langVal].forEach((entry, index) => {
        if (!entry.charge) {
          hasEmptyField = true;
          message.error(`${langToValue[0].label} 下有未填项`);
        }
        if (!hasEmptyField) {
          if (!regex.test(entry.charge)) {
            hasEmptyField = true;
            message.error(`${langToValue[0].label} 下${validWarnText[ty]}不正确，必须大于0`);
          }
          if (type == 1) {
            if (!entry.reward) {
              hasEmptyField = true;
              message.error(`${langToValue[0].label} 下有未填项`);
            }
            if (!hasEmptyField && !regex.test(entry.reward)) {
              hasEmptyField = true;
              message.error(`${langToValue[0].label} 下奖励金额不正确，必须大于0`);
            }
          }
          if (type == 2) {
            if (!entry.reward[0] || !entry.reward[1]) {
              hasEmptyField = true;
              message.error(`${langToValue[0].label} 下有未填项`);
            }
            if ((!hasEmptyField && !regex.test(entry.reward[0])) || !regex.test(entry.reward[1])) {
              hasEmptyField = true;
              message.error(`${langToValue[0].label} 下奖励金额不正确，必须大于0`);
            }
          }
          if (type == 3) {
            if (!entry.rewardLimit || !entry.rewardRate) {
              hasEmptyField = true;
              message.error(`${langToValue[0].label} 下有未填项`);
            }
            if (!hasEmptyField && !regex2.test(entry.rewardLimit)) {
              hasEmptyField = true;
              message.error(`${langToValue[0].label} 下奖励上限不正确，必须大于等于0`);
            }
            if (!hasEmptyField && !regex.test(entry.rewardRate)) {
              hasEmptyField = true;
              message.error(`${langToValue[0].label} 下返奖比例不正确，必须大于0`);
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
  function dealChargeTableData(list, langVal, kind) {
    const currentKey = typeKeys[kind];
    return list?.[currentKey][langVal].map((item) => {
      return {
        deposit: item.charge,
        limit: currentKey === 'rateMoney' ? item.rewardLimit : '0',
        scale: currentKey === 'rateMoney' ? item.rewardRate : '0',
        min:
          currentKey === 'arbitrary'
            ? parseFloat(item.reward[0]).toFixed(2)
            : currentKey === 'rateMoney'
            ? '0'
            : parseFloat(item.reward).toFixed(2),
        max: currentKey === 'arbitrary' ? parseFloat(item.reward[1]).toFixed(2) : '0',
      };
    });
  }
  // 充值处理函数
  function dealActiveEight(params, type) {
    // 1 固定 2随机 3比例
    const res = openTerminalState.checkedList.reduce((langObj, lang) => {
      const langToValue = currencyList.value.filter((currency) => currency.lang == lang);
      langObj[langToValue[0].value] = dealChargeTableData(params, langToValue[0].value, type);
      return langObj;
    }, {});
    return res;
  }
  function dealAgentDaysTableData(list, langVal, kind) {
    const currentKey = typeKeys[kind];
    return list?.[currentKey][langVal].map((item) => {
      return {
        commission: item.charge,
        limit: currentKey == 'rateMoney' ? item.rewardLimit : '0',
        scale: currentKey == 'rateMoney' ? item.rewardRate : '0',
        min:
          currentKey == 'arbitrary'
            ? parseFloat(item.reward[0]).toFixed(2)
            : currentKey == 'rateMoney'
            ? '0'
            : parseFloat(item.reward).toFixed(2),
        max: currentKey == 'arbitrary' ? parseFloat(item.reward[1]).toFixed(2) : '0',
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

  function changeapply(v) {
    setTxtcontent.value.apply_period = v;
    setFieldsValueLeft({ apply_period: v });
    changTextData(4);
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
      }
      if (type === 'condition') {
        everyDayBetActiveText.money = value;
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
          rechargeActiveText.rechargeBet = value;
        }

        if (type === 'rechargeMoney13') {
          rechargeActiveText.rechargeMount = value;
        }
        changTextData(13);
      }
    });
  });
  onMounted(() => {
    eventBus.on('onAgentDaysDynamicText', (data) => {
      const { value, type } = data as any;
      if (type == 'list') {
        agentDaysMinAndMax.value = value;
      }
      if (type == 'multiple') {
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
  });

  onMounted(() => {
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
        const { rewardMethods } = getFieldsValue();
        chargeDynamicText.currentMoney = chargeDynamicText.money[rewardMethods];
      }
      if (type === 'multiple') {
        everyDayBetActiveText.multipleCount = value;
      }
      if (type === 'rewardMethods') {
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
  });
  function getTextData(type, value?) {
    const currencyInformation = currenyLang.value.find((el) => el.value == currentCurryId.value);
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
      };

      // const itmeConfig = currenyLang.value[currentlanguageIndex.value]['ty1_config'];
      const itmeConfig = currenyLang.value.filter((el) => el.value == currentCurryId.value)[0][
        'ty1_config'
      ];

      ty1_config.value = {
        withdraw_amount: itmeConfig['withdraw_amount'] || 0,
        curryName: 'CNY',
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
      };

      ty2_config.value = {
        ...defaultBonus,
      };
      currenyLang.value.forEach((el) => {
        ty2_config.value[el.lang] =
          el.ty2_config.pplBonus[el.ty2_config.pplBonus.length - 1]?.bonus || 0;
      });
    }

    if (type == 4 || type == 7) {
      const defaultBonus = {
        zh_CN: 0,
        en_US: 0,
        pt_BR: 0,
        vi_VN: 0,
        th_TH: 0,
        hi_IN: 0,
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

    const ty1 = {
      zh_CN: `
        邀请好友注册${siteName.value}，可以帮助您快速提款。
        当累计金额达到${ty1_config.value.withdraw_amount}CNY时，您可以开始提款。
        每个用户每天将获得${ty1_config.value.zh_CN}次免费旋转，完成额外任务可增加旋转次数。
        每个用户每次活动有效期为${ty1_config.value.period}天，可多次参加活动。
        如果${ty1_config.value.period}天内不提款，钱就会丢失。
        如果您获得额外的现金奖金，您可以免费玩游戏并赢得更多真钱。
        为避免文字理解差异，平台将保留本活动最终解释权。`,
      en_US: `
        Invite friends to register at ${siteName.value} to help you withdraw quickly.
        You can start withdrawing when the accumulated amount reaches ${ty1_config.value.withdraw_amount}USDT.
        Each user will receive ${ty1_config.value.en_US} free spin per day, Completing extra tasks will increase the number of chances to spin the roulette.
        Each user's participation in the activity is valid for ${ty1_config.value.period} days and can participate multiple times.
        If no withdrawal is made within ${ty1_config.value.period} days, the money will be lost.
        If you win extra cash bonuses, you can play games for free and win more real money.
        To avoid differences in understanding, the platform reserves the right of final interpretation of this activity.`,
      pt_BR: `
        Convite amigos para se registrarem no ${siteName.value} para ajudar você a sacar rapidamente.
        Você pode começar a sacar quando o valor acumulado atingir ${ty1_config.value.withdraw_amount}BRL.
        Cada usuário receberá ${ty1_config.value.pt_BR} giro grátis por dia, Completar tarefas extras aumentará o número de chances para girar a roleta.
        A participação de cada usuário na promoção é válida por ${ty1_config.value.period} dias e pode ser realizada várias vezes.
        Se nenhuma retirada for realizada dentro de ${ty1_config.value.period} dias, o dinheiro será perdido.
        Se você ganhar bônus em dinheiro extra, você pode jogar grátis e ganhar mais dinheiro.
        Para evitar diferenças de entendimento, a plataforma reserva-se o direito de interpretação final desta atividade.
        `,
      vi_VN: `
        Mời bạn bè đăng ký ${siteName.value} có thể giúp bạn tăng nhanh tốc độ rút tiền.
        Khi số tiền tích luỹ đạt đến ${ty1_config.value.withdraw_amount}KVND bạn có thể bắt đầu rút.
        Mỗi một người dùng thể nhận được  ${ty1_config.value.vi_VN} lần quay miễn phí mỗi ngày Hoàn thành nhiệm vụ bổ sung có thể tăng thêm số vòng quay thưởng.
        Thời gian diễn ra sự kiện là ${ty1_config.value.period} ngày, mỗi một người dùng có thể tham gia sự kiện nhiều lần.
        Nếu không rút tiền trong vòng ${ty1_config.value.period} ngày, tiền thưởng sẽ tự động biến mất.
        Nếu như bạn nhận được quà tặng bổ sung, bạn có thể chơi miễn phí các trò chơi và thắng được càng nhiều.
        Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
        `,
      th_TH: `
        เชิญเพื่อนมาลงทะเบียนกับ ${siteName.value} ซึ่งจะช่วยให้คุณถอนเงินได้อย่างรวดเร็วมากยิ่งขึ้น.
        คุณสามารถเริ่มถอนได้เมื่อยอดสะสมถึง ${ty1_config.value.withdraw_amount} THB.
        ผู้เล่นแต่ละคนจะได้รับฟรีสปินวันละ ${ty1_config.value.th_TH} ครั้ง จำนวนการหมุนจะเพิ่มขึ้นเมื่อทำภารกิจเสร็จสิ้น.
        ผู้เล่นสามารถเข้าร่วมกิจกรรมได้หลาย และแต่ละครั้งกิจกรรมของผู้เล่นแต่ละคนมีอายุเพียง ${ty1_config.value.period} วันต่อกิจกรรม.
        หากไม่ถอนเงินภายใน ${ty1_config.value.period} วัน เงินรางวัลของท่านจะหายไป.
        หากคุณได้รับโบนัสพิเศษ คุณสามารถเล่นฟรีและชนะรับเงินจริงมากยิ่งขึ้น.
        เพื่อหลีกเลี่ยงความเข้าใจผิดของข้อความข้างต้นนี้ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของกิจกรรมนี้.`,
      hi_IN: `
        शीघ्र निकासी में सहायता के लिए मित्रों को ${siteName.value} पर रजिस्टर करने के लिए आमंत्रित करें।.
        जब संचित राशि ${ty1_config.value.withdraw_amount}INR तक पहुंच जाए तो आप निकासी शुरू कर सकते हैं।.
        प्रत्येक उपयोगकर्ता को प्रति दिन ${ty1_config.value.hi_IN} निःशुल्क स्पिन प्राप्त होगी, स्पिन की संख्या बढ़ाने के लिए अतिरिक्त कार्य पूरा करें।.
        गतिविधि में प्रत्येक उपयोगकर्ता की भागीदारी ${ty1_config.value.period} दिनों के लिए वैध है और वह कई बार भाग ले सकता है।.
        यदि ${ty1_config.value.period} दिनों के भीतर कोई निकासी नहीं की जाती है, तो पैसा खो जाएगा।.
        यदि आप अतिरिक्त नकद बोनस जीतते हैं, तो आप मुफ्त में गेम खेल सकते हैं और अधिक वास्तविक धन राशि जीत सकते हैं।.
        समझ में अंतर से बचने के लिए, मंच इस गतिविधि की अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
       `,
    };
    const ty2 = {
      zh_CN: `
        只有新注册的下属，符合活动要求的下属。
        发展好友开宝箱，完成不同人数，可获得对应宝箱，金额最高${ty2_config.value.zh_CN}CNY，发展越多，奖励越高。
        本活动所赠送的奖金（不含本金）需${setTxtcontent.value.multiple}倍有效投注才能提现，投注不限游戏平台。
        此活动属平台额外赠送，同时享有其他代理奖励和佣金，即直接享受多倍快乐。
        奖励仅限在iOS、Android、H5、PC端手动领取，过期自动派发。
        本活动仅限账号本人进行正常的人为操作，禁止租借、使用外挂、机器人、不同账号对赌、互刷、套利、接口、协议、利用漏洞、群控或其他技术手段参与，否则将取消或扣除奖励、冻结、甚至拉入黑名单。
        为避免文字理解差异，平台将保留本活动最终解释权。
        `,
      en_US: `
        Only newly registered subordinates who meet the requirements of the activity.
        Develop friends to open treasure chests. Complete different numbers of people to receive corresponding treasure chests, with amounts up to ${ty2_config.value.en_US} USDT. The more you develop, the higher the reward.
        The bonus given in this activity (excluding the principal) must be wagered ${setTxtcontent.value.multiple} times before withdrawal, with no limit on game platforms.
        This activity is an extra gift from the platform, while also enjoying other agent rewards and commissions, thus directly enjoying multiple joys.
        Rewards can only be manually received on iOS, Android, H5, PC terminals, and are automatically distributed if expired.
        This activity is only for the account holder to carry out normal manual operations. Renting, using cheats, bots, gambling between different accounts, mutual brushing, arbitrage, interfaces, protocols, exploiting vulnerabilities, group control, or other technical means of participation are prohibited. Otherwise, rewards may be canceled or deducted, accounts may be frozen, or even blacklisted.
        To avoid differences in textual understanding, the platform reserves the final interpretation of this activity.
        `,
      pt_BR: `
        Apenas subordinados recém-registrados que atendam aos requisitos da atividade.
        Desenvolva amigos para abrir caixas, complete diferentes números e receba caixas correspondentes, com um valor máximo de ${ty2_config.value.pt_BR} BRL. Quanto mais desenvolver, maior será a recompensa.
        O valor do bônus concedido por esta promoção (excluindo o principal) terá um rollover de ${setTxtcontent.value.multiple}x antes de poder ser retirado, e as apostas não estão limitadas a uma única plataforma de jogos.
        Esta promoção é um presente adicional da plataforma, e você também pode desfrutar de outras recompensas e comissões de agentes, aumentando a sua satisfação.
        As recompensas só podem ser resgatadas manualmente no iOS, Android, H5 e PC, e serão distribuídas automaticamente quando expirarem.
        Somente o próprio titular da conta poderá participar desta promoção de forma normal e é estritamente proibido o aluguel, uso de bots, múltiplas contas para apostar, apostas cruzadas, arbitragem, interfaces, protocolos, exploração de falhas, controle de grupo ou outras manipulações técnicas. Caso contrário, as recompensas serão canceladas ou deduzidas, a conta será congelada ou até mesmo adicionada à lista negra.
        Para evitar discrepâncias na interpretação do texto, a plataforma reserva-se o direito de interpretação final desta promoção.
        `,
      vi_VN: `
        Chỉ có cấp dưới mới đăng ký, cấp dưới phù hợp với yêu cầu của sự kiện.
        Phát triển số lượng bạn bè và mở rương kho báu, hoàn thành số lượng người khác nhau có thể nhận được rương kho báu tương ứng, tiền thưởng cao nhất lên đến ${ty2_config.value.vi_VN}KVND phát triển càng nhiều tiền thưởng càng cao.
        Tất cả phần thưởng trong sự kiện (không bao gồm tiền gốc) cần đặt cược toàn bộ ít nhất ${setTxtcontent.value.multiple} lần mới có thể rút, không giới hạn trò chơi trên nền tảng.
        Hoạt động này thuộc về quà tặng bổ sung từ nền tảng, có thể nhận đồng thời tiền thưởng và hoa hồng đại lý, trực tiếp nhân nhiều niềm vui.
        Phần thưởng chỉ có thể nhận thủ công trên các nền tảng IOS, Android, H5 và PC, nếu không nhận thì sẽ hết hiệu lực.
        Hoạt động này bị giới hạn ở thao tác thủ công thông thường của chủ tài khoản, cho thuê, sử dụng phần mềm gian lận, robot, đặt cược giữa các tài khoản khác nhau, thao túng lẫn nhau, hành vi gian lận, API, giao thức, lợi dụng sơ hở, kiểm soát nhóm hoặc các phương tiện kỹ thuật khác đều bị cấm, nếu không thì phần thưởng sẽ được phát có thể bị hủy, khấu trừ hoặc tài khoản có thể bị đóng băng, thậm chí bị đưa vào danh sách đen.
        Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
        `,
      th_TH: `
        กิจกรรมนี้นับเฉพาะลูกทีมที่สมัครใหม่เท่านั้น และลูกทีมต้องมีคุณสมบัติตรงตามข้อกำหนดของกิจกรรม.
        ผลักดันเพื่อนของคุณเพื่อเปิดกล่องสมบัติ เมื่อสำเร็จในแต่ละขั้น คุณจะได้รับกล่องสมบัติที่ตรงตามเงื่อนไขจำนวนสูงสุด ${ty2_config.value.th_TH} THB ยิ่งคุณพัฒนามากเพื่อนของคุณได้มากเท่าไร รางวัลก็จะยิ่งมากขึ้นเท่านั้น.
        โบนัสจากกิจกรรมนี้ (ไม่รวมเงินต้น) ต้องทำการเดิมพันเพิ่มเติมอีก ${setTxtcontent.value.multiple} เท่าถึงจะสามารถถอนเงินออกได้ การเดิมพันนั้นไม่จำกัดประเภทของเกม.
        กิจกรรมนี้เป็นของขวัญเพิ่มเติมจากแพลตฟอร์ม แต่คุณยังได้รับรางวัลและค่าคอมมิชชั่นอื่นๆ อีกด้วย และนั่นคือคุณสามารถเพลิดเพลินกับความสุขอย่างไม่จำกัด.
        เงินรางวัลสามารถรับได้ในวันถัดไปเท่านั้นและสามารถรับได้ด้วยตนเองบนแพลตฟอร์ม iOS, Android, H5, PC เท่านั้น *จะมีการแจกจ่ายอัตโนมัติเมื่อหมดอายุ.
        กิจกรรมนี้จำกัดเฉพาะการเดิมพันโดยเจ้าของบัญชีเท่านั้น ห้ามมีการเช่าบัญชี การเดิมพันแบบโกงความเสี่ยง การเก็งกำไรที่อันตราย การใช้ ปลั๊กอิน บอท และการใช้ประโยชน์จากโปรโตคอล ช่องโหว่ อินเตอร์เฟซ การควบคุมกลุ่มหรือวิธีการทางเทคนิคอื่นๆ ที่เกี่ยวข้อง มิฉะนั้น รางวัลที่จะได้รับอาจถูกยกเลิก หัก หรือบัญชีอาจถูกระงับหรือแม้กระทั่งติดแบล็คลิสต์.
        เพื่อหลีกเลี่ยงการเข้าใจข้อความผิด แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของรายการข้างต้นนี้.
        `,
      hi_IN: `
        केवल नए पंजीकृत अधीनस्थ जो गतिविधि की आवश्यकताओं को पूरा करते हैं।.
        खज़ाना संदूक खोलने के लिए मित्र विकसित करें। संबंधित खज़ाना संदूक प्राप्त करने के लिए अलग-अलग संख्या में लोगों को पूरा करें, अधिकतम राशि ${ty2_config.value.hi_IN}INR के साथ। आप जितने अधिक मित्र बनाएंगे, इनाम उतना ही अधिक होगा।.
        इस गतिविधि में दिए गए बोनस (मूलधन को छोड़कर) को निकासी से पहले ${setTxtcontent.value.multiple} बार दांव लगाना होगा, सट्टेबाजी के लिए गेम प्लेटफॉर्म पर कोई सीमा नहीं होगी।.
        यह गतिविधि मंच से एक अतिरिक्त उपहार है, जबकि अन्य एजेंट पुरस्कार और कमीशन का आनंद लेते हुए, इस प्रकार सीधे कई खुशियों का आनंद ले रहे हैं।.
        पुरस्कार केवल iOS, Android, H5 और PC प्लेटफ़ॉर्म पर मैन्युअल रूप से प्राप्त किए जा सकते हैं, और समाप्त होने पर स्वचालित रूप से वितरित किए जाएंगे।.
        यह गतिविधि केवल खाताधारक के लिए सामान्य मैन्युअल संचालन करने के लिए है, किराए पर लेना, प्लग-इन, रोबोट का उपयोग करना, विभिन्न खातों के साथ जुआ खेलना, आपसी ब्रशिंग, मध्यस्थता, इंटरफेस, प्रोटोकॉल, कमजोरियों का फायदा उठाना, समूह नियंत्रण, या अन्य तकनीकी साधन निषिद्ध हैं। . अन्यथा, पुरस्कार रद्द या काटे जा सकते हैं, खाते फ़्रीज़ किए जा सकते हैं, या काली सूची में भी डाले जा सकते हैं।.
        समझ में अंतर से बचने के लिए, मंच इस गतिविधि की अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
        `,
    };
    const ty3 = {
      zh_CN: `
        单笔红包派送上限金额${setTxtcontent.value.dailyCollectionLimit}USDT。
        投注或充值的会员均可免费参与。
        所获得的金额需${setTxtcontent.value.multiple}倍有效投注才能提现。
        为避免文字理解差异，平台将保留本活动最终解释权。
        `,
      en_US: `
        The maximum amount for a single red packet is ${setTxtcontent.value.dailyCollectionLimit} USDT.
        Members who bet or recharge can participate for free.
        The amount obtained must be wagered ${setTxtcontent.value.multiple} time before withdrawal.
        To avoid differences in textual understanding, the platform reserves the final interpretation of this activity.
       `,
      pt_BR: `
        O valor máximo de um único envelope vermelho é de ${setTxtcontent.value.dailyCollectionLimit} USDT.
        Membros que apostam ou recarregam podem participar gratuitamente.
        O valor recebido deve ser apostado pelo menos ${setTxtcontent.value.multiple}  vez para poder ser retirado.
        Para evitar discrepâncias na interpretação do texto, a plataforma reserva-se o direito de interpretação final desta promoção.
       `,
      vi_VN: `
        Phong bì mỗi lần phát có giá trị cao nhất là ${setTxtcontent.value.dailyCollectionLimit}USDT.
        Hội viên nạp tiền hoặc có cược đều có thể tham gia miễn phí.
        Tất cả tiền thưởng nhận được đều cần đặt cược toàn bộ ít nhất ${setTxtcontent.value.multiple} lần mới có thể rút.
        Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
       `,
      hi_IN: `
        एक लाल लिफाफे की अधिकतम राशि ${setTxtcontent.value.dailyCollectionLimit}USDT है।.
        जो सदस्य दांव लगाते हैं या रिचार्ज करते हैं वे निःशुल्क भाग ले सकते हैं।.
        प्राप्त राशि को निकासी से पहले ${setTxtcontent.value.multiple} बार दांव लगाना होगा।.
        समझ में अंतर से बचने के लिए, मंच इस गतिविधि की अंतिम व्याख्या का अधिकार सुरक्षित रखता ह।.
        `,
      th_TH: `
        แจกซองอังเปาจำนวนเงินต่อซองสูงสุด ${setTxtcontent.value.dailyCollectionLimit}USDT.
        สมาชิกที่วางเดิมพันหรือเติมเงินแล้วสามารถเข้าร่วมได้ฟรี.
        โบนัสจากกิจกรรมนี้ (ไม่รวมเงินต้น) ต้องทำเทิร์นโอเวอร์ ${setTxtcontent.value.multiple} เท่าถึงจะสามารถถอนเงินออกได้.
        เพื่อหลีกเลี่ยงความเข้าใจผิดของข้อความข้างต้นนี้ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของกิจกรรมนี้.
        `,
    };
    const redDes1 = dropStyle.value == 1 ? '红包' : '金钱雨';
    const redDes2 = dropStyle.value == 1 ? '红包' : '金钱雨';
    const redBagNewTem = {
      zh_CN: `
        活动期间每个玩家账号,单个红包场次只能领取一个红包。
        红包派发时，玩家点击活动浮标即可触发红包派发活动。
        点击屏幕上撒落的红包即可参与活动。
        获得的红包金额自动到账，无需申请。
        中奖金额可用于任何游戏投注，${setTxtcontent.value.multiple}倍流水即可出款。
        此活动仅适用于本平台的真钱用户。
        同一IP、手机号、姓名、邮箱地址、银行卡号等信息的游戏账号，单场红包派发仅可参与一次。
        任何用户或团体以不正常的方式进行套取活动优惠，平台保留在不通知的情况下冻结或关闭相关账户的权利，并不退还款项，且用户会被列入黑名单。
        为避免文字理解差异，本平台保留本活动最终解释权。
        `,
      en_US: `
        The prize money can be used for any game bet, and a one-time rollover is required to withdraw the funds.
        When the red envelopes are distributed, players can click the event icon to trigger the red envelope promotion.
        Simply click on the red envelopes that appear on the screen to join the promotion.
        The amount obtained from the red envelope will be credited automatically without requiring a claim.
        Winnings can be used on any game bet and can be withdrawn after completing a ${setTxtcontent.value.multiple}x rollover.
        This promotion is only available to real money users on the platform.
        Accounts linked to the same IP, phone number, name, email, or bank card can only participate once per red envelope round.
        Any user or group attempting to exploit the promotion in an irregular manner will have their account frozen or closed without prior notice, with no refund, and will be blacklisted by the platform.
        To avoid misinterpretation, the platform reserves the right of final explanation for this promotion.
       `,
      pt_BR: `
        Durante o período da promoção, cada conta de jogador pode receber apenas um único envelope vermelho por rodada.
        Quando os envelopes vermelhos são distribuídos, o jogador pode clicar no ícone do evento para ativar a promoção.
        Basta clicar nos envelopes vermelhos que aparecem na tela para participar da promoção.
        O valor recebido no envelope vermelho será creditado automaticamente, sem necessidade de solicitação.
        Os valores ganhos podem ser usados em qualquer aposta, e podem ser sacados após completar um rollover de ${setTxtcontent.value.multiple} vezes.
        Esta promoção é válida apenas para usuários de dinheiro real na plataforma.
        Contas vinculadas ao mesmo IP, número de telefone, nome, e-mail ou cartão bancário podem participar apenas uma vez por rodada de envelope vermelho.
        Qualquer usuário ou grupo que tente obter vantagens de forma irregular na promoção estará sujeito a ter sua conta congelada ou encerrada sem aviso prévio, sem reembolso, e será adicionado à lista negra da plataforma.
        Para evitar ambiguidades de interpretação, a plataforma reserva-se o direito de decisão final sobre esta promoção.
       `,
      vi_VN: `
        Trong thời gian diễn ra sự kiện, mỗi tài khoản người chơi chỉ có thể nhận được một bao lì xì trong mỗi lượt.
        Khi phát bao lì xì, người chơi có thể kích hoạt sự kiện bằng cách nhấn vào biểu tượng lì xì trên màn hình.
        Nhấn vào biểu tượng lì xì trên màn hìnhđể tham gia sự kiện.
        Tiền lì xì nhận được sẽ tự động thêm vào tài khoản của bạn mà không cần phải xin xác nhận.
        Tền lì xì có thể sử dụng đặt cược bất kỳ trò chơi nào, yêu cầu ${setTxtcontent.value.multiple} lần tiền vòng cược mới có thể rút.
        Sự kiện này chỉ dành cho người chơi dùng tiền thật trên nền tảng.
        Mỗi tài khoản cùng IP, số điện thoại di động, tên, địa chỉ email, số thẻ ngân hàng và thông tin khác chỉ được tham gia 1 lần nhận lì xì mỗi lần phát.
        Bất kỳ người dùng hoặc nhóm nào cố gắng đạt lợi ích khuyến mãi theo cách bất thường, nền tảng có quyền đóng băng hoặc đóng tài khoản có liên quan mà không cần thông báo, tiền sẽ không được hoàn lại và người dùng sẽ bị đưa vào danh sách đen.
        Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
       `,
      hi_IN:
        dropStyle.value == 1
          ? `
        घटना के दौरान, प्रत्येक खेलाड़ी खाता केवल एक लाल कंवेल प्राप्त कर सकता है.
        जब लाल कंवेलप वितरण किया जाता है, खेलाड़ी लाल कंवेलप वितरण क्रिया को ट्रिगर कर सकते हैं, क्रिया फ्लोट पर क्लिक कर रह.
        क्रियाकलाप में सहभागी करने के लिए स्क्रीन पर वितरित लाल कंवेल पर क्लिक करें.
        प्राप्त किया गया लाल कन्वेलोप मात्रा अनुप्रयोग के लिए जरूरत बिना खाता पर स्वचालित रूप से क्रेडि.
        जीते हुए मात्रा कोई खेल बेटिंग के लिए इस्तेमाल किया जा सकता है, और ट्रांसेक्शन मात्रा दोहरा कर सकता है.
        `
          : `
        घटना के दौरान, प्रत्येक खेलाड़ी खाता केवल एक लाल कंवेल प्राप्त कर सकता है.
        जब लाल कंवेलप वितरण किया जाता है, खेलाड़ी लाल कंवेलप वितरण क्रिया को ट्रिगर कर सकते हैं, क्रिया फ्लोट पर क्लिक कर रह.
        क्रियाकलाप में सहभागी करने के लिए स्क्रीन पर वितरित लाल कंवेल पर क्लिक करें.
        प्राप्त किया गया लाल कन्वेलोप मात्रा अनुप्रयोग के लिए जरूरत बिना खाता पर स्वचालित रूप से क्रेडि.
        जीते हुए मात्रा कोई खेल बेटिंग के लिए इस्तेमाल किया जा सकता है, और ट्रांसेक्शन मात्रा दोहरा कर सकता है.
        `,
      th_TH:
        dropStyle.value == 1
          ? `
        ในช่วงกิจกรรม บัญชีผู้เล่นแต่ละบัญชีสามารถรับอั่งเปาได้หนึ่งซองต่อเซสชันเท่านั้น.
        เมื่อมีการแจกอั่งเปา ผู้เล่นสามารถคลิกที่ทุ่นกิจกรรมเพื่อเริ่มกิจกรรมแจกอั่งเปาได้.
        คลิกที่ซองอั่งเปา ที่กระจัดกระจายบนหน้าจอเพื่อเข้าร่วมกิจกรรม.
        จำนวนอั่งเปาที่คุณได้รับจะถูกโอนเข้าบัญชีของคุณอัตโนมัติโดยไม่ต้องยื่นเรื่อง.
        จำนวนเงินที่ชนะ สามารถใช้ในการเดิมพันในเกมใดก็ได้ และสามารถถอนเงินได้หลังจากเทิร์นโอเวอร์สองเท่า.
        `
          : `
        ในช่วงกิจกรรม บัญชีผู้เล่นแต่ละบัญชีสามารถรับฝนอั่งเปาได้หนึ่งซองต่อเซสชันเท่านั้น.
        เมื่อถึงเวลามีแจกอั่งเปา ผู้เล่นสามารถคลิกที่ทุ่นกิจกรรมเพื่อเริ่มกิจกรรมฝนอั่งเปาได้.
        คลิกที่ซองฝนอั่งเปา ที่ตกลงมาบนหน้าจอเพื่อเข้าร่วมกิจกรรม.
        จำนวนอั่งเปาที่คุณได้รับจะถูกโอนเข้าบัญชีของคุณอัตโนมัติโดยไม่ต้องยื่นเรื่อง.
        จำนวนเงินที่ชนะ สามารถใช้ในการเดิมพันในเกมใดก็ได้ และสามารถถอนเงินได้หลังจากเทิร์นโอเวอร์สองเท่า.
        `,
    };
    const ty4 = {
      zh_CN: `
              凡是在我司投注达到指定门槛，即可获得对应门槛输赢比例。
              每日可领取一次，领取后将重新计算有效投注，未领取将一直累计。
              部分老虎机桌面游戏有效投注将不统计在内，例:美式21点、21点之富贵临门、百家乐、龙宝百家乐、龙虎榜……
              真实资金损失数乘以现金返还比例百分比即为现金返还。
              返现金额可直接提款或用于继续玩。
              为避免文字理解差异，平台将保留本活动最终解释权。
           `,
      en_US: `
              Anyone who bets with us and meets the specified threshold will receive the corresponding win/loss ratio.
              You can claim it once per day; after claiming, valid bets will be recalculated. If not claimed, it will accumulate.
              Some slot and table games' bets will not be counted, such as American Blackjack, Blackjack with Prosperity, Baccarat, Dragon Treasure Baccarat, Dragon Tiger, etc.
              The cashback is calculated by multiplying the real loss amount by the cashback percentage.
              The cashback amount can be withdrawn directly or used to continue playing.
              To avoid any misunderstanding, the platform reserves the right to the final interpretation of this promotion.
            `,
      pt_BR: `
            Quem apostar conosco e atingir o limite especificado receberá a proporção correspondente de ganhos/perdas.
            Você pode resgatar uma vez por dia; após o resgate, as apostas válidas serão recalculadas. Se não resgatar, acumulará.
            Algumas apostas em jogos de caça-níqueis e mesas não serão contadas, como Blackjack Americano, Blackjack Prosperidade, Baccarat, Baccarat Dragão Tesouro, Dragão-Tigre, etc.
            O cashback é calculado multiplicando o valor da perda real pela porcentagem de cashback.
            O valor do cashback pode ser retirado diretamente ou usado para continuar jogando.
            Para evitar mal-entendidos, a plataforma reserva-se o direito de interpretação final desta promoção.
            `,
      th_TH: `
            เดิมพันเกมต่างๆในแพลตฟอร์มของเรา  รับทันที่โบนัสเงินคืนเมื่อถึงเกณฑ์ที่กำหนด.
            สามารถรับโบนัสได้วันละ 1 ครั้ง ยอดเดิมพันจะถูกคำนวณใหม่หลังจากกดรับแล้ว แต่ถ้าหากยังไม่รับกดรับ โบนัสจะสะสมยังจะคงอยู่.
            ยอดเดิมพันบางส่วนของเกมสล็อต และคาสิโน จะไม่ได้รับการนับ ตัวอย่างเช่นแบล็คแจ็คอเมริกัน, แบล็คแจ็ครวย Linmen, บาคาร่า, Dragon Baccarat, Dragon Tiger ...
            ยอดเสียจริงคูณด้วยเปอร์เซ็นต์อัตราส่วนเงินคืน (Cash Back) และจะได้รับออกเป็นโบนัสเงินคืน.
            จำนวนเงินคืนสามารถใช้เพื่อเล่นต่อได้ หรือถอนออกได้โดยตรง.
            เพื่อหลีกเลี่ยงความแตกต่างในการทำความเข้าใจข้อความ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของกิจกรรมนี้.
         `,
      vi_VN: `
            Chỉ cần trên nền tảng của công ty đặt cược đến ngưỡng quy địng sẽ nhận được tỷ lệ thắng thua tương ứng.
            Mỗi ngày có thể nhận 1 lần, sau khi nhận thưởng tiền vòng cược sẽ được tính lại tùe đầu, nếu chưa nhận tiền vòng cược có thể tích luỹ lại.
            Một số trò chơi sẽ không được tham gia vào sự kiện này, ví dụ: American Blackjack, Blackjack Fortune, Baccarat, Long Bao Baccarat, Dragon Tiger List...
            Số tiền hoàn cược được tính bằng cách nhân số tiền thua thực tế nhân phần trăm tỷ lệ hoàn tiền.
            Tiền hoàn cược có thể rút trực tiếp hoặc tiếp tục chơi các trò chơi khác.
            Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
         `,
      hi_IN: `
              जो कोई भी हमारी कंपनी में दांव लगाता है और निर्दिष्ट सीमा तक पहुंचता है, वह सीमा के अनुरूप जीत-हार अनुपात प्राप्त कर सकता है।.
              आप दिन में एक बार इस पर दावा कर सकते हैं। आपके दावा करने के बाद वैध दांवों की पुनर्गणना की जाएगी। दावा न किए गए दांव जमा होते रहेंगे।.
              कुछ स्लॉट मशीन टेबल गेम्स पर वैध दांवों को नहीं गिना जाएगा, उदाहरण के लिए: अमेरिकन ब्लैकजैक, ब्लैकजैक फॉर्च्यून, बैकारेट, लॉन्ग बाओ बैकारेट, ड्रैगन टाइगर लिस्ट...
              कैश बैक की गणना खोए गए धन की वास्तविक राशि को कैश बैक प्रतिशत से गुणा करके की जाती है।.
              कैशबैक राशि सीधे निकाली जा सकती है या खेलना जारी रखने के लिए उपयोग की जा सकती है।.
              पाठ की समझ में अंतर से बचने के लिए, मंच इस घटना की अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
        `,
    };
    const ty6 = {
      zh_CN: `
          活动开始后，您注册后将自动参加。
          ${everyDayBetActiveText.day?.['zh_CN']}有效投注需要满足活动条件，即可领取一次${
        everyDayBetActiveText?.rewardText?.['zh_CN']
      }。最高可获得奖励${everyDayBetActiveText?.money?.['zh_CN']}CNY。
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
      } once. The maximum reward is ${everyDayBetActiveText.money?.['en_US']}USDT.
          ${
            everyDayBetActiveText.getType?.['en_US'] ? everyDayBetActiveText.getType?.['en_US'] : ''
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
      } uma vez. O valor máximo da recompensa é de ${everyDayBetActiveText.money?.['pt_BR']} BRL.
          ${
            everyDayBetActiveText?.getType?.['pt_BR']
              ? everyDayBetActiveText?.getType?.['pt_BR']
              : ''
          }
          Todos os bônus deste evento exigem um turnover de apostas de ${
            everyDayBetActiveText.multipleCount
          }x antes do saque.
          Bất kỳ người dùng hoặc nhóm nào nhận ưu đãi sự kiện theo cách bất thường hoặc gian lận, nền tảng có quyền đóng băng hoặc đóng tài khoản liên quan không cần thông báo và không hoàn lại tiền, người dùng sẽ bị đưa vào danh sách đen.
          Para evitar mal-entendidos, a plataforma reserva o direito de interpretação final deste evento.
       `,
      vi_VN: `
          Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
          Cược hợp lệ ${
            everyDayBetActiveText.day?.['vi_VN']
          } chỉ cần đáp ứng điều kiện sự kiện liền có thể nhận một lần ${
        everyDayBetActiveText.rewardText['vi_VN']
      }. Phần thưởng tối đa lên tới ${everyDayBetActiveText.money?.['vi_VN']} KVND.
          ${
            everyDayBetActiveText.getType?.['vi_VN'] ? everyDayBetActiveText.getType?.['vi_VN'] : ''
          }
          Tất cả tiền thưởng từ sự kiện này yêu cầu ${
            everyDayBetActiveText.multipleCount
          } lần vòng cược mới có thể rút.
          Bất kỳ người dùng hoặc nhóm nào nhận ưu đãi sự kiện theo cách bất thường hoặc gian lận, nền tảng có quyền đóng băng hoặc đóng tài khoản liên quan không cần thông báo và không hoàn lại tiền, người dùng sẽ bị đưa vào danh sách đen.
          Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.

       `,
      hi_IN: `
         empty
        `,
      th_TH: `
          empty
        `,
    };
    const ty8PartObj = {
      1: {
        zh_CN: `活动开始后，您注册后将自动参加。您需要在${
          chargeDynamicText.isLimit == 1
            ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['zh_CN'] || ''}内`
            : firstChargeObj['zh_CN']
        }充值并达到充值金额要求。
          仅一次机会，充值越多，奖励越多，最高可获得奖励${
            chargeDynamicText.currentMoney?.['701'] || 0
          }CNY。
          ${chargeDynamicText.getType?.['zh_CN']}`,
        en_US: `
          After the event starts, you will automatically participate once you register. You must make a deposit within ${
            chargeDynamicText.isLimit == 1
              ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['en_US'] || ''}`
              : firstChargeObj['en_US']
          } and meet the deposit amount requirement.
          You only have one chance. The more you deposit, the more rewards you receive, with a maximum reward of ${
            chargeDynamicText.currentMoney?.['706'] || 0
          } USDT.
          ${chargeDynamicText.getType?.['en_US']}`,
        pt_BR: `
          Após o início do evento, você será automaticamente inscrito após se registrar. Você precisa fazer um depósito dentro de ${
            chargeDynamicText.isLimit == 1
              ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['pt_BR'] || ''}e`
              : firstChargeObj['pt_BR']
          } atingir o valor mínimo exigido.
          Há apenas uma chance, quanto maior o depósito, maior a recompensa, com um valor máximo de ${
            chargeDynamicText.currentMoney?.['702'] || 0
          } BRL.
          ${chargeDynamicText.getType?.['pt_BR']}`,
        vi_VN: `
          Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia. Bạn cần nạp tiền trong ${
            chargeDynamicText.isLimit == 1
              ? `${chargeDynamicText.time}${chargeDynamicText.timeUnit?.['vi_VN'] || ''}`
              : firstChargeObj['vi_VN']
          } và đáp ứng yêu cầu về số tiền nạp.
          Chỉ có một cơ hội, nạp càng nhiều, thưởng càng cao. Phần thưởng tối đa lên tới ${
            chargeDynamicText.currentMoney?.['704'] || 0
          } KVND.
          ${chargeDynamicText.getType?.['vi_VN']}`,
        hi_IN: `empty
        `,
        th_TH: `empty
        `,
      },
      2: {
        zh_CN: `
          活动开始后，您注册后将自动参加。您仅需要在${
            chargeDynamicText.cycleText?.['zh_CN']
          }完成充值并累计达到充值金额要求。
          充值越多，奖励越多，最高可获得奖励${chargeDynamicText.currentMoney?.['701'] || 0} CNY。
          获得奖励资格后，会在次日01:00:00后更新，请等待奖励发放。
          ${chargeDynamicText.getType?.['zh_CN']}`,
        en_US: `
          After the event starts, you will automatically participate once you register. You only need to complete a deposit on the ${
            chargeDynamicText.cycleText?.['en_US']
          } and accumulate the required deposit amount.
          The more you deposit, the greater the rewards, with a maximum reward of ${
            chargeDynamicText.currentMoney?.['706'] || 0
          } USDT.
          Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
          ${chargeDynamicText.getType?.['en_US']}`,
        pt_BR: `
          Após o início do evento, você será automaticamente inscrito após se registrar. Você só precisa fazer um depósito no mesmo dia e acumular o valor exigido.
          Quanto maior o depósito, maior a recompensa, com um valor máximo de ${
            chargeDynamicText.currentMoney?.['702'] || 0
          } BRL.
          Após qualificar-se para a recompensa, ela será atualizada após as 01:00:00 do dia seguinte. Por favor, aguarde a distribuição do bônus.
          ${chargeDynamicText.getType?.['pt_BR']}`,
        vi_VN: `
          Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia. Bạn chỉ cần hoàn tất việc nạp tiền ${
            chargeDynamicText.cycleText?.['vi_VN']
          } và đạt đủ yêu cầu về số tiền nạp tích lũy.
          Nạp càng nhiều, thưởng càng cao. Phần thưởng tối đa lên tới ${
            chargeDynamicText.currentMoney?.['704'] || 0
          } KVND.
          Sau khi đủ tư cách nhận thưởng, sự kiện sẽ tự động cập vào 01:00:00, vui lòng chờ đợi phát thưởng.
          ${chargeDynamicText.getType?.['vi_VN']}`,
        hi_IN: `
          empty
        `,
        th_TH: `
          empty
        `,
      },
      3: {
        zh_CN: `活动开始后，您注册后将自动参加。自注册时间开始，第${chargeDynamicText.dayList.join(
          '，',
        )}天内均可领取注册奖金。
          充值越多，奖励越多，最高可获得奖励${chargeDynamicText.currentMoney?.['701'] || 0} CNY。
          未领取的奖金将在第${
            chargeDynamicText.dayList.length > 0
              ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
              : ''
          }天00:00:00自动发放到钱包。`,
        en_US: `
          After the event starts, you will automatically participate once you register. From the time of registration, you can claim the registration bonus on the 2nd, 3rd, 7th, 15th, and 30th days.
          The more you deposit, the greater the rewards, with a maximum reward of ${
            chargeDynamicText.currentMoney?.['706'] || 0
          } USDT.
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
            chargeDynamicText.currentMoney?.['702'] || 0
          } BRL.
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
            chargeDynamicText.currentMoney?.['704'] || 0
          } KVND.
          Tiền thưởng chưa nhận sẽ tự động chuyển vào ví vào lúc 00:00:00 ngày thứ ${
            chargeDynamicText.dayList.length > 0
              ? chargeDynamicText.dayList[chargeDynamicText.dayList.length - 1] + 1
              : ''
          }.`,
        hi_IN: `empty
        `,
        th_TH: `empty
        `,
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
          Bất kỳ người dùng hoặc nhóm nào nhận ưu đãi sự kiện theo cách bất thường hoặc gian lận, nền tảng có quyền đóng băng hoặc đóng tài khoản liên quan không cần thông báo và không hoàn lại tiền, người dùng sẽ bị đưa vào danh sách đen.
          Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.

       `
        .replace(/\n\s*\n/g, '\n')
        .trim(),
      hi_IN: `
          empty
        `,
      th_TH: `
          empty
        `,
    };
    const ty10 = {
      zh_CN: `
          活动开始后，您注册后将自动参加。
          对应活动期间只要发放佣金${
            agentDaysMinAndMax.value?.commissionMin?.[701] ?? 0
          }NOW$$currency$$以上，即可领取最高${
        agentDaysMinAndMax.value?.rewardMax?.[701] ?? 0
      }NOW$$currency$$奖励。
          会员每日领取的佣金都是以USDT发放，系统会自动换算成CNY，达到对应门槛领取对应奖励。
          奖金仅支持用户手动点击领取，领取时间为24小时，会员可在当日23:59前登录领取，逾期未领取则视为放弃。
          本次活动的所有奖金，需要${everyDayBetActiveText.multipleCount ?? 0}倍流水才能提现。
          本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
          为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
        `,
      en_US: `
          Once the event begins, you will automatically participate after registering.
          During the event, agents earning a commission of more than ${
            agentDaysMinAndMax.value?.commissionMin?.[706]
          } NOW$$currency$$, can claim a maximum reward of ${
        agentDaysMinAndMax.value?.rewardMax?.[706]
      } NOW$$currency$$.
          Members’ daily commissions are distributed in USDT, and the system automatically converts it to CNY. Once the corresponding threshold is reached, the respective reward can be claimed.
          Bonuses can only be claimed manually within 24 hours. Members must log in and claim by 11:59 PM on the same day. If not claimed, the bonus will be considered forfeited.
          All bonuses from this event require a ${
            everyDayBetActiveText.multipleCount ?? 0
          }x rollover before they can be withdrawn.
          This activity is only available to account holders performing regular, human-operated actions. Renting accounts, using cheats, bots, multiple accounts, mutual boosting, arbitration, APIs, exploiting loopholes, or other technical methods are strictly prohibited. Violations may result in the cancellation or deduction of bonuses, account freezing, or blacklisting.
          To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
        `,
      pt_BR: `
          Assim que o evento começar, você será automaticamente inscrito ao se registrar.
          Durante o evento, agentes que ganharem uma comissão superior a ${
            agentDaysMinAndMax.value?.commissionMin?.[702]
          } NOW$$currency$$, podem resgatar um bônus máximo de ${
        agentDaysMinAndMax.value?.rewardMax?.[702]
      } NOW$$currency$$.
          As comissões diárias recebidas pelos membros são pagas em USDT, e o sistema converte automaticamente para CNY. Ao atingir o limite correspondente, o membro poderá resgatar a recompensa correspondente.
          Os bônus devem ser resgatados manualmente dentro de 24 horas. Os membros precisam fazer login e resgatar até as 23h59 do mesmo dia. Caso não sejam resgatados, serão considerados desistidos.
          Todos os bônus deste evento exigem ${
            everyDayBetActiveText.multipleCount ?? 0
          }x de rollover para serem retirados.
          Esta atividade é limitada a titulares de contas que realizem operações normais e manuais. É proibido alugar contas, usar trapaças, bots, contas múltiplas, combinações de apostas, arbitragens, APIs, exploração de falhas, ou outros métodos técnicos. Violações podem resultar no cancelamento ou dedução dos bônus, congelamento da conta ou inclusão na lista negra.
          Para evitar mal-entendidos, a plataforma se reserva o direito final de interpretação deste evento.
        `,
      vi_VN: `
          Khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
          Trong thời gian diễn ra sự kiện, miễn là hoa hồng lớn hơn ${
            agentDaysMinAndMax.value?.commissionMin?.[704]
          } NOW$$currency$$, bạn có thể nhận được phần thưởng lên tới ${
        agentDaysMinAndMax.value?.rewardMax?.[704]
      } NOW$$currency$$.
          Hoa hồng hội viên nhận được mỗi ngày được phát bằng USDT, hệ thống sẽ tự động đổi thành CNY. Đạt ngưỡng tương ứng sẽ nhận được số tiền thưởng tương ứng.
          Phần thưởng chỉ hỗ trợ người dùng nhận thủ công. Thời gian quy đổi là 24 giờ, việc không nhận phần thưởng trước 23:59:59 cùng ngày sẽ được coi là bỏ cuộc, tiền thưởng sẽ tự động khấu trừ.
          Tất cả tiền thưởng từ sự kiện này yêu cầu ${
            everyDayBetActiveText.multipleCount ?? 0
          } lần tiền vòng cược mới có thể rút.
          Hoạt động này được chủ tài khoản giới hạn ở các hoạt động bình thường. Nghiêm cấm cho thuê, sử dụng gian lận, robot, đồng thời sử dụng các tài khoản khác nhau, đánh lừa lẫn nhau, phân xử, giao diện, giao thức, khai thác lỗ hổng, kiểm soát nhóm và các phương tiện kỹ thuật khác. Nếu phát hiện phần thưởng có thể bị hủy hoặc khấu trừ, bị đóng băng hoặc thậm chí bị đưa vào danh sách đen.
          Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
        `,
      th_TH: `
          หลังจากเริ่มกิจกรรม คุณจะเข้าร่วมโดยอัตโนมัติเมื่อคุณลงทะเบียน
          ในช่วงระยะเวลากิจกรรม หากมีการจ่ายค่าคอมมิชชั่นเกิน ${
            agentDaysMinAndMax.value?.commissionMin?.[705]
          } NOW$$currency$$ คุณจะสามารถรับรางวัลสูงสุด ${
        agentDaysMinAndMax.value?.rewardMax?.[705]
      } NOW$$currency$$.
          รางวัลจะถูกแจกจ่ายให้กับสมาชิกในรูปแบบ USDT.
          โบนัสสามารถรับได้เฉพาะเมื่อผู้ใช้คลิกเพื่อรับเท่านั้น และระยะเวลาในการรับคือ 24 ชั่วโมง สมาชิกสามารถเข้าสู่ระบบเพื่อรับรางวัลภายใน 23:59 ของวันนั้น หากไม่รับภายในเวลาที่กำหนดจะถือว่าละทิ้ง.
          โบนัสทั้งหมดจากกิจกรรมนี้ต้องการการหมุนเวียน ${
            everyDayBetActiveText.multipleCount ?? 0
          } เท่าจึงจะสามารถถอนออกได้.
          กิจกรรมนี้จำกัดเฉพาะการดำเนินการของเจ้าของบัญชีที่เป็นบุคคลปกติ ห้ามเช่า ใช้โปรแกรมโกง บอท เล่นด้วยบัญชีที่แตกต่างกัน การทำธุรกรรมระหว่างกัน การชี้ขาด การเชื่อมต่อ ข้อตกลง การใช้ช่องโหว่ การควบคุมกลุ่ม และวิธีการทางเทคนิคอื่นๆ มิฉะนั้นรางวัลอาจถูกยกเลิกหรือลดลง ถูกระงับหรือแม้แต่ถูกขึ้นบัญชีดำ.
          เพื่อหลีกเลี่ยงความเข้าใจผิดเกี่ยวกับข้อความ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายสำหรับกิจกรรมนี้.
        `,
      hi_IN: `
          कार्यक्रम शुरू होने के बाद, आप पंजीकरण के बाद स्वचालित रूप से भाग लेंगे।.
          कार्यक्रम अवधि के दौरान, यदि कमीशन ${
            agentDaysMinAndMax.value?.commissionMin?.[703]
          } NOW$$currency$$ से अधिक जारी किया जाता है, तो आप ${
        agentDaysMinAndMax.value?.rewardMax?.[703]
      } NOW$$currency$$ तक का अधिकतम पुरस्कार प्राप्त कर सकते हैं।.
          पुरस्कार सदस्यों को USDT में वितरित किए जाएंगे।.
          बोनस केवल उपयोगकर्ताओं द्वारा मैन्युअल रूप से क्लिक करके प्राप्त किया जा सकता है, और प्राप्त करने का समय 24 घंटे है। सदस्य उसी दिन 23:59 बजे से पहले लॉगिन करके पुरस्कार प्राप्त कर सकते हैं; यदि समय सीमा के भीतर प्राप्त नहीं किया गया, तो इसे त्याग माना जाएगा।.
          इस कार्यक्रम से सभी बोनस को निकासी के लिए ${
            everyDayBetActiveText.multipleCount ?? 0
          } गुना टर्नओवर की आवश्यकता होती है।.
          यह कार्यक्रम केवल खाता धारकों द्वारा सामान्य संचालन के लिए सीमित है। किराए पर लेना, धोखाधड़ी का उपयोग करना, बॉट, विभिन्न खातों के साथ खेलना, आपस में ब्रश करना, मध्यस्थता, इंटरफेस, समझौते, कमजोरियों का लाभ उठाना, समूह नियंत्रण और अन्य तकनीकी साधनों का उपयोग करना निषिद्ध है। अन्यथा, पुरस्कार रद्द, घटित, फ्रीज या यहां तक कि काली सूची में डाला जा सकता है।.
          पाठ के संबंध में किसी भी गलतफहमी से बचने के लिए, मंच इस कार्यक्रम के लिए अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
        `,
    };
    const ty11 = {
      zh_CN: `
          活动开始后，您注册后将自动参加。
          对应活动期间只要直属会员充值${
            agentMonthsMinAndMax.value?.commissionMin?.[701] ?? 0
          }NOW$$currency$$以上，即可领取最高${
        agentMonthsMinAndMax.value?.rewardMax?.[701] ?? 0
      }NOW$$currency$$奖励。
          奖金仅支持用户手动点击领取，统计时间为上个月，领取时间为下个月，领取时间限制每月1号-15号23:59:59，逾期未领取则视为放弃。
          本次活动的所有奖金，需要${everyDayBetActiveText.multipleCount ?? 0}倍流水才能提现。
          本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
          为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
        `,
      en_US: `
          Once the campaign starts, you will be automatically enrolled upon registration.
          During the promotion period, if your direct members make total deposits of at least ${
            agentMonthsMinAndMax.value?.commissionMin?.[706] ?? 0
          } NOW$$currency$$, you will be eligible to claim a maximum reward of  ${
        agentMonthsMinAndMax.value?.rewardMax?.[706] ?? 0
      } NOW$$currency$$.
          The bonus must be claimed manually by the user. Bonus calculations are based on the previous month’s performance, and the claiming period is from the 1st to the 15th of the following month, until 11:59:59 PM. If the bonus is not claimed within this period, it will be forfeited.
          All bonuses received during this promotion must generate a betting turnover equal to ${
            everyDayBetActiveText.multipleCount ?? 0
          }x the bonus amount before withdrawal is allowed.
          This promotion is strictly for legitimate operations performed by the account holder. Renting accounts, using cheats, bots, multiple accounts, mutual exchanges, arbitrage, interface manipulation, exploiting system vulnerabilities, group control, or other similar techniques are strictly prohibited. Violations may result in the bonus being canceled, deducted, accounts frozen, or even blacklisted.
          To avoid any misunderstandings, the platform reserves the right to make the final interpretation of the terms of this promotion.
        `,
      pt_BR: `
          Após o início da campanha, você será automaticamente incluído após o registro.
          Durante o período da promoção, se os membros diretos realizarem recargas no valor mínimo de ${
            agentMonthsMinAndMax.value?.commissionMin?.[702] ?? 0
          } NOW$$currency$$, você poderá receber uma recompensa máxima de ${
        agentMonthsMinAndMax.value?.rewardMax?.[702] ?? 0
      } NOW$$currency$$.
          O bônus deve ser resgatado manualmente pelo usuário. Os valores são calculados com base no desempenho do mês anterior, e o resgate deve ser realizado entre os dias 1º e 15 do mês seguinte, até às 23h59min59s. Caso não seja resgatado dentro do prazo, o bônus será considerado como renunciado.
          Todos os valores recebidos nesta promoção precisam gerar um volume de apostas equivalente a ${
            everyDayBetActiveText.multipleCount ?? 0
          } vez o valor do bônus para que o saque seja permitido.
          Esta promoção é exclusiva para operações realizadas de forma legítima pelo titular da conta. Está proibido o aluguel de contas, uso de ferramentas de trapaça, bots, múltiplas contas, troca de benefícios entre usuários, arbitragem, manipulação por interfaces ou protocolos, exploração de falhas, controle remoto em grupo ou outras técnicas similares. Caso sejam identificadas violações, os bônus podem ser cancelados, deduzidos, as contas podem ser congeladas ou até mesmo adicionadas a uma lista de restrições.
          Para evitar divergências na interpretação dos termos, a plataforma reserva o direito de decisão final sobre esta campanha.
        `,
      vi_VN: `
          Khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
          Trong thời gian diễn ra sự kiện, chỉ cần cấp dưới nạp ${
            agentMonthsMinAndMax.value?.commissionMin?.[704] ?? 0
          } NOW$$currency$$, trở lên có thể nhận được phần thưởng lên tới ${
        agentMonthsMinAndMax.value?.rewardMax?.[704] ?? 0
      } NOW$$currency$$.
          Phần thưởng chỉ hỗ trợ người dùng nhận thủ công. Thời gian thống kê là một tháng, và nhận trong tháng tiếp theo. Thời gian nhận lãnh giới hạn từ ngày mùng 1 đến 23:59:59  ngày 15 hàng tháng. Việc không nhận thưởng sẽ bị coi là bỏ cuộc, tiền thưởng sẽ tự động khấu trừ.
          Tất cả tiền thưởng từ sự kiện này yêu cầu ${
            everyDayBetActiveText.multipleCount ?? 0
          } lần vòng cược mới có thể rút.
          Bất kỳ người dùng hoặc nhóm nào nhận ưu đãi sự kiện theo cách bất thường hoặc gian lận, nền tảng có quyền đóng băng hoặc đóng tài khoản liên quan không cần thông báo và không hoàn lại tiền, người dùng sẽ bị đưa vào danh sách đen.
          Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
        `,
      th_TH: `
          หลังจากที่กิจกรรมเริ่มต้น คุณจะเข้าร่วมโดยอัตโนมัติเมื่อทำการลงทะเบียน.
          ในช่วงระยะเวลากิจกรรม เพียงแค่สมาชิกโดยตรงเติมเงินมากกว่า ${
            agentMonthsMinAndMax.value?.commissionMin?.[705] ?? 0
          } NOW$$currency$$ คุณก็จะสามารถรับรางวัลสูงสุด ${
        agentMonthsMinAndMax.value?.rewardMax?.[705] ?? 0
      } NOW$$currency$$.
          โบนัสจะต้องถูกคลิกเพื่อรับโดยผู้ใช้เท่านั้น ช่วงเวลาสถิติคือเดือนที่แล้ว และช่วงเวลาการรับคือเดือนถัดไป โดยมีเวลาจำกัดตั้งแต่วันที่ 1 ถึง 15 ของแต่ละเดือนจนถึง 23:59:59 หากไม่สามารถรับโบนัสได้ภายในระยะเวลานี้ จะถือว่าทิ้งสิทธิ์.
          โบนัสทั้งหมดจากกิจกรรมนี้ต้องการการหมุนเวียน ${
            everyDayBetActiveText.multipleCount ?? 0
          } เท่าก่อนที่จะถอน.
          กิจกรรมนี้ใช้ได้เฉพาะสำหรับการดำเนินการปกติของเจ้าของบัญชีเท่านั้น ห้ามเช่า ใช้การโกง ใช้บอท เล่นด้วยบัญชีที่แตกต่างกัน การแลกเปลี่ยนซึ่งกันและกัน การอนุญาโตตุลาการ อินเตอร์เฟส ข้อตกลง การใช้ช่องโหว่ การควบคุมกลุ่ม และวิธีการทางเทคนิคอื่น ๆ มิฉะนั้น รางวัลอาจถูกยกเลิก หัก หรือถูกระงับ หรือแม้กระทั่งถูกดำเนินการในบัญชีดำ.
          เพื่อหลีกเลี่ยงความเข้าใจผิดเกี่ยวกับข้อความ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของกิจกรรมนี้.
        `,
      hi_IN: `
          कार्यक्रम शुरू होने के बाद, आप पंजीकरण के बाद स्वचालित रूप से भाग लेंगे।.
          कार्यक्रम अवधि के दौरान, यदि सीधे सदस्य ${
            agentMonthsMinAndMax.value?.commissionMin?.[703] ?? 0
          } NOW$$currency$$ से अधिक का रिचार्ज करते हैं, तो आप ${
        agentMonthsMinAndMax.value?.rewardMax?.[703] ?? 0
      } NOW$$currency$$ तक का पुरस्कार प्राप्त कर सकते हैं।.
          बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से क्लिक करके प्राप्त किया जा सकता है, सांख्यिकी अवधि पिछले महीने की है, और प्राप्ति अवधि अगले महीने की है, जो हर महीने 1 से 15 तारीख तक 23:59:59 तक सीमित है। यदि इस अवधि के भीतर प्राप्त नहीं किया गया, तो इसे त्याग मान लिया जाएगा।.
          इस कार्यक्रम के सभी बोनस को निकालने के लिए ${
            everyDayBetActiveText.multipleCount ?? 0
          } गुना टर्नओवर की आवश्यकता होती है।.
          यह कार्यक्रम केवल खाते के धारक द्वारा सामान्य रूप से संचालित करने के लिए है। किराए पर लेना, धोखा देना, बॉट का उपयोग करना, विभिन्न खातों के साथ खेलना, आपस में ब्रश करना, मध्यस्थता, इंटरफेस, समझौता, कमजोरियों का लाभ उठाना, समूह नियंत्रण और अन्य तकनीकी तरीकों का उपयोग वर्जित है। अन्यथा, पुरस्कारों को रद्द, घटित, फ्रीज या यहां तक कि काले सूची में डाला जा सकता है।.
          पाठ की व्याख्या में भिन्नता से बचने के लिए, मंच इस कार्यक्रम के अंतिम व्याख्या अधिकारों को सुरक्षित रखता है।.
        `,
    };
    const ty12 = {
      zh_CN: `
          活动开始后，您注册后将自动参加。
          北京时间每月28日-07日，每月08日-17日，每月18日-27日。
          对应活动期间只要存款${everyDayBetActiveText?.memberRecharge?.['zh_CN']}CNY以上，即可在每月08日、18日、28日登录领取最高${everyDayBetActiveText?.memberDayaward?.['zh_CN']}CNY奖励。
          奖金仅支持用户手动点击领取，会员可在北京时间每月08日、18日、28日12:00后登录领取，领取期限为3天，第3天23:59:59前未领取视为放弃。
          本次活动的所有奖金，需要${setTxtcontent.value.multiple}倍流水才能提现。
          本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
          为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
        `,
      en_US: `
          Once the event starts, registering will automatically enroll you.
          From 12:00 AM on the 28th to the 7th, from the 8th to the 17th, and from the 18th to the 27th (Beijing time), every month.
          During the event period, just deposit ${everyDayBetActiveText?.memberRecharge?.['en_US']} USDT or more requirements to log in on the 8th, 18th, and 28th of each month and claim up to ${everyDayBetActiveText?.memberDayaward?.['en_US']} USDT in rewards.
          Bonuses can only be claimed manually. Log in to claim your bonus starting at 12:00 PM (Beijing time) on the 8th, 18th, and 28th of each month. The claim period is 3 days, and if not claimed by 23:59:59 on the third day, it will be forfeited.
          All bonuses from this promotion require just ${setTxtcontent.value.multiple}x turnover to withdraw.
          This promotion is strictly for normal operations by the account holder. Renting accounts, using bots, fraud, multiple accounts, collusion, arbitration, exploiting system flaws, or any other technical means are prohibited. Otherwise, bonuses may be canceled, deducted, accounts frozen, or blacklisted. In case of any dispute, the platform reserves the final right of interpretation.
        `,
      pt_BR: `
          Assim que o evento começar, ao se registrar, você estará automaticamente participando.
          Das 00:00 do dia 28 ao dia 07, das 00:00 do dia 08 ao dia 17 e das 00:00 do dia 18 ao dia 27 (horário de Pequim), todo mês.
          Durante o período do evento, basta fazer um depósito de ${everyDayBetActiveText?.memberRecharge?.['pt_BR']} BRL ou mais para fazer login nos dias 08, 18 e 28 de cada mês e receber até ${everyDayBetActiveText?.memberDayaward?.['pt_BR']} BRL de bônus.
          Os bônus só podem ser resgatados manualmente. Você pode fazer login e resgatar seu bônus a partir das 12:00 (horário de Pequim) nos dias 08, 18 e 28 de cada mês. O prazo é de 3 dias, e se não for resgatado até as 23:59:59 do terceiro dia, será considerado como desistência.
          Todos os bônus desta promoção exigem apenas ${setTxtcontent.value.multiple}x de apostas para poder sacar.
          Esta promoção é exclusiva para operações normais realizadas pelo titular da conta. É proibido alugar contas, usar bots, fraudes, múltiplas contas, conluio, arbitragem, manipulação de falhas, ou qualquer outro meio técnico. Caso contrário, os bônus podem ser cancelados, deduzidos, contas congeladas ou incluídas na lista negra. Em caso de dúvidas sobre o regulamento, a plataforma se reserva o direito de decisão final.
        `,
      vi_VN: `
          Khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
          Theo giờ Bắc Kinh từ ngày 28 đến ngày 07 hàng tháng, từ ngày 08 đến ngày 17 hàng tháng và từ ngày 18 đến ngày 27 hàng tháng.
          Trong thời gian diễn ra sự kiện chỉ cần nạp ${everyDayBetActiveText?.memberRecharge?.['vi_VN']} KVND trở lên, đăng nhập vào ngày 08, 18 và 28 hàng tháng để nhận tiền thưởng tối đa lên tới ${everyDayBetActiveText?.memberDayaward?.['vi_VN']} KVND.
          Phần thưởng chỉ hỗ trợ người dùng nhận thủ công. Hội viên có thể đăng nhập để nhận phần thưởng sau 12:00 ngày 8, 18 và 28 hàng tháng, thời gian quy đổi là 3 ngày, đến 23:59:59 ngày thứ ba không nhận sẽ được coi là bỏ cuộc, tiền thưởng sẽ tự động bị khấu trừ.
          Tất cả tiền thưởng từ sự kiện này yêu cầu ${setTxtcontent.value.multiple} lần tiền vòng cược mới có thể rút.
          Hoạt động này được chủ tài khoản giới hạn ở các hoạt động bình thường. Nghiêm cấm cho thuê, sử dụng gian lận, robot, đồng thời sử dụng các tài khoản khác nhau, đánh lừa lẫn nhau, phân xử, giao diện, giao thức, khai thác lỗ hổng, kiểm soát nhóm và các phương tiện kỹ thuật khác. Nếu phát hiện phần thưởng có thể bị hủy hoặc khấu trừ, bị đóng băng hoặc thậm chí bị đưa vào danh sách đen.
          Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
        `,
      th_TH: `
        `,
      hi_IN: `
       `,
    };
    const ty13 = {
      zh_CN: `
          活动开始后，您注册后将自动参加。
          会员每日${fixedTime.value.fixed_start_at}-${fixedTime.value.fixed_end_at}期间内总存款${rechargeActiveText?.rechargeMount?.['zh_CN']}CNY，完成总存款${rechargeActiveText.bet}倍有效投注，该会员可在当天${fixedTime.value.fixed_end_at}一键领取${rechargeActiveText?.rechargeBet?.['zh_CN']}CNY奖金。
          奖金仅支持用户手动点击领取，领取期限为1天，当天23:59:59前未领取视为放弃。
          本次活动的所有奖金，需要${setTxtcontent.value.multiple}倍流水才能提现。
          本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
          为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
        `,
      en_US: `
          Once the event starts, registering will automatically enroll you.
          Members who deposit a total of ${rechargeActiveText?.rechargeMount?.['en_US']} USDT between ${fixedTime.value.fixed_start_at}-${fixedTime.value.fixed_end_at} and complete valid bets worth ${rechargeActiveText.bet} times the deposited amount can claim a ${rechargeActiveText?.rechargeBet?.['en_US']} USDT bonus at ${fixedTime.value.fixed_end_at} the same day with just one click.
          The bonus must be claimed manually. The claim period is 1 day, and if not claimed by 11:59:59 PM on the same day, it will be forfeited.
          All bonuses from this promotion require ${setTxtcontent.value.multiple} times turnover to be withdrawn.
          This promotion is strictly for account holders and legitimate operations. Account rentals, cheats, bots, multiple accounts, collusion, arbitration, or technical methods like exploiting system loopholes are prohibited. Otherwise, bonuses may be canceled, deducted, and the account frozen or blacklisted.
          To avoid any misunderstandings, the platform reserves the final right to interpret this promotion.
        `,
      pt_BR: `
          Assim que o evento começar, ao se registrar, você estará automaticamente participando.
          Membros que depositarem um total de ${rechargeActiveText?.rechargeMount?.['pt_BR']} BRL entre ${fixedTime.value.fixed_start_at}-${fixedTime.value.fixed_end_at} e realizarem apostas válidas no valor de ${rechargeActiveText.bet}  vezes o depósito poderão resgatar um bônus de ${rechargeActiveText?.rechargeBet?.['pt_BR']} BRL  às ${fixedTime.value.fixed_end_at} no mesmo dia com apenas um clique.
          O bônus deve ser resgatado manualmente. O prazo é de 1 dia, e caso não seja resgatado até 23:59:59 do mesmo dia, será considerado como perdido.
          Todos os bônus desta promoção precisam de ${setTxtcontent.value.multiple} vez de apostas para serem sacados.
          Esta promoção é exclusiva para o titular da conta e para operações legítimas. É proibido o aluguel de contas, o uso de trapaças, bots, múltiplas contas, conluio, arbitragem ou qualquer método técnico, como exploração de falhas no sistema. Caso contrário, os bônus podem ser cancelados, deduzidos, e a conta pode ser congelada ou colocada na lista negra.
          Para evitar dúvidas de interpretação, a plataforma se reserva o direito de decisão final sobre esta promoção.
        `,
      vi_VN: `
          Khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
          Tổng số tiền gửi của hội viên là ${rechargeActiveText?.rechargeMount?.['vi_VN']} KVND trong khoảng thời gian ${fixedTime.value.fixed_start_at}-${fixedTime.value.fixed_end_at} mỗi ngày và hoàn thành điều kiện đặt cược ${rechargeActiveText.bet} lần số tiền nạp. Hội viên có thể nhận tiền thưởng lên tới ${rechargeActiveText?.rechargeBet?.['vi_VN']} KVND vào lúc ${fixedTime.value.fixed_end_at} cùng ngày hôm đó.
          Phần thưởng chỉ hỗ trợ người dùng nhận thủ công. Thời gian quy đổi là 1 ngày. Việc không nhận phần thưởng trước 23:59:59 cùng ngày sẽ được coi là bỏ cuộc, tiền thưởng sẽ tự động khấu trừ.
          Tất cả tiền thưởng từ sự kiện này yêu cầu ${setTxtcontent.value.multiple} lần tiền vòng cược mới có thể rút.
          Hoạt động này được chủ tài khoản giới hạn ở các hoạt động bình thường. Nghiêm cấm cho thuê, sử dụng gian lận, robot, đồng thời sử dụng các tài khoản khác nhau, đánh lừa lẫn nhau, phân xử, giao diện, giao thức, khai thác lỗ hổng, kiểm soát nhóm và các phương tiện kỹ thuật khác. Nếu phát hiện phần thưởng có thể bị hủy hoặc khấu trừ, bị đóng băng hoặc thậm chí bị đưa vào danh sách đen.
          Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.

        `,
      th_TH: `
        `,
      hi_IN: `
       `,
    };
    const ty15 = {
      zh_CN: `
          活动开始后，您注册后将自动参加。凡是通过【钱包支付，加密货币】每日充值的会员，次日就有机会获得惊喜神秘盲盒彩金。
          充值越多，奖励越多，最高${chargeDynamicText.currentMoney?.['701'] || 0}CNY。
          获得奖励资格后，会在次日12点后更新，请等待奖励发放。
          奖金仅支持用户手动点击领取，领取期限为1天，次日23:59:59前未领取视为放弃。
          本次活动的所有奖金，需要${setTxtcontent.value.multiple}倍流水才能提现。
          本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
          为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
        `,
      en_US: `
          Once the event begins, you will be automatically enrolled upon registration.All members who top up via [digital wallet or cryptocurrency] daily will have a chance to win a surprise mystery box prize the next day.The more you top up, the higher the rewards, up to ${
            agentDaysMinAndMax.value?.rewardMax?.[706] ?? 0
          }USDT.
          Once you qualify for the reward, it will be updated and distributed after 12:00 PM the following day. Please wait for the release.
          Rewards must be manually claimed by users. The redemption period is 24 hours, and any unclaimed rewards by 11:59:59 PM the next day will be considered forfeited.
          All rewards from this event require a ${
            setTxtcontent.value.multiple
          } times turnover before withdrawal is allowed.
          This event is limited to normal activities conducted by the account owner. Renting accounts, using cheats, bots, multiple accounts, mutual tricks, arbitration, exploiting vulnerabilities, mass control, or any technical manipulation is strictly prohibited. Otherwise, rewards may be canceled, deducted, frozen, or result in blacklisting.
          To avoid misunderstandings in interpreting the text, the platform reserves the right to the final interpretation of this event.
        `,
      pt_BR: `
          Após o início do evento, você será automaticamente inscrito ao se registrar.Todos os membros que recarregarem via [carteira digital ou criptomoedas] {{diariamente}} terão a chance de ganhar uma surpresa em forma de um prêmio de caixa misteriosa no dia seguinte.Quanto mais você recarregar, maior será a recompensa, podendo chegar a ${
            agentDaysMinAndMax.value?.rewardMax?.[702] ?? 0
          }BRL.
          Após se qualificar para o prêmio, ele será atualizado e liberado após às 12h do dia seguinte. Aguarde pela distribuição.
          Os prêmios devem ser resgatados manualmente pelos usuários. O prazo para resgate é de 24 horas. Caso o resgate não seja feito até as 23h59m59s do dia seguinte, será considerado como renúncia.
          Todos os prêmios deste evento exigem um giro de ${
            setTxtcontent.value.multiple
          } vezes para serem sacados.
          Este evento é restrito a operações normais realizadas pelo titular da conta. É proibido o uso de contas alugadas, fraudes, bots, múltiplas contas, trapaças mútua, arbitragem, exploração de vulnerabilidades, automação em massa ou quaisquer outros meios técnicos. Caso contrário, as recompensas podem ser canceladas, deduzidas, congeladas ou até mesmo resultar em banimento.
          Para evitar mal-entendidos na interpretação do texto, a plataforma reserva o direito de decisão final sobre este evento.
        `,
      vi_VN: `
          Khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.Tất cả các thành viên nạp tiền thông qua [Thanh toán bằng ví, tiền điện tử] Mỗi ngày sẽ có cơ hội nhận được phần thưởng hộp mù bí ẩn bất ngờ vào ngày hôm sau.Nạp càng nhiều thưởng càng cao, lên tới ${
            agentDaysMinAndMax.value?.rewardMax?.[704] ?? 0
          }KVND.
          Sau khi đủ tư cách nhận thưởng, phần thưởng sẽ được phát vào 12 giờ ngày hôm sau, vui lòng chờ đợi.
          Phần thưởng chỉ hỗ trợ người dùng nhận thủ công. Thời gian quy đổi là 24 giờ, việc không nhận phần thưởng trước 23:59:59 cùng ngày sẽ được coi là bỏ cuộc, tiền thưởng sẽ tự động khấu trừ.
          Tất cả tiền thưởng từ sự kiện này yêu cầu ${
            setTxtcontent.value.multiple
          }  lần tiền vòng cược mới có thể rút.
          Hoạt động này được chủ tài khoản giới hạn ở các hoạt động bình thường. Nghiêm cấm cho thuê, sử dụng gian lận, robot, đồng thời sử dụng các tài khoản khác nhau, đánh lừa lẫn nhau, phân xử, giao diện, giao thức, khai thác lỗ hổng, kiểm soát nhóm và các phương tiện kỹ thuật khác. Nếu phát hiện phần thưởng có thể bị hủy hoặc khấu trừ, bị đóng băng hoặc thậm chí bị đưa vào danh sách đen.
          Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
        `,
      th_TH: `
        `,
      hi_IN: `
       `,
    };
    if (type == 1) return ty1;
    if (type == 2) return ty2;
    if (type == 3) return redBagNewTem;
    if (type == 4) return ty4;
    if (type == 'newRedTemp') return redBagNewTem;
    if (type == 6) return ty6;
    if (type == 7) return get_text_ty7(platform_range, highestNum, get_leftValues);
    if (type == 9) return get_text_ty9(ruleData, highestNum, get_leftValues, currencyName.value);
    if (type == 14)
      return get_text_ty14(
        ruleData,
        ref(chargeDynamicText.currentMoney?.['701']),
        get_leftValues,
        currencyName.value,
      );
    if (type == 8) return ty8;
    if (type == 10) return ty10;
    if (type == 11) return ty11;
    if (type == 12) return ty12;
    if (type == 13) return ty13;
    if (type == 15) return ty15;
  }

  function handleClickTranslation() {
    if (!contentList.value[0].transitionValue) {
      message.error(t('v.bannner.origin_transitionValue'));
      return false;
    }

    translateContentList(
      contentList.value,
      contentList.value[0].transitionValue,
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
</script>

<style scoped lang="less">
  .insertActive ::v-deep(.ant-upload-list-picture-card-container) {
    display: none;
  }

  .insertActive ::v-deep(.avatar-uploader > .ant-upload) {
    width: 128px;
    height: 128px;
  }

  .insertActive ::v-deep(.ant-upload-select-picture-card i) {
    color: #999;
    font-size: 32px;
  }

  .insertActive ::v-deep(.ant-upload-select-picture-card .ant-upload-text) {
    margin-top: 8px;
    color: #666;
  }
</style>
<style lang="less">
  html,
  body {
    width: auto;
    height: auto;
  }
</style>
<style lang="less" scoped>
  .border-active-color {
    border-color: @primary-color;
  }

  .insertActive {
    .headerTile {
      //height: 45px;
      padding-left: 20px;
      //padding: 5px 24px 0;
      background-color: #fff;

      .headingLeft {
        display: flex;
        align-items: center;
        margin: 4px 0;
        overflow: hidden;
        font-size: 1rem;
        font-weight: 500;
        line-height: 45px;
      }
    }
  }

  .image-container {
    position: relative;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    /* 初始时设置透明度为0 */
    transition: opacity 0.3s ease;
    opacity: 0;
    background-color: rgb(0 0 0 / 50%);

    /* 添加过渡效果 */
  }

  .image-container:hover .overlay {
    opacity: 1;

    /* 鼠标移上去时设置透明度为1 */
  }

  .ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked {
    background-color: @primary-color;
    color: #fff;
  }

  .bg {
    background-color: #2f4553;
    color: #fff;
  }

  .tg-rich-area {
    /deep/ table {
      border-collapse: collapse;
      border-width: 1px;
      border-style: solid;
      border-color: #fff;
    }

    /deep/ table td {
      border-width: 1px;
      border-style: solid;
      border-color: #fff;
    }
  }
</style>
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
        // width: 112px;
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
    background-color: transparent;
  }

  ::v-deep(.vben-page-wrapper-content-bg) {
    background-color: transparent !important;
  }

  /* .vben-page-wrapper {
  background: #EEF1F7; //藏在bg-white里面，所以强制设定背景颜色
}
*/
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
  }

  .dropEnvelope {
    ::v-deep(.ant-form-item-label) {
      display: flex;
      align-items: center;
      justify-content: end;
    }
  }

  // :deep(.ant-form-large){
  //   .ant-form-item-control-input{
  //     // min-height: 20px
  //  }
  // }
</style>
