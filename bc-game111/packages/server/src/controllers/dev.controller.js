const { spawn } = require('node:child_process')
const path = require('node:path')
const {
  getPortStatus,
  stopPort
} = require("../services/port.service");
const util = require("node:util");
const fs = require('node:fs')
const kill = require('tree-kill');
const { hasUncommittedChanges } = require("./git.controller")
const fsPromises = fs.promises;
const os = require('node:os');

const builds = new Map();

function getAllLocalIPs() {
  const interfaces = os.networkInterfaces()
  let result = ''

  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && name === 'en0') {
        result = iface.address
      }
    }
  }

  return result
}

async function setExecutable(path) {
  try {
    await fsPromises.chmod(path, 0o755)  // 给文件添加执行权限（rwxr-xr-x）
    console.log(`✅ 权限设置成功: ${path}`)
  } catch (err) {
    console.error(`❌ 设置权限失败: ${err.message}`)
  }
}

// 终止构建任务
function stopBuildTar(id) {
  return new Promise((resolve, reject) => {
    const info = builds.get(id);
    if (!info || !info.childProcess) return false;

    kill(info.childProcess.pid, 'SIGTERM', (err) => {
      if (err) {
        console.error('杀进程失败', err);
        reject(err);
      } else {
        console.log(`构建任务 ${id} 已被终止`);
        resolve(`构建任务 ${id} 已被终止`);
        builds.set(id, { childProcess: null, status: 'terminated' });
      }
    });
  })
}

// 查询构建状态
function isBuilding(id) {
  const info = builds.get(id);
  return info && info.status === 'running';
}

async function build(req, res) {
  const projectName = req?.body?.name

  if (isBuilding(projectName)) {
    res.fail(`构建任务 ${projectName} 已经在运行`)
    return
  }

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  if (await hasUncommittedChanges()) {
    res.fail('本地有未提交代码')
    return
  }

  const scriptPath = path.resolve(__dirname, '../../scripts/dev.sh')
  const projectDir = path.resolve(__dirname, `../../../${projectName}`)

  if (!fs.existsSync(scriptPath)) {
    res.fail("scriptPath 文件不存在")
    return
  }

  if (!fs.existsSync(projectDir)) {
    res.fail("projectDir 文件不存在")
    return
  }

  await setExecutable(scriptPath)

  // 启动子进程
  const child = spawn(scriptPath, [projectDir, projectName], {
    stdio: 'inherit',     // 继承父进程的输出（控制台同步输出）
    shell: true,           // 使用 shell 执行
    detached: true,
  })

  builds.set(projectName, { childProcess: child, status: 'running' });

  child.on('exit', (code) => {
    builds.set(projectName, { childProcess: null, status: `exited with code ${code}` });
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Shell 执行成功')
      res.success("构建完成")
    } else {
      res.fail(`❌ Shell 执行失败，退出码: ${code}`)
    }
  })
}

async function stopBuild(req, res) {
  const projectName = req?.body?.name

  if (!projectName) {
    res.fail('请传入项目名称')
    return
  }

  try {
    const buildStatus = isBuilding(projectName)
    if (!buildStatus) {
      res.fail(`${projectName} 已经是停止状态`)
      return
    }

    await stopBuildTar(projectName)

    res.success("成功停止")
  } catch (error) {
    console.log('stopBuild error', error.message)
    res.fail(error.message)
  }
}


async function startDev(req, res) {
  const { key, port } = req.body

  if (!key) {
    res.fail('请传入key')
    return
  }

  const pidFile = `/tmp/dev-${port || 3000}.pid`
  if (fs.existsSync(pidFile)) {
    fs.unlinkSync(pidFile)
  }


  try {
    const projectDir = path.resolve(__dirname, `../../../${key}`)
    const pidFile = `/tmp/dev-${port || 3000}.pid`

    // 如果已有进程，拒绝启动
    if (fs.existsSync(pidFile)) {
      res.fail(`端口 ${port || 3000} 已经有进程在运行`)
      return
    }

    const cmd = key === 'components/.docs' ? 'docs:dev' : 'dev --host'

    const child = spawn('pnpm', ['run', cmd], {
      cwd: projectDir,
      detached: true,                                   // 独立运行
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env, PORT: port || 3000,
        NODE_OPTIONS: '--max-old-space-size=8192',
      },
    })

    // 保存 pid
    fs.writeFileSync(pidFile, String(child.pid))
    child.unref() // 解除父子进程引用

    await util.promisify(setTimeout)(2000)
    res.success(`项目已启动，PID: ${child.pid}`)
  } catch (error) {
    console.error('startDev error', error.message)
    res.fail(error.message)
  }
}


async function stopDev(req, res) {
  const { port } = req.body

  if (!port) {
    res.fail('请传入端口(port)')
    return
  }

  try {
    const pidFile = `/tmp/dev-${port}.pid`

    if (!fs.existsSync(pidFile)) {
      res.fail(`未找到端口 ${port} 对应的进程记录`)
      return
    }

    const pid = parseInt(fs.readFileSync(pidFile, 'utf8'), 10)
    if (!pid) {
      res.fail('PID 无效')
      return
    }

    process.kill(pid, 'SIGTERM')
    fs.unlinkSync(pidFile)

    await util.promisify(setTimeout)(1000)
    res.success(`已关闭端口 ${port} 的进程 (PID: ${pid})`)
  } catch (error) {
    console.error('stopDev error', error.message)
    res.fail(error.message)
  }
}


async function getProjectStatus(req, res) {
  const projectMap = [
    {
      name: '菲律宾 H5',
      key: 'ph-h5',
      desc: '菲律宾项目前端 H5',
      url: 'http://localhost:3333',
      port: 3333,
      isOpen: false,
      disabled: false,
      projectName: 'ph-h5',
      building: isBuilding('ph-h5'),
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: '彩票 H5',
      key: 'lottery-h5',
      desc: '彩票项目前端 H5 页面',
      url: 'http://localhost:4444',
      port: 4444,
      isOpen: false,
      projectName: 'lottery-h5',
      building: isBuilding('lottery-h5'),
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: '体育 Stake',
      key: 'sports-stake',
      desc: '体育项目 Stake 前端',
      url: '',
      isOpen: false,
      disabled: true,
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: '组件库',
      key: 'components/.docs',
      desc: '公司前端组件库项目',
      url: 'http://localhost:5173',
      port: 5173,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: 'Icons',
      key: 'icons-preview',
      desc: '公司前端所有 Icons',
      url: 'http://localhost:5555',
      port: 5555,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
    {
      name: 'Google Play',
      key: 'google-play',
      desc: '仿Google App下载页面',
      url: 'http://localhost:1748',
      port: 1748,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
     {
      name: 'Landing Page',
      key: 'landing-page',
      desc: '落地页',
      url: 'http://localhost:9583',
      port: 9583,
      isOpen: false,
      disabled: false,
      areaNetworkIp: getAllLocalIPs(),
    },
  ]
  for (let i = 0; i < projectMap.length; i++) {
    if (projectMap[i].port) {
      const val = await getPortStatus(projectMap[i].port)
      projectMap[i].isOpen = val.isOpen
    }
  }

  res.success(projectMap)
}

module.exports = {
  startDev,
  stopDev,
  build,
  stopBuild,
  getProjectStatus
}
