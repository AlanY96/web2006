/*
 * @Autor: zx
 * @Date: 2020-12-18 10:29:11
 * @LastEditTime: 2020-12-18 14:30:53
 * @FilePath: \yxh-web\src\pages\SystemManagement\Rwdd\EditItem\index.js
 * @LastEditors: zx
 * @Description: 任务调度页面增删改查
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Modal, Select, Radio, message } from 'antd';
import '@/layouts/handleList.css';
import { RwddApi } from '@/services/basic';
const { TextArea } = Input;
const Option = Select.Option;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      rwzxff: [], //任务执行方法
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      //如果有record传过来 说明一定是查看或者更新操作
      const { id } = record;
      this.setState({ visible: true, id, handler }, () => {
        this.handleView(id);
      });
    } else {
      //如果是新增操作 那直接展示弹出框 赋值操作类型
      this.setState({ visible: true, handler });
    }
    //任务执行方法
    RwddApi.rwzxff().then(res => {
      this.setState({ rwzxff: res })
    })
  };

  //查看单条
  handleView = (id) => {
    RwddApi.see(id).then((res) => {
      if (res !== null) {
        const {
          bz,
          cron,
          jobName,
          methodName,
          rwzt,
        } = res;
        this.form.setFieldsValue({
          bz,
          cron,
          jobName,
          methodName,
          rwzt,
        });
      } else {
        message.warning("暂无数据");
      }
    });
  };

  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        id: '',
        visible: false,
        handler: undefined, //当前正在执行的操作类型
        rwzxff: [], //任务执行方法
      },
      () => this.form.resetFields()
    );
  };
  // 保存
  handleOk = () => {
    const { handler, id } = this.state;
    const requestType = handler === 'create' ? 'add' : 'put';
    this.form.validateFields().then((values) => {
      console.log('values===>', values)
      RwddApi[requestType]({ ...values, id: handler !== 'create' ? id : '' }).then(res => {
        console.log('res===>', res)
        this.hideModal();
        this.props.editItemDone();
        message.success("操作成功");
      })
    })
  };
  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  render() {
    const { handler, rwzxff, visible } = this.state;
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onCancel={this.handleCancel}
          width='800px'
          style={{ top: 80 }}
          maskClosable={false}
          className='handleList'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{handler === 'create' ? '添加任务' : '查看任务'}</span>
          </div>

          <Form autoComplete='off' ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label='任务名称'
                  name="jobName"
                  rules={[{ required: true, message: '此为必填项' }]}
                >
                  <Input placeholder="请输入" disabled={handler === 'view' ? true : false} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='调用方法'
                  name='methodName'
                  rules={[{ required: true, message: '此为必填项' }]}
                >
                  <Select allowClear placeholder='请选择' disabled={handler === 'view' ? true : false}>
                    {
                      rwzxff.length > 0 && rwzxff.map(res => {
                        return <Option key={res.method} value={res.method}>{res.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label='cron表达式'
                  name="cron"
                  rules={[{ required: true, message: '此为必填项' }]}
                >
                  <Input placeholder="请输入" disabled={handler === 'view' ? true : false} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='任务状态'
                  name="rwzt"
                  rules={[{ required: true, message: '此为必填项' }]}
                  initialValue={1}
                >
                  <Radio.Group disabled={handler === 'view' ? true : false}>
                    <Radio value={1}>运行</Radio>
                    <Radio value={0}>停止</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='备注' name='bz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <TextArea disabled={handler === 'view' ? true : false} row={4} placeholder='请输入' />
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
