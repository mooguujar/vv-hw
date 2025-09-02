const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 常量定义
const OUTPUT_DIR = path.join(__dirname, "../src/locales/langBack");
const ORIGINAL_DIR = path.join(__dirname, "../src/locales/lang");
const LANG_MAPPING = {
  en: "en-US",
  zh: "zh-CN",
  ko: "ko-KR",
  vi: "vi-VN",
  th: "th-TH",
  pt: "pt-BR",
  hi: "hi-IN",
  ja: "ja-JP",
  in: "in-ID",
};

// 从GitLab拉取JSON文件
function fetchJsonFromGitlab() {
  const repoPath = path.join(__dirname, "../temp/json-repo");
  if (fs.existsSync(repoPath)) {
    execSync(`rm -rf ${repoPath}`);
  }
  console.log("正在克隆仓库...");
  execSync(`git clone https://git.sh9h.com/sg-lang/json.git ${repoPath}`, {
    stdio: "inherit",
  });

  const jsonPath = path.join(repoPath, "frontend-admin/global.json");
  return JSON.parse(fs.readFileSync(jsonPath, "utf8"));
}

// 获取所有支持的语言代码
function getAllLanguages() {
  console.log("获取所有支持的语言...");
  const languages = [];
  const files = fs.readdirSync(path.join(ORIGINAL_DIR, "routes/member"));

  for (const file of files) {
    if (file.endsWith(".json")) {
      const lang = file.replace(".json", "");
      languages.push(lang);
    }
  }

  console.log("支持的语言:", languages);
  return languages;
}

// 读取目录结构
function readDirectoryStructure() {
  console.log("读取目录结构...");
  const directories = [];

  function scanDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        const hasJsonFiles = fs
          .readdirSync(fullPath)
          .some((file) => file.endsWith(".json"));
        if (hasJsonFiles) {
          directories.push(path.relative(ORIGINAL_DIR, fullPath));
        }
        scanDir(fullPath);
      }
    }
  }

  scanDir(ORIGINAL_DIR);
  console.log("找到的目录数量:", directories.length);
  return directories;
}

// 将新的翻译内容填充到原始结构中
function fillStructureWithTranslations(structure, globalJson, targetPath) {
  const langCode = path.basename(targetPath, ".json");
  const langMapping = LANG_MAPPING[langCode];

  // 获取相对路径作为前缀
  const relativePath = path
    .relative(
      path.join(__dirname, "../src/locales/langBack"),
      path.dirname(targetPath)
    )
    .replace(/\\/g, "/");

  function processObject(obj, currentPath = "", parentKeys = []) {
    for (const key in obj) {
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        // 如果是对象，递归处理
        const newParentKeys = [...parentKeys, key];
        processObject(value, key, newParentKeys);
      } else if (typeof value === "string") {
        // 构建可能的翻译键
        const possibleKeys = new Set();

        // 1. 使用完整的父级路径构建键
        if (parentKeys.length > 0) {
          const fullPath = [...parentKeys, key].join(".");
          // 直接使用完整路径
          possibleKeys.add(fullPath);

          // 使用相对路径
          possibleKeys.add(`${relativePath}.${fullPath}`);

          // 使用斜杠分隔的路径
          possibleKeys.add(fullPath.replace(/\./g, "/"));
          possibleKeys.add(`${relativePath}/${fullPath}`.replace(/\./g, "/"));

          // 使用原始路径
          possibleKeys.add(`${relativePath}.${currentPath}.${key}`);
          possibleKeys.add(
            `${relativePath}/${currentPath}/${key}`.replace(/\./g, "/")
          );

          // 特殊处理：modalForm 前缀
          if (relativePath === "modalForm") {
            possibleKeys.add(`modalForm.${fullPath}`);
            possibleKeys.add(`modalForm/${fullPath}`.replace(/\./g, "/"));
          }
        } else {
          // 2. 使用当前路径构建键
          possibleKeys.add(`${relativePath}.${currentPath}.${key}`);
          possibleKeys.add(
            `${relativePath}/${currentPath}/${key}`.replace(/\./g, "/")
          );
          possibleKeys.add(`${currentPath}.${key}`);
          possibleKeys.add(`${currentPath}/${key}`.replace(/\./g, "/"));

          // 特殊处理：modalForm 前缀
          if (relativePath === "modalForm") {
            possibleKeys.add(`modalForm.${currentPath}.${key}`);
            possibleKeys.add(
              `modalForm/${currentPath}/${key}`.replace(/\./g, "/")
            );
          }
        }

        // 遍历所有可能的键
        for (const globalKey of possibleKeys) {
          if (globalJson[globalKey] && globalJson[globalKey][langMapping]) {
            obj[key] = globalJson[globalKey][langMapping];
            break;
          }
        }
      }
    }
  }

  processObject(structure);
  return structure;
}

// 确保目录存在
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 处理目录
function processDirectory(dirPath, languages, globalJson) {
  // 读取中文文件作为基准
  const zhFilePath = path.join(ORIGINAL_DIR, dirPath, "zh.json");
  const zhContent = JSON.parse(fs.readFileSync(zhFilePath, "utf8"));

  // 处理每种语言
  for (const lang of languages) {
    if (lang === "zh") continue;

    // 构建目标文件路径
    const targetDir = path.join(OUTPUT_DIR, dirPath);
    const targetPath = path.join(targetDir, `${lang}.json`);
    // 读取原始文件
    const sourcePath = path.join(ORIGINAL_DIR, dirPath, `${lang}.json`);
    let sourceContent;
    try {
      sourceContent = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
    } catch (error) {
      // 如果文件不存在，使用空对象
      sourceContent = {};
    }

    // 确保所有中文键都存在
    function ensureKeys(zhObj, targetObj, path = "") {
      for (const key in zhObj) {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof zhObj[key] === "object" && zhObj[key] !== null) {
          targetObj[key] = targetObj[key] || {};
          ensureKeys(zhObj[key], targetObj[key], currentPath);
        } else if (!(key in targetObj)) {
          targetObj[key] = zhObj[key];
        }
      }
    }

    // 先确保所有键存在
    ensureKeys(zhContent, sourceContent);

    // 填充翻译
    const updatedContent = fillStructureWithTranslations(
      sourceContent,
      globalJson,
      targetPath
    );

    // 确保目标目录存在并写入文件
    ensureDirectoryExists(targetDir);
    fs.writeFileSync(targetPath, JSON.stringify(updatedContent, null, 2));
  }
}

// 主函数
async function main() {
  try {
    // 获取所有支持的语言
    const languages = getAllLanguages();

    // 读取目录结构
    const directories = readDirectoryStructure();

    // 获取新的翻译内容
    console.log("获取新的翻译内容...");
    console.log("正在克隆仓库...");
    const globalJson = fetchJsonFromGitlab();

    // 处理每个目录
    for (const dir of directories) {
      processDirectory(dir, languages, globalJson);
    }

    console.log("成功生成语言文件！");
  } catch (error) {
    console.error("发生错误:", error);
    process.exit(1);
  }
}

main();
