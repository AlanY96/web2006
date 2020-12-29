/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:02:36
 * @description: Banner编辑页面
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Col, Row, message, Select } from 'antd';
import '@/layouts/handleList.css';
import { bannerApi } from '@/services/basic';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import RichSnippets from '@/components/RichSnippets';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      loading: false,
      editorState: BraftEditor.createEditorState(null),
    };
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
  };
  //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      //如果有record传过来 说明一定是查看或者更新操作
      const { id } = record;
      this.setState({ visible: true, id, handler });
      this.handleView(id);
    } else {
      //如果是新增操作 那直接展示弹出框 赋值操作类型
      this.setState({ visible: true, handler });
    }
  };

  //关闭操作页面
  hideModal = () => {
    this.setState({
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      imageUrl: undefined,
      editorState: BraftEditor.createEditorState(null),
    });
    this.form.resetFields();
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modalk框自带的确认操作
  handleOk = () => {
    this.form.validateFields().then((values) => {
      const { handler, id, imageUrl, editorState } = this.state;
      if (!imageUrl) {
        message.error('请上传图片!');
        return;
      }
      const htmlString = editorState.toHTML();
      if (!htmlString) {
        message.error('请编辑内容');
        return;
      }
      let newItem = this.form.getFieldsValue();
      const requestType = handler === 'create' ? 'post' : 'put';
      bannerApi[requestType]({ ...newItem, id, url: imageUrl, nr: htmlString }).then((res) => {
        this.props.editItemDone();
        this.form.resetFields();
        this.hideModal();
        message.success('操作成功');
      });
    });
  };

  //查看单条
  handleView = (id) => {
    this.setState({ visible: true, id });
    if (id) {
      bannerApi.get(id).then((res) => {
        const { mc, sm, tzdz, url, xh, nr } = res;
        this.form.setFieldsValue({
          mc,
          sm,
          tzdz,
          xh,
        });
        this.setState({ imageUrl: url, editorState: BraftEditor.createEditorState(nr) });
      });
    }
  };

  handleChange = (info) => {
    this.setState({
      imageUrl: info.fullUrl,
    });
  };

  render() {
    const { handler, imageUrl, visible, editorState } = this.state;
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onCancel={this.handleCancel}
          width='900px'
          style={{ top: 10 }}
          maskClosable={false}
          className='handleList DataBook'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}Banner管理`}</span>
          </div>
          <Form onSubmit={this.handleOk} autoComplete='off' ref={(form) => (this.form = form)}>
            <Row>
              <Col span={12}>
                <Form.Item label='名称' name='mc' rules={[{ required: true, message: '此为必填项' }]} getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='说明' name='sm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')} rules={[{ required: true, message: '此为必填项' }]}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='序号' name='xh' rules={[{ required: true, message: '此为必填项' }]} getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='跳转地址' name='tzdz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')} rules={[{ required: true, message: '此为必填项' }]}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='图片'>
                  <AliyunOSSUpload showUploadList={false} handler={handler} imageUrl={imageUrl} onChange={this.handleChange} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='类型' name='lx' rules={[{ required: true, message: '此为必填项' }]} initialValue={2}>
                  <Select disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请选择'>
                    <Select.Option value={2}>banner</Select.Option>
                    <Select.Option value={3}>广告</Select.Option>
                    <Select.Option value={4}>睡眠专科</Select.Option>
                    <Select.Option value={5}>膝关节专科</Select.Option>
                    <Select.Option value={6}>医美专科</Select.Option>
                    <Select.Option value={7}>痛风专科</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div className='my-component' style={{ padding: '20px' }}>
              <Row gutter={10}>
                <div
                  style={{
                    width: '100%',
                    borderWidth: '1px',
                    borderColor: '#d9d9d9',
                    borderStyle: 'solid',
                  }}
                >
                  <RichSnippets editorState={editorState} onChange={this.handleEditorChange} controls={handler === 'view' ? [] : null} />
                </div>
              </Row>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
