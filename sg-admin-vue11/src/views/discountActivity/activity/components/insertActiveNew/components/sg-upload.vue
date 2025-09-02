<template>
  <div>
    <div class="flex gap-[30px]">
      <draggable v-model="fileList[phonelang]" class="flex gap-[30px] flex-wrap" item-key="id">
        <template #item="{ element, index }">
          <div class="w-[130px] h-[170px] bg-[#fff] relative border-1 rounded-[4px]">
            <div class="w-[100%] h-[130px] relative flex items-center justify-center">
              <div class="absolute left-[6px] top-[6px]">
                <drag-outlined style="font-size: 16px; color: #02a7f0" />
              </div>
              <div
                class="absolute right-0 top-0 cursor-pointer p-[6px]"
                @click.stop="deleteFile(element.id, index)"
              >
                <delete-filled style="color: #d9001b" />
              </div>
              <div>
                <FileTextFilled style="font-size: 28px" />
              </div>
            </div>
            <div
              class="w-[100%] px-[4px] over-ellipsis h-[40px] text-center border-t-1 leading-[40px]"
              >{{ element.filename }}</div
            >
          </div>
        </template>
        <template #footer>
          <div class="w-[130px] h-[170px] bg-[#fff] relative border-1 border-dashed rounded-[4px]">
            <div class="w-[100%] h-[100%] flex flex-col items-center text-[12px] justify-center">
              <plus-outlined class="text-[48px]" />
              <div>导入号码</div>
              <div>格式：txt</div>
              <div>大小：不超过{{ size }}MB</div>
            </div>
            <input
              class="w-[100%] h-[100%] absolute top-0 left-0 opacity-[0] cursor-pointer"
              type="file"
              name="a"
              :accept="accept.join(',')"
              :disabled="disabled"
              title=""
              @change="changFile"
            />
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import { FileTextFilled, DeleteFilled, PlusOutlined, DragOutlined } from '@ant-design/icons-vue';
  import { defHttp } from '/@/utils/http/axios';
  import draggable from 'vuedraggable';
  import axios from 'axios';
  import { useGlobSetting } from '/@/hooks/setting';
  import ZstdCodec from 'zstd-codec';
  import { getToken } from '/@/utils/auth';

  interface Props {
    disabled?: boolean;
    /** 可选文件类型 */
    accept?: string[];
    /** 上传文件大小，单位MB */
    size?: number;
    /** 语言 */
    phonelang: string;
    /** 活动id */
    activityid: string;
  }
  const globSetting = useGlobSetting();

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    accept: () => ['.txt'],
    size: 10,
  });
  const fileList = ref<any>({});
  fileList.value[props.phonelang] = [];

  watch(
    () => props.phonelang,
    () => {
      getList();
    },
  );
  //保存号码
  function ApiPhonebookUpload(params) {
    return defHttp.post(
      {
        url: '/promo/phonebook/upload',
        params,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
      { isTransformResponse: false },
    );
  }
  //获取号码列表
  function ApiPhonebookList(params) {
    return defHttp.get({ url: '/promo/phonebook/list', params }, { isTransformResponse: false });
  }
  //删除
  function ApiPhonebookDelete(params) {
    return defHttp.get({ url: '/promo/phonebook/delete', params }, { isTransformResponse: false });
  }

  function encodeSearchParams(obj) {
    const params = [];

    Object.keys(obj).forEach((key) => {
      let value = obj[key];
      // 如果值为undefined我们将其置空
      if (typeof value === 'undefined') {
        value = '';
      }
      // 对于需要编码的文本（比如说中文）我们要进行编码
      params.push([key, encodeURIComponent(value)].join('='));
    });

    return params.join('&');
  }

  //文件改变
  function changFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (props.accept.join(',').search(file.name.split('.').pop()) === -1) {
        message.error('文件类型只支持txt');
        //文件类型不同过
        event.target.value = '';
      } else if (file.size / 1024 / 1024 > props.size) {
        message.error(`文件大小不超过${props.size}M`);
        // 文件大小不通过
        event.target.value = '';
      } else {
        let reader = new FileReader();
        reader.onload = function (e) {
          let content = e.target?.result?.toString();
          event.target.value = '';
          if (content?.trim()) {
            const str = content.split('\n').join(',');

            const _content = encodeSearchParams({
              lang: props.phonelang,
              filename: file.name, //文件名
              data: str, //手机号码 逗号分割
              pid: props.activityid,
            });

            ZstdCodec.ZstdCodec.run((__zstd) => {
              const token: any = getToken();
              const simple = new __zstd.Simple();
              const _data = new TextEncoder().encode(_content);
              const level = 5;
              const compressed = simple.compress(_data, level);

              console.error('原数据', _content);
              console.error('compressed', compressed);

              axios
                .post(globSetting.apiUrl + '/promo/phonebook/upload', compressed, {
                  headers: {
                    t: token,
                    lang: 'zh_CN',
                    // 'Content-Type': 'arraybuffer'
                    'Content-Type': 'application/octet-stream',
                  },
                })
                .then(() => {
                  getList();
                });
            });

            // ApiPhonebookUpload({
            //   lang: props.phonelang,
            //   filename: file.name, //文件名
            //   data: _data, //手机号码 逗号分割
            //   pid: props.activityid,
            // }).then(() => {
            //   getList();
            // });
          } else {
            message.error('文件解析失败');
          }
          // fileList.value[props.phonelang].push({
          //   filename: file.name, //文件名
          //   id: new Date().getTime(),
          // });
        };
        reader.readAsText(file);
      }
    }
  }
  //删除文件
  function deleteFile(id, index) {
    ApiPhonebookDelete({ id }).then(() => {
      fileList.value[props.phonelang].splice(index, 1);
    });
  }
  // 获取list
  function getList() {
    ApiPhonebookList({
      lang: props.phonelang,
      pid: props.activityid,
    }).then((res) => {
      const data = res.data;
      if (data) {
        fileList.value[props.phonelang] = data?.map((item) => {
          return {
            filename: item.filename,
            id: item.id,
          };
        });
      } else {
        fileList.value[props.phonelang] = [];
      }
    });
  }

  getList();
</script>

<style scoped>
  .over-ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
