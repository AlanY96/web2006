/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:02:36
 * @description: 药品编辑页面
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Col, Row, Select, InputNumber, message } from 'antd';
import '@/layouts/handleList.css';
import { drugmanagementApi } from '@/services/basic';

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      dataSource: {}, //表格数据(回填可用)
      count: 0, //行数
      handler: undefined, //当前正在执行的操作类型
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      const { id } = record;
      this.setState({ visible: true, id, handler });
      this.handleView(id);
    } else {
      this.setState({ visible: true, handler });
    }
  };

  //关闭操作页面
  hideModal = () => {
    this.setState({
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      dataSource: {},
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
      let newItem = this.form.getFieldsValue();
      const { handler, id } = this.state;
      const requestType = handler === 'create' ? 'post' : 'put';
      drugmanagementApi[requestType]({ ...newItem, id }).then((res) => {
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
      drugmanagementApi.get(id).then((res) => {
        this.setState({ dataSource: res });
        const { qybz, kcsl } = res;
        this.form.setFieldsValue({ qybz, kcsl });
      });
    }
  };

  render() {
    const { handler, dataSource } = this.state;
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width='800px'
          style={{ top: 10 }}
          maskClosable={false}
          className='handleList DataBook'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}药品管理`}</span>
          </div>
          <Form onSubmit={this.handleOk} autoComplete='off' ref={(form) => (this.form = form)}>
            <Row>
              <Col span={12}>
                <Form.Item label='通用名'>
                  <Input disabled value={dataSource.yptym} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='商品名'>
                  <Input disabled value={dataSource.spm} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='拼音码'>
                  <Input disabled value={dataSource.pym} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='药品编码'>
                  <Input disabled value={dataSource.bm} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='包装单位'>
                  <Input disabled value={dataSource.bzdw} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='产地'>
                  <Input disabled value={dataSource.cd} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='规格'>
                  <Input disabled value={dataSource.gg} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='可用库存' name='kcsl'>
                  <InputNumber disabled={handler === 'view' ? true : false} min={0} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='是否停用' name='qybz' rules={[]} initialValue='1'>
                  <Select disabled={handler === 'view' ? true : false} placeholder='请选择'>
                    <Select.Option value='1'>启用</Select.Option>
                    <Select.Option value='2'>停用</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label='备注'>
                  <Input disabled value={dataSource.bz} />
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
