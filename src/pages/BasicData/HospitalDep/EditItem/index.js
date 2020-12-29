/*
 * @Description: 医院科室操作页面
 * @Author: 谢涛
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-12-14 14:48:41
 * @LastEditors: Please set LastEditors
 */
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Modal, Col, Row, Select, message } from 'antd';
import '@/layouts/handleList.css';
import { departmentsApi } from '@/services/basic';
import AliyunOSSUpload from '@/components/AliyunOSSUpload';

const { TextArea } = Input;

const Option = Select.Option;
class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      institutionInitial: [],
      ksid: undefined,
      yybm: undefined,
      ggbs: true,
      handler: undefined, //当前正在执行的操作类型
      ksdj: undefined,
      imageUrl: undefined,
    };
  }

  //弹出操作页面
  showModal = (handler, record) => {
    if (record) {
      //如果有record传过来 说明一定是查看或者更新操作
      const { id } = record;
      this.setState({ visible: true, ksid: id, handler });
      this.handleView(id);
    } else {
      //如果是新增操作 那直接展示弹出框 赋值操作类型
      this.setState({ visible: true, handler }, () => {
        const { yybm, yymc } = JSON.parse(sessionStorage.getItem('userInfo'));
        this.setState(
          {
            institutionInitial: (
              <Option key={yymc} value={yybm}>
                {yymc}
              </Option>
            ),
            yybm,
          },
          () => {
            this.form && this.form.setFieldsValue({ yybm });
          }
        );
      });
    }
  };

  //关闭操作页面
  hideModal = () => {
    this.setState(
      {
        visible: false,
        institutionInitial: [],
        ksid: undefined,
        yybm: undefined,
        ggbs: true,
        handler: undefined, //当前正在执行的操作类型
        ksdj: undefined,
        imageUrl: undefined,
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
    this.form.validateFields().then(() => {
      let newItem = this.form.getFieldsValue();
      const { handler, ksid, imageUrl, ksdj } = this.state;
      const requestType = handler === 'create' ? 'post' : 'put';
      newItem.id = ksid;
      newItem.kstp = imageUrl;
      if (ksdj === 1) newItem.sjid = 0;
      departmentsApi[requestType](newItem).then((response) => {
        this.hideModal();
        this.props.editItemDone();
        message.success('操作成功');
        this.form.resetFields();
      });
    });
  };

  //查看单条
  handleView = (id) => {
    this.setState({ visible: true });
    if (id) {
      departmentsApi.get(id).then((res) => {
        const { yybm, yymc, ggbs, ksbm, kslh, ksch, ksfh, lx, ksdh, ksjj, ksmc, kstp, sjid, xh, sjksmc } = res;
        const { yyid } = JSON.parse(sessionStorage.getItem('userInfo'));
        const sjks = (
          <Option key={sjid} value={sjid}>
            {sjksmc}
          </Option>
        );
        const institutionInitial = (
          <Option key={yybm} value={yybm}>
            {yymc}
          </Option>
        );
        this.setState({
          institutionInitial,
          yybm,
          ggbs,
          imageUrl: kstp,
          sjks,
          ksdj: sjid === 0 ? 1 : 2,
        });
        this.form.setFieldsValue({
          ksbm,
          kslh,
          ksch,
          ksfh,
          lx,
          ksdh,
          ksmc,
          sjid,
          xh,
          ksdj: sjid === 0 ? 1 : 2,
          ksjj,
        });
        if (yyid !== 0) this.form.setFieldsValue({ yybm });
      });
    }
  };

  onRadioChange = (e) => {
    this.setState({
      radioValue: e.target.value,
    });
  };

  handleChange = (info) => {
    this.setState({
      imageUrl: info.fullUrl,
    });
  };

  officeTypeChange = (ksdj) => {
    this.setState({ ksdj });
    if (ksdj === 1) {
      this.form.resetFields(['sjid']);
    }
  };

  //医疗机构下拉框获取焦点时触发
  onsjksFocus = () => {
    const { yybm } = this.state;
    departmentsApi.getsjks(yybm).then((res) => {
      let sjks = res.map((item) => (
        <Option key={item.id} value={item.id}>
          {item.ksmc}
        </Option>
      ));
      this.setState({ sjks });
    });
  };

  render() {
    const { handler, visible, institutionInitial, imageUrl, ksdj, sjks } = this.state;
    const { yyid } = JSON.parse(sessionStorage.getItem('userInfo'));
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={visible}
          onCancel={this.handleCancel}
          width='800px'
          style={{ top: 120 }}
          maskClosable={false}
          className='handleList'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}医院科室`}</span>
          </div>

          <Form autoComplete='off' onSubmit={this.handleOk} ref={(form) => (this.form = form)}>
            {yyid === 0 ? null : (
              <Row gutter={8}>
                <Col span={24}>
                  <Form.Item label='医疗机构' name='yybm' rules={[{ required: 'true', message: '此为必填项' }]}>
                    <Select
                      disabled={handler === 'create' ? false : true}
                      placeholder='请选择机构'
                      filterOption={false}
                      showSearch={true}
                      showArrow={false}
                    >
                      {institutionInitial}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='科室等级' name='ksdj' rules={[{ required: 'true', message: '此为必填项' }]}>
                  <Select
                    allowClear={handler === 'view' ? false : true}
                    disabled={handler === 'create' ? false : true}
                    placeholder='请选类型'
                    filterOption={false}
                    showSearch={true}
                    onChange={(e) => this.officeTypeChange(e)}
                  >
                    <Select.Option value={1}>一级科室</Select.Option>
                    <Select.Option value={2}>二级科室</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='上级科室'
                  name='sjid'
                  rules={[
                    {
                      required: ksdj === 2 ? true : false,
                      message: '此为必填项',
                    },
                  ]}
                >
                  <Select
                    disabled={handler === 'view' || ksdj !== 2 ? true : false}
                    allowClear={handler === 'view' || ksdj === 1 ? false : true}
                    placeholder='请选择'
                    filterOption={false}
                    showSearch={true}
                    onFocus={this.onsjksFocus}
                  >
                    {sjks}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='科室类型' name='lx' rules={[{ required: 'true', message: '此为必填项' }]}>
                  <Select
                    allowClear={handler === 'view' ? false : true}
                    disabled={handler === 'create' ? false : true}
                    placeholder='请选类型'
                    filterOption={false}
                    showSearch={true}
                  >
                    {this.props.bookRender('kslx', false)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='科室名称' name='ksmc' rules={[{ required: 'true', message: '此为必填项' }]}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  label='科室楼号'
                  className='kslh'
                  name='kslh'
                  rules={[{ pattern: '^[-+]?([0-9]*)$', message: '请输入数字' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='科室层号' className='ksch' name='ksch' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='科室房号' className='ksfh' name='ksfh' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='科室电话' className='ksdh' name='ksdh' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item label='科室图片'>
                  <AliyunOSSUpload
                    showUploadList={false}
                    handler={handler}
                    // fileLists={[{ url: imageUrl }]}
                    imageUrl={imageUrl}
                    onChange={this.handleChange}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='序号'
                  name='xh'
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                  initialValue={99}
                  rules={[{ required: 'true', message: '此为必填项' }]}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='科室简介' name='ksjj'>
                  <TextArea disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
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
