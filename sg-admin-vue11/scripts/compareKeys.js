const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 克隆 json-repo
function cloneJsonRepo() {
    console.log('\n=== 开始比较键 ===\n');
    const repoUrl = 'https://git.sh9h.com/sg-lang/json.git';
    const repoPath = path.join(__dirname, '../temp/json-repo');
    
    console.log('正克隆到', repoPath);
    execSync(`git clone ${repoUrl} ${repoPath}`);
    
    return repoPath;
}

// 从 global.json 读取键
function getGlobalKeys() {
    const globalPath = path.join(__dirname, '../temp/json-repo/frontend-admin/global.json');
    const globalContent = JSON.parse(fs.readFileSync(globalPath, 'utf8'));
    return Object.keys(globalContent);
}

// 从 langBack 目录读取键
function getLangBackKeys() {
    const langBackPath = path.join(__dirname, '../src/locales/langBack');
    const keys = new Set();
    
    // 递归遍历目录
    function traverseDir(dir, parentPath = '') {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // 如果是目录，递归遍历
                const newParentPath = parentPath ? `${parentPath}.${item}` : item;
                traverseDir(fullPath, newParentPath);
            } else if (item.endsWith('.json')) {
                // 如果是 json 文件，读取内容
                const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                
                // 根据文件路径构建键前缀
                const relativePath = path.relative(langBackPath, dir);
                const pathParts = relativePath.split(path.sep).filter(Boolean);
                
                // 递归遍历 json 对象
                function traverseObject(obj, keyPath = '') {
                    for (const key in obj) {
                        const value = obj[key];
                        const fullKey = keyPath ? `${keyPath}.${key}` : key;
                        
                        if (typeof value === 'object' && value !== null) {
                            traverseObject(value, fullKey);
                        } else {
                            // 构建完整的键路径
                            const fullKeyPath = pathParts.length > 0 
                                ? `${pathParts.join('.')}.${fullKey}`
                                : fullKey;
                            keys.add(fullKeyPath);
                        }
                    }
                }
                
                traverseObject(content);
            }
        }
    }
    
    traverseDir(langBackPath);
    return Array.from(keys);
}

// 主函数
function main() {
    try {
        // 克隆仓库
        cloneJsonRepo();
        
        // 获取键
        const globalKeys = getGlobalKeys();
        const langBackKeys = getLangBackKeys();
        
        console.log('Global.json 中的键数量:', globalKeys.length);
        console.log('LangBack 中的键数量:', langBackKeys.length);
        console.log('\n在 LangBack 中缺失的键:');
        
        // 比较键
        const missingKeys = globalKeys.filter(key => !langBackKeys.includes(key));
        missingKeys.forEach(key => console.log(key));
        
    } catch (error) {
        console.error('发生错误:', error);
    } finally {
        // 清理临时目录
        const repoPath = path.join(__dirname, '../temp/json-repo');
        if (fs.existsSync(repoPath)) {
            fs.rmSync(repoPath, { recursive: true, force: true });
        }
    }
}

main();
