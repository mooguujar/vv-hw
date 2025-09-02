import { useEffect, useRef, useState } from 'react'
import css from './index.module.css'
import {
  getGitList,
  synchronousApi,
} from "@/services/api.js";
import { Select, Button, Checkbox } from 'antd'
import {message} from "@/utils/index.js";


function LangTable() {
  const [projectList, setProjectList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState('queen')

	async function init() {
    const [res, err] = await getGitList()
    if (!err) {
      setProjectList(res?.map(item => {
        return {
          value: item,
          label: item,
          disabled: !['queen', 'lottery'].includes(item),
        }
      }))
    }
	}

  async function synchronousHandle() {
    try {
      setLoading(true)
      const [res, err] = await synchronousApi({
        projectName: selectedProject,
      })
      if (!err) {
        message.success(res)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  const onChange= (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

	useEffect(() => {
		init()
	}, [])
	return (
		<div className={css.tableContainer}>
      {/*<Checkbox disabled onChange={onChange}>同步到JSON仓库</Checkbox>*/}
      <a
        target="_blank"
        href="https://docs.google.com/spreadsheets/d/19d8VD3111cvpvxWRd-7gnXv5XBgOVqUE5dZGgo7YgVQ/edit?gid=1531171368#gid=1531171368">
        Goole 多语言地址
      </a>
      <br />
      <Select
        options={projectList}
        className="w-50"
        defaultValue={selectedProject}
        onChange={(value) => {
          setSelectedProject(value)
        }}
      />
      <Button
        className="mt-[15px] mr-[15px]"
        type="primary"
        onClick={() => synchronousHandle()}
        loading={loading}
      >
        同步
      </Button>
      <span>同步功能会把Goole 文档里面的内容同步到本地文件中</span>
		</div>
	)
}

export default LangTable
