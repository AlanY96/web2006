/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:02:12
 * @description: 药品管理
 */
import React, { Component } from 'react';
import { SearchOutlined, FormOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Tag } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { drugmanagementApi } from '@/services/basic';

import EditItem from './EditItem';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;

class DrugManagement extends Component {
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

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    drugmanagementApi.getPage({ formData, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  render() {
    const { update } = this.state.handlers;
    const columns = [
      {
        title: '名称/规格',
        dataIndex: 'yptym',
        render(h, record) {
          return `${h}/${record.gg}`;
        },
      },
      { title: '药品编码', dataIndex: 'bm' },
      // { title: '类别', dataIndex: 'lb' },
      { title: '产地', dataIndex: 'cd' },
      { title: '包装单位', dataIndex: 'bzdw' },
      {
        title: '启用标志',
        align: 'center',
        dataIndex: 'qybz',
        render(h) {
          return h === '1' ? <Tag color='success'>启用</Tag> : <Tag color='error'>停用</Tag>;
        },
      },
      {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <span className='handleButton'>
            {this.props.permission.edit ? (
              <FormOutlined title='修改' onClick={() => this.setHandler(update, record)} className='update-button' />
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
              <Col span={8}>
                <Form.Item label='药品名称/药品编码' name='mhcxz' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={(e) => this.queryData(e)} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
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
export default BtnPermission(DrugManagement);
