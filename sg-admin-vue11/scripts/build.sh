#!/bin/bash
set -e
set -x

# 获取分支名
argBranch=$1
env=$2

if [ ! -n "$argBranch" ]
then
    echo "请输入分支名"
    exit 1
fi

echo "目标分支为：$argBranch"


# 目标分支
targetBranch=$argBranch
# 获取当前分支名
branch=$(git symbolic-ref --short -q HEAD)
# 服务器ip
serverIp="18.163.143.231"
# fat 服务器ip
fatServerIp="43.198.40.130"
# 服务器用户名
serverUser="rocky"
# 服务器地址 master:/home/rocky/sg/html/merchant master-control:/home/rocky/sg/html/zk

# 根据 targetBranch 设置不同的服务器配置
if [[ $targetBranch == "master-insurance" ]]; then
  serverIp="43.199.150.206"
  serverUser="rocky"
else
  serverIp="18.163.143.231"
  serverUser="rocky"
fi

echo "使用服务器 IP: $serverIp"

if [ -n "$(git status -s)" ]
then
    echo "本地有未提交的代码，请先提交代码"
    exit 1
fi

if [ -z "$(git branch --list $targetBranch)" ]
then
    echo "目标分支不存在"
    exit 1
fi

if [ $branch != $targetBranch ]
then
    git checkout $targetBranch
fi


git pull origin $targetBranch --no-rebase


if [ ! -n "$env" ]
then
    env="test"
fi

if [ $env != "test" ] && [ $env != "prod" ]
then
    echo "环境参数错误，请重新输入 [test, prod]"
    read env
fi

echo "当前环境为：$env"
echo "开始构建..."
if [ $env == "test" ]
then
    pnpm build:test
else
    pnpm build:prod
fi
echo "构建完成"



echo "开始上传..."
# 如果是master分支，上传到merchant目录，如果是master-control分支，上传到zk目录
serverDir=""
if [ "$targetBranch" == "dev" ]; then
    serverDir="merchant"
elif [ "$targetBranch" == "dev-control" ]; then
    serverDir="zk" 
elif [ "$targetBranch" == "master-app" ]; then
    serverDir="app"
elif [ "$targetBranch" == "master-insurance" ]; then
    serverDir="insurance"          
else
    serverDir="merchant"
fi

echo "开始删除服务器文件..."
ssh $serverUser@$serverIp "rm -rf /home/rocky/sg/html/${serverDir}/*"
echo "删除完成"

rsync -avz ./dist/* $serverUser@$serverIp:/home/rocky/sg/html/${serverDir}
# rsync -avz ./dist/* $serverUser@$fatServerIp:/home/rocky/sg/html/${serverDir}
echo "上传完成"