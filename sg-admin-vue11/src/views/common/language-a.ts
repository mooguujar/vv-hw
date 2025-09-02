import axios from 'axios';
import { TRANSITION_API, TRANSITION_KEY } from '/@/settings/siteSetting';
import { useLocale } from '/@/locales/useLocale';
import { unref } from 'vue';

const translateContentList = async (contentList, value, currentlanguageIndex, itemType, la) => {
  const { getLocale } = useLocale();
  const sourceLang = la; // 源语言

  if (!value) {
    console.error('value 为空，终止所有请求');
    contentList.forEach((item) => {
      item[itemType] = '';
    });
    return { success: false, translations: [] };
  }

  if (currentlanguageIndex !== 0) {
    console.error('currentlanguageIndex 不为 0，终止所有请求');
    return { success: false, translations: [] };
  }

  const handleTextareaBlur = async (item) => {
    if (item.value === sourceLang || item.language === 'original') {
      item[itemType] = value;
      return value; // 无需翻译
    }

    const apiKey = TRANSITION_KEY;
    const targetLang = 'vi'; // 目标语言

    try {
      const response = await axios.post(`${TRANSITION_API}?key=${apiKey}`, {
        q: value,
        source: sourceLang,
        target: item.language || targetLang,
      });

      const translatedText = response.data.data.translations[0].translatedText;
      item[itemType] = translatedText;
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
