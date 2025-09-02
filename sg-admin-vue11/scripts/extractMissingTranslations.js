const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 克隆仓库
function cloneRepo() {
  const repoUrl = 'http://git.sportsgift.local/sg-frontend/sg-admin-vue-i18n.git';
  const repoPath = path.join(__dirname, '../temp/json-repo');
  
  try {
    if (fs.existsSync(repoPath)) {
      console.log('仓库已存在，正在更新...');
      execSync('git pull', { cwd: repoPath });
    } else {
      console.log('正在克隆仓库...');
      execSync(`git clone ${repoUrl} ${repoPath}`);
    }
  } catch (error) {
    console.error('克隆或更新仓库失败:', error);
  }
}

// 读取全局翻译文件
function readGlobalTranslations() {
  const globalPath = path.join(__dirname, '../temp/json-repo/frontend-admin/global.json');
  try {
    const content = fs.readFileSync(globalPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('读取全局翻译文件失败:', error);
    return {};
  }
}

// 读取英文翻译文件
function readEnglishTranslations() {
  const englishFiles = [
    '../src/locales/lang/business/en.json',
    '../src/locales/lang/view/system/site/en.json'
  ];
  
  let allTranslations = {};
  
  englishFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(content);
        allTranslations = { ...allTranslations, ...translations };
      }
    } catch (error) {
      console.error(`读取文件 ${file} 失败:`, error);
    }
  });
  
  return allTranslations;
}

// 扁平化翻译对象
function flattenTranslations(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return { ...acc, ...flattenTranslations(obj[key], newKey) };
    }
    return { ...acc, [newKey]: obj[key] };
  }, {});
}

// 提取缺失的翻译
function extractMissingTranslations() {
  const globalTranslations = flattenTranslations(readGlobalTranslations());
  const englishTranslations = flattenTranslations(readEnglishTranslations());
  
  const missingTranslations = {};
  
  for (const [key, value] of Object.entries(englishTranslations)) {
    // 如果全局翻译中没有这个键，或者值为空
    if (!globalTranslations[key] && value) {
      missingTranslations[key] = value;
    }
  }
  
  return missingTranslations;
}

// 保存缺失的翻译
function saveMissingTranslations(translations) {
  const outputPath = path.join(__dirname, '../src/locales/lang/missing-translations.json');
  try {
    fs.writeFileSync(outputPath, JSON.stringify(translations, null, 2), 'utf8');
    console.log(`已保存 ${Object.keys(translations).length} 个缺失的翻译到:`, outputPath);
  } catch (error) {
    console.error('保存缺失翻译失败:', error);
  }
}

// 主函数
function main() {
  console.log('开始提取缺失的翻译...');
  cloneRepo();
  const missingTranslations = extractMissingTranslations();
  saveMissingTranslations(missingTranslations);
  console.log('完成！');
}

main();
