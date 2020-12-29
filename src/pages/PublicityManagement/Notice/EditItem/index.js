/*
 * @Description: “公告”页面增查改操作
 * @Author: 谢涛
 * @Date: 2019-07-11 11:15:38
 * @LastEditTime: 2020-12-16 13:35:44
 * @LastEditors: Please set LastEditors
 */

import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Select, Modal, Col, Row, message } from 'antd';
import MyRangeDate from '@/components/MyRangeDate';
import '@/layouts/handleList.css';
import { notice } from '@/services/basic';
import moment from 'moment';
const Option = Select.Option;
const { TextArea } = Input;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
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
    this.setState({
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
    });
    this.form.resetFields();
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modal框自带的确认操作
  handleOk = () => {
    const { handler, id } = this.state;
    const requestType = handler === 'create' ? 'post' : 'put';
    let newItem = this.form.getFieldsValue();
    if (newItem.ggkssj) newItem.ggkssj = `${newItem.ggkssj.format('YYYY-MM-DD')}`;
    if (newItem.ggjssj) newItem.ggjssj = `${newItem.ggjssj.format('YYYY-MM-DD')}`;
    this.form.validateFields().then((values) => {
      notice[requestType]({ ...newItem, id }).then((res) => {
        this.props.editItemDone();
        this.hideModal();
        message.success('操作成功');
      });
    });
  };

  //查看单条
  handleView = (id) => {
    if (id) {
      notice.get(id).then((res) => {
        let { ggnr, ggbt, ggkssj, ggjssj, zt } = res;
        ggkssj = moment(ggkssj);
        ggjssj = moment(ggjssj);
        this.form.setFieldsValue({ ggnr, ggbt, ggkssj, ggjssj, zt });
        this.setState({ visible: true, id });
      });
    }
  };

  render() {
    const { handler } = this.state;

    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width='50%'
          style={{ top: 80 }}
          maskClosable={false}
          className='handleList'
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}系统消息`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='公告标题' name='ggbt' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='公告内容' name='ggnr' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <TextArea disabled={handler === 'view' ? true : false} row={4} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <MyRangeDate startTime='ggkssj' endTime='ggjssj' format='YYYY-MM-DD' colSpan={12} />
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='状态' name='zt' rules={[]} initialValue={1}>
                  <Select disabled={handler === 'view' ? true : false} placeholder='请选择'>
                    <Option value={1}>启用</Option>
                    <Option value={0}>禁用</Option>
                  </Select>
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
