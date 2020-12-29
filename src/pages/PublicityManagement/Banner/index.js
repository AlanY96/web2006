/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:02:12
 * @description: Banner管理
 */
import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select, Tooltip, Image } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { bannerApi } from '@/services/basic';

import EditItem from './EditItem';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;
const Option = Select.Option;
const over = {
  maxWidth: '280px',
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
};
class Banner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
      records: [], //records对应列表上的每条数据
      handlers: {
        create: 'create',
        view: 'view',
        update: 'update',
        setDl: 'setDl',
        setIndex: 'setIndex',
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
    bannerApi.delete(id).then((res) => {
      this.queryData();
    });
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    bannerApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  render() {
    const { create, update } = this.state.handlers;
    const columns = [
      { title: '名称', dataIndex: 'mc' },
      { title: '说明', dataIndex: 'sm' },
      {
        title: '图片地址',
        dataIndex: 'url',
        render(h) {
          return (
            <Tooltip placement='topLeft' title={h}>
              <Image width={50} src={h} />
            </Tooltip>
          );
        },
      },
      {
        title: '跳转地址',
        dataIndex: 'tzdz',
        render(h) {
          return (
            <Tooltip placement='topLeft' title={h}>
              <div style={over}>{h}</div>
            </Tooltip>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'lx',
        render(h) {
          return {
            2: 'banner',
            3: '广告',
            4: '睡眠专科',
            5: '膝关节专科',
            6: '医美专科',
            7: '痛风专科',
            null: '',
          }[h];
        },
      },
      { title: '序号', dataIndex: 'xh' },
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

    const { data, records } = this.state;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='名称' name='mc' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='类型' name='lx' initialValue=''>
                  <Select allowClear placeholder='请选择'>
                    <Option value=''>全部</Option>
                    <Option value={2}>banner</Option>
                    <Option value={3}>广告</Option>
                    <Option value={4}>睡眠专科</Option>
                    <Option value={5}>膝关节专科</Option>
                    <Option value={6}>医美专科</Option>
                    <Option value={7}>痛风专科</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='状态' name='zt' rules={[]} initialValue={1}>
                  <Select allowClear placeholder='请选择'>
                    <Option value={0}>无效</Option>
                    <Option value={1}>有效</Option>
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
                  <Button icon={<FileAddOutlined />} className='addButton' onClick={() => this.setHandler(create)}>
                    新增
                  </Button>
                </Col>
              ) : null}
            </Row>
          </InputGroup>
        </Form>
        <div>
          <EditItem ref={(EditItemRef) => (this.EditItemRef = EditItemRef)} editItemDone={this.editItemDone} modalfoot={this.props.modalfoot} />
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
export default BtnPermission(Banner);
