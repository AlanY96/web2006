/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:04:17
 * @description: 日志
 */
import React, { Component } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Select, Tag, DatePicker } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { operationlogApi } from '@/services/basic';
import moment from 'moment';

import EditItem from './EditItem';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;
const Option = Select.Option;

class OperationLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
      records: [], //records对应列表上的每条数据
      handlers: {
        view: 'view',
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

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();

    formData.beginTime = formData.beginTime ? moment(formData.beginTime).format('YYYY-MM-DD') : undefined;
    operationlogApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  render() {
    const columns = [
      { title: '操作时间', dataIndex: 'beginTime' },
      { title: '用户姓名', dataIndex: 'yhxm' },
      { title: '请求ip', dataIndex: 'ip' },
      {
        title: '操作平台',
        dataIndex: 'czpt',
        render(h) {
          return { 1: 'PC平台', 2: '小程序', 9: '其他平台' }[h];
        },
      },
      { title: '操作模块', dataIndex: 'mk' },
      {
        title: '成功标志',
        dataIndex: 'cgbz',
        render(h) {
          return h === 1 ? <Tag color='success'>成功</Tag> : <Tag color='error'>失败</Tag>;
        },
      },
    ];

    const { data, records } = this.state;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='操作时间' name='beginTime'>
                  <DatePicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='用户姓名' name='yhxm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='操作平台' name='czpt' initialValue={1}>
                  <Select allowClear placeholder='请选择'>
                    <Option value={9}>其他平台</Option>
                    <Option value={2}>小程序</Option>
                    <Option value={1}>PC平台</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={(e) => this.queryData(e)} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
            </Row>
            <Row gutter={24} className='showMore'>
              <Col span={6}>
                <Form.Item label='操作模块' name='mk' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='成功标志' name='cgbz' initialValue=''>
                  <Select allowClear placeholder='请选择'>
                    <Option value={0}>失败</Option>
                    <Option value={1}>成功</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </InputGroup>
        </Form>
        <div>
          <EditItem ref={(EditItemRef) => (this.EditItemRef = EditItemRef)} editItemDone={this.editItemDone} />
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
