/**
 * @author: YINJUN
 * @Date: 2020-10-19 15:07:24
 * @description: 管理员列表
 */
import React, { Component } from 'react';
import { DeleteOutlined, FileAddOutlined, FormOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Popconfirm, Select } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { userApi, institutionsApi } from '@/services/basic';
import EditItem from './EditItem';
import '@/layouts/queryList.css';

const InputGroup = Input.Group;
const Option = Select.Option;

class AdminList extends Component {
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
    userApi.getPage({ formData: { ...formData, yhbs: 3 }, pagination }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
  };

  changeColumn = (value, dataIndex, index, checked) => {
    const columns = this.state.columns.slice(0);
    for (let item in columns) {
      if (columns[item].title === value && !checked) {
        //由选中变成取消选中
        columns.splice(item, 1);
      } else if (checked) {
        //由需取消选中变成选中
        columns.splice(index, 0, {
          title: `${value}`,
          dataIndex: `${dataIndex}`,
        });
        break;
      }
    }
    this.setState({ columns });
  };

  //医疗机构下拉框获取焦点时触发
  onInstitutionFocus = () => {
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
      { title: '用户编号', dataIndex: 'yhbh' },
      { title: '用户姓名', dataIndex: 'yhxm' },
      { title: '用户性别', dataIndex: 'yhxb' },
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
                <Form.Item label='用户姓名' name='yhxm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
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
            <Row gutter={24} className='showMore'>
              <Col span={6}>
                <Form.Item label='状态' name='zt' initialValue={'1'}>
                  <Select allowClear placeholder='请选择状态'>
                    <Select.Option value='0'>停用</Select.Option>
                    <Select.Option value='1'>启用</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
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
export default BtnPermission(AdminList);
