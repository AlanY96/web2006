/**
 * @author: YINJUN
 * @Date: 2020-10-20 10:37:05
 * @description: 排班
 */
import React, { Component } from 'react';
import { SearchOutlined, FormOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button } from 'antd';
import EditItem from './EditItem';
import MyTable from '@/components/MyTable';
import { workforcemanagementApi } from '@/services/basic';
import BtnPermission from '@/components/BtnPermission';
import '@/layouts/queryList.css';
const InputGroup = Input.Group;

class WorkforceManagement extends Component {
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

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    let pam = {};
    for (let i in formData) {
      if (formData[i]) {
        pam[i] = formData[i];
      }
    }
    workforcemanagementApi.getPage({ formData, pagination }).then((res) => {
      this.setState({
        data: res,
        records: res.records,
      });
    });
  };

  render() {
    const { update } = this.state.handlers;

    const columns = [
      { title: '医疗机构', dataIndex: 'yymc' },
      { title: '医生姓名', dataIndex: 'yhxm' },
      { title: '所在科室', dataIndex: 'ksmc' },
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
                <Form.Item label='医生姓名' name='yhxm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
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
          <EditItem
            ref={(Editor) => (this.Editor = Editor)}
            editItemDone={this.editItemDone}
            bookRender={this.props.bookRender}
            modalfoot={this.props.modalfoot}
          />
        </div>
      </div>
    );
  }
}
export default BtnPermission(WorkforceManagement);
