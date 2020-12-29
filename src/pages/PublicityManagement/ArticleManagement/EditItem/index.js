/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:01:52
 * @description: 文章管理编辑页
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Modal, message, Select } from 'antd';
import '@/layouts/handleList.css';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import RichSnippets from '@/components/RichSnippets';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { articlemanagementApi, tagmanagementApi } from '@/services/basic';
const Option = Select.Option;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      id: undefined,
      editorState: BraftEditor.createEditorState(null),
      loading: false,
      imageUrl: undefined,
      autelToken: JSON.parse(sessionStorage.getItem('userInfo')),
      wzlx: undefined,
      wzbq: undefined,
      OSSData: {},
    };
  }

  handleChange = (file) => {
    this.setState({
      imageUrl: file.fullUrl,
    });
  };

  onwzlxChange = () => {
    const wzlx = this.form.getFieldsValue(['wzlx']);
    this.setState({ wzlx: wzlx.wzlx });
    if (wzlx.wzlx === 0) {
      this.form.resetFields(['bqList']);
    }
  };

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
  };

  onwzbqFocus = () => {
    tagmanagementApi.getBqByLx({ bqlx: 3 }).then((res) => {
      const wzbq = res.map((i) => (
        <Select.Option key={i.id} value={`${i.id}`}>
          {i.bqmc}
        </Select.Option>
      ));
      this.setState({ wzbq });
    });
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
  //查看单条
  handleView = (id) => {
    this.setState({ visible: true, id });
    if (id) {
      articlemanagementApi.get(id).then((res) => {
        const { fbzt, wzbt, wzfbt, wzlx, wznr, bqList, fmtp } = res;
        this.form.setFieldsValue({
          fbzt,
          wzbt,
          wzfbt,
          wzlx,
          wznr,
          bqList: bqList.map((i) => `${i.id}`),
        });
        if (wzlx === 1) {
          let wzbq = bqList.map((i) => (
            <Select.Option key={i.id} value={`${i.id}`}>
              {i.bqmc}
            </Select.Option>
          ));
          this.setState({ wzbq });
        }
        this.setState({
          editorState: BraftEditor.createEditorState(wznr),
          wzlx,
          imageUrl: fmtp,
        });
      });
    }
  };
  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        visible: false,
        handler: undefined, //当前正在执行的操作类型
        id: undefined,
        editorState: BraftEditor.createEditorState(null),
        loading: false,
        imageUrl: undefined,
        autelToken: JSON.parse(sessionStorage.getItem('userInfo')),
        wzlx: undefined,
        wzbq: undefined,
      },
      () => this.form.resetFields()
    );
  };
  handleOk = () => {
    const { handler, editorState, id, imageUrl } = this.state;
    const requestType = handler === 'create' ? 'post' : 'put';
    let newItem = this.form.getFieldsValue();

    this.form.validateFields().then((values) => {
      if (!imageUrl) {
        message.error('请上传文章封面!');
        return;
      }
      const htmlString = editorState.toHTML();
      if (!htmlString) {
        message.error('请编辑文章内容');
        return;
      }
      articlemanagementApi[requestType]({
        ...newItem,
        bqList: newItem.bqList
          ? newItem.bqList.map((i) => {
              return { id: Number(i) };
            })
          : [],
        wznr: htmlString,
        fmtp: imageUrl,
        id,
      }).then((res) => {
        this.props.editItemDone();
        this.hideModal();
        message.success('操作成功');
      });
    });
  };
  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };
  render() {
    const { handler, visible, editorState, imageUrl, wzlx, wzbq } = this.state;
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onCancel={this.handleCancel}
          width='800px'
          style={{ top: 20 }}
          maskClosable={false}
          className='handleList UsersGroup-handle'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}文章管理`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label='文章标题' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} name='wzbt' rules={[{ required: true, message: '此为必填项' }]}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label='文章副标题' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} name='wzfbt'>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label='文章类型' name='wzlx' rules={[{ required: true, message: '此为必填项' }]}>
                  <Select disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请选择' onChange={this.onwzlxChange}>
                    <Option value={1}>文章</Option>
                    <Option value={0}>园内新闻</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='发布状态' name='fbzt' rules={[{ required: true, message: '此为必填项' }]}>
                  <Select disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请选择'>
                    <Option value={1}>发布</Option>
                    <Option value={0}>未发布</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label='文章封面'>
                  <AliyunOSSUpload showUploadList={false} handler={handler} imageUrl={imageUrl} onChange={this.handleChange} />
                </Form.Item>
              </Col>
              {wzlx === 1 ? (
                <Col span={12}>
                  <Form.Item label='文章标签' name='bqList'>
                    <Select mode='tags' disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请选择' onFocus={this.onwzbqFocus}>
                      {wzbq}
                    </Select>
                  </Form.Item>
                </Col>
              ) : null}
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
