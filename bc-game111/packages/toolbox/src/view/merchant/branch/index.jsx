import React, {useEffect, useState} from "react"
import { Form, Input, Select, Button, Card, message, } from "antd"
import {getCurrentBranch, getDev} from "@/services/api.js";

const { Option } = Select

export default function BranchForm() {
  const [form] = Form.useForm();
  const [branchType, setBranchType] = useState(null)
  const [projectList, setProjectList] = useState([])
  const currentUser = localStorage.getItem("username") // 替换成当前登录用户

  const getPlaceholder = () => {
    switch (branchType) {
      case "feature":
        return "请输入新功能描述"
      case "jira":
        return "请输入JIRA单号"
      case "test":
        return "测试分支"
      default:
        return "请选择分支类型"
    }
  }

  const getCurrentDate = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const onFinish = (values) => {
    const { project, branchType, branchName, creator } = values
    // 按顺序组装：名称-项目-功能-说明-时间
    const result = [creator, project, branchType, branchName, getCurrentDate()]
      .filter(Boolean)
      .join("_")
    message.success(`生成结果: ${result}`)
    console.log("组装后的字符串:", result)
  }

  const init = async () => {
    const [res, err] = await getCurrentBranch()
    if (!err) {
      form.setFieldsValue({
        branch: res
      })
    }
  }

  const initProject = async () => {
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

  useEffect(() => {
    init()
    initProject()
  }, [])
  return (
    <div className="bg-gray-50 p-6">
      <Card className="w-full max-w-lg shadow-lg rounded-2xl">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* 分支名 (禁用) */}
          <Form.Item label="当前分支" name="branch">
            <Input placeholder="自动生成" disabled />
          </Form.Item>

          {/* 项目选择 */}
          <Form.Item
            label="选择项目"
            name="project"
            rules={[{ required: true, message: "请选择项目" }]}
          >
            <Select placeholder="请选择项目">
              {
                projectList.map(item => {
                  return <Option value={item.key}>{item.key}&nbsp;&nbsp;&nbsp;({item.name})</Option>
                })
              }
            </Select>
          </Form.Item>

          {/* 分支类型 */}
          <Form.Item
            label="选择分支类型"
            name="branchType"
            rules={[{ required: true, message: "请选择分支类型" }]}
          >
            <Select placeholder="请选择类型" onChange={(val) => setBranchType(val)}>
              <Option value="feature">新功能(feature)</Option>
              <Option value="jira">JIRA单(jira)</Option>
              <Option value="test">测试(test)</Option>
            </Select>
          </Form.Item>

          {/* 动态输入框 */}
          {branchType && branchType !== "test" && (
            <Form.Item
              label={branchType === "feature" ? "新功能描述" : "JIRA单号"}
              name="branchName"
              rules={[{ required: true, message: getPlaceholder() }]}
            >
              <Input placeholder={getPlaceholder()} />
            </Form.Item>
          )}

          {/* 创建者 (禁用) */}
          <Form.Item label="创建者" name="creator" initialValue={currentUser}>
            <Input disabled />
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
