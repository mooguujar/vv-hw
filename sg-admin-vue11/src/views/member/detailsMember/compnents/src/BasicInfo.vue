<template>
  <div class="member w-full">
    <div class="basic">
      <Title class="!border-b-0" :name="$t('table.member.member_basic1')">
        <template #content>
          <Tag
            v-if="dataDetail?.state === '2'"
            class="!m-l-3"
            :color="dataDetail?.state === '1' as string ? '#1CD91C' : '#E91134'"
          >
            {{
              dataDetail?.state === '1'
                ? $t('table.member.member_account_nomal')
                : $t('table.member.member_account_stop')
            }}
          </Tag>
          <Tag
            v-if="dataDetail?.bonus_state === 2"
            :color="dataDetail?.bonus_state === 1 as number ? '#1CD91C' : '#E91134'"
          >
            {{
              dataDetail?.bonus_state === 1
                ? $t('table.member.member_discount_nomal')
                : $t('table.member.member_discount_stop')
            }}
          </Tag>
          <Tag
            v-if="dataDetail?.commission_state === 2"
            :color="dataDetail?.commission_state === 1 as number ? '#1CD91C' : '#E91134'"
          >
            {{
              dataDetail?.commission_state === 1
                ? $t('table.member.member_rebate_nomal')
                : $t('table.member.member_rebate_stop')
            }}
          </Tag>
          <Tag
            v-if="dataDetail?.rebate_state === 2"
            :color="dataDetail?.rebate_state === 1 ? '#1CD91C' : '#E91134'"
          >
            {{
              dataDetail?.rebate_state === 1
                ? $t('table.member.member_rebate_status')
                : $t('table.member.member_rebate_stoped')
            }}
          </Tag>
          <Tag
            v-if="[0, 1, 2, 3].includes(dataDetail?.kyc_state)"
            :color="dataDetail?.kyc_state == 2 ? '#1CD91C' : '#E91134'"
          >
            {{ dataDetail?.kyc_state == 2 ? $t('common.kyc2') : $t('common.kyc1') }}
          </Tag>
        </template>
      </Title>
      <Row>
        <Col :span="span">
          <div
            class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0 justify-between"
          >
            <div class="flex">
              <label class="whitespace-nowrap">{{ $t('business.common_member_account') }}：</label>
              <Tooltip v-if="dataDetail?.username.length > 18" :title="dataDetail?.username">
                <span class="truncate w-32">{{
                  dataDetail?.username ? dataDetail?.username : '-'
                }}</span>
              </Tooltip>
              <span v-else>{{ dataDetail?.username ? dataDetail?.username : '-' }}</span>
            </div>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label class="whitespace-nowrap">{{ $t('business.common_phone_number') }}：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.phone.length > 13"
                :title="isHasAuth('10113') ? dataDetail?.phone : maskContactInfo(dataDetail?.phone)"
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.phone
                      ? dataDetail?.phone
                      : '-'
                    : maskContactInfo(dataDetail?.phone)
                }}</Col>
              </Tooltip>
              <span class="whitespace-nowrap" v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.phone
                    ? dataDetail?.phone
                    : '-'
                  : maskContactInfo(dataDetail?.phone)
              }}</span>
            </template>
            <div
              v-if="dataDetail?.phone"
              :class="[dataDetail?.phone_check_state === 2 ? 'backgroundRed' : 'backgroundGreen']"
              class="absolute top-0 right-0 h-22px roundStyle px-2"
              >{{
                dataDetail?.phone_check_state === 2
                  ? $t('business.no_verified')
                  : $t('business.yes_verified')
              }}</div
            >
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0 border-r-0">
            <label>Telegram：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template>
              <Tooltip
                v-if="dataDetail?.telegram.length > 10"
                :title="
                  isHasAuth('10113') ? dataDetail?.telegram : maskContactInfo(dataDetail?.telegram)
                "
              >
                <span class="truncate w-32">{{
                  isHasAuth('10113')
                    ? dataDetail?.telegram
                      ? dataDetail?.telegram
                      : '-'
                    : maskContactInfo(dataDetail?.telegram)
                }}</span>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.telegram
                    ? dataDetail?.telegram
                    : '-'
                  : maskContactInfo(dataDetail?.telegram)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ $t('table.member.member_deposit_count') }}：</label>
            <span>{{ dataDetail?.deposit_count }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ $t('table.member.member_promotion') }}：</label>
            <Tooltip v-if="dataDetail?.line.length > 18" :title="dataDetail?.reg_source">
              <Col class="truncate">{{
                dataDetail?.reg_source ? dataDetail?.reg_source : '-'
              }}</Col>
            </Tooltip>
            <span v-else>{{ dataDetail?.reg_source ? dataDetail?.reg_source : '-' }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0">
            <label class="whitespace-nowrap">{{ $t('table.member.member_login_time') }}：</label>
            <Tooltip
              v-if="
                timestampToTimezone(dataDetail?.last_login_at as number)
                  .length > 10
              "
              :title="
                timestampToTimezone(dataDetail?.last_login_at as number)
              "
            >
              <span class="truncate w-38">{{
                timestampToTimezone(dataDetail?.last_login_at as number)
                  ? timestampToTimezone(dataDetail?.last_login_at as number)
                  : '-'
              }}</span>
            </Tooltip>
            <span class="whitespace-nowrap" v-else>{{
              timestampToTimezone(dataDetail?.last_login_at as number)
            }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0 border-r-0">
            <label>{{ $t('business.common_realiy_name') }}：</label>
            <Tooltip
              v-if="dataDetail?.realname.length > 15"
              :title="getRealname ? getRealname : dataDetail?.realname"
            >
              <span class="truncate w-32">{{
                getRealname ? getRealname : dataDetail?.realname || '-'
              }}</span>
            </Tooltip>
            <span v-else>{{ getRealname ? getRealname : dataDetail?.realname || '-' }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div
            class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0 relative"
          >
            <label class="whitespace-nowrap">{{ $t('business.common_email_account') }}：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip v-if="dataDetail?.email.length > 18" :title="dataDetail?.email">
                <Col class="truncate">{{ dataDetail?.email ? dataDetail?.email : '-' }}</Col>
              </Tooltip>
              <span v-else>{{ dataDetail?.email ? dataDetail?.email : '-' }}</span>
            </template>
            <div
              v-if="dataDetail?.email"
              :class="[dataDetail?.email_check_state === 2 ? 'backgroundRed' : 'backgroundGreen']"
              class="absolute top-0 right-0 h-22px roundStyle px-2"
              >{{
                dataDetail.email_check_state === 2
                  ? $t('business.no_verified')
                  : $t('business.yes_verified')
              }}
            </div>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>Line：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.line.length > 18"
                :title="isHasAuth('10113') ? dataDetail?.line : maskContactInfo(dataDetail?.line)"
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.line
                      ? dataDetail?.line
                      : '-'
                    : maskContactInfo(dataDetail?.line)
                }}</Col>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.line
                    ? dataDetail?.line
                    : '-'
                  : maskContactInfo(dataDetail?.line)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ $t('table.member.member_withdraw_count') }}：</label>
            <span>{{ dataDetail?.withdraw_count }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0 border-r-0">
            <label class="whitespace-nowrap">{{ $t('table.member.member_registe_time') }}：</label>
            <Tooltip
              v-if="timestampToTimezone(dataDetail?.created_at as number).length > 10"
              :title="timestampToTimezone(dataDetail?.created_at as number)"
            >
              <span class="truncate w-38">{{
                timestampToTimezone(dataDetail?.created_at as number)
                  ? timestampToTimezone(dataDetail?.created_at as number)
                  : '-'
              }}</span>
            </Tooltip>
            <span class="whitespace-nowrap" v-else>{{
              timestampToTimezone(dataDetail?.created_at as number)
            }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0">
            <label class="whitespace-nowrap">{{ $t('table.member.member_login_demond') }}：</label>
            <Tooltip
              v-if="dataDetail?.last_login_domain.length > 15"
              :title="dataDetail?.last_login_domain"
            >
              <Col class="truncate">{{
                dataDetail?.last_login_domain ? dataDetail?.last_login_domain : '-'
              }}</Col>
            </Tooltip>
            <span v-else>{{
              dataDetail?.last_login_domain ? dataDetail?.last_login_domain : '-'
            }}</span>
          </div>
        </Col>

        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0 border-r-0">
            <label>{{ $t('business.common_super_agent') }}：</label>
            <span>{{ dataDetail?.parent_name ? dataDetail?.parent_name : '-' }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0 border-r-0">
            <label>CPF：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <span>{{ dataDetail?.cpf_number ? dataDetail?.cpf_number : '-' }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>X：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.twitter.length > 18"
                :title="
                  isHasAuth('10113') ? dataDetail?.twitter : maskContactInfo(dataDetail?.twitter)
                "
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.twitter
                      ? dataDetail?.twitter
                      : '-'
                    : maskContactInfo(dataDetail?.twitter)
                }}</Col>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.twitter
                    ? dataDetail?.twitter
                    : '-'
                  : maskContactInfo(dataDetail?.twitter)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ $t('table.finance.finance_total_deposit') }}：</label>
            <!-- <span>{{ dataDetail?.deposit_amount ? dataDetail?.deposit_amount : '-' }}</span> -->
            <template v-if="Number(dataDetail?.deposit_amount) > 0">
              <DetailReloadTooltip
                :list="changeAmount(dataDetail?.deposit_detail)"
                :totalAmount="dataDetail?.deposit_amount"
                @reload="reloadSucess"
              />
            </template>
            <template v-else> {{ dataDetail?.deposit_amount || 0 }} </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label class="whitespace-nowrap"
              >{{ $t('table.member.member_register_demond') }}：</label
            >
            <Tooltip v-if="dataDetail?.reg_domain.length > 9" :title="dataDetail?.reg_domain">
              <span class="truncate w-38">{{
                dataDetail?.reg_domain ? dataDetail?.reg_domain : '-'
              }}</span>
            </Tooltip>
            <span v-else>{{ dataDetail?.reg_domain }}</span>
            <!-- <span>{{ dataDetail?.reg_domain ? dataDetail?.reg_domain : '-' }}</span> -->
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto items-center px-4 border border-slate-200 border-b-0 p-y-3">
            <div class="flex">
              <label>{{ $t('table.risk.report_login_ip') }}：</label>
              <Tooltip
                v-if="dataDetail?.last_login_Ip.length > 18"
                :title="dataDetail?.last_login_Ip"
              >
                <span class="truncate w-35">{{
                  dataDetail?.last_login_Ip ? dataDetail?.last_login_Ip : '-'
                }}</span>
              </Tooltip>
              <span v-else>{{ dataDetail?.last_login_Ip }}</span>
            </div>
            <div class="history-text" @click="toLinkAccount(dataDetail?.last_login_Ip, 1)"
              >{{ $t('table.member.member_login_same') }} ({{ dataDetail?.login_ip_count }})</div
            >
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ $t('table.report.report_member_level') }}：</label>
            <span>{{ dataDetail?.level_name ? dataDetail?.level_name : '-' }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ t('table.member.member_country_') }}：</label>
            <span>{{ dataDetail?.country ? dataDetail?.country : '-' }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>Zalo：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.zalo.length > 18"
                :title="isHasAuth('10113') ? dataDetail?.zalo : maskContactInfo(dataDetail?.zalo)"
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.zalo
                      ? dataDetail?.zalo
                      : '-'
                    : maskContactInfo(dataDetail?.zalo)
                }}</Col>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.zalo
                    ? dataDetail?.zalo
                    : '-'
                  : maskContactInfo(dataDetail?.zalo)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ $t('table.member.member_withdraw_money') }}：</label>
            <template v-if="Number(dataDetail?.withdraw_amount) > 0">
              <DetailReloadTooltip
                :list="changeAmount(dataDetail?.withdraw_detail)"
                :totalAmount="dataDetail?.withdraw_amount"
                @reload="reloadSucess"
              />
            </template>
            <template v-else> {{ dataDetail?.withdraw_amount || 0 }} </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto items-center px-4 border border-slate-200 border-r-0 border-b-0 p-y-3">
            <div>
              <div class="flex">
                <label class="whitespace-nowrap">{{ $t('table.risk.report_register_ip') }}：</label>
                <Tooltip v-if="dataDetail?.reg_ip.length > 18" :title="dataDetail?.reg_ip">
                  <Col class="truncate">{{ dataDetail?.reg_ip ? dataDetail?.reg_ip : '-' }}</Col>
                </Tooltip>
                <span v-else>{{ dataDetail?.reg_ip ? dataDetail?.reg_ip : '-' }}</span>
              </div>
              <div class="history-text" @click="toLinkAccount(dataDetail?.reg_ip, 3)"
                >{{ $t('table.member.member_register_ip') }} ({{ dataDetail?.reg_ip_count }})</div
              >
            </div>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto items-center pl-4 border border-slate-200 border-b-0 p-y-3">
            <div class="flex">
              <label class="whitespace-nowrap">{{ $t('table.member.member_device_tip2') }}：</label>
              <!-- 判断字符长度，决定是否显示浮窗组件 -->
              <Tooltip
                :placement="topLeft"
                v-if="dataDetail?.device_number.length > 18"
                :title="dataDetail?.device_number"
              >
                <Col class="truncate">{{
                  dataDetail?.device_number ? dataDetail?.device_number : '-'
                }}</Col>
              </Tooltip>
              <span v-else>{{ dataDetail?.device_number ? dataDetail?.device_number : '-' }}</span>
            </div>
            <div class="history-text" @click="toLinkAccount(dataDetail?.device_number, 2)"
              >{{ $t('table.member.member_same_device') }} ({{
                dataDetail?.login_device_count
              }})</div
            >
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0">
            <label>{{ $t('table.system.system_vip_level') }}：</label>
            <span>{{ dataDetail?.vip ? 'VIP' + dataDetail?.vip : 'VIP0' }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>Facebook：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.facebook.length > 18"
                :title="
                  isHasAuth('10113') ? dataDetail?.facebook : maskContactInfo(dataDetail?.facebook)
                "
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.facebook
                      ? dataDetail?.facebook
                      : '-'
                    : maskContactInfo(dataDetail?.facebook)
                }}</Col>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.facebook
                    ? dataDetail?.facebook
                    : '-'
                  : maskContactInfo(dataDetail?.facebook)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center p-l-4 border border-slate-200 border-b-0">
            <label>Viber：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.viber.length > 18"
                :title="isHasAuth('10113') ? dataDetail?.viber : maskContactInfo(dataDetail?.viber)"
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.viber
                      ? dataDetail?.viber
                      : '-'
                    : maskContactInfo(dataDetail?.viber)
                }}</Col>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.viber
                    ? dataDetail?.viber
                    : '-'
                  : maskContactInfo(dataDetail?.viber)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0 border-b-0">
            <label>{{ $t('table.report.report_cash_profit') }}：</label>

            <DetailReloadTooltip
              :placement="topLeft"
              v-if="Number(dataDetail?.cash_profit)"
              :list="changeAmount(dataDetail?.profit_detail)"
              :totalAmount="dataDetail?.cash_profit"
              @reload="reloadSucess"
            />

            <span v-else>0</span>
          </div>
        </Col>
        <Col :span="span">
          <div
            class="h-auto items-center p-l-4 border border-slate-200 border-r-0 border-b-0 p-y-3"
          >
            <div class="flex">
              <label class="whitespace-nowrap">{{ $t('table.member.member_device_tip1') }}：</label>
              <Tooltip
                :placement="topLeft"
                v-if="dataDetail?.reg_device_no.length > 18"
                :title="dataDetail?.reg_device_no"
              >
                <Col class="truncate">{{
                  dataDetail?.reg_device_no ? dataDetail?.reg_device_no : '-'
                }}</Col>
              </Tooltip>
              <span v-else>{{ dataDetail?.reg_device_no ? dataDetail?.reg_device_no : '-' }}</span>
            </div>
            <div class="history-text" @click="toLinkAccount(dataDetail?.reg_device_no, 4)"
              >{{ $t('table.member.member_same_register') }} ({{
                dataDetail?.reg_device_count
              }})</div
            >
          </div>
        </Col>
        <Col :span="span" class="history">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-b-0">
            <label class="whitespace-nowrap">{{ $t('table.member.member_history') }}：</label>
            <Tooltip
              :placement="topLeft"
              v-if="$t('table.member.member_record_login').length > 10"
              :title="$t('table.member.member_record_login')"
            >
              <Col class="truncate history-text" @click="historyClick">{{
                $t('table.member.member_record_login')
              }}</Col>
            </Tooltip>
            <span v-else @click="historyClick" class="history-text">{{
              $t('table.member.member_record_login')
            }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0">
            <label>{{ t('table.member.member_birthday_') }}：</label>
            <span>{{ dataDetail?.birthday ? dataDetail?.birthday : '-' }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0">
            <label>Whatsapp：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.whatsapp.length > 18"
                :title="
                  isHasAuth('10113') ? dataDetail?.whatsapp : maskContactInfo(dataDetail?.whatsapp)
                "
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.whatsapp
                      ? dataDetail?.whatsapp
                      : '-'
                    : maskContactInfo(dataDetail?.whatsapp)
                }}</Col>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.whatsapp
                    ? dataDetail?.whatsapp
                    : '-'
                  : maskContactInfo(dataDetail?.whatsapp)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0">
            <label>WeChat：</label>
            <template v-if="isControlValueSet()"> {{ showControlValue() }} </template>
            <template v-else>
              <Tooltip
                v-if="dataDetail?.wechat.length > 18"
                :title="
                  isHasAuth('10113') ? dataDetail?.wechat : maskContactInfo(dataDetail?.wechat)
                "
              >
                <Col class="truncate">{{
                  isHasAuth('10113')
                    ? dataDetail?.wechat
                      ? dataDetail?.wechat
                      : '-'
                    : maskContactInfo(dataDetail?.wechat)
                }}</Col>
              </Tooltip>
              <span v-else>{{
                isHasAuth('10113')
                  ? dataDetail?.wechat
                    ? dataDetail?.wechat
                    : '-'
                  : maskContactInfo(dataDetail?.wechat)
              }}</span>
            </template>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0"
            ><label class="whitespace-nowrap">{{
              t('table.discountActivity.discount_total')
            }}</label>
            <ReloadListTooltip
              v-if="Number(discountTotal) > 0"
              :list="discountArr"
              :total="discountTotal"
            />
            <div v-else-if="Number(discountTotal) === 0">0</div>
            <div v-else>-</div>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto items-center p-l-4 border border-slate-200 border-r-0 border-b-0 p-y-3">
            <div class="flex">
              <label>{{ t('business.Promotion') }}：</label>
              <span>{{ dataDetail?.channel_domain }}</span>
            </div>
            <div>
              (<span class="primary-color cursor-pointer" @click="handleproDetailModal">{{
                channelNum
              }}</span>)
            </div>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200 border-r-0">
            <label>{{ $t('business.code_details') }}：</label>
            <span class="primary-color cursor-pointer" @click="handleDamaDetailModal">{{
              t('business.common_detail')
            }}</span>
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center p-l-4 p-r-2 border border-slate-200 border-r-0">
            <label class="whitespace-nowrap">{{ $t('table.member.member_remark_') }}：</label>
            <Tooltip
              v-if="patternText(dataDetail?.note) && dataDetail?.note?.length > 6"
              :title="dataDetail?.note"
            >
              <span class="truncate">{{ dataDetail?.note ? dataDetail?.note : '-' }}</span>
            </Tooltip>
            <Tooltip
              v-else-if="!patternText(dataDetail?.note) && dataDetail?.note?.length > 11"
              :title="dataDetail?.note"
            >
              <span class="truncate">{{ dataDetail?.note ? dataDetail?.note : '-' }}</span>
            </Tooltip>
            <span v-else>{{ dataDetail?.note ? dataDetail?.note : '-' }}</span>
            <span class="primary-color cursor-pointer whitespace-nowrap" @click="handleHistoryModal"
              >({{ $t('table.member.member_history_') }})</span
            >
          </div>
        </Col>
        <Col :span="span">
          <div class="h-auto flex items-center px-4 border border-slate-200"> </div>
        </Col>
      </Row>
    </div>
    <Card class="pay-way" :bordered="false">
      <Title class="!border" :name="`${$t('table.member.member_recive_message')}`" />

      <div class="pay-bottom">
        <cdButtonCurrency
          :btn-list="achieveList?.map((item) => ({ name: item.name, value: item.key }))"
          v-model="activeKey"
          innerClass="!border-0"
        />
        <template v-for="item in achieveList" :key="item.key">
          <div v-if="item.key == activeKey">
            <component
              :is="componentsList[item.component]"
              :apiMap="item.apiMap"
              ref="componentRef"
            />
          </div>
        </template>
      </div>
    </Card>
    <registerHistory @register="registerHistoryModal" :titleicon="'history'" />
    <DamaDialog @register="registerDamaDetailModal" :titleicon="'history'" />
    <promotionDialog @register="registerProDetailModal" :titleicon="'history'" />
  </div>
</template>

<script setup lang="ts">
  import { Row, Col, Card, Tooltip, Tag } from 'ant-design-vue';
  import { ref, onMounted, watch, nextTick } from 'vue';
  import { DetalesInfoModel } from '../../model/detailsModel';
  import { Title } from '../../compnents/index';
  import currentCoin from './currentCoin/index.vue';
  import { brlColumns, cnyColumns, usdtColumns } from './currentCoin/currentCoin.data';
  import { GetBetDetailchannel, getMemberDetails, getOutpayList, getWalletList } from '/@/api/member/index';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { timestampToTimezone } from '/@/utils/dateUtil';
  import { DetailReloadTooltip } from '/@/components/DetailReloadTooltip/index';
  import { useI18n } from '/@/hooks/web/useI18n';
  import registerHistory from './modal/noteHistoryModal.vue';
  import DamaDialog from '/@/components/DamaDialog/index.vue';
  import promotionDialog from '/@/components/promotionDialog/index.vue';
  import { useModal } from '/@/components/Modal';
  import ReloadListTooltip from '/@/views/member/common/ReloadListTooltip.vue';
  import cdButtonCurrency from '/@/components-cd/button/cd-button-currency.vue';
  import { isHasAuth } from '/@/utils/authFunction';
  import { isControlValueSet, maskContactInfo, showControlValue } from '/@/utils/domUtils';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const { initBusinessType } = useTreeListStore();
  initBusinessType();
  const { t } = useI18n();
  const { currencyTreeList } = useTreeListStore();

  const props = defineProps({
    history_: { type: Object, default: history.state.id },
  });
  const [registerHistoryModal, { openModal }] = useModal();
  const [registerDamaDetailModal, { openModal: openDamaDetailModal }] = useModal();
  const [registerProDetailModal, { openModal: openProDetailModal }] = useModal();
  let getId = ref('');
  let username = ref<any>('111');
  const getRealname = ref('' as any);
  const span = 4;
  const emit = defineEmits(['historyRoute', 'accountRoute']);
  // 初始化值
  const dataDetail = ref<DetalesInfoModel>();
  /** 优惠总额信息 */
  const discountTotal = ref('0');
  const discountArr = ref([]);
  const activeKey = ref(currencyTreeList[0].id);
  let componentsList = {
    currentCoin,
  };
  const achieveList = ref<any>([]);
  defineExpose({ username });
  function createAchieveListItem(item: any, columns: any, setList: any) {
    return {
      key: item.id,
      name: item.name,
      component: 'currentCoin',
      apiMap: {
        PAGE_TYPE: item.id,
        pageName: item.name,
        columns: columns,
        modalType: item.id,
        list: setList,
        attr: item.attr,
        //updateState: updateState,
      },
    };
  }
  currencyTreeList.forEach((item) => {
    let columns: any = [];
    if (item.attr === '1') {
      if (item.name == 'CNY') {
        columns = cnyColumns;
      } else {
        columns = brlColumns;
      }
    }
    let setList;
    //let updateState;
    if (item.attr === '2') {
      //虚拟货币
      setList = getWalletList;
      //updateState = updateWalletState;
      columns = usdtColumns;
    } else {
      //法定货币
      setList = getOutpayList;
      // updateState = updateBankState;
    }
    achieveList.value.push(createAchieveListItem(item, columns, setList));
  });
  const channelNum = ref(1);
  async function getinfo(id) {
    const data = await getMemberDetails({ uid: id, timezone: userStore.defaultTimezone });
    const channelNumData = await GetBetDetailchannel({ uid: id, page: 1, page_size: 10 });
    channelNum.value = channelNumData.t || 1;
    dataDetail.value = data;
    discountTotal.value = data?.bonus_amount;
    discountArr.value = data?.bonus_detail?.sort(
      (a, b) => parseFloat(b.amount) - parseFloat(a.amount),
    );
    if (dataDetail.value && typeof dataDetail.value.phone === 'string') {
      dataDetail.value.phone = dataDetail.value.phone.replace(/-/g, '');
    }
  }
  function historyClick() {
    emit('historyRoute', '6');
  }
  function toLinkAccount(val, type) {
    emit('accountRoute', { value: val, type: type });
  }
  function handleHistoryModal() {
    openModal(true, { uid: history.state.id });
  }
  function handleDamaDetailModal() {
    openDamaDetailModal(true, { uid: history.state.id, username: dataDetail.value.username });
  }
  function handleproDetailModal() {
    openProDetailModal(true, { uid: history.state.id, username: dataDetail.value.username });
  }
  function resizeRableDiv(type) {
    let tableDiv = [];
    for (var i = 0; i < document.getElementsByClassName('items-center').length; i++) {
      if (document.getElementsByClassName('items-center').item(i).classList.contains('h-auto')) {
        tableDiv.push(document.getElementsByClassName('items-center').item(i));
      }
    }
    let rowLength = 0;
    for (var j = 0; j < tableDiv.length; j++) {
      if (rowLength < parseInt(j / 6)) {
        rowLength = parseInt(j / 6);
      }
    }
    var typeAllHeight = 0;
    for (var n = 0; n < rowLength + 1; n++) {
      var maxHeight = 69;
      for (var k = 0; k < tableDiv.length; k++) {
        if (parseInt(k / 6) === n) {
          if (maxHeight < tableDiv[k].offsetHeight) {
            maxHeight = tableDiv[k].offsetHeight;
          }
        }
      }
      if (typeAllHeight < maxHeight) {
        typeAllHeight = maxHeight;
      }
      if (!type) {
        for (var i = 0; i < document.getElementsByClassName('h-auto').length; i++) {
          if (parseInt(i / 6) === n) {
            document.getElementsByClassName('h-auto')[i].style.height = maxHeight + 'px';
            document
              .getElementsByClassName('h-auto')
              [i].classList.add('border', 'border-slate-200', 'border-r-0');
            if (i % 6 === 5) {
              document.getElementsByClassName('h-auto')[i].classList.remove('border-r-0');
            }
          }
        }
      }
    }
    if (type === 'all') {
      for (var i = 0; i < document.getElementsByClassName('h-auto').length; i++) {
        document.getElementsByClassName('h-auto')[i].style.height = typeAllHeight + 'px';
        document
          .getElementsByClassName('h-auto')
          [i].classList.add('border', 'border-slate-200', 'border-r-0');
        if (i % 6 === 5) {
          document.getElementsByClassName('h-auto')[i].classList.remove('border-r-0');
        }
      }
    }
  }
  function reloadSucess() {
    getinfo(getId.value);
  }
  function changeAmount(value) {
    const result = Object.keys(JSON.parse(value)).map(function (key) {
      //var currency_id = key.substring(1); // 获取数字部分作为 currency_id
      return {
        //currency_id: currency_id,
        label: key,
        value: JSON.parse(value)[key],
      };
    });
    const list = result.filter((item) => item.label !== 'uid');
    return list;
  }
  function patternText(text) {
    var pattern = new RegExp('[\u4E00-\u9FA5]+');
    return pattern.test(text);
  }

  // function maskContactInfo(contactInfo) {
  //   if (!contactInfo) return '-';
  //   contactInfo = String(contactInfo);
  //   // 检查联系方式的长度
  //   const length = contactInfo.length;

  //   if (length >= 6) {
  //     // 大于等于6位的，加密中间4位
  //     const start = Math.floor((length - 4) / 2);
  //     const end = start + 4;
  //     return contactInfo.slice(0, start) + '*'.repeat(4) + contactInfo.slice(end);
  //   } else if (length >= 3 && length < 6) {
  //     // 大于等于3位，小于6位的，前后各保留1位，中间其余的加密
  //     return contactInfo[0] + '*'.repeat(length - 2) + contactInfo[length - 1];
  //   } else if (length < 3) {
  //     // 小于3位的，最后一位加密
  //     return contactInfo.slice(0, length - 1) + '*';
  //   } else {
  //     return contactInfo; // 如果长度不符合以上条件，直接返回原始值
  //   }
  // }
  watch(
    () => props.history_, // 监听 id 的变化.value
    (new_history_) => {
      getId.value = new_history_?.id;
      if (getId.value) getinfo(getId.value);
      getRealname.value = history?.state?.realname;
    },
    {
      deep: true,
      immediate: true,
    },
  );
  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        resizeRableDiv(); //默认是每行高度，如果要用整个表格里面的最大高度，可以设定成'all'
      }, 100); // STAK-20457 【DEV】【后台】【优化单】刚进入会员详情时，上下两行的线挤在一起了（产品反馈）
    });
  });
</script>

<style scoped>
  .member .roundStyle {
    border-bottom-left-radius: 5px;
    color: #fff;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
  }

  .member .backgroundRed {
    background: #e91134;
  }

  .member .backgroundGreen {
    background: #1cd91c;
  }

  ::v-deep(.ant-card-body) {
    padding: 0;
  }

  .pay-way {
    margin-top: 40px;

    ::v-deep(.ant-tabs-content-holder) {
      margin: 20px 0 40px;
    }

    ::v-deep(.ant-tabs-nav) {
      margin-bottom: 0;
      margin-left: 0 !important;
    }

    ::v-deep(.ant-table-wrapper) {
      padding: 0;
    }
  }

  ::v-deep(.history-text) {
    color: #1475e1;
    cursor: pointer;
  }

  .items-center {
    height: auto;
  }

  ::v-deep(.ant-radio-button + span) {
    display: flex;
    place-items: center center !important;
    height: 40px !important;
    border: none !important;
    line-height: 40px !important;
  }

  ::v-deep(.ant-radio-button-wrapper-checked) {
    background-color: #fff !important;
    color: #1475e1 !important;
  }

  ::v-deep(.ant-radio-button-wrapper) {
    padding: 0 25px !important;
    border: none !important;
  }

  ::v-deep(.ant-radio-button-wrapper:focus-within) {
    box-shadow: none !important;
  }

  ::v-deep(.ant-radio-button-wrapper::before) {
    display: none !important;
    border: none !important;
  }

  .basic {
    background-color: #fff;
    font-size: 14px;

    .ant-row > .ant-col:nth-child(7),
    .ant-row > .ant-col:nth-child(8),
    .ant-row > .ant-col:nth-child(9),
    .ant-row > .ant-col:nth-child(10),
    .ant-row > .ant-col:nth-child(11),
    .ant-row > .ant-col:nth-child(12),
    .ant-row > .ant-col:nth-child(19),
    .ant-row > .ant-col:nth-child(20),
    .ant-row > .ant-col:nth-child(21),
    .ant-row > .ant-col:nth-child(22),
    .ant-row > .ant-col:nth-child(23),
    .ant-row > .ant-col:nth-child(24),
    .ant-row > .ant-col:nth-child(31),
    .ant-row > .ant-col:nth-child(32),
    .ant-row > .ant-col:nth-child(33),
    .ant-row > .ant-col:nth-child(34),
    .ant-row > .ant-col:nth-child(35),
    .ant-row > .ant-col:nth-child(36) {
      background-color: #f6f7fb;
    }
  }

  .pay-bottom {
    border-right: 1px solid;
    border-left: 1px solid;
    border-color: #e1e1e1 !important;
  }

  ::deep(
      .ant-table.ant-table-bordered
        > .ant-table-container
        > .ant-table-content
        > table
        > thead
        > tr
        > th
    ) {
    /* border: 1px solid red !important; */
  }

  .border-slate-200 {
    border-color: #e1e1e1 !important;
  }
</style>
