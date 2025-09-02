const fs = require('fs');
const path = require('path');

const LANG_DIR = path.join(__dirname, '../src/locales/lang');
const OUTPUT_FILE = path.join(__dirname, '../src/locales/lang.json');

// 语言映射
const LANG_MAPPING = {
  en: 'en_US',
  ko: 'ko_KR',
  pt: 'pt_BR',
  th: 'th_TH',
  vi: 'vi_VN',
  zh: 'zh_CN',
  hi: 'hi_IN',
  ja: 'ja_JP',
  in: 'in_ID',
};

// 递归读取目录中的所有JSON文件
function readLangFiles(dir) {
  const result = {};
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const relativePath = path.relative(LANG_DIR, dir);

    if (stat.isDirectory()) {
      // 递归处理子目录
      const subDirContent = readLangFiles(fullPath);
      Object.assign(result, subDirContent);
    } else if (item.endsWith('.json')) {
      const lang = item.replace('.json', '');
      const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

      // 扁平化内容并添加到结果中
      const flatContent = flattenObject(content, relativePath);
      for (const key in flatContent) {
        if (!result[key]) {
          result[key] = {};
          // 初始化所有语言的空值
          for (const shortLang in LANG_MAPPING) {
            result[key][LANG_MAPPING[shortLang]] = '';
          }
        }
        // 只保存非空值
        if (flatContent[key]) {
          result[key][LANG_MAPPING[lang]] = flatContent[key];
        }
      }
    }
  }

  return result;
}

// 将对象扁平化，使用点号分隔的键
function flattenObject(obj, prefix = '') {
  const result = {};

  function flatten(obj, parentKey = '') {
    for (const key in obj) {
      const value = obj[key];
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        flatten(value, newKey);
      } else {
        // 如果前缀存在，添加到键中
        const finalKey = prefix ? `${prefix}.${newKey}` : newKey;
        result[finalKey] = value;
      }
    }
  }

  flatten(obj);
  return result;
}

// 主函数
function main() {
  try {
    const result = readLangFiles(LANG_DIR);

    // 确保输出目录存在
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 写入JSON文件，保持键的顺序
    const sortedResult = {};
    Object.keys(result)
      .sort()
      .forEach((key) => {
        sortedResult[key] = result[key];
      });

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sortedResult, null, 2), 'utf8');
    console.log('Successfully generated lang.json file!');
  } catch (error) {
    console.error('Error generating lang.json:', error);
  }
}

main();
