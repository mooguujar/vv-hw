import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();
export const get_text_ty1 = (siteName, ty1_config) => {
  const ty1 = {
    zh_CN: `
邀请好友注册${siteName.value}，可以帮助您快速提款。
当累计金额达到 ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName} 时，您可以开始提款。
每个用户每天将获得${ty1_config.value.daily_roll_times}次免费旋转，完成额外任务可增加旋转次数。
每个用户每次活动有效期为${ty1_config.value.period}天，可多次参加活动。
如果${ty1_config.value.period}天内不提款，钱就会丢失。
如果您获得额外的现金奖金，您可以免费玩游戏并赢得更多真钱。
为避免文字理解差异，平台将保留本活动最终解释权。`,
    en_US: `
Invite friends to register at ${siteName.value} to help you withdraw quickly.
You can start withdrawing when the accumulated amount reaches ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName}.
Each user will receive ${ty1_config.value.daily_roll_times} free spin per day, Completing extra tasks will increase the number of chances to spin the roulette.
Each users participation in the activity is valid for ${ty1_config.value.period} days and can participate multiple times.
If no withdrawal is made within ${ty1_config.value.period} days, the money will be lost.
If you win extra cash bonuses, you can play games for free and win more real money.
To avoid differences in understanding, the platform reserves the right of final interpretation of this activity.`,
    pt_BR: `
Convite amigos para se registrarem no ${siteName.value} para ajudar você a sacar rapidamente.
Você pode começar a sacar quando o valor acumulado atingir ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName}.
Cada usuário receberá ${ty1_config.value.daily_roll_times} giro grátis por dia, Completar tarefas extras aumentará o número de chances para girar a roleta.
A participação de cada usuário na promoção é válida por ${ty1_config.value.period} dias e pode ser realizada várias vezes.
Se nenhuma retirada for realizada dentro de ${ty1_config.value.period} dias, o dinheiro será perdido.
Se você ganhar bônus em dinheiro extra, você pode jogar grátis e ganhar mais dinheiro.
Para evitar diferenças de entendimento, a plataforma reserva-se o direito de interpretação final desta atividade.
            `,
    vi_VN: `
Mời bạn bè đăng ký ${siteName.value} có thể giúp bạn tăng nhanh tốc độ rút tiền.
Khi số tiền tích luỹ đạt đến ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName} bạn có thể bắt đầu rút.
Mỗi một người dùng thể nhận được  ${ty1_config.value.daily_roll_times} lần quay miễn phí mỗi ngày Hoàn thành nhiệm vụ bổ sung có thể tăng thêm số vòng quay thưởng.
Thời gian diễn ra sự kiện là ${ty1_config.value.period} ngày, mỗi một người dùng có thể tham gia sự kiện nhiều lần.
Nếu không rút tiền trong vòng ${ty1_config.value.period} ngày, tiền thưởng sẽ tự động biến mất.
Nếu như bạn nhận được quà tặng bổ sung, bạn có thể chơi miễn phí các trò chơi và thắng được càng nhiều.
Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
            `,
    th_TH: `
เชิญเพื่อนมาลงทะเบียนกับ ${siteName.value} ซึ่งจะช่วยให้คุณถอนเงินได้อย่างรวดเร็วมากยิ่งขึ้น.
คุณสามารถเริ่มถอนได้เมื่อยอดสะสมถึง ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName}.
ผู้เล่นแต่ละคนจะได้รับฟรีสปินวันละ ${ty1_config.value.daily_roll_times} ครั้ง จำนวนการหมุนจะเพิ่มขึ้นเมื่อทำภารกิจเสร็จสิ้น.
ผู้เล่นสามารถเข้าร่วมกิจกรรมได้หลาย และแต่ละครั้งกิจกรรมของผู้เล่นแต่ละคนมีอายุเพียง ${ty1_config.value.period} วันต่อกิจกรรม.
หากไม่ถอนเงินภายใน ${ty1_config.value.period} วัน เงินรางวัลของท่านจะหายไป.
หากคุณได้รับโบนัสพิเศษ คุณสามารถเล่นฟรีและชนะรับเงินจริงมากยิ่งขึ้น.
เพื่อหลีกเลี่ยงความเข้าใจผิดของข้อความข้างต้นนี้ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความขั้นสุดท้ายของกิจกรรมนี้.`,
    hi_IN: `
शीघ्र निकासी में सहायता के लिए मित्रों को ${siteName.value} पर रजिस्टर करने के लिए आमंत्रित करें।.
जब संचित राशि ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName} तक पहुंच जाए तो आप निकासी शुरू कर सकते हैं।.
प्रत्येक उपयोगकर्ता को प्रति दिन ${ty1_config.value.daily_roll_times} निःशुल्क स्पिन प्राप्त होगी, स्पिन की संख्या बढ़ाने के लिए अतिरिक्त कार्य पूरा करें।.
गतिविधि में प्रत्येक उपयोगकर्ता की भागीदारी ${ty1_config.value.period} दिनों के लिए वैध है और वह कई बार भाग ले सकता है।.
यदि ${ty1_config.value.period} दिनों के भीतर कोई निकासी नहीं की जाती है, तो पैसा खो जाएगा।.
यदि आप अतिरिक्त नकद बोनस जीतते हैं, तो आप मुफ्त में गेम खेल सकते हैं और अधिक वास्तविक धन राशि जीत सकते हैं।.
समझ में अंतर से बचने के लिए, मंच इस गतिविधि की अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
           `,
    tl_PH: `
          Anyayahan ang mga kaibigan na magparehistro sa ${siteName.value} upang matulungan kang mabilis na makapag-withdraw.
          Kapag ang kabuuang halaga ay umabot sa ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName}, maaari ka nang magsimulang mag-withdraw.
          Bawat user ay makakakuha ng ${ty1_config.value.daily_roll_times} libreng spins bawat araw; makakakuha ng dagdag na spins kapag natapos ang mga extra na gawain.
          Bawat user ay may bisa ng ${ty1_config.value.period} araw para sa bawat event at maaaring sumali nang maraming beses.
          Kung hindi ka mag-withdraw sa loob ng ${ty1_config.value.period} araw, mawawala ang pera.
          Kung makakakuha ka ng dagdag na cash bonus, maaari kang maglaro ng libre at manalo ng mas maraming totoong pera.
          Upang maiwasan ang hindi pagkakaunawaan sa teksto, ang platform ay may karapatan sa huling pagpapaliwanag ng event na ito.
           `,
    ko_KR: `
          친구를 초대하여 ${siteName.value} 에 가입하면, 빠른 출금을 도울 수 있습니다. 누적 금액이 ${ty1_config.value.withdraw_amount} ${ty1_config.value.currencyName} 에 도달하면 출금을 시작할 수 있습니다.
          각 사용자는 매일 ${ty1_config.value.daily_roll_times} 회 무료 스핀을 받을 수 있으며, 추가 미션을 완료하면 스핀 횟수를 늘릴 수 있습니다.
          각 사용자는 이벤트당 ${ty1_config.value.period} 일 동안 참여 가능하며, 여러 번 이벤트에 참여할 수 있습니다.
          ${ty1_config.value.period} 일 내에 출금하지 않으면, 금액은 소멸됩니다.
          추가 현금 보너스를 받으면, 무료로 게임을 플레이하고 더 많은 실제 돈을 벌 수 있습니다.
          문자 이해 차이를 방지하기 위해, 본 플랫폼은 본 이벤트에 대한 최종 해석 권한을 보유합니다.`,
  };
  return ty1;
};
export const get_text_ty7 = (
  platform_range,
  highestNum,
  get_leftValues,
  currentCurryId,
  currencyName,
) => {
  const higtNum = highestNum.value[currentCurryId] || 0;
  const ty7 = {
    zh_CN: `
      活动开始后，您注册后将自动参加。
      每日在${
        platform_range.value == 1 ? '所有场馆' : '指定场馆'
      }有效投注需要满足活动条件，且注单尾号与本次活动指定号码相同，即可获得一次奖金领取机会，最高可获得${
      higtNum || 0
    }倍奖励。
      ${
        get_leftValues.value.automatic == 2
          ? '奖金仅支持用户手动点击领取，用户需在当日内领取，过期未领取的奖金将视为放弃。'
          : '奖金仅支持用户手动点击领取，我们将及时审核您的奖金申请，通过后奖金将自动发放到钱包。'
      }
      本次活动的所有奖金，需要${get_leftValues.value.multiple || 0}倍流水才能提现。
      本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
      为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
      `,
    en_US: `
      After the event starts, you will automatically participate once you register.
      Daily valid${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      } bets must meet the event requirements to receive the corresponding bonus once. The maximum reward is ${
      higtNum || 0
    }X Reward.
      ${
        get_leftValues.value.automatic == 2
          ? 'Only users can manually click to claim the bonus, users need to claim within the day, overdue bonus will be regarded as abandoned.'
          : 'Only users can manually click to claim the bonus, we will review your bonus application in time, and the bonus will be automatically released to the wallet after passing.'
      }
      All bonuses from this event require a ${
        get_leftValues.value.multiple
      }x wagering turnover before withdrawal.
      This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
      To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
      `,
    pt_BR: `
      Após o início do evento, você será automaticamente inscrito após se registrar.
      As apostas diárias válidas ${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      }em todos os locais devem atender aos requisitos do evento, e se o último dígito do bilhete de aposta corresponder ao número designado para este evento, você terá uma chance de receber um bônus. O valor máximo da recompensa é de ${
      higtNum || 0
    } Reward.
      ${
        get_leftValues.value.automatic == 2
          ? 'Os bônus devem ser resgatados manualmente pelo usuário no mesmo dia; bônus não resgatados serão considerados como renunciados.'
          : 'Os bônus suportam apenas cliques manuais dos usuários para reivindicá-los. Analisaremos seu pedido de bônus a tempo e o bônus será distribuído automaticamente para a carteira após a aprovação.'
      }
        Todos os bônus deste evento exigem um turnover de apostas de ${
          get_leftValues.value.multiple
        }x antes do saque.
        Este evento é válido apenas para atividade normal de titulares de contas individuais. É proibido alugar contas, usar trapaças, bots, múltiplas contas, negociações mútuas, arbitragem, uso de APIs, exploração de vulnerabilidades, controle em grupo ou quaisquer outros meios técnicos. Caso contrário, as recompensas podem ser canceladas, deduzidas, congeladas ou até mesmo resultar em inclusão na lista negra.
      Para evitar mal-entendidos, a plataforma reserva o direito de interpretação final deste evento.
      `,
    vi_VN: `
      Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
      Cược hợp lệ ở ${
        platform_range.value == 1 ? 'All venues' : 'right venue'
      } hàng ngày cần phải đáp ứng điều kiện của sự kiện. Nếu số cuối của đơn cược giống với số chỉ định trong sự kiện bạn sẽ có cơ hội nhận được gấp ${
      higtNum || 0
    }X lần tiền thưởng.
      ${
        get_leftValues.value.automatic == 2
          ? 'Tiền thưởng phải được nhận thủ công và nhận trong ngày. Tiền thưởng chưa nhận qua hôm sau sẽ tự động khấu trừ.'
          : 'Tiền thưởng chỉ hỗ trợ người dùng nhấp chuột thủ công để nhận chúng. Chúng tôi sẽ xem xét đơn đăng ký tiền thưởng của bạn kịp thời và tiền thưởng sẽ tự động được phân phối vào ví sau khi chuyển nó.'
      }
      Tất cả tiền thưởng từ sự kiện này yêu cầu ${
        get_leftValues.value.multiple
      }x lần vòng cược mới có thể rút.
      Qualquer usuário ou grupo que receber incentivos de eventos de forma anormal ou fraudulenta, a plataforma tem o direito de congelar ou fechar a conta relevante sem aviso prévio e sem reembolso, o usuário será colocado na lista negra.
      Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
      `,
    hi_IN: `
      कार्यक्रम शुरू होने के बाद, पंजीकरण के बाद आप स्वतः ही इसमें भाग लेंगे।.
      ${
        platform_range.value == 1 ? 'सभी गेम हॉल' : 'निर्दिष्ट गेम हॉल'
      } आपको इवेंट की वैध सट्टेबाजी आवश्यकताओं को पूरा करना होगा। यदि आपके बेट टिकट का अंतिम अंक इस इवेंट के लिए निर्दिष्ट भाग्यशाली संख्या से मेल खाता है, तो आपको ${
      higtNum || 0
    }x बोनस तक का इनाम पाने का मौका मिलेगा।
      ${
        get_leftValues.value.automatic == 2
          ? 'बोनस का दावा केवल मैन्युअल रूप से किया जा सकता है। आपको उसी दिन दावा करना होगा; दावा न किए गए बोनस को जब्त माना जाएगा।.'
          : 'बोनस का दावा केवल मैन्युअल रूप से किया जा सकता है। हम आपके दावे की तुरंत समीक्षा करेंगे, और स्वीकृत होने के बाद, बोनस स्वचालित रूप से आपके वॉलेट में जमा हो जाएगा।.'
      }
      इस इवेंट से सभी बोनस के लिए ${
        get_leftValues.value.multiple
      }x टर्नओवर की आवश्यकता होती है, उसके बाद ही निकासी की अनुमति दी जाती है।.
      यह इवेंट केवल खाताधारकों द्वारा वैध मैन्युअल भागीदारी के लिए है। खाते किराए पर लेना, धोखाधड़ी, बॉट, मल्टी-अकाउंटिंग, आपसी सट्टेबाजी, मध्यस्थता, एपीआई/इंटरफ़ेस/प्रोटोकॉल शोषण, समूह नियंत्रण, या अन्य तकनीकी हेरफेर सख्त वर्जित हैं। उल्लंघन के परिणामस्वरूप पुरस्कार रद्द किए जा सकते हैं, काटे जा सकते हैं, फ्रीज किए जा सकते हैं या खातों को ब्लैकलिस्ट किया जा सकता है।.
      किसी भी गलतफहमी से बचने के लिए, मंच इस घटना की अंतिम व्याख्या के अधिकार सुरक्षित रखता है।.
      `,
    th_TH: `
      หลังจากกิจกรรมเริ่มขึ้น คุณจะเข้าร่วมโดยอัตโนมัติเมื่อสมัครสมาชิก.
      ทุกวันใน${
        platform_range.value == 1 ? 'ทุกห้องเกม' : 'ห้องเกมที่กำหนด'
      } ต้องมียอดเดิมพันที่เข้าเงื่อนไขของกิจกรรม และหากหมายเลขท้ายของบิลเดิมพันตรงกับหมายเลขที่กำหนดของกิจกรรมนี้ คุณจะมีโอกาสรับโบนัส โดยสามารถรับรางวัลสูงสุดได้ถึง ${
      higtNum || 0
    }เท่า.
      ${
        get_leftValues.value.automatic == 2
          ? 'โบนัสสามารถรับได้ด้วยตนเองเท่านั้น ผู้เล่นต้องกดรับโบนัสภายในวันนั้น หากหมดเวลาจะถือว่าสละสิทธิ์รับโบนัส.'
          : 'โบนัสสามารถรับได้ด้วยตนเองเท่านั้น เราจะตรวจสอบคำขอของคุณโดยเร็ว และเมื่ออนุมัติแล้ว โบนัสจะถูกโอนเข้ากระเป๋าอัตโนมัติ.'
      }
      โบนัสทั้งหมดในกิจกรรมนี้ต้องมียอดเทิร์นโอเวอร์ ${
        get_leftValues.value.multiple
      }เท่าก่อนจึงจะสามารถถอนเงินได้.
      กิจกรรมนี้จำกัดเฉพาะผู้ถือบัญชีที่ดำเนินการด้วยตนเองเท่านั้น ห้ามให้เช่าบัญชี ใช้โปรแกรมโกง บอท บัญชีหลายบัญชี เล่นข้ามกัน ปั่นยอด การใช้ API หรือช่องโหว่ระบบ และการควบคุมแบบกลุ่ม หากฝ่าฝืน โบนัสอาจถูกยกเลิก หักคืน อายัด หรือขึ้นบัญชีดำ.
      เพื่อหลีกเลี่ยงความเข้าใจผิด แพลตฟอร์มขอสงวนสิทธิ์ในการตีความกิจกรรมนี้แต่เพียงผู้เดียว.
      `,
    tl_PH: `
        Kapag nagsimula ang event, awtomatiko kang sasali pagkatapos magparehistro.
        Araw-araw, sa ${
          platform_range.value == 1 ? 'lahat ng venue' : 'itinakdang venue'
        } ay kailangan matugunan ang mga kundisyon ng event sa valid na pagtaya. Kapag ang huling numero ng bet slip ay kapareho ng itinakdang numero ng event na ito, makakakuha ka ng pagkakataong mag-claim ng bonus, hanggang sa maximum na ${
      higtNum || 0
    } beses na reward.
        ${
          get_leftValues.value.automatic == 2
            ? 'Ang bonus ay maaari lamang i-claim nang manu-mano ng user, at dapat itong kunin sa parehong araw; kapag lumampas sa oras, ituturing na tinanggihan ang bonus.'
            : 'Ang bonus ay maaari lamang i-claim nang manu-mano ng user. Susuriin agad namin ang iyong aplikasyon para sa bonus, at kapag naaprubahan, awtomatikong ilalagay sa wallet ang bonus.'
        }
        Ang lahat ng bonus sa event na ito ay nangangailangan ng ${
          get_leftValues.value.multiple
        } beses na turnover bago ma-withdraw.
        Ang event na ito ay para lamang sa normal na manu-manong operasyon ng may-ari ng account. Ipinagbabawal ang pagrenta, paggamit ng pandaraya, bot, paglalaro gamit ang ibang account, mutual brushing, arbitration, API, protocol, paggamit ng bug, group control, at iba pang teknik. Kung hindi, maaaring kanselahin, kaltasin, i-freeze ang reward o ilagay sa blacklist.
        Upang maiwasan ang hindi pagkakaunawaan sa teksto, ang platform ay may karapatan sa huling pagpapaliwanag ng event na ito.
      `,
    ko_KR: `
    이벤트 시작 후, 회원가입 시 자동으로 참여됩니다.
    매일 ${
      platform_range.value == 1 ? '모든 게임장' : '지정된 게임장'
    } 에서 유효 베팅 금액이 이벤트 조건을 충족하고, 베팅 번호의 마지막 자리 숫자가 이번 이벤트의 지정된 숫자와 동일할 경우, 한 번의 보너스 수령 기회를 얻게 되며, 최대 ${
      higtNum || 0
    } 배의 보너스를 받을 수 있습니다.
    ${
      get_leftValues.value.automatic == 2
        ? '보너스는 사용자가 직접 수령 버튼을 클릭해야 하며, 당일 내에 수령해야 합니다. 기한 내에 수령하지 않은 보너스는 포기한 것으로 간주됩니다.'
        : '보너스는 사용자가 직접 수령 버튼을 클릭해야 하며, 보너스 신청을 신속하게 심사하여 승인되면 자동으로 지갑으로 지급됩니다.'
    }
    이번 이벤트의 모든 보너스는 출금하려면 ${
      get_leftValues.value.multiple || 0
    } 배의 롤링이 필요합니다.
    이 이벤트는 계정 소유자의 정상적인 수동 조작에 한합니다. 계정 대여, 사기, 봇 사용, 여러 계정으로 플레이, 상호 롤링, 중재, 인터페이스, 프로토콜, 취약점 악용, 그룹 제어 등 기술적인 수단은 금지됩니다. 위반 시 보상은 취소되거나 차감, 동결 또는 블랙리스트에 오를 수 있습니다.
    문구 해석에 대한 이견을 피하기 위해 플랫폼은 이번 이벤트에 대한 최종 해석권을 보유합니다.
    `,
  };
  return ty7;
};
export const get_text_ty9 = (get_leftValues9, get_leftValues) => {
  const accumulated = get_leftValues9.value.accumulated;
  const continuous = get_leftValues9.value.continuous;
  const showSign = get_leftValues9.value.extra == 1 && (accumulated.length || continuous.length);
  const showSignB = get_leftValues9.value.extra == 1 && accumulated.length && continuous.length;
  let ty9 = {
    zh_CN: `${get_leftValues9.value.period == 1 ? '每周' : '每月'}将重置签到天数。              
每日满足对应条件,领取对应奖励。${
      showSign
        ? '\n' +
          ((accumulated.length ? '累计签到' + accumulated.map((d) => d + '天').join(',') : '') +
            (showSignB ? '或' : '') +
            (continuous.length ? '连续签到' + continuous.map((d) => d + '天').join(',') : '') +
            '可分别获得额外奖励。')
        : ''
    }     
奖金仅支持用户手动点击领取，用户需在当天内领取，过期未领取的奖金将视为放弃。
本次活动的所有奖金，需要${get_leftValues.value.multiple || 0}倍流水才能提现。
`,
    en_US: `${get_leftValues9.value.period == 1 ? 'Weekly' : 'Monthly'} reset of check-in days.  
Meet the corresponding condition each day to claim the respective reward. ${
      get_leftValues9.value.extra == 1
        ? '\n' +
          ((accumulated.length
            ? 'Accumulated sign-in for ' + accumulated.map((d) => d + ' days').join(',')
            : '') +
            (showSignB ? ' or ' : '') +
            (continuous.length
              ? ' Consecutive sign-in for ' + continuous.map((d) => d + ' days').join(',')
              : '') +
            ' can earn extra rewards respectively.')
        : ''
    }
Bonus must be claimed manually by the user on the same day. Unclaimed bonuses after the deadline will be considered forfeited.  
All bonuses from this event require a betting of ${
      get_leftValues.value.multiple || 0
    } times before withdrawal.
`,
    pt_BR: `${
      get_leftValues9.value.period == 1 ? 'Weekly' : 'Monthly'
    } redefinição dos dias de check-in. 
Cumpra a condição correspondente a cada dia para reivindicar o respectivo prêmio. ${
      get_leftValues9.value.extra == 1
        ? '\n' +
          ((accumulated.length
            ? 'Login acumulado por ' + accumulated.map((d) => d + ' days').join(',')
            : '') +
            (showSignB ? ' or ' : '') +
            (continuous.length
              ? ' Login consecutivo por ' + continuous.map((d) => d + ' days').join(',')
              : '') +
            ' pode ganhar recompensas extras, respectivamente.')
        : ''
    }
O bônus deve ser solicitado manualmente pelo usuário no mesmo dia. Os bônus não reclamados após o prazo serão considerados perdidos. 
Todos os bônus desse evento exigem uma aposta de ${
      get_leftValues.value.multiple || 0
    } vezes antes da retirada.
`,
    vi_VN: `${
      get_leftValues9.value.period == 1 ? 'Mỗi tuần' : 'Mỗi tháng'
    } sẽ đặt lại số ngày báo danh.
Mỗi ngày đáp ứng các điều kiện tương ứng và nhận phần thưởng tương đương. ${
      get_leftValues9.value.extra == 1
        ? '\n' +
          ((accumulated.length
            ? 'Đăng nhập tích lũy ' + accumulated.map((d) => d + ' day').join(',')
            : '') +
            (showSignB ? ' or ' : '') +
            (continuous.length
              ? ' Đăng nhập liên tục ' + continuous.map((d) => d + ' day').join(',')
              : '') +
            ' Bạn có thể nhận được phần thưởng bổ sung thêm.')
        : ''
    }
Tiền thưởng chỉ hỗ trợ nhận thủ công, người dùng phải nhận thưởng trong cùng ngày, quá hạn mà không nhận thưởng sẽ bị coi là từ bỏ.
Tất cả phần thưởng trong sự kiện này đều yêu cầu ${
      get_leftValues.value.multiple || 0
    } tiền vòng cược mới có thể rút.`,
    hi_IN: ``,
    th_TH: ``,
    tl_PH: `${
      get_leftValues9.value.period == 1 ? 'Lingguhan' : 'Buwanang'
    } mare-reset ang bilang ng araw ng pag-check-in.  
            Araw-araw, kapag natugunan ang kaukulang kundisyon, maaaring i-claim ang kaukulang reward.${
              showSign
                ? '\n' +
                  ((accumulated.length
                    ? 'Kapag naipon ang pag-check-in nang ' +
                      accumulated.map((d) => d + ' araw').join(',')
                    : '') +
                    (showSignB ? ' o ' : '') +
                    (continuous.length
                      ? 'Kapag tuloy-tuloy ang pag-check-in nang ' +
                        continuous.map((d) => d + ' araw').join(',')
                      : '') +
                    ' ay maaaring makakuha ng karagdagang reward ayon sa bilang.')
                : ''
            }  
            Ang bonus ay maaari lamang i-claim nang manu-mano ng user, at dapat itong kunin sa parehong araw; kapag lumampas sa oras, ituturing na tinanggihan ang bonus.  
            Ang lahat ng bonus sa event na ito ay nangangailangan ng ${
              get_leftValues.value.multiple || 0
            } beses na turnover bago ma-withdraw.`,
    ko_KR: `
    ${get_leftValues9.value.period == 1 ? '매주' : '매월'} 출석 일수가 재설정됩니다.
    매일 해당 조건을 충족하면 상응하는 보상을 받을 수 있습니다. ${
      showSign
        ? '\n' +
          ((accumulated.length ? '누적 출석' + accumulated.map((d) => d + '일').join(',') : '') +
            (showSignB ? '또는' : '') +
            (continuous.length ? '연속 출석' + continuous.map((d) => d + '일').join(',') : '') +
            '을(를) 하면 추가 보상을 각각 받을 수 있습니다.')
        : ''
    }
    보너스는 사용자가 직접 수령 버튼을 클릭해야 하며, 당일 내에 수령해야 합니다. 기한 내에 수령하지 않은 보너스는 포기한 것으로 간주됩니다.
    이번 이벤트의 모든 보너스는 출금하려면 ${
      get_leftValues.value.multiple || 0
    } 배의 롤링이 필요합니다.`,
  };
  return ty9;
};
export const get_text_ty10 = (agentDaysMinAndMax, everyDayBetActiveText, currencyName) => {
  const ty10 = {
    zh_CN: `
  活动开始后，您注册后将自动参加。
  对应活动期间只要发放佣金${
    agentDaysMinAndMax.value?.commissionMin ?? 0
  }NOW$$currency$$以上，即可领取最高${agentDaysMinAndMax.value?.rewardMax ?? 0}NOW$$currency$$奖励。
  会员领取奖励统一以${currencyName}发放。
  奖金仅支持用户手动点击领取，领取时间为24小时，会员可在当日23:59前登录领取，逾期未领取则视为放弃。
  本次活动的所有奖金，需要${everyDayBetActiveText.multipleCount ?? 0}倍流水才能提现。
  本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
  为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
            `,
    en_US: `
  Once the event begins, you will automatically participate after registering.
  During the event, agents earning a commission of more than ${
    agentDaysMinAndMax.value?.commissionMin
  } NOW$$currency$$, can claim a maximum reward of ${
      agentDaysMinAndMax.value?.rewardMax
    } NOW$$currency$$.
  All member rewards will be issued in ${currencyName}.  
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
    agentDaysMinAndMax.value?.commissionMin
  } NOW$$currency$$, podem resgatar um bônus máximo de ${
      agentDaysMinAndMax.value?.rewardMax
    } NOW$$currency$$.
  Todas as recompensas para membros serão emitidas em ${currencyName}.  
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
    agentDaysMinAndMax.value?.commissionMin
  } NOW$$currency$$, bạn có thể nhận được phần thưởng lên tới ${
      agentDaysMinAndMax.value?.rewardMax
    } NOW$$currency$$.
  Hội viên nhận thưởng tiền tệ thống nhất phát ${currencyName}.  
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
    agentDaysMinAndMax.value?.commissionMin
  } NOW$$currency$$ คุณจะสามารถรับรางวัลสูงสุด ${
      agentDaysMinAndMax.value?.rewardMax
    } NOW$$currency$$.
  สมาชิกรับรางวัลเป็น ${currencyName}.
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
    agentDaysMinAndMax.value?.commissionMin
  } NOW$$currency$$ से अधिक जारी किया जाता है, तो आप ${
      agentDaysMinAndMax.value?.rewardMax
    } NOW$$currency$$ तक का अधिकतम पुरस्कार प्राप्त कर सकते हैं।.
  पुरस्कार सदस्यों को USDT में वितरित किए जाएंगे।.
  बोनस केवल उपयोगकर्ताओं द्वारा मैन्युअल रूप से क्लिक करके प्राप्त किया जा सकता है, और प्राप्त करने का समय 24 घंटे है। सदस्य उसी दिन 23:59 बजे से पहले लॉगिन करके पुरस्कार प्राप्त कर सकते हैं; यदि समय सीमा के भीतर प्राप्त नहीं किया गया, तो इसे त्याग माना जाएगा।.
  इस कार्यक्रम से सभी बोनस को निकासी के लिए ${
    everyDayBetActiveText.multipleCount ?? 0
  } गुना टर्नओवर की आवश्यकता होती है।.
  यह कार्यक्रम केवल खाता धारकों द्वारा सामान्य संचालन के लिए सीमित है। किराए पर लेना, धोखाधड़ी का उपयोग करना, बॉट, विभिन्न खातों के साथ खेलना, आपस में ब्रश करना, मध्यस्थता, इंटरफेस, समझौते, कमजोरियों का लाभ उठाना, समूह नियंत्रण और अन्य तकनीकी साधनों का उपयोग करना निषिद्ध है। अन्यथा, पुरस्कार रद्द, घटित, फ्रीज या यहां तक कि काली सूची में डाला जा सकता है।.
  पाठ के संबंध में किसी भी गलतफहमी से बचने के लिए, मंच इस कार्यक्रम के लिए अंतिम व्याख्या का अधिकार सुरक्षित रखता है।.
            `,
    tl_PH: `
          Kapag nagsimula ang event, awtomatiko kang sasali pagkatapos magparehistro.
          Sa panahon ng kaukulang event, basta makapagbigay ng komisyon na hindi bababa sa ${
            agentDaysMinAndMax.value?.commissionMin ?? 0
          }NOW$$currency$$, maaari kang makatanggap ng hanggang ${
      agentDaysMinAndMax.value?.rewardMax ?? 0
    }NOW$$currency$$ na reward.
          Ang lahat ng reward ay ipapamahagi sa ${currencyName}.
          Ang bonus ay maaari lamang i-claim nang manu-mano ng user sa loob ng 24 oras; maaaring mag-claim hanggang 23:59 sa parehong araw. Kapag hindi na-claim bago mag-expire, ito ay ituturing na tinanggihan.
          Ang lahat ng bonus sa event na ito ay nangangailangan ng ${
            everyDayBetActiveText.multipleCount ?? 0
          } beses na turnover bago ma-withdraw.
          Ang event na ito ay para lamang sa normal na manu-manong operasyon ng may-ari ng account. Ipinagbabawal ang pagrenta, paggamit ng pandaraya, bot, paglalaro gamit ang ibang account, mutual brushing, arbitration, API, protocol, paggamit ng bug, group control, at iba pang teknik. Kung hindi, maaaring kanselahin, kaltasin, i-freeze ang reward o ilagay sa blacklist.
          Upang maiwasan ang hindi pagkakaunawaan sa teksto, ang platform ay may karapatan sa huling pagpapaliwanag ng event na ito.
            `,
    ko_KR: `
    이벤트 시작 후, 회원가입 시 자동으로 참여됩니다. 
    해당 이벤트 기간 동안 지급된 커미션이${
      agentDaysMinAndMax.value?.commissionMin ?? 0
    } NOW$$currency$$이상일 경우, 최대${
      agentDaysMinAndMax.value?.rewardMax ?? 0
    } NOW$$currency$$의 보상을 받을 수 있습니다.
    회원에게 지급되는 보상은 ${currencyName} 로 통일됩니다. 보너스는 사용자가 직접 수령 버튼을 클릭해야 하며, 수령 시간은 24시간 이내입니다. 회원은 당일 23:59까지 로그인하여 수령할 수 있으며, 기한 내에 수령하지 않은 보너스는 포기한 것으로 간주됩니다. 이번 이벤트의 모든 보너스는 출금하려면 ${
      everyDayBetActiveText.multipleCount ?? 0
    } 배의 롤링이 필요합니다. 
    이 이벤트는 계정 소유자의 정상적인 수동 조작에 한합니다. 계정 대여, 사기, 봇 사용, 여러 계정으로 플레이, 상호 롤링, 중재, 인터페이스, 프로토콜, 취약점 악용, 그룹 제어 등 기술적인 수단은 금지됩니다. 위반 시 보상은 취소되거나 차감, 동결 또는 블랙리스트에 오를 수 있습니다. 문구 해석에 대한 이견을 피하기 위해 플랫폼은 이번 이벤트에 대한 최종 해석권을 보유합니다.`,
  };
  return ty10;
};

export const get_text_ty11 = (agentMonthsMinAndMax, everyDayBetActiveText) => {
  const ty11 = {
    zh_CN: `
  活动开始后，您注册后将自动参加。
  对应活动期间只要直属会员充值${
    agentMonthsMinAndMax.value?.commissionMin ?? 0
  }NOW$$currency$$以上，即可领取最高${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
    }NOW$$currency$$奖励。
  奖金仅支持用户手动点击领取，统计时间为上个月，领取时间为下个月，领取时间限制每月1号-15号23:59:59，逾期未领取则视为放弃。
  本次活动的所有奖金，需要${everyDayBetActiveText.multipleCount ?? 0}倍流水才能提现。
  本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
  为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
            `,
    en_US: `
  Once the campaign starts, you will be automatically enrolled upon registration.
  During the promotion period, if your direct members make total deposits of at least ${
    agentMonthsMinAndMax.value?.commissionMin ?? 0
  } NOW$$currency$$, you will be eligible to claim a maximum reward of  ${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
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
    agentMonthsMinAndMax.value?.commissionMin ?? 0
  } NOW$$currency$$, você poderá receber uma recompensa máxima de ${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
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
    agentMonthsMinAndMax.value?.commissionMin ?? 0
  } NOW$$currency$$, trở lên có thể nhận được phần thưởng lên tới ${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
    } NOW$$currency$$.
  Phần thưởng chỉ hỗ trợ người dùng nhận thủ công. Thời gian thống kê là một tháng, và nhận trong tháng tiếp theo. Thời gian nhận lãnh giới hạn từ ngày mùng 1 đến 23:59:59  ngày 15 hàng tháng. Việc không nhận thưởng sẽ bị coi là bỏ cuộc, tiền thưởng sẽ tự động khấu trừ.
  Tất cả tiền thưởng từ sự kiện này yêu cầu ${
    everyDayBetActiveText.multipleCount ?? 0
  } lần vòng cược mới có thể rút.
  Qualquer usuário ou grupo que receber incentivos de eventos de forma anormal ou fraudulenta, a plataforma tem o direito de congelar ou fechar a conta relevante sem aviso prévio e sem reembolso, o usuário será colocado na lista negra.
  Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
            `,
    th_TH: `
  หลังจากที่กิจกรรมเริ่มต้น คุณจะเข้าร่วมโดยอัตโนมัติเมื่อทำการลงทะเบียน.
  ในช่วงระยะเวลากิจกรรม เพียงแค่สมาชิกโดยตรงเติมเงินมากกว่า ${
    agentMonthsMinAndMax.value?.commissionMin ?? 0
  } NOW$$currency$$ คุณก็จะสามารถรับรางวัลสูงสุด ${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
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
    agentMonthsMinAndMax.value?.commissionMin ?? 0
  } NOW$$currency$$ से अधिक का रिचार्ज करते हैं, तो आप ${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
    } NOW$$currency$$ तक का पुरस्कार प्राप्त कर सकते हैं।.
  बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से क्लिक करके प्राप्त किया जा सकता है, सांख्यिकी अवधि पिछले महीने की है, और प्राप्ति अवधि अगले महीने की है, जो हर महीने 1 से 15 तारीख तक 23:59:59 तक सीमित है। यदि इस अवधि के भीतर प्राप्त नहीं किया गया, तो इसे त्याग मान लिया जाएगा।.
  इस कार्यक्रम के सभी बोनस को निकालने के लिए ${
    everyDayBetActiveText.multipleCount ?? 0
  } गुना टर्नओवर की आवश्यकता होती है।.
  यह कार्यक्रम केवल खाते के धारक द्वारा सामान्य रूप से संचालित करने के लिए है। किराए पर लेना, धोखा देना, बॉट का उपयोग करना, विभिन्न खातों के साथ खेलना, आपस में ब्रश करना, मध्यस्थता, इंटरफेस, समझौता, कमजोरियों का लाभ उठाना, समूह नियंत्रण और अन्य तकनीकी तरीकों का उपयोग वर्जित है। अन्यथा, पुरस्कारों को रद्द, घटित, फ्रीज या यहां तक कि काले सूची में डाला जा सकता है।.
  पाठ की व्याख्या में भिन्नता से बचने के लिए, मंच इस कार्यक्रम के अंतिम व्याख्या अधिकारों को सुरक्षित रखता है।.
  `,
    tl_PH: `
        Kapag nagsimula ang event, awtomatiko kang sasali pagkatapos magparehistro.
        Sa panahon ng kaukulang event, basta ang direktang miyembro ay makapag-recharge ng hindi bababa sa ${
          agentMonthsMinAndMax.value?.commissionMin ?? 0
        } NOW$$currency$$, maaari kang makatanggap ng hanggang ${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
    } NOW$$currency$$ na reward.
        Ang bonus ay maaari lamang i-claim nang manu-mano ng user; ang panahon ng pagbibilang ay para sa nakaraang buwan at ang panahon ng pag-claim ay mula ika-1 hanggang ika-15 ng susunod na buwan bago mag-23:59:59. Kapag hindi na-claim sa itinakdang panahon, ituturing na tinanggihan.
        Ang lahat ng bonus sa event na ito ay nangangailangan ng ${
          everyDayBetActiveText.multipleCount ?? 0
        } beses na turnover bago ma-withdraw.
        Ang event na ito ay para lamang sa normal na manu-manong operasyon ng may-ari ng account. Ipinagbabawal ang pagrenta, paggamit ng pandaraya, bot, paglalaro gamit ang ibang account, mutual brushing, arbitration, API, protocol, paggamit ng bug, group control, at iba pang teknik. Kung hindi, maaaring kanselahin, kaltasin, i-freeze ang reward o ilagay sa blacklist.
        Upang maiwasan ang hindi pagkakaunawaan sa teksto, ang platform ay may karapatan sa huling pagpapaliwanag ng event na ito.
      `,
    ko_KR: `
    이벤트 시작 후, 가입하면 자동으로 참여됩니다. 
    해당 이벤트 기간 동안 직속 회원이 ${
      agentMonthsMinAndMax.value?.commissionMin ?? 0
    } NOW$$currency$$ 이상 충전하면, 최대 ${
      agentMonthsMinAndMax.value?.rewardMax ?? 0
    } NOW$$currency$$ 보상을 받을 수 있습니다. 
    보너스는 사용자가 수동으로 클릭해야만 수령 가능하며, 통계 시간은 지난 달, 수령 시간은 다음 달이며, 수령 제한은 매월 1일~15일 23:59:59까지입니다. 
    기한 내 수령하지 않으면 포기한 것으로 간주됩니다. 이번 이벤트의 모든 보너스는 ${
      everyDayBetActiveText.multipleCount ?? 0
    } 배 베팅 흐름을 완료해야 출금할 수 있습니다.
    본 이벤트는 계정 소유자 본인만 정상적으로 참여 가능하며, 계정 대여, 치트 사용, 봇, 다른 계정 플레이, 상호 베팅, 중재, 인터페이스/프로토콜 활용, 버그 이용, 그룹 제어 등 기술적 수단 사용은 금지됩니다. 
    위반 시, 보상은 취소, 차감, 동결되거나 블랙리스트에 등록될 수 있습니다. 문자 이해 차이로 인한 분쟁을 방지하기 위해, 플랫폼은 본 이벤트에 대한 최종 해석 권한을 보유합니다.`,
  };
  return ty11;
};
export const get_text_ty12 = (ruleData, highestNum, get_leftValues, currencyName) => {
  let ty12: any = '';
  ty12 = {
    zh_CN: `所获得奖金需要${get_leftValues.value.multiple}倍打码才能提款。
活动统计周期上月${get_leftValues.value.timeType[2]}号00:00-本月${
      get_leftValues.value.timeType[0] - 1
    }号23:59:59为一个周期，以此类推。
活动领取时间${get_leftValues.value.timeType[0]}号23:59前，${
      get_leftValues.value.timeType[1]
    }号23:59前，${get_leftValues.value.timeType[2]}号23:59前，逾期未领取视为放弃。
会员参与活动均由系统自动统计，若有任何异议，以我司查询结果为准。
为避免文字理解差异，我司保留此活动的最终解释权，以及在无通知的情况下修改，终止活动的权利。
        `,
    en_US: `The bonus received needs to be betted ${
      get_leftValues.value.multiple
    } times before it can be withdrawn.
Event statistics cycle from 00:00 on the ${
      get_leftValues.value.timeType[2]
    }th of the previous month to 23:59:59 on the ${
      get_leftValues.value.timeType[0] - 1
    }th of the current month, and so on.
Bonus claim deadlines before 23:59 on the ${get_leftValues.value.timeType[0]}th, ${
      get_leftValues.value.timeType[1]
    }th, and ${
      get_leftValues.value.timeType[2]
    }th respectively. Late claims will be deemed forfeited.
Member participation in the event is automatically recorded by the system. In case of any dispute, our company’s final records will be considered accurate.
To avoid misinterpretation, our company reserves the final right of explanation and may modify or terminate the event without prior notice.`,
    pt_BR: `O bônus recebido precisa ser apostado ${
      get_leftValues.value.multiple
    } vezes antes de poder ser sacado.
As estatísticas do evento variam de 00:00 do dia ${
      get_leftValues.value.timeType[2]
    } do mês anterior até 23:59:59 do dia ${
      get_leftValues.value.timeType[0] - 1
    } do mês atual, e assim por diante.
Os prazos para reivindicação do bônus são até 23:59 dos dias ${get_leftValues.value.timeType[0]}, ${
      get_leftValues.value.timeType[1]
    } e ${
      get_leftValues.value.timeType[2]
    }, respectivamente. Reivindicações tardias serão consideradas perdidas.
A participação dos membros no evento é registrada automaticamente pelo sistema. Em caso de qualquer contestação, os registros finais da nossa empresa serão considerados precisos.
Para evitar interpretações errôneas, nossa empresa reserva-se o direito final de explicação e pode modificar ou encerrar o evento sem aviso prévio.`,
    vi_VN: `Tiền thưởng nhận được cần đặt cược ${get_leftValues.value.multiple} lần trước khi rút.
Thời gian thống kê sự kiện: tháng trước ${get_leftValues.value.timeType[2]} 00:00 - tháng này ${
      get_leftValues.value.timeType[0] - 1
    } 23:59:59 được tính là một chu kỳ.
Thời gian nhận lĩnh sự kiện ${get_leftValues.value.timeType[0]} trước 23:59, ${
      get_leftValues.value.timeType[1]
    } trước 23:59, ${
      get_leftValues.value.timeType[2]
    } trước 23:59 trong thời gian này không nhận thưởng đúng thời hạn sẽ được coi là bỏ cuộc.
Hội viên tham gia sự kiện sẽ được hệ thống tự động tính. Nếu có bất kỳ phản đối nào, kết quả điều tra của chúng tôi sẽ được ưu tiên.
Để tránh sự khác biệt trong hiểu biết văn bản, công ty chúng tôi có quyền giải thích cuối cùng về sự kiện này, cũng như quyền sửa đổi hoặc chấm dứt sự kiện mà không cần thông báo.`,
    th_TH: `โบนัสที่ได้รับจะต้องวางเดิมพันจำนวน ${
      get_leftValues.value.multiple
    } เท่าก่อนจึงจะสามารถถอนได้
รอบสถิติกิจกรรมเริ่มตั้งแต่เวลา 00:00 น. ของวันที่ ${
      get_leftValues.value.timeType[2]
    } ของเดือนที่แล้ว จนถึงเวลา 23:59:59 น. ของวันที่ ${
      get_leftValues.value.timeType[0] - 1
    } ของเดือนปัจจุบัน และเป็นเช่นนี้ต่อไป
กำหนดเวลาการรับโบนัสคือก่อนเวลา 23:59 น. ของวันที่ ${get_leftValues.value.timeType[0]} วันที่ ${
      get_leftValues.value.timeType[1]
    } และวันที่ ${get_leftValues.value.timeType[2]} ตามลำดับ หากเลยเวลาดังกล่าวจะถือว่าสละสิทธิ์
การเข้าร่วมกิจกรรมของสมาชิกจะถูกบันทึกโดยอัตโนมัติโดยระบบ หากมีข้อโต้แย้งใด ๆ จะถือว่าบันทึกสุดท้ายของบริษัทเป็นข้อมูลที่ถูกต้อง
เพื่อหลีกเลี่ยงความเข้าใจผิด บริษัทขอสงวนสิทธิ์ในการตีความขั้นสุดท้าย และสามารถแก้ไขหรือยุติกิจกรรมได้โดยไม่ต้องแจ้งให้ทราบล่วงหน้า`,
    hi_IN: `प्राप्त बोनस को वापस लेने से पहले ${
      get_leftValues.value.multiple
    } बार दांव पर लगाना होगा।
इवेंट सांख्यिकी चक्र पिछले महीने की ${
      get_leftValues.value.timeType[2]
    } तारीख 00:00 से लेकर चालू महीने की ${
      get_leftValues.value.timeType[0] - 1
    } तारीख 23:59:59 तक चलता है, और इसी तरह आगे भी चलता रहता है।
बोनस दावे की समय सीमा क्रमशः ${get_leftValues.value.timeType[0]}, ${
      get_leftValues.value.timeType[1]
    } और ${
      get_leftValues.value.timeType[2]
    } तारीख को 23:59 से पहले है। देर से किए गए दावों को जब्त माना जाएगा।
इवेंट में सदस्य की भागीदारी सिस्टम द्वारा स्वचालित रूप से दर्ज की जाती है। किसी भी विवाद की स्थिति में, हमारी कंपनी के अंतिम रिकॉर्ड को सटीक माना जाएगा।
 गलत व्याख्या से बचने के लिए, हमारी कंपनी स्पष्टीकरण का अंतिम अधिकार सुरक्षित रखती है और बिना किसी पूर्व सूचना के कार्यक्रम को संशोधित या समाप्त कर सकती है।,`,
    tl_PH: `Ang natanggap na bonus ay nangangailangan ng ${
      get_leftValues.value.multiple
    } beses na turnover bago ma-withdraw.
          Ang cycle ng pagtutuos para sa event ay mula ika-${
            get_leftValues.value.timeType[2]
          } ng nakaraang buwan 00:00 hanggang ika-${
      get_leftValues.value.timeType[0] - 1
    } ng kasalukuyang buwan 23:59:59, at uulit nang ganoon sa mga susunod na cycle.
          Ang oras ng pag-claim ng event ay hanggang ${get_leftValues.value.timeType[0]} 23:59, ${
      get_leftValues.value.timeType[1]
    } 23:59, at ${
      get_leftValues.value.timeType[2]
    } 23:59. Kapag lumampas sa oras at hindi na-claim, ituturing na tinanggihan.
          Ang lahat ng partisipasyon ng miyembro sa event ay awtomatikong itinatala ng system; kung may anumang pagtutol, ang resulta ng aming kumpanya ang susundin.
          Upang maiwasan ang hindi pagkakaunawaan sa teksto, ang aming kumpanya ay may karapatan sa huling pagpapaliwanag ng event na ito at may karapatang baguhin o tapusin ang event nang walang paunang abiso.`,
    ko_KR: `
    지급받은 보너스는 ${get_leftValues.value.multiple} 배의 롤링 조건을 충족해야 출금할 수 있습니다.
    이벤트 통계 주기는 지난달 ${get_leftValues.value.timeType[2]} 일 00:00부터 이번 달 ${
      get_leftValues.value.timeType[0] - 1
    } 일 23:59:59까지를 한 주기로 계산하며, 이후 동일하게 적용됩니다.
    보너스 수령 기한은 ${get_leftValues.value.timeType[0]} 일 23:59, ${
      get_leftValues.value.timeType[1]
    } 일 23:59, ${
      get_leftValues.value.timeType[2]
    } 일 23:59까지이며, 기한 내에 수령하지 않은 보너스는 포기한 것으로 간주됩니다.
    회원의 이벤트 참여는 시스템에 의해 자동으로 집계되며, 이의가 있을 경우 당사의 조회 결과를 기준으로 합니다.
    문구 해석에 대한 이견을 피하기 위해 당사는 본 이벤트에 대한 최종 해석권을 보유하며, 사전 통지 없이 이벤트를 수정하거나 중단할 권리를 가집니다.`,
  };
  return ty12;
};
export const get_text_ty13 = (ruleData, highestNum, get_leftValues, currencyName) => {
  let ty13: any = '';
  ty13 = {
    zh_CN: `
活动开始后，您注册后将自动参加。
会员每日${get_leftValues.value.fixed_start_at}-${get_leftValues.value.fixed_end_at}期间内总存款 ${get_leftValues.value?.rechargeMount} ${get_leftValues.value?.currencyName}，完成总存款${get_leftValues.value?.bet}倍有效投注，该会员可在当天${get_leftValues.value.fixed_end_at}一键领取 ${get_leftValues.value?.rechargeBet} ${get_leftValues.value?.currencyName} 奖金。
奖金仅支持用户手动点击领取，领取期限为1天，当天23:59:59前未领取视为放弃。
本次活动的所有奖金，需要${get_leftValues.value.multiple}倍流水才能提现。
本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
          `,
    en_US: `
Once the event starts, registering will automatically enroll you.
Members who deposit a total of ${get_leftValues.value?.rechargeMount} ${get_leftValues.value?.currencyName} between ${get_leftValues.value.fixed_start_at}-${get_leftValues.value.fixed_end_at} and complete valid bets worth ${get_leftValues.value?.bet} times the deposited amount can claim a ${get_leftValues.value?.rechargeBet} ${get_leftValues.value?.currencyName} bonus at ${get_leftValues.value.fixed_end_at} the same day with just one click.
The bonus must be claimed manually. The claim period is 1 day, and if not claimed by 11:59:59 PM on the same day, it will be forfeited.
All bonuses from this promotion require ${get_leftValues.value.multiple} times turnover to be withdrawn.
This promotion is strictly for account holders and legitimate operations. Account rentals, cheats, bots, multiple accounts, collusion, arbitration, or technical methods like exploiting system loopholes are prohibited. Otherwise, bonuses may be canceled, deducted, and the account frozen or blacklisted.
To avoid any misunderstandings, the platform reserves the final right to interpret this promotion.
          `,
    pt_BR: `
Assim que o evento começar, ao se registrar, você estará automaticamente participando.
Membros que depositarem um total de ${get_leftValues.value?.rechargeMount} ${get_leftValues.value?.currencyName} entre ${get_leftValues.value.fixed_start_at}-${get_leftValues.value.fixed_end_at} e realizarem apostas válidas no valor de ${get_leftValues.value?.bet}  vezes o depósito poderão resgatar um bônus de ${get_leftValues.value?.rechargeBet} ${get_leftValues.value?.currencyName}  às ${get_leftValues.value.fixed_end_at} no mesmo dia com apenas um clique.
O bônus deve ser resgatado manualmente. O prazo é de 1 dia, e caso não seja resgatado até 23:59:59 do mesmo dia, será considerado como perdido.
Todos os bônus desta promoção precisam de ${get_leftValues.value.multiple} vezes de apostas para serem sacados.
Esta promoção é exclusiva para o titular da conta e para operações legítimas. É proibido o aluguel de contas, o uso de trapaças, bots, múltiplas contas, conluio, arbitragem ou qualquer método técnico, como exploração de falhas no sistema. Caso contrário, os bônus podem ser cancelados, deduzidos, e a conta pode ser congelada ou colocada na lista negra.
Para evitar dúvidas de interpretação, a plataforma se reserva o direito de decisão final sobre esta promoção.
          `,
    vi_VN: `
Khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia.
Tổng số tiền gửi của hội viên là ${get_leftValues.value?.rechargeMount} ${get_leftValues.value?.currencyName} trong khoảng thời gian ${get_leftValues.value.fixed_start_at}-${get_leftValues.value.fixed_end_at} mỗi ngày và hoàn thành điều kiện đặt cược ${get_leftValues.value?.bet} lần số tiền nạp. Hội viên có thể nhận tiền thưởng lên tới ${get_leftValues.value?.rechargeBet} ${get_leftValues.value?.currencyName} vào lúc ${get_leftValues.value.fixed_end_at} cùng ngày hôm đó.
Phần thưởng chỉ hỗ trợ người dùng nhận thủ công. Thời gian quy đổi là 1 ngày. Việc không nhận phần thưởng trước 23:59:59 cùng ngày sẽ được coi là bỏ cuộc, tiền thưởng sẽ tự động khấu trừ.
Tất cả tiền thưởng từ sự kiện này yêu cầu ${get_leftValues.value.multiple} lần tiền vòng cược mới có thể rút.
Hoạt động này được chủ tài khoản giới hạn ở các hoạt động bình thường. Nghiêm cấm cho thuê, sử dụng gian lận, robot, đồng thời sử dụng các tài khoản khác nhau, đánh lừa lẫn nhau, phân xử, giao diện, giao thức, khai thác lỗ hổng, kiểm soát nhóm và các phương tiện kỹ thuật khác. Nếu phát hiện phần thưởng có thể bị hủy hoặc khấu trừ, bị đóng băng hoặc thậm chí bị đưa vào danh sách đen.
Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.

          `,
    th_TH: `
          `,
    hi_IN: `
         `,
    tl_PH: `
          Kapag nagsimula ang event, awtomatiko kang sasali pagkatapos magparehistro.
          Kung sa pagitan ng ${get_leftValues.value.fixed_start_at}-${get_leftValues.value.fixed_end_at} araw-araw ay umabot ang kabuuang deposito ng miyembro sa ${get_leftValues.value?.rechargeMount} ${get_leftValues.value?.currencyName} at natapos ang kabuuang valid na taya na ${get_leftValues.value?.bet} beses ng deposito, maaaring mag-claim ang miyembro sa parehong araw sa ${get_leftValues.value.fixed_end_at} ng ${get_leftValues.value?.rechargeBet} ${get_leftValues.value?.currencyName} na bonus gamit ang one-click claim.
          Ang bonus ay maaari lamang i-claim nang manu-mano ng user; ang claim period ay 1 araw lamang. Kapag hindi na-claim bago mag-23:59:59 sa parehong araw, ituturing na tinanggihan.
          Ang lahat ng bonus sa event na ito ay nangangailangan ng ${get_leftValues.value.multiple} beses na turnover bago ma-withdraw.
          Ang event na ito ay para lamang sa normal na manu-manong operasyon ng may-ari ng account. Ipinagbabawal ang pagrenta, paggamit ng pandaraya, bot, paglalaro gamit ang ibang account, mutual brushing, arbitration, API, protocol, paggamit ng bug, group control, at iba pang teknik. Kung hindi, maaaring kanselahin, kaltasin, i-freeze ang reward o ilagay sa blacklist.
          Upang maiwasan ang hindi pagkakaunawaan sa teksto, ang platform ay may karapatan sa huling pagpapaliwanag ng event na ito.
         `,
    ko_KR: `
          이벤트 시작 후, 가입하면 자동으로 참여됩니다. 
          회원은 매일 ${get_leftValues.value.fixed_start_at}-${get_leftValues.value.fixed_end_at} 기간 내 총 충전 ${get_leftValues.value?.rechargeMount} ${get_leftValues.value?.currencyName} 을 완료하고, 총 충전 ${get_leftValues.value?.bet} 배 유효 베팅을 달성하면, 해당 회원은 당일 ${get_leftValues.value.fixed_end_at} 에 원클릭으로 ${get_leftValues.value?.rechargeBet} ${get_leftValues.value?.currencyName} 보너스를 수령할 수 있습니다. 
          보너스는 사용자가 수동으로 클릭해야만 수령 가능하며, 수령 기간은 1일이며, 당일 23:59:59까지 수령하지 않으면 포기한 것으로 간주됩니다. 
          이번 이벤트의 모든 보너스는 ${get_leftValues.value.multiple} 배 베팅 흐름을 완료해야 출금할 수 있습니다. 
          본 이벤트는 계정 소유자 본인만 정상적으로 참여 가능하며, 계정 대여, 치트 사용, 봇, 다른 계정 플레이, 상호 베팅, 중재, 인터페이스/프로토콜 활용, 버그 이용, 그룹 제어 등 기술적 수단 사용은 금지됩니다. 위반 시, 보상은 취소, 차감, 동결되거나 블랙리스트에 등록될 수 있습니다. 
          문자 이해 차이로 인한 분쟁을 방지하기 위해, 플랫폼은 본 이벤트에 대한 최종 해석 권한을 보유합니다.`,
  };
  return ty13;
};
export const get_text_ty14 = (ruleData, highestNum, get_leftValues, currencyName) => {
  let ty14: any = '';
  ty14 = {
    zh_CN: `
        活动开始后，您注册后将自动参加。您仅需要在本日完成充值并累计达到充值金额要求。
        充值越多，奖励越多，最高可获得奖励${highestNum.value || 0}CNY。
        获得奖励资格后，会在次日12点后更新，请等待奖励发放。
        奖金仅支持用户手动点击领取，领取期限为1天，次日23:59:59前未领取视为放弃。
        本次活动的所有奖金，需要${get_leftValues.value.multiple || 0}倍流水才能提现。
        本活动仅限账户持有人正常人为操作。禁止出租、使用作弊、机器人、不同账号玩、互刷、仲裁、接口、协议、利用漏洞、群控等技术手段。否则，奖励可能会被取消或扣除、冻结甚至列入黑名单。
        为避免对文字理解产生分歧，平台保留本次活动的最终解释权。
       `,
    en_US: `
        After the event starts, you will automatically participate once you register. You only need to complete a deposit on the same day and accumulate the required deposit amount.
        The more you deposit, the greater the rewards, with a maximum reward of ${
          highestNum.value || 0
        }CNY.
        Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
        The bonus must be manually claimed by the user within 1 day. If not claimed by 11:59:59 PM the following day, it will be considered forfeited.
        All bonuses from this event require a ${
          get_leftValues.value.multiple || 0
        }x wagering turnover before withdrawal.
        This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
        To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
    pt_BR: `
       Após o início do evento, você será automaticamente inscrito após se registrar. Você só precisa fazer um depósito no mesmo dia e acumular o valor exigido.
        Quanto maior o depósito, maior a recompensa, com um valor máximo de ${
          highestNum.value || 0
        }CNY.
        Após qualificar-se para a recompensa, ela será atualizada após as 01:00:00 do dia seguinte. Por favor, aguarde a distribuição do bônus;
        O bônus só poderá ser resgatado manualmente pelo usuário, com um prazo de 1 dia. Caso não seja resgatado até as 23:59:59 do dia seguinte, será considerado como desistência.
        Todos os bônus deste evento exigem um turnover de apostas de ${
          get_leftValues.value.multiple || 0
        }x antes do saque.
        Este evento é válido apenas para atividade normal de titulares de contas individuais. É proibido alugar contas, usar trapaças, bots, múltiplas contas, negociações mútuas, arbitragem, uso de APIs, exploração de vulnerabilidades, controle em grupo ou quaisquer outros meios técnicos. Caso contrário, as recompensas podem ser canceladas, deduzidas, congeladas ou até mesmo resultar em inclusão na lista negra.
        Para evitar mal-entendidos, a plataforma reserva o direito de interpretação final deste evento.
       `,
    vi_VN: `
        Sau khi sự kiện bắt đầu, sau khi đăng ký sẽ tự động tham gia. Bạn chỉ cần hoàn tất việc nạp tiền ngay hôm nay và đạt đủ yêu cầu về số tiền nạp tích lũy.
        Nạp càng nhiều, thưởng càng cao. Phần thưởng tối đa lên tới ${highestNum.value || 0}CNY.
        Sau khi đủ tư cách nhận thưởng, sự kiện sẽ tự động cập vào 01:00:00, vui lòng chờ đợi phát thưởng.
        Tiền thưởng hỗ trợ nhận thủ công, thời gian nhận là 1 ngày, trước 23:59:59 cùng ngày không nhận thưởng tiền thưởng sẽ tự động khấu trừ.
        Tất cả tiền thưởng từ sự kiện này yêu cầu  ${
          get_leftValues.value.multiple || 0
        }x lần vòng cược mới có thể rút.
        Qualquer usuário ou grupo que receber incentivos de eventos de forma anormal ou fraudulenta, a plataforma tem o direito de congelar ou fechar a conta relevante sem aviso prévio e sem reembolso, o usuário será colocado na lista negra.
        Để tránh sự khác biệt trong cách hiểu văn bản, nền tảng có quyền giải thích cuối cùng về sự kiện này.
       `,
    hi_IN: `
       After the event starts, you will automatically participate once you register. You only need to complete a deposit on the same day and accumulate the required deposit amount.
        The more you deposit, the greater the rewards, with a maximum reward of ${
          highestNum.value || 0
        }CNY.
        Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
        The bonus must be manually claimed by the user within 1 day. If not claimed by 11:59:59 PM the following day, it will be considered forfeited.
        All bonuses from this event require a ${
          get_leftValues.value.multiple || 0
        }x wagering turnover before withdrawal.
        This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
        To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
    th_TH: `
        After the event starts, you will automatically participate once you register. You only need to complete a deposit on the same day and accumulate the required deposit amount.
        The more you deposit, the greater the rewards, with a maximum reward of ${
          highestNum.value || 0
        }CNY.
        Once you qualify for the reward, it will be updated after 01:00:00 the next day. Please wait for the bonus distribution.
        The bonus must be manually claimed by the user within 1 day. If not claimed by 11:59:59 PM the following day, it will be considered forfeited.
        All bonuses from this event require a ${
          get_leftValues.value.multiple || 0
        }x wagering turnover before withdrawal.
        This event is only valid for normal, individual account holder activity. Renting accounts, using cheats, bots, multiple accounts, mutual trading, arbitration, API usage, exploiting vulnerabilities, group control, or any other technical means are prohibited. Otherwise, rewards may be canceled, deducted, frozen, or even result in blacklisting.
        To avoid misunderstandings, the platform reserves the final interpretation rights for this event.
       `,
    tl_PH: `
          Kapag nagsimula ang event, awtomatiko kang sasali pagkatapos magparehistro. Kailangan mo lamang kumpletuhin ang recharge ngayong araw at maabot ang kinakailangang kabuuang halaga ng recharge.
          Mas malaki ang recharge, mas malaki ang reward, hanggang sa maximum na ${
            highestNum.value || 0
          }PHP.
          Kapag nakamit ang kwalipikasyon para sa reward, maa-update ito pagkatapos ng 12:00 sa susunod na araw, mangyaring maghintay sa paglabas ng reward.
          Ang bonus ay maaari lamang i-claim nang manu-mano ng user; ang claim period ay 1 araw. Kapag hindi na-claim bago mag-23:59:59 sa susunod na araw, ituturing na tinanggihan.
          Ang lahat ng bonus sa event na ito ay nangangailangan ng ${
            get_leftValues.value.multiple || 0
          } beses na turnover bago ma-withdraw.
          Ang event na ito ay para lamang sa normal na manu-manong operasyon ng may-ari ng account. Ipinagbabawal ang pagrenta, paggamit ng pandaraya, bot, paglalaro gamit ang ibang account, mutual brushing, arbitration, API, protocol, paggamit ng bug, group control, at iba pang teknik. Kung hindi, maaaring kanselahin, kaltasin, i-freeze ang reward o ilagay sa blacklist.
          Upang maiwasan ang hindi pagkakaunawaan sa teksto, ang platform ay may karapatan sa huling pagpapaliwanag ng event na ito.
       `,
    ko_KR: `
          이벤트 시작 후, 회원가입 시 자동으로 참여됩니다. 당일 충전 금액이 누적 요구 사항을 충족하면 됩니다.
          충전 금액이 많을수록 보너스도 많아지며, 최대 ${
            highestNum.value || 0
          } KRW 의 보너스를 받을 수 있습니다.
          보너스 자격을 획득하면 다음 날 12시 이후에 업데이트되니 보너스 지급을 기다려 주세요.
          보너스는 사용자가 직접 수령 버튼을 클릭해야 하며, 수령 기한은 1일입니다. 다음 날 23:59:59까지 수령하지 않으면 포기한 것으로 간주됩니다.
          이번 이벤트의 모든 보너스는 출금하려면 ${
            get_leftValues.value.multiple || 0
          } 배의 롤링이 필요합니다.
          이 이벤트는 계정 소유자의 정상적인 수동 조작에 한합니다. 계정 대여, 사기, 봇 사용, 여러 계정으로 플레이, 상호 롤링, 중재, 인터페이스, 프로토콜, 취약점 악용, 그룹 제어 등 기술적인 수단은 금지됩니다. 위반 시 보상은 취소되거나 차감, 동결 또는 블랙리스트에 오를 수 있습니다.
          문구 해석에 대한 이견을 피하기 위해 플랫폼은 이번 이벤트에 대한 최종 해석권을 보유합니다.`,
  };
  return ty14;
};

// 会员答谢
export const get_text_ty16 = (ruleData, highestNum, get_leftValues, currencyName) => {
  let ty16: any = '';
  ty16 = {
    zh_CN: `为感谢会员对平台的大力支持，我们推出“会员答谢礼”活动。
活动期间，会员${
      get_leftValues.value.reward_type === 'recharge'
        ? '存款'
        : get_leftValues.value.reward_type === 'loss'
        ? '亏损'
        : '有效投注'
    }达到一定数额，即可获得一定奖励。${
      get_leftValues.value.reward_type === 'recharge'
        ? '存款'
        : get_leftValues.value.reward_type === 'loss'
        ? '亏损'
        : '有效投注'
    }越大，奖励越丰厚。
必须手动领取奖励才能记入账户。如果您忘记，奖励将会过期并无效。
本活动所赠奖金（不含主奖金）需${get_leftValues.value.multiple || 0}倍有效投注金额方可提现。
此活动仅限于账户持有者进行正常的人为操作。禁止使用租用、作弊、机器人、不同账号、多人游戏、仲裁、接口、协议、利用漏洞、群控或其他技术手段。否则，奖励可能会被取消、扣除、冻结，甚至列入黑名单。
为避免对文本解释产生误解，本平台保留解释权及最终决定权。
    `,
    en_US: `To thank members for strong support of the platform, we are launching the "Member appreciation gift" event.
During the event, members whose ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'deposits'
        : get_leftValues.value.reward_type === 'loss'
        ? 'losses'
        : 'valid'
    }valid wagers reach designated tiers will receive corresponding rewards. The higher the ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'deposits'
        : get_leftValues.value.reward_type === 'loss'
        ? 'losses'
        : 'valid'
    } wagers, the greater the reward.
Rewards must be claimed manually to be credited; if forgotten, they will expire and become void.
Bonus funds from this event (excluding principal) require a ${
      get_leftValues.value.multiple || 0
    }× valid wager before withdrawal.
This event is restricted to normal manual operations by the account holder. Renting accounts, cheating tools, bots, multiple accounts, team play, arbitrage, APIs, protocols, exploits, group control, or other technical means are prohibited. Violations may lead to rewards being cancelled, deducted, frozen, or blacklisted.
To avoid misinterpretation, the platform reserves the right of explanation and final decision.
    `,
    pt_BR: `Para agradecer aos membros pelo forte apoio à plataforma, estamos lançando o evento "Presente de agradecimento aos membros”.
Durante o evento, os membros cujos ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'depósitos'
        : get_leftValues.value.reward_type === 'loss'
        ? 'perdas'
        : 'apostas'
    } válidas atingirem os níveis exigidos receberão as recompensas correspondentes. Quanto mais alto forem os ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'depósitos'
        : get_leftValues.value.reward_type === 'loss'
        ? 'perdas'
        : 'apostas'
    } válidas, maior será a recompensa.
Os prémios devem ser reivindicados manualmente para serem creditados; se forem esquecidos, expiram e tornam-se nulos.
Os fundos de bónus deste evento (excluindo o capital) requerem uma aposta válida de ${
      get_leftValues.value.multiple || 0
    } × antes da retirada.
Este evento está limitado às operações manuais normais do titular da conta. É proibido o aluguel de contas, ferramentas de fraude, bots, contas múltiplas, jogo em equipe, arbitragem, APIs, protocolos, exploits, controle de grupo ou outros meios técnicos. As violações podem levar ao cancelamento, dedução, congelamento ou inclusão na lista negra de recompensas.
Para evitar interpretações erróneas, a plataforma reserva-se o direito de explicação e de decisão final.
    `,
    vi_VN: `Để tri ân sự ủng hộ mạnh mẽ của hội viên đối với nền tảng, chúng tôi triển khai hoạt động “Quà tri ân hội viên”.
Trong thời gian diễn ra sự kiện, khi khoản ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'nạp'
        : get_leftValues.value.reward_type === 'loss'
        ? 'thua lỗ'
        : 'cược hợp'
    } lệ của hội viên đạt mốc nhất định, sẽ nhận được phần thưởng tương ứng. ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'nạp'
        : get_leftValues.value.reward_type === 'loss'
        ? 'thua lỗ'
        : 'cược hợp'
    } càng lớn, thưởng càng cao.
Phần thưởng phải tự tay nhận thì mới ghi vào tài khoản; nếu quên, thưởng sẽ hết hạn và vô hiệu.
Tiền thưởng tặng thêm (không tính tiền gốc) phải cược hợp lệ ${
      get_leftValues.value.multiple || 0
    } lần trước khi rút.
Sự kiện chỉ dành cho thao tác thủ công bình thường của chủ tài khoản. Cấm thuê, gian lận, bot, đa tài khoản, chơi đồng đội, arbitrage, API, giao thức, khai thác lỗi, điều khiển nhóm hay biện pháp kỹ thuật khác; vi phạm có thể bị hủy, trừ, đóng băng thưởng hoặc đưa vào danh sách đen.
Để tránh hiểu sai, nền tảng giữ quyền giải thích và quyết định cuối cùng.
    `,
    hi_IN: `प्लैटफ़ॉर्म को मिले प्रबल समर्थन के लिए सदस्यों को धन्यवाद देने के लिए, हम "सदस्य प्रशंसा उपहार" कार्यक्रम शुरू कर रहे हैं।
इवेंट के दौरान, जिन सदस्यों की ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'जमाराशि'
        : get_leftValues.value.reward_type === 'loss'
        ? 'घाटे'
        : 'वैध दांव'
    } निर्दिष्ट स्तरों तक पहुँचते हैं, उन्हें संबंधित पुरस्कार प्राप्त होंगे। ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'जमाराशि'
        : get_leftValues.value.reward_type === 'loss'
        ? 'घाटे'
        : 'वैध दांव'
    } जितना अधिक होगा, पुरस्कार उतना ही अधिक होगा।
पुरस्कारों को प्राप्त करने के लिए उन्हें मैन्युअल रूप से दावा करना होगा; यदि भूल गए तो वे समाप्त हो जाएंगे और निरर्थक हो जाएंगे।
इस इवेंट से प्राप्त बोनस फंड (मूलधन को छोड़कर) के लिए निकासी से पहले ${
      get_leftValues.value.multiple || 0
    }× वैध दांव की आवश्यकता होती है।
यह इवेंट खाताधारक द्वारा सामान्य मैन्युअल संचालन तक ही सीमित है। खाते किराए पर लेना, धोखाधड़ी करने वाले उपकरण, बॉट, कई खाते, टीम प्ले, आर्बिट्रेज, एपीआई, प्रोटोकॉल, शोषण, समूह नियंत्रण या अन्य तकनीकी साधन निषिद्ध हैं। उल्लंघन के कारण पुरस्कार रद्द, काटे, फ्रीज या ब्लैकलिस्ट किए जा सकते हैं।
गलत व्याख्या से बचने के लिए, मंच स्पष्टीकरण और अंतिम निर्णय का अधिकार सुरक्षित रखता है।
    `,
    th_TH: `เพื่อเป็นการขอบคุณสมาชิกสำหรับการสนับสนุนอย่างดีเยี่ยมที่มีต่อแพลตฟอร์มของเรา เราขอเปิดตัวกิจกรรม “ของขวับขอบคุณสมาชิก
ในระหว่างแคมเปญ หากสมาชิกครบตามจำนวนที่กำหนด ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'เงินฝาก'
        : get_leftValues.value.reward_type === 'loss'
        ? 'เสีย'
        : 'จำนวนเดิมพัน'
    }จะได้รับรางวัลตามที่กำหนด ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'เงินฝาก'
        : get_leftValues.value.reward_type === 'loss'
        ? 'เสีย'
        : 'จำนวนเดิมพัน'
    } ยิ่งสูงยิ่งให้รางวัล
ต้องกดรับรางวัลด้วยตนเองเท่านั้น รางวัลจะถูกนับเข้าบัญชี หากลืมกดรับภายในเวลาที่กำหนด รางวัลจะหมดอายุและถือว่าไม่สามารถใช้งานได้
โบนัสที่ได้รับจากกิจกรรมนี้ (ไม่รวมโบนัสหลัก) ต้องทำเทิร์นโอเวอร์ ${
      get_leftValues.value.multiple || 0
    } เท่าของโบนัสก่อนจึงจะสามารถถอนออกได้
กิจกรรมนี้จำกัดเฉพาะผู้ถือบัญชีที่ดำเนินการด้วยตนเองตามปกติ ห้ามใช้บัญชีเช่า โปรแกรมโกง บอท หลายบัญชี ผู้เล่นหลายคน การเก็งกำไร การอนุญาโตตุลาการ อินเทอร์เฟซ โปรโตคอล การใช้ช่องโหว่ การควบคุมหลายบัญชี หรือเทคนิคอื่น ๆ หากตรวจพบจะถูกยกเลิก/หัก/ระงับรางวัล หรืออาจถูกขึ้นบัญชีดำ
เพื่อหลีกเลี่ยงความเข้าใจผิดเกี่ยวกับข้อความ แพลตฟอร์มขอสงวนสิทธิ์ในการตีความและตัดสินใจขั้นสุดท้ายเกี่ยวกับกิจกรรมนี้
    `,
    tl_PH: `
          Bilang pasasalamat sa malaking suporta ng mga miyembro sa platform, inilunsad namin ang “Pasasalamat sa Miyembro” na event.
          Sa panahon ng event, kapag ang ${
            get_leftValues.value.reward_type === 'recharge'
              ? 'deposito'
              : get_leftValues.value.reward_type === 'loss'
              ? 'pagkalugi'
              : 'valid na taya'
          } ng miyembro ay umabot sa tiyak na halaga, makakakuha ng kaukulang reward. Mas malaki ang ${
      get_leftValues.value.reward_type === 'recharge'
        ? 'deposito'
        : get_leftValues.value.reward_type === 'loss'
        ? 'pagkalugi'
        : 'valid na taya'
    }, mas malaki ang reward.
          Kailangang manu-manong i-claim ang reward upang maidagdag sa account. Kapag nakalimutan, ito ay mag-e-expire at mawawalan ng bisa.
          Ang bonus na ibinibigay sa event na ito (hindi kasama ang pangunahing bonus) ay nangangailangan ng ${
            get_leftValues.value.multiple || 0
          } beses na valid na turnover bago ma-withdraw.
          Ang event na ito ay para lamang sa normal na manu-manong operasyon ng may-ari ng account. Ipinagbabawal ang pagrenta, paggamit ng pandaraya, bot, paglalaro gamit ang ibang account, multiplayer cheating, arbitration, API, protocol, paggamit ng bug, group control, o iba pang teknik. Kung hindi, maaaring kanselahin, kaltasin, i-freeze ang reward o ilagay sa blacklist.
          Upang maiwasan ang hindi pagkakaunawaan sa interpretasyon ng teksto, ang platform ay may karapatan sa pagpapaliwanag at sa pinal na desisyon para sa event na ito.
    `,
    ko_KR: ``,
  };
  return ty16;
};

export const get_text_ty17 = (
  ruleData,
  highestNum,
  get_leftValues,
  currencyName,
  platform_ids,
  plateOptions,
) => {
  let text: any = {};
  const variable1 = highestNum.value || 0;
  const variable2 = {
    zh_CN:
      t('modalForm.common.yesterday', '', { locale: 'zh_CN' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'zh_CN' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'zh_CN' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'zh_CN' })
        : t('common.active_text34', '', { locale: 'zh_CN' })),
    en_US:
      t('modalForm.common.yesterday', '', { locale: 'en_US' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'en_US' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'en_US' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'en_US' })
        : t('common.active_text34', '', { locale: 'en_US' })),
    pt_BR:
      t('modalForm.common.yesterday', '', { locale: 'pt_BR' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'pt_BR' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'pt_BR' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'pt_BR' })
        : t('common.active_text34', '', { locale: 'pt_BR' })),
    vi_VN:
      t('modalForm.common.yesterday', '', { locale: 'vi_VN' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'vi_VN' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'vi_VN' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'vi_VN' })
        : t('common.active_text34', '', { locale: 'zh_CN' })),
    hi_IN:
      t('modalForm.common.yesterday', '', { locale: 'hi_IN' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'hi_IN' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'hi_IN' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'hi_IN' })
        : t('common.active_text34', '', { locale: 'hi_IN' })),
    th_TH:
      t('modalForm.common.yesterday', '', { locale: 'th_TH' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'th_TH' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'th_TH' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'th_TH' })
        : t('common.active_text34', '', { locale: 'th_TH' })),
    tl_PH:
      t('modalForm.common.yesterday', '', { locale: 'tl_PH' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'tl_PH' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'tl_PH' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'tl_PH' })
        : t('common.active_text34', '', { locale: 'tl_PH' })),
    ko_KR:
      t('modalForm.common.yesterday', '', { locale: 'ko_KR' }) +
      (get_leftValues.fulfil_cond == 2
        ? t('common.active_text31', '', { locale: 'ko_KR' })
        : get_leftValues.reward_type == 1
        ? t('common.active_text32', '', { locale: 'ko_KR' })
        : get_leftValues.reward_type == 2
        ? t('common.active_text33', '', { locale: 'ko_KR' })
        : t('common.active_text34', '', { locale: 'ko_KR' })),
  };
  const variable3 = {
    zh_CN:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'zh_CN' }) +
            '(' +
            t('common.all_venues', '', { locale: 'zh_CN' }) +
            ')'
          : t('common.active_text30', '', { locale: 'zh_CN' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
    en_US:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'en_US' }) +
            '(' +
            t('common.all_venues', '', { locale: 'en_US' }) +
            ')'
          : t('common.active_text30', '', { locale: 'en_US' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
    pt_BR:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'pt_BR' }) +
            '(' +
            t('common.all_venues', '', { locale: 'pt_BR' }) +
            ')'
          : t('common.active_text30', '', { locale: 'pt_BR' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
    vi_VN:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'vi_VN' }) +
            '(' +
            t('common.all_venues', '', { locale: 'vi_VN' }) +
            ')'
          : t('common.active_text30', '', { locale: 'vi_VN' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
    hi_IN:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'hi_IN' }) +
            '(' +
            t('common.all_venues', '', { locale: 'hi_IN' }) +
            ')'
          : t('common.active_text30', '', { locale: 'hi_IN' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
    th_TH:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'th_TH' }) +
            '(' +
            t('common.all_venues', '', { locale: 'th_TH' }) +
            ')'
          : t('common.active_text30', '', { locale: 'th_TH' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
    tl_PH:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'tl_PH' }) +
            '(' +
            t('common.all_venues', '', { locale: 'tl_PH' }) +
            ')'
          : t('common.active_text30', '', { locale: 'tl_PH' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
    ko_KR:
      get_leftValues.reward_type != 1 || get_leftValues.fulfil_cond == 2
        ? get_leftValues.platform_range == 1
          ? t('common.active_text35', '', { locale: 'ko_KR' }) +
            '(' +
            t('common.all_venues', '', { locale: 'ko_KR' }) +
            ')'
          : t('common.active_text30', '', { locale: 'ko_KR' }) +
            plateOptions
              .filter((item) => platform_ids.includes(item.platform_id))
              .map((item) => item.name)
              .join(', ') +
            '）\\n '
        : '',
  };
  try {
    text = {
      zh_CN: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.zh_CN, variable3: variable3.zh_CN },
          { locale: 'zh_CN' },
        ) || '"待翻译去翻译"',
      ),
      en_US: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.en_US, variable3: variable3.en_US },
          { locale: 'en_US' },
        ) || '"待翻译去翻译"',
      ),
      pt_BR: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.pt_BR, variable3: variable3.pt_BR },
          { locale: 'pt_BR' },
        ) || '"待翻译去翻译"',
      ),
      vi_VN: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.vi_VN, variable3: variable3.vi_VN },
          { locale: 'vi_VN' },
        ) || '"待翻译去翻译"',
      ),
      hi_IN: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.hi_IN, variable3: variable3.hi_IN },
          { locale: 'hi_IN' },
        ) || '"待翻译去翻译"',
      ),
      th_TH: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.th_TH, variable3: variable3.th_TH },
          { locale: 'th_TH' },
        ) || '"待翻译去翻译"',
      ),
      tl_PH: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.tl_PH, variable3: variable3.tl_PH },
          { locale: 'tl_PH' },
        ) || '"待翻译去翻译"',
      ),
      ko_KR: JSON.parse(
        t(
          'common.active_text29',
          { variable1, variable2: variable2.ko_KR, variable3: variable3.ko_KR },
          { locale: 'ko_KR' },
        ) || '"待翻译去翻译"',
      ),
    };
  } catch (e) {
    console.error(e);
  }

  return text;
};
export const get_text_ty3 = (ruleData, dropStyle, get_leftValues, currencyName) => {
  let text: any = {};
  // const variable1 = get_leftValues.multiple;
  const variable1 = get_leftValues.multiple;
  const variable2 = {
    zh_CN:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'zh_CN' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'zh_CN' })
        : t('common.active_text62', '', { locale: 'zh_CN' }),
    en_US:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'en_US' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'en_US' })
        : t('common.active_text62', '', { locale: 'en_US' }),
    pt_BR:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'pt_BR' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'pt_BR' })
        : t('common.active_text62', '', { locale: 'pt_BR' }),
    vi_VN:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'vi_VN' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'vi_VN' })
        : t('common.active_text62', '', { locale: 'vi_VN' }),
    hi_IN:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'hi_IN' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'hi_IN' })
        : t('common.active_text62', '', { locale: 'hi_IN' }),
    th_TH:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'th_TH' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'th_TH' })
        : t('common.active_text62', '', { locale: 'th_TH' }),
    tl_PH:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'tl_PH' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'tl_PH' })
        : t('common.active_text62', '', { locale: 'tl_PH' }),
    ko_KR:
      dropStyle == 3
        ? t('common.active_text61', '', { locale: 'ko_KR' })
        : dropStyle == 2
        ? t('common.jinqian', '', { locale: 'ko_KR' })
        : t('common.active_text62', '', { locale: 'ko_KR' }),
  };
  const variable3 = {};
  try {
    text = {
      zh_CN:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.zh_CN, variable3: variable3.zh_CN },
          { locale: 'zh_CN' },
        ) || '"待翻译去翻译"',
      en_US:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.en_US, variable3: variable3.en_US },
          { locale: 'en_US' },
        ) || '"待翻译去翻译"',
      pt_BR:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.pt_BR, variable3: variable3.pt_BR },
          { locale: 'pt_BR' },
        ) || '"待翻译去翻译"',
      vi_VN:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.vi_VN, variable3: variable3.vi_VN },
          { locale: 'vi_VN' },
        ) || '"待翻译去翻译"',
      hi_IN:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.hi_IN, variable3: variable3.hi_IN },
          { locale: 'hi_IN' },
        ) || '"待翻译去翻译"',
      th_TH:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.th_TH, variable3: variable3.th_TH },
          { locale: 'th_TH' },
        ) || '"待翻译去翻译"',
      tl_PH:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.tl_PH, variable3: variable3.tl_PH },
          { locale: 'tl_PH' },
        ) || '"待翻译去翻译"',
      ko_KR:
        t(
          'common.active_text60',
          { variable1, variable2: variable2.ko_KR, variable3: variable3.ko_KR },
          { locale: 'ko_KR' },
        ) || '"待翻译去翻译"',
    };
  } catch (e) {
    console.error(e);
  }

  return text;
};
// 活动8
export const getTypeObj2 = {
  1: {
    zh_CN: '奖金仅支持用户手动点击领取，未领取的奖金将自动发放到钱包。',
    en_US:
      'Bonuses can only be claimed manually by the user, and unclaimed bonuses will be automatically credited to the wallet.',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário, e os bônus não reivindicados serão creditados automaticamente na carteira.',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và những phần thưởng chưa nhận sẽ tự động được ghi có vào ví.',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และโบนัสที่ไม่ได้รับจะถูกโอนเข้ากระเป๋าเงินโดยอัตโนมัติ.',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और न लिए गए बोनस स्वचालित रूप से वॉलेट में जमा किए जाएंगे.',
    tl_PH:
      'Ang bonus ay maaari lamang makuha sa pamamagitan ng manual na pag-click ng user, at ang hindi nakuha na bonus ay awtomatikong ilalagay sa wallet.',
    ko_KR:
      '보너스는 사용자가 직접 클릭하여 수령해야 하며, 미수령 보너스는 자동으로 지갑에 지급됩니다.',
  },
  2: {
    zh_CN: '奖金仅支持用户手动点击领取，我们将及时审核您的奖金申请，通过后奖金将自动发放到钱包.',
    en_US:
      'Bonuses can only be claimed manually by the user, and we will promptly review your bonus application. Once approved, the bonus will be automatically credited to your wallet.',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário, e nós iremos revisar sua solicitação de bônus prontamente. Após a aprovação, o bônus será creditado automaticamente em sua carteira.',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và chúng tôi sẽ xem xét yêu cầu thưởng của bạn kịp thời. Sau khi được phê duyệt, phần thưởng sẽ tự động được ghi có vào ví của bạn.',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และเราจะตรวจสอบคำขอรับโบนัสของคุณอย่างรวดเร็ว เมื่อได้รับการอนุมัติ โบนัสจะถูกโอนเข้ากระเป๋าเงินของคุณโดยอัตโนมัติ.',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और हम आपकी बोनस आवेदन की तुरंत समीक्षा करेंगे। स्वीकृत होने पर, बोनस स्वचालित रूप से आपके वॉलेट में जमा कर दिया जाएगा.',
    tl_PH:
      'Ang bonus ay maaari lamang makuha sa pamamagitan ng manual na pag-click ng user. Agad naming susuriin ang iyong aplikasyon para sa bonus, at kapag naaprubahan, awtomatikong ilalagay ang bonus sa wallet.',
    ko_KR:
      '보너스는 사용자가 직접 클릭하여 신청해야 하며, 저희가 신속하게 심사 후 승인되면 자동으로 지갑에 지급됩니다.',
  },
};
// 活动6
export const getTypeObj = {
  1: {
    zh_CN: t('v.discount.activity.get_type_no_audit'),
    en_US:
      'Bonuses can only be claimed manually by the user, and must be claimed on the same day; unclaimed bonuses will be considered forfeited.',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário e devem ser reivindicados no mesmo dia; bônus não reivindicados serão considerados como renúncia.',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và phải nhận trong cùng ngày; những phần thưởng không được nhận sẽ được coi là từ bỏ.',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และต้องขอรับในวันเดียวกัน; โบนัสที่ไม่ขอรับจะถือว่าถอนตัว.',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और इन्हें उसी दिन दावा किया जाना चाहिए; जो बोनस नहीं लिए गए हैं उन्हें त्याग माना जाएगा.',
    tl_PH:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और इन्हें उसी दिन दावा किया जाना चाहिए; जो बोनस नहीं लिए गए हैं उन्हें त्याग माना जाएगा.',
    ko_KR:
      '보너스는 사용자가 직접 클릭하여 수령해야 하며, 사용자는 당일 내에 수령해야 합니다，기한 내 수령하지 않은 보너스는 포기로 간주됩니다',
  },
  2: {
    zh_CN: t('v.discount.activity.get_type_need_audit'),
    en_US:
      'Bonuses can only be claimed manually by the user, and we will promptly review your bonus application. Once approved, the bonus will be automatically credited to your wallet;',
    pt_BR:
      'Os bônus só podem ser reivindicados manualmente pelo usuário, e nós iremos revisar sua solicitação de bônus prontamente. Após a aprovação, o bônus será creditado automaticamente em sua carteira;',
    vi_VN:
      'Người dùng chỉ có thể nhận thưởng bằng cách nhấp chuột thủ công, và chúng tôi sẽ xem xét yêu cầu thưởng của bạn kịp thời. Sau khi được phê duyệt, phần thưởng sẽ tự động được ghi có vào ví của bạn;',
    th_TH:
      'โบนัสสามารถขอรับได้เพียงด้วยการคลิกของผู้ใช้เท่านั้น และเราจะตรวจสอบคำขอรับโบนัสของคุณอย่างรวดเร็ว เมื่อได้รับการอนุมัติ โบนัสจะถูกโอนเข้ากระเป๋าเงินของคุณโดยอัตโนมัติ;',
    hi_IN:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और हम आपकी बोनस आवेदन की तुरंत समीक्षा करेंगे। स्वीकृत होने पर, बोनस स्वचालित रूप से आपके वॉलेट में जमा कर दिया जाएगा;',
    tl_PH:
      'बोनस केवल उपयोगकर्ता द्वारा मैन्युअल रूप से दावा किए जा सकते हैं, और हम आपकी बोनस आवेदन की तुरंत समीक्षा करेंगे। स्वीकृत होने पर, बोनस स्वचालित रूप से आपके वॉलेट में जमा कर दिया जाएगा;',
    ko_KR:
      '보너스는 사용자가 직접 클릭하여 신청해야 하며, 저희가 신속하게 심사 후 승인되면 자동으로 지갑에 지급됩니다.',
  },
};
