/**
 * @author: YINJUN
 * @Date: 2020-10-19 15:07:24
 * @description: 问诊订单
 */
import React, { Component } from 'react';
import { HourglassOutlined, SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Select, Tag } from 'antd';
import MyTable from '@/components/MyTable';
import BtnPermission from '@/components/BtnPermission';
import { ConsultationorderApi, institutionsApi } from '@/services/basic';
import '@/layouts/queryList.css';
import EditItem from './EditItem';
import TableExport from '@/services/TableExport';
import ReactDOM from 'react-dom';

const InputGroup = Input.Group;
const Option = Select.Option;

class ConsultationOrder extends Component {
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
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      exprotData: [],
    };
  }

  //组件挂载后为列表请求数据
  componentDidMount = () => {
    this.queryData();
    this.exportTable();
  };

  exportTable() {
    const tableCon = ReactDOM.findDOMNode(this);
    const table = tableCon.querySelector('table'); // 获取table
    table.setAttribute('id', 'isme'); //给该table设置属性
  }
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
    ConsultationorderApi.getPage({
      formData: { ...formData },
      pagination,
    }).then((res) => {
      this.setState({ data: res, records: res.records });
    });
    ConsultationorderApi.getPagedc({
      formData: { ...formData },
      pagination,
    }).then((res) => {
      this.setState({ exprotData: res });
    });
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
  // 下单时间，接诊时间，就诊人，接诊医生，问诊方式，是否用药，是否已结束，结束时间
  render() {
    const { update } = this.state.handlers;

    const columns = [
      { title: '下单时间', dataIndex: 'cjsj', width: '145px' },
      { title: '接诊时间', dataIndex: 'jzsj', width: '145px' },
      {
        title: '就诊人',
        dataIndex: 'yhsfz',
        render(h, r) {
          return r.jzr.xm;
        },
      },
      { title: '接诊医生', dataIndex: 'wzysxm' },
      {
        title: '问诊方式',
        align: 'center',
        dataIndex: 'wzfs',
        render(h) {
          return {
            1: <Tag color='error'>图文</Tag>,
            2: <Tag color='blue'>电话</Tag>,
            3: <Tag color='warning'>视频</Tag>,
          }[h];
        },
      },
      {
        title: '是否用药',
        align: 'center',
        dataIndex: 'sfkf',
        render(h) {
          return h === 1 ? <Tag color='success'>是</Tag> : <Tag color='error'>否</Tag>;
        },
      },
      {
        title: '是否已结束',
        align: 'center',
        dataIndex: 'jssj',
        render(h) {
          return h ? <Tag color='success'>是</Tag> : <Tag color='error'>否</Tag>;
        },
      },
      { title: '结束时间', dataIndex: 'jssj', width: '145px' },
      {
        title: '是否已质检',
        align: 'center',
        dataIndex: 'sfyzj',
        render(h) {
          return h ? '是' : '否';
          // return h ? <Tag color='success'>是</Tag> : <Tag color='error'>否</Tag>;
        },
      },
      {
        title: '问诊单状态',
        align: 'center',
        dataIndex: 'wzdztmc',
        render(h, r) {
          return <div style={{ color: r.ys }}>{h}</div>;
        },
      },
      {
        title: '问诊类型',
        align: 'center',
        dataIndex: 'sfqwz',
        render(h) {
          return h === 1 ? '轻问诊' : '严肃问诊';
          // return h === 1 ? <Tag color='success'>是</Tag> : <Tag color='error'>否</Tag>;
        },
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
          <span className='handleButton'>
            {/* 以下分别对应：改、删、等操作 */}
            {this.props.permission.edit && !record.sfyzj ? (
              <HourglassOutlined title='修改' onClick={() => this.setHandler(update, record)} className='update-button' />
            ) : null}
          </span>
        ),
      },
    ];

    const { data, records, exprotData } = this.state;

    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={6}>
                <Form.Item label='问诊方式' name='wzfs' initialValue=''>
                  <Select allowClear placeholder='请选择'>
                    <Option value={1}>图文</Option>
                    <Option value={2}>电话</Option>
                    <Option value={3}>视频</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='问诊单状态' name='wzdzt' initialValue=''>
                  <Select allowClear placeholder='请选择'>
                    <Option value={0}>待支付</Option>
                    <Option value={1}>待接诊</Option>
                    <Option value={2}>已接诊</Option>
                    <Option value={3}>已退回(医生)</Option>
                    <Option value={4}>已取消(患者)</Option>
                    <Option value={5}>已完成</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='医生姓名' name='yhxm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={this.queryData} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
              <Col span={2}>
                <TableExport DCdata={exprotData} name='isme' filename='问诊订单'></TableExport>
              </Col>
            </Row>
            <Row gutter={24} className='showMore'>
              <Col span={6}>
                <Form.Item label='就诊人' name='jzrxm' getValueFromEvent={(event) => event.target.value.replace(/\s+/g, '')}>
                  <Input allowClear placeholder='请输入就诊人姓名' />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='是否已质检' name='sfyzj' initialValue=''>
                  <Select allowClear placeholder='请选择'>
                    <Option value={1}>已质检</Option>
                    <Option value={0}>未质检</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label='问诊类型' name='sfqwz' initialValue=''>
                  <Select allowClear placeholder='请选择'>
                    <Option value={1}>轻问诊</Option>
                    <Option value={0}>严肃问诊</Option>
                    <Option value=''>全部</Option>
                  </Select>
                </Form.Item>
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
          <EditItem ref={(EditItemRef) => (this.EditItemRef = EditItemRef)} editItemDone={this.editItemDone} modalfoot={this.props.modalfoot} />
        </div>
      </div>
    );
  }
}
export default BtnPermission(ConsultationOrder);
