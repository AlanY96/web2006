/*
 * @Description: 医疗机构操作页面
 * @Author: 谢涛
 * @Date: 2019-05-13 11:18:23
 * @LastEditTime: 2020-12-15 14:02:57
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Select, Modal, Col, Row, message } from 'antd';
import '@/layouts/handleList.css';
import './style.css';
import BraftEditor from 'braft-editor';
import RichSnippets from '@/components/RichSnippets';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';
import { institutionsApi } from '@/services/basic';

class EditItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: undefined,
      visible: false,
      initialJb: undefined, //初始级别
      handler: undefined, //当前正在执行的操作类型
      editorState: BraftEditor.createEditorState(null),
      imageUrl: undefined,
    };
  }
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
    this.setState(
      {
        id: undefined,
        visible: false,
        initialJb: undefined, //初始级别
        handler: undefined, //当前正在执行的操作类型
        imageUrl: undefined,
        editorState: BraftEditor.createEditorState(null),
      },
      () => this.form.resetFields()
    );
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modalk框自带的确认操作
  handleOk = () => {
    let newItem = this.form.getFieldsValue();
    const { handler, id, imageUrl, editorState } = this.state;
    newItem.id = id;
    newItem.tpurl = imageUrl;
    newItem.yyjj = editorState.toHTML();
    const requestType = handler === 'create' ? 'post' : 'put';
    this.form.validateFields().then((values) => {
      institutionsApi[requestType]({ ...newItem }).then((response) => {
        this.props.editItemDone();
        this.form.resetFields();
        this.hideModal();
        message.success('操作成功');
      });
    });
  };

  //查看单条
  handleView = (id) => {
    if (id) {
      institutionsApi.get(id).then((res) => {
        let { yyjb, yymc, zzjgdm, ybdm, yydz, yyyb, yydh, yylxr, tyyy, yybm, tpurl, yyjj } = { ...res };
        let set = {
          yyjb,
          yymc,
          zzjgdm,
          ybdm,
          yydz,
          yyyb,
          yydh,
          yylxr,
          tyyy,
          yybm,
          tpurl,
          yyjj,
        };
        for (let item in set) {
          if (set[item] === undefined) set[item] = '';
        }
        this.form.setFieldsValue({ ...set });
        this.setState({
          visible: true,
          id,
          initialJb: set.yyjb,
          editorState: BraftEditor.createEditorState(yyjj),
          imageUrl: tpurl,
        });
      });
    }
  };

  handleChange = (info) => {
    this.setState({
      imageUrl: info.fullUrl,
    });
  };

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
  };
  render() {
    const { handler, initialJb, visible, imageUrl, editorState } = this.state;

    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width='800px'
          style={{ top: 80 }}
          maskClosable={false}
          className='handleList Institution-handle'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}医疗机构`}</span>
          </div>
          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='医疗机构级别' name='yyjb' rules={[{ required: true, message: '请选择对应选项!' }]} initialValue={initialJb}>
                  <Select disabled={handler === 'create' ? false : true} allowClear={handler === 'create' ? true : false} placeholder='请选择级别'>
                    {this.props.bookRender('dqjb')}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='医疗机构名称'
                  name='yymc'
                  rules={[{ required: true, message: '此项为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label='组织机构代码'
                  name='zzjgdm'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='医院编码'
                  name='yybm'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='医保代码' name='ybdm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='邮编' name='yyyb' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='联系人' name='yylxr' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='电话号码' name='yydh' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='医院图片'>
                  <AliyunOSSUpload showUploadList={false} handler={handler} imageUrl={imageUrl} onChange={this.handleChange} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='地址' name='yydz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='医院简介'>
                  <div
                    style={{
                      borderWidth: '1px',
                      borderColor: '#d9d9d9',
                      borderStyle: 'solid',
                    }}
                  >
                    <RichSnippets editorState={editorState} onChange={this.handleEditorChange} controls={handler === 'view' ? [] : null} />
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
