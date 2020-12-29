/*
 * @Description: 医疗机构页面
 * @Author: 谢涛
 * @Date: 2019-05-13 11:18:23
 * @LastEditTime: 2020-12-15 14:03:50
 * @LastEditors: Please set LastEditors
 */

import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Select, Popconfirm } from 'antd';
import BtnPermission from '@/components/BtnPermission';
import MyTable from '@/components/MyTable';
import { institutionsApi } from '@/services/basic';
import EditItem from './EditItem';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;
const Option = Select.Option;

class Institution extends Component {
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
    institutionsApi.delete(id).then((res) => {
      this.queryData();
    });
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    institutionsApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  //医疗机构输入时触发
  onInstitutionSearch = (value) => {
    if (value.charCodeAt(value.length - 1) === 32) {
      value = value.trim();
      institutionsApi.search({ search: `${value}` }).then((res) => {
        let institution = res.records.map((item) => (
          <Option key={item.yybm} value={item.yybm}>
            {item.yymc}
          </Option>
        ));
        this.setState({
          institution: institution,
        });
      });
    }
  };

  onZtChange = (value) => {
    this.setState({
      zt: value,
    });
  };

  render() {
    const columns = [
      { title: '医院编码', dataIndex: 'yybm' },
      { title: '医院名称', dataIndex: 'yymc' },
      { title: '医疗机构级别', dataIndex: 'yyjbmc' },
      {
        title: '操作',
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

    const { data, records } = this.state;

    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={7}>
                <Form.Item label='医院名称' name='yybm'>
                  <Select
                    allowClear
                    onSearch={this.onInstitutionSearch}
                    placeholder='输入关键字按空格查找'
                    filterOption={false}
                    showSearch={true}
                    notFoundContent={null}
                    showArrow={false}
                  >
                    {this.state.institution}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='医疗机构级别' name='yyjb'>
                  <Select allowClear placeholder='请选择级别'>
                    {this.props.bookRender('dqjb')}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='状态' name='zt' initialValue='1'>
                  <Select allowClear onChange={this.onZtChange}>
                    <Option value=''>全部</Option>
                    <Option value='1'>有效</Option>
                    <Option value='0'>禁用</Option>
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
        <EditItem
          ref={(EditItemRef) => (this.EditItemRef = EditItemRef)}
          editItemDone={this.editItemDone}
          bookRender={this.props.bookRender}
          modalfoot={this.props.modalfoot}
        />
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
export default BtnPermission(Institution, {
  dataBook: {
    7: 'yydj', // 医院等级
    8: 'dqjb', // 地区级别
  },
});
