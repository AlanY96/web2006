/**
 * @author: YINJUN
 * @Date: 2020-11-06 16:25:02
 * @description: 药师审方列表
 */
import React, { Component } from 'react';
import { FormOutlined, SearchOutlined, RocketOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Select, Tag } from 'antd';

import EditItem from './EditItem';
import MyTable from '@/components/MyTable';
import { prescriptionreviewApi } from '@/services/basic';
import BtnPermission from '@/components/BtnPermission';
import '@/layouts/queryList.css';

const InputGroup = Input.Group;
const Option = Select.Option;

class PrescriptionReview extends Component {
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
  // 发药
  // updateFyzt = (record) => {
  //   const { id } = record;
  //   prescriptionreviewApi.updateFyzt({ cfid: id, cfzt: 5 }).then((res) => {
  //     this.queryData();
  //   });
  // };

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
    prescriptionreviewApi.getPage({ formData, pagination }).then((res) => {
      this.setState({
        data: res,
        records: res.records,
      });
    });
  };

  render() {
    const { update } = this.state.handlers;

    const columns = [
      { title: '处方单号', dataIndex: 'cfdh' },
      { title: '开方时间', dataIndex: 'kfsj' },
      { title: '科室名称', dataIndex: 'ksmc' },
      { title: '医生姓名', dataIndex: 'ysxm' },
      { title: '患者姓名', dataIndex: 'hzxm' },
      { title: '处方金额', dataIndex: 'cfjeY' },
      {
        title: '处方状态',
        dataIndex: 'cfzt',
        render(h, r) {
          return {
            1: <Tag color='error'>{r.cfztmc}</Tag>,
            2: <Tag color='blue'>{r.cfztmc}</Tag>,
            3: <Tag color='blue'>{r.cfztmc}</Tag>,
            4: <Tag color='blue'>{r.cfztmc}</Tag>,
            5: <Tag color='blue'>{r.cfztmc}</Tag>,
            6: <Tag color='blue'>{r.cfztmc}</Tag>,
            null: '',
          }[h];
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
            {this.props.permission.edit && record.cfzt === 1 ? (
              <FormOutlined title='修改' onClick={() => this.setHandler(update, record)} className='update-button' />
            ) : null}
            {this.props.permission.edit && record.cfzt === 4 ? (
              <RocketOutlined title='修改' onClick={() => this.setHandler(update, record)} className='update-button' />
            ) : null}
            {/* {this.props.permission.edit && record.cfzt === 4 ? (
              <RocketOutlined title='修改' onClick={() => this.updateFyzt(record)} className='update-button' />
            ) : null} */}
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
              <Col span={8}>
                <Form.Item label='处方状态' name='cfzt' initialValue={1}>
                  <Select allowClear placeholder='请选择'>
                    <Option value={null}>全部</Option>
                    <Option value={1}>待审核</Option>
                    <Option value={2}>审核不通过</Option>
                    <Option value={3}>待支付</Option>
                    <Option value={4}>待发药</Option>
                    <Option value={5}>已发药</Option>
                    <Option value={6}>已收药</Option>
                  </Select>
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
export default BtnPermission(PrescriptionReview);
