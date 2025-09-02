import { Card, Button, Space, Typography, Popover } from 'antd'
import { RocketOutlined, LinkOutlined } from '@ant-design/icons'
import {devBuild, getDev, startDev, stoptDev, devStopBuild} from '@/services/api.js'
import {useEffect, useState} from "react";
import { QRCode } from 'react-qrcode-logo';

const { Link } = Typography

export default function LaunchPanel() {
  const [projectList, setProjectList] = useState([])

  const devBuildHandle = async (name, projectKey) => {
    try {
      setProjectList(projectList.map(item => {
        if (item.key === projectKey) {
          item.buildLoading = true
        }
        return item
      }))

      setTimeout(() => {
        init()
      }, 2000)
      await devBuild({
        name
      })

      await init()
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  const devStopBuildHandle = async (name, projectKey) => {
    try {
      setProjectList(projectList.map(item => {
        if (item.key === projectKey) {
          item.buildLoading = true
        }
        return item
      }))

      await devStopBuild({
        name
      })

      await init()
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  const handleStart = async (projectKey, port) => {
    try {
      setProjectList(projectList.map(item => {
        if (item.key === projectKey) {
          item.loading = true
        }
        return item
      }))

      await startDev({
        key: projectKey,
        port: port
      })

      await init()
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  const handleStop = async (port, projectKey) => {
    try {

      setProjectList(projectList.map(item => {
        if (item.key === projectKey) {
          item.loading = true
        }
        return item
      }))

      await stoptDev({
        port
      })

      await init()
    } catch (e) {
      console.log(e)
    } finally {

    }
  }

  const init = async () => {
    const [res, error] = await getDev()
    if (!error) {
      setProjectList((res || []).map(item => {
        return {
          ...item,
          loading: false,
        }
      }))
    }
  }

  const handleVisit = (url) => {
    window.open(url, '_blank')
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <>
      <div className="bg-gradient-to-r from-amber-400 to-yellow-600 from-green-400 to-lime-500 from-sky-400 to-blue-600 from-purple-500 to-fuchsia-600" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectList.map((project, idx) => {
          // 定义不同的渐变主题
          const gradients = [
            "bg-gradient-to-r from-amber-400 to-yellow-600 text-gray-900",  // 亮黄 → 深字
            "bg-gradient-to-r from-green-400 to-lime-500 text-gray-900",   // 亮绿 → 深字
            "bg-gradient-to-r from-sky-400 to-blue-600 text-white",        // 蓝系 → 白字
            "bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white",  // 紫粉 → 白字
            "bg-gradient-to-r from-cyan-400 to-blue-500 text-white",       // 青蓝 → 白字
            "bg-gradient-to-r from-red-500 to-pink-600 text-white"         // 红粉 → 白字
          ];
          const gradientClass = gradients[idx % gradients.length];

          return <Card
            key={project.key}
            className="rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            bodyStyle={{ padding: 0 }}
          >
            <div className={`p-6 text-white rounded-t-2xl ${gradientClass}`}>
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-sm mt-1">{project.desc}</p>
            </div>
            <div className="p-4 flex justify-end items-center">
              <Space>
                {
                  project.isOpen && (
                    <Popover
                      content={
                        <div className="aspect-square bg-red-400 max-w-[200px]">
                          <QRCode
                            value={`http://${project.areaNetworkIp}:${project.port}`}
                            style={{
                              width: "100%",
                              height: "100%"
                            }}
                          />
                        </div>
                      }
                      title={`http://${project.areaNetworkIp}:${project.port}`}
                      trigger="hover"
                    >
                      <Link href={project.url} target="_blank">
                        <Button
                          icon={<LinkOutlined />}
                          type="link"
                        >
                          访问
                        </Button>
                      </Link>
                    </Popover>
                  )
                }
                {
                  project.building && <Button
                    disabled={project.disabled}
                    danger
                    type="primary"
                    onClick={() => {
                      devStopBuildHandle(project.projectName, project.key)
                    }}
                  >
                    停止
                  </Button>
                }
                {
                  (!!project.projectName && project.building !== true) && <Button
                    disabled={project.disabled}
                    danger={project.isOpen}
                    type="primary"
                    loading={project.buildLoading}
                    onClick={() => {
                      devBuildHandle(project.projectName, project.key)
                    }}
                  >
                    更新
                  </Button>
                }
                <Button
                  icon={<RocketOutlined />}
                  disabled={project.disabled}
                  danger={project.isOpen}
                  type="primary"
                  loading={project.loading}
                  onClick={() => {
                    if (project.isOpen) {
                      handleStop(project.port, project.key)
                    } else {
                      handleStart(project.key, project.port)
                    }
                  }}
                >
                  {
                    project.isOpen ? '停止' : '启动'
                  }
                </Button>
              </Space>
            </div>
          </Card>
        })}
      </div>
    </>
  )
}

