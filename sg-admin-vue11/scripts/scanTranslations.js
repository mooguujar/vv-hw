const fs = require('fs');
const path = require('path');

// 配置
const LANG_BACK_DIR = path.join(__dirname, '../src/locales/langBack');
const LANG_DIR = path.join(__dirname, '../src/locales/lang');
const TEMP_DIR = path.join(__dirname, '../temp/json-repo');

// 递归读取目录中的所有JSON文件
function getAllJsonFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results.push(...getAllJsonFiles(fullPath));
    } else if (item.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  
  return results;
}

// 将对象扁平化，将嵌套的键转换为点分隔的字符串
function flattenObject(obj, prefix = '') {
  const result = {};
  
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenObject(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }
  
  return result;
}

// 尝试在全局翻译中查找匹配的键
function findGlobalTranslation(key, globalTranslations) {
  if (!globalTranslations) return null;
  
  // 直接匹配
  if (key in globalTranslations) {
    return globalTranslations[key];
  }
  
  // 尝试不同的前缀组合
  const prefixes = [
    'routes/member.routes.member.',
    'routes/finance.routes.finance.',
    'routes/system.routes.system.',
    'routes/report.routes.report.',
    'routes/risk.routes.risk.',
    'view/member.',
    'view/finance.',
    'view/system.',
    'view/report.'
  ];
  
  // 尝试所有可能的前缀
  for (const prefix of prefixes) {
    const prefixedKey = `${prefix}${key}`;
    if (prefixedKey in globalTranslations) {
      return globalTranslations[prefixedKey];
    }
  }
  
  // 移除前缀后匹配
  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  if (lastPart in globalTranslations) {
    return globalTranslations[lastPart];
  }
  
  // 尝试在translations中查找包含此键的完整路径
  for (const transKey in globalTranslations) {
    if (transKey.endsWith(`.${lastPart}`)) {
      const pathParts = transKey.split('.');
      const relevantParts = ['member', 'finance', 'system', 'report', 'risk', 'routes', 'view'];
      if (pathParts.some(part => relevantParts.includes(part))) {
        return globalTranslations[transKey];
      }
    }
  }
  
  return null;
}

// 比较两个翻译文件
function compareTranslations(langPath, globalTranslations) {
  console.log(`\n检查文件: ${path.relative(process.cwd(), langPath)}`);
  
  // 读取文件内容
  const langContent = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  
  // 扁平化对象
  const flatLang = flattenObject(langContent);
  
  // 检查缺失或空的翻译
  let missingCount = 0;
  let emptyCount = 0;
  let hasGlobalCount = 0;
  
  console.log('\n检查翻译:');
  for (const [key, value] of Object.entries(flatLang)) {
    if (value === '') {
      emptyCount++;
      // 尝试在全局翻译中查找
      const globalValue = findGlobalTranslation(key, globalTranslations);
      if (globalValue) {
        hasGlobalCount++;
        console.log(`  空值键 "${key}" 在全局翻译中找到值: "${globalValue}"`);
      } else {
        missingCount++;
        console.log(`  空值键 "${key}" 在全局翻译中未找到值`);
      }
    }
  }
  
  // 打印统计信息
  console.log('\n统计信息:');
  console.log(`  空值翻译: ${emptyCount}`);
  console.log(`  可从全局补充: ${hasGlobalCount}`);
  console.log(`  完全缺失: ${missingCount}`);
  
  return {
    empty: emptyCount,
    hasGlobal: hasGlobalCount,
    missing: missingCount
  };
}

// 主函数
async function main() {
  try {
    // 读取全局翻译文件
    console.log('读取全局翻译文件...');
    let globalTranslations = null;
    const globalJsonPath = path.join(TEMP_DIR, 'frontend-admin/global.json');
    if (fs.existsSync(globalJsonPath)) {
      const globalJson = JSON.parse(fs.readFileSync(globalJsonPath, 'utf8'));
      globalTranslations = {};
      // 处理每个语言的翻译
      for (const key in globalJson) {
        const translations = globalJson[key];
        for (const lang in translations) {
          if (!globalTranslations[lang]) {
            globalTranslations[lang] = {};
          }
          globalTranslations[lang][key] = translations[lang];
        }
      }
    } else {
      console.log('警告: 找不到全局翻译文件');
    }
    
    // 获取所有生成的翻译文件
    console.log('\n扫描生成的翻译文件...');
    const langFiles = getAllJsonFiles(LANG_DIR);
    
    // 按语言分组统计
    const languageStats = {};
    
    // 检查每个文件
    for (const langFile of langFiles) {
      // 获取语言代码
      const langCode = path.basename(langFile, '.json');
      const stats = compareTranslations(langFile, globalTranslations ? globalTranslations[`${langCode}-US`] : null);
      
      if (!languageStats[langCode]) {
        languageStats[langCode] = {
          empty: 0,
          hasGlobal: 0,
          missing: 0
        };
      }
      
      languageStats[langCode].empty += stats.empty;
      languageStats[langCode].hasGlobal += stats.hasGlobal;
      languageStats[langCode].missing += stats.missing;
    }
    
    // 打印总统计信息
    console.log('\n各语言统计信息:');
    for (const [lang, stats] of Object.entries(languageStats)) {
      console.log(`\n${lang}:`);
      console.log(`  空值翻译总数: ${stats.empty}`);
      console.log(`  可从全局补充: ${stats.hasGlobal}`);
      console.log(`  完全缺失: ${stats.missing}`);
    }
    
  } catch (error) {
    console.error('扫描翻译时出错:', error);
    process.exit(1);
  }
}

// 运行主函数
main();
