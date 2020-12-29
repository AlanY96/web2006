/*
 * @Description: 这是“行政区划”页面
 * @Author: 谢涛
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-13 10:45:20
 * @LastEditTime: 2020-11-27 10:52:46
 */

import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import {
  Form,
  Col,
  Row,
  Input,
  Button,
  // Select,
  Popconfirm,
  // message,
} from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { admDivisionApi } from '@/services/basic';
import EditItem from './EditItem';
import '@/layouts/queryList.css';

const InputGroup = Input.Group;

class AdminDiv extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Division: [],
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
    this.EditItemRef.showModal(handler, record);
  };

  //删除一条数据后刷新列表
  deleteItem = (id) => {
    admDivisionApi.delete(id).then((res) => {
      this.queryData();
    });
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    admDivisionApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  render() {
    const columns = [
      { title: '级别', dataIndex: 'xzqhjbmc' },
      { title: '代码', dataIndex: 'xzqhdm' },
      { title: '行政区化名称', dataIndex: 'xzqhmc' },
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

    const { create, update } = this.state.handlers;

    let { data, records } = this.state;
    const { permission } = this.props;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={8}>
              <Col span={8}>
                <Form.Item
                  label='行政区划名称'
                  name='xzqhmc'
                  getValueFromEvent={(event) => {
                    return event.target.value.replace(/\s+/g, '');
                  }}
                >
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              {/* <Col span={6}>
                <Form.Item label="级别" name="xzqhjb">
                  <Select placeholder="请选择级别" onChange={this.onRankChange}>
                    {this.props.bookRender("dqjb")}
                  </Select>
                </Form.Item>
              </Col> */}
              <Col span={2}>
                <Button onClick={this.queryData} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
              {permission.add ? (
                <Col span={2}>
                  <Button icon={<FileAddOutlined />} className='addButton' onClick={() => this.setHandler(create)}>
                    新增
                  </Button>
                </Col>
              ) : null}
            </Row>
          </InputGroup>
        </Form>
        <EditItem ref={(EditItemRef) => (this.EditItemRef = EditItemRef)} editItemDone={this.editItemDone} bookRender={this.props.bookRender} modalfoot={this.props.modalfoot} />
        <MyTable
          props={{
            columns,
            dataSource: records,
            data,
            setHandler: this.setHandler,
            onChange: this.onChange,
            permission,
          }}
        />
      </div>
    );
  }
}
export default BtnPermission(AdminDiv, {
  dataBook: {
    8: 'dqjb', // 地区级别
  },
});
