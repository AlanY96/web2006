/*
 * @Description: 用户列表页面
 * @Author: 谢涛
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-24 18:18:05
 * @LastEditTime: 2020-12-10 11:15:36
 */

import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { userApi } from '@/services/basic';
import EditItem from './EditItem';
import Excel from './EditItem/excel';
import '@/layouts/queryList.css';
import axios from '@/axios';

const InputGroup = Input.Group;
const Option = Select.Option;

class UsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      institution: [],
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
    userApi.delete(id).then((res) => {
      this.queryData();
    });
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    userApi.getPage({ formData: { ...formData }, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  //增查改、设置操作类型，并传入对应行数据
  setUpload = () => {
    this.Excel.showModal();
  };

  render() {
    const { create, update } = this.state.handlers;
    const columns = [
      { title: '用户编号', dataIndex: 'yhbh' },
      { title: '用户姓名', dataIndex: 'yhxm' },
      { title: '用户性别', dataIndex: 'yhxb', align: 'center' },
      { title: '用户身份证', dataIndex: 'yhsfz' },
      { title: '联系电话', dataIndex: 'lxdh' },
      { title: '状态', dataIndex: 'ztmc' },
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
            ) : (
              ''
            )}
          </span>
        ),
      },
    ];

    const { data, records } = this.state;

    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='用户编号' name='yhbh' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='用户身份证' name='yhsfz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='状态' name='zt' initialValue={'1'}>
                  <Select allowClear placeholder='请选择状态'>
                    <Select.Option value='0'>停用</Select.Option>
                    <Select.Option value='1'>启用</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={this.queryData} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
              {this.props.permission.add ? (
                <>
                  <Col span={2}>
                    <Button icon={<FileAddOutlined />} className='addButton' onClick={() => this.setHandler(create)}>
                      新增
                    </Button>
                  </Col>
                </>
              ) : null}
            </Row>
            <Row gutter={24} className='showMore'>
              <Col span={6}>
                <Form.Item label='用户姓名' name='yhxm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='用户标识' name='yhbs' initialValue=''>
                  <Select placeholder='输选择' allowClear>
                    <Option value=''>全部</Option>
                    <Option value={1}>医生</Option>
                    <Option value={2}>药师</Option>
                  </Select>
                </Form.Item>
              </Col>

              {this.props.permission.add ? (
                <>
                  <Col span={6}></Col>
                  <Col span={2}>
                    <Button className='search-button'>
                      <a href={`${axios.defaults.baseURL}user/ys_excel`} download>
                        下载模板
                      </a>
                    </Button>
                  </Col>
                  <Col span={2}>
                    <Button className='addButton' onClick={() => this.setUpload(create)}>
                      导入模板
                    </Button>
                  </Col>
                </>
              ) : null}
            </Row>
          </InputGroup>
        </Form>
        <EditItem
          ref={(EditItemRef) => (this.EditItemRef = EditItemRef)}
          editItemDone={this.editItemDone}
          bookRender={this.props.bookRender}
          modalfoot={this.props.modalfoot}
        />
        <Excel ref={(Excel) => (this.Excel = Excel)} editItemDone={this.editItemDone}></Excel>
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
export default BtnPermission(UsersList, {
  dataBook: {
    33: 'zc', // 职称
    141: 'ssyt', // 所属业态
  },
});
