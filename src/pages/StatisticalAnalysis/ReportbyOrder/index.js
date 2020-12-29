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
import TableExport from '@/services/TableExport';
import { price } from '@/services/publicMethods';
import ReactDOM from 'react-dom';
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
class ReportbyOrder extends Component {
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
      this.setState({ records: [], loading: true, charts: false, option: {} }, () => {
        FinancialmanagementApi.order({
          kssj: moment(formData.sjd[0]).format('YYYYMMDD'),
          jssj: moment(formData.sjd[1]).format('YYYYMMDD'),
          yybm,
        }).then((res) => {
          if (res && res.length > 0) {
            const records = res.map((it) => {
              let ite = {};
              let zc = {};
              // wzfs 1.图文 2.电话 3.视频 缺少哪个补哪个
              for (let j = 1; j < 4; j++) {
                const wzfs = it.srList.find((i) => i.wzfs === j);
                if (!wzfs) {
                  it.srList = [].concat(it.srList).concat({ wzfs: j });
                }
              }
              // 组成table所需数据
              it.srList.forEach((i) => {
                zc = {
                  ...zc,
                  [`wzzje${i.wzfs}`]: i.wzzje || 0,
                  [`cfzje${i.wzfs}`]: i.cfzje || 0,
                  [`zje${i.wzfs}`]: (i.wzzje || 0) + (i.cfzje || 0),
                };
              });
              ite = {
                rq: it.rq,
                ...zc,
              };
              return ite;
            });
            // 组成报表所需数据
            let series = [1, 2, 3].map((j) => {
              const wzfs = res.map((it) => {
                const num = it.srList.filter((i) => i.wzfs === j)[0];
                return price((num.wzzje || 0) + (num.cfzje || 0));
              });
              return { data: wzfs, type: 'line', name: ['图文问诊', '语音问诊', '视频问诊'][j - 1] };
            });
            const option = {
              title: {
                text: '互联网问诊统计表',
              },
              tooltip: {
                trigger: 'axis',
              },
              legend: {
                data: ['图文问诊', '语音问诊', '视频问诊'],
              },
              grid: {
                left: '2%',
                right: '2%',
                bottom: '3%',
                containLabel: true,
              },
              xAxis: {
                type: 'category',
                data: res.map((i) => `${i.rq}`),
              },
              yAxis: {
                type: 'value',
              },
              series: series,
            };
            this.setState({ records, option, loading: false, charts: true });
          } else {
            this.setState({ loading: false });
          }
        });
      });
    });
  };

  render() {
    const columns = [
      { title: '日期', dataIndex: 'rq' },
      {
        title: '图文问诊',
        dataIndex: 'twwz',
        children: [
          {
            title: '挂号',
            dataIndex: 'wzzje1',
            render(h) {
              return price(h);
            },
          },
          {
            title: '处方',
            dataIndex: 'cfzje1',
            render(h) {
              return price(h);
            },
          },
          {
            title: '合计',
            dataIndex: 'zje1',
            render(h) {
              return price(h);
            },
          },
        ],
      },
      {
        title: '电话问诊',
        dataIndex: 'dhwz',
        children: [
          {
            title: '挂号',
            dataIndex: 'wzzje2',
            render(h) {
              return price(h);
            },
          },
          {
            title: '处方',
            dataIndex: 'cfzje2',
            render(h) {
              return price(h);
            },
          },
          {
            title: '合计',
            dataIndex: 'zje2',
            render(h) {
              return price(h);
            },
          },
        ],
      },
      {
        title: '视频问诊',
        dataIndex: 'spwz',
        children: [
          {
            title: '挂号',
            dataIndex: 'wzzje3',
            render(h) {
              return price(h);
            },
          },
          {
            title: '处方',
            dataIndex: 'cfzje3',
            render(h) {
              return price(h);
            },
          },
          {
            title: '合计',
            dataIndex: 'zje3',
            render(h) {
              return price(h);
            },
          },
        ],
      },
      {
        title: '合计',
        dataIndex: 'hj',
        children: [
          {
            title: '挂号',
            dataIndex: 'hjwzzje',
            render(h, r) {
              return price(r.wzzje1 + r.wzzje2 + r.wzzje3);
            },
          },
          {
            title: '处方',
            dataIndex: 'hjcfzje',
            render(h, r) {
              return price(r.cfzje1 + r.cfzje2 + r.cfzje3);
            },
          },
          {
            title: '合计',
            dataIndex: 'hjzje',
            render(h, r) {
              return price(r.zje1 + r.zje2 + r.zje3);
            },
          },
        ],
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
              <Col span={2}>
                <TableExport DCdata={records} name='isme' filename='互联网问诊统计表'></TableExport>
              </Col>
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
              return <div style={{ textAlign: 'center', fontSize: '28px' }}>互联网问诊统计表</div>;
            }}
          />
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
export default BtnPermission(ReportbyOrder);
