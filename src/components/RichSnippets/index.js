/**
 * @author: YINJUN
 * @Date: 2020-11-27 11:16:18
 * @description: 阿里云OSS上传
 */
import React, { Component } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { ossApi } from '@/services/basic';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

export default class RichSnippets extends Component {
  state = {
    OSSData: {},
  };
  async componentDidMount() {
    await this.init();
  }
  // 获取签名
  init = async () => {
    let ossdata = false;
    ossApi.policy().then((res) => {
      this.setState(
        {
          OSSData: res,
        },
        () => {
          ossdata = true;
        }
      );
    });
    return ossdata;
  };

  beforeUpload = async (file) => {
    const { OSSData } = this.state;
    if (Object.keys(OSSData).length === 0) {
      await this.init();
    }
    const expire = OSSData.expire * 1000;
    if (expire < Date.now()) {
      await this.init();
    }
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传图片格式!');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 30;
    if (!isLt2M) {
      message.error('图片大小不可超过30MB!');
      return;
    }
    return isJpgOrPng && isLt2M;
  };

  myUploadFn = async (param) => {
    const beforeUpload = await this.beforeUpload(param.file);
    if (!beforeUpload) {
      return;
    }
    const { OSSData } = this.state;
    const { name } = this.props;
    const { file } = param;
    const progressFn = (event) => {
      param.progress((event.loaded / event.total) * 100);
    };
    const key = name ? name : 'file';
    let fordata = new FormData();
    fordata.append('key', this.transformFile(file).url);
    fordata.append('OSSAccessKeyId', OSSData.accessid);
    fordata.append('policy', OSSData.policy);
    fordata.append('Signature', OSSData.signature);
    fordata.append('callback', OSSData.callback);
    fordata.append(key, this.transformFile(file));
    axios({
      method: 'POST',
      url: OSSData.host,
      data: fordata,
      headers: {
        'x-oss-forbid-overwrite': true,
      },
      onUploadProgress: progressFn,
    }).then((res) => {
      param.success({
        url: res.data.data.fullUrl,
      });
    });
  };

  transformFile = (file) => {
    const { OSSData } = this.state;
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = OSSData.dir + filename;
    return file;
  };

  handleEditorChange = (editorState) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(editorState);
    }
  };

  render() {
    const control = [
      'undo',
      'redo',
      'separator',
      'font-size',
      'line-height',
      'letter-spacing',
      'separator',
      'text-color',
      'bold',
      'italic',
      'underline',
      'strike-through',
      'separator',
      'superscript',
      'subscript',
      'remove-styles',
      // 'emoji',
      'separator',
      'text-indent',
      'text-align',
      'separator',
      'headings',
      'list-ul',
      'list-ol',
      'blockquote',
      'code',
      'separator',
      'link',
      'separator',
      'hr',
      'separator',
      'media',
      'separator',
      'clear',
    ];
    const { editorState, controls } = this.props;
    return (
      <BraftEditor
        value={editorState}
        controls={controls ? controls : control}
        onChange={this.handleEditorChange}
        media={{ uploadFn: this.myUploadFn }}
      />
    );
  }
}
