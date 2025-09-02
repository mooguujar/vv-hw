<template>
  <div class="rakeback-configuration rounded-4px h-100% relative">
    <Loading v-if="loading" :loading="loading" :absolute="false" />
    <div class="bg-[#E0E5EF] py-20px pl-8 h-100%" v-else>
      <Button
        type="primary"
        @click="receive"
        v-if="isHasAuth('10515')"
        :size="'large'"
        class="top-40px right-40px !absolute z-6"
        >{{ $t('common.rakeback_record') }}</Button
      >
      <div class="h-100%">
        <Form-item
          :name="`${$t('modalForm.member.member_mode_selection')}`"
          :label="`${$t('modalForm.member.member_mode_selection')}:`"
          :labelAlign="'left'"
        >
          <Radio-group
            v-model:value="tableConifg.mode"
            button-style="solid"
            :disabled="isControlValueSet()"
          >
            <Radio-button v-for="item in options.mode" :key="item.label" :value="item.value"
              >{{ item.label }}
            </Radio-button>
          </Radio-group>
        </Form-item>
        <!-- <Form-item
            style="margin-left: 10px"
            :labelCol="{ span: labelCol }"
            :name="`${$t('modalForm.member.member_issuance_time_zone')}`"
            :label="`${$t('modalForm.member.member_issuance_time_zone')}:`"
          >
            <Select
              v-model:value="tableConifg.settle_tz"
              style="width: 580px"
              :disabled="isControlValueSet()"
              size="large"
              :placeholder="$t('common.inputText')"
            >
              <Select-option v-for="item in options.timeZone" :key="item.label" :value="item.value"
                >{{ item.label }}
              </Select-option>
            </Select>
          </Form-item>
          <Form-item
            style="margin-left: 10px"
            :labelCol="{ span: labelCol }"
            :name="t('table.system.system_delivery_time')"
            :label="`${t('table.system.system_delivery_time')}:`"
          >
            <Select
              v-model:value="tableConifg.settle_at"
              style="width: 580px"
              size="large"
              :disabled="
                isControlValueSet() || tableConifg.automatic1 == 3 || tableConifg.automatic2 == 3
              "
              :placeholder="$t('common.inputText')"
            >
              <Select-option v-for="item in options.timeData" :key="item.label" :value="item.value"
                >{{ item.label }}
              </Select-option>
            </Select>
          </Form-item> -->
        <Form-item
          v-if="tableConifg.mode === '1'"
          :name="`${t('table.system.system_issue_way')}VIP`"
          :labelAlign="'left'"
          :label="`${t('table.system.system_issue_way')}:`"
        >
          <Select
            v-model:value="tableConifg.automatic1"
            :disabled="isControlValueSet()"
            style="width: 30%"
            size="large"
            class="de-select"
          >
            <Select-option
              v-for="item in options.automaticVIP"
              :key="item.label"
              :value="item.value"
            >
              {{ item.label }}
            </Select-option>
          </Select>
        </Form-item>
        <Form-item
          v-else
          :name="t('modalForm.member.member_distribution_method_tiers')"
          :labelAlign="'left'"
          :label="`${t('table.system.system_issue_way')}:`"
          size="large"
        >
          <Select
            v-model:value="tableConifg.automatic2"
            :disabled="isControlValueSet()"
            style="width: 580px"
            size="large"
            class="de-select"
          >
            <Select-option
              v-for="item in options.automaticTiji"
              :key="item.label"
              :value="item.value"
              >{{ item.label }}
            </Select-option>
          </Select>
        </Form-item>
        <Form-item
          v-if="tableConifg.mode === '1'"
          :name="t('modalForm.member.member_level_selection')"
          :labelAlign="'left'"
          :label="`${t('modalForm.member.member_level_selection')}:`"
        >
          <Radio-group
            button-style="solid"
            :disabled="isControlValueSet()"
            v-model:value="tableConifg.vip_unified"
            @change="changeLevelChooice"
          >
            <Radio-button v-for="item in options.vip_unified" :key="item.label" :value="item.value"
              >{{ item.label }}
            </Radio-button>
          </Radio-group>
        </Form-item>
        <Form-item
          v-if="tableConifg.mode === '2'"
          :name="t('common.VenueMode')"
          :labelAlign="'left'"
          :label="`${t('common.VenueMode')}:`"
        >
          <Radio-group
            button-style="solid"
            v-model:value="tableConifg.unified_sum"
            :name="t('common.VenueMode')"
            :disabled="isControlValueSet()"
            @change="changVenue"
          >
            <Radio-button v-for="item in options.unified_sum" :key="item.label" :value="item.value"
              >{{ item.label }}
            </Radio-button>
          </Radio-group>
        </Form-item>
        <Form-item
          v-if="tableConifg.mode === '2'"
          :labelAlign="'left'"
          :name="t('modalForm.member.member_venue_selection')"
          :label="`${t('modalForm.member.member_venue_selection')}:`"
        >
          <Radio-group
            button-style="solid"
            v-model:value="tableConifg.venue"
            :name="t('modalForm.member.member_venue_selection')"
            :disabled="isControlValueSet() || tableConifg.unified_sum == 1"
          >
            <Radio-button v-for="item in options.venue" :key="item.label" :value="item.value"
              >{{ item.label }}
            </Radio-button>
          </Radio-group>
        </Form-item>
        <Form-item
          v-if="tableConifg.mode === '2'"
          :labelAlign="'left'"
          :name="t('common.currency_mode')"
          :label="`${t('common.currency_mode')}:`"
        >
          <Radio-group
            button-style="solid"
            v-model:value="tableConifg.unified"
            :name="t('modalForm.member.member_currency_selection')"
            :disabled="isControlValueSet()"
          >
            <Radio-button v-for="item in options.unified" :key="item.label" :value="item.value"
              >{{ item.label }}
            </Radio-button>
          </Radio-group>
        </Form-item>
        <Form-item
          v-if="tableConifg.mode === '2' && tableConifg.unified === '2'"
          :labelAlign="'left'"
          :name="t('modalForm.member.member_currency_type')"
          :label="`${t('modalForm.member.member_currency_type')}:`"
        >
          <Radio-group
            button-style="solid"
            v-model:value="tableConifg.currency_type"
            :disabled="isControlValueSet()"
          >
            <Radio-button
              v-for="item in options.currency_type"
              :key="item.label"
              :value="item.value"
              >{{ item.label }}
            </Radio-button>
          </Radio-group>
        </Form-item>
        <!-- vip 等级 > 单独配置 -->
        <Form-item
          v-if="tableConifg.mode === '1' && tableConifg.vip_unified === '2'"
          :labelAlign="'left'"
          :name="t('business.commin_vip_level')"
          :label="`${t('business.commin_vip_level')}: `"
          class="de-form-item"
        >
          <Space class="space-box mr-20px">
            <Button
              :class="{ 'ant-btn-primary': VIPLevelActiveIndex === +index }"
              class="w-[73px]"
              style="padding: 0 !important"
              v-for="(item, index) in allVipConfig"
              :key="index"
              :disabled="isControlValueSet()"
              @click="changeVIPLevelActiveIndex(item, index)"
              >{{ 'VIP' + item.level }}</Button
            >
          </Space>
        </Form-item>
        <!-- 梯级 > 单独货币 > 法币-->

        <Form-item
          :labelAlign="'left'"
          :name="t('modalForm.member.member_currency_selection')"
          :label="`${t('modalForm.member.member_currency_selection')}:`"
          class="de-form-item"
          v-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1'
          "
        >
          <Space class="space-box" :size="20">
            <Button
              :class="{ 'ant-btn-primary': currentCurrencyFaIndex === index }"
              v-for="(item, index) in suportedCurrency.fabi"
              :key="index"
              size="large"
              :disabled="isControlValueSet()"
              @click="
                currentFaCurrency = item;
                currentCurrencyFaIndex = index;
              "
            >
              <div class="flex align-center">
                <CdIconCurrency class="!w-4 mr-[6px]" :icon="currencyCodeMap[item].name" />
                {{ currencyCodeMap[item].name }}
              </div>
            </Button>
          </Space>
        </Form-item>
        <!-- 梯级 > 单独货币 > 加密货币-->
        <Form-item
          :labelAlign="'left'"
          :name="t('modalForm.member.member_currency_selection')"
          :label="`${t('modalForm.member.member_currency_selection')}:`"
          class="de-form-item"
          v-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '2'
          "
        >
          <Space class="space-box" :size="20">
            <Button
              :class="{ 'ant-btn-primary': currentCurrencyCindex === index }"
              size="large"
              v-for="(item, index) in suportedCurrency.crypto"
              :key="index"
              :disabled="isControlValueSet()"
              @click="
                currentCCurrency = item;
                currentCurrencyCindex = index;
              "
            >
              <div class="flex align-center">
                <CdIconCurrency class="!w-4 mr-[6px]" :icon="currencyCodeMap[item].name" />
                {{ currencyCodeMap[item].name }}
              </div>
            </Button>
          </Space>
        </Form-item>
        <!-- VIP模式 -->
        <yhTabs
          v-if="tableConifg.mode === '1'"
          :key="tableConifg.vip_unified + VIPLevelActiveIndex"
          v-model="dragTabIndex"
          :tabList="dragTabList.vip"
          dragKey="game_type"
          groupName="vip"
          @drag-end="dragEnd"
          :disabled="isControlValueSet()"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
              >
                <Draggable
                  v-if="item.data"
                  :list="item.data"
                  class="flex flex-wrap"
                  :item-key="item.game_type"
                  :disabled="isControlValueSet()"
                  @end="dragVenueEnd(item)"
                >
                  <template #item="{ element }">
                    <div v-if="element['show'] == 1" class="drawborder">
                      <img class="prefix-icon-move move cursor moveIcon" :src="dragger" />
                      <Form layout="vertical">
                        <FormItem labelAlign="left">
                          <template #label>
                            <span>{{ element['name'] }}</span>
                          </template>
                          <Input
                            size="large"
                            class="!w-30"
                            :placeholder="$t('common.inputText')"
                            v-model:value="element['rate']"
                            addon-after="%"
                            :disabled="isControlValueSet()"
                          />
                        </FormItem>
                      </Form>
                    </div>
                  </template>
                </Draggable>
              </Form-item>
            </div>
          </template>
        </yhTabs>
        <!-- 统一币种 -->
        <yhTabs
          v-if="tableConifg.mode === '2' && tableConifg.unified === '1'"
          :key="forceUpdate"
          v-model="dragTabIndex"
          :tabList="dragTabList[0]"
          dragKey="game_type"
          groupName="2"
          class="moveTable"
          @drag-end="dragEnd"
          :disabled="isControlValueSet()"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div v-if="element['show'] == 1" class="draggable-button ant-btn">
                        <img class="w-[20px] prefix-icon-move move cursor mr-2" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-if="column.key === 'unified_cur'">
                    <Select
                      v-model:value="tableConifg.unified_cur"
                      label-in-value
                      style="width: 120px"
                      :dropdown-match-select-width="false"
                      @change="handleChange"
                      :placeholder="t('common.chooseText')"
                      option-label-prop="children"
                      :disabled="isControlValueSet()"
                      size="large"
                    >
                      <SelectOption
                        v-for="item of options_coin"
                        :key="item.value"
                        :value="item.value"
                      >
                        <div style="display: flex">
                          <div class="mr-1 w-18px h-18px -mt-1px">
                            <cdIconCurrency
                              :icon="currentyOptions[item.value]"
                              class="w-18px mt--3px"
                            />
                          </div>
                          {{ item.label }}
                        </div>
                      </SelectOption>
                    </Select>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only4decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only4decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 4 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(0)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(0)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(0)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(0)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- CNY -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1' &&
            currentFaCurrency === '701'
          "
          :key="forceUpdate + 1"
          v-model="dragTabIndex"
          :tabList="dragTabList[701]"
          dragKey="game_type"
          groupName="2"
          class="moveTable"
          @drag-end="dragEnd"
          :disabled="isControlValueSet()"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only2decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only2decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 2 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[701].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        size="large"
                        :disabled="isControlValueSet()"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(701)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(701)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(701)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(701)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- BRL -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1' &&
            currentFaCurrency === '702'
          "
          :key="forceUpdate + 2"
          v-model="dragTabIndex"
          :tabList="dragTabList[702]"
          dragKey="game_type"
          groupName="2"
          class="moveTable"
          @drag-end="dragEnd"
          :disabled="isControlValueSet()"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only2decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only2decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 2 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[702].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(702)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(702)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(702)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(702)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- VND -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1' &&
            currentFaCurrency === '703'
          "
          :key="forceUpdate + 3"
          v-model="dragTabIndex"
          :tabList="dragTabList[703]"
          dragKey="game_type"
          groupName="2"
          class="moveTable"
          @drag-end="dragEnd"
          :disabled="isControlValueSet()"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only2decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only2decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 2 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[703].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        size="large"
                        :disabled="isControlValueSet()"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(703)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(703)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(703)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(703)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- INR -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1' &&
            currentFaCurrency === '704'
          "
          :key="forceUpdate + 4"
          v-model="dragTabIndex"
          :tabList="dragTabList[704]"
          dragKey="game_type"
          groupName="2"
          :disabled="isControlValueSet()"
          class="moveTable"
          @drag-end="dragEnd"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only2decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only2decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 2 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[704].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(704)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(704)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(704)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(704)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- THB -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1' &&
            currentFaCurrency === '705'
          "
          :key="forceUpdate + 5"
          v-model="dragTabIndex"
          :tabList="dragTabList[705]"
          dragKey="game_type"
          groupName="2"
          :disabled="isControlValueSet()"
          class="moveTable"
          @drag-end="dragEnd"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only2decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only2decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 2 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[705].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(705)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(705)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(705)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(705)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- EUR -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1' &&
            currentFaCurrency === '710'
          "
          :key="forceUpdate + 6"
          v-model="dragTabIndex"
          :tabList="dragTabList[710]"
          dragKey="game_type"
          groupName="2"
          :disabled="isControlValueSet()"
          class="moveTable"
          @drag-end="dragEnd"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only2decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only2decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 2 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[710].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(710)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(710)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(710)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(710)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- JYP -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '1' &&
            currentFaCurrency === '711'
          "
          :key="forceUpdate + 7"
          v-model="dragTabIndex"
          :tabList="dragTabList[711]"
          dragKey="game_type"
          groupName="2"
          class="moveTable"
          @drag-end="dragEnd"
          :disabled="isControlValueSet()"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only2decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only2decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 2 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[711].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :disabled="isControlValueSet()"
                        v-model:value="record.data[column.index].rate"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(711)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(711)">
                        {{ t('common.delText') }}
                      </Button> -->
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(711)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(711)"
                    />
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <!-- USDT -->
        <yhTabs
          v-else-if="
            tableConifg.mode === '2' &&
            tableConifg.unified === '2' &&
            tableConifg.currency_type === '2' &&
            currentCCurrency === '706'
          "
          :disabled="isControlValueSet()"
          :key="forceUpdate + 8"
          v-model="dragTabIndex"
          :tabList="dragTabList[706]"
          dragKey="game_type"
          groupName="2"
          class="moveTable"
          @drag-end="dragEnd"
        >
          <template #default="{ item }">
            <div class="yh-tab-pane">
              <!-- 梯级 > 场馆拖拽-->
              <Form-item
                :labelAlign="'left'"
                :name="t('table.system.system_sort_sliader_side_site_1')"
                :label="`${t('table.system.system_sort_sliader_side_site_1')}:`"
                class="de-form-item"
                v-if="tableConifg.venue == '1'"
              >
                <Space class="space-box">
                  <Draggable
                    :list="dragTabList[getKey()][dragTabIndex].config[0].data"
                    class="flex flex-wrap"
                    item-key="id"
                    :disabled="isControlValueSet()"
                    @end="dragVenueEnd(dragTabList[getKey()][dragTabIndex].config[0])"
                  >
                    <template #item="{ element }">
                      <div class="draggable-button ant-btn">
                        <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                        <span>{{ element['name'] }}</span>
                      </div>
                    </template>
                  </Draggable>
                </Space>
              </Form-item>
              <Table
                :columns="getColumns()"
                :data-source="(item as any)?.config"
                :pagination="false"
                bordered
                size="small"
                ref="myTable"
                :scroll="{ x: 'max-content' }"
              >
                <template #headerCell="{ column, index }">
                  <template v-if="column.key === 'game'">
                    <span class="gameMove">
                      <img class="mr-2 prefix-icon-move move cursor" :src="dragger" />
                      {{ column.title }}
                    </span>
                  </template>
                  <div v-else class="no-drag" :data-index="index">
                    {{ column.title }}
                  </div>
                </template>
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.key === 'level'">
                    <span>{{ record.level }}</span>
                  </template>
                  <template v-else-if="column.key === 'valid_bet_amount'">
                    <FormItem
                      :validate-status="only4decimals.test(record.valid_bet_amount) ? '' : 'error'"
                    >
                      <template
                        v-if="
                          record.valid_bet_amount && !only4decimals.test(record.valid_bet_amount)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit', { len: 4 }) }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.valid_bet_amount"
                        :disabled="isControlValueSet()"
                        size="large"
                      >
                        <template #prefix>
                          <CdIconCurrency class="!w-5" :icon="currencyCodeMap[706].name" />
                        </template>
                      </Input>
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'rate'">
                    <FormItem
                      class="mr-0"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="only2decimalsMax100.test(record.rate) ? '' : 'error'"
                    >
                      <template v-if="record.rate && !only2decimalsMax100.test(record.rate)" #help>
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        :placeholder="$t('common.inputText')"
                        v-model:value="record.rate"
                        addon-after="%"
                        :disabled="isControlValueSet()"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'game'">
                    <FormItem
                      :name="index"
                      :label-col="{ style: { width: '120px' } }"
                      :validate-status="
                        only2decimalsMax100.test(record.data[column.index].rate) ? '' : 'error'
                      "
                    >
                      <template
                        v-if="
                          record.data[column.index].rate &&
                          !only2decimalsMax100.test(record.data[column.index].rate)
                        "
                        #help
                      >
                        <span>{{ t('modalForm.member.member_limit1') }}</span>
                      </template>
                      <Input
                        v-model:value="record.data[column.index].rate"
                        :disabled="isControlValueSet()"
                        addon-after="%"
                        size="large"
                      />
                    </FormItem>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <img
                      class="cursor-pointer"
                      :src="RECT_ADD"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="addRow(706)"
                    />
                    <img
                      :class="{ 'disabled-link': index !== item.config.length - 1 }"
                      class="cursor-pointer ml-5px"
                      :src="RECT_DELETE"
                      alt=""
                      :style="{
                        'pointer-events': 'auto',
                      }"
                      @click="delRow(706)"
                    />
                    <!-- <Button
                      
                        type="primary"
                        size="large"
                        @click="addRow(706)"
                        >{{ t('modalForm.member.member_increase') }}</Button
                      >
                      <Button v-else danger type="primary" size="large" @click="delRow(706)">
                        {{ t('common.delText') }}
                      </Button> -->
                  </template>
                </template>
              </Table>
            </div>
          </template>
        </yhTabs>
        <div class="flex items-center justify-center mt-50px">
          <Button type="primary" @click="onUpdate" :size="'large'" class="py-[10px] ! w-[20%]">
            {{ t('common.saveText') }}</Button
          >
        </div>
      </div>
    </div>
    <Receive @register="registerReceive" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onMounted, ref } from 'vue';
  import {
    FormItem,
    Input,
    Button,
    Space,
    message,
    Table,
    Select,
    SelectOption,
    RadioGroup,
    RadioButton,
    Radio,
    Form,
  } from 'ant-design-vue';
  import yhTabs from './common/yhTabs.vue';
  import Draggable from 'vuedraggable';
  import { isHasAuth } from '@/utils/authFunction';
  import CdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { getMemberRebateConfig, updateMeberConfigRebate } from '/@/api/member/index';
  import { cloneDeep } from 'lodash-es';
  import { commomVenueList } from '/@/settings/commonSetting';
  import dragger from '/@/assets/svg/dragger.svg';
  import { useCurrencyStore } from '/@/store/modules/currency';
  import { currentyOptions } from '/@/views/common/commonSetting';
  import Sortable from 'sortablejs';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useAutoTableLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
  import { isControlValueSet } from '/@/utils/domUtils';
  import RECT_ADD from '/@/assets/svg/rect-add.svg';
  import RECT_DELETE from '/@/assets/svg/rect-delete.svg';
  import { useSystemStore } from '/@/store/modules/system';
  import Loading from '/@/components/Loading/src/Loading.vue';
  import { useModal } from '/@/components/Modal';
  import Receive from './common/Receive.vue';

  const { t } = useI18n();
  const { getCurrencyList } = useCurrencyStore();
  const only2decimals = /^\d+(\.\d{1,2})?$/;
  const only2decimalsMax100 = /^(100(\.0{1,2})?|(\d{1,2})(\.\d{1,2})?)$/;
  const only4decimals = /^\d+(\.\d{1,4})?$/;
  const [registerReceive, { openModal: openReceive }] = useModal();

  const systemStore = useSystemStore();
  const accountingCurrency = ref('' as string);

  const fetchCurrency = () =>
    systemStore.getValidLangList('default').then((langData) => {
      accountingCurrency.value = langData?.default?.currency || '';
      tableConifg.value.unified_cur = accountingCurrency.value;
    });

  onMounted(() => {
    fetchCurrency();
  });

  const tableConifg = ref<Record<string, any>>({
    automatic1: '',
    automatic2: '',
    mode: '',
    vip_unified: '',
    venue: '',
    unified: '',
    unified_cur: '',
    currency_type: '',
    unified_sum: '1',
  });
  const loading = ref(true);
  const forceUpdate = ref(0);
  const currentFaCurrency = ref('701');
  const currentCCurrency = ref('706');
  const currentCurrencyFaIndex = ref(0);
  const currentCurrencyCindex = ref(0);
  //自定义变量
  const VIPLevelActiveIndex = ref(0);
  const myTable = ref(null);
  const tabLeft = ref(0);
  //统一的vip配置
  const onlyVipConfig = ref<any>({});
  const allVipConfig = ref<Record<string, any>>([]);
  const dragTabList = ref<any>({
    //vip
    vip: [],
    //梯级 统一币种
    0: [],
    //梯级 701币种
  });
  //支持的货币
  const suportedCurrency = ref<any>({
    fabi: ['701', '702', '703', '704', '705', '710', '711'],
    crypto: ['706'],
  });
  const usable_currency = ref(Object.values(suportedCurrency.value).flat());
  usable_currency.value = usable_currency.value.filter((item) => {
    return getCurrencyList.some((list_item) => list_item.id == item);
  });
  suportedCurrency.value.fabi = suportedCurrency.value.fabi.filter((item) => {
    return usable_currency.value.some((list_item) => list_item == item);
  });
  suportedCurrency.value.crypto = suportedCurrency.value.crypto.filter((item) => {
    return usable_currency.value.some((list_item) => list_item == item);
  });
  currentFaCurrency.value = suportedCurrency.value.fabi?.[0] ?? '';
  usable_currency.value.forEach((element) => {
    dragTabList.value[element as any] = [];
  });

  const currencyCodeMap = {
    '0': {
      name: 'USDT',
      icon: '111',
    },
    '701': {
      name: 'CNY',
      icon: '111',
    },
    '702': {
      name: 'BRL',
      icon: '111',
    },
    '703': {
      name: 'INR',
      icon: '111',
    },
    '704': {
      name: 'KVND',
      icon: '111',
    },
    '705': {
      name: 'THB',
      icon: '111',
    },
    '710': {
      name: 'EUR',
      icon: '111',
    },
    '711': {
      name: 'JPY',
      icon: '111',
    },
    '706': {
      name: 'USDT',
      icon: '111',
    },
  };
  const dragTabIndex = ref(0);
  //表格配置
  const options = {
    automaticVIP: [
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
    timeZone: [
      { label: t('common.china'), value: 'zh_CN' },
      { label: t('common.Brazil'), value: 'pt_BR' },
      { label: t('common.Vietnam'), value: 'vi_VN' },
      { label: t('common.India'), value: 'hi_IN' },
      { label: t('common.Universal'), value: 'utc' },
      { label: t('common.Eastern'), value: 'en_US' },
    ],
    timeData: [],
    automaticTiji: [
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
    mode: [
      { label: t('modalForm.member.member_lv_model'), value: '2' },
      { label: t('modalForm.member.member_vip_model'), value: '1' },
    ],
    vip_unified: [
      { label: t('modalForm.member.member_unified_conf'), value: '1' },
      { label: t('modalForm.member.member_separate_configuration'), value: '2' },
    ],
    venue: [
      { label: t('modalForm.member.member_unified_venue'), value: '1' },
      { label: t('modalForm.member.member_separate_venue'), value: '2' },
    ],
    unified: [
      { label: t('modalForm.member.member_unified_currency'), value: '1' },
      {
        label: t('modalForm.member.member_separate_currency'),
        value: '2',
      },
    ],
    currency_type: [
      { label: t('business.Fiat_currency'), value: '1' },
      { label: t('business.cryptocurrency_currency'), value: '2' },
    ],
    unified_sum: [
      { label: t('common.ConsolidateCalculations'), value: '1' },
      { label: t('common.CalculateSeparately'), value: '2' },
    ],
  };
  for (let hour = 4; hour <= 23; hour++) {
    options.timeData.push({
      label: `${hour}:00`,
      value: `${hour}`,
    });
  }

  function changVenue(e) {
    if (e.target.value == 1) tableConifg.value.venue = '1';
  }

  // 拖拽类型全都统一
  function dragEnd(data) {
    //拖拽终止
    if (!data.value) return;
    dragTabList.value[getKey()] = data;
    //要统一所有类型排序  真人 老虎机
    const orderList = data.value.map((item) => item.game_type);
    //先克隆统一赋值 防止页面渲染 先克隆不然等下值会找不到
    const dragTabList2 = cloneDeep(dragTabList.value);
    const onlyVipConfig2 = cloneDeep(onlyVipConfig.value);
    const allVipConfig2 = cloneDeep(allVipConfig.value);
    for (let key in dragTabList2) {
      if (key === 'vip') {
        //统一的vip配置
        onlyVipConfig2.forEach((item, index) => {
          onlyVipConfig2[index] = onlyVipConfig.value.find(
            (item2) => item2.game_type === orderList[index],
          );
        });
        // 单独配置的vip配置
        allVipConfig2.forEach((item, index) => {
          item.config.forEach((item2, index2) => {
            allVipConfig2[index].config[index2] = allVipConfig.value[index].config.find(
              (item3) => item3.game_type === orderList[index2],
            );
          });
        });
      } else {
        dragTabList2[key].forEach((item, index) => {
          dragTabList2[key][index] = dragTabList.value[key].find(
            (item2) => item2.game_type === orderList[index],
          );
        });
      }
    }
    //最后一起赋值
    onlyVipConfig.value = onlyVipConfig2;
    allVipConfig.value = allVipConfig2;
    dragTabList.value = dragTabList2;
    //修改梯级模式vip需要重新赋值问题
    if (getKey() !== 'vip') {
      if (tableConifg.value.vip_unified === '1') {
        dragTabList.value.vip = onlyVipConfig;
      } else {
        dragTabList.value.vip = allVipConfig2[VIPLevelActiveIndex.value];
      }
    }
  }
  // 拖拽场馆分模式
  function dragVenueEnd(allData) {
    if (!allData) return;
    const onlyVipConfig2 = cloneDeep(onlyVipConfig.value);
    const allVipConfig2 = cloneDeep(allVipConfig.value);
    const dragTabList2 = cloneDeep(dragTabList.value);
    const { data } = allData;
    const orderIDList = data.map((item) => item.id);
    if (tableConifg.value.mode === '1') {
      onlyVipConfig2[dragTabIndex.value].data.forEach((item, index) => {
        onlyVipConfig2[dragTabIndex.value].data[index] = onlyVipConfig.value[
          dragTabIndex.value
        ].data.find((item2) => item2.id === orderIDList[index]);
      });

      allVipConfig2.forEach((item, index) => {
        item.config[dragTabIndex.value].data.forEach((item2, index2) => {
          allVipConfig2[index].config[dragTabIndex.value].data[index2] = allVipConfig.value[
            index
          ].config[dragTabIndex.value].data.find((item3) => item3.id === orderIDList[index2]);
        });
      });
    } else {
      for (let key in dragTabList2) {
        if (key !== 'vip') {
          dragTabList2[key][dragTabIndex.value].config.forEach((item, index) => {
            item.data.forEach((item2, index2) => {
              dragTabList2[key][dragTabIndex.value].config[index].data[index2] = dragTabList.value[
                key
              ][dragTabIndex.value].config[index].data.find(
                (item3) => item3 && item3.id === orderIDList[index2],
              );
            });
          });
        }
      }
    }
    onlyVipConfig.value = onlyVipConfig2;
    allVipConfig.value = allVipConfig2;
    dragTabList.value = dragTabList2;
    forceUpdate.value += 1;
  }
  function setColumns() {
    if (tableConifg.value.mode === '2') {
      if (tableConifg.value.venue === '1') {
        if (tableConifg.value.unified == '1') {
          const columns1 = [
            {
              title: t('modalForm.member.member_step'),
              key: 'level',
              align: 'center',
              fixed: 'left',
            },
            {
              title: t('modalForm.member.member__currency_tip_1'),
              key: 'unified_cur',
              align: 'center',
            },
            {
              title: `${t('table.report.report_valid_bet_amount')} ≥`,
              key: 'valid_bet_amount',
              align: 'center',
            },
            {
              title: t('modalForm.member.member_rebate_ratio'),
              key: 'rate',
              align: 'center',
            },
            {
              title: t('business.common_operate'),
              key: 'action',
              align: 'center',
              fixed: 'right',
            },
          ];
          useAutoTableLabelWidth(columns1);
          return columns1;
        } else {
          const columns2 = [
            {
              title: t('modalForm.member.member_step'),
              key: 'level',
              align: 'center',
              fixed: 'left',
            },
            {
              title: `${t('table.report.report_valid_bet_amount')} ≥`,
              key: 'valid_bet_amount',
              align: 'center',
            },
            {
              title: t('modalForm.member.member_rebate_ratio'),
              key: 'rate',
              align: 'center',
            },
            {
              title: t('business.common_operate'),
              key: 'action',
              align: 'center',
              fixed: 'right',
            },
          ];
          useAutoTableLabelWidth(columns2);
          return columns2;
        }
      } else if (
        tableConifg.value.venue === '2' &&
        dragTabList.value[getKey()][dragTabIndex.value].config[0].data
      ) {
        function createColumns(includeCurrency) {
          const baseColumns = [
            {
              title: t('modalForm.member.member_step'),
              dataIndex: 'level',
              align: 'center',
            },
            {
              title: `${t('table.report.report_valid_bet_amount')} ≥`,
              key: 'valid_bet_amount',
              align: 'center',
            },
            ...dragTabList.value[getKey()][dragTabIndex.value].config[0].data
              .filter((item) => item.show == 1) // Filter out items where show !== 1
              .map((item, index) => ({
                title: item.name,
                index: index,
                key: 'game',
                align: 'center',
                width: item.name.length > 16 ? 260 : item.name.length > 8 ? 210 : 200,
                className: 'tableShow', // Since we are filtering for show == 1, we can directly assign 'tableShow'
              })),
            {
              title: t('business.common_operate'),
              key: 'action',
              align: 'center',
            },
          ];

          if (includeCurrency) {
            baseColumns.splice(1, 0, {
              title: t('modalForm.member.member__currency_tip_1'),
              key: 'unified_cur',
              align: 'center',
              width: 200,
            });
          }
          useAutoTableLabelWidth(baseColumns);
          return baseColumns;
        }

        initSortable();

        return createColumns(tableConifg.value.unified == '1');
      }
    }
  }
  function getColumns() {
    if (isControlValueSet()) {
      return setColumns()?.filter((p) => p.key !== 'action') || [];
    }
    return setColumns() || [];
  }
  function initSortable() {
    setTimeout(() => {
      const tableHeader: any = document.querySelector('.moveTable .ant-table-thead tr');
      if (tableHeader) {
        Sortable.create(tableHeader, {
          animation: 150,
          filter: '.no-drag',
          preventOnFilter: true,
          onMove: (event: any, originalEvent: any) => {
            if (
              tableConifg.value.mode === '2' &&
              tableConifg.value.unified === '2' &&
              tableConifg.value.currency_type === '1'
            ) {
              if (
                originalEvent.target?.firstElementChild?.className &&
                originalEvent.target?.firstElementChild?.className == 'no-drag'
              ) {
                return false; // Cancels the drag operation
              }
            }
            return true; // Allows the drag operation to proceed
          },
          onEnd: (event: any) => {
            const tableElement = myTable.value?.$el;
            const tableBody = tableElement?.querySelector('.ant-table-body');
            if (tableBody) tabLeft.value = tableBody.scrollLeft;

            if (tableConifg.value.unified === '1') {
              if (event.newIndex == 0 || event.newIndex == 1 || event.newIndex == 2) {
                dragVenueEnd(dragTabList.value[getKey()][dragTabIndex.value].config[0]);
              }
              let oldIndex = event.oldIndex - 3;
              let newIndex = event.newIndex - 3;
              let newdata = dragTabList.value[getKey()][dragTabIndex.value].config[0];

              const filteredList = newdata.data.filter((item) => item.show == '1');

              const movedColumn = filteredList.splice(oldIndex, 1)[0];
              filteredList.splice(newIndex, 0, movedColumn);

              newdata.data = [
                ...filteredList, // The reordered filtered items
                ...newdata.data.filter((item) => item.show != '1'), // The items where show !== "1"
              ];

              dragVenueEnd(newdata);
            }
            if (
              tableConifg.value.mode === '2' &&
              tableConifg.value.unified === '2' &&
              tableConifg.value.currency_type === '1'
            ) {
              if (event.newIndex == 0 || event.newIndex == 1) {
                dragVenueEnd(dragTabList.value[getKey()][dragTabIndex.value].config[0]);
              }
              let oldIndex = event.oldIndex - 2;
              let newIndex = event.newIndex - 2;
              let newdata = dragTabList.value[getKey()][dragTabIndex.value].config[0];

              const filteredList = newdata.data.filter((item) => item.show == '1');

              const movedColumn = filteredList.splice(oldIndex, 1)[0];
              filteredList.splice(newIndex, 0, movedColumn);

              newdata.data = [
                ...filteredList, // The reordered filtered items
                ...newdata.data.filter((item) => item.show != '1'), // The items where show !== "1"
              ];

              dragVenueEnd(newdata);
            }
            scrollToPosition();
          },
        });
      }
    }, 500);
  }

  const scrollToPosition = async () => {
    await nextTick(); // Ensures the DOM is fully updated
    const tableElement = myTable.value?.$el;
    const tableBody = tableElement?.querySelector('.ant-table-body');
    if (tableBody) {
      tableBody.scrollLeft = tabLeft.value; // Set the scroll position
    }
  };

  // const tableConifg.unified_cur = ref('');
  const handleChange = (e) => {
    tableConifg.value.unified_cur = e.value + '';
  };
  const options_coin = computed(() => {
    let arr = [...suportedCurrency.value.fabi, ...suportedCurrency.value.crypto];
    arr = arr.map((item) => ({
      value: item,
      label: currencyCodeMap[item].name,
    }));
    return arr;
  });
  //动态获取当前 draglist的key
  function getKey() {
    if (tableConifg.value.mode === '1') {
      return 'vip';
    } else if (tableConifg.value.unified === '1') {
      return '0';
    } else if (tableConifg.value.currency_type === '1') {
      return currentFaCurrency.value;
    } else {
      return currentCCurrency.value;
    }
  }
  function changeVIPLevelActiveIndex(item, index) {
    VIPLevelActiveIndex.value = index;
    dragTabList.value.vip = allVipConfig.value[VIPLevelActiveIndex.value].config;
  }
  function changeLevelChooice(e) {
    forceUpdate.value += 1;
    if (e.target.value === '1') {
      dragTabList.value.vip = onlyVipConfig.value;
    } else {
      dragTabList.value.vip = allVipConfig.value[VIPLevelActiveIndex.value].config;
    }
  }
  function addRow(key) {
    forceUpdate.value += 1;
    const data = cloneDeep(dragTabList.value[key][dragTabIndex.value].config[0].data).map(
      (item) => {
        return {
          id: item.id,
          name: item.name,
          rate: '0',
        };
      },
    );
    dragTabList.value[key][dragTabIndex.value].config.push({
      level: dragTabList.value[key][dragTabIndex.value].config.length + 1 + '',
      valid_bet_amount: '0',
      rate: '0',
      data: data,
    });
  }
  function delRow(key) {
    dragTabList.value[key][dragTabIndex.value].config.pop();
  }
  async function getInitData() {
    loading.value = true;
    try {
      const allConfig = await getMemberRebateConfig();
      const isExit = getCurrencyList.some((el) => el.id === allConfig.unified_cur);
      if (!isExit) {
        allConfig.unified_cur = null;
      }
      tableConifg.value = {
        automatic1: allConfig.mode === '1' ? allConfig.automatic : '1',
        automatic2: allConfig.mode === '2' ? allConfig.automatic : '1',
        mode: allConfig.mode,
        vip_unified: allConfig.vip_unified || '1',
        venue: '',
        unified: allConfig.unified,
        unified_cur: allConfig.unified_cur,
        currency_type: '1',
        unified_sum: allConfig.unified_sum || '1',
        settle_tz: allConfig.settle_tz,
        settle_at: allConfig.settle_at,
      };
      tableConifg.value.venue = allConfig.tiered[0].unified;
      allVipConfig.value = allConfig.vip;
      onlyVipConfig.value = cloneDeep(allConfig.vip[0].config);
      for (let key in dragTabList.value) {
        if (key === 'vip') {
          dragTabList.value[key] = onlyVipConfig.value;
        } else {
          dragTabList.value[key] = allConfig.tiered.filter((item) => item.currency_id === key);
        }
      }
      loading.value = false;
    } catch (error) {
      loading.value = false;
    }
  }
  async function onUpdate() {
    let params = {
      automatic:
        tableConifg.value.mode === '1'
          ? tableConifg.value.automatic1
          : tableConifg.value.automatic2,
      mode: tableConifg.value.mode,
      unified: tableConifg.value.unified,
      unified_cur: tableConifg.value.unified_cur,
      unified_sum: tableConifg.value.unified_sum,
      vip: [] as any,
      tiered: [] as any,
      settle_tz: tableConifg.value.settle_tz,
      settle_at: tableConifg.value.settle_at,
      vip_unified: tableConifg.value.mode === '1' ? tableConifg.value.vip_unified : undefined,
    };
    //梯级赋值逻辑
    for (let key in dragTabList.value) {
      if (key !== 'vip') {
        params.tiered.push(...dragTabList.value[key]);
      }
    }

    params.tiered.forEach((item) => {
      item.unified = tableConifg.value.venue;
      //统一场馆
      if (tableConifg.value.venue === '1') {
        item.config?.forEach((item2) => {
          item2.data.forEach((item3) => {
            item3.rate = item2.rate;
          });
        });
      } else {
        item?.config?.forEach((item2) => {
          //如果是梯级第一个可以为0
          const data222 = item2.data.find((item3) => item3.rate && item3.rate !== '0')?.rate;
          if (data222) {
            item2.rate = data222;
          }
        });
      }
    });
    if (!params.unified_cur) {
      message.error(t('modalForm.member.member_lv_model0'));
      return false;
    }

    //梯级校验数据
    let testSuccess = true;
    for (let key in dragTabList.value) {
      if (key !== 'vip') {
        const name = key === '0' ? t('modalForm.member.member_unified') : currencyCodeMap[key].name;
        // if (key == '706') {
        //   dragTabList.value[key].forEach((item) => {
        //     if (item.game_type != 7 && item.game_type != 5) {
        //       item?.config?.forEach((el) => {
        //         const allVenue0 = el.data.some((item3) => item3.rate === '0');
        //         if (allVenue0) {
        //           message.error(
        //             `梯级模式,${name}币种,${commomVenueList[item.game_type]}类型
        //          梯级${el.level},单独场馆返水比例,不能为0或者空`,
        //           );
        //           testSuccess = false;
        //         }
        //       });
        //     }
        //   });
        // }
        dragTabList.value[key].forEach((item) => {
          item?.config?.forEach((item2, index2) => {
            if (index2 !== 0) {
              if (!item2.valid_bet_amount || item2.valid_bet_amount === '0') {
                message.error(
                  `${t('modalForm.member.member_lv_model1', {
                    len1: name,
                    len2: commomVenueList[item.game_type],
                    len3: item2.level,
                  })}${t('modalForm.member.member_lv_model2')}`,
                );
                return (testSuccess = false);
              }
              if (tableConifg.value.venue === '1') {
                // 上一级的返水比例
                const lastRate = item.config[index2 - 1].rate;
                if (!item2.rate || item2.rate === '0') {
                  message.error(
                    `${t('modalForm.member.member_lv_model1', {
                      len1: name,
                      len2: commomVenueList[item.game_type],
                      len3: item2.level,
                    })}${t('modalForm.member.member_lv_model3')}`,
                  );
                  return (testSuccess = false);
                } else if (Number(item2.rate) < Number(lastRate)) {
                  message.error(
                    `${t('modalForm.member.member_lv_model1', {
                      len1: name,
                      len2: commomVenueList[item.game_type],
                      len3: item2.level,
                    })}${t('modalForm.member.member_lv_model4')}`,
                  );
                  return (testSuccess = false);
                }
              } else if (tableConifg.value.venue === '2') {
                const allVenue0 = item2.data.every((item3) => item3.rate === '0');
                if (allVenue0) {
                  message.error(
                    `${t('modalForm.member.member_lv_model1', {
                      len1: name,
                      len2: commomVenueList[item.game_type],
                      len3: item2.level,
                    })}${t('modalForm.member.member_lv_model5')}`,
                  );
                  testSuccess = false;
                } else {
                  const lastRateArr = item.config[index2 - 1].data.map((item3) => item3.rate);
                  item.config[index2].data.forEach((item3, index) => {
                    if (item3.show == 1) {
                      if (Number(item3.rate) < Number(lastRateArr[index])) {
                        message.error(
                          `${t('modalForm.member.member_lv_model1', {
                            len1: name,
                            len2: commomVenueList[item.game_type],
                            len3: item2.level,
                          })}${t('modalForm.member.member_lv_model6', { len: item3.name })}`,
                        );
                        testSuccess = false;
                      }
                    }
                  });
                }
              }
            }
          });
        });
      }
    }
    if (!testSuccess) return;
    //vip赋值逻辑
    if (tableConifg.value.vip_unified === '1') {
      for (let i = 0; i <= 100; i++) {
        params.vip[i] = {
          config: onlyVipConfig.value,
          level: `${i}`,
        };
      }
    } else {
      params.vip = allVipConfig.value;
    }
    params.vip.forEach((vipItem) => {
      vipItem.config.forEach((configItem) => {
        configItem.data.forEach((dataItem) => {
          dataItem.rate = dataItem.rate || '0';
        });
      });
    });
    params.tiered.forEach((vipItem) => {
      vipItem?.config?.forEach((configItem) => {
        configItem.rate = configItem.rate || '0';
        configItem.valid_bet_amount = configItem.valid_bet_amount || '0';
        configItem.data.forEach((dataItem) => {
          dataItem.rate = dataItem.rate || '0';
        });
      });
    });
    //防止组件报错
    params = cloneDeep(params);
    for (let key in params.vip) {
      if (!params.vip[key].config) params.vip[key].config = [];
      params.vip[key].config = JSON.stringify(params.vip[key].config);
    }
    for (let key in params.tiered) {
      if (!params.tiered[key].config) params.tiered[key].config = [];
      params.tiered[key].config = JSON.stringify(params.tiered[key].config);
    }
    const { status, data } = await updateMeberConfigRebate(params);
    if (status) {
      VIPLevelActiveIndex.value = 0;
      currentCurrencyFaIndex.value = 0;
      currentCurrencyCindex.value = 0;
      dragTabIndex.value = 0;
      currentFaCurrency.value = suportedCurrency.value.fabi?.[0] ?? '';
      currentCCurrency.value = '706';
      message.success(t('layout.setting.operatingTitle'));
    } else {
      message.error(data);
    }
  }
  function receive() {
    openReceive(true, 'data');
  }
  onMounted(() => {
    getInitData();
  });
</script>

<style scoped lang="less">
  .rakeback-configuration {
    padding: 20px 20px 20px 28px;
    // min-height: calc(100% - 30px);
  }
  // .ant-select {
  //   height: 45px;
  // }
  .ant-btn,
  .ant-radio-button-wrapper {
    height: 45px;
    padding: 5px 25px;
    border-radius: 4px;
    font-size: 14px;
    &::before {
      display: none;
    }
    &:focus-within {
      box-shadow: none !important;
    }
    & + .ant-radio-button-wrapper {
      margin-left: 15px;
    }
  }
  ::v-deep(.de-select) {
    .ant-select-selector {
      height: 45px !important;
      display: flex;
      align-items: center;
    }
  }
  ::v-deep(.ant-btn-primary) {
    &:focus {
      background-color: #1475e1;
    }
  }
  .new-rebate-modal.disabled {
    pointer-events: none;
  }

  .space-box {
    display: flex;
    flex-wrap: wrap;
    // margin-bottom: 20px;
    .draggable-button {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20px;
      margin-bottom: 20px;
    }
  }

  ::v-deep(.ant-form-item-control-input-content) {
    input {
      // height: 32px;
      line-height: 25px;
    }
  }
  ::v-deep(.ant-form-item-label) {
    label {
      height: 45px;
      font-size: 16px;
      margin-right: 5px;
    }
  }

  :deep(.ant-table-wrapper) {
    // margin-top: -20px;
    margin-right: 20px;
    margin-left: -10px;
    .ant-table-row:nth-of-type(odd) {
      background-color: transparent !important;
    }

    .ant-table-container > .ant-table-body > table > tbody > tr > td:first-child {
      background-color: #fff !important;
    }

    .ant-form-item {
      margin-bottom: 0 !important;
    }

    .ant-input-affix-wrapper {
      transition: all 0s;
    }

    .ant-input-group-addon {
      padding: 0 15px;
    }
  }

  :deep(.ant-table.ant-table-bordered)
    > .ant-table-container
    > .ant-table-content
    > table
    > thead
    > tr
    > th {
    border-right: 1px solid #e5e5e5 !important;
  }

  .text-overflow {
    display: inline-block;
    max-width: 40px; /* Adjust this width according to your layout */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-wrap {
    display: inline-block;
    max-width: 100%; /* Adjust this based on your layout */
    word-wrap: break-word; /* Allows breaking long words and wrapping text */
    white-space: normal; /* Allows text to wrap to a new line */
  }

  :deep(.drawborder) {
    // border-color: #1475e1;
    cursor: pointer;
    .ant-form-item {
      margin-bottom: 14px !important;
    }
    &:hover {
      border-color: #1475e1;
      .ant-form-item-label label {
        color: #1475e1 !important;
      }
    }
  }

  :deep(.ant-table-cell) {
    vertical-align: top;

    .ant-select,
    .ant-form-item-control-input {
      // height: 32px;
      width: calc(100% - 60px) !important;
      margin: 0 30px;
    }

    > span {
      line-height: 30px;
    }
    .ant-form-item-explain-error {
      margin-top: 8px;
    }
  }
  :deep(.de-form-item) {
    > .ant-form-item-control {
      width: 20px;
    }
  }

  .disabled-link {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .yh-tab-pane {
    .ant-row {
      margin-bottom: 4px;
    }
  }
  ::v-deep(.ant-table-thead) {
    line-height: 35px !important;
  }
</style>
<style>
  .drawborder {
    position: relative;
    margin-right: 15px;
    margin-bottom: 15px;
    padding: 10px 10px 0;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    background-color: #fff;
  }

  .moveIcon {
    position: absolute;
    top: -8px;
    left: -9px;
  }

  .moveTable {
    padding-right: 20px;
  }
</style>
