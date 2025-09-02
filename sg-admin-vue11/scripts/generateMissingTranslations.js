const fs = require('fs');
const path = require('path');

// 读取文件
function readJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}

// 获取所有key
function getAllKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getAllKeys(obj[key], newPrefix));
        } else {
            keys.push(newPrefix);
        }
    }
    return keys;
}

// 根据key获取值
function getValueByKey(obj, key) {
    const parts = key.split('.');
    let current = obj;
    for (const part of parts) {
        if (current && typeof current === 'object') {
            current = current[part];
        } else {
            return undefined;
        }
    }
    return current;
}

// 检查key是否存在于global文件中
function checkKeysInGlobal(keys, globalJson, filePath) {
    const missingKeys = [];
    const pathParts = filePath.split('/');
    const moduleIndex = pathParts.indexOf('routes');
    const moduleName = moduleIndex >= 0 && moduleIndex + 1 < pathParts.length ? pathParts[moduleIndex + 1] : '';

    for (const key of keys) {
        // 构建可能的key格式，同时检查点格式和斜杠格式
        const keyWithDot = key.replace(/\//g, '.');
        const keyWithSlash = key.replace(/\./g, '/');
        
        const possibleKeys = [
            // 从路径构建的模块翻译（点格式和斜杠格式）
            moduleName && `routes.${moduleName}.${keyWithDot}`,
            moduleName && `routes/${moduleName}/${keyWithSlash}`,
            moduleName && `table.${moduleName}.${keyWithDot}`,
            moduleName && `table/${moduleName}/${keyWithSlash}`,
            moduleName && `v.${moduleName}.${keyWithDot}`,
            moduleName && `v/${moduleName}/${keyWithSlash}`,
            moduleName && `business.${moduleName}.${keyWithDot}`,
            moduleName && `business/${moduleName}/${keyWithSlash}`,
            moduleName && `modalForm.modalForm.${moduleName}.${keyWithDot}`,
            moduleName && `modalForm/modalForm/${moduleName}/${keyWithSlash}`,
            // 业务模块翻译
            `business.business.${keyWithDot}`,
            `business/business/${keyWithSlash}`,
            `business.table.${keyWithDot}`,
            `business/table/${keyWithSlash}`,
            `business.${keyWithDot}`,
            `business/${keyWithSlash}`,
            // 通用模块翻译
            `common.common.${keyWithDot}`,
            `common/common/${keyWithSlash}`,
            `common.table.${keyWithDot}`,
            `common/table/${keyWithSlash}`,
            `common.${keyWithDot}`,
            `common/${keyWithSlash}`,
            // 组件模块翻译
            `component.component.${keyWithDot}`,
            `component/component/${keyWithSlash}`,
            `component.table.${keyWithDot}`,
            `component/table/${keyWithSlash}`,
            `component.${keyWithDot}`,
            `component/${keyWithSlash}`,
            // 布局模块翻译
            `layout.layout.${keyWithDot}`,
            `layout/layout/${keyWithSlash}`,
            `layout.table.${keyWithDot}`,
            `layout/table/${keyWithSlash}`,
            `layout.${keyWithDot}`,
            `layout/${keyWithSlash}`,
            // 表格相关翻译
            `table.${keyWithDot}`,
            `table/${keyWithSlash}`,
            // 视图相关翻译
            `v.${keyWithDot}`,
            `v/${keyWithSlash}`,
            // 直接匹配
            keyWithDot,
            keyWithSlash
        ].filter(Boolean); // 移除空值

        let found = false;
        for (const possibleKey of possibleKeys) {
            if (globalJson[possibleKey] && Object.keys(globalJson[possibleKey]).length > 0) {
                found = true;
                break;
            }
        }

        if (!found) {
            missingKeys.push(key);
        }
    }

    return missingKeys;
}

// 生成补充翻译内容
function generateSupplementaryTranslations(missingKeys, enJson, zhJson, filePath) {
    const supplementaryTranslations = {};
    const pathParts = filePath.split('/');
    const moduleIndex = pathParts.indexOf('routes');
    const moduleName = moduleIndex >= 0 && moduleIndex + 1 < pathParts.length ? pathParts[moduleIndex + 1] : '';

    for (const key of missingKeys) {
        const enValue = getValueByKey(enJson, key) || '';
        const zhValue = getValueByKey(zhJson, key) || '';

        // 确定最合适的key前缀，使用斜杠格式
        let globalKey;
        if (key.startsWith('business.')) {
            globalKey = `business/business/${key.substring(9)}`;
        } else if (key.startsWith('layout.')) {
            globalKey = key.replace(/\./g, '/');
        } else if (key.startsWith('modalForm.')) {
            globalKey = key.replace(/\./g, '/');
        } else if (key.startsWith('routes.')) {
            globalKey = key.replace(/\./g, '/');
        } else if (key.startsWith('table.')) {
            globalKey = key.replace(/\./g, '/');
        } else if (key.startsWith('v.')) {
            globalKey = key.replace(/\./g, '/');
        } else if (moduleName) {
            globalKey = `routes/${moduleName}/${key}`;
        } else {
            globalKey = `business/business/${key}`;
        }

        supplementaryTranslations[globalKey] = {
            "en-US": enValue,
            "ko-KR": "",
            "pt-BR": "",
            "th-TH": "",
            "vi-VN": "",
            "zh-CN": zhValue,
            "hi-IN": "",
            "ja-JP": "",
            "in-ID": ""
        };
    }

    return supplementaryTranslations;
}

// 主函数
function main() {
    const enJsonPath = path.join(__dirname, '../src/locales/langBack/routes/discountActivity/en.json');
    const zhJsonPath = path.join(__dirname, '../src/locales/langBack/routes/discountActivity/zh.json');
    const globalJsonPath = path.join(__dirname, '../temp/json-repo/frontend-admin/global.json');
    const outputPath = path.join(__dirname, '../temp/supplementary_translations.json');

    console.log('正在生成补充翻译...');

    const enJson = readJsonFile(enJsonPath);
    const zhJson = readJsonFile(zhJsonPath);
    const globalJson = readJsonFile(globalJsonPath);

    if (!enJson || !zhJson || !globalJson) {
        console.error('无法读取必要的文件');
        return;
    }

    const keys = getAllKeys(enJson);
    const missingKeys = checkKeysInGlobal(keys, globalJson, enJsonPath);
    const supplementaryTranslations = generateSupplementaryTranslations(missingKeys, enJson, zhJson, enJsonPath);

    // 写入补充翻译文件
    fs.writeFileSync(outputPath, JSON.stringify(supplementaryTranslations, null, 2), 'utf8');

    console.log(`\n找到 ${missingKeys.length} 个缺失的翻译`);
    console.log(`补充翻译已生成到: ${outputPath}`);
    console.log('\n使用说明:');
    console.log('1. 检查生成的文件内容是否正确');
    console.log('2. 将内容复制到 global.json 文件中');
    console.log('3. 提交更新后的 global.json 到仓库');
    console.log('4. 重新运行 jsonToLang.js 更新本地翻译文件');
}

main();
