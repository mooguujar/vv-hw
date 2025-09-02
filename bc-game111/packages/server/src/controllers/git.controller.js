const gitService = require('../services/git.service')
const fileService = require('../services/file.service')
const path = require("node:path");
const { exec } = require('node:child_process')
const {generateYmlFiles, generateYmlFileJson} = require("../utils/generate-yml");
const {getGoogleExcelData,options} = require("../utils/google");
const fs = require('node:fs');

async function initGitRepo(req, res) {
  if (gitService.langGitExist()) {
    res.success(`Git 已经存在 : ${gitService.getGitPath()}`)
  }
  else {
    try {
      await gitService.initLangGit()
      res.success('Git 初始化成功')
    }
    catch (err) {
      res.fail(`Git 初始化失败: ${err}`)
    }
  }
}

function getLangGitPathIsExist(req, res) {
  const pathList = gitService.getGitPath().split('/')
  res.success({
    path: gitService.getGitPath().split('/').map((item, index) => {
      if (index === pathList.length - 1) {
        return item
      }
      else {
        return item.split('').map(_it => _it).join('')
      }
    }).join('/'),
    exist: gitService.langGitExist(),
  })
}

async function getGitLangList(req, res) {
  const gitPath = gitService.getGitPath()
  const fileList = (await gitService.getDirList(gitPath)).filter(item => ['.git', 'scripts', '.idea'].indexOf(item) === -1)
  if (fileList.length === 0) {
    res.fail('请先初始化仓库')
  }
  else {
    res.success(fileList)
  }
}

async function getLangData(req, res) {
  const projectName = req?.query?.name
  const content = await fileService.readFile(`${gitService.getGitPath()}/${projectName}/global.json`)
  try {
    const json = JSON.parse(content)
    res.success(json)
  } catch (e) {
    console.log(' ❌ getLangData Error', e.message)
    res.fail(e)
  }
}

async function getGitLastCommit(req, res) {
  try {
    await gitService.tryGitPull()
    res.success("操作成功")
  } catch (error) {
    console.error('❌ getGitLastCommit 错误：', error.message)
    res.fail(error.message)
  }
}

async function updateAllLang(req, res) {
  const bodyObj = {
    ...req.body,
  }
  const username = req?.user?.username
  const projectName = bodyObj?.projectName

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  try {

    await gitService.tryGitPull()

    const allJsonData = JSON.parse(await fileService.readFile(`${gitService.getGitPath()}/${projectName}/global.json`))

    delete bodyObj.projectName

    Object.assign(allJsonData, bodyObj?.data || {})

    await fileService.writeFile(`${gitService.getGitPath()}/${projectName}/global.json`, JSON.stringify(allJsonData, null, 2))

    try {
      await gitService.tryGitPush({
        user: username
      })
      res.success("更新成功")
    } catch (error) {
      console.log("❌ updateLang Controller 失败", error.message)
      res.fail(error.message)
    }

  } catch (error) {
    console.log("❌ 编辑操作失败")
    res.fail(error.message)
  }
}

async function updateLang(req, res) {
  const bodyObj = {
    ...req.body,
  }

  const username = req?.user?.username

  const projectName = bodyObj?.projectName

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  try {
    await gitService.tryGitPull()

    const allJsonData = JSON.parse(await fileService.readFile(`${gitService.getGitPath()}/${projectName}/global.json`))
    const bodyKeys = bodyObj?.key
    delete bodyObj.key
    delete bodyObj.projectName
    allJsonData[bodyKeys] = bodyObj
    await fileService.writeFile(`${gitService.getGitPath()}/${projectName}/global.json`, JSON.stringify(allJsonData, null, 2))

    try {
      await gitService.tryGitPush({
        user: username
      })
      res.success("更新成功")
    } catch (error) {
      console.log("❌ updateLang Controller 失败", error.message)
      res.fail(error.message)
    }

  } catch (error) {
    console.log("❌ 编辑操作失败")
    res.fail(error.message)
  }
}


function convertLangArrayToObject(langArray) {
  const result = {}

  langArray.forEach(({ headName, data }) => {
    Object.entries(data).forEach(([key, value]) => {
      if (!result[key]) {
        result[key] = {}
      }
      result[key][headName] = value
    })
  })

  return result
}
async function addLang(req, res) {
  const bodyObj = {
    ...req.body,
  }

  const username = req?.user?.username

  console.log(bodyObj)

  const projectName = bodyObj?.projectName

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  try {
    await gitService.tryGitPull()

    const bodyObject = convertLangArrayToObject(bodyObj.data || [])
    const bodyObjectKeys = Object.keys(bodyObject)
    const allJsonData = JSON.parse(await fileService.readFile(`${gitService.getGitPath()}/${projectName}/global.json`))
    // 判断allJsonData是否存在了bodyObjectKeys中的key
    const repeatKeys = []
    for (const key of bodyObjectKeys) {
      if (allJsonData.hasOwnProperty(key)) {
        repeatKeys.push(key)
      }
    }
    const isExistKey = repeatKeys.length > 0
    if (isExistKey) {
      throw new Error(`key: ${repeatKeys.join(',')} 已存在`)
    }
    // 如果不存在就添加
    for (const key in bodyObject) {
      allJsonData[key] = bodyObject[key]
    }
    // 写入文件
    await fileService.writeFile(`${gitService.getGitPath()}/${projectName}/global.json`, JSON.stringify(allJsonData, null, 2))

    try {
      await gitService.gitAddCommit({
        user: username
      })
      await gitService.tryGitPush({
        user: username
      })
      res.success("更新成功")
    } catch (error) {
      console.log("❌ Push Controller 失败", error.message)
      res.fail(error.message)
    }
  } catch (error) {
    console.log("❌ 新增操作失败", error.message)
    res.fail(error.message)
  }
}

async function updateLocalFile(req, res) {
  const bodyObj = {
    ...req.body,
  }

  const projectName = bodyObj?.projectName

  const map = {
    queen: 'ph-h5',
    lottery: 'lottery-h5',
  }

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  if (!map[projectName]) {
    res.fail(`项目 ${projectName} 不存在`)
    return
  }

  try {
    const inputJsonPath = gitService.getGitPath() + '/' + projectName + '/global.json'
    const outputFolder = path.resolve(__dirname, `../../../${map[projectName]}/locales`)
    generateYmlFiles(inputJsonPath, outputFolder)
    res.success(`已经转换${projectName + '/global.json'} 到 ${map[projectName] + '/locales'}`)
  } catch (err) {
    console.log("🚀 ~ updateLocalFile ~ err: ", err);
    res.fail(err)
  }
}

async function synchronous(req, res) {
  const bodyObj = {
    ...req.body,
  }

  const projectName = bodyObj?.projectName

  const map = {
    queen: 'ph-h5',
    lottery: 'lottery-h5',
  }

  const sheetsMap = {
    queen: 0,
    lottery: 1,
  }

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  if (!map[projectName]) {
    res.fail(`项目 ${projectName} 不存在`)
    return
  }

  try {
    const outputFolder = path.resolve(__dirname, `../../../${map[projectName]}/locales`)
    const data = await getGoogleExcelData(Object.assign({}, options, {
      sheets: [sheetsMap[projectName]]
    }))

    for (const key in data) {
      fs.writeFileSync(outputFolder + `/${key}.json`, JSON.stringify(data[key], null, 2))
    }

    res.success("同步成功")
  } catch (err) {
      console.log("🚀 ~  synchronous ~ err: ", err);
    res.fail(err.message)
  }
}

/**
 * 检查当前 Git 仓库是否有未提交的更改
 * @returns {Promise<boolean>} true = 有未提交更改，false = 干净
 */
function hasUncommittedChanges() {
  return new Promise((resolve, reject) => {
    exec('git status --porcelain', (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      }
      // stdout 不为空说明有未提交的更改
      resolve(stdout.trim().length > 0)
    })
  })
}

/**
 * 获取当前分支
 * @return {string}
 */
async function getCurrentBranchHandle(req, res) {
  try {
    const branch = await gitService.getCurrentBranch()
    res.success(branch)
  } catch (err) {
    console.log("🚀 ~ getCurrentBranchHandle ~ err: ", err);
    res.fail(err.message)
  }
}

/**
 * 创建分支
 * @return {boolean}
 */
function createBranchHandle(branchName) {
  return new Promise((resolve, reject) => {
    exec(`git checkout -b ${branchName}`, (err, stdout, stderr) => {
      if (err) {
        return reject(err)
      }
      resolve(stdout.trim())
    })
  })
}

module.exports = {
  initGitRepo,
  getLangGitPathIsExist,
  getLangData,
  getGitLangList,
  getGitLastCommit,
  updateLang,
  addLang,
  updateAllLang,
  updateLocalFile,
  synchronous,
  hasUncommittedChanges,
  getCurrentBranchHandle,
  createBranchHandle
}
