/**
 * @author: YINJUN
 * @Date: 2020-11-27 11:16:18
 * @description: 阿里云OSS上传
 */
import React, { Component } from 'react';
import { Upload, Image, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ossApi } from '@/services/basic';

export default class AliyunOSSUpload extends Component {
  state = {
    OSSData: {},
    loading: false,
    fileList: [],
  };

  async componentDidMount() {
    await this.init();
  }

  // 获取签名
  init = async () => {
    let ossdata = false;
    const qm = await ossApi.policy();
    this.setState(
      {
        OSSData: qm,
      },
      () => {
        ossdata = true;
      }
    );
    return ossdata;
  };

  onChange = ({ file, fileList }) => {
    const { onChange } = this.props;
    if (file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (file.status === 'done') {
      if (file.xhr && file.xhr.status === 200) {
        this.setState({
          loading: false,
          fileList,
        });
        onChange(file.response.data);
      } else {
        message.error('上传图片失败!');
        this.setState({ loading: false });
      }
    }
  };

  onRemove = (file) => {
    const { value, onChange } = this.props;
    const files = value.filter((v) => v.url !== file.url);
    if (onChange) {
      onChange(files);
    }
  };

  transformFile = (file) => {
    const { OSSData } = this.state;
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.url = OSSData.dir + filename;
    return file;
  };

  getExtraData = (file) => {
    const { OSSData } = this.state;
    return {
      key: file.url,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
      callback: OSSData.callback,
    };
  };

  beforeUpload = async (file) => {
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;
    if (expire < Date.now()) {
      await this.init();
    }
    const { beforeUpload } = this.props;
    if (beforeUpload) {
      beforeUpload();
    } else {
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
    }
  };

  render() {
    const { showUploadList, handler, imageUrl, listType, className, fileLists, name, domview } = this.props;
    const { loading, fileList, OSSData } = this.state;
    const props = {
      name: name ? name : 'file',
      listType: listType ? listType : 'picture-card',
      className: className ? className : 'avatar-uploader',
      showUploadList: showUploadList,
      // fileList: fileList,
      fileList: fileLists ? fileLists : fileList,
      action: OSSData.host,
      disabled: handler === 'view' ? true : false,
      headers: {
        'x-oss-forbid-overwrite': true,
        // 设置下载文件名称
        // 'Content-Disposition': `attachment;filename=${encodeURI('我就叫这个.jpg')}`,
      },
      onChange: this.onChange,
      onRemove: this.onRemove,
      transformFile: this.transformFile,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
    };
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传图片</div>
      </div>
    );
    const seeimg =
      handler === 'view' ? <Image style={{ width: '100%' }} src={imageUrl} /> : <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />;

    const dom = imageUrl ? seeimg : uploadButton;
    return <Upload {...props}>{domview ? domview : dom}</Upload>;
  }
}
