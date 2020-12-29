/*
 * @Description: 系统参数页面
 * @Author: 谢涛
 * @Date: 2019-05-17 11:00:40
 * @LastEditTime: 2020-11-27 10:53:30
 * @LastEditors: Please set LastEditors
 */

import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select } from 'antd';
import { systemParaApi } from '@/services/basic';
import EditItem from './EditItem';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;
const Option = Select.Option;
class SystemPara extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SystemPara: [],
      data: [], //data就是最顶层的数据 它包含records records是每条列表数据的集合 data还包含了其他信息 譬如总页数 当前页等等
      records: [],
      handlers: {
        create: 'create',
        view: 'view',
        update: 'update',
      }, //定义操作类型
    };
  }

  //组件挂载后为列表请求数据
  componentDidMount = () => {
    this.queryData();
  };

  //页码变化的时候，请求数据
  onChange = (pagination) => {
    this.queryData(pagination);
  };

  //增、改一条数据后刷新列表
  editItemDone = () => {
    this.queryData();
  };

  //增查改、设置操作类型，并传入对应行数据
  setHandler = (handler, record) => {
    this.EditItem.showModal(handler, record);
  };

  //删除一条数据后刷新列表
  deleteItem = (id) => {
    systemParaApi.delete(id).then((res) => {
      this.queryData();
    });
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    systemParaApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  render() {
    const { create, update } = this.state.handlers;

    const columns = [
      { title: '代码', dataIndex: 'csbm' },
      { title: '名称', dataIndex: 'csmc' },
      { title: '说明', dataIndex: 'csbz' },
      { title: '系统默认', dataIndex: 'zt' },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <span className='handleButton'>
            {/* 以下分别对应：改、删、打印三个操作 */}
            {this.props.permission.edit ? <FormOutlined onClick={() => this.setHandler(update, record)} className='update-button' /> : null}
            {this.props.permission.delete ? (
              <Popconfirm title='确认删除?' onConfirm={() => this.deleteItem(record.id)}>
                <DeleteOutlined className='delete-button' />
              </Popconfirm>
            ) : null}
          </span>
        ),
      },
    ];
    //给表格项加key 唯一标识 不然报警告
    let dataSource = this.state.records.slice(0);
    dataSource = dataSource.map((item, index) => {
      return Object.assign(item, { key: index });
    });

    const data = this.state && this.state;

    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='名称' name='csmc' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='说明' name='csbz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='状态' name='zt' rules={[]} initialValue='1'>
                  <Select allowClear placeholder='请选择'>
                    <Option value='1'>启用</Option>
                    <Option value='0'>禁用</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={this.queryData} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
              {this.props.permission.add ? (
                <Col span={2}>
                  <Button icon={<FileAddOutlined />} className='addButton' onClick={() => this.setHandler(create)}>
                    新增
                  </Button>
                </Col>
              ) : null}
            </Row>
          </InputGroup>
        </Form>
        <EditItem ref={(EditItem) => (this.EditItem = EditItem)} editItemDone={this.editItemDone} />
        <MyTable
          props={{
            columns,
            dataSource,
            data,
            setHandler: this.setHandler,
            onChange: this.onChange,
            permission: this.props.permission,
          }}
        />
      </div>
    );
  }
}
export default BtnPermission(SystemPara);
