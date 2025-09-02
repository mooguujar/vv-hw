<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    @register="registerModal"
    :title="title"
    @ok="handleSubmit"
    :okText="$t('common.okText')"
    :cancelText="$t('common.cancelText')"
  >
    <BasicForm @register="registerForm" class="relative -left-3" @field-value-change="fieldChang">
      <template #reloadTime2="{ model, field }">
        <div :class="{ 'flex specialCss': openTerminalOptions.length <= 7 }">
          <FormItemRest>
            <Checkbox
              class="relative z-99 all-check-box whitespace-nowrap"
              v-model:checked="openTerminalState.checkAll"
              :indeterminate="openTerminalState.indeterminate"
              @change="onCheckAllChange($event, model, field)"
            >
              {{ t('business.common_select_all') }}
            </Checkbox>
          </FormItemRest>
          <CheckboxGroup
            :class="{ terminal: openTerminalOptions.length > 7 }"
            v-model:value="openTerminalState.checkedList"
            @change="onChangeOpenTerminal($event, model, field)"
            class="check-box-div"
          >
            <Checkbox v-for="(item, index) in openTerminalOptions" :value="item" :key="index">
              <div>
                <cdIconCurrency :icon="item" class="w-15px lable-icon" />
                {{ item }}
              </div>
            </Checkbox>
          </CheckboxGroup>
        </div>
      </template>
      <template #colSlot_field5="{ model, field, disabled }">
        <div
          :class="[
            { 'h-60px': allCurrencyValueInput.length == 1 },
            { 'h-170px': allCurrencyValueInput.length > 2 },
          ]"
        >
          <ScrollContainer>
            <Form v-if="allCurrencyValueInput.length > 0" ref="formRef" :model="modelRef">
              <Row v-for="(item, index) in allCurrencyValueInput" :key="index">
                <Col :span="12">
                  <FormItem
                    :name="item.value + '_amount'"
                    labelWidth="auto"
                    :rules="[
                      {
                        required: true,
                        message: t('modalForm.discountActivity.member_amount_tip'),
                        trigger: 'change',
                      },
                    ]"
                  >
                    <template #label>
                      <div style="display: flex">
                        <span>
                          <span class="w-15px h-15px">
                            <cdIconCurrency :icon="item.label" class="w-15px h-15px mb-1 mr-1"
                          /></span>

                          <span class="label-span">{{ item.label }}</span>
                          {{ t('modalForm.discountActivity.minimum_deposit') }}
                        </span>
                      </div>
                    </template>
                    <InputNumber
                      v-model:value="modelRef[item.value + '_amount']"
                      :placeholder="t('business.banner_tip')"
                      :size="FORM_SIZE"
                      :stringMode="true"
                      v-if="item.value === '708'"
                      :precision="8"
                      :formatter="formatter"
                    />
                    <InputNumber
                      v-model:value="modelRef[item.value + '_amount']"
                      :placeholder="t('business.banner_tip')"
                      :size="FORM_SIZE"
                      v-else-if="item.value === '707'"
                      :stringMode="true"
                      :precision="8"
                      :formatter="formatter"
                    />
                    <InputNumber
                      v-model:value="modelRef[item.value + '_amount']"
                      :placeholder="t('business.banner_tip')"
                      :size="FORM_SIZE"
                      :stringMode="true"
                      v-else
                      :precision="2"
                      :formatter="formatter"
                    />
                  </FormItem>
                </Col>
                <Col :span="12">
                  <FormItem
                    :name="item.value + '_rate'"
                    :label="`${t('table.discountActivity.discount_year_rate')}(%):`"
                    labelWidth="auto"
                    :labelCol="{ style: { marginLeft: '20px' } }"
                    :rules="[
                      {
                        required: true,
                        message: t('modalForm.discountActivity.member_tip_rate'),
                        trigger: 'change',
                      },
                    ]"
                  >
                    <InputNumber
                      v-model:value="modelRef[item.value + '_rate']"
                      :placeholder="t('business.banner_tip')"
                      :size="FORM_SIZE"
                      :stringMode="true"
                      :precision="2"
                    />
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <template v-else>
              <Empty />
            </template>
          </ScrollContainer>
        </div>
      </template>
      <template #InterestLimit="{ model, field }">
        <div class="flex flex-row justify-start items-center">
          <InputNumber
            v-model:value="model[field]"
            :size="FORM_SIZE"
            :placeholder="`${t('modalForm.discountActivity.wo_limit_zero')}`"
          />
          <div class="whitespace-nowrap"
            >&nbsp;&nbsp;&nbsp;{{
              $t('modalForm.discountActivity.no_longer_generated_interest')
            }}</div
          >
        </div>
      </template>
      <template #previewText>
        <div class="w-full h-400px h-1 border border-gray-300 bg p-2 overflow-y-scroll">
          <div class="tg-rich-area" v-html="currentLangText.transitionValue"></div>
        </div>
      </template>
      <template #uploadText>
        <FormItem required>
          <LangRadioGroup
            class="!m-b-5 !-mt-1"
            :contentList="contentList"
            @click:radio="handlelanguageLevelText"
          />
          <Textarea :rows="12" :width="800" v-model:value="currentLang.textContent" disabled />
        </FormItem>
      </template>
      <template #uploadTextRule>
        <FormItem required>
          <LangRadioGroup
            class="!m-b-5 !-mt-1"
            :contentList="contentList"
            @click:radio="handlelanguageLevelText"
          />
          <Tinymce
            v-model="currentLangText.transitionValue"
            :showImageUpload="false"
            @change="handleTinymceChange"
            @blur="handleTinymceBlur"
          />
        </FormItem>
      </template>
      <template #selectVIP="{ model, field }">
        <Select
          v-model:value="model[field]"
          mode="multiple"
          :size="FORM_SIZE"
          :placeholder="t('modalForm.discountActivity.member_vip_tip0')"
          @change="changeHandle"
          class="select_render_vip"
        >
          <SelectOption value="all">
            {{ $t('business.common_select_all') }}
            <Checkbox class="!m-l-3" v-model:checked="checkVipValues" />
          </SelectOption>
          <SelectOption v-for="option in optionsListVip" :key="option.value" :value="option.value"
            >{{ option.label }}
          </SelectOption>
        </Select>
      </template>
      <template #selectMember="{ model, field }">
        <Select
          mode="multiple"
          :size="FORM_SIZE"
          :placeholder="t('modalForm.discountActivity.member_tip0')"
          v-model:value="model[field]"
          :class="{ '!h-20 !overflow-x-auto': getSelectValue.length > 10 }"
          @change="changeMemberHandle"
        >
          <SelectOption value="all"
            >{{ $t('business.common_select_all') }}
            <Checkbox class="!m-l-3" v-model:checked="checkMemberValues" />
          </SelectOption>
          <SelectOption
            v-for="option in optionsListMember"
            :key="option.value"
            :value="option.value"
            >{{ option.label }}
          </SelectOption>
        </Select>
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, watch, nextTick, computed, onMounted, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { accountFormSchema } from './index.data.ts';
  import { useFormSetting } from '/@/hooks/setting/useFormSetting';
  import { ScrollContainer } from '/@/components/Container/index';
  import { useLocalList } from '/@/settings/localeSetting';
  import LangRadioGroup from '../LangRadioGroup/index.vue';
  import { Tinymce } from '/@/components/Tinymce/index';
  import translateContentList from '/@/views/system/informationCenter/common/language';
  import { useMemberStore } from '/@/store/modules/member';
  import {
    Input,
    message,
    FormItemRest,
    FormItem,
    Checkbox,
    CheckboxGroup,
    Row,
    Col,
    InputNumber,
    Empty,
    Form,
    Select,
    SelectOption,
    Textarea,
  } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useTreeListStore } from '/@/store/modules/treeList';
  import { insertInterest, updateInterest, getUseList } from '/@/api/activity';
  import { convertSecondsToTimeFormat } from '../../const';
  import type { FormInstance } from 'ant-design-vue';
  import { useAutoLabelWidth } from '/@/components/Form/src/hooks/useForm.js';
  import cdIconCurrency from '/@/components-cd/Icon/currency/cd-icon-currency.vue';
  import { mul, div } from '/@/utils/number';
  import { useLocale } from '@/locales/useLocale';

  useAutoLabelWidth(accountFormSchema);
  const localeList = useLocalList();

  const FORM_SIZE = useFormSetting().getFormSize;
  const { currencyTreeList } = useTreeListStore();
  const model = ref({
    translate: 1,
  });
  const { t } = useI18n();
  const { getLocale } = useLocale();
  interface LangItem {
    label: string; // 多语言描述
    value: string | number; // 多语言key
    transitionValue: string; // 多语言文本
    image_url: string; // 多语言图片地址
    language: string; // 多语言类型
    file?: FileReader; // file文件
    textContent?: string;
  }
  export default defineComponent({
    name: 'WithdrawalsAuditModal',
    components: {
      BasicModal,
      BasicForm,
      CheckboxGroup,
      Checkbox,
      FormItemRest,
      FormItem,
      Input,
      Row,
      Col,
      ScrollContainer,
      LangRadioGroup,
      Tinymce,
      InputNumber,
      Empty,
      Form,
      cdIconCurrency,
      Select,
      SelectOption,
      Textarea,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const formRef = ref<FormInstance>();
      const getSelectValue = ref([] as any);
      const memberStore = useMemberStore();
      // 获取VIP等级下拉
      memberStore.getVipLevelList();
      // 获取层级下拉
      memberStore.getLevelList();
      const extraList = [
        {
          label: t('business.common_original'),
          value: 'original',
          transitionValue: '',
          image_url: '',
          language: 'original',
          textContent: '',
        },
      ];
      const isShowRules = ref(false as Boolean);

      let allCurrencyValueInput = ref([]);
      const title = ref(t('modalForm.discountActivity.new_interest_bank') as string);
      const modelRef = ref({});

      const openTerminalState = reactive({
        indeterminate: false,
        checkAll: false,
        checkedList: [],
      });
      const checkMemberValues = ref(false as any);
      const checkVipValues = ref(false as any);
      const openTerminalOptions = ref([]);
      async function initCurrencyTreeList(checkedList?) {
        const data = await getUseList();
        let filterCurrencyTreeList = [];
        if (checkedList) {
          filterCurrencyTreeList = currencyTreeList.filter((item) => !data.includes(item.id));
          let currencyCheckedList = currencyTreeList.filter(
            (item) => checkedList.indexOf(item.id) >= 0,
          );
          filterCurrencyTreeList = [...currencyCheckedList, ...filterCurrencyTreeList];
        } else {
          if (data) {
            filterCurrencyTreeList = currencyTreeList.filter((item) => !data.includes(item.id));
          } else {
            filterCurrencyTreeList = currencyTreeList;
          }
        }

        openTerminalOptions.value = [];
        filterCurrencyTreeList.map((item: any) => {
          modelRef.value[item.value + '_amount'] = '';
          modelRef.value[item.value + '_rate'] = '';
          openTerminalOptions.value.push(item.name);
        });
      }
      const currentlanguageIndex = ref(0 as any);
      function formatter(value) {
        // 去掉多余的0
        return value ? parseFloat(value).toString() : null;
      }
      const langList = localeList.map((item) => {
        return {
          // label: item.text,
          label: t('common.common_' + item.event),
          value: item.event,
          transitionValue: '',
          image_url: '',
          textContent: getTextData()[item.event],
          language: item.language || '',
          fileList: [],
        };
      });
      const optionsListVip = computed(() => {
        const outputArray: { label: string; value: string }[] = [];
        for (const key in memberStore.vipLevelSelect) {
          outputArray.push({
            label: `VIP${memberStore.vipLevelSelect[key]}`,
            value: String(memberStore.vipLevelSelect[key]),
          });
        }
        return outputArray;
      });
      watch(
        () => checkMemberValues.value,
        (v) => {
          if (!v) {
            setFieldsValue({ join_object_value3: [] });
          }
        },
      );
      watch(
        () => checkVipValues.value,
        (v) => {
          if (!v) {
            setFieldsValue({ join_object_value4: [] });
          }
        },
      );
      const optionsListMember = computed(() => {
        const outputArray: { label: string; value: string }[] = [];
        for (const key in memberStore.levelSelect) {
          outputArray.push({ label: memberStore.levelSelect[key], value: key });
        }
        return outputArray;
      });
      const contentList = ref<Array<LangItem>>([...langList]);
      const currentLangIndex = ref(0);
      const currentLang = ref(contentList.value[0]); // 当前语言公告内容
      const currentLangText = ref(contentList.value[0] as any);
      const tinymceIsChange = ref(false);
      const FORM_SIZE = useFormSetting().getFormSize;

      const [
        registerForm,
        { setFieldsValue, validate, resetFields, clearValidate, getFieldsValue },
      ] = useForm({
        // labelCol: { span: 5 },
        schemas: accountFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 22,
        },
        size: FORM_SIZE,
      });
      function getTextData() {
        //标题的分割 必须用中文的冒号，为了防止其他语言自动转译在冒号前必须加反斜杠 \
        const textVlues = {
          zh_CN: ` 收益介绍：存入利息宝的金额,至少满足一个完整周期才能产生利息,若中途提前转出则该周期不计算收益；例如\:当前结算周期为1小时,则2024-01-01 00:22:01转入的金额,将在2024-01-01 02:00:01产生第一个周期利息。
     计算公式：利息收益=存入金额*年利率/结算周期。
     举例说明：A于2024-01-01 00:22:01存入10000,年利率为15%,结算周期为1小时,则于2024-01-01 02:00:01获得首次利息收益,计算方式如下;首次利息 =10000* 15% / 365天/ 24小时*1小时=0.171232。
     领取时间：随时领取,即当天产生的利息,随时都可以领取。
     稽核倍数：当前稽核倍数为1倍(投注流水要求),即所领取的利息,需要进行投注后,才能提现,投注[不限游戏平台]仅限于所领取的利息需要稽核。
     活动声明：本功能仅限账号本人进行正常游戏投注,禁止租借账号、无风险投注(对赌、对刷、低赔刷水、恶意套利、使用外挂程式、机器人、利用协议、漏洞、接口、群控)或其他技术手段参与,一经查核属实,本平台有权终止会员登录、暂停会员使用网站、及没收奖金和不当盈利的权利,无需特别通知。`,
          en_US: `  Interest Introduction\：The amount deposited in the Interest Treasure must satisfy at least one complete cycle to generate interest. If withdrawn early, that cycle will not calculate interest; For example: If the current settlement cycle is 1 hour, then the amount deposited at 2024-01-01 00:22:01 will generate the first cycle interest at 2024-01-01 02:00:01.
     Calculation Formula\：Interest earnings = deposited amount x annual interest rate / settlement cycle.
     Example Explanation\：A deposits 10,000 on 2024-01-01 00:22:01, with an annual interest rate of 15%, and the settlement cycle is 1 hour. The first interest earnings will be obtained on 2024-01-01 02:00:01, calculated as follows: First interest = 10,000 x 15% / 365 days / 24 hours x 1 hour = 0.171232.
     Withdrawal Time\：Can be withdrawn at any time; that is, the interest generated on the same day can be withdrawn at any time.
     Audit Rollover\：The current audit rollover is 1 time (bet turnover requirement), meaning the interest received needs to be bet before withdrawal. Bets [no limit on gaming platform] are only limited to the received interest that needs auditing.
  Activity Statement\：This function is only for the account holder to participate in normal game betting. Renting accounts, risk-free betting (matched betting, arbitrage betting, low odds water betting, malicious arbitrage, using external programs, bots, agreements, vulnerabilities, interfaces, group control), or other technical means are prohibited. Upon verification, the platform reserves the right to terminate the member's login, suspend the member's use of the website, and confiscate bonuses and improper earnings without prior notice.`,
          pt_BR: `   Introdução aos Rendimentos\：O valor depositado no Tesouro de Juros deve completar pelo menos um ciclo completo para gerar juros. Se for retirado antecipadamente, esse ciclo não incidirá juros; Por exemplo: Se o ciclo de liquidação atual for de 1 hora, o valor depositado em 2024-01-01 00:22:01 gerará os primeiros juros do ciclo em 2024-01-01 02:00:01
     Fórmula de Cálculo\：Rendimentos de juros = valor depositado x taxa de juros anual / ciclo de liquidação.
     Exemplo\：A deposita 10.000 em 2024-01-01 00:22:01, com uma taxa de juros anual de 15%, e o ciclo de liquidação é de 1 hora. Os primeiros rendimentos de juros serão obtidos em 2024-01-01 02:00:01, calculados da seguinte forma: Primeiros juros = 10.000 x 15% / 365 dias / 24 horas x 1 hora = 0,171232.
     Tempo de Retirada\：Pode ser retirado a qualquer momento; ou seja, os juros gerados no mesmo dia podem ser retirados a qualquer momento.
     Rollover de Auditoria\：O rollover de auditoria atual é de 1 vez (exigência de volume de apostas), o que significa que os juros recebidos precisam ser apostados antes da retirada. As apostas [sem limite na plataforma de jogos] são limitadas apenas aos juros recebidos que precisam de auditoria.
     Declaração da Atividade\：Esta função é apenas para o titular da conta participar de apostas normais em jogos. É proibido alugar contas, apostas sem risco (apostas combinadas, arbitragem, apostas com odds baixas, arbitragem maliciosa, uso de programas externos, bots, acordos, vulnerabilidades, interfaces, controle de grupo) ou outros meios técnicos. Uma vezes detectado, a plataforma reserva-se o direito de encerrar o login do membro, suspender o uso do site pelo membro e confiscar bônus e ganhos indevidos sem aviso prévio.`,
          vi_VN: `  Giới thiệu\：Số tiền gửi vào kho ít nhất phải đáp ứng đủ 1 chu kỳ thì mới có khả năng sinh lời, nếu rút trước thì số tiên gửi trong chu kỳ đó sẽ không tính lãi;Ví dụ: Chu kỳ kết toán lãi suất hiện tại là 1 giờ, số tiền gửi vào lúc 00:22:01 ngày 01-01-2024 thì lãi suất chu kỳ thứ nhất sẽ được tính từ 02:00:01 ngày 01-01-2024.
    Công thức tính\：Lãi suất= Số tiền gửi*Lãi suất năm/Chu kỳ hết toán.
    Ví dụ tham khảo\：00:22:01 ngày 01-01-2024 A gửi 10000, lãi suất năm 15%, chu kỳ kết toán là 1 giờ. Do đó, từ 02:00:01 ngày 01-01-2024 A sẽ nhận được khoản tiền lãi đầu tiên, công thức tính như sau: Lãi suất = 10.000*15%/365ngày/24giờ * 1giờ = 0.171323.
    Thời gian nhận lãi\：Nhận vào bất kỳ thời gian nào trong ngày, tức là tiền lãi sản sinh trong ngày có thể rút bất kỳ lúc nào.
    Kiểm tra bội số\：Bội số hiện tại là 1 lần ( yêu cầu về tiền vòng cược ), nghĩa là muốn nhận tiền thắng cược cần tiến hành đặt cược mới có thể rút. Đặt cược ( không hạn chế trò chơi trên nền tảng) , chỉ có tiền lãi nhận được mới cần được kiểm tra.
    Tuyên bố sự kiện\：Chức năng này giới hạn chủ tài khoản tiến hành các trò chơi cá cược thông thường, nghiêm cấm vay mượn tài khoản , cá cược không rủi ro ( cược đôi, gian lận, gian lận tiền vòng cược, ác ý thao túng, sử dụng phần mềm gian lận, robot, lợi dụng thoả thuận, lỗ hổng trò chơi, kiểm soát theo nhóm) hoặc các thủ đoạn sử dụng phương tiện kỹ thuật khác đều bị cấm. Một khi có phát hiện bất thường nền tảng có quyền cấm đăng nhập, tạm dừng hội viên sử dụng nền tảng, tịch thu tiền thưởng và lợi nhuận do gian lận mà không cần thông báo trước.`,
          th_TH: `  การแนะนำผลกำไรตอบแทน\：จำนวนเงินที่ฝากเข้าคลังดอกเบี้ย ต้องมีอย่างน้อยหนึ่งรอบเต็มจึงจะได้รับดอกเบี้ย หากโอนออกก่อนกำหนดผลกำไรจะไม่ถูกคำนวน ตัวอย่างเช่น ระยะเวลาการคำนวณคือ 1 ชั่วโมง จากยอดโอนเข้าวันที่ 01/01/2024 เวลา 00:22:01 ดอกเบี้ยรอบแรกจะเกิดขึ้นเวลา  02:00:01 วันที่ 01/01/2024
      สูตรการคำนวณคือ\：จำนวนเงินฝาก x อัตราดอกเบี้ยรายปี ÷ รอบการคำนวณ = ดอกเบี้ย
      ตัวอย่างและคำอธิบาย\：A ฝากเงิน 10000 ในวันที่ 01/01/2024 เวลา 00:22:01 ดอกเบี้ยรายปีคือ 15% และรอบการคำนวณคือ 1 ชั่วโมง จากนั้นจะได้รับดอกเบี้ยงวดแรกในวันที่ 01/01/2024 เวลา 02:00:01 วิธีการคำนวณมีดังนี้ ดอกเบี้ย（ดอกเบี้ยครั้งแรก = 10000 x 15% ÷ 365 วัน ÷ 24 ชั่วโมง x 1 ชั่วโมง = 0.171232）
      เวลาในการรับคือ\：คุณสามารถรับได้ตลอดเวลา คือ คุณสามารถรับได้เฉพาะดอกเบี้ยที่เกิดขึ้นในวันนั้นเท่านั้น
      การตรวจสอบจำนวนตัวคูณคือ\：การตรวจสอบจำนวนตัวคูณปัจจุบันคือ 1 เท่า (ข้อกำหนดเงินคืนจากการเดิมพัน) กล่าวคือ ดอกเบี้ยที่ได้รับจะต้องถูกเดิมพันก่อนจึงจะสามารถถอนออกได้ โดยการเดิมพันนั้น (ไม่จำกัดแพลตฟอร์มเกมที่เล่น) จำกัดเฉพาะดอกเบี้ยที่ได้รับหลังจากตรวจสอบและคำนวนเสร็จสิ้นแล้วเท่านั้น
      คำชี้แจงกิจกรรมคือ\：ฟังก์ชั่นนี้จำกัดเฉพาะการเดิมพันโดยเจ้าของบัญชีเท่านั้น ห้ามมีการเช่าบัญชี การเดิมพันแบบโกงความเสี่ยง ( โกงการเดิมพันโดยช่อโกงแต้มในมือผู้เล่นและผู้สมรู้ร่วมคิด เดิมพันพร้อมกันเพื่อวัตถุประสงค์ในการทำธุรกรรมที่ผิดกฎหมายและการเก็งกำไรจากช่องโหว่พิเศษ ) การเก็งกำไรที่อันตราย การใช้ ปลั๊กอิน บอท และการใช้ประโยชน์จากโปรโตคอล ช่องโหว่ อินเตอร์เฟซ การควบคุมกลุ่มหรือวิธีการทางเทคนิคอื่นๆ ที่เกี่ยวข้อง หากพบเห็นและตรวจสอบเป็นจริง ทางแพลตฟอร์มมีสิทธิ์หยุดและระงับการใช้งานของสมาชิก รวมทั้งยึดโบนัสและผลกำไรที่ไม่เหมาะสมทั้งหมด โดยไม่ต้องแจ้งให้ทราบ`,
          hi_IN: `  ब्याज परिचय\：ब्याज खजाने में जमा की गई राशि को ब्याज उत्पन्न करने के लिए कम से कम एक पूर्ण चक्र पूरा करना होगा। यदि जल्दी निकासी की जाती है, तो वह चक्र ब्याज की गणना नहीं करेगा;उदाहरण के लिए: यदि वर्तमान निपटान चक्र 1 घंटा है, तो 2024-01-01 00:22:01 पर जमा की गई राशि 2024-01-01 02:00:01 पर पहले चक्र का ब्याज उत्पन्न करेगी।
      गणना सूत्र\：ब्याज आय = जमा राशि x वार्षिक ब्याज दर / निपटान चक्र।
      उदाहरण स्पष्टीकरण\：A, 2024-01-01 00:22:01 को 15% की वार्षिक ब्याज दर के साथ 10,000 जमा करता है, और निपटान चक्र 1 घंटा है। पहली ब्याज आय 2024-01-01 02:00:01 को प्राप्त की जाएगी, जिसकी गणना निम्नानुसार की जाएगी:पहला ब्याज = 10,000 x 15% / 365 दिन / 24 घंटे x 1 घंटा = 0.171232।
      निकासी का समय\：किसी भी समय निकासी की जा सकती है; यानी उसी दिन उत्पन्न ब्याज को किसी भी समय निकाला जा सकता है।
      ऑडिट रोलओवर\：वर्तमान ऑडिट रोलओवर 1 गुना (बेट टर्नओवर आवश्यकता) है, जिसका अर्थ है कि प्राप्त ब्याज को निकासी से पहले दांव पर लगाना होगा। दांव [गेमिंग प्लेटफ़ॉर्म पर कोई सीमा नहीं] केवल प्राप्त ब्याज तक ही सीमित है जिसके लिए ऑडिटिंग की आवश्यकता है।
      गतिविधि विवरण\：यह फ़ंक्शन केवल खाताधारक के लिए सामान्य गेम सट्टेबाजी में भाग लेने के लिए है। किराये पर खाते, जोखिम-मुक्त सट्टेबाजी (मिलान सट्टेबाजी, मध्यस्थता सट्टेबाजी, कम बाधाओं वाले पानी की सट्टेबाजी, दुर्भावनापूर्ण मध्यस्थता, बाहरी कार्यक्रमों, बॉट, समझौतों, कमजोरियों, इंटरफेस, समूह नियंत्रण) या अन्य तकनीकी साधनों का उपयोग करना निषिद्ध है। सत्यापन पर, प्लेटफ़ॉर्म सदस्य के लॉगिन को समाप्त करने, वेबसाइट के सदस्य के उपयोग को निलंबित करने और पूर्व सूचना के बिना बोनस और अनुचित कमाई को जब्त करने का अधिकार सुरक्षित रखता है।`,
          tl_PH: `  Panimulang Paliwanag ng Kita: Ang halagang ideposito sa Interest Bonus ay dapat tumugma sa kahit isang buong cycle bago makalikha ng interes. Kung ito ay ma-withdraw nang maaga, ang cycle na iyon ay hindi bibilangin para sa kita. Halimbawa: Kung ang kasalukuyang settlement cycle ay 1 oras, ang halagang idineposito noong 2024-01-01 00:22:01 ay makakakuha ng unang cycle ng interes sa 2024-01-01 02:00:01.
      Formula ng Kalkulasyon: Kita mula sa interes = Halagang idineposito * Taunang interest rate / Settlement cycle.
      Halimbawa: Si A ay nagdeposito ng 10000 noong 2024-01-01 00:22:01, na may taunang interest rate na 15% at settlement cycle na 1 oras. Sa 2024-01-01 02:00:01, makakakuha siya ng unang kita sa interes. Kalkulasyon: Unang interes = 10000 * 15% / 365 araw / 24 oras * 1 oras = 0.171232.
      Oras ng Pag-claim: Maaaring i-claim anumang oras; ang interes na nalikha sa parehong araw ay maaaring i-claim kaagad.
      Audit Multiple: Ang kasalukuyang audit multiple ay 1x (requirement ng betting turnover), ibig sabihin ang interes na na-claim ay kailangang ipusta muna bago ma-withdraw. Ang pagtaya [walang limitasyon sa game platform] ay nalalapat lamang sa interes na na-claim para sa audit.
      Pahayag ng Event: Ang tampok na ito ay para lamang sa normal na pagtaya ng may-ari ng account. Mahigpit na ipinagbabawal ang pagrenta ng account, risk-free betting (pagtutugma ng pusta, pag-brush ng parehong panig, mababang odds brushing, malicious arbitrage, paggamit ng cheat program, bot, paggamit ng protocol, bug, API, group control) o iba pang teknikal na paraan. Kapag napatunayan, may karapatan ang platform na ihinto ang login ng miyembro, suspindihin ang paggamit ng site, at kumpiskahin ang bonus at hindi tamang kita, nang walang paunang abiso.`,
          ko_KR: `  수익 소개：이자 상품에 입금된 금액은 최소 한 번의 완전한 주기를 만족해야 이자가 발생합니다. 만약 중간에 조기 출금하는 경우 해당 주기는 수익이 계산되지 않습니다. 예를 들어, 현재 정산 주기가 1시간이라면, 2024-01-01 00:22:01에 입금된 금액은 2024-01-01 02:00:01에 첫 번째 주기 이자가 발생합니다.
      계산 공식：이자 수익 = 입금 금액 * 연이율 / 정산 주기
      예시：A가 2024-01-01 00:22:01에 10,000을 입금하고 연이율이 15%, 정산 주기가 1시간일 경우, 2024-01-01 02:00:01에 첫 이자 수익을 얻게 되며 계산 방식은 다음과 같습니다:
      첫 이자 = 10,000 * 15% / 365일 / 24시간 * 1시간 = 0.171232
      수령 시간：언제든지 수령 가능하며, 당일 발생한 이자는 언제든지 수령할 수 있습니다.
      감사 배수：현재 감사 배수는 1배(베팅 롤링 조건)이며, 이는 수령한 이자를 베팅에 사용한 후에야 출금이 가능하다는 의미입니다. 베팅은 [게임 플랫폼에 제한 없음]이며, 수령한 이자에 대해서만 감사가 필요합니다.
      활동 규정：본 기능은 계정 소유자 본인의 정상적인 게임 베팅에 한정됩니다. 계정 대여, 무위험 베팅(맞대기, 맞플, 낮은 배당률 롤링, 악의적 차익거래, 외부 프로그램 사용, 봇, 프로토콜/버그/인터페이스/단체 통제 이용) 또는 기타 기술적 수단으로 참여하는 것을 금지합니다. 위반 사실이 확인될 경우, 본 플랫폼은 회원 로그인 중지, 웹사이트 사용 중단, 상금 및 부당 이익을 몰수할 권리가 있으며, 별도의 통지는 하지 않습니다.`,
        };
        return textVlues;
      }
      const [registerModal, { closeModal, changeOkLoading }] = useModalInner(async (data) => {
        // 数据回显
        if (data.id) {
          title.value = t('modalForm.discountActivity.editor_interest_treasure'); //编辑利息宝
          await initCurrencyTreeList(data.currency_ids);
          checkMemberValues.value = true;
          formRef?.value?.clearValidate();
          //转化对象转化
          switch (data.join_object_type) {
            case 2:
            case 5:
              data[`join_object_value${data.join_object_type}`] = data.join_object_values;
              break;
            case 3:
            case 4:
              data[`join_object_value${data.join_object_type}`] = data.join_object_values;
              break;
            // 如有需要，可以添加更多的 case 或默认情况
          }
          //币种转化 未写
          // checkvalue.value
          try {
            const config = data.configs;
            if (data.rule_type == 1) {
              contentList.value = [...langList];
            } else {
              contentList.value = [...extraList, ...langList];
            }
            openTerminalState.checkedList = data.currency_names;
            // contentList.value.forEach((item) => {
            //   //item.transitionValueContent = summary[item.value];
            // });
            config.map((item: any) => {
              modelRef.value[item.currency_id + '_amount'] = item.min_deposit;
              modelRef.value[item.currency_id + '_rate'] = item.interest_rate * 100;
            });
          } catch (error) {
            console.error('Error parsing JSON:', error);
            // 处理解析错误或设置默认行为
          }
          //结算周期
          // eslint-disable-next-line no-inner-declarations
          function mapBillTimeToNumber(billTimeStr: any) {
            const timeMapping: any = {
              '1小时': 1,
              '12小时': 2,
              '24小时': 3,
            };
            return timeMapping[billTimeStr] || 4; // 如果没有匹配，返回默认值4
          }
          // 使用
          const billTimeStr = convertSecondsToTimeFormat(data.bill_time);
          data.bill_time = mapBillTimeToNumber(billTimeStr);

          if (data.bill_time === 4) {
            data.bill_time_day = billTimeStr.replace(/[^\d.]/g, '');
            //data.bill_time_day = data.bill_time_day / 100;
          }
          // 利息宝规则
          try {
            b;
            const contentText = JSON.parse(data.detail);
            if (data.rule_type == 1) {
              //data.content = contentText.text;
              contentList.value.forEach((item) => {
                item.textContent = contentText[item.value];
              });
            } else {
              contentList.value.forEach((item) => {
                item.transitionValue = contentText[item.value];
              });
            }
          } catch (error) {
            console.error('Error parsing JSON:', error);
            // 处理解析错误或设置默认行为
          }
          setFieldsValue({
            ...data,
          });
        } else {
          checkMemberValues.value = false;
          resetFields();
          openTerminalState.checkedList = [];
          openTerminalState.checkAll = false;
          openTerminalState.indeterminate = false;
          await initCurrencyTreeList();
          title.value = t('modalForm.discountActivity.new_interest_bank');
          nextTick(() => {
            if (!openTerminalState.checkAll) {
              const checkAll = document.getElementsByClassName('z-99')[0];
              checkAll.click();
            }
          });
        }
      });
      async function fieldChang() {
        const values = await getFieldsValue();
        if (values.rule_type == 1) {
          handlelanguageLevelText(0);
          contentList.value = [...langList];
          currentLangText.value.textContent = contentList.value[0].textContent;
        } else {
          contentList.value = [...extraList, ...langList];
        }
      }
      async function handleSubmit() {
        changeOkLoading(true);
        const fromValue = await formRef?.value?.validate();
        try {
          const values = await validate();
          let params = {
            ...values,
            configs: allCurrencyValueInput.value.map((item: any) => ({
              currency_id: Number(item.value),
              currency_name: item.name,
              min_deposit: fromValue[item.value + '_amount'],
              interest_rate: div(fromValue[item.value + '_rate'], 100),
            })),
            currency_ids: allCurrencyValueInput.value.map((item: any) => item.value),
            currency_names: allCurrencyValueInput.value.map((item: any) => item.name),
          };
          // 转化对象转化
          const joinObjectValueMap = {
            2: () => values.join_object_value2,
            3: () => values.join_object_value3,
            4: () => values.join_object_value4,
            5: () => values.join_object_value5,
            6: () => [],
          };

          const updateFunction = joinObjectValueMap[params.join_object_type];
          if (Array.isArray(updateFunction())) {
            params.join_object_values = updateFunction();
          } else {
            params.join_object_values = updateFunction().split(',');
          }

          // 结算周期转化
          // eslint-disable-next-line no-inner-declarations
          function convertToSeconds(number: number, unit: string): number {
            const timeUnits: { [unit: string]: number } = {
              hours: 3600,
              day: 86400,
            };
            if (!timeUnits[unit]) {
              throw new Error('Invalid time unit');
            }
            if (unit == 'hours') {
              switch (number) {
                case 2:
                  return 12 * timeUnits[unit];
                case 3:
                  return 24 * timeUnits[unit];
              }
            }

            return number * timeUnits[unit];
          }
          if (params.bill_time == 4)
            params.bill_time = convertToSeconds(params.bill_time_day, 'day');
          else params.bill_time = convertToSeconds(params.bill_time, 'hours');
          // 利息宝规则转化
          params.detail =
            params.rule_type === 1
              ? JSON.stringify(
                  contentList.value.reduce((result, item) => {
                    result[item.value] = item.textContent;
                    return result;
                  }, {}),
                )
              : JSON.stringify(
                  contentList.value.reduce((result, item) => {
                    result[item.value] = item.transitionValue;
                    return result;
                  }, {}),
                );

          delete params.category;
          //delete params.content_text;
          delete params.DepositCurrency;
          delete params.join_object_value4;
          const { status, data } = params.id
            ? await updateInterest(params)
            : await insertInterest(params);

          if (params.rule_type === 2 && !contentList.value[0].transitionValue) {
            return message.error(t('modalForm.system.system_interest_tip'));
          }
          if (status) {
            message.success(data);
            changeOkLoading(false);
            emit('success');
          } else {
            changeOkLoading(false);
            message.error(data);
          }
          closeModal();
        } catch (error) {
          changeOkLoading(false);
        } finally {
        }
      }
      const handlelanguageLevelText = (value) => {
        currentlanguageIndex.value = value;
        tinymceIsChange.value = false;
        currentLangText.value = contentList.value[currentlanguageIndex.value];
        currentLang.value = contentList.value[currentlanguageIndex.value];
        //apiMap.language = currentLangText.value.value;
        //if (defaultTy.value == 2) changTextData(2);
      };
      function changeHandle(e) {
        const listValue = [];
        if (e.includes('all')) {
          optionsListVip.value.map((item: any) => {
            return listValue.push(String(item?.value) as never);
          });
          setFieldsValue({ join_object_value4: listValue });
        } else {
          if (e.length === optionsListVip.value.length) {
            optionsListVip.value.filter((item: any) => {
              return item !== 'all';
            });
            setFieldsValue({ join_object_value4: listValue });
          }
        }
      }
      function changeMemberHandle(e) {
        //getSelectValue.value = e;
        const listValue = [];
        if (e.includes('all')) {
          optionsListMember.value.map((item: any) => {
            return listValue.push(String(item?.value) as never);
          });
          setFieldsValue({ join_object_value3: listValue });
        } else {
          if (e.length === optionsListMember.value.length) {
            optionsListMember.value.filter((item: any) => {
              return item !== 'all';
            });
            setFieldsValue({ join_object_value3: listValue });
          }
        }
      }
      // 富文本
      function handleTinymceBlur() {
        if (tinymceIsChange.value) {
          translateContentList(
            contentList.value,
            currentLang.value.transitionValue,
            currentLangIndex.value,
          );
        }
      }

      // 设置校验
      function tinymceRules(value) {
        if (value) {
          isShowRules.value = false;
          return true;
        } else {
          isShowRules.value = true;
          return false;
        }
      }

      // 切换语言
      function handleClickContent(index) {
        tinymceIsChange.value = false;
        currentLangIndex.value = index;
        currentLang.value = contentList.value[currentLangIndex.value];
        isShowRules.value = false;
      }
      // 富文本
      function handleTinymceChange(value) {
        tinymceIsChange.value = true;
        contentList.value[currentLangIndex.value].transitionValue = value;
        tinymceRules(value);
      }
      // 富文本
      function handleSystemTinymceChange(value) {
        tinymceRules(value);
      }

      // 全选开放终端
      function onCheckAllChange(e: any, model: any, field: any): void {
        Object.assign(openTerminalState, {
          checkedList: e.target.checked ? openTerminalOptions.value : [],
          indeterminate: false,
        });
        model[field] = e.target.checked ? openTerminalOptions.value : [];
      }

      function onChangeOpenTerminal(value: string[], model: any, field: any): void {
        model[field] = value;
      }

      watch(
        () => openTerminalState.checkedList,
        (val) => {
          setFieldsValue({ DepositCurrency: val });
          if (val.length === 0) {
            openTerminalState.checkAll = false;
            allCurrencyValueInput.value = [];
            clearValidate();
          } else {
            openTerminalState.checkAll = val.length === openTerminalOptions.value.length;
            allCurrencyValueInput.value = currencyTreeList.filter((item: any) =>
              val.includes(item.name),
            );
          }
          openTerminalState.indeterminate =
            !!val.length && val.length < openTerminalOptions.value.length;
          //openTerminalState.checkAll = val.length === openTerminalOptions.value.length;
          // allCurrencyValueInput.value = currencyTreeList.filter((item: any) =>
          //   val.includes(item.name),
          // );
        },
      );
      return {
        registerModal,
        registerForm,
        handleSubmit,
        title,
        FORM_SIZE,
        contentList,
        handleClickContent,
        handleTinymceBlur,
        handleTinymceChange,
        currentLang,
        allCurrencyValueInput,
        formRef,
        modelRef,
        openTerminalState,
        onCheckAllChange,
        onChangeOpenTerminal,
        t,
        openTerminalOptions,
        isShowRules,
        handleSystemTinymceChange,
        model,
        cdIconCurrency,
        optionsListVip,
        changeHandle,
        optionsListMember,
        changeMemberHandle,
        getSelectValue,
        //allMemberHandle,
        checkMemberValues,
        checkVipValues,
        currentLangText,
        handlelanguageLevelText,
        currentlanguageIndex,
        getTextData,
        fieldChang,
        formatter,
      };
    },
  });
</script>
<style lang="less" scoped>
  ::v-deep(.select_render_vip .ant-select-selector .ant-select-selection-overflow) {
    max-height: 110px;
    overflow: auto;
  }

  .bg {
    background-color: #2f4553;
    color: #fff;
  }

  .scroll-wrap {
    height: 120px;
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

  ::v-deep(#form_item_DepositCurrency.terminal > label:first-child) {
    margin-left: 70px;
  }
  // ::v-deep(#form_item_DepositCurrency.check-box-div > .ant-checkbox-wrapper:first-child) {
  //   margin-left: 7px!important;
  // }
  ::v-deep(#form_item_DepositCurrency.terminal) {
    position: relative;
    top: -22px;
  }

  ::v-deep(.translateActive .tox .tox-toolbar) {
    background-color: #f5f7fa;
  }

  ::v-deep(.ant-form-item-control-input-content .ant-checkbox-group-item) {
    width: 62px;
  }

  ::v-deep(.ant-form > .ant-row > .ant-col:nth-of-type(2)) {
    transform: translateX(-12px);
  }

  .lable-icon {
    margin-top: -3px;
  }

  .check-box-div {
    position: relative;

    ::v-deep(.ant-checkbox-wrapper:first-child) {
      width: 100px !important;
      margin-left: 116px !important;
    }

    ::v-deep(.ant-checkbox-wrapper) {
      width: 100px !important;
    }
  }

  .specialCss > .check-box-div {
    ::v-deep(.ant-checkbox-wrapper:first-child) {
      width: 100px !important;
      margin-left: 8px !important;
    }
  }

  .all-check-box {
    display: inline-block;
    display: flex;
    position: relative;
    width: auto;
    margin-left: 8px;
  }

  //.check-box-div+::v-deep(.ant-checkbox-wrapper) {
  //  width: 100px!important;
  //}

  :deep(.ant-form-item-label) {
    min-width: 160px;
  }

  .label-span {
    display: inline-block;
    width: 40px;
    text-align: right;
  }
</style>
