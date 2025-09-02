#!/bin/bash
set -e

# 获取分支名
argBranch=$1
userName=$2
# 获取当前分支名
branch=$(git symbolic-ref --short -q HEAD)

# 目标分支
targetBranch=$argBranch

if [ ! -n "$argBranch" ]
then
    echo "请输入分支名"
    exit 1
fi

echo "目标分支为：$targetBranch"

if [ -z "$(git branch --list $targetBranch)" ]
then
    echo "目标分支不存在"
    exit 1
fi

if [ -n "$(git status -s)" ]
then
    echo "本地有未提交的代码，请先提交代码"
    exit 1
fi

if [ $branch != $targetBranch ]
then
    git checkout $targetBranch
fi

# 桌面git仓库目录 marster-control -> web-admin
# localRepoDir="$HOME/Desktop/work/build-file/web-merchant"
if [ "$userName" = "vay" ]; then
  localRepoDir="/Volumes/Snipaste-2.10.4/sg/build-file/web-merchant"
else
echo "正常个人空间了"
  localRepoDir="$HOME/Desktop/work/build-file/web-merchant"
fi

git pull origin $targetBranch --no-rebase
echo "拉取最新代码 --先 推出"
echo "当前目录：$PWD"

pnpm build:prod

cd $localRepoDir

rm -rf *

# 当前目录
echo "当前目录：$PWD"

echo "开始拉取最新代码..."
git pull origin $targetBranch --no-rebase

cd -

# 将构建好的文件复制 localRepoDir
echo "开始复制文件..."
cp -r ./dist/* $localRepoDir

cd $localRepoDir
echo "当前目录：$PWD"
echo "开始提交代码..."
git add .

git commit -m "build: $(date '+%Y-%m-%d %H:%M:%S')"
echo "push origin--- $targetBranch"
git push origin $targetBranch
echo "提交完成"

# 将当前打包的分支 ｜ 分支名字 ｜ 时间 ｜ 打印出来
echo "当前打包的分支：$targetBranch"
echo "当前打包的分支名字：$targetBranch"
echo "当前打包的时间：$(date '+%Y-%m-%d %H:%M:%S')"


