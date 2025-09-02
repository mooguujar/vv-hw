const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../temp/json-repo/frontend-admin/global.json');
const OUTPUT_DIR = path.join(__dirname, '../src/locales/langBack');

// 语言映射（反向）
const REVERSE_LANG_MAPPING = {
  en_US: 'en',
  ko_KR: 'ko',
  pt_BR: 'pt',
  th_TH: 'th',
  vi_VN: 'vi',
  zh_CN: 'zh',
  hi_IN: 'hi',
  ja_JP: 'ja',
  in_ID: 'in',
};

// 创建目录
function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 将扁平的键转换为嵌套对象
function unflattenKey(key, value) {
  const result = {};
  const parts = key.split('.');
  let current = result;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i === parts.length - 1) {
      current[part] = value;
    } else {
      current[part] = current[part] || {};
      current = current[part];
    }
  }

  return result;
}

// 深度合并对象，保持键的顺序
function deepMerge(target, source) {
  const allKeys = new Set([...Object.keys(target), ...Object.keys(source)].sort());

  for (const key of allKeys) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

// 主函数
function main() {
  try {
    // 读取JSON文件
    const jsonContent = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
    const langFiles = {};

    // 按语言组织内容
    for (const key in jsonContent) {
      const translations = jsonContent[key];

      // 处理每种语言
      for (const fullLang in translations) {
        const shortLang = REVERSE_LANG_MAPPING[fullLang];
        if (!shortLang) continue;

        const value = translations[fullLang];
        if (!value) continue; // 跳过空值

        // 获取模块路径
        const [module, ...rest] = key.split('.');
        const restKey = rest.join('.');

        // 初始化语言文件内容
        if (!langFiles[module]) {
          langFiles[module] = {};
        }
        if (!langFiles[module][shortLang]) {
          langFiles[module][shortLang] = {};
        }

        // 将翻译添加到对应的语言文件中
        const nestedObj = unflattenKey(restKey, value);
        deepMerge(langFiles[module][shortLang], nestedObj);
      }
    }

    // 写入语言文件
    for (const module in langFiles) {
      const moduleDir = path.join(OUTPUT_DIR, module);
      mkdirp(moduleDir);

      for (const lang in langFiles[module]) {
        const langFile = path.join(moduleDir, `${lang}.json`);
        // 按键排序并写入文件
        const sortedContent = JSON.stringify(langFiles[module][lang], null, 2);
        fs.writeFileSync(langFile, sortedContent, 'utf8');
      }
    }

    console.log('Successfully generated language files!');
  } catch (error) {
    console.error('Error generating language files:', error);
  }
}

main();
