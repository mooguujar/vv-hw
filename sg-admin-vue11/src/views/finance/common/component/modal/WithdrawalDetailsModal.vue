<template>
  <main class="main venuesClassZoom" ref="main">
    <BasicModal
      v-bind="$attrs"
      :centered="true"
      :minHeight="580"
      :width="actionWid"
      :okText="$t('modalForm.finance.common_income.submit')"
      :cancelText="$t('common.cancelText')"
      @ok="handleSubmit"
      @register="registerModal"
      :showCancelBtn="showCancelBtnComp"
      :showOkBtn="showCancelBtnComp"
      :getContainer="() => $refs.main"
      @visible-change="focusCloseEvent"
    >
      <div class="absolute -top-14">
        <Tabs capsule_tap class="capsule_tap" v-model:activeKey="curTab" destroyInactiveTabPane>
          <TabPane key="1" :tab="$t('modalForm.finance.finance_withdrawal_detail')" />
          <TabPane key="2" :tab="$t('business.code_details')" />
        </Tabs>
      </div>
      <div v-if="curTab == '1'" :class="{ boderBox: showCancelBtnComp }">
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.order_id') }}:</span
          >
          <span> {{ infoData?.order_number }} </span>
        </div>
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.menber_id') }}:</span
          >
          <span> {{ infoData?.username }} </span>
        </div>
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.balance') }}:</span
          >
          <!-- <span class="cursor"> {{ infoData?.user_balance || 0 }} </span> -->
          <ReloadTooltip
            :record="recordData"
            :list="recordData._balanceList"
            :currency="infoData.currency_name"
            :currencyId="infoData.currency_id"
            :type="'currency'"
            :balanceType="'balance'"
            @reload="hadnleRealodAmount(infoData)"
          />
        </div>
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_withdrawal_cur') }}:</span
          >
          <cdBlockCurrency :label="infoData?.currency_name" />
          <span class="text-[#FF0000]"> {{ infoData?.currency_name }} </span>
        </div>
        <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.ONLINE">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_withdrawal_way') }}:</span
          >
          <span> {{ infoData?.withdraw_type }} </span>
        </div>
        <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.ONLINE">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.realname') }}:</span
          >
          <span> {{ infoData?.realname ? infoData?.realname : '-' }} </span>
        </div>
        <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.ONLINE">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_withdrawal_way1') }}:</span
          >
          <span> {{ infoData?.bank_name ? infoData?.bank_name : '-' }} </span>
        </div>
        <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.COMPANY">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('business.common_agreement_type') }}:</span
          >
          <span class="text-[#FF0000]"> {{ infoData?.contract_type }} </span>
        </div>
        <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.ONLINE">
          <span class="info-title" :style="{ width: labelWidth + 'px' }">
            {{ $t('modalForm.finance.finance_withdrawal_account') }}:</span
          >
          <Tooltip placement="topLeft">
            <template #title>
              <span>{{ infoData?.bank_account }}</span>
            </template>
            <span> {{ infoData?.bank_account }} </span>
          </Tooltip>

          <div class="flex cursor" @click="handleCopy(infoData?.bank_account)">
            <span class="w-[18px] h-[18px] mr-0.5 ml-2"
              ><svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="fuzhi 1">
                  <path
                    id="Vector"
                    d="M1.68945 10.1189C1.68945 10.2686 1.74909 10.4121 1.85524 10.5179C1.96138 10.6238 2.10535 10.6832 2.25547 10.6832C2.40559 10.6832 2.54955 10.6238 2.6557 10.5179C2.76185 10.4121 2.82148 10.2686 2.82148 10.1189C2.82148 9.9693 2.76185 9.82577 2.6557 9.71996C2.54955 9.61414 2.40559 9.55469 2.25547 9.55469C2.10535 9.55469 1.96138 9.61414 1.85524 9.71996C1.74909 9.82577 1.68945 9.9693 1.68945 10.1189Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_2"
                    d="M13.0439 7.92169L8.30664 7.88478C8.05527 7.88302 7.84961 8.12735 7.84961 8.4297C7.84961 8.73204 8.05527 8.97989 8.30664 8.98165L13.0439 9.01856C13.2953 9.02032 13.501 8.77599 13.501 8.47364C13.501 8.1713 13.2953 7.92345 13.0439 7.92169ZM13.0439 10.1541L8.30664 10.1172C8.05527 10.1154 7.84961 10.3598 7.84961 10.6621C7.84961 10.9645 8.05527 11.2123 8.30664 11.2141L13.0439 11.251C13.2953 11.2545 13.501 11.0084 13.501 10.7061C13.501 10.4037 13.2953 10.1559 13.0439 10.1541Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_3"
                    d="M12.9393 1.12305H7.33008C6.09258 1.12305 5.08008 2.13555 5.08008 3.37305H3.93926C2.70176 3.37305 1.68926 4.38555 1.68926 5.62305V7.87305C1.6875 8.18418 1.94238 8.43555 2.25527 8.43555C2.56816 8.43555 2.82129 8.18242 2.82129 7.87129V5.62481C2.82129 5.00606 3.32754 4.49981 3.94629 4.49981H5.08008V12.3713C5.08008 13.6088 6.09258 14.6213 7.33008 14.6213H11.8143C11.8125 15.24 11.308 15.7428 10.6893 15.7428H3.94629C3.32754 15.7428 2.82129 15.2365 2.82129 14.6178V12.366C2.82129 12.0549 2.56816 11.8018 2.25527 11.8018C1.94238 11.8018 1.6875 12.0549 1.6875 12.366V14.6213C1.6875 15.8588 2.7 16.8713 3.9375 16.8713H10.6893C11.9268 16.8713 12.9393 15.8588 12.9393 14.6213H14.0818C15.3193 14.6213 16.3318 13.6088 16.3318 12.3713V4.49805L12.9393 1.12305ZM12.941 2.2375L15.1857 4.49277H14.0625C13.4438 4.49277 12.9375 3.98652 12.9375 3.36777V2.2375H12.941ZM14.066 13.5051H7.31426C6.69551 13.5051 6.18926 12.9988 6.18926 12.3801V3.3625C6.18926 2.74375 6.69551 2.2375 7.31426 2.2375H11.7949V3.35723C11.7949 4.59473 12.8074 5.60723 14.0449 5.60723H15.191V12.3801C15.191 12.9988 14.6848 13.5051 14.066 13.5051Z"
                    fill="#1475E1"
                  />
                </g>
              </svg>
            </span>
            <span class="text-sm cursor font-medium text-[#1475E1]">
              {{ $t('modalForm.finance.common_income.copy') }}</span
            >
          </div>
        </div>
        <div class="info-content" v-if="infoData?.withdraw_type === '银行卡'">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_opening_outlets') }}:</span
          >
          <span> {{ infoData['address'] ? infoData['address'] : '-' }} </span>
        </div>
        <div class="info-content" v-if="apiMap.PAGE_TYPE == RECHARGE.COMPANY">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_withdrawal_addr') }}:</span
          >
          <span class="max-w-70"> {{ infoData?.address }} </span>
          <div class="flex cursor" @click="handleCopy(infoData?.address)">
            <span class="w-[18px] h-[18px] mr-0.5 ml-2"
              ><svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="fuzhi 1">
                  <path
                    id="Vector"
                    d="M1.68945 10.1189C1.68945 10.2686 1.74909 10.4121 1.85524 10.5179C1.96138 10.6238 2.10535 10.6832 2.25547 10.6832C2.40559 10.6832 2.54955 10.6238 2.6557 10.5179C2.76185 10.4121 2.82148 10.2686 2.82148 10.1189C2.82148 9.9693 2.76185 9.82577 2.6557 9.71996C2.54955 9.61414 2.40559 9.55469 2.25547 9.55469C2.10535 9.55469 1.96138 9.61414 1.85524 9.71996C1.74909 9.82577 1.68945 9.9693 1.68945 10.1189Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_2"
                    d="M13.0439 7.92169L8.30664 7.88478C8.05527 7.88302 7.84961 8.12735 7.84961 8.4297C7.84961 8.73204 8.05527 8.97989 8.30664 8.98165L13.0439 9.01856C13.2953 9.02032 13.501 8.77599 13.501 8.47364C13.501 8.1713 13.2953 7.92345 13.0439 7.92169ZM13.0439 10.1541L8.30664 10.1172C8.05527 10.1154 7.84961 10.3598 7.84961 10.6621C7.84961 10.9645 8.05527 11.2123 8.30664 11.2141L13.0439 11.251C13.2953 11.2545 13.501 11.0084 13.501 10.7061C13.501 10.4037 13.2953 10.1559 13.0439 10.1541Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_3"
                    d="M12.9393 1.12305H7.33008C6.09258 1.12305 5.08008 2.13555 5.08008 3.37305H3.93926C2.70176 3.37305 1.68926 4.38555 1.68926 5.62305V7.87305C1.6875 8.18418 1.94238 8.43555 2.25527 8.43555C2.56816 8.43555 2.82129 8.18242 2.82129 7.87129V5.62481C2.82129 5.00606 3.32754 4.49981 3.94629 4.49981H5.08008V12.3713C5.08008 13.6088 6.09258 14.6213 7.33008 14.6213H11.8143C11.8125 15.24 11.308 15.7428 10.6893 15.7428H3.94629C3.32754 15.7428 2.82129 15.2365 2.82129 14.6178V12.366C2.82129 12.0549 2.56816 11.8018 2.25527 11.8018C1.94238 11.8018 1.6875 12.0549 1.6875 12.366V14.6213C1.6875 15.8588 2.7 16.8713 3.9375 16.8713H10.6893C11.9268 16.8713 12.9393 15.8588 12.9393 14.6213H14.0818C15.3193 14.6213 16.3318 13.6088 16.3318 12.3713V4.49805L12.9393 1.12305ZM12.941 2.2375L15.1857 4.49277H14.0625C13.4438 4.49277 12.9375 3.98652 12.9375 3.36777V2.2375H12.941ZM14.066 13.5051H7.31426C6.69551 13.5051 6.18926 12.9988 6.18926 12.3801V3.3625C6.18926 2.74375 6.69551 2.2375 7.31426 2.2375H11.7949V3.35723C11.7949 4.59473 12.8074 5.60723 14.0449 5.60723H15.191V12.3801C15.191 12.9988 14.6848 13.5051 14.066 13.5051Z"
                    fill="#1475E1"
                  />
                </g>
              </svg>
            </span>
            <span class="text-sm cursor font-medium text-[#1475E1]">
              {{ $t('modalForm.finance.common_income.copy') }}</span
            >
          </div>
        </div>
        <div class="info-content" v-if="infoData?.currency_name == 'BRL'">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_cpf') }}:</span
          >
          <span v-if="infoData?.bank_area_cpf">{{ infoData?.bank_area_cpf }}</span>
          <span v-else>-</span>
          <div class="flex cursor" @click="handleCopy(infoData?.bank_area_cpf)">
            <span class="w-[18px] h-[18px] mr-0.5 ml-2"
              ><svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="fuzhi 1">
                  <path
                    id="Vector"
                    d="M1.68945 10.1189C1.68945 10.2686 1.74909 10.4121 1.85524 10.5179C1.96138 10.6238 2.10535 10.6832 2.25547 10.6832C2.40559 10.6832 2.54955 10.6238 2.6557 10.5179C2.76185 10.4121 2.82148 10.2686 2.82148 10.1189C2.82148 9.9693 2.76185 9.82577 2.6557 9.71996C2.54955 9.61414 2.40559 9.55469 2.25547 9.55469C2.10535 9.55469 1.96138 9.61414 1.85524 9.71996C1.74909 9.82577 1.68945 9.9693 1.68945 10.1189Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_2"
                    d="M13.0439 7.92169L8.30664 7.88478C8.05527 7.88302 7.84961 8.12735 7.84961 8.4297C7.84961 8.73204 8.05527 8.97989 8.30664 8.98165L13.0439 9.01856C13.2953 9.02032 13.501 8.77599 13.501 8.47364C13.501 8.1713 13.2953 7.92345 13.0439 7.92169ZM13.0439 10.1541L8.30664 10.1172C8.05527 10.1154 7.84961 10.3598 7.84961 10.6621C7.84961 10.9645 8.05527 11.2123 8.30664 11.2141L13.0439 11.251C13.2953 11.2545 13.501 11.0084 13.501 10.7061C13.501 10.4037 13.2953 10.1559 13.0439 10.1541Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_3"
                    d="M12.9393 1.12305H7.33008C6.09258 1.12305 5.08008 2.13555 5.08008 3.37305H3.93926C2.70176 3.37305 1.68926 4.38555 1.68926 5.62305V7.87305C1.6875 8.18418 1.94238 8.43555 2.25527 8.43555C2.56816 8.43555 2.82129 8.18242 2.82129 7.87129V5.62481C2.82129 5.00606 3.32754 4.49981 3.94629 4.49981H5.08008V12.3713C5.08008 13.6088 6.09258 14.6213 7.33008 14.6213H11.8143C11.8125 15.24 11.308 15.7428 10.6893 15.7428H3.94629C3.32754 15.7428 2.82129 15.2365 2.82129 14.6178V12.366C2.82129 12.0549 2.56816 11.8018 2.25527 11.8018C1.94238 11.8018 1.6875 12.0549 1.6875 12.366V14.6213C1.6875 15.8588 2.7 16.8713 3.9375 16.8713H10.6893C11.9268 16.8713 12.9393 15.8588 12.9393 14.6213H14.0818C15.3193 14.6213 16.3318 13.6088 16.3318 12.3713V4.49805L12.9393 1.12305ZM12.941 2.2375L15.1857 4.49277H14.0625C13.4438 4.49277 12.9375 3.98652 12.9375 3.36777V2.2375H12.941ZM14.066 13.5051H7.31426C6.69551 13.5051 6.18926 12.9988 6.18926 12.3801V3.3625C6.18926 2.74375 6.69551 2.2375 7.31426 2.2375H11.7949V3.35723C11.7949 4.59473 12.8074 5.60723 14.0449 5.60723H15.191V12.3801C15.191 12.9988 14.6848 13.5051 14.066 13.5051Z"
                    fill="#1475E1"
                  />
                </g>
              </svg>
            </span>
            <span class="text-sm cursor font-medium text-[#1475E1]">
              {{ $t('modalForm.finance.common_income.copy') }}</span
            >
          </div>
        </div>
        <div
          class="info-content"
          v-if="apiMap.PAGE_TYPE == RECHARGE.COMPANY && infoData.currency_name === 'XRP'"
        >
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ `${$t('business.common_Label')}` }}:</span
          >
          <span> {{ infoData['memo'] ? infoData['memo'] : '-' }} </span>
          <div class="flex cursor" v-if="infoData?.memo" @click="handleCopy(infoData?.memo)">
            <span class="w-[18px] h-[18px] mr-0.5 ml-2"
              ><svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="fuzhi 1">
                  <path
                    id="Vector"
                    d="M1.68945 10.1189C1.68945 10.2686 1.74909 10.4121 1.85524 10.5179C1.96138 10.6238 2.10535 10.6832 2.25547 10.6832C2.40559 10.6832 2.54955 10.6238 2.6557 10.5179C2.76185 10.4121 2.82148 10.2686 2.82148 10.1189C2.82148 9.9693 2.76185 9.82577 2.6557 9.71996C2.54955 9.61414 2.40559 9.55469 2.25547 9.55469C2.10535 9.55469 1.96138 9.61414 1.85524 9.71996C1.74909 9.82577 1.68945 9.9693 1.68945 10.1189Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_2"
                    d="M13.0439 7.92169L8.30664 7.88478C8.05527 7.88302 7.84961 8.12735 7.84961 8.4297C7.84961 8.73204 8.05527 8.97989 8.30664 8.98165L13.0439 9.01856C13.2953 9.02032 13.501 8.77599 13.501 8.47364C13.501 8.1713 13.2953 7.92345 13.0439 7.92169ZM13.0439 10.1541L8.30664 10.1172C8.05527 10.1154 7.84961 10.3598 7.84961 10.6621C7.84961 10.9645 8.05527 11.2123 8.30664 11.2141L13.0439 11.251C13.2953 11.2545 13.501 11.0084 13.501 10.7061C13.501 10.4037 13.2953 10.1559 13.0439 10.1541Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_3"
                    d="M12.9393 1.12305H7.33008C6.09258 1.12305 5.08008 2.13555 5.08008 3.37305H3.93926C2.70176 3.37305 1.68926 4.38555 1.68926 5.62305V7.87305C1.6875 8.18418 1.94238 8.43555 2.25527 8.43555C2.56816 8.43555 2.82129 8.18242 2.82129 7.87129V5.62481C2.82129 5.00606 3.32754 4.49981 3.94629 4.49981H5.08008V12.3713C5.08008 13.6088 6.09258 14.6213 7.33008 14.6213H11.8143C11.8125 15.24 11.308 15.7428 10.6893 15.7428H3.94629C3.32754 15.7428 2.82129 15.2365 2.82129 14.6178V12.366C2.82129 12.0549 2.56816 11.8018 2.25527 11.8018C1.94238 11.8018 1.6875 12.0549 1.6875 12.366V14.6213C1.6875 15.8588 2.7 16.8713 3.9375 16.8713H10.6893C11.9268 16.8713 12.9393 15.8588 12.9393 14.6213H14.0818C15.3193 14.6213 16.3318 13.6088 16.3318 12.3713V4.49805L12.9393 1.12305ZM12.941 2.2375L15.1857 4.49277H14.0625C13.4438 4.49277 12.9375 3.98652 12.9375 3.36777V2.2375H12.941ZM14.066 13.5051H7.31426C6.69551 13.5051 6.18926 12.9988 6.18926 12.3801V3.3625C6.18926 2.74375 6.69551 2.2375 7.31426 2.2375H11.7949V3.35723C11.7949 4.59473 12.8074 5.60723 14.0449 5.60723H15.191V12.3801C15.191 12.9988 14.6848 13.5051 14.066 13.5051Z"
                    fill="#1475E1"
                  />
                </g>
              </svg>
            </span>
            <span class="text-sm cursor font-medium text-[#1475E1]">
              {{ $t('modalForm.finance.common_income.copy') }}</span
            >
          </div>
        </div>

        <div
          class="info-content"
          v-if="apiMap.PAGE_TYPE == RECHARGE.COMPANY && infoData.currency_name === 'EOS'"
        >
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ `${$t('business.common_memorandum')}` }}:</span
          >
          <span> {{ infoData['memo'] ? infoData['memo'] : '-' }} </span>
          <div class="flex cursor" v-if="infoData?.memo" @click="handleCopy(infoData?.memo)">
            <span class="w-[18px] h-[18px] mr-0.5 ml-2"
              ><svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="fuzhi 1">
                  <path
                    id="Vector"
                    d="M1.68945 10.1189C1.68945 10.2686 1.74909 10.4121 1.85524 10.5179C1.96138 10.6238 2.10535 10.6832 2.25547 10.6832C2.40559 10.6832 2.54955 10.6238 2.6557 10.5179C2.76185 10.4121 2.82148 10.2686 2.82148 10.1189C2.82148 9.9693 2.76185 9.82577 2.6557 9.71996C2.54955 9.61414 2.40559 9.55469 2.25547 9.55469C2.10535 9.55469 1.96138 9.61414 1.85524 9.71996C1.74909 9.82577 1.68945 9.9693 1.68945 10.1189Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_2"
                    d="M13.0439 7.92169L8.30664 7.88478C8.05527 7.88302 7.84961 8.12735 7.84961 8.4297C7.84961 8.73204 8.05527 8.97989 8.30664 8.98165L13.0439 9.01856C13.2953 9.02032 13.501 8.77599 13.501 8.47364C13.501 8.1713 13.2953 7.92345 13.0439 7.92169ZM13.0439 10.1541L8.30664 10.1172C8.05527 10.1154 7.84961 10.3598 7.84961 10.6621C7.84961 10.9645 8.05527 11.2123 8.30664 11.2141L13.0439 11.251C13.2953 11.2545 13.501 11.0084 13.501 10.7061C13.501 10.4037 13.2953 10.1559 13.0439 10.1541Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_3"
                    d="M12.9393 1.12305H7.33008C6.09258 1.12305 5.08008 2.13555 5.08008 3.37305H3.93926C2.70176 3.37305 1.68926 4.38555 1.68926 5.62305V7.87305C1.6875 8.18418 1.94238 8.43555 2.25527 8.43555C2.56816 8.43555 2.82129 8.18242 2.82129 7.87129V5.62481C2.82129 5.00606 3.32754 4.49981 3.94629 4.49981H5.08008V12.3713C5.08008 13.6088 6.09258 14.6213 7.33008 14.6213H11.8143C11.8125 15.24 11.308 15.7428 10.6893 15.7428H3.94629C3.32754 15.7428 2.82129 15.2365 2.82129 14.6178V12.366C2.82129 12.0549 2.56816 11.8018 2.25527 11.8018C1.94238 11.8018 1.6875 12.0549 1.6875 12.366V14.6213C1.6875 15.8588 2.7 16.8713 3.9375 16.8713H10.6893C11.9268 16.8713 12.9393 15.8588 12.9393 14.6213H14.0818C15.3193 14.6213 16.3318 13.6088 16.3318 12.3713V4.49805L12.9393 1.12305ZM12.941 2.2375L15.1857 4.49277H14.0625C13.4438 4.49277 12.9375 3.98652 12.9375 3.36777V2.2375H12.941ZM14.066 13.5051H7.31426C6.69551 13.5051 6.18926 12.9988 6.18926 12.3801V3.3625C6.18926 2.74375 6.69551 2.2375 7.31426 2.2375H11.7949V3.35723C11.7949 4.59473 12.8074 5.60723 14.0449 5.60723H15.191V12.3801C15.191 12.9988 14.6848 13.5051 14.066 13.5051Z"
                    fill="#1475E1"
                  />
                </g>
              </svg>
            </span>
            <span class="text-sm cursor font-medium text-[#1475E1]">
              {{ $t('modalForm.finance.common_income.copy') }}</span
            >
          </div>
        </div>

        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_withdrawal_amount') }}:</span
          >
          <span> {{ infoData?.amount }} </span>
        </div>
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_withdrawal_free') }}:</span
          >
          <span> {{ infoData?.fee }} </span>
        </div>
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_withdrawal_actual') }}:</span
          >
          <span class="text-[#FF0000]"> {{ infoData?.finally_amount }} </span>

          <div class="flex cursor" @click="handleCopy(infoData?.finally_amount)">
            <span class="w-[18px] h-[18px] mr-0.5 ml-2"
              ><svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="fuzhi 1">
                  <path
                    id="Vector"
                    d="M1.68945 10.1189C1.68945 10.2686 1.74909 10.4121 1.85524 10.5179C1.96138 10.6238 2.10535 10.6832 2.25547 10.6832C2.40559 10.6832 2.54955 10.6238 2.6557 10.5179C2.76185 10.4121 2.82148 10.2686 2.82148 10.1189C2.82148 9.9693 2.76185 9.82577 2.6557 9.71996C2.54955 9.61414 2.40559 9.55469 2.25547 9.55469C2.10535 9.55469 1.96138 9.61414 1.85524 9.71996C1.74909 9.82577 1.68945 9.9693 1.68945 10.1189Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_2"
                    d="M13.0439 7.92169L8.30664 7.88478C8.05527 7.88302 7.84961 8.12735 7.84961 8.4297C7.84961 8.73204 8.05527 8.97989 8.30664 8.98165L13.0439 9.01856C13.2953 9.02032 13.501 8.77599 13.501 8.47364C13.501 8.1713 13.2953 7.92345 13.0439 7.92169ZM13.0439 10.1541L8.30664 10.1172C8.05527 10.1154 7.84961 10.3598 7.84961 10.6621C7.84961 10.9645 8.05527 11.2123 8.30664 11.2141L13.0439 11.251C13.2953 11.2545 13.501 11.0084 13.501 10.7061C13.501 10.4037 13.2953 10.1559 13.0439 10.1541Z"
                    fill="#1475E1"
                  />
                  <path
                    id="Vector_3"
                    d="M12.9393 1.12305H7.33008C6.09258 1.12305 5.08008 2.13555 5.08008 3.37305H3.93926C2.70176 3.37305 1.68926 4.38555 1.68926 5.62305V7.87305C1.6875 8.18418 1.94238 8.43555 2.25527 8.43555C2.56816 8.43555 2.82129 8.18242 2.82129 7.87129V5.62481C2.82129 5.00606 3.32754 4.49981 3.94629 4.49981H5.08008V12.3713C5.08008 13.6088 6.09258 14.6213 7.33008 14.6213H11.8143C11.8125 15.24 11.308 15.7428 10.6893 15.7428H3.94629C3.32754 15.7428 2.82129 15.2365 2.82129 14.6178V12.366C2.82129 12.0549 2.56816 11.8018 2.25527 11.8018C1.94238 11.8018 1.6875 12.0549 1.6875 12.366V14.6213C1.6875 15.8588 2.7 16.8713 3.9375 16.8713H10.6893C11.9268 16.8713 12.9393 15.8588 12.9393 14.6213H14.0818C15.3193 14.6213 16.3318 13.6088 16.3318 12.3713V4.49805L12.9393 1.12305ZM12.941 2.2375L15.1857 4.49277H14.0625C13.4438 4.49277 12.9375 3.98652 12.9375 3.36777V2.2375H12.941ZM14.066 13.5051H7.31426C6.69551 13.5051 6.18926 12.9988 6.18926 12.3801V3.3625C6.18926 2.74375 6.69551 2.2375 7.31426 2.2375H11.7949V3.35723C11.7949 4.59473 12.8074 5.60723 14.0449 5.60723H15.191V12.3801C15.191 12.9988 14.6848 13.5051 14.066 13.5051Z"
                    fill="#1475E1"
                  />
                </g>
              </svg>
            </span>
            <span class="text-sm cursor font-medium text-[#1475E1]">
              {{ $t('modalForm.finance.common_income.copy') }}</span
            >
          </div>
        </div>
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.notice') }}:</span
          >
          <!-- <Textarea v-model:value="infoData.remark" disabled /> -->
          <span> {{ infoData['remark'] ? infoData['remark'] : '-' }} </span>
        </div>
        <div class="info-content">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.submit_date') }}:</span
          >
          <span> {{ infoData['created_at'] }} </span>
        </div>

        <div class="info-content" v-if="statusType == 'detail'">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_approval_status') }}:</span
          >
          <span :style="'color:' + stateGameRecordWithdrawal[infoData?.state]">
            {{ stateRenderWithdrawal[infoData?.state] }}
          </span>
        </div>
        <div class="info-content" v-if="statusType === 'detail' && infoData.state == 2">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.reject_reason') }}:</span
          >
          <span> {{ infoData?.reason }} </span>
        </div>
        <div class="info-content" v-if="statusType === 'detail' && infoData.state == 2">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.reject_cause') }}:</span
          >
          <span style="width: 380px"> {{ infoData?.remark2 }} </span>
        </div>
        <div class="info-content" v-if="statusType === 'review'">
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.common_income.auditors') }}:</span
          >
          <RadioGroup v-model:value="submitInfor.state">
            <Radio value="1">{{ $t('modalForm.finance.common_income.auditors_ok') }}</Radio>
            <Radio value="2">{{ $t('modalForm.finance.common_income.auditors_reject') }}</Radio>
          </RadioGroup>
        </div>
        <div class="info-content" v-if="statusType == 'review' && submitInfor.state === '2'">
          <Form
            ref="formRef"
            autocomplete="off"
            :model="submitInfor"
            :label-col="{ style: { width: '108px' } }"
          >
            <FormItem
              :label="$t('modalForm.finance.common_income.reject_reason')"
              name="reason"
              :colon="true"
              :labelCol="{
                style: 'width: ' + labelWidth + 'px;margin-left:7px;margin-bottom:20px',
              }"
              :rules="[{ required: true }]"
            >
              <Select
                v-model:value="submitInfor.reason"
                size="large"
                style="width: 250px"
                placement="topRight"
                v-if="optionReason.length > 0"
                :getPopupContainer="getPopupContainer"
              >
                <SelectOption
                  :value="item.reason_type"
                  v-for="(item, index) in optionReason"
                  :key="index"
                  >{{ item.reason }}
                </SelectOption>
              </Select>
            </FormItem>
            <FormItem
              :label="$t('modalForm.finance.common_income.reject_cause')"
              name="remark"
              :colon="true"
              :labelCol="{ style: 'width: ' + labelWidth + 'px;margin-left:7px' }"
            >
              <Textarea v-model:value="submitInfor.remark" :allowClear="true" style="width: 100%" />
            </FormItem>
          </Form>
        </div>
        <div class="info-content" v-if="statusType == 'review' && submitInfor.state == 1">
          <span
            class="info-title"
            :style="{ width: labelWidth + 'px' }"
            v-if="infoData.withdraw_merchant_id"
            >{{ $t('modalForm.finance.finance_help_payplatform') }}:</span
          >
          <span v-if="infoData.withdraw_merchant_id">
            {{ infoData?.withdraw_merchant }}
          </span>
          <span
            class="info-title"
            :style="{ width: labelWidth + 'px' }"
            v-if="!infoData.withdraw_merchant_id && optionwithdraws.length > 1"
            >{{ $t('modalForm.finance.finance_help_payplatform') }}:</span
          >
          <Select
            ref="select"
            v-model:value="submitInfor.withdraw_merchant_id"
            style="width: 230px"
            size="large"
            placement="topRight"
            v-if="!infoData.withdraw_merchant_id && optionwithdraws.length > 1"
            :getPopupContainer="getPopupContainer"
          >
            <SelectOption :value="item.value" v-for="(item, index) in optionwithdraws" :key="index"
              >{{ item.label }}
            </SelectOption>
          </Select>
        </div>
        <div
          class="info-content"
          v-if="
            statusType == 'detail' && infoData.withdraw_merchant_state == 1 && infoData.state != 2
          "
        >
          <span class="info-title" :style="{ width: labelWidth + 'px' }"
            >{{ $t('modalForm.finance.finance_help_payplatform') }}:</span
          >
          <span>
            {{
              infoData?.withdraw_merchant
                ? infoData?.withdraw_merchant
                : $t('table.report.report_no_use_payment')
            }}
          </span>
        </div>
      </div>
      <DamaDetails v-if="curTab == '2'" :uid="recordData.order.uid" />
    </BasicModal>
  </main>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Button } from '/@/components/Button';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ReloadTooltip from '/@/views/member/common/ReloadTooltip.vue';
  import { getbalance } from '/@/api/member';
  import { RECHARGE_TYPE } from '../../../common/const';
  import DamaDetails from '/@/components/DamaDetails/index.vue';
  import cdBlockCurrency from '/@/components-cd/block/cd-block-currency.vue';

  import {
    RadioGroup,
    Radio,
    Textarea,
    Select,
    SelectOption,
    FormItem,
    Form,
    Input,
    Tooltip,
    Tabs,
    TabPane,
  } from 'ant-design-vue';
  import { getWithdrawCoinMerchant, getWithdrawMerchant, getOptionReasonApi } from '/@/api/finance';
  import { withdrawalsAuditParams } from '/@/api/model/financeModel';
  import { toTimezone } from '/@/utils/dateUtil';
  import { stateRenderWithdrawalData, stateGameRecordWithdrawalColor } from '../../const';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { setClassWidthNew } from '/@/components/Form/src/hooks/useForm.js';

  const { t } = useI18n();
  export default defineComponent({
    name: 'WithdrawalDetailsModal',
    components: {
      BasicModal,
      Button,
      ReloadTooltip,
      RadioGroup,
      Radio,
      Textarea,
      Select,
      SelectOption,
      FormItem,
      Form,
      Input,
      Tooltip,
      Tabs,
      TabPane,
      DamaDetails,
      cdBlockCurrency,
    },
    props: {
      apiMap: {
        type: Object,
        default: () => {},
      },
    },
    emits: ['reload', 'register'],
    setup(props, context) {
      const RECHARGE = RECHARGE_TYPE;
      const stateRenderWithdrawal = stateRenderWithdrawalData;
      const stateGameRecordWithdrawal = stateGameRecordWithdrawalColor;
      interface InfoData {
        created_at?: string;
        [key: string]: any;
      }
      const infoData = ref<InfoData>({});
      const recordData = ref({});
      const selectValue = ref('' as any);
      /** 操作类型 */
      const statusType = ref('detail');
      const statusTitle = ref(t('modalForm.finance.finance_withdrawal_detail'));
      const curTab = ref('1');
      const labelWidth = setClassWidthNew({ zh_CN: 80, default: 160 });
      const submitInfor = ref({
        state: '1',
        remark: '',
        reason: '',
        withdraw_merchant_id: '',
      });
      const formRef = ref();
      const optionwithdraws = ref([]);
      interface OptionReason {
        reasonType: string;
        reason: string;
      }
      const optionReason = ref<OptionReason[]>([]);
      const { clipboardRef, copiedRef, clearClipboard } = useCopyToClipboard();
      const { createMessage } = useMessage();
      const showCancelBtnComp = computed(() => {
        let res = true;
        if (statusType.value == 'detail' || curTab.value === '2') {
          res = false;
        } else {
          res = true;
        }
        return res;
      });
      const actionWid = computed(() => {
        return curTab.value === '1' ? '700px' : '972px';
      });
      const [registerModal, { setModalProps, closeModal, getVisible }] = useModalInner(
        async (data: { record: any; type: string }) => {
          setModalProps({ confirmLoading: false });
          const { record, type, status } = data;
          if (record.balance?.site_id) {
            delete record.balance.site_id;
          }
          setBalance(record);
          statusType.value = status;
          recordData.value = record;
          infoData.value = { ...record.wallet, ...record.bank_card, ...record.order };
          infoData.value.created_at = toTimezone(infoData.value.created_at);
          selectValue.value = type;
          getOptionReason();
          if (status == 'detail') {
            statusTitle.value = t('modalForm.finance.finance_withdrawal_detail'); //取款详情
          } else {
            if (infoData.value.withdraw_merchant_id) {
              submitInfor.value.withdraw_merchant_id = infoData.value.withdraw_merchant_id;
            }

            statusTitle.value = t('modalForm.finance.finance_withdrawal_operations'); //出款审核
            if (record.order.id) {
              getCompanyList(record.order.id, type);
            }
          }
        },
      );
      async function getOptionReason() {
        try {
          const res = await getOptionReasonApi({ type: 'withdraw' });
          optionReason.value = res.reject_reason;
        } catch (error) {
          optionReason.value = [];
        }
      }
      async function getCompanyList(id, type) {
        let companyList = [];
        optionwithdraws.value = [];
        try {
          if (type === 'online_withdrawal') {
            companyList = await getWithdrawMerchant({ id });
          } else {
            companyList = await getWithdrawCoinMerchant({ id });
          }
        } catch (error) {
          companyList = [];
        }
        const options = companyList
          ? companyList.map((el) => ({
              label: el.name,
              value: el.id,
            }))
          : [];

        options.unshift({ label: t('table.report.report_no_use_payment'), value: '' });
        optionwithdraws.value = options;
      }
      function handleCopy(value) {
        if (!value) {
          createMessage.warning(t('table.promotion.promotion_please_copy_content'));
          return;
        }
        clearClipboard();
        clipboardRef.value = value;
        if (unref(copiedRef)) {
          createMessage.success(t('business.common_copy_suceess'));
        }
      }

      // 构建余额数据
      function setBalanceList(item, id, name, _list) {
        if (Reflect.has(item[id], 'uid')) {
          delete item[id].uid;
        }
        const list = {
          id: id,
          name: name,
          list: Object.keys(item[id]).map((label) => ({ label, value: item[id][label] })),
        };
        _list.push(list);
      }

      function setBalance(item) {
        if (!item._balanceList) {
          item._balanceList = [];
        }

        if (!item._commissionList) {
          item._commissionList = [];
        }

        if (item.balance) {
          setBalanceList(item, 'balance', t('common.balance'), item._balanceList);
        }
        if (item.commission) {
          setBalanceList(item, 'commission', '', item._commissionList);
        }
      }

      function hadnleRealodAmount(record) {
        getbalance({ uid: record.uid }).then((res) => {
          createMessage.success(t('table.member.member_balance_sucess'));
          recordData.value.balance = res;
          recordData.value._balanceList = [];
          setBalance(recordData.value);
        });
      }

      async function handleSubmit(): Promise<void> {
        try {
          setModalProps({ confirmLoading: true });
          if (Number(submitInfor.value.state) === 2) {
            formRef.value
              .validate()
              .then((value) => {
                handleReview();
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
            handleReview();
          }
        } catch (e) {
          console.error(e);
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      function focusCloseEvent(data) {
        if (!data) {
          submitInfor.value.withdraw_merchant_id = '';
          submitInfor.value.state = '1';
          submitInfor.value.remark = '';
          submitInfor.value.reason = '';
        }
      }
      async function handleReview() {
        const { state, remark, withdraw_merchant_id, reason } = submitInfor.value;
        const payload: withdrawalsAuditParams = {
          state: Number(state),
          id: recordData.value.order.id,
          reason: reason.toString(),
          remark,
        };
        if (Number(submitInfor.value.state) === 1)
          payload.withdraw_merchant_id = withdraw_merchant_id;
        const { status, data } = await props.apiMap.reviewApi(payload);
        if (status) {
          createMessage.success(data);
          context.emit('reload');
          setModalProps({ confirmLoading: false });
          closeModal();
        } else {
          createMessage.error(data);
        }
      }

      watch(getVisible, (val) => {
        if (val === false) {
          curTab.value = '1';
        }
      });

      return {
        registerModal,
        closeModal,
        infoData,
        handleCopy,
        recordData,
        hadnleRealodAmount,
        statusTitle,
        statusType,
        optionwithdraws,
        optionReason,
        submitInfor,
        formRef,
        handleSubmit,
        stateRenderWithdrawal,
        RECHARGE,
        stateGameRecordWithdrawal,
        curTab,
        showCancelBtnComp,
        actionWid,
        focusCloseEvent,
        labelWidth,
      };
    },
  });
</script>
<style scoped lang="less">
  .main {
    position: relative;

    ::v-deep(.ant-modal-header) {
      height: 60px;
      border-bottom: none;
      background-color: #1475e1 !important;
    }

    ::v-deep(.ant-modal-wrap) {
      overflow: visible;
    }

    ::v-deep(.scrollbar) {
      overflow: visible;
    }

    ::v-deep(.capsule_tap .ant-tabs-nav-list) {
      border: none;
      background-color: #1475e1;
    }

    ::v-deep(.capsule_tap .ant-tabs-tab-btn) {
      height: 40px;
      color: white;
      font-size: 18px;
      font-weight: 500;
    }

    ::v-deep(.capsule_tap .ant-tabs-tab-active > .ant-tabs-tab-btn) {
      color: #1475e1 !important;
    }

    ::v-deep(.ant-tabs-tab-active > .ant-tabs-tab-btn) {
      background-color: white;
    }

    .copyNowrap {
      white-space: nowrap;
    }

    .boderBox {
      box-sizing: border-box;
      border-bottom: 1px solid #dce3f1;
    }
  }

  /* .info-content {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-left: 15px;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 1.68px;
    line-height: normal;
    text-align: left;
    word-break: break-all;
  } */

  .info-content {
    display: flex;
    margin-bottom: 20px;
    padding-left: 15px;
  }

  .info-title {
    // width: 100px;
    margin-right: 23px;
    overflow: hidden;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-align: right;
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;
  }

  .red {
    color: #e91134;
  }

  .green {
    color: #1cd91c;
  }

  .blue {
    color: #096dd9;
  }

  .ant-form-item {
    margin-bottom: 0 !important;
  }

  ::v-deep(.ant-form-item-label) {
    margin-right: 16px !important;
  }
</style>
