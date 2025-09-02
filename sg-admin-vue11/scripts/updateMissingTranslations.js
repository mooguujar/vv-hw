const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 从 global.json 读取翻译
function readGlobalTranslations() {
  const globalPath = path.join(
    __dirname,
    "../temp/json-repo/frontend-admin/global.json"
  );
  return JSON.parse(fs.readFileSync(globalPath, "utf8"));
}

// 获取语言代码
function getLangCode(shortLang) {
  const mapping = {
    en: "en-US",
    ko: "ko-KR",
    pt: "pt-BR",
    th: "th-TH",
    vi: "vi-VN",
    zh: "zh-CN",
    hi: "hi-IN",
    ja: "ja-JP",
    in: "in-ID",
  };
  return mapping[shortLang] || shortLang;
}

// 清理翻译值
function cleanTranslationValue(value) {
  if (typeof value !== "string") return value;
  // 移除多余的转义字符
  return value.replace(/\\"/g, '"');
}

// 检查是否包含中文字符
function containsChinese(str) {
  return /[\u4E00-\u9FFF]/.test(str);
}

// 统计翻译缺失情况
function analyzeMissingTranslations(translations, langCode) {
  let total = 0;
  let missing = 0;

  for (const [key, value] of Object.entries(translations)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      total++;
      if (!value[langCode] || value[langCode] === "") {
        missing++;
      }
    }
  }

  return { total, missing };
}

// 获取翻译值
function getTranslationValue(value, langCode) {
  if (typeof value === "object" && !Array.isArray(value)) {
    // 获取当前语言的翻译
    let translation = value[langCode];

    // 如果没有找到指定语言的翻译
    if (!translation) {
      if (langCode === "en-US") {
        // 对于英文，优先使用不含中文的翻译
        const availableTranslations = Object.entries(value).filter(
          ([code, text]) =>
            text &&
            typeof text === "string" &&
            !containsChinese(text) &&
            code !== "zh-CN"
        );
        if (availableTranslations.length > 0) {
          translation = availableTranslations[0][1];
        }
      } else if (langCode === "zh-CN") {
        // 对于中文，优先使用中文翻译
        translation = value["zh-CN"] || value["zh"];
      }
    }

    // 如果没有找到翻译，返回空字符串
    return translation ? cleanTranslationValue(translation) : "";
  }
  return cleanTranslationValue(value);
}

// 根据键路径设置值
function setValueByPath(obj, path, value) {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current)) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
}

// 更新翻译文件
function updateTranslationFile(filePath, translations, lang) {
  // 创建一个全新的对象
  const content = {};
  const langCode = getLangCode(lang);

  // 统计翻译缺失情况
  // const stats = analyzeMissingTranslations(translations, langCode);
  // console.log(
  //   `[${lang}] 总翻译数: ${stats.total}, 缺失翻译数: ${stats.missing}, 缺失率: ${(
  //     (stats.missing / stats.total) *
  //     100
  //   ).toFixed(2)}%`,
  // );

  // 遍历翻译并设置值
  for (const [key, value] of Object.entries(translations)) {
    const translation = getTranslationValue(value, langCode);
    // 总是设置键，即使翻译为空
    setValueByPath(content, key, translation);
  }

  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  // 调试日志切勿打开
}

// 递归处理目录
function processDirectory(basePath, relativePath, globalTranslations) {
  const currentPath = path.join(basePath, relativePath);
  const items = fs.readdirSync(currentPath);
  let hasSubDirs = false;

  // 检查是否有子目录
  for (const item of items) {
    const itemPath = path.join(currentPath, item);
    if (fs.statSync(itemPath).isDirectory()) {
      hasSubDirs = true;
      // 递归处理子目录
      processDirectory(
        basePath,
        path.join(relativePath, item),
        globalTranslations
      );
    }
  }

  // 只在没有子目录的情况下处理语言文件
  if (!hasSubDirs) {
    const languages = ["en", "ko", "pt", "th", "vi", "zh", "hi", "ja", "in"];
    for (const lang of languages) {
      const filePath = path.join(currentPath, `${lang}.json`);

      // 找出该模块的所有翻译
      const moduleTranslations = {};
      const moduleKey = relativePath.replace(/\\/g, "/"); // 统一使用正斜杠

      for (const [key, value] of Object.entries(globalTranslations)) {
        // 检查是否匹配当前模块路径
        if (
          key.startsWith(`${moduleKey}.`) ||
          key.startsWith(`${moduleKey}/`)
        ) {
          const strippedKey = key
            .substring(moduleKey.length + 1)
            .replace(/\//g, ".");
          moduleTranslations[strippedKey] = value;
        }
      }

      // 如果有翻译，更新文件
      if (Object.keys(moduleTranslations).length > 0) {
        updateTranslationFile(filePath, moduleTranslations, lang);
      }
    }
  }
}

// 主函数
function main() {
  console.log("开始更新翻译...");

  // 读取 global.json
  const globalTranslations = readGlobalTranslations();

  // 遍历所有语言文件
  const langBackPath = path.join(__dirname, "../src/locales/langBack");
  processDirectory(langBackPath, "", globalTranslations);
  setTimeout(() => {
    const repoPath = path.join(__dirname, "../temp/json-repo");
    if (fs.existsSync(repoPath)) {
      execSync(`rm -rf ${repoPath}`);
      console.log("temp/json-repo 已经清理！");
    }
    console.log("更新翻译完成✅1");
  }, 100);
}

// 删除清理 temp/json-repo 目录
const repoPath = path.join(__dirname, "../temp/json-repo");
if (fs.existsSync(repoPath)) {
  // execSync(`rm -rf ${repoPath}`);
  console.log("temp/json-repo 暂不清理");
}

main();
