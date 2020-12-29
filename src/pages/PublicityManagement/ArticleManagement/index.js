/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:05:29
 * @description: 文章管理
 */
import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, LaptopOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select, DatePicker, message, Tooltip } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { articlemanagementApi } from '@/services/basic';
import moment from 'moment';

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
class ArticleManagement extends Component {
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
      wzbq: [],
    };
  }

  releaseBtn = (id) => {
    articlemanagementApi.putfbzt(id, 1).then((res) => {
      message.success('操作成功');
      this.queryData();
    });
  };
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

  //删除一条数据后刷新列表
  deleteItem = (id) => {
    articlemanagementApi.delete(id).then((res) => {
      this.queryData();
    });
  };

  //增查改、设置操作类型，并传入对应行数据
  setHandler = (handler, record) => {
    this.EditItemRef.showModal(handler, record);
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    formData.cjsj = formData.cjsj ? moment(formData.cjsj).format('YYYY-MM-DD') : undefined;
    articlemanagementApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  render() {
    const { create, update } = this.state.handlers;
    const columns = [
      {
        title: '文章标题',
        dataIndex: 'wzbt',
        render(h) {
          return (
            <Tooltip placement='topLeft' title={h}>
              <div style={over}>{h}</div>
            </Tooltip>
          );
        },
      },
      {
        title: '文章副标题',
        dataIndex: 'wzfbt',
        render(h) {
          return (
            <Tooltip placement='topLeft' title={h}>
              <div style={over}>{h}</div>
            </Tooltip>
          );
        },
      },
      // { title: "文章标签", dataIndex: "wzbqmc" },
      {
        title: '文章类型',
        dataIndex: 'wzlx',
        render(h) {
          return h === 1 ? '文章' : '园内新闻';
        },
      },
      { title: '阅读数', dataIndex: 'yds' },
      { title: '作者', dataIndex: 'yhxm' },
      {
        title: '发布状态',
        dataIndex: 'fbzt',
        render(h) {
          return h === 1 ? '发布' : '未发布';
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
            {this.props.permission.edit && record.fbzt === 0 ? (
              <Popconfirm title='确认发布?' onConfirm={() => this.releaseBtn(record.id)} className='update-button'>
                <LaptopOutlined title='发布' className='delete-button' />
              </Popconfirm>
            ) : null}
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

    const { data, records, wzbq } = this.state;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='操作时间' name='cjsj'>
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='文章标题' name='wzbt' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='文章类型' name='wzlx'>
                  <Select allowClear placeholder='请选择'>
                    <Option value={1}>文章</Option>
                    <Option value={0}>园内新闻</Option>
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
            <Row gutter={24} className='showMore'>
              <Col span={6}>
                <Form.Item label='发布状态' name='fbzt'>
                  <Select allowClear placeholder='请选择'>
                    <Option value={1}>发布</Option>
                    <Option value={0}>未发布</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </InputGroup>
        </Form>
        <div>
          <EditItem
            ref={(EditItemRef) => (this.EditItemRef = EditItemRef)}
            editItemDone={this.editItemDone}
            bookRender={this.props.bookRender}
            wzbq={wzbq}
            modalfoot={this.props.modalfoot}
          />
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
export default BtnPermission(ArticleManagement);
