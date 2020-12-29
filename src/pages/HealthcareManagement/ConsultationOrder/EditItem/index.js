/**
 * @author: YINJUN
 * @Date: 2020-10-22 19:58:55
 * @description: 问诊单详情
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Row, Col, InputNumber, message, Image, Tabs, Empty, Table } from 'antd';
import '@/layouts/handleList.css';
import './style.css';
import { ConsultationorderApi } from '@/services/basic';
const { TextArea } = Input;
const { TabPane } = Tabs;

class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      handler: undefined, //当前正在执行的操作类型
      record: {},
    };
  }
  //弹出操作页面
  showModal = (handler, record) => {
    //如果是新增操作 那直接展示弹出框 赋值操作类型
    const { id } = record;
    this.setState({ visible: true, handler, id });
    ConsultationorderApi.get(id).then((res) => {
      this.setState({ record: res });
      const { wzzj } = res;
      if (wzzj) {
        this.form.setFieldsValue({ pf: wzzj.pf, sm: wzzj.sm });
        this.setState({ handler: 'view' });
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
    this.form.validateFields().then((values) => {
      let newItem = this.form.getFieldsValue();
      const { id } = this.state;
      ConsultationorderApi.post({ ...newItem, wzdid: id }).then((response) => {
        this.hideModal();
        this.props.editItemDone();
        message.success('操作成功');
      });
    });
  };
  shchange = (cfzt) => {
    this.setState({ cfzt });
    if (cfzt === '3') {
      this.form.resetFields(['sfbtgyy']);
    }
  };
  // 表单布局
  formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  render() {
    const { handler, record } = this.state;
    const { wzxj, cfxx, dzbl } = record;
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
          className='handleList  UsersList-handle'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}问诊单`}</span>
          </div>
          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)} {...this.formItemLayout}>
            {(handler === 'view' && record.wzzj) || handler === 'update' ? (
              <>
                <Row>
                  <Col span={24} className='extraInfoconorder'>
                    质检信息
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col span={8}>
                    <Form.Item label='质检评分' name='pf' rules={[{ required: true, message: '此为必填项' }]}>
                      <InputNumber disabled={handler === 'update' && !record.wzzj ? false : true} min={1} max={100} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={16}>
                    <Form.Item
                      label='质检说明'
                      name='sm'
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                      getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                    >
                      <Input
                        disabled={handler === 'update' && !record.wzzj ? false : true}
                        allowClear={handler === 'view' ? false : true}
                        placeholder='请输入'
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : null}
            <Row>
              <Col span={24} className='extraInfoconorder'>
                问诊单信息
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item label='问诊时间'>
                  <Input disabled value={record.jzsj} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='问诊方式'>
                  <Input disabled value={record.wzfsmc} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='问诊金额'>
                  <Input disabled value={record.wzf} />
                </Form.Item>
              </Col>
            </Row>
            {record.jzr ? (
              <Row gutter={8}>
                <Col span={8}>
                  <Form.Item label='就诊人姓名'>
                    <Input disabled value={record.jzr.xm} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='就诊人性别'>
                    <Input disabled value={record.jzr.xbmc} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label='就诊人年龄'>
                    <Input disabled value={record.jzr.jzrnl} />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item label='接诊医生'>
                  <Input disabled value={record.wzysxm} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='接诊科室'>
                  <Input disabled value={record.ksmc} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='是否用药'>
                  <Input disabled value={record.sfkf === 1 ? '是' : '否'} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item label='该病情是否曾就医'>
                  <Input disabled value={record.cfzbz === 1 ? '是' : '否'} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='诊断名称'>
                  <Input disabled value={record.zszd} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '42px' }} label='病情描述'>
                  <TextArea disabled value={record.zs} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '42px' }} label='照片资料'>
                  {record.wzdmxList ? (
                    <Row style={{ paddingLeft: 0 }} gutter={20}>
                      {record.wzdmxList.map((it, j) => (
                        <Col span={4} style={{ padding: '0 10px' }} key={j}>
                          <Image src={it.zlurl} />
                        </Col>
                      ))}
                    </Row>
                  ) : null}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className='extraInfoconorder'>
                病历/小结/处方
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                  <Tabs defaultActiveKey='1' type='card' onChange={() => {}}>
                    <TabPane tab='病历' key='1'>
                      {dzbl ? (
                        <Row gutter={8}>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='临床诊断'>
                              <TextArea disabled value={dzbl.jbzdmc} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='主诉'>
                              <TextArea disabled value={dzbl.zs} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='现病史'>
                              <TextArea disabled value={dzbl.xbs} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='过敏史'>
                              <TextArea disabled value={dzbl.gms} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='个人史'>
                              <TextArea disabled value={dzbl.grs} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='既往史'>
                              <TextArea disabled value={dzbl.jws} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='处理意见'>
                              <TextArea disabled value={dzbl.clyj} />
                            </Form.Item>
                          </Col>
                        </Row>
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </TabPane>
                    <TabPane tab='小结' key='2'>
                      {wzxj ? (
                        <Row gutter={8}>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='咨询描述'>
                              <TextArea disabled value={wzxj.zxms} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='检查建议'>
                              <TextArea disabled value={wzxj.jcjy} />
                            </Form.Item>
                          </Col>
                          <Col span={24}>
                            <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{ paddingLeft: '0' }} label='处理意见'>
                              <TextArea disabled value={wzxj.clyj} />
                            </Form.Item>
                          </Col>
                        </Row>
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </TabPane>
                    <TabPane tab='处方' key='3' disabled={record.sfkf !== 1}>
                      {cfxx ? (
                        <>
                          <Row gutter={8} style={{ padding: 0 }}>
                            <Col span={16}>
                              <Row gutter={8}>
                                <Col span={24}>
                                  <div className='extraInfoconorder'>处方信息</div>
                                </Col>
                              </Row>
                              <Row gutter={8} style={{ padding: 0 }}>
                                <Col span={12}>
                                  <Form.Item label='开方时间'>
                                    <Input disabled value={cfxx.kfsj} />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item label='主诊断名称'>
                                    <Input disabled value={cfxx.zzdmc} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              <Row style={{ padding: 0 }}>
                                <Col span={24}>
                                  <Form.Item label='病史摘要' labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
                                    <TextArea disabled value={cfxx.bszy} />
                                  </Form.Item>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={8}>
                              <Row gutter={8} style={{ paddingLeft: 0 }}>
                                <Col span={24}>
                                  <div className='extraInfoconorder'>处方状态</div>
                                </Col>
                              </Row>
                              <Row gutter={8} style={{ padding: 0 }}>
                                <Col span={24} style={{ paddingLeft: 0 }}>
                                  <Form.Item label='处方状态' style={{ paddingLeft: 0 }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                                    <Input disabled value={cfxx.cfztmc} />
                                  </Form.Item>
                                </Col>
                              </Row>
                              {cfxx.cfzt === 2 ? (
                                <Row gutter={8} style={{ padding: 0 }}>
                                  <Col span={24} style={{ paddingLeft: '0' }}>
                                    <Form.Item
                                      label='不通过原因'
                                      name='sfbtgyy'
                                      style={{ paddingLeft: 0 }}
                                      labelCol={{ span: 6 }}
                                      wrapperCol={{ span: 18 }}
                                    >
                                      <TextArea value={cfxx.sfbtgyy} disabled />
                                    </Form.Item>
                                  </Col>
                                </Row>
                              ) : null}
                            </Col>
                          </Row>
                          <Row gutter={8}>
                            <Col span={24}>
                              <div className='extraInfoconorder'>用药信息</div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={24}>
                              <Row style={{ padding: 0 }}>
                                <Col span={24}>
                                  <Table columns={columns} pagination={false} dataSource={cfxx.cfmxList} rowKey={(r) => r.id} />
                                </Col>
                              </Row>
                              {cfxx.cfjeY ? (
                                <Row style={{ padding: 0 }}>
                                  <div style={{ textAlign: 'right', width: '100%', fontWeight: 'bold', paddingTop: '20px' }}>
                                    处方金额:<span style={{ color: 'red' }}>￥{cfxx.cfjeY}元</span>
                                  </div>
                                </Row>
                              ) : null}
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </TabPane>
                  </Tabs>
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
