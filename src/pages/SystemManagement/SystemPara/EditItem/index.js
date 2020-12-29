/*
 * @Description: 系统参数操作页面
 * @Author: 谢涛
 * @Date: 2019-05-17 11:00:40
 * @LastEditTime: 2020-12-16 13:36:36
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Select, Modal, Col, Row, message } from 'antd';
import { systemParaApi, institutionsApi } from '@/services/basic';
import '@/layouts/handleList.css';
const Option = Select.Option;
class UpdateItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      visible: false,
      institution: [],
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
    this.setState(
      {
        id: '',
        visible: false,
        institution: [],
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
    const { handler, id } = this.state;
    const requestType = handler === 'create' ? 'post' : 'put';
    let newItem = this.form.getFieldsValue();
    newItem.id = id;
    this.form.validateFields().then((values) => {
      systemParaApi[requestType](newItem).then(() => {
        this.hideModal();
        this.props.editItemDone();
        message.success('操作成功');
      });
    });
  };

  //查看单条
  handleView = (id) => {
    this.setState({ id });
    if (id) {
      systemParaApi.get(id).then((res) => {
        const { csbm, csmc, csbz, zt, yybm, yyzt, yymc } = { ...res };
        this.setState({
          institution: (
            <Option key={yybm} value={yybm}>
              {yymc}
            </Option>
          ),
        });
        this.form.setFieldsValue({ csbm, csmc, csbz, zt, yyzt, yybm });
        this.setState({ visible: true });
      });
    }
  };

  //医疗机构下拉框获得焦点时的回调
  onInstitutionFocus = () => {
    institutionsApi.search({ zt: '0' }).then((res) => {
      if (res.records) {
        let institution = res.records.map((item) => (
          <Option key={item.yymc} value={item.yybm}>
            {item.yymc}
          </Option>
        ));
        this.setState({ institution });
      }
    });
  };

  //医疗机构下拉框输入内容时回调
  onInstitutionSearch = (value, option) => {
    if (value.charCodeAt(value.length - 1) === 32) {
      value = value.trim();
      institutionsApi.search({ search: `${value}` }).then((res) => {
        if (res.records) {
          let institution = res.records.map((item) => (
            <Option key={item.yymc} value={item.yybm}>
              {item.yymc}
            </Option>
          ));
          this.setState({ institution });
        }
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
          width='500px'
          style={{ top: 120 }}
          maskClosable={false}
          className='handleList'
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}系统参数`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item
                  label='代码'
                  name='csbm'
                  rules={[{ required: true, message: '请选择对应选项!' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'create' ? false : true} allowClear={handler === 'create' ? true : false} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item
                  label='参数名'
                  name='csmc'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='状态' name='zt' rules={[]} initialValue='1'>
                  <Select allowClear placeholder='请选择' disabled={handler === 'view' ? true : false}>
                    <Option value='1'>启用</Option>
                    <Option value='0'>禁用</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item
                  label='说明'
                  name='csbz'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='医疗机构' name='yybm' rules={[]} initialValue={this.state.initialInstitution}>
                  <Select
                    disabled={handler === 'view' ? true : false}
                    allowClear={handler === 'view' ? false : true}
                    placeholder='请选择机构'
                    filterOption={false}
                    showSearch={true}
                    onChange={this.onInstitutionChange}
                    onSearch={this.onInstitutionSearch}
                    onFocus={this.onInstitutionFocus}
                  >
                    {this.state.institution}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='医院参数值' name='yyzt' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
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
export default UpdateItem;
