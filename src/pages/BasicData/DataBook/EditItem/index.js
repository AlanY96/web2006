// file：数据字典编辑页面 , author: jianghainan, date: 2019-11-07
import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Input, Select, Modal, Col, Row, message, Popconfirm, Button, Table } from 'antd';
import '@/layouts/handleList.css';
import './style.css';
import { dataBookApi } from '@/services/basic';

const Option = Select.Option;
class EditItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: undefined,
      visible: false,
      dataSource: [], //表格数据(回填可用)
      count: 0, //行数
      Sjmc: [], //上级名称下拉框选项
      SjmcName: [], //上级名称回填初始值集合
      SjmcData: [], //所有增行的Sjmc上级名称合集 这么写是方便清空 免生bug
      zddm: undefined, //字典代码
      handler: undefined, //当前正在执行的操作类型
    };

    //表格中的项目内容
    this.columns = [
      {
        title: '字典编号',
        dataIndex: 'sjbm',
        render: (text, record) => {
          return (
            <Form.Item
              name={`sjbm${record.key}`}
              getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
              rules={[{ required: true, message: '此为必填项' }]}
            >
              <Input
                disabled={this.state.handler === 'view' ? true : false}
                allowClear={this.state.handler === 'view' ? false : true}
                placeholder='请输入'
                key={record.key}
                autoFocus={record.autoFocus}
              />
            </Form.Item>
          );
        },
      },
      {
        title: '字典明细',
        dataIndex: 'sjmc',
        render: (text, record) => (
          <Form.Item
            name={`sjmc${record.key}`}
            rules={[{ required: true, message: '此为必填项' }]}
            getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
          >
            <Input
              disabled={this.state.handler === 'view' ? true : false}
              allowClear={this.state.handler === 'view' ? false : true}
              placeholder='请输入'
              key={record.key}
            />
          </Form.Item>
        ),
      },
      {
        title: '备注',
        dataIndex: 'sjbz',
        render: (text, record) => (
          <Form.Item name={`sjbz${record.key}`} getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
            <Input
              disabled={this.state.handler === 'view' ? true : false}
              allowClear={this.state.handler === 'view' ? false : true}
              placeholder='请输入'
              key={record.key}
            />
          </Form.Item>
        ),
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) =>
          this.state.dataSource.length >= 1 && this.state.handler !== 'view' ? (
            <div>
              <Popconfirm title='确认删除嘛?' onConfirm={() => this.handleDelete(record.key)}>
                <span key={record.key}>删除</span>
              </Popconfirm>
            </div>
          ) : null,
      },
    ];
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
      dataSource: [], //表格数据(回填可用)
      count: 0, //行数
      Sjmc: [], //上级名称下拉框选项
      SjmcName: [], //上级名称回填初始值集合
      SjmcData: [], //所有增行的Sjmc上级名称合集 这么写是方便清空 免生bug
      zddm: undefined, //字典代码
      handler: undefined, //当前正在执行的操作类型
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
      const { handler, id, zddm } = this.state;
      const requestType = handler === 'create' ? 'post' : 'put';
      newItem.sjzds = this.createParams();
      dataBookApi[requestType]({ ...newItem, id, zddm }).then((res) => {
        this.props.editItemDone();
        this.form.resetFields();
        this.hideModal();
        message.success('操作成功');
      });
    });
  };

  //对增行数据的单独处理
  createParams = () => {
    let params = [];
    let newParams = [];
    const { dataSource } = this.state;
    const { length } = dataSource;
    const maxIndex = dataSource[length - 1].key;
    for (let i = 0; i < maxIndex + 1; i++) {
      params.push(this.form.getFieldsValue([`sjbm${i}`, `sjmc${i}`, `zbflsjid${i}`, `sjbz${i}`]));
    }
    params.map((item) => {
      if (Object.values(item)[0] !== undefined) {
        newParams.push({
          sjbm: Object.values(item)[0],
          sjmc: Object.values(item)[1],
          zbflsjid: Object.values(item)[2],
          sjbz: Object.values(item)[3],
        });
      }
      return undefined;
    });
    return newParams;
  };

  //查看单条
  handleView = (id) => {
    this.setState({ visible: true, id });
    if (id) {
      dataBookApi.get(id).then((res) => {
        // if (res.code === "0") {
        let { sjmc, sjbz, sjzds, zddm } = res;
        this.setState({ zddm });
        const dataSource = sjzds.map((item, index) => {
          return {
            key: index, //标识key
            sjbm: undefined, //编号
            sjmc: undefined, //名称
            zbflsjid: undefined, //上级名称
            sjbz: undefined, //备注
          };
        });
        const fieldsValue = sjzds.map((item, index) => {
          return {
            [`sjbm${index}`]: item.sjbm,
            [`sjmc${index}`]: item.sjmc,
            [`zbflsjid${index}`]: item.zbflsjid,
            [`sjbz${index}`]: item.sjbz,
          };
        });
        const SjmcData = sjzds.map((item) => (
          <Option key={item.zbflsjid} value={item.zbflsjid}>
            {item.flmc}
          </Option>
        ));
        this.setState({ SjmcData, dataSource, count: dataSource.length }, () => {
          for (let i = 0; i < dataSource.length; i++) {
            this.form.setFieldsValue(fieldsValue[i]);
          }
        });
        this.form.setFieldsValue({ sjmc, sjbz });
      });
    }
  };

  //增行操作 加一行
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count, //标识key
      sjbm: undefined, //编号
      sjmc: undefined, //名称
      zbflsjid: undefined, //上级名称
      sjbz: undefined, //备注
      autoFocus: true, //新增行自动获取焦点
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  //每行都有的删除按钮 点击删除当前行
  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };

  render() {
    const { dataSource, handler } = this.state;
    const columns = this.columns.map((col) => {
      return { ...col };
    });
    return (
      <div className='handle-header'>
        <Modal
          title=''
          visible={this.state.visible}
          onCancel={this.handleCancel}
          width='900px'
          style={{ top: 10 }}
          maskClosable={false}
          className='handleList DataBook'
          footer={this.props.modalfoot(handler, this.handleCancel, this.handleOk)}
        >
          <div className='formHeader'>
            <span className='handle-title'>{`${handler === 'view' ? '查看' : handler === 'create' ? '新增' : '更新'}数据字典`}</span>
          </div>

          <Form onSubmit={this.handleOk} autoComplete='off' ref={(form) => (this.form = form)}>
            <Row>
              <Col span={8}>
                <Form.Item
                  label='字典名称'
                  name='sjmc'
                  rules={[{ required: true, message: '此为必填项' }]}
                  getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}
                >
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item label='备注' name='sjbz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input disabled={handler === 'view' ? true : false} allowClear={handler === 'view' ? false : true} placeholder='请输入' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <div style={{ width: '95%', margin: '10px auto' }} className='Editable-handle'>
                <Button onClick={this.handleAdd} type='primary' style={{ marginBottom: 16 }}>
                  增行
                </Button>
                <Table
                  size='small'
                  rowClassName={() => 'editable-row'}
                  bordered
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  scroll={{ x: 0, y: 220 }}
                />
              </div>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default EditItem;
