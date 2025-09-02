import axios from 'axios';
import { TRANSITION_API, TRANSITION_KEY } from '/@/settings/siteSetting';

const translateContentList = async (contentList, value, currentlanguageIndex, itemType) => {
  let original_transitionValueBtn = '';

  if (itemType) {
    original_transitionValueBtn = contentList.filter((item) => item.value === 'zh-CN')[0]
      ?.transitionValueBtn;
  }

  if (!value) {
    console.error('value 为空，终止所有请求');
    return { success: false, translations: [] };
  }

  if (currentlanguageIndex !== 0 && !itemType && itemType !== 'isBtnText') {
    console.error('currentlanguageIndex 不为 0，终止所有请求');
    return { success: false, translations: [] };
  }

  const handleTextareaBlur = async (item) => {
    if (item.language === 'zh-CN') {
      //item.transitionValue = value;  // 会导致btn翻译的值会直接给输入框
      //不正确的翻译会自动把按钮的值给了富文本框（在这里修改了）
      // if (!itemType && itemType !== 'isBtnText') {
      //   item.transitionValue = original_transitionValue;
      // }
      if (itemType && itemType === 'isBtnText') {
        item.transitionValueBtn = original_transitionValueBtn;
      } else {
        item.transitionValue = value;
      }
      return value; // 无需翻译
    }

    const apiKey = TRANSITION_KEY;
    const sourceLang = 'zh-CN'; // 源语言
    const targetLang = 'vi'; // 目标语言

    try {
      const response = await axios.post(`${TRANSITION_API}?key=${apiKey}`, {
        q: value,
        source: sourceLang,
        target: item.language || targetLang,
      });

      const translatedText = response.data.data.translations[0].translatedText;
      if (itemType && itemType === 'isBtnText') {
        item.transitionValueBtn = translatedText;
      } else {
        item.transitionValue = translatedText;
      }

      //如果输入外语，点"中文"翻译，则不会有翻译的结果，也就是说，只会从中文翻译成外语，不会从外语翻译成中文
      return translatedText;
    } catch (error) {
      console.error('翻译请求失败', error);
      throw error;
    }
  };

  try {
    const translationResults = await Promise.all(contentList.map((el) => handleTextareaBlur(el)));
    // translationResults 包含所有翻译的结果
    return { success: true, translations: translationResults };
  } catch (error) {
    console.error('翻译请求失败', error);
    return { success: false, translations: [] };
  }
};

export default translateContentList;
