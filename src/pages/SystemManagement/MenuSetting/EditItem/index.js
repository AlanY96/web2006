/*
 * @Autor: zx
 * @Date: 2020-12-22 09:54:02
 * @LastEditTime: 2020-12-23 16:52:53
 * @FilePath: \fby-web\src\pages\SystemManagement\MenuSetting\EditItem\index.js
 * @LastEditors: zx
 * @Description: “菜单”页面增查改操作
 */

import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Select, Modal, Col, Row, message, InputNumber, Radio } from 'antd';
import '@/layouts/handleList.css';
import { menuApi } from '@/services/basic';

const Option = Select.Option;
class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      SjcdMc: [], //上级菜单名称数据
      dj: undefined, //选区的当前菜单的等级
      sjid: undefined, //上级菜单的id(回传默认值)
      handler: undefined, //当前正在执行的操作类型
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      //如果有record传过来 说明一定是查看或者更新操作
      const { id } = record;
      this.setState({ visible: true, id, handler });
      this.handleView(handler, id);
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
        SjcdMc: [], //上级菜单名称数据
        dj: undefined, //选区的当前菜单的等级
        sjid: undefined, //上级菜单的id(回传默认值)
        handler: undefined, //当前正在执行的操作类型
      },
      () => this.form.resetFields()
    );
  };

  //Modal框自带的取消操作
  handleCancel = () => {
    this.hideModal();
  };

  //Modal框自带的确认操作
  handleOk = () => {
    const { handler, id, dj } = this.state;
    const requestType = handler === 'create' ? 'post' : 'put';
    let newItem = this.form.getFieldsValue();
    if (dj === 1) newItem.sjid = 0;
    this.form.validateFields().then((values) => {
      menuApi[requestType]({ ...newItem, id }).then((res) => {
        this.props.editItemDone();
        this.hideModal();
        message.success('操作成功');
      });
    });
  };

  //查看单条
  handleView = (handler, id) => {
    if (id) {
      menuApi.get(id).then((res) => {
        if (handler === 'create') {
          let { dj, mc, id } = res;
          const SjcdMc = (
            <Option key={id} value={id}>
              {mc}
            </Option>
          );
          this.setState({ SjcdMc, sjid: id, createTy: true, dj: dj + 1 }, () => {
            this.form.setFieldsValue({
              dj: dj + 1,
              sjid: id,
              btnbz: dj + 1 === 4 ? '1' : '0',
            });
          });
        } else {
          let { mc, dj, xh, tb, tzdz, mjbz, btnbz, bz, sjid, sjName } = res;
          this.form.setFieldsValue({
            mc,
            dj,
            xh,
            tb,
            tzdz,
            mjbz,
            sjid,
            btnbz,
            bz,
          });
          this.setState({
            visible: true,
            id,
            SjcdMc: (
              <Option key={sjid} value={sjid}>
                {sjName}
              </Option>
            ),
            sjid,
            dj,
          });
        }
      });
    }
  };

  onSjidFocus = () => {
    menuApi.getParent(this.state.dj).then((res) => {
      if (res !== null && res.length !== 0) {
        const SjcdMc = res.map((item) => (
          <Option key={item.id} value={item.id}>
            {item.mc}
          </Option>
        ));
        this.setState({ SjcdMc });
      } else {
        message.warning('暂无数据');
      }
    });
  };

  onDjChange = (value) => {
    this.setState({ dj: value, sjid: undefined });
    this.form.resetFields(['sjid']);
    this.form.setFieldsValue({ sjid: undefined });
    if (value === 4) {
      this.form.setFieldsValue({
        btnbz: '1',
        mjbz: '1',
      });
    }
  };

  render () {
    const { handler, dj, visible, sjid, SjcdMc } = this.state;

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
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}菜单`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label='菜单名称'
                  name='mc'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='等级' name='dj' rules={[{ required: true, message: '此为必填项' }]}>
                  <Select
                    disabled={handler === 'view' ? true : false}
                    allowClear={handler === 'view' ? false : true}
                    placeholder='请选择'
                    onChange={this.onDjChange}
                  >
                    <Select.Option value={"1"}>1级</Select.Option>
                    <Select.Option value={"2"}>2级</Select.Option>
                    <Select.Option value={"3"}>3级</Select.Option>
                    <Select.Option value={"4"}>4级</Select.Option>
                    {/* {this.props.bookRender('cddj')} */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label='上级菜单'
                  name='sjid'
                  rules={[
                    {
                      required: dj === 1 ? false : true,
                      message: '此为必填项',
                    },
                  ]}
                  initialValue={sjid}
                >
                  <Select
                    disabled={handler === 'view' ? true : dj === 1 || dj === undefined ? true : false}
                    allowClear={handler === 'view' ? false : true}
                    placeholder='请选择'
                    filterOption={false}
                    notFoundContent={null}
                    showSearch={false}
                    onFocus={this.onSjidFocus}
                  >
                    {SjcdMc}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='序号' name='xh' rules={[{ required: true, message: '此为必填项' }]}>
                  <InputNumber
                    min={0}
                    max={99}
                    disabled={handler === 'view' ? true : false}
                    allowClear={handler === 'view' ? false : true}
                    placeholder='请输入'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label='按钮标志'
                  name='btnbz'
                  rules={[
                    {
                      required: dj === 1 ? false : true,
                      message: '此为必填项',
                    },
                  ]}
                  initialValue='0'
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Radio.Group disabled={handler === 'view' || dj === 4 ? true : false} allowClear={handler === 'view' ? false : true}>
                    <Radio value='0'>否</Radio>
                    <Radio value='1'>是</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='URL' name='tzdz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='备注' name='bz'>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
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
