/*
 * @Autor: zx
 * @Date: 2020-12-18 10:29:11
 * @LastEditTime: 2020-12-18 14:26:16
 * @FilePath: \yxh-web\src\pages\SystemManagement\rwdd\index.js
 * @LastEditors: zx
 * @Description: 任务调度
 */
import React, { Component } from 'react';
import { SearchOutlined, DeleteOutlined, FormOutlined, FileAddOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Select, Popconfirm, Tag } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { RwddApi } from '@/services/basic';

import EditItem from './EditItem';
import TheLog from './TheLog';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;
const Option = Select.Option;

class OperationLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
      records: [], //records对应列表上的每条数据
      rwzxff: [], // 任务执行方法
    };
  }

  //组件挂载后为列表请求数据
  componentDidMount = () => {
    this.queryData();
    //任务执行方法
    RwddApi.rwzxff().then(res => {
      this.setState({ rwzxff: res })
    })
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

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    RwddApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  // 删除
  deleteItem = (id) => {
    RwddApi.del(id).then((res) => {
      this.queryData();
    });
  }

  TheLogRefHandler = () => {
    this.TheLogRef.showModal();
  }

  render() {
    const columns = [
      { title: '任务名称', dataIndex: 'jobName' },
      { title: '任务方法', dataIndex: 'methodName' },
      { title: 'cron', dataIndex: 'cron' },
      {
        title: '状态',
        dataIndex: 'rwzt',
        render(h) {
          return h === 1 ? <Tag color='success'>运行</Tag> : <Tag color='error'>停止</Tag>;
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <span className='handleButton'>
            {/* 以下分别对应：改、删、打印三个操作 */}
            {this.props.permission.edit ? <FormOutlined onClick={() => this.setHandler('update', record)} className='update-button' /> : null}
            {this.props.permission.delete ? (
              <Popconfirm title='确认删除?' onConfirm={() => this.deleteItem(record.id)}>
                <DeleteOutlined className='delete-button' />
              </Popconfirm>
            ) : null}
          </span>
        ),
      },
    ];

    const { data, records, rwzxff } = this.state;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='任务名称' name='jobName' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='任务执行方法' name='methodName'>
                  <Select allowClear placeholder='请选择'>
                    {
                      rwzxff.length > 0 && rwzxff.map(res => {
                        return <Option key={res.method} value={res.method}>{res.name}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='任务状态' name='rwzt' initialValue={''}>
                  <Select allowClear placeholder='请选择'>
                    <Option value={1}>运行</Option>
                    <Option value={0}>停止</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={(e) => this.queryData(e)} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
              {this.props.permission.add ? (
                <Col span={2}>
                  <Button icon={<FileAddOutlined />} className='addButton' onClick={() => this.setHandler('create')}>
                    新增
                  </Button>
                </Col>
              ) : null}
              <Col span={2}>
                <Button onClick={() => this.TheLogRefHandler()} icon={<SearchOutlined />} className='search-button'>
                  日志
                </Button>
              </Col>
            </Row>
          </InputGroup>
        </Form>
        <div>
          <EditItem ref={(EditItemRef) => (this.EditItemRef = EditItemRef)} editItemDone={this.editItemDone} modalfoot={this.props.modalfoot} />
          <TheLog ref={(TheLogRef) => (this.TheLogRef = TheLogRef)} editItemDone={this.editItemDone} modalfoot={this.props.modalfoot} />
        </div>
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
      </div>
    );
  }
}
export default BtnPermission(OperationLog);
