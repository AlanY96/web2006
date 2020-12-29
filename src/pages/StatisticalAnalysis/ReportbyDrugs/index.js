/**
 * @author: YINJUN
 * @Date: 2020-10-16 16:02:12
 * @description: 问诊订单统计收入
 */
import React, { Component } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import { Form, Col, Row, Input, Button, Table, DatePicker } from 'antd';
import BtnPermission from '@/components/BtnPermission';
import { FinancialmanagementApi } from '@/services/basic';
import moment from 'moment';
import '@/layouts/queryList.css';
import ReactEcharts from 'echarts-for-react';
// import TableExport from '@/services/TableExport';
import ReactDOM from 'react-dom';
import { price } from '@/services/publicMethods';
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
class ReportbyDrugs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], //data包含了总页数、当前页、页面显示条数等
      records: [], //records对应列表上的每条数据
      userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
      option: {},
      loading: false,
      charts: false,
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
  //查找框查找数据
  queryData = () => {
    this.form.validateFields().then((values) => {
      const { yybm } = this.state.userInfo;
      let formData = this.form.getFieldsValue();
      const param = {
        kssj: moment(formData.sjd[0]).format('YYYYMMDD'),
        jssj: moment(formData.sjd[1]).format('YYYYMMDD'),
        yybm,
      };
      this.setState({ records: [], loading: true, charts: false, option: {} }, () => {
        FinancialmanagementApi.drugs(param).then((res) => {
          let option = {
            xAxis: {
              type: 'category',
              data: res.map((it) => it.ypmc),
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: res.map((it) => it.ypsl || 0),
                type: 'bar',
              },
            ],
          };
          this.setState({
            records: res,
            option,
            loading: false,
            charts: true,
          });
        });
      });
    });
  };

  render() {
    const columns = [
      { title: '药品名称', dataIndex: 'ypmc' },
      { title: '药品规格', dataIndex: 'ypgg' },
      { title: '药品数量', dataIndex: 'ypsl' },
      { title: '药品单位', dataIndex: 'dw' },
      {
        title: '总金额',
        dataIndex: 'zje',
        render(h, r) {
          return price(h || 0);
        },
      },
    ];
    const { records, option, charts, loading } = this.state;
    return (
      <div className='queryList'>
        <Form autoComplete='off' ref={(form) => (this.form = form)} layout='inline'>
          <InputGroup className='input-group'>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item
                  label='时间'
                  name='sjd'
                  rules={[{ required: true, message: '此为必填项' }]}
                  initialValue={[moment().subtract(6, 'days'), moment()]}
                >
                  <RangePicker />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Button onClick={(e) => this.queryData(e)} icon={<SearchOutlined />} className='search-button'>
                  查询
                </Button>
              </Col>
              {/* <Col span={2}>
                <TableExport DCdata={records} name='isme' filename='网上开方药品统计报表'></TableExport>
              </Col> */}
            </Row>
          </InputGroup>
        </Form>
        <div style={{ padding: '10px' }}>
          <Table
            rowKey={(r, i) => i}
            columns={columns}
            pagination={false}
            bordered
            dataSource={records}
            loading={loading}
            title={() => {
              return (
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '28px',
                  }}
                >
                  网上开方药品统计表
                </div>
              );
            }}
          ></Table>
        </div>
        {charts ? (
          <div>
            <ReactEcharts option={option} notMerge={true} lazyUpdate={true} theme={'theme_name'} onChartReady={this.onChartReadyCallback} />
          </div>
        ) : null}
      </div>
    );
  }
}
export default BtnPermission(ReportbyDrugs);
