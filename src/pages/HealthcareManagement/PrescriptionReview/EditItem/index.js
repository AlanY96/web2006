/**
 * @author: YINJUN
 * @Date: 2020-10-22 19:58:55
 * @description: 处方详情
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Row, Col, Table, Select, message } from 'antd';
import '@/layouts/handleList.css';
import './style.css';
import { prescriptionreviewApi } from '@/services/basic';
const { TextArea } = Input;
class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      record: {},
      cfzt: 3,
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    //如果是新增操作 那直接展示弹出框 赋值操作类型
    const { id } = record;
    this.setState({ visible: true, handler, id });
    prescriptionreviewApi.get(id).then((res) => {
      const { cfzt, sfbtgyy } = res;
      this.setState({ record: res });
      this.setState({ cfzt });
      if (handler === 'view') {
        this.form.setFieldsValue({ sfbtgyy, cfzt });
      }
    });
  };

  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        id: undefined,
        visible: false,
        handler: undefined, //当前正在执行的操作类型
        record: {},
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
    const { id, record } = this.state;
    if (record.cfzt === 1) {
      this.form.validateFields().then((values) => {
        let newItem = this.form.getFieldsValue();
        prescriptionreviewApi.post({ ...newItem, cfid: id }).then((response) => {
          this.hideModal();
          this.props.editItemDone();
          message.success('操作成功');
        });
      });
    }
    if (record.cfzt === 4) {
      prescriptionreviewApi.updateFyzt({ cfid: id, cfzt: 5 }).then((res) => {
        this.hideModal();
        this.props.editItemDone();
        message.success('操作成功');
      });
    }
  };
  shchange = (cfzt) => {
    this.setState({ cfzt });
    if (cfzt === 3) {
      this.form.resetFields(['sfbtgyy']);
    }
  };
  // 表单布局
  formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };
  render() {
    const { handler, record, cfzt } = this.state;
    const columns = [
      { title: '药品名称', dataIndex: 'ypmc' },
      { title: '药品规格', dataIndex: 'ypgg' },
      { title: '剂量单位', dataIndex: 'jldw' },
      { title: '每次剂量', dataIndex: 'mcjl' },
      { title: '使用频次', dataIndex: 'sypcName' },
      { title: '药品用法', dataIndex: 'ypyfName' }, // 1西药 2成药 3草药
      { title: '用药天数', dataIndex: 'yyts' },
      { title: '药品总药量', dataIndex: 'zyl' },
      { title: '总药量单位', dataIndex: 'zyldwName' },
    ];
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width='1200px'
          style={{ top: 80 }}
          maskClosable={false}
          className='handleList'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}处方`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)} {...this.formItemLayout}>
            <Row gutter={8}>
              <div style={{ textAlign: 'right', width: '100%', fontWeight: 'bold' }}>处方单号:{record.cfdh}</div>
            </Row>
            <Row gutter={8} style={{ padding: 0 }}>
              <Col span={16}>
                <Row gutter={8}>
                  <Col span={24}>
                    <div className='extraInfopresc'>患者信息</div>
                  </Col>
                </Row>
                <Row gutter={8} style={{ padding: 0 }}>
                  <Col span={8}>
                    <Form.Item label='患者姓名'>
                      <Input disabled value={record.hzxm} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='身份证号'>
                      <Input disabled value={record.hzsfzh} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='性别'>
                      <Input disabled value={record.hzxb} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8} style={{ padding: 0 }}>
                  <Col span={8}>
                    <Form.Item label='联系方式'>
                      <Input disabled value={record.hzlxfs} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='就诊卡号'>
                      <Input disabled value={record.jzkh} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='年龄'>
                      <Input disabled value={record.hznl} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row gutter={8} style={{ paddingLeft: 0 }}>
                  <Col span={24}>
                    <div className='extraInfopresc'>配送信息</div>
                  </Col>
                </Row>
                {record.cfzt > 3 ? (
                  <Row gutter={8} style={{ paddingLeft: 0 }}>
                    <Col span={5}>
                      <div className='ppsff'>{record.psfs === 1 ? '配送到家' : '院内取药'}</div>
                    </Col>
                    {record.psfs === 1 ? (
                      <Col span={19}>
                        <div>
                          <span>{record.sshr}</span>
                          <span style={{ paddingLeft: '10px' }}>{record.slxdh}</span>
                        </div>
                        <div>{record.mrdz}</div>
                      </Col>
                    ) : (
                      <Col span={19}>
                        <div style={{ paddingTop: '24px' }}>
                          <span>{record.hzxm}</span>
                          <span style={{ paddingLeft: '10px' }}>{record.hzlxfs}</span>
                        </div>
                      </Col>
                    )}
                  </Row>
                ) : null}
              </Col>
            </Row>
            <Row gutter={8} style={{ padding: 0 }}>
              <Col span={16}>
                <Row gutter={8}>
                  <Col span={24}>
                    <div className='extraInfopresc'>处方信息</div>
                  </Col>
                </Row>
                <Row gutter={8} style={{ padding: 0 }}>
                  <Col span={8}>
                    <Form.Item label='接诊医生'>
                      <Input disabled value={record.kfysxm} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='接诊科室'>
                      <Input disabled value={record.ksmc} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='处方状态'>
                      <Input disabled value={record.cfztmc} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={8} style={{ padding: 0 }}>
                  <Col span={8}>
                    <Form.Item label='开方时间'>
                      <Input disabled value={record.kfsj} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='主诊断名称'>
                      <Input disabled value={record.zzdmc} />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label='处方来源'>
                      <Input disabled value={record.cflymc} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ padding: 0 }}>
                  <Col span={24}>
                    <Form.Item label='病史摘要' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                      <TextArea disabled value={record.bszy} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <Row gutter={8} style={{ paddingLeft: 0 }}>
                  <Col span={24}>
                    <div className='extraInfopresc'>审方信息</div>
                  </Col>
                </Row>
                <Row gutter={8} style={{ padding: 0 }}>
                  <Col span={24} style={{ paddingLeft: 0 }}>
                    {cfzt === 0 || cfzt === 1 || cfzt === 2 || cfzt === 3 ? (
                      <Form.Item
                        label='审核状态'
                        name='cfzt'
                        style={{ paddingLeft: 0 }}
                        rules={[{ required: true, message: '此为必填项' }]}
                        initialValue={3}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                      >
                        <Select
                          disabled={handler === 'view' ? true : false}
                          allowClear={handler === 'view' ? false : true}
                          onChange={(e) => this.shchange(e)}
                        >
                          <Select.Option value={3}>审核通过</Select.Option>
                          <Select.Option value={2}>审核不通过</Select.Option>
                        </Select>
                      </Form.Item>
                    ) : (
                      <Form.Item label='审核状态' style={{ paddingLeft: 0 }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                        <Input disabled value='审核通过' />
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                {cfzt === 2 ? (
                  <Row gutter={8} style={{ padding: 0 }}>
                    <Col span={24} style={{ paddingLeft: '0' }}>
                      <Form.Item
                        label='不通过原因'
                        name='sfbtgyy'
                        style={{ paddingLeft: 0 }}
                        getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                      >
                        <TextArea disabled={handler === 'view'} allowClear={handler === 'view' ? false : true} />
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null}
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <div className='extraInfopresc'>用药信息</div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Row style={{ padding: 0 }}>
                  <Col span={24}>
                    <Table columns={columns} pagination={false} dataSource={record.cfmxList} rowKey={(r) => r.id} />
                  </Col>
                </Row>
                {record.cfjeY ? (
                  <Row style={{ padding: 0 }}>
                    <div style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', paddingTop: '20px' }}>
                      处方金额:<span style={{ color: 'red' }}>￥{record.cfjeY}元</span>
                    </div>
                  </Row>
                ) : null}
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
