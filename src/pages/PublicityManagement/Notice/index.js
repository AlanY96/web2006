/*
 * @Description: “公告”页面
 * @Author: 谢涛
 * @Date: 2019-07-11 11:15:38
 * @LastEditTime: 2020-12-16 13:40:42
 * @LastEditors: Please set LastEditors
 */

import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select } from 'antd';
import { notice } from '@/services/basic';
import EditItem from './EditItem';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import MyRangeDate from '@/components/MyRangeDate';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;
const Option = Select.Option;

class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
      records: [], //records对应列表上的每条数据
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
    this.Editor.showModal(handler, record);
  };

  //删除一条数据后刷新列表
  deleteItem = (id) => {
    notice.delete(id).then((res) => {
      this.queryData();
    });
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    for (let item in formData) {
      if (formData[item] !== null && typeof formData[item] === 'object') {
        formData[item] = formData[item].format('YYYY-MM-DD');
      }
    }
    notice.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  render() {
    const { create, update } = this.state.handlers;

    const columns = [
      { title: '公告标题', dataIndex: 'ggbt' },
      { title: '公告内容', dataIndex: 'ggnr' },
      { title: '开始时间', dataIndex: 'ggkssj' },
      { title: '结束时间', dataIndex: 'ggjssj' },
      {
        title: '状态',
        render: (text, record) => {
          return record.zt === 1 ? '启用' : '禁用';
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <span className='handleButton'>
            {/* 以下分别对应：改、删、等操作 */}
            {this.props.permission.edit ? (
              <FormOutlined title='修改' onClick={() => this.setHandler(update, record)} className='update-button' />
            ) : null}
            {this.props.permission.delete ? (
              <Popconfirm title='确认删除?' onConfirm={() => this.deleteItem(record.id)}>
                <DeleteOutlined title='删除' className='delete-button' />
              </Popconfirm>
            ) : null}
          </span>
        ),
      },
    ];

    let { data, records } = this.state;

    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='公告标题' name='ggbt' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <MyRangeDate startTime='ggkssj' endTime='ggjssj' format='YYYY-MM-DD' colSpan={6} />
              <Col span={2}>
                <Button onClick={(e) => this.queryData(e)} icon={<SearchOutlined />} className='search-button'>
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
            <Row gutter={24} className='showMore'>
              <Col span={6}>
                <Form.Item label='状态' name='zt' rules={[]} initialValue={'1'}>
                  <Select allowClear placeholder='请选择'>
                    <Option value='1'>启用</Option>
                    <Option value='0'>禁用</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </InputGroup>
        </Form>
        <MyTable
          props={{
            columns,
            dataSource: records,
            data,
            setHandler: this.setHandler,
            onChange: this.onChange,
            permission: this.props.permission,
          }}
        />
        <div>
          <EditItem ref={(Editor) => (this.Editor = Editor)} editItemDone={this.editItemDone} />
        </div>
      </div>
    );
  }
}
export default BtnPermission(Notice);
