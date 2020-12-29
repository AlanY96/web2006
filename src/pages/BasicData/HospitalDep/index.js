/*
 * @Description: 医院科室页面
 * @Author: 谢涛
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-22 19:13:58
 * @LastEditTime: 2020-11-27 10:53:56
 */

import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { departmentsApi, institutionsApi } from '@/services/basic';
import EditItem from './EditItem';
import '@/layouts/queryList.css';

const InputGroup = Input.Group;
const Option = Select.Option;

class HospitalDep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data就是最顶层的数据 它包含records records是每条列表数据的集合 data还包含了其他信息 譬如总页数 当前页等等
      records: [],
      institution: [],
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
  deleteItem = (ksid) => {
    departmentsApi.delete(ksid).then((res) => {
      this.queryData();
    });
  };

  //查找框查找数据
  queryData = (pagination = undefined) => {
    let formData = this.form.getFieldsValue();
    departmentsApi.getPage({ formData: { ...formData, zt: '1' }, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  onInstitutionFocus = (value, option) => {
    institutionsApi.search({}).then((res) => {
      let institution = res.records.map((item) => (
        <Option key={item.yymc} value={item.yybm}>
          {item.yymc}
        </Option>
      ));
      this.setState({
        institution: institution,
      });
    });
  };

  render() {
    const { create, update } = this.state.handlers;

    const columns = [
      { title: '医疗机构', dataIndex: 'yymc' },
      {
        title: '科室名称',
        dataIndex: 'ksmc',
        render: (text, record) => {
          return record.ksmc;
        },
      },
      {
        title: '科室位置',
        dataIndex: 'kswz',
        render: (text, record) => {
          return record.kswz;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span className='handleButton'>
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

    let { data, records } = this.state;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='科室名称' name='ksmc' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
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
        <EditItem ref={(EditItemRef) => (this.EditItemRef = EditItemRef)} editItemDone={this.editItemDone} bookRender={this.props.bookRender} modalfoot={this.props.modalfoot} />
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
export default BtnPermission(HospitalDep, {
  dataBook: {
    22: 'kslx', // 科室类型
    74: 'ggks', // 公共科室
  },
});
