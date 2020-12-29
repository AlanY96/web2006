/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:02:58
 * @description: 日志编辑页
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Modal } from 'antd';
import '@/layouts/handleList.css';
import { operationlogApi } from '@/services/basic';
const { TextArea } = Input;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      record: {},
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    this.setState({ visible: true, handler });
    const { id } = record;
    operationlogApi.get(id).then((res) => {
      this.setState({ record: res });
    });
  };

  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        visible: false,
        handler: undefined, //当前正在执行的操作类型
      },
      () => this.form.resetFields()
    );
  };
  handleOk = () => {};
  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  render() {
    const { beginTime, cgbz, czpt, id, mk, param, result, yhxm, url, ip, method } = this.state.record;
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width='800px'
          style={{ top: 20 }}
          maskClosable={false}
          className='handleList UsersGroup-handle'
          footer={<div style={{ height: '30px' }}></div>}
        >
          <div className='formHeader'>
            <span className='handle-title'>查看日志</span>
          </div>

          <Form autoComplete='off' ref={(form) => (this.form = form)}>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label='日志ID' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={id} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='成功标志' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={{ 1: '成功', 0: '失败' }[cgbz]} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label='操作平台' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={{ 1: 'PC平台', 2: '小程序', 9: '其他平台' }[czpt]} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='操作时间' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={beginTime} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label='用户名称' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={yhxm} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='操作模块' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={mk} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label='ip' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={ip} disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='请求方法' labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  <Input value={method} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label='URL' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                  <TextArea value={url} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label='入参' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                  <TextArea value={param} disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item label='反参' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                  <TextArea value={result} disabled />
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
