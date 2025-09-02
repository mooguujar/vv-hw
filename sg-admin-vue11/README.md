## 多语言

## node版本
version: v18.20.7
  本项目运行需要使用node版本 v18.20.7 避免路由版本过高导致运行包错
### 1.工作流

[bbt 工具介绍](https://cloud.tencent.com/developer/article/2349936) [bbt github](https://github.com/wakeadmin/bbt-tools) 多语言收集 -> 发布到 google doce -> 翻译者线上编辑 -> 回写 **回写会提前清空文件夹，所以 locals/lang 文件只能存放多语言文件**

### 2.添加翻译语言


- 添加多语言文件因为多语言收集阶段以中文作为源语言，所以只要在 bbt.config.js 文件配置 langs 属性。例如新增[..., 'ja'],采集后 bbt.csv 文件会多出 ja 列，回写到多语言文件就可以实现添加翻译语言文件
- 配置多语言加载资源 langLoader 文件中，给 modulesObj 添加语言资源导属性
- 打包优化配置为了减少请求次数，将每种语言的所有资源打包为一个文件。配置文件位于 internal/vite-config/src/config/application.ts 在该文件配置 manualChunks

### 3.终端命令

- 采集 `npx ppt collect`
- 对 CSV 进行机器翻译 `npx bbt translate`
- 回写 `npx ppt write` 、、

### 4.在线文档

https://docs.google.com/spreadsheets/d/1YHRMa9bF48ozRLjxXhE_AUqoymxqcRrM1H2QuVdRJMA/edit#gid=657887977

### 5.自动更新语言文件

我们提供了一个便捷的命令来自动从 GitLab 仓库更新语言文件：

```bash
pnpm updateLanguage
```

这个命令会：
1. 自动从 GitLab 仓库 (https://git.sh9h.com/sg-lang/json) 拉取最新的语言配置
2. 将 `frontend-admin/global.json` 文件转换为本地化文件格式
3. 生成的文件将保存在 `src/locales/langBack` 目录下

注意事项：
- 执行此命令需要有 GitLab 仓库的访问权限
- 命令会自动处理临时文件的清理
- 支持的语言包括：
  - 简体中文 (zh_CN)
  - 英语 (en_US)
  - 韩语 (ko_KR)
  - 葡萄牙语 (pt_BR)
  - 泰语 (th_TH)
  - 越南语 (vi_VN)
  - 印地语 (hi_IN)
  - 日语 (ja_JP)
  - 印尼语 (in_ID)


